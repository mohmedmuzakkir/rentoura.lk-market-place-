import { supabase } from '../lib/supabase';

export interface SearchParams {
  query?: string;
  module?: 'all' | 'rentals' | 'jobs' | 'services' | 'rental' | 'job' | 'service';
  categoryId?: string | null;
  provinceId?: number | null;
  districtId?: number | null;
  cityId?: number | null;
  areaId?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
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
  province_id?: number;
  district_id?: number;
  city_id?: number;
  area_id?: number;
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
   * Helper: Resolves private signed URL for cover_storage_path
   */
  public static async resolveCoverUrl(storagePath: string | null | undefined): Promise<string> {
    const fallbackImage = 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80';
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
      console.warn('Error signing cover image URL:', e);
    }

    const { data: pubData } = supabase.storage.from('listing-images').getPublicUrl(storagePath);
    return pubData?.publicUrl || fallbackImage;
  }

  /**
   * Executes RPC `search_marketplace` in Supabase
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
        p_province_id: params.provinceId ?? null,
        p_district_id: params.districtId ?? null,
        p_city_id: params.cityId ?? null,
        p_area_id: params.areaId ?? null,
        p_min_price: params.minPrice ?? null,
        p_max_price: params.maxPrice ?? null,
        p_sort: params.sort || 'relevant',
        p_limit: params.limit || 12,
        p_offset: params.offset || 0
      };

      const { data, error } = await supabase.rpc('search_marketplace', rpcArgs);

      if (error) {
        console.warn('Supabase search_marketplace RPC error:', error.message);
        return defaultResponse;
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
      console.error('Error executing SearchService.search:', err);
      return defaultResponse;
    }
  }
}
