export type ReviewModule = 'rentals' | 'jobs' | 'services';

export interface ReviewCategorySubratings {
  communication: number;
  accuracyOrQuality: number;
  conditionOrProfessionalism: number;
  valueForMoney: number;
  timeliness: number;
}

export interface ReviewOwnerReply {
  authorName: string;
  body: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CanonicalReview {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  isAuthorVerified?: boolean;
  targetType: 'listing' | 'user' | 'service';
  targetId: string;
  targetModule: ReviewModule;
  targetTitle: string;
  targetImageUrl?: string;
  targetLocation?: string;
  targetOwnerId?: string;
  overallRating: number;
  subratings?: ReviewCategorySubratings;
  experienceTag?: 'Great Experience' | 'Good' | 'Average' | 'Below Expectations' | 'Poor';
  title?: string;
  body: string;
  helpfulCount: number;
  helpfulUserIds: string[];
  ownerReply?: ReviewOwnerReply;
  status: 'published' | 'pending_moderation' | 'removed';
  createdAt: string;
  timestamp: number;
  updatedAt?: string;
  locationName?: string;
}

export interface ReviewSummary {
  averageRating: number;
  totalCount: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  categoryBreakdown: {
    communication: number;
    trustworthiness: number;
    itemOrServiceQuality: number;
    valueForMoney: number;
    timeliness: number;
  };
}

export interface ReviewFilterParams {
  listingId?: string;
  userId?: string;
  targetModule?: ReviewModule | 'all';
  ratingFilter?: number; // 1-5 or 0 for all
  searchQuery?: string;
  sortBy?: 'latest' | 'oldest' | 'highest' | 'lowest' | 'most_helpful';
  tab?: 'all' | 'my_received' | 'my_written';
}
