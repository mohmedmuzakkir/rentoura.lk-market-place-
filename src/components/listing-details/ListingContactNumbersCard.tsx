import React from 'react';
import { Phone, MessageCircle, PhoneCall, User, Lock, ChevronRight } from 'lucide-react';
import { ListingContact, ListingContactPhoneItem } from '../../types/listingDetailsTypes';
import { buildOwnerWhatsAppUrl } from '../../utils/contactLinks';
import { AuthService } from '../../services/authService';

interface ListingContactNumbersCardProps {
  contact?: ListingContact;
  listingTitle?: string;
  themeColor?: string;
  onProtectedAction?: (action: { type: string; returnRoute: string; execute: () => void }) => void;
  currentPath?: string;
}

export const ListingContactNumbersCard: React.FC<ListingContactNumbersCardProps> = ({
  contact,
  listingTitle = 'Listing Inquiry',
  themeColor = '#1464F4',
  onProtectedAction,
  currentPath = typeof window !== 'undefined' ? window.location.pathname : '/'
}) => {
  if (!contact) return null;

  const currentUser = AuthService.getCurrentUser();
  const isLoggedIn = Boolean(currentUser);

  // Gather phone items
  let phones: ListingContactPhoneItem[] = [];
  if (Array.isArray(contact.phones) && contact.phones.length > 0) {
    phones = contact.phones.filter(p => p && p.phone && p.phone.trim());
  } else if (contact.phone && contact.phone.trim()) {
    phones = [{
      id: 'p-single-1',
      phone: contact.phone.trim(),
      label: 'Primary',
      isWhatsApp: Boolean(contact.whatsappNumber),
      isPrimary: true
    }];
  }

  if (phones.length === 0) return null;

  const handleProtectedAction = (actionType: 'call' | 'whatsapp' | 'contact', phoneNumber?: string) => {
    const doAction = () => {
      if (actionType === 'call' && phoneNumber) {
        window.location.href = `tel:${phoneNumber}`;
      } else if (actionType === 'whatsapp' && phoneNumber) {
        const url = buildOwnerWhatsAppUrl(phoneNumber, listingTitle);
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
      }
    };

    if (onProtectedAction) {
      onProtectedAction({ type: actionType, returnRoute: currentPath, execute: doAction });
    } else {
      if (isLoggedIn) {
        doAction();
      } else {
        window.location.href = `/login?returnUrl=${encodeURIComponent(currentPath)}`;
      }
    }
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
    <div className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-5 lg:p-6 shadow-xs space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl flex items-center justify-center text-white shadow-2xs shrink-0"
            style={{ backgroundColor: themeColor }}
          >
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Contact Numbers
            </h3>
            {contact.contactName && (
              <p className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-0.5">
                <User className="w-3 h-3 text-slate-400" />
                <span>{contact.contactName}</span>
              </p>
            )}
          </div>
        </div>
        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
          {phones.length} {phones.length === 1 ? 'Number' : 'Numbers'}
        </span>
      </div>

      {/* Guest Login Banner */}
      {!isLoggedIn && (
        <div
          onClick={() => handleProtectedAction('contact')}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/90 via-sky-50/40 to-indigo-50/80 border border-blue-200/80 hover:border-blue-300 transition-all flex items-center justify-between gap-3 cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
              style={{ backgroundColor: themeColor }}
            >
              <Lock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>Login to view contact details</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                  Protected
                </span>
              </p>
              <p className="text-[11px] font-medium text-slate-500 truncate">
                Please login first to reveal phone numbers & connect with owner
              </p>
            </div>
          </div>
          <div
            className="px-3.5 py-1.5 rounded-xl text-white font-extrabold text-xs shrink-0 group-hover:brightness-95 transition-all shadow-2xs flex items-center gap-1"
            style={{ backgroundColor: themeColor }}
          >
            <span>Login</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      )}

      {/* Phone List */}
      <div className="space-y-2.5">
        {phones.map((item, index) => {
          const labelName = item.label || (index === 0 ? 'Primary' : 'Contact');
          const isPrimary = index === 0 || item.isPrimary;
          const isWa = Boolean(item.isWhatsApp || (index === 0 && contact.whatsappNumber === item.phone));
          const displayPhone = isLoggedIn ? item.phone : formatMaskedPhone(item.phone);

          return (
            <div
              key={item.id || index}
              onClick={() => {
                if (!isLoggedIn) {
                  handleProtectedAction('contact', item.phone);
                }
              }}
              className={`p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 transition-all flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 group ${
                !isLoggedIn ? 'cursor-pointer hover:border-blue-300 hover:bg-blue-50/20' : 'hover:border-blue-200'
              }`}
            >
              {/* Left info: Label & Phone */}
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      isPrimary
                        ? 'bg-blue-100 text-blue-800 border border-blue-200/60'
                        : 'bg-slate-200/80 text-slate-700'
                    }`}
                  >
                    {labelName}
                  </span>
                  {isWa && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <MessageCircle className="w-2.5 h-2.5 fill-emerald-700" />
                      WhatsApp
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-0.5">
                  <p
                    className={`text-sm sm:text-base font-extrabold font-mono tracking-tight ${
                      isLoggedIn
                        ? 'text-slate-900'
                        : 'text-slate-400 blur-[5px] select-none'
                    }`}
                  >
                    {displayPhone}
                  </p>
                  {!isLoggedIn && (
                    <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 shrink-0">
                      Hidden
                    </span>
                  )}
                </div>
              </div>

              {/* Right Action buttons */}
              <div className="flex items-center gap-1.5 shrink-0 ml-auto sm:ml-0">
                {isWa && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProtectedAction('whatsapp', item.phone);
                    }}
                    title={`WhatsApp ${isLoggedIn ? item.phone : 'Owner'}`}
                    className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProtectedAction('call', item.phone);
                  }}
                  title={`Call ${isLoggedIn ? item.phone : 'Owner'}`}
                  className="px-3.5 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer"
                  style={{ backgroundColor: themeColor }}
                >
                  <Phone className="w-3.5 h-3.5 fill-white" />
                  <span>Call</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
