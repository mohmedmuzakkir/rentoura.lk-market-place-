import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  Heart, 
  MessageSquare, 
  Bell, 
  SlidersHorizontal, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  MapPin, 
  LayoutGrid, 
  Tag, 
  Calendar, 
  Home, 
  Car, 
  Briefcase, 
  Wrench, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  ArrowUpDown,
  Search
} from 'lucide-react';
import { RentouraLogo } from '../components/RentouraLogo';
import { AppRoute } from '../types';
import { 
  AdvancedFilterState, 
  INITIAL_ADVANCED_FILTER_STATE 
} from '../types/filterTypes';
import { 
  getActiveFilterChips, 
  calculateMatchingListings, 
  isPropertyCategory, 
  isVehicleCategory,
  RENTAL_PERIOD_OPTIONS
} from '../data/advancedFilterConfig';
import { SEARCH_RESULTS_DEMO } from '../data/searchResultsData';
import { CATEGORY_SYSTEM_DATA, ModuleType } from '../data/categorySelectorData';
import { ActiveFilterSummary } from '../components/filters/ActiveFilterSummary';
import { LocationFilterSection } from '../components/filters/LocationFilterSection';
import { CategoryFilterSection } from '../components/filters/CategoryFilterSection';
import { PriceRangeFilterSection } from '../components/filters/PriceRangeFilterSection';
import { RentalPeriodSection } from '../components/filters/RentalPeriodSection';
import { PropertyFiltersSection } from '../components/filters/PropertyFiltersSection';
import { VehicleFiltersSection } from '../components/filters/VehicleFiltersSection';
import { JobFilterDetailsSection } from '../components/filters/JobFilterDetailsSection';
import { ServiceFilterDetailsSection } from '../components/filters/ServiceFilterDetailsSection';

interface AdvancedFiltersPageProps {
  onNavigate: (route: AppRoute) => void;
  savedCount?: number;
  initialFilterState?: AdvancedFilterState;
  onApplyFilters: (filters: AdvancedFilterState) => void;
}

export const AdvancedFiltersPage: React.FC<AdvancedFiltersPageProps> = ({
  onNavigate,
  savedCount = 0,
  initialFilterState = INITIAL_ADVANCED_FILTER_STATE,
  onApplyFilters
}) => {
  // Centralized filter state initialized from previous context
  const [filterState, setFilterState] = useState<AdvancedFilterState>(initialFilterState);

  // Active accordion section states (default open first 4)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    location: true,
    category: true,
    price: true,
    period: true,
    property: true,
    vehicle: true,
    job: true,
    service: true,
    others: true
  });

  // Desktop active tab
  const [activeDesktopSection, setActiveDesktopSection] = useState<string>('location');

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  // Module colors and config
  const isRentals = filterState.module === 'rentals';
  const isJobs = filterState.module === 'jobs';
  const isServices = filterState.module === 'services';

  const primaryColor = isRentals ? '#1464F4' : isJobs ? '#08A34F' : '#FF650A';
  const lightBgColor = isRentals ? '#EFF6FF' : isJobs ? '#ECFDF5' : '#FFF7ED';

  // Dynamic filter chips list & count
  const activeChips = useMemo(() => {
    return getActiveFilterChips(filterState, setFilterState);
  }, [filterState]);

  // Real matching listings count calculated from the dataset
  const matchingListings = useMemo(() => {
    return calculateMatchingListings(filterState, SEARCH_RESULTS_DEMO);
  }, [filterState]);

  const matchingCount = matchingListings.length;

  // Clear All: resets every active filter refinement while keeping current module
  const handleClearAll = () => {
    setFilterState({
      module: filterState.module,
      keyword: '',
      location: {},
      category: {},
      price: { min: 0, max: 1000000, period: 'Monthly' },
      rentalPeriod: 'Monthly',
      property: {},
      vehicle: {},
      equipment: {},
      job: {},
      service: {},
      verifiedOnly: false,
      featuredOnly: false,
      negotiableOnly: false,
      deliveryAvailable: false,
      sortBy: 'relevant'
    });
  };

  // Reset Filters: resets back to clean baseline for current module
  const handleResetFilters = () => {
    handleClearAll();
  };

  // Apply filters and return to Search Results
  const handleApply = () => {
    onApplyFilters(filterState);
    onNavigate('/search');
  };

  // Switch marketplace module
  const handleModuleSwitch = (newModule: ModuleType) => {
    if (newModule === filterState.module) return;
    setFilterState(prev => ({
      ...prev,
      module: newModule,
      category: {}, // clear incompatible category
      property: {}, // clear module-specific filters
      vehicle: {},
      job: {},
      service: {}
    }));
  };

  // Check category type
  const isProperty = isRentals && isPropertyCategory(filterState.category.mainCatName || '');
  const isVehicle = isRentals && isVehicleCategory(filterState.category.mainCatName || '');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-28 md:pb-16 selection:bg-[#1464F4] selection:text-white">
      {/* ========================================================================= */}
      {/* 1. HEADER */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/search')}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
              title="Back"
              aria-label="Back to search results"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <RentouraLogo />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('/saved')}
              className="relative p-2 text-slate-600 hover:text-[#1464F4] transition-colors cursor-pointer"
              title="Saved items"
            >
              <Heart className="w-5 h-5" />
              {savedCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#1464F4] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigate('/messages')}
              className="relative p-2 text-slate-600 hover:text-[#1464F4] transition-colors cursor-pointer"
              title="Messages"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#1464F4] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            <button
              className="relative p-2 text-slate-600 hover:text-[#1464F4] transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#1464F4] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                7
              </span>
            </button>
          </div>
        </div>

        {/* Title, Subtitle & Clear All Row */}
        <div className="px-4 pb-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-black text-slate-900 font-heading">
                Advanced Filters
              </h1>
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#1464F4]" />
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Refine your search to get better results
            </p>
          </div>

          <button
            onClick={handleClearAll}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span>Clear All</span>
          </button>
        </div>

        {/* Module Switch Tabs */}
        <div className="px-4 pb-2.5 flex gap-2">
          <button
            onClick={() => handleModuleSwitch('rentals')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
              isRentals
                ? 'bg-[#1464F4] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Rentals
          </button>
          <button
            onClick={() => handleModuleSwitch('jobs')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
              isJobs
                ? 'bg-[#08A34F] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Jobs
          </button>
          <button
            onClick={() => handleModuleSwitch('services')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
              isServices
                ? 'bg-[#FF650A] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Services
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. ACTIVE FILTERS SUMMARY BOX */}
      {/* ========================================================================= */}
      <div className="px-4 pt-3.5 pb-1">
        <ActiveFilterSummary
          chips={activeChips}
          totalCount={matchingCount}
          onClearAll={handleClearAll}
          onViewResults={handleApply}
          primaryColor={primaryColor}
        />
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN FILTER SECTIONS CONTAINER (Mobile Accordion / Desktop 2-Col) */}
      {/* ========================================================================= */}
      <div className="px-4 pt-2.5 space-y-3">
        {/* SECTION 1: LOCATION */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs transition-all">
          <button
            type="button"
            onClick={() => toggleSection('location')}
            className="w-full flex items-center justify-between text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div 
                className="w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                style={{ backgroundColor: primaryColor }}
              >
                <MapPin className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="text-xs font-bold text-slate-900 group-hover:text-[#1464F4] transition-colors">
                Location
              </span>
            </div>

            <div className="flex items-center gap-2">
              {filterState.location.cityName && (
                <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1464F4] text-[10px] font-bold flex items-center justify-center">
                  1
                </span>
              )}
              {openSections.location ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </button>

          {openSections.location && (
            <div className="pt-3.5 mt-2.5 border-t border-slate-100 animate-in fade-in duration-150">
              <LocationFilterSection
                location={filterState.location}
                onChange={(loc) => setFilterState(prev => ({ ...prev, location: loc }))}
                primaryColor={primaryColor}
              />
            </div>
          )}
        </div>

        {/* SECTION 2: CATEGORY */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs transition-all">
          <button
            type="button"
            onClick={() => toggleSection('category')}
            className="w-full flex items-center justify-between text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div 
                className="w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                style={{ backgroundColor: primaryColor }}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-900 group-hover:text-[#1464F4] transition-colors">
                Category
              </span>
            </div>

            <div className="flex items-center gap-2">
              {filterState.category.mainCatName && (
                <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1464F4] text-[10px] font-bold flex items-center justify-center">
                  1
                </span>
              )}
              {openSections.category ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </button>

          {openSections.category && (
            <div className="pt-3.5 mt-2.5 border-t border-slate-100 animate-in fade-in duration-150">
              <CategoryFilterSection
                module={filterState.module}
                category={filterState.category}
                onChange={(cat) => setFilterState(prev => ({ ...prev, category: cat }))}
                primaryColor={primaryColor}
              />
            </div>
          )}
        </div>

        {/* SECTION 3: PRICE RANGE / BUDGET */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs transition-all">
          <button
            type="button"
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div 
                className="w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                style={{ backgroundColor: primaryColor }}
              >
                <Tag className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="text-xs font-bold text-slate-900 group-hover:text-[#1464F4] transition-colors">
                {isJobs ? 'Salary Range' : isServices ? 'Starting Budget' : `Price Range (${filterState.rentalPeriod})`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {filterState.price.max > 0 && (
                <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1464F4] text-[10px] font-bold flex items-center justify-center">
                  1
                </span>
              )}
              {openSections.price ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </button>

          {openSections.price && (
            <div className="pt-3.5 mt-2.5 border-t border-slate-100 animate-in fade-in duration-150">
              <PriceRangeFilterSection
                module={filterState.module}
                price={filterState.price}
                onChange={(p) => setFilterState(prev => ({ ...prev, price: p }))}
                primaryColor={primaryColor}
              />
            </div>
          )}
        </div>

        {/* SECTION 4: RENTAL PERIOD (Rentals Module Only) */}
        {isRentals && (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs transition-all">
            <button
              type="button"
              onClick={() => toggleSection('period')}
              className="w-full flex items-center justify-between text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-900 group-hover:text-[#1464F4] transition-colors">
                  Rental Period
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1464F4] text-[10px] font-bold flex items-center justify-center">
                  1
                </span>
                {openSections.period ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>

            {openSections.period && (
              <div className="pt-3.5 mt-2.5 border-t border-slate-100 animate-in fade-in duration-150">
                <RentalPeriodSection
                  selectedPeriod={filterState.rentalPeriod}
                  onChange={(period) => setFilterState(prev => ({ ...prev, rentalPeriod: period }))}
                  primaryColor={primaryColor}
                />
              </div>
            )}
          </div>
        )}

        {/* SECTION 5: PROPERTY SPECIFIC FILTERS (Only when Property Rentals) */}
        {isProperty && (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs transition-all">
            <button
              type="button"
              onClick={() => toggleSection('property')}
              className="w-full flex items-center justify-between text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Home className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-900 group-hover:text-[#1464F4] transition-colors">
                  Property Details & Bedrooms
                </span>
              </div>

              <div className="flex items-center gap-2">
                {openSections.property ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>

            {openSections.property && (
              <div className="pt-3.5 mt-2.5 border-t border-slate-100 animate-in fade-in duration-150">
                <PropertyFiltersSection
                  property={filterState.property}
                  onChange={(prop) => setFilterState(prev => ({ ...prev, property: prop }))}
                  primaryColor={primaryColor}
                />
              </div>
            )}
          </div>
        )}

        {/* SECTION 6: VEHICLE SPECIFIC FILTERS (Only when Vehicles) */}
        {isVehicle && (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs transition-all">
            <button
              type="button"
              onClick={() => toggleSection('vehicle')}
              className="w-full flex items-center justify-between text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Car className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-900 group-hover:text-[#1464F4] transition-colors">
                  Vehicle Specifications
                </span>
              </div>

              <div className="flex items-center gap-2">
                {openSections.vehicle ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>

            {openSections.vehicle && (
              <div className="pt-3.5 mt-2.5 border-t border-slate-100 animate-in fade-in duration-150">
                <VehicleFiltersSection
                  vehicle={filterState.vehicle}
                  onChange={(veh) => setFilterState(prev => ({ ...prev, vehicle: veh }))}
                  primaryColor={primaryColor}
                />
              </div>
            )}
          </div>
        )}

        {/* SECTION 7: JOBS SPECIFIC FILTERS (When Module = Jobs) */}
        {isJobs && (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs transition-all">
            <button
              type="button"
              onClick={() => toggleSection('job')}
              className="w-full flex items-center justify-between text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-900 group-hover:text-[#08A34F] transition-colors">
                  Employment & Experience
                </span>
              </div>

              <div className="flex items-center gap-2">
                {openSections.job ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>

            {openSections.job && (
              <div className="pt-3.5 mt-2.5 border-t border-slate-100 animate-in fade-in duration-150">
                <JobFilterDetailsSection
                  job={filterState.job}
                  onChange={(j) => setFilterState(prev => ({ ...prev, job: j }))}
                  primaryColor={primaryColor}
                />
              </div>
            )}
          </div>
        )}

        {/* SECTION 8: SERVICES SPECIFIC FILTERS (When Module = Services) */}
        {isServices && (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs transition-all">
            <button
              type="button"
              onClick={() => toggleSection('service')}
              className="w-full flex items-center justify-between text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Wrench className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-900 group-hover:text-[#FF650A] transition-colors">
                  Service Requirements
                </span>
              </div>

              <div className="flex items-center gap-2">
                {openSections.service ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>

            {openSections.service && (
              <div className="pt-3.5 mt-2.5 border-t border-slate-100 animate-in fade-in duration-150">
                <ServiceFilterDetailsSection
                  service={filterState.service}
                  onChange={(s) => setFilterState(prev => ({ ...prev, service: s }))}
                  primaryColor={primaryColor}
                />
              </div>
            )}
          </div>
        )}

        {/* SECTION 9: GENERAL PREFERENCES & SORTING */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs transition-all">
          <button
            type="button"
            onClick={() => toggleSection('others')}
            className="w-full flex items-center justify-between text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div 
                className="w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                style={{ backgroundColor: primaryColor }}
              >
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-900 group-hover:text-[#1464F4] transition-colors">
                Preferences & Sorting
              </span>
            </div>

            <div className="flex items-center gap-2">
              {openSections.others ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </button>

          {openSections.others && (
            <div className="pt-3.5 mt-2.5 border-t border-slate-100 space-y-3 animate-in fade-in duration-150">
              {/* Sort By Dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Sort Listings
                </label>
                <div className="relative">
                  <select
                    value={filterState.sortBy}
                    onChange={(e) => setFilterState(prev => ({ ...prev, sortBy: e.target.value as any }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-semibold focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="relevant">Most Relevant</option>
                    <option value="newest">Newest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    {isJobs && <option value="deadline">Application Deadline Soon</option>}
                  </select>
                  <ArrowUpDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-1">
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-semibold text-slate-700">Verified Providers Only</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={filterState.verifiedOnly}
                    onChange={(e) => setFilterState(prev => ({ ...prev, verifiedOnly: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#1464F4] focus:ring-[#1464F4] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-semibold text-slate-700">Delivery / Setup Available</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={filterState.deliveryAvailable}
                    onChange={(e) => setFilterState(prev => ({ ...prev, deliveryAvailable: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#1464F4] focus:ring-[#1464F4] cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. STICKY BOTTOM ACTION BAR */}
      {/* ========================================================================= */}
      <div className="fixed bottom-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-3 px-4 shadow-lg max-w-[430px] mx-auto">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetFilters}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Filters</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="flex-2 py-3 px-4 rounded-xl text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md hover:brightness-105 active:scale-[0.99]"
            style={{ backgroundColor: primaryColor }}
          >
            <Search className="w-3.5 h-3.5" />
            <span>View Results ({matchingCount})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
