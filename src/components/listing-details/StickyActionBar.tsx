import React from 'react';
import { Phone, MessageCircle, Send, Heart, Bookmark, Check } from 'lucide-react';
import { ListingModule } from '../../types/listingDetailsTypes';

interface StickyActionBarProps {
  module: ListingModule;
  phone?: string;
  whatsappNumber?: string;
  isSaved: boolean;
  onToggleSave: () => void;
  onSendMessage: () => void;
  onApplyNow?: () => void;
  listingTitle: string;
}

export const StickyActionBar: React.FC<StickyActionBarProps> = ({
  module,
  phone,
  whatsappNumber,
  isSaved,
  onToggleSave,
  onSendMessage,
  onApplyNow,
  listingTitle
}) => {
  // Helper for normalizing Sri Lanka numbers to international WhatsApp format: 07XXXXXXXX -> 947XXXXXXXX
  const getWhatsAppLink = (rawNumber?: string) => {
    if (!rawNumber) return '#';
    const cleaned = rawNumber.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.startsWith('0')) {
      formatted = '94' + cleaned.slice(1);
    } else if (!cleaned.startsWith('94')) {
      formatted = '94' + cleaned;
    }
    const text = encodeURIComponent(`Hi, I'm contacting you about your listing on RENTOURA.LK: ${listingTitle}`);
    return `https://wa.me/${formatted}?text=${text}`;
  };

  const handleCall = () => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  const handleWhatsApp = () => {
    if (whatsappNumber || phone) {
      window.open(getWhatsAppLink(whatsappNumber || phone), '_blank');
    }
  };

  // ---------------- RENTAL ACTIONS (Image 1) ----------------
  if (module === 'rentals') {
    return (
      <div className="bg-white border-t border-slate-100 p-2.5 shadow-lg">
        <div className="grid grid-cols-4 gap-2 max-w-lg mx-auto">
          {/* Call */}
          <button
            onClick={handleCall}
            disabled={!phone}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-blue-50/70 border border-blue-200/80 text-[#1464F4] hover:bg-blue-100 transition-all tap-bounce disabled:opacity-50"
          >
            <div className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-bold">Call</span>
            </div>
            <span className="text-[9px] font-semibold text-slate-500 truncate max-w-[80px]">
              {phone || 'Hidden'}
            </span>
          </button>

          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            disabled={!whatsappNumber && !phone}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#08A34F] text-white hover:bg-emerald-600 transition-all tap-bounce shadow-xs disabled:opacity-50"
          >
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span className="text-xs font-bold">WhatsApp</span>
            </div>
            <span className="text-[9px] font-medium text-emerald-100">
              Chat Now
            </span>
          </button>

          {/* Message */}
          <button
            onClick={onSendMessage}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#1464F4] text-white hover:bg-blue-700 transition-all tap-bounce shadow-xs"
          >
            <div className="flex items-center gap-1">
              <Send className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">Message</span>
            </div>
            <span className="text-[9px] font-medium text-blue-100">
              Send Message
            </span>
          </button>

          {/* Save */}
          <button
            onClick={onToggleSave}
            className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all tap-bounce ${
              isSaved 
                ? 'bg-rose-50 border-rose-200 text-rose-600' 
                : 'bg-white border-blue-200/80 text-[#1464F4] hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-1">
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className="text-xs font-bold">{isSaved ? 'Saved' : 'Save'}</span>
            </div>
            <span className="text-[9px] font-semibold text-slate-400">
              {isSaved ? 'In Favorites' : 'Add to Saved'}
            </span>
          </button>
        </div>
      </div>
    );
  }

  // ---------------- JOB ACTIONS (Image 2) ----------------
  if (module === 'jobs') {
    return (
      <div className="bg-white border-t border-slate-100 p-2.5 shadow-lg">
        <div className="grid grid-cols-4 gap-2 max-w-lg mx-auto">
          {/* Apply Now */}
          <button
            onClick={onApplyNow || onSendMessage}
            className="col-span-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#08A34F] text-white font-bold text-xs hover:bg-emerald-700 transition-all tap-bounce shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="truncate">Apply Now</span>
          </button>

          {/* Apply via WhatsApp */}
          <button
            onClick={handleWhatsApp}
            disabled={!whatsappNumber && !phone}
            className="col-span-1 flex items-center justify-center gap-1.5 py-2.5 px-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#08A34F] font-bold text-[11px] hover:bg-emerald-100 transition-all tap-bounce disabled:opacity-50"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-[#08A34F]" />
            <span className="truncate">WhatsApp</span>
          </button>

          {/* Call HR */}
          <button
            onClick={handleCall}
            disabled={!phone}
            className="col-span-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-100 transition-all tap-bounce disabled:opacity-50"
          >
            <Phone className="w-3.5 h-3.5 text-slate-700" />
            <span className="truncate">Call HR</span>
          </button>

          {/* Save Job */}
          <button
            onClick={onToggleSave}
            className={`col-span-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border text-xs font-bold transition-all tap-bounce ${
              isSaved 
                ? 'bg-rose-50 border-rose-200 text-rose-600' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span className="truncate">{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>
    );
  }

  // ---------------- SERVICE ACTIONS (Image 3) ----------------
  return (
    <div className="bg-white border-t border-slate-100 p-2.5 shadow-lg">
      <div className="grid grid-cols-3 gap-2.5 max-w-lg mx-auto">
        {/* WhatsApp */}
        <button
          onClick={handleWhatsApp}
          disabled={!whatsappNumber && !phone}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#08A34F] text-white font-bold text-xs hover:bg-emerald-600 transition-all tap-bounce shadow-xs disabled:opacity-50"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>WhatsApp</span>
        </button>

        {/* Call Now */}
        <button
          onClick={handleCall}
          disabled={!phone}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#FF650A] text-white font-bold text-xs hover:bg-orange-600 transition-all tap-bounce shadow-xs disabled:opacity-50"
        >
          <Phone className="w-4 h-4 fill-white" />
          <span>Call Now</span>
        </button>

        {/* Message */}
        <button
          onClick={onSendMessage}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-[#FF650A] text-[#FF650A] font-bold text-xs hover:bg-orange-50 transition-all tap-bounce"
        >
          <Send className="w-4 h-4" />
          <span>Message</span>
        </button>
      </div>
    </div>
  );
};
