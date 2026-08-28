import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CategoryIcon, getCategoryIconComponent } from '../components/CategoryIcon';
import { 
  Search, 
  ChevronDown, 
  SlidersHorizontal, 
  Home,
  LayoutGrid, 
  Heart, 
  MapPin, 
  Plus, 
  ArrowRight,
  Users,
  Snowflake,
  Cpu,
  Bath,
  Bed,
  RefreshCw,
  AlertCircle,
  X,
  Filter,
  Loader2,
  CheckCircle2,
  Car
} from 'lucide-react';
import { AppRoute, FeaturedListingItem } from '../types';
import { RentalHeroCarousel } from '../components/RentalHeroCarousel';
import { GlobalLocationModal } from '../components/common/GlobalLocationModal';
import { RentalCategoryModal } from '../components/RentalCategoryModal';
import { RentalService, RentalCategoryRecord } from '../services/rentalService';
import { SavedListingService } from '../services/savedListingService';

interface RentalsPageProps {
  onNavigate: (route: AppRoute) => void;
  savedListings: string[];
  onToggleSave: (id: string) => void;
  onOpenListingDetail?: (id: string, moduleHint?: 'rentals' | 'jobs' | 'services') => void;
}

export const RentalsPage: React.FC<RentalsPageProps> = ({ 
  onNavigate,
  savedListings: parentSavedListings,
  onToggleSave: parentOnToggleSave,
  onOpenListingDetail
}) => {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Sri Lanka');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | undefined>(undefined);
  const [selectedPrice, setSelectedPrice] = useState('Any Price');
  const [selectedPeriod, setSelectedPeriod] = useState('Any Period');

  // UI Modal States
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);

  // Supabase Data States
  const [featuredRentals, setFeaturedRentals] = useState<FeaturedListingItem[]>([]);
  const [nearYouRentals, setNearYouRentals] = useState<FeaturedListingItem[]>([]);
  const [rentalFeed, setRentalFeed] = useState<FeaturedListingItem[]>([]);
  const [localSavedListings, setLocalSavedListings] = useState<string[]>(parentSavedListings || []);
  useEffect(() => setLocalSavedListings(parentSavedListings || []), [parentSavedListings]);
  const [browseCategories, setBrowseCategories] = useState<RentalCategoryRecord[]>([]);

  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);

  const categoriesRef = useRef<HTMLDivElement>(null);
  const mainFeedRef = useRef<HTMLDivElement>(null);

  const priceOptions = ['Any Price', '< Rs. 25,000', 'Rs. 25,000 - 75,000', 'Rs. 75,000 - 150,000', 'Rs. 150,000+'];
  const periodOptions = ['Any Period', 'Per Day', 'Per Week', 'Per Month', 'Per Event'];

  // Load Saved Listings from Supabase
  useEffect(() => {
    let active = true;
    RentalService.getRentalCategories().then(categories => { if (active) setBrowseCategories(categories.filter(category => category.level === 1).slice(0, 8)); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    SavedListingService.getSavedListingIds().then(ids => {
      if (isMounted && ids) {
        setLocalSavedListings(ids);
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Fetch Featured Rentals on Mount
  useEffect(() => {
    let isMounted = true;
    async function loadInitialData() {
      const featuredData = await RentalService.getFeaturedRentals();

      if (isMounted) {
        setFeaturedRentals(featuredData);
      }
    }
    loadInitialData();
    return () => { isMounted = false; };
  }, []);

  // Fetch Near You Rentals when Location Changes
  useEffect(() => {
    let isMounted = true;
    RentalService.getNearYouRentals(selectedLocation).then(nearData => {
      if (isMounted) setNearYouRentals(nearData);
    });
    return () => { isMounted = false; };
  }, [selectedLocation]);

  // Fetch Main Rental Feed when Filters Change
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    if (selectedLocation !== 'All Sri Lanka') {
      RentalService.logLocationSearchEvent(selectedLocation, 'rental');
    }

    RentalService.getRentalFeed({
      searchQuery,
      selectedLocation,
      selectedCategory,
      selectedCategoryId,
      selectedCategorySlug,
      selectedPrice,
      selectedPeriod,
      offset: 0,
      limit: 12
    }).then(res => {
      if (isMounted) {
        setRentalFeed(res.items);
        setTotalCount(res.totalCount);
        setHasMore(res.hasMore);
        setIsLoading(false);
      }
    });

    return () => { isMounted = false; };
  }, [searchQuery, selectedLocation, selectedCategory, selectedCategoryId, selectedCategorySlug, selectedPrice, selectedPeriod]);

  // Handle Load More
  const handleLoadMore = async () => {
    if (isMoreLoading || !hasMore) return;
    setIsMoreLoading(true);

    const res = await RentalService.getRentalFeed({
      searchQuery,
      selectedLocation,
      selectedCategory,
      selectedCategoryId,
      selectedCategorySlug,
      selectedPrice,
      selectedPeriod,
      offset: rentalFeed.length,
      limit: 12
    });

    setRentalFeed(prev => [...prev, ...res.items]);
    setHasMore(res.hasMore);
    setTotalCount(res.totalCount);
    setIsMoreLoading(false);
  };

  // Toggle Save with Supabase
  const handleToggleSaveListing = async (listingId: string) => {
    parentOnToggleSave(listingId);
  };

  // Open Detail Page
  const handleCardClick = (id: string) => {
    if (onOpenListingDetail) {
      onOpenListingDetail(id, 'rentals');
    } else {
      onNavigate(`/rentals/${id}` as AppRoute);
    }
  };

  const scrollToFeed = () => {
    if (mainFeedRef.current) {
      mainFeedRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedLocation('All Sri Lanka');
    setSelectedCategory('All Categories');
    setSelectedCategoryId(undefined);
    setSelectedCategorySlug(undefined);
    setSelectedPrice('Any Price');
    setSelectedPeriod('Any Period');
  };

  const exploreAllRentals = () => {
    clearAllFilters();
    window.setTimeout(scrollToFeed, 0);
  };

  const scrollToCategories = () => {
    categoriesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const hasActiveFilters = 
    searchQuery.trim() !== '' || 
    selectedLocation !== 'All Sri Lanka' || 
    selectedCategory !== 'All Categories' || 
    selectedPrice !== 'Any Price' || 
    selectedPeriod !== 'Any Period';

  const getCategoryIcon = (iconName: string) => {
    return getCategoryIconComponent({ iconKey: iconName, module: 'rental', className: 'w-5 h-5' });
  };

  const getSpecIcon = (icon: string) => {
    switch (icon) {
      case 'Bed': return <Bed className="w-3 h-3" />;
      case 'Bath': return <Bath className="w-3 h-3" />;
      case 'Car': return <Car className="w-3 h-3" />;
      case 'Cpu': return <Cpu className="w-3 h-3" />;
      case 'Users': return <Users className="w-3 h-3" />;
      case 'Snowflake': return <Snowflake className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-28 overflow-x-hidden selection:bg-[#1464F4] selection:text-white">
      <RentalHeroCarousel onNavigate={onNavigate} onExploreRentals={exploreAllRentals} onBrowseCategories={scrollToCategories} />

      {/* 2. FLOATING SEARCH & FILTER CONTROLS */}
      <div className="max-w-md lg:max-w-5xl mx-auto px-4 -mt-4 relative z-20 space-y-4">
        <div className="bg-white rounded-2xl p-3 shadow-md border border-slate-200/80 space-y-2.5">
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-1.5 border border-slate-200 focus-within:border-[#1464F4] transition-colors">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search homes, vehicles, rooms, equipment..."
              className="flex-1 bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none py-1.5 font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button 
              onClick={scrollToFeed}
              className="w-8 h-8 rounded-full bg-[#1464F4] text-white flex items-center justify-center shadow-md shadow-blue-500/25 tap-bounce shrink-0 cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[11px]">
            <div className="relative shrink-0">
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                  selectedLocation !== 'All Sri Lanka' 
                    ? 'border-[#1464F4] bg-blue-50 text-[#1464F4]' 
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-[#1464F4]" />
                <span className="text-[10.5px]">Location:</span>
                <span className="font-bold text-slate-900 truncate max-w-[80px]">{selectedLocation}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </div>

            <div className="relative shrink-0">
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                  selectedCategory !== 'All Categories' 
                    ? 'border-[#1464F4] bg-blue-50 text-[#1464F4]' 
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-[#1464F4]" />
                <span className="text-[10.5px]">Category:</span>
                <span className="font-bold text-slate-900 truncate max-w-[85px]">{selectedCategory}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </div>

            <div className="relative shrink-0">
              <button
                onClick={() => setIsPriceModalOpen(true)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                  selectedPrice !== 'Any Price' 
                    ? 'border-[#1464F4] bg-blue-50 text-[#1464F4]' 
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="text-[#1464F4] font-bold text-xs">◆</span>
                <span className="text-[10.5px]">Price:</span>
                <span className="font-bold text-slate-900 truncate max-w-[75px]">{selectedPrice}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </div>

            <div className="relative shrink-0">
              <button
                onClick={() => setIsPeriodModalOpen(true)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                  selectedPeriod !== 'Any Period' 
                    ? 'border-[#1464F4] bg-blue-50 text-[#1464F4]' 
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="text-[10px]">📅</span>
                <span className="text-[10.5px]">Period:</span>
                <span className="font-bold text-slate-900 truncate max-w-[75px]">{selectedPeriod}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </div>

            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#1464F4] text-white font-bold tap-bounce shadow-xs cursor-pointer"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span className="text-[10.5px]">All Categories</span>
            </button>
          </div>
        </div>

        {/* 3. ACTIVE FILTER CHIPS */}
        {hasActiveFilters && (
          <div className="flex items-center gap-1.5 flex-wrap bg-blue-50/80 p-2 rounded-xl border border-blue-100 text-xs">
            <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#1464F4]" /> Active Filters:
            </span>

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-blue-200 text-[#1464F4] font-bold text-[11px] shadow-xs">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-red-600 ml-0.5 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedLocation !== 'All Sri Lanka' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-blue-200 text-[#1464F4] font-bold text-[11px] shadow-xs">
                Location: {selectedLocation}
                <button onClick={() => setSelectedLocation('All Sri Lanka')} className="hover:text-red-600 ml-0.5 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCategory !== 'All Categories' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-blue-200 text-[#1464F4] font-bold text-[11px] shadow-xs">
                Category: {selectedCategory}
                <button 
                  onClick={() => {
                    setSelectedCategory('All Categories');
                    setSelectedCategoryId(undefined);
                    setSelectedCategorySlug(undefined);
                  }} 
                  className="hover:text-red-600 ml-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedPrice !== 'Any Price' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-blue-200 text-[#1464F4] font-bold text-[11px] shadow-xs">
                Price: {selectedPrice}
                <button onClick={() => setSelectedPrice('Any Price')} className="hover:text-red-600 ml-0.5 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedPeriod !== 'Any Period' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-blue-200 text-[#1464F4] font-bold text-[11px] shadow-xs">
                Period: {selectedPeriod}
                <button onClick={() => setSelectedPeriod('Any Period')} className="hover:text-red-600 ml-0.5 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="text-[11px] font-extrabold text-red-600 hover:underline ml-auto pl-2 cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}

        {/* 4. LIST YOUR RENTAL BANNER */}
        <div className="bg-gradient-to-r from-[#0D47A1] via-[#1464F4] to-[#1E88E5] text-white rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-md shadow-blue-500/20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 border border-white/30">
              <Home className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold font-heading text-white">List Your Rental</h3>
              <p className="text-[10px] text-blue-100 truncate max-w-[190px] sm:max-w-xs">
                Reach thousands of renters across Sri Lanka every day.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('/post/rental')}
            className="px-3 py-2 rounded-xl bg-white text-[#1464F4] hover:bg-blue-50 text-[11px] font-extrabold flex items-center gap-1 shrink-0 tap-bounce shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> List Your Rental <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* 5. BROWSE CATEGORIES */}
        <div ref={categoriesRef} className="space-y-3 scroll-mt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 font-heading">
              Browse Categories
            </h2>
            <button 
              onClick={() => setIsCategoryModalOpen(true)}
              className="text-xs font-bold text-[#1464F4] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
            {browseCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setSelectedCategoryId(cat.id);
                  setSelectedCategorySlug(cat.slug);
                  scrollToFeed();
                }}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white border transition-all group tap-bounce cursor-pointer ${
                  selectedCategory === cat.name 
                    ? 'border-[#1464F4] ring-2 ring-blue-500/20 shadow-md' 
                    : 'border-slate-200/80 shadow-xs hover:border-[#1464F4]'
                }`}
              >
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-blue-50 text-[#1464F4] transition-transform group-hover:scale-105">
                  {getCategoryIconComponent({ iconKey: cat.iconKey || undefined, module: 'rental', className: 'h-5 w-5' })}
                </div>
                <span className="text-[10.5px] font-bold text-slate-700 text-center leading-tight truncate w-full">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 6. FEATURED RENTALS SECTION */}
        {featuredRentals.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-1.5">
                <span>Featured Rentals</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#1464F4] text-[10px] font-black">
                  {featuredRentals.length}
                </span>
              </h2>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
              {featuredRentals.map((rental) => {
                const isSaved = localSavedListings.includes(rental.id);
                return (
                  <div
                    key={rental.id}
                    onClick={() => handleCardClick(rental.id)}
                    className="w-64 shrink-0 bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col cursor-pointer hover:shadow-md transition-shadow group"
                  >
                    <div className="relative h-36 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={rental.imageUrl}
                        alt={rental.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2 py-0.5 rounded-md bg-[#1464F4] text-white text-[9.5px] font-black uppercase tracking-wider shadow-sm">
                          FEATURED
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSaveListing(rental.id);
                        }}
                        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 text-white hover:bg-black/60 flex items-center justify-center backdrop-blur-xs tap-bounce cursor-pointer"
                        aria-label="Save listing"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                      </button>

                      <div className="absolute bottom-2 left-2.5">
                        <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold uppercase">
                          {rental.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 truncate font-heading group-hover:text-[#1464F4] transition-colors">
                          {rental.title}
                        </h3>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{rental.location}</span>
                        </div>
                      </div>

                      <div className="text-xs font-extrabold text-[#1464F4]">
                        {rental.price} <span className="text-[10px] text-slate-500 font-normal">{rental.pricePeriod}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 7. NEAR YOU SECTION */}
        {nearYouRentals.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-1.5">
                <span>Near You</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                  {nearYouRentals.length}
                </span>
              </h2>
            </div>

            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
              {nearYouRentals.map((item) => {
                const isSaved = localSavedListings.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleCardClick(item.id)}
                    className="w-40 shrink-0 bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs flex flex-col cursor-pointer hover:shadow-md transition-shadow group"
                  >
                    <div className="relative h-28 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSaveListing(item.id);
                        }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 text-white flex items-center justify-center tap-bounce cursor-pointer"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                      </button>
                      <div className="absolute bottom-1.5 left-2">
                        <span className="px-1.5 py-0.5 rounded bg-black/60 text-white text-[8px] font-bold uppercase">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 space-y-1">
                      <h4 className="text-[11px] font-bold text-slate-900 truncate group-hover:text-[#1464F4] transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-0.5 text-[10px] text-slate-500">
                        <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                      <div className="text-[11px] font-extrabold text-[#1464F4]">
                        {item.price} <span className="text-[9px] text-slate-500 font-normal">{item.pricePeriod}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 8. MAIN RENTAL LISTING FEED */}
        <div ref={mainFeedRef} className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 font-heading flex items-center gap-2">
                <span>All Rental Listings</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#1464F4] text-xs font-black">
                  {totalCount || rentalFeed.length}
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {hasActiveFilters ? 'Filtered results for rental marketplace' : 'Newest available rentals across Sri Lanka'}
              </p>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#1464F4]" />
              <p className="text-xs font-medium">Loading rentals from Supabase...</p>
            </div>
          ) : rentalFeed.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {rentalFeed.map((rental) => {
                  const isSaved = localSavedListings.includes(rental.id);
                  return (
                    <div
                      key={rental.id}
                      onClick={() => handleCardClick(rental.id)}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col group"
                    >
                      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                        <img
                          src={rental.imageUrl}
                          alt={rental.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {rental.badgeType && (
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md bg-[#1464F4] text-white text-[9.5px] font-black uppercase tracking-wider shadow-sm">
                              {rental.badgeType}
                            </span>
                          </div>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSaveListing(rental.id);
                          }}
                          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs tap-bounce cursor-pointer"
                          aria-label="Save listing"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                        </button>

                        <div className="absolute bottom-2.5 left-2.5">
                          <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[9.5px] font-bold uppercase">
                            {rental.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#1464F4] transition-colors font-heading leading-snug">
                            {rental.title}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{rental.location}</span>
                          </div>
                        </div>

                        <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
                          <div className="text-sm font-extrabold text-[#1464F4]">
                            {rental.price} <span className="text-xs text-slate-500 font-normal">{rental.pricePeriod}</span>
                          </div>

                          {rental.specs && rental.specs.length > 0 && (
                            <div className="flex items-center gap-1 text-[10px] text-slate-600 font-medium">
                              {rental.specs.slice(0, 2).map((spec, i) => (
                                <div key={i} className="flex items-center gap-0.5 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                  {getSpecIcon(spec.icon)}
                                  <span>{spec.label}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Load More Rentals Pagination Control */}
              {hasMore && (
                <div className="pt-2 text-center space-y-2">
                  <p className="text-xs text-slate-500 font-medium">
                    Showing {rentalFeed.length} of {totalCount} Rentals
                  </p>
                  <button
                    onClick={handleLoadMore}
                    disabled={isMoreLoading}
                    className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#1464F4] font-extrabold border border-blue-200 text-xs shadow-xs tap-bounce cursor-pointer inline-flex items-center gap-2"
                  >
                    {isMoreLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading more...</span>
                      </>
                    ) : (
                      <>
                        <span>Load More Rentals</span>
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* TRUTHFUL EMPTY STATE */
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3.5 my-4 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1464F4] mx-auto flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-heading">No Rentals Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                  No rental listings match your current search and filter criteria in our live database. Try clearing filters or list your item.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 rounded-xl bg-[#1464F4] hover:bg-blue-600 text-white text-xs font-bold tap-bounce shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Clear All Filters</span>
                </button>
                <button
                  onClick={() => onNavigate('/post/rental')}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold tap-bounce border border-slate-200 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>List Your Rental</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RENTAL CATEGORY SELECTOR MODAL */}
      <RentalCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        selectedCategory={selectedCategory}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={(catName, catId, catSlug) => {
          setSelectedCategory(catName);
          setSelectedCategoryId(catId);
          setSelectedCategorySlug(catSlug);
          scrollToFeed();
        }}
      />

      {/* LOCATION SELECTOR MODAL */}
      <GlobalLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedLocation={selectedLocation}
        onSelectLocation={(locStr) => {
          setSelectedLocation(locStr);
          setIsLocationModalOpen(false);
          scrollToFeed();
        }}
        accentColor="#1464F4"
        title="Select Rental Location"
      />

      {/* PRICE RANGE SELECTOR MODAL */}
      {isPriceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <span className="text-[#1464F4]">◆</span>
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
                      scrollToFeed();
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between text-xs font-medium cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-[#1464F4] bg-blue-50/80 text-[#1464F4] font-bold'
                        : 'border-slate-100 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <span>{pr}</span>
                    {isSelected && <span className="text-[#1464F4] font-bold">✓</span>}
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

      {/* RENTAL PERIOD SELECTOR MODAL */}
      {isPeriodModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <span>📅</span>
                <span>Select Rental Period</span>
              </h3>
              <button
                onClick={() => setIsPeriodModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center cursor-pointer tap-bounce"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 space-y-1.5">
              {periodOptions.map((pd) => {
                const isSelected = selectedPeriod === pd;
                return (
                  <button
                    key={pd}
                    onClick={() => {
                      setSelectedPeriod(pd);
                      setIsPeriodModalOpen(false);
                      scrollToFeed();
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between text-xs font-medium cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-[#1464F4] bg-blue-50/80 text-[#1464F4] font-bold'
                        : 'border-slate-100 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <span>{pd}</span>
                    {isSelected && <span className="text-[#1464F4] font-bold">✓</span>}
                  </button>
                );
              })}
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50 text-right">
              <button
                onClick={() => setIsPeriodModalOpen(false)}
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
