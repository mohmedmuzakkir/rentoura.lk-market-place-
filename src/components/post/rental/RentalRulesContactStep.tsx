import React from 'react';
import { RentalRulesState, validateSriLankanPhone } from '../../../types/postFormTypes';
import { PhoneCall, MessageSquare, FileCheck, Shield, Truck, AlertCircle } from 'lucide-react';

interface RentalRulesContactStepProps {
  contactPreferences: {
    contactName?: string;
    showPhone: boolean;
    phone: string;
    showWhatsApp: boolean;
    whatsappNumber: string;
    allowDirectChat: boolean;
  };
  rules: RentalRulesState;
  errors: Record<string, string>;
  onChangeContact: (contact: any) => void;
  onChangeRules: (rules: RentalRulesState) => void;
  accentColor?: string;
}

export const RentalRulesContactStep: React.FC<RentalRulesContactStepProps> = ({
  contactPreferences,
  rules,
  errors,
  onChangeContact,
  onChangeRules,
  accentColor = '#1464F4'
}) => {
  const docOptions = [
    { id: 'nic', label: 'NIC / National Identity Card Copy' },
    { id: 'driving_license', label: 'Valid Sri Lankan / International Driving License' },
    { id: 'billing_proof', label: 'Utility Bill (Electricity/Water) for Address Verification' },
    { id: 'passport', label: 'Passport & Visa Copy (Foreign Tourists)' },
    { id: 'br_copy', label: 'Business Registration / Company Letterhead' }
  ];

  const handlePhoneChange = (val: string) => {
    const { formatted } = validateSriLankanPhone(val);
    onChangeContact({
      ...contactPreferences,
      phone: val,
      whatsappNumber: contactPreferences.showWhatsApp ? (contactPreferences.whatsappNumber || val) : contactPreferences.whatsappNumber
    });
  };

  const toggleDoc = (docId: string) => {
    const current = rules.requiredDocuments || [];
    const exists = current.includes(docId);
    const updated = exists ? current.filter(d => d !== docId) : [...current, docId];
    onChangeRules({ ...rules, requiredDocuments: updated });
  };

  return (
    <div className="space-y-5 text-left animate-in fade-in duration-200">
      {/* Header Info */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3">
        <PhoneCall className="w-5 h-5 text-[#1464F4] flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold text-slate-900">Step 6: Contact Information & Rental Rules</p>
          <p className="text-slate-600 mt-0.5 leading-relaxed">
            Provide valid Sri Lankan contact details for inquiries. Set any renter identity requirements and house or usage policies clearly.
          </p>
        </div>
      </div>

      {/* Owner Contact Information */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
          Owner Contact Details
        </h3>

        {/* Contact Person Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span>Contact Person / Business Name</span>
            <span className="text-[10px] text-slate-400 font-normal">e.g. Muzakkir Motors / Owner</span>
          </label>
          <input
            type="text"
            value={contactPreferences.contactName || ''}
            onChange={(e) => onChangeContact({ ...contactPreferences, contactName: e.target.value })}
            placeholder="e.g. Muzakkir M."
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs"
          />
        </div>

        {/* Phone Number Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span>Primary Phone Number</span>
              <span className="text-rose-500">*</span>
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Format: 07X XXX XXXX</span>
          </label>
          <input
            type="tel"
            value={contactPreferences.phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="077 123 4567"
            className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs ${
              errors.phone ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
            }`}
          />
          {errors.phone && (
            <p className="text-[10px] text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
            </p>
          )}
        </div>

        {/* Channels Toggles */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          {/* WhatsApp Direct Chat */}
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                WA
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Enable WhatsApp Direct Chat</p>
                <p className="text-[10px] text-slate-500">Renters can initiate instant WhatsApp conversation</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={contactPreferences.showWhatsApp}
              onChange={(e) => onChangeContact({ ...contactPreferences, showWhatsApp: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
            />
          </label>

          {/* In-App Direct Chat */}
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Allow Rentoura In-App Chat</p>
                <p className="text-[10px] text-slate-500">Receive secure messages in your Rentoura inbox</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={contactPreferences.allowDirectChat}
              onChange={(e) => onChangeContact({ ...contactPreferences, allowDirectChat: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
          </label>
        </div>
      </div>

      {/* Required Renter Verification ID Documents */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-[#1464F4]" />
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
            Required Documents from Renter
          </h3>
        </div>

        <p className="text-xs text-slate-500">
          Check the official identification documents renters must produce at handover:
        </p>

        <div className="space-y-2 pt-1">
          {docOptions.map((doc) => {
            const isChecked = (rules.requiredDocuments || []).includes(doc.id);
            return (
              <label
                key={doc.id}
                onClick={() => toggleDoc(doc.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isChecked
                    ? 'border-[#1464F4] bg-blue-50/60 ring-1 ring-blue-400'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className={`text-xs font-semibold ${isChecked ? 'text-[#1464F4]' : 'text-slate-800'}`}>
                  {doc.label}
                </span>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* Handover & Cancellation Policies */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#1464F4]" />
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
            Rental Rules & Policies
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Handover Mode */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">Handover / Delivery Method</label>
            <select
              value={rules.handoverMode || 'both'}
              onChange={(e) => onChangeRules({ ...rules, handoverMode: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs"
            >
              <option value="both">Both Pickup & Delivery Available</option>
              <option value="pickup">Self-Pickup at Owner Location Only</option>
              <option value="delivery">Owner Delivery to Hirer Only</option>
            </select>
          </div>

          {/* Cancellation Policy */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">Cancellation Policy</label>
            <select
              value={rules.cancellationPolicy || 'flexible'}
              onChange={(e) => onChangeRules({ ...rules, cancellationPolicy: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs"
            >
              <option value="flexible">Flexible: Free cancellation up to 24h before</option>
              <option value="moderate">Moderate: 50% refund up to 48h before</option>
              <option value="strict">Strict: Non-refundable deposit</option>
            </select>
          </div>
        </div>

        {/* Custom Rules */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span>Additional Rental Terms / House Rules</span>
            <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea
            value={rules.customRules || ''}
            onChange={(e) => onChangeRules({ ...rules, customRules: e.target.value })}
            rows={2}
            placeholder="e.g. Valid age 21+, No smoking inside, Return with full tank of petrol..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs"
          />
        </div>
      </div>
    </div>
  );
};
