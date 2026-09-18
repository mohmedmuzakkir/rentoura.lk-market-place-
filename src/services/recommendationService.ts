import { supabase } from '../lib/supabase';
import { SearchService } from './searchService';
import { HomeService } from './homeService';

export interface RecommendedListingCardItem {
  id: string;
  title: string;
  module: 'rental' | 'job' | 'service';
  routeModule: 'rentals' | 'jobs' | 'services';
  categoryName: string;
  locationName: string;
  priceOrSalary: string;
  periodOrType: string;
  imageUrl: string;
  badgeLabel: 'RENTAL' | 'JOB' | 'SERVICE';
  badgeColor: string;
  badgeStyle: string;
  createdAt?: string;
}

export interface GetRecommendationsParams {
  currentListingId: string;
  module: 'rental' | 'job' | 'service' | 'rentals' | 'jobs' | 'services';
  categoryId?: string | null;
  limit?: number;
}

export class RecommendationService {
  /**
   * Normalizes module name string to standard singular and route plural formats
   */
  private static normalizeModule(moduleInput: string): {
    singular: 'rental' | 'job' | 'service';
    plural: 'rentals' | 'jobs' | 'services';
  } {
    const lower = (moduleInput || '').toLowerCase();
    if (lower.startsWith('rental')) {
      return { singular: 'rental', plural: 'rentals' };
    }
    if (lower.startsWith('job')) {
      return { singular: 'job', plural: 'jobs' };
    }
    if (lower.startsWith('service')) {
      return { singular: 'service', plural: 'services' };
    }
    return { singular: 'rental', plural: 'rentals' };
  }

  /**
   * Formats price, salary, or rate string based on listing module and raw database fields
   */
  private static formatPriceOrSalary(row: any, moduleType: 'rental' | 'job' | 'service'): {
    priceOrSalary: string;
    periodOrType: string;
  } {
    if (moduleType === 'job') {
      const price = row.price ?? row.salary ?? row.module_data?.salary_amount;
      const minP = row.minimum_price ?? row.module_data?.salary_min;
      const maxP = row.maximum_price ?? row.module_data?.salary_max;
      const jobType = row.job_type || row.module_data?.job_type || row.work_mode || 'Full-time';

      if (price && Number(price) > 0) {
        return {
          priceOrSalary: `Rs. ${Number(price).toLocaleString()}`,
          periodOrType: '/ month'
        };
      }
      if ((minP && Number(minP) > 0) || (maxP && Number(maxP) > 0)) {
        const minStr = minP ? `Rs. ${Number(minP).toLocaleString()}` : '';
        const maxStr = maxP ? `Rs. ${Number(maxP).toLocaleString()}` : '';
        const rangeStr = minStr && maxStr ? `${minStr} - ${maxStr}` : minStr || maxStr;
        return {
          priceOrSalary: rangeStr,
          periodOrType: jobType
        };
      }
      return {
        priceOrSalary: 'Salary Negotiable',
        periodOrType: jobType
      };
    }

    if (moduleType === 'service') {
      const price = row.price ?? row.minimum_price ?? row.module_data?.starting_price;
      const pricingType = row.pricing_type || row.price_period || row.module_data?.pricing_type || 'Per Service';

      if (price && Number(price) > 0) {
        return {
          priceOrSalary: `From Rs. ${Number(price).toLocaleString()}`,
          periodOrType: `/${pricingType.toLowerCase().replace('per ', '')}`
        };
      }
      return {
        priceOrSalary: 'Price on Inquiry',
        periodOrType: pricingType
      };
    }

    // Default: Rental
    const price = row.price ?? row.module_data?.rent_amount;
    const period = row.price_period || row.pricing_period || row.module_data?.rent_period || 'month';

    if (price && Number(price) > 0) {
      return {
        priceOrSalary: `Rs. ${Number(price).toLocaleString()}`,
        periodOrType: `/${period.toLowerCase().replace('/', '').trim()}`
      };
    }
    return {
      priceOrSalary: 'Price on Inquiry',
      periodOrType: 'Negotiable'
    };
  }

  /**
   * Helper: Extracts cover image storage path from row or module_data
   */
  private static extractStoragePath(row: any): string | null {
    if (row.listing_media && Array.isArray(row.listing_media) && row.listing_media.length > 0) {
      const sorted = [...row.listing_media].sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0));
      const coverMedia = sorted.find((m: any) => m.is_cover) || sorted[0];
      if (coverMedia?.storage_path) return coverMedia.storage_path;
    }
    return row.module_data?.company_logo_url ||
           row.module_data?.logoUrl ||
           row.module_data?.form_values?.logoUrl ||
           row.module_data?.form_values?.companyLogo ||
           null;
  }

  /**
   * Fetches prioritized dynamic recommendations directly from Supabase 'listings' table.
   * Priority:
   * 1. Same Module + Same Category
   * 2. Same Module + Other Categories
   * 3. Other Active Modules Fallback
   * Max items: 5. Excludes currentListingId and non-active listings.
   */
  public static async getRecommendations(
    params: GetRecommendationsParams
  ): Promise<RecommendedListingCardItem[]> {
    const { currentListingId, categoryId, limit = 5 } = params;
    if (!currentListingId) return [];

    const norm = RecommendationService.normalizeModule(params.module);
    const collectedRows: any[] = [];
    const collectedIds = new Set<string>([currentListingId]);

    const selectQuery = `
      id,
      module,
      title,
      description,
      category_id,
      price,
      pricing_period,
      status,
      created_at,
      module_data,
      categories:category_id ( id, name ),
      locations:province_id ( id, name ),
      listing_media ( id, storage_path, position, is_cover )
    `;

    try {
      // Fetch same-module candidates and fallback candidates in ONE parallel request!
      const [sameModuleRes, fallbackRes] = await Promise.all([
        supabase
          .from('listings')
          .select(selectQuery)
          .eq('status', 'active')
          .neq('id', currentListingId)
          .eq('module', norm.singular)
          .order('created_at', { ascending: false })
          .limit(limit * 2),
        supabase
          .from('listings')
          .select(selectQuery)
          .eq('status', 'active')
          .neq('id', currentListingId)
          .neq('module', norm.singular)
          .order('created_at', { ascending: false })
          .limit(limit)
      ]);

      const sameModuleRows = sameModuleRes.data || [];
      const fallbackRows = fallbackRes.data || [];

      // Sort into Priority 1 (Same category), Priority 2 (Same module), Priority 3 (Other modules)
      const level1Rows: any[] = [];
      const level2Rows: any[] = [];

      for (const row of sameModuleRows) {
        if (categoryId && row.category_id === categoryId) {
          level1Rows.push(row);
        } else {
          level2Rows.push(row);
        }
      }

      // Combine by priority up to limit
      for (const row of [...level1Rows, ...level2Rows, ...fallbackRows]) {
        if (!collectedIds.has(row.id) && collectedRows.length < limit) {
          collectedIds.add(row.id);
          collectedRows.push(row);
        }
      }

      if (collectedRows.length === 0) {
        return [];
      }

      // Extract storage paths for batch URL signing
      const rawPaths = collectedRows.map((r) => RecommendationService.extractStoragePath(r));
      const urlMap = await HomeService.resolveSignedMediaUrlsBatch(rawPaths, 3600);

      // Transform rows to RecommendedListingCardItem
      return collectedRows.map((row) => {
        const itemNorm = RecommendationService.normalizeModule(row.module || norm.singular);
        const storagePath = RecommendationService.extractStoragePath(row);
        let resolvedImage = SearchService.NEUTRAL_PLACEHOLDER;

        if (storagePath) {
          if (storagePath.startsWith('http://') || storagePath.startsWith('https://') || storagePath.startsWith('data:')) {
            resolvedImage = storagePath;
          } else {
            resolvedImage = urlMap.get(storagePath) || SearchService.NEUTRAL_PLACEHOLDER;
          }
        }

        const priceInfo = RecommendationService.formatPriceOrSalary(row, itemNorm.singular);

        let badgeLabel: 'RENTAL' | 'JOB' | 'SERVICE' = 'RENTAL';
        let badgeColor = '#1464F4';
        let badgeStyle = 'bg-blue-50 text-[#1464F4] border-blue-200';

        if (itemNorm.singular === 'job') {
          badgeLabel = 'JOB';
          badgeColor = '#08A34F';
          badgeStyle = 'bg-emerald-50 text-[#08A34F] border-emerald-200';
        } else if (itemNorm.singular === 'service') {
          badgeLabel = 'SERVICE';
          badgeColor = '#FF650A';
          badgeStyle = 'bg-orange-50 text-[#FF650A] border-orange-200';
        }

        const categoryName = (row.categories as any)?.name || row.module_data?.category_name || itemNorm.plural.toUpperCase();
        const locationName = (row.locations as any)?.name || row.module_data?.city_name || row.module_data?.district_name || 'Sri Lanka';

        return {
          id: row.id,
          title: row.title || 'Untitled Listing',
          module: itemNorm.singular,
          routeModule: itemNorm.plural,
          categoryName,
          locationName,
          priceOrSalary: priceInfo.priceOrSalary,
          periodOrType: priceInfo.periodOrType,
          imageUrl: resolvedImage,
          badgeLabel,
          badgeColor,
          badgeStyle,
          createdAt: row.created_at
        };
      });
    } catch (err) {
      console.error('Error fetching recommendations from Supabase:', err);
      return [];
    }
  }
}
