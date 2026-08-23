export type ListingModule = 'rentals' | 'jobs' | 'services';

export type RentalPeriodUnit = 'Hour' | 'Day' | 'Week' | 'Month' | 'Year' | string;

export interface RentalRate {
  unit: RentalPeriodUnit;
  price: number;
  label: string;
}

export interface ListingPricing {
  activePeriod?: RentalPeriodUnit;
  isNegotiable?: boolean;
  rates: RentalRate[];
}

export interface ListingAttribute {
  label: string;
  value: string;
  iconName?: string;
}

export interface ListingLocation {
  province: string;
  district: string;
  city: string;
  area?: string;
  address?: string;
  lat?: number;
  lng?: number;
  mapImageUrl?: string;
}

export interface ListingOwner {
  id: string;
  name: string;
  photoUrl?: string;
  isVerified?: boolean;
  memberSince?: string;
  rating?: number;
  reviewsCount?: number;
  activeListingsCount?: number;
  responseRate?: string;
  responseSpeed?: string;
  totalRentalsCompleted?: number;
}

export interface ListingContact {
  phone?: string;
  whatsappNumber?: string;
  email?: string;
  allowInternalMessage?: boolean;
}

export interface RentalListingDetail {
  id: string;
  module: 'rentals';
  title: string;
  category: string;
  subcategory?: string;
  categoryPath?: string;
  categoryType?: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  status?: string;
  createdAt?: string;
  postedDateStr?: string;
  location: ListingLocation;
  images: string[];
  pricing: ListingPricing;
  attributes: ListingAttribute[];
  features?: string[];
  availability?: any;
  securityPolicies?: any;
  deliveryPickup?: any;
  description?: string;
  owner: ListingOwner;
  contact: ListingContact;
  depositRequired?: string;
  deliveryAvailable?: boolean;
  minRentalDuration?: string;
  insuranceIncluded?: boolean;
  specs?: Record<string, string | number | boolean>;
}

export interface JobCompany {
  id: string;
  name: string;
  logoUrl?: string;
  logoBg?: string;
  logoText?: string;
  isVerified?: boolean;
  about?: string;
  foundedYear?: string;
  employeeCount?: string;
  industry?: string;
  websiteUrl?: string;
  location?: string;
}

export interface JobSalary {
  type?: 'range' | 'fixed' | 'negotiable';
  min?: number;
  max?: number;
  amount?: number;
  period?: string;
  isNegotiable?: boolean;
}

export interface JobListingDetail {
  id: string;
  module: 'jobs';
  title: string;
  category: string;
  subcategory?: string;
  categoryPath?: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  status?: string;
  createdAt?: string;
  postedDateStr?: string;
  location: ListingLocation;
  jobHeroImage?: string;
  company: JobCompany;
  employmentType?: string;
  workArrangement?: string;
  vacancies?: string;
  experienceLevel?: string;
  educationLevel?: string;
  skills?: string[];
  salary: JobSalary;
  applicationDeadline?: string;
  workingHours?: string;
  workingDays?: string;
  jobIdNumber?: string;
  highlights?: string[];
  requirementsList?: string[];
  responsibilitiesList?: string[];
  benefitsList?: string[];
  applyMethods?: {
    internalApply?: boolean;
    whatsapp?: boolean;
    phone?: boolean;
    email?: string;
  };
  companyReviews?: {
    rating: number;
    count: number;
    featuredReview?: {
      author: string;
      role: string;
      comment: string;
      avatarUrl: string;
    };
  };
  description?: string;
  ownerId?: string;
  contact?: ListingContact;
}

export interface ServicePackage {
  title: string;
  price: string;
  unit: string;
  description?: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  type?: string;
  photoUrl?: string;
  isVerified?: boolean;
  isBusinessRegistered?: boolean;
  isBackgroundChecked?: boolean;
  isIdVerified?: boolean;
  isInsuranceCovered?: boolean;
  completedJobsCount?: number;
  positiveReviewsPercentage?: string;
  experience?: string;
}

export interface ServiceListingDetail {
  id: string;
  module: 'services';
  title: string;
  category: string;
  subcategory?: string;
  categoryPath?: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  status?: string;
  createdAt?: string;
  postedDateStr?: string;
  location: ListingLocation;
  images: string[];
  portfolioImages?: string[];
  rating?: number;
  reviewsCount?: number;
  startingPrice?: {
    amount: number;
    unit: string;
  };
  packages?: ServicePackage[];
  serviceType?: string;
  experienceYears?: string;
  serviceMode?: string;
  availabilityDays?: string;
  availabilityHours?: string;
  sameDayBooking?: boolean;
  emergencyService?: boolean;
  responseTime?: string;
  teamSize?: string;
  equipmentProvided?: boolean;
  provider?: ServiceProvider;
  customerReviews?: {
    rating: number;
    count: number;
    featuredReview?: {
      author: string;
      rating: number;
      timeAgo: string;
      comment: string;
      avatarUrl: string;
    };
  };
  description?: string;
  ownerId?: string;
  contact?: ListingContact;
}

export type AnyListingDetail = RentalListingDetail | JobListingDetail | ServiceListingDetail;
