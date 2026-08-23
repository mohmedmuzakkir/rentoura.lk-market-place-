import React from 'react';
import { Search, MapPin, LayoutGrid, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { FilterState } from '../types';

interface SearchAndFilterPanelProps {
  filterState: FilterState;
  onSearchChange: (query: string) => void;
  onOpenLocationModal: () => void;
  onOpenCategoryModal: () => void;
  onOpenFilterModal: () => void;
  onPerformSearch: () => void;
}

export const SearchAndFilterPanel: React.FC<SearchAndFilterPanelProps> = ({
  filterState,
  onSearchChange,
  onOpenLocationModal,
  onOpenCategoryModal,
  onOpenFilterModal,
  onPerformSearch
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onPerformSearch();
    }
  };

  return (
    <div className="relative px-4 -mt-6 lg:-mt-10 z-20 max-w-md lg:max-w-7xl mx-auto">
      <div className="bg-white rounded-3xl p-3.5 lg:p-5 shadow-[0_12px_36px_rgba(4,28,67,0.12)] border border-slate-100/90 transition-all">
        {/* Mobile View & Desktop Container */}
        <div className="lg:flex lg:items-center lg:gap-3 space-y-2.5 lg:space-y-0">
          {/* Main Search Input */}
          <div className="flex-1 flex items-center gap-2 bg-slate-50/80 hover:bg-slate-50 focus-within:bg-white rounded-2xl px-3.5 py-1.5 lg:py-2.5 border border-slate-200/70 focus-within:border-[#1464F4] focus-within:ring-2 focus-within:ring-[#1464F4]/15 transition-all">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={filterState.searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search rentals, jobs or services..."
              className="w-full bg-transparent text-[14px] lg:text-[15px] text-slate-800 placeholder-slate-400 focus:outline-none py-1.5 font-medium"
            />
            {/* Search button for mobile inside field */}
            <button
              onClick={onPerformSearch}
              className="lg:hidden w-9 h-9 bg-[#1464F4] hover:bg-[#0f54d4] active:scale-95 text-white rounded-full flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(20,100,244,0.35)] transition-all tap-bounce"
              aria-label="Search"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* 3 Quick Selector Pills */}
          <div className="grid grid-cols-3 lg:flex lg:items-center gap-2 lg:gap-3">
            {/* Location Pill */}
            <button
              onClick={onOpenLocationModal}
              className="flex items-center justify-between p-2 lg:px-4 lg:py-3 rounded-xl bg-slate-50/90 hover:bg-slate-100/80 border border-slate-200/70 active:scale-[0.98] transition-all text-left group lg:min-w-[170px]"
            >
              <div className="min-w-0 flex-1 pr-1">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#1464F4] shrink-0" />
                  <span className="text-[11px] lg:text-xs font-bold text-slate-800 tracking-tight truncate">
                    Location
                  </span>
                </div>
                <p className="text-[9.5px] lg:text-[11px] text-slate-500 font-medium truncate mt-0.5 pl-0.5">
                  {filterState.selectedLocation || 'Kandy, Central'}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0 transition-transform" />
            </button>

            {/* Category Pill */}
            <button
              onClick={onOpenCategoryModal}
              className="flex items-center justify-between p-2 lg:px-4 lg:py-3 rounded-xl bg-slate-50/90 hover:bg-slate-100/80 border border-slate-200/70 active:scale-[0.98] transition-all text-left group lg:min-w-[170px]"
            >
              <div className="min-w-0 flex-1 pr-1">
                <div className="flex items-center gap-1">
                  <LayoutGrid className="w-3.5 h-3.5 text-[#08A34F] shrink-0" />
                  <span className="text-[11px] lg:text-xs font-bold text-slate-800 tracking-tight truncate">
                    Category
                  </span>
                </div>
                <p className="text-[9.5px] lg:text-[11px] text-slate-500 font-medium truncate mt-0.5 pl-0.5">
                  {filterState.selectedCategory || 'All Categories'}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0 transition-transform" />
            </button>

            {/* Filters Pill */}
            <button
              onClick={onOpenFilterModal}
              className="flex items-center justify-between p-2 lg:px-4 lg:py-3 rounded-xl bg-slate-50/90 hover:bg-slate-100/80 border border-slate-200/70 active:scale-[0.98] transition-all text-left group lg:min-w-[150px]"
            >
              <div className="min-w-0 flex-1 pr-1">
                <div className="flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF650A] shrink-0" />
                  <span className="text-[11px] lg:text-xs font-bold text-slate-800 tracking-tight truncate">
                    Filters
                  </span>
                </div>
                <p className="text-[9.5px] lg:text-[11px] text-slate-500 font-medium truncate mt-0.5 pl-0.5">
                  Advanced
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0 transition-transform" />
            </button>
          </div>

          {/* Desktop Search Button */}
          <button
            onClick={onPerformSearch}
            className="hidden lg:flex px-6 py-3.5 bg-[#1464F4] hover:bg-[#0f54d4] text-white font-bold text-sm rounded-xl items-center justify-center gap-2 shadow-[0_4px_16px_rgba(20,100,244,0.35)] hover:shadow-lg transition-all"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            Search
          </button>
        </div>
      </div>
    </div>
  );
};
