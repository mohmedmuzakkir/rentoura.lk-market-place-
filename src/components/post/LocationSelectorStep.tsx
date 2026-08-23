import React, { useState, useEffect } from 'react';
import { LocationService, CanonicalLocation } from '../../services/locationService';
import { LocationDataState } from '../../types/postFormTypes';
import { MapPin } from 'lucide-react';

interface LocationSelectorStepProps {
  location: LocationDataState;
  onChangeLocation: (newLocation: LocationDataState) => void;
  accentColor?: string;
}

export const LocationSelectorStep: React.FC<LocationSelectorStepProps> = ({
  location,
  onChangeLocation,
  accentColor = '#1464F4'
}) => {
  const [provinces, setProvinces] = useState<CanonicalLocation[]>([]);
  const [districts, setDistricts] = useState<CanonicalLocation[]>([]);
  const [cities, setCities] = useState<CanonicalLocation[]>([]);
  const [areas, setAreas] = useState<CanonicalLocation[]>([]);

  // Load Provinces on Mount
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
    if (!prov) {
      onChangeLocation({
        ...location,
        provinceId: '',
        provinceName: '',
        districtId: '',
        districtName: '',
        cityId: '',
        cityName: '',
        areaId: '',
        areaName: ''
      });
      return;
    }

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
    if (!dist) {
      onChangeLocation({
        ...location,
        districtId: '',
        districtName: '',
        cityId: '',
        cityName: '',
        areaId: '',
        areaName: ''
      });
      return;
    }

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
    if (!city) {
      onChangeLocation({
        ...location,
        cityId: '',
        cityName: '',
        areaId: '',
        areaName: ''
      });
      return;
    }

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
    onChangeLocation({
      ...location,
      areaId: area?.id || '',
      areaName: area?.name || ''
    });
  };

  return (
    <div className="space-y-4 text-left">
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3.5 flex items-center gap-3">
        <MapPin className="w-5 h-5 text-[#1464F4] flex-shrink-0" />
        <div className="text-xs">
          <p className="font-bold text-slate-900">Sri Lanka Administrative Location</p>
          <p className="text-slate-500 text-[11px] leading-tight">
            Selected:{' '}
            <span className="font-semibold text-slate-800">
              {location.districtName ? `${location.districtName}` : ''}
              {location.provinceName ? `, ${location.provinceName}` : 'No location selected'}
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1. Province Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
            <span>1. Province</span>
            <span className="text-rose-500">*</span>
          </label>
          <select
            value={location.provinceId || ''}
            onChange={(e) => handleProvinceChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs"
          >
            <option value="">-- Select Province --</option>
            {provinces.map((prov) => (
              <option key={prov.id} value={prov.id}>
                {prov.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. District Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
            <span>2. District</span>
            <span className="text-rose-500">*</span>
          </label>
          <select
            value={location.districtId || ''}
            onChange={(e) => handleDistrictChange(e.target.value)}
            disabled={!location.provinceId || districts.length === 0}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs disabled:bg-slate-100 disabled:text-slate-400"
          >
            <option value="">
              {!location.provinceId ? 'Select province first' : '-- Select District --'}
            </option>
            {districts.map((dist) => (
              <option key={dist.id} value={dist.id}>
                {dist.name}
              </option>
            ))}
          </select>
        </div>

        {/* 3. City / Town Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
            <span>3. City / Town</span>
            <span className="text-slate-400 font-normal text-[10px]">(Optional / If Seeded)</span>
          </label>
          <select
            value={location.cityId || ''}
            onChange={(e) => handleCityChange(e.target.value)}
            disabled={!location.districtId || cities.length === 0}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs disabled:bg-slate-100 disabled:text-slate-400"
          >
            <option value="">
              {!location.districtId ? 'Select district first' : (cities.length === 0 ? 'No cities seeded for this district' : '-- Select City / Town --')}
            </option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Area / Suburb Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
            <span>4. Specific Area / Suburb</span>
            <span className="text-slate-400 font-normal text-[10px]">(Optional)</span>
          </label>
          <select
            value={location.areaId || ''}
            onChange={(e) => handleAreaChange(e.target.value)}
            disabled={!location.cityId || areas.length === 0}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs disabled:bg-slate-100 disabled:text-slate-400"
          >
            <option value="">
              {!location.cityId ? 'Select city first' : (areas.length === 0 ? 'No sub-areas listed' : '-- Select Sub-Area --')}
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
      <div className="space-y-1.5 pt-2">
        <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
          <span>Street Address / Prominent Landmark</span>
          <span className="text-[10px] text-slate-400 font-normal">e.g. Main Street, near Station</span>
        </label>
        <input
          type="text"
          value={location.address || ''}
          onChange={(e) => onChangeLocation({ ...location, address: e.target.value })}
          placeholder="e.g. No. 45, Station Road"
          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs"
        />
      </div>
    </div>
  );
};
