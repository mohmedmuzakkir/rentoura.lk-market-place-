import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, EyeOff, Eye, CheckCircle2, AlertCircle, Home, Store, Globe, Compass } from 'lucide-react';
import { ListingDraft, LocationDataState } from '../../../types/postFormTypes';
import { LocationService, CanonicalLocation } from '../../../services/locationService';

interface ServiceLocationStepProps {
  draft: ListingDraft;
  onChange: (updated: Partial<ListingDraft>) => void;
  errors: Record<string, string>;
  accentColor: string;
}

export const ServiceLocationStep: React.FC<ServiceLocationStepProps> = ({
  draft,
  onChange,
  errors,
  accentColor = '#FF650A'
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [geoSuccess, setGeoSuccess] = useState(false);

  const [provinces, setProvinces] = useState<CanonicalLocation[]>([]);
  const [districts, setDistricts] = useState<CanonicalLocation[]>([]);
  const [cities, setCities] = useState<CanonicalLocation[]>([]);

  const currentLocation = draft.location || {
    provinceId: '',
    provinceName: '',
    districtId: '',
    districtName: '',
    cityId: '',
    cityName: '',
    address: '',
    hideExactAddress: false
  };

  const serviceMode = draft.formValues.serviceMode || 'customer_location';
  const serviceRadius = draft.formValues.serviceRadius || '25km';

  // Load Provinces on mount
  useEffect(() => {
    let isMounted = true;
    async function loadProvinces() {
      const provs = await LocationService.getProvinces();
      if (isMounted) setProvinces(provs);
    }
    loadProvinces();
    return () => { isMounted = false; };
  }, []);

  // Load Districts when selected Province changes
  useEffect(() => {
    let isMounted = true;
    async function loadDistricts() {
      if (!currentLocation.provinceId && !currentLocation.provinceName) {
        setDistricts([]);
        return;
      }
      const prov = provinces.find(p => p.id === currentLocation.provinceId || p.name === currentLocation.provinceName);
      if (prov) {
        const dists = await LocationService.getDistricts(prov.id);
        if (isMounted) setDistricts(dists);
      }
    }
    loadDistricts();
    return () => { isMounted = false; };
  }, [currentLocation.provinceId, currentLocation.provinceName, provinces]);

  // Load Cities when selected District changes
  useEffect(() => {
    let isMounted = true;
    async function loadCities() {
      if (!currentLocation.districtId && !currentLocation.districtName) {
        setCities([]);
        return;
      }
      const dist = districts.find(d => d.id === currentLocation.districtId || d.name === currentLocation.districtName);
      if (dist) {
        const cits = await LocationService.getCities(dist.id);
        if (isMounted) setCities(cits);
      }
    }
    loadCities();
    return () => { isMounted = false; };
  }, [currentLocation.districtId, currentLocation.districtName, districts]);

  const updateLocation = (updatedFields: Partial<LocationDataState>) => {
    onChange({
      location: {
        ...currentLocation,
        ...updatedFields
      }
    });
  };

  const updateFormValue = (key: string, value: any) => {
    onChange({
      formValues: {
        ...draft.formValues,
        [key]: value
      }
    });
  };

  const handleProvinceChange = (provinceId: string) => {
    const prov = provinces.find(p => p.id === provinceId);
    if (!prov) return;

    updateLocation({
      provinceId: prov.id,
      provinceName: prov.name,
      districtId: '',
      districtName: '',
      cityId: '',
      cityName: ''
    });
  };

  const handleDistrictChange = (districtId: string) => {
    const dist = districts.find(d => d.id === districtId);
    if (!dist) return;

    updateLocation({
      districtId: dist.id,
      districtName: dist.name,
      cityId: '',
      cityName: ''
    });
  };

  const handleCityChange = (cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    if (!city) return;

    updateLocation({
      cityId: city.id,
      cityName: city.name
    });
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        setGeoSuccess(true);
        updateLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setTimeout(() => setGeoSuccess(false), 4000);
      },
      (error) => {
        setIsLocating(false);
        alert('Could not retrieve exact GPS position. Please select location manually.');
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Intro Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Step 3 of 8</span>
        </div>
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Service Location & Delivery Mode</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Specify where you provide your service and how customers can reach or receive your work.
        </p>
      </div>

      {/* Service Mode Selector */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
          Service Delivery Mode <span className="text-rose-500">*</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => updateFormValue('serviceMode', 'customer_location')}
            className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 ${
              serviceMode === 'customer_location'
                ? 'border-[#FF650A] bg-amber-50/50 ring-2 ring-[#FF650A]/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">🚗</span>
              {serviceMode === 'customer_location' && (
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              )}
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-900 block">At Customer Location</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">Doorstep / On-site Visit</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => updateFormValue('serviceMode', 'provider_location')}
            className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 ${
              serviceMode === 'provider_location'
                ? 'border-[#FF650A] bg-amber-50/50 ring-2 ring-[#FF650A]/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">🏢</span>
              {serviceMode === 'provider_location' && (
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              )}
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-900 block">At Provider Location</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">Shop / Salon / Studio</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => updateFormValue('serviceMode', 'remote_online')}
            className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 ${
              serviceMode === 'remote_online'
                ? 'border-[#FF650A] bg-amber-50/50 ring-2 ring-[#FF650A]/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">💻</span>
              {serviceMode === 'remote_online' && (
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              )}
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-900 block">Remote / Online</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">Digital / Zoom / Islandwide</span>
            </div>
          </button>
        </div>
      </div>

      {/* Sri Lanka Location Hierarchy */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-amber-600" /> Primary Base Location <span className="text-rose-500">*</span>
          </label>

          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={isLocating}
            className="text-xs text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 transition-all"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            {isLocating ? 'Locating...' : 'Use My Location'}
          </button>
        </div>

        {geoSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            GPS coordinates locked! You can fine-tune your district and city below.
          </div>
        )}

        {/* Province, District, City Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Province */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Province</label>
            <select
              value={currentLocation.provinceId || ''}
              onChange={e => handleProvinceChange(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer"
            >
              <option value="">-- Select Province --</option>
              {provinces.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">District</label>
            <select
              value={currentLocation.districtId || ''}
              onChange={e => handleDistrictChange(e.target.value)}
              disabled={!currentLocation.provinceId || districts.length === 0}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="">
                {currentLocation.provinceId ? '-- Select District --' : 'Select Province First'}
              </option>
              {districts.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">City / Town</label>
            <select
              value={currentLocation.cityId || ''}
              onChange={e => handleCityChange(e.target.value)}
              disabled={!currentLocation.districtId || cities.length === 0}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="">
                {!currentLocation.districtId ? 'Select District First' : cities.length === 0 ? 'No cities listed' : '-- Select City / Town --'}
              </option>
              {cities.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Street Address / Area Name */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
            Street Address or Landmark <span className="text-slate-400 font-normal lowercase">(optional)</span>
          </label>
          <input
            type="text"
            value={currentLocation.address || ''}
            onChange={e => updateLocation({ address: e.target.value })}
            placeholder="e.g. No. 45, Peradeniya Road, Near Kandy Hospital"
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
        </div>

        {/* Hide Exact Address Toggle */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentLocation.hideExactAddress ? (
              <EyeOff className="w-4 h-4 text-amber-600" />
            ) : (
              <Eye className="w-4 h-4 text-slate-400" />
            )}
            <div>
              <span className="text-xs font-bold text-slate-800 block">Hide exact address publicly</span>
              <span className="text-[11px] text-slate-500 block">Only display general city area ({currentLocation.cityName})</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => updateLocation({ hideExactAddress: !currentLocation.hideExactAddress })}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              currentLocation.hideExactAddress ? 'bg-amber-500' : 'bg-slate-200'
            }`}
          >
            <span
              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-xs ${
                currentLocation.hideExactAddress ? 'left-5.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Service Travel Radius */}
      {serviceMode !== 'remote_online' && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-amber-600" /> Maximum Travel / Coverage Radius
          </label>
          <p className="text-xs text-slate-500">
            Select how far you are willing to travel from your base location to serve customers.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: '5km', label: '5 km Radius' },
              { id: '15km', label: '15 km Radius' },
              { id: '25km', label: '25 km Radius' },
              { id: '50km', label: '50 km Radius' },
              { id: 'district', label: 'Entire District' },
              { id: 'province', label: 'Entire Province' },
              { id: 'islandwide', label: 'Islandwide (All Sri Lanka)' }
            ].map(r => {
              const selected = serviceRadius === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => updateFormValue('serviceRadius', r.id)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                    selected
                      ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
