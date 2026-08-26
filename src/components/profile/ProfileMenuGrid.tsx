import React from 'react';
import { 
  MessageSquare, 
  Heart, 
  Star, 
  ShieldCheck, 
  Wallet, 
  Flag, 
  UserCog, 
  Lock, 
  HelpCircle, 
  ChevronRight 
} from 'lucide-react';
import { AppRoute } from '../../types';
import { isSuperAdmin, isAdmin, isModerator } from '../../utils/roleUtils';

interface ProfileMenuGridProps {
  onNavigate: (route: AppRoute) => void;
  onOpenReviewsModal: () => void;
  onOpenVerificationModal: () => void;
  onOpenPaymentsModal: () => void;
  onOpenReportsModal: () => void;
  onOpenSecurityModal: () => void;
  onOpenHelpModal: () => void;
  userProfile?: { role?: string } | null;
}

export const ProfileMenuGrid: React.FC<ProfileMenuGridProps> = ({
  onNavigate,
  onOpenReviewsModal,
  onOpenVerificationModal,
  onOpenPaymentsModal,
  onOpenReportsModal,
  onOpenSecurityModal,
  onOpenHelpModal,
  userProfile
}) => {
  const staffItem = isSuperAdmin(userProfile as any) ? {
    id: 'staff-dashboard',
    label: 'Super Admin Dashboard',
    subtitle: 'System, staff & full platform tools',
    icon: ShieldCheck,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-100',
    onClick: () => onNavigate('/super-admin')
  } : isAdmin(userProfile as any) ? {
    id: 'staff-dashboard',
    label: 'Admin Dashboard',
    subtitle: 'Platform operations & listings management',
    icon: ShieldCheck,
    iconColor: 'text-[#1464F4]',
    iconBg: 'bg-blue-100',
    onClick: () => onNavigate('/admin')
  } : isModerator(userProfile as any) ? {
    id: 'staff-dashboard',
    label: 'Moderator Dashboard',
    subtitle: 'Moderation queue, reports & reviews',
    icon: ShieldCheck,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-100',
    onClick: () => onNavigate('/moderator')
  } : null;

  const baseMenuItems = [
    {
      id: 'inbox',
      label: 'My Inbox',
      subtitle: 'View all conversations',
      icon: MessageSquare,
      iconColor: 'text-[#1464F4]',
      iconBg: 'bg-blue-50',
      onClick: () => onNavigate('/messages')
    },
    {
      id: 'saved',
      label: 'Saved Listings',
      subtitle: 'Your favorite listings',
      icon: Heart,
      iconColor: 'text-rose-500',
      iconBg: 'bg-rose-50',
      onClick: () => onNavigate('/saved')
    },
    {
      id: 'reviews',
      label: 'My Reviews',
      subtitle: "Reviews you've received",
      icon: Star,
      iconColor: 'text-amber-500 fill-amber-400',
      iconBg: 'bg-amber-50',
      onClick: onOpenReviewsModal
    },
    {
      id: 'payments',
      label: 'Payments & Ads',
      subtitle: 'Manage payments & ad promotions',
      icon: Wallet,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50',
      onClick: onOpenPaymentsModal
    },
    {
      id: 'reports',
      label: 'Reports',
      subtitle: 'Listings you reported',
      icon: Flag,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50',
      onClick: onOpenReportsModal
    },
    {
      id: 'settings',
      label: 'Account Settings',
      subtitle: 'Edit profile & preferences',
      icon: UserCog,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50',
      onClick: () => onNavigate('/profile/edit')
    },
    {
      id: 'security',
      label: 'Security',
      subtitle: 'Password & privacy',
      icon: Lock,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
      onClick: onOpenSecurityModal
    },
    {
      id: 'help',
      label: 'Help & Support',
      subtitle: 'Get help and support',
      icon: HelpCircle,
      iconColor: 'text-cyan-600',
      iconBg: 'bg-cyan-50',
      onClick: onOpenHelpModal
    }
  ];

  const menuItems = staffItem ? [staffItem, ...baseMenuItems] : baseMenuItems;

  return (
    <div className="max-w-xl mx-auto px-4 mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between transition-all tap-bounce text-left shadow-sm hover:shadow"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 font-heading truncate">
                    {item.label}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
