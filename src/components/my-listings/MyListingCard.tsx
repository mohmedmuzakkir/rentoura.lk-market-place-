import React, { useState } from 'react';
import { 
  MapPin, 
  Building2, 
  Wrench, 
  Eye, 
  MessageSquare, 
  Heart, 
  Camera, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  PauseCircle, 
  PlayCircle, 
  ExternalLink, 
  AlertCircle, 
  Clock, 
  XCircle, 
  Rocket, 
  Info,
  Briefcase
} from 'lucide-react';
import { UserListingItem, UserListingStatus } from '../../types/profileTypes';
import { SearchService } from '../../services/searchService';

interface MyListingCardProps {
  listing: UserListingItem;
  onView: (id: string, module: 'rentals' | 'jobs' | 'services') => void;
  onEdit: (listing: UserListingItem) => void;
  onDelete: (listingId: string, listingTitle: string) => void;
  onViewStatusModal: (listing: UserListingItem) => void;
  onTogglePause?: (listingId: string, currentStatus: UserListingStatus) => void;
  onBoost?: (listing: UserListingItem) => void;
}

export const MyListingCard: React.FC<MyListingCardProps> = ({
  listing,
  onView,
  onEdit,
  onDelete,
  onViewStatusModal,
  onTogglePause,
  onBoost
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Status Badge Helper
  const renderStatusBadge = () => {
    switch (listing.status) {
      case 'active':
        return (
          <span className="px-2 py-0.5 rounded-md bg-[#08A34F] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
            ACTIVE
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-0.5 rounded-md bg-[#F59E0B] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
            PENDING
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 py-0.5 rounded-md bg-[#EF4444] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
            REJECTED
          </span>
        );
      case 'changes_requested':
        return (
          <span className="px-2 py-0.5 rounded-md bg-[#EA580C] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
            CHANGES REQ
          </span>
        );
      case 'paused':
        return (
          <span className="px-2 py-0.5 rounded-md bg-slate-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
            PAUSED
          </span>
        );
      case 'expired':
        return (
          <span className="px-2 py-0.5 rounded-md bg-slate-400 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
            EXPIRED
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="px-2 py-0.5 rounded-md bg-slate-500 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
            DRAFT
          </span>
        );
    }
  };

  // Module Badge Helper
  const renderModuleBadge = () => {
    switch (listing.module) {
      case 'rentals':
        return (
          <span className="px-2 py-0.5 rounded-md bg-[#1464F4] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
            RENTAL
          </span>
        );
      case 'jobs':
        return (
          <span className="px-2 py-0.5 rounded-md bg-[#08A34F] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
            JOB
          </span>
        );
      case 'services':
        return (
          <span className="px-2 py-0.5 rounded-md bg-[#FF650A] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
            SERVICE
          </span>
        );
    }
  };

  // Format numbers (e.g., 1200 -> 1.2K)
  const formatCount = (num?: number) => {
    if (num === undefined || num === null) return '0';
    if (num >= 1000) return `${(num / 1000).toFixed(1).replace('.0', '')}K`;
    return num.toString();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 p-3 sm:p-4 relative">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* Left Thumbnail Section */}
        <div className="relative w-full sm:w-36 h-40 sm:h-36 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 group">
          {listing.module === 'jobs' && !listing.imageUrl.includes('photo') ? (
            <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center p-3 text-center">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-2">
                <Building2 className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs font-bold text-white line-clamp-1">
                {listing.companyName || 'Company'}
              </span>
            </div>
          ) : (
            <img
              src={listing.imageUrl || SearchService.NEUTRAL_PLACEHOLDER}
              alt={listing.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}

          {/* Module & Status Badges Overlay (Top-Left) */}
          <div className="absolute top-2 left-2 flex flex-wrap items-center gap-1 z-10">
            {renderModuleBadge()}
            {renderStatusBadge()}
          </div>

          {/* Image Count Badge (Bottom-Right) */}
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/65 backdrop-blur-xs text-white text-[10px] font-semibold flex items-center gap-1">
            <Camera className="w-3 h-3" />
            <span>{listing.imagesCount || 1}</span>
          </div>
        </div>

        {/* Right Details Section */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          {/* Header Row: Title + 3-Dots Menu */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 
                onClick={() => onView(listing.id, listing.module)}
                className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug line-clamp-1 cursor-pointer hover:text-[#1464F4] transition-colors"
              >
                {listing.title}
              </h3>

              {/* 3-Dots Overflow Context Menu */}
              <div className="relative shrink-0">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Listing options"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {isMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-30" 
                      onClick={() => setIsMenuOpen(false)} 
                    />
                    <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-40 animate-in fade-in-50 zoom-in-95">
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          onView(listing.id, listing.module);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                        <span>View Listing</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          onEdit(listing);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>Edit Listing</span>
                      </button>

                      {(listing.status === 'active' || listing.status === 'paused') && onTogglePause && (
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            onTogglePause(listing.id, listing.status);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          {listing.status === 'active' ? (
                            <>
                              <PauseCircle className="w-3.5 h-3.5 text-slate-500" />
                              <span>Pause Listing</span>
                            </>
                          ) : (
                            <>
                              <PlayCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Resume Listing</span>
                            </>
                          )}
                        </button>
                      )}

                      <div className="my-1 border-t border-slate-100" />

                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          onDelete(listing.id, listing.title);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>Delete Listing</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Location / Company context line */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
              {listing.module === 'jobs' ? (
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              ) : listing.module === 'services' ? (
                <Wrench className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              ) : (
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
              <span className="truncate">
                {listing.companyName || listing.providerName || listing.location}
              </span>
            </div>

            {/* Price / Salary Line */}
            <div className="mt-1">
              <span className="text-sm sm:text-base font-black text-[#1464F4]">
                {listing.price}
              </span>
              {listing.pricePeriod && (
                <span className="text-xs font-semibold text-slate-500 ml-1">
                  {listing.pricePeriod}
                </span>
              )}
            </div>

            {/* Status Warning / Info notice if rejected or changes requested */}
            {listing.status === 'rejected' && (
              <div className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md w-fit">
                <XCircle className="w-3 h-3 text-rose-600 shrink-0" />
                <span>Not approved by our team</span>
              </div>
            )}
            {listing.status === 'changes_requested' && (
              <div className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md w-fit">
                <AlertCircle className="w-3 h-3 text-orange-600 shrink-0" />
                <span>Changes requested by moderators</span>
              </div>
            )}
            {listing.status === 'pending' && (
              <div className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md w-fit">
                <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                <span>Under moderation review</span>
              </div>
            )}
          </div>

          {/* Bottom Section: Metrics + Tags + Action Buttons */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              {/* Engagement Stats (Views, Inquiries, Saves) */}
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-1 font-medium" title="Total Views">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatCount(listing.viewsCount)}</span>
                </div>
                <div className="flex items-center gap-1 font-medium" title="Messages & Inquiries">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatCount(listing.inquiriesCount)}</span>
                </div>
                <div className="flex items-center gap-1 font-medium" title="Saves">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>{formatCount(listing.savesCount)}</span>
                </div>
              </div>

              {/* Posted Date */}
              <span className="text-[11px] font-medium text-slate-400">
                Posted on {listing.postedDate}
              </span>
            </div>

            {/* Tags Row + Status-Dependent Action Buttons */}
            <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
              {/* Feature/Category Tags */}
              <div className="flex items-center gap-1.5 overflow-hidden flex-wrap max-w-full sm:max-w-[55%]">
                {listing.tags && listing.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold truncate"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Status-specific Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                {/* ACTIVE LISTINGS */}
                {listing.status === 'active' && (
                  <>
                    <button
                      onClick={() => onView(listing.id, listing.module)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#1464F4] bg-blue-50/80 hover:bg-blue-100 border border-blue-200/60 transition-all flex items-center gap-1 active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => onBoost?.(listing)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1 active:scale-95 shadow-xs ${
                        listing.module === 'services'
                          ? 'bg-[#FF650A] hover:bg-[#e05605]'
                          : 'bg-[#1464F4] hover:bg-[#0f4ec4]'
                      }`}
                    >
                      <Rocket className="w-3.5 h-3.5" />
                      <span>Boost</span>
                    </button>
                  </>
                )}

                {/* PENDING LISTINGS */}
                {listing.status === 'pending' && (
                  <>
                    <button
                      onClick={() => onEdit(listing)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 transition-all flex items-center gap-1 active:scale-95"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onViewStatusModal(listing)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all flex items-center gap-1 active:scale-95"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>View Status</span>
                    </button>
                  </>
                )}

                {/* REJECTED LISTINGS */}
                {listing.status === 'rejected' && (
                  <button
                    onClick={() => onViewStatusModal(listing)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all flex items-center gap-1 active:scale-95"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>View Reason</span>
                  </button>
                )}

                {/* CHANGES REQUESTED */}
                {listing.status === 'changes_requested' && (
                  <button
                    onClick={() => onViewStatusModal(listing)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-all flex items-center gap-1 active:scale-95"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>View Changes</span>
                  </button>
                )}

                {/* DRAFT */}
                {listing.status === 'draft' && (
                  <button
                    onClick={() => onEdit(listing)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#1464F4] bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all flex items-center gap-1 active:scale-95"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Continue Editing</span>
                  </button>
                )}

                {/* EXPIRED */}
                {listing.status === 'expired' && (
                  <button
                    onClick={() => onEdit(listing)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex items-center gap-1 active:scale-95"
                  >
                    <span>Renew / Repost</span>
                  </button>
                )}

                {/* PAUSED */}
                {listing.status === 'paused' && (
                  <button
                    onClick={() => onTogglePause?.(listing.id, listing.status)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all flex items-center gap-1 active:scale-95"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>Resume</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
