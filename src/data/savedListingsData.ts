export interface SavedRentalItem {
  id: string;
  title: string;
  category: string;
  categoryType: 'HOUSE' | 'VEHICLE' | 'EVENT HALL' | 'EQUIPMENT' | 'VILLA' | 'BIKE' | 'CAMERA' | 'APARTMENT' | 'PROPERTY' | 'COMMERCIAL' | string;
  location: string;
  price: string;
  pricePeriod: string;
  imageUrl: string;
  photoCount?: string;
  specs?: { label: string; icon: string }[];
  isSaved?: boolean;
}

export interface SavedJobItem {
  id: string;
  title: string;
  company: string;
  companyId?: string;
  logoType?: 'microsoft' | 'wso2' | 'ey' | 'daraz' | 'virtusa' | 'ndb' | 'custom' | string;
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
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  isSaved?: boolean;
}

// Full comprehensive dataset for Saved Rentals across the platform
export const ALL_RENTALS_MAP: Record<string, SavedRentalItem> = {
  'rent-luxury-house-kandy': {
    id: 'rent-luxury-house-kandy',
    title: 'Luxury 4BR House for Rent',
    category: 'Property',
    categoryType: 'HOUSE',
    location: 'Peradeniya Road, Kandy',
    price: 'Rs. 85,000',
    pricePeriod: '/ Month',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    photoCount: '1/18',
    specs: [
      { label: '4 Beds', icon: 'Bed' },
      { label: '3 Baths', icon: 'Bath' },
      { label: '2,000 sqft', icon: 'Maximize2' }
    ]
  },
  'rent-prius-2018': {
    id: 'rent-prius-2018',
    title: 'Toyota Prius Hybrid 2018',
    category: 'Vehicles',
    categoryType: 'VEHICLE',
    location: 'Katugastota, Kandy',
    price: 'Rs. 6,500',
    pricePeriod: '/ Day',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    photoCount: '1/12',
    specs: [
      { label: 'Auto', icon: 'Cpu' },
      { label: 'Hybrid', icon: 'Fuel' },
      { label: '5 Seats', icon: 'Users' }
    ]
  },
  'rent-wedding-hall-kandy': {
    id: 'rent-wedding-hall-kandy',
    title: 'Wedding Hall with Catering',
    category: 'Event Hall',
    categoryType: 'EVENT HALL',
    location: 'Kandy Lake Round, Kandy',
    price: 'Rs. 150,000',
    pricePeriod: '/ Event',
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
    photoCount: '1/24',
    specs: [
      { label: '300 Pax', icon: 'Users' },
      { label: 'Parking', icon: 'Car' },
      { label: 'AC Hall', icon: 'Snowflake' }
    ]
  },
  'rent-luxury-villa-kandy': {
    id: 'rent-luxury-villa-kandy',
    title: 'Luxury 4BR House for Rent in Kandy',
    category: 'Property',
    categoryType: 'VILLA',
    location: 'Peradeniya Road, Kandy',
    price: 'Rs. 85,000',
    pricePeriod: '/ Month',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    photoCount: '1/18',
    specs: [
      { label: '4 Beds', icon: 'Bed' },
      { label: '3 Baths', icon: 'Bath' },
      { label: '2,000 sqft', icon: 'Maximize2' }
    ]
  },
  'rent-sony-a7iv': {
    id: 'rent-sony-a7iv',
    title: 'Sony Alpha A7 IV Camera + 24-70mm GM Lens',
    category: 'Electronics',
    categoryType: 'CAMERA',
    location: 'Bambalapitiya, Colombo 04',
    price: 'Rs. 6,500',
    pricePeriod: '/ Day',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    specs: [
      { label: '33MP', icon: 'Camera' },
      { label: '4K 60p', icon: 'Video' },
      { label: 'Dual SD', icon: 'HardDrive' }
    ]
  },
  'feat-1': {
    id: 'feat-1',
    title: 'Luxury House in Kandy',
    category: 'Property',
    categoryType: 'HOUSE',
    location: 'Kandy, Central Province',
    price: 'Rs. 85,000',
    pricePeriod: '/ Month',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    specs: [
      { label: '4 Beds', icon: 'Bed' },
      { label: '3 Baths', icon: 'Bath' },
      { label: 'Parking', icon: 'Car' }
    ]
  },
  'feat-2': {
    id: 'feat-2',
    title: 'Toyota Premio 2019',
    category: 'Vehicles',
    categoryType: 'VEHICLE',
    location: 'Colombo',
    price: 'Rs. 6,500',
    pricePeriod: '/ Day',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    specs: [
      { label: 'Auto', icon: 'Cpu' },
      { label: '5 Seats', icon: 'Users' },
      { label: 'AC', icon: 'Snowflake' }
    ]
  },
  'feat-3': {
    id: 'feat-3',
    title: 'Wedding Hall (150 Pax)',
    category: 'Event Hall',
    categoryType: 'EVENT HALL',
    location: 'Negombo',
    price: 'Rs. 45,000',
    pricePeriod: '/ Event',
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
    specs: [
      { label: '150 Pax', icon: 'Users' },
      { label: 'Parking', icon: 'Car' },
      { label: 'AC', icon: 'Snowflake' }
    ]
  },
  'rent-1': {
    id: 'rent-1',
    title: 'Luxury House in Kandy',
    category: 'Property',
    categoryType: 'HOUSE',
    location: 'Kandy, Central Province',
    price: 'Rs. 85,000',
    pricePeriod: '/ Month',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    specs: [
      { label: '4 Beds', icon: 'Bed' },
      { label: '3 Baths', icon: 'Bath' },
      { label: 'Parking', icon: 'Car' }
    ]
  },
  'rent-2': {
    id: 'rent-2',
    title: 'Toyota Premio 2019',
    category: 'Vehicles',
    categoryType: 'VEHICLE',
    location: 'Colombo',
    price: 'Rs. 6,500',
    pricePeriod: '/ Day',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    specs: [
      { label: 'Auto', icon: 'Cpu' },
      { label: '5 Seats', icon: 'Users' },
      { label: 'AC', icon: 'Snowflake' }
    ]
  },
  'rent-3': {
    id: 'rent-3',
    title: 'Wedding Hall (150 Pax)',
    category: 'Event Hall',
    categoryType: 'EVENT HALL',
    location: 'Negombo',
    price: 'Rs. 45,000',
    pricePeriod: '/ Event',
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
    specs: [
      { label: '150 Pax', icon: 'Users' },
      { label: 'Parking', icon: 'Car' },
      { label: 'AC', icon: 'Snowflake' }
    ]
  },
  'near-1': {
    id: 'near-1',
    title: 'Beach Side Villa',
    category: 'Property',
    categoryType: 'VILLA',
    location: 'Galle',
    price: 'Rs. 15,000',
    pricePeriod: '/ Day',
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
    specs: [{ label: '3 Beds', icon: 'Bed' }, { label: 'Beachfront', icon: 'Sun' }]
  },
  'near-2': {
    id: 'near-2',
    title: 'Yamaha FZ-S',
    category: 'Vehicles',
    categoryType: 'BIKE',
    location: 'Kandy',
    price: 'Rs. 2,000',
    pricePeriod: '/ Day',
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    specs: [{ label: '150cc', icon: 'Fuel' }, { label: 'Manual', icon: 'Gauge' }]
  },
  'near-3': {
    id: 'near-3',
    title: 'Generator 5KVA',
    category: 'Equipment',
    categoryType: 'EQUIPMENT',
    location: 'Colombo',
    price: 'Rs. 2,200',
    pricePeriod: '/ Day',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    specs: [{ label: '5 KVA', icon: 'Zap' }, { label: 'Diesel', icon: 'Fuel' }]
  },
  'near-4': {
    id: 'near-4',
    title: 'Canon EOS 200D',
    category: 'Electronics',
    categoryType: 'CAMERA',
    location: 'Colombo',
    price: 'Rs. 1,500',
    pricePeriod: '/ Day',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
    specs: [{ label: '24.2 MP', icon: 'Camera' }, { label: '18-55mm', icon: 'Layers' }]
  },
  'near-5': {
    id: 'near-5',
    title: 'Apartment in Havelock',
    category: 'Property',
    categoryType: 'APARTMENT',
    location: 'Colombo 05',
    price: 'Rs. 35,000',
    pricePeriod: '/ Week',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    specs: [{ label: '2 Beds', icon: 'Bed' }, { label: 'Furnished', icon: 'Home' }]
  },
  'sr-1': {
    id: 'sr-1',
    title: 'Luxury 4-Bedroom House with Garden & Pool',
    category: 'Property Rentals',
    categoryType: 'HOUSE',
    location: 'Peradeniya Road, Kandy',
    price: 'Rs. 85,000',
    pricePeriod: '/month',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    specs: [{ label: '4 Beds', icon: 'Bed' }, { label: '3 Baths', icon: 'Bath' }, { label: '2,400 sqft', icon: 'Maximize2' }]
  },
  'sr-2': {
    id: 'sr-2',
    title: 'Modern 3-Bedroom Apartment in Kandy City',
    category: 'Property Rentals',
    categoryType: 'APARTMENT',
    location: 'Kandy City Center, Kandy',
    price: 'Rs. 65,000',
    pricePeriod: '/month',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    specs: [{ label: '3 Beds', icon: 'Bed' }, { label: '2 Baths', icon: 'Bath' }, { label: '1,500 sqft', icon: 'Maximize2' }]
  },
  'sr-3': {
    id: 'sr-3',
    title: 'Toyota Prius 2018 Hybrid Car for Rent',
    category: 'Vehicle Rentals',
    categoryType: 'VEHICLE',
    location: 'Katugastota, Kandy',
    price: 'Rs. 8,500',
    pricePeriod: '/day',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    specs: [{ label: 'Hybrid', icon: 'Fuel' }, { label: 'Automatic', icon: 'Gauge' }, { label: '5 Seats', icon: 'Users' }]
  },
  'sr-6': {
    id: 'sr-6',
    title: 'Luxury 5BR Villa with Mountain View',
    category: 'Property Rentals',
    categoryType: 'VILLA',
    location: 'Hantana, Kandy',
    price: 'Rs. 120,000',
    pricePeriod: '/month',
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    specs: [{ label: '5 Beds', icon: 'Bed' }, { label: '4 Baths', icon: 'Bath' }]
  }
};

// Full comprehensive dataset for Saved Jobs across the platform
export const ALL_JOBS_MAP: Record<string, SavedJobItem> = {
  'job-1': {
    id: 'job-1',
    title: 'Software Engineer',
    company: 'Virtusa (Pvt) Ltd',
    companyId: 'virtusa',
    logoType: 'virtusa',
    location: 'Colombo & Remote',
    jobType: 'Full Time',
    salary: 'Rs. 180,000 - 250,000',
    salaryPeriod: '/ Month',
    postedTime: 'Posted 2 days ago'
  },
  'job-2': {
    id: 'job-2',
    title: 'Marketing Manager',
    company: 'Dialog Axiata PLC',
    companyId: 'dialog',
    logoType: 'wso2',
    location: 'Colombo 02',
    jobType: 'Full Time',
    salary: 'Rs. 120,000 - 160,000',
    salaryPeriod: '/ Month',
    postedTime: 'Posted 3 days ago'
  },
  'job-3': {
    id: 'job-3',
    title: 'Senior Accountant',
    company: 'MAS Holdings',
    companyId: 'mas',
    logoType: 'ey',
    location: 'Kandy / Colombo',
    jobType: 'Full Time',
    salary: 'Rs. 95,000 - 140,000',
    salaryPeriod: '/ Month',
    postedTime: 'Posted 4 days ago'
  },
  'job-4': {
    id: 'job-4',
    title: 'Head Chef / Kitchen Lead',
    company: 'Cinnamon Grand',
    companyId: 'cinnamon',
    logoType: 'daraz',
    location: 'Colombo 03',
    jobType: 'Full Time',
    salary: 'Rs. 110,000 - 150,000',
    salaryPeriod: '/ Month',
    postedTime: 'Posted 1 day ago'
  },
  'job-5': {
    id: 'job-5',
    title: 'Civil Engineer',
    company: 'Access Engineering PLC',
    companyId: 'access',
    logoType: 'custom',
    location: 'Kandy Highway Project',
    jobType: 'Full Time',
    salary: 'Rs. 130,000 - 190,000',
    salaryPeriod: '/ Month',
    postedTime: 'Posted 5 days ago'
  },
  'remote-1': {
    id: 'remote-1',
    title: 'React Frontend Developer',
    company: 'RemoteTech Lanka',
    companyId: 'remotetech',
    logoType: 'virtusa',
    location: 'Worldwide Remote',
    jobType: 'Full Time',
    salary: '$1,200 - $2,000 / mo',
    salaryPeriod: '',
    postedTime: 'Posted 1 day ago'
  },
  'remote-2': {
    id: 'remote-2',
    title: 'UI/UX Product Designer',
    company: 'GlobalDesign Studio',
    companyId: 'globaldesign',
    logoType: 'wso2',
    location: 'Sri Lanka Remote',
    jobType: 'Part Time',
    salary: '$800 - $1,400 / mo',
    salaryPeriod: '',
    postedTime: 'Posted 3 days ago'
  },
  'remote-3': {
    id: 'remote-3',
    title: 'Content Writer (English/Sinhala)',
    company: 'WordCraft Media',
    companyId: 'wordcraft',
    logoType: 'daraz',
    location: 'Work From Home',
    jobType: 'Contract',
    salary: 'Rs. 60,000 - 90,000',
    salaryPeriod: '/ Month',
    postedTime: 'Posted 2 days ago'
  },
  'job-software-engineer': {
    id: 'job-software-engineer',
    title: 'Senior Full-Stack Engineer',
    company: 'Virtusa (Pvt) Ltd',
    companyId: 'virtusa',
    logoType: 'virtusa',
    location: 'Orion City, Colombo 09',
    jobType: 'Full Time',
    salary: 'Rs. 250,000 - 380,000',
    salaryPeriod: '/ Month',
    postedTime: 'Posted 2 days ago'
  },
  'sr-4': {
    id: 'sr-4',
    title: 'Senior React Frontend Developer',
    company: 'CodeGen International',
    companyId: 'codegen',
    logoType: 'wso2',
    location: 'Kandy & Remote',
    jobType: 'Full Time',
    salary: 'Rs. 180,000 - 260,000',
    salaryPeriod: '/month',
    postedTime: 'Posted 2 days ago'
  },
  'sr-7': {
    id: 'sr-7',
    title: 'Full Stack Node.js / React Engineer',
    company: 'WSO2 Sri Lanka',
    companyId: 'wso2',
    logoType: 'wso2',
    location: 'Colombo & Remote',
    jobType: 'Full Time',
    salary: 'Rs. 220,000 - 320,000',
    salaryPeriod: '/month',
    postedTime: 'Posted 1 day ago'
  }
};

// Full comprehensive dataset for Saved Services across the platform
export const ALL_SERVICES_MAP: Record<string, SavedServiceItem> = {
  'srv-1': {
    id: 'srv-1',
    title: 'AC Repair & Servicing',
    providerName: 'CoolFix Lanka',
    category: 'Appliance Repair',
    categoryTag: 'AC Repair',
    location: 'Colombo & Suburbs',
    price: 'Rs. 2,500',
    priceUnit: '/ Visit',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 94
  },
  'srv-2': {
    id: 'srv-2',
    title: 'Plumbing & Pipe Fitting',
    providerName: 'QuickPlumb Lanka',
    category: 'Home Services',
    categoryTag: 'Plumbing',
    location: 'Kandy & Central',
    price: 'Rs. 1,800',
    priceUnit: '/ Visit',
    imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 82
  },
  'srv-3': {
    id: 'srv-3',
    title: 'Electrical Wiring & Repair',
    providerName: 'SparkMaster Electricals',
    category: 'Home Services',
    categoryTag: 'Electrician',
    location: 'Colombo, Gampaha',
    price: 'Rs. 2,000',
    priceUnit: '/ Visit',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 118
  },
  'srv-4': {
    id: 'srv-4',
    title: 'House & Office Painting',
    providerName: 'ColorCraft Solutions',
    category: 'Home Services',
    categoryTag: 'Painting',
    location: 'All Island',
    price: 'Rs. 4,500',
    priceUnit: '/ Day',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 73
  },
  'srv-5': {
    id: 'srv-5',
    title: 'Carpentry & Furniture Repair',
    providerName: 'WoodWorks Lanka',
    category: 'Home Services',
    categoryTag: 'Carpentry',
    location: 'Moratuwa & Colombo',
    price: 'Rs. 2,200',
    priceUnit: '/ Visit',
    imageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 54
  },
  'near-srv-1': {
    id: 'near-srv-1',
    title: 'Certified Electrician & Wiring',
    providerName: 'QuickSpark Tech',
    category: 'Home Services',
    categoryTag: 'Electrician',
    location: 'Kandy (1.2 km away)',
    price: 'Rs. 1,500',
    priceUnit: '/ Visit',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 88
  },
  'near-srv-2': {
    id: 'near-srv-2',
    title: 'AC Tech & Inverter Specialist',
    providerName: 'FrostAir Services',
    category: 'Appliance Repair',
    categoryTag: 'AC Tech',
    location: 'Kandy (2.5 km away)',
    price: 'Rs. 2,500',
    priceUnit: '/ Visit',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 64
  },
  'near-srv-3': {
    id: 'near-srv-3',
    title: 'Interior & Exterior Painter',
    providerName: 'LankaColor Pro',
    category: 'Home Services',
    categoryTag: 'Painter',
    location: 'Kandy (3.1 km away)',
    price: 'Rs. 3,500',
    priceUnit: '/ Day',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 41
  },
  'near-srv-4': {
    id: 'near-srv-4',
    title: 'Custom Carpenter & Wood Finisher',
    providerName: 'MasterWood Lanka',
    category: 'Home Services',
    categoryTag: 'Carpenter',
    location: 'Kandy (4.0 km away)',
    price: 'Rs. 2,000',
    priceUnit: '/ Visit',
    imageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 52
  },
  'near-srv-5': {
    id: 'near-srv-5',
    title: 'Deep House & Office Cleaner',
    providerName: 'SparkleClean Lanka',
    category: 'Home Services',
    categoryTag: 'Cleaning',
    location: 'Kandy (1.8 km away)',
    price: 'Rs. 1,200',
    priceUnit: '/ Hour',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 110
  },
  'srv-home-cleaning': {
    id: 'srv-home-cleaning',
    title: 'Professional Deep Home & Office Cleaning Service',
    providerName: 'CleanPro Solutions Lanka',
    category: 'Home Services',
    categoryTag: 'Cleaning',
    location: 'Colombo 03 & Greater Colombo',
    price: 'Rs. 1,200',
    priceUnit: '/ Hour',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 128
  },
  'sr-5': {
    id: 'sr-5',
    title: 'Certified Master Electrician & Wiring Services',
    providerName: 'QuickFix Engineering (Pvt) Ltd',
    category: 'Home Services',
    categoryTag: 'Electrical',
    location: 'Peradeniya, Kandy',
    price: 'Rs. 2,500',
    priceUnit: '/visit',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 84
  },
  'sr-8': {
    id: 'sr-8',
    title: 'Professional AC Repair & Servicing in Kandy',
    providerName: 'CoolTech HVAC Solutions',
    category: 'Appliance Repair',
    categoryTag: 'AC Repair',
    location: 'Kandy & Peradeniya',
    price: 'Rs. 3,000',
    priceUnit: '/service',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 62
  }
};

export const DEFAULT_SAVED_RENTALS: SavedRentalItem[] = Object.values(ALL_RENTALS_MAP);
export const DEFAULT_SAVED_JOBS: SavedJobItem[] = Object.values(ALL_JOBS_MAP);
export const DEFAULT_SAVED_SERVICES: SavedServiceItem[] = Object.values(ALL_SERVICES_MAP);

export function getSavedRentals(savedIds: string[]): SavedRentalItem[] {
  if (!savedIds || savedIds.length === 0) return [];
  const results: SavedRentalItem[] = [];
  
  for (const id of savedIds) {
    if (ALL_RENTALS_MAP[id]) {
      results.push({ ...ALL_RENTALS_MAP[id], isSaved: true });
    }
  }
  return results;
}

export function getSavedJobs(savedIds: string[]): SavedJobItem[] {
  if (!savedIds || savedIds.length === 0) return [];
  const results: SavedJobItem[] = [];
  
  for (const id of savedIds) {
    if (ALL_JOBS_MAP[id]) {
      results.push({ ...ALL_JOBS_MAP[id], isSaved: true });
    }
  }
  return results;
}

export function getSavedServices(savedIds: string[]): SavedServiceItem[] {
  if (!savedIds || savedIds.length === 0) return [];
  const results: SavedServiceItem[] = [];
  
  for (const id of savedIds) {
    if (ALL_SERVICES_MAP[id]) {
      results.push({ ...ALL_SERVICES_MAP[id], isSaved: true });
    }
  }
  return results;
}
