import { supabase } from '../lib/supabase';
import { AppNotification, NotificationCategory, NotificationPreferences } from '../types/notificationTypes';
import { INITIAL_NOTIFICATION_PREFERENCES } from '../data/notificationsData';

export const NotificationService = {
  /**
   * Fetch notifications from Supabase for current logged-in user
   */
  async fetchNotifications(): Promise<AppNotification[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[NotificationService] Failed to query notifications table:', error.message);
        return [];
      }

      if (!data) return [];

      return data.map((row: any) => {
        const createdDate = new Date(row.created_at);
        const timeAgo = this.formatTimeAgo(createdDate);

        return {
          id: row.id,
          userId: row.user_id,
          type: row.type || 'SYSTEM_UPDATE',
          category: (row.category || 'system') as NotificationCategory,
          title: row.title || 'Notification',
          body: row.body || '',
          createdAt: timeAgo,
          timestamp: createdDate.getTime(),
          read: row.read_at !== null && row.read_at !== undefined,
          priority: row.priority || 'normal',
          entityType: row.entity_type,
          entityId: row.entity_id,
          actionUrl: row.action_url,
          thumbnailUrl: row.thumbnail_url,
          dedupeKey: row.dedupe_key
        };
      });
    } catch (err) {
      console.warn('[NotificationService] Exception during notification fetch:', err);
      return [];
    }
  },

  /**
   * Legacy synchronous fallback method
   */
  getNotifications(): AppNotification[] {
    return [];
  },

  /**
   * Legacy synchronous fallback method
   */
  saveNotifications(_notifications: AppNotification[]): void {
    // No-op for local memory; Supabase DB is canonical.
  },

  /**
   * Realtime subscription for user's notification changes
   */
  subscribeToNotifications(userId: string, onUpdate: () => void) {
    if (!userId) return () => {};

    const channel = supabase
      .channel(`notifications_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        () => {
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Mark a single notification as read in Supabase
   */
  async markAsRead(id: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id);

      return !error;
    } catch (err) {
      console.warn('[NotificationService] Mark as read error:', err);
      return false;
    }
  },

  /**
   * Mark all notifications as read for current user
   */
  async markAllAsRead(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .is('read_at', null);

      return !error;
    } catch (err) {
      console.warn('[NotificationService] Mark all as read error:', err);
      return false;
    }
  },

  /**
   * Delete a single notification
   */
  async deleteNotification(id: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      return !error;
    } catch (err) {
      console.warn('[NotificationService] Delete notification error:', err);
      return false;
    }
  },

  /**
   * Clear all read notifications for current user
   */
  async clearReadNotifications(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id)
        .not('read_at', 'is', null);

      return !error;
    } catch (err) {
      console.warn('[NotificationService] Clear read notifications error:', err);
      return false;
    }
  },

  /**
   * Load notification preferences from Supabase
   */
  async getPreferences(): Promise<NotificationPreferences> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return INITIAL_NOTIFICATION_PREFERENCES;

      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error || !data) {
        return INITIAL_NOTIFICATION_PREFERENCES;
      }

      return {
        messages: data.messages ?? true,
        listingUpdates: data.listing_updates ?? true,
        jobUpdates: data.job_updates ?? true,
        serviceUpdates: data.service_updates ?? true,
        reviews: data.reviews ?? true,
        systemAnnouncements: data.system_announcements ?? true,
        promotions: data.promotions ?? true
      };
    } catch (err) {
      console.warn('[NotificationService] Get preferences error:', err);
      return INITIAL_NOTIFICATION_PREFERENCES;
    }
  },

  /**
   * Save notification preferences to Supabase
   */
  async savePreferences(prefs: NotificationPreferences): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          messages: prefs.messages,
          listing_updates: prefs.listingUpdates,
          job_updates: prefs.jobUpdates,
          service_updates: prefs.serviceUpdates,
          reviews: prefs.reviews,
          system_announcements: prefs.systemAnnouncements,
          promotions: prefs.promotions,
          updated_at: new Date().toISOString()
        });

      return !error;
    } catch (err) {
      console.warn('[NotificationService] Save preferences error:', err);
      return false;
    }
  },

  /**
   * Add / Create a notification in Supabase
   */
  async addNotification(newNotif: {
    title: string;
    message?: string;
    body?: string;
    category?: NotificationCategory;
    actionUrl?: string;
    actionLabel?: string;
    targetUserId?: string;
    userId?: string;
    type?: string;
    entityType?: string;
    entityId?: string;
    priority?: string;
  }): Promise<AppNotification | null> {
    try {
      let targetUser = newNotif.targetUserId || newNotif.userId;
      if (!targetUser) {
        const { data: { user } } = await supabase.auth.getUser();
        targetUser = user?.id;
      }

      if (!targetUser) return null;

      const bodyText = newNotif.body || newNotif.message || '';
      const notifType = newNotif.type || 'SYSTEM_UPDATE';
      const categoryName = newNotif.category || 'system';

      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: targetUser,
          type: notifType,
          category: categoryName,
          title: newNotif.title,
          body: bodyText,
          entity_type: newNotif.entityType,
          entity_id: newNotif.entityId,
          action_url: newNotif.actionUrl,
          priority: newNotif.priority || 'normal'
        })
        .select()
        .single();

      if (error || !data) {
        console.warn('[NotificationService] Insert notification error:', error?.message);
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        type: data.type,
        category: data.category as NotificationCategory,
        title: data.title,
        body: data.body,
        createdAt: 'Just now',
        timestamp: new Date(data.created_at).getTime(),
        read: data.read_at !== null,
        priority: data.priority,
        entityType: data.entity_type,
        entityId: data.entity_id,
        actionUrl: data.action_url
      };
    } catch (err) {
      console.warn('[NotificationService] addNotification exception:', err);
      return null;
    }
  },

  /**
   * Helper: Add a notification record for specific user
   */
  async createNotification(notif: {
    userId: string;
    type: string;
    category?: NotificationCategory;
    title: string;
    body: string;
    entityType?: string;
    entityId?: string;
    actionUrl?: string;
    priority?: string;
  }): Promise<boolean> {
    const res = await this.addNotification({
      targetUserId: notif.userId,
      type: notif.type,
      category: notif.category,
      title: notif.title,
      body: notif.body,
      entityType: notif.entityType,
      entityId: notif.entityId,
      actionUrl: notif.actionUrl,
      priority: notif.priority
    });
    return !!res;
  },

  /**
   * Calculate total unread notifications count
   */
  getUnreadCount(notifications: AppNotification[]): number {
    return notifications.filter(n => !n.read).length;
  },

  /**
   * Calculate unread count for a specific category
   */
  getCategoryCounts(notifications: AppNotification[]): Record<NotificationCategory, { total: number; unread: number }> {
    const counts: Record<NotificationCategory, { total: number; unread: number }> = {
      all: { total: notifications.length, unread: 0 },
      listings: { total: 0, unread: 0 },
      messages: { total: 0, unread: 0 },
      updates: { total: 0, unread: 0 },
      payments: { total: 0, unread: 0 },
      system: { total: 0, unread: 0 }
    };

    notifications.forEach(n => {
      if (!n.read) {
        counts.all.unread += 1;
      }
      if (counts[n.category]) {
        counts[n.category].total += 1;
        if (!n.read) {
          counts[n.category].unread += 1;
        }
      }
    });

    return counts;
  },

  /**
   * Group notifications by time section (Today, Yesterday, Earlier)
   */
  groupNotifications(notifications: AppNotification[]): {
    today: AppNotification[];
    yesterday: AppNotification[];
    earlier: AppNotification[];
  } {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const twoDaysMs = 48 * 60 * 60 * 1000;

    const today: AppNotification[] = [];
    const yesterday: AppNotification[] = [];
    const earlier: AppNotification[] = [];

    notifications.forEach(n => {
      const age = now - n.timestamp;
      if (age < oneDayMs && !n.createdAt.includes('Yesterday') && !n.createdAt.includes('days')) {
        today.push(n);
      } else if (age < twoDaysMs || n.createdAt.includes('Yesterday')) {
        yesterday.push(n);
      } else {
        earlier.push(n);
      }
    });

    return { today, yesterday, earlier };
  },

  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 2) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hrs ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  }
};
