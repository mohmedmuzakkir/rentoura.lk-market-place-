import React from 'react';
import { 
  Layers, 
  CheckCircle2, 
  Clock, 
  Heart, 
  MessageSquare, 
  Star 
} from 'lucide-react';
import { AppRoute } from '../../types';

interface ProfileMetricsBarProps {
  totalListings: number;
  activeListings: number;
  pendingListings: number;
  savedCount: number;
  messagesCount: number;
  reviewsCount: number;
  onNavigate: (route: AppRoute) => void;
  onSelectListingFilter?: (filter: 'all' | 'active' | 'pending') => void;
  onOpenReviewsModal?: () => void;
}

export const ProfileMetricsBar: React.FC<ProfileMetricsBarProps> = ({
  totalListings,
  activeListings,
  pendingListings,
  savedCount,
  messagesCount,
  reviewsCount,
  onNavigate,
  onSelectListingFilter,
  onOpenReviewsModal
}) => {
  const metrics = [
    {
      id: 'total',
      label: 'Total Listings',
      value: totalListings,
      subtext: 'All Time',
      icon: Layers,
      iconColor: 'text-[#1464F4]',
      bgColor: 'bg-blue-50/80 hover:bg-blue-100/80',
      onClick: () => onSelectListingFilter?.('all')
    },
    {
      id: 'active',
      label: 'Active',
      value: activeListings,
      subtext: 'Published',
      icon: CheckCircle2,
      iconColor: 'text-[#08A34F]',
      bgColor: 'bg-emerald-50/80 hover:bg-emerald-100/80',
      onClick: () => onSelectListingFilter?.('active')
    },
    {
      id: 'pending',
      label: 'Pending',
      value: pendingListings,
      subtext: 'Under Review',
      icon: Clock,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50/80 hover:bg-amber-100/80',
      onClick: () => onSelectListingFilter?.('pending')
    },
    {
      id: 'saved',
      label: 'Saved',
      value: savedCount,
      subtext: 'Favorites',
      icon: Heart,
      iconColor: 'text-rose-500',
      bgColor: 'bg-rose-50/80 hover:bg-rose-100/80',
      onClick: () => onNavigate('/saved')
    },
    {
      id: 'messages',
      label: 'Messages',
      value: messagesCount,
      subtext: 'Conversations',
      icon: MessageSquare,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50/80 hover:bg-purple-100/80',
      onClick: () => onNavigate('/messages')
    },
    {
      id: 'reviews',
      label: 'Reviews',
      value: reviewsCount,
      subtext: 'Received',
      icon: Star,
      iconColor: 'text-amber-500 fill-amber-400',
      bgColor: 'bg-amber-50/80 hover:bg-amber-100/80',
      onClick: () => onOpenReviewsModal?.()
    }
  ];

  return (
    <div className="max-w-xl mx-auto px-4 -mt-3 relative z-20">
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/80 shadow-md">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
          {metrics.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`p-2.5 rounded-xl flex flex-col items-center justify-center text-center transition-all tap-bounce ${item.bgColor}`}
              >
                <div className="flex items-center gap-1 mb-1">
                  <Icon className={`w-4 h-4 ${item.iconColor}`} />
                </div>
                <span className="text-base sm:text-lg font-black text-slate-900 font-heading leading-none">
                  {item.value}
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 mt-1 truncate max-w-full leading-tight">
                  {item.label}
                </span>
                <span className="text-[9px] text-slate-400 font-medium truncate max-w-full mt-0.5">
                  {item.subtext}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
