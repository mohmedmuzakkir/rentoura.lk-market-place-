import React from 'react';
import { Menu, Heart, MessageSquare, Bell, ArrowLeft, Plus, User, Search, Briefcase, Wrench, Building2, Home, ShieldCheck } from 'lucide-react';
import { RentouraLogo } from './RentouraLogo';
import { AppRoute } from '../types';
import { isSuperAdmin, isAdmin, isModerator } from '../utils/roleUtils';

interface HeaderProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  onOpenDrawer: () => void;
  onOpenNotifications: () => void;
  savedCount?: number;
  unreadMessagesCount?: number;
  unreadNotificationsCount?: number;
  userProfile?: { fullName?: string; role?: string } | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  onOpenDrawer,
  onOpenNotifications,
  savedCount = 0,
  unreadMessagesCount = 2,
  unreadNotificationsCount = 5,
  userProfile
}) => {
  const isMobileHiddenRoute = 
    currentRoute === '/search' || 
    currentRoute === '/select-location' || 
    currentRoute === '/select-category' || 
    currentRoute === '/filters' ||
    currentRoute === '/saved' ||
    currentRoute === '/messages' ||
    currentRoute === '/chat' ||
    currentRoute === '/rental-detail' ||
    currentRoute === '/job-detail' ||
    currentRoute === '/service-detail' ||
    currentRoute === '/notifications';

  const showBackArrowMobile = currentRoute === '/rentals';

  return (
    <>
      {/* DESKTOP HEADER (Visible on >= 1024px for all public pages) */}
      <header className="hidden lg:block sticky top-0 z-50 bg-[#041C43] border-b border-white/10 shadow-lg transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          {/* Left: Brand Logo */}
          <button 
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 focus:outline-none hover:opacity-95 transition-opacity"
          >
            <RentouraLogo variant="header" theme="dark-header" />
          </button>

          {/* Center: Main Navigation */}
          <nav className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
            <button
              onClick={() => onNavigate('/')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentRoute === '/' 
                  ? 'bg-[#1464F4] text-white shadow-md' 
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </button>
            <button
              onClick={() => onNavigate('/rentals')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentRoute === '/rentals' || currentRoute === '/rental-detail'
                  ? 'bg-[#1464F4] text-white shadow-md' 
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-sky-400" />
              Rentals
            </button>
            <button
              onClick={() => onNavigate('/jobs')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentRoute === '/jobs' || currentRoute === '/job-detail'
                  ? 'bg-[#08A34F] text-white shadow-md' 
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
              Jobs
            </button>
            <button
              onClick={() => onNavigate('/services')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentRoute === '/services' || currentRoute === '/service-detail'
                  ? 'bg-[#FF650A] text-white shadow-md' 
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-orange-400" />
              Services
            </button>
          </nav>

          {/* Right: Utility Actions & CTA */}
          <div className="flex items-center gap-3">
            {/* Search shortcut */}
            <button
              onClick={() => onNavigate('/search')}
              className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              title="Search Listings"
            >
              <Search className="w-4 h-4 stroke-[2.2]" />
            </button>

            {/* Saved Heart */}
            <button
              onClick={() => onNavigate('/saved')}
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors relative hover:bg-white/10 ${
                currentRoute === '/saved' ? 'text-[#1464F4]' : 'text-slate-300 hover:text-white'
              }`}
              title="Saved Items"
            >
              <Heart className={`w-4 h-4 stroke-[2.2] ${currentRoute === '/saved' ? 'fill-[#1464F4] text-[#1464F4]' : ''}`} />
              {savedCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#1464F4] rounded-full ring-2 ring-[#041C43]" />
              )}
            </button>

            {/* Messages */}
            <button
              onClick={() => onNavigate('/messages')}
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors relative hover:bg-white/10 ${
                currentRoute === '/messages' || currentRoute === '/chat' ? 'text-[#1464F4]' : 'text-slate-300 hover:text-white'
              }`}
              title="Messages"
            >
              <MessageSquare className="w-4 h-4 stroke-[2.2]" />
              {unreadMessagesCount > 0 && (
                <span className="absolute top-1 right-0.5 min-w-4 h-4 px-1 bg-[#EA384D] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#041C43]">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            {/* Notifications */}
            <button
              onClick={onOpenNotifications}
              className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4 stroke-[2.2]" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-0.5 min-w-4 h-4 px-1 bg-[#EA384D] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#041C43]">
                  {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                </span>
              )}
            </button>

            <div className="h-5 w-px bg-white/15 mx-1" />

            {/* Post CTA Button */}
            <button
              onClick={() => onNavigate('/post')}
              className="px-4 py-2 bg-[#1464F4] hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Post Ad
            </button>

            {/* Role-Based Dashboard Button for Staff */}
            {isSuperAdmin(userProfile as any) && (
              <button
                onClick={() => onNavigate('/super-admin')}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-purple-200" />
                <span>Super Admin Dashboard</span>
              </button>
            )}
            {!isSuperAdmin(userProfile as any) && isAdmin(userProfile as any) && (
              <button
                onClick={() => onNavigate('/admin')}
                className="px-3 py-1.5 bg-[#1464F4] hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-blue-200" />
                <span>Admin Dashboard</span>
              </button>
            )}
            {!isSuperAdmin(userProfile as any) && !isAdmin(userProfile as any) && isModerator(userProfile as any) && (
              <button
                onClick={() => onNavigate('/moderator')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-200" />
                <span>Moderator Dashboard</span>
              </button>
            )}

            {/* Profile Avatar/Button */}
            <button
              onClick={() => onNavigate('/profile')}
              className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border transition-all ${
                currentRoute === '/profile' 
                  ? 'border-[#1464F4] bg-[#1464F4]/10 text-white' 
                  : 'border-white/15 bg-white/5 text-slate-200 hover:bg-white/10 hover:border-white/25'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-[#1464F4] flex items-center justify-center text-white text-xs font-bold">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold">Account</span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE HEADER (Preserved 100% on < 1024px) */}
      {!isMobileHiddenRoute && (
        <header className="lg:hidden sticky top-0 z-40 bg-[#041C43] px-4 pt-3 pb-3 border-b border-white/5 transition-all">
          <div className="max-w-md mx-auto flex items-center justify-between">
            {/* Left: Back Arrow on Rentals, Hamburger Menu on other screens */}
            {showBackArrowMobile ? (
              <button
                onClick={() => onNavigate('/')}
                className="w-10 h-10 -ml-1 flex items-center justify-center text-white/90 hover:text-white rounded-xl active:bg-white/10 transition-colors"
                aria-label="Back to home"
              >
                <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
              </button>
            ) : (
              <button
                onClick={onOpenDrawer}
                className="w-10 h-10 -ml-1 flex items-center justify-center text-white/90 hover:text-white rounded-xl active:bg-white/10 transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6 stroke-[2.2]" />
              </button>
            )}

            {/* Center: Brand Logo */}
            <button 
              onClick={() => onNavigate('/')}
              className="flex items-center justify-center focus:outline-none tap-bounce"
            >
              <RentouraLogo variant="header" theme="dark-header" />
            </button>

            {/* Right: Actions (Heart, Messages, Bell) */}
            <div className="flex items-center gap-1.5 -mr-1">
              {/* Saved Heart */}
              <button
                onClick={() => onNavigate('/saved')}
                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors relative active:bg-white/10 ${
                  currentRoute === '/saved' ? 'text-[#1464F4]' : 'text-white/90 hover:text-white'
                }`}
                aria-label="Saved items"
              >
                <Heart className={`w-5 h-5 stroke-[2] ${currentRoute === '/saved' ? 'fill-[#1464F4] text-[#1464F4]' : ''}`} />
                {savedCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#1464F4] rounded-full ring-2 ring-[#041C43]" />
                )}
              </button>

              {/* Messages */}
              <button
                onClick={() => onNavigate('/messages')}
                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors relative active:bg-white/10 ${
                  currentRoute === '/messages' ? 'text-[#1464F4]' : 'text-white/90 hover:text-white'
                }`}
                aria-label="Messages"
              >
                <MessageSquare className="w-5 h-5 stroke-[2]" />
                <span className="absolute top-1 right-0.5 min-w-4 h-4 px-1 bg-[#EA384D] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#041C43]">
                  {unreadMessagesCount}
                </span>
              </button>

              {/* Notifications Bell */}
              <button
                onClick={onOpenNotifications}
                className="w-9 h-9 flex items-center justify-center text-white/90 hover:text-white rounded-xl active:bg-white/10 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 stroke-[2]" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-0.5 min-w-4 h-4 px-1 bg-[#EA384D] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#041C43]">
                    {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>
      )}
    </>
  );
};
