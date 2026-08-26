export interface SavedRentalItem {
  id: string;
  title: string;
  category: string;
  categoryType: string;
  location: string;
  price: string;
  pricePeriod: string;
  imageUrl?: string;
  photoCount?: string;
  specs?: { label: string; icon: string }[];
  isSaved?: boolean;
}

export interface SavedJobItem {
  id: string;
  title: string;
  company: string;
  companyId?: string;
  logoUrl?: string;
  location: string;
  jobType: string;
  salary: string;
  salaryPeriod?: string;
  postedTime: string;
  isSaved?: boolean;
}

export interface SavedServiceItem {
  id: string;
  title: string;
  providerName: string;
  category: string;
  categoryTag?: string;
  location: string;
  price: string;
  priceUnit: string;
  imageUrl?: string;
  rating?: number;
  reviewsCount?: number;
  isSaved?: boolean;
}

export interface SavedUnavailableItem {
  id: string;
  listingId: string;
  savedAt?: string;
}
