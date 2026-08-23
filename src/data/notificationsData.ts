import { AppNotification, NotificationPreferences } from '../types/notificationTypes';

export const INITIAL_NOTIFICATIONS: AppNotification[] = [];

export const INITIAL_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  messages: true,
  listingUpdates: true,
  jobUpdates: true,
  serviceUpdates: true,
  reviews: true,
  systemAnnouncements: true,
  promotions: false
};
