import React from 'react';
import { Layers, Plus, RotateCcw, Search } from 'lucide-react';
import { AppRoute } from '../../types';

interface EmptyMyListingsStateProps {
  filterStatus: string;
  filterModule: string;
  searchQuery: string;
  onClearFilters: () => void;
  onNavigate: (route: AppRoute) => void;
}

export const EmptyMyListingsState: React.FC<EmptyMyListingsStateProps> = ({
  filterStatus,
  filterModule,
  searchQuery,
  onClearFilters,
  onNavigate
}) => {
  const getEmptyMessage = () => {
    if (searchQuery) {
      return {
        title: 'No matching listings found',
        description: `We couldn't find any listings matching "${searchQuery}".`,
        showReset: true,
        showPost: false
      };
    }

    if (filterStatus === 'pending') {
      return {
        title: 'No listings pending review',
        description: 'None of your listings are currently waiting for moderation review.',
        showReset: true,
        showPost: true
      };
    }

    if (filterStatus === 'rejected') {
      return {
        title: 'No rejected listings',
        description: 'Great! All your submitted listings are either active or approved.',
        showReset: true,
        showPost: false
      };
    }

    if (filterStatus === 'expired') {
      return {
        title: 'No expired listings',
        description: 'You do not have any expired listings at the moment.',
        showReset: true,
        showPost: false
      };
    }

    if (filterModule === 'rentals') {
      return {
        title: 'No rental listings yet',
        description: 'List your property, vehicle, or equipment to start earning rental income.',
        showReset: true,
        showPost: true
      };
    }

    if (filterModule === 'jobs') {
      return {
        title: 'No job listings yet',
        description: 'Post open vacancies and find qualified candidates across Sri Lanka.',
        showReset: true,
        showPost: true
      };
    }

    if (filterModule === 'services') {
      return {
        title: 'No service listings yet',
        description: 'Offer your professional trades, repair, or technical skills.',
        showReset: true,
        showPost: true
      };
    }

    return {
      title: 'No listings yet',
      description: 'Post your first Rental, Job, or Service and reach thousands of users today.',
      showReset: false,
      showPost: true
    };
  };

  const content = getEmptyMessage();

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs text-center flex flex-col items-center justify-center my-4 space-y-4">
      {/* Icon Circle */}
      <div className="w-16 h-16 rounded-3xl bg-blue-50/80 border border-blue-100 flex items-center justify-center text-[#1464F4]">
        {searchQuery ? (
          <Search className="w-7 h-7" />
        ) : (
          <Layers className="w-7 h-7" />
        )}
      </div>

      {/* Texts */}
      <div className="max-w-xs space-y-1.5">
        <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
          {content.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
          {content.description}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2.5 pt-2">
        {content.showReset && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}

        {content.showPost && (
          <button
            onClick={() => onNavigate('/post')}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1464F4] hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Post a Listing</span>
          </button>
        )}
      </div>
    </div>
  );
};
