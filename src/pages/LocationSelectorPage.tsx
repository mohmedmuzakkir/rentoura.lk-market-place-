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
import { LocationService, CanonicalLocation } from '../services/locationService';
import { AppRoute } from '../types';

interface LocationSelectorPageProps {
  onNavigate: (route: AppRoute) => void;
  onSelectLocation: (locationStr: string, locationObj?: any) => void;
  initialLocation?: string;
  savedCount?: number;
}

export const LocationSelectorPage: React.FC<LocationSelectorPageProps> = ({
  onNavigate,
  onSelectLocation,
  initialLocation = '',
  savedCount = 0
}) => {
  // DB Locations State
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

  // Debounced Search Query Effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    let isMounted = true;
    setIsSearching(true);
    const timer = setTimeout(async () => {
      const results = await LocationService.searchLocations(searchQuery);
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

  // Apply Location Selection
  const handleApply = () => {
    const formatted = LocationService.formatLocationPath({
      provinceName: selectedProvince?.name,
      districtName: selectedDistrict?.name,
      cityName: selectedCity?.name,
      areaName: selectedArea?.name,
    });
    onSelectLocation(formatted, {
      province: selectedProvince,
      district: selectedDistrict,
      city: selectedCity,
      area: selectedArea
    });
    onNavigate('/search');
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
        if (provinces.length > 0) {
          const western = provinces.find(p => p.name.toLowerCase().includes('western')) || provinces[0];
          setSelectedProvince(western);
          const dists = await LocationService.getDistricts(western.id);
          if (dists.length > 0) {
            setSelectedDistrict(dists[0]);
          }
        }
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
    <div className="bg-slate-50 h-[100dvh] max-h-[100dvh] w-full flex flex-col overflow-hidden relative select-none">
      {/* 1. STICKY TOP HEADER */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-2xs px-3.5 pt-3 pb-2.5 shrink-0 flex flex-col gap-2 max-w-md mx-auto w-full">
        {/* Navigation Bar Row */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('/search')}
            className="w-10 h-10 -ml-1.5 flex items-center justify-center text-slate-800 hover:text-black rounded-xl active:bg-slate-100 transition-colors shrink-0"
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
            onClick={() => onNavigate('/')}
            className="w-10 h-10 -mr-1.5 flex items-center justify-center text-slate-600 hover:text-black rounded-xl active:bg-slate-100 transition-colors shrink-0"
            aria-label="Close"
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
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg active:bg-slate-200/60"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Actions Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
          <button
            onClick={handleResetAll}
            className={`shrink-0 px-3 py-2 rounded-xl text-[12px] font-bold border transition-all flex items-center gap-1.5 min-h-[38px] ${
              !selectedProvince && !selectedDistrict && !selectedCity && !selectedArea
                ? 'bg-[#1464F4] text-white border-[#1464F4] shadow-2xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <Compass className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>All Sri Lanka</span>
          </button>

          <button
            onClick={handleResetAll}
            className="shrink-0 px-3 py-2 rounded-xl text-[12px] font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1.5 min-h-[38px]"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="shrink-0 px-3 py-2 rounded-xl text-[12px] font-bold bg-blue-50/80 text-[#1464F4] border border-blue-200 hover:bg-blue-100 transition-all flex items-center gap-1.5 min-h-[38px]"
          >
            <Navigation className={`w-3.5 h-3.5 stroke-[2.2] ${isLocating ? 'animate-spin' : ''}`} />
            <span>GPS</span>
          </button>
        </div>

        {geoNotice && (
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11.5px] leading-relaxed flex items-start gap-2 mt-1">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="flex-1">{geoNotice}</p>
            <button onClick={() => setGeoNotice(null)} className="text-amber-500 hover:text-amber-700 p-0.5">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </header>

      {/* 2. SCROLLABLE LOCATION CONTENT CONTAINER */}
      <main className="flex-1 min-h-0 overflow-y-auto px-3.5 py-3 space-y-3.5 max-w-md mx-auto w-full no-scrollbar pb-40 lg:pb-28">
        {/* A. SEARCH RESULTS MODE */}
        {searchQuery.trim() ? (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-sm space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-1">
              <div className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                {isSearching ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1464F4]" />
                    <span>Searching database...</span>
                  </>
                ) : (
                  <>
                    <span>Matching Locations</span>
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px]">
                      {searchResults.length}
                    </span>
                  </>
                )}
              </div>
            </div>

            {isSearching ? (
              <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-[#1464F4]" />
                <span>Searching Sri Lanka locations...</span>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 px-4">
                No locations match "<span className="font-semibold text-slate-800">{searchQuery}</span>".
                <p className="text-[11px] text-slate-400 mt-1">
                  Try searching for a province (e.g. Western), district (e.g. Kandy), city (e.g. Peradeniya), or area name.
                </p>
              </div>
            ) : (
              <div className="space-y-1 divide-y divide-slate-100">
                {searchResults.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => handleSelectSearchResult(res)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50/70 active:bg-blue-100 text-left transition-colors group min-h-[48px]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                      <MapPin className="w-4 h-4 text-[#1464F4] shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[13.5px] font-bold text-slate-900 group-hover:text-[#1464F4] truncate">
                          {res.name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {getBreadcrumbPath(res)}
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border shrink-0 ${getTypeBadgeStyle(res.type)}`}>
                      {getTypeLabel(res.type)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* B. CASCADING HIERARCHY ACCORDION MODE */
          <>
            {/* Step Progress Bar */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-2.5 shadow-2xs">
              <div className="flex items-center justify-between px-1">
                {/* Step 1: Province */}
                <button 
                  onClick={() => setExpandedStep(1)}
                  className="flex flex-col items-center gap-0.5 min-w-[56px] tap-bounce"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    selectedProvince ? 'bg-[#1464F4] text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}>
                    1
                  </div>
                  <span className={`text-[10px] font-bold ${selectedProvince ? 'text-[#1464F4]' : 'text-slate-500'}`}>
                    Province
                  </span>
                </button>

                <div className="flex-1 h-[2px] mx-1 border-b-2 border-dotted border-slate-300"></div>

                {/* Step 2: District */}
                <button 
                  onClick={() => selectedProvince && setExpandedStep(2)}
                  disabled={!selectedProvince}
                  className="flex flex-col items-center gap-0.5 min-w-[56px] tap-bounce disabled:opacity-50"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    selectedDistrict ? 'bg-[#08A34F] text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}>
                    2
                  </div>
                  <span className={`text-[10px] font-bold ${selectedDistrict ? 'text-[#08A34F]' : 'text-slate-500'}`}>
                    District
                  </span>
                </button>

                <div className="flex-1 h-[2px] mx-1 border-b-2 border-dotted border-slate-300"></div>

                {/* Step 3: City */}
                <button 
                  onClick={() => selectedDistrict && setExpandedStep(3)}
                  disabled={!selectedDistrict}
                  className="flex flex-col items-center gap-0.5 min-w-[56px] tap-bounce disabled:opacity-50"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    selectedCity ? 'bg-[#8B5CF6] text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}>
                    3
                  </div>
                  <span className={`text-[10px] font-bold ${selectedCity ? 'text-[#8B5CF6]' : 'text-slate-500'}`}>
                    City
                  </span>
                </button>

                <div className="flex-1 h-[2px] mx-1 border-b-2 border-dotted border-slate-300"></div>

                {/* Step 4: Area */}
                <button 
                  onClick={() => selectedCity && setExpandedStep(4)}
                  disabled={!selectedCity}
                  className="flex flex-col items-center gap-0.5 min-w-[56px] tap-bounce disabled:opacity-50"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    selectedArea ? 'bg-[#FF650A] text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}>
                    4
                  </div>
                  <span className={`text-[10px] font-bold ${selectedArea ? 'text-[#FF650A]' : 'text-slate-500'}`}>
                    Area
                  </span>
                </button>
              </div>
            </div>

            {/* STEP 1: PROVINCE CARD */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all">
              <div 
                onClick={() => setExpandedStep(expandedStep === 1 ? null : 1)}
                className="p-3 flex gap-2.5 items-center cursor-pointer select-none"
              >
                <div className="relative w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-[#1464F4] shrink-0">
                  <Landmark className="w-5 h-5 stroke-[2]" />
                  <span className="absolute -top-1 -left-1 w-4 h-4 bg-[#1464F4] text-white text-[9.5px] font-black rounded-full flex items-center justify-center shadow-xs">
                    1
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-extrabold text-[#1464F4] tracking-wider uppercase">
                    PROVINCE
                  </span>
                  <h3 className="text-[14px] font-black text-slate-900 truncate">
                    {selectedProvince ? selectedProvince.name : 'Select Province'}
                  </h3>
                  <p className="text-[10.5px] text-slate-500 truncate">
                    {isLoadingLocations ? 'Loading provinces...' : `${provinces.length} Active Provinces`}
                  </p>
                </div>

                <button 
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 shrink-0"
                  aria-label="Toggle Province Section"
                >
                  {expandedStep === 1 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {expandedStep === 1 && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-100">
                  {isLoadingLocations ? (
                    <div className="flex items-center gap-2 text-xs text-slate-500 py-3">
                      <Loader2 className="w-4 h-4 animate-spin text-[#1464F4]" />
                      <span>Loading real provinces from database...</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {provinces.map((prov) => {
                        const isSelected = selectedProvince?.id === prov.id;
                        return (
                          <button
                            key={prov.id}
                            onClick={() => handleSelectProvince(prov)}
                            className={`px-3 py-2 rounded-xl border text-left transition-all min-h-[40px] flex items-center gap-1.5 ${
                              isSelected
                                ? 'border-[#1464F4] bg-blue-50 text-[#1464F4] font-bold ring-1 ring-[#1464F4]'
                                : 'border-slate-200/90 bg-white text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 stroke-[3] text-[#1464F4] shrink-0" />
                            )}
                            <span className="text-[11.5px] font-bold leading-none">
                              {prov.name.replace(' Province', '')}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* STEP 2: DISTRICT CARD */}
            <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all ${
              !selectedProvince ? 'opacity-65' : ''
            }`}>
              <div 
                onClick={() => selectedProvince && setExpandedStep(expandedStep === 2 ? null : 2)}
                className={`p-3 flex gap-2.5 items-center select-none ${selectedProvince ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              >
                <div className="relative w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-[#08A34F] shrink-0">
                  <Building2 className="w-5 h-5 stroke-[2]" />
                  <span className="absolute -top-1 -left-1 w-4 h-4 bg-[#08A34F] text-white text-[9.5px] font-black rounded-full flex items-center justify-center shadow-xs">
                    2
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-extrabold text-[#08A34F] tracking-wider uppercase">
                    DISTRICT
                  </span>
                  <h3 className="text-[14px] font-black text-slate-900 truncate">
                    {selectedDistrict ? selectedDistrict.name : (selectedProvince ? 'Select District' : 'Select Province First')}
                  </h3>
                  <p className="text-[10.5px] text-slate-500 truncate">
                    {selectedDistrict ? 'Selected District' : (selectedProvince ? `${districts.length} Districts in ${selectedProvince.name}` : 'Locked')}
                  </p>
                </div>

                <button 
                  disabled={!selectedProvince}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 shrink-0 disabled:opacity-40"
                  aria-label="Toggle District Section"
                >
                  {expandedStep === 2 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {expandedStep === 2 && selectedProvince && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-100">
                  {districts.length === 0 ? (
                    <div className="text-xs text-slate-500 py-2">
                      No districts registered for this province.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {districts.map((dist) => {
                        const isSelected = selectedDistrict?.id === dist.id;
                        return (
                          <button
                            key={dist.id}
                            onClick={() => handleSelectDistrict(dist)}
                            className={`px-3 py-2 rounded-xl border transition-all min-h-[40px] flex items-center gap-1.5 ${
                              isSelected
                                ? 'border-[#08A34F] bg-emerald-50 text-[#08A34F] font-bold ring-1 ring-[#08A34F]'
                                : 'border-slate-200/90 bg-white text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 stroke-[3] text-[#08A34F] shrink-0" />
                            )}
                            <span className="text-[11.5px] font-bold leading-none">
                              {dist.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* STEP 3: CITY CARD */}
            <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all ${
              !selectedDistrict ? 'opacity-65' : ''
            }`}>
              <div 
                onClick={() => selectedDistrict && setExpandedStep(expandedStep === 3 ? null : 3)}
                className={`p-3 flex gap-2.5 items-center select-none ${selectedDistrict ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              >
                <div className="relative w-10 h-10 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-center text-[#8B5CF6] shrink-0">
                  <Building2 className="w-5 h-5 stroke-[2]" />
                  <span className="absolute -top-1 -left-1 w-4 h-4 bg-[#8B5CF6] text-white text-[9.5px] font-black rounded-full flex items-center justify-center shadow-xs">
                    3
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-extrabold text-[#8B5CF6] tracking-wider uppercase">
                    CITY / TOWN
                  </span>
                  <h3 className="text-[14px] font-black text-slate-900 truncate">
                    {selectedCity ? selectedCity.name : (selectedDistrict ? 'Select City / Town' : 'Select District First')}
                  </h3>
                  <p className="text-[10.5px] text-slate-500 truncate">
                    {selectedCity ? 'Selected City' : (selectedDistrict ? (cities.length > 0 ? `${cities.length} Cities Available` : 'No cities in DB') : 'Locked')}
                  </p>
                </div>

                <button 
                  disabled={!selectedDistrict}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 shrink-0 disabled:opacity-40"
                  aria-label="Toggle City Section"
                >
                  {expandedStep === 3 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {expandedStep === 3 && selectedDistrict && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-100">
                  {cities.length === 0 ? (
                    <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200/60 rounded-xl p-2.5 flex items-start gap-2">
                      <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>No specific cities registered in DB for {selectedDistrict.name} District. Selection continues at District level.</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cities.map((city) => {
                        const isSelected = selectedCity?.id === city.id;
                        return (
                          <button
                            key={city.id}
                            onClick={() => handleSelectCity(city)}
                            className={`px-3 py-2 rounded-xl border transition-all min-h-[40px] flex items-center gap-1.5 ${
                              isSelected
                                ? 'border-[#8B5CF6] bg-purple-50 text-[#8B5CF6] font-bold ring-1 ring-[#8B5CF6]'
                                : 'border-slate-200/90 bg-white text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 stroke-[3] text-[#8B5CF6] shrink-0" />
                            )}
                            <span className="text-[11.5px] font-bold leading-none">
                              {city.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* STEP 4: AREA CARD */}
            <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all ${
              !selectedCity ? 'opacity-65' : ''
            }`}>
              <div 
                onClick={() => selectedCity && setExpandedStep(expandedStep === 4 ? null : 4)}
                className={`p-3 flex gap-2.5 items-center select-none ${selectedCity ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              >
                <div className="relative w-10 h-10 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-center text-[#FF650A] shrink-0">
                  <MapPin className="w-5 h-5 stroke-[2]" />
                  <span className="absolute -top-1 -left-1 w-4 h-4 bg-[#FF650A] text-white text-[9.5px] font-black rounded-full flex items-center justify-center shadow-xs">
                    4
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-extrabold text-[#FF650A] tracking-wider uppercase">
                    AREA / VILLAGE
                  </span>
                  <h3 className="text-[14px] font-black text-slate-900 truncate">
                    {selectedArea ? selectedArea.name : (selectedCity ? 'Select Sub-Area (Optional)' : 'Select City First')}
                  </h3>
                  <p className="text-[10.5px] text-slate-500 truncate">
                    {selectedArea ? 'Selected Area' : (selectedCity ? (areas.length > 0 ? `${areas.length} Areas Available` : 'No sub-areas in DB') : 'Locked')}
                  </p>
                </div>

                <button 
                  disabled={!selectedCity}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 shrink-0 disabled:opacity-40"
                  aria-label="Toggle Area Section"
                >
                  {expandedStep === 4 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {expandedStep === 4 && selectedCity && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-100">
                  {areas.length === 0 ? (
                    <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200/60 rounded-xl p-2.5 flex items-start gap-2">
                      <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>No specific sub-areas registered for {selectedCity.name}. Selection continues at City level.</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {areas.map((area) => {
                        const isSelected = selectedArea?.id === area.id;
                        return (
                          <button
                            key={area.id}
                            onClick={() => handleSelectArea(area)}
                            className={`px-3 py-2 rounded-xl border transition-all min-h-[40px] flex items-center gap-1.5 ${
                              isSelected
                                ? 'border-[#FF650A] bg-orange-50 text-[#FF650A] font-bold ring-1 ring-[#FF650A]'
                                : 'border-slate-200/90 bg-white text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 stroke-[3] text-[#FF650A] shrink-0" />
                            )}
                            <span className="text-[11.5px] font-bold leading-none">
                              {area.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* 3. STICKY / FIXED SELECTED LOCATION SUMMARY & APPLY FOOTER */}
      <footer className="fixed bottom-[58px] lg:bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3 shadow-xl">
        <div className="max-w-md mx-auto space-y-2">
          {/* Summary Row */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5 text-[#1464F4]" />
              </div>
              <div className="min-w-0">
                <div className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider">
                  SELECTED LOCATION
                </div>
                <div className="text-[13px] font-black text-slate-900 truncate">
                  {currentBreadcrumb}
                </div>
              </div>
            </div>

            {(selectedProvince || selectedDistrict || selectedCity || selectedArea) && (
              <button
                onClick={handleResetAll}
                className="text-[11.5px] font-bold text-slate-500 hover:text-slate-800 shrink-0 px-2 py-1 rounded-lg hover:bg-slate-100"
              >
                Clear
              </button>
            )}
          </div>

          {/* Apply Button */}
          <button
            onClick={handleApply}
            className="w-full py-3 bg-[#1464F4] hover:bg-[#0c4cc2] active:scale-[0.98] text-white text-[14px] font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 min-h-[46px]"
          >
            <CheckCircle2 className="w-4.5 h-4.5 stroke-[2.2]" />
            <span>Apply Location ({currentBreadcrumb})</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
