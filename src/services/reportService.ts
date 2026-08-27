import { supabase } from '../lib/supabase';
import { NotificationService } from './notificationService';
import { StaffAccount, StaffRole } from '../types/adminTypes';
import { AdminService } from './adminService';

export type ReportTargetType = 'listing' | 'review' | 'user' | 'conversation';
export type ReportTargetModule = 'rentals' | 'jobs' | 'services' | 'general';
export type ReportStatus = 'submitted' | 'under_review' | 'resolved' | 'dismissed';
export type ReportSource = 'listing_detail' | 'review_card' | 'safety_center' | 'help_center' | 'chat' | 'user_profile';

export interface InternalStaffNote {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  note: string;
  createdAt: string;
  timestamp: number;
}

export interface ReportHistoryItem {
  id: string;
  action: string;
  actorName: string;
  actorRole: string;
  details: string;
  createdAt: string;
  timestamp: number;
}

export interface ListingReport {
  id: string;
  reporterId: string;
  reporterName?: string;
  reporterEmail?: string;
  reporterAvatar?: string;
  reporterRole?: 'User' | 'Business' | 'Anonymous';
  
  targetType: ReportTargetType;
  targetId: string;
  targetModule: ReportTargetModule;
  targetTitle: string;
  targetLocation?: string;
  targetPrice?: string;
  targetImageUrl?: string;
  targetAuthorName?: string;
  targetAuthorId?: string;

  reasonCode: string;
  reasonLabel: string;
  description?: string;
  details?: string;
  contactInfo?: string;
  allowContact: boolean;
  source?: ReportSource;

  status: ReportStatus;
  statusNote?: string;
  assignedTo?: string;
  assignedToName?: string;

  resolutionOutcome?: string;
  userFacingMessage?: string;

  internalNotes?: InternalStaffNote[];
  history?: ReportHistoryItem[];

  createdAt: string;
  timestamp: number;
  submittedDate?: string;
  updatedAt?: number;
}

// In-memory cache for synchronous fallback access
let inMemoryReportsCache: ListingReport[] = [];

export class ReportService {
  /**
   * Helper to format DB row to ListingReport
   */
  private static formatReportRow(row: any): ListingReport {
    const createdDate = new Date(row.created_at || Date.now());
    const dateStr = createdDate.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return {
      id: row.id,
      reporterId: row.reporter_id || 'guest',
      reporterName: row.reporter_name || 'User',
      reporterEmail: row.reporter_email,
      reporterRole: 'User',
      targetType: (row.target_type || 'listing') as ReportTargetType,
      targetId: row.listing_id || row.target_id || row.id,
      targetModule: (row.target_module || 'rentals') as ReportTargetModule,
      targetTitle: row.target_title || 'Reported Target',
      targetLocation: row.target_location || '',
      targetPrice: row.target_price || '',
      targetImageUrl: row.target_image_url || '',
      reasonCode: row.reason_code || 'other',
      reasonLabel: row.reason_label || 'Reported Issue',
      description: row.details || '',
      details: row.details || '',
      contactInfo: row.contact_info || '',
      allowContact: row.allow_contact ?? true,
      status: (row.status || 'submitted') as ReportStatus,
      statusNote: row.status_note || '',
      assignedTo: row.assigned_to || '',
      resolutionOutcome: row.resolution_outcome || '',
      userFacingMessage: row.user_facing_message || '',
      internalNotes: Array.isArray(row.internal_notes) ? row.internal_notes : [],
      history: Array.isArray(row.history) ? row.history : [],
      createdAt: dateStr,
      submittedDate: dateStr,
      timestamp: createdDate.getTime(),
      updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : createdDate.getTime()
    };
  }

  /**
   * Async fetch reports from Supabase
   */
  static async fetchReports(reporterId?: string): Promise<ListingReport[]> {
    try {
      let query = supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (reporterId) {
        query = query.eq('reporter_id', reporterId);
      }

      const { data, error } = await query;
      if (error) {
        console.warn('[ReportService] Failed to query reports table:', error.message);
        return inMemoryReportsCache;
      }

      if (data) {
        const formatted = data.map(r => this.formatReportRow(r));
        inMemoryReportsCache = formatted;
        return formatted;
      }

      return inMemoryReportsCache;
    } catch (err) {
      console.warn('[ReportService] Error fetching reports:', err);
      return inMemoryReportsCache;
    }
  }

  /**
   * Synchronous fallback wrapper
   */
  static getReports(reporterId?: string): ListingReport[] {
    // Fire-and-forget async update in background
    this.fetchReports(reporterId).catch(() => {});
    if (reporterId) {
      return inMemoryReportsCache.filter(r => r.reporterId === reporterId);
    }
    return inMemoryReportsCache;
  }

  /**
   * Get a single report by ID.
   */
  static async getReportById(reportId: string): Promise<ListingReport | null> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .maybeSingle();

      if (error || !data) {
        return inMemoryReportsCache.find(r => r.id === reportId) || null;
      }

      return this.formatReportRow(data);
    } catch {
      return inMemoryReportsCache.find(r => r.id === reportId) || null;
    }
  }

  /**
   * Submits a new report for a listing, review, user or conversation to Supabase
   */
  static async submitReport(params: {
    reporterId: string;
    reporterName?: string;
    reporterEmail?: string;
    reporterAvatar?: string;
    targetType?: ReportTargetType;
    targetId: string;
    targetModule: ReportTargetModule;
    targetTitle: string;
    targetLocation?: string;
    targetPrice?: string;
    targetImageUrl?: string;
    targetAuthorName?: string;
    targetAuthorId?: string;
    reasonCode: string;
    reasonLabel: string;
    description?: string;
    contactInfo?: string;
    allowContact?: boolean;
    source?: ReportSource;
  }): Promise<{ success: boolean; report?: ListingReport; error?: string }> {
    try {
      // 1. Check current logged in user
      const { data: { user } } = await supabase.auth.getUser();
      const realReporterId = user?.id || (params.reporterId !== 'guest-reporter' ? params.reporterId : null);

      const isUuid = (val?: string) => typeof val === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

      // 2. Anti-spam check: check if report already exists recently for this reporter and target_id
      if (realReporterId && isUuid(params.targetId)) {
        const { data: existing } = await supabase
          .from('reports')
          .select('id, created_at')
          .eq('reporter_id', realReporterId)
          .eq('listing_id', params.targetId)
          .order('created_at', { ascending: false })
          .limit(1);

        if (existing && existing.length > 0) {
          const lastReportTime = new Date(existing[0].created_at).getTime();
          if (Date.now() - lastReportTime < 120000) { // 2 mins
            return {
              success: false,
              error: 'You recently submitted a report for this item. Our moderation team is investigating.'
            };
          }
        }
      }

      // 3. DB insert
      const insertPayload: any = {
        reporter_id: realReporterId,
        target_type: params.targetType || (isUuid(params.targetId) ? 'listing' : 'user'),
        listing_id: isUuid(params.targetId) ? params.targetId : null,
        target_user_id: params.targetAuthorId && isUuid(params.targetAuthorId) ? params.targetAuthorId : null,
        target_module: params.targetModule || 'general',
        target_title: params.targetTitle,
        target_location: params.targetLocation || '',
        target_price: params.targetPrice || '',
        target_image_url: params.targetImageUrl || '',
        reason_code: params.reasonCode,
        reason_label: params.reasonLabel,
        details: params.description || '',
        contact_info: params.contactInfo || '',
        allow_contact: params.allowContact ?? true
      };

      const insertQuery = supabase.from('reports').insert(insertPayload);
      const { data, error } = realReporterId
        ? await insertQuery.select().single()
        : await insertQuery;

      if (error) {
        console.warn('[ReportService] Supabase insert report error:', error.message);
        return {
          success: false,
          error: `Failed to submit report: ${error.message}`
        };
      }

      const newReport = data ? this.formatReportRow(data) : undefined;
      if (newReport) inMemoryReportsCache = [newReport, ...inMemoryReportsCache];

      // 4. Create confirmation notification for reporter if logged in
      if (realReporterId) {
        try {
          await NotificationService.addNotification({
          targetUserId: realReporterId,
          type: 'REPORT_UPDATE',
          category: 'system',
          title: 'Report Received 🚩',
          body: `Your report regarding “${params.targetTitle}” has been received and queued for prompt review.`,
          entityType: (params.targetModule === 'general' ? 'system' : params.targetModule) as any,
          entityId: params.targetId
          });
        } catch (notificationError) {
          console.warn('[ReportService] Report saved, but confirmation notification failed:', notificationError);
        }
      }

      return {
        success: true,
        report: newReport
      };
    } catch (e: any) {
      console.error('[ReportService] Exception during submitReport:', e);
      return {
        success: false,
        error: e?.message || 'Unable to submit report. Please check connection and try again.'
      };
    }
  }

  /**
   * Updates report status (e.g. submitted -> under_review -> resolved/dismissed).
   */
  static async updateReportStatus(params: {
    reportId: string;
    status: ReportStatus;
    statusNote?: string;
    assignedTo?: string;
    assignedToName?: string;
    staff?: StaffAccount;
  }): Promise<{ success: boolean; report?: ListingReport; error?: string }> {
    try {
      const nowStr = new Date().toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const staffName = params.staff ? (params.staff.displayName || params.staff.fullName) : 'Moderation Staff';
      const staffRole: StaffRole = params.staff ? params.staff.role : 'MODERATOR';

      // Fetch current report history
      const currentReport = await this.getReportById(params.reportId);
      const existingHistory = currentReport?.history || [];

      const newHistoryItem: ReportHistoryItem = {
        id: `hist-${Date.now()}`,
        action: `STATUS_CHANGED_${params.status.toUpperCase()}`,
        actorName: staffName,
        actorRole: staffRole,
        details: params.statusNote || `Status updated to ${params.status.replace('_', ' ')}.`,
        createdAt: nowStr,
        timestamp: Date.now()
      };

      const updatedHistory = [...existingHistory, newHistoryItem];

      const { data, error } = await supabase
        .from('reports')
        .update({
          status: params.status,
          status_note: params.statusNote || null,
          assigned_to: params.assignedTo || null,
          history: updatedHistory,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.reportId)
        .select()
        .single();

      if (error || !data) {
        return { success: false, error: error?.message || 'Failed to update report status in DB.' };
      }

      const updatedReport = this.formatReportRow(data);

      if (params.staff) {
        AdminService.addAuditLog({
          actorId: params.staff.id,
          actorName: staffName,
          actorRole: staffRole,
          action: `REPORT_STATUS_${params.status.toUpperCase()}`,
          targetType: 'report',
          targetId: params.reportId,
          targetTitle: updatedReport.targetTitle,
          details: `Status set to ${params.status}. Note: ${params.statusNote || 'N/A'}`
        });
      }

      return { success: true, report: updatedReport };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to update status.' };
    }
  }

  /**
   * Assigns a report to a moderator.
   */
  static async assignReport(reportId: string, staff: StaffAccount, assigneeName?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const staffName = staff.displayName || staff.fullName;
      const targetAssignee = assigneeName || staffName;

      const currentReport = await this.getReportById(reportId);
      if (!currentReport) return { success: false, error: 'Report not found.' };

      const nowStr = new Date().toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const updatedHistory = [
        ...(currentReport.history || []),
        {
          id: `hist-${Date.now()}`,
          action: 'REPORT_ASSIGNED',
          actorName: staffName,
          actorRole: staff.role,
          details: `Assigned report to ${targetAssignee}.`,
          createdAt: nowStr,
          timestamp: Date.now()
        }
      ];

      const nextStatus = currentReport.status === 'submitted' ? 'under_review' : currentReport.status;

      const { error } = await supabase
        .from('reports')
        .update({
          assigned_to: staff.id,
          status: nextStatus,
          history: updatedHistory,
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) return { success: false, error: error.message };

      AdminService.addAuditLog({
        actorId: staff.id,
        actorName: staffName,
        actorRole: staff.role,
        action: 'REPORT_ASSIGNED',
        targetType: 'report',
        targetId: reportId,
        targetTitle: currentReport.targetTitle,
        details: `Report assigned to ${targetAssignee}.`
      });

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Assignment failed.' };
    }
  }

  /**
   * Adds an internal staff note (never visible to reporters/reported users).
   */
  static async addInternalNote(reportId: string, noteText: string, staff: StaffAccount): Promise<{ success: boolean; note?: InternalStaffNote; error?: string }> {
    try {
      if (!noteText.trim()) return { success: false, error: 'Note cannot be empty.' };

      const currentReport = await this.getReportById(reportId);
      if (!currentReport) return { success: false, error: 'Report not found.' };

      const staffName = staff.displayName || staff.fullName;
      const nowStr = new Date().toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const newNote: InternalStaffNote = {
        id: `note-${Date.now()}`,
        authorId: staff.id,
        authorName: staffName,
        authorRole: staff.role,
        note: noteText.trim(),
        createdAt: nowStr,
        timestamp: Date.now()
      };

      const updatedNotes = [...(currentReport.internalNotes || []), newNote];

      const { error } = await supabase
        .from('reports')
        .update({
          internal_notes: updatedNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) return { success: false, error: error.message };

      return { success: true, note: newNote };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to add note.' };
    }
  }

  /**
   * Resolves a report with an outcome, internal note, user-facing message, and optional linked target action.
   */
  static async resolveReport(params: {
    reportId: string;
    outcome: string;
    internalNote?: string;
    userFacingMessage?: string;
    staff: StaffAccount;
    linkedTargetAction?: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const currentReport = await this.getReportById(params.reportId);
      if (!currentReport) return { success: false, error: 'Report not found.' };

      const staffName = params.staff.displayName || params.staff.fullName;
      const nowStr = new Date().toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const updatedNotes = [...(currentReport.internalNotes || [])];
      if (params.internalNote) {
        updatedNotes.push({
          id: `note-${Date.now()}`,
          authorId: params.staff.id,
          authorName: staffName,
          authorRole: params.staff.role,
          note: `Resolution Outcome: ${params.outcome}. Note: ${params.internalNote}`,
          createdAt: nowStr,
          timestamp: Date.now()
        });
      }

      const updatedHistory = [
        ...(currentReport.history || []),
        {
          id: `hist-${Date.now()}`,
          action: 'REPORT_RESOLVED',
          actorName: staffName,
          actorRole: params.staff.role,
          details: `Resolved report with outcome: "${params.outcome}".`,
          createdAt: nowStr,
          timestamp: Date.now()
        }
      ];

      const { error } = await supabase
        .from('reports')
        .update({
          status: 'resolved',
          resolution_outcome: params.outcome,
          status_note: params.internalNote || `Resolved by ${staffName} with outcome: ${params.outcome}.`,
          user_facing_message: params.userFacingMessage || null,
          internal_notes: updatedNotes,
          history: updatedHistory,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.reportId);

      if (error) return { success: false, error: error.message };

      // Send user-facing notification to reporter if logged in
      if (currentReport.reporterId && currentReport.reporterId !== 'guest') {
        await NotificationService.addNotification({
          targetUserId: currentReport.reporterId,
          type: 'REPORT_UPDATE',
          category: 'system',
          title: 'Report Update 🛡️',
          body: params.userFacingMessage || `Your report regarding “${currentReport.targetTitle}” has been reviewed and resolved by our Trust & Safety team.`,
          entityType: (currentReport.targetModule === 'general' ? 'system' : currentReport.targetModule) as any,
          entityId: currentReport.targetId
        });
      }

      AdminService.addAuditLog({
        actorId: params.staff.id,
        actorName: staffName,
        actorRole: params.staff.role,
        action: 'REPORT_RESOLVED',
        targetType: 'report',
        targetId: currentReport.id,
        targetTitle: currentReport.targetTitle,
        details: `Outcome: ${params.outcome}. ${params.linkedTargetAction ? `Linked action: ${params.linkedTargetAction}` : ''}`
      });

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Resolution failed.' };
    }
  }

  /**
   * Dismisses a report (invalid, duplicate, or no violation).
   */
  static async dismissReport(params: {
    reportId: string;
    reasonNote: string;
    staff: StaffAccount;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const currentReport = await this.getReportById(params.reportId);
      if (!currentReport) return { success: false, error: 'Report not found.' };

      const staffName = params.staff.displayName || params.staff.fullName;
      const nowStr = new Date().toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const updatedNotes = [...(currentReport.internalNotes || [])];
      if (params.reasonNote) {
        updatedNotes.push({
          id: `note-${Date.now()}`,
          authorId: params.staff.id,
          authorName: staffName,
          authorRole: params.staff.role,
          note: `Dismissal reason: ${params.reasonNote}`,
          createdAt: nowStr,
          timestamp: Date.now()
        });
      }

      const updatedHistory = [
        ...(currentReport.history || []),
        {
          id: `hist-${Date.now()}`,
          action: 'REPORT_DISMISSED',
          actorName: staffName,
          actorRole: params.staff.role,
          details: `Dismissed report. Reason: ${params.reasonNote || 'No violation found.'}`,
          createdAt: nowStr,
          timestamp: Date.now()
        }
      ];

      const { error } = await supabase
        .from('reports')
        .update({
          status: 'dismissed',
          status_note: params.reasonNote || 'Report dismissed as no active violation was found.',
          resolution_outcome: 'No Violation Found',
          internal_notes: updatedNotes,
          history: updatedHistory,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.reportId);

      if (error) return { success: false, error: error.message };

      AdminService.addAuditLog({
        actorId: params.staff.id,
        actorName: staffName,
        actorRole: params.staff.role,
        action: 'REPORT_DISMISSED',
        targetType: 'report',
        targetId: currentReport.id,
        targetTitle: currentReport.targetTitle,
        details: `Dismissal Note: ${params.reasonNote}`
      });

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Dismissal failed.' };
    }
  }

  /**
   * Computes chronological activity timeline for report moderation logs.
   */
  static getReportActivities(): { id: string; title: string; actorName: string; timeAgo: string; iconType: string }[] {
    const reports = inMemoryReportsCache;
    const activities: { id: string; title: string; actorName: string; timeAgo: string; iconType: string }[] = [];

    reports.forEach(r => {
      if (r.history && r.history.length > 0) {
        r.history.forEach(h => {
          let iconType = 'info';
          if (h.action.includes('RESOLVED')) iconType = 'success';
          else if (h.action.includes('DISMISSED')) iconType = 'danger';
          else if (h.action.includes('ASSIGNED')) iconType = 'assigned';
          else if (h.action.includes('UNDER_REVIEW')) iconType = 'review';

          activities.push({
            id: h.id,
            title: `Report #${r.id} ${h.action.toLowerCase().replace(/_/g, ' ')} for “${r.targetTitle}”`,
            actorName: h.actorName,
            timeAgo: h.createdAt || 'Recently',
            iconType
          });
        });
      }
    });

    return activities.slice(0, 6);
  }
}
