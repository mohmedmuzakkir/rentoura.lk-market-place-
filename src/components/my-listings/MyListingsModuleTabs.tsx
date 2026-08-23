import React from 'react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

export type ModuleTabType = 'all' | 'rentals' | 'jobs' | 'services';

interface MyListingsModuleTabsProps {
  activeTab: ModuleTabType;
  onSelectTab: (tab: ModuleTabType) => void;
  onOpenFilters: () => void;
  isFilterActive?: boolean;
}

export const MyListingsModuleTabs: React.FC<MyListingsModuleTabsProps> = ({
  activeTab,
  onSelectTab,
  onOpenFilters,
  isFilterActive = false
}) => {
  const tabs: { id: ModuleTabType; label: string; activeColor: string; textColor: string }[] = [
    { id: 'all', label: 'All', activeColor: 'bg-[#1464F4] text-white shadow-xs', textColor: 'text-slate-700' },
    { id: 'rentals', label: 'Rentals', activeColor: 'bg-[#1464F4] text-white shadow-xs', textColor: 'text-[#1464F4]' },
    { id: 'jobs', label: 'Jobs', activeColor: 'bg-[#08A34F] text-white shadow-xs', textColor: 'text-[#08A34F]' },
    { id: 'services', label: 'Services', activeColor: 'bg-[#FF650A] text-white shadow-xs', textColor: 'text-[#FF650A]' }
  ];

  return (
    <div className="flex items-center justify-between gap-2">
      {/* Module Pill Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all select-none active:scale-95 ${
                isActive
                  ? tab.activeColor
                  : 'bg-white text-slate-700 hover:bg-slate-100/80 border border-slate-200/80'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filter Button */}
      <button
        onClick={onOpenFilters}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 border ${
          isFilterActive
            ? 'bg-blue-50 text-[#1464F4] border-[#1464F4]/40 shadow-xs'
            : 'bg-white text-slate-700 hover:bg-slate-100/80 border-slate-200/80'
        }`}
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-[#1464F4]" />
        <span>Filter</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>
    </div>
  );
};
