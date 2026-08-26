import { supabase } from '../lib/supabase';
import { 
  SavedRentalItem, 
  SavedJobItem, 
  SavedServiceItem, 
  SavedUnavailableItem 
} from '../types/savedTypes';

export interface ToggleSaveResult {
  saved: boolean;
  requiresLogin?: boolean;
  error?: string;
}

export class SavedListingService {
  /**
   * Fetches array of listing IDs saved by the currently authenticated user from Supabase.
   * Returns empty array for unauthenticated users.
   */
  static async getSavedListingIds(): Promise<string[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from('saved_listings')
        .select('listing_id')
        .eq('user_id', user.id);

      if (error) {
        console.warn('Supabase saved_listings query error:', error.message);
        return [];
      }

      return data ? data.map(row => row.listing_id) : [];
    } catch (e) {
      console.error('Error fetching saved listing IDs:', e);
      return [];
    }
  }

  /**
   * Toggles save status for a listing in Supabase saved_listings table.
   * Handles database errors correctly without assuming success.
   */
  static async toggleSaveListing(listingId: string): Promise<ToggleSaveResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { saved: false, requiresLogin: true };
      }

      // Query existing saved item
      const { data: existing, error: checkError } = await supabase
        .from('saved_listings')
        .select('listing_id')
        .eq('user_id', user.id)
        .eq('listing_id', listingId)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.warn('Error checking saved_listings status:', checkError.message);
      }

      if (existing) {
        // Delete from saved_listings
        const { error: delErr } = await supabase
          .from('saved_listings')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', listingId);

        if (delErr) {
          console.error('Error unsaving listing in Supabase:', delErr);
          return { saved: true, error: delErr.message };
        }
        return { saved: false };
      } else {
        // Insert into saved_listings
        const { error: insErr } = await supabase
          .from('saved_listings')
          .insert({
            user_id: user.id,
            listing_id: listingId,
            created_at: new Date().toISOString()
          });

        if (insErr) {
          console.error('Error saving listing in Supabase:', insErr);
          return { saved: false, error: insErr.message };
        }
        return { saved: true };
      }
    } catch (e: any) {
      console.error('Error toggling saved listing:', e);
      return { saved: false, error: e?.message || 'Database error' };
    }
  }

  /**
   * Bulk deletes unavailable saved listings for current authenticated user.
   */
  static async clearUnavailableSavedListings(listingIds: string[]): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { success: false, error: 'Not authenticated' };
      if (!listingIds || listingIds.length === 0) return { success: true };

      const { error } = await supabase
        .from('saved_listings')
        .delete()
        .eq('user_id', user.id)
        .in('listing_id', listingIds);

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to clear unavailable listings' };
    }
  }

  /**
   * Fetches full saved listings details directly from Supabase for current user.
   */
  static async getSavedListingsWithDetails(): Promise<{
    rentals: SavedRentalItem[];
    jobs: SavedJobItem[];
    services: SavedServiceItem[];
    unavailable: SavedUnavailableItem[];
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { rentals: [], jobs: [], services: [], unavailable: [] };
      }

      const { data: savedRows, error: savedErr } = await supabase
        .from('saved_listings')
        .select('listing_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (savedErr || !savedRows || savedRows.length === 0) {
        return { rentals: [], jobs: [], services: [], unavailable: [] };
      }

      const listingIds = savedRows.map(r => r.listing_id);

      // Query actual listings rows
      const { data: listings, error: listingsErr } = await supabase
        .from('listings')
        .select('*')
        .in('id', listingIds);

      if (listingsErr) {
        console.error('Error fetching listings details for saved:', listingsErr.message);
        return { rentals: [], jobs: [], services: [], unavailable: [] };
      }

      const listingMap = new Map<string, any>();
      if (listings) {
        for (const l of listings) {
          listingMap.set(l.id, l);
        }
      }

      const activeListings: any[] = [];
      const unavailable: SavedUnavailableItem[] = [];

      for (const savedRow of savedRows) {
        const item = listingMap.get(savedRow.listing_id);
        if (!item || item.status !== 'active') {
          unavailable.push({
            id: savedRow.listing_id,
            listingId: savedRow.listing_id,
            savedAt: savedRow.created_at
          });
        } else {
          activeListings.push(item);
        }
      }

      if (activeListings.length === 0) {
        return { rentals: [], jobs: [], services: [], unavailable };
      }

      // Bulk fetch cover media using signed URLs
      const activeIds = activeListings.map(l => l.id);

      const { data: mediaRows } = await supabase
        .from('listing_media')
        .select('listing_id, storage_path, position, is_cover')
        .in('listing_id', activeIds)
        .order('is_cover', { ascending: false })
        .order('position', { ascending: true });

      const mediaMap = new Map<string, string[]>();
      if (mediaRows) {
        for (const m of mediaRows) {
          if (!m.storage_path) continue;
          const list = mediaMap.get(m.listing_id) || [];
          list.push(m.storage_path);
          mediaMap.set(m.listing_id, list);
        }
      }

      // Resolve signed URLs for each listing's cover image
      const imageSignedMap = new Map<string, string>();
      for (const [lId, paths] of mediaMap.entries()) {
        if (paths.length > 0) {
          const path = paths[0];
          if (path.startsWith('http://') || path.startsWith('https://')) {
            imageSignedMap.set(lId, path);
          } else {
            const { data: signedData } = await supabase
              .storage
              .from('listing-images')
              .createSignedUrl(path, 3600);
            if (signedData?.signedUrl) {
              imageSignedMap.set(lId, signedData.signedUrl);
            }
          }
        }
      }

      // Bulk fetch location names
      const locationIds = Array.from(new Set(
        activeListings.flatMap(l => [l.city_id, l.district_id, l.province_id].filter(Boolean))
      ));
      const locationNameMap = new Map<string, string>();

      if (locationIds.length > 0) {
        const { data: locRows } = await supabase
          .from('locations')
          .select('id, name')
          .in('id', locationIds);
        if (locRows) {
          for (const loc of locRows) {
            locationNameMap.set(loc.id, loc.name);
          }
        }
      }

      // Bulk fetch category names
      const categoryIds = Array.from(new Set(
        activeListings.map(l => l.category_id).filter(Boolean)
      ));
      const categoryNameMap = new Map<string, string>();

      if (categoryIds.length > 0) {
        const { data: catRows } = await supabase
          .from('categories')
          .select('id, name')
          .in('id', categoryIds);
        if (catRows) {
          for (const cat of catRows) {
            categoryNameMap.set(cat.id, cat.name);
          }
        }
      }

      // Bulk fetch owner names from profiles
      const ownerIds = Array.from(new Set(activeListings.map(l => l.owner_id).filter(Boolean)));
      const ownerNameMap = new Map<string, string>();
      if (ownerIds.length > 0) {
        const { data: profRows } = await supabase
          .from('profiles')
          .select('id, full_name, display_name')
          .in('id', ownerIds);
        if (profRows) {
          for (const p of profRows) {
            ownerNameMap.set(p.id, p.display_name || p.full_name || 'Owner');
          }
        }
      }

      const rentals: SavedRentalItem[] = [];
      const jobs: SavedJobItem[] = [];
      const services: SavedServiceItem[] = [];

      for (const item of activeListings) {
        const rawMod = (item.module || 'rental').toLowerCase();

        const city = item.city_id ? locationNameMap.get(item.city_id) : '';
        const district = item.district_id ? locationNameMap.get(item.district_id) : '';
        const province = item.province_id ? locationNameMap.get(item.province_id) : '';

        const locationStr = [city, district || province].filter(Boolean).join(', ') || 'Sri Lanka';
        const categoryName = item.category_id ? (categoryNameMap.get(item.category_id) || 'General') : 'General';
        const imageUrl = imageSignedMap.get(item.id);

        const priceStr = item.price ? `Rs. ${item.price.toLocaleString()}` : (item.minimum_price ? `Rs. ${item.minimum_price.toLocaleString()}` : 'Contact for Price');
        const periodStr = item.pricing_period ? (item.pricing_period.startsWith('/') ? item.pricing_period : `/ ${item.pricing_period}`) : '';

        if (rawMod.startsWith('job')) {
          const modData = item.module_data || {};
          const companyName = modData.company_name || ownerNameMap.get(item.owner_id) || 'Direct Employer';
          jobs.push({
            id: item.id,
            title: item.title,
            company: companyName,
            companyId: modData.company_id,
            logoUrl: modData.logo_url,
            location: locationStr,
            jobType: modData.employment_type || modData.job_type || 'Full Time',
            salary: priceStr,
            salaryPeriod: periodStr,
            postedTime: item.published_at ? new Date(item.published_at).toLocaleDateString() : 'Saved',
            isSaved: true
          });
        } else if (rawMod.startsWith('serv')) {
          const modData = item.module_data || {};
          const providerName = modData.provider_name || ownerNameMap.get(item.owner_id) || 'Service Provider';
          services.push({
            id: item.id,
            title: item.title,
            providerName,
            category: categoryName,
            categoryTag: modData.service_tag || categoryName,
            location: locationStr,
            price: priceStr,
            priceUnit: periodStr || '/ Service',
            imageUrl,
            isSaved: true
          });
        } else {
          // Rentals
          const modData = item.module_data || {};
          const specs: { label: string; icon: string }[] = [];

          if (modData.bedrooms) specs.push({ label: `${modData.bedrooms} Beds`, icon: 'Bed' });
          if (modData.bathrooms) specs.push({ label: `${modData.bathrooms} Baths`, icon: 'Bath' });
          if (modData.building_size_sqft) specs.push({ label: `${modData.building_size_sqft} sqft`, icon: 'Maximize2' });
          if (modData.fuel_type) specs.push({ label: modData.fuel_type, icon: 'Fuel' });
          if (modData.transmission) specs.push({ label: modData.transmission, icon: 'Gauge' });
          if (modData.seating_capacity) specs.push({ label: `${modData.seating_capacity} Seats`, icon: 'Users' });

          const mediaCount = mediaMap.get(item.id)?.length || 0;

          rentals.push({
            id: item.id,
            title: item.title,
            category: categoryName,
            categoryType: categoryName.toUpperCase(),
            location: locationStr,
            price: priceStr,
            pricePeriod: periodStr || '/ Month',
            imageUrl,
            photoCount: mediaCount > 0 ? `1/${mediaCount}` : undefined,
            specs: specs.length > 0 ? specs : undefined,
            isSaved: true
          });
        }
      }

      return { rentals, jobs, services, unavailable };

    } catch (e) {
      console.error('Error fetching saved listing details:', e);
      return { rentals: [], jobs: [], services: [], unavailable: [] };
    }
  }
}
