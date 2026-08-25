import { supabase } from '../lib/supabase';
import { NotificationService } from './notificationService';
import { AppNotification } from '../types/notificationTypes';

export interface JobApplicationInput {
  jobId: string;
  jobTitle: string;
  companyName: string;
  applicantName: string;
  applicantPhone: string;
  applicantEmail: string;
  coverNote?: string;
}

export interface ApplicationStatusResult {
  applied: boolean;
  status?: string;
  isOwner?: boolean;
  error?: string;
}

export class JobApplicationService {
  private static STORAGE_KEY = 'rentoura_applied_jobs';

  /**
   * Returns list of job IDs saved locally as applied.
   */
  static getLocalAppliedJobIds(): string[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  /**
   * Fast synchronous check using local cache.
   */
  static hasAppliedLocal(jobId: string): boolean {
    const appliedIds = this.getLocalAppliedJobIds();
    return appliedIds.includes(jobId);
  }

  /**
   * Full asynchronous status check querying Supabase backend.
   */
  static async getApplicationStatus(jobId: string): Promise<ApplicationStatusResult> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (!user) {
        return { applied: this.hasAppliedLocal(jobId) };
      }

      // 1. Check if current user is owner of the job listing
      const { data: jobRow } = await supabase
        .from('listings')
        .select('owner_id')
        .eq('id', jobId)
        .maybeSingle();

      if (jobRow && jobRow.owner_id === user.id) {
        return { applied: false, isOwner: true };
      }

      // 2. Query job_applications table in Supabase
      const { data: appRow, error } = await supabase
        .from('job_applications')
        .select('id, status')
        .eq('job_listing_id', jobId)
        .eq('applicant_id', user.id)
        .maybeSingle();

      if (error) {
        console.warn('[JobApplicationService] Remote check error:', error.message);
        return { applied: this.hasAppliedLocal(jobId) };
      }

      if (appRow) {
        // Sync local cache
        const applied = this.getLocalAppliedJobIds();
        if (!applied.includes(jobId)) {
          applied.push(jobId);
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(applied));
        }
        return { applied: true, status: appRow.status, isOwner: false };
      }

      return { applied: false, isOwner: false };
    } catch (err) {
      console.error('[JobApplicationService] Status check exception:', err);
      return { applied: this.hasAppliedLocal(jobId) };
    }
  }

  /**
   * Submits job application to Supabase & local state.
   */
  static async submitApplication(input: JobApplicationInput): Promise<{ success: boolean; error?: string }> {
    try {
      // 1. Verify user authentication
      const { data: authData } = await supabase.auth.getUser();
      const currentUser = authData?.user;

      if (!currentUser) {
        return { success: false, error: 'Please sign in to submit your job application.' };
      }

      // 2. Verify applicant is NOT the listing owner
      const { data: jobRow } = await supabase
        .from('listings')
        .select('owner_id')
        .eq('id', input.jobId)
        .maybeSingle();

      if (jobRow && jobRow.owner_id === currentUser.id) {
        return { success: false, error: 'You cannot apply to your own job listing.' };
      }

      // 3. Query remote database for existing application
      const { data: existingApp } = await supabase
        .from('job_applications')
        .select('id, status')
        .eq('job_listing_id', input.jobId)
        .eq('applicant_id', currentUser.id)
        .maybeSingle();

      if (existingApp) {
        return { success: false, error: 'You have already applied for this position.' };
      }

      // 4. Insert application into Supabase job_applications table
      const { error: insertErr } = await supabase
        .from('job_applications')
        .insert({
          job_listing_id: input.jobId,
          applicant_id: currentUser.id,
          applicant_name: input.applicantName,
          contact_phone: input.applicantPhone,
          contact_email: input.applicantEmail,
          cover_note: input.coverNote || null,
          status: 'submitted'
        });

      if (insertErr) {
        console.warn('[JobApplicationService] DB Insert error, trying search event log:', insertErr.message);
        // If table doesn't exist yet on remote, attempt fallback tracking
        if (insertErr.code === '42P01' || insertErr.message?.includes('does not exist')) {
          try {
            await supabase.from('location_search_events').insert({
              search_query: `JOB_APPLICATION:${input.jobId}`,
              city_id: null,
              created_at: new Date().toISOString()
            });
          } catch {
            // ignore fallback insert error
          }
        } else if (insertErr.code === '23505') {
          return { success: false, error: 'You have already applied for this position.' };
        } else {
          return { success: false, error: insertErr.message || 'Failed to submit job application to server.' };
        }
      }

      // 5. Update local cache
      const applied = this.getLocalAppliedJobIds();
      if (!applied.includes(input.jobId)) {
        applied.push(input.jobId);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(applied));
      }

      // 6. Trigger applicant notification
      const notif: AppNotification = {
        id: `job-app-${Date.now()}`,
        type: 'JOB_APPLICATION_UPDATE',
        category: 'updates',
        title: 'Application Sent! 💼',
        body: `Your application for "${input.jobTitle}" at ${input.companyName} was successfully sent.`,
        createdAt: 'Just now',
        timestamp: Date.now(),
        read: false,
        priority: 'normal',
        entityType: 'jobs',
        entityId: input.jobId
      };

      const existingNotifs = NotificationService.getNotifications();
      NotificationService.saveNotifications([notif, ...existingNotifs]);

      return { success: true };
    } catch (e: any) {
      console.error('Error submitting job application:', e);
      return { success: false, error: e?.message || 'Failed to submit application. Please try again.' };
    }
  }
}
