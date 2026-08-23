import React from 'react';
import { ArrowLeft, Search, Bell } from 'lucide-react';
import { RentouraLogo } from '../RentouraLogo';
import { AppRoute } from '../../types';

interface MyListingsHeaderProps {
  onBack: () => void;
  onNavigate: (route: AppRoute) => void;
  isSearchOpen: boolean;
  onToggleSearch: () => void;
  unreadNotificationsCount?: number;
}

export const MyListingsHeader: React.FC<MyListingsHeaderProps> = ({
  onBack,
  onNavigate,
  isSearchOpen,
  onToggleSearch,
  unreadNotificationsCount = 0
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-xs px-4 py-2.5 transition-all">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-2">
        {/* Back Button */}
        <button
          onClick={onBack}
          aria-label="Go Back"
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 bg-slate-100/80 hover:bg-slate-200 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Brand Center Logo */}
        <div 
          onClick={() => onNavigate('/')}
          className="cursor-pointer flex flex-col items-center justify-center select-none"
        >
          <RentouraLogo size="sm" showTagline={true} />
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5">
          {/* Search Toggle Button */}
          <button
            onClick={onToggleSearch}
            aria-label="Search my listings"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isSearchOpen 
                ? 'bg-blue-50 text-[#1464F4] ring-2 ring-[#1464F4]/20' 
                : 'text-slate-700 bg-slate-100/80 hover:bg-slate-200 active:scale-95'
            }`}
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notification Bell with Badge */}
          <button
            onClick={() => onNavigate('/notifications')}
            aria-label="Notifications"
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 bg-slate-100/80 hover:bg-slate-200 active:scale-95 relative transition-all"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-in zoom-in">
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
