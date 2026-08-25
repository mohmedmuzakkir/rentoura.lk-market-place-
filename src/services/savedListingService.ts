import { supabase } from '../lib/supabase';
import { SavedRentalItem, SavedJobItem, SavedServiceItem } from '../data/savedListingsData';

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
      console.error('Error fetching saved listings:', e);
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
   * Fetches full saved listings details directly from Supabase for current user.
   */
  static async getSavedListingsWithDetails(): Promise<{
    rentals: SavedRentalItem[];
    jobs: SavedJobItem[];
    services: SavedServiceItem[];
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { rentals: [], jobs: [], services: [] };
      }

      const { data: savedRows, error: savedErr } = await supabase
        .from('saved_listings')
        .select('listing_id')
        .eq('user_id', user.id);

      if (savedErr || !savedRows || savedRows.length === 0) {
        return { rentals: [], jobs: [], services: [] };
      }

      const listingIds = savedRows.map(r => r.listing_id);

      // Query actual listings rows
      const { data: listings, error: listingsErr } = await supabase
        .from('listings')
        .select('*')
        .in('id', listingIds);

      if (listingsErr || !listings) {
        return { rentals: [], jobs: [], services: [] };
      }

      const rentals: SavedRentalItem[] = [];
      const jobs: SavedJobItem[] = [];
      const services: SavedServiceItem[] = [];

      for (const item of listings) {
        const rawMod = (item.module || 'rental').toLowerCase();

        // Get cover image from media
        const { data: mediaRows } = await supabase
          .from('listing_media')
          .select('storage_path')
          .eq('listing_id', item.id)
          .limit(1);

        let imageUrl = 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80';
        if (mediaRows && mediaRows.length > 0) {
          const path = mediaRows[0].storage_path;
          if (path.startsWith('http')) {
            imageUrl = path;
          } else {
            const { data: pubData } = supabase.storage.from('listing-images').getPublicUrl(path);
            if (pubData?.publicUrl) imageUrl = pubData.publicUrl;
          }
        }

        const priceStr = item.price ? `Rs. ${item.price.toLocaleString()}` : 'Contact for Price';

        if (rawMod.startsWith('job')) {
          jobs.push({
            id: item.id,
            title: item.title,
            company: 'Verified Employer',
            location: 'Sri Lanka',
            jobType: (item.module_data as any)?.employment_type || 'Full Time',
            salary: priceStr,
            salaryPeriod: item.pricing_period || '/ Month',
            postedTime: 'Saved',
            isSaved: true
          });
        } else if (rawMod.startsWith('service')) {
          services.push({
            id: item.id,
            title: item.title,
            providerName: 'Verified Provider',
            category: 'Services',
            location: 'Sri Lanka',
            price: priceStr,
            priceUnit: item.pricing_period || '/ Visit',
            imageUrl,
            rating: 4.9,
            reviewsCount: 10,
            isSaved: true
          });
        } else {
          rentals.push({
            id: item.id,
            title: item.title,
            category: 'Rentals',
            categoryType: 'RENTAL',
            location: 'Sri Lanka',
            price: priceStr,
            pricePeriod: item.pricing_period || '/ Month',
            imageUrl,
            photoCount: '1',
            isSaved: true
          });
        }
      }

      return { rentals, jobs, services };

    } catch (e) {
      console.error('Error fetching saved listing details:', e);
      return { rentals: [], jobs: [], services: [] };
    }
  }
}
