import { AppNotification, NotificationCategory, NotificationPreferences } from '../types/notificationTypes';
import { INITIAL_NOTIFICATIONS, INITIAL_NOTIFICATION_PREFERENCES } from '../data/notificationsData';

const NOTIFICATIONS_STORAGE_KEY = 'rentoura_notifications';
const NOTIFICATION_PREFS_KEY = 'rentoura_notification_preferences';

/**
 * Service/Repository abstraction for Notifications.
 * Prepared for future Supabase/backend database & Realtime integration.
 */
export const NotificationService = {
  /**
   * Load notifications from storage or defaults
   */
  getNotifications(): AppNotification[] {
    try {
      const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load notifications from localStorage', e);
    }
    return INITIAL_NOTIFICATIONS;
  },

  /**
   * Persist notifications
   */
  saveNotifications(notifications: AppNotification[]): void {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Failed to save notifications to localStorage', e);
    }
  },

  /**
   * Load notification preferences
   */
  getPreferences(): NotificationPreferences {
    try {
      const saved = localStorage.getItem(NOTIFICATION_PREFS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load notification preferences', e);
    }
    return INITIAL_NOTIFICATION_PREFERENCES;
  },

  /**
   * Save notification preferences
   */
  savePreferences(prefs: NotificationPreferences): void {
    try {
      localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.warn('Failed to save notification preferences', e);
    }
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

  /**
   * Add a new notification record
   */
  addNotification(newNotif: {
    title: string;
    message: string;
    category?: NotificationCategory;
    actionUrl?: string;
    actionLabel?: string;
  }): AppNotification {
    const notifications = this.getNotifications();
    const notification: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type: 'SYSTEM_UPDATE',
      category: newNotif.category || 'system',
      title: newNotif.title,
      body: newNotif.message,
      timestamp: Date.now(),
      createdAt: 'Just now',
      read: false,
      actionUrl: newNotif.actionUrl,
      actionText: newNotif.actionLabel
    };

    const updated = [notification, ...notifications];
    this.saveNotifications(updated);
    return notification;
  }
};
