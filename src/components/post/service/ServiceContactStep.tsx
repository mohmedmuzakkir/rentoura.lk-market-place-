import React from 'react';
import { Phone, MessageSquare, ShieldCheck, User, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ListingDraft, ContactPhoneItem } from '../../../types/postFormTypes';
import { PhoneContactManager } from '../PhoneContactManager';

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

  const handlePhonesChange = (newPhones: ContactPhoneItem[]) => {
    const primaryPhone = newPhones[0]?.phone || '';
    const primaryWa = newPhones.find(p => p.isWhatsApp)?.phone || '';
    updateContact({
      phones: newPhones,
      phone: primaryPhone,
      whatsappNumber: primaryWa,
      showPhone: newPhones.some(p => p.phone.trim().length > 0),
      showWhatsApp: newPhones.some(p => p.isWhatsApp && p.phone.trim().length > 0)
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn text-left">
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
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-semibold text-slate-800"
          />
        </div>

        {/* Phone Numbers Manager */}
        <PhoneContactManager
          phones={contact.phones || (contact.phone ? [{
            id: 'p-srv-1',
            phone: contact.phone,
            normalized: contact.phone,
            label: 'Primary',
            isWhatsApp: Boolean(contact.showWhatsApp),
            isPrimary: true
          }] : [])}
          onChangePhones={handlePhonesChange}
          accentColor={accentColor}
          error={errors.phone}
        />
      </div>

      {/* Privacy & Communication Settings */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Communication Preferences
        </label>

        {/* Allow RENTOURA Direct Chat */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <span className="text-xs font-bold text-slate-800 block">Enable RENTOURA Direct In-App Chat</span>
            <span className="text-[11px] text-slate-500 block">Receive instant messages from registered users on RENTOURA.LK</span>
          </div>
          <button
            type="button"
            onClick={() => updateContact({ allowDirectChat: !contact.allowDirectChat })}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
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
