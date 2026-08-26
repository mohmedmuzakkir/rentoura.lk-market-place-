import { UserListingItem } from '../types/profileTypes';
import { ListingDraft, normalizeNumericPrice } from '../types/postFormTypes';
import { PostDraftService } from './postDraftService';
import { supabase } from '../lib/supabase';

export class ListingSubmissionService {
  /**
   * Submits a listing draft for moderation review to Supabase.
   * Inserts into `listings` and `listing_media` tables, uploading photos to `listing-images` storage bucket.
   */
  static async submitListing(draft: ListingDraft): Promise<{ success: boolean; listing: UserListingItem; error?: string }> {
    try {
      // Validate mandatory properties
      if (!draft.formValues.title) {
        return { success: false, listing: {} as any, error: 'Listing title is required' };
      }
      if (!draft.categoryId) {
        return { success: false, listing: {} as any, error: 'Category selection is required' };
      }

      // 1. Get authenticated user
      const { data: authData } = await supabase.auth.getUser();
      const currentUser = authData?.user;

      if (!currentUser) {
        return {
          success: false,
          listing: {} as any,
          error: 'You must be logged in to submit a listing. Please sign in.'
        };
      }

      const ownerId = currentUser.id;

      // 2. Normalize module string ('rentals' -> 'rental', 'jobs' -> 'job', 'services' -> 'service')
      const rawMod = (draft.module || 'rentals').toLowerCase();
      const moduleType = rawMod.startsWith('rental') ? 'rental' : (rawMod.startsWith('job') ? 'job' : 'service');

      // 3. Normalize pricing
      const rawPrice = draft.formValues.price || draft.formValues.minSalary || draft.formValues.fixedSalary || draft.pricing?.rate || 0;
      const { amount: priceAmount, formatted: priceFormatted } = normalizeNumericPrice(rawPrice);

      let pricePeriod = '/ Month';
      if (moduleType === 'rental') {
        pricePeriod = draft.formValues.rentalPeriod === 'day' ? '/ Day' : (draft.formValues.rentalPeriod === 'hour' ? '/ Hour' : '/ Month');
      } else if (moduleType === 'job') {
        pricePeriod = '/ Month';
      } else if (moduleType === 'service') {
        const pricingModel = draft.formValues.pricingModel;
        pricePeriod = pricingModel === 'visit' ? '/ Visit' : (pricingModel === 'hourly' ? '/ Hour' : '/ Job');
      }

      // Title & Summary
      const title = draft.formValues.title.trim();
      const description = draft.formValues.description || draft.formValues.summary || 'Listing submitted for review.';
      const shortSummary = description.substring(0, 150);

      // Handle company logo file upload if present
      let finalLogoUrl = draft.formValues?.logoUrl || '';
      if (draft.formValues?.logoFile) {
        try {
          const logoFile = draft.formValues.logoFile;
          const ext = logoFile.name ? logoFile.name.split('.').pop() || 'png' : 'png';
          const logoPath = `${ownerId}/logos/${Date.now()}_logo.${ext}`;
          const { data: uploadData, error: uploadErr } = await supabase.storage
            .from('listing-images')
            .upload(logoPath, logoFile, {
              cacheControl: '3600',
              upsert: true,
              contentType: logoFile.type || 'image/png'
            });
          if (!uploadErr && uploadData?.path) {
            finalLogoUrl = uploadData.path;
          }
        } catch (e) {
          console.warn('Failed to upload logo file:', e);
        }
      }

      // Ensure no blob URLs remain in formValues
      if (typeof finalLogoUrl === 'string' && finalLogoUrl.startsWith('blob:')) {
        finalLogoUrl = '';
      }

      const cleanFormValues = { ...(draft.formValues || {}) };
      delete (cleanFormValues as any).logoFile;
      cleanFormValues.logoUrl = finalLogoUrl;

      // Construct module_data JSON payload
      const moduleData: Record<string, any> = {
        rates: draft.pricing ? {
          monthly: draft.pricing.ratePeriod === 'month' ? draft.pricing.rate : undefined,
          daily: draft.pricing.ratePeriod === 'day' ? draft.pricing.rate : undefined,
          hourly: draft.pricing.ratePeriod === 'hour' ? draft.pricing.rate : undefined,
        } : undefined,
        salary_min: draft.formValues.minSalary || draft.formValues.fixedSalary || undefined,
        salary_max: draft.formValues.maxSalary || undefined,
        employment_type: draft.formValues.employmentType || 'Full Time',
        starting_price: draft.formValues.startingPrice || draft.formValues.price || undefined,
        pricing_type: draft.formValues.pricingModel || undefined,
        condition: draft.condition || draft.formValues.condition || undefined,
        contact_preferences: draft.contactPreferences,
        rules: draft.rules,
        form_values: cleanFormValues
      };

      // 4. Insert into `listings` table
      const { data: insertedRow, error: insertError } = await supabase
        .from('listings')
        .insert({
          owner_id: ownerId,
          module: moduleType as any,
          category_id: draft.categoryId || null,
          subcategory_id: draft.subcategoryId || null,
          third_level_category_id: draft.thirdLevelId || null,
          title,
          short_summary: shortSummary,
          description,
          province_id: draft.location.provinceId || null,
          district_id: draft.location.districtId || null,
          city_id: draft.location.cityId || null,
          area_id: draft.location.areaId || null,
          exact_address: draft.location.address || null,
          latitude: draft.location.latitude || null,
          longitude: draft.location.longitude || null,
          price: priceAmount || null,
          pricing_period: pricePeriod || null,
          currency: 'LKR',
          status: 'pending', // REQUIRED: ALWAYS pending
          is_featured: false,
          module_data: moduleData,
          submitted_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError || !insertedRow) {
        console.error('Supabase listing insert failed:', insertError);
        return {
          success: false,
          listing: {} as any,
          error: insertError?.message || 'Database error occurred while submitting listing.'
        };
      }

      const listingId = insertedRow.id;
      const uploadedMediaPaths: string[] = [];

      // 5. Upload Images to Supabase Storage & Insert `listing_media`
      if (draft.images && draft.images.length > 0) {
        for (let i = 0; i < draft.images.length; i++) {
          const img = draft.images[i];
          let storagePath = img.url;

          if (img.file) {
            const ext = img.file.name.split('.').pop() || 'jpg';
            const fileName = `${ownerId}/${listingId}/${Date.now()}_${i}.${ext}`;

            const { data: uploadData, error: uploadErr } = await supabase.storage
              .from('listing-images')
              .upload(fileName, img.file, {
                cacheControl: '3600',
                upsert: true,
                contentType: img.file.type || 'image/jpeg'
              });

            if (uploadErr) {
              console.warn('Storage upload error for image:', uploadErr.message);
            } else if (uploadData?.path) {
              storagePath = uploadData.path;
            }
          }

          uploadedMediaPaths.push(storagePath);

          await supabase.from('listing_media').insert({
            listing_id: listingId,
            storage_path: storagePath,
            media_type: 'image',
            position: i,
            is_cover: img.isCover || i === 0
          });
        }
      }

      // Resolve cover URL using signed URL for private bucket
      let coverImageUrl = '';
      if (uploadedMediaPaths.length > 0) {
        const firstPath = uploadedMediaPaths[0];
        if (firstPath.startsWith('http') || firstPath.startsWith('blob:')) {
          coverImageUrl = firstPath;
        } else {
          const { data: signedData } = await supabase.storage
            .from('listing-images')
            .createSignedUrl(firstPath, 3600);
          if (signedData?.signedUrl) {
            coverImageUrl = signedData.signedUrl;
          }
        }
      }

      // Location display text
      const locationCity = draft.location.cityName || 'Sri Lanka';
      const locationDistrict = draft.location.districtName || '';
      const formattedLocation = locationDistrict ? `${locationCity}, ${locationDistrict}` : locationCity;

      // Construct canonical UserListingItem for returning result
      const newListing: UserListingItem = {
        id: listingId,
        ownerId,
        module: draft.module,
        title,
        status: 'pending',
        statusNote: 'Submitted and currently queued for moderation review.',
        imageUrl: coverImageUrl,
        location: formattedLocation,
        price: priceFormatted,
        pricePeriod,
        category: draft.categoryName,
        subcategory: draft.subcategoryName || draft.categoryName,
        postedDate: 'Just now',
        viewsCount: 0,
        inquiriesCount: 0,
        savesCount: 0,
        imagesCount: Math.max(1, draft.images.length),
        tags: [
          draft.categoryName,
          draft.subcategoryName,
          draft.location.provinceName || ''
        ].filter(Boolean) as string[],
        description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Delete local draft upon successful submission
      PostDraftService.deleteDraft(draft.module, ownerId);

      return {
        success: true,
        listing: newListing
      };
    } catch (error: any) {
      console.error('Error submitting listing:', error);
      return {
        success: false,
        listing: {} as any,
        error: error?.message || 'Failed to submit listing. Please try again.'
      };
    }
  }
}
