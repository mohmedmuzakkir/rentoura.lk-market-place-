import React from 'react';
import { PriceFilterData } from '../../types/filterTypes';
import { ModuleType } from '../../data/categorySelectorData';
import { PRICE_PRESETS } from '../../data/advancedFilterConfig';

interface PriceRangeFilterSectionProps {
  module: ModuleType;
  price: PriceFilterData;
  onChange: (price: PriceFilterData) => void;
  primaryColor: string;
}

export const PriceRangeFilterSection: React.FC<PriceRangeFilterSectionProps> = ({
  module,
  price,
  onChange,
  primaryColor
}) => {
  const maxLimit = module === 'jobs' ? 1000000 : 500000;

  const handlePresetSelect = (presetKey: string) => {
    const preset = PRICE_PRESETS[presetKey];
    if (preset) {
      onChange({
        ...price,
        min: preset.min,
        max: preset.max,
        presetId: presetKey as any
      });
    }
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    onChange({
      ...price,
      min: Math.min(val, price.max - 5000),
      presetId: 'custom'
    });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    onChange({
      ...price,
      max: Math.max(val, price.min + 5000),
      presetId: 'custom'
    });
  };

  const formatPriceBadge = (num: number) => {
    if (num >= 1000000) return 'Rs. 1,000,000+';
    if (num >= 1000) return `Rs. ${num.toLocaleString()}${num === maxLimit ? '+' : ''}`;
    return `Rs. ${num}`;
  };

  return (
    <div className="space-y-4">
      {/* Min & Max Price Display Badges */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-2 text-center">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Min Price
          </span>
          <span className="text-xs font-black text-slate-800">
            {formatPriceBadge(price.min)}
          </span>
        </div>

        <span className="text-slate-300 font-bold text-xs">—</span>

        <div className="flex-1 bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-2 text-center">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Max Price
          </span>
          <span className="text-xs font-black text-slate-800">
            {formatPriceBadge(price.max)}
          </span>
        </div>
      </div>

      {/* Interactive Range Sliders */}
      <div className="space-y-2 pt-1">
        <div className="relative flex items-center h-4">
          <input
            type="range"
            min={0}
            max={maxLimit}
            step={5000}
            value={price.max}
            onChange={handleMaxChange}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1464F4]"
            style={{ accentColor: primaryColor }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-0.5">
          <span>Rs. 0</span>
          <span>Rs. 50K</span>
          <span>Rs. 100K+</span>
          <span>{formatPriceBadge(maxLimit)}</span>
        </div>
      </div>

      {/* Quick Presets row */}
      <div>
        <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Quick Presets
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {Object.entries(PRICE_PRESETS).map(([key, preset]) => {
            const isSelected = price.presetId === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handlePresetSelect(key)}
                className={`py-2 px-1 text-[11px] font-bold rounded-xl border text-center transition-all cursor-pointer truncate ${
                  isSelected
                    ? 'bg-blue-50/90 border-[#1464F4] text-[#1464F4] shadow-2xs font-black ring-1 ring-[#1464F4]'
                    : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
