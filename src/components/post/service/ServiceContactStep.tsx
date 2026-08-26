import React from 'react';
import { Phone, MessageSquare, ShieldCheck, User, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ListingDraft, validateSriLankanPhone } from '../../../types/postFormTypes';

interface ServiceContactStepProps {
  draft: ListingDraft;
  onChange: (updated: Partial<ListingDraft>) => void;
  errors: Record<string, string>;
  accentColor: string;
}

export const ServiceContactStep: React.FC<ServiceContactStepProps> = ({
  draft,
  onChange,
  errors,
  accentColor = '#FF650A'
}) => {
  const contact = draft.contactPreferences || {
    contactName: '',
    showPhone: true,
    phone: '',
    showWhatsApp: false,
    whatsappNumber: '',
    allowDirectChat: true
  };

  const updateContact = (fields: Partial<typeof contact>) => {
    onChange({
      contactPreferences: {
        ...contact,
        ...fields
      }
    });
  };

  const phoneValidation = validateSriLankanPhone(contact.phone || '');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Intro Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Step 7 of 8</span>
        </div>
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Contact Details & Communication</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Specify how customers can reach you directly for bookings and job quotes.
        </p>
      </div>

      {/* Contact Name & Phone */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Contact Name */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            Contact Person Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={contact.contactName || ''}
            onChange={e => updateContact({ contactName: e.target.value })}
            placeholder="e.g. Sahan Perera"
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
        </div>

        {/* Primary Mobile Number */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Primary Sri Lankan Phone Number <span className="text-rose-500">*</span></span>
            {phoneValidation.isValid && (
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Valid LK Format ({phoneValidation.normalized})
              </span>
            )}
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={contact.phone || ''}
              onChange={e => updateContact({ phone: e.target.value })}
              placeholder="077 123 4567"
              className={`w-full pl-10 pr-4 py-2.5 text-xs font-bold bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all ${
                errors.phone || (contact.phone && !phoneValidation.isValid) ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              }`}
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
            </p>
          )}
        </div>

        {/* WhatsApp Number */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp Number
            </label>
            <label className="text-xs text-slate-600 flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={contact.whatsappNumber === contact.phone}
                onChange={e => {
                  if (e.target.checked) updateContact({ whatsappNumber: contact.phone });
                }}
                className="rounded text-amber-500 focus:ring-amber-500"
              />
              Same as phone
            </label>
          </div>

          <input
            type="text"
            value={contact.whatsappNumber || ''}
            onChange={e => updateContact({ whatsappNumber: e.target.value })}
            placeholder="077 123 4567"
            className="w-full px-3.5 py-2.5 text-xs font-bold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
        </div>
      </div>

      {/* Privacy & Communication Settings */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Communication Preferences
        </label>

        {/* Show Phone Publicly */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <span className="text-xs font-bold text-slate-800 block">Show Phone Number Publicly</span>
            <span className="text-[11px] text-slate-500 block">Allow customers to call your phone directly from the listing page</span>
          </div>
          <button
            type="button"
            onClick={() => updateContact({ showPhone: !contact.showPhone })}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              contact.showPhone ? 'bg-amber-500' : 'bg-slate-300'
            }`}
          >
            <span
              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-xs ${
                contact.showPhone ? 'left-5.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {/* Allow RENTOURA Direct Chat */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <span className="text-xs font-bold text-slate-800 block">Enable RENTOURA Direct In-App Chat</span>
            <span className="text-[11px] text-slate-500 block">Receive instant messages from registered users on RENTOURA.LK</span>
          </div>
          <button
            type="button"
            onClick={() => updateContact({ allowDirectChat: !contact.allowDirectChat })}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              contact.allowDirectChat ? 'bg-amber-500' : 'bg-slate-300'
            }`}
          >
            <span
              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-xs ${
                contact.allowDirectChat ? 'left-5.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
