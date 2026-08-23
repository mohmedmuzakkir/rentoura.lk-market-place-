import React from 'react';
import { Bell, Mail, Megaphone } from 'lucide-react';

interface NotificationHeroProps {
  totalUnreadCount: number;
  unreadMessagesCount: number;
  unreadAnnouncementsCount: number;
  onFilterMessages?: () => void;
  onFilterAnnouncements?: () => void;
}

export const NotificationHero: React.FC<NotificationHeroProps> = ({
  totalUnreadCount = 0,
  unreadMessagesCount = 0,
  unreadAnnouncementsCount = 0,
  onFilterMessages,
  onFilterAnnouncements
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B48C3] via-[#1464F4] to-[#2B77FF] p-4 sm:p-5 text-white shadow-lg shadow-blue-600/15">
      {/* Subtle Background Glow Circles */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-400/20 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between gap-3">
        {/* Left Side: 3D Bell Graphic & Title */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Bell Icon with 3D styling and Unread Badge */}
          <div className="relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
            <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 p-2.5 shadow-md shadow-amber-500/30 flex items-center justify-center transform -rotate-3 transition-transform hover:rotate-0">
              <Bell className="w-7 h-7 sm:w-8 sm:h-8 text-amber-900 fill-amber-400" />
            </div>

            {/* Dynamic Unread Badge */}
            {totalUnreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1.5 bg-[#EA384D] text-white text-[11px] font-black rounded-full flex items-center justify-center ring-2 ring-white shadow-md animate-in zoom-in-50">
                {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
              </span>
            )}
          </div>

          {/* Text Information */}
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-none text-white drop-shadow-xs font-heading">
              Notifications
            </h1>
            <p className="text-xs sm:text-[13px] text-blue-100/90 font-medium mt-1 leading-snug line-clamp-2">
              Stay updated with everything that matters to you
            </p>
          </div>
        </div>

        {/* Right Side: Quick Metric Sub-Cards */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Messages Subcard */}
          <button
            onClick={onFilterMessages}
            className="w-18 sm:w-20 bg-white rounded-2xl p-2 sm:p-2.5 text-slate-800 shadow-md text-center flex flex-col items-center justify-center transition-transform active:scale-95 hover:bg-slate-50 tap-bounce"
            aria-label="Filter unread messages"
          >
            <div className="w-7 h-7 rounded-xl bg-blue-50 text-[#1464F4] flex items-center justify-center mb-0.5">
              <Mail className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 leading-none">
              Messages
            </span>
            <span className="text-base sm:text-lg font-black text-slate-900 leading-tight mt-0.5">
              {unreadMessagesCount}
            </span>
            <span className="text-[9px] font-semibold text-slate-400 leading-none">
              New
            </span>
          </button>

          {/* Announcements Subcard */}
          <button
            onClick={onFilterAnnouncements}
            className="w-18 sm:w-20 bg-white rounded-2xl p-2 sm:p-2.5 text-slate-800 shadow-md text-center flex flex-col items-center justify-center transition-transform active:scale-95 hover:bg-slate-50 tap-bounce"
            aria-label="Filter announcements"
          >
            <div className="w-7 h-7 rounded-xl bg-purple-50 text-[#8B5CF6] flex items-center justify-center mb-0.5">
              <Megaphone className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 leading-none truncate max-w-full">
              Announce...
            </span>
            <span className="text-base sm:text-lg font-black text-slate-900 leading-tight mt-0.5">
              {unreadAnnouncementsCount}
            </span>
            <span className="text-[9px] font-semibold text-slate-400 leading-none">
              New
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
