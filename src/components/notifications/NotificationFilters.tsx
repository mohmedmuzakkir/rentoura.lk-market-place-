import React from 'react';
import { Layers, ShoppingBag, MessageSquare, Bell, Wallet, Settings } from 'lucide-react';
import { NotificationCategory } from '../../types/notificationTypes';

interface NotificationFiltersProps {
  activeCategory: NotificationCategory;
  onSelectCategory: (category: NotificationCategory) => void;
  counts: Record<NotificationCategory, { total: number; unread: number }>;
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  activeCategory,
  onSelectCategory,
  counts
}) => {
  const tabs: {
    id: NotificationCategory;
    label: string;
    icon: React.FC<{ className?: string }>;
    iconColor: string;
    iconBg?: string;
  }[] = [
    {
      id: 'all',
      label: 'All',
      icon: Layers,
      iconColor: 'text-[#1464F4]'
    },
    {
      id: 'listings',
      label: 'Listings',
      icon: ShoppingBag,
      iconColor: 'text-[#FF650A]'
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      iconColor: 'text-[#8B5CF6]'
    },
    {
      id: 'updates',
      label: 'Updates',
      icon: Bell,
      iconColor: 'text-[#08A34F]'
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: Wallet,
      iconColor: 'text-[#1464F4]'
    },
    {
      id: 'system',
      label: 'System',
      icon: Settings,
      iconColor: 'text-slate-600'
    }
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-1">
      <div className="flex items-center gap-2 min-w-max px-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          const badgeCount = counts[tab.id]?.total || 0;
          const unreadCount = counts[tab.id]?.unread || 0;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectCategory(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all tap-bounce shrink-0 relative ${
                isActive
                  ? 'bg-white text-[#1464F4] shadow-xs border border-blue-100 ring-1 ring-[#1464F4]/20'
                  : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200/70 hover:border-slate-300'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#1464F4]' : tab.iconColor}`} />
              <span>{tab.label}</span>

              {/* Count Badge */}
              {badgeCount > 0 && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-black rounded-full leading-none transition-colors ${
                    isActive
                      ? 'bg-[#1464F4] text-white'
                      : unreadCount > 0
                      ? 'bg-blue-100 text-[#1464F4]'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
