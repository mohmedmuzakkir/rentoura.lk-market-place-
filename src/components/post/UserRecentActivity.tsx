import React from 'react';
import { ChevronRight, Eye, MessageSquare, PlusCircle, Clock, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';
import { UserListingItem } from '../../types/profileTypes';
import { AppRoute } from '../../types';
import { SearchService } from '../../services/searchService';

interface UserRecentActivityProps {
  listings: UserListingItem[];
  onNavigate: (route: AppRoute) => void;
  onOpenListingDetail?: (id: string, module?: 'rentals' | 'jobs' | 'services') => void;
}

export const UserRecentActivity: React.FC<UserRecentActivityProps> = ({
  listings,
  onNavigate,
  onOpenListingDetail
}) => {
  // Sort listings by newest
  const recentListings = [...listings].slice(0, 4);

  if (recentListings.length === 0) {
    return (
      <section className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm text-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1464F4] flex items-center justify-center mx-auto mb-3">
          <PlusCircle className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-800">No listings posted yet</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Start by choosing one of the categories above to publish your first rental, job vacancy, or service offering.
        </p>
      </section>
    );
  }

  const getStatusBadge = (status: UserListingItem['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-[#08A34F] uppercase tracking-wide">
            <CheckCircle2 className="w-2.5 h-2.5 stroke-[3]" /> Active
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-700 uppercase tracking-wide">
            <Clock className="w-2.5 h-2.5 stroke-[3]" /> Pending Review
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700 uppercase tracking-wide">
            <AlertCircle className="w-2.5 h-2.5 stroke-[3]" /> Action Required
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-600 uppercase tracking-wide">
            {status}
          </span>
        );
    }
  };

  return (
    <section className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 font-heading">
          Your recent activity
        </h3>
        <button
          onClick={() => onNavigate('/my-listings')}
          className="text-xs font-bold text-[#1464F4] hover:text-blue-700 flex items-center gap-0.5 tap-bounce"
        >
          View all <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {recentListings.map((item) => (
          <div
            key={item.id}
            onClick={() => onNavigate('/my-listings')}
            className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all flex items-center gap-3 cursor-pointer group text-left"
          >
            {/* Image Thumbnail */}
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative">
              <img
                src={item.imageUrl || SearchService.NEUTRAL_PLACEHOLDER}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="mb-1">
                {getStatusBadge(item.status)}
              </div>
              <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-[#1464F4] transition-colors">
                {item.title}
              </h4>
              <p className="text-[11px] font-semibold text-slate-600 mt-0.5">
                {item.price} <span className="text-[9px] font-normal text-slate-400">{item.pricePeriod}</span>
              </p>

              {/* Views / Inquiries stats */}
              <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {item.viewsCount.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> {item.inquiriesCount}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
