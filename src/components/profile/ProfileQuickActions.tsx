import React from 'react';
import { Briefcase, Wrench, Home } from 'lucide-react';
import { AppRoute } from '../../types';

interface ProfileQuickActionsProps {
  onNavigate: (route: AppRoute) => void;
  onOpenUpgradeModal?: () => void;
}

export const ProfileQuickActions: React.FC<ProfileQuickActionsProps> = ({
  onNavigate
}) => {
  return (
    <div className="max-w-xl mx-auto px-4 mt-4 space-y-3">
      {/* Quick Post Action Buttons */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          onClick={() => onNavigate('/post')}
          className="p-3 rounded-2xl bg-blue-50/90 hover:bg-blue-100/90 border border-blue-200/80 flex flex-col items-center justify-center text-center transition-all tap-bounce group"
        >
          <div className="w-8 h-8 rounded-xl bg-[#1464F4] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform mb-1.5">
            <Home className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-800 font-heading">Add Rental</span>
          <span className="text-[10px] text-slate-500 mt-0.5">Property, Vehicles</span>
        </button>

        <button
          onClick={() => onNavigate('/post')}
          className="p-3 rounded-2xl bg-emerald-50/90 hover:bg-emerald-100/90 border border-emerald-200/80 flex flex-col items-center justify-center text-center transition-all tap-bounce group"
        >
          <div className="w-8 h-8 rounded-xl bg-[#08A34F] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform mb-1.5">
            <Briefcase className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-800 font-heading">Post Job</span>
          <span className="text-[10px] text-slate-500 mt-0.5">Hire Sri Lankan Talent</span>
        </button>

        <button
          onClick={() => onNavigate('/post')}
          className="p-3 rounded-2xl bg-orange-50/90 hover:bg-orange-100/90 border border-orange-200/80 flex flex-col items-center justify-center text-center transition-all tap-bounce group"
        >
          <div className="w-8 h-8 rounded-xl bg-[#FF650A] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform mb-1.5">
            <Wrench className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-800 font-heading">Offer Service</span>
          <span className="text-[10px] text-slate-500 mt-0.5">Professional Skills</span>
        </button>
      </div>
    </div>
  );
};
