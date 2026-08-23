import React from 'react';
import { 
  CheckCircle2, 
  MessageSquare, 
  Clock, 
  Star, 
  Megaphone, 
  Crown, 
  Flag, 
  ShieldCheck, 
  ChevronRight,
  Sparkles,
  AlertTriangle,
  Lock,
  Trash2,
  Check
} from 'lucide-react';
import { AppNotification } from '../../types/notificationTypes';

interface NotificationCardProps {
  notification: AppNotification;
  onClick: (notification: AppNotification) => void;
  onDelete?: (id: string) => void;
  onToggleRead?: (id: string) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onClick,
  onDelete,
  onToggleRead
}) => {
  const getIconConfig = () => {
    switch (notification.type) {
      case 'LISTING_APPROVED':
        return {
          icon: CheckCircle2,
          bgColor: 'bg-emerald-100',
          iconColor: 'text-emerald-600',
          dotColor: 'bg-emerald-500'
        };
      case 'MESSAGE_RECEIVED':
        return {
          icon: MessageSquare,
          bgColor: 'bg-blue-100',
          iconColor: 'text-[#1464F4]',
          dotColor: 'bg-[#1464F4]'
        };
      case 'LISTING_PENDING':
        return {
          icon: Clock,
          bgColor: 'bg-amber-100',
          iconColor: 'text-amber-600',
          dotColor: 'bg-amber-500'
        };
      case 'REVIEW_RECEIVED':
        return {
          icon: Star,
          bgColor: 'bg-purple-100',
          iconColor: 'text-purple-600',
          dotColor: 'bg-purple-500'
        };
      case 'JOB_MATCH':
      case 'JOB_APPLICATION_UPDATE':
        return {
          icon: Megaphone,
          bgColor: 'bg-emerald-100',
          iconColor: 'text-[#08A34F]',
          dotColor: 'bg-[#08A34F]'
        };
      case 'FEATURED_PROMOTION':
        return {
          icon: Crown,
          bgColor: 'bg-amber-100',
          iconColor: 'text-amber-600',
          dotColor: 'bg-amber-500'
        };
      case 'REPORT_UPDATE':
        return {
          icon: Flag,
          bgColor: 'bg-rose-100',
          iconColor: 'text-rose-600',
          dotColor: 'bg-rose-500'
        };
      case 'SYSTEM_UPDATE':
        return {
          icon: ShieldCheck,
          bgColor: 'bg-blue-100',
          iconColor: 'text-[#1464F4]',
          dotColor: 'bg-[#1464F4]'
        };
      case 'ACCOUNT_SECURITY':
        return {
          icon: Lock,
          bgColor: 'bg-slate-100',
          iconColor: 'text-slate-700',
          dotColor: 'bg-slate-900'
        };
      default:
        return {
          icon: Sparkles,
          bgColor: 'bg-blue-100',
          iconColor: 'text-[#1464F4]',
          dotColor: 'bg-[#1464F4]'
        };
    }
  };

  const { icon: Icon, bgColor, iconColor, dotColor } = getIconConfig();

  return (
    <div
      onClick={() => onClick(notification)}
      className={`group relative w-full rounded-2xl p-3.5 sm:p-4 border transition-all cursor-pointer tap-bounce ${
        !notification.read
          ? 'bg-white hover:bg-slate-50/80 border-slate-200/90 shadow-xs ring-1 ring-black/3'
          : 'bg-slate-50/70 hover:bg-white border-slate-200/60 opacity-90'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Left: Rounded Icon Circle with Unread Dot */}
        <div className="relative shrink-0 mt-0.5">
          <div className={`w-11 h-11 rounded-2xl ${bgColor} flex items-center justify-center transition-transform group-hover:scale-105 shadow-2xs`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>

          {/* Unread Status Dot Indicator */}
          {!notification.read && (
            <span
              className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full ${dotColor} ring-2 ring-white shadow-xs`}
            />
          )}
        </div>

        {/* Center: Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-[13.5px] font-bold text-slate-900 leading-snug truncate group-hover:text-[#1464F4] transition-colors">
              {notification.title}
            </h2>
            <span className="text-[10.5px] text-slate-400 font-medium shrink-0">
              {notification.createdAt}
            </span>
          </div>

          <p className="text-[12px] text-slate-600 font-normal leading-relaxed mt-0.5 line-clamp-2">
            {notification.body}
          </p>

          {/* Optional Action / Status Details row */}
          {notification.actionText === 'View Offer' && (
            <div className="mt-2.5 flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold">
                View Offer
              </span>
            </div>
          )}
        </div>

        {/* Right: Media Thumbnail OR Action Badge + Chevron */}
        <div className="flex items-center gap-2 shrink-0 self-center">
          {notification.thumbnailUrl && (
            <div className="w-12 h-9 sm:w-14 sm:h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0 shadow-2xs">
              <img
                src={notification.thumbnailUrl}
                alt="Listing preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {notification.actionText === 'Unread' && (
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#1464F4] text-[10.5px] font-bold border border-blue-100">
              Unread
            </span>
          )}

          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#1464F4] group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </div>
  );
};
