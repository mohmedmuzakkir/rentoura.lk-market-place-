export type AccountType = 'Individual' | 'Business' | 'Dealer' | 'Agent';

export type UserListingStatus = 
  | 'active'
  | 'pending'
  | 'draft'
  | 'changes_requested'
  | 'rejected'
  | 'paused'
  | 'expired';

export interface UserProfile {
  id: string;
  fullName: string;
  displayName: string;
  email: string;
  phone: string;
  bio: string;
  avatarUrl: string;
  memberSince: string;
  memberSinceYear: string;
  accountType?: AccountType | string;
  isVerified: boolean;
  province: string;
  district: string;
  city: string;
  area?: string;
  preferredLanguage?: 'English' | 'Sinhala' | 'Tamil' | string;
  currency: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  twoFactorEnabled: boolean;
  totalReviews: number;
  averageRating: number;
  role?: string;
  accountStatus?: string;
  agreementVersion?: string;
  agreementAcceptedAt?: string;
}

export interface UserListingItem {
  id: string;
  ownerId?: string;
  module: 'rentals' | 'jobs' | 'services';
  title: string;
  status: UserListingStatus;
  imageUrl: string;
  location: string;
  price: string;
  pricePeriod?: string;
  category: string;
  subcategory?: string;
  postedDate: string;
  viewsCount?: number;
  inquiriesCount?: number;
  savesCount?: number;
  imagesCount?: number;
  tags?: string[];
  companyName?: string;
  companyLogo?: string;
  providerName?: string;
  statusNote?: string;
  rejectionReason?: string;
  changesRequestedNote?: string;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  isNegotiable?: boolean;
  contactPhone?: string;
  whatsapp?: string;
}

export interface UserReviewItem {
  id: string;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  listingTitle: string;
  module: 'rentals' | 'jobs' | 'services';
}

export interface UserReportItem {
  id: string;
  targetListingTitle: string;
  targetListingId: string;
  reason: string;
  status: 'Pending Review' | 'Resolved' | 'Action Taken' | 'Dismissed';
  submittedDate: string;
  resolutionNote?: string;
}
