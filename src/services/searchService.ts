import { supabase } from '../lib/supabase';

export interface SearchParams {
  query?: string;
  module?: 'all' | 'rentals' | 'jobs' | 'services' | 'rental' | 'job' | 'service';
  categoryId?: string | null;
  provinceId?: string | null;
  districtId?: string | null;
  cityId?: string | null;
  areaId?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  rentalPeriod?: string | null;
  jobType?: string | null;
  workMode?: string | null;
  pricingType?: string | null;
  emergencyService?: boolean | null;
  deliveryAvailable?: boolean | null;
  sort?: 'relevant' | 'newest' | 'price_low' | 'price_high';
  limit?: number;
  offset?: number;
}

export interface SearchCounts {
  all: number;
  rentals: number;
  jobs: number;
  services: number;
}

export interface SearchResultItemRaw {
  id: string;
  module: 'rental' | 'job' | 'service';
  title: string;
  description?: string;
  category_id?: string;
  category_name?: string;
  category_path?: string;
  location_name?: string;
  province_id?: string;
  district_id?: string;
  city_id?: string;
  area_id?: string;
  price?: number;
  minimum_price?: number;
  maximum_price?: number;
  price_period?: string;
  company_name?: string;
  business_name?: string;
  job_type?: string;
  work_mode?: string;
  pricing_type?: string;
  service_type?: string;
  cover_storage_path?: string;
  media_urls?: string[];
  created_at?: string;
  cover_url?: string;
  status?: string;
}

export interface SearchResponse {
  counts: SearchCounts;
  selected_total: number;
  limit: number;
  offset: number;
  has_more: boolean;
  results: SearchResultItemRaw[];
}

export class SearchService {
  /**
   * Safe neutral SVG data URI placeholder for missing or failed images
   */
  public static NEUTRAL_PLACEHOLDER =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="%23F1F5F9"><rect width="600" height="400" fill="%23F1F5F9"/><g fill="%2394A3B8" transform="translate(260,160)"><path d="M40 0C17.9 0 0 17.9 0 40s17.9 40 40 40 40-17.9 40-40S62.1 0 40 0zm0 15c13.8 0 25 11.2 25 25S53.8 65 40 65 15 53.8 15 40s11.2-25 25-25z"/><path d="M28 30h24v5H28zm0 10h18v5H28zm0 10h24v5H28z"/></g></svg>';

  /**
   * Helper: Resolves private signed URL for cover_storage_path in private bucket 'listing-images'.
   * NEVER calls getPublicUrl() on private buckets.
   */
  public static async resolveCoverUrl(storagePath: string | null | undefined): Promise<string> {
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
      console.warn('Error signing cover image URL:', e);
    }

    // Never use getPublicUrl on private bucket; return safe neutral placeholder
    return SearchService.NEUTRAL_PLACEHOLDER;
  }

  /**
   * Executes RPC `search_marketplace` in Supabase with client-side fallback
   */
  public static async search(params: SearchParams): Promise<SearchResponse> {
    const defaultResponse: SearchResponse = {
      counts: { all: 0, rentals: 0, jobs: 0, services: 0 },
      selected_total: 0,
      limit: params.limit || 12,
      offset: params.offset || 0,
      has_more: false,
      results: []
    };

    try {
      let modParam = params.module || 'all';
      if (modParam === 'rentals') modParam = 'rental';
      if (modParam === 'jobs') modParam = 'job';
      if (modParam === 'services') modParam = 'service';

      const rpcArgs = {
        p_query: params.query?.trim() || null,
        p_module: modParam === 'all' ? null : modParam,
        p_category_id: params.categoryId || null,
        p_province_id: params.provinceId || null,
        p_district_id: params.districtId || null,
        p_city_id: params.cityId || null,
        p_area_id: params.areaId || null,
        p_min_price: params.minPrice ?? null,
        p_max_price: params.maxPrice ?? null,
        p_rental_period: params.rentalPeriod || null,
        p_job_type: params.jobType || null,
        p_work_mode: params.workMode || null,
        p_pricing_type: params.pricingType || null,
        p_emergency_service: params.emergencyService ?? null,
        p_delivery_available: params.deliveryAvailable ?? null,
        p_sort: params.sort || 'relevant',
        p_limit: params.limit || 12,
        p_offset: params.offset || 0
      };

      const { data, error } = await supabase.rpc('search_marketplace', rpcArgs);

      if (error) {
        console.warn('Supabase search_marketplace RPC error, falling back to listing_search_view:', error.message);
        return await SearchService.executeFallbackSearch(params, modParam);
      }

      if (!data) {
        return defaultResponse;
      }

      const resObj = typeof data === 'string' ? JSON.parse(data) : data;

      const counts: SearchCounts = {
        all: Number(resObj?.counts?.all || 0),
        rentals: Number(resObj?.counts?.rentals || 0),
        jobs: Number(resObj?.counts?.jobs || 0),
        services: Number(resObj?.counts?.services || 0)
      };

      const rawResults: any[] = Array.isArray(resObj?.results) ? resObj.results : [];

      // Resolve cover signed URLs in parallel
      const processedResults = await Promise.all(
        rawResults.map(async (item) => {
          const coverPath = item.cover_storage_path || (Array.isArray(item.media_urls) && item.media_urls[0]) || null;
          const coverUrl = await SearchService.resolveCoverUrl(coverPath);
          return {
            ...item,
            cover_url: coverUrl
          };
        })
      );

      return {
        counts,
        selected_total: Number(resObj?.selected_total || 0),
        limit: Number(resObj?.limit || params.limit || 12),
        offset: Number(resObj?.offset || params.offset || 0),
        has_more: Boolean(resObj?.has_more),
        results: processedResults
      };
    } catch (err) {
      console.error('Exception executing SearchService.search:', err);
      return defaultResponse;
    }
  }

  /**
   * Truthful client-side fallback query when RPC is absent or returns an error.
   * Performs real multi-module counts and predicate matching.
   */
  private static async executeFallbackSearch(params: SearchParams, modParam: string): Promise<SearchResponse> {
    try {
      const offset = params.offset || 0;
      const limit = params.limit || 12;

      let baseQuery = supabase
        .from('listing_search_view')
        .select('*', { count: 'exact' })
        .eq('status', 'active');

      if (params.categoryId) {
        baseQuery = baseQuery.eq('category_id', params.categoryId);
      }
      if (params.provinceId) {
        baseQuery = baseQuery.eq('province_id', params.provinceId);
      }
      if (params.districtId) {
        baseQuery = baseQuery.eq('district_id', params.districtId);
      }
      if (params.cityId) {
        baseQuery = baseQuery.eq('city_id', params.cityId);
      }
      if (params.areaId) {
        baseQuery = baseQuery.eq('area_id', params.areaId);
      }
      if (params.minPrice !== null && params.minPrice !== undefined) {
        baseQuery = baseQuery.or(`price.gte.${params.minPrice},minimum_price.gte.${params.minPrice}`);
      }
      if (params.maxPrice !== null && params.maxPrice !== undefined) {
        baseQuery = baseQuery.or(`price.lte.${params.maxPrice},maximum_price.lte.${params.maxPrice}`);
      }
      if (params.rentalPeriod) {
        baseQuery = baseQuery.or(`price_period.ilike.%${params.rentalPeriod}%`);
      }
      if (params.jobType) {
        baseQuery = baseQuery.or(`job_type.ilike.%${params.jobType}%`);
      }
      if (params.workMode) {
        baseQuery = baseQuery.or(`work_mode.ilike.%${params.workMode}%`);
      }
      if (params.pricingType) {
        baseQuery = baseQuery.or(`pricing_type.ilike.%${params.pricingType}%`);
      }
      if (params.query && params.query.trim() !== '') {
        const tokens = params.query.trim().toLowerCase().split(/\s+/).filter(t => t.length > 0);
        for (const token of tokens) {
          baseQuery = baseQuery.or(`title.ilike.%${token}%,description.ilike.%${token}%,search_text.ilike.%${token}%,category_name.ilike.%${token}%,location_name.ilike.%${token}%`);
        }
      }

      // 1. Fetch count for 'all'
      const { count: countAll } = await baseQuery;

      // 2. Fetch counts for modules
      const { count: countRentals } = await baseQuery.eq('module', 'rental');
      const { count: countJobs } = await baseQuery.eq('module', 'job');
      const { count: countServices } = await baseQuery.eq('module', 'service');

      const counts: SearchCounts = {
        all: countAll || 0,
        rentals: countRentals || 0,
        jobs: countJobs || 0,
        services: countServices || 0
      };

      // 3. Build query for active module page
      let activeQuery = baseQuery;
      if (modParam !== 'all') {
        activeQuery = activeQuery.eq('module', modParam);
      }

      // Sort
      if (params.sort === 'price_low') {
        activeQuery = activeQuery.order('price', { ascending: true, nullsFirst: false });
      } else if (params.sort === 'price_high') {
        activeQuery = activeQuery.order('price', { ascending: false, nullsFirst: false });
      } else {
        activeQuery = activeQuery.order('created_at', { ascending: false });
      }

      const { data: viewData, count: activeCount, error } = await activeQuery.range(offset, offset + limit - 1);

      if (error || !viewData) {
        return {
          counts,
          selected_total: 0,
          limit,
          offset,
          has_more: false,
          results: []
        };
      }

      const totalSelected = activeCount || viewData.length;

      const processedResults = await Promise.all(
        viewData.map(async (item: any) => {
          const coverPath = item.cover_storage_path || (Array.isArray(item.media_urls) && item.media_urls[0]) || null;
          const coverUrl = await SearchService.resolveCoverUrl(coverPath);
          return {
            ...item,
            cover_url: coverUrl
          };
        })
      );

      return {
        counts,
        selected_total: totalSelected,
        limit,
        offset,
        has_more: offset + limit < totalSelected,
        results: processedResults
      };
    } catch (e) {
      console.error('Error in executeFallbackSearch:', e);
      return {
        counts: { all: 0, rentals: 0, jobs: 0, services: 0 },
        selected_total: 0,
        limit: params.limit || 12,
        offset: params.offset || 0,
        has_more: false,
        results: []
      };
    }
  }
}
