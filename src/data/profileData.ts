import { UserProfile, UserListingItem, UserReviewItem, UserReportItem } from '../types/profileTypes';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: '',
  fullName: 'Rentoura Member',
  displayName: 'Rentoura Member',
  email: '',
  phone: '',
  bio: '',
  avatarUrl: '',
  memberSince: '',
  memberSinceYear: '',
  accountType: '',
  isVerified: false,
  province: '',
  district: '',
  city: '',
  area: '',
  preferredLanguage: '',
  currency: 'LKR',
  emailNotifications: true,
  pushNotifications: true,
  twoFactorEnabled: false,
  totalReviews: 0,
  averageRating: 0,
  role: 'user',
  accountStatus: 'active'
};

export const INITIAL_USER_LISTINGS: UserListingItem[] = [];

export const INITIAL_USER_REVIEWS: UserReviewItem[] = [];

export const INITIAL_USER_REPORTS: UserReportItem[] = [];
