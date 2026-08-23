export type SearchResultType = 'rental' | 'job' | 'service';

export interface SearchResultItem {
  id: string;
  type: SearchResultType;
  title: string;
  category: string;
  location: string;
  district?: string;
  province?: string;
  city?: string;
  area?: string;
  price: string;
  pricePeriod?: string;
  rawPrice: number; // for numeric sorting
  imageUrl: string;
  isSaved?: boolean;
  
  // Rental specific
  beds?: number;
  baths?: number;
  parking?: boolean;
  sqft?: string;
  rentalFeatures?: string[];
  owner?: {
    name: string;
    avatarUrl: string;
    verified: boolean;
    memberSince: string;
    listingsCount: number;
    phone: string;
  };

  // Job specific
  company?: string;
  companyLogoUrl?: string;
  jobType?: 'Full Time' | 'Part Time' | 'Contract' | 'Internship' | 'Remote';
  jobMode?: 'On-site' | 'Remote' | 'Hybrid';
  experience?: string;
  education?: string;
  postedTime?: string;
  applicantsCount?: number;

  // Service specific
  providerName?: string;
  providerVerified?: boolean;
  rating?: number;
  reviewsCount?: number;
  serviceFeatures?: string[];
  whatsappNumber?: string;
  phone?: string;
}

export const SEARCH_RESULTS_DEMO: SearchResultItem[] = [
  {
    id: 'res-rent-1',
    type: 'rental',
    title: 'Luxury House for Rent in Kandy',
    category: 'Property',
    location: 'Kandy, Central Province',
    district: 'Kandy District',
    province: 'Central Province',
    city: 'Kandy',
    area: 'Ampitiya',
    price: 'Rs. 85,000',
    pricePeriod: '/ Month',
    rawPrice: 85000,
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    beds: 4,
    baths: 3,
    parking: true,
    sqft: '2000 sqft',
    rentalFeatures: ['Furnished', 'AC', 'WiFi', 'Hot Water'],
    owner: {
      name: 'Nimal Perera',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      verified: true,
      memberSince: '2022',
      listingsCount: 24,
      phone: '+94 77 123 4567'
    }
  },
  {
    id: 'res-job-1',
    type: 'job',
    title: 'Software Engineer',
    category: 'IT & Technology',
    company: 'WSO2 Lanka (Pvt) Ltd',
    location: 'Kandy, Central Province',
    district: 'Kandy District',
    province: 'Central Province',
    city: 'Kandy',
    jobType: 'Full Time',
    jobMode: 'On-site',
    experience: '2+ Yrs Exp',
    education: "Bachelor's Degree",
    price: 'Rs. 80,000 - 120,000',
    pricePeriod: '/ Month',
    rawPrice: 100000,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    postedTime: '2h ago',
    applicantsCount: 45
  },
  {
    id: 'res-srv-1',
    type: 'service',
    title: 'Professional Plumbing Services',
    category: 'Home Services',
    providerName: 'Mr. Plumbing',
    providerVerified: true,
    location: 'Kandy, Central Province',
    district: 'Kandy District',
    province: 'Central Province',
    city: 'Kandy',
    rating: 4.9,
    reviewsCount: 128,
    price: 'Rs. 1,500',
    pricePeriod: '/ Visit',
    rawPrice: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80',
    serviceFeatures: ['24/7 Service', 'Quick Response', 'Experienced'],
    whatsappNumber: '94771234567',
    phone: '+94 77 123 4567'
  },
  {
    id: 'res-rent-2',
    type: 'rental',
    title: 'Room for Rent – Peradeniya Road',
    category: 'Property',
    location: 'Kandy, Central Province',
    district: 'Kandy District',
    province: 'Central Province',
    city: 'Peradeniya',
    price: 'Rs. 25,000',
    pricePeriod: '/ Month',
    rawPrice: 25000,
    imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    beds: 1,
    baths: 1,
    sqft: '150 sqft',
    rentalFeatures: ['Furnished', 'WiFi', 'Study Table'],
    owner: {
      name: 'Sachini Fernando',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      verified: true,
      memberSince: '2023',
      listingsCount: 8,
      phone: '+94 71 987 6543'
    }
  },
  {
    id: 'res-rent-3',
    type: 'rental',
    title: 'Toyota Premio 2019 - Auto Rental',
    category: 'Vehicles',
    location: 'Colombo, Western Province',
    district: 'Colombo District',
    province: 'Western Province',
    city: 'Colombo',
    price: 'Rs. 6,500',
    pricePeriod: '/ Day',
    rawPrice: 6500,
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    parking: true,
    rentalFeatures: ['Auto Transmission', '5 Seats', 'AC', 'Petrol'],
    owner: {
      name: 'Lanka Auto Rentals',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      verified: true,
      memberSince: '2021',
      listingsCount: 15,
      phone: '+94 77 555 4321'
    }
  },
  {
    id: 'res-job-2',
    type: 'job',
    title: 'UI/UX Product Designer',
    category: 'IT & Technology',
    company: 'Virtusa Lanka',
    location: 'Colombo, Western Province',
    district: 'Colombo District',
    province: 'Western Province',
    city: 'Colombo',
    jobType: 'Full Time',
    jobMode: 'Remote',
    experience: '3+ Yrs Exp',
    education: 'Bachelor or Equivalent',
    price: 'Rs. 150,000 - 220,000',
    pricePeriod: '/ Month',
    rawPrice: 180000,
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    postedTime: '4h ago',
    applicantsCount: 32
  },
  {
    id: 'res-srv-2',
    type: 'service',
    title: 'Car General Service & Diagnostic Scan',
    category: 'Vehicle Services',
    providerName: 'AutoCare Lanka',
    providerVerified: true,
    location: 'Colombo, Western Province',
    district: 'Colombo District',
    province: 'Western Province',
    city: 'Colombo',
    rating: 4.8,
    reviewsCount: 96,
    price: 'Rs. 5,000',
    pricePeriod: '/ Service',
    rawPrice: 5000,
    imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    serviceFeatures: ['Computerized Scan', 'Engine Tune-up', 'Brake Check'],
    whatsappNumber: '94772345678',
    phone: '+94 77 234 5678'
  },
  {
    id: 'res-rent-4',
    type: 'rental',
    title: 'Beachside Holiday Villa',
    category: 'Property',
    location: 'Galle, Southern Province',
    district: 'Galle District',
    province: 'Southern Province',
    city: 'Galle',
    price: 'Rs. 120,000',
    pricePeriod: '/ Month',
    rawPrice: 120000,
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    beds: 3,
    baths: 2,
    parking: true,
    sqft: '1800 sqft',
    rentalFeatures: ['Sea View', 'Private Pool', 'AC', 'Kitchen'],
    owner: {
      name: 'Dinesh Wickramasinghe',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      verified: true,
      memberSince: '2020',
      listingsCount: 12,
      phone: '+94 77 888 9999'
    }
  },
  {
    id: 'res-srv-3',
    type: 'service',
    title: 'AC Repair & Air Conditioner Maintenance',
    category: 'Home Services',
    providerName: 'CoolTech Lanka',
    providerVerified: true,
    location: 'Kandy, Central Province',
    district: 'Kandy District',
    province: 'Central Province',
    city: 'Kandy',
    rating: 4.9,
    reviewsCount: 42,
    price: 'Rs. 2,500',
    pricePeriod: '/ Unit',
    rawPrice: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    serviceFeatures: ['AC Repair', 'Gas Refill', 'Leak Fixing', 'Installation'],
    whatsappNumber: '94773456789',
    phone: '+94 77 345 6789'
  }
];
