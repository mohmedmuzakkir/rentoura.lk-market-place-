import { ListingDraft } from '../types/postFormTypes';

const DRAFT_STORAGE_PREFIX = 'rentoura_post_draft_';

export class PostDraftService {
  /**
   * Generates a storage key for a module draft
   */
  private static getKey(module: 'rentals' | 'jobs' | 'services', ownerId: string = 'device_user'): string {
    return `${DRAFT_STORAGE_PREFIX}${ownerId}_${module}`;
  }

  /**
   * Saves a listing draft to localStorage
   */
  static saveDraft(draft: ListingDraft): void {
    try {
      const updatedDraft: ListingDraft = {
        ...draft,
        lastSavedAt: Date.now()
      };
      localStorage.setItem(this.getKey(draft.module, draft.ownerId || 'device_user'), JSON.stringify(updatedDraft));
    } catch (e) {
      console.warn('Failed to save listing draft to localStorage', e);
    }
  }

  /**
   * Retrieves a draft for a specific module
   */
  static getDraft(module: 'rentals' | 'jobs' | 'services', ownerId: string = 'device_user'): ListingDraft | null {
    try {
      const stored = localStorage.getItem(this.getKey(module, ownerId));
      if (!stored) return null;
      return JSON.parse(stored) as ListingDraft;
    } catch (e) {
      console.warn('Failed to retrieve listing draft', e);
      return null;
    }
  }

  /**
   * Deletes a draft when a listing is submitted or cleared
   */
  static deleteDraft(module: 'rentals' | 'jobs' | 'services', ownerId: string = 'device_user'): void {
    try {
      localStorage.removeItem(this.getKey(module, ownerId));
    } catch (e) {
      console.warn('Failed to delete draft', e);
    }
  }

  /**
   * Creates an empty initial draft
   */
  static createInitialDraft(module: 'rentals' | 'jobs' | 'services', ownerId: string = 'device_user'): ListingDraft {
    return {
      id: `draft-${module}-${Date.now()}`,
      ownerId,
      module,
      categoryId: '',
      categoryName: '',
      subcategoryId: '',
      subcategoryName: '',
      thirdLevelId: undefined,
      thirdLevelName: undefined,
      categoryPath: '',
      currentStep: 1,
      condition: 'like-new',
      pricing: {
        rate: 0,
        ratePeriod: 'day',
        hasSecondaryRate: false,
        secondaryRate: 0,
        secondaryPeriod: 'month',
        depositRequired: false,
        depositAmount: 0,
        depositTerms: '',
        minRentalDuration: '1 day',
        bookingType: 'inquire',
        availableImmediately: true,
        offerLongTermDiscount: false,
        discountWeek: 0,
        discountMonth: 0
      },
      rules: {
        requiredDocuments: ['nic'],
        smokingAllowed: false,
        petsAllowed: false,
        commercialUsageAllowed: false,
        handoverMode: 'both',
        deliveryFee: 0,
        cancellationPolicy: 'flexible',
        customRules: ''
      },
      formValues: {
        title: '',
        price: 0,
        description: ''
      },
      location: {
        provinceId: '',
        provinceName: '',
        districtId: '',
        districtName: '',
        cityId: '',
        cityName: '',
        areaId: '',
        areaName: '',
        address: '',
        hideExactAddress: false
      },
      images: [],
      contactPreferences: {
        contactName: '',
        showPhone: true,
        phone: '',
        showWhatsApp: false,
        whatsappNumber: '',
        allowDirectChat: true
      },
      lastSavedAt: Date.now()
    };
  }
}
