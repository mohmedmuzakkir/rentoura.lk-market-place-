import { supabase } from '../lib/supabase';
import { CanonicalReview, ReviewFilterParams, ReviewSummary, ReviewModule } from '../types/reviewTypes';
import { NotificationService } from './notificationService';

let inMemoryReviewsCache: CanonicalReview[] = [];

export class ReviewService {
  /**
   * Helper to format DB row to CanonicalReview
   */
  private static formatReviewRow(row: any): CanonicalReview {
    const createdDate = new Date(row.created_at || Date.now());
    const dateStr = createdDate.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const listing = row.listings || {};
    const profile = row.profiles || {};

    let experienceTag: CanonicalReview['experienceTag'] = 'Great Experience';
    const rating = Number(row.rating || 5);
    if (rating >= 4.5) experienceTag = 'Great Experience';
    else if (rating >= 3.8) experienceTag = 'Good';
    else if (rating >= 2.8) experienceTag = 'Average';
    else if (rating >= 1.8) experienceTag = 'Below Expectations';
    else experienceTag = 'Poor';

    return {
      id: row.id,
      authorId: row.author_id,
      authorName: profile.full_name || profile.email?.split('@')[0] || 'Community Member',
      authorAvatar: profile.avatar_url || '',
      isAuthorVerified: false, // Neutral labeling as per prompt requirement
      targetType: 'listing',
      targetId: row.listing_id,
      targetModule: (listing.module || row.target_module || 'rentals') as ReviewModule,
      targetTitle: listing.title || 'Marketplace Listing',
      targetImageUrl: '',
      targetLocation: 'Sri Lanka',
      targetOwnerId: listing.owner_id || '',
      overallRating: rating,
      subratings: row.subratings || {
        communication: rating,
        accuracyOrQuality: rating,
        conditionOrProfessionalism: rating,
        valueForMoney: rating,
        timeliness: rating
      },
      experienceTag,
      body: row.body || '',
      helpfulCount: row.helpful_count || 0,
      helpfulUserIds: Array.isArray(row.helpful_user_ids) ? row.helpful_user_ids : [],
      ownerReply: row.owner_reply ? {
        authorName: 'Listing Owner',
        body: row.owner_reply,
        createdAt: row.owner_reply_at ? new Date(row.owner_reply_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently'
      } : undefined,
      status: (row.status || 'published') as any,
      createdAt: dateStr,
      timestamp: createdDate.getTime(),
      updatedAt: row.updated_at ? new Date(row.updated_at).toLocaleDateString() : undefined,
      locationName: 'Sri Lanka'
    };
  }

  /**
   * Save array to cache (used by admin or fallback)
   */
  static saveReviews(reviews: CanonicalReview[]): void {
    inMemoryReviewsCache = reviews;
  }

  /**
   * Async fetch all reviews from Supabase
   */
  static async fetchAllReviews(): Promise<CanonicalReview[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          listings (
            id,
            title,
            module,
            owner_id
          ),
          profiles:author_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[ReviewService] Supabase query failed:', error.message);
        return inMemoryReviewsCache;
      }

      if (data) {
        const formatted = data.map(row => this.formatReviewRow(row));
        inMemoryReviewsCache = formatted;
        return formatted;
      }

      return inMemoryReviewsCache;
    } catch (err) {
      console.warn('[ReviewService] Error fetching reviews:', err);
      return inMemoryReviewsCache;
    }
  }

  /**
   * Synchronous getter for cached reviews
   */
  static getAllReviews(): CanonicalReview[] {
    this.fetchAllReviews().catch(() => {});
    return inMemoryReviewsCache;
  }

  /**
   * Async fetch filtered reviews
   */
  static async fetchFilteredReviews(params?: ReviewFilterParams, currentUserId?: string): Promise<CanonicalReview[]> {
    const all = await this.fetchAllReviews();
    let reviews = [...all];

    if (!params) return reviews;

    // Filter by tab
    if (params.tab === 'my_written' && currentUserId) {
      reviews = reviews.filter(r => r.authorId === currentUserId);
    } else if (params.tab === 'my_received' && currentUserId) {
      reviews = reviews.filter(r => r.targetOwnerId === currentUserId);
    }

    // Filter by listing ID
    if (params.listingId) {
      reviews = reviews.filter(r => r.targetId === params.listingId);
    }

    // Filter by User ID
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

    // Search query
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
   * Sync getter for filtered reviews (reads cache)
   */
  static getFilteredReviews(params?: ReviewFilterParams, currentUserId?: string): CanonicalReview[] {
    this.fetchFilteredReviews(params, currentUserId).catch(() => {});
    let reviews = [...inMemoryReviewsCache];
    if (!params) return reviews;

    if (params.tab === 'my_written' && currentUserId) {
      reviews = reviews.filter(r => r.authorId === currentUserId);
    } else if (params.tab === 'my_received' && currentUserId) {
      reviews = reviews.filter(r => r.targetOwnerId === currentUserId);
    }

    if (params.listingId) {
      reviews = reviews.filter(r => r.targetId === params.listingId);
    }

    if (params.userId) {
      reviews = reviews.filter(r => r.authorId === params.userId || r.targetOwnerId === params.userId);
    }

    if (params.targetModule && params.targetModule !== 'all') {
      reviews = reviews.filter(r => r.targetModule === params.targetModule);
    }

    if (params.ratingFilter && params.ratingFilter > 0) {
      reviews = reviews.filter(r => Math.floor(r.overallRating) === params.ratingFilter);
    }

    if (params.searchQuery && params.searchQuery.trim()) {
      const q = params.searchQuery.toLowerCase().trim();
      reviews = reviews.filter(r =>
        r.body.toLowerCase().includes(q) ||
        r.authorName.toLowerCase().includes(q) ||
        r.targetTitle.toLowerCase().includes(q)
      );
    }

    return reviews;
  }

  /**
   * Async compute summary metrics
   */
  static async fetchSummary(targetListingId?: string, targetModule?: ReviewModule | 'all'): Promise<ReviewSummary> {
    const all = await this.fetchAllReviews();
    let reviews = all.filter(r => r.status === 'published');

    if (targetListingId) {
      reviews = reviews.filter(r => r.targetId === targetListingId);
    } else if (targetModule && (targetModule as string) !== 'all') {
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
   * Sync getter for summary
   */
  static getSummary(targetListingId?: string, targetModule?: ReviewModule | 'all'): ReviewSummary {
    let reviews = inMemoryReviewsCache.filter(r => r.status === 'published');

    if (targetListingId) {
      reviews = reviews.filter(r => r.targetId === targetListingId);
    } else if (targetModule && (targetModule as string) !== 'all') {
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
    reviews.forEach(r => {
      ratingSum += r.overallRating;
      const star = Math.min(5, Math.max(1, Math.round(r.overallRating))) as 1 | 2 | 3 | 4 | 5;
      distribution[star] = (distribution[star] || 0) + 1;
    });

    const averageRating = Number((ratingSum / totalCount).toFixed(1));

    return {
      averageRating,
      totalCount,
      distribution,
      categoryBreakdown: {
        communication: averageRating,
        trustworthiness: averageRating,
        itemOrServiceQuality: averageRating,
        valueForMoney: averageRating,
        timeliness: averageRating
      }
    };
  }

  /**
   * Adds a review for a listing into Supabase
   */
  static async addReview(params: {
    authorId: string;
    authorName?: string;
    authorAvatar?: string;
    targetId: string;
    targetModule?: ReviewModule;
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
  }): Promise<{ success: boolean; review?: CanonicalReview; error?: string }> {
    try {
      // 1. Verify user authenticated
      const { data: { user } } = await supabase.auth.getUser();
      const realAuthorId = user?.id || (params.authorId && !params.authorId.startsWith('usr-guest') ? params.authorId : null);

      if (!realAuthorId) {
        return { success: false, error: 'You must be signed in to submit a review.' };
      }

      // 2. Fetch target listing from DB to check existence and owner
      const { data: listing, error: listingError } = await supabase
        .from('listings')
        .select('id, title, owner_id, status, module')
        .eq('id', params.targetId)
        .maybeSingle();

      if (listingError || !listing) {
        return { success: false, error: 'The listing you are reviewing could not be found.' };
      }

      // 3. Self-review guard: owner cannot review own listing
      if (listing.owner_id && listing.owner_id === realAuthorId) {
        return { success: false, error: 'You cannot review your own listing.' };
      }

      // 4. Duplicate guard: author cannot review same listing twice
      const { data: existing } = await supabase
        .from('reviews')
        .select('id')
        .eq('listing_id', params.targetId)
        .eq('author_id', realAuthorId)
        .maybeSingle();

      if (existing) {
        return { success: false, error: 'You have already submitted a review for this listing.' };
      }

      // 5. Insert review into Supabase
      const insertPayload = {
        listing_id: params.targetId,
        author_id: realAuthorId,
        rating: params.overallRating,
        body: params.body.trim(),
        subratings: params.subratings || {
          communication: params.overallRating,
          accuracyOrQuality: params.overallRating,
          conditionOrProfessionalism: params.overallRating,
          valueForMoney: params.overallRating,
          timeliness: params.overallRating
        },
        status: 'pending_moderation'
      };

      const { data, error } = await supabase
        .from('reviews')
        .insert(insertPayload)
        .select(`
          *,
          listings (
            id,
            title,
            module,
            owner_id
          ),
          profiles:author_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .single();

      if (error) {
        console.error('[ReviewService] Supabase insert review failed:', error.message);
        return { success: false, error: `Failed to submit review: ${error.message}` };
      }

      const newReview = this.formatReviewRow(data);
      inMemoryReviewsCache = [newReview, ...inMemoryReviewsCache];

      // Notify owner if available
      if (listing.owner_id && listing.owner_id !== realAuthorId) {
        await NotificationService.addNotification({
          targetUserId: listing.owner_id,
          type: 'SYSTEM_UPDATE',
          category: 'system',
          title: 'New Review Received ⭐',
          body: `Someone left a ${params.overallRating}-star review on your listing "${listing.title}".`,
          entityType: (listing.module || 'rentals') as any,
          entityId: params.targetId
        });
      }

      return { success: true, review: newReview };
    } catch (e: any) {
      console.error('[ReviewService] Exception in addReview:', e);
      return { success: false, error: e?.message || 'Unable to submit review. Please try again.' };
    }
  }

  /**
   * Updates an existing review
   */
  static async updateReview(reviewId: string, authorId: string, params: {
    overallRating: number;
    body: string;
    subratings?: CanonicalReview['subratings'];
  }): Promise<{ success: boolean; review?: CanonicalReview; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const realAuthorId = user?.id || authorId;

      const { data, error } = await supabase
        .from('reviews')
        .update({
          rating: params.overallRating,
          body: params.body.trim(),
          subratings: params.subratings || {},
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewId)
        .eq('author_id', realAuthorId)
        .select(`
          *,
          listings (
            id,
            title,
            module,
            owner_id
          ),
          profiles:author_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .single();

      if (error || !data) {
        return { success: false, error: error?.message || 'Failed to update review in database.' };
      }

      const updated = this.formatReviewRow(data);
      inMemoryReviewsCache = inMemoryReviewsCache.map(r => r.id === reviewId ? updated : r);
      return { success: true, review: updated };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to update review.' };
    }
  }

  /**
   * Deletes a review
   */
  static async deleteReview(reviewId: string, authorId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const realAuthorId = user?.id || authorId;

      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .eq('author_id', realAuthorId);

      if (error) {
        return { success: false, error: error.message };
      }

      inMemoryReviewsCache = inMemoryReviewsCache.filter(r => r.id !== reviewId);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to delete review.' };
    }
  }

  /**
   * Toggle helpful vote
   */
  static async toggleHelpful(reviewId: string, userId: string): Promise<{ success: boolean; helpfulCount?: number }> {
    try {
      const review = inMemoryReviewsCache.find(r => r.id === reviewId);
      if (!review) return { success: false };

      const userIndex = review.helpfulUserIds.indexOf(userId);
      let updatedUserIds = [...review.helpfulUserIds];
      let newCount = review.helpfulCount;

      if (userIndex > -1) {
        updatedUserIds.splice(userIndex, 1);
        newCount = Math.max(0, newCount - 1);
      } else {
        updatedUserIds.push(userId);
        newCount += 1;
      }

      const { error } = await supabase
        .from('reviews')
        .update({
          helpful_count: newCount,
          helpful_user_ids: updatedUserIds
        })
        .eq('id', reviewId);

      if (error) {
        console.warn('[ReviewService] Toggle helpful DB warning:', error.message);
      }

      review.helpfulUserIds = updatedUserIds;
      review.helpfulCount = newCount;
      return { success: true, helpfulCount: newCount };
    } catch (e) {
      return { success: false };
    }
  }

  /**
   * Adds owner reply to a review
   */
  static async addOwnerReply(reviewId: string, ownerName: string, replyText: string): Promise<{ success: boolean; review?: CanonicalReview; error?: string }> {
    try {
      const nowIso = new Date().toISOString();

      const { data, error } = await supabase
        .from('reviews')
        .update({
          owner_reply: replyText.trim(),
          owner_reply_at: nowIso,
          updated_at: nowIso
        })
        .eq('id', reviewId)
        .select(`
          *,
          listings (
            id,
            title,
            module,
            owner_id
          ),
          profiles:author_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .single();

      if (error || !data) {
        return { success: false, error: error?.message || 'Failed to submit reply to database.' };
      }

      const updated = this.formatReviewRow(data);
      inMemoryReviewsCache = inMemoryReviewsCache.map(r => r.id === reviewId ? updated : r);

      if (updated.authorId) {
        await NotificationService.addNotification({
          targetUserId: updated.authorId,
          type: 'SYSTEM_UPDATE',
          category: 'system',
          title: 'Response to your Review 💬',
          body: `The listing owner replied to your review on "${updated.targetTitle}".`,
          entityType: (updated.targetModule || 'rentals') as any,
          entityId: updated.targetId
        });
      }

      return { success: true, review: updated };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to submit reply.' };
    }
  }
}
