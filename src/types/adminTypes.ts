export type StaffRole = 'USER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN';

export type UserAccountStatus = 'Active' | 'Suspended' | 'Banned' | 'Pending Verification';

export interface StaffAccount {
  id: string;
  fullName: string;
  displayName: string;
  email: string;
  role: StaffRole;
  status: UserAccountStatus;
  avatarUrl: string;
  phone?: string;
  lastLogin?: string;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: StaffRole;
  action: string; // e.g. 'LISTING_APPROVED', 'LISTING_REJECTED', 'USER_SUSPENDED', 'ROLE_UPDATED', 'REPORT_RESOLVED'
  targetType: 'listing' | 'user' | 'report' | 'review' | 'announcement' | 'settings' | 'category' | 'location';
  targetId: string;
  targetTitle?: string;
  details: string;
  timestamp: number;
  createdAt: string;
}

export interface AdminKpiMetrics {
  totalListings: number;
  activeListings: number;
  pendingListings: number;
  rejectedListings: number;
  reportedListings: number;
  featuredListings: number;
  expiredListings: number;
  totalUsers: number;
  verifiedUsers: number;
  bannedUsers: number;
  totalViews: number;
  totalMessages: number;
  totalReviews: number;
  totalRevenue: number;
  rentalsCount: number;
  jobsCount: number;
  servicesCount: number;
}

export interface SystemHealthStatus {
  website: 'Online' | 'Degraded' | 'Offline';
  database: 'Online' | 'Degraded' | 'Offline';
  storagePercentage: number;
  server: 'Online' | 'Degraded' | 'Offline';
  lastBackupTime: string;
}

export interface PlatformAnnouncement {
  id: string;
  title: string;
  message: string;
  targetModule: 'all' | 'rentals' | 'jobs' | 'services';
  priority: 'normal' | 'urgent' | 'high';
  createdAt: string;
  createdBy: string;
  active: boolean;
}

export interface RegisteredUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  accountType: 'Individual' | 'Business' | 'Dealer' | 'Agent';
  status: UserAccountStatus;
  isVerified: boolean;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  idVerified?: boolean;
  businessVerified?: boolean;
  city: string;
  district: string;
  listingsCount: number;
  createdAt: string;
  lastActive: string;
  suspensionReason?: string;
  suspendedAt?: string;
  suspendedBy?: string;
}

