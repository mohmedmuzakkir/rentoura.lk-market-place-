import React from 'react';
import { ServiceFilterData } from '../../types/filterTypes';
import { SERVICE_PRICING_TYPES, SERVICE_AVAILABILITY } from '../../data/advancedFilterConfig';

interface ServiceFilterDetailsSectionProps {
  service: ServiceFilterData;
  onChange: (service: ServiceFilterData) => void;
  primaryColor: string;
}

export const ServiceFilterDetailsSection: React.FC<ServiceFilterDetailsSectionProps> = ({
  service,
  onChange,
  primaryColor
}) => {
  const togglePricingType = (pt: string) => {
    const current = service.pricingType || [];
    const updated = current.includes(pt)
      ? current.filter(p => p !== pt)
      : [...current, pt];
    onChange({ ...service, pricingType: updated });
  };

  return (
    <div className="space-y-4">
      {/* 1. Pricing Type */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Pricing Structure
        </label>
        <div className="flex flex-wrap gap-1.5">
          {SERVICE_PRICING_TYPES.map(pt => {
            const isSelected = service.pricingType?.includes(pt);
            return (
              <button
                key={pt}
                type="button"
                onClick={() => togglePricingType(pt)}
                className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-orange-50 border-[#FF650A] text-[#FF650A] font-bold shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {pt}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Availability */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Availability
        </label>
        <div className="grid grid-cols-3 gap-2">
          {SERVICE_AVAILABILITY.map(opt => {
            const isSelected = service.availability === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ ...service, availability: isSelected ? 'Any' : (opt.id as any) })}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer truncate ${
                  isSelected
                    ? 'bg-orange-50 border-[#FF650A] text-[#FF650A] ring-1 ring-[#FF650A]'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Provider Type */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Provider Type
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['Any', 'Individual', 'Company'].map(pt => {
            const isSelected = (service.providerType || 'Any') === pt;
            return (
              <button
                key={pt}
                type="button"
                onClick={() => onChange({ ...service, providerType: pt as any })}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-orange-50 border-[#FF650A] text-[#FF650A] ring-1 ring-[#FF650A]'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {pt}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Emergency Service Toggle */}
      <div className="pt-1">
        <label className="flex items-center justify-between p-3 rounded-xl bg-orange-50/50 border border-orange-200/80 cursor-pointer">
          <div className="flex items-center gap-2.5">
            <span className="text-base">🚨</span>
            <div>
              <span className="block text-xs font-bold text-slate-800">24/7 Emergency Service</span>
              <span className="text-[10px] text-slate-500">Available for urgent callouts</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={!!service.emergencyService}
            onChange={(e) => onChange({ ...service, emergencyService: e.target.checked })}
            className="w-4 h-4 rounded text-[#FF650A] focus:ring-[#FF650A] cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
};
