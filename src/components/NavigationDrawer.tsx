import React from 'react';
import { 
  X, Home, Key, Briefcase, Wrench, Heart, PlusCircle, MessageSquare, 
  User, ShieldCheck, HelpCircle, FileText, Globe, PhoneCall, ChevronRight, LayoutGrid, MapPin, Bell, Layers, LogOut 
} from 'lucide-react';
import { RentouraLogo } from './RentouraLogo';
import { AppRoute } from '../types';
import { isSuperAdmin, isAdmin, isModerator } from '../utils/roleUtils';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  savedCount?: number;
  unreadNotificationsCount?: number;
  unreadMessagesCount?: number;
  userProfile?: { fullName?: string; email?: string; city?: string; role?: string } | null;
  onLogout?: () => void | Promise<void>;
}

interface NavItem {
  label: string;
  route: AppRoute;
  icon: any;
  color: string;
  count?: number;
  badge?: string;
  isPrimary?: boolean;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  currentRoute,
  onNavigate,
  savedCount = 0,
  unreadNotificationsCount = 0,
  unreadMessagesCount = 2,
  userProfile,
  onLogout
}) => {
  if (!isOpen) return null;

  const staffNavItem: NavItem | null = isSuperAdmin(userProfile as any) ? {
    label: 'Super Admin Dashboard', route: '/super-admin' as AppRoute, icon: ShieldCheck, color: 'text-purple-600', badge: 'Super Admin', isPrimary: true
  } : isAdmin(userProfile as any) ? {
    label: 'Admin Dashboard', route: '/admin' as AppRoute, icon: ShieldCheck, color: 'text-[#1464F4]', badge: 'Admin', isPrimary: true
  } : isModerator(userProfile as any) ? {
    label: 'Moderator Dashboard', route: '/moderator' as AppRoute, icon: ShieldCheck, color: 'text-emerald-600', badge: 'Moderator', isPrimary: true
  } : null;

  const baseNavItems: NavItem[] = [
    { label: 'Home', route: '/' as AppRoute, icon: Home, color: 'text-slate-700' },
    { label: 'Notifications', route: '/notifications' as AppRoute, icon: Bell, color: 'text-[#1464F4]', count: unreadNotificationsCount, badge: unreadNotificationsCount > 0 ? 'New' : undefined },
    { label: 'Rentals & Properties', route: '/rentals' as AppRoute, icon: Key, color: 'text-[#1464F4]', badge: 'Popular' },
    { label: 'Find Jobs & Careers', route: '/jobs' as AppRoute, icon: Briefcase, color: 'text-[#08A34F]' },
    { label: 'Professional Services', route: '/services' as AppRoute, icon: Wrench, color: 'text-[#FF650A]' },
    { label: 'Choose Category', route: '/select-category' as AppRoute, icon: LayoutGrid, color: 'text-[#1464F4]', badge: 'New' },
    { label: 'Select Location', route: '/select-location' as AppRoute, icon: MapPin, color: 'text-[#08A34F]' },
    { label: 'Saved Favorites', route: '/saved' as AppRoute, icon: Heart, color: 'text-[#EA384D]', count: savedCount },
    { label: 'My Listings', route: '/my-listings' as AppRoute, icon: Layers, color: 'text-[#1464F4]' },
    { label: 'Post an Ad / Listing', route: '/post' as AppRoute, icon: PlusCircle, color: 'text-[#1464F4]', isPrimary: true },
    { label: 'Messages & Inquiries', route: '/messages' as AppRoute, icon: MessageSquare, color: 'text-slate-700', count: unreadMessagesCount },
    { label: 'My Account & Profile', route: '/profile' as AppRoute, icon: User, color: 'text-slate-700' },
    { label: 'Safety Center', route: '/safety' as AppRoute, icon: ShieldCheck, color: 'text-[#1464F4]', badge: 'Trust' },
    { label: 'Help & Support Center', route: '/help' as AppRoute, icon: HelpCircle, color: 'text-[#1464F4]' },
    { label: 'User Agreement & Terms', route: '/user-agreement' as AppRoute, icon: FileText, color: 'text-slate-700' },
  ];

  const navItems = staffNavItem ? [baseNavItems[0], staffNavItem, ...baseNavItems.slice(1)] : baseNavItems;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Content */}
      <div className="relative w-[320px] max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto no-scrollbar">
        {/* Drawer Header */}
        <div className="bg-[#041C43] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RentouraLogo variant="header" theme="dark-header" />
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#1464F4] to-[#00D2FF] text-white flex items-center justify-center font-bold text-base shadow-sm">
            {userProfile?.fullName ? userProfile.fullName.substring(0, 2).toUpperCase() : 'LK'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-bold text-slate-800 text-[14px] truncate">
                {userProfile?.fullName || 'Guest User'}
              </h4>
              {userProfile?.role === 'super_admin' && (
                <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 text-[9px] font-extrabold uppercase">Super Admin</span>
              )}
              {userProfile?.role === 'admin' && (
                <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[9px] font-extrabold uppercase">Admin</span>
              )}
              {userProfile?.role === 'moderator' && (
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[9px] font-extrabold uppercase">Moderator</span>
              )}
            </div>
            <p className="text-slate-500 text-[11px] truncate">
              {userProfile?.city || 'Sri Lanka'}
            </p>
          </div>
          <button
            onClick={() => {
              if (userProfile?.fullName) {
                onNavigate('/profile');
              } else {
                onNavigate('/login');
              }
              onClose();
            }}
            className="text-[11px] font-bold text-[#1464F4] hover:underline"
          >
            {userProfile?.fullName ? 'My Profile' : 'Sign In'}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="p-3 space-y-1 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
            Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => {
                  onNavigate(item.route);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
                  isActive 
                    ? 'bg-[#1464F4]/10 text-[#1464F4] font-bold' 
                    : item.isPrimary
                    ? 'bg-blue-50 text-[#1464F4] font-semibold hover:bg-blue-100/70'
                    : 'text-slate-700 hover:bg-slate-100 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#1464F4]' : item.color}`} />
                  <span className="text-[13px]">{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-[#1464F4] text-[9.5px] font-bold">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#EA384D] text-white text-[10px] font-bold">
                      {item.count}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </button>
            );
          })}
          {userProfile?.fullName && (
            <button
              onClick={() => {
                onClose();
                onLogout?.();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all text-red-600 hover:bg-red-50 font-bold mt-2 border border-red-100"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-red-600" />
                <span className="text-[13px]">Log Out of Rentoura</span>
              </div>
              <ChevronRight className="w-4 h-4 text-red-400" />
            </button>
          )}
        </div>

        {/* Trust & Support Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/80 space-y-2.5">
          <div className="flex items-center gap-2 text-slate-600 text-xs">
            <Globe className="w-4 h-4 text-[#1464F4]" />
            <span>Sri Lanka (English / Sinhala / Tamil)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 text-xs">
            <PhoneCall className="w-4 h-4 text-[#08A34F]" />
            <span>Support: +94 11 234 5678</span>
          </div>
          <div className="pt-2 text-[10px] text-slate-400 text-center">
            © 2026 RENTOURA.LK • All Rights Reserved
          </div>
        </div>
      </div>
    </div>
  );
};
