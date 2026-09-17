import { supabase } from '../lib/supabase';
import { HeroSlide } from '../types/heroSlide';
import { FeaturedListingItem, LocationItem } from '../types';
import { FeedListingItem } from '../components/HomeListingFeed';
import { LocationService } from './locationService';
import { getLocationImage } from '../data/locationImages';
import { SearchService } from './searchService';

export interface MarketplaceStats {
  totalActiveListings: number;
  activeRentalCount: number;
  activeJobCount: number;
  activeServiceCount: number;
}

export class HomeService {
  /**
   * Helper: Resolves image storage path in private bucket 'listing-images' using signed URL.
   * Does NOT use getPublicUrl fallback as bucket is private. Returns empty string if missing or error.
   */
  public static async resolveSignedMediaUrl(storagePath: string | null | undefined): Promise<string> {
    if (!storagePath) return SearchService.NEUTRAL_PLACEHOLDER;
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
    return SearchService.NEUTRAL_PLACEHOLDER;
  }

  /**
   * Helper: Batched resolution of image storage paths in private bucket 'listing-images' using signed URLs.
   * Makes ONE single request to supabase.storage.from('listing-images').createSignedUrls(paths, expiry).
   */
  public static async resolveSignedMediaUrlsBatch(
    storagePaths: (string | null | undefined)[],
    expirySeconds: number = 3600
  ): Promise<Map<string, string>> {
    const urlMap = new Map<string, string>();
    const pathsToSign: string[] = [];

    for (const path of storagePaths) {
      if (!path) continue;
      if (path.startsWith('http://') || path.startsWith('https://')) {
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
              urlMap.set(item.path, item.signedUrl);
            }
          });
        }
      } catch (e) {
        console.warn('Error batch signing listing image URLs:', e);
      }
    }

    return urlMap;
  }

  /**
   * 1. HERO SLIDES
   * Fetches hero slides from Supabase `home_slides` table where placement='home' and is_active=true.
   * The database is the canonical source; no browser-local production slides are fabricated.
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
        return [];
      }

      return data.map((row) => ({
        id: row.id,
        title: row.title || 'RENTOURA.LK',
        subtitle: row.subtitle || '',
        description: row.description || '',
        imageUrl: row.image_url || SearchService.NEUTRAL_PLACEHOLDER,
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
      console.warn('Failed to load canonical hero slides:', e);
      return [];
    }
  }

  /**
   * 2. MARKETPLACE STATISTICS
   * Returns exact counts of active listings in Supabase. Parallelized with Promise.all.
   */
  static async getMarketplaceStats(): Promise<MarketplaceStats> {
    try {
      const [totalRes, rentalRes, jobRes, serviceRes] = await Promise.all([
        supabase.from('listings').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('listings').select('id', { count: 'exact', head: true }).eq('status', 'active').eq('module', 'rental'),
        supabase.from('listings').select('id', { count: 'exact', head: true }).eq('status', 'active').eq('module', 'job'),
        supabase.from('listings').select('id', { count: 'exact', head: true }).eq('status', 'active').eq('module', 'service')
      ]);

      return {
        totalActiveListings: totalRes.count || 0,
        activeRentalCount: rentalRes.count || 0,
        activeJobCount: jobRes.count || 0,
        activeServiceCount: serviceRes.count || 0
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
   * Fetches featured listings where status = 'active' and is_featured = true.
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
          module_data,
          created_at,
          published_at,
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

      const rawPaths: (string | null | undefined)[] = data.map((row: any) => {
        if (row.listing_media && row.listing_media.length > 0) {
          const sorted = [...row.listing_media].sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0));
          return sorted[0]?.storage_path;
        }
        return null;
      });

      const urlMap = await this.resolveSignedMediaUrlsBatch(rawPaths, 3600);

      const items = data.map((row: any) => {
        const rawMod = row.module || 'rental';
        const normMod = rawMod === 'rental' ? 'RENTAL' : (rawMod === 'job' ? 'JOB' : 'SERVICE');
        const badgeColor = normMod === 'RENTAL' ? '#1464F4' : (normMod === 'JOB' ? '#08A34F' : '#FF650A');
        
        let coverImg = SearchService.NEUTRAL_PLACEHOLDER;
        if (row.listing_media && row.listing_media.length > 0) {
          const sorted = [...row.listing_media].sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0));
          const storagePath = sorted[0]?.storage_path;
          if (storagePath) {
            coverImg = urlMap.get(storagePath) || SearchService.NEUTRAL_PLACEHOLDER;
          }
        }

        let price = 'Contact for Price';
        let pricePeriod = '/ Month';

        if (row.price != null && row.price > 0) {
          price = `LKR ${Number(row.price).toLocaleString()}`;
          if (row.pricing_period) pricePeriod = row.pricing_period;
        } else if (normMod === 'RENTAL') {
          const rates = row.module_data?.rates;
          if (rates?.monthly) price = `LKR ${Number(rates.monthly).toLocaleString()}`;
        } else if (normMod === 'JOB') {
          const salMin = row.module_data?.salary_min;
          if (salMin) price = `LKR ${Number(salMin).toLocaleString()}`;
          pricePeriod = 'Full Time';
        } else if (normMod === 'SERVICE') {
          const startingPrice = row.module_data?.starting_price;
          if (startingPrice) price = `From LKR ${Number(startingPrice).toLocaleString()}`;
          pricePeriod = 'Per Service';
        }

        const categoryName = row.categories?.name || (normMod === 'RENTAL' ? 'Property' : (normMod === 'JOB' ? 'Jobs' : 'Services'));
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

      return items;
    } catch (e) {
      console.error('Error fetching featured listings:', e);
      return [];
    }
  }

  /**
   * 4. LATEST LISTINGS FEED (PAGINATED)
   * Fetches active listings sorted by published_at DESC NULLS LAST, created_at DESC with pagination.
   */
  static async getLatestListingsFeed(
    page: number = 1,
    limit: number = 16,
    activeModule: string = 'all',
    userId?: string
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
          listing_media(storage_path, position),
          locations:city_id(name),
          categories:category_id(name)
        `, { count: 'exact' })
        .eq('status', 'active');

      if (activeModule !== 'all') {
        const targetModule = activeModule === 'rentals' ? 'rental' : (activeModule === 'jobs' ? 'job' : 'service');
        query = query.eq('module', targetModule);
      }

      const fromIndex = (page - 1) * limit;
      const toIndex = fromIndex + limit - 1;

      const { data, count, error } = await query
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
        .range(fromIndex, toIndex);

      if (error || !data) {
        return { items: [], totalCount: 0, hasMore: false };
      }

      const total = count || 0;
      const hasMore = toIndex < total - 1;

      const rawPaths: (string | null | undefined)[] = data.map((row: any) => {
        if (row.listing_media && row.listing_media.length > 0) {
          const sortedMedia = [...row.listing_media].sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0));
          return sortedMedia[0]?.storage_path;
        }
        return null;
      });

      const urlMap = await this.resolveSignedMediaUrlsBatch(rawPaths, 3600);

      const items: FeedListingItem[] = data.map((row: any) => {
        const rawMod = row.module || 'rental';
        const normMod: 'rentals' | 'jobs' | 'services' =
          rawMod === 'rental' ? 'rentals' : (rawMod === 'job' ? 'jobs' : 'services');

        let priceOrSalary = 'Contact for Price';
        let periodOrType = 'Fixed';

        if (row.price != null && row.price > 0) {
          priceOrSalary = `LKR ${Number(row.price).toLocaleString()}`;
          if (row.pricing_period) periodOrType = row.pricing_period;
        } else if (normMod === 'rentals') {
          const rates = row.module_data?.rates;
          if (rates?.monthly) {
            priceOrSalary = `LKR ${Number(rates.monthly).toLocaleString()}`;
            periodOrType = '/ Month';
          } else if (rates?.daily) {
            priceOrSalary = `LKR ${Number(rates.daily).toLocaleString()}`;
            periodOrType = '/ Day';
          }
        } else if (normMod === 'jobs') {
          const salMin = row.module_data?.salary_min;
          const salMax = row.module_data?.salary_max;
          if (salMin && salMax) {
            priceOrSalary = `LKR ${(salMin / 1000).toFixed(0)}k - ${(salMax / 1000).toFixed(0)}k`;
          } else if (salMin) {
            priceOrSalary = `LKR ${Number(salMin).toLocaleString()}`;
          }
          periodOrType = row.module_data?.employment_type || 'Full Time';
        } else if (normMod === 'services') {
          const startingPrice = row.module_data?.starting_price;
          if (startingPrice) {
            priceOrSalary = `From LKR ${Number(startingPrice).toLocaleString()}`;
          }
          periodOrType = row.module_data?.pricing_type || 'Per Service';
        }

        let coverUrl = SearchService.NEUTRAL_PLACEHOLDER;
        if (row.listing_media && row.listing_media.length > 0) {
          const sortedMedia = [...row.listing_media].sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0));
          const storagePath = sortedMedia[0]?.storage_path;
          if (storagePath) {
            coverUrl = urlMap.get(storagePath) || SearchService.NEUTRAL_PLACEHOLDER;
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
          postedDate: row.published_at || row.created_at || new Date().toISOString(),
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
   * 5. POPULAR LOCATIONS
   * Calls get_popular_locations RPC or resolves top active listing location UUIDs to the canonical 457 location dataset.
   */
  static async getPopularLocations(): Promise<(LocationItem & { searchCount?: number; listingCount?: number })[]> {
    try {
      const [allCanonicals, rpcRes] = await Promise.all([
        LocationService.getAllLocationsAsync(false),
        supabase.rpc('get_popular_locations')
      ]);
      const topLocationsMap = new Map<string, { location: any; searchCount: number; listingCount: number }>();

      // 1. First, pull featured popular locations from the canonical dataset
      allCanonicals.filter(c => c.isFeaturedPopular).forEach(match => {
        topLocationsMap.set(match.id, {
          location: match,
          searchCount: 99999, // Artificially boost featured locations
          listingCount: 0
        });
      });

      // 2. Try processing get_popular_locations RPC results
      const rpcData = rpcRes.data;
      const rpcErr = rpcRes.error;

      if (!rpcErr && Array.isArray(rpcData) && rpcData.length > 0) {
        rpcData.forEach((item: any) => {
          const locUuid = item.id || item.location_id;
          const match = allCanonicals.find(c => c.id === locUuid || c.code === item.code);
          if (match) {
            const existing = topLocationsMap.get(match.id);
            if (existing) {
              existing.searchCount += Number(item.search_count || item.total_searches || 0);
              existing.listingCount += Number(item.listing_count || item.active_listings || 0);
            } else {
              topLocationsMap.set(match.id, {
                location: match,
                searchCount: Number(item.search_count || item.total_searches || 0),
                listingCount: Number(item.listing_count || item.active_listings || 0)
              });
            }
          }
        });
      }

      // If map has less than 8 locations, populate from active listings distribution
      if (topLocationsMap.size < 8) {
        const { data: listingLocs } = await supabase
          .from('listings')
          .select('city_id, district_id, province_id')
          .eq('status', 'active');

        if (listingLocs) {
          listingLocs.forEach((l: any) => {
            const targetId = l.city_id || l.district_id || l.province_id;
            if (!targetId) return;
            const match = allCanonicals.find(c => c.id === targetId);
            if (match) {
              const existing = topLocationsMap.get(match.id);
              if (existing) {
                existing.listingCount += 1;
              } else {
                topLocationsMap.set(match.id, {
                  location: match,
                  searchCount: 0,
                  listingCount: 1
                });
              }
            }
          });
        }
      }

      // If still fewer than 8, pick top active provinces/districts from canonical dataset
      if (topLocationsMap.size < 8) {
        const topProvinces = allCanonicals.filter(c => c.type === 'province').slice(0, 8);
        topProvinces.forEach(p => {
          if (!topLocationsMap.has(p.id)) {
            topLocationsMap.set(p.id, {
              location: p,
              searchCount: 0,
              listingCount: 0
            });
          }
        });
      }

      const results = Array.from(topLocationsMap.values()).map(item => ({
        id: item.location.id,
        name: item.location.name,
        province: item.location.provinceName || item.location.parentName || 'Sri Lanka',
        imageUrl: item.location.imageUrl || getLocationImage(item.location.name, item.location.provinceName || item.location.parentName),
        listingsCount: `${item.listingCount} Ads`,
        searchCount: item.searchCount,
        listingCount: item.listingCount
      }));

      // Sort by searchCount DESC, then listingCount DESC
      results.sort((a, b) => (b.searchCount || 0) - (a.searchCount || 0) || (b.listingCount || 0) - (a.listingCount || 0));

      return results.slice(0, 8);
    } catch (e) {
      console.error('Error getting popular locations:', e);
      return [];
    }
  }

  /**
   * 6. RECORD LOCATION SEARCH / SELECTION ACTIVITY
   */
  static async recordLocationActivity(locationIdOrName: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(locationIdOrName);
      
      if (isUuid) {
        await supabase
          .from('location_search_events')
          .insert({
            location_id: locationIdOrName,
            user_id: user?.id || null,
            search_query: null
          });
      } else {
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
              user_id: user?.id || null,
              search_query: locationIdOrName
            });
        }
      }
    } catch (e) {
      // Ignore analytics logging failure
    }
  }
}

