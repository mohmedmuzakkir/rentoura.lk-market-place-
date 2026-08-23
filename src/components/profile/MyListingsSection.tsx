import React, { useState } from 'react';
import { 
  ChevronRight, 
  Eye, 
  MessageSquare, 
  MoreVertical, 
  PlusCircle, 
  ExternalLink,
  Edit2,
  Trash2
} from 'lucide-react';
import { UserListingItem, UserListingStatus } from '../../types/profileTypes';
import { AppRoute } from '../../types';

interface MyListingsSectionProps {
  listings: UserListingItem[];
  onNavigate: (route: AppRoute) => void;
  onOpenListingDetail?: (listingId: string, module: 'rentals' | 'jobs' | 'services') => void;
  onDeleteListing?: (listingId: string) => void;
}

export const MyListingsSection: React.FC<MyListingsSectionProps> = ({
  listings,
  onNavigate,
  onOpenListingDetail,
  onDeleteListing
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'rentals' | 'jobs' | 'services'>('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const rentalsCount = listings.filter(l => l.module === 'rentals').length;
  const jobsCount = listings.filter(l => l.module === 'jobs').length;
  const servicesCount = listings.filter(l => l.module === 'services').length;
  const allCount = listings.length;

  const filteredListings = listings.filter(item => {
    if (activeTab === 'all') return true;
    return item.module === activeTab;
  });

  const getStatusBadge = (status: UserListingStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2 py-0.5 rounded-md bg-[#08A34F] text-white text-[10px] font-extrabold uppercase tracking-wider">
            ACTIVE
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-extrabold uppercase tracking-wider">
            PENDING
          </span>
        );
      case 'changes_requested':
        return (
          <span className="px-2 py-0.5 rounded-md bg-orange-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
            ACTION REQ
          </span>
        );
      case 'draft':
        return (
          <span className="px-2 py-0.5 rounded-md bg-slate-500 text-white text-[10px] font-extrabold uppercase tracking-wider">
            DRAFT
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
            REJECTED
          </span>
        );
      case 'paused':
        return (
          <span className="px-2 py-0.5 rounded-md bg-slate-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
            PAUSED
          </span>
        );
      case 'expired':
      default:
        return (
          <span className="px-2 py-0.5 rounded-md bg-slate-400 text-white text-[10px] font-extrabold uppercase tracking-wider">
            EXPIRED
          </span>
        );
    }
  };

  const getModuleBadge = (module: 'rentals' | 'jobs' | 'services') => {
    switch (module) {
      case 'rentals':
        return (
          <span className="px-2 py-0.5 rounded-md bg-[#1464F4] text-white text-[10px] font-extrabold uppercase tracking-wider">
            RENTAL
          </span>
        );
      case 'jobs':
        return (
          <span className="px-2 py-0.5 rounded-md bg-[#08A34F] text-white text-[10px] font-extrabold uppercase tracking-wider">
            JOB
          </span>
        );
      case 'services':
        return (
          <span className="px-2 py-0.5 rounded-md bg-[#FF650A] text-white text-[10px] font-extrabold uppercase tracking-wider">
            SERVICE
          </span>
        );
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 mt-6">
      {/* Header with View All */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-extrabold text-slate-900 font-heading">
          My Listings
        </h3>
        <button
          onClick={() => onNavigate('/my-listings')}
          className="text-xs font-bold text-[#1464F4] hover:text-blue-700 flex items-center gap-1 tap-bounce"
        >
          View All Listings
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter Tabs matching Image 1 */}
      <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-200/70 rounded-xl mb-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('all')}
          className={`py-2 rounded-lg text-center transition-all ${
            activeTab === 'all'
              ? 'bg-[#1464F4] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All ({allCount})
        </button>
        <button
          onClick={() => setActiveTab('rentals')}
          className={`py-2 rounded-lg text-center transition-all ${
            activeTab === 'rentals'
              ? 'bg-[#1464F4] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Rentals ({rentalsCount})
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`py-2 rounded-lg text-center transition-all ${
            activeTab === 'jobs'
              ? 'bg-[#1464F4] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Jobs ({jobsCount})
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`py-2 rounded-lg text-center transition-all ${
            activeTab === 'services'
              ? 'bg-[#1464F4] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Services ({servicesCount})
        </button>
      </div>

      {/* Listings List / Horizontal Carousel on mobile or stack */}
      {filteredListings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1464F4] flex items-center justify-center mx-auto mb-3">
            <PlusCircle className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 font-heading">
            No listings yet in this category
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Create your first listing to start receiving inquiries and bookings across Sri Lanka.
          </p>
          <button
            onClick={() => onNavigate('/post')}
            className="mt-4 px-4 py-2 rounded-xl bg-[#1464F4] text-white text-xs font-bold shadow-sm hover:bg-blue-600 tap-bounce inline-flex items-center gap-1.5"
          >
            Post Your First Listing
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredListings.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-sm hover:shadow-md transition-shadow relative"
            >
              <div className="flex items-start gap-3.5">
                {/* Image Container with Badges */}
                <div 
                  onClick={() => onOpenListingDetail?.(item.id, item.module)}
                  className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0 cursor-pointer group"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
                    {getModuleBadge(item.module)}
                  </div>
                </div>

                {/* Listing Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {getStatusBadge(item.status)}
                      </div>

                      {/* 3-dots Context Menu */}
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                          className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                          aria-label="Listing options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openMenuId === item.id && (
                          <div className="absolute right-0 top-6 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95">
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                onOpenListingDetail?.(item.id, item.module);
                              }}
                              className="w-full px-3 py-1.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-[#1464F4]" />
                              View Detail
                            </button>
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                onNavigate('/post');
                              }}
                              className="w-full px-3 py-1.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-emerald-600" />
                              Edit Listing
                            </button>
                            {onDeleteListing && (
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  onDeleteListing(item.id);
                                }}
                                className="w-full px-3 py-1.5 text-left text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                Delete
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <h4 
                      onClick={() => onOpenListingDetail?.(item.id, item.module)}
                      className="font-bold text-slate-900 text-sm font-heading line-clamp-1 hover:text-[#1464F4] cursor-pointer mt-1"
                    >
                      {item.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {item.location}
                    </p>

                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-xs font-extrabold text-[#1464F4] font-heading">
                        {item.price}
                      </span>
                      {item.pricePeriod && (
                        <span className="text-[10px] text-slate-500 font-medium">
                          {item.pricePeriod}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Views and Inquiries Stats Row */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-4 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.viewsCount ?? 0} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.inquiriesCount ?? 0} inquiries</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
