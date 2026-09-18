import { UserListingItem } from '../types/profileTypes';
import { ListingDraft, normalizeNumericPrice, PostModule, LocationDataState, PendingUploadImage } from '../types/postFormTypes';
import { MAX_LISTING_IMAGES, validateListingImage } from '../utils/pendingUploadImages';
import { applyRentouraWatermark } from '../utils/imageWatermark';
import { PostDraftService } from './postDraftService';
import { supabase } from '../lib/supabase';
import { AuthService } from './authService';

type SubmissionResult = { success: boolean; listing: UserListingItem; error?: string };
const failed = (error: string): SubmissionResult => ({ success: false, listing: {} as UserListingItem, error });

export class ListingSubmissionService {
  static async fetchListingForEdit(listingId: string, module: PostModule): Promise<ListingDraft | null> {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) return null;
      const ownerId = authData.user.id;

      const { data: listing, error } = await supabase
        .from('listings')
        .select(`
          *,
          category:category_id (name, slug),
          subcategory:subcategory_id (name, slug),
          third_level:third_level_category_id (name, slug),
          listing_media (id, storage_path, media_type, position, is_cover)
        `)
        .eq('id', listingId)
        .eq('owner_id', ownerId)
        .single();

      if (error || !listing) return null;

      if (
        (module === 'rentals' && listing.module !== 'rental') ||
        (module === 'jobs' && listing.module !== 'job') ||
        (module === 'services' && listing.module !== 'service')
      ) return null;

      const mediaFiles = await Promise.all((listing.listing_media || []).map(async (m: any) => {
        const { data } = await supabase.storage.from('listing-images').createSignedUrl(m.storage_path, 3600);
        return {
          id: m.id,
          file: null as any,
          previewUrl: data?.signedUrl || supabase.storage.from('listing-images').getPublicUrl(m.storage_path).data.publicUrl,
          name: m.storage_path.split('/').pop() || 'image.webp',
          size: 0,
          mimeType: 'image/webp',
          isCover: m.is_cover,
          position: m.position,
          storagePath: m.storage_path
        };
      }));

      const md = listing.module_data || {};
      const fv = md.form_values || {};
      const contactPrefs = md.contact_preferences || {
        showPhone: true, phone: '', showWhatsApp: false, whatsappNumber: '', allowDirectChat: false
      };

      const location: LocationDataState = {
        provinceId: listing.province_id,
        districtId: listing.district_id,
        cityId: listing.city_id,
        areaId: listing.area_id,
        address: listing.exact_address,
        latitude: listing.latitude,
        longitude: listing.longitude
      };

      const draft: ListingDraft = {
        id: listing.id,
        ownerId: listing.owner_id,
        module: module,
        categoryId: listing.category_id,
        categoryName: listing.category?.name || '',
        subcategoryId: listing.subcategory_id || '',
        subcategoryName: listing.subcategory?.name || '',
        thirdLevelId: listing.third_level_category_id || undefined,
        thirdLevelName: listing.third_level?.name || undefined,
        categoryPath: [listing.category?.name, listing.subcategory?.name, listing.third_level?.name].filter(Boolean).join(' / '),
        currentStep: 1,
        formValues: {
          ...md,
          ...fv,
          title: listing.title,
          description: listing.description,
          price: listing.price,
          companyName: md.company_name || md.companyName || fv.companyName,
          providerName: md.provider_name || md.providerName || fv.providerName,
          jobType: md.job_type || md.employment_type || md.jobType || fv.jobType || fv.employmentType,
          workMode: md.work_mode || md.workMode || fv.workMode,
          experienceLevel: md.experience_level || md.experienceLevel || fv.experienceLevel,
          vehicleType: md.vehicle_type || md.vehicleType || fv.vehicleType,
          propertyType: md.property_type || md.propertyType || fv.propertyType,
          minSalary: md.salary_min || md.minSalary || fv.minSalary,
          maxSalary: md.salary_max || md.maxSalary || fv.maxSalary,
          fixedSalary: md.salary_fixed || md.fixedSalary || fv.fixedSalary
        },
        location,
        images: mediaFiles,
        contactPreferences: contactPrefs,
        rules: md.rules ? md.rules : undefined,
        pricing: md.pricing ? md.pricing : undefined,
        lastSavedAt: Date.now()
      };

      if (md.rates && !draft.pricing) {
        const ratePeriod = Object.keys(md.rates)[0] as any;
        draft.pricing = { rate: md.rates[ratePeriod] || 0, ratePeriod, depositRequired: false, minRentalDuration: '1 day', bookingType: 'inquire', availableImmediately: true };
      }

      return draft;
    } catch (err) {
      console.error('Error fetching listing for edit:', err);
      return null;
    }
  }

  static async submitListing(draft: ListingDraft, editListingId?: string): Promise<SubmissionResult> {
    const uploadedPaths: string[] = [];
    const targetId = editListingId || (draft.id.startsWith('draft-') ? null : draft.id);
    let listingId: string | null = targetId || null;
    try {
      const title = String(draft.formValues.title || '').trim();
      if (!title) return failed('Listing title is required.');
      if (!draft.categoryId) return failed('A final category is required.');
      if (draft.images.length > MAX_LISTING_IMAGES) return failed('A listing can have no more than 5 images.');
      for (const image of draft.images) {
        if (!image.file && !(image as any).storagePath) return failed('Every selected image must be reselected before posting.');
        if (image.file) {
          const imageError = validateListingImage(image.file);
          if (imageError) return failed(imageError);
        }
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
      const logoPathValue = cleanFormValues.logoUrl || cleanFormValues.companyLogo || undefined;
      const moduleData = {
        rates: draft.pricing ? { [draft.pricing.ratePeriod]: draft.pricing.rate } : undefined,
        salary_min: draft.formValues.minSalary || draft.formValues.fixedSalary || undefined,
        salary_max: draft.formValues.maxSalary || undefined,
        employment_type: draft.formValues.employmentType || undefined,
        starting_price: draft.formValues.startingPrice || draft.formValues.price || undefined,
        pricing_type: draft.formValues.pricingModel || undefined,
        condition: draft.condition || draft.formValues.condition || undefined,
        company_name: cleanFormValues.companyName || cleanFormValues.employerName || undefined,
        company_logo_url: logoPathValue,
        logoUrl: logoPathValue,
        contact_preferences: draft.contactPreferences,
        rules: draft.rules,
        form_values: cleanFormValues,
      };

      const dbPayload = {
        owner_id: ownerId, module: moduleType, category_id: draft.categoryId,
        subcategory_id: draft.subcategoryId || null, third_level_category_id: draft.thirdLevelId || null,
        title, short_summary: description.slice(0, 150), description,
        province_id: draft.location.provinceId || null, district_id: draft.location.districtId || null,
        city_id: draft.location.cityId || null, area_id: draft.location.areaId || null,
        exact_address: draft.location.address || null, latitude: draft.location.latitude ?? null,
        longitude: draft.location.longitude ?? null, price: priceAmount || null, pricing_period: pricePeriod,
        currency: 'LKR', status: 'active', is_featured: false, module_data: moduleData,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      let listing: any = null;
      let listingError: any = null;

      if (targetId) {
        const { data: updateData, error: updateError } = await supabase.from('listings').update(dbPayload)
          .eq('id', targetId).eq('owner_id', ownerId).select('id, created_at, updated_at').single();
        listing = updateData;
        listingError = updateError;
      } else {
        const { data: insertData, error: insertError } = await supabase.from('listings').insert({
          ...dbPayload,
          submitted_at: new Date().toISOString(),
        }).select('id, created_at, updated_at').single();
        listing = insertData;
        listingError = insertError;
      }

      if (listingError || !listing) return failed(listingError?.message || 'The listing could not be saved.');
      listingId = listing.id;

      const orderedImages = [...draft.images].sort((a, b) => a.position - b.position);
      
      if (targetId) {
        const keepIds = orderedImages.map(img => img.id).filter(Boolean);
        if (keepIds.length > 0) {
           await supabase.from('listing_media').delete().eq('listing_id', listingId).not('id', 'in', `(${keepIds.join(',')})`);
        } else {
           await supabase.from('listing_media').delete().eq('listing_id', listingId);
        }
      }

      for (let index = 0; index < orderedImages.length; index += 1) {
        const source = orderedImages[index];
        if (!source.file && (source as any).storagePath) {
           await supabase.from('listing_media').update({ position: index, is_cover: source.isCover || index === 0 }).eq('id', source.id);
           continue;
        }
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
        const updatedModuleData = {
          ...moduleData,
          company_logo_url: storedLogo.path,
          logoUrl: storedLogo.path,
          form_values: cleanFormValues
        };
        const { error: updateError } = await supabase.from('listings').update({
          module_data: updatedModuleData,
        }).eq('id', listingId).eq('owner_id', ownerId);
        if (updateError) throw new Error(updateError.message);

        // Also record in listing_media table so media queries pick it up automatically
        await supabase.from('listing_media').insert({
          listing_id: listingId,
          storage_path: storedLogo.path,
          media_type: 'image',
          position: 0,
          is_cover: true,
          width: processedLogo.width,
          height: processedLogo.height,
          file_size: processedLogo.size,
          mime_type: processedLogo.mimeType,
        });
      }

      const result: UserListingItem = {
        id: listingId, ownerId, module: draft.module, title, status: 'active',
        statusNote: targetId ? 'Updates have been published and are now active.' : 'Listing is now active.', imageUrl: '',
        location: [draft.location.cityName, draft.location.districtName].filter(Boolean).join(', ') || 'Sri Lanka',
        price: priceFormatted, pricePeriod, category: draft.categoryName,
        subcategory: draft.subcategoryName || draft.categoryName, postedDate: 'Just now',
        viewsCount: 0, inquiriesCount: 0, savesCount: 0, imagesCount: orderedImages.length,
        tags: [draft.categoryName, draft.subcategoryName, draft.location.provinceName].filter(Boolean) as string[],
        description, createdAt: listing.created_at, updatedAt: listing.updated_at,
      };
      if (!editListingId) PostDraftService.deleteDraft(draft.module, ownerId);
      return { success: true, listing: result };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Listing submission failed.';
      if (uploadedPaths.length) {
        const { error: cleanupError } = await supabase.storage.from('listing-images').remove(uploadedPaths);
        if (cleanupError) console.error('Storage cleanup failed:', cleanupError.message);
      }
      if (listingId && !editListingId) {
        const { error: cleanupError } = await supabase.from('listings').delete().eq('id', listingId);
        if (cleanupError) console.error('Listing cleanup failed:', cleanupError.message);
      }
      return failed(message);
    }
  }
}
