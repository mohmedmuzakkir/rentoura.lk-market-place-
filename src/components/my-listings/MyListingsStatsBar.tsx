import React from 'react';
import { 
  Layers, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Calendar
} from 'lucide-react';
import { UserListingStatus } from '../../types/profileTypes';

export type StatusFilterType = 'all' | UserListingStatus;

interface MyListingsStatsBarProps {
  totalCount: number;
  activeCount: number;
  pendingCount: number;
  rejectedCount: number;
  expiredCount: number;
  selectedStatus: StatusFilterType;
  onSelectStatus: (status: StatusFilterType) => void;
}

export const MyListingsStatsBar: React.FC<MyListingsStatsBarProps> = ({
  totalCount,
  activeCount,
  pendingCount,
  rejectedCount,
  expiredCount,
  selectedStatus,
  onSelectStatus
}) => {
  const stats = [
    {
      id: 'all' as StatusFilterType,
      label: 'Total Listings',
      count: totalCount,
      subtext: 'All Time',
      icon: Layers,
      color: 'text-[#1464F4]',
      bgColor: 'bg-blue-50/70',
      activeBorder: 'ring-2 ring-[#1464F4] bg-blue-50/90 shadow-sm',
      badgeBg: 'bg-blue-100 text-[#1464F4]'
    },
    {
      id: 'active' as StatusFilterType,
      label: 'Active',
      count: activeCount,
      subtext: 'Published',
      icon: CheckCircle2,
      color: 'text-[#08A34F]',
      bgColor: 'bg-emerald-50/70',
      activeBorder: 'ring-2 ring-[#08A34F] bg-emerald-50/90 shadow-sm',
      badgeBg: 'bg-emerald-100 text-[#08A34F]'
    },
    {
      id: 'pending' as StatusFilterType,
      label: 'Pending',
      count: pendingCount,
      subtext: 'Under Review',
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50/70',
      activeBorder: 'ring-2 ring-amber-500 bg-amber-50/90 shadow-sm',
      badgeBg: 'bg-amber-100 text-amber-600'
    },
    {
      id: 'rejected' as StatusFilterType,
      label: 'Rejected',
      count: rejectedCount,
      subtext: 'Not Approved',
      icon: XCircle,
      color: 'text-rose-500',
      bgColor: 'bg-rose-50/70',
      activeBorder: 'ring-2 ring-rose-500 bg-rose-50/90 shadow-sm',
      badgeBg: 'bg-rose-100 text-rose-600'
    },
    {
      id: 'expired' as StatusFilterType,
      label: 'Expired',
      count: expiredCount,
      subtext: 'Expired',
      icon: Calendar,
      color: 'text-slate-500',
      bgColor: 'bg-slate-50/70',
      activeBorder: 'ring-2 ring-slate-500 bg-slate-100 shadow-sm',
      badgeBg: 'bg-slate-200 text-slate-700'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-200/90 shadow-sm">
      {/* Scrollable Container on ultra-compact screens, Grid on standard screens */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 px-0.5">
        {stats.map(item => {
          const isSelected = selectedStatus === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelectStatus(item.id)}
              className={`flex-1 min-w-[76px] sm:min-w-[80px] p-2.5 rounded-xl text-center flex flex-col items-center justify-between transition-all duration-200 cursor-pointer active:scale-95 select-none ${
                isSelected 
                  ? item.activeBorder 
                  : `${item.bgColor} hover:brightness-95 border border-transparent`
              }`}
            >
              {/* Header Label with Icon */}
              <div className="flex items-center justify-center gap-1 mb-1 w-full">
                <Icon className={`w-3.5 h-3.5 ${item.color} shrink-0`} />
                <span className="text-[10px] font-semibold text-slate-600 truncate max-w-[55px]">
                  {item.label}
                </span>
              </div>

              {/* Stat Count (Bold Display Number) */}
              <div className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-none my-0.5">
                {item.count}
              </div>

              {/* Subtext description */}
              <span className="text-[9px] font-medium text-slate-500 truncate max-w-[65px]">
                {item.subtext}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
