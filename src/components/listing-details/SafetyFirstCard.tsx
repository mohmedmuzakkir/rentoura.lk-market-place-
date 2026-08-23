import React from 'react';
import { ShieldAlert, Flag } from 'lucide-react';
import { ListingModule } from '../../types/listingDetailsTypes';

interface SafetyFirstCardProps {
  module: ListingModule;
  onOpenReport: () => void;
}

export const SafetyFirstCard: React.FC<SafetyFirstCardProps> = ({ module, onOpenReport }) => {
  const getSafetyContent = () => {
    switch (module) {
      case 'jobs':
        return {
          title: 'Safety First',
          text: 'We are just a platform. Please communicate and meet safely. Never pay any advance money or processing fees for job applications. Your safety is your responsibility.',
          buttonText: 'Report Job',
          themeColor: '#08A34F'
        };
      case 'services':
        return {
          title: 'Safety First',
          text: 'We are just a platform. Please meet in person and check the service provider before confirming. Do not make any advance payments. Your safety is your responsibility.',
          buttonText: 'Report This Listing',
          themeColor: '#FF650A'
        };
      case 'rentals':
      default:
        return {
          title: 'Safety First',
          text: 'We are just a platform. Please meet in person and check the item/property before renting. No advance payments. Your safety is your responsibility.',
          buttonText: 'Report Listing',
          themeColor: '#1464F4'
        };
    }
  };

  const content = getSafetyContent();

  return (
    <div className="space-y-2">
      <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-100/70 text-amber-700 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              {content.title}
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed max-w-lg mt-0.5">
              {content.text}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <a
            href={`/safety#${module}`}
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', `/safety#${module}`);
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all tap-bounce"
          >
            Learn More
          </a>
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold transition-all tap-bounce shadow-2xs"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>{content.buttonText}</span>
          </button>
        </div>
      </div>

      <div className="text-center">
        <p className="text-[10px] text-slate-400 font-medium">
          RENTOURA.LK is not responsible for any transactions, rentals, job offers or agreements between users.
        </p>
      </div>
    </div>
  );
};
