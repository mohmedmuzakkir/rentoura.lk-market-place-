import React, { useState, useEffect } from 'react';
import { LocationDataState } from '../../../types/postFormTypes';
import { LocationService, CanonicalLocation } from '../../../services/locationService';
import { MapPin, ShieldCheck, EyeOff, Eye } from 'lucide-react';

interface RentalLocationStepProps {
  location: LocationDataState;
  errors: Record<string, string>;
  onChangeLocation: (newLocation: LocationDataState) => void;
  accentColor?: string;
}

export const RentalLocationStep: React.FC<RentalLocationStepProps> = ({
  location,
  errors,
  onChangeLocation,
  accentColor = '#1464F4'
}) => {
  const [provinces, setProvinces] = useState<CanonicalLocation[]>([]);
  const [districts, setDistricts] = useState<CanonicalLocation[]>([]);
  const [cities, setCities] = useState<CanonicalLocation[]>([]);
  const [areas, setAreas] = useState<CanonicalLocation[]>([]);

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
      if (!location.provinceId && !location.provinceName) {
        setDistricts([]);
        return;
      }
      const prov = provinces.find(p => p.id === location.provinceId || p.name === location.provinceName);
      if (prov) {
        const dists = await LocationService.getDistricts(prov.id);
        if (isMounted) setDistricts(dists);
      }
    }
    loadDistricts();
    return () => { isMounted = false; };
  }, [location.provinceId, location.provinceName, provinces]);

  // Load Cities when selected District changes
  useEffect(() => {
    let isMounted = true;
    async function loadCities() {
      if (!location.districtId && !location.districtName) {
        setCities([]);
        return;
      }
      const dist = districts.find(d => d.id === location.districtId || d.name === location.districtName);
      if (dist) {
        const cits = await LocationService.getCities(dist.id);
        if (isMounted) setCities(cits);
      }
    }
    loadCities();
    return () => { isMounted = false; };
  }, [location.districtId, location.districtName, districts]);

  // Load Areas when selected City changes
  useEffect(() => {
    let isMounted = true;
    async function loadAreas() {
      if (!location.cityId && !location.cityName) {
        setAreas([]);
        return;
      }
      const city = cities.find(c => c.id === location.cityId || c.name === location.cityName);
      if (city) {
        const ars = await LocationService.getAreas(city.id);
        if (isMounted) setAreas(ars);
      }
    }
    loadAreas();
    return () => { isMounted = false; };
  }, [location.cityId, location.cityName, cities]);

  // Handle Province change -> safely reset child hierarchy
  const handleProvinceChange = (provinceId: string) => {
    const prov = provinces.find(p => p.id === provinceId);
    if (!prov) return;

    onChangeLocation({
      ...location,
      provinceId: prov.id,
      provinceName: prov.name,
      districtId: '',
      districtName: '',
      cityId: '',
      cityName: '',
      areaId: '',
      areaName: ''
    });
  };

  // Handle District change -> safely reset city & area
  const handleDistrictChange = (districtId: string) => {
    const dist = districts.find(d => d.id === districtId);
    if (!dist) return;

    onChangeLocation({
      ...location,
      districtId: dist.id,
      districtName: dist.name,
      cityId: '',
      cityName: '',
      areaId: '',
      areaName: ''
    });
  };

  // Handle City change -> safely reset area
  const handleCityChange = (cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    if (!city) return;

    onChangeLocation({
      ...location,
      cityId: city.id,
      cityName: city.name,
      areaId: '',
      areaName: ''
    });
  };

  // Handle Area change
  const handleAreaChange = (areaId: string) => {
    const area = areas.find(a => a.id === areaId);
    if (!area) return;

    onChangeLocation({
      ...location,
      areaId: area.id,
      areaName: area.name
    });
  };

  return (
    <div className="space-y-5 text-left animate-in fade-in duration-200">
      {/* Header Info */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3">
        <MapPin className="w-5 h-5 text-[#1464F4] flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold text-slate-900">Step 2: Location & Privacy Setting</p>
          <p className="text-slate-600 mt-0.5 leading-relaxed">
            Specify where the rental asset is located in Sri Lanka. You can choose whether to display the exact address or keep it approximate.
          </p>
        </div>
      </div>

      {/* Selected Breadcrumb Location */}
      <div className="bg-slate-900 text-white rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
            SL
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Location</span>
            <p className="text-xs font-extrabold text-white">
              {location.cityName || 'City / Town'}, {location.districtName || 'District'} ({location.provinceName || 'Province'})
            </p>
          </div>
        </div>
      </div>

      {/* Cascading Location Hierarchy Form */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
          Sri Lanka Administrative Hierarchy
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* 1. Province */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <span>1. Province</span>
              <span className="text-rose-500">*</span>
            </label>
            <select
              value={location.provinceId || ''}
              onChange={(e) => handleProvinceChange(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs ${
                errors.province ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
              }`}
            >
              <option value="">-- Select Province --</option>
              {provinces.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.name}
                </option>
              ))}
            </select>
            {errors.province && (
              <p className="text-[10px] text-rose-600 font-medium">{errors.province}</p>
            )}
          </div>

          {/* 2. District */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <span>2. District</span>
              <span className="text-rose-500">*</span>
            </label>
            <select
              value={location.districtId || ''}
              onChange={(e) => handleDistrictChange(e.target.value)}
              disabled={!location.provinceId || districts.length === 0}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs disabled:bg-slate-100 disabled:text-slate-400 ${
                errors.district ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
              }`}
            >
              <option value="">
                {location.provinceId ? '-- Select District --' : 'Select Province First'}
              </option>
              {districts.map((dist) => (
                <option key={dist.id} value={dist.id}>
                  {dist.name}
                </option>
              ))}
            </select>
            {errors.district && (
              <p className="text-[10px] text-rose-600 font-medium">{errors.district}</p>
            )}
          </div>

          {/* 3. City / Town */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <span>3. City / Town</span>
              <span className="text-rose-500">*</span>
            </label>
            <select
              value={location.cityId || ''}
              onChange={(e) => handleCityChange(e.target.value)}
              disabled={!location.districtId || cities.length === 0}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs disabled:bg-slate-100 disabled:text-slate-400 ${
                errors.city ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
              }`}
            >
              <option value="">
                {!location.districtId ? 'Select District First' : cities.length === 0 ? 'No cities listed' : '-- Select City / Town --'}
              </option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
            {errors.city && (
              <p className="text-[10px] text-rose-600 font-medium">{errors.city}</p>
            )}
          </div>

          {/* 4. Sub-Area / Suburb */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>4. Sub-Area / Neighborhood</span>
              <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
            </label>
            <select
              value={location.areaId || ''}
              onChange={(e) => handleAreaChange(e.target.value)}
              disabled={!location.cityId || areas.length === 0}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="">
                {!location.cityId
                  ? 'Select City First'
                  : areas.length === 0
                  ? 'No specific sub-areas listed'
                  : '-- Select Sub-Area --'}
              </option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Street Address / Landmark */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span>Street Address / Prominent Landmark</span>
            <span className="text-[10px] text-slate-400 font-normal">e.g. Near Clock Tower / Peradeniya Road</span>
          </label>
          <input
            type="text"
            value={location.address || ''}
            onChange={(e) => onChangeLocation({ ...location, address: e.target.value })}
            placeholder="e.g. No. 45, Peradeniya Road"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
          />
        </div>
      </div>

      {/* Sensitive Location Privacy Protection */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-extrabold text-slate-900">
            Address Privacy Control
          </h3>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          For sensitive residential properties or valuable equipment, you can choose to hide your exact street number from the public search results.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {/* Option 1: Approximate Neighborhood (Recommended) */}
          <button
            type="button"
            onClick={() => onChangeLocation({ ...location, hideExactAddress: true })}
            className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 tap-bounce ${
              location.hideExactAddress
                ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <EyeOff className={`w-4 h-4 mt-0.5 flex-shrink-0 ${location.hideExactAddress ? 'text-emerald-700' : 'text-slate-400'}`} />
            <div>
              <p className={`text-xs font-bold ${location.hideExactAddress ? 'text-emerald-900' : 'text-slate-800'}`}>
                Hide Exact Address (Recommended)
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                Public sees only City & District. Full address shared only upon booking approval.
              </p>
            </div>
          </button>

          {/* Option 2: Show Full Address */}
          <button
            type="button"
            onClick={() => onChangeLocation({ ...location, hideExactAddress: false })}
            className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 tap-bounce ${
              !location.hideExactAddress
                ? 'border-[#1464F4] bg-blue-50/70 shadow-xs ring-1 ring-blue-400'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <Eye className={`w-4 h-4 mt-0.5 flex-shrink-0 ${!location.hideExactAddress ? 'text-[#1464F4]' : 'text-slate-400'}`} />
            <div>
              <p className={`text-xs font-bold ${!location.hideExactAddress ? 'text-[#1464F4]' : 'text-slate-800'}`}>
                Display Exact Address Publicly
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                Ideal for commercial stores, banquet halls, and public vehicle depots.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
