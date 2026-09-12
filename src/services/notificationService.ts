import { supabase } from '../lib/supabase';
import { AppNotification, NotificationCategory, NotificationPreferences } from '../types/notificationTypes';
const INITIAL_NOTIFICATION_PREFERENCES: NotificationPreferences = { messages: true, listingUpdates: true, jobUpdates: true, serviceUpdates: true, reviews: true, systemAnnouncements: true, promotions: false };

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

      const { data: announcementsData } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[NotificationService] Failed to query notifications table:', error.message);
        return [];
      }

      const rawData = data || [];

      // Fix duplicate notifications (from RPC + DB Trigger) and bad action_urls
      const deduplicated = rawData.filter((row: any, index: number, self: any[]) => {
        if (['LISTING_APPROVED', 'LISTING_REJECTED', 'LISTING_CHANGES_REQUESTED', 'LISTING_PENDING'].includes(row.type)) {
          return index === self.findIndex((n) => n.type === row.type && n.entity_id === row.entity_id);
        }
        return true;
      });

      const parsedNotifications = deduplicated.map((row: any) => {
        const createdDate = new Date(row.created_at);
        const timeAgo = this.formatTimeAgo(createdDate);

        // Map bad action URLs from DB Trigger to the correct tab in My Listings
        let finalActionUrl = row.action_url;
        if (row.type === 'LISTING_REJECTED' || row.type === 'LISTING_CHANGES_REQUESTED') {
          finalActionUrl = '/my-listings';
        }

        return {
          id: row.id,
          userId: row.user_id,
          type: (row.type || 'SYSTEM_UPDATE') as AppNotification['type'],
          category: (row.category || 'system') as NotificationCategory,
          title: row.title || 'Notification',
          body: row.body || '',
          read: row.read_at !== null && row.read_at !== undefined || row.is_read || false,
          createdAt: timeAgo,
          timestamp: createdDate.getTime(),
          priority: row.priority || 'normal',
          entityType: row.entity_type,
          entityId: row.entity_id,
          actionUrl: finalActionUrl,
          thumbnailUrl: row.thumbnail_url,
          dedupeKey: row.dedupe_key
        };
      });

      // Merge announcements
      const readAncIds = JSON.parse(localStorage.getItem(`read_anc_${user.id}`) || '[]');
      const deletedAncIds = JSON.parse(localStorage.getItem(`deleted_anc_${user.id}`) || '[]');
      
      const announcementNotifications = (announcementsData || [])
        .filter((anc: any) => !deletedAncIds.includes(`anc-${anc.id}`))
        .map((anc: any) => {
          const createdDate = new Date(anc.created_at);
        return {
          id: `anc-${anc.id}`,
          userId: user.id,
          type: 'SYSTEM_UPDATE' as AppNotification['type'],
          category: 'system' as NotificationCategory,
          title: `📢 ${anc.title}`,
          body: anc.message,
          read: readAncIds.includes(`anc-${anc.id}`),
          createdAt: this.formatTimeAgo(createdDate),
          timestamp: createdDate.getTime(),
          priority: (anc.priority === 'urgent' ? 'high' : 'normal') as AppNotification['priority'],
          entityType: 'system',
          entityId: anc.id,
          actionUrl: undefined,
          dedupeKey: `anc-${anc.id}`
        } as AppNotification;
      });

      return [...parsedNotifications, ...announcementNotifications].sort((a, b) => b.timestamp - a.timestamp);
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
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'announcements'
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

      // Handle announcements
      if (id && typeof id === 'string' && id.startsWith('anc-')) {
        const readAncIds = JSON.parse(localStorage.getItem(`read_anc_${user.id}`) || '[]');
        if (!readAncIds.includes(id)) {
          readAncIds.push(id);
          localStorage.setItem(`read_anc_${user.id}`, JSON.stringify(readAncIds));
        }
        return true;
      }

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

      // Mark all announcements as read in localStorage
      const { data: announcementsData } = await supabase.from('announcements').select('id').eq('is_active', true);
      if (announcementsData) {
        const ancIds = announcementsData.map(a => `anc-${a.id}`);
        localStorage.setItem(`read_anc_${user.id}`, JSON.stringify(ancIds));
      }

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

      // Handle announcements
      if (id && typeof id === 'string' && id.startsWith('anc-')) {
        // Strip 'anc-' if it's the dedupeKey, wait, our ID is actually the announcement ID from DB which doesn't have 'anc-'
        // Wait! In map we set: id: anc.id. The DB id is a UUID usually!
        // But in adminService.createAnnouncement we do: id: `anc-${Date.now()}`. Ah, the DB uses UUID for id!
        // Let's just track the exact string ID passed to delete.
        const deletedAncIds = JSON.parse(localStorage.getItem(`deleted_anc_${user.id}`) || '[]');
        if (!deletedAncIds.includes(id)) {
          deletedAncIds.push(id);
          localStorage.setItem(`deleted_anc_${user.id}`, JSON.stringify(deletedAncIds));
        }
        return true;
      }

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

      // Handle clearing read announcements
      const readAncIds = JSON.parse(localStorage.getItem(`read_anc_${user.id}`) || '[]');
      if (readAncIds.length > 0) {
        const deletedAncIds = JSON.parse(localStorage.getItem(`deleted_anc_${user.id}`) || '[]');
        const newDeleted = Array.from(new Set([...deletedAncIds, ...readAncIds]));
        localStorage.setItem(`deleted_anc_${user.id}`, JSON.stringify(newDeleted));
        localStorage.setItem(`read_anc_${user.id}`, '[]'); // Clear read since they are now deleted
      }

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
