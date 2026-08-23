import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Search, 
  X, 
  SlidersHorizontal, 
  Heart, 
  Phone, 
  Check, 
  MapPin, 
  Star, 
  Building2, 
  Bed, 
  Bath, 
  Car, 
  RefreshCw, 
  MessageCircle, 
  ChevronDown, 
  Home, 
  Briefcase, 
  Wrench,
  Layers,
  Sparkles,
  ExternalLink,
  Filter
} from 'lucide-react';
import { RentouraLogo } from '../components/RentouraLogo';
import { SEARCH_RESULTS_DEMO, SearchResultItem, SearchResultType } from '../data/searchResultsData';
import { ProfileService } from '../services/profileService';
import { AppRoute, FilterState } from '../types';
import { EmptyState } from '../components/common/StateComponents';

interface SearchResultsPageProps {
  onNavigate: (route: AppRoute) => void;
  savedListings: string[];
  onToggleSave: (id: string) => void;
  selectedLocation?: string;
  selectedCategoryPath?: string;
  filterState?: FilterState;
  onUpdateFilterState?: (newFilters: Partial<FilterState>) => void;
  onOpenLocationSelector: () => void;
  onOpenCategorySelector?: () => void;
  onOpenFilterModal: () => void;
  onOpenListingDetail?: (id: string, type: 'rental' | 'job' | 'service') => void;
}

const STOP_WORDS = new Set(['for', 'in', 'at', 'a', 'an', 'the', 'of', 'to', 'and', 'or', 'with', 'by', 'from', 'on', 'rs', 'lkr']);

function extractSearchTerms(rawQuery: string): string[] {
  const normalized = rawQuery.toLowerCase().trim().replace(/\s+/g, ' ');
  if (!normalized) return [];
  const tokens = normalized.split(' ').filter(Boolean);
  const filtered = tokens.filter(t => !STOP_WORDS.has(t));
  return filtered.length > 0 ? filtered : tokens;
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  onNavigate,
  savedListings,
  onToggleSave,
  selectedLocation,
  selectedCategoryPath,
  filterState,
  onUpdateFilterState,
  onOpenLocationSelector,
  onOpenCategorySelector = () => onNavigate('/select-category'),
  onOpenFilterModal,
  onOpenListingDetail
}) => {
  // Canonical Search query state derived from props
  const [query, setQuery] = useState(() => filterState?.searchQuery || '');

  // Active module tab: 'all' | 'rentals' | 'jobs' | 'services'
  const [activeModule, setActiveModule] = useState<'all' | 'rentals' | 'jobs' | 'services'>('all');

  // Sort State
  const [sortBy, setSortBy] = useState<'relevant' | 'newest' | 'price_asc' | 'price_desc' | 'salary_desc'>('relevant');
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Detail Modal for item view
  const [selectedItem, setSelectedItem] = useState<SearchResultItem | null>(null);
  const [showApplyModal, setShowApplyModal] = useState<SearchResultItem | null>(null);
  const [showCallModal, setShowCallModal] = useState<SearchResultItem | null>(null);

  // Keep query synced with filterState.searchQuery if changed externally
  React.useEffect(() => {
    if (filterState?.searchQuery !== undefined) {
      setQuery(filterState.searchQuery);
    }
  }, [filterState?.searchQuery]);

  const currentLocation = (selectedLocation || filterState?.selectedLocation || '').trim();
  const currentCategory = (selectedCategoryPath || filterState?.selectedCategory || '').trim();
  const currentPriceRange = filterState?.priceRange;

  // Dynamically compute ACTIVE filter chips — ONLY for genuine active filters!
  const activeChips = useMemo(() => {
    const chips: { id: string; label: string; icon: string; category: string }[] = [];

    if (currentLocation && currentLocation.toLowerCase() !== 'all sri lanka') {
      chips.push({ id: 'loc', label: currentLocation, icon: '📍', category: 'location' });
    }

    if (currentCategory && currentCategory.toLowerCase() !== 'all categories') {
      let icon = '🏠';
      if (currentCategory.toLowerCase().includes('job')) icon = '💼';
      else if (currentCategory.toLowerCase().includes('service')) icon = '🔧';
      else if (currentCategory.toLowerCase().includes('vehicle')) icon = '🚗';
      else if (currentCategory.toLowerCase().includes('equipment')) icon = '🚜';

      chips.push({ id: 'cat', label: currentCategory, icon, category: 'category' });
    }

    if (currentPriceRange && (currentPriceRange[0] > 0 || currentPriceRange[1] < 500000)) {
      chips.push({
        id: 'price',
        label: `Price: Rs. ${currentPriceRange[0].toLocaleString()} - ${currentPriceRange[1].toLocaleString()}`,
        icon: '🏷️',
        category: 'price'
      });
    }

    return chips;
  }, [currentLocation, currentCategory, currentPriceRange]);

  // Handle single chip removal
  const handleRemoveChip = (chipId: string) => {
    if (chipId === 'loc') {
      onUpdateFilterState?.({ selectedLocation: '' });
      return;
    }
    if (chipId === 'cat') {
      onUpdateFilterState?.({ selectedCategory: '' });
      return;
    }
    if (chipId === 'price') {
      onUpdateFilterState?.({ priceRange: [0, 500000] });
      return;
    }
  };

  // Clear all filters & query
  const handleClearAllChips = () => {
    setQuery('');
    onUpdateFilterState?.({
      searchQuery: '',
      selectedLocation: '',
      selectedCategory: '',
      priceRange: [0, 500000]
    });
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    onUpdateFilterState?.({ searchQuery: val });
  };

  // 1. Combine active user listings with public search demo listings
  const allListings = useMemo(() => {
    const userActiveListings = ProfileService.getUserListings()
      .filter(l => l.status === 'active')
      .map(l => {
        const itemType: SearchResultType = l.module === 'jobs' ? 'job' : (l.module === 'services' ? 'service' : 'rental');
        const numPrice = parseInt((l.price || '0').replace(/[^0-9]/g, ''), 10) || 50000;
        const item: SearchResultItem = {
          id: l.id,
          type: itemType,
          title: l.title,
          category: l.category,
          location: l.location,
          price: l.price,
          pricePeriod: l.pricePeriod || '/ Month',
          rawPrice: numPrice,
          imageUrl: l.imageUrl || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
          rentalFeatures: ['Verified Owner', 'Active Listing'],
          company: l.companyName || 'Employer',
          providerName: 'Verified Provider',
          phone: l.contactPhone || '0771234567'
        };
        return item;
      });
    return [...userActiveListings, ...SEARCH_RESULTS_DEMO];
  }, []);

  // 2. Filter base list by search query & active filters using strict AND logic
  const matchingBaseList = useMemo(() => {
    let list = [...allListings];

    // Explicit Location Filter (AND logic)
    if (currentLocation && currentLocation.toLowerCase() !== 'all sri lanka') {
      const locTarget = currentLocation.toLowerCase().split(',')[0].trim();
      list = list.filter(item => {
        const itemLoc = `${item.location || ''} ${item.city || ''} ${item.district || ''} ${item.province || ''} ${item.area || ''}`.toLowerCase();
        return itemLoc.includes(locTarget);
      });
    }

    // Explicit Category Filter (AND logic)
    if (currentCategory && currentCategory.toLowerCase() !== 'all categories') {
      const catTarget = currentCategory.toLowerCase().split('>')[0].trim();
      list = list.filter(item => {
        const itemCat = `${item.category || ''} ${item.title || ''} ${item.type || ''}`.toLowerCase();
        return itemCat.includes(catTarget) || catTarget.includes(item.category?.toLowerCase() || '');
      });
    }

    // Explicit Price Filter (AND logic)
    if (currentPriceRange && Array.isArray(currentPriceRange)) {
      const [minPrice, maxPrice] = currentPriceRange;
      if (minPrice > 0 || maxPrice < 500000) {
        list = list.filter(item => item.rawPrice >= minPrice && item.rawPrice <= maxPrice);
      }
    }

    // Keyword Search Query (AND logic across all extracted search terms)
    const terms = extractSearchTerms(query);
    if (terms.length > 0) {
      list = list.filter(item => {
        const itemSearchableText = `
          ${item.title || ''} 
          ${item.category || ''} 
          ${item.location || ''} 
          ${item.city || ''} 
          ${item.district || ''} 
          ${item.province || ''} 
          ${item.area || ''} 
          ${item.company || ''} 
          ${item.providerName || ''} 
          ${item.type || ''} 
          ${item.jobType || ''} 
          ${item.jobMode || ''} 
          ${(item.rentalFeatures || []).join(' ')} 
          ${(item.serviceFeatures || []).join(' ')}
        `.toLowerCase();

        // EVERY term in user's search query MUST be present in the listing's searchable text (AND logic)
        return terms.every(term => itemSearchableText.includes(term));
      });
    }

    return list;
  }, [allListings, query, currentLocation, currentCategory, currentPriceRange]);

  // 3. Derived module counts (SSOT)
  const counts = useMemo(() => {
    return {
      all: matchingBaseList.length,
      rentals: matchingBaseList.filter(item => item.type === 'rental').length,
      jobs: matchingBaseList.filter(item => item.type === 'job').length,
      services: matchingBaseList.filter(item => item.type === 'service').length
    };
  }, [matchingBaseList]);

  // 4. Filter by active module tab & sort
  const filteredResults = useMemo(() => {
    let list = matchingBaseList;

    if (activeModule === 'rentals') {
      list = list.filter(item => item.type === 'rental');
    } else if (activeModule === 'jobs') {
      list = list.filter(item => item.type === 'job');
    } else if (activeModule === 'services') {
      list = list.filter(item => item.type === 'service');
    }

    // Sort order
    const sorted = [...list];
    if (sortBy === 'price_asc') {
      sorted.sort((a, b) => a.rawPrice - b.rawPrice);
    } else if (sortBy === 'price_desc' || sortBy === 'salary_desc') {
      sorted.sort((a, b) => b.rawPrice - a.rawPrice);
    }

    return sorted;
  }, [matchingBaseList, activeModule, sortBy]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col pb-32">
      {/* Top Header - White Background with Light Logo matching Image 2 */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 pt-3 pb-3 border-b border-slate-100 flex items-center justify-between">
        {/* Left Back Arrow */}
        <button
          onClick={() => onNavigate('/')}
          className="w-9 h-9 -ml-1 flex items-center justify-center text-slate-800 hover:text-black rounded-full active:bg-slate-100 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.4]" />
        </button>

        {/* Center: Rentoura Logo (Light Theme) */}
        <button onClick={() => onNavigate('/')} className="focus:outline-none">
          <RentouraLogo variant="header" theme="light" />
        </button>

        {/* Right Actions: Heart, Chat (3), Bell (7) */}
        <div className="flex items-center gap-1.5 -mr-1">
          <button
            onClick={() => onNavigate('/saved')}
            className="w-8 h-8 flex items-center justify-center text-slate-700 hover:text-[#1464F4] transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[2]">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </button>

          <button
            onClick={() => onNavigate('/messages')}
            className="w-8 h-8 flex items-center justify-center text-slate-700 hover:text-[#1464F4] transition-colors relative"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[2]">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="absolute top-0 right-0 min-w-3.5 h-3.5 px-0.5 bg-[#1464F4] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          <button
            onClick={() => onNavigate('/messages')}
            className="w-8 h-8 flex items-center justify-center text-slate-700 hover:text-[#1464F4] transition-colors relative"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[2]">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <span className="absolute top-0 right-0 min-w-3.5 h-3.5 px-0.5 bg-[#1464F4] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
              7
            </span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="px-3.5 pt-3 max-w-md mx-auto w-full space-y-3">
        {/* Search Bar + Filter Button Matching Image 2 */}
        <div className="flex items-center gap-2">
          {/* Input Box */}
          <div className="flex-1 bg-white border border-slate-200/90 rounded-full px-3.5 py-2.5 flex items-center gap-2 shadow-2xs focus-within:border-[#1464F4] transition-all">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search rentals, jobs or services..."
              className="w-full text-[13.5px] font-medium text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
            />
            {query && (
              <button
                onClick={() => handleQueryChange('')}
                className="text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Blue Filter Button */}
          <button
            onClick={onOpenFilterModal}
            className="w-10 h-10 rounded-full bg-[#1464F4] text-white flex items-center justify-center shadow-md shadow-blue-500/25 active:scale-95 transition-all shrink-0"
            aria-label="Filters"
          >
            <SlidersHorizontal className="w-4 h-4 stroke-[2.4]" />
          </button>
        </div>

        {/* Active Filter Chips Row Matching Image 2 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          {activeChips.map((chip) => (
            <div
              key={chip.id}
              onClick={() => {
                if (chip.id === 'loc') onOpenLocationSelector();
                if (chip.id === 'cat') onOpenCategorySelector();
              }}
              className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-full text-[11.5px] font-medium text-slate-700 shadow-2xs cursor-pointer hover:border-blue-400 transition-colors"
            >
              <span>{chip.icon}</span>
              <span className="font-semibold text-slate-900">{chip.label}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveChip(chip.id);
                }}
                className="text-slate-400 hover:text-slate-700 ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {activeChips.length > 0 && (
            <button
              onClick={handleClearAllChips}
              className="shrink-0 text-[11.5px] font-bold text-[#1464F4] px-2 hover:underline"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Module Tabs (All, Rentals, Jobs, Services) Matching Image 2 */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
          {/* Tab 1: All */}
          <button
            onClick={() => setActiveModule('all')}
            className={`py-2 px-1 rounded-xl text-center transition-all flex items-center justify-center gap-1 text-[11px] font-bold ${
              activeModule === 'all'
                ? 'bg-[#1464F4] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>All</span>
            <span className={`text-[10px] ${activeModule === 'all' ? 'text-white/80' : 'text-slate-400'}`}>
              ({counts.all})
            </span>
          </button>

          {/* Tab 2: Rentals (Blue) */}
          <button
            onClick={() => setActiveModule('rentals')}
            className={`py-2 px-1 rounded-xl text-center transition-all flex items-center justify-center gap-1 text-[11px] font-bold ${
              activeModule === 'rentals'
                ? 'bg-[#1464F4] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-[#1464F4]" />
            <span>Rentals</span>
            <span className="text-[10px] text-slate-400">({counts.rentals})</span>
          </button>

          {/* Tab 3: Jobs (Green) */}
          <button
            onClick={() => setActiveModule('jobs')}
            className={`py-2 px-1 rounded-xl text-center transition-all flex items-center justify-center gap-1 text-[11px] font-bold ${
              activeModule === 'jobs'
                ? 'bg-[#08A34F] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-[#08A34F]" />
            <span>Jobs</span>
            <span className="text-[10px] text-slate-400">({counts.jobs})</span>
          </button>

          {/* Tab 4: Services (Orange) */}
          <button
            onClick={() => setActiveModule('services')}
            className={`py-2 px-1 rounded-xl text-center transition-all flex items-center justify-center gap-1 text-[11px] font-bold ${
              activeModule === 'services'
                ? 'bg-[#FF650A] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-[#FF650A]" />
            <span>Services</span>
            <span className="text-[10px] text-slate-400">({counts.services})</span>
          </button>
        </div>

        {/* Results Count & Sort Dropdown Row Matching Image 2 */}
        <div className="flex items-center justify-between pt-1">
          <div className="text-[14px] font-black text-slate-900">
            {filteredResults.length > 0 ? `${counts[activeModule]} Results found` : '0 Results found'}
          </div>

          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-1 text-[12px] font-bold text-slate-700 hover:text-slate-900 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs"
            >
              <span>Sort by:</span>
              <span className="text-[#1464F4]">
                {sortBy === 'relevant' ? 'Most Relevant' : sortBy === 'newest' ? 'Newest' : sortBy === 'price_asc' ? 'Price Low' : 'Price High'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Sort Dropdown Menu */}
            {isSortOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 p-1.5 space-y-0.5">
                {[
                  { key: 'relevant', label: 'Most Relevant' },
                  { key: 'newest', label: 'Newest First' },
                  { key: 'price_asc', label: 'Price: Low to High' },
                  { key: 'price_desc', label: 'Price: High to Low' },
                  { key: 'salary_desc', label: 'Salary: High to Low' }
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => {
                      setSortBy(opt.key as any);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-colors flex items-center justify-between ${
                      sortBy === opt.key ? 'bg-blue-50 text-[#1464F4]' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {sortBy === opt.key && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RESULTS LIST — EXACT CARDS MATCHING Image 2 */}
        <div className="space-y-3 pt-1">
          {filteredResults.length === 0 ? (
            <EmptyState
              variant="no_search"
              title="No Results Found"
              description="We couldn't find anything matching your query or active filters."
              primaryAction={{
                label: 'Clear Filters',
                onClick: handleClearAllChips
              }}
              secondaryAction={{
                label: 'Browse All',
                onClick: () => {
                  setQuery('');
                  setActiveModule('all');
                }
              }}
              className="mt-4"
            />
          ) : (
            filteredResults.map((item) => {
              const isSaved = savedListings.includes(item.id);

              /* 1. RENTAL CARD (Blue Identity) */
              if (item.type === 'rental') {
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (onOpenListingDetail) {
                        onOpenListingDetail(item.id, 'rental');
                      } else {
                        setSelectedItem(item);
                      }
                    }}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-row p-2.5 gap-3 hover:border-blue-300 transition-all cursor-pointer group"
                  >
                    {/* Left Image Area */}
                    <div className="relative w-36 h-36 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* RENTAL Badge */}
                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-[#1464F4] text-white text-[9.5px] font-black rounded-md tracking-wider uppercase shadow-xs">
                        RENTAL
                      </span>

                      {/* Heart Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSave(item.id);
                        }}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-white active:scale-90 transition-transform"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#EA384D] text-[#EA384D]' : 'text-white'}`} />
                      </button>

                      {/* Price Pill Overlay Bottom */}
                      <div className="absolute bottom-1.5 left-1.5 right-1.5 px-2 py-0.5 bg-black/75 backdrop-blur-xs rounded-md text-white text-[10.5px] font-extrabold text-center truncate">
                        {item.price} {item.pricePeriod}
                      </div>
                    </div>

                    {/* Right Details Area */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        {/* Title */}
                        <h4 className="text-[13.5px] font-black text-slate-900 line-clamp-2 leading-snug group-hover:text-[#1464F4] transition-colors">
                          {item.title}
                        </h4>

                        {/* Location */}
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1 truncate">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </div>

                        {/* Specs row */}
                        <div className="flex items-center gap-2 text-[10.5px] text-slate-600 mt-1.5 flex-wrap">
                          {item.beds && (
                            <span className="flex items-center gap-0.5">
                              <Bed className="w-3 h-3 text-slate-400" />
                              <span className="font-bold">{item.beds}</span> Beds
                            </span>
                          )}
                          {item.baths && (
                            <span className="flex items-center gap-0.5">
                              <Bath className="w-3 h-3 text-slate-400" />
                              <span className="font-bold">{item.baths}</span> Baths
                            </span>
                          )}
                          {item.parking && (
                            <span className="flex items-center gap-0.5">
                              <Car className="w-3 h-3 text-slate-400" />
                              <span>Parking</span>
                            </span>
                          )}
                          {item.sqft && (
                            <span className="px-1.5 py-0.5 bg-blue-50 text-[#1464F4] text-[9.5px] font-bold rounded-md">
                              {item.sqft}
                            </span>
                          )}
                        </div>

                        {/* Feature Tags */}
                        {item.rentalFeatures && (
                          <div className="flex items-center gap-1 mt-1.5 overflow-hidden">
                            {item.rentalFeatures.slice(0, 3).map((feat, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[9.5px] font-medium rounded-md truncate"
                              >
                                {feat}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Owner Footer */}
                      {item.owner && (
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-1.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <img
                              src={item.owner.avatarUrl}
                              alt={item.owner.name}
                              className="w-5 h-5 rounded-full object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-0.5 text-[10.5px] font-bold text-slate-800 truncate">
                                <span>{item.owner.name}</span>
                                {item.owner.verified && (
                                  <span className="text-[#1464F4] text-[9px]">✔</span>
                                )}
                              </div>
                              <div className="text-[8.5px] text-slate-400 truncate">
                                Member since {item.owner.memberSince} • {item.owner.listingsCount} listings
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowCallModal(item);
                            }}
                            className="w-7 h-7 rounded-full border border-blue-200 text-[#1464F4] hover:bg-blue-50 flex items-center justify-center shrink-0 ml-1"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              /* 2. JOB CARD (Green Identity) */
              if (item.type === 'job') {
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (onOpenListingDetail) {
                        onOpenListingDetail(item.id, 'job');
                      } else {
                        setSelectedItem(item);
                      }
                    }}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-row p-2.5 gap-3 hover:border-emerald-300 transition-all cursor-pointer group"
                  >
                    {/* Left Image Area */}
                    <div className="relative w-36 h-36 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* JOB Badge */}
                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-[#08A34F] text-white text-[9.5px] font-black rounded-md tracking-wider uppercase shadow-xs">
                        JOB
                      </span>

                      {/* Heart Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSave(item.id);
                        }}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-white active:scale-90 transition-transform"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#EA384D] text-[#EA384D]' : 'text-white'}`} />
                      </button>

                      {/* Salary Overlay Bottom */}
                      <div className="absolute bottom-1.5 left-1.5 right-1.5 px-2 py-0.5 bg-black/75 backdrop-blur-xs rounded-md text-white text-[10px] font-extrabold text-center truncate">
                        {item.price}
                      </div>
                    </div>

                    {/* Right Details Area */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        {/* Title */}
                        <h4 className="text-[13.5px] font-black text-slate-900 line-clamp-1 group-hover:text-[#08A34F] transition-colors">
                          {item.title}
                        </h4>

                        {/* Company */}
                        <div className="flex items-center gap-1 text-[11.5px] font-bold text-slate-700 mt-0.5 truncate">
                          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{item.company}</span>
                        </div>

                        {/* Location + Full Time */}
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{item.location}</span>
                          {item.jobType && (
                            <span className="px-1.5 py-0.5 bg-emerald-50 text-[#08A34F] text-[9.5px] font-bold rounded-md shrink-0">
                              {item.jobType}
                            </span>
                          )}
                        </div>

                        {/* Feature Tags */}
                        <div className="flex items-center gap-1 mt-1.5 overflow-hidden">
                          {item.experience && (
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[9.5px] font-medium rounded-md">
                              {item.experience}
                            </span>
                          )}
                          {item.education && (
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[9.5px] font-medium rounded-md truncate">
                              {item.education}
                            </span>
                          )}
                          {item.jobMode && (
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[9.5px] font-medium rounded-md">
                              {item.jobMode}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Job Footer: Posted time + Apply Button */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-1.5">
                        <div className="text-[9.5px] text-slate-400">
                          {item.postedTime} • 👥 {item.applicantsCount} applicants
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowApplyModal(item);
                          }}
                          className="px-3 py-1 bg-[#08A34F] hover:bg-emerald-700 text-white font-bold text-[11px] rounded-xl shadow-xs active:scale-95 transition-all"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              /* 3. SERVICE CARD (Orange Identity) */
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (onOpenListingDetail) {
                      onOpenListingDetail(item.id, 'service');
                    } else {
                      setSelectedItem(item);
                    }
                  }}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-row p-2.5 gap-3 hover:border-orange-300 transition-all cursor-pointer group"
                >
                  {/* Left Image Area */}
                  <div className="relative w-36 h-36 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* SERVICE Badge */}
                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-[#FF650A] text-white text-[9.5px] font-black rounded-md tracking-wider uppercase shadow-xs">
                      SERVICE
                    </span>

                    {/* Heart Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(item.id);
                      }}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-white active:scale-90 transition-transform"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#EA384D] text-[#EA384D]' : 'text-white'}`} />
                    </button>

                    {/* Price Overlay Bottom */}
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 px-2 py-0.5 bg-black/75 backdrop-blur-xs rounded-md text-white text-[10.5px] font-extrabold text-center truncate">
                      {item.price} {item.pricePeriod}
                    </div>
                  </div>

                  {/* Right Details Area */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      {/* Title */}
                      <h4 className="text-[13.5px] font-black text-slate-900 line-clamp-1 group-hover:text-[#FF650A] transition-colors">
                        {item.title}
                      </h4>

                      {/* Provider */}
                      <div className="flex items-center gap-1 text-[11.5px] font-bold text-slate-800 mt-0.5 truncate">
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{item.providerName}</span>
                        {item.providerVerified && (
                          <span className="text-[#1464F4] text-[9.5px]">✔</span>
                        )}
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>

                      {/* Rating */}
                      {item.rating && (
                        <div className="flex items-center gap-1 mt-1 text-[11px]">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-slate-900">{item.rating}</span>
                          <span className="text-slate-400 text-[10px]">({item.reviewsCount} reviews)</span>
                        </div>
                      )}

                      {/* Service Tags */}
                      {item.serviceFeatures && (
                        <div className="flex items-center gap-1 mt-1.5 overflow-hidden">
                          {item.serviceFeatures.slice(0, 3).map((feat, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[9.5px] font-medium rounded-md truncate"
                            >
                              {feat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Service Footer: WhatsApp + View Details */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item.whatsappNumber) {
                            window.open(`https://wa.me/${item.whatsappNumber}`, '_blank');
                          }
                        }}
                        className="w-7 h-7 rounded-full bg-emerald-50 text-[#08A34F] border border-emerald-200 flex items-center justify-center shrink-0 hover:bg-emerald-100"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(item);
                        }}
                        className="px-3 py-1 bg-[#FF650A] hover:bg-orange-600 text-white font-bold text-[11px] rounded-xl shadow-xs active:scale-95 transition-all"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Load More Results Button Matching Image 2 */}
        {filteredResults.length > 0 && (
          <div className="pt-2 pb-1">
            <button
              onClick={() => {}}
              className="w-full py-2.5 px-4 bg-white border-2 border-blue-200 text-[#1464F4] font-bold text-[13px] rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-50 active:scale-[0.99] transition-all shadow-2xs"
            >
              <RefreshCw className="w-4 h-4 stroke-[2.2]" />
              <span>Load More Results</span>
            </button>
          </div>
        )}

        {/* Active Filters Docked Summary Bar Matching Image 2 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1464F4] flex items-center justify-center shrink-0">
              <Filter className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="text-[12px] font-bold text-slate-900">
                Active Filters ({activeChips.length})
              </div>
              <div className="text-[10.5px] text-slate-500 truncate">
                {activeChips.map(c => c.label).join(' • ')}
              </div>
            </div>
          </div>

          <button
            onClick={onOpenFilterModal}
            className="text-[11.5px] font-bold text-[#1464F4] hover:underline shrink-0 ml-2"
          >
            Edit Filters ›
          </button>
        </div>
      </div>

      {/* DETAIL MODAL DIALOG */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md max-h-[85vh] rounded-t-3xl sm:rounded-3xl p-5 flex flex-col shadow-2xl animate-in slide-in-from-bottom-5 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-white text-[10px] font-black rounded-md uppercase ${
                  selectedItem.type === 'rental' ? 'bg-[#1464F4]' : selectedItem.type === 'job' ? 'bg-[#08A34F]' : 'bg-[#FF650A]'
                }`}>
                  {selectedItem.type}
                </span>
                <span className="text-[12px] font-bold text-slate-500">{selectedItem.category}</span>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative w-full h-48 rounded-2xl overflow-hidden">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs px-3 py-1 rounded-xl text-white font-extrabold text-[14px]">
                {selectedItem.price} {selectedItem.pricePeriod || ''}
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-[17px] font-black text-slate-900 leading-snug">
                {selectedItem.title}
              </h2>
              <div className="flex items-center gap-1.5 text-[12.5px] text-slate-500">
                <MapPin className="w-4 h-4 text-[#1464F4]" />
                <span>{selectedItem.location}</span>
              </div>
            </div>

            {selectedItem.rentalFeatures && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Features & Amenities</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedItem.rentalFeatures.map((f, i) => (
                    <span key={i} className="px-2.5 py-1 bg-blue-50 text-[#1464F4] text-[11px] font-bold rounded-xl">
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  onToggleSave(selectedItem.id);
                }}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[13px] rounded-2xl flex items-center justify-center gap-1.5"
              >
                <Heart className={`w-4 h-4 ${savedListings.includes(selectedItem.id) ? 'fill-[#EA384D] text-[#EA384D]' : ''}`} />
                <span>{savedListings.includes(selectedItem.id) ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={() => {
                  setSelectedItem(null);
                  if (selectedItem.type === 'job') setShowApplyModal(selectedItem);
                  else setShowCallModal(selectedItem);
                }}
                className={`flex-1 py-3 text-white font-bold text-[13px] rounded-2xl flex items-center justify-center gap-1.5 ${
                  selectedItem.type === 'rental' ? 'bg-[#1464F4]' : selectedItem.type === 'job' ? 'bg-[#08A34F]' : 'bg-[#FF650A]'
                }`}
              >
                <span>{selectedItem.type === 'job' ? 'Apply Now' : 'Contact Now'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK APPLY MODAL */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-black text-slate-900">
                Apply for {showApplyModal.title}
              </h3>
              <button onClick={() => setShowApplyModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[12px] text-slate-500">
              Submit your application to <span className="font-bold text-slate-800">{showApplyModal.company}</span>.
            </p>
            <input
              type="text"
              placeholder="Your Full Name"
              defaultValue="Mohamed Muzakkir"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:border-[#08A34F]"
            />
            <input
              type="tel"
              placeholder="Phone Number (+94 ...)"
              defaultValue="+94 77 123 4567"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:border-[#08A34F]"
            />
            <textarea
              rows={3}
              placeholder="Brief note or link to CV..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:border-[#08A34F]"
            ></textarea>
            <button
              onClick={() => {
                alert('Application submitted successfully!');
                setShowApplyModal(null);
              }}
              className="w-full py-3 bg-[#08A34F] text-white font-bold text-[14px] rounded-xl hover:bg-emerald-700 shadow-md"
            >
              Submit Application
            </button>
          </div>
        </div>
      )}

      {/* CALL / CONTACT MODAL */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1464F4] flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-[16px] font-black text-slate-900">
              {showCallModal.owner?.name || showCallModal.providerName || 'Listing Contact'}
            </h3>
            <p className="text-[12.5px] text-slate-500">
              Direct phone contact for <span className="font-bold text-slate-800">{showCallModal.title}</span>
            </p>
            <div className="py-2 px-4 bg-slate-100 rounded-2xl text-[16px] font-extrabold text-slate-900 tracking-wider">
              {showCallModal.owner?.phone || showCallModal.phone || '+94 77 123 4567'}
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowCallModal(null)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-[13px] rounded-xl"
              >
                Close
              </button>
              <a
                href={`tel:${showCallModal.owner?.phone || showCallModal.phone || '+94771234567'}`}
                className="flex-1 py-2.5 bg-[#1464F4] text-white font-bold text-[13px] rounded-xl flex items-center justify-center gap-1 shadow-md"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
