import { supabase } from '../lib/supabase';
import { NotificationService } from './notificationService';
import { AppNotification } from '../types/notificationTypes';

export interface ServiceInquiryInput {
  serviceId: string;
  serviceTitle: string;
  providerName: string;
  senderName: string;
  senderPhone: string;
  senderEmail: string;
  preferredDate?: string;
  inquiryDetails: string;
}

export class ServiceInquiryService {
  /**
   * Submits service inquiry to Supabase service_inquiries table & triggers notification.
   */
  static async submitInquiry(input: ServiceInquiryInput): Promise<{ success: boolean; error?: string }> {
    if (!navigator.onLine) return { success: false, error: 'You are offline. Connect to the internet before sending an inquiry.' };
    try {
      // 1. Verify user authentication
      const { data: authData } = await supabase.auth.getUser();
      const currentUser = authData?.user;

      if (!currentUser) {
        return { success: false, error: 'Please sign in to send a service inquiry.' };
      }

      // 2. Verify sender is NOT the listing owner
      const { data: serviceRow } = await supabase
        .from('listings')
        .select('owner_id')
        .eq('id', input.serviceId)
        .maybeSingle();

      if (serviceRow && serviceRow.owner_id === currentUser.id) {
        return { success: false, error: 'You cannot send a service inquiry to your own listing.' };
      }

      // 3. Insert inquiry into Supabase service_inquiries table
      const { error: insertErr } = await supabase
        .from('service_inquiries')
        .insert({
          service_listing_id: input.serviceId,
          sender_id: currentUser.id,
          sender_name: input.senderName,
          sender_phone: input.senderPhone,
          sender_email: input.senderEmail,
          preferred_date: input.preferredDate ? input.preferredDate : null,
          inquiry_details: input.inquiryDetails,
          status: 'pending'
        });

      if (insertErr) {
        console.warn('[ServiceInquiryService] DB Insert error:', insertErr.message);
        // If table doesn't exist yet on remote, fail cleanly instead of abusing search events
        if (insertErr.code === '42P01' || insertErr.message?.includes('does not exist')) {
          return { success: false, error: 'Service inquiry database table not provisioned yet on server.' };
        }
        return { success: false, error: insertErr.message || 'Failed to submit service inquiry to server.' };
      }

      // 4. Trigger sender notification
      const notif: AppNotification = {
        id: `srv-inq-${Date.now()}`,
        type: 'SERVICE_INQUIRY',
        category: 'updates',
        title: 'Inquiry Sent! 🛠️',
        body: `Your inquiry for "${input.serviceTitle}" was sent to ${input.providerName}.`,
        createdAt: 'Just now',
        timestamp: Date.now(),
        read: false,
        priority: 'normal',
        entityType: 'services',
        entityId: input.serviceId
      };

      const existingNotifs = NotificationService.getNotifications();
      NotificationService.saveNotifications([notif, ...existingNotifs]);

      return { success: true };
    } catch (e: any) {
      console.error('Error submitting service inquiry:', e);
      return { success: false, error: e?.message || 'Failed to submit service inquiry. Please try again.' };
    }
  }
}
