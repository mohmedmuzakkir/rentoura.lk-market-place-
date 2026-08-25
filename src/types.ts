export type AppRoute = 
  | '/'
  | '/rentals'
  | `/rentals/${string}`
  | '/jobs'
  | `/jobs/${string}`
  | '/services'
  | `/services/${string}`
  | '/saved'
  | '/post'
  | '/post/rental'
  | '/post/job'
  | '/post/service'
  | '/messages'
  | '/chat'
  | '/profile'
  | '/profile/edit'
  | '/my-listings'
  | '/search'
  | '/select-location'
  | '/select-category'
  | '/filters'
  | '/rental-detail'
  | '/job-detail'
  | '/service-detail'
  | '/notifications'
  | '/login'
  | '/register'
  | '/forgot-password'
  | '/reset-password'
  | '/user-agreement'
  | '/privacy-policy'
  | '/safety'
  | '/help'
  | '/report-listing'
  | '/reviews'
  | '/admin'
  | '/admin/dashboard'
  | '/moderator'
  | '/super-admin';

export interface SelectedLocationState {
  province?: { id: string; name: string } | null;
  district?: { id: string; name: string } | null;
  city?: { id: string; name: string } | null;
  area?: { id: string; name: string } | null;
}

export interface CategoryItem {
  id: string;
  name: string;
  iconName: string;
  color: string;
  bgColor: string;
  count?: string;
  targetModule?: 'rentals' | 'jobs' | 'services';
}

export interface LocationItem {
  id: string;
  name: string;
  province?: string;
  listingsCount?: string;
  imageUrl: string;
}

export interface FeaturedListingItem {
  id: string;
  title: string;
  category: string;
  categoryType: 'HOUSE' | 'VEHICLE' | 'EVENT HALL' | 'EQUIPMENT' | 'VILLA' | 'BIKE' | 'CAMERA' | 'APARTMENT';
  badgeType?: 'FEATURED' | 'VERIFIED' | 'POPULAR' | 'NEW';
  badgeColor: string;
  location: string;
  price: string;
  pricePeriod: string;
  imageUrl: string;
  tags?: string[];
  specs?: { label: string; icon: string }[];
  isSaved?: boolean;
  rating?: number;
  reviewsCount?: number;
}

export interface JobItem {
  id: string;
  title: string;
  company: string;
  companyId: string;
  logoBg?: string;
  logoText?: string;
  logoColor?: string;
  logoType?: 'virtusa' | 'ndb' | 'wso2' | 'upwork' | 'ttec' | 'gitlab' | 'dialog' | 'mas' | 'daraz' | 'hnb' | 'softlogic' | 'lolc' | '99x' | 'custom';
  location: string;
  jobType: string;
  salary: string;
  salaryPeriod?: string;
  tags: string[];
  isFeatured?: boolean;
  postedTime: string;
  isRemote?: boolean;
  category: string;
  description?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  providerName: string;
  isVerified: boolean;
  category: string;
  categoryTag: string;
  location: string;
  rating: number;
  reviewsCount: number;
  price: string;
  priceUnit: string;
  imageUrl: string;
  isFeatured?: boolean;
  whatsappNumber?: string;
  phone?: string;
  description?: string;
}

export interface ServiceNearYouItem {
  id: string;
  name: string;
  category: string;
  iconName: string;
  color: string;
  bgColor: string;
  distance: string;
  rating: number;
}

export interface CompanyPartner {
  id: string;
  name: string;
  brandKey: 'dialog' | 'mas' | 'daraz' | 'hnb' | 'softlogic' | 'lolc' | '99x';
  subtitle?: string;
}

export interface FilterState {
  searchQuery: string;
  selectedLocation: string;
  selectedLocationModel?: any;
  selectedCategory: string;
  selectedFilter: string;
  priceRange: [number, number];
  sortBy: 'featured' | 'newest' | 'price_low' | 'price_high';
}

