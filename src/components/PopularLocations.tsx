import React from 'react';
import { MapPin, ChevronRight } from 'lucide-react';
import { LocationItem, AppRoute } from '../types';

interface PopularLocationsProps {
  locations: (LocationItem & { searchCount?: number })[];
  onSelectLocation: (locationName: string) => void;
  onNavigate: (route: AppRoute) => void;
}

export const PopularLocations: React.FC<PopularLocationsProps> = ({
  locations,
  onSelectLocation,
  onNavigate
}) => {
  // Sort by searchCount descending if searchCount exists, otherwise retain input order
  const rankedLocations = React.useMemo(() => {
    return [...locations].sort((a, b) => (b.searchCount ?? 0) - (a.searchCount ?? 0));
  }, [locations]);

  return (
    <section className="mt-8 max-w-md lg:max-w-7xl mx-auto px-4 lg:px-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[17px] lg:text-xl font-bold text-slate-900 font-heading tracking-tight">
            Popular Locations
          </h2>
          <p className="hidden lg:block text-xs text-slate-500 font-medium mt-0.5">
            Discover active rental listings across key Sri Lankan provinces
          </p>
        </div>
        <button
          onClick={() => onNavigate('/rentals')}
          className="text-[12.5px] lg:text-sm font-bold text-[#1464F4] hover:text-[#0c4cc2] flex items-center gap-0.5 tap-bounce"
        >
          View All <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>

      {/* Mobile Scroll / Desktop Grid */}
      <div className="flex lg:grid lg:grid-cols-5 items-center gap-3 lg:gap-4 overflow-x-auto lg:overflow-visible pb-2 no-scrollbar scroll-smooth">
        {rankedLocations.map((loc) => (
          <button
            key={loc.id}
            onClick={() => onSelectLocation(loc.name)}
            className="relative shrink-0 w-[112px] lg:w-full h-[132px] lg:h-[150px] rounded-2xl overflow-hidden group shadow-sm hover:shadow-lg border border-slate-200/60 text-left tap-bounce focus:outline-none transition-all duration-300"
          >
            {/* Background Photo */}
            <img
              src={loc.imageUrl}
              alt={loc.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />

            {/* Dark Gradient Overlay for Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

            {/* Bottom Content */}
            <div className="absolute bottom-3 left-3 right-3 z-10">
              <div className="flex items-center gap-1 text-white">
                <MapPin className="w-3.5 h-3.5 text-white/90 shrink-0" />
                <span className="text-[12px] lg:text-sm font-bold tracking-tight truncate leading-none">
                  {loc.name}
                </span>
              </div>
              <p className="text-[9.5px] lg:text-xs text-white/80 font-medium tracking-tight mt-1 pl-0.5 truncate">
                {loc.province}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
