import React from 'react';
import { Filter, X, ArrowRight } from 'lucide-react';
import { FilterChipItem } from '../../types/filterTypes';

interface ActiveFilterSummaryProps {
  chips: FilterChipItem[];
  totalCount: number;
  onClearAll: () => void;
  onViewResults: () => void;
  primaryColor: string;
}

export const ActiveFilterSummary: React.FC<ActiveFilterSummaryProps> = ({
  chips,
  totalCount,
  onClearAll,
  onViewResults,
  primaryColor
}) => {
  if (chips.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-center">
        <p className="text-xs text-slate-500 font-medium">
          No filters applied. Use the sections below to refine your search.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-4 shadow-xs relative overflow-hidden">
      {/* Top row: Title + Count + View Results link */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <div 
            className="w-7 h-7 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0"
            style={{ backgroundColor: primaryColor }}
          >
            <Filter className="w-3.5 h-3.5 fill-current" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 font-heading">
              Active Filters ({chips.length})
            </h4>
            <span className="text-[10px] text-slate-400 font-medium">
              {totalCount} matching listings
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onViewResults}
            className="text-xs font-bold flex items-center gap-1 hover:underline cursor-pointer"
            style={{ color: primaryColor }}
          >
            <span>View Results</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Chips flex wrap */}
      <div className="flex flex-wrap gap-1.5">
        {chips.map((chip) => (
          <div
            key={chip.id}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-50/90 text-[#1464F4] border border-blue-100 shadow-2xs group hover:bg-blue-100/80 transition-all"
          >
            <span className="text-xs shrink-0">{chip.icon}</span>
            <span className="truncate max-w-[130px]">{chip.label}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                chip.onRemove();
              }}
              className="w-3.5 h-3.5 rounded-full bg-blue-200/80 text-blue-700 hover:bg-blue-300 flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-0.5"
              title="Remove filter"
              aria-label={`Remove filter ${chip.label}`}
            >
              <X className="w-2.5 h-2.5 stroke-[2.5]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
