import { ListingDraft } from '../types/postFormTypes';

const DRAFT_STORAGE_PREFIX = 'rentoura_post_draft_';

export class PostDraftService {
  /**
   * Generates a storage key for a module draft
   */
  private static getKey(module: 'rentals' | 'jobs' | 'services', ownerId: string = 'usr-muzakkir-1'): string {
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
      localStorage.setItem(this.getKey(draft.module, draft.ownerId), JSON.stringify(updatedDraft));
    } catch (e) {
      console.warn('Failed to save listing draft to localStorage', e);
    }
  }

  /**
   * Retrieves a draft for a specific module
   */
  static getDraft(module: 'rentals' | 'jobs' | 'services', ownerId: string = 'usr-muzakkir-1'): ListingDraft | null {
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
  static deleteDraft(module: 'rentals' | 'jobs' | 'services', ownerId: string = 'usr-muzakkir-1'): void {
    try {
      localStorage.removeItem(this.getKey(module, ownerId));
    } catch (e) {
      console.warn('Failed to delete draft', e);
    }
  }

  /**
   * Creates an empty initial draft
   */
  static createInitialDraft(module: 'rentals' | 'jobs' | 'services', ownerId: string = 'usr-muzakkir-1'): ListingDraft {
    return {
      id: `draft-${module}-${Date.now()}`,
      ownerId,
      module,
      categoryId: module === 'rentals' ? 'vehicles' : '',
      categoryName: module === 'rentals' ? 'Vehicles' : '',
      subcategoryId: module === 'rentals' ? 'cars' : '',
      subcategoryName: module === 'rentals' ? 'Cars' : '',
      thirdLevelId: module === 'rentals' ? 'car-sedan' : undefined,
      thirdLevelName: module === 'rentals' ? 'Sedan' : undefined,
      categoryPath: module === 'rentals' ? 'Vehicles › Cars › Sedan' : '',
      currentStep: 1,
      condition: 'like-new',
      pricing: {
        rate: 12500,
        ratePeriod: 'day',
        hasSecondaryRate: true,
        secondaryRate: 185000,
        secondaryPeriod: 'month',
        depositRequired: true,
        depositAmount: 25000,
        depositTerms: 'Fully refundable upon safe vehicle return with fuel level verified',
        minRentalDuration: '1 day',
        bookingType: 'inquire',
        availableImmediately: true,
        offerLongTermDiscount: true,
        discountWeek: 10,
        discountMonth: 20
      },
      rules: {
        requiredDocuments: ['nic', 'driving_license', 'billing_proof'],
        smokingAllowed: false,
        petsAllowed: false,
        commercialUsageAllowed: true,
        handoverMode: 'both',
        deliveryFee: 2500,
        cancellationPolicy: 'flexible',
        customRules: 'Driver must be at least 21 years old with valid Sri Lankan driving license.'
      },
      formValues: {
        title: module === 'rentals' ? 'Toyota Axio WxB 2018 - Self Drive / With Driver' : '',
        make: 'toyota',
        model: 'Axio WxB Hybrid',
        year: 2018,
        fuelType: 'hybrid',
        transmission: 'automatic',
        seats: '5',
        rentalType: 'both',
        freeMileage: '100km',
        extraKmCharge: 85,
        depositRequired: true,
        depositAmount: 25000,
        description: 'Well-maintained Toyota Axio WxB 2018 Hybrid available for self-drive or with professional driver. Excellent fuel efficiency (22-26 km/l). Dual airbags, lane assist, push start, Bluetooth audio, reverse camera and ice cold climate control AC. Suitable for weddings, business trips, or holiday travel across Sri Lanka.'
      },
      location: {
        provinceId: 'central',
        provinceName: 'Central Province',
        districtId: 'kandy',
        districtName: 'Kandy District',
        cityId: 'kandy-city',
        cityName: 'Kandy',
        areaName: 'Peradeniya Road',
        address: 'No. 45, Peradeniya Road, Kandy',
        hideExactAddress: false
      },
      images: module === 'rentals' ? [
        {
          id: 'img-1',
          url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
          name: 'Front view',
          isCover: true
        },
        {
          id: 'img-2',
          url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
          name: 'Interior & dashboard',
          isCover: false
        },
        {
          id: 'img-3',
          url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
          name: 'Side profile',
          isCover: false
        }
      ] : [],
      contactPreferences: {
        contactName: 'Muzakkir M.',
        showPhone: true,
        phone: '077 123 4567',
        showWhatsApp: true,
        whatsappNumber: '077 123 4567',
        allowDirectChat: true
      },
      lastSavedAt: Date.now()
    };
  }
}
