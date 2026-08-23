import React from 'react';
import { Heart, MapPin, Building2, Briefcase, Wrench, ChevronDown, Inbox } from 'lucide-react';
import { AppRoute } from '../types';

export interface FeedListingItem {
  id: string;
  title: string;
  module: 'rentals' | 'jobs' | 'services';
  category: string;
  location: string;
  priceOrSalary: string;
  periodOrType: string;
  imageUrl: string;
  postedDate: string;
  badgeLabel?: string;
  badgeColor?: string;
}

interface HomeListingFeedProps {
  items: FeedListingItem[];
  totalCount: number;
  hasMore: boolean;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  onLoadMore: () => void;
  activeTab: 'all' | 'rentals' | 'jobs' | 'services';
  onTabChange: (tab: 'all' | 'rentals' | 'jobs' | 'services') => void;
  savedListings: string[];
  onToggleSave: (id: string) => void;
  onSelectListing: (listing: any) => void;
  onNavigate: (route: AppRoute) => void;
}

export const HomeListingFeed: React.FC<HomeListingFeedProps> = ({
  items,
  totalCount,
  hasMore,
  isLoading = false,
  isLoadingMore = false,
  onLoadMore,
  activeTab,
  onTabChange,
  savedListings,
  onToggleSave,
  onSelectListing,
  onNavigate
}) => {
  const getModuleBadgeStyle = (module: string) => {
    switch (module) {
      case 'rentals':
        return 'bg-[#1464F4] text-white';
      case 'jobs':
        return 'bg-[#08A34F] text-white';
      case 'services':
        return 'bg-[#FF650A] text-white';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  return (
    <section className="mt-10 max-w-md lg:max-w-7xl mx-auto px-4 lg:px-8">
      {/* Header & Module Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1464F4] animate-pulse"></span>
            <h2 className="text-[18px] lg:text-2xl font-black text-slate-900 font-heading tracking-tight">
              Latest Marketplace Feed
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Continuous stream of newly published rentals, job openings, and services across Sri Lanka
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => onTabChange('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#041C43] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            All Listings ({totalCount})
          </button>
          <button
            onClick={() => onTabChange('rentals')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'rentals'
                ? 'bg-[#1464F4] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Rentals
          </button>
          <button
            onClick={() => onTabChange('jobs')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'jobs'
                ? 'bg-[#08A34F] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Jobs
          </button>
          <button
            onClick={() => onTabChange('services')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'services'
                ? 'bg-[#FF650A] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            Services
          </button>
        </div>
      </div>

      {/* Initial Loading Skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="bg-white rounded-2xl h-[260px] border border-slate-200/80 animate-pulse p-3 flex flex-col justify-between">
              <div className="w-full h-[140px] bg-slate-200 rounded-xl" />
              <div className="space-y-2 mt-2">
                <div className="w-1/3 h-3 bg-slate-200 rounded" />
                <div className="w-full h-4 bg-slate-200 rounded" />
                <div className="w-1/2 h-3 bg-slate-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        /* Truthful Empty State */
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center my-6 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-slate-900 font-bold text-base font-heading">No listings available yet</h3>
          <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
            There are currently no approved public listings under this section. Check back soon or post the first listing!
          </p>
          <button
            onClick={() => onNavigate('/post')}
            className="mt-4 px-5 py-2.5 bg-[#1464F4] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            + Post a Free Listing
          </button>
        </div>
      ) : (
        /* Grid of Feed Items */
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-5">
          {items.map((item) => {
            const isSaved = savedListings.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => onSelectListing(item)}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col group cursor-pointer tap-bounce"
              >
                {/* Image Container */}
                <div className="relative h-[130px] sm:h-[150px] lg:h-[170px] w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {/* Module Badge */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold tracking-wider uppercase shadow-xs ${getModuleBadgeStyle(item.module)}`}>
                      {item.badgeLabel}
                    </span>
                  </div>

                  {/* Heart Save Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSave(item.id);
                    }}
                    className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-black/35 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/55 active:scale-90 transition-all"
                    aria-label="Save listing"
                  >
                    <Heart
                      className={`w-4 h-4 stroke-[2.2] ${
                        isSaved ? 'fill-[#EA384D] text-[#EA384D]' : 'text-white'
                      }`}
                    />
                  </button>
                </div>

                {/* Details Content */}
                <div className="p-3 lg:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      {item.category}
                    </div>
                    <h3 className="text-slate-900 font-bold text-xs lg:text-sm line-clamp-2 group-hover:text-[#1464F4] transition-colors leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                    {/* Price / Salary */}
                    <div className="flex items-baseline justify-between gap-1">
                      <span className="text-[13px] lg:text-base font-black text-slate-900 truncate">
                        {item.priceOrSalary}
                      </span>
                      <span className="text-[10px] font-medium text-slate-500 truncate">
                        {item.periodOrType}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && !isLoading && (
        <div className="mt-8 text-center">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="px-8 py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs lg:text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 mx-auto disabled:opacity-50 cursor-pointer"
          >
            {isLoadingMore ? (
              <span>Loading more listings...</span>
            ) : (
              <>
                <span>Load More Listings</span>
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
};
