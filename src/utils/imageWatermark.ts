import { validateListingImage } from './pendingUploadImages';
import { RENTALS_CATEGORIES } from '../data/categories/rentalsData';
import { JOBS_CATEGORIES } from '../data/categories/jobsData';
import { SERVICES_CATEGORIES } from '../data/categories/servicesData';

export interface ProcessedListingImage {
  file: File;
  width: number;
  height: number;
  mimeType: string;
  size: number;
}

export type WatermarkModule = 'rental' | 'job' | 'service' | 'rentals' | 'jobs' | 'services';

interface BadgeConfig {
  icon: string;
  titleLine1: string;
  titleLine2: string;
}

interface ModuleWatermarkConfig {
  moduleName: 'rental' | 'job' | 'service';
  badgeLabel: string;
  accentColor: string;
  tagline: string;
  rightBadges: BadgeConfig[];
  bottomBadges: BadgeConfig[];
}

// Right side badges (fixed per module - platform trust statements)
const RIGHT_SIDE_BADGES: Record<'rental' | 'job' | 'service', BadgeConfig[]> = {
  rental: [
    { icon: 'shield', titleLine1: 'Genuine', titleLine2: 'Listing' },
    { icon: 'calendar', titleLine1: 'Easy', titleLine2: 'Booking' },
    { icon: 'clock', titleLine1: 'Flexible', titleLine2: 'Rental Period' },
    { icon: 'mapPin', titleLine1: 'Islandwide', titleLine2: 'Availability' },
  ],
  job: [
    { icon: 'shield', titleLine1: 'Genuine', titleLine2: 'Employer' },
    { icon: 'send', titleLine1: 'Easy', titleLine2: 'Apply' },
    { icon: 'clock', titleLine1: 'Flexible', titleLine2: 'Hours' },
    { icon: 'mapPin', titleLine1: 'Islandwide', titleLine2: 'Opportunities' },
  ],
  service: [
    { icon: 'shield', titleLine1: 'Genuine', titleLine2: 'Provider' },
    { icon: 'calendar', titleLine1: 'Easy', titleLine2: 'Booking' },
    { icon: 'clock', titleLine1: 'Flexible', titleLine2: 'Scheduling' },
    { icon: 'mapPin', titleLine1: 'Islandwide', titleLine2: 'Availability' },
  ]
};

// Module-specific corner taglines
const TAGLINES: Record<'rental' | 'job' | 'service', string> = {
  rental: 'Move Your Way',
  job: 'Work Your Way',
  service: 'Serve Your Way',
};

// Category-aware word pools for bottom badges
const CATEGORY_WORD_POOLS: Record<'rental' | 'job' | 'service', Record<string, [string, string, string, string]>> = {
  rental: {
    'prop-rent': ['Prime Location', 'Verified Owner', 'Flexible Move-in', 'Great Value'],
    'rooms-acc': ['Furnished Room', 'Safe & Secure', 'Prime Location', 'Flexible Stay'],
    'vehicles': ['Well Maintained', 'Reliable Performance', 'Fuel Efficient', 'Great For Daily Use'],
    'event-rentals': ['Easy Setup', 'Wide Selection', 'On-Time Delivery', 'Perfect For Occasions'],
    'construction-eq': ['Heavy Duty', 'Well Maintained', 'Site Ready', 'Reliable Performance'],
    'tools-machinery': ['Heavy Duty', 'Well Maintained', 'Site Ready', 'Reliable Performance'],
    'electronics-tech': ['Latest Model', 'Fully Tested', 'Accessories Included', 'Great Condition'],
    'cameras-media': ['Latest Model', 'Fully Tested', 'Accessories Included', 'Great Condition'],
    'furniture': ['Good Condition', 'Easy Delivery', 'Great Value', 'Ready To Use'],
    'home-appliances': ['Good Condition', 'Easy Delivery', 'Great Value', 'Ready To Use'],
    'fashion-clothing': ['Trendy Styles', 'Great Condition', 'Perfect Fit', 'Great Value'],
    'wedding-bridal': ['Elegant Design', 'Great Condition', 'Perfect For The Day', 'Great Value'],
    'outdoor-camping': ['Durable Gear', 'Well Maintained', 'Ready For Adventure', 'Great Value'],
    'sports-fitness': ['Durable Gear', 'Well Maintained', 'Ready To Use', 'Great Value'],
    'baby-kids': ['Safe & Clean', 'Good Condition', 'Easy Delivery', 'Great Value'],
    'medical-mobility': ['Sanitized & Safe', 'Well Maintained', 'Easy Delivery', 'Reliable Support'],
    'office-equipment': ['Good Condition', 'Fully Tested', 'Easy Delivery', 'Great Value'],
    'business-commercial-eq': ['Heavy Duty', 'Well Maintained', 'Reliable Performance', 'Great Value'],
    'agri-farming-eq': ['Heavy Duty', 'Well Maintained', 'Reliable Performance', 'Great Value'],
    'boats-water': ['Well Maintained', 'Safety Equipped', 'Reliable Performance', 'Great For Daily Use'],
    'travel-luggage': ['Durable Build', 'Good Condition', 'Easy Delivery', 'Great Value'],
    'party-entertainment': ['Easy Setup', 'Wide Selection', 'Great For Occasions', 'On-Time Delivery'],
    'kitchen-catering-eq': ['Good Condition', 'Easy Delivery', 'Great Value', 'Ready To Use'],
    'pet-equipment': ['Safe & Clean', 'Good Condition', 'Easy Delivery', 'Great Value'],
    'musical-audio': ['Great Condition', 'Fully Tested', 'Accessories Included', 'Great Value'],
    'education-study-eq': ['Good Condition', 'Complete Set', 'Easy Delivery', 'Great Value'],
    'other-rentals': ['Good Condition', 'Verified Listing', 'Easy Delivery', 'Great Value'],
    'fallback': ['Good Condition', 'Verified Listing', 'Easy Delivery', 'Great Value'],
  },
  job: {
    'office-admin': ['Genuine Employer', 'Career Growth', 'Competitive Salary', 'Quick Response'],
    'accounting-finance': ['Genuine Employer', 'Career Growth', 'Competitive Salary', 'Quick Response'],
    'banking-insurance': ['Genuine Employer', 'Career Growth', 'Competitive Salary', 'Quick Response'],
    'human-resources': ['Genuine Employer', 'Career Growth', 'Competitive Salary', 'Quick Response'],
    'legal-job': ['Genuine Employer', 'Career Growth', 'Competitive Salary', 'Quick Response'],
    'management-job': ['Genuine Employer', 'Career Growth', 'Competitive Salary', 'Quick Response'],
    'business-dev': ['Genuine Employer', 'Career Growth', 'Competitive Salary', 'Quick Response'],
    'govt-public-sector': ['Genuine Employer', 'Career Growth', 'Competitive Salary', 'Quick Response'],
    'it-tech': ['Genuine Employer', 'Flexible Hours', 'Remote Friendly', 'Competitive Pay'],
    'digital-online-work': ['Genuine Employer', 'Flexible Hours', 'Remote Friendly', 'Competitive Pay'],
    'freelance-remote': ['Genuine Employer', 'Flexible Hours', 'Remote Friendly', 'Competitive Pay'],
    'media-creative-job': ['Genuine Employer', 'Flexible Hours', 'Remote Friendly', 'Competitive Pay'],
    'sales-marketing': ['Genuine Employer', 'Career Growth', 'Great Incentives', 'Quick Response'],
    'customer-service': ['Genuine Employer', 'Career Growth', 'Great Incentives', 'Quick Response'],
    'retail-job': ['Genuine Employer', 'Career Growth', 'Great Incentives', 'Quick Response'],
    'hospitality-tourism': ['Genuine Employer', 'Friendly Team', 'Flexible Shifts', 'Fair Pay'],
    'food-restaurant': ['Genuine Employer', 'Friendly Team', 'Flexible Shifts', 'Fair Pay'],
    'driving-transport': ['Genuine Employer', 'Fair Pay', 'Flexible Hours', 'Quick Response'],
    'logistics-warehouse': ['Genuine Employer', 'Fair Pay', 'Flexible Hours', 'Quick Response'],
    'construction-job': ['Genuine Employer', 'Fair Pay', 'Skilled Work', 'Safe Workplace'],
    'engineering-job': ['Genuine Employer', 'Fair Pay', 'Skilled Work', 'Safe Workplace'],
    'architecture-design': ['Genuine Employer', 'Fair Pay', 'Skilled Work', 'Safe Workplace'],
    'factory-manufacturing': ['Genuine Employer', 'Fair Pay', 'Skilled Work', 'Safe Workplace'],
    'healthcare-job': ['Genuine Employer', 'Fair Pay', 'Supportive Team', 'Meaningful Work'],
    'education-job': ['Genuine Employer', 'Fair Pay', 'Supportive Environment', 'Meaningful Work'],
    'beauty-fashion-job': ['Genuine Employer', 'Creative Work', 'Fair Pay', 'Flexible Hours'],
    'security-job': ['Genuine Employer', 'Fair Pay', 'Steady Work', 'Safe Workplace'],
    'cleaning-maint-job': ['Genuine Employer', 'Fair Pay', 'Flexible Hours', 'Steady Work'],
    'agriculture-job': ['Genuine Employer', 'Fair Pay', 'Steady Work', 'Local Opportunity'],
    'other-jobs': ['Genuine Employer', 'Fair Pay', 'Quick Response', 'Great Opportunity'],
    'fallback': ['Genuine Employer', 'Fair Pay', 'Quick Response', 'Great Opportunity'],
  },
  service: {
    'home-services': ['Skilled Technicians', 'Fast Response', 'Fair Pricing', 'Warranty Included'],
    'appliance-repair': ['Skilled Technicians', 'Fast Response', 'Fair Pricing', 'Warranty Included'],
    'electrical-services': ['Skilled Technicians', 'Fast Response', 'Fair Pricing', 'Warranty Included'],
    'plumbing-services': ['Skilled Technicians', 'Fast Response', 'Fair Pricing', 'Warranty Included'],
    'ac-refrigeration': ['Skilled Technicians', 'Fast Response', 'Fair Pricing', 'Warranty Included'],
    'repair-maintenance-serv': ['Skilled Technicians', 'Fast Response', 'Fair Pricing', 'Warranty Included'],
    'cleaning-services': ['Trusted Cleaners', 'Fast Response', 'Fair Pricing', 'Great Reviews'],
    'cleaning-laundry-serv': ['Trusted Cleaners', 'Fast Response', 'Fair Pricing', 'Great Reviews'],
    'vehicle-services': ['Skilled Mechanics', 'Genuine Parts', 'Fair Pricing', 'Fast Turnaround'],
    'computer-mobile': ['Skilled Technicians', 'Genuine Parts', 'Fair Pricing', 'Fast Turnaround'],
    'business-services': ['Experienced Professionals', 'Confidential & Trusted', 'Fair Pricing', 'Great Reviews'],
    'legal-professional-serv': ['Experienced Professionals', 'Confidential & Trusted', 'Fair Pricing', 'Great Reviews'],
    'accounting-finance-serv': ['Experienced Professionals', 'Confidential & Trusted', 'Fair Pricing', 'Great Reviews'],
    'real-estate-services': ['Experienced Professionals', 'Confidential & Trusted', 'Fair Pricing', 'Great Reviews'],
    'digital-services': ['Creative Experts', 'High Quality Work', 'Fair Pricing', 'Great Reviews'],
    'creative-services': ['Creative Experts', 'High Quality Work', 'Fair Pricing', 'Great Reviews'],
    'photo-video-services': ['Creative Experts', 'High Quality Work', 'Fair Pricing', 'Great Reviews'],
    'printing-advertising': ['Creative Experts', 'High Quality Work', 'Fair Pricing', 'Great Reviews'],
    'education-tutoring-serv': ['Qualified Tutors', 'Flexible Scheduling', 'Fair Pricing', 'Great Reviews'],
    'event-services': ['Experienced Team', 'On-Time Delivery', 'Fair Pricing', 'Great Reviews'],
    'food-catering-services': ['Experienced Team', 'On-Time Delivery', 'Fair Pricing', 'Great Reviews'],
    'beauty-personal-care': ['Skilled Professionals', 'Hygienic & Safe', 'Fair Pricing', 'Great Reviews'],
    'health-wellness-serv': ['Qualified Professionals', 'Safe & Hygienic', 'Fair Pricing', 'Great Reviews'],
    'delivery-moving-serv': ['Careful Handling', 'On-Time Delivery', 'Fair Pricing', 'Great Reviews'],
    'construction-services': ['Skilled Workers', 'Quality Materials', 'Fair Pricing', 'On-Time Completion'],
    'travel-tourism-serv': ['Experienced Guides', 'Well Planned', 'Fair Pricing', 'Great Reviews'],
    'pet-services': ['Caring Professionals', 'Safe & Hygienic', 'Fair Pricing', 'Great Reviews'],
    'security-services': ['Trained Personnel', 'Reliable Coverage', 'Fair Pricing', 'Great Reviews'],
    'agriculture-services': ['Experienced Team', 'Reliable Equipment', 'Fair Pricing', 'Great Reviews'],
    'other-services': ['Skilled Professionals', 'Reliable Service', 'Fair Pricing', 'Great Reviews'],
    'fallback': ['Skilled Professionals', 'Reliable Service', 'Fair Pricing', 'Great Reviews'],
  }
};

function normalizeModule(module?: string): 'rental' | 'job' | 'service' {
  if (!module) return 'rental';
  const lower = module.toLowerCase().trim();
  if (lower.startsWith('job') || lower.includes('job')) return 'job';
  if (lower.startsWith('service') || lower.includes('service')) return 'service';
  if (lower.startsWith('rent') || lower.includes('rental')) return 'rental';
  return 'rental';
}

function resolveTopLevelCategoryId(module: 'rental' | 'job' | 'service', catId?: string): string | null {
  if (!catId) return null;
  const targetId = catId.trim();
  const pools = CATEGORY_WORD_POOLS[module];
  if (pools[targetId]) return targetId;

  const categoryTree = module === 'rental'
    ? RENTALS_CATEGORIES
    : module === 'job'
      ? JOBS_CATEGORIES
      : SERVICES_CATEGORIES;

  for (const mainCat of categoryTree) {
    if (mainCat.id === targetId) return mainCat.id;
    if (mainCat.subcategories?.some(sub => sub.id === targetId)) {
      return mainCat.id;
    }
  }
  return null;
}

function getCategoryWords(module: 'rental' | 'job' | 'service', categoryId?: string): [string, string, string, string] {
  const pools = CATEGORY_WORD_POOLS[module];
  const topId = resolveTopLevelCategoryId(module, categoryId);
  if (topId && pools[topId]) {
    return pools[topId];
  }
  return pools['fallback'];
}

function formatBadgePhrase(phrase: string): { titleLine1: string; titleLine2: string } {
  const parts = phrase.trim().split(/\s+/);
  if (parts.length <= 1) {
    return { titleLine1: parts[0] || '', titleLine2: '' };
  }
  if (parts.length === 2) {
    return { titleLine1: parts[0], titleLine2: parts[1] };
  }
  if (parts.length === 3) {
    if (parts[1] === '&') {
      return { titleLine1: `${parts[0]} &`, titleLine2: parts[2] };
    }
    return { titleLine1: `${parts[0]} ${parts[1]}`, titleLine2: parts[2] };
  }
  const mid = Math.ceil(parts.length / 2);
  return {
    titleLine1: parts.slice(0, mid).join(' '),
    titleLine2: parts.slice(mid).join(' ')
  };
}

function getIconForPhrase(phrase: string): string {
  const lower = phrase.toLowerCase();
  if (lower.includes('location') || lower.includes('site')) return 'mapPin';
  if (lower.includes('verified') || lower.includes('genuine') || lower.includes('safe') || lower.includes('sanitized') || lower.includes('warranty')) return 'shield';
  if (lower.includes('maintained') || lower.includes('technician') || lower.includes('mechanic') || lower.includes('duty')) return 'helmet';
  if (lower.includes('fuel')) return 'fuel';
  if (lower.includes('delivery') || lower.includes('apply')) return 'send';
  if (lower.includes('value') || lower.includes('price') || lower.includes('pricing') || lower.includes('incentive') || lower.includes('pay') || lower.includes('salary')) return 'tag';
  if (lower.includes('employer') || lower.includes('building') || lower.includes('owner')) return 'building';
  if (lower.includes('quality') || lower.includes('experienced') || lower.includes('skilled') || lower.includes('qualified') || lower.includes('growth') || lower.includes('award')) return 'award';
  if (lower.includes('response') || lower.includes('fast') || lower.includes('zap') || lower.includes('quick')) return 'zap';
  if (lower.includes('flexible') || lower.includes('hours') || lower.includes('scheduling') || lower.includes('stay') || lower.includes('period') || lower.includes('shifts')) return 'clock';
  if (lower.includes('setup') || lower.includes('service') || lower.includes('performance') || lower.includes('work') || lower.includes('gear')) return 'gear';
  return 'star';
}

function getIconSvg(name: string, color: string, size: number = 32): string {
  const stroke = color;
  const sw = 2.2;
  switch (name) {
    case 'shield':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.8 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`;
    case 'tap':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 0 1 2 2v4a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.83l2.26 2.26"/></svg>`;
    case 'clock':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
    case 'mapPin':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`;
    case 'helmet':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><path d="M2 13a10 10 0 0 1 20 0v2H2z"/><path d="M12 3v10"/><path d="M4 15a8 8 0 0 0 16 0"/><circle cx="12" cy="17" r="1.5" fill="${stroke}"/></svg>`;
    case 'gear':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`;
    case 'fuel':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="15" y2="22"/><path d="M4 9h8"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5.41"/></svg>`;
    case 'star':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    case 'send':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
    case 'building':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><path d="M10 22v-4h4v4"/></svg>`;
    case 'award':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`;
    case 'zap':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
    case 'calendar':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
    case 'tag':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l11.29 11.29a1 1 0 0 0 1.42 0l7.58-7.58a1 1 0 0 0 0-1.42L12 2z"/><circle cx="7" cy="7" r="2" fill="${stroke}"/></svg>`;
    default:
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`;
  }
}

let cachedLogoDataUrl: string | null = null;

async function getBrandLogoDataUrl(): Promise<string | null> {
  if (cachedLogoDataUrl) return cachedLogoDataUrl;
  const logoPaths = [
    '/brand/rentoura-official-icon-512.png',
    '/brand/rentoura-official-icon-180.png'
  ];

  for (const path of logoPaths) {
    try {
      const response = await fetch(path);
      const contentType = response.headers.get('content-type');
      if (!response.ok) {
        console.error(`[Watermark Logo] HTTP ${response.status} when fetching logo at ${path}`);
        continue;
      }
      if (contentType && !contentType.includes('image')) {
        console.error(`[Watermark Logo] Non-image content-type "${contentType}" when fetching logo at ${path}`);
        continue;
      }
      const blob = await response.blob();
      const dataUrl = await new Promise<string | null>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const res = reader.result as string;
          if (res && res.startsWith('data:image/')) {
            resolve(res);
          } else {
            console.error(`[Watermark Logo] FileReader returned invalid image data URL for ${path}`);
            resolve(null);
          }
        };
        reader.onerror = (err) => {
          console.error(`[Watermark Logo] FileReader error for ${path}:`, err);
          resolve(null);
        };
        reader.readAsDataURL(blob);
      });

      if (dataUrl) {
        cachedLogoDataUrl = dataUrl;
        return dataUrl;
      }
    } catch (e) {
      console.error(`[Watermark Logo] Error fetching logo from ${path}:`, e);
    }
  }

  console.error('[Watermark Logo] All logo fetch attempts failed. Rendering clean vector brand emblem fallback.');
  return null;
}

function getModuleConfig(module: 'rental' | 'job' | 'service', categoryId?: string): ModuleWatermarkConfig {
  const badgeLabel = module === 'job' ? 'JOB' : module === 'service' ? 'SERVICE' : 'RENTAL';
  const accentColor = module === 'job' ? '#08A34F' : module === 'service' ? '#FF650A' : '#1464F4';
  const tagline = TAGLINES[module];
  const rightBadges = RIGHT_SIDE_BADGES[module];

  const words = getCategoryWords(module, categoryId);
  const bottomBadges: BadgeConfig[] = words.map((w) => {
    const parsed = formatBadgePhrase(w);
    return {
      icon: getIconForPhrase(w),
      titleLine1: parsed.titleLine1,
      titleLine2: parsed.titleLine2
    };
  });

  return {
    moduleName: module,
    badgeLabel,
    accentColor,
    tagline,
    rightBadges,
    bottomBadges
  };
}

function buildFrameSvg(config: ModuleWatermarkConfig, logoDataUrl: string | null): string {
  const { badgeLabel, accentColor, tagline, rightBadges, bottomBadges } = config;

  // Use embedded logo image if available; otherwise render vector brand badge (NO broken image tag)
  const logoImageOrSvg = logoDataUrl
    ? `<image href="${logoDataUrl}" x="55" y="45" width="105" height="105" clip-path="url(#logoClip)"/>`
    : `<g transform="translate(55, 45)">
        <rect width="105" height="105" rx="28" fill="url(#logoGradient)"/>
        <text x="52.5" y="68" font-family="system-ui, sans-serif" font-weight="900" font-size="64" fill="#FFFFFF" text-anchor="middle">R</text>
       </g>`;

  const rightBadgesSvg = rightBadges.map((badge, idx) => {
    const y = 320 + idx * 240;
    return `
      <g>
        <circle cx="1440" cy="${y}" r="46" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" filter="url(#dropShadow)" />
        <g transform="translate(${1440 - 22}, ${y - 22})">
          ${getIconSvg(badge.icon, accentColor, 44)}
        </g>
        <text x="1440" y="${y + 72}" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="18" fill="#0F172A" text-anchor="middle">
          <tspan x="1440" dy="0">${badge.titleLine1}</tspan>
          <tspan x="1440" dy="22">${badge.titleLine2}</tspan>
        </text>
      </g>
    `;
  }).join('');

  const bottomBadgesSvg = bottomBadges.map((badge, idx) => {
    const x = 120 + idx * 270;
    return `
      <g>
        <circle cx="${x}" cy="1495" r="34" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" filter="url(#dropShadow)" />
        <g transform="translate(${x - 17}, ${1495 - 17})">
          ${getIconSvg(badge.icon, accentColor, 34)}
        </g>
        <text x="${x + 46}" y="1490" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="18" fill="#0F172A" text-anchor="start">
          <tspan x="${x + 46}" dy="-6">${badge.titleLine1}</tspan>
          <tspan x="${x + 46}" dy="22">${badge.titleLine2}</tspan>
        </text>
      </g>
    `;
  }).join('');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1600" viewBox="0 0 1600 1600">
      <defs>
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0F172A" flood-opacity="0.08"/>
        </filter>
        <filter id="textShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000000" flood-opacity="0.4"/>
        </filter>
        <clipPath id="logoClip">
          <rect x="55" y="45" width="105" height="105" rx="28"/>
        </clipPath>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0A2540" />
          <stop offset="100%" stop-color="${accentColor}" />
        </linearGradient>
        <linearGradient id="cornerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#041C43" />
          <stop offset="100%" stop-color="${accentColor}" />
        </linearGradient>
      </defs>

      <!-- Background Speed Graphic Lines behind Photo -->
      <path d="M 40 300 Q 550 250 450 500 Q 250 750 60 900" fill="none" stroke="${accentColor}" stroke-width="80" stroke-linecap="round" opacity="0.05" />
      <path d="M 100 200 L 600 200 C 500 350 350 450 150 500 Z" fill="${accentColor}" opacity="0.03" />

      <!-- Top Header Brand Block -->
      <g>
        ${logoImageOrSvg}
        <text x="180" y="98" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="46" letter-spacing="-0.5px">
          <tspan fill="#041C43">RENTOURA</tspan><tspan fill="${accentColor}">.LK</tspan>
        </text>
        <text x="180" y="132" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="22" fill="#64748B">Rent Everything. Find Anything.</text>
      </g>

      <!-- Top Right Module Pill Badge -->
      <g>
        <rect x="1250" y="45" width="290" height="85" rx="42.5" fill="#041C43" filter="url(#dropShadow)"/>
        <text x="1395" y="98" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="32" fill="#FFFFFF" text-anchor="middle" letter-spacing="2px">${badgeLabel}</text>
        <rect x="1325" y="108" width="140" height="7" rx="3.5" fill="${accentColor}" />
      </g>

      <!-- Centered Translucent Watermark Over Photo -->
      <g opacity="0.28" transform="translate(640, 800)">
        <text x="0" y="0" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="72" fill="#FFFFFF" stroke="#041C43" stroke-width="2.5" text-anchor="middle" letter-spacing="3px">RENTOURA.LK</text>
      </g>

      <!-- Right Side Stacked Badges -->
      ${rightBadgesSvg}

      <!-- Bottom Row Badges -->
      ${bottomBadgesSvg}

      <!-- Bottom-Right Brand Corner Block -->
      <path d="M 1120 1600 C 1300 1520 1480 1380 1600 1140 L 1600 1600 Z" fill="url(#cornerGradient)" filter="url(#dropShadow)" />
      <g transform="translate(1420, 1465) rotate(-18)">
        <text x="0" y="0" font-family="'Caveat', 'Dancing Script', 'Brush Script MT', 'Comic Sans MS', cursive, sans-serif" font-weight="700" font-size="46" fill="#FFFFFF" text-anchor="middle" filter="url(#textShadow)">${tagline}</text>
      </g>
    </svg>
  `;
}

/**
 * Optimizes listing images (resizing, WebP conversion) and applies the full branded Rentoura frame overlay.
 * Accepts optional module and categoryId parameters to apply module-specific color variants, taglines, and category-aware badge copy.
 */
export async function applyRentouraWatermark(
  source: File,
  module?: WatermarkModule,
  categoryId?: string
): Promise<ProcessedListingImage> {
  const validationError = validateListingImage(source);
  if (validationError) throw new Error(validationError);

  const normalizedModule = normalizeModule(module);
  const config = getModuleConfig(normalizedModule, categoryId);

  const bitmap = await createImageBitmap(source, { imageOrientation: 'from-image' });

  // Canvas size: 1600 x 1600 high definition square frame
  const canvasWidth = 1600;
  const canvasHeight = 1600;

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const context = canvas.getContext('2d');
  if (!context) throw new Error('This browser cannot process listing images.');

  // 1. Clean White Background
  context.fillStyle = '#FFFFFF';
  context.fillRect(0, 0, canvasWidth, canvasHeight);

  // 2. Draw Source Photo Scaled Proportionally (No distortion, centered in designated photo box)
  const photoBoxX = 80;
  const photoBoxY = 200;
  const photoBoxWidth = 1140;
  const photoBoxHeight = 1180;

  const scale = Math.min(photoBoxWidth / bitmap.width, photoBoxHeight / bitmap.height);
  const renderWidth = Math.round(bitmap.width * scale);
  const renderHeight = Math.round(bitmap.height * scale);
  const renderX = photoBoxX + Math.round((photoBoxWidth - renderWidth) / 2);
  const renderY = photoBoxY + Math.round((photoBoxHeight - renderHeight) / 2);

  context.drawImage(bitmap, renderX, renderY, renderWidth, renderHeight);
  bitmap.close();

  // 3. Load Logo & Build Overlay SVG
  const logoDataUrl = await getBrandLogoDataUrl();
  const svgString = buildFrameSvg(config, logoDataUrl);

  // 4. Composite Overlay SVG onto Canvas
  try {
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const blobUrl = URL.createObjectURL(svgBlob);
    const overlayImg = new Image();

    await new Promise<void>((resolve) => {
      overlayImg.onload = () => {
        context.drawImage(overlayImg, 0, 0, canvasWidth, canvasHeight);
        URL.revokeObjectURL(blobUrl);
        resolve();
      };
      overlayImg.onerror = (e) => {
        console.error('[Watermark Overlay Error] Failed to composite frame SVG onto canvas:', e);
        URL.revokeObjectURL(blobUrl);
        resolve(); // Gracefully fallback: keep original photo
      };
      overlayImg.src = blobUrl;
    });
  } catch (e) {
    console.error('[Watermark Overlay Error] Exception while compositing overlay:', e);
  }

  // 5. Compress to WebP (Quality 0.88)
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(
    result => result ? resolve(result) : reject(new Error('Image processing failed.')),
    'image/webp',
    0.88,
  ));

  const file = new File([blob], `${crypto.randomUUID()}.webp`, { type: 'image/webp' });
  return {
    file,
    width: canvasWidth,
    height: canvasHeight,
    mimeType: file.type,
    size: file.size
  };
}

export const processListingImage = applyRentouraWatermark;
