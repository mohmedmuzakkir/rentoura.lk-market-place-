import { MainCategoryData } from '../categorySelectorData';

export const JOBS_CATEGORIES: MainCategoryData[] = [
  // 1. Office & Administration
  {
    id: 'office-admin',
    name: 'Office & Administration',
    slug: 'office-administration',
    icon: '📂',
    description: 'Office assistants, receptionists, data entry and secretarial roles',
    aliases: ['clerk', 'data entry', 'receptionist', 'secretary', 'admin', 'office assistant', 'personal assistant'],
    subcategories: [
      { id: 'office-assistant', name: 'Office Assistant', subtitle: 'General clerical & office help', icon: '📎', aliases: ['clerk', 'office boy'] },
      { id: 'receptionist', name: 'Receptionist', subtitle: 'Front desk management & guest greeting', icon: '🛎️' },
      { id: 'data-entry-op', name: 'Data Entry Operator', subtitle: 'Typing, database entry & spreadsheet tasks', icon: '⌨️', aliases: ['data entry', 'typist'] },
      { id: 'clerk', name: 'Clerk', subtitle: 'Documentation & administrative filing', icon: '📁' },
      { id: 'secretary', name: 'Secretary', subtitle: 'Executive assistance & appointment scheduling', icon: '📝' },
      { id: 'admin-assistant', name: 'Administrative Assistant', subtitle: 'Operations support & office coordination', icon: '📋' },
      { id: 'personal-assistant', name: 'Personal Assistant (PA)', subtitle: 'Executive & direct director support', icon: '💼' },
      { id: 'document-controller', name: 'Document Controller', subtitle: 'Archiving & project document management', icon: '📑' },
      { id: 'front-office-exec', name: 'Front Office Executive', subtitle: 'Customer greeting & desk administration', icon: '🏢' }
    ]
  },

  // 2. IT & Technology
  {
    id: 'it-tech',
    name: 'IT & Technology',
    slug: 'it-technology',
    icon: '💻',
    description: 'Software engineers, web developers, mobile apps, QA & tech support',
    aliases: ['developer', 'programmer', 'software engineer', 'web developer', 'qa', 'data science', 'ai', 'cyber security', 'devops', 'it'],
    subcategories: [
      { id: 'software-dev', name: 'Software Developer', subtitle: 'Backend, systems & application programming', icon: '💻', aliases: ['programmer', 'coder', 'engineer'] },
      { id: 'web-dev', name: 'Web Developer', subtitle: 'Website & web app development', icon: '🌐', aliases: ['react', 'node', 'fullstack'] },
      { id: 'frontend-dev', name: 'Frontend Developer', subtitle: 'React, Vue, Angular UI development', icon: '🎨' },
      { id: 'backend-dev', name: 'Backend Developer', subtitle: 'Node.js, Python, Java, Go, APIs & databases', icon: '⚙️' },
      { id: 'fullstack-dev', name: 'Full Stack Developer', subtitle: 'End-to-end full stack web architecture', icon: '🚀' },
      { id: 'mobile-dev', name: 'Mobile App Developer', subtitle: 'iOS (Swift), Android (Kotlin), Flutter, React Native', icon: '📱', aliases: ['flutter', 'android', 'ios'] },
      { id: 'ui-ux-designer', name: 'UI/UX Designer', subtitle: 'Figma wireframing & user experience design', icon: '✨' },
      { id: 'qa-engineer', name: 'QA Engineer', subtitle: 'Manual & automated quality assurance testing', icon: '🐞', aliases: ['qa', 'tester', 'quality assurance'] },
      { id: 'data-analyst', name: 'Data Analyst / Scientist', subtitle: 'SQL, Python, PowerBI & machine learning', icon: '📊' },
      { id: 'devops-engineer', name: 'DevOps / Cloud Engineer', subtitle: 'AWS, GCP, Docker, Kubernetes & CI/CD', icon: '☁️' },
      { id: 'network-engineer', name: 'Network Engineer', subtitle: 'Cisco, routing, switches & firewall security', icon: '📡' },
      { id: 'cyber-security', name: 'Cyber Security Specialist', subtitle: 'Penetration testing & vulnerability assessment', icon: '🛡️' },
      { id: 'it-support', name: 'IT Support & Helpdesk', subtitle: 'Hardware troubleshooting, OS & network setup', icon: '🛠️' }
    ]
  },

  // 3. Sales & Marketing
  {
    id: 'sales-marketing',
    name: 'Sales & Marketing',
    slug: 'sales-marketing',
    icon: '📈',
    description: 'Sales executives, digital marketing, SEO, social media & brand management',
    aliases: ['sales', 'marketing', 'digital marketing', 'social media', 'seo', 'telemarketing', 'sales rep'],
    subcategories: [
      { id: 'sales-executive', name: 'Sales Executive', subtitle: 'B2B/B2C direct product & service sales', icon: '💼' },
      { id: 'sales-rep', name: 'Sales Representative', subtitle: 'Field sales, store representation & outreach', icon: '🤝' },
      { id: 'marketing-exec', name: 'Marketing Executive', subtitle: 'Campaign execution & promotional drives', icon: '📢' },
      { id: 'digital-marketing-exec', name: 'Digital Marketing Executive', subtitle: 'PPC, performance ads & campaign manager', icon: '📱' },
      { id: 'social-media-mgr', name: 'Social Media Manager', subtitle: 'Instagram, TikTok, Facebook content & community', icon: '💬' },
      { id: 'seo-specialist', name: 'SEO Specialist', subtitle: 'Organic ranking, keywords & content audit', icon: '🔍' },
      { id: 'content-creator-job', name: 'Content Creator', subtitle: 'Video reels, copywriting & digital media', icon: '🎬' },
      { id: 'brand-exec', name: 'Brand Executive', subtitle: 'Brand strategy, PR & event activations', icon: '🌟' },
      { id: 'telemarketing', name: 'Telemarketing / Cold Caller', subtitle: 'Phone sales & inbound/outbound leads', icon: '📞' }
    ]
  },

  // 4. Accounting & Finance
  {
    id: 'accounting-finance',
    name: 'Accounting & Finance',
    slug: 'accounting-finance',
    icon: '📊',
    description: 'Accountants, auditors, bookkeepers, payroll and finance managers',
    aliases: ['accountant', 'accounts assistant', 'auditor', 'bookkeeper', 'cashier', 'finance', 'payroll'],
    subcategories: [
      { id: 'accountant', name: 'Accountant', subtitle: 'Full financial accounts & tax compliance', icon: '📊', aliases: ['chartered accountant', 'cma'] },
      { id: 'accounts-assistant', name: 'Accounts Assistant', subtitle: 'Ledger entry, invoicing & bank reconciliation', icon: '🧾' },
      { id: 'auditor', name: 'Auditor', subtitle: 'Internal & external compliance auditing', icon: '🔍' },
      { id: 'finance-manager', name: 'Finance Manager / Executive', subtitle: 'Financial planning & cost budgeting', icon: '💼' },
      { id: 'bookkeeper', name: 'Bookkeeper', subtitle: 'QuickBooks, Xero & day-to-day accounts', icon: '📒' },
      { id: 'payroll-officer', name: 'Payroll Officer', subtitle: 'EPF/ETF salary processing & disbursements', icon: '💳' },
      { id: 'tax-assistant', name: 'Tax Assistant', subtitle: 'RAMIS VAT, SSCL & corporate tax filings', icon: '📑' },
      { id: 'cashier-fin', name: 'Cashier', subtitle: 'Point of sale, billing & cash handling', icon: '💵' }
    ]
  },

  // 5. Banking & Insurance
  {
    id: 'banking-insurance',
    name: 'Banking & Insurance',
    slug: 'banking-insurance',
    icon: '🏦',
    description: 'Bank officers, credit analysts, insurance agents and underwriting',
    aliases: ['bank', 'insurance', 'credit officer', 'loan officer', 'underwriter', 'leasing'],
    subcategories: [
      { id: 'bank-officer', name: 'Bank Officer / Trainee', subtitle: 'Branch operations & customer servicing', icon: '🏦' },
      { id: 'credit-officer', name: 'Credit & Recovery Officer', subtitle: 'Loan approvals & credit verification', icon: '💳' },
      { id: 'insurance-agent', name: 'Insurance Advisor / Agent', subtitle: 'Life & general insurance sales', icon: '🛡️' },
      { id: 'underwriter', name: 'Underwriter', subtitle: 'Risk assessment & policy processing', icon: '📋' }
    ]
  },

  // 6. Hospitality & Tourism
  {
    id: 'hospitality-tourism',
    name: 'Hospitality & Tourism',
    slug: 'hospitality-tourism',
    icon: '🏨',
    description: 'Hotel managers, front office, waiters, housekeepers and tour guides',
    aliases: ['hotel', 'waiter', 'chef', 'room attendant', 'tour guide', 'hospitality', 'resort'],
    subcategories: [
      { id: 'hotel-manager', name: 'Hotel Manager', subtitle: 'Resort & hotel operations leadership', icon: '🏨' },
      { id: 'hotel-receptionist', name: 'Hotel Receptionist / Front Desk', subtitle: 'Guest check-in & reservation handling', icon: '🛎️' },
      { id: 'waiter-waitress', name: 'Waiter / Waitress', subtitle: 'Restaurant table service & steward duties', icon: '🍽️', aliases: ['steward'] },
      { id: 'chef-cook', name: 'Chef / Cook', subtitle: 'Executive chef, commis & kitchen cook', icon: '👨‍🍳' },
      { id: 'kitchen-helper', name: 'Kitchen Helper', subtitle: 'Dishwashing, vegetable chopping & prep', icon: '🥣' },
      { id: 'barista-bartender', name: 'Barista / Bartender', subtitle: 'Coffee brewing & cocktail mixing', icon: '☕' },
      { id: 'housekeeping-hotel', name: 'Housekeeping / Room Attendant', subtitle: 'Room cleaning, bed making & linen care', icon: '🧹' },
      { id: 'tour-guide', name: 'Tour Guide / Travel Executive', subtitle: 'SLTDA licensed tourist guides & coordinators', icon: '🌴' }
    ]
  },

  // 7. Food & Restaurant
  {
    id: 'food-restaurant',
    name: 'Food & Restaurant',
    slug: 'food-restaurant',
    icon: '🍽️',
    description: 'Restaurant staff, bakery chefs, fast food crew and caterers',
    aliases: ['restaurant', 'bakery', 'cook', 'baker', 'fast food', 'kitchen'],
    subcategories: [
      { id: 'restaurant-cook', name: 'Restaurant Cook', subtitle: 'Sri Lankan, Chinese & Western culinary cooks', icon: '🍳' },
      { id: 'baker-pastry-chef', name: 'Baker & Pastry Chef', subtitle: 'Breads, cakes, pastries & desserts', icon: '🥐' },
      { id: 'fast-food-crew', name: 'Fast Food Crew Member', subtitle: 'Burger, fried chicken & pizza counter staff', icon: '🍔' },
      { id: 'kottu-roti-maker', name: 'Kottu / Roti Master', subtitle: 'Specialist Sri Lankan kottu & hoppers', icon: '🥘' },
      { id: 'restaurant-supervisor', name: 'Restaurant Supervisor', subtitle: 'Floor management & staff coordination', icon: '📋' }
    ]
  },

  // 8. Driving & Transport
  {
    id: 'driving-transport',
    name: 'Driving & Transport',
    slug: 'driving-transport',
    icon: '🚗',
    description: 'Car drivers, van drivers, lorry drivers, couriers and forklift operators',
    aliases: ['driver', 'rider', 'chauffeur', 'lorry driver', 'delivery driver', 'courier', 'forklift'],
    subcategories: [
      { id: 'car-driver', name: 'Car Driver', subtitle: 'Personal, corporate & VIP chauffeurs', icon: '🚗', aliases: ['chauffeur', 'driver'] },
      { id: 'van-driver', name: 'Van Driver', subtitle: 'School van, office transport & tour van', icon: '🚐' },
      { id: 'lorry-driver', name: 'Lorry Driver', subtitle: 'Heavy vehicle & light goods lorry drivers', icon: '🚛' },
      { id: 'bus-driver', name: 'Bus Driver', subtitle: 'Route bus & luxury coach drivers', icon: '🚌' },
      { id: 'delivery-rider-courier', name: 'Courier / Delivery Rider', subtitle: 'Food delivery & express package courier', icon: '🛵', aliases: ['rider', 'courier'] },
      { id: 'three-wheel-driver', name: 'Three Wheeler Driver', subtitle: 'Tuk-tuk hire & local transport', icon: '🛺' },
      { id: 'forklift-operator', name: 'Forklift Operator', subtitle: 'Warehouse container loading & pallet handling', icon: '🚜' }
    ]
  },

  // 9. Logistics & Warehouse
  {
    id: 'logistics-warehouse',
    name: 'Logistics & Warehouse',
    slug: 'logistics-warehouse',
    icon: '📦',
    description: 'Store keepers, warehouse supervisors, dispatchers and stock controllers',
    aliases: ['warehouse', 'store keeper', 'logistics', 'inventory', 'dispatch', 'supply chain'],
    subcategories: [
      { id: 'store-keeper', name: 'Store Keeper', subtitle: 'Goods receiving, issuing & bin card records', icon: '📦' },
      { id: 'warehouse-supervisor', name: 'Warehouse Supervisor', subtitle: 'Floor operations & worker management', icon: '📋' },
      { id: 'inventory-controller', name: 'Inventory / Stock Controller', subtitle: 'Audits, cycle counts & ERP updates', icon: '📊' },
      { id: 'dispatch-officer', name: 'Dispatch & Logistics Officer', subtitle: 'Route planning & transport coordination', icon: '🚚' }
    ]
  },

  // 10. Construction
  {
    id: 'construction-job',
    name: 'Construction',
    slug: 'construction',
    icon: '🏗️',
    description: 'Site supervisors, masons, carpenters, plumbers, electricians and painters',
    aliases: ['mason', 'carpenter', 'plumber', 'electrician', 'painter', 'welder', 'tile baass', 'baass'],
    subcategories: [
      { id: 'site-supervisor', name: 'Site Supervisor', subtitle: 'Civil construction execution & quality checks', icon: '👷' },
      { id: 'mason-worker', name: 'Mason', subtitle: 'Bricklaying, plastering & foundation work', icon: '🧱' },
      { id: 'carpenter-job', name: 'Carpenter', subtitle: 'Roofing, shuttering, doors & timber fittings', icon: '🪚' },
      { id: 'electrician-job', name: 'Electrician', subtitle: 'Concealed wiring, panels & single/3-phase', icon: '⚡' },
      { id: 'plumber-job', name: 'Plumber', subtitle: 'Water lines, drainage & sanitary ware fitting', icon: '🚰' },
      { id: 'painter-job', name: 'Painter', subtitle: 'Interior/exterior wall painting & putty', icon: '🎨' },
      { id: 'tile-worker', name: 'Tile Worker', subtitle: 'Floor & wall tile fixing with precision cuts', icon: '📐' },
      { id: 'welder-job', name: 'Welder', subtitle: 'Steel fabrication, gates, grills & structural welding', icon: '🔥' },
      { id: 'heavy-equipment-op', name: 'Heavy Equipment Operator', subtitle: 'Excavator (JCB), crane & road roller operators', icon: '🚜' }
    ]
  },

  // 11. Engineering
  {
    id: 'engineering-job',
    name: 'Engineering',
    slug: 'engineering',
    icon: '⚙️',
    description: 'Civil, mechanical, electrical, QA engineers and quantity surveyors',
    aliases: ['engineer', 'civil engineer', 'mechanical engineer', 'electrical engineer', 'qs', 'quantity surveyor'],
    subcategories: [
      { id: 'civil-engineer', name: 'Civil Engineer', subtitle: 'Structural design & project engineering', icon: '🏛️' },
      { id: 'mechanical-engineer', name: 'Mechanical Engineer', subtitle: 'HVAC, machinery & automotive engineering', icon: '⚙️' },
      { id: 'electrical-engineer', name: 'Electrical Engineer', subtitle: 'High voltage, power systems & control units', icon: '⚡' },
      { id: 'quantity-surveyor-job', name: 'Quantity Surveyor (QS)', subtitle: 'BOQs, estimation, takeoff & cost control', icon: '📐' },
      { id: 'site-engineer', name: 'Site Engineer', subtitle: 'Day-to-day engineering on construction sites', icon: '🏗️' }
    ]
  },

  // 12. Architecture & Design
  {
    id: 'architecture-design',
    name: 'Architecture & Design',
    slug: 'architecture-design',
    icon: '📐',
    description: 'Architects, interior designers, draftsmen, 3D visualizers and landscape designers',
    aliases: ['architect', 'interior designer', 'draftsman', 'autocad', '3d visualizer', 'revit'],
    subcategories: [
      { id: 'architect', name: 'Architect', subtitle: 'Residential & commercial architectural design', icon: '🏛️' },
      { id: 'interior-designer', name: 'Interior Designer', subtitle: 'Space planning, aesthetics & lighting design', icon: '🛋️' },
      { id: 'draftsman-cad', name: 'Draftsman / CAD Operator', subtitle: 'AutoCAD, Revit 2D/3D council drawings', icon: '📐' },
      { id: '3d-visualizer', name: '3D Visualizer', subtitle: '3ds Max, Blender, SketchUp & Lumion renders', icon: '🖥️' }
    ]
  },

  // 13. Factory & Manufacturing
  {
    id: 'factory-manufacturing',
    name: 'Factory & Manufacturing',
    slug: 'factory-manufacturing',
    icon: '🏭',
    description: 'Machine operators, assembly workers, garment workers and QA controllers',
    aliases: ['factory worker', 'machine operator', 'garment worker', 'sewing', 'juki', 'packing', 'production'],
    subcategories: [
      { id: 'production-operator', name: 'Production Operator', subtitle: 'Assembly line & general manufacturing tasks', icon: '⚙️' },
      { id: 'machine-operator-fac', name: 'Machine Operator', subtitle: 'Automated packaging, cutting & press machines', icon: '🎛️' },
      { id: 'packing-worker', name: 'Packing Worker', subtitle: 'Boxing, labeling & packaging finished goods', icon: '📦' },
      { id: 'garment-worker', name: 'Garment / Juki Operator', subtitle: 'Sewing machine operator & sample tailor', icon: '🧵' },
      { id: 'quality-controller-fac', name: 'Quality Controller (QC)', subtitle: 'Defect inspection & standard testing', icon: '🔍' },
      { id: 'production-supervisor', name: 'Production Supervisor', subtitle: 'Shift management & output targets', icon: '📋' }
    ]
  },

  // 14. Healthcare
  {
    id: 'healthcare-job',
    name: 'Healthcare',
    slug: 'healthcare',
    icon: '🩺',
    description: 'Doctors, nurses, pharmacists, caregivers, physiotherapists and lab technicians',
    aliases: ['doctor', 'nurse', 'pharmacist', 'caregiver', 'physiotherapist', 'lab technician', 'medical'],
    subcategories: [
      { id: 'doctor', name: 'Doctor / Medical Officer', subtitle: 'General physician, MBBS & clinic practice', icon: '👨‍⚕️' },
      { id: 'nurse', name: 'Nurse', subtitle: 'Hospital, clinic & private duty nursing', icon: '👩‍⚕️' },
      { id: 'pharmacist-job', name: 'Pharmacist / Pharmacy Assistant', subtitle: 'Dispensing prescriptions & inventory', icon: '💊' },
      { id: 'lab-technician', name: 'Lab Technician', subtitle: 'Blood tests, pathology & sample testing', icon: '🔬' },
      { id: 'caregiver-job', name: 'Caregiver / Home Care', subtitle: 'Elderly care & patient assistance', icon: '👵' },
      { id: 'physiotherapist-job', name: 'Physiotherapist', subtitle: 'Rehabilitation & physical recovery', icon: '🏃' },
      { id: 'dental-assistant', name: 'Dental Assistant', subtitle: 'Dental surgery support & sterilization', icon: '🦷' }
    ]
  },

  // 15. Education
  {
    id: 'education-job',
    name: 'Education',
    slug: 'education',
    icon: '📚',
    description: 'School teachers, preschool teachers, lecturers, private tutors and trainers',
    aliases: ['teacher', 'tutor', 'lecturer', 'preschool teacher', 'trainer', 'guru', 'tuition'],
    subcategories: [
      { id: 'school-teacher', name: 'Teacher', subtitle: 'Primary & secondary school educators', icon: '👩‍🏫' },
      { id: 'preschool-teacher', name: 'Preschool Teacher', subtitle: 'Early childhood education & Montessori', icon: '🧸' },
      { id: 'lecturer', name: 'Lecturer', subtitle: 'University & higher education institutes', icon: '🎓' },
      { id: 'private-tutor', name: 'Tutor', subtitle: 'O/L, A/L and syllabus home tuition', icon: '📝' },
      { id: 'english-teacher', name: 'English Teacher', subtitle: 'Spoken English, IELTS & grammar', icon: '🗣️' },
      { id: 'ict-teacher', name: 'ICT / Computer Teacher', subtitle: 'Programming & computer literacy', icon: '💻' },
      { id: 'science-maths-teacher', name: 'Science & Maths Teacher', subtitle: 'Mathematics, Physics & Chemistry', icon: '📐' }
    ]
  },

  // 16. Beauty & Fashion
  {
    id: 'beauty-fashion-job',
    name: 'Beauty & Fashion',
    slug: 'beauty-fashion',
    icon: '💇',
    description: 'Hairdressers, beauticians, barbers, makeup artists, tailors and designers',
    aliases: ['beautician', 'hairdresser', 'barber', 'makeup artist', 'tailor', 'fashion designer', 'salon'],
    subcategories: [
      { id: 'beautician-job', name: 'Beautician', subtitle: 'Facials, skin treatments & threading', icon: '💆' },
      { id: 'hairdresser-job', name: 'Hairdresser / Stylist', subtitle: 'Cutting, styling, coloring & rebonding', icon: '✂️' },
      { id: 'barber-job', name: 'Barber', subtitle: 'Men’s haircuts, shaves & beard grooming', icon: '💈' },
      { id: 'makeup-artist-job', name: 'Makeup Artist', subtitle: 'Bridal & event makeup', icon: '💄' },
      { id: 'tailor-dressmaker', name: 'Tailor / Dressmaker', subtitle: 'Custom garment stitching & alterations', icon: '👗' },
      { id: 'fashion-designer', name: 'Fashion Designer', subtitle: 'Apparel concepts & pattern making', icon: '✨' }
    ]
  },

  // 17. Security
  {
    id: 'security-job',
    name: 'Security',
    slug: 'security',
    icon: '🛡️',
    description: 'Security guards, CCTV operators, bodyguards and security officers',
    aliases: ['security guard', 'cctv operator', 'bodyguard', 'security officer', 'watchman'],
    subcategories: [
      { id: 'security-guard', name: 'Security Guard', subtitle: 'Gate control, premises watch & day/night shifts', icon: '👮' },
      { id: 'security-officer', name: 'Security Officer / Supervisor', subtitle: 'Shift commander & inspection', icon: '🎖️' },
      { id: 'cctv-operator-job', name: 'CCTV Operator', subtitle: 'Control room surveillance monitoring', icon: '🖥️' },
      { id: 'bodyguard', name: 'Bodyguard / VIP Escort', subtitle: 'Personal close protection officers', icon: '🕶️' }
    ]
  },

  // 18. Cleaning & Maintenance
  {
    id: 'cleaning-maint-job',
    name: 'Cleaning & Maintenance',
    slug: 'cleaning-maintenance',
    icon: '🧹',
    description: 'Janitors, housekeepers, office cleaners, gardeners and handy workers',
    aliases: ['cleaner', 'housekeeper', 'janitor', 'gardener', 'cleaning lady'],
    subcategories: [
      { id: 'cleaner', name: 'Cleaner / Janitor', subtitle: 'Office & commercial premises cleaning', icon: '🧹' },
      { id: 'housekeeper-domestic', name: 'Housekeeper', subtitle: 'Domestic home cooking & cleaning', icon: '🏠' },
      { id: 'gardener-job', name: 'Gardener', subtitle: 'Lawn mowing, tree trimming & plant care', icon: '🌱' },
      { id: 'maintenance-worker', name: 'Maintenance Worker', subtitle: 'General handyman repairs & upkeep', icon: '🛠️' }
    ]
  },

  // 19. Agriculture
  {
    id: 'agriculture-job',
    name: 'Agriculture',
    slug: 'agriculture',
    icon: '🌾',
    description: 'Farm workers, estate supervisors, tea pluckers and greenhouse staff',
    aliases: ['farm worker', 'estate', 'agriculture', 'plantation', 'tea plucker', 'dairy'],
    subcategories: [
      { id: 'farm-worker', name: 'Farm Worker', subtitle: 'Cultivation, harvesting & field labour', icon: '🌾' },
      { id: 'estate-supervisor', name: 'Estate Supervisor / Field Officer', subtitle: 'Plantation & tea/coconut estate oversight', icon: '📋' },
      { id: 'dairy-poultry-worker', name: 'Dairy & Poultry Worker', subtitle: 'Animal feeding, egg collection & milking', icon: '🐄' }
    ]
  },

  // 20. Retail
  {
    id: 'retail-job',
    name: 'Retail',
    slug: 'retail',
    icon: '🛍️',
    description: 'Shop assistants, retail cashiers, visual merchandisers and store managers',
    aliases: ['shop assistant', 'retail cashier', 'sales girl', 'sales boy', 'supermarket assistant'],
    subcategories: [
      { id: 'shop-assistant', name: 'Shop Assistant', subtitle: 'Customer greeting, shelving & item packing', icon: '🛍️' },
      { id: 'retail-cashier', name: 'Retail Cashier', subtitle: 'Supermarket billing & barcode scanning', icon: '💳' },
      { id: 'store-manager-ret', name: 'Store Manager', subtitle: 'Retail outlet management & sales targets', icon: '🏬' },
      { id: 'merchandiser', name: 'Merchandiser', subtitle: 'Shelf display & stock replenishment', icon: '📦' }
    ]
  },

  // 21. Customer Service
  {
    id: 'customer-service',
    name: 'Customer Service',
    slug: 'customer-service',
    icon: '🎧',
    description: 'Call center agents, customer support executives and helpdesk reps',
    aliases: ['call center', 'customer care', 'bpo', 'telecaller', 'customer support'],
    subcategories: [
      { id: 'call-center-agent', name: 'Call Center Agent', subtitle: 'Inbound & outbound voice customer support', icon: '🎧' },
      { id: 'customer-care-exec', name: 'Customer Care Executive', subtitle: 'Resolving complaints & email tickets', icon: '💬' },
      { id: 'live-chat-agent', name: 'Live Chat Agent', subtitle: 'Web chat & WhatsApp support specialist', icon: '📱' }
    ]
  },

  // 22. Human Resources
  {
    id: 'human-resources',
    name: 'Human Resources',
    slug: 'human-resources',
    icon: '👥',
    description: 'HR managers, recruitment executives, talent scouts and training officers',
    aliases: ['hr', 'recruitment', 'talent acquisition', 'human resources', 'hr executive'],
    subcategories: [
      { id: 'hr-executive', name: 'HR Executive', subtitle: 'Employee records, attendance & onboarding', icon: '📋' },
      { id: 'recruiter', name: 'Recruiter / Talent Acquisition', subtitle: 'Sourcing, screening & interviewing candidates', icon: '🔍' },
      { id: 'hr-manager', name: 'HR Manager', subtitle: 'Labour law, company policy & performance', icon: '💼' }
    ]
  },

  // 23. Legal
  {
    id: 'legal-job',
    name: 'Legal',
    slug: 'legal',
    icon: '⚖️',
    description: 'Lawyers, legal apprentices, compliance officers and legal secretaries',
    aliases: ['lawyer', 'attorney', 'legal officer', 'notary', 'paralegal'],
    subcategories: [
      { id: 'lawyer-job', name: 'Lawyer / Attorney-at-Law', subtitle: 'Corporate & litigation legal counsel', icon: '⚖️' },
      { id: 'legal-officer', name: 'Legal Officer', subtitle: 'Contract drafting, vetting & compliance', icon: '📑' },
      { id: 'legal-assistant', name: 'Legal Assistant / Secretary', subtitle: 'Filing, court documents & case research', icon: '📁' }
    ]
  },

  // 24. Media & Creative
  {
    id: 'media-creative-job',
    name: 'Media & Creative',
    slug: 'media-creative',
    icon: '🎬',
    description: 'Photographers, videographers, video editors, graphic designers and animators',
    aliases: ['photographer', 'videographer', 'video editor', 'graphic designer', 'animator', 'copywriter', 'voice artist'],
    subcategories: [
      { id: 'photographer-job', name: 'Photographer', subtitle: 'Studio, fashion, product & event photography', icon: '📷' },
      { id: 'videographer-job', name: 'Videographer', subtitle: 'Camera operator, commercial & docu shoots', icon: '🎥' },
      { id: 'video-editor-job', name: 'Video Editor', subtitle: 'Premiere Pro, After Effects, DaVinci editing', icon: '✂️' },
      { id: 'graphic-designer-job', name: 'Graphic Designer', subtitle: 'Photoshop, Illustrator, social posts & logos', icon: '🎨' },
      { id: 'animator-job', name: 'Animator', subtitle: '2D/3D character animation & motion graphics', icon: '✨' },
      { id: 'voice-artist-job', name: 'Voice Artist / Presenter', subtitle: 'Commercial dubbing & TV/radio presenting', icon: '🎙️' }
    ]
  },

  // 25. Digital & Online Work
  {
    id: 'digital-online-work',
    name: 'Digital & Online Work',
    slug: 'digital-online-work',
    icon: '🌐',
    description: 'E-commerce managers, virtual assistants, online researchers and mod teams',
    aliases: ['ecommerce', 'virtual assistant', 'online work', 'remote', 'moderator'],
    subcategories: [
      { id: 'ecommerce-manager', name: 'E-Commerce Manager', subtitle: 'Daraz, Shopify & WooCommerce operations', icon: '🛒' },
      { id: 'online-community-mod', name: 'Community Moderator', subtitle: 'Forum, Discord & Facebook group moderation', icon: '🛡️' },
      { id: 'virtual-assistant-job', name: 'Virtual Assistant', subtitle: 'Email management, research & calendar handling', icon: '💻' }
    ]
  },

  // 26. Freelance & Remote
  {
    id: 'freelance-remote',
    name: 'Freelance & Remote',
    slug: 'freelance-remote',
    icon: '🏠',
    description: 'Remote developers, freelance writers, translators and global contract roles',
    aliases: ['remote work', 'freelancer', 'work from home', 'wfh', 'translator', 'content writer'],
    subcategories: [
      { id: 'freelance-dev', name: 'Freelance Developer', subtitle: 'Remote contract programming jobs', icon: '💻' },
      { id: 'content-writer-rem', name: 'Content Writer / Copywriter', subtitle: 'Articles, blogs, SEO copywriting', icon: '✍️' },
      { id: 'translator-job', name: 'Translator', subtitle: 'Sinhala, Tamil, English translations', icon: '🗣️' },
      { id: 'remote-customer-support', name: 'Remote Customer Support', subtitle: 'Global timezone chat & email tickets', icon: '🎧' }
    ]
  },

  // 27. Business Development
  {
    id: 'business-dev',
    name: 'Business Development',
    slug: 'business-development',
    icon: '🤝',
    description: 'BD executives, partnership leads and enterprise sales coordinators',
    aliases: ['bde', 'business development', 'partnerships', 'lead generation'],
    subcategories: [
      { id: 'bde-job', name: 'Business Development Executive', subtitle: 'B2B outreach & corporate partnership deals', icon: '💼' },
      { id: 'key-account-mgr', name: 'Key Account Manager', subtitle: 'Client relationship retention & expansion', icon: '🌟' }
    ]
  },

  // 28. Management
  {
    id: 'management-job',
    name: 'Management',
    slug: 'management',
    icon: '👔',
    description: 'General managers, operations directors, branch heads and project leads',
    aliases: ['manager', 'general manager', 'operations manager', 'director', 'branch manager'],
    subcategories: [
      { id: 'general-manager', name: 'General Manager (GM)', subtitle: 'Company-wide business strategy & profitability', icon: '👔' },
      { id: 'operations-manager', name: 'Operations Manager', subtitle: 'Process efficiency, team leadership & SLA', icon: '⚙️' },
      { id: 'branch-manager', name: 'Branch Manager', subtitle: 'Regional branch staff & revenue management', icon: '🏢' },
      { id: 'project-manager', name: 'Project Manager', subtitle: 'Timeline, sprint planning & milestone delivery', icon: '📊' }
    ]
  },

  // 29. Government / Public Sector
  {
    id: 'govt-public-sector',
    name: 'Government / Public Sector',
    slug: 'government-public-sector',
    icon: '🏛️',
    description: 'Public sector vacancies, state corporation roles and municipal openings',
    aliases: ['government', 'rajaye rassa', 'public sector', 'ministry', 'state'],
    subcategories: [
      { id: 'govt-clerical', name: 'State Clerical & Admin', subtitle: 'Ministry & department administration', icon: '🏛️' },
      { id: 'public-service-exec', name: 'Public Service Executive', subtitle: 'Officers in state statutory bodies', icon: '📋' }
    ]
  },

  // 30. Other Jobs
  {
    id: 'other-jobs',
    name: 'Other Jobs',
    slug: 'other-jobs',
    icon: '💼',
    description: 'Miscellaneous job roles and specialized professions',
    aliases: ['other job', 'general vacancies', 'part time', 'temp'],
    subcategories: [
      { id: 'general-vacancies', name: 'General Vacancies', subtitle: 'Other job roles not listed above', icon: '💼' }
    ]
  }
];

export const JOBS_POPULAR_SEARCHES = [
  { label: 'Software Developer', icon: '💻', mainCatId: 'it-tech', subCatId: 'software-dev' },
  { label: 'Driver', icon: '🚗', mainCatId: 'driving-transport', subCatId: 'car-driver' },
  { label: 'Office Assistant', icon: '📂', mainCatId: 'office-admin', subCatId: 'office-assistant' },
  { label: 'Accountant', icon: '📊', mainCatId: 'accounting-finance', subCatId: 'accountant' },
  { label: 'Graphic Designer', icon: '🎨', mainCatId: 'media-creative-job', subCatId: 'graphic-designer-job' }
];
