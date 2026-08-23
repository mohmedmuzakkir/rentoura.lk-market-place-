import { RentalListingDetail, JobListingDetail, ServiceListingDetail, AnyListingDetail } from '../types/listingDetailsTypes';

// ==================== REFERENCE 1: RENTAL LISTING (Toyota Prius Hybrid 2018) ====================
export const SAMPLE_RENTAL_PRIUS: RentalListingDetail = {
  id: 'rent-prius-2018',
  module: 'rentals',
  title: 'Toyota Prius Hybrid 2018',
  category: 'Vehicles',
  subcategory: 'Cars',
  categoryPath: 'Vehicles > Cars > Hybrid',
  categoryType: 'VEHICLE',
  isVerified: true,
  isFeatured: true,
  status: 'active',
  createdAt: '2025-05-10T09:30:00Z',
  postedDateStr: '10 May 2025',
  location: {
    province: 'Central Province',
    district: 'Kandy District',
    city: 'Kandy City',
    area: 'Kandy City Center Area',
    address: 'Dalada Veediya, Kandy City, Sri Lanka',
    lat: 7.2906,
    lng: 80.6337,
    mapImageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=80'
  },
  images: [
    'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80'
  ],
  pricing: {
    activePeriod: 'Day',
    isNegotiable: true,
    rates: [
      { unit: 'Hour', price: 1500, label: 'Rs. 1,500' },
      { unit: 'Day', price: 12500, label: 'Rs. 12,500' },
      { unit: 'Week', price: 75000, label: 'Rs. 75,000' },
      { unit: 'Month', price: 250000, label: 'Rs. 250,000' },
      { unit: 'Year', price: 2800000, label: 'Rs. 2,800,000' }
    ]
  },
  attributes: [
    { label: 'Year', value: '2018', iconName: 'Calendar' },
    { label: 'Fuel', value: 'Hybrid', iconName: 'Fuel' },
    { label: 'Transmission', value: 'Automatic', iconName: 'Gauge' },
    { label: 'Seating', value: '5 Seats', iconName: 'Users' },
    { label: 'Color', value: 'White', iconName: 'Palette' }
  ],
  features: [
    'AC',
    'Power Steering',
    'Airbags',
    'Reverse Camera',
    'Bluetooth',
    'Alloy Wheels',
    'USB Charger'
  ],
  availability: {
    availableFrom: '12 May 2025',
    minimumRental: '1 Day',
    maxRental: '30 Days',
    advanceBooking: 'Not Required'
  },
  securityPolicies: {
    securityDeposit: 'Rs. 25,000',
    mileageLimit: '150 KM / Day',
    extraMileage: 'Rs. 50 / KM',
    licenseRequired: 'Yes',
    minDriverAge: '21 Years'
  },
  deliveryPickup: {
    deliveryAvailable: true,
    deliveryCharge: 'Rs. 1,500',
    pickupAvailable: true,
    pickupLocation: 'Kandy City Free'
  },
  description: 'Well maintained Toyota Prius Hybrid 2018 in excellent condition. Perfect for city drive and long trips. Very fuel efficient (approx 22-26 km/l) and comfortable. Self drive or with driver both available on request. Regularly serviced at Toyota Lanka with full insurance coverage.',
  owner: {
    id: 'usr-pasindu-fernando',
    name: 'Pasindu Fernando',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    memberSince: '2021',
    rating: 4.9,
    reviewsCount: 128,
    activeListingsCount: 38,
    responseRate: '98%',
    responseSpeed: 'Usually replies within 1h',
    totalRentalsCompleted: 256
  },
  contact: {
    phone: '0701234567',
    whatsappNumber: '0701234567',
    email: 'pasindu.rentals@example.lk',
    allowInternalMessage: true
  }
};

// ==================== REFERENCE 2: JOB LISTING (Software Engineer) ====================
export const SAMPLE_JOB_SOFTWARE_ENGINEER: JobListingDetail = {
  id: 'job-software-engineer',
  module: 'jobs',
  title: 'Software Engineer',
  category: 'Software & IT',
  subcategory: 'Software Engineering',
  categoryPath: 'IT & Software > Engineering > Full Stack',
  isVerified: true,
  isFeatured: true,
  status: 'active',
  createdAt: '2025-05-08T10:00:00Z',
  postedDateStr: 'Posted 2 days ago',
  location: {
    province: 'Western Province',
    district: 'Colombo District',
    city: 'Colombo 07',
    area: 'Cinnamon Gardens',
    address: 'Ward Place, Colombo 07, Sri Lanka'
  },
  jobHeroImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
  company: {
    id: 'cmp-techsolutions',
    name: 'TechSolutions (Pvt) Ltd',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    logoBg: '#0F172A',
    logoText: 'tech',
    isVerified: true,
    about: 'TechSolutions (Pvt) Ltd is a leading IT solutions provider in Sri Lanka. We build innovative software products and provide top-notch services to clients worldwide across North America, Europe, and Asia Pacific.',
    foundedYear: '2015',
    employeeCount: '50-100',
    industry: 'IT Services',
    websiteUrl: 'techsolutions.lk',
    location: 'Colombo, Western Province'
  },
  employmentType: 'Full Time',
  workArrangement: 'On-site',
  vacancies: '3 Openings',
  experienceLevel: '2 - 4 Years',
  educationLevel: "Bachelor's Degree",
  salary: {
    type: 'range',
    min: 120000,
    max: 180000,
    period: 'Month',
    isNegotiable: true
  },
  applicationDeadline: '25 May 2025',
  workingHours: '9:00 AM - 6:00 PM',
  workingDays: 'Monday - Friday',
  jobIdNumber: 'JOB-2024-0856',
  highlights: [
    'Competitive Salary',
    'Career Growth Opportunities',
    'Professional Training',
    'Friendly Work Environment',
    'Modern Office & Equipment'
  ],
  requirementsList: [
    "Bachelor's degree in Computer Science or related field",
    '2 - 4 years of experience in software development',
    'Proficiency in JavaScript, React, Node.js, and TypeScript',
    'Experience with databases (PostgreSQL, MongoDB)',
    'Good understanding of RESTful APIs & Microservices',
    'Strong problem-solving and analytical skills',
    'Excellent communication and teamwork'
  ],
  responsibilitiesList: [
    'Design, develop and deploy scalable web and mobile applications',
    'Collaborate with product designers, QA engineers, and backend teams',
    'Write clean, maintainable, and well-tested code',
    'Participate in agile sprint ceremonies and code reviews',
    'Troubleshoot, debug, and optimize application performance'
  ],
  benefitsList: [
    'EPF / ETF contributions (12% + 3%)',
    'Comprehensive Medical & OPD Insurance for employee and family',
    'Annual performance bonus and project milestone incentives',
    'Learning allowance & sponsored cloud certifications (AWS/GCP)',
    'Free daily snacks, gourmet coffee, and catered lunch on Fridays'
  ],
  applyMethods: {
    internalApply: true,
    whatsapp: true,
    phone: true,
    email: 'careers@techsolutions.lk'
  },
  companyReviews: {
    rating: 4.6,
    count: 42,
    featuredReview: {
      author: 'Naveen K.',
      role: 'Software Developer',
      comment: 'Great place to work and learn new technologies. Supportive team and transparent management!',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    }
  },
  description: 'We are looking for a passionate Software Engineer to join our dynamic team. You will be responsible for designing, developing, and maintaining high-quality software solutions that meet our business and client needs.',
  ownerId: 'usr-techsolutions-hr',
  contact: {
    phone: '0112345678',
    whatsappNumber: '0771234567',
    email: 'hr@techsolutions.lk',
    allowInternalMessage: true
  }
};

// ==================== REFERENCE 3: SERVICE LISTING (Home Cleaning Service) ====================
export const SAMPLE_SERVICE_CLEANING: ServiceListingDetail = {
  id: 'srv-home-cleaning',
  module: 'services',
  title: 'Professional Home Cleaning Service',
  category: 'Home Services',
  subcategory: 'Cleaning',
  categoryPath: 'Home Services > Cleaning > Residential & Deep Clean',
  isVerified: true,
  isFeatured: true,
  status: 'active',
  createdAt: '2025-05-02T11:20:00Z',
  postedDateStr: 'Available Today',
  location: {
    province: 'Central Province',
    district: 'Kandy District',
    city: 'Kandy City',
    area: 'Kandy & Suburbs',
    address: 'Kandy City Center, Kandy, Sri Lanka',
    lat: 7.2906,
    lng: 80.6337
  },
  images: [
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=800&q=80'
  ],
  portfolioImages: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80'
  ],
  rating: 4.9,
  reviewsCount: 128,
  startingPrice: {
    amount: 1000,
    unit: 'Per Hour'
  },
  packages: [
    { title: 'Regular Cleaning', price: 'Rs. 1,000', unit: '/ Hour' },
    { title: 'Deep Cleaning', price: 'Rs. 1,500', unit: '/ Hour' },
    { title: 'Move-in/Move-out', price: 'Rs. 1,800', unit: '/ Hour' },
    { title: 'Post Construction', price: 'Rs. 2,000', unit: '/ Hour' }
  ],
  serviceType: 'Home Cleaning',
  experienceYears: '5+ Years',
  serviceMode: 'At Your Place',
  availabilityDays: 'Mon - Sun',
  availabilityHours: '6:00 AM - 8:00 PM',
  sameDayBooking: true,
  emergencyService: true,
  responseTime: 'Within 1 Hour',
  teamSize: '3 Cleaners',
  equipmentProvided: true,
  provider: {
    id: 'pvd-cleanpro',
    name: 'CleanPro Solutions (Pvt) Ltd',
    type: 'Company',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    isBusinessRegistered: true,
    isBackgroundChecked: true,
    isIdVerified: true,
    isInsuranceCovered: true,
    completedJobsCount: 256,
    positiveReviewsPercentage: '98%',
    experience: '5+ Years'
  },
  customerReviews: {
    rating: 5.0,
    count: 128,
    featuredReview: {
      author: 'Thilini Perera',
      rating: 5.0,
      timeAgo: '2 days ago',
      comment: 'Excellent service! Very professional and on time. My house is sparkling clean. Highly recommended!',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
    }
  },
  description: 'We provide professional home cleaning services for houses, apartments, villas, and offices. Deep cleaning, regular cleaning, sanitization, and move-in/move-out cleaning available. All eco-friendly chemicals and industrial equipment provided.',
  ownerId: 'usr-cleanpro-admin',
  contact: {
    phone: '0778899112',
    whatsappNumber: '0778899112',
    email: 'info@cleanpro.lk',
    allowInternalMessage: true
  }
};

// Additional Category-Aware Rental Samples (e.g. Property & Electronics)
export const SAMPLE_RENTAL_HOUSE: RentalListingDetail = {
  id: 'rent-luxury-villa-kandy',
  module: 'rentals',
  title: 'Luxury 3-Bedroom Lakeview Villa',
  category: 'Property',
  subcategory: 'Villas & Houses',
  categoryPath: 'Property > Villas > Lakeview',
  categoryType: 'PROPERTY',
  isVerified: true,
  isFeatured: true,
  status: 'active',
  createdAt: '2025-05-09T08:00:00Z',
  postedDateStr: '9 May 2025',
  location: {
    province: 'Central Province',
    district: 'Kandy District',
    city: 'Kandy City',
    area: 'Lake Round',
    address: 'Victoria Drive, Kandy Lake Round',
    lat: 7.2906,
    lng: 80.6337
  },
  images: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=800&q=80'
  ],
  pricing: {
    activePeriod: 'Month',
    isNegotiable: true,
    rates: [
      { unit: 'Day', price: 25000, label: 'Rs. 25,000' },
      { unit: 'Week', price: 150000, label: 'Rs. 150,000' },
      { unit: 'Month', price: 380000, label: 'Rs. 380,000' },
      { unit: 'Year', price: 4200000, label: 'Rs. 4,200,000' }
    ]
  },
  attributes: [
    { label: 'Bedrooms', value: '3 Beds', iconName: 'BedDouble' },
    { label: 'Bathrooms', value: '3 Attached', iconName: 'Bath' },
    { label: 'Floor Area', value: '2,800 sq ft', iconName: 'Maximize' },
    { label: 'Furnishing', value: 'Fully Furnished', iconName: 'Armchair' },
    { label: 'Parking', value: '2 Vehicles', iconName: 'Car' }
  ],
  features: [
    'WiFi',
    'AC in All Rooms',
    'Modern Kitchen',
    'Balcony Lake View',
    'Garden',
    'Hot Water',
    'Solar Backup'
  ],
  availability: {
    availableFrom: 'Immediate',
    minimumRental: '3 Days',
    maxRental: 'Long Term',
    advanceBooking: 'Required'
  },
  securityPolicies: {
    securityDeposit: '2 Months Rent',
    terms: ['No smoking inside', 'Quiet hours after 10 PM']
  },
  deliveryPickup: {
    pickupAvailable: true,
    pickupLocation: 'Key handover at villa entrance'
  },
  description: 'Stunning modern 3-bedroom villa overlooking the scenic Kandy Lake. Fully equipped gourmet kitchen, fiber optic internet, 24/7 security, landscaped private garden, and walking distance to Kandy City Center.',
  owner: {
    id: 'usr-kandy-properties',
    name: 'Kandy Heritage Villas',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    memberSince: '2019',
    rating: 5.0,
    reviewsCount: 84,
    activeListingsCount: 12,
    responseRate: '100%',
    responseSpeed: 'Usually replies within 30 min',
    totalRentalsCompleted: 140
  },
  contact: {
    phone: '0812233445',
    whatsappNumber: '0712233445',
    email: 'villas@kandyheritage.lk',
    allowInternalMessage: true
  }
};

export const SAMPLE_RENTAL_CAMERA: RentalListingDetail = {
  id: 'rent-sony-a7iv',
  module: 'rentals',
  title: 'Sony Alpha A7 IV 4K Cinema Camera Kit',
  category: 'Electronics',
  subcategory: 'Cameras & Lenses',
  categoryPath: 'Electronics > Cameras > Sony Cinema',
  categoryType: 'ELECTRONICS',
  isVerified: true,
  isFeatured: false,
  status: 'active',
  createdAt: '2025-05-11T12:00:00Z',
  postedDateStr: '11 May 2025',
  location: {
    province: 'Western Province',
    district: 'Colombo District',
    city: 'Nugegoda',
    area: 'High Level Road'
  },
  images: [
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80'
  ],
  pricing: {
    activePeriod: 'Day',
    isNegotiable: false,
    rates: [
      { unit: 'Day', price: 9500, label: 'Rs. 9,500' },
      { unit: 'Week', price: 55000, label: 'Rs. 55,000' }
    ]
  },
  attributes: [
    { label: 'Brand', value: 'Sony', iconName: 'Tag' },
    { label: 'Model', value: 'A7 IV 33MP', iconName: 'Camera' },
    { label: 'Lens Kit', value: '24-70mm f/2.8 GM', iconName: 'Focus' },
    { label: 'Condition', value: 'Mint Condition', iconName: 'CheckCircle' }
  ],
  features: ['3x Batteries', '128GB V90 SD Card', 'Dual Charger', 'Carry Case', 'Rode Mic'],
  availability: {
    availableFrom: 'Today',
    minimumRental: '1 Day'
  },
  securityPolicies: {
    securityDeposit: 'Original NIC & Billing Proof Required',
    terms: ['Strictly professional use', 'Damage waiver agreement']
  },
  description: 'Complete professional Sony A7 IV setup for commercial shoots, weddings, and events. Includes GM lens, 3 high-capacity batteries, fast memory cards, and protective rig.',
  owner: {
    id: 'usr-colombo-cine',
    name: 'Colombo Cine Equipment',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    memberSince: '2020',
    rating: 4.9,
    reviewsCount: 92,
    activeListingsCount: 15,
    responseRate: '99%',
    responseSpeed: 'Usually replies in 15 min',
    totalRentalsCompleted: 310
  },
  contact: {
    phone: '0773344556',
    whatsappNumber: '0773344556',
    allowInternalMessage: true
  }
};

// ==================== RESOLUTION ENGINE ====================
// Lookup dictionary
const ALL_SAMPLE_LISTINGS: Record<string, AnyListingDetail> = {
  // Direct matches
  'rent-prius-2018': SAMPLE_RENTAL_PRIUS,
  'job-software-engineer': SAMPLE_JOB_SOFTWARE_ENGINEER,
  'srv-home-cleaning': SAMPLE_SERVICE_CLEANING,
  'rent-luxury-villa-kandy': SAMPLE_RENTAL_HOUSE,
  'rent-luxury-house-kandy': {
    ...SAMPLE_RENTAL_HOUSE,
    id: 'rent-luxury-house-kandy',
    title: 'Luxury 4BR House for Rent in Kandy',
    location: {
      province: 'Central Province',
      district: 'Kandy District',
      city: 'Kandy',
      area: 'Peradeniya Road',
      address: 'Peradeniya Road, Kandy, Sri Lanka'
    },
    pricing: {
      activePeriod: 'Month',
      isNegotiable: true,
      rates: [
        { unit: 'Month', price: 85000, label: 'Rs. 85,000' }
      ]
    },
    attributes: [
      { label: 'Bedrooms', value: '4 Beds', iconName: 'Bed' },
      { label: 'Bathrooms', value: '3 Baths', iconName: 'Bath' },
      { label: 'Floor Area', value: '2,000 sqft', iconName: 'Maximize2' },
      { label: 'Parking', value: '2 Vehicles', iconName: 'Car' }
    ]
  },
  'rent-wedding-hall-kandy': {
    ...SAMPLE_RENTAL_HOUSE,
    id: 'rent-wedding-hall-kandy',
    title: 'Wedding Hall with Catering',
    category: 'Event Hall',
    categoryType: 'EVENTS',
    location: {
      province: 'Central Province',
      district: 'Kandy District',
      city: 'Kandy',
      area: 'Mahaiyawa',
      address: 'Mahaiyawa, Kandy, Sri Lanka'
    },
    pricing: {
      activePeriod: 'Day',
      isNegotiable: true,
      rates: [
        { unit: 'Day', price: 150000, label: 'Rs. 150,000' }
      ]
    },
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80'
    ],
    attributes: [
      { label: 'Capacity', value: '500 Guests', iconName: 'Users' },
      { label: 'Air Conditioning', value: 'Central AC Hall', iconName: 'Snowflake' },
      { label: 'Parking', value: '100+ Cars', iconName: 'Car' }
    ]
  },
  'rent-sony-a7iv': SAMPLE_RENTAL_CAMERA,

  // Home & Search & Rentals mock items
  'feat-1': SAMPLE_RENTAL_HOUSE,
  'feat-2': SAMPLE_RENTAL_PRIUS,
  'feat-3': SAMPLE_RENTAL_CAMERA,
  
  'rent-1': SAMPLE_RENTAL_HOUSE,
  'rent-2': SAMPLE_RENTAL_PRIUS,
  'rent-3': {
    ...SAMPLE_RENTAL_CAMERA,
    id: 'rent-3',
    title: 'Commercial Concrete Mixer 500L',
    category: 'Equipment',
    categoryType: 'EQUIPMENT',
    categoryPath: 'Equipment > Construction > Concrete Mixers',
    pricing: {
      activePeriod: 'Day',
      isNegotiable: true,
      rates: [
        { unit: 'Day', price: 4500, label: 'Rs. 4,500' },
        { unit: 'Week', price: 26000, label: 'Rs. 26,000' },
        { unit: 'Month', price: 90000, label: 'Rs. 90,000' }
      ]
    },
    images: [
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80'
    ],
    attributes: [
      { label: 'Capacity', value: '500 Liters', iconName: 'Gauge' },
      { label: 'Power', value: 'Diesel Engine 7HP', iconName: 'Zap' },
      { label: 'Mobility', value: 'Heavy Duty Tow Wheels', iconName: 'Truck' },
      { label: 'Condition', value: 'Fully Serviced', iconName: 'CheckCircle' }
    ],
    features: ['Electric & Recoil Start', 'Heavy Duty Steel Drum', 'Operator Guidance Available', 'Site Delivery Available'],
    description: 'High capacity 500L diesel concrete mixer ideal for construction contractors, builders, and large domestic projects. Fuel efficient Yanmar-style diesel engine.'
  },
  'rent-4': SAMPLE_RENTAL_CAMERA,

  'near-1': {
    ...SAMPLE_RENTAL_HOUSE,
    id: 'near-1',
    title: '2BR Luxury Apartment in Colombo 03',
    location: {
      province: 'Western Province',
      district: 'Colombo District',
      city: 'Colombo 03',
      area: 'Kollupitiya',
      address: 'Galle Road, Colombo 03, Sri Lanka'
    },
    pricing: {
      activePeriod: 'Month',
      isNegotiable: true,
      rates: [
        { unit: 'Month', price: 145000, label: 'Rs. 145,000' }
      ]
    }
  },
  'near-2': {
    ...SAMPLE_RENTAL_PRIUS,
    id: 'near-2',
    title: 'Hero Dash 110cc Scooter',
    category: 'Vehicles',
    categoryType: 'VEHICLE',
    pricing: {
      activePeriod: 'Day',
      isNegotiable: false,
      rates: [
        { unit: 'Day', price: 2000, label: 'Rs. 2,000' },
        { unit: 'Week', price: 12000, label: 'Rs. 12,000' },
        { unit: 'Month', price: 38000, label: 'Rs. 38,000' }
      ]
    }
  },
  'near-3': {
    ...SAMPLE_RENTAL_CAMERA,
    id: 'near-3',
    title: 'Marquee Party Tent 20x40 Ft',
    category: 'Event Rentals',
    categoryType: 'EVENTS',
    pricing: {
      activePeriod: 'Day',
      isNegotiable: true,
      rates: [
        { unit: 'Day', price: 18000, label: 'Rs. 18,000' }
      ]
    }
  },
  'near-4': {
    ...SAMPLE_RENTAL_CAMERA,
    id: 'near-4',
    title: 'Bosch Heavy Rotary Hammer Drill',
    category: 'Equipment',
    categoryType: 'EQUIPMENT',
    pricing: {
      activePeriod: 'Day',
      isNegotiable: false,
      rates: [
        { unit: 'Day', price: 2200, label: 'Rs. 2,200' }
      ]
    }
  },

  'res-rent-1': SAMPLE_RENTAL_PRIUS,
  'res-rent-2': SAMPLE_RENTAL_HOUSE,
  'res-rent-3': SAMPLE_RENTAL_CAMERA,
  
  // Jobs
  'job-1': {
    ...SAMPLE_JOB_SOFTWARE_ENGINEER,
    id: 'job-1',
    title: 'Senior React Native Engineer',
    company: {
      ...SAMPLE_JOB_SOFTWARE_ENGINEER.company,
      name: 'Virtusa Sri Lanka',
      logoText: 'VIRTUSA',
      industry: 'IT & Digital Transformation'
    },
    salary: { type: 'range', min: 250000, max: 380000, period: 'Month', isNegotiable: true },
    employmentType: 'Full Time',
    workArrangement: 'Hybrid'
  },
  'job-2': {
    ...SAMPLE_JOB_SOFTWARE_ENGINEER,
    id: 'job-2',
    title: 'Financial Analyst',
    company: {
      ...SAMPLE_JOB_SOFTWARE_ENGINEER.company,
      name: 'NDB Bank PLC',
      logoText: 'NDB',
      industry: 'Banking & Finance'
    },
    salary: { type: 'range', min: 140000, max: 200000, period: 'Month', isNegotiable: true },
    employmentType: 'Full Time',
    workArrangement: 'On-site'
  },
  'job-3': {
    ...SAMPLE_JOB_SOFTWARE_ENGINEER,
    id: 'job-3',
    title: 'Luxury Hotel Front Desk Executive',
    company: {
      ...SAMPLE_JOB_SOFTWARE_ENGINEER.company,
      name: 'Cinnamon Grand Colombo',
      logoText: 'CINNAMON',
      industry: 'Hospitality & Tourism'
    },
    salary: { type: 'range', min: 75000, max: 95000, period: 'Month', isNegotiable: false },
    employmentType: 'Full Time',
    workArrangement: 'On-site',
    experienceLevel: '1 - 2 Years',
    skills: ['Customer Service', 'PMS Software', 'English Fluency', 'Guest Relations']
  },
  'rem-1': {
    ...SAMPLE_JOB_SOFTWARE_ENGINEER,
    id: 'rem-1',
    title: 'Senior UI/UX Product Designer',
    company: {
      ...SAMPLE_JOB_SOFTWARE_ENGINEER.company,
      name: 'PickMe Engineering',
      logoText: 'PickMe',
      industry: 'Ride Hailing & Logistics'
    },
    salary: { type: 'range', min: 220000, max: 320000, period: 'Month', isNegotiable: true },
    employmentType: 'Full Time',
    workArrangement: 'Remote',
    skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping']
  },
  'rem-2': {
    ...SAMPLE_JOB_SOFTWARE_ENGINEER,
    id: 'rem-2',
    title: 'Full Stack Node.js Engineer',
    company: {
      ...SAMPLE_JOB_SOFTWARE_ENGINEER.company,
      name: 'Sysco LABS',
      logoText: 'SYSCO',
      industry: 'Enterprise Software'
    },
    salary: { type: 'range', min: 280000, max: 420000, period: 'Month', isNegotiable: true },
    workArrangement: 'Remote'
  },
  'rem-3': {
    ...SAMPLE_JOB_SOFTWARE_ENGINEER,
    id: 'rem-3',
    title: 'Digital Growth Marketing Specialist',
    company: {
      ...SAMPLE_JOB_SOFTWARE_ENGINEER.company,
      name: 'Daraz Sri Lanka (Alibaba Group)',
      logoText: 'DARAZ',
      industry: 'E-Commerce'
    },
    salary: { type: 'range', min: 130000, max: 190000, period: 'Month', isNegotiable: true },
    workArrangement: 'Remote'
  },
  'rem-4': {
    ...SAMPLE_JOB_SOFTWARE_ENGINEER,
    id: 'rem-4',
    title: 'B2B SaaS Sales Executive',
    company: {
      ...SAMPLE_JOB_SOFTWARE_ENGINEER.company,
      name: 'WSO2 Global Sales',
      logoText: 'WSO2',
      industry: 'Open Source Enterprise Middleware'
    },
    salary: { type: 'range', min: 180000, max: 300000, period: 'Month', isNegotiable: true },
    workArrangement: 'Remote'
  },
  'res-job-1': SAMPLE_JOB_SOFTWARE_ENGINEER,
  'res-job-2': {
    ...SAMPLE_JOB_SOFTWARE_ENGINEER,
    id: 'res-job-2',
    title: 'Financial Analyst',
    company: {
      ...SAMPLE_JOB_SOFTWARE_ENGINEER.company,
      name: 'NDB Bank PLC',
      logoText: 'NDB'
    }
  },

  // Services
  'srv-1': SAMPLE_SERVICE_CLEANING,
  'srv-2': {
    ...SAMPLE_SERVICE_CLEANING,
    id: 'srv-2',
    title: 'Air Conditioner Repair & Gas Refill',
    serviceType: 'AC & Appliance Repair',
    category: 'Home & Appliance',
    startingPrice: { amount: 2500, unit: 'Fixed' },
    packages: [
      { title: 'AC General Service', price: 'Rs. 2,500', unit: 'Per Unit' },
      { title: 'Gas Refilling (R410A / R32)', price: 'Rs. 4,500', unit: 'Fixed' },
      { title: 'Circuit / Inverter Repair', price: 'Rs. 3,500', unit: 'Per Project' }
    ]
  },
  'srv-3': {
    ...SAMPLE_SERVICE_CLEANING,
    id: 'srv-3',
    title: 'Master Residential Electrician & Rewiring',
    serviceType: 'Electrical & Power',
    category: 'Home Services',
    startingPrice: { amount: 1800, unit: 'Fixed' },
    packages: [
      { title: 'Short Circuit & Fuse Repair', price: 'Rs. 1,800', unit: 'Per Project' },
      { title: 'Full House DB Wiring / Upgrade', price: 'Rs. 28,000', unit: 'Per Project' },
      { title: 'Generator / Solar Inverter Hookup', price: 'Rs. 8,500', unit: 'Fixed' }
    ]
  },
  'sny-1': {
    ...SAMPLE_SERVICE_CLEANING,
    id: 'sny-1',
    title: '24/7 Emergency Electrician Dispatch',
    serviceType: 'Emergency Electrical',
    emergencyService: true,
    responseTime: 'Within 30 Mins'
  },
  'sny-2': {
    ...SAMPLE_SERVICE_CLEANING,
    id: 'sny-2',
    title: 'Fast AC Servicing & Chemical Wash',
    serviceType: 'Appliance'
  },
  'sny-3': {
    ...SAMPLE_SERVICE_CLEANING,
    id: 'sny-3',
    title: 'Professional House Painter & Waterproofing',
    serviceType: 'Home Painting'
  },
  'sny-4': {
    ...SAMPLE_SERVICE_CLEANING,
    id: 'sny-4',
    title: 'Custom Carpentry & Furniture Repair',
    serviceType: 'Woodwork'
  },
  'sny-5': {
    ...SAMPLE_SERVICE_CLEANING,
    id: 'sny-5',
    title: 'Deep Sanitization & Commercial Cleaning',
    serviceType: 'Deep Cleaning'
  },
  'res-srv-1': SAMPLE_SERVICE_CLEANING,
  'res-srv-2': {
    ...SAMPLE_SERVICE_CLEANING,
    id: 'res-srv-2',
    title: 'Air Conditioner Repair & Gas Refill'
  }
};

import { ProfileService } from '../services/profileService';
import { UserListingItem } from '../types/profileTypes';

function convertUserListingToDetail(item: UserListingItem): AnyListingDetail {
  if (item.module === 'jobs') {
    const jobDetail: JobListingDetail = {
      id: item.id,
      module: 'jobs',
      title: item.title,
      category: item.category,
      subcategory: item.subcategory,
      status: item.status,
      company: {
        id: `comp-${item.id}`,
        name: item.companyName || 'Employer',
        logoUrl: item.imageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
        isVerified: true,
        industry: item.category,
        employeeCount: '10-50 Employees',
        location: item.location
      },
      salary: {
        min: 80000,
        max: 180000,
        period: 'Month',
        isNegotiable: true
      },
      employmentType: 'Full Time',
      workArrangement: 'On-site',
      location: {
        province: 'Central Province',
        district: item.location,
        city: item.location.split(',')[0] || item.location,
        address: `${item.location}, Sri Lanka`
      },
      description: item.description || 'Job details and requirements submitted by employer.',
      requirementsList: [
        'Relevant qualifications and work experience',
        'Strong communication and interpersonal skills',
        'Self-motivated with ability to work in teams'
      ],
      responsibilitiesList: [
        'Execute key duties and daily operational responsibilities',
        'Maintain high performance standards and team alignment',
        'Report progress regularly to supervisor'
      ],
      benefitsList: ['Competitive Salary Package', 'EPF / ETF Coverage', 'Career Growth Opportunities'],
      applyMethods: {
        whatsapp: true,
        phone: true,
        internalApply: true
      },
      contact: {
        phone: item.contactPhone || '0771234567',
        whatsappNumber: item.whatsapp || '0771234567',
        allowInternalMessage: true
      },
      createdAt: item.createdAt || new Date().toISOString(),
      postedDateStr: item.postedDate || 'Just now'
    };
    return jobDetail;
  }

  if (item.module === 'services') {
    const numPrice = parseInt((item.price || '0').replace(/[^0-9]/g, ''), 10) || 2500;
    const srvDetail: ServiceListingDetail = {
      id: item.id,
      module: 'services',
      title: item.title,
      category: item.category,
      subcategory: item.subcategory,
      status: item.status,
      provider: {
        id: item.ownerId || 'usr-me',
        name: 'Service Provider',
        photoUrl: item.imageUrl,
        isVerified: true,
        completedJobsCount: 1,
        experience: '5+ Years'
      },
      startingPrice: {
        amount: numPrice,
        unit: item.pricePeriod || '/ Visit'
      },
      serviceType: item.category,
      location: {
        province: 'Central Province',
        district: item.location,
        city: item.location.split(',')[0] || item.location,
        address: `${item.location}, Sri Lanka`,
        area: item.location
      },
      images: [item.imageUrl].filter(Boolean) as string[],
      description: item.description || 'Professional service offered with high quality guarantee.',
      availabilityDays: 'Monday - Saturday',
      availabilityHours: '8:00 AM - 6:00 PM',
      emergencyService: true,
      responseTime: 'Within 1 Hour',
      contact: {
        phone: item.contactPhone || '0771234567',
        whatsappNumber: item.whatsapp || '0771234567',
        allowInternalMessage: true
      },
      createdAt: item.createdAt || new Date().toISOString(),
      postedDateStr: item.postedDate || 'Just now'
    };
    return srvDetail;
  }

  // Default Rental
  const rentDetail: RentalListingDetail = {
    id: item.id,
    module: 'rentals',
    title: item.title,
    category: item.category,
    subcategory: item.subcategory,
    status: item.status,
    isVerified: true,
    isFeatured: false,
    createdAt: item.createdAt || new Date().toISOString(),
    postedDateStr: item.postedDate || 'Just now',
    location: {
      province: 'Central Province',
      district: item.location,
      city: item.location.split(',')[0] || item.location,
      area: item.location,
      address: `${item.location}, Sri Lanka`
    },
    images: [item.imageUrl].filter(Boolean) as string[],
    pricing: {
      activePeriod: 'Month',
      isNegotiable: true,
      rates: [
        { unit: 'Month', price: 50000, label: item.price || 'Rs. 50,000' }
      ]
    },
    attributes: [
      { label: 'Category', value: item.category, iconName: 'Home' },
      { label: 'Status', value: item.status.toUpperCase(), iconName: 'Check' }
    ],
    features: ['Well Maintained', 'Good Location', 'Verified Listing'],
    description: item.description || 'Rental listing posted on RENTOURA.LK.',
    owner: {
      id: item.ownerId || 'usr-me',
      name: 'You (Owner)',
      isVerified: true,
      memberSince: '2024'
    },
    contact: {
      phone: item.contactPhone || '0701234567',
      whatsappNumber: item.whatsapp || '0701234567',
      allowInternalMessage: true
    }
  };
  return rentDetail;
}

/**
 * Universal Listing Detail Fetcher
 * Resolves by ID or builds a module-compliant object dynamically
 */
export function getListingDetailById(id: string, moduleHint?: 'rentals' | 'jobs' | 'services'): AnyListingDetail {
  // 1. Check user created listings in ProfileService canonical store
  const userListings = ProfileService.getUserListings();
  const userItem = userListings.find(l => l.id === id);
  if (userItem) {
    return convertUserListingToDetail(userItem);
  }

  // 2. Check static sample listings
  if (ALL_SAMPLE_LISTINGS[id]) {
    return ALL_SAMPLE_LISTINGS[id];
  }

  // Fallback generation based on module hint or ID prefix
  if (id.includes('job') || moduleHint === 'jobs') {
    return {
      ...SAMPLE_JOB_SOFTWARE_ENGINEER,
      id,
      title: id.replace(/[-_]/g, ' ').toUpperCase() || 'Job Opportunity'
    };
  }

  if (id.includes('srv') || id.includes('service') || moduleHint === 'services') {
    return {
      ...SAMPLE_SERVICE_CLEANING,
      id,
      title: id.replace(/[-_]/g, ' ').toUpperCase() || 'Professional Service'
    };
  }

  // Default to Rental
  return {
    ...SAMPLE_RENTAL_PRIUS,
    id,
    title: id.replace(/[-_]/g, ' ').toUpperCase() || 'Rental Listing'
  };
}
