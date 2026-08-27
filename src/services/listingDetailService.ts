import { supabase } from '../lib/supabase';
import { 
  RentalListingDetail, 
  JobListingDetail, 
  ServiceListingDetail, 
  AnyListingDetail 
} from '../types/listingDetailsTypes';
import { ProfileService } from './profileService';

export class ListingDetailService {
  /**
   * Fetches full listing detail by UUID from Supabase.
   * RLS automatically filters active listings for anonymous viewers while allowing staff/owner access.
   */
  static async getListingDetail(
    id: string, 
    moduleHint?: 'rentals' | 'jobs' | 'services'
  ): Promise<AnyListingDetail | null> {
    if (!id || typeof id !== 'string') {
      return null;
    }

    // Query Supabase listings. Anonymous callers are explicitly limited to active rows;
    // authenticated owner/staff visibility remains governed by RLS.
    try {
      const { data: { user } } = await supabase.auth.getUser();
      let listingQuery = supabase
        .from('listings')
        .select('*')
        .eq('id', id);
      if (!user) listingQuery = listingQuery.eq('status', 'active');
      const { data: listingRow, error: listingErr } = await listingQuery.maybeSingle();

      if (listingErr || !listingRow) {
        console.warn(`Listing ${id} not found in Supabase:`, listingErr?.message);
        return null;
      }

      // 3. Query listing_media with correct column 'position' and 'is_cover'
      const { data: mediaRows, error: mediaErr } = await supabase
        .from('listing_media')
        .select('id, storage_path, position, is_cover, media_type')
        .eq('listing_id', id)
        .order('is_cover', { ascending: false })
        .order('position', { ascending: true });

      if (mediaErr) {
        console.warn(`[ListingDetailService] Error fetching media for ${id}:`, mediaErr.message);
      }

      // Format image URLs using signed URLs for private 'listing-images' bucket
      const images: string[] = [];
      if (mediaRows && mediaRows.length > 0) {
        for (const m of mediaRows) {
          if (!m.storage_path) continue;
          if (m.storage_path.startsWith('http://') || m.storage_path.startsWith('https://')) {
            images.push(m.storage_path);
          } else {
            const { data: signedData } = await supabase
              .storage
              .from('listing-images')
              .createSignedUrl(m.storage_path, 3600);

            if (signedData?.signedUrl) {
              images.push(signedData.signedUrl);
            }
          }
        }
      }

      // 4. Query Location details
      let locationCity = '';
      let locationDistrict = '';
      let locationProvince = '';

      if (listingRow.city_id) {
        const { data: locRow } = await supabase
          .from('locations')
          .select('name')
          .eq('id', listingRow.city_id)
          .maybeSingle();
        if (locRow?.name) locationCity = locRow.name;
      }

      if (listingRow.district_id) {
        const { data: distRow } = await supabase
          .from('locations')
          .select('name')
          .eq('id', listingRow.district_id)
          .maybeSingle();
        if (distRow?.name) locationDistrict = distRow.name;
      }

      if (listingRow.province_id) {
        const { data: provRow } = await supabase
          .from('locations')
          .select('name')
          .eq('id', listingRow.province_id)
          .maybeSingle();
        if (provRow?.name) locationProvince = provRow.name;
      }

      // 5. Query Category details
      let categoryName = 'Rentals';
      let categoryPath = 'Rentals';
      if (listingRow.category_id) {
        const { data: catRow } = await supabase
          .from('categories')
          .select('id, name, parent_id')
          .eq('id', listingRow.category_id)
          .maybeSingle();

        if (catRow?.name) {
          categoryName = catRow.name;
          categoryPath = catRow.name;
          if (catRow.parent_id) {
            const { data: parentCat } = await supabase
              .from('categories')
              .select('name')
              .eq('id', catRow.parent_id)
              .maybeSingle();
            if (parentCat?.name) {
              categoryPath = `${parentCat.name} > ${catRow.name}`;
            }
          }
        }
      }

      // 6. Query Owner Profile (truthful, only real fields)
      let ownerInfo: {
        id: string;
        name: string;
        phone?: string;
        photoUrl?: string;
        memberSince?: string;
      } = {
        id: listingRow.owner_id || '',
        name: 'Listing Owner'
      };

      if (listingRow.owner_id) {
        const { data: profRow } = await supabase
          .from('profiles')
          .select('id, full_name, phone_normalized, avatar_url, created_at')
          .eq('id', listingRow.owner_id)
          .maybeSingle();

        if (profRow) {
          ownerInfo = {
            id: profRow.id,
            name: profRow.full_name || 'RENTOURA Member',
            phone: profRow.phone_normalized || undefined,
            photoUrl: profRow.avatar_url || undefined,
            memberSince: profRow.created_at ? new Date(profRow.created_at).getFullYear().toString() : undefined
          };
        }
      }

      // 7. Parse module_data & attributes
      const modData = (listingRow.module_data && typeof listingRow.module_data === 'object') ? listingRow.module_data : {};
      const rawMod = (listingRow.module || moduleHint || 'rental').toLowerCase();
      const moduleType = rawMod.startsWith('job') ? 'jobs' : (rawMod.startsWith('serv') ? 'services' : 'rentals');

      const realPhone = ownerInfo.phone || modData.contact_phone || modData.phone || listingRow.contact_phone || undefined;
      const realWhatsapp = modData.whatsapp || modData.whatsapp_number || (modData.allow_whatsapp && realPhone ? realPhone : undefined);

      let detailResult: AnyListingDetail;

      if (moduleType === 'jobs') {
        const empType = listingRow.job_type || modData.job_type || modData.employment_type || 'Full Time';
        const workArr = listingRow.work_mode || modData.work_mode || modData.workplace_type || 'On-site';
        const salMin = listingRow.minimum_price || listingRow.price || modData.salary_min || undefined;
        const salMax = listingRow.maximum_price || modData.salary_max || undefined;
        const salPeriod = (listingRow.pricing_period || modData.salary_period || 'Month').replace('/', '').trim();
        const salType = (salMin && salMax) ? 'range' : (salMin ? 'fixed' : (modData.negotiable ? 'negotiable' : undefined));

        detailResult = {
          id: listingRow.id,
          module: 'jobs',
          title: listingRow.title,
          category: categoryName,
          categoryPath: categoryPath,
          status: listingRow.status,
          createdAt: listingRow.created_at,
          postedDateStr: listingRow.created_at ? new Date(listingRow.created_at).toLocaleDateString() : '',
          location: {
            city: locationCity,
            district: locationDistrict,
            province: locationProvince,
            address: listingRow.exact_address || modData.address || undefined
          },
          jobHeroImage: images[0] || undefined,
          company: {
            id: ownerInfo.id,
            name: listingRow.company_name || modData.company_name || ownerInfo.name,
            logoUrl: ownerInfo.photoUrl,
            isVerified: false,
            about: modData.company_description || modData.about_company || undefined,
            foundedYear: modData.founded_year ? String(modData.founded_year) : undefined,
            employeeCount: modData.employee_count ? String(modData.employee_count) : undefined,
            industry: modData.industry ? String(modData.industry) : undefined,
            websiteUrl: modData.website_url ? String(modData.website_url) : undefined,
            location: [locationCity, locationDistrict].filter(Boolean).join(', ')
          },
          employmentType: empType,
          workArrangement: workArr,
          vacancies: modData.vacancies ? String(modData.vacancies) : '1',
          experienceLevel: modData.experience_level || modData.experience || 'Not specified',
          educationLevel: modData.education_level || modData.education || 'Not specified',
          skills: Array.isArray(modData.skills) ? modData.skills : [],
          salary: {
            type: salType,
            min: salMin,
            max: salMax,
            period: salPeriod,
            isNegotiable: Boolean(modData.negotiable)
          },
          applicationDeadline: modData.application_deadline || modData.deadline || undefined,
          workingHours: modData.working_hours || undefined,
          workingDays: modData.working_days || undefined,
          jobIdNumber: `JOB-${listingRow.id.slice(0, 8).toUpperCase()}`,
          highlights: Array.isArray(modData.highlights) ? modData.highlights : [],
          requirementsList: Array.isArray(modData.requirements) ? modData.requirements : (modData.requirements ? [String(modData.requirements)] : []),
          responsibilitiesList: Array.isArray(modData.responsibilities) ? modData.responsibilities : (modData.responsibilities ? [String(modData.responsibilities)] : []),
          benefitsList: Array.isArray(modData.benefits) ? modData.benefits : [],
          applyMethods: {
            internalApply: true,
            whatsapp: Boolean(realWhatsapp),
            phone: Boolean(realPhone),
            email: modData.contact_email || undefined
          },
          companyReviews: undefined,
          description: listingRow.description || '',
          ownerId: listingRow.owner_id,
          contact: {
            phone: realPhone,
            whatsappNumber: realWhatsapp,
            allowInternalMessage: Boolean(listingRow.owner_id)
          }
        } as JobListingDetail;
      } else if (moduleType === 'services') {
        const portImgs = Array.isArray(modData.portfolio_images) 
          ? modData.portfolio_images 
          : (images.length > 1 ? images.slice(1) : []);

        const packagesList = Array.isArray(modData.packages) 
          ? modData.packages 
          : (Array.isArray(modData.pricing_models) 
              ? modData.pricing_models.map((m: any) => ({
                  title: m.name || m.title || 'Standard Package',
                  price: `Rs. ${Number(m.price || 0).toLocaleString()}`,
                  unit: m.unit || '/ Visit'
                }))
              : []);

        detailResult = {
          id: listingRow.id,
          module: 'services',
          title: listingRow.title,
          category: categoryName,
          categoryPath: categoryPath,
          isVerified: false,
          isFeatured: Boolean(listingRow.is_featured),
          status: listingRow.status,
          createdAt: listingRow.created_at,
          postedDateStr: listingRow.created_at ? new Date(listingRow.created_at).toLocaleDateString() : '',
          location: {
            city: locationCity,
            district: locationDistrict,
            province: locationProvince,
            address: listingRow.exact_address || modData.address || undefined,
            lat: listingRow.lat || modData.lat || undefined,
            lng: listingRow.lng || modData.lng || undefined
          },
          images,
          portfolioImages: portImgs,
          startingPrice: {
            amount: listingRow.price || listingRow.minimum_price || modData.starting_price || 0,
            unit: listingRow.pricing_period || modData.pricing_unit || '/ Visit'
          },
          packages: packagesList,
          serviceType: listingRow.service_type || modData.service_type || 'On-site Service',
          experienceYears: modData.experience_years ? `${modData.experience_years} Years` : (modData.experience || undefined),
          serviceMode: modData.service_mode || modData.work_mode || 'On-site',
          availabilityDays: modData.availability_days || modData.working_days || undefined,
          availabilityHours: modData.availability_hours || modData.working_hours || undefined,
          sameDayBooking: Boolean(modData.same_day_booking),
          emergencyService: Boolean(modData.emergency_service),
          responseTime: modData.response_time || undefined,
          teamSize: modData.team_size ? String(modData.team_size) : undefined,
          equipmentProvided: modData.equipment_provided != null ? Boolean(modData.equipment_provided) : undefined,
          provider: {
            id: ownerInfo.id,
            name: listingRow.business_name || modData.business_name || ownerInfo.name,
            photoUrl: ownerInfo.photoUrl,
            isVerified: false,
            isBusinessRegistered: false,
            isBackgroundChecked: false,
            isIdVerified: false,
            isInsuranceCovered: false,
            completedJobsCount: modData.completed_jobs != null ? Number(modData.completed_jobs) : undefined,
            positiveReviewsPercentage: modData.positive_rating ? `${modData.positive_rating}%` : undefined,
            experience: modData.experience_years ? `${modData.experience_years} Years` : undefined
          },
          customerReviews: undefined,
          description: listingRow.description || '',
          ownerId: listingRow.owner_id,
          contact: {
            phone: realPhone,
            whatsappNumber: realWhatsapp,
            allowInternalMessage: Boolean(listingRow.owner_id)
          }
        } as ServiceListingDetail;
      } else {
        // Default Rental
        const rates = Array.isArray(modData.rates) && modData.rates.length > 0
          ? modData.rates
          : [
              {
                label: 'Standard Rate',
                price: listingRow.price || 0,
                unit: (listingRow.pricing_period || modData.rental_period || 'Month').replace('/', '').trim()
              }
            ];

        const specs: { label: string; value: string }[] = [];
        if (modData.condition) specs.push({ label: 'Condition', value: String(modData.condition) });
        if (modData.brand) specs.push({ label: 'Brand', value: String(modData.brand) });
        if (modData.model) specs.push({ label: 'Model', value: String(modData.model) });
        if (modData.year) specs.push({ label: 'Year', value: String(modData.year) });
        if (modData.bedrooms) specs.push({ label: 'Bedrooms', value: String(modData.bedrooms) });
        if (modData.bathrooms) specs.push({ label: 'Bathrooms', value: String(modData.bathrooms) });
        if (modData.fuel_type) specs.push({ label: 'Fuel Type', value: String(modData.fuel_type) });
        if (modData.transmission) specs.push({ label: 'Transmission', value: String(modData.transmission) });
        if (locationCity) specs.push({ label: 'City', value: locationCity });
        if (locationDistrict) specs.push({ label: 'District', value: locationDistrict });

        detailResult = {
          id: listingRow.id,
          title: listingRow.title,
          module: 'rentals',
          category: categoryName,
          categoryPath: categoryPath,
          pricing: {
            rates,
            deposit: modData.deposit ?? modData.security_deposit ?? undefined,
            currency: 'LKR',
            isNegotiable: Boolean(modData.negotiable ?? modData.is_negotiable ?? false)
          },
          location: {
            city: locationCity,
            district: locationDistrict,
            province: locationProvince,
            fullAddress: listingRow.exact_address || [locationCity, locationDistrict, locationProvince].filter(Boolean).join(', '),
            lat: listingRow.lat || modData.lat || undefined,
            lng: listingRow.lng || modData.lng || undefined
          },
          images,
          owner: ownerInfo,
          description: listingRow.description || '',
          features: Array.isArray(modData.features) ? modData.features : [],
          specs,
          rules: Array.isArray(modData.rules) ? modData.rules : [],
          contact: {
            phone: realPhone,
            whatsapp: realWhatsapp,
            allowDirectChat: Boolean(listingRow.owner_id),
            allowInternalMessage: Boolean(listingRow.owner_id)
          }
        } as unknown as RentalListingDetail;
      }

      return detailResult;

    } catch (e) {
      console.error(`[ListingDetailService] Exception fetching listing detail for ${id}:`, e);
      return null;
    }
  }

  static clearCache(id?: string) {
    void id;
  }
}
