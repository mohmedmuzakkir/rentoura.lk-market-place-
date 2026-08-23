import { supabase } from '../lib/supabase';

export interface ToggleSaveResult {
  saved: boolean;
  requiresLogin?: boolean;
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
   * If user is unauthenticated, returns requiresLogin: true.
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

        if (delErr) console.error('Error unsaving listing in Supabase:', delErr);
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

        if (insErr) console.error('Error saving listing in Supabase:', insErr);
        return { saved: true };
      }
    } catch (e) {
      console.error('Error toggling saved listing:', e);
      return { saved: false };
    }
  }
}
