import React from 'react';
import { BellOff, RefreshCw } from 'lucide-react';

interface NotificationEmptyStateProps {
  categoryLabel?: string;
  isSearchActive?: boolean;
  onResetFilters?: () => void;
}

export const NotificationEmptyState: React.FC<NotificationEmptyStateProps> = ({
  categoryLabel = 'All',
  isSearchActive = false,
  onResetFilters
}) => {
  return (
    <div className="w-full bg-white rounded-3xl border border-slate-100 p-8 sm:p-10 text-center shadow-xs flex flex-col items-center justify-center my-4">
      {/* Icon Circle */}
      <div className="w-16 h-16 rounded-3xl bg-blue-50/80 border border-blue-100/80 flex items-center justify-center text-[#1464F4] mb-3.5 shadow-xs">
        <BellOff className="w-8 h-8 stroke-[1.8]" />
      </div>

      <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
        {isSearchActive
          ? 'No matching notifications'
          : categoryLabel !== 'All'
          ? `No ${categoryLabel} notifications`
          : "You're all caught up!"}
      </h3>

      <p className="text-xs sm:text-[13px] text-slate-500 max-w-xs mt-1.5 leading-relaxed">
        {isSearchActive
          ? 'Try adjusting your search terms or clearing the filter.'
          : 'New updates regarding your rentals, jobs, messages, and saved listings will appear here.'}
      </p>

      {onResetFilters && (
        <button
          onClick={onResetFilters}
          className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors tap-bounce"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );
};
