import { supabase } from '../lib/supabase';
import { sanitizeListingImageUrl } from '../utils/cleanImageResolver';
import { 
  RentalListingDetail, 
  JobListingDetail, 
  ServiceListingDetail, 
  AnyListingDetail,
  ListingAttribute 
} from '../types/listingDetailsTypes';
import { getCategoryFormSchema } from '../data/formSchemas/categorySchemas';
import { ProfileService } from './profileService';
import { formatListingDate } from '../utils/dateUtils';

const detailCache = new Map<string, { timestamp: number; data: AnyListingDetail }>();
const CACHE_TTL_MS = 1000 * 60 * 5; // 5 minutes cache

export class ListingDetailService {
  /**
   * Fetches full listing detail by UUID from Supabase.
   * RLS automatically filters active listings for anonymous viewers while allowing staff/owner access.
   */
  static async getListingDetail(
    id: string, 
    moduleHint?: 'rentals' | 'jobs' | 'services',
    forceRefresh: boolean = false
  ): Promise<AnyListingDetail | null> {
    if (!id || typeof id !== 'string') {
      return null;
    }

    if (!forceRefresh) {
      const cached = detailCache.get(id);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return cached.data;
      }
    }

    try {
      // 1. Fetch listing (with location & category joins) and media in parallel for maximum speed!
      const [listingRes, mediaRes] = await Promise.all([
        supabase
          .from('listings')
          .select(`
            *,
            categories:category_id ( id, name, parent_id ),
            city:city_id ( id, name ),
            district:district_id ( id, name ),
            province:province_id ( id, name )
          `)
          .eq('id', id)
          .maybeSingle(),
        supabase
          .from('listing_media')
          .select('id, storage_path, position, is_cover, media_type')
          .eq('listing_id', id)
          .order('is_cover', { ascending: false })
          .order('position', { ascending: true })
      ]);

      const listingRow = listingRes.data;
      const listingErr = listingRes.error;
      const mediaRows = mediaRes.data;

      if (listingErr || !listingRow) {
        console.warn(`Listing ${id} not found in Supabase:`, listingErr?.message);
        return null;
      }

      // 2. Parallelize secondary queries: owner profile & parent category name
      const ownerId = listingRow.owner_id;
      const parentCatId = (listingRow.categories as any)?.parent_id;

      const [profRes, parentCatRes] = await Promise.all([
        ownerId 
          ? supabase.from('profiles').select('id, full_name, phone_normalized, avatar_url, created_at').eq('id', ownerId).maybeSingle()
          : Promise.resolve({ data: null }),
        parentCatId 
          ? supabase.from('categories').select('name').eq('id', parentCatId).maybeSingle()
          : Promise.resolve({ data: null })
      ]);

      if (mediaRes.error) {
        console.warn(`[ListingDetailService] Error fetching media for ${id}:`, mediaRes.error.message);
      }

      if (mediaRes.error) {
        console.warn(`[ListingDetailService] Error fetching media for ${id}:`, mediaRes.error.message);
      }

      // Format image URLs using a single batched storage request
      const images: string[] = [];
      if (mediaRows && mediaRows.length > 0) {
        const rawPaths: string[] = [];
        const directUrls: string[] = [];

        for (const m of mediaRows) {
          if (!m.storage_path) continue;
          if (m.storage_path.startsWith('http://') || m.storage_path.startsWith('https://')) {
            directUrls.push(m.storage_path);
          } else {
            rawPaths.push(m.storage_path);
          }
        }

        const signedMap = new Map<string, string>();
        if (rawPaths.length > 0) {
          try {
            const { data: batchSigned } = await supabase.storage
              .from('listing-images')
              .createSignedUrls(rawPaths, 3600);

            if (batchSigned && Array.isArray(batchSigned)) {
              batchSigned.forEach((item) => {
                if (item.path && item.signedUrl) {
                  signedMap.set(item.path, item.signedUrl);
                }
              });
            }
          } catch (e) {
            console.warn('[ListingDetailService] Error batch signing gallery images:', e);
          }
        }

        for (const m of mediaRows) {
          if (!m.storage_path) continue;
          let imgUrl: string | null = null;
          if (m.storage_path.startsWith('http://') || m.storage_path.startsWith('https://')) {
            imgUrl = m.storage_path;
          } else {
            imgUrl = signedMap.get(m.storage_path) || null;
          }
          if (imgUrl) {
            images.push(imgUrl);
          }
        }
      }

      const cleanForListingId = sanitizeListingImageUrl(id);
      if (cleanForListingId && cleanForListingId.startsWith('http')) {
        if (images.length === 0) {
          images.push(cleanForListingId);
        } else {
          images[0] = cleanForListingId;
        }
      }

      // 4. Map Location details
      const locationCity = (listingRow.city as any)?.name || '';
      const locationDistrict = (listingRow.district as any)?.name || '';
      const locationProvince = (listingRow.province as any)?.name || '';

      // 5. Map Category details
      let categoryName = 'Rentals';
      let categoryPath = 'Rentals';
      const catObj = (listingRow.categories as any);
      
      if (catObj?.name) {
        categoryName = catObj.name;
        categoryPath = parentCatRes.data?.name 
          ? `${parentCatRes.data.name} > ${catObj.name}` 
          : catObj.name;
      }

      // 6. Map Owner Profile
      const profRow = profRes.data;
      let ownerInfo: {
        id: string;
        name: string;
        phone?: string;
        photoUrl?: string;
        memberSince?: string;
      } = {
        id: listingRow.owner_id || '',
        name: profRow?.full_name || 'RENTOURA Member'
      };

      if (profRow) {
        ownerInfo.phone = profRow.phone_normalized || undefined;
        ownerInfo.photoUrl = profRow.avatar_url || undefined;
        ownerInfo.memberSince = profRow.created_at ? new Date(profRow.created_at).getFullYear().toString() : undefined;
      }

      // 7. Parse module_data & attributes
      let modData = (listingRow.module_data && typeof listingRow.module_data === 'object') ? 
        { ...listingRow.module_data } : {};
      
      // Flatten form_values if it exists so properties like bedrooms, bathrooms are found
      if (modData.form_values && typeof modData.form_values === 'object') {
        modData = { ...modData.form_values, ...modData };
      }

      const rawMod = (listingRow.module || moduleHint || 'rental').toLowerCase();
      const moduleType = rawMod.startsWith('job') ? 'jobs' : (rawMod.startsWith('serv') ? 'services' : 'rentals');

      const realPhone = ownerInfo.phone || modData.contact_phone || modData.phone || listingRow.contact_phone || undefined;
      const realWhatsapp = modData.whatsapp || modData.whatsapp_number || (modData.allow_whatsapp && realPhone ? realPhone : undefined);

      let detailResult: AnyListingDetail;

      if (moduleType === 'jobs') {
        const empType = listingRow.job_type || modData.job_type || modData.employment_type || modData.form_values?.employmentType || modData.form_values?.jobType || 'Full Time';
        const workArr = listingRow.work_mode || modData.work_mode || modData.workplace_type || modData.form_values?.workMode || 'On-site';
        
        const rawMin = listingRow.minimum_price ?? listingRow.price ?? modData.salary_min ?? modData.minSalary ?? modData.fixedSalary ?? modData.form_values?.minSalary ?? modData.form_values?.fixedSalary ?? modData.form_values?.price;
        const rawMax = listingRow.maximum_price ?? modData.salary_max ?? modData.maxSalary ?? modData.form_values?.maxSalary;

        const salMin = rawMin != null && !isNaN(Number(rawMin)) ? Number(rawMin) : undefined;
        const salMax = rawMax != null && !isNaN(Number(rawMax)) ? Number(rawMax) : undefined;
        const validSalMin = (salMin && salMin > 0) ? salMin : undefined;
        const validSalMax = (salMax && salMax > 0) ? salMax : undefined;

        const salPeriod = (listingRow.pricing_period || modData.salary_period || modData.form_values?.salaryPeriod || 'Month').replace('/', '').trim();
        const salType = (validSalMin && validSalMax) ? 'range' : (validSalMin ? 'fixed' : (modData.negotiable || modData.is_negotiable ? 'negotiable' : undefined));

        const { attributes } = ListingDetailService.buildCategoryAttributes(
          'jobs',
          listingRow.category_id,
          listingRow.subcategory_id,
          categoryName,
          undefined,
          modData
        );

        detailResult = {
          id: listingRow.id,
          module: 'jobs',
          title: listingRow.title,
          category: categoryName,
          categoryPath: categoryPath,
          status: listingRow.status,
          createdAt: listingRow.created_at,
          postedDateStr: formatListingDate(listingRow.created_at),
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
            min: validSalMin,
            max: validSalMax,
            period: salPeriod,
            isNegotiable: Boolean(modData.negotiable || modData.is_negotiable)
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
          requiredAttachments: {
            cv: Boolean(modData.form_values?.reqCv),
            coverLetter: Boolean(modData.form_values?.reqCoverLetter),
            portfolio: Boolean(modData.form_values?.reqPortfolio)
          },
          companyReviews: undefined,
          description: listingRow.description || '',
          ownerId: listingRow.owner_id,
          attributes,
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

        const rawStartingPrice = listingRow.price ?? listingRow.minimum_price ?? modData.starting_price ?? modData.price ?? modData.form_values?.startingPrice ?? modData.form_values?.price;
        const parsedStartingPrice = rawStartingPrice != null && !isNaN(Number(rawStartingPrice)) ? Number(rawStartingPrice) : 0;
        const validStartingPrice = parsedStartingPrice > 0 ? parsedStartingPrice : 0;
        const pricingUnit = (listingRow.pricing_period || modData.pricing_unit || modData.form_values?.pricingModel || '/ Visit').replace('Per ', '').trim();

        const { attributes } = ListingDetailService.buildCategoryAttributes(
          'services',
          listingRow.category_id,
          listingRow.subcategory_id,
          categoryName,
          undefined,
          modData
        );

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
          postedDateStr: formatListingDate(listingRow.created_at),
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
            amount: validStartingPrice,
            unit: pricingUnit
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
          attributes,
          contact: {
            phone: realPhone,
            whatsappNumber: realWhatsapp,
            allowInternalMessage: Boolean(listingRow.owner_id)
          }
        } as ServiceListingDetail;
      } else {
        // Default Rental
        let parsedRates: any[] = [];

        if (Array.isArray(modData.rates) && modData.rates.length > 0) {
          parsedRates = modData.rates.map((r: any) => {
            const num = typeof r.price === 'number' ? r.price : Number(r.price) || Number(r.rate) || Number(r.amount) || 0;
            const rawUnit = String(r.unit || r.ratePeriod || r.period || 'Day').replace('/', '').trim();
            const unit = rawUnit.charAt(0).toUpperCase() + rawUnit.slice(1);
            return {
              unit,
              price: num,
              label: num > 0 ? `Rs. ${num.toLocaleString()}` : (r.label && r.label !== 'Standard Rate' ? r.label : 'Price on request')
            };
          });
        } else if (modData.rates && typeof modData.rates === 'object' && Object.keys(modData.rates).length > 0) {
          parsedRates = Object.entries(modData.rates).map(([key, val]) => {
            const num = typeof val === 'number' ? val : Number(val) || 0;
            const cleanKey = key.replace('/', '').trim();
            const unit = cleanKey.charAt(0).toUpperCase() + cleanKey.slice(1);
            return {
              unit,
              price: num,
              label: num > 0 ? `Rs. ${num.toLocaleString()}` : 'Price on request'
            };
          });
        } else if (modData.pricing?.rate) {
          const num = Number(modData.pricing.rate) || 0;
          const rawUnit = String(modData.pricing.ratePeriod || 'Day').replace('/', '').trim();
          const unit = rawUnit.charAt(0).toUpperCase() + rawUnit.slice(1);
          parsedRates = [{
            unit,
            price: num,
            label: num > 0 ? `Rs. ${num.toLocaleString()}` : 'Price on request'
          }];
        }

        if (parsedRates.length === 0) {
          const fallbackPrice = Number(listingRow.price) || Number(modData.price) || Number(modData.starting_price) || Number(modData.form_values?.price) || 0;
          const rawPeriod = String(listingRow.pricing_period || modData.rental_period || modData.pricing_period || 'Month').replace('/', '').trim();
          const unit = rawPeriod ? (rawPeriod.charAt(0).toUpperCase() + rawPeriod.slice(1)) : 'Month';
          parsedRates = [{
            unit,
            price: fallbackPrice,
            label: fallbackPrice > 0 ? `Rs. ${fallbackPrice.toLocaleString()}` : 'Price on request'
          }];
        }

        const activePeriod = parsedRates[0]?.unit || 'Day';

        const { attributes, specs } = ListingDetailService.buildCategoryAttributes(
          'rentals',
          listingRow.category_id,
          listingRow.subcategory_id,
          categoryName,
          undefined,
          modData
        );

        if (locationCity && !specs.some(s => s.label === 'City')) {
          specs.push({ label: 'City', value: locationCity });
        }
        if (locationDistrict && !specs.some(s => s.label === 'District')) {
          specs.push({ label: 'District', value: locationDistrict });
        }

        detailResult = {
          id: listingRow.id,
          title: listingRow.title,
          module: 'rentals',
          category: categoryName,
          categoryPath: categoryPath,
          pricing: {
            activePeriod,
            rates: parsedRates,
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
          attributes,
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

      detailCache.set(id, { timestamp: Date.now(), data: detailResult });
      return detailResult;

    } catch (e) {
      console.error(`[ListingDetailService] Exception fetching listing detail for ${id}:`, e);
      return null;
    }
  }

  /**
   * Dynamically constructs category-specific attributes and specs
   * using the category's form schema as the source of truth.
   */
  public static buildCategoryAttributes(
    module: 'rentals' | 'jobs' | 'services',
    categoryId?: string,
    subcategoryId?: string,
    categoryName?: string,
    subcategoryName?: string,
    modData: Record<string, any> = {}
  ): { attributes: ListingAttribute[]; specs: { label: string; value: string }[] } {
    const formValues: Record<string, any> = {};
    if (modData.form_values && typeof modData.form_values === 'object') {
      Object.assign(formValues, modData.form_values);
    }
    Object.keys(modData).forEach(key => {
      if (key !== 'form_values' && modData[key] !== undefined && modData[key] !== null) {
        formValues[key] = modData[key];
      }
    });

    const schema = getCategoryFormSchema(module, categoryId, subcategoryId, categoryName, subcategoryName);
    const attributes: ListingAttribute[] = [];
    const specs: { label: string; value: string }[] = [];
    const processedKeys = new Set<string>();

    const ignoredKeys = new Set([
      'title', 'description', 'summary', 'short_summary', 'price', 'pricingModel',
      'startingPrice', 'starting_price', 'minSalary', 'maxSalary', 'fixedSalary',
      'salary_min', 'salary_max', 'salaryPeriod', 'salary_period', 'images',
      'portfolioImages', 'rates', 'depositRequired', 'minRentalDuration',
      'bookingType', 'logoFile', 'logoUrl', 'imagesNeedReselection',
      'restoredImageMetadata', 'contact_preferences', 'contactPreferences', 'rules',
      'features', 'contact_phone', 'whatsapp', 'whatsapp_number', 'allow_whatsapp',
      'form_values', 'company_name', 'company_description', 'about_company',
      'founded_year', 'employee_count', 'industry', 'website_url', 'contact_email',
      'reqCv', 'reqCoverLetter', 'reqPortfolio', 'job_type', 'employment_type',
      'work_mode', 'workplace_type', 'lat', 'lng', 'exact_address', 'address'
    ]);

    const selectIcon = (fieldId: string, label: string): string => {
      const key = (fieldId + ' ' + label).toLowerCase();
      if (key.includes('year') || key.includes('date') || key.includes('time')) return 'calendar';
      if (key.includes('fuel')) return 'fuel';
      if (key.includes('mileage') || key.includes('speed') || key.includes('km')) return 'gauge';
      if (key.includes('seat') || key.includes('capacity') || key.includes('passenger') || key.includes('people') || key.includes('user') || key.includes('guest')) return 'users';
      if (key.includes('color') || key.includes('palette')) return 'palette';
      if (key.includes('car') || key.includes('vehicle') || key.includes('make') || key.includes('model') || key.includes('transmission') || key.includes('drive')) return 'car';
      if (key.includes('room') || key.includes('bed') || key.includes('bath') || key.includes('house') || key.includes('flat') || key.includes('apartment') || key.includes('area') || key.includes('floor')) return 'home';
      if (key.includes('power') || key.includes('electric') || key.includes('watt') || key.includes('volt') || key.includes('engine') || key.includes('cc')) return 'zap';
      return 'tag';
    };

    const getValue = (fieldId: string): any => {
      if (formValues[fieldId] !== undefined) return formValues[fieldId];
      const snake = fieldId.replace(/([A-Z])/g, '_$1').toLowerCase();
      if (formValues[snake] !== undefined) return formValues[snake];
      const camel = fieldId.replace(/_([a-z])/g, (_, g) => g.toUpperCase());
      if (formValues[camel] !== undefined) return formValues[camel];

      if (fieldId === 'make' || fieldId === 'brand') {
        return formValues.make ?? formValues.brand ?? formValues.vehicle_make ?? formValues.manufacturer;
      }
      if (fieldId === 'model') {
        return formValues.model ?? formValues.vehicle_model;
      }
      if (fieldId === 'year') {
        return formValues.year ?? formValues.manufacture_year;
      }
      if (fieldId === 'fuelType') {
        return formValues.fuelType ?? formValues.fuel_type ?? formValues.fuel;
      }
      if (fieldId === 'transmission') {
        return formValues.transmission;
      }
      if (fieldId === 'bedrooms') {
        return formValues.bedrooms ?? formValues.bedroom_count ?? formValues.beds;
      }
      if (fieldId === 'bathrooms') {
        return formValues.bathrooms ?? formValues.bathroom_count ?? formValues.baths;
      }
      if (fieldId === 'seats' || fieldId === 'seatingCapacity') {
        return formValues.seats ?? formValues.seatCount ?? formValues.seat_count ?? formValues.seatingCapacity ?? formValues.passengerCapacity;
      }

      return undefined;
    };

    const findOptionLabel = (field: any, val: any): string => {
      if (val === null || val === undefined) return '';
      const strVal = String(val).trim();
      if (!strVal) return '';

      if (field.options && Array.isArray(field.options)) {
        const match = field.options.find((o: any) => 
          String(o.id).toLowerCase() === strVal.toLowerCase() ||
          String(o.label).toLowerCase() === strVal.toLowerCase() ||
          (strVal.length < 5 && String(o.id).split('_')[0] === strVal)
        );
        if (match) return match.label;
      }
      return strVal;
    };

    // 1. Process fields defined in the schema
    if (schema && Array.isArray(schema.fields)) {
      for (const field of schema.fields) {
        if (!field.id || ignoredKeys.has(field.id)) continue;

        const rawVal = getValue(field.id);
        if (rawVal === undefined || rawVal === null || rawVal === '' || (Array.isArray(rawVal) && rawVal.length === 0)) {
          continue;
        }

        processedKeys.add(field.id);
        const snake = field.id.replace(/([A-Z])/g, '_$1').toLowerCase();
        processedKeys.add(snake);

        let displayVal = '';

        if (typeof rawVal === 'boolean') {
          displayVal = rawVal ? 'Yes' : 'No';
        } else if (Array.isArray(rawVal)) {
          displayVal = rawVal.map(v => findOptionLabel(field, v)).filter(Boolean).join(', ');
        } else {
          displayVal = findOptionLabel(field, rawVal);
        }

        if (displayVal) {
          if (field.suffix && !displayVal.toLowerCase().endsWith(field.suffix.toLowerCase())) {
            displayVal = `${displayVal} ${field.suffix}`;
          }
          if (field.prefix && !displayVal.toLowerCase().startsWith(field.prefix.toLowerCase())) {
            displayVal = `${field.prefix} ${displayVal}`;
          }

          const iconName = selectIcon(field.id, field.label);
          attributes.push({ label: field.label, value: displayVal, iconName });
          specs.push({ label: field.label, value: displayVal });
        }
      }
    }

    // 2. Process extra fallback fields in formValues that weren't in schema.fields
    const knownFallbacks: { key: string; label: string; iconName?: string }[] = [
      { key: 'make', label: 'Make / Brand', iconName: 'car' },
      { key: 'brand', label: 'Brand', iconName: 'car' },
      { key: 'model', label: 'Model', iconName: 'car' },
      { key: 'year', label: 'Year', iconName: 'calendar' },
      { key: 'seats', label: 'Seating Capacity', iconName: 'users' },
      { key: 'condition', label: 'Condition', iconName: 'tag' },
      { key: 'bedrooms', label: 'Bedrooms', iconName: 'home' },
      { key: 'bathrooms', label: 'Bathrooms', iconName: 'home' },
      { key: 'fuel_type', label: 'Fuel Type', iconName: 'fuel' },
      { key: 'transmission', label: 'Transmission', iconName: 'car' },
    ];

    for (const fb of knownFallbacks) {
      if (processedKeys.has(fb.key)) continue;
      const val = formValues[fb.key];
      if (val !== undefined && val !== null && val !== '') {
        processedKeys.add(fb.key);
        const strVal = typeof val === 'boolean' ? (val ? 'Yes' : 'No') : String(val);
        attributes.push({ label: fb.label, value: strVal, iconName: fb.iconName || 'tag' });
        specs.push({ label: fb.label, value: strVal });
      }
    }

    return { attributes, specs };
  }

  static clearCache(id?: string) {
    if (id) {
      detailCache.delete(id);
    } else {
      detailCache.clear();
    }
  }
}
