import { UserProfile, UserListingItem, UserReviewItem, UserReportItem, UserListingStatus } from '../types/profileTypes';
import { supabase } from '../lib/supabase';
import { SearchService } from './searchService';

const PROFILE_STORAGE_KEY = 'rentoura_user_profile';

export class ProfileService {
  static getProfile(): UserProfile | null {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserProfile;
        if (parsed) {
          if (parsed.bio === 'Member of RENTOURA.LK community marketplace.') {
            parsed.bio = '';
          }
          if (parsed.avatarUrl && parsed.avatarUrl.includes('images.unsplash.com')) {
            parsed.avatarUrl = '';
          }
          if (parsed.accountType === 'Individual') {
            parsed.accountType = '';
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse user profile from localStorage:', e);
    }
    return null;
  }

  static clearSessionData(): void {
    try {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
      localStorage.removeItem('rentoura_user_listings');
      localStorage.removeItem('rentoura_user_reviews');
      localStorage.removeItem('rentoura_user_reports');
    } catch (e) {
      console.error('Failed to clear session data from localStorage:', e);
    }
  }

  static saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save user profile to localStorage:', e);
    }
  }

  /**
   * Fetches real user listings owned by `ownerId` directly from Supabase DB.
   */
  static async fetchUserListings(ownerId: string): Promise<UserListingItem[]> {
    if (!ownerId) return [];

    try {
      const { data: rows, error } = await supabase
        .from('listings')
        .select('*')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false });

      if (error || !rows) {
        console.warn('Error fetching user listings from Supabase:', error?.message);
        return [];
      }

      // 1. Fetch all media in one query
      const listingIds = rows.map(r => r.id);
      const { data: allMedia } = await supabase
        .from('listing_media')
        .select('listing_id, storage_path, position, is_cover')
        .in('listing_id', listingIds)
        .order('is_cover', { ascending: false })
        .order('position', { ascending: true });

      // Group media by listing_id
      const mediaByListingId = new Map<string, typeof allMedia>();
      if (allMedia) {
        for (const m of allMedia) {
          const list = mediaByListingId.get(m.listing_id) || [];
          list.push(m);
          mediaByListingId.set(m.listing_id, list);
        }
      }

      const listings: UserListingItem[] = [];

      for (const row of rows) {
        let imageUrl = SearchService.NEUTRAL_PLACEHOLDER;
        let mediaCount = 1;
        
        const listingMedia = mediaByListingId.get(row.id) || [];
        if (listingMedia.length > 0) {
          mediaCount = listingMedia.length;
          const path = listingMedia[0].storage_path;
          if (path) {
            if (path.startsWith('http://') || path.startsWith('https://')) {
              imageUrl = path;
            } else {
              // We'll leave it as path temporarily and sign concurrently below
              imageUrl = path;
            }
          }
        }

        // Module normalization
        const rawMod = (row.module || 'rental').toLowerCase();
        const module: 'rentals' | 'jobs' | 'services' =
          rawMod.startsWith('job') ? 'jobs' : (rawMod.startsWith('service') ? 'services' : 'rentals');

        // Status normalization
        let status: UserListingStatus = 'pending';
        const rawStatus = (row.status || '').toLowerCase();
        if (rawStatus === 'active' || rawStatus === 'published') {
          status = 'active';
        } else if (rawStatus === 'pending' || rawStatus === 'submitted') {
          status = 'pending';
        } else if (rawStatus === 'changes_requested') {
          status = 'changes_requested';
        } else if (rawStatus === 'draft') {
          status = 'draft';
        } else if (rawStatus === 'rejected') {
          status = 'rejected';
        } else if (rawStatus === 'paused') {
          status = 'paused';
        } else if (rawStatus === 'expired') {
          status = 'expired';
        }

        // Price formatting
        let price = 'Negotiable';
        if (row.price !== null && row.price !== undefined && !isNaN(Number(row.price)) && Number(row.price) > 0) {
          price = `Rs. ${Number(row.price).toLocaleString()}`;
        } else if (typeof row.price === 'string' && row.price.trim() !== '') {
          price = row.price;
        }

        // Date formatting
        let postedDate = '';
        if (row.created_at) {
          try {
            postedDate = new Date(row.created_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });
          } catch (e) {}
        }

        // Extract tags / description / notes from row or row.module_data
        let tags: string[] = [];
        let description = row.description || '';
        let rejectionReason = row.rejection_reason || '';
        let changesRequestedNote = row.changes_requested_note || '';
        let statusNote = row.status_note || '';

        if (row.module_data && typeof row.module_data === 'object') {
          if (Array.isArray(row.module_data.tags)) {
            tags = row.module_data.tags;
          }
          if (row.module_data.description && !description) {
            description = row.module_data.description;
          }
          if (row.module_data.rejectionReason && !rejectionReason) {
            rejectionReason = row.module_data.rejectionReason;
          }
          if (row.module_data.changesRequestedNote && !changesRequestedNote) {
            changesRequestedNote = row.module_data.changesRequestedNote;
          }
          if (row.module_data.statusNote && !statusNote) {
            statusNote = row.module_data.statusNote;
          }
        }

        const fv = row.module_data?.form_values || {};

        listings.push({
          id: row.id,
          ownerId: row.owner_id,
          module,
          title: row.title || 'Untitled Listing',
          status,
          imageUrl,
          location: row.exact_address || 'Sri Lanka',
          price,
          pricePeriod: row.pricing_period || '',
          category: row.category_id || '',
          postedDate,
          viewsCount: row.views_count ? Number(row.views_count) : 0,
          inquiriesCount: row.inquiries_count ? Number(row.inquiries_count) : 0,
          savesCount: row.saves_count ? Number(row.saves_count) : 0,
          imagesCount: mediaCount,
          tags,
          description,
          companyName: row.company_name || fv.companyName || undefined,
          providerName: row.provider_name || fv.providerName || undefined,
          statusNote: statusNote || undefined,
          rejectionReason: rejectionReason || undefined,
          changesRequestedNote: changesRequestedNote || undefined,
          bedrooms: row.module_data?.bedrooms || fv.bedrooms || undefined,
          bathrooms: row.module_data?.bathrooms || fv.bathrooms || undefined,
          furnished: row.module_data?.furnished || fv.furnished || undefined,
          area: row.module_data?.area || fv.area || undefined,
          vehicleType: row.module_data?.vehicle_type || fv.vehicleType || undefined,
          jobType: row.module_data?.job_type || fv.jobType || fv.employmentType || undefined,
          workMode: row.module_data?.work_mode || fv.workMode || undefined,
          experienceLevel: row.module_data?.experience_level || fv.experienceLevel || undefined,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        });
      }

      // 2. Fetch signed URLs concurrently for all items that need it
      const urlPromises = listings.map(async (listing) => {
        if (listing.imageUrl && listing.imageUrl !== SearchService.NEUTRAL_PLACEHOLDER && !listing.imageUrl.startsWith('http')) {
          try {
            const { data: signedData } = await supabase.storage
              .from('listing-images')
              .createSignedUrl(listing.imageUrl, 3600);
            if (signedData?.signedUrl) {
              listing.imageUrl = signedData.signedUrl;
            } else {
              listing.imageUrl = SearchService.NEUTRAL_PLACEHOLDER;
            }
          } catch (e) {
            console.warn(`Error resolving media for listing ${listing.id}:`, e);
            listing.imageUrl = SearchService.NEUTRAL_PLACEHOLDER;
          }
        }
      });

      await Promise.all(urlPromises);

      return listings;
    } catch (e: any) {
      console.error('Failed to fetch user listings from Supabase:', e);
      return [];
    }
  }

  /**
   * Updates a listing in Supabase owned by ownerId.
   */
  static async updateListingInSupabase(
    updated: UserListingItem,
    ownerId: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!updated.id || !ownerId) return { success: false, error: 'Invalid parameters' };

    try {
      // Map status for DB
      let dbStatus: string = updated.status;
      // Do NOT map to 'submitted', it's not a valid listing_status in the DB ENUM.
      // if (updated.status === 'pending') dbStatus = 'submitted';

      // Numeric price extraction
      let numericPrice: number | null = null;
      if (updated.price) {
        const digits = updated.price.replace(/[^0-9.]/g, '');
        if (digits) {
          const val = parseFloat(digits);
          if (!isNaN(val)) numericPrice = val;
        }
      }

      let newModuleData: any = undefined;
      
      const hasModuleUpdates = updated.tags !== undefined || 
        updated.bedrooms !== undefined || 
        updated.bathrooms !== undefined || 
        updated.furnished !== undefined || 
        updated.area !== undefined || 
        updated.vehicleType !== undefined || 
        updated.jobType !== undefined || 
        updated.workMode !== undefined || 
        updated.experienceLevel !== undefined;

      if (hasModuleUpdates) {
        const { data: existingRow } = await supabase
          .from('listings')
          .select('module_data')
          .eq('id', updated.id)
          .maybeSingle();
        
        newModuleData = {
          ...(existingRow?.module_data || {})
        };
        
        if (updated.tags !== undefined) newModuleData.tags = updated.tags;
        if (updated.bedrooms !== undefined) newModuleData.bedrooms = updated.bedrooms;
        if (updated.bathrooms !== undefined) newModuleData.bathrooms = updated.bathrooms;
        if (updated.furnished !== undefined) newModuleData.furnished = updated.furnished;
        if (updated.area !== undefined) newModuleData.area = updated.area;
        if (updated.vehicleType !== undefined) newModuleData.vehicle_type = updated.vehicleType;
        if (updated.jobType !== undefined) newModuleData.job_type = updated.jobType;
        if (updated.workMode !== undefined) newModuleData.work_mode = updated.workMode;
        if (updated.experienceLevel !== undefined) newModuleData.experience_level = updated.experienceLevel;
      }

      const updatePayload: Record<string, any> = {
        title: updated.title,
        price: numericPrice,
        pricing_period: updated.pricePeriod || null,
        exact_address: updated.location,
        description: updated.description || null,
        status: dbStatus,
        status_note: updated.statusNote || null,
        updated_at: new Date().toISOString()
      };

      if (newModuleData) {
        updatePayload.module_data = newModuleData;
      }

      const { error } = await supabase
        .from('listings')
        .update(updatePayload)
        .eq('id', updated.id)
        .eq('owner_id', ownerId);

      if (error) {
        console.error('Error updating listing in Supabase:', error.message);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (e: any) {
      console.error('Failed to update listing in Supabase:', e);
      return { success: false, error: e.message || 'Update failed' };
    }
  }

  /**
   * Updates status of a listing in Supabase owned by ownerId.
   */
  static async updateListingStatusInSupabase(
    listingId: string,
    ownerId: string,
    newStatus: UserListingStatus,
    note?: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!listingId || !ownerId) return { success: false, error: 'Invalid parameters' };

    try {
      let dbStatus = newStatus as string;
      // if (newStatus === 'active') dbStatus = 'published';
      // if (newStatus === 'pending') dbStatus = 'submitted';

      const updatePayload: Record<string, any> = {
        status: dbStatus,
        updated_at: new Date().toISOString()
      };
      if (note) {
        updatePayload.status_note = note;
      }

      const { error } = await supabase
        .from('listings')
        .update(updatePayload)
        .eq('id', listingId)
        .eq('owner_id', ownerId);

      if (error) {
        console.error('Error updating listing status in Supabase:', error.message);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (e: any) {
      console.error('Failed to update listing status in Supabase:', e);
      return { success: false, error: e.message || 'Status update failed' };
    }
  }

  /**
   * Deletes a listing in Supabase owned by ownerId (cleaning up storage media as well).
   */
  static async deleteListingInSupabase(listingId: string, ownerId: string): Promise<{ success: boolean; error?: string }> {
    if (!listingId || !ownerId) return { success: false, error: 'Missing listing ID or owner ID' };
    try {
      // 1. Fetch media paths for cleanup
      const { data: mediaRows } = await supabase
        .from('listing_media')
        .select('storage_path')
        .eq('listing_id', listingId);

      if (mediaRows && mediaRows.length > 0) {
        const paths = mediaRows.map(m => m.storage_path).filter(Boolean);
        if (paths.length > 0) {
          await supabase.storage.from('listing-images').remove(paths);
        }
        await supabase.from('listing_media').delete().eq('listing_id', listingId);
      }

      // 2. Delete listing row
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId)
        .eq('owner_id', ownerId);

      if (error) {
        console.error('Error deleting listing in Supabase:', error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (e: any) {
      console.error('Failed to delete listing in Supabase:', e);
      return { success: false, error: e.message || 'Delete failed' };
    }
  }

  /**
   * Fetches real user reviews from Supabase.
   */
  static async fetchUserReviews(userId: string): Promise<UserReviewItem[]> {
    if (!userId) return [];
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .or(`target_owner_id.eq.${userId},target_user_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error || !data) {
        return [];
      }

      return data.map((r: any) => ({
        id: r.id,
        reviewerName: r.author_name || r.reviewer_name || 'Anonymous User',
        reviewerAvatar: r.author_avatar || '',
        rating: Number(r.rating ?? r.overall_rating ?? 0),
        comment: r.body || r.comment || '',
        date: r.created_at ? new Date(r.created_at).toLocaleDateString() : '',
        listingTitle: r.target_title || r.listing_title || 'Listing',
        module: r.target_module || 'rentals'
      }));
    } catch (e) {
      return [];
    }
  }

  /**
   * Fetches real user reports submitted by userId from Supabase.
   */
  static async fetchUserReports(userId: string): Promise<UserReportItem[]> {
    if (!userId) return [];
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('reporter_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data) {
        return [];
      }

      return data.map((rep: any) => ({
        id: rep.id,
        targetListingTitle: rep.target_title || rep.target_id || 'Listing Report',
        targetListingId: rep.target_id || '',
        reason: rep.reason_label || rep.reason_code || rep.reason || 'Safety Flag',
        status: rep.status === 'resolved' ? 'Resolved' : (rep.status === 'dismissed' ? 'Dismissed' : 'Pending Review'),
        submittedDate: rep.created_at ? new Date(rep.created_at).toLocaleDateString() : '',
        resolutionNote: rep.status_note || rep.user_facing_message || undefined
      }));
    } catch (e) {
      return [];
    }
  }

  // Legacy sync helpers
  static deleteListing(listingId: string): UserListingItem[] {
    return [];
  }

  static updateListing(updatedListing: UserListingItem): UserListingItem[] {
    return [updatedListing];
  }

  static updateListingStatus(listingId: string, newStatus: UserListingStatus, note?: string): UserListingItem[] {
    return [];
  }

  static addListing(newListing: UserListingItem): UserListingItem[] {
    return [newListing];
  }

  static getUserListings(): UserListingItem[] {
    return [];
  }

  static getReviews(): UserReviewItem[] {
    return [];
  }

  static getReports(): UserReportItem[] {
    return [];
  }
}
