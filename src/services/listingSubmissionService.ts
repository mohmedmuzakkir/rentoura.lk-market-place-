import { UserListingItem } from '../types/profileTypes';
import { ListingDraft, normalizeNumericPrice } from '../types/postFormTypes';
import { ProfileService } from './profileService';
import { NotificationService } from './notificationService';
import { PostDraftService } from './postDraftService';
import { AppNotification } from '../types/notificationTypes';

export class ListingSubmissionService {
  /**
   * Submits a listing draft for moderation review.
   * Ensures:
   * 1. Status is STRICTLY set to 'pending'
   * 2. Canonical taxonomy and location are preserved
   * 3. Canonical listing store (ProfileService) is updated
   * 4. Notification event is created
   * 5. Draft is cleared
   */
  static submitListing(draft: ListingDraft): { success: boolean; listing: UserListingItem; error?: string } {
    try {
      // Validate mandatory properties
      if (!draft.formValues.title) {
        return { success: false, listing: {} as any, error: 'Listing title is required' };
      }
      if (!draft.categoryId) {
        return { success: false, listing: {} as any, error: 'Category selection is required' };
      }

      const listingId = `${draft.module.substring(0, 4)}-${Date.now()}`;
      const title = draft.formValues.title || `${draft.subcategoryName || draft.categoryName} Listing`;
      
      const rawPrice = draft.formValues.price || draft.formValues.minSalary || draft.formValues.fixedSalary || 0;
      const { amount, formatted } = normalizeNumericPrice(rawPrice);

      let pricePeriod = '/ Month';
      if (draft.module === 'rentals') {
        pricePeriod = draft.formValues.rentalPeriod === 'day' ? '/ Day' : (draft.formValues.rentalPeriod === 'hour' ? '/ Hour' : '/ Month');
      } else if (draft.module === 'jobs') {
        pricePeriod = '/ Month';
      } else if (draft.module === 'services') {
        const pricingModel = draft.formValues.pricingModel;
        pricePeriod = pricingModel === 'visit' ? '/ Visit' : (pricingModel === 'hourly' ? '/ Hour' : '/ Job');
      }

      // Location formatting
      const locationCity = draft.location.cityName || 'Kandy';
      const locationDistrict = draft.location.districtName || 'Kandy';
      const formattedLocation = `${locationCity}, ${locationDistrict}`;

      // Default high quality contextual images based on module
      const defaultImages: Record<string, string> = {
        rentals: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
        jobs: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        services: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80'
      };

      const coverImageUrl = draft.images.length > 0 ? draft.images[0].url : defaultImages[draft.module];

      // Construct canonical UserListingItem
      const newListing: UserListingItem = {
        id: listingId,
        ownerId: draft.ownerId || 'usr-muzakkir-1',
        module: draft.module,
        title,
        status: 'pending', // REQUIRED: ALWAYS pending review on creation
        statusNote: 'Submitted and currently queued for moderation review.',
        imageUrl: coverImageUrl,
        location: formattedLocation,
        price: formatted,
        pricePeriod,
        category: draft.categoryName,
        subcategory: draft.subcategoryName || draft.categoryName,
        postedDate: 'Just now',
        viewsCount: 0,
        inquiriesCount: 0,
        savesCount: 0,
        imagesCount: Math.max(1, draft.images.length),
        tags: [
          draft.categoryName,
          draft.subcategoryName,
          draft.location.provinceName || 'Central'
        ].filter(Boolean) as string[],
        description: draft.formValues.description || 'Listing submitted for review.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add to canonical store (ProfileService)
      ProfileService.addListing(newListing);

      // Create notification for review submission
      const newNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        type: 'LISTING_PENDING',
        category: 'listings',
        title: 'Listing submitted for review ⏳',
        body: `“${title}” has been submitted and is currently under review by our moderation team.`,
        createdAt: 'Just now',
        timestamp: Date.now(),
        read: false,
        priority: 'normal',
        entityType: draft.module,
        entityId: listingId,
        listingId: listingId,
        thumbnailUrl: coverImageUrl
      };

      const existingNotifs = NotificationService.getNotifications();
      NotificationService.saveNotifications([newNotif, ...existingNotifs]);

      // Delete draft upon successful submission
      PostDraftService.deleteDraft(draft.module, draft.ownerId);

      return {
        success: true,
        listing: newListing
      };
    } catch (error: any) {
      console.error('Error submitting listing:', error);
      return {
        success: false,
        listing: {} as any,
        error: error?.message || 'Failed to submit listing. Please try again.'
      };
    }
  }
}
