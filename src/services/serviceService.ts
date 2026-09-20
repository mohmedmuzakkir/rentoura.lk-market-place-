import { supabase } from '../lib/supabase';
import { sanitizeListingImageUrl } from '../utils/cleanImageResolver';
import { ServiceHeroSlide } from '../data/serviceHeroSlidesData';
import { ServiceItem } from '../types';
import { LocationValueModel } from './locationService';
import { SearchService } from './searchService';

export interface ServiceFeedParams {
  searchQuery?: string;
  selectedLocation?: string;
  selectedLocationObj?: LocationValueModel;
  selectedCategory?: string;
  selectedCategoryId?: string;
  selectedServiceType?: string;
  selectedPrice?: string;
  isEmergencyOnly?: boolean;
  isFeaturedOnly?: boolean;
  isNearMeOnly?: boolean;
  offset?: number;
  limit?: number;
}

export interface ServiceFeedResult {
  items: ServiceItem[];
  totalCount: number;
  hasMore: boolean;
}

export function normalizeServiceType(typeStr: string): string {
  if (!typeStr || typeStr === 'All Types' || typeStr === 'All') return 'All Types';
  const norm = typeStr.toLowerCase().trim();
  
  if (norm.includes('on-site') || norm.includes('onsite') || norm.includes('in-person') || norm.includes('on site')) {
    return 'On-site / In-person';
  }
  if (norm.includes('online') || norm.includes('remote')) {
    return 'Online / Remote';
  }
  if (norm.includes('emergency') || norm.includes('24/7') || norm.includes('on-demand')) {
    return 'Emergency 24/7';
  }
  if (norm.includes('scheduled')) {
    return 'Scheduled Visit';
  }
  if (norm.includes('package')) {
    return 'Package Services';
  }
  return typeStr;
}

export class ServiceService {
  /**
   * Helper: Resolves image storage path in private bucket 'listing-images' using signed URLs.
   * NEVER uses getPublicUrl() for private buckets.
   */
  public static async resolveMediaUrl(storagePath: string | null | undefined): Promise<string> {
    const fallbackImage = SearchService.NEUTRAL_PLACEHOLDER;
    if (!storagePath) return fallbackImage;
    const cleanOverride = sanitizeListingImageUrl(storagePath);
    if (cleanOverride && cleanOverride.startsWith('http')) {
      return cleanOverride;
    }
    if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
      return storagePath;
    }

    try {
      const { data, error } = await supabase.storage
        .from('listing-images')
        .createSignedUrl(storagePath, 3600);

      if (!error && data?.signedUrl) {
        return sanitizeListingImageUrl(data.signedUrl) || data.signedUrl;
      }
    } catch (e) {
      console.warn('Error signing service image URL:', e);
    }

    return fallbackImage;
  }

  /**
   * Helper: Batched resolution of image storage paths in private bucket 'listing-images'
   */
  public static async resolveMediaUrlsBatch(
    storagePaths: (string | null | undefined)[],
    expirySeconds: number = 3600
  ): Promise<Map<string, string>> {
    const urlMap = new Map<string, string>();
    const pathsToSign: string[] = [];

    for (const path of storagePaths) {
      if (!path) continue;
      const cleanOverride = sanitizeListingImageUrl(path);
      if (cleanOverride && cleanOverride.startsWith('http')) {
        urlMap.set(path, cleanOverride);
      } else if (path.startsWith('http://') || path.startsWith('https://')) {
        urlMap.set(path, path);
      } else if (!pathsToSign.includes(path)) {
        pathsToSign.push(path);
      }
    }

    if (pathsToSign.length > 0) {
      try {
        const { data, error } = await supabase.storage
          .from('listing-images')
          .createSignedUrls(pathsToSign, expirySeconds);

        if (!error && Array.isArray(data)) {
          data.forEach((item) => {
            if (item.path && item.signedUrl) {
              const cleanUrl = sanitizeListingImageUrl(item.signedUrl) || item.signedUrl;
              urlMap.set(item.path, cleanUrl);
            }
          });
        }
      } catch (e) {
        console.warn('Error batch signing service image URLs:', e);
      }
    }

    return urlMap;
  }

  /**
   * 1. SERVICES HERO SLIDES (placement = 'services')
   */
  static async getServiceHeroSlides(): Promise<ServiceHeroSlide[]> {
    try {
      const { data, error } = await supabase
        .from('home_slides')
        .select('*')
        .eq('is_active', true)
        .or('placement.eq.services,placement.eq.all,module.eq.services')
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return [];
      }

      return data.map((row) => ({
        id: row.id,
        module: 'services' as const,
        themeColor: '#FF650A',
        title: row.title || 'Professional',
        titleHighlight: row.title_highlight || 'Services',
        subtitle: row.subtitle || '',
        description: row.description || '',
        imageUrl: row.image_url || '',
        mobileImageUrl: row.mobile_image_url || undefined,
        ctaLabel: row.cta_text || 'Explore All Services',
        ctaRoute: (row.cta_route || '/services') as any,
        ctaAction: (row.cta_action as any) || 'explore',
        displayOrder: row.display_order ?? 1,
        durationMs: row.duration_ms ?? 5000,
        overlayStrength: row.overlay_strength ?? 0.65,
        isEnabled: true
      }));
    } catch (e) {
      console.warn('Error fetching canonical service hero slides:', e);
      return [];
    }
  }

  /**
   * 2. MAIN SERVICES FEED (Queries public.service_marketplace_view)
   * Enforces status = 'active'
   * Performs strict AND filtering across category, service type, price, location, search, emergency
   */
  static async getServicesFeed(params: ServiceFeedParams): Promise<ServiceFeedResult> {
    const {
      searchQuery,
      selectedLocation,
      selectedLocationObj,
      selectedCategory,
      selectedCategoryId,
      selectedServiceType,
      selectedPrice,
      isEmergencyOnly,
      isFeaturedOnly,
      offset = 0,
      limit = 12
    } = params;

    try {
      let query = supabase
        .from('service_marketplace_view')
        .select('*', { count: 'exact' })
        .eq('status', 'active');

      // Emergency filter
      if (isEmergencyOnly) {
        query = query.eq('is_emergency', true);
      }

      // Featured filter
      if (isFeaturedOnly) {
        query = query.eq('is_featured', true);
      }

      // Category filter
      if (selectedCategoryId) {
        query = query.eq('category_id', selectedCategoryId);
      } else if (selectedCategory && selectedCategory !== 'All Categories' && selectedCategory !== 'All') {
        query = query.ilike('category_name', `%${selectedCategory.trim()}%`);
      }

      // Service Type filter
      if (selectedServiceType && selectedServiceType !== 'All Types' && selectedServiceType !== 'All') {
        const normType = normalizeServiceType(selectedServiceType);
        if (normType === 'Emergency 24/7') {
          query = query.or('is_emergency.eq.true,service_type.ilike.%emergency%,service_type.ilike.%24/7%,service_type.ilike.%on-demand%');
        } else if (normType === 'On-site / In-person') {
          query = query.or('service_type.ilike.%on-site%,service_type.ilike.%onsite%,service_type.ilike.%in-person%,service_type.ilike.%on site%');
        } else if (normType === 'Online / Remote') {
          query = query.or('service_type.ilike.%online%,service_type.ilike.%remote%');
        } else if (normType === 'Scheduled Visit') {
          query = query.ilike('service_type', '%scheduled%');
        } else if (normType === 'Package Services') {
          query = query.ilike('service_type', '%package%');
        } else {
          query = query.ilike('service_type', `%${selectedServiceType.trim()}%`);
        }
      }

      // Price filter (numeric values against price, minimum_price, maximum_price)
      if (selectedPrice && selectedPrice !== 'Any Price' && selectedPrice !== 'All') {
        if (selectedPrice.includes('<') || selectedPrice.toLowerCase().includes('under')) {
          const val = selectedPrice.includes('2,000') ? 2000 : 5000;
          query = query.or(`price.lte.${val},minimum_price.lte.${val}`);
        } else if (selectedPrice.includes('+')) {
          const val = selectedPrice.includes('15,000') ? 15000 : (selectedPrice.includes('25,000') ? 25000 : 10000);
          query = query.or(`price.gte.${val},minimum_price.gte.${val},maximum_price.gte.${val}`);
        } else if (selectedPrice.includes('-') || selectedPrice.includes('–')) {
          const pNorm = selectedPrice.replace(/Rs\.|,/g, '').trim();
          const parts = pNorm.split(/[-–]/).map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
          if (parts.length === 2) {
            const [minV, maxV] = parts;
            query = query.or(`and(price.gte.${minV},price.lte.${maxV}),and(minimum_price.lte.${maxV},maximum_price.gte.${minV})`);
          }
        }
      }

      // Location filter (Area -> City -> District -> Province hierarchy or name search)
      if (selectedLocationObj) {
        if (selectedLocationObj.areaId) {
          query = query.eq('area_id', selectedLocationObj.areaId);
        } else if (selectedLocationObj.cityId) {
          query = query.eq('city_id', selectedLocationObj.cityId);
        } else if (selectedLocationObj.districtId) {
          query = query.eq('district_id', selectedLocationObj.districtId);
        } else if (selectedLocationObj.provinceId) {
          query = query.eq('province_id', selectedLocationObj.provinceId);
        }
      } else if (selectedLocation && selectedLocation !== 'All Sri Lanka' && selectedLocation !== 'All') {
        const locTerm = selectedLocation.split(',')[0].trim().toLowerCase();
        if (locTerm) {
          query = query.or(`exact_address.ilike.%${locTerm}%,service_search_text.ilike.%${locTerm}%`);
        }
      }

      // Search Query (Tokenized AND-style matching on service_search_text)
      if (searchQuery && searchQuery.trim() !== '') {
        const tokens = searchQuery
          .toLowerCase()
          .trim()
          .replace(/\s+/g, ' ')
          .split(' ')
          .filter(t => t.length > 0);

        for (const token of tokens) {
          query = query.ilike('service_search_text', `%${token}%`);
        }
      }

      // Order & Pagination
      query = query
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data, count, error } = await query;

      if (error) {
        console.error('Error fetching services feed:', error);
        return { items: [], totalCount: 0, hasMore: false };
      }

      const rawListings = data || [];
      const totalCount = count || 0;

      // Fetch images for listings ordered by position ascending
      const listingIds = rawListings.map(l => l.id);
      let mediaMap: Record<string, string[]> = {};

      if (listingIds.length > 0) {
        const { data: mediaData } = await supabase
          .from('listing_media')
          .select('listing_id, storage_path, position')
          .in('listing_id', listingIds)
          .order('position', { ascending: true });

        if (mediaData) {
          for (const item of mediaData) {
            if (!mediaMap[item.listing_id]) {
              mediaMap[item.listing_id] = [];
            }
            if (item.storage_path) {
              mediaMap[item.listing_id].push(item.storage_path);
            }
          }
        }
      }

      const coverPaths: (string | null | undefined)[] = rawListings.map((row) => {
        const rawMediaPaths = mediaMap[row.id] || [];
        if (rawMediaPaths.length > 0) return rawMediaPaths[0];
        return row.module_data?.cover_image_url || row.module_data?.image_url || null;
      });

      const urlMap = await ServiceService.resolveMediaUrlsBatch(coverPaths, 3600);

      // Format listings to ServiceItem objects with real database values
      const items: ServiceItem[] = rawListings.map((row) => {
        const rawMediaPaths = mediaMap[row.id] || [];
        let chosenPath: string | null = null;

        if (rawMediaPaths.length > 0) {
          chosenPath = rawMediaPaths[0];
        } else if (row.module_data?.cover_image_url || row.module_data?.image_url) {
          chosenPath = row.module_data.cover_image_url || row.module_data.image_url;
        }

        const coverUrl = chosenPath ? (urlMap.get(chosenPath) || SearchService.NEUTRAL_PLACEHOLDER) : SearchService.NEUTRAL_PLACEHOLDER;

        // Format price display
        let formattedPrice = 'Contact for Quote';
        if (row.price && Number(row.price) > 0) {
          formattedPrice = `Rs. ${Number(row.price).toLocaleString()}`;
        } else if (row.minimum_price && row.maximum_price) {
          formattedPrice = `Rs. ${Number(row.minimum_price).toLocaleString()} - ${Number(row.maximum_price).toLocaleString()}`;
        } else if (row.minimum_price) {
          formattedPrice = `From Rs. ${Number(row.minimum_price).toLocaleString()}`;
        }

        let pricePeriod = row.pricing_period ? `/ ${row.pricing_period}` : (row.pricing_type ? `/ ${row.pricing_type}` : '/ service');

        // Strict DB values only - NO fake defaults or forced ratings
        const realProviderName = row.provider_name || row.module_data?.provider_name || 'Service Provider';
        const realIsVerified = false;
        const realRating = row.rating !== null && row.rating !== undefined ? Number(row.rating) : 0;
        const realReviewsCount = row.reviews_count !== null && row.reviews_count !== undefined ? Number(row.reviews_count) : 0;
        const realWhatsapp = row.whatsapp_number || row.module_data?.whatsapp_number || undefined;
        const realPhone = row.phone_number || row.module_data?.phone_number || undefined;

        return {
          id: row.id,
          title: row.title || 'Untitled Service',
          providerName: realProviderName,
          isVerified: realIsVerified,
          category: row.category_name || 'General Service',
          categoryTag: row.category_name || 'General Service',
          location: row.exact_address || row.city_name || row.district_name || 'Sri Lanka',
          rating: realRating,
          reviewsCount: realReviewsCount,
          price: formattedPrice,
          priceUnit: pricePeriod,
          imageUrl: coverUrl,
          isFeatured: Boolean(row.is_featured),
          whatsappNumber: realWhatsapp,
          phone: realPhone,
          description: row.description || row.short_summary || ''
        };
      });

      return {
        items,
        totalCount,
        hasMore: offset + items.length < totalCount
      };
    } catch (e) {
      console.error('Exception in getServicesFeed:', e);
      return { items: [], totalCount: 0, hasMore: false };
    }
  }

  /**
   * 3. FEATURED SERVICES (status = 'active' AND is_featured = true)
   */
  static async getFeaturedServices(limit = 6): Promise<ServiceItem[]> {
    const res = await this.getServicesFeed({ isFeaturedOnly: true, limit, offset: 0 });
    return res.items;
  }

  /**
   * 4. SERVICES NEAR YOU (status = 'active', matched strictly by user location)
   */
  static async getServicesNearYou(locationObj?: LocationValueModel, limit = 6): Promise<ServiceItem[]> {
    if (!locationObj) {
      return [];
    }
    const res = await this.getServicesFeed({ selectedLocationObj: locationObj, limit, offset: 0 });
    return res.items;
  }
}
