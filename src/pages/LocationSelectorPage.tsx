import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Compass, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  X, 
  Building2, 
  Landmark, 
  CheckCircle2, 
  Navigation,
  RotateCcw,
  Loader2,
  Info
} from 'lucide-react';
import { LocationService, CanonicalLocation, LocationValueModel } from '../services/locationService';
import { AppRoute } from '../types';

export interface LocationSelectorPageProps {
  onNavigate: (route: AppRoute) => void;
  returnTo?: AppRoute;
  onSelectLocation?: (locationStr: string, locationObj?: any) => void;
  onApplyLocation?: (locationModel: LocationValueModel, displayName: string) => void;
  onCancel?: () => void;
  initialLocation?: string;
  savedCount?: number;
}

export const LocationSelectorPage: React.FC<LocationSelectorPageProps> = ({
  onNavigate,
  returnTo = '/',
  onSelectLocation,
  onApplyLocation,
  onCancel,
  initialLocation = '',
  savedCount = 0
}) => {
  // DB Locations State (loaded from Supabase public.locations)
  const [provinces, setProvinces] = useState<CanonicalLocation[]>([]);
  const [districts, setDistricts] = useState<CanonicalLocation[]>([]);
  const [cities, setCities] = useState<CanonicalLocation[]>([]);
  const [areas, setAreas] = useState<CanonicalLocation[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);

  // Cascading Selection State (null default = All Sri Lanka)
  const [selectedProvince, setSelectedProvince] = useState<CanonicalLocation | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<CanonicalLocation | null>(null);
  const [selectedCity, setSelectedCity] = useState<CanonicalLocation | null>(null);
  const [selectedArea, setSelectedArea] = useState<CanonicalLocation | null>(null);

  // Accordion Expand states
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  // Search Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CanonicalLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // GPS State
  const [isLocating, setIsLocating] = useState(false);
  const [geoNotice, setGeoNotice] = useState<string | null>(null);

  // Handle Cancel / Back / Close (X)
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onNavigate(returnTo || '/');
    }
  };

  // Load Provinces on Mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoadingLocations(true);
      const provs = await LocationService.getProvinces();
      if (isMounted) {
        setProvinces(provs);
        setIsLoadingLocations(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  // Load Districts when Province changes
  useEffect(() => {
    let isMounted = true;
    async function loadDistricts() {
      if (!selectedProvince) {
        setDistricts([]);
        setSelectedDistrict(null);
        return;
      }
      const dists = await LocationService.getDistricts(selectedProvince.id);
      if (isMounted) {
        setDistricts(dists);
      }
    }
    loadDistricts();
    return () => { isMounted = false; };
  }, [selectedProvince]);

  // Load Cities when District changes
  useEffect(() => {
    let isMounted = true;
    async function loadCities() {
      if (!selectedDistrict) {
        setCities([]);
        setSelectedCity(null);
        return;
      }
      const cits = await LocationService.getCities(selectedDistrict.id);
      if (isMounted) {
        setCities(cits);
      }
    }
    loadCities();
    return () => { isMounted = false; };
  }, [selectedDistrict]);

  // Load Areas when City changes
  useEffect(() => {
    let isMounted = true;
    async function loadAreas() {
      if (!selectedCity) {
        setAreas([]);
        setSelectedArea(null);
        return;
      }
      const ars = await LocationService.getAreas(selectedCity.id);
      if (isMounted) {
        setAreas(ars);
      }
    }
    loadAreas();
    return () => { isMounted = false; };
  }, [selectedCity]);

  // Live Location Search Query Handler
  useEffect(() => {
    let isMounted = true;
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const results = await LocationService.searchLocations(searchQuery, { limit: 25 });
      if (isMounted) {
        setSearchResults(results);
        setIsSearching(false);
      }
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Handle Province Select
  const handleSelectProvince = (prov: CanonicalLocation) => {
    setSelectedProvince(prov);
    setSelectedDistrict(null);
    setSelectedCity(null);
    setSelectedArea(null);
    setExpandedStep(2); // Auto advance to District
  };

  // Handle District Select
  const handleSelectDistrict = (dist: CanonicalLocation) => {
    setSelectedDistrict(dist);
    setSelectedCity(null);
    setSelectedArea(null);
    setExpandedStep(3); // Auto advance to City
  };

  // Handle City Select
  const handleSelectCity = (city: CanonicalLocation) => {
    setSelectedCity(city);
    setSelectedArea(null);
    setExpandedStep(4); // Auto advance to Area
  };

  // Handle Area Select
  const handleSelectArea = (area: CanonicalLocation) => {
    setSelectedArea(area);
  };

  // Reset to All Sri Lanka
  const handleResetAll = () => {
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedCity(null);
    setSelectedArea(null);
    setSearchQuery('');
    setGeoNotice(null);
    setExpandedStep(1);
  };

  // Handle Search Result Click -> Populate Parent Hierarchy
  const handleSelectSearchResult = async (loc: CanonicalLocation) => {
    setIsLoadingLocations(true);
    setSearchQuery('');

    if (loc.type === 'province') {
      setSelectedProvince(loc);
      setSelectedDistrict(null);
      setSelectedCity(null);
      setSelectedArea(null);
      setExpandedStep(2);
    } else if (loc.type === 'district') {
      if (loc.provinceId) {
        const prov = provinces.find(p => p.id === loc.provinceId) || await LocationService.getLocationByIdOrCode(loc.provinceId);
        if (prov) setSelectedProvince(prov);
      }
      setSelectedDistrict(loc);
      setSelectedCity(null);
      setSelectedArea(null);
      setExpandedStep(3);
    } else if (loc.type === 'city') {
      if (loc.provinceId) {
        const prov = provinces.find(p => p.id === loc.provinceId) || await LocationService.getLocationByIdOrCode(loc.provinceId);
        if (prov) setSelectedProvince(prov);
      }
      if (loc.districtId) {
        const dist = districts.find(d => d.id === loc.districtId) || await LocationService.getLocationByIdOrCode(loc.districtId);
        if (dist) setSelectedDistrict(dist);
      }
      setSelectedCity(loc);
      setSelectedArea(null);
      setExpandedStep(4);
    } else if (loc.type === 'area') {
      if (loc.provinceId) {
        const prov = provinces.find(p => p.id === loc.provinceId) || await LocationService.getLocationByIdOrCode(loc.provinceId);
        if (prov) setSelectedProvince(prov);
      }
      if (loc.districtId) {
        const dist = districts.find(d => d.id === loc.districtId) || await LocationService.getLocationByIdOrCode(loc.districtId);
        if (dist) setSelectedDistrict(dist);
      }
      if (loc.cityId) {
        const city = cities.find(c => c.id === loc.cityId) || await LocationService.getLocationByIdOrCode(loc.cityId);
        if (city) setSelectedCity(city);
      }
      setSelectedArea(loc);
      setExpandedStep(4);
    }
    setIsLoadingLocations(false);
  };

  // Current formatted location breadcrumb
  const currentBreadcrumb = useMemo(() => {
    return LocationService.formatLocationPath({
      provinceName: selectedProvince?.name,
      districtName: selectedDistrict?.name,
      cityName: selectedCity?.name,
      areaName: selectedArea?.name,
    });
  }, [selectedProvince, selectedDistrict, selectedCity, selectedArea]);

  // Apply Location Selection
  const handleApply = () => {
    const formatted = currentBreadcrumb;
    const valueModel: LocationValueModel = {
      displayName: formatted,
      provinceId: selectedProvince?.id,
      provinceName: selectedProvince?.name,
      districtId: selectedDistrict?.id,
      districtName: selectedDistrict?.name,
      cityId: selectedCity?.id,
      cityName: selectedCity?.name,
      areaId: selectedArea?.id,
      areaName: selectedArea?.name,
      type: selectedArea ? 'area' : selectedCity ? 'city' : selectedDistrict ? 'district' : selectedProvince ? 'province' : 'country'
    };

    if (onApplyLocation) {
      onApplyLocation(valueModel, formatted);
    } else if (onSelectLocation) {
      onSelectLocation(formatted, {
        province: selectedProvince,
        district: selectedDistrict,
        city: selectedCity,
        area: selectedArea,
        model: valueModel
      });
    }

    onNavigate(returnTo || '/');
  };

  // Request Geolocation
  const handleUseCurrentLocation = () => {
    setGeoNotice(null);
    if (!navigator.geolocation) {
      setGeoNotice('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async () => {
        setIsLocating(false);
        setGeoNotice('GPS position detected. Exact neighborhood reverse geocoding is not mapped yet — please choose your district or city from the list below.');
      },
      () => {
        setIsLocating(false);
        setGeoNotice('Location access was not granted. Please select your location from the Sri Lankan provinces below.');
      },
      { timeout: 8000 }
    );
  };

  // Badge Color Helper
  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'province':
        return 'bg-blue-100 text-[#1464F4] border-blue-200';
      case 'district':
        return 'bg-emerald-100 text-[#08A34F] border-emerald-200';
      case 'city':
        return 'bg-purple-100 text-[#8B5CF6] border-purple-200';
      case 'area':
        return 'bg-orange-100 text-[#FF650A] border-orange-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'province': return 'Province';
      case 'district': return 'District';
      case 'city': return 'City / Town';
      case 'area': return 'Area / Village';
      default: return type;
    }
  };

  const getBreadcrumbPath = (loc: CanonicalLocation) => {
    const parts: string[] = [];
    if (loc.cityName && loc.type === 'area') parts.push(loc.cityName);
    if (loc.districtName && loc.type !== 'province' && loc.type !== 'district') parts.push(loc.districtName);
    if (loc.provinceName && loc.type !== 'province') parts.push(loc.provinceName);
    return parts.length > 0 ? parts.join(' · ') : 'Sri Lanka';
  };

  return (
    <div className="bg-slate-50 min-h-screen w-full flex flex-col relative select-none">
      {/* 1. STICKY TOP HEADER */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-2xs px-3.5 pt-3 pb-2.5 shrink-0 flex flex-col gap-2 w-full">
        <div className="max-w-3xl lg:max-w-4xl mx-auto w-full flex flex-col gap-2">
          {/* Navigation Bar Row */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleCancel}
              className="w-10 h-10 -ml-1.5 flex items-center justify-center text-slate-800 hover:text-black rounded-xl active:bg-slate-100 transition-colors shrink-0 cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.3]" />
            </button>

            <div className="text-center min-w-0 px-2">
              <h1 className="text-[17px] font-black text-slate-900 tracking-tight leading-none truncate">
                Choose Location
              </h1>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5 truncate">
                Select Sri Lanka administrative area
              </p>
            </div>

            <button
              type="button"
              onClick={handleCancel}
              className="w-10 h-10 -mr-1.5 flex items-center justify-center text-slate-600 hover:text-black rounded-xl active:bg-slate-100 transition-colors shrink-0 cursor-pointer"
              aria-label="Cancel and close"
            >
              <X className="w-5 h-5 stroke-[2]" />
            </button>
          </div>

          {/* Search Bar Input */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search province, district, city or area..."
              className="w-full pl-9 pr-9 py-2.5 bg-slate-100 border border-slate-200/90 rounded-xl text-[13px] font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1464F4] focus:bg-white focus:ring-2 focus:ring-[#1464F4]/20 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg active:bg-slate-200/60 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Actions Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
            <button
              type="button"
              onClick={handleResetAll}
              className={`shrink-0 px-3 py-2 rounded-xl text-[12px] font-bold border transition-all flex items-center gap-1.5 min-h-[38px] cursor-pointer ${
                !selectedProvince && !selectedDistrict && !selectedCity && !selectedArea
                  ? 'bg-[#1464F4] text-white border-[#1464F4] shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Compass className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>All Sri Lanka</span>
            </button>

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="shrink-0 px-3 py-2 rounded-xl text-[12px] font-bold bg-emerald-50 text-[#08A34F] border border-emerald-200/80 hover:bg-emerald-100 transition-all flex items-center gap-1.5 min-h-[38px] cursor-pointer"
            >
              {isLocating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Navigation className="w-3.5 h-3.5 stroke-[2.2]" />
              )}
              <span>{isLocating ? 'Locating...' : 'Use Current Location'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN SCROLLABLE CONTENT */}
      <main className="flex-1 max-w-3xl lg:max-w-4xl mx-auto w-full px-3.5 py-4 space-y-3 pb-48 lg:pb-36">
        {/* Geolocation Notice Banner */}
        {geoNotice && (
          <div className="p-3 bg-amber-50 border border-amber-200/90 rounded-2xl flex items-start gap-2.5 text-xs font-semibold text-amber-900 animate-in fade-in duration-150">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span className="flex-1 leading-snug">{geoNotice}</span>
            <button 
              type="button" 
              onClick={() => setGeoNotice(null)} 
              className="text-amber-500 hover:text-amber-800 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Selected Breadcrumb Preview */}
        <div className="p-3.5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1464F4] flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Target Area
              </span>
              <p className="text-xs sm:text-sm font-black text-slate-900 truncate">
                {currentBreadcrumb}
              </p>
            </div>
          </div>

          {(selectedProvince || selectedDistrict || selectedCity || selectedArea) && (
            <button
              type="button"
              onClick={handleResetAll}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* SEARCH RESULTS VIEW */}
        {searchQuery.trim() ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-500">
                {isSearching ? 'Searching...' : `Found ${searchResults.length} location matches`}
              </span>
            </div>

            {isSearching ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#1464F4]" />
                <p className="text-xs font-semibold">Searching locations database...</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="py-12 bg-white rounded-2xl border border-slate-200/80 text-center p-6 space-y-2">
                <p className="text-sm font-bold text-slate-700">No matching locations found</p>
                <p className="text-xs text-slate-400">Try searching for a province name, district, major city, or neighborhood.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-2xs">
                {searchResults.map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => handleSelectSearchResult(loc)}
                    className="w-full p-3.5 text-left hover:bg-slate-50 active:bg-blue-50/50 flex items-center justify-between gap-3 transition-colors cursor-pointer"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900 truncate">
                          {loc.name}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getTypeBadgeStyle(loc.type)}`}>
                          {getTypeLabel(loc.type)}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-400 mt-0.5 truncate">
                        {getBreadcrumbPath(loc)}
                      </p>
                    </div>

                    <ChevronDown className="w-4 h-4 text-slate-300 shrink-0 -rotate-90" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* CASCADING STEP ACCORDIONS */
          <div className="space-y-2.5">
            {/* STEP 1: PROVINCES (9 Total) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => setExpandedStep(expandedStep === 1 ? null : 1)}
                className="w-full p-3.5 bg-slate-50/80 hover:bg-slate-100/80 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                    selectedProvince ? 'bg-[#1464F4] text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    1
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Step 1 · Province
                    </span>
                    <p className="text-xs font-extrabold text-slate-900 truncate">
                      {selectedProvince ? selectedProvince.name : 'All Sri Lanka (Any Province)'}
                    </p>
                  </div>
                </div>

                {expandedStep === 1 ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>

              {expandedStep === 1 && (
                <div className="p-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[320px] overflow-y-auto no-scrollbar">
                  {isLoadingLocations ? (
                    <div className="col-span-2 py-8 text-center text-slate-400 text-xs font-semibold flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#1464F4]" />
                      <span>Loading Sri Lanka provinces...</span>
                    </div>
                  ) : (
                    provinces.map((prov) => {
                      const isSelected = selectedProvince?.id === prov.id;
                      return (
                        <button
                          key={prov.id}
                          type="button"
                          onClick={() => handleSelectProvince(prov)}
                          className={`w-full p-3 rounded-xl text-left border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50/80 border-[#1464F4] text-[#1464F4] shadow-2xs'
                              : 'bg-white border-slate-200/80 text-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <span className="truncate">{prov.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#1464F4] stroke-[2.5] shrink-0" />}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* STEP 2: DISTRICTS (25 Total) */}
            <div className={`bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs transition-opacity ${
              !selectedProvince ? 'opacity-60 pointer-events-none' : 'opacity-100'
            }`}>
              <button
                type="button"
                onClick={() => selectedProvince && setExpandedStep(expandedStep === 2 ? null : 2)}
                className="w-full p-3.5 bg-slate-50/80 hover:bg-slate-100/80 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                    selectedDistrict ? 'bg-[#08A34F] text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    2
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Step 2 · District
                    </span>
                    <p className="text-xs font-extrabold text-slate-900 truncate">
                      {selectedDistrict ? selectedDistrict.name : selectedProvince ? `All ${selectedProvince.name} Districts` : 'Select Province First'}
                    </p>
                  </div>
                </div>

                {expandedStep === 2 ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>

              {expandedStep === 2 && selectedProvince && (
                <div className="p-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[300px] overflow-y-auto no-scrollbar">
                  {districts.map((dist) => {
                    const isSelected = selectedDistrict?.id === dist.id;
                    return (
                      <button
                        key={dist.id}
                        type="button"
                        onClick={() => handleSelectDistrict(dist)}
                        className={`w-full p-3 rounded-xl text-left border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50/80 border-[#08A34F] text-[#08A34F] shadow-2xs'
                            : 'bg-white border-slate-200/80 text-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <span className="truncate">{dist.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#08A34F] stroke-[2.5] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* STEP 3: CITIES / TOWNS (96 Total) */}
            <div className={`bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs transition-opacity ${
              !selectedDistrict ? 'opacity-60 pointer-events-none' : 'opacity-100'
            }`}>
              <button
                type="button"
                onClick={() => selectedDistrict && setExpandedStep(expandedStep === 3 ? null : 3)}
                className="w-full p-3.5 bg-slate-50/80 hover:bg-slate-100/80 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                    selectedCity ? 'bg-[#8B5CF6] text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    3
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Step 3 · City / Major Town
                    </span>
                    <p className="text-xs font-extrabold text-slate-900 truncate">
                      {selectedCity ? selectedCity.name : selectedDistrict ? `All ${selectedDistrict.name} Cities` : 'Select District First'}
                    </p>
                  </div>
                </div>

                {expandedStep === 3 ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>

              {expandedStep === 3 && selectedDistrict && (
                <div className="p-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[300px] overflow-y-auto no-scrollbar">
                  {cities.length === 0 ? (
                    <div className="col-span-2 py-6 text-center text-slate-400 text-xs font-semibold">
                      No specific city breakdown for this district. You can proceed with District level selection.
                    </div>
                  ) : (
                    cities.map((city) => {
                      const isSelected = selectedCity?.id === city.id;
                      return (
                        <button
                          key={city.id}
                          type="button"
                          onClick={() => handleSelectCity(city)}
                          className={`w-full p-3 rounded-xl text-left border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-purple-50/80 border-[#8B5CF6] text-[#8B5CF6] shadow-2xs'
                              : 'bg-white border-slate-200/80 text-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <span className="truncate">{city.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#8B5CF6] stroke-[2.5] shrink-0" />}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* STEP 4: AREAS / VILLAGES */}
            <div className={`bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs transition-opacity ${
              !selectedCity ? 'opacity-60 pointer-events-none' : 'opacity-100'
            }`}>
              <button
                type="button"
                onClick={() => selectedCity && setExpandedStep(expandedStep === 4 ? null : 4)}
                className="w-full p-3.5 bg-slate-50/80 hover:bg-slate-100/80 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                    selectedArea ? 'bg-[#FF650A] text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    4
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Step 4 · Area / Neighborhood
                    </span>
                    <p className="text-xs font-extrabold text-slate-900 truncate">
                      {selectedArea ? selectedArea.name : selectedCity ? `All ${selectedCity.name} Areas (Optional)` : 'Select City First'}
                    </p>
                  </div>
                </div>

                {expandedStep === 4 ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>

              {expandedStep === 4 && selectedCity && (
                <div className="p-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[300px] overflow-y-auto no-scrollbar">
                  {areas.length === 0 ? (
                    <div className="col-span-2 py-6 text-center text-slate-400 text-xs font-semibold">
                      Entire {selectedCity.name} selected. No further micro-neighborhood division required.
                    </div>
                  ) : (
                    areas.map((area) => {
                      const isSelected = selectedArea?.id === area.id;
                      return (
                        <button
                          key={area.id}
                          type="button"
                          onClick={() => handleSelectArea(area)}
                          className={`w-full p-3 rounded-xl text-left border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-orange-50/80 border-[#FF650A] text-[#FF650A] shadow-2xs'
                              : 'bg-white border-slate-200/80 text-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <span className="truncate">{area.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#FF650A] stroke-[2.5] shrink-0" />}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* 3. STICKY BOTTOM APPLY FOOTER */}
      <footer className="fixed bottom-16 lg:bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3 sm:p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="max-w-3xl lg:max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-0.5">
              SELECTED LOCATION
            </span>
            <p className="text-xs sm:text-sm font-black text-slate-900 truncate">
              {currentBreadcrumb || 'All Sri Lanka'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer shrink-0"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="flex-1 sm:flex-none py-3 px-6 rounded-xl bg-[#1464F4] hover:bg-blue-600 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 active:scale-[0.99] transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span className="truncate">
                {currentBreadcrumb === 'All Sri Lanka' ? 'Apply Location (All Sri Lanka)' : 'Apply Location'}
              </span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
