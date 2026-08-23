import React from 'react';
import { PropertyFilterData } from '../../types/filterTypes';
import { 
  BEDROOM_OPTIONS, 
  BATHROOM_OPTIONS, 
  FURNISHING_OPTIONS, 
  PROPERTY_FACILITIES,
  PROPERTY_TYPES
} from '../../data/advancedFilterConfig';

interface PropertyFiltersSectionProps {
  property: PropertyFilterData;
  onChange: (property: PropertyFilterData) => void;
  primaryColor: string;
}

export const PropertyFiltersSection: React.FC<PropertyFiltersSectionProps> = ({
  property,
  onChange,
  primaryColor
}) => {
  const toggleFacility = (facilityName: string) => {
    const current = property.facilities || [];
    const updated = current.includes(facilityName)
      ? current.filter(f => f !== facilityName)
      : [...current, facilityName];
    onChange({ ...property, facilities: updated });
  };

  const togglePropertyType = (type: string) => {
    const current = property.propertyType || [];
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    onChange({ ...property, propertyType: updated });
  };

  return (
    <div className="space-y-4">
      {/* 1. Property Type */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Property Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {PROPERTY_TYPES.map(type => {
            const isSelected = property.propertyType?.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => togglePropertyType(type)}
                className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/90 border-[#1464F4] text-[#1464F4] font-bold shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Bedrooms */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Bedrooms
        </label>
        <div className="grid grid-cols-6 gap-1">
          {BEDROOM_OPTIONS.map(opt => {
            const isSelected = (property.bedrooms || 'Any') === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onChange({ ...property, bedrooms: opt })}
                className={`py-2 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/90 border-[#1464F4] text-[#1464F4] ring-1 ring-[#1464F4]'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Bathrooms */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Bathrooms
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {BATHROOM_OPTIONS.map(opt => {
            const isSelected = (property.bathrooms || 'Any') === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onChange({ ...property, bathrooms: opt })}
                className={`py-2 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/90 border-[#1464F4] text-[#1464F4] ring-1 ring-[#1464F4]'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Furnishing */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Furnishing
        </label>
        <div className="grid grid-cols-3 gap-2">
          {FURNISHING_OPTIONS.map(opt => {
            const isSelected = property.furnishing === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ ...property, furnishing: isSelected ? 'Any' : (opt.id as any) })}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer truncate ${
                  isSelected
                    ? 'bg-blue-50/90 border-[#1464F4] text-[#1464F4] ring-1 ring-[#1464F4]'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Facilities */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Facilities & Amenities
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PROPERTY_FACILITIES.map(fac => {
            const isChecked = property.facilities?.includes(fac.id);
            return (
              <button
                key={fac.id}
                type="button"
                onClick={() => toggleFacility(fac.id)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                  isChecked
                    ? 'bg-blue-50/90 border-[#1464F4] text-[#1464F4] font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="text-sm shrink-0">{fac.icon}</span>
                <span className="truncate">{fac.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
