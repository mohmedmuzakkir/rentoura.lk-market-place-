import React from 'react';
import { Phone, MessageCircle, MessageSquare, Send, Heart, Bookmark } from 'lucide-react';
import { ListingModule } from '../../types/listingDetailsTypes';

export interface StickyActionBarProps {
  module: ListingModule;
  phone?: string;
  whatsappNumber?: string;
  isSaved: boolean;
  onToggleSave: () => void;
  onSendMessage: () => void;
  onApplyNow?: () => void;
  onCall?: () => void;
  onWhatsApp?: () => void;
  className?: string;
}

export const StickyActionBar: React.FC<StickyActionBarProps> = ({
  module,
  phone,
  whatsappNumber,
  isSaved,
  onToggleSave,
  onSendMessage,
  onApplyNow,
  onCall,
  onWhatsApp,
  className = ''
}) => {
  // Container styling in normal document flow (no position fixed or sticky)
  const containerClasses = `w-full bg-white rounded-3xl border border-slate-200/80 p-3.5 sm:p-5 shadow-xs my-4 ${className}`;

  // ---------------- RENTALS ACTIONS ----------------
  if (module === 'rentals') {
    return (
      <div className={containerClasses}>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {/* Call */}
          <button
            type="button"
            onClick={onCall}
            disabled={!phone || !onCall}
            className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3.5 px-2 sm:px-4 rounded-2xl bg-[#1464F4] text-white hover:bg-blue-600 transition-all font-bold text-xs sm:text-sm shadow-xs disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] tap-bounce min-h-[48px]"
          >
            <Phone className="w-4 h-4 fill-white shrink-0" />
            <span>Call</span>
          </button>

          {/* Chat */}
          <button
            type="button"
            onClick={onSendMessage}
            className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3.5 px-2 sm:px-4 rounded-2xl bg-[#1464F4] text-white hover:bg-blue-600 transition-all font-bold text-xs sm:text-sm shadow-xs active:scale-[0.98] tap-bounce min-h-[48px]"
          >
            <MessageSquare className="w-4 h-4 fill-white shrink-0" />
            <span>Chat</span>
          </button>

          {/* WhatsApp */}
          <button
            type="button"
            onClick={onWhatsApp}
            disabled={(!whatsappNumber && !phone) || !onWhatsApp}
            className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3.5 px-2 sm:px-4 rounded-2xl bg-[#1464F4] text-white hover:bg-blue-600 transition-all font-bold text-xs sm:text-sm shadow-xs disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] tap-bounce min-h-[48px]"
          >
            <MessageCircle className="w-4 h-4 fill-white shrink-0" />
            <span>WhatsApp</span>
          </button>

          {/* Save */}
          <button
            type="button"
            onClick={onToggleSave}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3.5 px-2 sm:px-4 rounded-2xl border transition-all font-bold text-xs sm:text-sm shadow-xs active:scale-[0.98] tap-bounce min-h-[48px] ${
              isSaved
                ? 'bg-rose-500 border-rose-500 text-white hover:bg-rose-600'
                : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Heart className={`w-4 h-4 shrink-0 ${isSaved ? 'fill-white text-white' : 'text-slate-600'}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>
    );
  }

  // ---------------- JOBS ACTIONS ----------------
  if (module === 'jobs') {
    return (
      <div className={containerClasses}>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
          {/* Apply Now */}
          <button
            type="button"
            onClick={onApplyNow}
            disabled={!onApplyNow}
            className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 sm:gap-2 py-3.5 px-3 rounded-2xl bg-[#08A34F] text-white font-bold text-xs sm:text-sm hover:bg-emerald-600 transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] tap-bounce min-h-[48px]"
          >
            <Send className="w-4 h-4 shrink-0" />
            <span>Apply Now</span>
          </button>

          {/* Call HR */}
          <button
            type="button"
            onClick={onCall}
            disabled={!phone || !onCall}
            className="flex items-center justify-center gap-1.5 sm:gap-2 py-3.5 px-2 sm:px-3 rounded-2xl bg-[#08A34F] text-white hover:bg-emerald-600 transition-all font-bold text-xs sm:text-sm shadow-xs disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] tap-bounce min-h-[48px]"
          >
            <Phone className="w-4 h-4 fill-white shrink-0" />
            <span>Call HR</span>
          </button>

          {/* Chat */}
          <button
            type="button"
            onClick={onSendMessage}
            className="flex items-center justify-center gap-1.5 sm:gap-2 py-3.5 px-2 sm:px-3 rounded-2xl bg-[#08A34F] text-white hover:bg-emerald-600 transition-all font-bold text-xs sm:text-sm shadow-xs active:scale-[0.98] tap-bounce min-h-[48px]"
          >
            <MessageSquare className="w-4 h-4 fill-white shrink-0" />
            <span>Chat</span>
          </button>

          {/* WhatsApp */}
          <button
            type="button"
            onClick={onWhatsApp}
            disabled={(!whatsappNumber && !phone) || !onWhatsApp}
            className="flex items-center justify-center gap-1.5 sm:gap-2 py-3.5 px-2 sm:px-3 rounded-2xl bg-[#08A34F] text-white hover:bg-emerald-600 transition-all font-bold text-xs sm:text-sm shadow-xs disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] tap-bounce min-h-[48px]"
          >
            <MessageCircle className="w-4 h-4 fill-white shrink-0" />
            <span>WhatsApp</span>
          </button>

          {/* Save Job */}
          <button
            type="button"
            onClick={onToggleSave}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 py-3.5 px-2 sm:px-3 rounded-2xl border transition-all font-bold text-xs sm:text-sm shadow-xs active:scale-[0.98] tap-bounce min-h-[48px] ${
              isSaved
                ? 'bg-rose-500 border-rose-500 text-white hover:bg-rose-600'
                : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-4 h-4 shrink-0 ${isSaved ? 'fill-white text-white' : 'text-slate-600'}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>
    );
  }

  // ---------------- SERVICES ACTIONS ----------------
  return (
    <div className={containerClasses}>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {/* Call Now */}
        <button
          type="button"
          onClick={onCall}
          disabled={!phone || !onCall}
          className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3.5 px-2 sm:px-4 rounded-2xl bg-[#FF650A] text-white hover:bg-orange-600 transition-all font-bold text-xs sm:text-sm shadow-xs disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] tap-bounce min-h-[48px]"
        >
          <Phone className="w-4 h-4 fill-white shrink-0" />
          <span>Call</span>
        </button>

        {/* Chat / Message */}
        <button
          type="button"
          onClick={onSendMessage}
          className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3.5 px-2 sm:px-4 rounded-2xl bg-[#FF650A] text-white hover:bg-orange-600 transition-all font-bold text-xs sm:text-sm shadow-xs active:scale-[0.98] tap-bounce min-h-[48px]"
        >
          <MessageSquare className="w-4 h-4 fill-white shrink-0" />
          <span>Chat</span>
        </button>

        {/* WhatsApp */}
        <button
          type="button"
          onClick={onWhatsApp}
          disabled={(!whatsappNumber && !phone) || !onWhatsApp}
          className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3.5 px-2 sm:px-4 rounded-2xl bg-[#FF650A] text-white hover:bg-orange-600 transition-all font-bold text-xs sm:text-sm shadow-xs disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] tap-bounce min-h-[48px]"
        >
          <MessageCircle className="w-4 h-4 fill-white shrink-0" />
          <span>WhatsApp</span>
        </button>

        {/* Save */}
        <button
          type="button"
          onClick={onToggleSave}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3.5 px-2 sm:px-4 rounded-2xl border transition-all font-bold text-xs sm:text-sm shadow-xs active:scale-[0.98] tap-bounce min-h-[48px] ${
            isSaved
              ? 'bg-rose-500 border-rose-500 text-white hover:bg-rose-600'
              : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Heart className={`w-4 h-4 shrink-0 ${isSaved ? 'fill-white text-white' : 'text-slate-600'}`} />
          <span>{isSaved ? 'Saved' : 'Save'}</span>
        </button>
      </div>
    </div>
  );
};

export const ListingActionBar = StickyActionBar;
