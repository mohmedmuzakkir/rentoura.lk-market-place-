import { ModuleType } from '../data/categorySelectorData';

export interface LocationFilterData {
  provinceId?: string;
  provinceName?: string;
  districtId?: string;
  districtName?: string;
  cityId?: string;
  cityName?: string;
  areaId?: string;
  areaName?: string;
  isNearMe?: boolean;
}

export interface CategoryFilterData {
  mainCatId?: string;
  mainCatName?: string;
  subCatId?: string;
  subCatName?: string;
  thirdLevelId?: string;
  thirdLevelName?: string;
  fullPath?: string;
}

export interface PriceFilterData {
  min: number;
  max: number;
  period: 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  presetId?: 'under_25k' | '25k_50k' | '50k_100k' | '100k_plus' | 'custom';
}

export interface PropertyFilterData {
  propertyType?: string[]; // 'House', 'Apartment', 'Annex', 'Villa', 'Bungalow', 'Commercial', 'Land'
  bedrooms?: string; // 'Any', '1+', '2+', '3+', '4+', '5+'
  bathrooms?: string; // 'Any', '1+', '2+', '3+', '4+'
  furnishing?: 'Furnished' | 'Semi-Furnished' | 'Unfurnished' | 'Any';
  facilities?: string[]; // 'Parking', 'Air Conditioning', 'WiFi', 'Kitchen', 'Balcony', 'Garden', 'Pet Friendly', 'Bills Included', 'Hot Water'
  minFloorArea?: number;
  maxFloorArea?: number;
  availableFrom?: string;
  securityDeposit?: boolean;
  negotiable?: boolean;
}

export interface VehicleFilterData {
  vehicleType?: string[]; // 'Car', 'Van', 'SUV', 'Bike', 'Three Wheeler', 'Lorry'
  brand?: string[]; // 'Toyota', 'Honda', 'Nissan', 'Suzuki', 'Mitsubishi', etc.
  fuelType?: string[]; // 'Petrol', 'Diesel', 'Hybrid', 'Electric'
  transmission?: string[]; // 'Automatic', 'Manual'
  seats?: string; // 'Any', '2', '4-5', '7-8', '10+'
  driverMode?: 'Self Drive' | 'With Driver' | 'Both';
  airConditioned?: boolean;
  mileageLimit?: string;
}

export interface EquipmentFilterData {
  equipmentType?: string[];
  powerSource?: string[]; // 'Electric', 'Diesel/Petrol', 'Battery', 'Manual'
  operatorIncluded?: boolean;
  condition?: string[]; // 'New / Like New', 'Excellent', 'Good', 'Used'
  securityDeposit?: boolean;
}

export interface JobFilterData {
  employmentType?: string[]; // 'Full Time', 'Part Time', 'Contract', 'Temporary', 'Internship'
  workArrangement?: string[]; // 'On-site', 'Remote', 'Hybrid'
  salaryType?: 'Hourly' | 'Daily' | 'Monthly' | 'Yearly';
  minSalary?: number;
  maxSalary?: number;
  experienceLevel?: string; // 'No Experience', 'Entry Level', '1+ Year', '2+ Years', '3+ Years', '5+ Years', '10+ Years'
  educationLevel?: string; // 'No specific qualification', 'O/L', 'A/L', 'Diploma', 'Bachelor's Degree', 'Master's Degree'
  benefits?: string[]; // 'EPF / ETF', 'Accommodation', 'Meals', 'Transport', 'Medical / Insurance', 'Bonus'
  postedWithin?: 'Any' | '24h' | '3d' | '7d' | '14d';
}

export interface ServiceFilterData {
  pricingType?: string[]; // 'Per Hour', 'Per Day', 'Per Project', 'Fixed', 'Negotiable'
  providerType?: 'Individual' | 'Company' | 'Any';
  experience?: string; // 'Any', '1+ Years', '3+ Years', '5+ Years', '10+ Years'
  availability?: 'Any' | 'today' | 'this_week' | 'custom';
  emergencyService?: boolean; // 24/7 emergency
  advanceBooking?: boolean;
  remoteService?: boolean;
  onSiteService?: boolean;
  verifiedOnly?: boolean;
}

export interface AdvancedFilterState {
  module: ModuleType;
  keyword: string;
  location: LocationFilterData;
  category: CategoryFilterData;
  price: PriceFilterData;
  rentalPeriod: 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  
  // Category-specific filters
  property: PropertyFilterData;
  vehicle: VehicleFilterData;
  equipment: EquipmentFilterData;
  job: JobFilterData;
  service: ServiceFilterData;
  
  // Common flags
  verifiedOnly: boolean;
  featuredOnly: boolean;
  negotiableOnly: boolean;
  deliveryAvailable: boolean;
  sortBy: 'relevant' | 'newest' | 'price_asc' | 'price_desc' | 'deadline';
}

export interface FilterChipItem {
  id: string;
  label: string;
  icon: string;
  category: string;
  onRemove: () => void;
}

export const INITIAL_ADVANCED_FILTER_STATE: AdvancedFilterState = {
  module: 'rentals',
  keyword: '',
  location: {
    provinceName: 'Central Province',
    districtName: 'Kandy District',
    cityName: 'Kandy',
    areaName: 'All Areas'
  },
  category: {
    mainCatId: 'property-rentals',
    mainCatName: 'Property Rentals',
    subCatId: 'houses',
    subCatName: 'Houses'
  },
  price: {
    min: 0,
    max: 100000,
    period: 'Monthly',
    presetId: '50k_100k'
  },
  rentalPeriod: 'Monthly',
  property: {
    bedrooms: '2+',
    furnishing: 'Furnished',
    facilities: ['Parking', 'Air Conditioning']
  },
  vehicle: {},
  equipment: {},
  job: {
    employmentType: ['Full Time'],
    workArrangement: ['Hybrid'],
    experienceLevel: '2+ Years'
  },
  service: {
    pricingType: ['Fixed'],
    availability: 'today'
  },
  verifiedOnly: false,
  featuredOnly: false,
  negotiableOnly: false,
  deliveryAvailable: false,
  sortBy: 'relevant'
};
