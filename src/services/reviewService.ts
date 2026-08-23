import { CanonicalReview, ReviewFilterParams, ReviewSummary, ReviewModule } from '../types/reviewTypes';
import { NotificationService } from './notificationService';
import { AppNotification } from '../types/notificationTypes';

const STORAGE_KEY = 'rentoura_canonical_reviews_v2';

const SEED_REVIEWS: CanonicalReview[] = [
  {
    id: 'rev-seed-1',
    authorId: 'usr-nimal-01',
    authorName: 'Nimal Perera',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    isAuthorVerified: true,
    targetType: 'listing',
    targetId: 'prop-kandy-1',
    targetModule: 'rentals',
    targetTitle: 'Cozy 3 Bedroom House in Kandy',
    targetImageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    targetLocation: 'Kandy, Central Province',
    targetOwnerId: 'usr-owner-99',
    overallRating: 5.0,
    experienceTag: 'Great Experience',
    body: 'Very friendly owner and the house was exactly as described. Smooth process from start to finish. Highly recommended!',
    helpfulCount: 12,
    helpfulUserIds: ['usr-demo-1', 'usr-demo-2'],
    status: 'published',
    createdAt: '2 days ago',
    timestamp: Date.now() - 172800000,
    locationName: 'Kandy',
    subratings: {
      communication: 5.0,
      accuracyOrQuality: 5.0,
      conditionOrProfessionalism: 5.0,
      valueForMoney: 4.8,
      timeliness: 5.0
    }
  },
  {
    id: 'rev-seed-2',
    authorId: 'usr-dilini-02',
    authorName: 'Dilini Fernando',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    isAuthorVerified: true,
    targetType: 'service',
    targetId: 'serv-wedding-dj',
    targetModule: 'services',
    targetTitle: 'DJ Sound System for Wedding',
    targetImageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    targetLocation: 'Colombo, Western Province',
    targetOwnerId: 'usr-provider-1',
    overallRating: 4.0,
    experienceTag: 'Good',
    body: 'Good quality sound system and on-time delivery. The team was helpful and professional.',
    helpfulCount: 8,
    helpfulUserIds: ['usr-demo-3'],
    status: 'published',
    createdAt: '5 days ago',
    timestamp: Date.now() - 432000000,
    locationName: 'Colombo',
    subratings: {
      communication: 4.5,
      accuracyOrQuality: 4.0,
      conditionOrProfessionalism: 4.5,
      valueForMoney: 4.0,
      timeliness: 4.5
    }
  },
  {
    id: 'rev-seed-3',
    authorId: 'usr-tharindu-03',
    authorName: 'Tharindu Jayasuriya',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    isAuthorVerified: true,
    targetType: 'listing',
    targetId: 'prop-office-nugegoda',
    targetModule: 'rentals',
    targetTitle: 'Office Space for Rent in Nugegoda',
    targetImageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    targetLocation: 'Nugegoda, Western Province',
    targetOwnerId: 'usr-owner-99',
    overallRating: 3.0,
    experienceTag: 'Average',
    body: 'The location is good but the parking space is limited. Overall it was an okay experience.',
    helpfulCount: 2,
    helpfulUserIds: [],
    status: 'published',
    createdAt: '1 week ago',
    timestamp: Date.now() - 604800000,
    locationName: 'Nugegoda',
    subratings: {
      communication: 4.0,
      accuracyOrQuality: 3.0,
      conditionOrProfessionalism: 3.0,
      valueForMoney: 3.0,
      timeliness: 3.5
    }
  },
  {
    id: 'rev-seed-4',
    authorId: 'usr-kamal-04',
    authorName: 'Kamal Wickramasinghe',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    isAuthorVerified: true,
    targetType: 'listing',
    targetId: 'rent-prius-2018',
    targetModule: 'rentals',
    targetTitle: 'Toyota Prius Hybrid 2018',
    targetImageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80',
    targetLocation: 'Kandy, Central Province',
    targetOwnerId: 'usr-owner-99',
    overallRating: 5.0,
    experienceTag: 'Great Experience',
    body: 'Vehicle was in pristine condition, hybrid battery had great fuel economy, smooth handover in Kandy!',
    helpfulCount: 15,
    helpfulUserIds: ['usr-demo-1'],
    status: 'published',
    createdAt: '3 days ago',
    timestamp: Date.now() - 259200000,
    locationName: 'Kandy',
    subratings: {
      communication: 5.0,
      accuracyOrQuality: 5.0,
      conditionOrProfessionalism: 5.0,
      valueForMoney: 5.0,
      timeliness: 5.0
    }
  },
  {
    id: 'rev-seed-5',
    authorId: 'usr-anusha-05',
    authorName: 'Anusha Silva',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    isAuthorVerified: true,
    targetType: 'service',
    targetId: 'serv-ac-repair',
    targetModule: 'services',
    targetTitle: 'Air Conditioner Repair & Maintenance',
    targetImageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    targetLocation: 'Colombo, Western Province',
    targetOwnerId: 'usr-provider-1',
    overallRating: 5.0,
    experienceTag: 'Great Experience',
    body: 'Arrived on time in Colombo 03, fixed the compressor issue quickly. Fair pricing and polite service.',
    helpfulCount: 6,
    helpfulUserIds: [],
    status: 'published',
    createdAt: '2 weeks ago',
    timestamp: Date.now() - 1209600000,
    locationName: 'Colombo',
    subratings: {
      communication: 5.0,
      accuracyOrQuality: 5.0,
      conditionOrProfessionalism: 5.0,
      valueForMoney: 4.8,
      timeliness: 5.0
    }
  }
];

export class ReviewService {
  /**
   * Saves reviews array to local storage.
   */
  static saveReviews(reviews: CanonicalReview[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.error('Error saving reviews:', e);
    }
  }

  /**
   * Retrieves all published reviews from local storage, initializing seeds if empty.
   */
  static getAllReviews(): CanonicalReview[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_REVIEWS));
        return SEED_REVIEWS;
      }
      const parsed: CanonicalReview[] = JSON.parse(raw);
      return parsed.filter(r => r.status === 'published');
    } catch (e) {
      console.error('Error reading reviews storage:', e);
      return SEED_REVIEWS;
    }
  }

  /**
   * Returns filtered reviews based on parameters.
   */
  static getFilteredReviews(params?: ReviewFilterParams, currentUserId?: string): CanonicalReview[] {
    let reviews = this.getAllReviews();

    if (!params) return reviews;

    // Filter by tab (All vs My Written vs My Received)
    if (params.tab === 'my_written' && currentUserId) {
      reviews = reviews.filter(r => r.authorId === currentUserId);
    } else if (params.tab === 'my_received' && currentUserId) {
      reviews = reviews.filter(r => r.targetOwnerId === currentUserId);
    }

    // Filter by listing ID
    if (params.listingId) {
      reviews = reviews.filter(r => r.targetId === params.listingId);
    }

    // Filter by User ID (either author or target owner)
    if (params.userId) {
      reviews = reviews.filter(r => r.authorId === params.userId || r.targetOwnerId === params.userId);
    }

    // Filter by module
    if (params.targetModule && params.targetModule !== 'all') {
      reviews = reviews.filter(r => r.targetModule === params.targetModule);
    }

    // Filter by exact star rating
    if (params.ratingFilter && params.ratingFilter > 0) {
      reviews = reviews.filter(r => Math.floor(r.overallRating) === params.ratingFilter);
    }

    // Search query over text, author, title, location
    if (params.searchQuery && params.searchQuery.trim()) {
      const q = params.searchQuery.toLowerCase().trim();
      reviews = reviews.filter(r => 
        r.body.toLowerCase().includes(q) ||
        r.authorName.toLowerCase().includes(q) ||
        r.targetTitle.toLowerCase().includes(q) ||
        (r.locationName && r.locationName.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (params.sortBy) {
      case 'oldest':
        reviews.sort((a, b) => a.timestamp - b.timestamp);
        break;
      case 'highest':
        reviews.sort((a, b) => b.overallRating - a.overallRating);
        break;
      case 'lowest':
        reviews.sort((a, b) => a.overallRating - b.overallRating);
        break;
      case 'most_helpful':
        reviews.sort((a, b) => b.helpfulCount - a.helpfulCount);
        break;
      case 'latest':
      default:
        reviews.sort((a, b) => b.timestamp - a.timestamp);
        break;
    }

    return reviews;
  }

  /**
   * Computes dynamic summary metrics for a given target or global dataset.
   */
  static getSummary(targetId?: string, targetModule?: ReviewModule): ReviewSummary {
    let reviews = this.getAllReviews();

    if (targetId) {
      reviews = reviews.filter(r => r.targetId === targetId);
    } else if (targetModule) {
      reviews = reviews.filter(r => r.targetModule === targetModule);
    }

    const totalCount = reviews.length;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (totalCount === 0) {
      return {
        averageRating: 0,
        totalCount: 0,
        distribution,
        categoryBreakdown: {
          communication: 0,
          trustworthiness: 0,
          itemOrServiceQuality: 0,
          valueForMoney: 0,
          timeliness: 0
        }
      };
    }

    let ratingSum = 0;
    let commSum = 0;
    let accuracySum = 0;
    let conditionSum = 0;
    let valueSum = 0;
    let timeSum = 0;
    let subratingCount = 0;

    reviews.forEach(r => {
      ratingSum += r.overallRating;

      const star = Math.min(5, Math.max(1, Math.round(r.overallRating))) as 1 | 2 | 3 | 4 | 5;
      distribution[star] = (distribution[star] || 0) + 1;

      if (r.subratings) {
        subratingCount++;
        commSum += r.subratings.communication || r.overallRating;
        accuracySum += r.subratings.accuracyOrQuality || r.overallRating;
        conditionSum += r.subratings.conditionOrProfessionalism || r.overallRating;
        valueSum += r.subratings.valueForMoney || r.overallRating;
        timeSum += r.subratings.timeliness || r.overallRating;
      }
    });

    const averageRating = Number((ratingSum / totalCount).toFixed(1));
    const denom = subratingCount > 0 ? subratingCount : totalCount;

    return {
      averageRating,
      totalCount,
      distribution,
      categoryBreakdown: {
        communication: Number(((commSum || ratingSum) / denom).toFixed(1)),
        trustworthiness: Number(((accuracySum || ratingSum) / denom).toFixed(1)),
        itemOrServiceQuality: Number(((conditionSum || ratingSum) / denom).toFixed(1)),
        valueForMoney: Number(((valueSum || ratingSum) / denom).toFixed(1)),
        timeliness: Number(((timeSum || ratingSum) / denom).toFixed(1))
      }
    };
  }

  /**
   * Submits a new review. Prevents self-reviews and duplicates.
   */
  static addReview(params: {
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
    subratings?: {
      communication: number;
      accuracyOrQuality: number;
      conditionOrProfessionalism: number;
      valueForMoney: number;
      timeliness: number;
    };
    body: string;
    locationName?: string;
  }): { success: boolean; review?: CanonicalReview; error?: string } {
    try {
      const all = this.getAllReviews();

      // Guard 1: Prevent self-review
      if (params.targetOwnerId && params.authorId === params.targetOwnerId) {
        return {
          success: false,
          error: 'You cannot review your own listing.'
        };
      }

      // Guard 2: Prevent duplicate review for same target by same author
      const existing = all.find(r => r.authorId === params.authorId && r.targetId === params.targetId);
      if (existing) {
        return {
          success: false,
          error: 'You have already submitted a review for this listing. You can edit your existing review instead.'
        };
      }

      // Map rating to experience tag
      let experienceTag: CanonicalReview['experienceTag'] = 'Great Experience';
      if (params.overallRating >= 4.5) experienceTag = 'Great Experience';
      else if (params.overallRating >= 3.8) experienceTag = 'Good';
      else if (params.overallRating >= 2.8) experienceTag = 'Average';
      else if (params.overallRating >= 1.8) experienceTag = 'Below Expectations';
      else experienceTag = 'Poor';

      const newReview: CanonicalReview = {
        id: `rev-${Date.now()}`,
        authorId: params.authorId,
        authorName: params.authorName,
        authorAvatar: params.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        isAuthorVerified: params.isAuthorVerified ?? true,
        targetType: params.targetType,
        targetId: params.targetId,
        targetModule: params.targetModule,
        targetTitle: params.targetTitle,
        targetImageUrl: params.targetImageUrl,
        targetLocation: params.targetLocation,
        targetOwnerId: params.targetOwnerId || 'usr-owner-99',
        overallRating: params.overallRating,
        subratings: params.subratings || {
          communication: params.overallRating,
          accuracyOrQuality: params.overallRating,
          conditionOrProfessionalism: params.overallRating,
          valueForMoney: params.overallRating,
          timeliness: params.overallRating
        },
        experienceTag,
        body: params.body.trim(),
        helpfulCount: 0,
        helpfulUserIds: [],
        status: 'published',
        createdAt: 'Just now',
        timestamp: Date.now(),
        locationName: params.locationName || 'Sri Lanka'
      };

      const updated = [newReview, ...all];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Notify owner
      if (params.targetOwnerId) {
        const notif: AppNotification = {
          id: `notif-rev-${Date.now()}`,
          type: 'SYSTEM_UPDATE',
          category: 'system',
          title: 'New Review Received ⭐',
          body: `${params.authorName} left a ${params.overallRating}-star review on "${params.targetTitle}".`,
          createdAt: 'Just now',
          timestamp: Date.now(),
          read: false,
          priority: 'normal',
          entityType: params.targetModule,
          entityId: params.targetId,
          listingId: params.targetId
        };
        const existingNotifs = NotificationService.getNotifications();
        NotificationService.saveNotifications([notif, ...existingNotifs]);
      }

      return { success: true, review: newReview };
    } catch (e: any) {
      console.error('Failed to add review:', e);
      return { success: false, error: e?.message || 'Unable to submit review. Please try again.' };
    }
  }

  /**
   * Updates an existing review.
   */
  static updateReview(reviewId: string, authorId: string, params: {
    overallRating: number;
    body: string;
    subratings?: CanonicalReview['subratings'];
  }): { success: boolean; review?: CanonicalReview; error?: string } {
    try {
      const all = this.getAllReviews();
      const index = all.findIndex(r => r.id === reviewId);
      if (index === -1) return { success: false, error: 'Review not found.' };

      if (all[index].authorId !== authorId) {
        return { success: false, error: 'You are not authorized to edit this review.' };
      }

      let experienceTag: CanonicalReview['experienceTag'] = 'Great Experience';
      if (params.overallRating >= 4.5) experienceTag = 'Great Experience';
      else if (params.overallRating >= 3.8) experienceTag = 'Good';
      else if (params.overallRating >= 2.8) experienceTag = 'Average';
      else if (params.overallRating >= 1.8) experienceTag = 'Below Expectations';
      else experienceTag = 'Poor';

      all[index] = {
        ...all[index],
        overallRating: params.overallRating,
        body: params.body.trim(),
        experienceTag,
        subratings: params.subratings || all[index].subratings,
        updatedAt: 'Edited just now'
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      return { success: true, review: all[index] };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to update review.' };
    }
  }

  /**
   * Deletes a review.
   */
  static deleteReview(reviewId: string, authorId: string): { success: boolean; error?: string } {
    try {
      let all = this.getAllReviews();
      const target = all.find(r => r.id === reviewId);
      if (!target) return { success: false, error: 'Review not found.' };

      if (target.authorId !== authorId) {
        return { success: false, error: 'You are not authorized to delete this review.' };
      }

      all = all.filter(r => r.id !== reviewId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to delete review.' };
    }
  }

  /**
   * Toggles helpful vote for a review.
   */
  static toggleHelpful(reviewId: string, userId: string): { success: boolean; helpfulCount?: number } {
    try {
      const all = this.getAllReviews();
      const review = all.find(r => r.id === reviewId);
      if (!review) return { success: false };

      const userIndex = review.helpfulUserIds.indexOf(userId);
      if (userIndex > -1) {
        review.helpfulUserIds.splice(userIndex, 1);
        review.helpfulCount = Math.max(0, review.helpfulCount - 1);
      } else {
        review.helpfulUserIds.push(userId);
        review.helpfulCount += 1;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      return { success: true, helpfulCount: review.helpfulCount };
    } catch (e) {
      return { success: false };
    }
  }

  /**
   * Adds an owner reply to a review.
   */
  static addOwnerReply(reviewId: string, ownerName: string, replyText: string): { success: boolean; review?: CanonicalReview; error?: string } {
    try {
      const all = this.getAllReviews();
      const index = all.findIndex(r => r.id === reviewId);
      if (index === -1) return { success: false, error: 'Review not found.' };

      all[index].ownerReply = {
        authorName: ownerName,
        body: replyText.trim(),
        createdAt: 'Just now'
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));

      // Notify author
      const notif: AppNotification = {
        id: `notif-reply-${Date.now()}`,
        type: 'SYSTEM_UPDATE',
        category: 'system',
        title: 'Response to your Review 💬',
        body: `${ownerName} replied to your review on "${all[index].targetTitle}".`,
        createdAt: 'Just now',
        timestamp: Date.now(),
        read: false,
        priority: 'normal',
        entityType: all[index].targetModule,
        entityId: all[index].targetId,
        listingId: all[index].targetId
      };
      const existingNotifs = NotificationService.getNotifications();
      NotificationService.saveNotifications([notif, ...existingNotifs]);

      return { success: true, review: all[index] };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to submit reply.' };
    }
  }
}
