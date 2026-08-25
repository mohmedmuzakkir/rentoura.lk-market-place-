import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Search, 
  ChevronDown, 
  SlidersHorizontal, 
  Wrench, 
  Siren, 
  MapPin, 
  Heart, 
  Star, 
  ArrowRight, 
  LayoutGrid, 
  ShieldCheck, 
  MessageCircle, 
  RefreshCw,
  X,
  Check,
  AlertCircle,
  Tag,
  Clock
} from 'lucide-react';
import { AppRoute, ServiceItem } from '../types';
import { GlobalLocationModal } from '../components/common/GlobalLocationModal';
import { LocationValueModel } from '../services/locationService';
import { ServiceCategoryModal } from '../components/ServiceCategoryModal';
import { ServiceHeroCarousel } from '../components/ServiceHeroCarousel';
import { ServiceService, ServiceFeedParams } from '../services/serviceService';
import { ServiceHeroSlide } from '../data/serviceHeroSlidesData';
import { getCategoryIconComponent } from '../components/CategoryIcon';
import { SavedListingService } from '../services/savedListingService';
import { AuthService } from '../services/authService';
import { SERVICES_CATEGORIES } from '../data/categories/servicesData';

interface ServicesPageProps {
  onNavigate: (route: AppRoute) => void;
  onOpenListingDetail?: (id: string, moduleHint?: 'rentals' | 'jobs' | 'services') => void;
  savedListings?: string[];
  onToggleSave?: (id: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ 
  onNavigate, 
  onOpenListingDetail,
  savedListings = [],
  onToggleSave
}) => {
  // Main Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Sri Lanka');
  const [selectedLocationObj, setSelectedLocationObj] = useState<LocationValueModel | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const [selectedServiceType, setSelectedServiceType] = useState('All Types');
  const [selectedPrice, setSelectedPrice] = useState('Any Price');
  const [isEmergencyOnly, setIsEmergencyOnly] = useState(false);
  const [isNearMeOnly, setIsNearMeOnly] = useState(false);

  // Saved Services State
  const [savedServices, setSavedServices] = useState<string[]>(savedListings);

  // Modals & Dropdowns State
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isServiceTypeModalOpen, setIsServiceTypeModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'price' | 'serviceType' | null>(null);

  // Hero Slides & Items State
  const [heroSlides, setHeroSlides] = useState<ServiceHeroSlide[]>([]);
  const [featuredItems, setFeaturedItems] = useState<ServiceItem[]>([]);
  const [nearYouItems, setNearYouItems] = useState<ServiceItem[]>([]);
  const [feedItems, setFeedItems] = useState<ServiceItem[]>([]);
  const [totalServicesCount, setTotalServicesCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [feedLoading, setFeedLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 12;

  // Profile Location State for Near Me
  const [userProfileLocationObj, setUserProfileLocationObj] = useState<LocationValueModel | undefined>(undefined);

  // Ref for Main Feed Anchor
  const feedRef = useRef<HTMLDivElement>(null);

  const priceOptions = ['Any Price', 'Under Rs. 5,000', 'Rs. 5,000 - 10,000', 'Rs. 10,000 - 25,000', 'Rs. 25,000+'];
  const serviceTypeOptions = ['All Types', 'On-site / In-person', 'Online / Remote', 'Emergency / 24/7', 'Scheduled Visit', 'Package Service'];

  // 1. Initial Load: Hero Slides, Featured Services, Saved Services, Profile Location
  useEffect(() => {
    let isMounted = true;

    // Load Hero Slides
    ServiceService.getServiceHeroSlides().then(slides => {
      if (isMounted) setHeroSlides(slides);
    });

    // Load Featured Services
    ServiceService.getFeaturedServices(6).then(items => {
      if (isMounted) setFeaturedItems(items);
    });

    // Load Saved Services IDs
    SavedListingService.getSavedListingIds().then(ids => {
      if (isMounted && ids) {
        setSavedServices(ids);
      }
    });

    // Check Current Logged-in User Profile Location for Near Me
    const unsubscribeAuth = AuthService.subscribe((user, profile) => {
      if (profile && (profile.area || profile.city || profile.district || profile.province)) {
        const pLocObj: LocationValueModel = {
          type: profile.area ? 'area' : (profile.city ? 'city' : (profile.district ? 'district' : 'province')),
          provinceId: profile.province || undefined,
          districtId: profile.district || undefined,
          cityId: profile.city || undefined,
          areaId: profile.area || undefined,
          displayName: profile.city || profile.district || profile.province || 'Near You'
        };
        setUserProfileLocationObj(pLocObj);

        // Fetch Services Near You using profile location
        ServiceService.getServicesNearYou(pLocObj, 6).then(items => {
          if (isMounted) setNearYouItems(items);
        });
      }
    });

    return () => {
      isMounted = false;
      unsubscribeAuth();
    };
  }, []);

  // 2. Fetch Services Feed Callback
  const fetchServicesFeed = useCallback(async (isInitial = true, currentPage = 1) => {
    setFeedLoading(true);

    const offset = (currentPage - 1) * limit;
    const params: ServiceFeedParams = {
      searchQuery: searchQuery.trim(),
      selectedLocation,
      selectedLocationObj,
      selectedCategory,
      selectedCategoryId,
      selectedServiceType,
      selectedPrice,
      isEmergencyOnly,
      isNearMeOnly,
      offset,
      limit
    };

    const result = await ServiceService.getServicesFeed(params);

    if (isInitial) {
      setFeedItems(result.items);
    } else {
      setFeedItems(prev => [...prev, ...result.items]);
    }

    setTotalServicesCount(result.totalCount);
    setHasMore(result.hasMore);
    setFeedLoading(false);
  }, [
    searchQuery,
    selectedLocation,
    selectedLocationObj,
    selectedCategory,
    selectedCategoryId,
    selectedServiceType,
    selectedPrice,
    isEmergencyOnly,
    isNearMeOnly
  ]);

  // Trigger Feed Query whenever main filters change
  useEffect(() => {
    setPage(1);
    fetchServicesFeed(true, 1);
  }, [fetchServicesFeed]);

  // Load More Handler
  const handleLoadMore = () => {
    if (!hasMore || feedLoading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchServicesFeed(false, nextPage);
  };

  // Toggle Save Service Handler
  const handleToggleSave = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (onToggleSave) {
      onToggleSave(id);
    }

    const isCurrentlySaved = savedServices.includes(id);
    if (isCurrentlySaved) {
      setSavedServices(prev => prev.filter(item => item !== id));
    } else {
      setSavedServices(prev => [...prev, id]);
    }

    const res = await SavedListingService.toggleSaveListing(id);
    if (res.requiresLogin) {
      onNavigate('/login');
    }
  };

  // Quick Action: Offer Your Service -> Direct /post/service Route
  const handleOfferServiceClick = () => {
    onNavigate('/post/service');
  };

  // Quick Action: Emergency Services -> Filter isEmergencyOnly
  const handleEmergencyServicesClick = () => {
    setIsEmergencyOnly(prev => !prev);
    if (feedRef.current) {
      feedRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Quick Action: Near Me -> Use profile location or open location modal
  const handleNearMeClick = () => {
    if (userProfileLocationObj) {
      setSelectedLocationObj(userProfileLocationObj);
      setSelectedLocation(userProfileLocationObj.displayName || 'Near You');
      setIsNearMeOnly(true);
      if (feedRef.current) {
        feedRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      setIsLocationModalOpen(true);
    }
  };

  // Clear All Filters
  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedLocation('All Sri Lanka');
    setSelectedLocationObj(undefined);
    setSelectedCategory('All Categories');
    setSelectedCategoryId(undefined);
    setSelectedServiceType('All Types');
    setSelectedPrice('Any Price');
    setIsEmergencyOnly(false);
    setIsNearMeOnly(false);
  };

  const hasActiveFilters = 
    selectedCategory !== 'All Categories' || 
    selectedPrice !== 'Any Price' || 
    selectedServiceType !== 'All Types' || 
    selectedLocation !== 'All Sri Lanka' || 
    isEmergencyOnly ||
    isNearMeOnly ||
    searchQuery.trim() !== '';

  const getServiceCategoryIcon = (iconName: string) => {
    return getCategoryIconComponent({ iconKey: iconName, module: 'service', className: 'w-5 h-5 text-[#FF650A]' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-28 selection:bg-[#FF650A] selection:text-white">
      {/* Backdrop for Active Dropdowns */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 z-30 bg-black/10 backdrop-blur-3xs" 
          onClick={() => setActiveDropdown(null)} 
        />
      )}

      {/* Main Container - Desktop Max-Width System */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-6">
        
        {/* 1. HERO SLIDES CAROUSEL */}
        <ServiceHeroCarousel
          slides={heroSlides}
          onNavigate={onNavigate}
          onFilterHomeRepair={() => {
            setSelectedCategory('Home Services');
            if (feedRef.current) feedRef.current.scrollIntoView({ behavior: 'smooth' });
          }}
          onFilterDigitalCreative={() => {
            setSelectedCategory('Creative');
            if (feedRef.current) feedRef.current.scrollIntoView({ behavior: 'smooth' });
          }}
          onFilterNearMe={handleNearMeClick}
          onExploreAll={handleClearAllFilters}
        />

        {/* 2. FLOATING SEARCH & FILTERS BAR */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-md border border-slate-200/80 space-y-3 relative z-40">
          {/* Main Search Input */}
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3.5 py-2 border border-slate-200 focus-within:border-[#FF650A] focus-within:ring-2 focus-within:ring-[#FF650A]/20 transition-all">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && feedRef.current) {
                  feedRef.current.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              placeholder="Search services, skills, providers or keywords..."
              className="flex-1 bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 p-1"
                aria-label="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button 
              onClick={() => {
                if (feedRef.current) feedRef.current.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FF650A] hover:bg-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-500/20 tap-bounce shrink-0 cursor-pointer"
              aria-label="Search services"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Filter Pills Row */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
            {/* Location Filter Pill */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border font-semibold cursor-pointer tap-bounce shrink-0 transition-colors ${
                selectedLocation !== 'All Sri Lanka'
                  ? 'bg-orange-50 border-[#FF650A] text-[#FF650A]'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#FF650A] shrink-0" />
              <span className="text-[11px] font-bold text-slate-500">Location:</span>
              <span className="font-extrabold text-slate-900 truncate max-w-[100px] sm:max-w-[140px]">{selectedLocation}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {/* Category Filter Pill */}
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border font-semibold cursor-pointer tap-bounce shrink-0 transition-colors ${
                selectedCategory !== 'All Categories'
                  ? 'bg-orange-50 border-[#FF650A] text-[#FF650A]'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#FF650A] shrink-0" />
              <span className="text-[11px] font-bold text-slate-500">Category:</span>
              <span className="font-extrabold text-slate-900 truncate max-w-[110px] sm:max-w-[150px]">{selectedCategory}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {/* Price Filter Dropdown Pill */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsPriceModalOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border font-semibold cursor-pointer tap-bounce transition-colors ${
                  selectedPrice !== 'Any Price'
                    ? 'bg-orange-50 border-[#FF650A] text-[#FF650A]'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-[#FF650A] shrink-0" />
                <span className="text-[11px] font-bold text-slate-500">Price:</span>
                <span className="font-extrabold text-slate-900 truncate max-w-[100px]">{selectedPrice}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>
            </div>

            {/* Service Type Filter Dropdown Pill */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsServiceTypeModalOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border font-semibold cursor-pointer tap-bounce transition-colors ${
                  selectedServiceType !== 'All Types'
                    ? 'bg-orange-50 border-[#FF650A] text-[#FF650A]'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Wrench className="w-3.5 h-3.5 text-[#FF650A] shrink-0" />
                <span className="text-[11px] font-bold text-slate-500">Type:</span>
                <span className="font-extrabold text-slate-900 truncate max-w-[100px]">{selectedServiceType}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>
            </div>

            {/* More Filters button */}
            <button
              onClick={() => onNavigate('/filters')}
              className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FF650A] hover:bg-orange-600 text-white font-bold tap-bounce shadow-xs cursor-pointer ml-auto"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="text-[11px]">More Filters</span>
            </button>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Filters:</span>

              {selectedCategory !== 'All Categories' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-100 text-[#FF650A] font-bold text-[11px]">
                  Category: {selectedCategory}
                  <button onClick={() => { setSelectedCategory('All Categories'); setSelectedCategoryId(undefined); }} className="hover:text-orange-800 p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedPrice !== 'Any Price' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-100 text-[#FF650A] font-bold text-[11px]">
                  Price: {selectedPrice}
                  <button onClick={() => setSelectedPrice('Any Price')} className="hover:text-orange-800 p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedServiceType !== 'All Types' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-100 text-[#FF650A] font-bold text-[11px]">
                  Type: {selectedServiceType}
                  <button onClick={() => setSelectedServiceType('All Types')} className="hover:text-orange-800 p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedLocation !== 'All Sri Lanka' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-100 text-[#FF650A] font-bold text-[11px]">
                  Location: {selectedLocation}
                  <button onClick={() => { setSelectedLocation('All Sri Lanka'); setSelectedLocationObj(undefined); }} className="hover:text-orange-800 p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {isEmergencyOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-100 text-red-700 font-bold text-[11px]">
                  Emergency Services
                  <button onClick={() => setIsEmergencyOnly(false)} className="hover:text-red-900 p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {searchQuery.trim() !== '' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-200 text-slate-800 font-bold text-[11px]">
                  &quot;{searchQuery}&quot;
                  <button onClick={() => setSearchQuery('')} className="hover:text-slate-900 p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={handleClearAllFilters}
                className="text-[11px] font-bold text-slate-500 hover:text-[#FF650A] underline ml-auto cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* 3. QUICK ACTION CARDS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Action 1: Offer Your Service -> Direct /post/service Route */}
          <div 
            onClick={handleOfferServiceClick}
            className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:border-[#FF650A] hover:shadow-md transition-all tap-bounce group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF650A] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">Offer Your Service</h4>
                <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">Join thousands of verified providers.</p>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#FF650A] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Action 2: Emergency Services */}
          <div 
            onClick={handleEmergencyServicesClick}
            className={`rounded-2xl p-3.5 border shadow-xs flex items-center justify-between cursor-pointer hover:shadow-md transition-all tap-bounce group ${
              isEmergencyOnly 
                ? 'bg-red-50 border-red-500 text-red-900' 
                : 'bg-white border-slate-200/80 hover:border-red-400'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-100/80 text-red-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Siren className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">Emergency Services</h4>
                <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">24/7 urgent service response.</p>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Action 3: Near Me */}
          <div 
            onClick={handleNearMeClick}
            className={`rounded-2xl p-3.5 border shadow-xs flex items-center justify-between cursor-pointer hover:shadow-md transition-all tap-bounce group ${
              isNearMeOnly
                ? 'bg-orange-50 border-[#FF650A] text-orange-950'
                : 'bg-white border-slate-200/80 hover:border-orange-400'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-100/80 text-[#FF650A] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">Near Me</h4>
                <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">Find services in your location.</p>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#FF650A] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* 4. POPULAR SERVICE CATEGORIES */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
              Popular Service Categories
            </h2>
            <button 
              onClick={() => setIsCategoryModalOpen(true)}
              className="text-xs font-bold text-[#FF650A] hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All 30 Main Categories <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {SERVICES_CATEGORIES.slice(0, 14).map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setSelectedCategoryId(cat.id);
                  if (feedRef.current) feedRef.current.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border shadow-xs hover:border-[#FF650A] transition-all group tap-bounce cursor-pointer ${
                  selectedCategory.toLowerCase() === cat.name.toLowerCase()
                    ? 'border-[#FF650A] bg-orange-50/50'
                    : 'border-slate-200/80'
                }`}
              >
                <div className="w-11 h-11 rounded-2xl bg-orange-50 text-[#FF650A] flex items-center justify-center transition-transform group-hover:scale-105">
                  {getCategoryIconComponent({ iconKey: cat.icon, module: 'service', className: 'w-5 h-5 text-[#FF650A]' })}
                </div>
                <span className="text-[11px] font-bold text-slate-800 text-center leading-tight truncate w-full">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 5. FEATURED SERVICES SECTION */}
        {featuredItems.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                Featured Services
              </h2>
              <button 
                onClick={() => {
                  handleClearAllFilters();
                  if (feedRef.current) feedRef.current.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-bold text-[#FF650A] hover:underline flex items-center gap-1 cursor-pointer"
              >
                View All Services <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredItems.map((srv) => {
                const isSaved = savedServices.includes(srv.id);
                return (
                  <div
                    key={srv.id}
                    onClick={() => {
                      if (onOpenListingDetail) {
                        onOpenListingDetail(srv.id, 'services');
                      } else {
                        onNavigate(`/service/${srv.id}` as any);
                      }
                    }}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition-all group"
                  >
                    {/* Cover Photo */}
                    <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={srv.imageUrl}
                        alt={srv.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-lg bg-[#FF650A] text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                          FEATURED
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleToggleSave(srv.id, e)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white hover:bg-black/60 flex items-center justify-center backdrop-blur-xs tap-bounce cursor-pointer"
                        aria-label="Save service"
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                      </button>

                      <div className="absolute bottom-2.5 left-3">
                        <span className="px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                          {srv.categoryTag}
                        </span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 line-clamp-1 font-heading group-hover:text-[#FF650A] transition-colors">
                          {srv.title}
                        </h3>

                        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold mt-1">
                          <span>{srv.providerName}</span>
                          {srv.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />}
                        </div>

                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{srv.location}</span>
                        </div>
                      </div>

                      {/* Rating & Price */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span className="text-xs font-bold text-slate-900">{srv.rating}</span>
                          <span className="text-[11px] text-slate-400">({srv.reviewsCount})</span>
                        </div>
                        <div className="text-sm font-black text-[#FF650A] font-heading">
                          {srv.price} <span className="text-[11px] text-slate-500 font-normal">{srv.priceUnit}</span>
                        </div>
                      </div>

                      {/* WhatsApp & View Details Action buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <a
                          href={`https://wa.me/${srv.whatsappNumber}?text=Hi%20${encodeURIComponent(srv.providerName)},%20I%20saw%20your%20service%20listing%20on%20RENTOURA`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center hover:bg-[#20bd5a] tap-bounce shrink-0 shadow-xs"
                          aria-label="WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4 fill-white text-white" />
                        </a>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenListingDetail) {
                              onOpenListingDetail(srv.id, 'services');
                            } else {
                              onNavigate(`/service/${srv.id}` as any);
                            }
                          }}
                          className="flex-1 py-2 bg-[#FF650A] hover:bg-orange-600 text-white rounded-xl text-xs font-bold text-center tap-bounce shadow-xs cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. SERVICES NEAR YOU SECTION */}
        {nearYouItems.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#FF650A]" />
                Services Near You ({userProfileLocationObj?.displayName || 'Your Location'})
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {nearYouItems.map((near) => (
                <div
                  key={near.id}
                  onClick={() => {
                    if (onOpenListingDetail) {
                      onOpenListingDetail(near.id, 'services');
                    } else {
                      onNavigate(`/service/${near.id}` as any);
                    }
                  }}
                  className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-[#FF650A] hover:shadow-md transition-all tap-bounce group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={near.imageUrl}
                      alt={near.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate font-heading group-hover:text-[#FF650A] transition-colors">
                        {near.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{near.providerName} • {near.location}</p>
                      <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-slate-800">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{near.rating}</span>
                        <span className="text-slate-400 font-normal">({near.reviewsCount})</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <div className="text-xs font-black text-[#FF650A] font-heading">{near.price}</div>
                    <span className="text-[10px] text-slate-400">{near.priceUnit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. MAIN SERVICES FEED */}
        <div ref={feedRef} className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-heading">
                Explore Services
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {feedItems.length} of {totalServicesCount} verified service listings
              </p>
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleClearAllFilters}
                className="px-3 py-1.5 rounded-xl bg-orange-100 hover:bg-orange-200 text-[#FF650A] text-xs font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Clear Filters
              </button>
            )}
          </div>

          {/* Feed Grid */}
          {feedLoading && feedItems.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
              <RefreshCw className="w-8 h-8 animate-spin text-[#FF650A] mx-auto" />
              <p className="text-sm font-semibold text-slate-600">Loading service listings...</p>
            </div>
          ) : feedItems.length === 0 ? (
            <div className="py-16 text-center space-y-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs max-w-xl mx-auto">
              <div className="w-16 h-16 bg-orange-50 text-[#FF650A] rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 font-heading">No Services Found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  {hasActiveFilters 
                    ? "We couldn't find any service listings matching your selected filters. Try broadening your criteria or clearing filters."
                    : "There are currently no active service listings on Rentoura.lk. Be the first to offer a service!"}
                </p>
              </div>

              {hasActiveFilters ? (
                <button
                  onClick={handleClearAllFilters}
                  className="px-5 py-2.5 rounded-xl bg-[#FF650A] hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 tap-bounce cursor-pointer inline-flex items-center gap-2"
                >
                  <X className="w-4 h-4" /> Reset All Filters
                </button>
              ) : (
                <button
                  onClick={handleOfferServiceClick}
                  className="px-5 py-2.5 rounded-xl bg-[#FF650A] hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 tap-bounce cursor-pointer inline-flex items-center gap-2"
                >
                  <Wrench className="w-4 h-4" /> Post a Service Listing
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {feedItems.map((srv) => {
                const isSaved = savedServices.includes(srv.id);
                return (
                  <div
                    key={srv.id}
                    onClick={() => {
                      if (onOpenListingDetail) {
                        onOpenListingDetail(srv.id, 'services');
                      } else {
                        onNavigate(`/service/${srv.id}` as any);
                      }
                    }}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-orange-300 transition-all group"
                  >
                    {/* Cover Photo */}
                    <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={srv.imageUrl}
                        alt={srv.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button
                        onClick={(e) => handleToggleSave(srv.id, e)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white hover:bg-black/60 flex items-center justify-center backdrop-blur-xs tap-bounce cursor-pointer"
                        aria-label="Save service"
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                      </button>

                      <div className="absolute bottom-2.5 left-3">
                        <span className="px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                          {srv.categoryTag}
                        </span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 line-clamp-1 font-heading group-hover:text-[#FF650A] transition-colors">
                          {srv.title}
                        </h3>

                        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold mt-1">
                          <span>{srv.providerName}</span>
                          {srv.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />}
                        </div>

                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{srv.location}</span>
                        </div>

                        {srv.description && (
                          <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                            {srv.description}
                          </p>
                        )}
                      </div>

                      {/* Service Type & Rating */}
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold">
                          <Clock className="w-3 h-3 text-slate-500" />
                          Verified Service
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span className="font-bold text-slate-900">{srv.rating}</span>
                        </div>
                      </div>

                      {/* Price & Actions Row */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div>
                          <div className="text-base font-black text-[#FF650A] font-heading">
                            {srv.price}
                          </div>
                          <span className="text-[10px] text-slate-400 block">{srv.priceUnit}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <a
                            href={`https://wa.me/${srv.whatsappNumber}?text=Hi%20${encodeURIComponent(srv.providerName)},%20I%20saw%20your%20listing%20on%20RENTOURA`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center hover:bg-[#20bd5a] tap-bounce shrink-0 shadow-xs"
                            aria-label="WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4 fill-white text-white" />
                          </a>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onOpenListingDetail) {
                                onOpenListingDetail(srv.id, 'services');
                              } else {
                                onNavigate(`/service/${srv.id}` as any);
                              }
                            }}
                            className="px-3 py-2 bg-[#FF650A] hover:bg-orange-600 text-white rounded-xl text-xs font-bold text-center tap-bounce shadow-xs cursor-pointer"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center pt-6">
              <button
                onClick={handleLoadMore}
                disabled={feedLoading}
                className="px-8 py-3 bg-white border border-slate-300 hover:border-[#FF650A] hover:bg-orange-50 text-[#FF650A] font-bold text-xs sm:text-sm rounded-xl shadow-xs tap-bounce transition-all cursor-pointer inline-flex items-center gap-2"
              >
                {feedLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Loading More Services...</span>
                  </>
                ) : (
                  <span>Load More Services</span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* 8. TRUST BANNER */}
        <div className="bg-gradient-to-r from-[#FF5100] via-[#FF650A] to-[#FF8C38] text-white rounded-3xl p-5 sm:p-6 flex items-center justify-between gap-4 shadow-lg shadow-orange-500/20">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 border border-white/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold font-heading text-white">Safe. Trusted. Verified.</h3>
              <p className="text-xs text-orange-100 truncate max-w-md">
                All service providers are verified for your security and safety.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('/help')}
            className="px-4 py-2.5 rounded-xl bg-white text-[#FF650A] hover:bg-orange-50 text-xs font-extrabold flex items-center gap-1.5 shrink-0 tap-bounce shadow-sm cursor-pointer"
          >
            Learn More <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Global Shared Location Modal */}
      <GlobalLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedLocation={selectedLocation}
        onSelectLocation={(locStr, locObj) => {
          setSelectedLocation(locStr);
          setSelectedLocationObj(locObj);
          setIsLocationModalOpen(false);
        }}
        accentColor="#FF650A"
        title="Select Service Location"
      />

      {/* Services Category Modal */}
      <ServiceCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        selectedCategory={selectedCategory}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={(categoryName, categoryId) => {
          setSelectedCategory(categoryName);
          setSelectedCategoryId(categoryId);
          setIsCategoryModalOpen(false);
        }}
      />

      {/* PRICE RANGE SELECTOR MODAL */}
      {isPriceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#FF650A]" />
                <span>Select Price Range</span>
              </h3>
              <button
                onClick={() => setIsPriceModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center cursor-pointer tap-bounce"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 space-y-1.5">
              {priceOptions.map((pr) => {
                const isSelected = selectedPrice === pr;
                return (
                  <button
                    key={pr}
                    onClick={() => {
                      setSelectedPrice(pr);
                      setIsPriceModalOpen(false);
                      if (feedRef.current) feedRef.current.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between text-xs font-medium cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-[#FF650A] bg-orange-50/80 text-[#FF650A] font-bold'
                        : 'border-slate-100 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <span>{pr}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#FF650A] stroke-[3]" />}
                  </button>
                );
              })}
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50 text-right">
              <button
                onClick={() => setIsPriceModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SERVICE TYPE SELECTOR MODAL */}
      {isServiceTypeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#FF650A]" />
                <span>Select Service Type</span>
              </h3>
              <button
                onClick={() => setIsServiceTypeModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center cursor-pointer tap-bounce"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 space-y-1.5">
              {serviceTypeOptions.map((st) => {
                const isSelected = selectedServiceType === st;
                return (
                  <button
                    key={st}
                    onClick={() => {
                      setSelectedServiceType(st);
                      setIsServiceTypeModalOpen(false);
                      if (feedRef.current) feedRef.current.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between text-xs font-medium cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-[#FF650A] bg-orange-50/80 text-[#FF650A] font-bold'
                        : 'border-slate-100 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <span>{st}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#FF650A] stroke-[3]" />}
                  </button>
                );
              })}
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50 text-right">
              <button
                onClick={() => setIsServiceTypeModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
