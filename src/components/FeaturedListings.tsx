import React from 'react';
import { Heart, ChevronRight, Sparkles } from 'lucide-react';
import { FeaturedListingItem, AppRoute } from '../types';
import { SearchService } from '../services/searchService';

interface FeaturedListingsProps {
  listings: FeaturedListingItem[];
  onToggleSave: (listingId: string) => void;
  onSelectListing: (listing: FeaturedListingItem) => void;
  onNavigate: (route: AppRoute) => void;
  isLoading?: boolean;
}

export const FeaturedListings: React.FC<FeaturedListingsProps> = ({
  listings,
  onToggleSave,
  onSelectListing,
  onNavigate,
  isLoading = false
}) => {
  if (!isLoading && listings.length === 0) {
    return null; // Hide cleanly if zero featured listings exist in production DB
  }

  return (
    <section className="mt-8 max-w-md lg:max-w-7xl mx-auto px-4 lg:px-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[17px] lg:text-xl font-bold text-slate-900 font-heading tracking-tight flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            Featured Listings
          </h2>
          <p className="hidden lg:block text-xs text-slate-500 font-medium mt-0.5">
            Active featured rentals, job openings, and services
          </p>
        </div>
        <button
          onClick={() => onNavigate('/rentals')}
          className="text-[12.5px] lg:text-sm font-bold text-[#1464F4] hover:text-[#0c4cc2] flex items-center gap-0.5 tap-bounce"
        >
          View All <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-[105px] lg:h-[180px] bg-slate-200/70 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        /* Mobile Scroll / Desktop Grid */
        <div className="flex lg:grid lg:grid-cols-4 items-center gap-3 lg:gap-5 overflow-x-auto lg:overflow-visible pb-2 no-scrollbar scroll-smooth">
          {listings.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectListing(item)}
              className="relative shrink-0 w-[160px] lg:w-full h-[105px] lg:h-[180px] rounded-2xl overflow-hidden group shadow-sm hover:shadow-lg border border-slate-200/60 cursor-pointer tap-bounce transition-all duration-300"
            >
              {/* Listing Image */}
              <img
                src={item.imageUrl || SearchService.NEUTRAL_PLACEHOLDER}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />

              {/* Dark gradient for badge contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/40 pointer-events-none" />

              {/* Top Left Badge */}
              <div className="absolute top-2 lg:top-3 left-2 lg:left-3 z-10">
                <span
                  className="px-2 lg:px-2.5 py-0.5 rounded-md text-[9px] lg:text-[10px] font-extrabold tracking-wider text-white shadow-sm uppercase"
                  style={{ backgroundColor: item.badgeColor }}
                >
                  {item.badgeType}
                </span>
              </div>

              {/* Top Right Heart Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave(item.id);
                }}
                className="absolute top-2 lg:top-3 right-2 lg:right-3 z-10 w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 active:scale-90 transition-all"
                aria-label="Save listing"
              >
                <Heart
                  className={`w-4 h-4 stroke-[2] ${
                    item.isSaved ? 'fill-[#EA384D] text-[#EA384D]' : 'text-white'
                  }`}
                />
              </button>

              {/* Title overlay on Desktop */}
              <div className="hidden lg:block absolute bottom-3 left-3 right-3 z-10">
                <h4 className="text-white text-xs font-bold truncate">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
