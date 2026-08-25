import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  ArrowLeft, 
  Search, 
  X, 
  SlidersHorizontal, 
  Heart, 
  ChevronDown, 
  RotateCcw,
  Tag,
  MapPin,
  Sliders,
  Filter,
  Loader2,
  Home,
  Briefcase,
  Wrench,
  AlertCircle
} from 'lucide-react';
import { RentouraLogo } from '../components/RentouraLogo';
import { AppRoute, FilterState } from '../types';
import { SearchService, SearchResultItemRaw, SearchCounts } from '../services/searchService';
import { SearchResultCard } from '../components/SearchResultCard';
import { SearchFilterModal } from '../components/SearchFilterModal';

export interface SearchState {
  q: string;
  module: 'all' | 'rentals' | 'jobs' | 'services';
  categoryId: string | null;
  categoryName?: string;
  provinceId: string | null;
  districtId: string | null;
  cityId: string | null;
  areaId: string | null;
  locationName?: string;
  minPrice: number | null;
  maxPrice: number | null;
  sort: 'relevant' | 'newest' | 'price_low' | 'price_high';
}

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
  onOpenFilterModal?: () => void;
  onOpenListingDetail?: (id: string, type: 'rental' | 'job' | 'service') => void;
}

function parseUrlSearchParams(initialFilterState?: FilterState, propLoc?: string, propCat?: string): SearchState {
  const searchParams = new URLSearchParams(window.location.search);
  const qParam = searchParams.get('q');
  const modParam = searchParams.get('module');
  const catIdParam = searchParams.get('catId');
  const catNameParam = searchParams.get('catName');
  const provIdParam = searchParams.get('provId');
  const distIdParam = searchParams.get('distId');
  const cityIdParam = searchParams.get('cityId');
  const areaIdParam = searchParams.get('areaId');
  const locNameParam = searchParams.get('locName');
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  const sortParam = searchParams.get('sort');

  const q = qParam !== null ? qParam : (initialFilterState?.searchQuery || '');
  const module = ['all', 'rentals', 'jobs', 'services'].includes(modParam || '') ? (modParam as any) : 'all';
  const categoryId = catIdParam || null;
  const categoryName = catNameParam || propCat || initialFilterState?.selectedCategory || '';
  const provinceId = provIdParam || null;
  const districtId = distIdParam || null;
  const cityId = cityIdParam || null;
  const areaId = areaIdParam || null;
  const locationName = locNameParam || propLoc || initialFilterState?.selectedLocation || '';
  const minPrice = minPriceParam ? parseInt(minPriceParam, 10) || null : null;
  const maxPrice = maxPriceParam ? parseInt(maxPriceParam, 10) || null : null;
  const sort = ['relevant', 'newest', 'price_low', 'price_high'].includes(sortParam || '') ? (sortParam as any) : 'relevant';

  return {
    q,
    module,
    categoryId,
    categoryName,
    provinceId,
    districtId,
    cityId,
    areaId,
    locationName,
    minPrice,
    maxPrice,
    sort
  };
}

function updateUrlSearchParams(state: SearchState) {
  const params = new URLSearchParams();
  if (state.q.trim()) params.set('q', state.q.trim());
  if (state.module && state.module !== 'all') params.set('module', state.module);
  if (state.categoryId) params.set('catId', state.categoryId);
  if (state.categoryName && state.categoryName !== 'All Categories' && state.categoryName !== 'All') {
    params.set('catName', state.categoryName);
  }
  if (state.provinceId) params.set('provId', state.provinceId);
  if (state.districtId) params.set('distId', state.districtId);
  if (state.cityId) params.set('cityId', state.cityId);
  if (state.areaId) params.set('areaId', state.areaId);
  if (state.locationName && state.locationName !== 'All Sri Lanka' && state.locationName !== 'All') {
    params.set('locName', state.locationName);
  }
  if (state.minPrice !== null && state.minPrice !== undefined) params.set('minPrice', String(state.minPrice));
  if (state.maxPrice !== null && state.maxPrice !== undefined) params.set('maxPrice', String(state.maxPrice));
  if (state.sort && state.sort !== 'relevant') params.set('sort', state.sort);

  const queryString = params.toString();
  const targetUrl = queryString ? `/search?${queryString}` : '/search';
  if (window.location.pathname + window.location.search !== targetUrl) {
    window.history.replaceState(null, '', targetUrl);
  }
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
  // Master SearchState initialized from URL query string
  const [searchState, setSearchState] = useState<SearchState>(() => 
    parseUrlSearchParams(filterState, selectedLocation, selectedCategoryPath)
  );

  // Sync state to URL search parameters on change
  useEffect(() => {
    updateUrlSearchParams(searchState);
  }, [searchState]);

  // Dropdown & Filter Modal visibility
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Results state
  const [results, setResults] = useState<SearchResultItemRaw[]>([]);
  const [counts, setCounts] = useState<SearchCounts>({ all: 0, rentals: 0, jobs: 0, services: 0 });
  const [selectedTotal, setSelectedTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Loading & error state
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Request counter for race condition protection
  const requestCounterRef = useRef(0);

  // Sync external location prop if updated
  useEffect(() => {
    if (selectedLocation !== undefined && selectedLocation !== searchState.locationName) {
      setSearchState(prev => ({ ...prev, locationName: selectedLocation }));
    }
  }, [selectedLocation]);

  // Sync external category prop if updated
  useEffect(() => {
    if (selectedCategoryPath !== undefined && selectedCategoryPath !== searchState.categoryName) {
      setSearchState(prev => ({ ...prev, categoryName: selectedCategoryPath }));
    }
  }, [selectedCategoryPath]);

  // Execute RPC Search
  const performSearch = useCallback(async (opts?: { append?: boolean; overrideOffset?: number }) => {
    const isAppend = Boolean(opts?.append);
    const targetOffset = opts?.overrideOffset !== undefined ? opts.overrideOffset : (isAppend ? results.length : 0);

    if (isAppend) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
      setSearchError(null);
    }

    const currentRequestId = ++requestCounterRef.current;

    try {
      const response = await SearchService.search({
        query: searchState.q.trim(),
        module: searchState.module,
        categoryId: searchState.categoryId,
        provinceId: searchState.provinceId,
        districtId: searchState.districtId,
        cityId: searchState.cityId,
        areaId: searchState.areaId,
        minPrice: searchState.minPrice,
        maxPrice: searchState.maxPrice,
        sort: searchState.sort,
        limit: 12,
        offset: targetOffset
      });

      // Race protection: ignore stale responses
      if (currentRequestId !== requestCounterRef.current) {
        return;
      }

      setCounts(response.counts);
      setSelectedTotal(response.selected_total);
      setHasMore(response.has_more);

      if (isAppend) {
        setResults(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const fresh = response.results.filter(r => !existingIds.has(r.id));
          return [...prev, ...fresh];
        });
      } else {
        setResults(response.results);
      }
    } catch (err) {
      if (currentRequestId === requestCounterRef.current) {
        console.error('Error executing search:', err);
        setSearchError('Unable to complete search. Please check your connection and try again.');
        if (!isAppend) {
          setResults([]);
        }
      }
    } finally {
      if (currentRequestId === requestCounterRef.current) {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    }
  }, [searchState, results.length]);

  // Re-run search whenever any SearchState parameter changes
  useEffect(() => {
    performSearch({ append: false, overrideOffset: 0 });
  }, [
    searchState.q,
    searchState.module,
    searchState.categoryId,
    searchState.provinceId,
    searchState.districtId,
    searchState.cityId,
    searchState.areaId,
    searchState.locationName,
    searchState.minPrice,
    searchState.maxPrice,
    searchState.sort
  ]);

  // Compute active chips for current filter state
  const activeChips = useMemo(() => {
    const chips: { id: string; label: string; icon: string; category: string }[] = [];

    if (searchState.locationName && searchState.locationName.toLowerCase() !== 'all sri lanka' && searchState.locationName !== 'All') {
      chips.push({ id: 'loc', label: searchState.locationName, icon: '📍', category: 'location' });
    }

    if (searchState.categoryName && searchState.categoryName.toLowerCase() !== 'all categories' && searchState.categoryName !== 'All') {
      chips.push({ id: 'cat', label: searchState.categoryName, icon: '🏷️', category: 'category' });
    }

    if (searchState.minPrice !== null || searchState.maxPrice !== null) {
      const minStr = searchState.minPrice !== null ? `Rs. ${searchState.minPrice.toLocaleString()}` : 'Rs. 0';
      const maxStr = searchState.maxPrice !== null ? `Rs. ${searchState.maxPrice.toLocaleString()}` : 'Any';
      chips.push({
        id: 'price',
        label: `Price: ${minStr} - ${maxStr}`,
        icon: '💰',
        category: 'price'
      });
    }

    return chips;
  }, [searchState.locationName, searchState.categoryName, searchState.minPrice, searchState.maxPrice]);

  // Remove single filter chip
  const handleRemoveChip = (chipId: string) => {
    if (chipId === 'loc') {
      setSearchState(prev => ({
        ...prev,
        provinceId: null,
        districtId: null,
        cityId: null,
        areaId: null,
        locationName: ''
      }));
      onUpdateFilterState?.({ selectedLocation: '' });
    } else if (chipId === 'cat') {
      setSearchState(prev => ({
        ...prev,
        categoryId: null,
        categoryName: ''
      }));
      onUpdateFilterState?.({ selectedCategory: '' });
    } else if (chipId === 'price') {
      setSearchState(prev => ({
        ...prev,
        minPrice: null,
        maxPrice: null
      }));
      onUpdateFilterState?.({ priceRange: [0, 500000] });
    }
  };

  // Clear all filters completely
  const handleClearAllFilters = () => {
    setSearchState(prev => ({
      ...prev,
      module: 'all',
      categoryId: null,
      categoryName: '',
      provinceId: null,
      districtId: null,
      cityId: null,
      areaId: null,
      locationName: '',
      minPrice: null,
      maxPrice: null
    }));
    onUpdateFilterState?.({
      selectedLocation: '',
      selectedCategory: '',
      priceRange: [0, 500000]
    });
  };

  // Handle Query Submission
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUpdateFilterState?.({ searchQuery: searchState.q });
    performSearch({ append: false, overrideOffset: 0 });
  };

  // Clear Query Input
  const handleClearQuery = () => {
    setSearchState(prev => ({ ...prev, q: '' }));
    onUpdateFilterState?.({ searchQuery: '' });
  };

  // Open Listing Detail with route path
  const handleOpenDetail = (id: string, module: 'rental' | 'job' | 'service') => {
    if (onOpenListingDetail) {
      onOpenListingDetail(id, module);
    } else {
      if (module === 'job') {
        onNavigate('/job-detail');
      } else if (module === 'service') {
        onNavigate('/service-detail');
      } else {
        onNavigate('/rental-detail');
      }
    }
  };

  // Grammar count formatting
  const formatResultsCountText = () => {
    if (isLoading) return 'Searching listings...';
    if (selectedTotal === 0) return 'No active listings found';
    if (selectedTotal === 1) return '1 active listing found';
    return `${selectedTotal.toLocaleString()} active listings found`;
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col pb-32">
      {/* Top Navigation Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 pt-3 pb-3 border-b border-slate-100 flex items-center justify-between shadow-2xs">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="w-9 h-9 -ml-1 flex items-center justify-center text-slate-800 hover:text-black rounded-full active:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.4]" />
        </button>

        <button type="button" onClick={() => onNavigate('/')} className="focus:outline-none cursor-pointer">
          <RentouraLogo variant="header" theme="light" />
        </button>

        <div className="flex items-center gap-2 -mr-1">
          <button
            type="button"
            onClick={() => onNavigate('/saved')}
            className="w-9 h-9 flex items-center justify-center text-slate-700 hover:text-[#1464F4] transition-colors rounded-full active:bg-slate-100 cursor-pointer"
            aria-label="Saved listings"
          >
            <Heart className="w-5 h-5 stroke-[2]" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4">
        {/* Search Bar & Filter Trigger */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2.5 mb-4">
          <div className="relative flex-1 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center px-3.5 py-2.5 focus-within:border-[#1464F4] focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
            <input
              type="text"
              value={searchState.q}
              onChange={(e) => setSearchState(prev => ({ ...prev, q: e.target.value }))}
              placeholder="Search rentals, jobs, services in Sri Lanka..."
              className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
            />
            {searchState.q && (
              <button
                type="button"
                onClick={handleClearQuery}
                className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 ml-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className={`px-3.5 py-2.5 rounded-2xl border font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 tap-bounce ${
              activeChips.length > 0
                ? 'bg-blue-50 border-[#1464F4] text-[#1464F4] shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeChips.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#1464F4] text-white text-[10px] font-black flex items-center justify-center">
                {activeChips.length}
              </span>
            )}
          </button>
        </form>

        {/* Real Module Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All', count: counts.all, icon: Sliders },
            { id: 'rentals', label: 'Rentals', count: counts.rentals, icon: Home },
            { id: 'jobs', label: 'Jobs', count: counts.jobs, icon: Briefcase },
            { id: 'services', label: 'Services', count: counts.services, icon: Wrench },
          ].map((tab) => {
            const isActive = searchState.module === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setSearchState(prev => ({ ...prev, module: tab.id as any }));
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer tap-bounce ${
                  isActive
                    ? 'bg-[#1464F4] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 text-[10.5px] rounded-full font-extrabold ${
                    isActive ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {tab.count.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Filters Bar & Sort */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          {/* Active Chips */}
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-700">
              Active Filters ({activeChips.length}):
            </span>
            {activeChips.map((chip) => (
              <span
                key={chip.id}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-800 text-[11px] font-semibold shadow-2xs"
              >
                <span>{chip.icon}</span>
                <span className="truncate max-w-[150px]">{chip.label}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveChip(chip.id)}
                  className="w-4 h-4 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {activeChips.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="text-xs font-bold text-[#1464F4] hover:underline cursor-pointer ml-1"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 hover:bg-slate-50 shadow-2xs cursor-pointer"
            >
              <span className="text-slate-500 font-normal">Sort by:</span>
              <span>
                {searchState.sort === 'relevant'
                  ? 'Most Relevant'
                  : searchState.sort === 'newest'
                  ? 'Newest First'
                  : searchState.sort === 'price_low'
                  ? 'Price: Low to High'
                  : 'Price: High to Low'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                {[
                  { id: 'relevant', label: 'Most Relevant' },
                  { id: 'newest', label: 'Newest First' },
                  { id: 'price_low', label: 'Price: Low to High' },
                  { id: 'price_high', label: 'Price: High to Low' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSearchState(prev => ({ ...prev, sort: s.id as any }));
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                      searchState.sort === s.id
                        ? 'bg-blue-50 text-[#1464F4] font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results Counter & Search Status */}
        <div className="mt-4 mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-600">
            {formatResultsCountText()}
          </p>
        </div>

        {/* Error State */}
        {searchError && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{searchError}</span>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 h-40 animate-pulse flex gap-4"
              >
                <div className="w-40 bg-slate-200 rounded-xl h-full shrink-0" />
                <div className="flex-1 space-y-3 py-2">
                  <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                  <div className="h-3 bg-slate-200 rounded-md w-1/2" />
                  <div className="h-3 bg-slate-200 rounded-md w-1/3" />
                  <div className="h-5 bg-slate-200 rounded-md w-2/5 mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : results.length === 0 ? (
          /* Truthful Empty State - Zero Listings */
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-md mx-auto my-8 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#1464F4] flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading mb-1">
              No results found
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              We couldn&apos;t find any active listings matching your criteria. Try adjusting your search query or clearing filters.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
              {activeChips.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#1464F4] text-white text-xs font-bold hover:bg-blue-600 shadow-xs cursor-pointer"
                >
                  Clear All Filters
                </button>
              )}
              <button
                type="button"
                onClick={() => onNavigate('/rentals')}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Browse Rentals
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/jobs')}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Browse Jobs
              </button>
            </div>
          </div>
        ) : (
          /* Results Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {results.map((item) => (
              <SearchResultCard
                key={item.id}
                item={item}
                isSaved={savedListings.includes(item.id)}
                onToggleSave={onToggleSave}
                onOpenDetail={handleOpenDetail}
              />
            ))}
          </div>
        )}

        {/* Load More Button - Shown ONLY if hasMore === true AND results.length < selectedTotal */}
        {!isLoading && hasMore && results.length < selectedTotal && (
          <div className="mt-8 text-center">
            <button
              type="button"
              disabled={isLoadingMore}
              onClick={() => performSearch({ append: true })}
              className="px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-50 shadow-xs inline-flex items-center gap-2 transition-all cursor-pointer tap-bounce disabled:opacity-60"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#1464F4]" />
                  <span>Loading more...</span>
                </>
              ) : (
                <span>Load More Results ({selectedTotal - results.length} remaining)</span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Reusable Filter Drawer/Modal */}
      <SearchFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        activeModule={searchState.module}
        selectedModule={searchState.module}
        onSelectModule={(mod) => setSearchState(prev => ({ ...prev, module: mod }))}
        selectedCategoryId={searchState.categoryId}
        selectedCategoryName={searchState.categoryName}
        onSelectCategory={(catId, catName) => {
          setSearchState(prev => ({
            ...prev,
            categoryId: catId,
            categoryName: catName || ''
          }));
        }}
        selectedLocationName={searchState.locationName}
        minPrice={searchState.minPrice}
        maxPrice={searchState.maxPrice}
        onPriceChange={(min, max) => {
          setSearchState(prev => ({
            ...prev,
            minPrice: min,
            maxPrice: max
          }));
        }}
        onApply={() => {
          performSearch({ append: false, overrideOffset: 0 });
        }}
        onReset={() => {
          handleClearAllFilters();
        }}
        onOpenLocationSelector={onOpenLocationSelector}
        onOpenCategorySelector={onOpenCategorySelector}
      />
    </div>
  );
};
