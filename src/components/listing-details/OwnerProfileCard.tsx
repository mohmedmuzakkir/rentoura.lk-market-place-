import React from 'react';
import { CheckCircle2, Star, Zap, Car, ChevronRight, User } from 'lucide-react';

interface OwnerProfileCardProps {
  owner: {
    id: string;
    name: string;
    photoUrl?: string;
    isVerified?: boolean;
    memberSince?: string;
    rating?: number;
    reviewsCount?: number;
    activeListingsCount?: number;
    responseRate?: string;
    responseSpeed?: string;
    totalRentalsCompleted?: number;
  };
  onClick?: () => void;
  onOpenReviews?: () => void;
}

export const OwnerProfileCard: React.FC<OwnerProfileCardProps> = ({ owner, onClick, onOpenReviews }) => {
  if (!owner || !owner.name) return null;

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-100 p-4 shadow-xs transition-all ${
        onClick ? 'hover:border-blue-200 cursor-pointer group' : ''
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: User Identity */}
        <div className="flex items-center gap-3">
          <div className="relative">
            {owner.photoUrl ? (
              <img
                src={owner.photoUrl}
                alt={owner.name}
                className="w-13 h-13 rounded-full object-cover ring-2 ring-blue-100"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-13 h-13 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <User className="w-6 h-6" />
              </div>
            )}
            {owner.isVerified && (
              <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-[#1464F4] fill-white" />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h4 className={`font-bold text-sm text-slate-900 ${onClick ? 'group-hover:text-[#1464F4]' : ''} transition-colors`}>
                {owner.name}
              </h4>
              {owner.isVerified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1464F4]" />
              )}
            </div>

            {owner.memberSince && (
              <div className="text-[11px] text-slate-400">
                Member since {owner.memberSince}
              </div>
            )}

            <div className="flex items-center gap-2 mt-1 text-xs">
              {owner.rating !== undefined && owner.reviewsCount !== undefined && owner.reviewsCount > 0 && (
                <button 
                  type="button"
                  onClick={(e) => {
                    if (onOpenReviews) {
                      e.stopPropagation();
                      onOpenReviews();
                    }
                  }}
                  className="flex items-center gap-1 font-bold text-slate-800 hover:text-[#1464F4] transition-colors"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{owner.rating}</span>
                  <span className="text-slate-400 font-normal underline decoration-slate-300">
                    ({owner.reviewsCount} Reviews)
                  </span>
                </button>
              )}
              {owner.activeListingsCount !== undefined && (
                <div className="text-slate-500 text-[11px]">
                  <span className="font-bold text-slate-800">{owner.activeListingsCount}</span> Active Listings
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions or Chevron if clickable */}
        {onClick && (
          <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-700 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};
