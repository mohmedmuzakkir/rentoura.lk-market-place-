import { supabase } from '../lib/supabase';
import { RENTAL_HERO_SLIDES, RentalHeroSlide } from '../data/rentalHeroSlidesData';
import { FeaturedListingItem } from '../types';
import { matchesLocation } from './locationService';
import { CategoryService } from './categoryService';

export interface RentalFeedParams {
  searchQuery?: string;
  selectedLocation?: string;
  selectedCategory?: string;
  selectedPrice?: string;
  selectedPeriod?: string;
  offset?: number;
  limit?: number;
}

export interface RentalFeedResult {
  items: FeaturedListingItem[];
  totalCount: number;
  hasMore: boolean;
}

export interface RentalCategoryRecord {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  level: number;
  sortOrder: number;
  iconKey: string | null;
  description: string | null;
  children?: RentalCategoryRecord[];
}

export class RentalService {
  /**
   * Helper: Resolves image storage path in private bucket 'listing-images'
   */
  public static async resolveMediaUrl(storagePath: string | null | undefined): Promise<string> {
    const fallbackImage = 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80';
    if (!storagePath) return fallbackImage;
    if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
      return storagePath;
    }

    try {
      const { data, error } = await supabase.storage
        .from('listing-images')
        .createSignedUrl(storagePath, 3600);

      if (!error && data?.signedUrl) {
        return data.signedUrl;
      }
    } catch (e) {
      console.warn('Error signing listing image URL:', e);
    }

    const { data: pubData } = supabase.storage.from('listing-images').getPublicUrl(storagePath);
    return pubData?.publicUrl || fallbackImage;
  }

  /**
   * 1. RENTAL HERO SLIDES (placement = 'rentals')
   */
  static async getRentalHeroSlides(): Promise<RentalHeroSlide[]> {
    try {
      const { data, error } = await supabase
        .from('home_slides')
        .select('*')
        .eq('is_active', true)
        .eq('placement', 'rentals')
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return RENTAL_HERO_SLIDES;
      }

      return data.map((row) => ({
        id: row.id,
        page: 'rentals' as const,
        title: row.title || 'Rent Anything',
        titleHighlight: row.title_highlight || '',
        subtitle: row.subtitle || '',
        description: row.description || '',
        imageUrl: row.image_url || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
        mobileImageUrl: row.mobile_image_url || undefined,
        ctaLabel: row.cta_text || 'Explore All Rentals',
        ctaRoute: (row.cta_route || '/rentals') as any,
        ctaAction: (row.cta_action as any) || 'explore',
        displayOrder: row.display_order ?? 1,
        durationMs: row.duration_ms ?? 5000,
        overlayStrength: row.overlay_strength ?? 0.65,
        isEnabled: true
      }));
    } catch (e) {
      console.warn('Error fetching rental hero slides, falling back to local slides:', e);
      return RENTAL_HERO_SLIDES;
    }
  }

  /**
   * 2. FEATURED RENTALS
   * module = 'rental' AND status = 'active' AND is_featured = true
   */
  static async getFeaturedRentals(): Promise<FeaturedListingItem[]> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          id,
          title,
          short_summary,
          description,
          price,
          pricing_period,
          is_featured,
          created_at,
          published_at,
          rental_details(rates, features, attributes),
          listing_media(storage_path, position),
          locations:city_id(name, province_id, district_id),
          categories:category_id(name, slug)
        `)
        .eq('module', 'rental')
        .eq('status', 'active')
        .eq('is_featured', true)
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
        .limit(10);

      if (error || !data || data.length === 0) {
        return [];
      }

      return await Promise.all(data.map((row: any) => this.mapListingRowToFeaturedItem(row, 'FEATURED')));
    } catch (e) {
      console.error('Error fetching featured rentals:', e);
      return [];
    }
  }

  /**
   * 3. NEAR YOU RENTALS
   */
  static async getNearYouRentals(userLocation?: string): Promise<FeaturedListingItem[]> {
    try {
      let query = supabase
        .from('listings')
        .select(`
          id,
          title,
          short_summary,
          description,
          price,
          pricing_period,
          is_featured,
          created_at,
          published_at,
          rental_details(rates, features, attributes),
          listing_media(storage_path, position),
          locations:city_id(name),
          categories:category_id(name, slug)
        `)
        .eq('module', 'rental')
        .eq('status', 'active')
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
        .limit(12);

      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return [];
      }

      const items = await Promise.all(data.map((row: any) => this.mapListingRowToFeaturedItem(row, 'POPULAR')));

      if (userLocation && userLocation !== 'All Sri Lanka') {
        return items.filter(item => matchesLocation(item.location, userLocation));
      }

      return items;
    } catch (e) {
      console.error('Error fetching near you rentals:', e);
      return [];
    }
  }

  /**
   * 4. MAIN RENTAL FEED WITH PAGINATION AND FILTERS
   * module = 'rental' AND status = 'active'
   */
  static async getRentalFeed(params: RentalFeedParams): Promise<RentalFeedResult> {
    const {
      searchQuery = '',
      selectedLocation = 'All Sri Lanka',
      selectedCategory = 'All Categories',
      selectedPrice = 'Any Price',
      selectedPeriod = 'Any Period',
      offset = 0,
      limit = 12
    } = params;

    try {
      let query = supabase
        .from('listings')
        .select(`
          id,
          title,
          short_summary,
          description,
          price,
          pricing_period,
          is_featured,
          created_at,
          published_at,
          rental_details(rates, features, attributes),
          listing_media(storage_path, position),
          locations:city_id(name),
          categories:category_id(name, slug)
        `, { count: 'exact' })
        .eq('module', 'rental')
        .eq('status', 'active');

      // Price filter translation to DB numeric bounds
      if (selectedPrice && selectedPrice !== 'Any Price') {
        const priceClean = selectedPrice.replace('–', '-');
        if (priceClean.includes('<') || priceClean.toLowerCase().includes('under')) {
          query = query.lt('price', 25000);
        } else if (priceClean.includes('25,000') && priceClean.includes('75,000')) {
          query = query.gte('price', 25000).lte('price', 75000);
        } else if (priceClean.includes('75,000') && priceClean.includes('150,000')) {
          query = query.gte('price', 75000).lte('price', 150000);
        } else if (priceClean.includes('150,000+')) {
          query = query.gte('price', 150000);
        }
      }

      // Period filter translation
      if (selectedPeriod && selectedPeriod !== 'Any Period') {
        const periodLower = selectedPeriod.toLowerCase();
        if (periodLower.includes('day')) {
          query = query.ilike('pricing_period', '%day%');
        } else if (periodLower.includes('week')) {
          query = query.ilike('pricing_period', '%week%');
        } else if (periodLower.includes('month')) {
          query = query.ilike('pricing_period', '%month%');
        } else if (periodLower.includes('event')) {
          query = query.ilike('pricing_period', '%event%');
        }
      }

      // Ordering
      query = query
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error || !data) {
        console.warn('Error fetching rental feed from Supabase:', error?.message);
        return { items: [], totalCount: 0, hasMore: false };
      }

      let mappedItems = await Promise.all(data.map((row: any) => this.mapListingRowToFeaturedItem(row)));

      // In-memory strict AND filtering for category, location, and search text
      mappedItems = mappedItems.filter((item) => {
        // Location match
        if (selectedLocation && selectedLocation !== 'All Sri Lanka') {
          if (!matchesLocation(item.location, selectedLocation)) {
            return false;
          }
        }

        // Category match
        if (selectedCategory && selectedCategory !== 'All Categories') {
          const catName = selectedCategory.toLowerCase();
          const itemCat = (item.category || '').toLowerCase();
          const itemType = (item.categoryType || '').toLowerCase();

          const matchesCategory =
            itemCat.includes(catName) ||
            catName.includes(itemCat) ||
            itemType.includes(catName) ||
            (catName.includes('property') && (itemCat.includes('property') || itemType.includes('house') || itemType.includes('villa') || itemType.includes('apartment') || itemType.includes('commercial'))) ||
            (catName.includes('rooms') && (itemCat.includes('room') || itemType.includes('room') || itemType.includes('boarding'))) ||
            (catName.includes('vehicles') && (itemCat.includes('vehicle') || itemType.includes('car') || itemType.includes('bike') || itemType.includes('van') || itemType.includes('truck'))) ||
            (catName.includes('event') && (itemCat.includes('event') || itemType.includes('event hall') || itemType.includes('hall') || itemType.includes('sound'))) ||
            (catName.includes('equipment') && (itemCat.includes('equipment') || itemType.includes('tool') || itemType.includes('generator'))) ||
            (catName.includes('electronics') && (itemCat.includes('electronic') || itemType.includes('camera') || itemType.includes('laptop') || itemType.includes('tv'))) ||
            (catName.includes('furniture') && (itemCat.includes('furniture') || itemType.includes('sofa') || itemType.includes('desk') || itemType.includes('bed')));

          if (!matchesCategory) return false;
        }

        // Search text match (AND words)
        if (searchQuery.trim()) {
          const qWords = searchQuery.trim().toLowerCase().split(/\s+/);
          const fullText = `${item.title} ${item.category} ${item.categoryType} ${item.location} ${(item.tags || []).join(' ')}`.toLowerCase();
          const allMatched = qWords.every(w => fullText.includes(w));
          if (!allMatched) return false;
        }

        return true;
      });

      const totalCount = count || mappedItems.length;
      const hasMore = (offset + data.length) < totalCount;

      return {
        items: mappedItems,
        totalCount,
        hasMore
      };
    } catch (e) {
      console.error('Error in getRentalFeed:', e);
      return { items: [], totalCount: 0, hasMore: false };
    }
  }

  /**
   * 5. RENTAL CATEGORIES
   * module = 'rental' AND status = 'active'
   */
  static async getRentalCategories(): Promise<RentalCategoryRecord[]> {
    try {
      const res = await CategoryService.getCategories('rental');
      const cats = res.data;

      // Group into parent/child hierarchy
      const mainCats: RentalCategoryRecord[] = [];
      const subMap = new Map<string, RentalCategoryRecord[]>();

      cats.forEach((cat) => {
        const item: RentalCategoryRecord = {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          parentId: cat.parent_id,
          level: cat.level,
          sortOrder: cat.sort_order,
          iconKey: cat.icon_key,
          description: cat.description,
          children: []
        };

        if (!cat.parent_id || cat.level === 1) {
          mainCats.push(item);
        } else {
          const subs = subMap.get(cat.parent_id) || [];
          subs.push(item);
          subMap.set(cat.parent_id, subs);
        }
      });

      mainCats.forEach((main) => {
        main.children = subMap.get(main.id) || [];
      });

      return mainCats;
    } catch (e) {
      console.warn('Error fetching rental categories:', e);
      return [];
    }
  }

  /**
   * 6. LOG LOCATION SEARCH EVENT
   */
  static async logLocationSearchEvent(locationName: string, moduleName: string = 'rental'): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return; // Only for logged in user

      await supabase
        .from('location_search_events')
        .insert({
          user_id: user.id,
          module: moduleName,
          location_name: locationName,
          created_at: new Date().toISOString()
        });
    } catch (e) {
      // Non-critical background telemetry logging
    }
  }

  /**
   * Private Helper: Map database listing row to UI FeaturedListingItem
   */
  private static async mapListingRowToFeaturedItem(
    row: any,
    badgeTypeFallback: 'FEATURED' | 'VERIFIED' | 'POPULAR' | 'NEW' = 'POPULAR'
  ): Promise<FeaturedListingItem> {
    let coverPath: string | null = null;
    if (row.listing_media && row.listing_media.length > 0) {
      const sortedMedia = [...row.listing_media].sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
      coverPath = sortedMedia[0]?.storage_path || null;
    }

    const imageUrl = await this.resolveMediaUrl(coverPath);

    let priceFormatted = 'Contact for Price';
    let pricePeriod = '/ Month';

    if (row.price != null && row.price > 0) {
      priceFormatted = `Rs. ${Number(row.price).toLocaleString()}`;
      if (row.pricing_period) {
        pricePeriod = row.pricing_period.startsWith('/') ? row.pricing_period : `/ ${row.pricing_period}`;
      }
    } else {
      const rates = row.rental_details?.rates;
      if (rates?.monthly) {
        priceFormatted = `Rs. ${Number(rates.monthly).toLocaleString()}`;
        pricePeriod = '/ Month';
      } else if (rates?.daily) {
        priceFormatted = `Rs. ${Number(rates.daily).toLocaleString()}`;
        pricePeriod = '/ Day';
      }
    }

    const categoryName = row.categories?.name || 'Property';
    const locationName = row.locations?.name || 'Sri Lanka';
    const badgeType = row.is_featured ? 'FEATURED' : badgeTypeFallback;

    return {
      id: row.id,
      title: row.title,
      category: categoryName,
      categoryType: (categoryName.toUpperCase() as any) || 'PROPERTY',
      badgeType,
      badgeColor: '#1464F4',
      location: locationName,
      price: priceFormatted,
      pricePeriod,
      imageUrl,
      rating: 4.8,
      reviewsCount: 12,
      isSaved: false,
      specs: [
        { icon: 'Bed', label: 'Listing' },
        { icon: 'Bath', label: 'Verified' }
      ],
      tags: ['Verified', 'Rental']
    };
  }
}
