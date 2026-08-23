import { MainCategoryData } from '../categorySelectorData';

export const SERVICES_CATEGORIES: MainCategoryData[] = [
  // 1. Home Services
  {
    id: 'home-services',
    name: 'Home Services',
    slug: 'home-services',
    icon: '🏠',
    description: 'Plumbing, electrical, carpentry, painting, gardening, pest control & handyman',
    aliases: ['handyman', 'carpenter', 'painter', 'mason', 'gardening', 'pest control', 'cctv', 'solar', 'water tank', 'house repair'],
    subcategories: [
      { id: 'plumbing-home', name: 'Plumbing', subtitle: 'Pipe leaks, taps, pumps & drainage fixes', icon: '🚰', aliases: ['plumber', 'pipe', 'tap', 'water leak'] },
      { id: 'electrical-home', name: 'Electrical', subtitle: 'House wiring, switches, trips & lighting', icon: '⚡', aliases: ['electrician', 'wiring', 'tripping', 'short circuit'] },
      { id: 'carpentry-home', name: 'Carpentry', subtitle: 'Door fitting, lock repairs & timber woodwork', icon: '🪚', aliases: ['carpenter', 'wood work', 'door repair', 'lock'] },
      { id: 'painting-home', name: 'Painting', subtitle: 'Wall painting, weather-shield & interior putty', icon: '🎨', aliases: ['painter', 'wall paint', 'varnish'] },
      { id: 'masonry-home', name: 'Masonry', subtitle: 'Plastering, brickwork, floor leveling & repairs', icon: '🧱', aliases: ['mason', 'plastering', 'brick'] },
      { id: 'tile-work-home', name: 'Tile Work', subtitle: 'Tile laying, re-grouting & bathroom tiling', icon: '📐', aliases: ['tiling', 'tile baass'] },
      { id: 'roofing-home', name: 'Roofing', subtitle: 'Roof leak sealing, gutters & ceiling repairs', icon: '🏠', aliases: ['roof leak', 'asbestos', 'roof repair'] },
      { id: 'gardening-home', name: 'Gardening & Landscaping', subtitle: 'Lawn mowing, tree trimming & garden design', icon: '🌱', aliases: ['gardener', 'lawn mowing', 'tree cutting'] },
      { id: 'pest-control-home', name: 'Pest Control', subtitle: 'Termite (weyo), bedbug & rodent eradication', icon: '🐜', aliases: ['termites', 'weyo', 'cockroach', 'pest'] },
      { id: 'handyman-home', name: 'Handyman', subtitle: 'Quick domestic fixes, drilling & wall mounting', icon: '🛠️', aliases: ['handyman', 'drilling', 'curtain rod'] },
      { id: 'furniture-repair-home', name: 'Furniture Repair', subtitle: 'Couch reupholstering, polish & cane repair', icon: '🛋️', aliases: ['sofa repair', 'cushion work', 'polish'] },
      { id: 'cctv-install-home', name: 'CCTV Installation', subtitle: 'Home camera security setup & mobile view', icon: '📹', aliases: ['cctv', 'security camera'] },
      { id: 'solar-install-home', name: 'Solar Installation', subtitle: 'Rooftop on-grid/off-grid solar systems', icon: '☀️', aliases: ['solar power', 'solar panel', 'inverter'] },
      { id: 'water-tank-cleaning', name: 'Water Tank Cleaning', subtitle: 'Overhead & underground sump tank sanitation', icon: '💧', aliases: ['tank clean', 'water tank'] }
    ]
  },

  // 2. Home Appliance Repair
  {
    id: 'appliance-repair',
    name: 'Home Appliance Repair',
    slug: 'home-appliance-repair',
    icon: '🧊',
    description: 'Fridges, washing machines, microwaves, TVs, ovens & small appliance repair',
    aliases: ['fridge repair', 'washing machine repair', 'microwave repair', 'tv repair', 'gas cooker repair', 'ac repair', 'refrigerator'],
    subcategories: [
      { id: 'refrigerator-repair', name: 'Refrigerator Repair', subtitle: 'Gas recharging, cooling issues & thermostats', icon: '🧊', aliases: ['fridge repair', 'freezer repair', 'gas filling'] },
      { id: 'washing-machine-repair', name: 'Washing Machine Repair', subtitle: 'Motor, PCB board, drum & water drainage fix', icon: '🧺', aliases: ['washer repair', 'spin fix'] },
      { id: 'ac-repair-sub', name: 'AC Repair & Service', subtitle: 'Filter cleaning, gas filling & compressor fixes', icon: '❄️', aliases: ['ac service', 'aircon service', 'ac repair'] },
      { id: 'tv-repair', name: 'TV Repair', subtitle: 'LED/LCD display backlight, motherboard & sound', icon: '📺', aliases: ['television repair', 'led repair', 'screen fix'] },
      { id: 'microwave-repair', name: 'Microwave Repair', subtitle: 'Heating magnetron, turntable & electrical fixes', icon: '🍲', aliases: ['microwave fix', 'oven repair'] },
      { id: 'cooker-stove-repair', name: 'Cooker / Stove Repair', subtitle: 'Gas leakage, burner clogging & induction repair', icon: '🍳', aliases: ['gas cooker', 'burner fix'] },
      { id: 'water-heater-repair', name: 'Water Heater Repair', subtitle: 'Geyser element replacement & thermostat repair', icon: '🚿', aliases: ['geyser repair', 'hot water'] },
      { id: 'small-appliance-repair', name: 'Small Appliance Repair', subtitle: 'Blenders, irons, rice cookers & vacuum cleaners', icon: '🔌', aliases: ['blender repair', 'iron repair', 'rice cooker repair'] }
    ]
  },

  // 3. Electrical Services
  {
    id: 'electrical-services',
    name: 'Electrical Services',
    slug: 'electrical-services',
    icon: '⚡',
    description: 'House wiring, 3-phase upgrades, generator servicing & panel boards',
    aliases: ['electrician', 'wiring', 'panel board', '3 phase', 'generator repair', 'earth wire'],
    subcategories: [
      { id: 'house-wiring-full', name: 'House & Building Wiring', subtitle: 'New wiring, renovations & conduit work', icon: '⚡' },
      { id: 'panel-breaker-service', name: 'Breaker & Panel Board Fix', subtitle: 'RCCB trips, main switches & distribution boards', icon: '🎛️' },
      { id: 'generator-service', name: 'Generator Repair & Service', subtitle: 'Standby diesel & petrol generator maintenance', icon: '⚙️' },
      { id: 'lighting-fan-install', name: 'Lighting & Fan Installation', subtitle: 'Chandeliers, downlights & ceiling fans', icon: '💡' }
    ]
  },

  // 4. Plumbing Services
  {
    id: 'plumbing-services',
    name: 'Plumbing Services',
    slug: 'plumbing-services',
    icon: '🚰',
    description: 'Leak detection, bathroom fittings, motor pumps and gully clearance',
    aliases: ['plumber', 'gully service', 'water pump repair', 'bathroom fitting', 'drain blockage'],
    subcategories: [
      { id: 'leak-detection-fix', name: 'Leak Detection & Pipe Repair', subtitle: 'Concealed pipe leaks & burst line repair', icon: '💧' },
      { id: 'sanitary-fitting', name: 'Bathroom & Sanitary Fitting', subtitle: 'Commodes, sinks, showers & mixer taps', icon: '🚿' },
      { id: 'water-pump-service', name: 'Water Pump Repair & Fitting', subtitle: 'Pressure pumps, auto switches & motors', icon: '⚙️' },
      { id: 'drain-gully-cleaning', name: 'Drain & Gully Unblocking', subtitle: 'Sewerage line unblocking & gully service', icon: '🕳️' }
    ]
  },

  // 5. AC & Refrigeration
  {
    id: 'ac-refrigeration',
    name: 'AC & Refrigeration',
    slug: 'ac-refrigeration',
    icon: '❄️',
    description: 'Air conditioning cleaning, installation, gas charging & cold room service',
    aliases: ['ac repair', 'air conditioner', 'ac service', 'cold room', 'refrigeration', 'ac gas'],
    subcategories: [
      { id: 'ac-maintenance-service', name: 'AC Cleaning & General Service', subtitle: 'Chemical wash, blower cleaning & efficiency tune', icon: '❄️', aliases: ['ac service', 'chemical wash'] },
      { id: 'ac-installation-move', name: 'AC Installation & Relocation', subtitle: 'New AC mounting & shifting between rooms', icon: '🛠️' },
      { id: 'ac-gas-charge', name: 'AC Gas Charging', subtitle: 'R32, R410A refrigerant top-up & leak testing', icon: '💨' },
      { id: 'commercial-cold-room', name: 'Commercial Cold Room Service', subtitle: 'Walk-in chillers, supermarket freezers', icon: '🏢' }
    ]
  },

  // 6. Cleaning Services
  {
    id: 'cleaning-services',
    name: 'Cleaning Services',
    slug: 'cleaning-services',
    icon: '🧹',
    description: 'Deep house cleaning, sofa shampooing, water tank & commercial janitorial',
    aliases: ['cleaner', 'sofa cleaning', 'deep cleaning', 'carpet wash', 'janitorial', 'window clean'],
    subcategories: [
      { id: 'deep-house-cleaning', name: 'Deep House Cleaning', subtitle: 'Move-in/move-out full home scrubbing & disinfection', icon: '🏠', aliases: ['house cleaning'] },
      { id: 'sofa-carpet-shampoo', name: 'Sofa & Carpet Shampooing', subtitle: 'Fabric/leather steam cleaning & stain extraction', icon: '🛋️', aliases: ['sofa wash', 'carpet clean'] },
      { id: 'commercial-janitorial', name: 'Commercial & Office Cleaning', subtitle: 'Daily/weekly office janitorial maintenance', icon: '🏢' },
      { id: 'window-glass-cleaning', name: 'Glass & Facade Cleaning', subtitle: 'High-rise windows & exterior facade washing', icon: '🪟' }
    ]
  },

  // 7. Vehicle Services
  {
    id: 'vehicle-services',
    name: 'Vehicle Services',
    slug: 'vehicle-services',
    icon: '🚗',
    description: 'Car repair, mobile mechanic, AC repair, detailing, wash & towing breakdown',
    aliases: ['mechanic', 'car repair', 'car wash', 'auto electrical', 'towing', 'breakdown', 'tyre service', 'battery jump'],
    subcategories: [
      { id: 'car-repair-serv', name: 'Car Repair & Mechanical', subtitle: 'Engine tune-up, brake service & suspension', icon: '🚗', aliases: ['mechanic', 'engine tune up', 'brakes'] },
      { id: 'motorcycle-repair-serv', name: 'Motorcycle & Scooter Repair', subtitle: 'Bike tuning, engine overhaul & oil changes', icon: '🏍️', aliases: ['bike mechanic'] },
      { id: 'three-wheel-repair-serv', name: 'Three Wheeler Repair', subtitle: 'Tuk-tuk tuning, 2-stroke/4-stroke servicing', icon: '🛺' },
      { id: 'auto-electrical-serv', name: 'Auto Electrical & Battery', subtitle: 'Starter motors, alternators & battery jumping', icon: '⚡', aliases: ['battery service', 'starter motor'] },
      { id: 'vehicle-ac-serv', name: 'Vehicle AC Repair', subtitle: 'Car AC gas charging, condenser & compressor fix', icon: '❄️', aliases: ['car ac'] },
      { id: 'car-wash-detailing', name: 'Car Wash & Detailing', subtitle: 'Ceramic coating, cut & polish, interior shampoo', icon: '✨', aliases: ['car detailing', 'cut and polish'] },
      { id: 'towing-roadside', name: 'Towing & Roadside Breakdown', subtitle: '24/7 flatbed recovery & breakdown assistance', icon: '🛻', aliases: ['towing', 'breakdown service'] },
      { id: 'tyre-wheel-service', name: 'Tyre & Wheel Alignment', subtitle: 'Puncture repair, wheel balancing & tyre replacement', icon: '🛞' }
    ]
  },

  // 8. Computer & Mobile
  {
    id: 'computer-mobile',
    name: 'Computer & Mobile',
    slug: 'computer-mobile',
    icon: '💻',
    description: 'Laptop repair, mobile screen replacement, data recovery & software setup',
    aliases: ['laptop repair', 'phone repair', 'mobile repair', 'screen replacement', 'data recovery', 'computer repair', 'windows install'],
    subcategories: [
      { id: 'laptop-repair-serv', name: 'Laptop Repair', subtitle: 'Motherboard chip-level fix, display & hinges', icon: '💻', aliases: ['laptop fix', 'macbook repair'] },
      { id: 'desktop-repair-serv', name: 'Desktop PC Repair', subtitle: 'Hardware upgrades, power supply & custom builds', icon: '🖥️' },
      { id: 'mobile-phone-repair-serv', name: 'Mobile Phone Repair', subtitle: 'Display screen, battery & charging port replacement', icon: '📱', aliases: ['phone repair', 'iphone repair', 'samsung repair'] },
      { id: 'printer-repair-serv', name: 'Printer Repair & Ink Refill', subtitle: 'Head cleaning, roller jam & toner cartridge refill', icon: '🖨️' },
      { id: 'data-recovery-serv', name: 'Data Recovery', subtitle: 'Corrupted hard drives, SSDs & memory cards', icon: '💾', aliases: ['recover files', 'hard disk repair'] },
      { id: 'software-os-setup', name: 'Software & OS Installation', subtitle: 'Windows 11/10, macOS, antivirus & drivers', icon: '💿' },
      { id: 'network-cctv-setup', name: 'WiFi & Network Setup', subtitle: 'Office LAN cabling, router & mesh WiFi configuration', icon: '📡' }
    ]
  },

  // 9. Business Services
  {
    id: 'business-services',
    name: 'Business Services',
    slug: 'business-services',
    icon: '💼',
    description: 'Company registration, HR, recruitment, office support and consulting',
    aliases: ['business consulting', 'company registration', 'hr consultancy', 'recruitment', 'translation', 'secretarial'],
    subcategories: [
      { id: 'company-registration', name: 'Company Registration (PVT LTD)', subtitle: 'ROC incorporation, Form 1 & bank account support', icon: '🏛️', aliases: ['pvt ltd', 'business registration'] },
      { id: 'business-consulting', name: 'Business Consulting', subtitle: 'Strategy, market research & feasibility studies', icon: '📊' },
      { id: 'recruitment-hr-serv', name: 'Recruitment & HR Services', subtitle: 'Staff headhunting, payroll & HR management', icon: '👥' },
      { id: 'translation-serv', name: 'Translation Services', subtitle: 'Sworn & certified English/Sinhala/Tamil translation', icon: '🗣️' },
      { id: 'document-prep-serv', name: 'Document & Tender Preparation', subtitle: 'Business plans, profiles & project proposals', icon: '📑' }
    ]
  },

  // 10. Digital Services
  {
    id: 'digital-services',
    name: 'Digital Services',
    slug: 'digital-services',
    icon: '🌐',
    description: 'Web development, mobile apps, SEO, digital marketing & Google Ads',
    aliases: ['website', 'web design', 'app development', 'seo', 'social media marketing', 'digital marketing', 'google ads', 'meta ads'],
    subcategories: [
      { id: 'web-development-serv', name: 'Web Development', subtitle: 'Custom business websites & corporate web apps', icon: '🌐', aliases: ['website design', 'web developer'] },
      { id: 'ecommerce-setup-serv', name: 'E-Commerce Website Setup', subtitle: 'Shopify, WooCommerce, Payment Gateway (PayHere)', icon: '🛒', aliases: ['online shop', 'shopify'] },
      { id: 'mobile-app-dev-serv', name: 'Mobile App Development', subtitle: 'iOS & Android custom native/Flutter mobile apps', icon: '📱' },
      { id: 'seo-digital-serv', name: 'SEO (Search Engine Optimization)', subtitle: 'Rank #1 on Google search results in Sri Lanka', icon: '🔍' },
      { id: 'social-media-marketing', name: 'Social Media Management', subtitle: 'Meta ads, Instagram & TikTok organic growth', icon: '💬', aliases: ['facebook ads', 'instagram marketing'] },
      { id: 'google-meta-ads', name: 'Google & YouTube Ads', subtitle: 'Targeted pay-per-click search & display campaigns', icon: '📢' }
    ]
  },

  // 11. Creative Services
  {
    id: 'creative-services',
    name: 'Creative Services',
    slug: 'creative-services',
    icon: '🎨',
    description: 'Graphic design, logo design, video editing, branding and animation',
    aliases: ['graphic design', 'logo design', 'video editing', 'animation', 'copywriting', 'branding', 'banner design'],
    subcategories: [
      { id: 'logo-branding-serv', name: 'Logo & Brand Identity', subtitle: 'Unique vector logos, brand manuals & stationery', icon: '✨', aliases: ['logo maker', 'branding'] },
      { id: 'graphic-design-serv', name: 'Graphic Design', subtitle: 'Flyers, brochures, social posts & packaging', icon: '🎨', aliases: ['photoshop', 'flyer design'] },
      { id: 'ui-ux-design-serv', name: 'UI/UX Design', subtitle: 'Mobile app and web screen wireframes (Figma)', icon: '📱' },
      { id: 'video-editing-serv', name: 'Video Editing', subtitle: 'YouTube videos, reels, commercials & colour grading', icon: '✂️', aliases: ['video editor', 'tiktok editor'] },
      { id: 'animation-motion-serv', name: 'Animation & Motion Graphics', subtitle: '2D explainer videos, intro animations & 3D logos', icon: '🎬' },
      { id: 'content-writing-serv', name: 'Content & Copywriting', subtitle: 'Compelling website copy, blogs & sales letters', icon: '✍️' }
    ]
  },

  // 12. Photography & Videography
  {
    id: 'photo-video-services',
    name: 'Photography & Videography',
    slug: 'photography-videography',
    icon: '📷',
    description: 'Wedding photography, event shoots, product photography & drone shoots',
    aliases: ['photographer', 'videographer', 'wedding photo', 'drone shoot', 'product photoshoot', 'model shoot'],
    subcategories: [
      { id: 'wedding-photography-serv', name: 'Wedding Photography', subtitle: 'Pre-shoots, wedding albums & bridal portraiture', icon: '💒', aliases: ['wedding shoot'] },
      { id: 'event-photography-serv', name: 'Event Photography', subtitle: 'Birthdays, corporate events & convocation shoots', icon: '📸' },
      { id: 'product-photography-serv', name: 'Product & Food Photography', subtitle: 'E-commerce studio photos & restaurant menus', icon: '🛍️' },
      { id: 'wedding-videography-serv', name: 'Wedding Videography', subtitle: 'Cinematic wedding trailers & full coverage', icon: '🎥' },
      { id: 'drone-shoot-serv', name: 'Drone Photography & Video', subtitle: '4K aerial shoots for land, villas & events', icon: '🛸', aliases: ['drone video', 'aerial photo'] },
      { id: 'photo-retouching-serv', name: 'Photo Editing & Album Design', subtitle: 'Skin retouching, background removal & album printing', icon: '🖼️' }
    ]
  },

  // 13. Education & Tutoring
  {
    id: 'education-tutoring-serv',
    name: 'Education & Tutoring',
    slug: 'education-tutoring',
    icon: '📚',
    description: 'Maths, science, English, music, ICT and language private classes',
    aliases: ['tuition', 'tutor', 'maths tuition', 'science tuition', 'english class', 'ielts', 'piano lessons', 'sinhala class'],
    subcategories: [
      { id: 'maths-tuition', name: 'Maths Tuition', subtitle: 'Grade 6-11 O/L & Combined Maths A/L', icon: '📐' },
      { id: 'science-tuition', name: 'Science Tuition', subtitle: 'O/L Science, A/L Physics, Chemistry & Biology', icon: '🔬' },
      { id: 'english-ielts-tuition', name: 'English & IELTS Classes', subtitle: 'Spoken English, grammar & IELTS preparation', icon: '🗣️', aliases: ['ielts', 'spoken english'] },
      { id: 'ict-coding-tuition', name: 'ICT & Coding Classes', subtitle: 'School ICT syllabus & Python/Web programming', icon: '💻' },
      { id: 'accounting-tuition', name: 'Accounting & Commerce Tuition', subtitle: 'O/L & A/L Business studies & accounting', icon: '📊' },
      { id: 'music-instrument-classes', name: 'Music & Instrument Lessons', subtitle: 'Guitar, keyboard, violin & vocal training', icon: '🎸' },
      { id: 'language-classes', name: 'Foreign Language Classes', subtitle: 'Korean (EPS), Japanese (JLPT), French, Tamil', icon: '🌍' }
    ]
  },

  // 14. Event Services
  {
    id: 'event-services',
    name: 'Event Services',
    slug: 'event-services',
    icon: '🎉',
    description: 'Event planning, wedding coordinators, DJ, sound, catering & decoration',
    aliases: ['wedding planner', 'dj service', 'sound system', 'catering', 'event coordinator', 'florist', 'mc', 'magician'],
    subcategories: [
      { id: 'event-wedding-planning', name: 'Event & Wedding Planning', subtitle: 'Full coordination, vendor management & scheduling', icon: '📋' },
      { id: 'event-decorations-serv', name: 'Decorations & Stage Setup', subtitle: 'Theme backdrops, floral poruwa & balloon arches', icon: '💐' },
      { id: 'dj-music-service', name: 'DJ & Sound System Service', subtitle: 'Club/wedding DJs with bass lighting setups', icon: '🎧', aliases: ['dj', 'sound service'] },
      { id: 'catering-event-serv', name: 'Catering & Buffet Service', subtitle: 'Rice & curry, fried rice, BBQ & dessert buffets', icon: '🍽️' },
      { id: 'custom-cake-making', name: 'Cake Making & Pastries', subtitle: 'Wedding structures, birthday & customized fondant cakes', icon: '🎂' },
      { id: 'mc-presenter-serv', name: 'MC & Announcer', subtitle: 'Bilingual masters of ceremony (Sinhala/English/Tamil)', icon: '🎙️' }
    ]
  },

  // 15. Beauty & Personal Care
  {
    id: 'beauty-personal-care',
    name: 'Beauty & Personal Care',
    slug: 'beauty-personal-care',
    icon: '💇',
    description: 'Haircuts, bridal makeup, nail art, facials, massage & mehendi',
    aliases: ['salon', 'haircut', 'bridal makeup', 'facial', 'massage', 'mehendi', 'manicure', 'barber'],
    subcategories: [
      { id: 'haircut-styling-serv', name: 'Haircut & Styling', subtitle: 'Gents & ladies haircuts, rebonding & keratin', icon: '✂️' },
      { id: 'bridal-makeup-serv', name: 'Bridal Dressing & Makeup', subtitle: 'Kandyan, Indian & Western bridal dressing', icon: '💄', aliases: ['bridal dressing', 'makeup'] },
      { id: 'facial-skin-care', name: 'Facial & Skin Treatments', subtitle: 'Gold facials, cleanup, acne & skin brightening', icon: '💆' },
      { id: 'nail-art-manicure', name: 'Nail Art & Pedicure', subtitle: 'Gel nails, acrylic extensions & foot spa', icon: '💅' },
      { id: 'mehendi-henna-serv', name: 'Mehendi & Henna Art', subtitle: 'Intricate bridal & party henna patterns', icon: '✨' },
      { id: 'home-salon-service', name: 'Home Salon Service', subtitle: 'Doorstep beauty services for ladies', icon: '🏠' }
    ]
  },

  // 16. Health & Wellness
  {
    id: 'health-wellness-serv',
    name: 'Health & Wellness',
    slug: 'health-wellness',
    icon: '🧘',
    description: 'Personal fitness trainers, yoga, home nursing, physiotherapy & wellness',
    aliases: ['fitness trainer', 'yoga', 'home nursing', 'physiotherapy', 'caregiver', 'gym trainer'],
    subcategories: [
      { id: 'personal-trainer-serv', name: 'Personal Trainer & Fitness Coach', subtitle: 'Weight loss, muscle gain & home workouts', icon: '🏋️' },
      { id: 'yoga-instructor-serv', name: 'Yoga Instructor', subtitle: 'Hatha yoga, meditation & stress relief sessions', icon: '🧘' },
      { id: 'physiotherapy-service', name: 'Physiotherapy (Home Visits)', subtitle: 'Post-surgery recovery & musculoskeletal rehab', icon: '🏃' },
      { id: 'home-nursing-service', name: 'Home Nursing & Elder Care', subtitle: 'Qualified nurses for bedridden & elderly care', icon: '🩺', aliases: ['caregiver', 'elder care'] }
    ]
  },

  // 17. Delivery & Moving
  {
    id: 'delivery-moving-serv',
    name: 'Delivery & Moving',
    slug: 'delivery-moving',
    icon: '🚚',
    description: 'House moving, office shifting, lorry transport, courier & goods delivery',
    aliases: ['house moving', 'lorry hire', 'goods transport', 'courier', 'delivery service', 'packing service'],
    subcategories: [
      { id: 'house-moving-serv', name: 'House Moving & Shifting', subtitle: 'Packing, loading, transit & furniture reassembly', icon: '📦', aliases: ['movers', 'house shift'] },
      { id: 'office-moving-serv', name: 'Office Relocation', subtitle: 'IT equipment, files & office furniture shifting', icon: '🏢' },
      { id: 'lorry-goods-transport', name: 'Lorry & Truck Hire (with Driver)', subtitle: 'Dimo Batta, Canter & heavy lorries for hire', icon: '🚛', aliases: ['lorry hire', 'dimo batta'] },
      { id: 'courier-express-delivery', name: 'Express Courier & Parcel Delivery', subtitle: 'Same day city delivery & islandwide packages', icon: '🛵' }
    ]
  },

  // 18. Construction Services
  {
    id: 'construction-services',
    name: 'Construction Services',
    slug: 'construction-services',
    icon: '🏗️',
    description: 'House construction, renovation, roofing, aluminium & architectural plans',
    aliases: ['house construction', 'builder', 'renovation', 'aluminium work', 'ceiling work', 'contractor'],
    subcategories: [
      { id: 'full-house-construction', name: 'House Construction (Turnkey)', subtitle: 'Foundation to finish turnkey house building', icon: '🏠', aliases: ['contractor', 'builder'] },
      { id: 'home-renovation-ext', name: 'Home Renovation & Extensions', subtitle: 'Adding floors, modernizing kitchens & remodels', icon: '🔨' },
      { id: 'aluminium-fabrication', name: 'Aluminium Doors & Windows', subtitle: 'Aluminium partitions, sliding doors & windows', icon: '🪟', aliases: ['aluminium work'] },
      { id: 'ceiling-plaster-work', name: 'Ceiling Work (i-Panel / Gypsum)', subtitle: 'Modern gypsum board & PVC i-panel ceilings', icon: '🏛️' },
      { id: 'steel-welding-gate', name: 'Steel Fabrication & Gates', subtitle: 'Remote roller doors, wrought iron gates & grills', icon: '🔥', aliases: ['welding', 'roller gate'] }
    ]
  },

  // 19. Repair & Maintenance
  {
    id: 'repair-maintenance-serv',
    name: 'Repair & Maintenance',
    slug: 'repair-maintenance',
    icon: '🔧',
    description: 'General equipment repair, welding, power tool maintenance & sharpening',
    aliases: ['repair', 'tool repair', 'welding repair', 'maintenance', 'generator repair'],
    subcategories: [
      { id: 'general-equipment-repair', name: 'General Equipment Repair', subtitle: 'Pumps, motors, compressors & mechanical tools', icon: '⚙️' },
      { id: 'power-tool-repair-serv', name: 'Power Tool Repair', subtitle: 'Armatures, carbon brushes & drill servicing', icon: '🪛' }
    ]
  },

  // 20. Legal & Professional
  {
    id: 'legal-professional-serv',
    name: 'Legal & Professional',
    slug: 'legal-professional',
    icon: '⚖️',
    description: 'Lawyers, notary public, deed drafting, title search & documentation',
    aliases: ['lawyer', 'notary', 'deed', 'attorney', 'title search', 'legal consultation'],
    subcategories: [
      { id: 'notary-deed-drafting', name: 'Notary Public & Deed Drafting', subtitle: 'Land deeds, gift deeds & title verification', icon: '📑', aliases: ['notary', 'deed'] },
      { id: 'legal-consultation-serv', name: 'Legal Consultation', subtitle: 'Civil, corporate, family & property disputes', icon: '⚖️' },
      { id: 'affidavit-documentation', name: 'Affidavits & Power of Attorney', subtitle: 'Notarized affidavits & legal attestations', icon: '🖋️' }
    ]
  },

  // 21. Accounting & Finance Services
  {
    id: 'accounting-finance-serv',
    name: 'Accounting & Finance Services',
    slug: 'accounting-finance-services',
    icon: '📊',
    description: 'Tax filing (RAMIS/VAT), bookkeeping, auditing and payroll outsourcing',
    aliases: ['tax return', 'vat', 'ramis', 'bookkeeping', 'audit', 'tax consultant'],
    subcategories: [
      { id: 'tax-filing-consulting', name: 'Tax Consultation & RAMIS Filing', subtitle: 'Individual & company income tax, VAT, SSCL', icon: '📑', aliases: ['tax', 'ramis', 'vat'] },
      { id: 'bookkeeping-outsourcing', name: 'Bookkeeping & Management Accounts', subtitle: 'Monthly QuickBooks/Xero ledger maintenance', icon: '📒' },
      { id: 'financial-audit-support', name: 'Audit & Financial Reports', subtitle: 'Statutory audit preparation & financial statements', icon: '🔍' }
    ]
  },

  // 22. Real Estate Services
  {
    id: 'real-estate-services',
    name: 'Real Estate Services',
    slug: 'real-estate-services',
    icon: '🏘️',
    description: 'Property valuation, real estate brokers, property management and surveying',
    aliases: ['property broker', 'valuer', 'land surveyor', 'property management', 'broker'],
    subcategories: [
      { id: 'property-valuation-serv', name: 'Property Valuation (Chartered Valuer)', subtitle: 'Bank loan valuations & court estimates', icon: '📜', aliases: ['valuer'] },
      { id: 'land-surveying-serv', name: 'Land Surveying (Licensed Surveyor)', subtitle: 'Boundary demarcation, contour plans & sub-divisions', icon: '📐' },
      { id: 'real-estate-brokerage', name: 'Real Estate Brokerage', subtitle: 'Assistance in finding tenants & buyers', icon: '🤝' },
      { id: 'property-management-serv', name: 'Property & Rental Management', subtitle: 'Rent collection, tenant vetting & property upkeep', icon: '🔑' }
    ]
  },

  // 23. Travel & Tourism Services
  {
    id: 'travel-tourism-serv',
    name: 'Travel & Tourism Services',
    slug: 'travel-tourism',
    icon: '🌴',
    description: 'Tour packages, airport drops, visa consultation and hotel bookings',
    aliases: ['tour package', 'airport drop', 'visa', 'travel agent', 'round tour', 'safari'],
    subcategories: [
      { id: 'airport-drop-pickup', name: 'Airport Drop & Pickup', subtitle: 'Fixed-price transfers to/from BIA Katunayake', icon: '✈️', aliases: ['airport drop'] },
      { id: 'sri-lanka-tour-packages', name: 'Sri Lanka Tour Packages & Round Trips', subtitle: 'Ella, Sigiriya, Kandy, Nuwara Eliya & beach tours', icon: '🌴' },
      { id: 'visa-consultation-serv', name: 'Visa & Passport Assistance', subtitle: 'Tourist, student & work visa application help', icon: '🛂' }
    ]
  },

  // 24. Pet Services
  {
    id: 'pet-services',
    name: 'Pet Services',
    slug: 'pet-services',
    icon: '🐾',
    description: 'Dog grooming, pet sitting, boarding, veterinary visits and dog training',
    aliases: ['dog grooming', 'pet boarding', 'dog training', 'vet', 'pet sitter'],
    subcategories: [
      { id: 'pet-grooming-service', name: 'Pet Grooming (Doorstep)', subtitle: 'Bathing, fur trimming, nail clipping & tick baths', icon: '✂️', aliases: ['dog wash', 'grooming'] },
      { id: 'pet-boarding-daycare', name: 'Pet Boarding & Daycare', subtitle: 'Safe home kennel care while you travel', icon: '🐕' },
      { id: 'dog-training-service', name: 'Dog Training & Obedience', subtitle: 'Puppy obedience, guard training & potty habits', icon: '🎾' }
    ]
  },

  // 25. Security Services
  {
    id: 'security-services',
    name: 'Security Services',
    slug: 'security-services',
    icon: '🛡️',
    description: 'Security guard deployment, commercial surveillance and VIP protection',
    aliases: ['security service', 'security guards', 'surveillance', 'bodyguard'],
    subcategories: [
      { id: 'security-guard-supply', name: 'Security Guard Deployment', subtitle: 'Trained static & roving security officers', icon: '👮' },
      { id: 'vip-protection-service', name: 'VIP Protection & Bodyguards', subtitle: 'Close personal protection & event security', icon: '🕶️' }
    ]
  },

  // 26. Agriculture Services
  {
    id: 'agriculture-services',
    name: 'Agriculture Services',
    slug: 'agriculture-services',
    icon: '🌾',
    description: 'Land clearing, paddy harvesting, tractor services and tree cutting',
    aliases: ['tree cutting', 'land clearing', 'tractor service', 'paddy harvesting', 'agriculture'],
    subcategories: [
      { id: 'tree-cutting-felling', name: 'Tree Cutting & Dangerous Branch Removal', subtitle: 'Safe tree felling near houses & power lines', icon: '🪓', aliases: ['tree cutting'] },
      { id: 'land-clearing-jcb', name: 'Land Clearing & Earth Levelling', subtitle: 'JCB earthmoving, jungle clearance & grading', icon: '🚜' },
      { id: 'tractor-ploughing-service', name: 'Tractor Ploughing & Harvesting', subtitle: 'Field preparation & combine harvesting', icon: '🌾' }
    ]
  },

  // 27. Printing & Advertising
  {
    id: 'printing-advertising',
    name: 'Printing & Advertising',
    slug: 'printing-advertising',
    icon: '🖨️',
    description: 'Banner printing, business cards, t-shirt printing, signage and flyers',
    aliases: ['printing', 'banner printing', 'business cards', 'tshirt printing', 'signboard', 'flyer printing'],
    subcategories: [
      { id: 'banner-signage-printing', name: 'Flex Banners & Signboards', subtitle: 'Large format outdoor banners, lightboards & neon signs', icon: '🖼️' },
      { id: 'business-card-stationery', name: 'Business Cards & Leaflets', subtitle: 'Offset & digital color card printing', icon: '💳' },
      { id: 'tshirt-mug-printing', name: 'Custom T-Shirt & Gift Printing', subtitle: 'Screen printing, embroidery & promotional gifts', icon: '👕' }
    ]
  },

  // 28. Food & Catering
  {
    id: 'food-catering-services',
    name: 'Food & Catering',
    slug: 'food-catering',
    icon: '🍽️',
    description: 'Home cooks, daily meal tiffin delivery, event catering & barbecue service',
    aliases: ['catering', 'home cook', 'meal delivery', 'lunch packet', 'bbq service', 'cake maker'],
    subcategories: [
      { id: 'daily-meal-delivery', name: 'Daily Meal & Lunch Packet Delivery', subtitle: 'Home-cooked healthy lunch & dinner subscriptions', icon: '🍱', aliases: ['lunch packet', 'tiffin'] },
      { id: 'home-cook-event', name: 'Home Cook / Party Cooking', subtitle: 'On-site cooking for family gatherings & alms-givings', icon: '🍳' },
      { id: 'bbq-catering-service', name: 'BBQ & Live Food Stations', subtitle: 'Live barbecue grill and hopper stations', icon: '🍖' }
    ]
  },

  // 29. Cleaning & Laundry
  {
    id: 'cleaning-laundry-serv',
    name: 'Cleaning & Laundry',
    slug: 'cleaning-laundry',
    icon: '🧺',
    description: 'Dry cleaning, laundry wash & fold, iron service and shoe restoration',
    aliases: ['laundry', 'dry clean', 'ironing', 'wash and fold', 'suit dry clean'],
    subcategories: [
      { id: 'laundry-wash-iron', name: 'Laundry (Wash & Iron)', subtitle: 'Kilogram wash, tumble dry and crisp pressing', icon: '🧺' },
      { id: 'dry-cleaning-service', name: 'Dry Cleaning', subtitle: 'Suits, bridal sarees, blazers & delicate fabrics', icon: '👔', aliases: ['dry clean'] },
      { id: 'curtain-laundry-service', name: 'Curtain & Blanket Laundry', subtitle: 'Heavy curtain removal, washing & re-hanging', icon: '🪟' }
    ]
  },

  // 30. Other Services
  {
    id: 'other-services',
    name: 'Other Services',
    slug: 'other-services',
    icon: '🔧',
    description: 'Specialized and custom services not listed elsewhere',
    aliases: ['other service', 'custom work', 'general services'],
    subcategories: [
      { id: 'general-misc-services', name: 'General Professional Services', subtitle: 'Other specialist services not categorized above', icon: '🔧' }
    ]
  }
];

export const SERVICES_POPULAR_SEARCHES = [
  { label: 'AC Repair', icon: '❄️', mainCatId: 'appliance-repair', subCatId: 'ac-repair-sub' },
  { label: 'Plumbing', icon: '🚰', mainCatId: 'home-services', subCatId: 'plumbing-home' },
  { label: 'Electrician', icon: '⚡', mainCatId: 'home-services', subCatId: 'electrical-home' },
  { label: 'Cleaning', icon: '🧹', mainCatId: 'cleaning-services', subCatId: 'deep-house-cleaning' },
  { label: 'Graphic Design', icon: '🎨', mainCatId: 'creative-services', subCatId: 'graphic-design-serv' }
];
