import React from 'react';
import { Bell, MessageSquare, Settings } from 'lucide-react';
import { AppRoute } from '../../types';
import { RentouraLogo } from '../RentouraLogo';

interface ProfileHeaderProps {
  onNavigate: (route: AppRoute) => void;
  unreadNotificationsCount: number;
  unreadMessagesCount: number;
  onOpenSettingsModal: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onNavigate,
  unreadNotificationsCount,
  unreadMessagesCount,
  onOpenSettingsModal
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#041C43] text-white px-4 py-3 shadow-md">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        {/* Notifications Icon Button */}
        <button
          onClick={() => onNavigate('/notifications')}
          className="relative p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white text-[11px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-[#041C43] animate-pulse">
              {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Centered Brand Logo */}
        <button onClick={() => onNavigate('/')} className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label="Go to RENTOURA.LK home">
          <RentouraLogo variant="header" theme="dark-header" size="sm" />
        </button>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/messages')}
            className="relative p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white"
            aria-label="Inbox"
          >
            <MessageSquare className="w-5 h-5" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-[#1464F4] text-white text-[11px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-[#041C43]">
                {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
              </span>
            )}
          </button>
          
          <button
            onClick={onOpenSettingsModal}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
