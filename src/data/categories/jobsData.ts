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
      {
        id: 'clerical-admin',
        name: 'Clerical & Office Support',
        slug: 'clerical-office-support',
        subtitle: 'Clerical duties, data entry & front desk',
        icon: '📁',
        thirdLevelOptions: [
          { id: 'office-assistant', name: 'Office Assistant', slug: 'office-assistant', subtitle: 'General clerical & office help', icon: '📎', aliases: ['clerk', 'office boy'] },
          { id: 'clerk', name: 'Clerk', slug: 'clerk', subtitle: 'Documentation & administrative filing', icon: '📁' },
          { id: 'receptionist', name: 'Receptionist', slug: 'receptionist', subtitle: 'Front desk management & guest greeting', icon: '🛎️' },
          { id: 'data-entry-op', name: 'Data Entry Operator', slug: 'data-entry-operator', subtitle: 'Typing, database entry & spreadsheet tasks', icon: '⌨️', aliases: ['data entry', 'typist'] }
        ]
      },
      {
        id: 'executive-admin',
        name: 'Executive & Secretarial Support',
        slug: 'executive-secretarial-support',
        subtitle: 'Executive assistants, PA & document control',
        icon: '📋',
        thirdLevelOptions: [
          { id: 'secretary', name: 'Secretary', slug: 'secretary', subtitle: 'Executive assistance & appointment scheduling', icon: '📝' },
          { id: 'admin-assistant', name: 'Administrative Assistant', slug: 'administrative-assistant', subtitle: 'Operations support & office coordination', icon: '📋' },
          { id: 'personal-assistant', name: 'Personal Assistant (PA)', slug: 'personal-assistant', subtitle: 'Executive & direct director support', icon: '💼' },
          { id: 'document-controller', name: 'Document Controller', slug: 'document-controller', subtitle: 'Archiving & project document management', icon: '📑' },
          { id: 'front-office-exec', name: 'Front Office Executive', slug: 'front-office-executive', subtitle: 'Customer greeting & desk administration', icon: '🏢' }
        ]
      }
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
      {
        id: 'software-development',
        name: 'Software Development',
        slug: 'software-development',
        subtitle: 'Frontend, backend, full stack, mobile & web engineering',
        icon: '💻',
        thirdLevelOptions: [
          { id: 'software-dev', name: 'Software Developer', slug: 'software-developer', subtitle: 'Backend, systems & application programming', icon: '💻', aliases: ['programmer', 'coder', 'engineer'] },
          { id: 'frontend-dev', name: 'Frontend Developer', slug: 'frontend-developer', subtitle: 'React, Vue, Angular UI development', icon: '🎨' },
          { id: 'backend-dev', name: 'Backend Developer', slug: 'backend-developer', subtitle: 'Node.js, Python, Java, Go, APIs & databases', icon: '⚙️' },
          { id: 'fullstack-dev', name: 'Full Stack Developer', slug: 'full-stack-developer', subtitle: 'End-to-end full stack web architecture', icon: '🚀' },
          { id: 'mobile-dev', name: 'Mobile App Developer', slug: 'mobile-app-developer', subtitle: 'iOS (Swift), Android (Kotlin), Flutter, React Native', icon: '📱', aliases: ['flutter', 'android', 'ios'] },
          { id: 'web-dev', name: 'Web Developer', slug: 'web-developer', subtitle: 'Website & web app development', icon: '🌐', aliases: ['react', 'node', 'fullstack'] },
          { id: 'qa-engineer', name: 'QA Engineer', slug: 'qa-engineer', subtitle: 'Manual & automated quality assurance testing', icon: '🐞', aliases: ['qa', 'tester', 'quality assurance'] },
          { id: 'devops-engineer', name: 'DevOps / Cloud Engineer', slug: 'devops-cloud-engineer', subtitle: 'AWS, GCP, Docker, Kubernetes & CI/CD', icon: '☁️' }
        ]
      },
      {
        id: 'data-ai-infra',
        name: 'Data, AI & Infrastructure',
        slug: 'data-ai-infrastructure',
        subtitle: 'Data analytics, cyber security, networking & UI/UX',
        icon: '📊',
        thirdLevelOptions: [
          { id: 'data-analyst', name: 'Data Analyst / Scientist', slug: 'data-analyst-scientist', subtitle: 'SQL, Python, PowerBI & machine learning', icon: '📊' },
          { id: 'network-engineer', name: 'Network Engineer', slug: 'network-engineer', subtitle: 'Cisco, routing, switches & firewall security', icon: '📡' },
          { id: 'cyber-security', name: 'Cyber Security Specialist', slug: 'cyber-security-specialist', subtitle: 'Penetration testing & vulnerability assessment', icon: '🛡️' },
          { id: 'it-support', name: 'IT Support & Helpdesk', slug: 'it-support-helpdesk', subtitle: 'Hardware troubleshooting, OS & network setup', icon: '🛠️' },
          { id: 'ui-ux-designer', name: 'UI/UX Designer', slug: 'ui-ux-designer', subtitle: 'Figma wireframing & user experience design', icon: '✨' }
        ]
      }
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
      {
        id: 'field-direct-sales',
        name: 'Direct & Field Sales',
        slug: 'direct-field-sales',
        subtitle: 'B2B/B2C sales reps, telemarketing & outdoor sales',
        icon: '🤝',
        thirdLevelOptions: [
          { id: 'sales-executive', name: 'Sales Executive', slug: 'sales-executive', subtitle: 'B2B/B2C direct product & service sales', icon: '💼' },
          { id: 'sales-rep', name: 'Sales Representative', slug: 'sales-representative', subtitle: 'Field sales, store representation & outreach', icon: '🤝' },
          { id: 'telemarketing', name: 'Telemarketing / Cold Caller', slug: 'telemarketing-cold-caller', subtitle: 'Phone sales & inbound/outbound leads', icon: '📞' }
        ]
      },
      {
        id: 'digital-brand-mktg',
        name: 'Digital & Brand Marketing',
        slug: 'digital-brand-marketing',
        subtitle: 'Social media, SEO, performance marketing & content',
        icon: '📢',
        thirdLevelOptions: [
          { id: 'marketing-exec', name: 'Marketing Executive', slug: 'marketing-executive', subtitle: 'Campaign execution & promotional drives', icon: '📢' },
          { id: 'digital-marketing-exec', name: 'Digital Marketing Executive', slug: 'digital-marketing-executive', subtitle: 'PPC, performance ads & campaign manager', icon: '📱' },
          { id: 'social-media-mgr', name: 'Social Media Manager', slug: 'social-media-manager', subtitle: 'Instagram, TikTok, Facebook content & community', icon: '💬' },
          { id: 'seo-specialist', name: 'SEO Specialist', slug: 'seo-specialist', subtitle: 'Organic ranking, keywords & content audit', icon: '🔍' },
          { id: 'content-creator-job', name: 'Content Creator', slug: 'content-creator', subtitle: 'Video reels, copywriting & digital media', icon: '🎬' },
          { id: 'brand-exec', name: 'Brand Executive', slug: 'brand-executive', subtitle: 'Brand strategy, PR & event activations', icon: '🌟' }
        ]
      }
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
      {
        id: 'accounting-auditing-grp',
        name: 'Accounting & Auditing',
        slug: 'accounting-auditing',
        subtitle: 'Financial statements, ledgers, audit & bookkeeping',
        icon: '📊',
        thirdLevelOptions: [
          { id: 'accountant', name: 'Accountant', slug: 'accountant', subtitle: 'Full financial accounts & tax compliance', icon: '📊', aliases: ['chartered accountant', 'cma'] },
          { id: 'accounts-assistant', name: 'Accounts Assistant', slug: 'accounts-assistant', subtitle: 'Ledger entry, invoicing & bank reconciliation', icon: '🧾' },
          { id: 'auditor', name: 'Auditor', slug: 'auditor', subtitle: 'Internal & external compliance auditing', icon: '🔍' },
          { id: 'bookkeeper', name: 'Bookkeeper', slug: 'bookkeeper', subtitle: 'QuickBooks, Xero & day-to-day accounts', icon: '📒' }
        ]
      },
      {
        id: 'finance-tax-payroll-grp',
        name: 'Finance, Tax & Payroll',
        slug: 'finance-tax-payroll',
        subtitle: 'Financial management, RAMIS tax filings & salary processing',
        icon: '💼',
        thirdLevelOptions: [
          { id: 'finance-manager', name: 'Finance Manager / Executive', slug: 'finance-manager-executive', subtitle: 'Financial planning & cost budgeting', icon: '💼' },
          { id: 'payroll-officer', name: 'Payroll Officer', slug: 'payroll-officer', subtitle: 'EPF/ETF salary processing & disbursements', icon: '💳' },
          { id: 'tax-assistant', name: 'Tax Assistant', slug: 'tax-assistant', subtitle: 'RAMIS VAT, SSCL & corporate tax filings', icon: '📑' },
          { id: 'cashier-fin', name: 'Cashier', slug: 'cashier', subtitle: 'Point of sale, billing & cash handling', icon: '💵' }
        ]
      }
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
      {
        id: 'banking-credit-grp',
        name: 'Banking Operations & Credit',
        slug: 'banking-operations-credit',
        subtitle: 'Branch banking, credit approvals & loan recovery',
        icon: '🏦',
        thirdLevelOptions: [
          { id: 'bank-officer', name: 'Bank Officer / Trainee', slug: 'bank-officer-trainee', subtitle: 'Branch operations & customer servicing', icon: '🏦' },
          { id: 'credit-officer', name: 'Credit & Recovery Officer', slug: 'credit-recovery-officer', subtitle: 'Loan approvals & credit verification', icon: '💳' }
        ]
      },
      {
        id: 'insurance-underwriting-grp',
        name: 'Insurance & Underwriting',
        slug: 'insurance-underwriting',
        subtitle: 'Life/general insurance sales & risk assessment',
        icon: '🛡️',
        thirdLevelOptions: [
          { id: 'insurance-agent', name: 'Insurance Advisor / Agent', slug: 'insurance-advisor-agent', subtitle: 'Life & general insurance sales', icon: '🛡️' },
          { id: 'underwriter', name: 'Underwriter', slug: 'underwriter', subtitle: 'Risk assessment & policy processing', icon: '📋' }
        ]
      }
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
      {
        id: 'hotel-frontdesk-grp',
        name: 'Hotel Operations & Front Desk',
        slug: 'hotel-operations-front-desk',
        subtitle: 'Resort management, front desk & tourist guides',
        icon: '🏨',
        thirdLevelOptions: [
          { id: 'hotel-manager', name: 'Hotel Manager', slug: 'hotel-manager', subtitle: 'Resort & hotel operations leadership', icon: '🏨' },
          { id: 'hotel-receptionist', name: 'Hotel Receptionist / Front Desk', slug: 'hotel-receptionist-front-desk', subtitle: 'Guest check-in & reservation handling', icon: '🛎️' },
          { id: 'tour-guide', name: 'Tour Guide / Travel Executive', slug: 'tour-guide-travel-executive', subtitle: 'SLTDA licensed tourist guides & coordinators', icon: '🌴' }
        ]
      },
      {
        id: 'fnb-housekeeping-grp',
        name: 'F&B Service & Housekeeping',
        slug: 'fb-service-housekeeping',
        subtitle: 'Restaurant stewards, room cleaning & baristas',
        icon: '🍽️',
        thirdLevelOptions: [
          { id: 'waiter-waitress', name: 'Waiter / Waitress', slug: 'waiter-waitress', subtitle: 'Restaurant table service & steward duties', icon: '🍽️', aliases: ['steward'] },
          { id: 'chef-cook', name: 'Chef / Cook', slug: 'chef-cook', subtitle: 'Executive chef, commis & kitchen cook', icon: '👨‍🍳' },
          { id: 'kitchen-helper', name: 'Kitchen Helper', slug: 'kitchen-helper', subtitle: 'Dishwashing, vegetable chopping & prep', icon: '🥣' },
          { id: 'barista-bartender', name: 'Barista / Bartender', slug: 'barista-bartender', subtitle: 'Coffee brewing & cocktail mixing', icon: '☕' },
          { id: 'housekeeping-hotel', name: 'Housekeeping / Room Attendant', slug: 'housekeeping-room-attendant', subtitle: 'Room cleaning, bed making & linen care', icon: '🧹' }
        ]
      }
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
      {
        id: 'kitchen-culinary-grp',
        name: 'Kitchen & Culinary Staff',
        slug: 'kitchen-culinary-staff',
        subtitle: 'Cooks, bakers, pastry chefs & kottu masters',
        icon: '🍳',
        thirdLevelOptions: [
          { id: 'restaurant-cook', name: 'Restaurant Cook', slug: 'restaurant-cook', subtitle: 'Sri Lankan, Chinese & Western culinary cooks', icon: '🍳' },
          { id: 'baker-pastry-chef', name: 'Baker & Pastry Chef', slug: 'baker-pastry-chef', subtitle: 'Breads, cakes, pastries & desserts', icon: '🥐' },
          { id: 'kottu-roti-maker', name: 'Kottu / Roti Master', slug: 'kottu-roti-master', subtitle: 'Specialist Sri Lankan kottu & hoppers', icon: '🥘' }
        ]
      },
      {
        id: 'restaurant-ops-grp',
        name: 'Restaurant Crew & Supervision',
        slug: 'restaurant-crew-supervision',
        subtitle: 'Fast food counters & floor supervisors',
        icon: '🍔',
        thirdLevelOptions: [
          { id: 'fast-food-crew', name: 'Fast Food Crew Member', slug: 'fast-food-crew-member', subtitle: 'Burger, fried chicken & pizza counter staff', icon: '🍔' },
          { id: 'restaurant-supervisor', name: 'Restaurant Supervisor', slug: 'restaurant-supervisor', subtitle: 'Floor management & staff coordination', icon: '📋' }
        ]
      }
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
      {
        id: 'driver',
        name: 'Driver',
        slug: 'driver',
        subtitle: 'Personal chauffeurs, van, bus & heavy vehicle drivers',
        icon: '🚗',
        thirdLevelOptions: [
          { id: 'car-driver', name: 'Car Driver', slug: 'car-driver', subtitle: 'Personal, corporate & VIP chauffeurs', icon: '🚗', aliases: ['chauffeur', 'driver'] },
          { id: 'van-driver', name: 'Van Driver', slug: 'van-driver', subtitle: 'School van, office transport & tour van', icon: '🚐' },
          { id: 'bus-driver', name: 'Bus Driver', slug: 'bus-driver', subtitle: 'Route bus & luxury coach drivers', icon: '🚌' },
          { id: 'lorry-driver', name: 'Heavy Vehicle / Lorry Driver', slug: 'heavy-vehicle-lorry-driver', subtitle: 'Heavy vehicle & light goods lorry drivers', icon: '🚛' },
          { id: 'three-wheel-driver', name: 'Three Wheeler Driver', slug: 'three-wheeler-driver', subtitle: 'Tuk-tuk hire & local transport', icon: '🛺' }
        ]
      },
      {
        id: 'delivery-machinery-grp',
        name: 'Couriers & Equipment Operators',
        slug: 'couriers-equipment-operators',
        subtitle: 'Delivery riders, dispatch couriers & forklift drivers',
        icon: '🛵',
        thirdLevelOptions: [
          { id: 'delivery-rider-courier', name: 'Courier / Delivery Rider', slug: 'courier-delivery-rider', subtitle: 'Food delivery & express package courier', icon: '🛵', aliases: ['rider', 'courier'] },
          { id: 'forklift-operator', name: 'Forklift Operator', slug: 'forklift-operator', subtitle: 'Warehouse container loading & pallet handling', icon: '🚜' }
        ]
      }
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
      {
        id: 'warehouse-storekeeping-grp',
        name: 'Warehouse & Storekeeping',
        slug: 'warehouse-storekeeping',
        subtitle: 'Store keepers, stock audits & floor supervisors',
        icon: '📦',
        thirdLevelOptions: [
          { id: 'store-keeper', name: 'Store Keeper', slug: 'store-keeper', subtitle: 'Goods receiving, issuing & bin card records', icon: '📦' },
          { id: 'warehouse-supervisor', name: 'Warehouse Supervisor', slug: 'warehouse-supervisor', subtitle: 'Floor operations & worker management', icon: '📋' },
          { id: 'inventory-controller', name: 'Inventory / Stock Controller', slug: 'inventory-stock-controller', subtitle: 'Audits, cycle counts & ERP updates', icon: '📊' }
        ]
      },
      {
        id: 'dispatch-supplychain-grp',
        name: 'Dispatch & Supply Chain',
        slug: 'dispatch-supply-chain',
        subtitle: 'Route planning, fleet dispatch & logistics',
        icon: '🚚',
        thirdLevelOptions: [
          { id: 'dispatch-officer', name: 'Dispatch & Logistics Officer', slug: 'dispatch-logistics-officer', subtitle: 'Route planning & transport coordination', icon: '🚚' }
        ]
      }
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
      {
        id: 'construction-trades-grp',
        name: 'Skilled Construction Trades',
        slug: 'skilled-construction-trades',
        subtitle: 'Masons, carpenters, electricians, plumbers, painters & welders',
        icon: '🧱',
        thirdLevelOptions: [
          { id: 'mason-worker', name: 'Mason', slug: 'mason', subtitle: 'Bricklaying, plastering & foundation work', icon: '🧱' },
          { id: 'carpenter-job', name: 'Carpenter', slug: 'carpenter', subtitle: 'Roofing, shuttering, doors & timber fittings', icon: '🪚' },
          { id: 'electrician-job', name: 'Electrician', slug: 'electrician', subtitle: 'Concealed wiring, panels & single/3-phase', icon: '⚡' },
          { id: 'plumber-job', name: 'Plumber', slug: 'plumber', subtitle: 'Water lines, drainage & sanitary ware fitting', icon: '🚰' },
          { id: 'painter-job', name: 'Painter', slug: 'painter', subtitle: 'Interior/exterior wall painting & putty', icon: '🎨' },
          { id: 'tile-worker', name: 'Tile Worker', slug: 'tile-worker', subtitle: 'Floor & wall tile fixing with precision cuts', icon: '📐' },
          { id: 'welder-job', name: 'Welder', slug: 'welder', subtitle: 'Steel fabrication, gates, grills & structural welding', icon: '🔥' }
        ]
      },
      {
        id: 'site-machinery-grp',
        name: 'Site Supervision & Heavy Equipment',
        slug: 'site-supervision-heavy-equipment',
        subtitle: 'Site supervisors & JCB / excavator operators',
        icon: '👷',
        thirdLevelOptions: [
          { id: 'site-supervisor', name: 'Site Supervisor', slug: 'site-supervisor', subtitle: 'Civil construction execution & quality checks', icon: '👷' },
          { id: 'heavy-equipment-op', name: 'Heavy Equipment Operator', slug: 'heavy-equipment-operator', subtitle: 'Excavator (JCB), crane & road roller operators', icon: '🚜' }
        ]
      }
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
      {
        id: 'engineering-disciplines-grp',
        name: 'Engineering Disciplines',
        slug: 'engineering-disciplines',
        subtitle: 'Civil, mechanical & electrical engineers',
        icon: '🏛️',
        thirdLevelOptions: [
          { id: 'civil-engineer', name: 'Civil Engineer', slug: 'civil-engineer', subtitle: 'Structural design & project engineering', icon: '🏛️' },
          { id: 'mechanical-engineer', name: 'Mechanical Engineer', slug: 'mechanical-engineer', subtitle: 'HVAC, machinery & automotive engineering', icon: '⚙️' },
          { id: 'electrical-engineer', name: 'Electrical Engineer', slug: 'electrical-engineer', subtitle: 'High voltage, power systems & control units', icon: '⚡' }
        ]
      },
      {
        id: 'surveying-site-eng-grp',
        name: 'Surveying & Site Engineering',
        slug: 'surveying-site-engineering',
        subtitle: 'Quantity surveyors & site engineers',
        icon: '📐',
        thirdLevelOptions: [
          { id: 'quantity-surveyor-job', name: 'Quantity Surveyor (QS)', slug: 'quantity-surveyor', subtitle: 'BOQs, estimation, takeoff & cost control', icon: '📐' },
          { id: 'site-engineer', name: 'Site Engineer', slug: 'site-engineer', subtitle: 'Day-to-day engineering on construction sites', icon: '🏗️' }
        ]
      }
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
      {
        id: 'arch-interior-grp',
        name: 'Architecture & Interior Design',
        slug: 'architecture-interior-design',
        subtitle: 'Building designs & interior space planning',
        icon: '🏛️',
        thirdLevelOptions: [
          { id: 'architect', name: 'Architect', slug: 'architect', subtitle: 'Residential & commercial architectural design', icon: '🏛️' },
          { id: 'interior-designer', name: 'Interior Designer', slug: 'interior-designer', subtitle: 'Space planning, aesthetics & lighting design', icon: '🛋️' }
        ]
      },
      {
        id: 'cad-rendering-grp',
        name: 'Drafting & 3D Visualization',
        slug: 'drafting-3d-visualization',
        subtitle: 'AutoCAD draftsmen & 3D rendering artists',
        icon: '📐',
        thirdLevelOptions: [
          { id: 'draftsman-cad', name: 'Draftsman / CAD Operator', slug: 'draftsman-cad-operator', subtitle: 'AutoCAD, Revit 2D/3D council drawings', icon: '📐' },
          { id: '3d-visualizer', name: '3D Visualizer', slug: '3d-visualizer', subtitle: '3ds Max, Blender, SketchUp & Lumion renders', icon: '🖥️' }
        ]
      }
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
      {
        id: 'factory-floor-grp',
        name: 'Factory Floor Operations',
        slug: 'factory-floor-operations',
        subtitle: 'Assembly operators, packing & Juki operators',
        icon: '⚙️',
        thirdLevelOptions: [
          { id: 'production-operator', name: 'Production Operator', slug: 'production-operator', subtitle: 'Assembly line & general manufacturing tasks', icon: '⚙️' },
          { id: 'machine-operator-fac', name: 'Machine Operator', slug: 'machine-operator', subtitle: 'Automated packaging, cutting & press machines', icon: '🎛️' },
          { id: 'packing-worker', name: 'Packing Worker', slug: 'packing-worker', subtitle: 'Boxing, labeling & packaging finished goods', icon: '📦' },
          { id: 'garment-worker', name: 'Garment / Juki Operator', slug: 'garment-juki-operator', subtitle: 'Sewing machine operator & sample tailor', icon: '🧵' }
        ]
      },
      {
        id: 'quality-supervision-grp',
        name: 'Quality Control & Shift Supervision',
        slug: 'quality-control-shift-supervision',
        subtitle: 'QC inspectors & shift supervisors',
        icon: '🔍',
        thirdLevelOptions: [
          { id: 'quality-controller-fac', name: 'Quality Controller (QC)', slug: 'quality-controller-qc', subtitle: 'Defect inspection & standard testing', icon: '🔍' },
          { id: 'production-supervisor', name: 'Production Supervisor', slug: 'production-supervisor', subtitle: 'Shift management & output targets', icon: '📋' }
        ]
      }
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
      {
        id: 'medical-nursing-grp',
        name: 'Medical & Nursing Care',
        slug: 'medical-nursing-care',
        subtitle: 'Doctors, nurses, caregivers & physiotherapists',
        icon: '👨‍⚕️',
        thirdLevelOptions: [
          { id: 'doctor', name: 'Doctor / Medical Officer', slug: 'doctor-medical-officer', subtitle: 'General physician, MBBS & clinic practice', icon: '👨‍⚕️' },
          { id: 'nurse', name: 'Nurse', slug: 'nurse', subtitle: 'Hospital, clinic & private duty nursing', icon: '👩‍⚕️' },
          { id: 'caregiver-job', name: 'Caregiver / Home Care', slug: 'caregiver-home-care', subtitle: 'Elderly care & patient assistance', icon: '👵' },
          { id: 'physiotherapist-job', name: 'Physiotherapist', slug: 'physiotherapist', subtitle: 'Rehabilitation & physical recovery', icon: '🏃' }
        ]
      },
      {
        id: 'pharmacy-lab-grp',
        name: 'Pharmacy & Medical Labs',
        slug: 'pharmacy-medical-labs',
        subtitle: 'Pharmacists, lab technicians & dental assistants',
        icon: '💊',
        thirdLevelOptions: [
          { id: 'pharmacist-job', name: 'Pharmacist / Pharmacy Assistant', slug: 'pharmacist-pharmacy-assistant', subtitle: 'Dispensing prescriptions & inventory', icon: '💊' },
          { id: 'lab-technician', name: 'Lab Technician', slug: 'lab-technician', subtitle: 'Blood tests, pathology & sample testing', icon: '🔬' },
          { id: 'dental-assistant', name: 'Dental Assistant', slug: 'dental-assistant', subtitle: 'Dental surgery support & sterilization', icon: '🦷' }
        ]
      }
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
      {
        id: 'teaching-academic-grp',
        name: 'Teaching & Academic Staff',
        slug: 'teaching-academic-staff',
        subtitle: 'School teachers, preschool, university lecturers & tutors',
        icon: '👩‍🏫',
        thirdLevelOptions: [
          { id: 'preschool-teacher', name: 'Preschool Teacher', slug: 'preschool-teacher', subtitle: 'Early childhood education & Montessori', icon: '🧸' },
          { id: 'school-teacher', name: 'School Teacher', slug: 'school-teacher', subtitle: 'Primary & secondary school educators', icon: '👩‍🏫' },
          { id: 'lecturer', name: 'Lecturer', slug: 'lecturer', subtitle: 'University & higher education institutes', icon: '🎓' },
          { id: 'private-tutor', name: 'Private Tutor', slug: 'private-tutor', subtitle: 'O/L, A/L and syllabus home tuition', icon: '📝' }
        ]
      },
      {
        id: 'subject-specialists-grp',
        name: 'Language & Tech Instructors',
        slug: 'language-tech-instructors',
        subtitle: 'English, spoken IELTS & computer science teachers',
        icon: '🗣️',
        thirdLevelOptions: [
          { id: 'english-teacher', name: 'English Teacher', slug: 'english-teacher', subtitle: 'Spoken English, IELTS & grammar', icon: '🗣️' },
          { id: 'ict-teacher', name: 'ICT / Computer Teacher', slug: 'ict-computer-teacher', subtitle: 'Programming & computer literacy', icon: '💻' },
          { id: 'science-maths-teacher', name: 'Science & Maths Teacher', slug: 'science-maths-teacher', subtitle: 'Mathematics, Physics & Chemistry', icon: '📐' }
        ]
      }
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
      {
        id: 'salon-styling-grp',
        name: 'Hair & Salon Styling',
        slug: 'hair-salon-styling',
        subtitle: 'Beauticians, hairdressers, barbers & makeup artists',
        icon: '💆',
        thirdLevelOptions: [
          { id: 'beautician-job', name: 'Beautician', slug: 'beautician', subtitle: 'Facials, skin treatments & threading', icon: '💆' },
          { id: 'hairdresser-job', name: 'Hairdresser / Stylist', slug: 'hairdresser-stylist', subtitle: 'Cutting, styling, coloring & rebonding', icon: '✂️' },
          { id: 'barber-job', name: 'Barber', slug: 'barber', subtitle: 'Men’s haircuts, shaves & beard grooming', icon: '💈' },
          { id: 'makeup-artist-job', name: 'Makeup Artist', slug: 'makeup-artist', subtitle: 'Bridal & event makeup', icon: '💄' }
        ]
      },
      {
        id: 'apparel-fashion-grp',
        name: 'Apparel & Fashion Design',
        slug: 'apparel-fashion-design',
        subtitle: 'Tailors, dressmakers & fashion designers',
        icon: '👗',
        thirdLevelOptions: [
          { id: 'tailor-dressmaker', name: 'Tailor / Dressmaker', slug: 'tailor-dressmaker', subtitle: 'Custom garment stitching & alterations', icon: '👗' },
          { id: 'fashion-designer', name: 'Fashion Designer', slug: 'fashion-designer', subtitle: 'Apparel concepts & pattern making', icon: '✨' }
        ]
      }
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
      {
        id: 'guarding-field-grp',
        name: 'Field Guarding & Supervision',
        slug: 'field-guarding-supervision',
        subtitle: 'Security guards, supervisors & VIP bodyguards',
        icon: '👮',
        thirdLevelOptions: [
          { id: 'security-guard', name: 'Security Guard', slug: 'security-guard', subtitle: 'Gate control, premises watch & day/night shifts', icon: '👮' },
          { id: 'security-officer', name: 'Security Officer / Supervisor', slug: 'security-officer-supervisor', subtitle: 'Shift commander & inspection', icon: '🎖️' },
          { id: 'bodyguard', name: 'Bodyguard / VIP Escort', slug: 'bodyguard-vip-escort', subtitle: 'Personal close protection officers', icon: '🕶️' }
        ]
      },
      {
        id: 'surveillance-ops-grp',
        name: 'Surveillance & CCTV',
        slug: 'surveillance-cctv',
        subtitle: 'Control room CCTV surveillance operators',
        icon: '🖥️',
        thirdLevelOptions: [
          { id: 'cctv-operator-job', name: 'CCTV Operator', slug: 'cctv-operator', subtitle: 'Control room surveillance monitoring', icon: '🖥️' }
        ]
      }
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
      {
        id: 'cleaning-janitorial-grp',
        name: 'Cleaning & Janitorial',
        slug: 'cleaning-janitorial',
        subtitle: 'Office janitors, domestic housekeepers & gardeners',
        icon: '🧹',
        thirdLevelOptions: [
          { id: 'cleaner', name: 'Cleaner / Janitor', slug: 'cleaner-janitor', subtitle: 'Office & commercial premises cleaning', icon: '🧹' },
          { id: 'housekeeper-domestic', name: 'Housekeeper (Domestic)', slug: 'housekeeper-domestic', subtitle: 'Domestic home cooking & cleaning', icon: '🏠' },
          { id: 'gardener-job', name: 'Gardener', slug: 'gardener', subtitle: 'Lawn mowing, tree trimming & plant care', icon: '🌱' }
        ]
      },
      {
        id: 'facility-maintenance-grp',
        name: 'Facility Maintenance',
        slug: 'facility-maintenance',
        subtitle: 'General handyman repairs & building upkeep',
        icon: '🛠️',
        thirdLevelOptions: [
          { id: 'maintenance-worker', name: 'Maintenance Worker', slug: 'maintenance-worker', subtitle: 'General handyman repairs & upkeep', icon: '🛠️' }
        ]
      }
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
      {
        id: 'farm-plantation-grp',
        name: 'Farm & Plantation Operations',
        slug: 'farm-plantation-operations',
        subtitle: 'Farm workers, estate supervisors & livestock staff',
        icon: '🌾',
        thirdLevelOptions: [
          { id: 'farm-worker', name: 'Farm Worker', slug: 'farm-worker', subtitle: 'Cultivation, harvesting & field labour', icon: '🌾' },
          { id: 'estate-supervisor', name: 'Estate Supervisor / Field Officer', slug: 'estate-supervisor-field-officer', subtitle: 'Plantation & tea/coconut estate oversight', icon: '📋' },
          { id: 'dairy-poultry-worker', name: 'Dairy & Poultry Worker', slug: 'dairy-poultry-worker', subtitle: 'Animal feeding, egg collection & milking', icon: '🐄' }
        ]
      }
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
      {
        id: 'store-sales-billing-grp',
        name: 'Store Sales & Cashiering',
        slug: 'store-sales-billing',
        subtitle: 'Shop assistants, retail cashiers & merchandisers',
        icon: '🛍️',
        thirdLevelOptions: [
          { id: 'shop-assistant', name: 'Shop Assistant', slug: 'shop-assistant', subtitle: 'Customer greeting, shelving & item packing', icon: '🛍️' },
          { id: 'retail-cashier', name: 'Retail Cashier', slug: 'retail-cashier', subtitle: 'Supermarket billing & barcode scanning', icon: '💳' },
          { id: 'merchandiser', name: 'Merchandiser', slug: 'merchandiser', subtitle: 'Shelf display & stock replenishment', icon: '📦' }
        ]
      },
      {
        id: 'retail-management-grp',
        name: 'Retail Management',
        slug: 'retail-management',
        subtitle: 'Store managers & retail outlet leads',
        icon: '🏬',
        thirdLevelOptions: [
          { id: 'store-manager-ret', name: 'Store Manager', slug: 'store-manager-retail', subtitle: 'Retail outlet management & sales targets', icon: '🏬' }
        ]
      }
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
      {
        id: 'call-center-voice-grp',
        name: 'Call Center & Voice Support',
        slug: 'call-center-voice-support',
        subtitle: 'Inbound/outbound call agents & customer care',
        icon: '🎧',
        thirdLevelOptions: [
          { id: 'call-center-agent', name: 'Call Center Agent', slug: 'call-center-agent', subtitle: 'Inbound & outbound voice customer support', icon: '🎧' },
          { id: 'customer-care-exec', name: 'Customer Care Executive', slug: 'customer-care-executive', subtitle: 'Resolving complaints & email tickets', icon: '💬' }
        ]
      },
      {
        id: 'digital-messaging-grp',
        name: 'Digital & Live Chat Support',
        slug: 'digital-live-chat-support',
        subtitle: 'Web chat & WhatsApp support specialists',
        icon: '📱',
        thirdLevelOptions: [
          { id: 'live-chat-agent', name: 'Live Chat Agent', slug: 'live-chat-agent', subtitle: 'Web chat & WhatsApp support specialist', icon: '📱' }
        ]
      }
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
      {
        id: 'hr-ops-recruitment-grp',
        name: 'HR Operations & Recruitment',
        slug: 'hr-operations-recruitment',
        subtitle: 'HR executives, recruiters & talent acquisition',
        icon: '📋',
        thirdLevelOptions: [
          { id: 'hr-executive', name: 'HR Executive', slug: 'hr-executive', subtitle: 'Employee records, attendance & onboarding', icon: '📋' },
          { id: 'recruiter', name: 'Recruiter / Talent Acquisition', slug: 'recruiter-talent-acquisition', subtitle: 'Sourcing, screening & interviewing candidates', icon: '🔍' },
          { id: 'hr-manager', name: 'HR Manager', slug: 'hr-manager', subtitle: 'Labour law, company policy & performance', icon: '💼' }
        ]
      }
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
      {
        id: 'legal-counsel-grp',
        name: 'Legal Counsel & Compliance',
        slug: 'legal-counsel-compliance',
        subtitle: 'Attorneys, legal officers & paralegals',
        icon: '⚖️',
        thirdLevelOptions: [
          { id: 'lawyer-job', name: 'Lawyer / Attorney-at-Law', slug: 'lawyer-attorney-at-law', subtitle: 'Corporate & litigation legal counsel', icon: '⚖️' },
          { id: 'legal-officer', name: 'Legal Officer', slug: 'legal-officer', subtitle: 'Contract drafting, vetting & compliance', icon: '📑' },
          { id: 'legal-assistant', name: 'Legal Assistant / Secretary', slug: 'legal-assistant-secretary', subtitle: 'Filing, court documents & case research', icon: '📁' }
        ]
      }
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
      {
        id: 'photo-film-grp',
        name: 'Photography & Film Production',
        slug: 'photography-film-production',
        subtitle: 'Photographers, videographers & video editors',
        icon: '📷',
        thirdLevelOptions: [
          { id: 'photographer-job', name: 'Photographer', slug: 'photographer', subtitle: 'Studio, fashion, product & event photography', icon: '📷' },
          { id: 'videographer-job', name: 'Videographer', slug: 'videographer', subtitle: 'Camera operator, commercial & docu shoots', icon: '🎥' },
          { id: 'video-editor-job', name: 'Video Editor', slug: 'video-editor', subtitle: 'Premiere Pro, After Effects, DaVinci editing', icon: '✂️' }
        ]
      },
      {
        id: 'design-audio-grp',
        name: 'Graphic Design & Audio',
        slug: 'graphic-design-audio',
        subtitle: 'Graphic designers, animators & voice artists',
        icon: '🎨',
        thirdLevelOptions: [
          { id: 'graphic-designer-job', name: 'Graphic Designer', slug: 'graphic-designer', subtitle: 'Photoshop, Illustrator, social posts & logos', icon: '🎨' },
          { id: 'animator-job', name: 'Animator', slug: 'animator', subtitle: '2D/3D character animation & motion graphics', icon: '✨' },
          { id: 'voice-artist-job', name: 'Voice Artist / Presenter', slug: 'voice-artist-presenter', subtitle: 'Commercial dubbing & TV/radio presenting', icon: '🎙️' }
        ]
      }
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
      {
        id: 'ecom-virtual-ops-grp',
        name: 'E-Commerce & Virtual Operations',
        slug: 'ecommerce-virtual-operations',
        subtitle: 'Daraz/Shopify managers, moderators & VAs',
        icon: '🛒',
        thirdLevelOptions: [
          { id: 'ecommerce-manager', name: 'E-Commerce Manager', slug: 'ecommerce-manager', subtitle: 'Daraz, Shopify & WooCommerce operations', icon: '🛒' },
          { id: 'online-community-mod', name: 'Community Moderator', slug: 'community-moderator', subtitle: 'Forum, Discord & Facebook group moderation', icon: '🛡️' },
          { id: 'virtual-assistant-job', name: 'Virtual Assistant', slug: 'virtual-assistant', subtitle: 'Email management, research & calendar handling', icon: '💻' }
        ]
      }
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
      {
        id: 'remote-contract-grp',
        name: 'Remote Tech & Content Contracts',
        slug: 'remote-tech-content-contracts',
        subtitle: 'Remote developers, copywriters, translators & support',
        icon: '💻',
        thirdLevelOptions: [
          { id: 'freelance-dev', name: 'Freelance Developer', slug: 'freelance-developer', subtitle: 'Remote contract programming jobs', icon: '💻' },
          { id: 'content-writer-rem', name: 'Content Writer / Copywriter', slug: 'content-writer-copywriter', subtitle: 'Articles, blogs, SEO copywriting', icon: '✍️' },
          { id: 'translator-job', name: 'Translator', slug: 'translator', subtitle: 'Sinhala, Tamil, English translations', icon: '🗣️' },
          { id: 'remote-customer-support', name: 'Remote Customer Support', slug: 'remote-customer-support', subtitle: 'Global timezone chat & email tickets', icon: '🎧' }
        ]
      }
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
      {
        id: 'b2b-partnerships-grp',
        name: 'B2B & Enterprise Partnerships',
        slug: 'b2b-enterprise-partnerships',
        subtitle: 'BD executives & key account managers',
        icon: '💼',
        thirdLevelOptions: [
          { id: 'bde-job', name: 'Business Development Executive', slug: 'business-development-executive', subtitle: 'B2B outreach & corporate partnership deals', icon: '💼' },
          { id: 'key-account-mgr', name: 'Key Account Manager', slug: 'key-account-manager', subtitle: 'Client relationship retention & expansion', icon: '🌟' }
        ]
      }
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
      {
        id: 'executive-leadership-grp',
        name: 'Executive & Operations Leadership',
        slug: 'executive-operations-leadership',
        subtitle: 'GMs, operations managers, branch heads & PMs',
        icon: '👔',
        thirdLevelOptions: [
          { id: 'general-manager', name: 'General Manager (GM)', slug: 'general-manager', subtitle: 'Company-wide business strategy & profitability', icon: '👔' },
          { id: 'operations-manager', name: 'Operations Manager', slug: 'operations-manager', subtitle: 'Process efficiency, team leadership & SLA', icon: '⚙️' },
          { id: 'branch-manager', name: 'Branch Manager', slug: 'branch-manager', subtitle: 'Regional branch staff & revenue management', icon: '🏢' },
          { id: 'project-manager', name: 'Project Manager', slug: 'project-manager', subtitle: 'Timeline, sprint planning & milestone delivery', icon: '📊' }
        ]
      }
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
      {
        id: 'state-admin-grp',
        name: 'State Administration & Clerical',
        slug: 'state-administration-clerical',
        subtitle: 'Ministry, department & statutory body officers',
        icon: '🏛️',
        thirdLevelOptions: [
          { id: 'govt-clerical', name: 'State Clerical & Admin', slug: 'state-clerical-admin', subtitle: 'Ministry & department administration', icon: '🏛️' },
          { id: 'public-service-exec', name: 'Public Service Executive', slug: 'public-service-executive', subtitle: 'Officers in state statutory bodies', icon: '📋' }
        ]
      }
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
      {
        id: 'general-vacancies-grp',
        name: 'General Vacancies',
        slug: 'general-vacancies-group',
        subtitle: 'Other job vacancies not specifically categorized',
        icon: '💼',
        thirdLevelOptions: [
          { id: 'general-vacancies', name: 'General Vacancies', slug: 'general-vacancies', subtitle: 'Other job roles not listed above', icon: '💼' }
        ]
      }
    ]
  }
];

export const JOBS_POPULAR_SEARCHES = [
  { label: 'Software Developer', icon: '💻', mainCatId: 'it-tech', subCatId: 'software-development', thirdLevelId: 'software-dev' },
  { label: 'Driver', icon: '🚗', mainCatId: 'driving-transport', subCatId: 'driver', thirdLevelId: 'car-driver' },
  { label: 'Office Assistant', icon: '📂', mainCatId: 'office-admin', subCatId: 'clerical-admin', thirdLevelId: 'office-assistant' },
  { label: 'Accountant', icon: '📊', mainCatId: 'accounting-finance', subCatId: 'accounting-auditing-grp', thirdLevelId: 'accountant' },
  { label: 'Graphic Designer', icon: '🎨', mainCatId: 'media-creative-job', subCatId: 'design-audio-grp', thirdLevelId: 'graphic-designer-job' }
];
