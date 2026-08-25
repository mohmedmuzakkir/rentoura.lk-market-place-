import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Check, 
  CheckCircle2,
  RotateCcw,
  Compass,
  Loader2,
  Building2,
  Landmark
} from 'lucide-react';
import { LocationService, CanonicalLocation, LocationValueModel } from '../../services/locationService';

export interface GlobalLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation?: string;
  selectedLocationModel?: LocationValueModel;
  onSelectLocation: (displayName: string, locationObj?: LocationValueModel) => void;
  accentColor?: string;
  title?: string;
}

export const GlobalLocationModal: React.FC<GlobalLocationModalProps> = ({
  isOpen,
  onClose,
  selectedLocation = 'All Sri Lanka',
  selectedLocationModel,
  onSelectLocation,
  accentColor = '#1464F4',
  title = 'Select Location'
}) => {
  // State for data
  const [provinces, setProvinces] = useState<CanonicalLocation[]>([]);
  const [districts, setDistricts] = useState<CanonicalLocation[]>([]);
  const [cities, setCities] = useState<CanonicalLocation[]>([]);
  const [areas, setAreas] = useState<CanonicalLocation[]>([]);

  // Selected hierarchy steps
  const [selectedProvince, setSelectedProvince] = useState<CanonicalLocation | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<CanonicalLocation | null>(null);
  const [selectedCity, setSelectedCity] = useState<CanonicalLocation | null>(null);

  // Draft Location State
  const [draftDisplayName, setDraftDisplayName] = useState(selectedLocation || 'All Sri Lanka');
  const [draftLocationObj, setDraftLocationObj] = useState<LocationValueModel | undefined>(selectedLocationModel);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CanonicalLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Sync draft on open
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    async function initDraft() {
      const targetInput = selectedLocationModel?.displayName || selectedLocation;
      if (targetInput && targetInput !== 'All Sri Lanka') {
        const resolved = await LocationService.resolveLocationValueModel(targetInput);
        if (isMounted) {
          setDraftDisplayName(resolved.displayName || targetInput);
          setDraftLocationObj(resolved);
        }
      } else {
        if (isMounted) {
          setDraftDisplayName('All Sri Lanka');
          setDraftLocationObj({ displayName: 'All Sri Lanka', type: 'country' });
        }
      }
    }

    initDraft();
    return () => { isMounted = false; };
  }, [isOpen, selectedLocation, selectedLocationModel]);

  // Load provinces on open
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    async function loadData() {
      const provs = await LocationService.getProvinces();
      if (isMounted) setProvinces(provs);
    }
    loadData();
    return () => { isMounted = false; };
  }, [isOpen]);

  // Load districts when selected province changes
  useEffect(() => {
    let isMounted = true;
    async function loadDists() {
      if (!selectedProvince) {
        setDistricts([]);
        setSelectedDistrict(null);
        return;
      }
      const dists = await LocationService.getDistricts(selectedProvince.id);
      if (isMounted) setDistricts(dists);
    }
    loadDists();
    return () => { isMounted = false; };
  }, [selectedProvince]);

  // Load cities when selected district changes
  useEffect(() => {
    let isMounted = true;
    async function loadCits() {
      if (!selectedDistrict) {
        setCities([]);
        setSelectedCity(null);
        return;
      }
      const cits = await LocationService.getCities(selectedDistrict.id);
      if (isMounted) setCities(cits);
    }
    loadCits();
    return () => { isMounted = false; };
  }, [selectedDistrict]);

  // Load areas when selected city changes
  useEffect(() => {
    let isMounted = true;
    async function loadArs() {
      if (!selectedCity) {
        setAreas([]);
        return;
      }
      const ars = await LocationService.getAreas(selectedCity.id);
      if (isMounted) setAreas(ars);
    }
    loadArs();
    return () => { isMounted = false; };
  }, [selectedCity]);

  // Handle Search Query
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

  if (!isOpen) return null;

  // Helper to construct LocationValueModel and update draft selection
  const applySelection = (
    displayName: string, 
    prov?: CanonicalLocation | null, 
    dist?: CanonicalLocation | null, 
    cit?: CanonicalLocation | null, 
    ar?: CanonicalLocation | null,
    type: 'country' | 'province' | 'district' | 'city' | 'area' = 'city'
  ) => {
    const valueModel: LocationValueModel = {
      displayName,
      provinceId: prov?.id,
      provinceName: prov?.name,
      districtId: dist?.id,
      districtName: dist?.name,
      cityId: cit?.id,
      cityName: cit?.name,
      areaId: ar?.id,
      areaName: ar?.name,
      type
    };
    setDraftDisplayName(displayName);
    setDraftLocationObj(valueModel);
  };

  const handleSelectSearchResult = (loc: CanonicalLocation) => {
    let name = loc.name;
    if (loc.type === 'area' && loc.parentName) {
      name = `${loc.name}, ${loc.parentName}`;
    } else if (loc.type === 'city' && loc.districtName) {
      name = `${loc.name}, ${loc.districtName}`;
    } else if (loc.type === 'district' && loc.provinceName) {
      name = `${loc.name}, ${loc.provinceName}`;
    }

    const valueModel: LocationValueModel = {
      displayName: name,
      provinceId: loc.provinceId || (loc.type === 'province' ? loc.id : undefined),
      provinceName: loc.provinceName || (loc.type === 'province' ? loc.name : undefined),
      districtId: loc.districtId || (loc.type === 'district' ? loc.id : undefined),
      districtName: loc.districtName || (loc.type === 'district' ? loc.name : undefined),
      cityId: loc.cityId || (loc.type === 'city' ? loc.id : undefined),
      cityName: loc.cityName || (loc.type === 'city' ? loc.name : undefined),
      areaId: loc.type === 'area' ? loc.id : undefined,
      areaName: loc.type === 'area' ? loc.name : undefined,
      type: loc.type
    };

    setDraftDisplayName(name);
    setDraftLocationObj(valueModel);
  };

  const handleApply = () => {
    const finalObj: LocationValueModel = draftLocationObj || {
      displayName: draftDisplayName,
      type: draftDisplayName === 'All Sri Lanka' ? 'country' : 'city'
    };

    // Log explicit location search event
    LocationService.logLocationApplyEvent(finalObj, searchQuery);

    onSelectLocation(draftDisplayName, finalObj);
    onClose();
  };

  const currentDisplay = draftDisplayName || 'All Sri Lanka';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[88vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-9 h-9 rounded-2xl flex items-center justify-center text-white font-bold shadow-xs shrink-0"
              style={{ backgroundColor: accentColor }}
            >
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                {title}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Search or browse Sri Lanka provinces, districts & cities
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar Input */}
        <div className="p-3 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-3.5 py-2 border border-slate-200/80 focus-within:border-blue-500 focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Kandy, Colombo, Peradeniya, Jaffna..."
              className="w-full bg-transparent text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Main Body */}
        <div className="p-3 overflow-y-auto flex-1 space-y-3 no-scrollbar max-h-[60vh]">

          {/* SEARCH RESULTS MODE */}
          {searchQuery.trim() ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between px-1 mb-1.5">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Search Results ({searchResults.length})
                </p>
                {isSearching && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />}
              </div>

              {searchResults.length === 0 && !isSearching ? (
                <div className="text-center py-8 text-slate-400">
                  <Compass className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-500" />
                  <p className="text-xs font-semibold">No location found matching "{searchQuery}"</p>
                  <p className="text-[11px] text-slate-400 mt-1">Try searching a major city or district name</p>
                </div>
              ) : (
                searchResults.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => handleSelectSearchResult(loc)}
                    className="w-full p-2.5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 text-left flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                        <MapPin className="w-3.5 h-3.5 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{loc.name}</p>
                        <p className="text-[10px] text-slate-400">
                          {[loc.parentName, loc.districtName, loc.provinceName].filter(Boolean).join(' • ')}
                          <span className="ml-1.5 inline-block px-1.5 py-0.2 bg-slate-100 text-slate-600 font-extrabold rounded-md uppercase text-[9px]">
                            {loc.type}
                          </span>
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </button>
                ))
              )}
            </div>
          ) : (
            /* HIERARCHICAL BROWSE MODE */
            <>
              {/* Option 0: All Sri Lanka */}
              <button
                onClick={() => applySelection('All Sri Lanka', null, null, null, null, 'country')}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                  currentDisplay === 'All Sri Lanka'
                    ? 'border-blue-500 bg-blue-50/80 font-bold text-blue-600'
                    : 'border-slate-100 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">🇱🇰</span>
                  <div>
                    <p className="text-xs font-bold">All Sri Lanka</p>
                    <p className="text-[10px] text-slate-400">Show listings across all 9 provinces</p>
                  </div>
                </div>
                {currentDisplay === 'All Sri Lanka' && <Check className="w-4 h-4 text-blue-600" />}
              </button>

              {/* Breadcrumb Navigation Trail if drilled down */}
              {(selectedProvince || selectedDistrict || selectedCity) && (
                <div className="flex items-center gap-1.5 flex-wrap p-2 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                  <button 
                    onClick={() => { setSelectedProvince(null); setSelectedDistrict(null); setSelectedCity(null); }}
                    className="text-blue-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Provinces</span>
                  </button>
                  {selectedProvince && (
                    <>
                      <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
                      <button 
                        onClick={() => { setSelectedDistrict(null); setSelectedCity(null); }}
                        className="text-blue-600 font-bold hover:underline cursor-pointer"
                      >
                        {selectedProvince.name}
                      </button>
                    </>
                  )}
                  {selectedDistrict && (
                    <>
                      <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
                      <button 
                        onClick={() => setSelectedCity(null)}
                        className="text-blue-600 font-bold hover:underline cursor-pointer"
                      >
                        {selectedDistrict.name}
                      </button>
                    </>
                  )}
                  {selectedCity && (
                    <>
                      <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
                      <span className="text-slate-800 font-bold">{selectedCity.name}</span>
                    </>
                  )}
                </div>
              )}

              {/* LEVEL 1: PROVINCES (if no province selected) */}
              {!selectedProvince && (
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1 mb-1.5">
                    Select Province (All 9)
                  </p>
                  <div className="space-y-1">
                    {provinces.map((prov) => {
                      const isSelected = currentDisplay === prov.name;
                      return (
                        <div
                          key={prov.id}
                          className="flex items-center justify-between p-2.5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50 transition-all group"
                        >
                          <button
                            onClick={() => applySelection(prov.name, prov, null, null, null, 'province')}
                            className="flex-1 text-left font-bold text-xs text-slate-800 hover:text-blue-600 cursor-pointer flex items-center gap-2"
                          >
                            <Building2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>{prov.name}</span>
                          </button>
                          
                          <button
                            onClick={() => setSelectedProvince(prov)}
                            className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-1 shrink-0"
                          >
                            <span>Districts</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* LEVEL 2: DISTRICTS (if province selected, no district selected) */}
              {selectedProvince && !selectedDistrict && (
                <div>
                  <div className="flex items-center justify-between px-1 mb-1.5">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Districts in {selectedProvince.name}
                    </p>
                    <button
                      onClick={() => applySelection(selectedProvince.name, selectedProvince, null, null, null, 'province')}
                      className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Use All {selectedProvince.name}
                    </button>
                  </div>

                  <div className="space-y-1">
                    {districts.map((dist) => {
                      const distLabel = `${dist.name}, ${selectedProvince.name}`;
                      const isSelected = currentDisplay.includes(dist.name);
                      return (
                        <div
                          key={dist.id}
                          className="flex items-center justify-between p-2.5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50 transition-all"
                        >
                          <button
                            onClick={() => applySelection(distLabel, selectedProvince, dist, null, null, 'district')}
                            className="flex-1 text-left font-bold text-xs text-slate-800 hover:text-blue-600 cursor-pointer flex items-center gap-2"
                          >
                            <Landmark className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>{dist.name} District</span>
                          </button>

                          <button
                            onClick={() => setSelectedDistrict(dist)}
                            className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-1 shrink-0"
                          >
                            <span>Cities / Towns</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* LEVEL 3: CITIES / TOWNS (if district selected, no city selected) */}
              {selectedDistrict && !selectedCity && (
                <div>
                  <div className="flex items-center justify-between px-1 mb-1.5">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Cities & Towns in {selectedDistrict.name}
                    </p>
                    <button
                      onClick={() => applySelection(`${selectedDistrict.name}, ${selectedProvince?.name || ''}`, selectedProvince, selectedDistrict, null, null, 'district')}
                      className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Use All {selectedDistrict.name}
                    </button>
                  </div>

                  <div className="space-y-1">
                    {cities.map((cit) => {
                      const citLabel = `${cit.name}, ${selectedDistrict.name}`;
                      return (
                        <div
                          key={cit.id}
                          className="flex items-center justify-between p-2.5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50 transition-all"
                        >
                          <button
                            onClick={() => applySelection(citLabel, selectedProvince, selectedDistrict, cit, null, 'city')}
                            className="flex-1 text-left font-bold text-xs text-slate-800 hover:text-blue-600 cursor-pointer flex items-center gap-2"
                          >
                            <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>{cit.name}</span>
                          </button>

                          <button
                            onClick={() => setSelectedCity(cit)}
                            className="px-2 py-1 rounded-xl bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-1 shrink-0"
                          >
                            <span>Areas</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* LEVEL 4: AREAS / VILLAGES */}
              {selectedCity && (
                <div>
                  <div className="flex items-center justify-between px-1 mb-1.5">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Areas in {selectedCity.name}
                    </p>
                    <button
                      onClick={() => applySelection(`${selectedCity.name}, ${selectedDistrict?.name || ''}`, selectedProvince, selectedDistrict, selectedCity, null, 'city')}
                      className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Use All {selectedCity.name}
                    </button>
                  </div>

                  <div className="space-y-1">
                    {areas.length === 0 ? (
                      <p className="text-xs text-slate-400 py-3 text-center italic">No sub-areas listed for {selectedCity.name}</p>
                    ) : (
                      areas.map((ar) => {
                        const arLabel = `${ar.name}, ${selectedCity.name}`;
                        return (
                          <button
                            key={ar.id}
                            onClick={() => applySelection(arLabel, selectedProvince, selectedDistrict, selectedCity, ar, 'area')}
                            className="w-full p-2.5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 text-left font-semibold text-xs text-slate-800 hover:text-blue-600 cursor-pointer transition-all flex items-center gap-2"
                          >
                            <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            <span>{ar.name}</span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Modal Footer with Sticky Apply Location */}
        <div className="p-3.5 border-t border-slate-200/90 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg shrink-0">
          <div className="min-w-0 flex-1 w-full sm:w-auto">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-0.5">
              SELECTED LOCATION
            </span>
            <div className="flex items-center gap-2">
              <p className="text-xs sm:text-sm font-black text-slate-900 truncate">
                {draftDisplayName || 'All Sri Lanka'}
              </p>
              {draftDisplayName !== 'All Sri Lanka' && (
                <button
                  type="button"
                  onClick={() => applySelection('All Sri Lanka', null, null, null, null, 'country')}
                  className="text-[11px] font-bold text-slate-500 hover:text-slate-800 underline shrink-0 cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer shrink-0"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 sm:flex-none py-2.5 px-5 rounded-xl text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-[0.99]"
              style={{ 
                backgroundColor: accentColor,
                boxShadow: `0 8px 20px -4px ${accentColor}40`
              }}
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span className="truncate">
                {draftDisplayName === 'All Sri Lanka' ? 'Apply Location (All Sri Lanka)' : 'Apply Location'}
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
