export type NotificationType = 
  | 'LISTING_APPROVED'
  | 'LISTING_PENDING'
  | 'LISTING_REJECTED'
  | 'LISTING_CHANGES_REQUESTED'
  | 'LISTING_EXPIRING'
  | 'MESSAGE_RECEIVED'
  | 'REVIEW_RECEIVED'
  | 'JOB_MATCH'
  | 'JOB_APPLICATION_UPDATE'
  | 'SERVICE_INQUIRY'
  | 'FEATURED_PROMOTION'
  | 'REPORT_UPDATE'
  | 'SYSTEM_UPDATE'
  | 'ACCOUNT_SECURITY';

export type NotificationCategory = 
  | 'all'
  | 'listings'
  | 'messages'
  | 'updates'
  | 'payments'
  | 'system';

export type NotificationPriority = 'critical' | 'high' | 'normal' | 'low';

export interface AppNotification {
  id: string;
  userId?: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  body: string;
  createdAt: string;
  timestamp: number;
  read: boolean;
  priority?: NotificationPriority;
  entityType?: 'rentals' | 'jobs' | 'services' | 'messages' | 'reviews' | 'reports' | 'system' | 'promotions';
  entityId?: string;
  listingId?: string;
  conversationId?: string;
  reviewId?: string;
  reportId?: string;
  thumbnailUrl?: string;
  actionUrl?: string;
  actionText?: string;
  badgeText?: string;
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  messages: boolean;
  listingUpdates: boolean;
  jobUpdates: boolean;
  serviceUpdates: boolean;
  reviews: boolean;
  systemAnnouncements: boolean;
  promotions: boolean;
}

export interface NotificationCategoryTab {
  id: NotificationCategory;
  label: string;
  count: number;
  unreadCount: number;
}
