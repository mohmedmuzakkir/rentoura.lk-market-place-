import { supabase } from '../lib/supabase';
import { HeroSlide } from '../types/heroSlide';
import { DEFAULT_HERO_SLIDES } from '../data/heroSlidesData';
import { FeaturedListingItem, LocationItem } from '../types';
import { FeedListingItem } from '../components/HomeListingFeed';
import { POPULAR_LOCATIONS } from '../data/mockData';

export interface MarketplaceStats {
  totalActiveListings: number;
  activeRentalCount: number;
  activeJobCount: number;
  activeServiceCount: number;
}

export class HomeService {
  /**
   * 1. HERO SLIDES
   * Fetches hero slides from Supabase `home_slides` table.
   * If table doesn't exist or query fails/empty, falls back safely to DEFAULT_HERO_SLIDES.
   */
  static async getHeroSlides(): Promise<HeroSlide[]> {
    try {
      const { data, error } = await supabase
        .from('home_slides')
        .select('*')
        .eq('is_active', true)
        .eq('placement', 'home')
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return DEFAULT_HERO_SLIDES;
      }

      return data.map((row) => ({
        id: row.id,
        title: row.title || 'RENTOURA.LK',
        subtitle: row.subtitle || '',
        description: row.description || '',
        imageUrl: row.image_url || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
        mobileImageUrl: row.mobile_image_url || undefined,
        module: (row.module || 'platform') as any,
        ctaLabel: row.cta_text || 'Explore Marketplace',
        ctaRoute: (row.cta_route || '/search') as any,
        themeColor: row.theme_color || '#1464F4',
        isEnabled: true,
        displayOrder: row.display_order ?? 1,
        autoplayDurationMs: row.duration_ms ?? 5000,
        overlayStrength: row.overlay_strength ?? 0.5
      }));
    } catch (e) {
      console.warn('Fallback to local hero slides due to:', e);
      return DEFAULT_HERO_SLIDES;
    }
  }

  /**
   * 2. MARKETPLACE STATISTICS
   * Returns exact counts of active/approved listings in Supabase.
   */
  static async getMarketplaceStats(): Promise<MarketplaceStats> {
    try {
      // Query overall active listings
      const { count: totalCount, error: totalErr } = await supabase
        .from('listings')
        .select('id', { count: 'exact', head: true })
        .in('status', ['active', 'approved']);

      if (totalErr) {
        return {
          totalActiveListings: 0,
          activeRentalCount: 0,
          activeJobCount: 0,
          activeServiceCount: 0
        };
      }

      // Query rentals count
      const { count: rentalCount } = await supabase
        .from('listings')
        .select('id', { count: 'exact', head: true })
        .in('status', ['active', 'approved'])
        .in('module', ['rental', 'rentals']);

      // Query jobs count
      const { count: jobCount } = await supabase
        .from('listings')
        .select('id', { count: 'exact', head: true })
        .in('status', ['active', 'approved'])
        .in('module', ['job', 'jobs']);

      // Query services count
      const { count: serviceCount } = await supabase
        .from('listings')
        .select('id', { count: 'exact', head: true })
        .in('status', ['active', 'approved'])
        .in('module', ['service', 'services']);

      return {
        totalActiveListings: totalCount || 0,
        activeRentalCount: rentalCount || 0,
        activeJobCount: jobCount || 0,
        activeServiceCount: serviceCount || 0
      };
    } catch (e) {
      console.error('Error fetching marketplace stats:', e);
      return {
        totalActiveListings: 0,
        activeRentalCount: 0,
        activeJobCount: 0,
        activeServiceCount: 0
      };
    }
  }

  /**
   * 3. FEATURED LISTINGS
   * Fetches featured listings where status = 'active' or 'approved' and featured/is_featured = true.
   */
  static async getFeaturedListings(): Promise<FeaturedListingItem[]> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          id,
          title,
          module,
          price,
          pricing_period,
          is_featured,
          created_at,
          published_at,
          rental_details(rates),
          job_details(salary_min, salary_max, salary_type),
          service_details(starting_price),
          listing_media(storage_path, position),
          locations:city_id(name),
          categories:category_id(name)
        `)
        .eq('status', 'active')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (error || !data) {
        return [];
      }

      return data.map((row: any) => {
        const rawMod = row.module || 'rental';
        const normMod = (rawMod === 'rental' || rawMod === 'rentals') ? 'RENTAL' : ((rawMod === 'job' || rawMod === 'jobs') ? 'JOB' : 'SERVICE');
        const badgeColor = normMod === 'RENTAL' ? '#1464F4' : (normMod === 'JOB' ? '#08A34F' : '#FF650A');
        
        let coverImg = 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80';
        if (row.listing_media && row.listing_media.length > 0) {
          const sorted = [...row.listing_media].sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
          if (sorted[0]?.storage_path) coverImg = sorted[0].storage_path;
        }

        let price = 'Contact for Price';
        let pricePeriod = '/ Month';

        if (row.price != null && row.price > 0) {
          price = `LKR ${Number(row.price).toLocaleString()}`;
          if (row.pricing_period) pricePeriod = row.pricing_period;
        } else if (normMod === 'RENTAL') {
          const rates = row.rental_details?.rates;
          if (rates?.monthly) price = `LKR ${Number(rates.monthly).toLocaleString()}`;
        } else if (normMod === 'JOB') {
          const salMin = row.job_details?.salary_min;
          if (salMin) price = `LKR ${Number(salMin).toLocaleString()}`;
          pricePeriod = 'Full Time';
        } else if (normMod === 'SERVICE') {
          const startingPrice = row.service_details?.starting_price;
          if (startingPrice) price = `From LKR ${Number(startingPrice).toLocaleString()}`;
          pricePeriod = 'Per Service';
        }

        const categoryName = row.categories?.name || 'Property';
        const locationName = row.locations?.name || 'Sri Lanka';

        return {
          id: row.id,
          title: row.title,
          category: categoryName,
          categoryType: 'HOUSE' as const,
          badgeType: 'FEATURED' as const,
          badgeColor,
          location: locationName,
          price,
          pricePeriod,
          imageUrl: coverImg,
          isSaved: false
        };
      });
    } catch (e) {
      console.error('Error fetching featured listings:', e);
      return [];
    }
  }

  /**
   * 4. LATEST LISTINGS FEED (PAGINATED)
   * Fetches public listings sorted by published_at DESC / created_at DESC with pagination.
   */
  static async getLatestListingsFeed(
    page: number = 1,
    limit: number = 16,
    activeModule: string = 'all'
  ): Promise<{ items: FeedListingItem[]; totalCount: number; hasMore: boolean }> {
    try {
      let query = supabase
        .from('listings')
        .select(`
          id,
          title,
          module,
          category_id,
          subcategory_id,
          price,
          pricing_period,
          module_data,
          created_at,
          published_at,
          approved_at,
          rental_details(rates, attributes),
          job_details(company_name, salary_min, salary_max, salary_type, employment_type),
          service_details(starting_price, pricing_type),
          listing_media(storage_path, position),
          locations:city_id(name),
          categories:category_id(name)
        `, { count: 'exact' })
        .in('status', ['active', 'approved']);

      if (activeModule !== 'all') {
        const targetModule = activeModule === 'rentals' ? 'rental' : (activeModule === 'jobs' ? 'job' : 'service');
        query = query.in('module', [targetModule, activeModule]);
      }

      const fromIndex = (page - 1) * limit;
      const toIndex = fromIndex + limit - 1;

      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(fromIndex, toIndex);

      if (error || !data) {
        return { items: [], totalCount: 0, hasMore: false };
      }

      const total = count || 0;
      const hasMore = toIndex < total - 1;

      const items: FeedListingItem[] = data.map((row: any) => {
        const rawMod = row.module || 'rental';
        const normMod: 'rentals' | 'jobs' | 'services' =
          (rawMod === 'rental' || rawMod === 'rentals') ? 'rentals' : ((rawMod === 'job' || rawMod === 'jobs') ? 'jobs' : 'services');

        let priceOrSalary = 'Contact for Price';
        let periodOrType = 'Fixed';

        if (row.price != null && row.price > 0) {
          priceOrSalary = `LKR ${Number(row.price).toLocaleString()}`;
          if (row.pricing_period) periodOrType = row.pricing_period;
        } else if (normMod === 'rentals') {
          const rates = row.rental_details?.rates || row.module_data?.rates;
          if (rates?.monthly) {
            priceOrSalary = `LKR ${Number(rates.monthly).toLocaleString()}`;
            periodOrType = '/ Month';
          } else if (rates?.daily) {
            priceOrSalary = `LKR ${Number(rates.daily).toLocaleString()}`;
            periodOrType = '/ Day';
          }
        } else if (normMod === 'jobs') {
          const salMin = row.job_details?.salary_min || row.module_data?.salary_min;
          const salMax = row.job_details?.salary_max || row.module_data?.salary_max;
          if (salMin && salMax) {
            priceOrSalary = `LKR ${(salMin / 1000).toFixed(0)}k - ${(salMax / 1000).toFixed(0)}k`;
          } else if (salMin) {
            priceOrSalary = `LKR ${Number(salMin).toLocaleString()}`;
          }
          periodOrType = row.job_details?.employment_type || row.module_data?.employment_type || 'Full Time';
        } else if (normMod === 'services') {
          const startingPrice = row.service_details?.starting_price || row.module_data?.starting_price;
          if (startingPrice) {
            priceOrSalary = `From LKR ${Number(startingPrice).toLocaleString()}`;
          }
          periodOrType = row.service_details?.pricing_type || row.module_data?.pricing_type || 'Per Service';
        }

        let coverUrl = 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80';
        if (normMod === 'jobs') coverUrl = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80';
        if (normMod === 'services') coverUrl = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80';

        if (row.listing_media && row.listing_media.length > 0) {
          const sortedMedia = [...row.listing_media].sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
          if (sortedMedia[0]?.storage_path) {
            coverUrl = sortedMedia[0].storage_path;
          }
        }

        const badgeLabel = normMod === 'rentals' ? 'Rental' : (normMod === 'jobs' ? 'Job' : 'Service');
        const badgeColor = normMod === 'rentals' ? '#1464F4' : (normMod === 'jobs' ? '#08A34F' : '#FF650A');
        const locationName = row.locations?.name || 'Sri Lanka';
        const categoryName = row.categories?.name || (normMod === 'rentals' ? 'Property' : (normMod === 'jobs' ? 'Opportunities' : 'Service'));

        return {
          id: row.id,
          title: row.title,
          module: normMod,
          category: categoryName,
          location: locationName,
          priceOrSalary,
          periodOrType,
          imageUrl: coverUrl,
          postedDate: row.published_at || row.approved_at || row.created_at || new Date().toISOString(),
          badgeLabel,
          badgeColor
        };
      });

      return { items, totalCount: total, hasMore };
    } catch (e) {
      console.error('Error fetching latest listings feed:', e);
      return { items: [], totalCount: 0, hasMore: false };
    }
  }

  /**
   * 5. POPULAR LOCATIONS WITH GENUINE LISTING COUNTS
   */
  /**
   * 5. POPULAR LOCATIONS
   * Popularity ranking is driven by search/filter events from `location_search_events`.
   * Listing counts are separately computed from active listings in `listings`.
   */
  static async getPopularLocations(): Promise<(LocationItem & { searchCount?: number; listingCount?: number })[]> {
    try {
      // 1. Fetch search/filter activity from location_search_events
      const { data: searchEvents } = await supabase
        .from('location_search_events')
        .select('location_id');

      const searchCountsMap: Record<string, number> = {};
      if (searchEvents) {
        searchEvents.forEach((ev: any) => {
          if (ev.location_id) {
            searchCountsMap[ev.location_id] = (searchCountsMap[ev.location_id] || 0) + 1;
          }
        });
      }

      // 2. Fetch active listing count per district/city from listings
      const { data: listingLocations } = await supabase
        .from('listings')
        .select('district_id, city_id')
        .eq('status', 'active');

      const listingCountsMap: Record<string, number> = {};
      if (listingLocations) {
        listingLocations.forEach((item: any) => {
          if (item.city_id) listingCountsMap[item.city_id] = (listingCountsMap[item.city_id] || 0) + 1;
          if (item.district_id) listingCountsMap[item.district_id] = (listingCountsMap[item.district_id] || 0) + 1;
        });
      }

      // 3. Map POPULAR_LOCATIONS with distinct searchCount (popularity) and listingCount (supply)
      const mappedLocations = POPULAR_LOCATIONS.map(loc => {
        const searchCount = searchCountsMap[loc.id] || 0;
        const listingCount = listingCountsMap[loc.id] || 0;
        return {
          ...loc,
          searchCount,
          listingCount
        };
      });

      // Sort by popularity ranking (searchCount DESC)
      mappedLocations.sort((a, b) => (b.searchCount || 0) - (a.searchCount || 0));

      return mappedLocations;
    } catch (e) {
      console.error('Error getting popular locations:', e);
      return POPULAR_LOCATIONS.map(loc => ({ ...loc, searchCount: 0, listingCount: 0 }));
    }
  }

  /**
   * 6. RECORD LOCATION SEARCH / SELECTION ACTIVITY
   */
  static async recordLocationActivity(locationIdOrName: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // If locationIdOrName is UUID, insert directly into location_search_events
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(locationIdOrName);
      
      if (isUuid) {
        await supabase
          .from('location_search_events')
          .insert({
            location_id: locationIdOrName,
            user_id: user.id,
            event_type: 'search'
          });
      } else {
        // Try finding location id from locations table by name
        const { data: loc } = await supabase
          .from('locations')
          .select('id')
          .ilike('name', locationIdOrName.split(',')[0].trim())
          .limit(1)
          .maybeSingle();

        if (loc?.id) {
          await supabase
            .from('location_search_events')
            .insert({
              location_id: loc.id,
              user_id: user.id,
              event_type: 'search'
            });
        }
      }
    } catch (e) {
      // Ignore background analytics error
    }
  }
}
