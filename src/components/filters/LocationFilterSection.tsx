import React, { useState, useEffect } from 'react';
import { ChevronDown, Navigation, Loader2 } from 'lucide-react';
import { LocationFilterData } from '../../types/filterTypes';
import { LocationService, CanonicalLocation } from '../../services/locationService';

interface LocationFilterSectionProps {
  location: LocationFilterData;
  onChange: (location: LocationFilterData) => void;
  primaryColor: string;
}

export const LocationFilterSection: React.FC<LocationFilterSectionProps> = ({
  location,
  onChange,
  primaryColor
}) => {
  const [provinces, setProvinces] = useState<CanonicalLocation[]>([]);
  const [districts, setDistricts] = useState<CanonicalLocation[]>([]);
  const [cities, setCities] = useState<CanonicalLocation[]>([]);
  const [areas, setAreas] = useState<CanonicalLocation[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [geoMessage, setGeoMessage] = useState<string | null>(null);

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
      const prov = provinces.find(p => p.name === location.provinceName || p.id === location.provinceId);
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
      const dist = districts.find(d => d.name === location.districtName || d.id === location.districtId);
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
      const city = cities.find(c => c.name === location.cityName || c.id === location.cityId);
      if (city) {
        const ars = await LocationService.getAreas(city.id);
        if (isMounted) setAreas(ars);
      }
    }
    loadAreas();
    return () => { isMounted = false; };
  }, [location.cityId, location.cityName, cities]);

  // Handlers
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pName = e.target.value;
    if (!pName) {
      onChange({});
      return;
    }
    const prov = provinces.find(p => p.name === pName);
    onChange({
      provinceId: prov?.id,
      provinceName: prov?.name,
      districtId: undefined,
      districtName: undefined,
      cityId: undefined,
      cityName: undefined,
      areaId: undefined,
      areaName: undefined
    });
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dName = e.target.value;
    if (!dName) {
      onChange({
        ...location,
        districtId: undefined,
        districtName: undefined,
        cityId: undefined,
        cityName: undefined,
        areaId: undefined,
        areaName: undefined
      });
      return;
    }
    const dist = districts.find(d => d.name === dName);
    onChange({
      ...location,
      districtId: dist?.id,
      districtName: dist?.name,
      cityId: undefined,
      cityName: undefined,
      areaId: undefined,
      areaName: undefined
    });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cName = e.target.value;
    if (!cName) {
      onChange({
        ...location,
        cityId: undefined,
        cityName: undefined,
        areaId: undefined,
        areaName: undefined
      });
      return;
    }
    const city = cities.find(c => c.name === cName);
    onChange({
      ...location,
      cityId: city?.id,
      cityName: city?.name,
      areaId: undefined,
      areaName: undefined
    });
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const aName = e.target.value;
    const area = areas.find(a => a.name === aName);
    onChange({
      ...location,
      areaId: area?.id,
      areaName: aName || undefined
    });
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoMessage('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setGeoMessage(null);

    navigator.geolocation.getCurrentPosition(
      async () => {
        setIsLocating(false);
        if (provinces.length > 0) {
          const western = provinces.find(p => p.name.toLowerCase().includes('western')) || provinces[0];
          const dists = await LocationService.getDistricts(western.id);
          const colomboDist = dists.find(d => d.name.toLowerCase().includes('colombo')) || dists[0];
          onChange({
            provinceId: western.id,
            provinceName: western.name,
            districtId: colomboDist?.id,
            districtName: colomboDist?.name,
            isNearMe: true
          });
          setGeoMessage(`Location set to: ${colomboDist ? colomboDist.name + ', ' : ''}${western.name}`);
        }
      },
      (error) => {
        setIsLocating(false);
        setGeoMessage('Location permission denied. Please select manually.');
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="space-y-3.5">
      {/* 1. Province */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          Province
        </label>
        <div className="relative">
          <select
            value={location.provinceName || ''}
            onChange={handleProvinceChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-semibold focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
          >
            <option value="">All Sri Lanka</option>
            {provinces.map(p => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* 2. District */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          District
        </label>
        <div className="relative">
          <select
            value={location.districtName || ''}
            onChange={handleDistrictChange}
            disabled={!location.provinceName && districts.length === 0}
            className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-semibold focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer ${
              !location.provinceName ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            <option value="">All Districts in {location.provinceName || 'Province'}</option>
            {districts.map(d => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* 3. City / Town */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          City / Town
        </label>
        <div className="relative">
          <select
            value={location.cityName || ''}
            onChange={handleCityChange}
            disabled={!location.districtName || cities.length === 0}
            className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-semibold focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer ${
              !location.districtName || cities.length === 0 ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            <option value="">
              {!location.districtName ? 'Choose District First' : (cities.length === 0 ? 'No cities in DB for this district' : `All Cities in ${location.districtName}`)}
            </option>
            {cities.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* 4. Area / Village */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          Area / Village
        </label>
        <div className="relative">
          <select
            value={location.areaName || ''}
            onChange={handleAreaChange}
            disabled={!location.cityName || areas.length === 0}
            className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-semibold focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer ${
              !location.cityName || areas.length === 0 ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            <option value="">
              {!location.cityName ? 'Choose City First' : (areas.length === 0 ? 'No areas registered' : `All Areas in ${location.cityName}`)}
            </option>
            {areas.map(a => (
              <option key={a.id} value={a.name}>{a.name}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* 5. Use My Current Location Button */}
      <button
        type="button"
        onClick={handleUseCurrentLocation}
        disabled={isLocating}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-50/90 hover:bg-blue-100/90 text-[#1464F4] text-xs font-bold border border-blue-200/80 transition-all cursor-pointer shadow-2xs mt-2"
      >
        {isLocating ? (
          <Loader2 className="w-4 h-4 animate-spin text-[#1464F4]" />
        ) : (
          <Navigation className="w-3.5 h-3.5 text-[#1464F4]" />
        )}
        <span>{isLocating ? 'Detecting Location...' : 'Use My Current Location'}</span>
      </button>

      {geoMessage && (
        <p className={`text-[11px] font-medium mt-1.5 ${geoMessage.includes('denied') ? 'text-amber-600' : 'text-emerald-600'}`}>
          {geoMessage}
        </p>
      )}
    </div>
  );
};
