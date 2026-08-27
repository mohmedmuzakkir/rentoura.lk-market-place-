import { supabase } from '../lib/supabase';

export interface SubmitTicketParams {
  userId?: string | null;
  contactEmail: string;
  contactPhone?: string;
  category?: string;
  subject: string;
  message: string;
  source?: string;
}

export interface SubmitTicketResult {
  success: boolean;
  ticketId?: string;
  error?: string;
}

export class SupportTicketService {
  /**
   * Submits a support ticket to public.support_tickets table.
   */
  static async submitTicket(params: SubmitTicketParams): Promise<SubmitTicketResult> {
    if (!navigator.onLine) return { success: false, error: 'You are offline. Connect to the internet before submitting a support request.' };
    try {
      const email = params.contactEmail.trim();
      const subject = params.subject.trim();
      const message = params.message.trim();

      if (!email || !email.includes('@')) {
        return { success: false, error: 'Please enter a valid email address.' };
      }

      if (!subject) {
        return { success: false, error: 'Please enter a subject.' };
      }

      if (!message || message.length < 5) {
        return { success: false, error: 'Please enter a detailed message (at least 5 characters).' };
      }

      const { data: { user } } = await supabase.auth.getUser();
      const realUserId = user?.id || (params.userId && params.userId !== 'guest' ? params.userId : null);

      const payload = {
        user_id: realUserId,
        contact_email: email,
        contact_phone: params.contactPhone?.trim() || null,
        category: params.category || 'general',
        subject: subject,
        message: message,
        status: 'open',
        source: params.source || 'help_center'
      };

      const insertQuery = supabase.from('support_tickets').insert([payload]);
      const { data, error } = realUserId
        ? await insertQuery.select('id').single()
        : await insertQuery;

      if (error) {
        console.warn('[SupportTicketService] Supabase insert error:', error);
        return { success: false, error: error.message || 'Failed to submit support ticket.' };
      }

      if (realUserId && !data?.id) {
        return { success: false, error: 'The support ticket was not confirmed by the server.' };
      }

      return {
        success: true,
        ticketId: data?.id
      };
    } catch (err: any) {
      console.error('[SupportTicketService] Exception submitting support ticket:', err);
      return {
        success: false,
        error: err?.message || 'Network error submitting ticket. Please try again.'
      };
    }
  }
}
