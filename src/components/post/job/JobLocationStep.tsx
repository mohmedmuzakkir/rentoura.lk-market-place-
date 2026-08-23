import React, { useState, useEffect } from 'react';
import { MapPin, Building, Laptop, Calendar, Clock, AlertCircle } from 'lucide-react';
import { ListingDraft, LocationDataState } from '../../../types/postFormTypes';
import { LocationService, CanonicalLocation } from '../../../services/locationService';

interface JobLocationStepProps {
  draft: ListingDraft;
  onChange: (updatedDraftPartial: Partial<ListingDraft>) => void;
  errors: Record<string, string>;
  accentColor?: string;
}

export const JobLocationStep: React.FC<JobLocationStepProps> = ({
  draft,
  onChange,
  errors,
  accentColor = '#08A34F'
}) => {
  const workMode = draft.formValues.workMode || 'onsite';
  const remoteScope = draft.formValues.remoteScope || 'islandwide';
  const workingDays = draft.formValues.workingDays || 'mon-fri';
  const shiftType = draft.formValues.shiftType || 'day';
  const workingHours = draft.formValues.workingHours || '';

  const locationState = draft.location || {};

  const [provinces, setProvinces] = useState<CanonicalLocation[]>([]);
  const [districts, setDistricts] = useState<CanonicalLocation[]>([]);
  const [cities, setCities] = useState<CanonicalLocation[]>([]);

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
      if (!locationState.provinceId && !locationState.provinceName) {
        setDistricts([]);
        return;
      }
      const prov = provinces.find(p => p.id === locationState.provinceId || p.name === locationState.provinceName);
      if (prov) {
        const dists = await LocationService.getDistricts(prov.id);
        if (isMounted) setDistricts(dists);
      }
    }
    loadDistricts();
    return () => { isMounted = false; };
  }, [locationState.provinceId, locationState.provinceName, provinces]);

  // Load Cities when selected District changes
  useEffect(() => {
    let isMounted = true;
    async function loadCities() {
      if (!locationState.districtId && !locationState.districtName) {
        setCities([]);
        return;
      }
      const dist = districts.find(d => d.id === locationState.districtId || d.name === locationState.districtName);
      if (dist) {
        const cits = await LocationService.getCities(dist.id);
        if (isMounted) setCities(cits);
      }
    }
    loadCities();
    return () => { isMounted = false; };
  }, [locationState.districtId, locationState.districtName, districts]);

  const updateFormValue = (key: string, val: any) => {
    onChange({
      formValues: {
        ...draft.formValues,
        [key]: val
      }
    });
  };

  const updateLocation = (partialLoc: Partial<LocationDataState>) => {
    onChange({
      location: {
        ...draft.location,
        ...partialLoc
      }
    });
  };

  const handleWorkModeChange = (mode: 'onsite' | 'hybrid' | 'remote') => {
    updateFormValue('workMode', mode);
  };

  const handleProvinceChange = (provinceId: string) => {
    const prov = provinces.find(p => p.id === provinceId);
    updateLocation({
      provinceId,
      provinceName: prov ? prov.name : '',
      districtId: '',
      districtName: '',
      cityId: '',
      cityName: '',
      areaId: '',
      areaName: ''
    });
  };

  const handleDistrictChange = (districtId: string) => {
    const dist = districts.find(d => d.id === districtId);
    updateLocation({
      districtId,
      districtName: dist ? dist.name : '',
      cityId: '',
      cityName: '',
      areaId: '',
      areaName: ''
    });
  };

  const handleCityChange = (cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    updateLocation({
      cityId,
      cityName: city ? city.name : '',
      areaId: '',
      areaName: ''
    });
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-200">
      {/* Title Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
            Step 3: Location & Work Type
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            42% Completed
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Define work arrangements, Sri Lankan workplace location, and shift schedule.
        </p>
      </div>

      {/* Main Form Content */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
        {/* Work Mode Selection */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-2">
            Work Mode <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => handleWorkModeChange('onsite')}
              className={`p-3 rounded-xl border text-left transition-all tap-bounce ${
                workMode === 'onsite'
                  ? 'bg-emerald-50/90 border-[#08A34F] text-slate-900 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs mb-1">
                <Building className="w-4 h-4 text-[#08A34F]" /> On-Site
              </div>
              <p className="text-[11px] text-slate-500">Work physically at workplace location</p>
            </button>

            <button
              type="button"
              onClick={() => handleWorkModeChange('hybrid')}
              className={`p-3 rounded-xl border text-left transition-all tap-bounce ${
                workMode === 'hybrid'
                  ? 'bg-emerald-50/90 border-[#08A34F] text-slate-900 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs mb-1">
                <MapPin className="w-4 h-4 text-[#08A34F]" /> Hybrid
              </div>
              <p className="text-[11px] text-slate-500">Mix of office and remote working</p>
            </button>

            <button
              type="button"
              onClick={() => handleWorkModeChange('remote')}
              className={`p-3 rounded-xl border text-left transition-all tap-bounce ${
                workMode === 'remote'
                  ? 'bg-emerald-50/90 border-[#08A34F] text-slate-900 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs mb-1">
                <Laptop className="w-4 h-4 text-[#08A34F]" /> Remote
              </div>
              <p className="text-[11px] text-slate-500">100% Work from home / Anywhere</p>
            </button>
          </div>
        </div>

        {/* Structured Sri Lankan Location (If On-Site or Hybrid) */}
        {workMode !== 'remote' ? (
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#08A34F]" /> Workplace Location (Sri Lanka)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Province */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Province <span className="text-rose-500">*</span>
                </label>
                <select
                  value={locationState.provinceId || ''}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.province ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
                  }`}
                >
                  <option value="">Select Province</option>
                  {provinces.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                {errors.province && <p className="text-[11px] text-rose-600 mt-1">{errors.province}</p>}
              </div>

              {/* District */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  District <span className="text-rose-500">*</span>
                </label>
                <select
                  disabled={!locationState.provinceId}
                  value={locationState.districtId || ''}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 ${
                    errors.district ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
                  }`}
                >
                  <option value="">Select District</option>
                  {districts.map(d => (
                    <option key={d.id} value={d.id}>{d.name} District</option>
                  ))}
                </select>
                {errors.district && <p className="text-[11px] text-rose-600 mt-1">{errors.district}</p>}
              </div>

              {/* City */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  City / Town <span className="text-rose-500">*</span>
                </label>
                <select
                  disabled={!locationState.districtId}
                  value={locationState.cityId || ''}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 ${
                    errors.city ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
                  }`}
                >
                  <option value="">Select City / Town</option>
                  {cities.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.city && <p className="text-[11px] text-rose-600 mt-1">{errors.city}</p>}
              </div>

              {/* Workplace Address */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Workplace Address (Optional)
                </label>
                <input
                  type="text"
                  value={locationState.address || ''}
                  onChange={(e) => updateLocation({ address: e.target.value })}
                  placeholder="e.g. No. 45, Peradeniya Road, Kandy"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Remote Scope Selector */
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <label className="text-xs font-bold text-slate-800 block">
              Remote Work Scope
            </label>
            <select
              value={remoteScope}
              onChange={(e) => updateFormValue('remoteScope', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="islandwide">Islandwide Sri Lanka (Candidates anywhere in SL)</option>
              <option value="international">Global / International (Open to worldwide applicants)</option>
              <option value="city-preferred">City/District Preferred for Occasional Meetings</option>
            </select>
          </div>
        )}

        {/* Working Days & Schedule */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Working Days
            </label>
            <select
              value={workingDays}
              onChange={(e) => updateFormValue('workingDays', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="mon-fri">Monday to Friday (5 Days)</option>
              <option value="mon-sat">Monday to Saturday (6 Days)</option>
              <option value="rotational">5-Day Rotational Schedule</option>
              <option value="shifts">Shift Basis (Day / Night Rotation)</option>
              <option value="flexible">Flexible Days / Freelance</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" /> Shift Arrangement
            </label>
            <select
              value={shiftType}
              onChange={(e) => updateFormValue('shiftType', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="day">Day Shift (Regular Office Hours)</option>
              <option value="night">Night Shift / Evening Shift</option>
              <option value="rotational">Rotational 24/7 Shifts</option>
              <option value="flexible">Flexible Hours / Goal Driven</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1.5">
            Working Hours Note (Optional)
          </label>
          <input
            type="text"
            value={workingHours}
            onChange={(e) => updateFormValue('workingHours', e.target.value)}
            placeholder="e.g. 8:30 AM - 5:00 PM (1 hour lunch break)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>
    </div>
  );
};
