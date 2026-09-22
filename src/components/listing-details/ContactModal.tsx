import React from 'react';
import { Phone, MessageCircle, X, ExternalLink } from 'lucide-react';
import { ListingContactPhoneItem } from '../../types/listingDetailsTypes';
import { buildOwnerWhatsAppUrl } from '../../utils/contactLinks';
import { AuthService } from '../../services/authService';

export interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'call' | 'whatsapp';
  listingTitle: string;
  phones: ListingContactPhoneItem[];
  onProtectedAction?: (action: { type: string; returnRoute: string; execute: () => void }) => void;
  currentPath?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  type,
  listingTitle,
  phones,
  onProtectedAction,
  currentPath = typeof window !== 'undefined' ? window.location.pathname : '/'
}) => {
  if (!isOpen) return null;

  const currentUser = AuthService.getCurrentUser();
  const isLoggedIn = Boolean(currentUser);
  const isCall = type === 'call';

  // Filter available items
  const activeItems = isCall
    ? phones.filter(p => p && p.phone && p.phone.trim())
    : phones.filter(p => p && p.isWhatsApp && p.phone && p.phone.trim());

  const handleAction = (item: ListingContactPhoneItem) => {
    if (!isLoggedIn) {
      if (onProtectedAction) {
        onProtectedAction({ type: isCall ? 'call' : 'whatsapp', returnRoute: currentPath, execute: () => {} });
      } else {
        window.location.href = `/login?returnUrl=${encodeURIComponent(currentPath)}`;
      }
      onClose();
      return;
    }

    if (isCall) {
      window.location.href = `tel:${item.phone}`;
    } else {
      const url = buildOwnerWhatsAppUrl(item.phone, listingTitle);
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }
    onClose();
  };

  const formatMaskedPhone = (phoneStr: string) => {
    if (!phoneStr) return '07• ••• ••••';
    const digits = phoneStr.replace(/\D/g, '');
    if (digits.length >= 10) {
      return `${digits.slice(0, 3)} ••• ••••`;
    }
    if (digits.length >= 6) {
      return `${digits.slice(0, 3)} ••• ${digits.slice(-2)}`;
    }
    return `${digits.slice(0, 3)} ••• ••••`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            isCall ? 'bg-blue-50 text-[#1464F4]' : 'bg-emerald-50 text-emerald-600'
          }`}>
            {isCall ? <Phone className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {isCall ? 'Call Owner' : 'WhatsApp Contact'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isCall ? 'Choose a phone number to place a call' : 'Select a WhatsApp number to start chat'}
            </p>
          </div>
        </div>

        {/* Number List */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {activeItems.map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => handleAction(item)}
              className="p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all flex items-center justify-between cursor-pointer group tap-bounce"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    idx === 0 ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {item.label || (idx === 0 ? 'Primary' : 'Contact')}
                  </span>
                  {item.isWhatsApp && isCall && (
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      WhatsApp Available
                    </span>
                  )}
                </div>
                <p
                  className={`text-sm font-extrabold font-mono tracking-tight group-hover:text-blue-600 ${
                    isLoggedIn ? 'text-slate-900' : 'text-slate-400 blur-[5px] select-none'
                  }`}
                >
                  {isLoggedIn ? item.phone : formatMaskedPhone(item.phone)}
                </p>
              </div>

              <button
                type="button"
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs ${
                  isCall
                    ? 'bg-[#1464F4] text-white group-hover:bg-blue-700'
                    : 'bg-emerald-600 text-white group-hover:bg-emerald-700'
                }`}
              >
                {isCall ? (
                  <>
                    <Phone className="w-3.5 h-3.5 fill-white" />
                    <span>Call</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-3.5 h-3.5 fill-white" />
                    <span>Chat</span>
                  </>
                )}
              </button>
            </div>
          ))}

          {activeItems.length === 0 && (
            <div className="p-6 text-center text-xs text-slate-500 font-medium">
              No contact numbers are available for this option.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
