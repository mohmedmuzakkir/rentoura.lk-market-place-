import { UserListingItem } from '../types/profileTypes';
import { ListingDraft, normalizeNumericPrice } from '../types/postFormTypes';
import { MAX_LISTING_IMAGES, validateListingImage } from '../utils/pendingUploadImages';
import { applyRentouraWatermark } from '../utils/imageWatermark';
import { PostDraftService } from './postDraftService';
import { supabase } from '../lib/supabase';
import { AuthService } from './authService';

type SubmissionResult = { success: boolean; listing: UserListingItem; error?: string };
const failed = (error: string): SubmissionResult => ({ success: false, listing: {} as UserListingItem, error });

export class ListingSubmissionService {
  static async submitListing(draft: ListingDraft): Promise<SubmissionResult> {
    const uploadedPaths: string[] = [];
    let listingId: string | null = null;
    try {
      const title = String(draft.formValues.title || '').trim();
      if (!title) return failed('Listing title is required.');
      if (!draft.categoryId) return failed('A final category is required.');
      if (draft.images.length > MAX_LISTING_IMAGES) return failed('A listing can have no more than 5 images.');
      for (const image of draft.images) {
        if (!image.file) return failed('Every selected image must be reselected before posting.');
        const imageError = validateListingImage(image.file);
        if (imageError) return failed(imageError);
      }

      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) return failed('You must be signed in to submit a listing.');
      const ownerId = authData.user.id;
      const profile = AuthService.getCurrentProfile() || await AuthService.refreshProfile();
      if (!AuthService.hasAcceptedCurrentAgreement(profile)) {
        return failed('Accept the current User Agreement before posting.');
      }
      const moduleType = draft.module === 'rentals' ? 'rental' : draft.module === 'jobs' ? 'job' : 'service';
      const rawPrice = draft.formValues.price || draft.formValues.minSalary || draft.formValues.fixedSalary || draft.pricing?.rate || 0;
      const { amount: priceAmount, formatted: priceFormatted } = normalizeNumericPrice(rawPrice);
      const pricePeriod = moduleType === 'rental'
        ? draft.pricing?.ratePeriod === 'hour' ? '/ Hour' : draft.pricing?.ratePeriod === 'day' ? '/ Day' : '/ Month'
        : moduleType === 'service'
          ? draft.formValues.pricingModel === 'visit' ? '/ Visit' : draft.formValues.pricingModel === 'hourly' ? '/ Hour' : '/ Job'
          : '/ Month';
      const description = String(draft.formValues.description || draft.formValues.summary || '').trim();
      const cleanFormValues = { ...draft.formValues };
      const logoFile = cleanFormValues.logoFile;
      delete cleanFormValues.logoFile;
      delete cleanFormValues.restoredImageMetadata;
      delete cleanFormValues.imagesNeedReselection;
      if (typeof cleanFormValues.logoUrl === 'string' && cleanFormValues.logoUrl.startsWith('blob:')) cleanFormValues.logoUrl = '';
      const moduleData = {
        rates: draft.pricing ? { [draft.pricing.ratePeriod]: draft.pricing.rate } : undefined,
        salary_min: draft.formValues.minSalary || draft.formValues.fixedSalary || undefined,
        salary_max: draft.formValues.maxSalary || undefined,
        employment_type: draft.formValues.employmentType || undefined,
        starting_price: draft.formValues.startingPrice || draft.formValues.price || undefined,
        pricing_type: draft.formValues.pricingModel || undefined,
        condition: draft.condition || draft.formValues.condition || undefined,
        contact_preferences: draft.contactPreferences,
        rules: draft.rules,
        form_values: cleanFormValues,
      };

      const { data: listing, error: listingError } = await supabase.from('listings').insert({
        owner_id: ownerId, module: moduleType, category_id: draft.categoryId,
        subcategory_id: draft.subcategoryId || null, third_level_category_id: draft.thirdLevelId || null,
        title, short_summary: description.slice(0, 150), description,
        province_id: draft.location.provinceId || null, district_id: draft.location.districtId || null,
        city_id: draft.location.cityId || null, area_id: draft.location.areaId || null,
        exact_address: draft.location.address || null, latitude: draft.location.latitude ?? null,
        longitude: draft.location.longitude ?? null, price: priceAmount || null, pricing_period: pricePeriod,
        currency: 'LKR', status: 'pending', is_featured: false, module_data: moduleData,
        submitted_at: new Date().toISOString(),
      }).select('id, created_at, updated_at').single();
      if (listingError || !listing) return failed(listingError?.message || 'The listing could not be created.');
      listingId = listing.id;

      const orderedImages = [...draft.images].sort((a, b) => a.position - b.position);
      for (let index = 0; index < orderedImages.length; index += 1) {
        const source = orderedImages[index];
        const processed = await applyRentouraWatermark(source.file);
        const storagePath = `${ownerId}/${listingId}/${crypto.randomUUID()}.webp`;
        const { data: stored, error: uploadError } = await supabase.storage.from('listing-images').upload(
          storagePath, processed.file, { cacheControl: '3600', upsert: false, contentType: processed.mimeType });
        if (uploadError || !stored?.path) throw new Error(uploadError?.message || 'An image upload failed.');
        uploadedPaths.push(stored.path);
        const { error: mediaError } = await supabase.from('listing_media').insert({
          listing_id: listingId, storage_path: stored.path, media_type: 'image', position: index,
          is_cover: source.isCover || index === 0, width: processed.width, height: processed.height,
          file_size: processed.size, mime_type: processed.mimeType,
        });
        if (mediaError) throw new Error(mediaError.message);
      }

      if (logoFile instanceof File) {
        const processedLogo = await applyRentouraWatermark(logoFile);
        const logoPath = `${ownerId}/${listingId}/logo-${crypto.randomUUID()}.webp`;
        const { data: storedLogo, error: logoError } = await supabase.storage.from('listing-images').upload(
          logoPath, processedLogo.file, { cacheControl: '3600', upsert: false, contentType: processedLogo.mimeType });
        if (logoError || !storedLogo?.path) throw new Error(logoError?.message || 'The company logo upload failed.');
        uploadedPaths.push(storedLogo.path);
        cleanFormValues.logoUrl = storedLogo.path;
        const { error: updateError } = await supabase.from('listings').update({
          module_data: { ...moduleData, form_values: cleanFormValues },
        }).eq('id', listingId).eq('owner_id', ownerId);
        if (updateError) throw new Error(updateError.message);
      }

      const result: UserListingItem = {
        id: listingId, ownerId, module: draft.module, title, status: 'pending',
        statusNote: 'Submitted and queued for moderation review.', imageUrl: '',
        location: [draft.location.cityName, draft.location.districtName].filter(Boolean).join(', ') || 'Sri Lanka',
        price: priceFormatted, pricePeriod, category: draft.categoryName,
        subcategory: draft.subcategoryName || draft.categoryName, postedDate: 'Just now',
        viewsCount: 0, inquiriesCount: 0, savesCount: 0, imagesCount: orderedImages.length,
        tags: [draft.categoryName, draft.subcategoryName, draft.location.provinceName].filter(Boolean) as string[],
        description, createdAt: listing.created_at, updatedAt: listing.updated_at,
      };
      PostDraftService.deleteDraft(draft.module, ownerId);
      return { success: true, listing: result };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Listing submission failed.';
      if (uploadedPaths.length) {
        const { error: cleanupError } = await supabase.storage.from('listing-images').remove(uploadedPaths);
        if (cleanupError) console.error('Storage cleanup failed:', cleanupError.message);
      }
      if (listingId) {
        const { error: cleanupError } = await supabase.from('listings').delete().eq('id', listingId);
        if (cleanupError) console.error('Listing cleanup failed:', cleanupError.message);
      }
      return failed(message);
    }
  }
}
