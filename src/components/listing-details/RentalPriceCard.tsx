import React from 'react';
import { Tag, Sparkles, CheckCircle2 } from 'lucide-react';
import { RentalRate, RentalPeriodUnit } from '../../types/listingDetailsTypes';

interface RentalPriceCardProps {
  rates: RentalRate[];
  activePeriod: RentalPeriodUnit;
  onPeriodChange: (period: RentalPeriodUnit) => void;
  isNegotiable?: boolean;
}

export const RentalPriceCard: React.FC<RentalPriceCardProps> = ({
  rates = [],
  activePeriod,
  onPeriodChange,
  isNegotiable = true
}) => {
  const currentRate = rates.find(r => r.unit === activePeriod) || rates[0];

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-xs space-y-3">
      {/* Price Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-black text-[#1464F4] tracking-tight">
            {currentRate ? currentRate.label : 'Price on request'}
          </span>
          <span className="text-xs font-bold text-slate-500">
            / {activePeriod || 'Period'}
          </span>
        </div>

        {isNegotiable && (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/80">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Negotiable Price</span>
          </div>
        )}
      </div>

      {/* Period Selection Pills */}
      {rates.length > 0 && (
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Select Rental Duration
          </label>
          <div className="flex flex-wrap gap-1.5">
            {rates.map((rate) => {
              const isSelected = rate.unit === activePeriod;
              return (
                <button
                  key={rate.unit}
                  onClick={() => onPeriodChange(rate.unit)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all tap-bounce ${
                    isSelected
                      ? 'bg-[#1464F4] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{rate.unit}</span>
                  <span className="opacity-75 text-[10px] ml-1">({rate.label})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
