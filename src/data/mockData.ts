import { 
  CategoryItem, 
  LocationItem, 
  FeaturedListingItem, 
  JobItem, 
  ServiceItem, 
  ServiceNearYouItem, 
  CompanyPartner 
} from '../types';

export const CATEGORIES_DATA: CategoryItem[] = [
  {
    id: 'property',
    name: 'Property',
    iconName: 'Home',
    color: '#1464F4',
    bgColor: '#EBF2FE',
    count: '3,450+',
    targetModule: 'rentals'
  },
  {
    id: 'rooms',
    name: 'Rooms',
    iconName: 'BedDouble',
    color: '#0EA5E9',
    bgColor: '#E0F2FE',
    count: '1,890+',
    targetModule: 'rentals'
  },
  {
    id: 'vehicles',
    name: 'Vehicles',
    iconName: 'Car',
    color: '#08A34F',
    bgColor: '#EAF8F0',
    count: '2,180+',
    targetModule: 'rentals'
  },
  {
    id: 'events',
    name: 'Event Rentals',
    iconName: 'Tent',
    color: '#A855F7',
    bgColor: '#F3E8FF',
    count: '890+',
    targetModule: 'rentals'
  },
  {
    id: 'equipment',
    name: 'Equipment',
    iconName: 'Drill',
    color: '#EAB308',
    bgColor: '#FEF9C3',
    count: '1,420+',
    targetModule: 'rentals'
  },
  {
    id: 'electronics',
    name: 'Electronics',
    iconName: 'Briefcase',
    color: '#334155',
    bgColor: '#F1F5F9',
    count: '760+',
    targetModule: 'rentals'
  },
  {
    id: 'furniture',
    name: 'Furniture',
    iconName: 'Armchair',
    color: '#06B6D4',
    bgColor: '#CFFAFE',
    count: '640+',
    targetModule: 'rentals'
  },
  {
    id: 'more',
    name: 'More',
    iconName: 'LayoutGrid',
    color: '#64748B',
    bgColor: '#F8FAFC',
    count: '500+',
    targetModule: 'rentals'
  }
];

export const POPULAR_LOCATIONS: (LocationItem & { searchCount?: number })[] = [
  {
    id: 'colombo',
    name: 'Colombo',
    province: 'Western Province',
    searchCount: 14200,
    imageUrl: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'kandy',
    name: 'Kandy',
    province: 'Central Province',
    searchCount: 9800,
    imageUrl: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'galle',
    name: 'Galle',
    province: 'Southern Province',
    searchCount: 6500,
    imageUrl: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'jaffna',
    name: 'Jaffna',
    province: 'Northern Province',
    searchCount: 4200,
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'negombo',
    name: 'Negombo',
    province: 'Western Province',
    searchCount: 3800,
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  }
];

// Featured Rentals matching Image 2
export const FEATURED_RENTALS: FeaturedListingItem[] = [
  {
    id: 'rent-1',
    title: 'Luxury House in Kandy',
    category: 'Property',
    categoryType: 'HOUSE',
    badgeType: 'FEATURED',
    badgeColor: '#1464F4',
    location: 'Kandy, Central Province',
    price: 'Rs. 85,000',
    pricePeriod: '/ Month',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    tags: ['4 Beds', '3 Baths', 'Parking'],
    specs: [
      { label: '4 Beds', icon: 'Bed' },
      { label: '3 Baths', icon: 'Bath' },
      { label: 'Parking', icon: 'Car' }
    ],
    isSaved: false
  },
  {
    id: 'rent-2',
    title: 'Toyota Premio 2019',
    category: 'Vehicles',
    categoryType: 'VEHICLE',
    badgeType: 'FEATURED',
    badgeColor: '#1464F4',
    location: 'Colombo',
    price: 'Rs. 6,500',
    pricePeriod: '/ Day',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    tags: ['Auto', '5 Seats', 'AC'],
    specs: [
      { label: 'Auto', icon: 'Cpu' },
      { label: '5 Seats', icon: 'Users' },
      { label: 'AC', icon: 'Snowflake' }
    ],
    isSaved: false
  },
  {
    id: 'rent-3',
    title: 'Wedding Hall (150 Pax)',
    category: 'Event Hall',
    categoryType: 'EVENT HALL',
    badgeType: 'FEATURED',
    badgeColor: '#1464F4',
    location: 'Negombo',
    price: 'Rs. 45,000',
    pricePeriod: '/ Event',
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
    tags: ['150 Pax', 'Parking', 'AC'],
    specs: [
      { label: '150 Pax', icon: 'Users' },
      { label: 'Parking', icon: 'Car' },
      { label: 'AC', icon: 'Snowflake' }
    ],
    isSaved: false
  }
];

export const NEAR_YOU_RENTALS: FeaturedListingItem[] = [
  {
    id: 'near-1',
    title: 'Beach Side Villa',
    category: 'Property',
    categoryType: 'VILLA',
    badgeType: 'VERIFIED',
    badgeColor: '#1464F4',
    location: 'Galle',
    price: 'Rs. 120,000',
    pricePeriod: '/ Month',
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
    isSaved: false
  },
  {
    id: 'near-2',
    title: 'Yamaha FZ-S',
    category: 'Vehicles',
    categoryType: 'BIKE',
    badgeType: 'POPULAR',
    badgeColor: '#08A34F',
    location: 'Kandy',
    price: 'Rs. 2,000',
    pricePeriod: '/ Day',
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    isSaved: false
  },
  {
    id: 'near-3',
    title: 'Generator 5KVA',
    category: 'Equipment',
    categoryType: 'EQUIPMENT',
    badgeType: 'FEATURED',
    badgeColor: '#1464F4',
    location: 'Colombo',
    price: 'Rs. 2,200',
    pricePeriod: '/ Day',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    isSaved: false
  },
  {
    id: 'near-4',
    title: 'Canon EOS 200D',
    category: 'Electronics',
    categoryType: 'CAMERA',
    badgeType: 'VERIFIED',
    badgeColor: '#1464F4',
    location: 'Colombo',
    price: 'Rs. 1,500',
    pricePeriod: '/ Day',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
    isSaved: false
  },
  {
    id: 'near-5',
    title: 'Apartment in Havelock',
    category: 'Property',
    categoryType: 'APARTMENT',
    badgeType: 'POPULAR',
    badgeColor: '#1464F4',
    location: 'Colombo 05',
    price: 'Rs. 35,000',
    pricePeriod: '/ Week',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    isSaved: false
  }
];

export const FEATURED_LISTINGS = [...FEATURED_RENTALS, ...NEAR_YOU_RENTALS];

// JOBS MODULE DATA (matching Image 3)
export const JOB_CATEGORIES: CategoryItem[] = [
  {
    id: 'it',
    name: 'IT & Technology',
    iconName: 'Code',
    color: '#08A34F',
    bgColor: '#EAF8F0'
  },
  {
    id: 'sales',
    name: 'Sales & Marketing',
    iconName: 'TrendingUp',
    color: '#FF650A',
    bgColor: '#FEF0E9'
  },
  {
    id: 'accounting',
    name: 'Accounting & Finance',
    iconName: 'Calculator',
    color: '#08A34F',
    bgColor: '#EAF8F0'
  },
  {
    id: 'hospitality',
    name: 'Hospitality & Tourism',
    iconName: 'BellRing',
    color: '#8B5CF6',
    bgColor: '#F3E8FF'
  },
  {
    id: 'construction',
    name: 'Construction',
    iconName: 'HardHat',
    color: '#EAB308',
    bgColor: '#FEF9C3'
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    iconName: 'HeartHandshake',
    color: '#0284C7',
    bgColor: '#E0F2FE'
  },
  {
    id: 'education',
    name: 'Education',
    iconName: 'GraduationCap',
    color: '#DC2626',
    bgColor: '#FEE2E2'
  },
  {
    id: 'more-jobs',
    name: 'More',
    iconName: 'LayoutGrid',
    color: '#64748B',
    bgColor: '#F1F5F9'
  }
];

export const FEATURED_JOBS: JobItem[] = [
  {
    id: 'job-1',
    title: 'Software Engineer',
    company: 'Virtusa (Pvt) Ltd',
    companyId: 'virtusa',
    logoType: 'virtusa',
    location: 'Colombo',
    jobType: 'Full Time',
    salary: 'Rs. 120,000 – 180,000',
    salaryPeriod: '/ Month',
    tags: ['2+ Yrs Exp', 'React', 'Node.js'],
    isFeatured: true,
    postedTime: '2h ago',
    category: 'IT & Technology',
    description: 'We are looking for an experienced Software Engineer skilled in React, Node.js, and Cloud architectures to join our Colombo engineering hub.'
  },
  {
    id: 'job-2',
    title: 'Relationship Officer',
    company: 'NDB Bank',
    companyId: 'ndb',
    logoType: 'ndb',
    location: 'Colombo',
    jobType: 'Full Time',
    salary: 'Rs. 70,000 – 100,000',
    salaryPeriod: '/ Month',
    tags: ['1+ Yrs Exp', 'Sales', 'Customer Service'],
    isFeatured: true,
    postedTime: '5h ago',
    category: 'Accounting & Finance',
    description: 'NDB Bank seeks high-performing Relationship Officers to manage premier client portfolios and drive banking product adoption.'
  },
  {
    id: 'job-3',
    title: 'QA Engineer',
    company: 'WSO2',
    companyId: 'wso2',
    logoType: 'wso2',
    location: 'Colombo',
    jobType: 'Full Time',
    salary: 'Rs. 100,000 – 150,000',
    salaryPeriod: '/ Month',
    tags: ['2+ Yrs Exp', 'Selenium', 'QA'],
    isFeatured: true,
    postedTime: '1d ago',
    category: 'IT & Technology',
    description: 'Join WSO2 open source software suite quality engineering team. Experience in automation testing, Selenium, and CI/CD required.'
  }
];

export const REMOTE_JOBS: JobItem[] = [
  {
    id: 'remote-1',
    title: 'UI/UX Designer',
    company: 'Upwork Global Inc.',
    companyId: 'upwork',
    logoType: 'upwork',
    location: 'Remote',
    jobType: 'Full Time',
    salary: 'Rs. 180,000',
    salaryPeriod: '/ Month',
    tags: ['Figma', 'UI/UX', 'Remote'],
    isRemote: true,
    postedTime: 'Just now',
    category: 'IT & Technology'
  },
  {
    id: 'remote-2',
    title: 'Technical Support Specialist',
    company: 'TTEC',
    companyId: 'ttec',
    logoType: 'ttec',
    location: 'Remote',
    jobType: 'Full Time',
    salary: 'Rs. 150,000',
    salaryPeriod: '/ Month',
    tags: ['Customer Support', 'ITIL', 'Shift-based'],
    isRemote: true,
    postedTime: '3h ago',
    category: 'IT & Technology'
  },
  {
    id: 'remote-3',
    title: 'DevOps Engineer',
    company: 'GitLab',
    companyId: 'gitlab',
    logoType: 'gitlab',
    location: 'Remote',
    jobType: 'Full Time',
    salary: 'Rs. 160,000',
    salaryPeriod: '/ Month',
    tags: ['Docker', 'Kubernetes', 'CI/CD'],
    isRemote: true,
    postedTime: '1d ago',
    category: 'IT & Technology'
  }
];

export const TOP_HIRING_COMPANIES: CompanyPartner[] = [
  { id: 'dialog', name: 'Dialog Axiata', brandKey: 'dialog' },
  { id: 'mas', name: 'MAS Holdings', brandKey: 'mas', subtitle: 'CHANGE IS COURAGE' },
  { id: 'daraz', name: 'Daraz', brandKey: 'daraz' },
  { id: 'hnb', name: 'HNB Bank', brandKey: 'hnb', subtitle: 'YOUR PARTNER IN PROGRESS' },
  { id: 'softlogic', name: 'Softlogic', brandKey: 'softlogic' },
  { id: 'lolc', name: 'LOLC Holdings', brandKey: 'lolc' },
  { id: '99x', name: '99X', brandKey: '99x' }
];

// SERVICES MODULE DATA (matching Image 4)
export const SERVICE_CATEGORIES: CategoryItem[] = [
  {
    id: 'home-services',
    name: 'Home Services',
    iconName: 'Home',
    color: '#FF650A',
    bgColor: '#FEF0E9'
  },
  {
    id: 'appliance-repair',
    name: 'Appliance Repair',
    iconName: 'Wrench',
    color: '#0284C7',
    bgColor: '#E0F2FE'
  },
  {
    id: 'vehicle-services',
    name: 'Vehicle Services',
    iconName: 'Car',
    color: '#08A34F',
    bgColor: '#EAF8F0'
  },
  {
    id: 'computer-mobile',
    name: 'Computer & Mobile',
    iconName: 'Laptop',
    color: '#A855F7',
    bgColor: '#F3E8FF'
  },
  {
    id: 'business-services',
    name: 'Business Services',
    iconName: 'Briefcase',
    color: '#EC4899',
    bgColor: '#FCE7F3'
  },
  {
    id: 'creative-services',
    name: 'Creative Services',
    iconName: 'Palette',
    color: '#EAB308',
    bgColor: '#FEF9C3'
  },
  {
    id: 'education-services',
    name: 'Education Services',
    iconName: 'GraduationCap',
    color: '#0284C7',
    bgColor: '#E0F2FE'
  },
  {
    id: 'more-services',
    name: 'More',
    iconName: 'LayoutGrid',
    color: '#64748B',
    bgColor: '#F1F5F9'
  }
];

export const FEATURED_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    title: 'Professional Plumbing Services',
    providerName: 'Mr. Plumbing',
    isVerified: true,
    category: 'Home Services',
    categoryTag: 'Plumbing',
    location: 'Kandy, Central Province',
    rating: 4.9,
    reviewsCount: 128,
    price: 'Rs. 1,500',
    priceUnit: '/ Visit',
    imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    whatsappNumber: '94771234567',
    phone: '+94 77 123 4567',
    description: 'Expert residential and commercial plumbing. Leak detection, pipe installation, bathroom fittings and 24/7 urgent emergency repair.'
  },
  {
    id: 'srv-2',
    title: 'Car General Service & Repair',
    providerName: 'AutoCare Lanka',
    isVerified: true,
    category: 'Vehicle Services',
    categoryTag: 'Car Repair',
    location: 'Colombo',
    rating: 4.8,
    reviewsCount: 96,
    price: 'Rs. 5,000',
    priceUnit: '/ Service',
    imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    whatsappNumber: '94772345678',
    phone: '+94 77 234 5678',
    description: 'Complete automobile maintenance, tune-ups, engine diagnostics, oil changes, brake overhaul, and computerized scanner diagnostics.'
  },
  {
    id: 'srv-3',
    title: 'House Cleaning Services',
    providerName: 'Clean Home',
    isVerified: true,
    category: 'Home Services',
    categoryTag: 'Cleaning',
    location: 'Galle, Southern Province',
    rating: 4.7,
    reviewsCount: 75,
    price: 'Rs. 2,000',
    priceUnit: '/ Visit',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    whatsappNumber: '94773456789',
    phone: '+94 77 345 6789',
    description: 'Deep residential cleaning, sofa shampooing, floor scrubbing, post-construction cleanup, and office sanitization by vetted cleaners.'
  }
];

export const SERVICES_NEAR_YOU: ServiceNearYouItem[] = [
  {
    id: 'near-srv-1',
    name: 'Electrician',
    category: 'Electrical',
    iconName: 'Zap',
    color: '#FF650A',
    bgColor: '#FFF3E8',
    distance: '2.1 km away',
    rating: 4.8
  },
  {
    id: 'near-srv-2',
    name: 'AC Repair',
    category: 'Cooling',
    iconName: 'Snowflake',
    color: '#0284C7',
    bgColor: '#E0F2FE',
    distance: '2.3 km away',
    rating: 4.7
  },
  {
    id: 'near-srv-3',
    name: 'Painter',
    category: 'Painting',
    iconName: 'Paintbrush',
    color: '#08A34F',
    bgColor: '#EAF8F0',
    distance: '2.7 km away',
    rating: 4.6
  },
  {
    id: 'near-srv-4',
    name: 'Carpenter',
    category: 'Woodwork',
    iconName: 'Hammer',
    color: '#8B5CF6',
    bgColor: '#F3E8FF',
    distance: '3.1 km away',
    rating: 4.8
  },
  {
    id: 'near-srv-5',
    name: 'Washing',
    category: 'Laundry & Machine',
    iconName: 'WashingMachine',
    color: '#EC4899',
    bgColor: '#FCE7F3',
    distance: '3.4 km away',
    rating: 4.6
  }
];

export const SRI_LANKA_LOCATIONS = [
  { name: 'All Sri Lanka', province: 'Islandwide' },
  { name: 'Kandy', province: 'Central Province' },
  { name: 'Colombo', province: 'Western Province' },
  { name: 'Galle', province: 'Southern Province' },
  { name: 'Negombo', province: 'Western Province' },
  { name: 'Jaffna', province: 'Northern Province' },
  { name: 'Gampaha', province: 'Western Province' },
  { name: 'Kurunegala', province: 'North Western Province' },
  { name: 'Matara', province: 'Southern Province' },
  { name: 'Anuradhapura', province: 'North Central Province' },
  { name: 'Batticaloa', province: 'Eastern Province' },
  { name: 'Nuwara Eliya', province: 'Central Province' }
];

