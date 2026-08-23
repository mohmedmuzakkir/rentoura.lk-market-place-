import React from 'react';
import { RENTAL_PERIOD_OPTIONS } from '../../data/advancedFilterConfig';

interface RentalPeriodSectionProps {
  selectedPeriod: 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  onChange: (period: 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly') => void;
  primaryColor: string;
}

export const RentalPeriodSection: React.FC<RentalPeriodSectionProps> = ({
  selectedPeriod,
  onChange,
  primaryColor
}) => {
  return (
    <div>
      <div className="grid grid-cols-5 gap-1.5">
        {RENTAL_PERIOD_OPTIONS.map((item) => {
          const isSelected = selectedPeriod === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id as any)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-50/90 border-[#1464F4] text-[#1464F4] shadow-xs font-black ring-1 ring-[#1464F4]'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-base mb-1">{item.icon}</span>
              <span className="text-[11px] font-bold tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
