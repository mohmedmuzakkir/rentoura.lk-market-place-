import React, { useState, useEffect } from 'react';
import { Heart, MapPin, ChevronRight, Sparkles } from 'lucide-react';
import { 
  RecommendationService, 
  RecommendedListingCardItem 
} from '../../services/recommendationService';
import { SavedListingService } from '../../services/savedListingService';

interface RecommendedListingsProps {
  currentListingId: string;
  module: 'rental' | 'job' | 'service' | 'rentals' | 'jobs' | 'services';
  categoryId?: string | null;
  themeColor?: string;
  onNavigate: (route: string) => void;
}

export const RecommendedListings: React.FC<RecommendedListingsProps> = ({
  currentListingId,
  module,
  categoryId = null,
  themeColor = '#1464F4',
  onNavigate
}) => {
  const [recommendations, setRecommendations] = useState<RecommendedListingCardItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  // Load recommendations and initial saved state
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      RecommendationService.getRecommendations({
        currentListingId,
        module,
        categoryId,
        limit: 5
      }),
      SavedListingService.getSavedListingIds()
    ])
      .then(([recs, saved]) => {
        if (!isMounted) return;
        setRecommendations(recs);
        setSavedIds(saved);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn('Error loading recommendations:', err);
        setRecommendations([]);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentListingId, module, categoryId]);

  // Handle heart toggle save
  const handleToggleSave = async (e: React.MouseEvent, listingId: string) => {
    e.stopPropagation();
    
    // Optimistic state update
    const isCurrentlySaved = savedIds.includes(listingId);
    if (isCurrentlySaved) {
      setSavedIds(prev => prev.filter(id => id !== listingId));
    } else {
      setSavedIds(prev => [...prev, listingId]);
    }

    try {
      const res = await SavedListingService.toggleSaveListing(listingId);
      if (res.requiresLogin) {
        // Revert optimistic update and navigate to login
        setSavedIds(prev => isCurrentlySaved ? [...prev, listingId] : prev.filter(id => id !== listingId));
        onNavigate('/login');
      } else if (res.error) {
        // Revert on database error
        setSavedIds(prev => isCurrentlySaved ? [...prev, listingId] : prev.filter(id => id !== listingId));
      }
    } catch (err) {
      console.warn('Failed to toggle saved status:', err);
      setSavedIds(prev => isCurrentlySaved ? [...prev, listingId] : prev.filter(id => id !== listingId));
    }
  };

  // Card click navigation
  const handleCardClick = (item: RecommendedListingCardItem) => {
    const targetRoute = `/${item.routeModule}/${item.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate(targetRoute);
  };

  // View All button target
  const normalizedModule = (module || '').toLowerCase().startsWith('job')
    ? 'jobs'
    : (module || '').toLowerCase().startsWith('service')
    ? 'services'
    : 'rentals';

  // Section title: "More Related Listings"
  const sectionTitle = 'More Related Listings';

  // If loading or zero recommendations exist, fail gracefully without breaking the page layout
  if (loading) {
    return (
      <section className="mt-10 mb-8 max-w-2xl lg:max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-44 bg-slate-200/80 rounded-lg animate-pulse" />
          <div className="h-4 w-16 bg-slate-200/80 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-56 bg-slate-200/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  // Pure data-driven: Hide section if zero recommendations exist in Supabase
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <section className="mt-10 mb-12 max-w-2xl lg:max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200/80">
        <div>
          <h2 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 font-heading tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
            <span>{sectionTitle}</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
            Recommended related listings in Sri Lanka
          </p>
        </div>

        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            onNavigate(`/${normalizedModule}`);
          }}
          className="text-xs font-bold flex items-center gap-0.5 hover:underline transition-all shrink-0 tap-bounce"
          style={{ color: themeColor }}
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Cards Grid / Scrollable Container */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
        {recommendations.map((item) => {
          const isSaved = savedIds.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => handleCardClick(item)}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col group cursor-pointer tap-bounce"
            >
              {/* Image Container with Watermark Overlay */}
              <div className="relative h-[120px] sm:h-[135px] w-full overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  width={240}
                  height={135}
                  style={{ aspectRatio: '16/9' }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" fill="%23F1F5F9"><rect width="600" height="400"/><g fill="%2394A3B8" transform="translate(260,160)"><path d="M40 0C17.9 0 0 17.9 0 40s17.9 40 40 40 40-17.9 40-40S62.1 0 40 0zm0 15c13.8 0 25 11.2 25 25S53.8 65 40 65 15 53.8 15 40s11.2-25 25-25z"/></g></svg>';
                  }}
                />

                {/* Central Brand Watermark Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                  <span className="text-[10px] sm:text-[11px] font-black text-white uppercase tracking-widest drop-shadow-md">
                    RENTOURA.LK
                  </span>
                </div>

                {/* Module Badge */}
                <div className="absolute top-2 left-2 z-10">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black tracking-wider uppercase shadow-2xs ${item.badgeStyle}`}
                  >
                    {item.badgeLabel}
                  </span>
                </div>

                {/* Heart Save Button */}
                <button
                  type="button"
                  onClick={(e) => handleToggleSave(e, item.id)}
                  className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 active:scale-90 transition-all"
                  aria-label="Save listing"
                >
                  <Heart
                    className={`w-3.5 h-3.5 stroke-[2.2] ${
                      isSaved ? 'fill-[#EA384D] text-[#EA384D]' : 'text-white'
                    }`}
                  />
                </button>
              </div>

              {/* Card Details */}
              <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 truncate">
                    {item.categoryName}
                  </div>
                  <h3 className="text-slate-900 font-bold text-xs sm:text-sm line-clamp-2 group-hover:text-[#1464F4] transition-colors leading-snug">
                    {item.title}
                  </h3>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1">
                  {/* Price / Salary */}
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="text-xs sm:text-sm font-black text-slate-900 truncate">
                      {item.priceOrSalary}
                    </span>
                    {item.periodOrType && (
                      <span className="text-[9px] sm:text-[10px] font-medium text-slate-500 truncate shrink-0">
                        {item.periodOrType}
                      </span>
                    )}
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{item.locationName}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
