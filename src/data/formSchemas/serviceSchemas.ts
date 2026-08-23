import { CategoryFormSchema } from '../../types/postFormTypes';

/**
 * 1. ELECTRICAL SERVICE SCHEMA
 */
export const SERVICE_ELECTRICAL_SCHEMA: CategoryFormSchema = {
  module: 'services',
  categoryId: 'electrical-services',
  categoryName: 'Electrical Services',
  subcategoryId: 'house-wiring-full',
  subcategoryName: 'House & Building Wiring',
  title: 'Electrical Service Specifications',
  description: 'Provide details about your electrical expertise and scope of work',
  fields: [
    {
      id: 'yearsExperience',
      label: 'Years of Experience',
      type: 'select',
      required: true,
      options: [
        { id: '1-3', label: '1 - 3 Years' },
        { id: '3-5', label: '3 - 5 Years' },
        { id: '5-10', label: '5 - 10 Years' },
        { id: '10+', label: '10+ Years (Senior Electrician)' }
      ],
      gridCols: 2
    },
    {
      id: 'workScope',
      label: 'Sector Work Scope',
      type: 'multi-select',
      required: true,
      options: [
        { id: 'residential', label: 'Residential Homes & Apartments' },
        { id: 'commercial', label: 'Commercial Offices & Shops' },
        { id: 'industrial', label: 'Industrial Factories & Plants' }
      ],
      defaultValue: ['residential', 'commercial']
    },
    {
      id: 'specializations',
      label: 'Electrical Services Provided',
      type: 'multi-select',
      required: true,
      options: [
        { id: 'new-wiring', label: 'New House Wiring & Conduit Piping' },
        { id: 'rewiring', label: 'House Re-wiring & Upgrades' },
        { id: 'fault-finding', label: 'Tripping & Short Circuit Fault Finding' },
        { id: 'switch-socket', label: 'Switch, Plug Socket & Light Installation' },
        { id: 'db-board', label: 'Distribution Board (DB / RCCB / MCB) Setup' },
        { id: '3-phase', label: '3-Phase Electrical Wiring' },
        { id: 'generator-solar', label: 'Generator & Solar Inverter Integration' },
        { id: 'earthing', label: 'Earth Pit Installation & Testing' }
      ]
    },
    {
      id: 'supplyOption',
      label: 'Material & Equipment Options',
      type: 'radio',
      required: true,
      options: [
        { id: 'both', label: 'Both Labour-Only and Material + Labour Options Available' },
        { id: 'labour-only', label: 'Labour-Only (Customer provides wires & switches)' },
        { id: 'material-included', label: 'Full Material Supplied (ACL, Kelani, Orange)' }
      ],
      defaultValue: 'both'
    },
    {
      id: 'emergencyCallout',
      label: '24/7 Emergency Tripping & Power Cut Assistance?',
      type: 'toggle',
      defaultValue: true
    },
    {
      id: 'warrantyPeriod',
      label: 'Workmanship Warranty Provided?',
      type: 'select',
      options: [
        { id: 'none', label: 'No Formal Warranty' },
        { id: '1-month', label: '1 Month Workmanship Warranty' },
        { id: '6-months', label: '6 Months Guarantee' },
        { id: '1-year', label: '1 Year Full Guarantee' },
        { id: '5-years', label: '5 Years Warranty on Full Wiring' }
      ],
      defaultValue: '6-months',
      gridCols: 2
    }
  ]
};

/**
 * 2. PLUMBING SERVICE SCHEMA
 */
export const SERVICE_PLUMBING_SCHEMA: CategoryFormSchema = {
  module: 'services',
  categoryId: 'plumbing-services',
  categoryName: 'Plumbing Services',
  subcategoryId: 'leak-detection-fix',
  subcategoryName: 'Leak Detection & Pipe Repair',
  title: 'Plumbing Service Specifications',
  description: 'Provide details about your plumbing capabilities',
  fields: [
    {
      id: 'yearsExperience',
      label: 'Years of Experience',
      type: 'select',
      required: true,
      options: [
        { id: '1-3', label: '1 - 3 Years' },
        { id: '3-5', label: '3 - 5 Years' },
        { id: '5-10', label: '5 - 10 Years' },
        { id: '10+', label: '10+ Years (Master Plumber)' }
      ],
      gridCols: 2
    },
    {
      id: 'plumbingServices',
      label: 'Plumbing Services Offered',
      type: 'multi-select',
      required: true,
      options: [
        { id: 'leak-repair', label: 'Water Leak & Burst Line Repair' },
        { id: 'bathroom-plumbing', label: 'Bathroom Fitting & Commode/Sink Install' },
        { id: 'kitchen-plumbing', label: 'Kitchen Sink & Drain Fitting' },
        { id: 'drain-blockage', label: 'Sewer Line & Drain Pipe Unblocking' },
        { id: 'water-tank', label: 'Overhead Water Tank & Sump Installation' },
        { id: 'water-pump', label: 'Pressure Pump & Water Motor Fitting' },
        { id: 'hot-water', label: 'Geyser & Solar Hot Water Piping' }
      ]
    },
    {
      id: 'supplyOption',
      label: 'Material Option',
      type: 'radio',
      options: [
        { id: 'both', label: 'Labour Only or Material Included (S-lon, National PVC)' },
        { id: 'labour-only', label: 'Labour Only' },
        { id: 'full-material', label: 'Full Piping Material Included' }
      ],
      defaultValue: 'both'
    },
    {
      id: 'emergencyAvailable',
      label: 'Emergency Pipe Burst & Overflow Support?',
      type: 'toggle',
      defaultValue: true
    }
  ]
};

/**
 * 3. AC & REFRIGERATION SERVICE SCHEMA
 */
export const SERVICE_AC_REPAIR_SCHEMA: CategoryFormSchema = {
  module: 'services',
  categoryId: 'ac-refrigeration',
  categoryName: 'AC & Refrigeration',
  subcategoryId: 'ac-maintenance-service',
  subcategoryName: 'AC Cleaning & General Service',
  title: 'Air Conditioning & Refrigeration Specs',
  description: 'Specify AC types serviced, gas refilling, and brand experience',
  fields: [
    {
      id: 'acTypesServiced',
      label: 'AC Systems Serviced',
      type: 'multi-select',
      required: true,
      options: [
        { id: 'split-ac', label: 'Split Type AC (9,000 - 24,000 BTU)' },
        { id: 'inverter-ac', label: 'Inverter Eco Split AC' },
        { id: 'cassette-ac', label: 'Ceiling Cassette AC' },
        { id: 'window-ac', label: 'Window Unit AC' },
        { id: 'standing-ac', label: 'Floor Standing / Package Unit' },
        { id: 'commercial-vrf', label: 'Commercial VRF / Chiller System' }
      ]
    },
    {
      id: 'acServicesOffered',
      label: 'Services Offered',
      type: 'multi-select',
      required: true,
      options: [
        { id: 'general-service', label: 'General Filter & Blower Wash' },
        { id: 'chemical-wash', label: 'Full Chemical Wash / Overhaul' },
        { id: 'installation', label: 'New AC Installation & Mounting' },
        { id: 'relocation', label: 'AC Dismantling & Relocation' },
        { id: 'gas-refill', label: 'Refrigerant Gas Top-Up (R32 / R410A / R22)' },
        { id: 'compressor-fix', label: 'Compressor & PCB Board Repair' }
      ]
    },
    {
      id: 'brandsSupported',
      label: 'Popular Brands Serviced',
      type: 'text',
      placeholder: 'e.g. Abans, LG, Samsung, Panasonic, Singer, Innovex, Daikin, Mitsubishi',
      gridCols: 1
    },
    {
      id: 'warrantyMonths',
      label: 'Service & Gas Warranty',
      type: 'select',
      options: [
        { id: '1-month', label: '1 Month Service Warranty' },
        { id: '3-months', label: '3 Months Service & Gas Warranty' },
        { id: '6-months', label: '6 Months Warranty' }
      ],
      defaultValue: '3-months',
      gridCols: 2
    }
  ]
};

/**
 * 4. CLEANING SERVICE SCHEMA
 */
export const SERVICE_CLEANING_SCHEMA: CategoryFormSchema = {
  module: 'services',
  categoryId: 'cleaning-services',
  categoryName: 'Cleaning Services',
  subcategoryId: 'deep-house-cleaning',
  subcategoryName: 'Deep House Cleaning',
  title: 'Cleaning Service Specifications',
  description: 'Provide team size, cleaning equipment, and service coverage',
  fields: [
    {
      id: 'cleaningTypes',
      label: 'Cleaning Types Offered',
      type: 'multi-select',
      required: true,
      options: [
        { id: 'regular', label: 'Regular Daily/Weekly Cleaning' },
        { id: 'deep-clean', label: 'Move-In / Move-Out Deep Scrubbing' },
        { id: 'post-construction', label: 'Post-Construction & Paint Scrubbing' },
        { id: 'sofa-shampoo', label: 'Sofa & Fabric Steam Shampooing' },
        { id: 'carpet-shampoo', label: 'Carpet & Rug Deep Extraction' },
        { id: 'office-janitorial', label: 'Office & Commercial Janitorial' }
      ]
    },
    {
      id: 'teamSize',
      label: 'Cleaning Crew Team Size',
      type: 'select',
      required: true,
      options: [
        { id: 'solo', label: '1 Person (Solo Cleaner)' },
        { id: 'team-2', label: '2 Cleaners Team' },
        { id: 'team-3-5', label: '3 - 5 Cleaners Crew' },
        { id: 'team-large', label: '6+ Large Industrial Team' }
      ],
      defaultValue: 'team-2',
      gridCols: 2
    },
    {
      id: 'equipmentProvided',
      label: 'Equipment & Chemicals Included',
      type: 'select',
      required: true,
      options: [
        { id: 'full-provided', label: '100% Full Equipment & Eco-Friendly Chemicals Provided' },
        { id: 'basic-provided', label: 'Cleaner brings basic tools; client supplies vacuum/water' },
        { id: 'customer-provides', label: 'Customer provides all cleaning materials' }
      ],
      defaultValue: 'full-provided',
      gridCols: 2
    },
    {
      id: 'minBookingDuration',
      label: 'Minimum Booking Time',
      type: 'select',
      options: [
        { id: '2-hours', label: '2 Hours Minimum' },
        { id: '4-hours', label: 'Half Day (4 Hours)' },
        { id: 'full-day', label: 'Full Day (8 Hours)' }
      ],
      defaultValue: '4-hours',
      gridCols: 2
    }
  ]
};

/**
 * 5. COMPUTER & LAPTOP REPAIR SCHEMA
 */
export const SERVICE_COMPUTER_REPAIR_SCHEMA: CategoryFormSchema = {
  module: 'services',
  categoryId: 'computer-mobile',
  categoryName: 'Computer & Mobile',
  subcategoryId: 'laptop-repair-serv',
  subcategoryName: 'Laptop Repair',
  title: 'Computer & Laptop Repair Specs',
  description: 'Specify hardware chip-level repairs, OS installations, and diagnostics',
  fields: [
    {
      id: 'deviceTypes',
      label: 'Devices Serviced',
      type: 'multi-select',
      required: true,
      options: [
        { id: 'windows-laptop', label: 'Windows Laptops (ASUS, HP, Dell, Lenovo, Acer)' },
        { id: 'macbook', label: 'Apple MacBook Air & MacBook Pro' },
        { id: 'desktop-pc', label: 'Desktop Workstations & Custom Gaming PCs' },
        { id: 'printers', label: 'Printers & Scanner Units' }
      ]
    },
    {
      id: 'repairServices',
      label: 'Services Offered',
      type: 'multi-select',
      required: true,
      options: [
        { id: 'chip-repair', label: 'Motherboard Chip-Level & Power IC Repair' },
        { id: 'screen-replace', label: 'Display Screen & Touch Glass Replacement' },
        { id: 'battery-replace', label: 'Battery & Charger Port Repair' },
        { id: 'os-install', label: 'Windows 11 / macOS Clean Install & Drivers' },
        { id: 'data-recovery', label: 'Hard Drive & SSD Data Recovery' },
        { id: 'virus-clean', label: 'Malware, Virus & Slow Speed Optimization' }
      ]
    },
    {
      id: 'serviceLocationMode',
      label: 'Repair Location Options',
      type: 'select',
      options: [
        { id: 'both', label: 'Doorstep Home Visit, Pickup/Drop & Shop Repair Available' },
        { id: 'shop-only', label: 'Shop / Service Center Drop-off Only' },
        { id: 'remote-support', label: 'Remote Online AnyDesk / TeamViewer Support Available' }
      ],
      defaultValue: 'both',
      gridCols: 2
    },
    {
      id: 'turnaroundTime',
      label: 'Typical Turnaround Time',
      type: 'select',
      options: [
        { id: 'same-day', label: 'Same Day (1-3 Hours for basic fixes)' },
        { id: '24-hours', label: '24 Hours' },
        { id: '2-3-days', label: '2 - 3 Working Days for Chip Repair' }
      ],
      defaultValue: 'same-day',
      gridCols: 2
    }
  ]
};

/**
 * 6. MOBILE PHONE REPAIR SCHEMA
 */
export const SERVICE_MOBILE_REPAIR_SCHEMA: CategoryFormSchema = {
  module: 'services',
  categoryId: 'computer-mobile',
  categoryName: 'Computer & Mobile',
  subcategoryId: 'mobile-phone-repair-serv',
  subcategoryName: 'Mobile Phone Repair',
  title: 'Mobile Phone Repair Specs',
  description: 'Specify phone brands, screen replacements, and repair warranty',
  fields: [
    {
      id: 'brandsServiced',
      label: 'Mobile Brands Serviced',
      type: 'multi-select',
      required: true,
      options: [
        { id: 'apple-iphone', label: 'Apple iPhone' },
        { id: 'samsung', label: 'Samsung Galaxy' },
        { id: 'xiaomi-redmi', label: 'Xiaomi / Redmi / POCO' },
        { id: 'vivo-oppo', label: 'Vivo / OPPO / RealMe' },
        { id: 'oneplus', label: 'OnePlus' },
        { id: 'huawei-honor', label: 'Huawei / Honor' }
      ]
    },
    {
      id: 'mobileServices',
      label: 'Mobile Repair Services',
      type: 'multi-select',
      required: true,
      options: [
        { id: 'display-change', label: 'Original / OLED Screen Glass Replacement' },
        { id: 'battery-change', label: 'Original Battery Replacement' },
        { id: 'charging-port', label: 'Charging Port & Mic Ribbon Fix' },
        { id: 'water-damage', label: 'Water Damage Chemical Treatment' },
        { id: 'motherboard-ic', label: 'Motherboard IC & Audio/Network Fix' },
        { id: 'back-glass', label: 'Laser Back Glass Replacement' }
      ]
    },
    {
      id: 'pickupDelivery',
      label: 'Free Doorstep Pickup & Delivery Available?',
      type: 'toggle',
      defaultValue: true
    },
    {
      id: 'screenWarranty',
      label: 'Screen / Battery Warranty',
      type: 'select',
      options: [
        { id: '1-month', label: '1 Month Touch Warranty' },
        { id: '3-months', label: '3 Months Display & Battery Warranty' },
        { id: '6-months', label: '6 Months Warranty' }
      ],
      defaultValue: '3-months',
      gridCols: 2
    }
  ]
};

/**
 * 7. PHOTOGRAPHY & VIDEOGRAPHY SCHEMA
 */
export const SERVICE_PHOTOGRAPHY_SCHEMA: CategoryFormSchema = {
  module: 'services',
  categoryId: 'photo-video-services',
  categoryName: 'Photography & Videography',
  subcategoryId: 'wedding-photography-serv',
  subcategoryName: 'Wedding Photography',
  title: 'Photography & Media Specifications',
  description: 'Specify equipment gear, coverage hours, and album deliverables',
  fields: [
    {
      id: 'shootTypes',
      label: 'Shooting Specializations',
      type: 'multi-select',
      required: true,
      options: [
        { id: 'wedding-preshoot', label: 'Weddings & Engagement Pre-shoots' },
        { id: 'events-birthday', label: 'Birthdays & Corporate Events' },
        { id: 'product-ecom', label: 'Product & E-Commerce Photos' },
        { id: 'portrait-fashion', label: 'Model Portraits & Fashion' },
        { id: 'realestate-arch', label: 'Real Estate & Architectural Shoots' }
      ]
    },
    {
      id: 'cameraGear',
      label: 'Camera Equipment Used',
      type: 'text',
      required: true,
      placeholder: 'e.g. Sony A7 IV, Canon R6, 24-70mm f/2.8 GM, Godox Strobes, DJI Drone',
      gridCols: 1
    },
    {
      id: 'deliverablesIncluded',
      label: 'Package Deliverables',
      type: 'multi-select',
      options: [
        { id: 'edited-softcopy', label: 'High-Res Color Graded Soft Copies (Google Drive / USB)' },
        { id: 'storybook-album', label: 'Luxury Flush Mount Storybook Album' },
        { id: 'drone-aerial', label: '4K Drone Aerial Photos & Video Clips' },
        { id: 'cinematic-trailer', label: '2-3 Min Cinematic Teaser Video' },
        { id: 'full-video', label: 'Full Length Edited Video' },
        { id: 'framed-photo', label: 'Large Wall Canvas / Framed Photo' }
      ]
    },
    {
      id: 'travelIslandwide',
      label: 'Available for Travel Islandwide Across Sri Lanka?',
      type: 'toggle',
      defaultValue: true
    }
  ]
};

/**
 * 8. TUTORING & EDUCATION SCHEMA
 */
export const SERVICE_TUTORING_SCHEMA: CategoryFormSchema = {
  module: 'services',
  categoryId: 'education-tutoring-serv',
  categoryName: 'Education & Tutoring',
  subcategoryId: 'maths-tuition',
  subcategoryName: 'Maths Tuition',
  title: 'Tutoring & Class Specifications',
  description: 'Specify subject, medium of instruction, grade levels, and class modes',
  fields: [
    {
      id: 'subjectsTaught',
      label: 'Subject(s) Taught',
      type: 'text',
      required: true,
      placeholder: 'e.g. Mathematics, Combined Maths, Physics, Chemistry, English, ICT',
      gridCols: 1
    },
    {
      id: 'mediumOfInstruction',
      label: 'Medium of Instruction',
      type: 'multi-select',
      required: true,
      options: [
        { id: 'english', label: 'English Medium' },
        { id: 'sinhala', label: 'Sinhala Medium' },
        { id: 'tamil', label: 'Tamil Medium' }
      ],
      defaultValue: ['english', 'sinhala']
    },
    {
      id: 'gradeLevels',
      label: 'Target Student Grade / Exam',
      type: 'multi-select',
      required: true,
      options: [
        { id: 'primary', label: 'Grade 1 - 5 (Primary)' },
        { id: 'middle', label: 'Grade 6 - 9 (Secondary)' },
        { id: 'ol', label: 'O/L (Grade 10 & 11)' },
        { id: 'al', label: 'A/L (Local / Cambridge / Edexcel)' },
        { id: 'university-adult', label: 'University / Adult Learners' }
      ]
    },
    {
      id: 'classModes',
      label: 'Class Setup Modes',
      type: 'multi-select',
      required: true,
      options: [
        { id: 'home-visit', label: 'Home Visit Individual Classes' },
        { id: 'online-zoom', label: 'Online Live Interactive Zoom Classes' },
        { id: 'group-class', label: 'Small Group Institute Classes' }
      ]
    },
    {
      id: 'tutorQualifications',
      label: 'Tutor Qualifications & Background',
      type: 'text',
      placeholder: 'e.g. B.Sc. (Hons) Engineering (Peradeniya), 8+ Years School Teaching Experience',
      gridCols: 1
    }
  ]
};

/**
 * 9. BEAUTY & PERSONAL CARE SCHEMA
 */
export const SERVICE_BEAUTY_SCHEMA: CategoryFormSchema = {
  module: 'services',
  categoryId: 'beauty-personal-care',
  categoryName: 'Beauty & Personal Care',
  subcategoryId: 'bridal-makeup-serv',
  subcategoryName: 'Bridal Dressing & Makeup',
  title: 'Beauty & Salon Specifications',
  description: 'Provide details about salon products, home visit options, and portfolios',
  fields: [
    {
      id: 'beautyServices',
      label: 'Beauty Services Offered',
      type: 'multi-select',
      required: true,
      options: [
        { id: 'bridal-dressing', label: 'Kandyan / Western / Indian Bridal Dressing' },
        { id: 'party-makeup', label: 'Party & Event HD Makeup' },
        { id: 'hair-styling', label: 'Hair Cuts, Rebonding, Keratin & Coloring' },
        { id: 'facials-cleanups', label: 'Gold / Organic Facials & Skin Cleanups' },
        { id: 'nail-art', label: 'Nail Art, Gel Extensions & Pedicure' },
        { id: 'mehendi-art', label: 'Bridal & Guest Mehendi / Henna' }
      ]
    },
    {
      id: 'homeVisitOption',
      label: 'Doorstep Home Visit / Hotel Dressing Available?',
      type: 'toggle',
      defaultValue: true
    },
    {
      id: 'brandsUsed',
      label: 'Cosmetic Brands Used',
      type: 'text',
      placeholder: 'e.g. MAC, Kryolan, Huda Beauty, L’Oréal, Estée Lauder',
      gridCols: 1
    }
  ]
};

/**
 * 10. VEHICLE SERVICE SCHEMA
 */
export const SERVICE_VEHICLE_MECHANIC_SCHEMA: CategoryFormSchema = {
  module: 'services',
  categoryId: 'vehicle-services',
  categoryName: 'Vehicle Services',
  subcategoryId: 'car-repair-serv',
  subcategoryName: 'Car Repair & Mechanical',
  title: 'Vehicle Service & Repair Specs',
  description: 'Specify vehicle types, breakdown response, and repair specializations',
  fields: [
    {
      id: 'vehicleTypesSupported',
      label: 'Vehicles Serviced',
      type: 'multi-select',
      required: true,
      options: [
        { id: 'cars', label: 'Cars (Sedan, Hatchback, SUV)' },
        { id: 'vans-buses', label: 'Vans & Passenger Coaches' },
        { id: 'motorcycles', label: 'Motorcycles & Scooters' },
        { id: 'three-wheelers', label: 'Three Wheelers (Tuk-Tuks)' },
        { id: 'lorries-trucks', label: 'Lorries & Commercial Trucks' }
      ]
    },
    {
      id: 'repairSpecialties',
      label: 'Mechanical & Repair Specialties',
      type: 'multi-select',
      required: true,
      options: [
        { id: 'engine-tuneup', label: 'Engine Tune-Up & Scan Diagnostics' },
        { id: 'brakes-suspension', label: 'Brake Pads, Rotors & Suspension Overhaul' },
        { id: 'auto-electrical', label: 'Auto Electrical, Starter Motor & Alternator' },
        { id: 'car-ac', label: 'Vehicle AC Gas Charge & Compressor Fix' },
        { id: 'hybrid-battery', label: 'Hybrid High-Voltage Battery Service' },
        { id: 'roadside-towing', label: '24/7 Mobile Mechanic & Breakdown Towing' }
      ]
    },
    {
      id: 'mobileMechanicAvailable',
      label: 'Mobile Mechanic Doorstep Visit Available?',
      type: 'toggle',
      defaultValue: true
    }
  ]
};

/**
 * 11. GENERAL SERVICE FALLBACK SCHEMA
 */
export const SERVICE_GENERAL_SCHEMA: CategoryFormSchema = {
  module: 'services',
  categoryId: 'general-service',
  categoryName: 'Services',
  subcategoryId: 'general',
  subcategoryName: 'General Service',
  title: 'Service Specifications',
  description: 'Provide details about your professional skills and service offer',
  fields: [
    {
      id: 'yearsExperience',
      label: 'Years of Experience',
      type: 'select',
      required: true,
      options: [
        { id: '1-3', label: '1 - 3 Years' },
        { id: '3-5', label: '3 - 5 Years' },
        { id: '5-10', label: '5 - 10 Years' },
        { id: '10+', label: '10+ Years Experience' }
      ],
      gridCols: 2
    },
    {
      id: 'emergencyAssistance',
      label: 'Urgent / Same-Day Booking Supported?',
      type: 'toggle',
      defaultValue: false
    }
  ]
};

/**
 * Category-aware Schema Factory for Services
 */
export function getServiceCategoryFormSchema(
  categoryId?: string,
  subcategoryId?: string,
  categoryName?: string,
  subcategoryName?: string
): CategoryFormSchema {
  const catKey = (categoryId || '').toLowerCase();
  const subKey = (subcategoryId || '').toLowerCase();
  const catName = (categoryName || '').toLowerCase();
  const subName = (subcategoryName || '').toLowerCase();

  // Electrical
  if (catKey.includes('electr') || subKey.includes('wiring') || catName.includes('electr')) {
    return SERVICE_ELECTRICAL_SCHEMA;
  }

  // Plumbing
  if (catKey.includes('plumb') || subKey.includes('leak') || catName.includes('plumb')) {
    return SERVICE_PLUMBING_SCHEMA;
  }

  // AC & Refrigeration
  if (catKey.includes('ac-refrig') || subKey.includes('ac-') || catName.includes('appliance') || subName.includes('fridge') || subName.includes('refrigerator')) {
    return SERVICE_AC_REPAIR_SCHEMA;
  }

  // Cleaning
  if (catKey.includes('clean') || subKey.includes('clean') || catName.includes('clean')) {
    return SERVICE_CLEANING_SCHEMA;
  }

  // Computer & Mobile
  if (subKey.includes('mobile') || subName.includes('phone')) {
    return SERVICE_MOBILE_REPAIR_SCHEMA;
  }
  if (catKey.includes('comp') || subKey.includes('laptop') || subKey.includes('desktop') || catName.includes('computer')) {
    return SERVICE_COMPUTER_REPAIR_SCHEMA;
  }

  // Photography
  if (catKey.includes('photo') || subKey.includes('wedding') || subKey.includes('drone') || catName.includes('photo')) {
    return SERVICE_PHOTOGRAPHY_SCHEMA;
  }

  // Tutoring
  if (catKey.includes('educat') || subKey.includes('tuition') || catName.includes('tutor') || subName.includes('tuition')) {
    return SERVICE_TUTORING_SCHEMA;
  }

  // Beauty
  if (catKey.includes('beauty') || subKey.includes('makeup') || subKey.includes('bridal') || catName.includes('beauty')) {
    return SERVICE_BEAUTY_SCHEMA;
  }

  // Vehicle Services
  if (catKey.includes('vehic') || subKey.includes('car-repair') || subKey.includes('mechanic') || catName.includes('vehic')) {
    return SERVICE_VEHICLE_MECHANIC_SCHEMA;
  }

  return SERVICE_GENERAL_SCHEMA;
}
