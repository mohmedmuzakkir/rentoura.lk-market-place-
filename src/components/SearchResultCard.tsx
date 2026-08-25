import React from 'react';
import { Heart, MapPin, Building2, Wrench, Home, Briefcase, ChevronRight } from 'lucide-react';
import { SearchResultItemRaw } from '../services/searchService';

interface SearchResultCardProps {
  item: SearchResultItemRaw;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onOpenDetail: (id: string, module: 'rental' | 'job' | 'service') => void;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({
  item,
  isSaved,
  onToggleSave,
  onOpenDetail,
}) => {
  const isRental = item.module === 'rental';
  const isJob = item.module === 'job';
  const isService = item.module === 'service';

  // Module configuration
  let accentColor = '#1464F4'; // Blue
  let badgeLabel = 'RENTAL';
  let badgeBg = 'bg-blue-50 text-[#1464F4] border-blue-200';
  let ModuleIcon = Home;

  if (isJob) {
    accentColor = '#08A34F'; // Green
    badgeLabel = 'JOB';
    badgeBg = 'bg-emerald-50 text-[#08A34F] border-emerald-200';
    ModuleIcon = Briefcase;
  } else if (isService) {
    accentColor = '#FF650A'; // Orange
    badgeLabel = 'SERVICE';
    badgeBg = 'bg-orange-50 text-[#FF650A] border-orange-200';
    ModuleIcon = Wrench;
  }

  // Price formatting
  const formatPrice = () => {
    if (isJob) {
      if (item.price) {
        return `Rs. ${item.price.toLocaleString()} / mo`;
      }
      if (item.minimum_price || item.maximum_price) {
        const minP = item.minimum_price ? `Rs. ${item.minimum_price.toLocaleString()}` : '';
        const maxP = item.maximum_price ? `Rs. ${item.maximum_price.toLocaleString()}` : '';
        return minP && maxP ? `${minP} - ${maxP}` : minP || maxP || 'Negotiable';
      }
      return 'Salary Negotiable';
    }

    if (isService) {
      if (item.price || item.minimum_price) {
        const pVal = item.price || item.minimum_price;
        const unit = item.price_period ? ` / ${item.price_period}` : '';
        return `From Rs. ${pVal?.toLocaleString()}${unit}`;
      }
      return 'Price on Inquiry';
    }

    // Rental
    if (item.price) {
      const unit = item.price_period ? ` ${item.price_period}` : ' / month';
      return `Rs. ${item.price.toLocaleString()}${unit}`;
    }
    return 'Price on Inquiry';
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSave(item.id);
  };

  const fallbackImage = isRental
    ? 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80'
    : isJob
    ? 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'
    : 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80';

  const imageUrl = item.cover_url || fallbackImage;

  return (
    <div
      onClick={() => onOpenDetail(item.id, item.module)}
      className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col sm:flex-row group cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative w-full sm:w-48 lg:w-56 h-48 sm:h-auto shrink-0 bg-slate-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />

        {/* Module Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border backdrop-blur-xs shadow-xs ${badgeBg}`}
          >
            <ModuleIcon className="w-3 h-3" />
            <span>{badgeLabel}</span>
          </span>
        </div>

        {/* Save Heart Button */}
        <button
          type="button"
          onClick={handleHeartClick}
          aria-label={isSaved ? 'Unsave listing' : 'Save listing'}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isSaved
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-black/30 hover:bg-black/50 text-white backdrop-blur-xs'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Company / Business / Category row */}
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1 font-medium">
            <span className="truncate max-w-[200px]">
              {isJob
                ? item.company_name || item.category_name || 'Employment Opportunity'
                : isService
                ? item.business_name || item.category_name || 'Professional Service'
                : item.category_name || 'Rental Listing'}
            </span>
            {item.category_name && (
              <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 truncate max-w-[120px]">
                {item.category_name}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#1464F4] transition-colors line-clamp-2 leading-snug font-heading">
            {item.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{item.location_name || 'Sri Lanka'}</span>
          </div>

          {/* Additional Module Specific Badges */}
          {(isJob && (item.job_type || item.work_mode)) && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {item.job_type && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[#08A34F] text-[10.5px] font-bold border border-emerald-100">
                  {item.job_type}
                </span>
              )}
              {item.work_mode && (
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10.5px] font-semibold">
                  {item.work_mode}
                </span>
              )}
            </div>
          )}

          {(isService && (item.service_type || item.pricing_type)) && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {item.service_type && (
                <span className="px-2 py-0.5 rounded-md bg-orange-50 text-[#FF650A] text-[10.5px] font-bold border border-orange-100">
                  {item.service_type}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer Row: Price & View Details */}
        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="font-extrabold text-slate-900 text-sm sm:text-base" style={{ color: accentColor }}>
            {formatPrice()}
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-slate-700 group-hover:text-[#1464F4] transition-colors">
            <span>View Details</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
