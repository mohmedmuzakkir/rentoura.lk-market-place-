import { AdvancedFilterState, FilterChipItem } from '../types/filterTypes';
import { SearchResultItem } from './searchResultsData';

export interface FilterSectionNav {
  id: string;
  label: string;
  icon: string;
  badgeCount?: number;
  isAvailable?: boolean;
}

export const RENTAL_PERIOD_OPTIONS = [
  { id: 'Hourly', label: 'Hourly', icon: '🕒' },
  { id: 'Daily', label: 'Daily', icon: '☀️' },
  { id: 'Weekly', label: 'Weekly', icon: '📅' },
  { id: 'Monthly', label: 'Monthly', icon: '🗓️' },
  { id: 'Yearly', label: 'Yearly', icon: '📆' }
] as const;

export const PRICE_PRESETS: Record<string, { label: string; min: number; max: number }> = {
  under_25k: { label: 'Under 25K', min: 0, max: 25000 },
  '25k_50k': { label: '25K - 50K', min: 25000, max: 50000 },
  '50k_100k': { label: '50K - 100K', min: 50000, max: 100000 },
  '100k_plus': { label: '100K+', min: 100000, max: 1000000 },
  custom: { label: 'Custom', min: 0, max: 500000 }
};

export const PROPERTY_TYPES = [
  'House', 'Apartment', 'Annex', 'Villa', 'Bungalow', 'Commercial', 'Land', 'Room'
];

export const BEDROOM_OPTIONS = ['Any', '1+', '2+', '3+', '4+', '5+'];
export const BATHROOM_OPTIONS = ['Any', '1+', '2+', '3+', '4+'];

export const FURNISHING_OPTIONS = [
  { id: 'Furnished', label: 'Furnished' },
  { id: 'Semi-Furnished', label: 'Semi-Furnished' },
  { id: 'Unfurnished', label: 'Unfurnished' }
];

export const PROPERTY_FACILITIES = [
  { id: 'Parking', label: 'Parking', icon: '🚗' },
  { id: 'Air Conditioning', label: 'Air Conditioning', icon: '❄️' },
  { id: 'WiFi', label: 'WiFi', icon: '📶' },
  { id: 'Kitchen', label: 'Kitchen', icon: '🍳' },
  { id: 'Balcony', label: 'Balcony', icon: '🌅' },
  { id: 'Garden', label: 'Garden', icon: '🌱' },
  { id: 'Pet Friendly', label: 'Pet Friendly', icon: '🐾' },
  { id: 'Bills Included', label: 'Bills Included', icon: '💡' },
  { id: 'Hot Water', label: 'Hot Water', icon: '🚿' }
];

export const VEHICLE_TYPES = ['Car', 'Van', 'SUV / Jeep', 'Motorbike / Scooter', 'Three Wheeler', 'Bus / Coach', 'Lorry / Truck'];
export const VEHICLE_BRANDS = ['Toyota', 'Honda', 'Nissan', 'Suzuki', 'Mitsubishi', 'Hyundai', 'Kia', 'Bajaj', 'Yamaha', 'Other'];
export const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
export const TRANSMISSION_TYPES = ['Automatic', 'Manual'];

export const JOB_EMPLOYMENT_TYPES = ['Full Time', 'Part Time', 'Contract', 'Temporary', 'Internship'];
export const JOB_WORK_ARRANGEMENTS = ['On-site', 'Remote', 'Hybrid'];
export const JOB_EXPERIENCE_LEVELS = ['No Experience', 'Entry Level', '1+ Year', '2+ Years', '3+ Years', '5+ Years', '10+ Years'];
export const JOB_EDUCATION_LEVELS = ['No specific qualification', 'O/L', 'A/L', 'Certificate', 'Diploma', "Bachelor's Degree", "Master's Degree"];
export const JOB_BENEFITS = ['EPF / ETF', 'Accommodation', 'Meals', 'Transport', 'Medical / Insurance', 'Bonus'];

export const SERVICE_PRICING_TYPES = ['Per Hour', 'Per Day', 'Per Project', 'Fixed', 'Negotiable'];
export const SERVICE_AVAILABILITY = [
  { id: 'today', label: 'Available Today' },
  { id: 'this_week', label: 'Available This Week' },
  { id: 'custom', label: 'Custom Date' }
];

/**
 * Computes active filter chips dynamically with proper callbacks to remove individual filters
 */
export function getActiveFilterChips(
  state: AdvancedFilterState,
  onChange: (updater: (prev: AdvancedFilterState) => AdvancedFilterState) => void
): FilterChipItem[] {
  const chips: FilterChipItem[] = [];

  // 1. Location
  if (state.location.cityName && state.location.cityName !== 'All Sri Lanka') {
    chips.push({
      id: 'loc-city',
      label: state.location.cityName,
      icon: '📍',
      category: 'location',
      onRemove: () => {
        onChange(prev => ({
          ...prev,
          location: { ...prev.location, cityName: undefined, cityId: undefined, areaName: undefined, areaId: undefined }
        }));
      }
    });
  } else if (state.location.districtName) {
    chips.push({
      id: 'loc-dist',
      label: state.location.districtName,
      icon: '📍',
      category: 'location',
      onRemove: () => {
        onChange(prev => ({
          ...prev,
          location: { ...prev.location, districtName: undefined, districtId: undefined, cityName: undefined, cityId: undefined }
        }));
      }
    });
  }

  // 2. Category
  if (state.category.subCatName) {
    chips.push({
      id: 'cat-sub',
      label: state.category.subCatName,
      icon: state.module === 'jobs' ? '💼' : state.module === 'services' ? '🔧' : '🏠',
      category: 'category',
      onRemove: () => {
        onChange(prev => ({
          ...prev,
          category: { ...prev.category, subCatName: undefined, subCatId: undefined, thirdLevelName: undefined, thirdLevelId: undefined }
        }));
      }
    });
  } else if (state.category.mainCatName) {
    chips.push({
      id: 'cat-main',
      label: state.category.mainCatName,
      icon: state.module === 'jobs' ? '💼' : state.module === 'services' ? '🔧' : '🏠',
      category: 'category',
      onRemove: () => {
        onChange(prev => ({
          ...prev,
          category: {}
        }));
      }
    });
  }

  // 3. Price
  if (state.price.max > 0 && (state.price.min > 0 || state.price.max < 1000000)) {
    const minK = state.price.min === 0 ? '0' : `${Math.round(state.price.min / 1000)}K`;
    const maxK = state.price.max >= 1000000 ? '1M+' : `${Math.round(state.price.max / 1000)}K`;
    chips.push({
      id: 'price-range',
      label: `Rs. ${minK} - ${maxK}`,
      icon: '🏷️',
      category: 'price',
      onRemove: () => {
        onChange(prev => ({
          ...prev,
          price: { ...prev.price, min: 0, max: 1000000, presetId: undefined }
        }));
      }
    });
  }

  // 4. Rental Period (Rentals only)
  if (state.module === 'rentals' && state.rentalPeriod) {
    chips.push({
      id: 'period',
      label: state.rentalPeriod,
      icon: '📅',
      category: 'period',
      onRemove: () => {
        onChange(prev => ({
          ...prev,
          rentalPeriod: 'Monthly'
        }));
      }
    });
  }

  // 5. Property specific
  if (state.module === 'rentals' && isPropertyCategory(state.category.mainCatName || '')) {
    if (state.property.bedrooms && state.property.bedrooms !== 'Any') {
      chips.push({
        id: 'prop-beds',
        label: `${state.property.bedrooms} Bedrooms`,
        icon: '🛏️',
        category: 'property',
        onRemove: () => {
          onChange(prev => ({
            ...prev,
            property: { ...prev.property, bedrooms: 'Any' }
          }));
        }
      });
    }
    if (state.property.furnishing && state.property.furnishing !== 'Any') {
      chips.push({
        id: 'prop-furnish',
        label: state.property.furnishing,
        icon: '🛋️',
        category: 'property',
        onRemove: () => {
          onChange(prev => ({
            ...prev,
            property: { ...prev.property, furnishing: 'Any' }
          }));
        }
      });
    }
    if (state.property.facilities && state.property.facilities.length > 0) {
      state.property.facilities.forEach(fac => {
        chips.push({
          id: `prop-fac-${fac}`,
          label: fac,
          icon: '✨',
          category: 'property',
          onRemove: () => {
            onChange(prev => ({
              ...prev,
              property: {
                ...prev.property,
                facilities: prev.property.facilities?.filter(f => f !== fac)
              }
            }));
          }
        });
      });
    }
  }

  // 6. Vehicle specific
  if (state.module === 'rentals' && isVehicleCategory(state.category.mainCatName || '')) {
    if (state.vehicle.fuelType && state.vehicle.fuelType.length > 0) {
      state.vehicle.fuelType.forEach(fuel => {
        chips.push({
          id: `veh-fuel-${fuel}`,
          label: fuel,
          icon: '⛽',
          category: 'vehicle',
          onRemove: () => {
            onChange(prev => ({
              ...prev,
              vehicle: { ...prev.vehicle, fuelType: prev.vehicle.fuelType?.filter(f => f !== fuel) }
            }));
          }
        });
      });
    }
    if (state.vehicle.transmission && state.vehicle.transmission.length > 0) {
      state.vehicle.transmission.forEach(trans => {
        chips.push({
          id: `veh-trans-${trans}`,
          label: trans,
          icon: '⚙️',
          category: 'vehicle',
          onRemove: () => {
            onChange(prev => ({
              ...prev,
              vehicle: { ...prev.vehicle, transmission: prev.vehicle.transmission?.filter(t => t !== trans) }
            }));
          }
        });
      });
    }
  }

  // 7. Job specific
  if (state.module === 'jobs') {
    if (state.job.employmentType && state.job.employmentType.length > 0) {
      state.job.employmentType.forEach(type => {
        chips.push({
          id: `job-emp-${type}`,
          label: type,
          icon: '💼',
          category: 'job',
          onRemove: () => {
            onChange(prev => ({
              ...prev,
              job: { ...prev.job, employmentType: prev.job.employmentType?.filter(t => t !== type) }
            }));
          }
        });
      });
    }
    if (state.job.workArrangement && state.job.workArrangement.length > 0) {
      state.job.workArrangement.forEach(arr => {
        chips.push({
          id: `job-arr-${arr}`,
          label: arr,
          icon: '🏢',
          category: 'job',
          onRemove: () => {
            onChange(prev => ({
              ...prev,
              job: { ...prev.job, workArrangement: prev.job.workArrangement?.filter(a => a !== arr) }
            }));
          }
        });
      });
    }
    if (state.job.experienceLevel && state.job.experienceLevel !== 'No Experience') {
      chips.push({
        id: 'job-exp',
        label: state.job.experienceLevel,
        icon: '⏳',
        category: 'job',
        onRemove: () => {
          onChange(prev => ({
            ...prev,
            job: { ...prev.job, experienceLevel: undefined }
          }));
        }
      });
    }
  }

  // 8. Service specific
  if (state.module === 'services') {
    if (state.service.pricingType && state.service.pricingType.length > 0) {
      state.service.pricingType.forEach(pt => {
        chips.push({
          id: `serv-price-${pt}`,
          label: pt,
          icon: '💵',
          category: 'service',
          onRemove: () => {
            onChange(prev => ({
              ...prev,
              service: { ...prev.service, pricingType: prev.service.pricingType?.filter(p => p !== pt) }
            }));
          }
        });
      });
    }
    if (state.service.availability && state.service.availability !== 'Any') {
      chips.push({
        id: 'serv-avail',
        label: state.service.availability === 'today' ? 'Available Today' : state.service.availability === 'this_week' ? 'This Week' : 'Custom Date',
        icon: '📅',
        category: 'service',
        onRemove: () => {
          onChange(prev => ({
            ...prev,
            service: { ...prev.service, availability: 'Any' }
          }));
        }
      });
    }
    if (state.service.emergencyService) {
      chips.push({
        id: 'serv-emerg',
        label: '24/7 Emergency',
        icon: '🚨',
        category: 'service',
        onRemove: () => {
          onChange(prev => ({
            ...prev,
            service: { ...prev.service, emergencyService: false }
          }));
        }
      });
    }
  }

  return chips;
}

export function isPropertyCategory(catName: string): boolean {
  if (!catName) return true; // Default for rentals
  const normalized = catName.toLowerCase();
  return (
    normalized.includes('property') ||
    normalized.includes('house') ||
    normalized.includes('apartment') ||
    normalized.includes('room') ||
    normalized.includes('villa') ||
    normalized.includes('commercial') ||
    normalized.includes('land')
  );
}

export function isVehicleCategory(catName: string): boolean {
  if (!catName) return false;
  const normalized = catName.toLowerCase();
  return (
    normalized.includes('vehicle') ||
    normalized.includes('car') ||
    normalized.includes('van') ||
    normalized.includes('bike') ||
    normalized.includes('motor') ||
    normalized.includes('lorry')
  );
}

export function isEquipmentCategory(catName: string): boolean {
  if (!catName) return false;
  const normalized = catName.toLowerCase();
  return (
    normalized.includes('equipment') ||
    normalized.includes('tool') ||
    normalized.includes('machinery') ||
    normalized.includes('construction')
  );
}

/**
 * Calculates the exact matching items from the dataset
 */
export function calculateMatchingListings(
  state: AdvancedFilterState,
  listings: SearchResultItem[]
): SearchResultItem[] {
  return listings.filter(item => {
    // 1. Module check
    if (state.module === 'rentals' && item.type !== 'rental') return false;
    if (state.module === 'jobs' && item.type !== 'job') return false;
    if (state.module === 'services' && item.type !== 'service') return false;

    // 2. Location matching
    if (state.location.districtName && item.district) {
      const matchDist = item.district.toLowerCase().includes(state.location.districtName.toLowerCase());
      if (!matchDist) return false;
    }
    if (state.location.cityName && state.location.cityName !== 'All Sri Lanka' && item.city) {
      const matchCity = item.city.toLowerCase().includes(state.location.cityName.toLowerCase());
      if (!matchCity) return false;
    }

    // 3. Price range matching
    if (state.price.max > 0) {
      if (item.rawPrice > state.price.max) return false;
      if (item.rawPrice < state.price.min) return false;
    }

    // 4. Property Bedrooms matching (if specified)
    if (state.module === 'rentals' && state.property.bedrooms && state.property.bedrooms !== 'Any') {
      const minBeds = parseInt(state.property.bedrooms, 10);
      if (!isNaN(minBeds) && item.beds !== undefined && item.beds < minBeds) {
        return false;
      }
    }

    // 5. Job Employment Type matching
    if (state.module === 'jobs' && state.job.employmentType && state.job.employmentType.length > 0) {
      if (item.jobType && !state.job.employmentType.includes(item.jobType)) {
        return false;
      }
    }

    // 6. Job Work Arrangement matching
    if (state.module === 'jobs' && state.job.workArrangement && state.job.workArrangement.length > 0) {
      if (item.jobMode && !state.job.workArrangement.includes(item.jobMode)) {
        return false;
      }
    }

    return true;
  });
}
