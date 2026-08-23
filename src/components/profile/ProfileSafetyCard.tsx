import React from 'react';
import { ShieldAlert, ChevronRight } from 'lucide-react';

interface ProfileSafetyCardProps {
  onLearnMore: () => void;
}

export const ProfileSafetyCard: React.FC<ProfileSafetyCardProps> = ({
  onLearnMore
}) => {
  return (
    <div className="max-w-xl mx-auto px-4 mt-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#08A34F] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 font-heading">
              Safety First
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
              Meet in person and check the item or property before renting or paying. We do not encourage or support advance payments without physical verification.
            </p>
          </div>
        </div>

        <button
          onClick={onLearnMore}
          className="shrink-0 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all tap-bounce flex items-center gap-1 self-end sm:self-center"
        >
          Learn More
          <ChevronRight className="w-3 h-3 text-slate-400" />
        </button>
      </div>
    </div>
  );
};
