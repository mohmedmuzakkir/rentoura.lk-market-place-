import React, { useState } from 'react';
import { Search, X, ArrowUpDown, ChevronDown } from 'lucide-react';

export type SortOptionType = 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'most_viewed';

interface MyListingsSearchBarProps {
  totalFound: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOptionType;
  onSortChange: (sort: SortOptionType) => void;
  isSearchOpen: boolean;
  onCloseSearch?: () => void;
}

export const MyListingsSearchBar: React.FC<MyListingsSearchBarProps> = ({
  totalFound,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  isSearchOpen,
  onCloseSearch
}) => {
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const sortLabels: Record<SortOptionType, string> = {
    newest: 'Newest First',
    oldest: 'Oldest First',
    price_asc: 'Price: Low → High',
    price_desc: 'Price: High → Low',
    most_viewed: 'Most Viewed'
  };

  return (
    <div className="space-y-2.5">
      {/* Expandable Search Input within My Listings */}
      {isSearchOpen && (
        <div className="relative animate-in slide-in-from-top-2 duration-200">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search your listings by title, location, category..."
            className="w-full pl-9 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1464F4]/30 focus:border-[#1464F4] shadow-xs"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Summary line + Sort Selector */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-0.5">
        <span className="font-semibold text-slate-700">
          {totalFound} {totalFound === 1 ? 'Listing' : 'Listings'} Found
        </span>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className="flex items-center gap-1 font-medium text-slate-700 hover:text-slate-900 py-1 px-1.5 rounded-lg hover:bg-slate-100/80 transition-all"
          >
            <span>Sort:</span>
            <span className="font-bold text-slate-900">{sortLabels[sortBy]}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {isSortDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-20" 
                onClick={() => setIsSortDropdownOpen(false)} 
              />
              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-30 animate-in fade-in-50 zoom-in-95">
                {(Object.keys(sortLabels) as SortOptionType[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      onSortChange(key);
                      setIsSortDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                      sortBy === key 
                        ? 'bg-blue-50 text-[#1464F4]' 
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{sortLabels[key]}</span>
                    {sortBy === key && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1464F4]" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
