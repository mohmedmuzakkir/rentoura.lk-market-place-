import { supabase } from '../lib/supabase';
import { JOB_HERO_SLIDES, JobHeroSlide } from '../data/jobHeroSlidesData';
import { JobItem, CompanyPartner } from '../types';
import { LocationValueModel } from './locationService';
import { SearchService } from './searchService';

export interface JobFeedParams {
  searchQuery?: string;
  selectedLocation?: string;
  selectedLocationObj?: LocationValueModel;
  selectedCategory?: string;
  selectedCategoryId?: string;
  selectedJobType?: string;
  selectedSalary?: string;
  selectedCompany?: string;
  isRemoteOnly?: boolean;
  isFeaturedOnly?: boolean;
  offset?: number;
  limit?: number;
}

export interface JobFeedResult {
  items: JobItem[];
  totalCount: number;
  hasMore: boolean;
}

export class JobService {
  /**
   * Helper: Resolves image storage path in private bucket 'listing-images'
   */
  public static async resolveMediaUrl(storagePath: string | null | undefined): Promise<string> {
    const fallbackImage = SearchService.NEUTRAL_PLACEHOLDER;
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
      console.warn('Error signing job image URL:', e);
    }

    return fallbackImage;
  }

  /**
   * 1. JOBS HERO SLIDES (placement = 'jobs')
   */
  static async getJobHeroSlides(): Promise<JobHeroSlide[]> {
    try {
      const { data, error } = await supabase
        .from('home_slides')
        .select('*')
        .eq('is_active', true)
        .eq('placement', 'jobs')
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return JOB_HERO_SLIDES;
      }

      return data.map((row) => ({
        id: row.id,
        module: 'jobs' as const,
        themeColor: '#08A34F',
        title: row.title || 'Find Your',
        titleHighlight: row.title_highlight || 'Dream Job',
        subtitle: row.subtitle || '',
        description: row.description || '',
        imageUrl: row.image_url || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
        mobileImageUrl: row.mobile_image_url || undefined,
        ctaLabel: row.cta_text || 'Explore All Jobs',
        ctaRoute: (row.cta_route || '/jobs') as any,
        ctaAction: (row.cta_action as any) || 'explore',
        displayOrder: row.display_order ?? 1,
        durationMs: row.duration_ms ?? 5000,
        overlayStrength: row.overlay_strength ?? 0.65,
        isEnabled: true
      }));
    } catch (e) {
      console.warn('Error fetching jobs hero slides, falling back to local slides:', e);
      return JOB_HERO_SLIDES;
    }
  }

  /**
   * 2. TOP HIRING COMPANIES (from public.job_companies)
   */
  static async getHiringCompanies(): Promise<CompanyPartner[]> {
    try {
      const { data, error } = await supabase
        .from('job_companies')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('display_order', { ascending: true })
        .order('name', { ascending: true });

      if (error || !data || data.length === 0) {
        return [];
      }

      return Promise.all(data.map(async row => ({
        id: row.id,
        name: row.name,
        brandKey: row.brand_key || 'custom',
        subtitle: row.subtitle || row.short_description || undefined,
        logoUrl: row.logo_url ? await JobService.resolveMediaUrl(row.logo_url) : undefined,
      })));
    } catch (e) {
      console.warn('Error fetching hiring companies:', e);
      return [];
    }
  }

  /**
   * 3. MAIN JOBS FEED QUERY (from public.job_marketplace_view)
   */
  static async getJobsFeed(params: JobFeedParams): Promise<JobFeedResult> {
    const {
      searchQuery = '',
      selectedLocation = 'All Sri Lanka',
      selectedLocationObj,
      selectedCategory = 'All Categories',
      selectedCategoryId,
      selectedJobType = 'All Types',
      selectedSalary = 'Any Salary',
      selectedCompany,
      isRemoteOnly = false,
      isFeaturedOnly = false,
      offset = 0,
      limit = 12
    } = params;

    try {
      let query = supabase
        .from('job_marketplace_view')
        .select('*', { count: 'exact' })
        .eq('status', 'active');

      // 1. Search Query: tokenized AND search across job_search_text
      if (searchQuery.trim()) {
        const tokens = searchQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
        for (const token of tokens) {
          query = query.ilike('job_search_text', `%${token}%`);
        }
      }

      // 2. Location Filter
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
      } else if (selectedLocation && selectedLocation !== 'All Sri Lanka') {
        const locToken = selectedLocation.trim().toLowerCase();
        query = query.ilike('job_search_text', `%${locToken}%`);
      }

      // 3. Category Filter
      if (selectedCategoryId) {
        query = query.eq('category_id', selectedCategoryId);
      } else if (selectedCategory && selectedCategory !== 'All Categories') {
        query = query.ilike('category_name', `%${selectedCategory}%`);
      }

      // 4. Job Type Filter
      if (selectedJobType && selectedJobType !== 'All Types') {
        if (selectedJobType.toLowerCase() === 'remote') {
          query = query.or('is_remote.eq.true,work_mode.ilike.%remote%,employment_type.ilike.%remote%');
        } else {
          query = query.or(`employment_type.ilike.%${selectedJobType}%,work_mode.ilike.%${selectedJobType}%`);
        }
      }

      // 5. Salary Filter (Numeric DB constraints)
      if (selectedSalary && selectedSalary !== 'Any Salary') {
        if (selectedSalary === '< Rs. 50,000') {
          query = query.or('price.lt.50000,minimum_price.lt.50000');
        } else if (selectedSalary === 'Rs. 50,000 - 100,000') {
          query = query.or('and(price.gte.50000,price.lte.100000),and(minimum_price.lte.100000,maximum_price.gte.50000),and(minimum_price.gte.50000,minimum_price.lte.100000)');
        } else if (selectedSalary === 'Rs. 100,000 - 200,000') {
          query = query.or('and(price.gte.100000,price.lte.200000),and(minimum_price.lte.200000,maximum_price.gte.100000),and(minimum_price.gte.100000,minimum_price.lte.200000)');
        } else if (selectedSalary === 'Rs. 200,000+') {
          query = query.or('price.gte.200000,minimum_price.gte.200000,maximum_price.gte.200000');
        }
      }

      // 6. Company Filter
      if (selectedCompany) {
        query = query.ilike('company_name', `%${selectedCompany}%`);
      }

      // 7. Remote Only Toggle
      if (isRemoteOnly) {
        query = query.or('is_remote.eq.true,work_mode.ilike.%remote%,employment_type.ilike.%remote%');
      }

      // 8. Featured Only
      if (isFeaturedOnly) {
        query = query.eq('is_featured', true);
      }

      const { data, count, error } = await query
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error querying job_marketplace_view:', error.message);
        return { items: [], totalCount: 0, hasMore: false };
      }

      if (!data || data.length === 0) {
        return { items: [], totalCount: count || 0, hasMore: false };
      }

      const mappedItems: JobItem[] = await Promise.all(data.map(async (row: any) => {
        const catName = row.category_name || 'General';
        const companyName = row.company_name || 'Employer';
        const empType = row.employment_type || row.work_mode || 'Full Time';
        const isRem = Boolean(row.is_remote);

        let salaryStr = 'Negotiable';
        if (row.minimum_price && row.maximum_price) {
          salaryStr = `Rs. ${Number(row.minimum_price).toLocaleString()} - ${Number(row.maximum_price).toLocaleString()}`;
        } else if (row.minimum_price) {
          salaryStr = `Rs. ${Number(row.minimum_price).toLocaleString()}`;
        } else if (row.price) {
          salaryStr = `Rs. ${Number(row.price).toLocaleString()}`;
        }

        const period = row.pricing_period ? `/ ${row.pricing_period}` : (row.salary_type ? `/ ${row.salary_type}` : '/ Month');
        const logoUrl = row.company_logo_url ? await JobService.resolveMediaUrl(row.company_logo_url) : undefined;

        let tagsArr: string[] = [];
        if (row.skills_text) {
          tagsArr = row.skills_text.split(',').map((s: string) => s.trim()).filter(Boolean).slice(0, 3);
        }
        if (tagsArr.length === 0) {
          tagsArr = [empType, isRem ? 'Remote' : 'On-site'];
        }

        let timeLabel = 'Recently';
        if (row.published_at || row.created_at) {
          const date = new Date(row.published_at || row.created_at);
          const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays === 0) timeLabel = 'Today';
          else if (diffDays === 1) timeLabel = 'Yesterday';
          else if (diffDays < 7) timeLabel = `${diffDays} days ago`;
          else timeLabel = date.toLocaleDateString();
        }

        return {
          id: row.id,
          title: row.title,
          company: companyName,
          companyId: row.owner_id || 'company',
          logoType: 'custom',
          logoUrl,
          location: row.location || row.exact_address || 'Sri Lanka',
          jobType: empType,
          salary: salaryStr,
          salaryPeriod: period,
          tags: tagsArr,
          isFeatured: Boolean(row.is_featured),
          postedTime: timeLabel,
          isRemote: isRem,
          category: catName,
          description: row.description || row.short_summary || ''
        };
      }));

      const totalCount = count || mappedItems.length;
      const hasMore = offset + mappedItems.length < totalCount;

      return {
        items: mappedItems,
        totalCount,
        hasMore
      };
    } catch (e) {
      console.error('Exception fetching jobs from Supabase view:', e);
      return { items: [], totalCount: 0, hasMore: false };
    }
  }
}
