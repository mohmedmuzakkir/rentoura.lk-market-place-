import React from 'react';
import { Phone, Plus, Trash2, ArrowUp, ArrowDown, AlertCircle, CheckCircle2, MessageSquare } from 'lucide-react';
import { ContactPhoneItem, validateSriLankanPhone } from '../../types/postFormTypes';

export interface PhoneContactManagerProps {
  phones: ContactPhoneItem[];
  onChangePhones: (phones: ContactPhoneItem[]) => void;
  accentColor?: string;
  error?: string;
}

const PHONE_LABEL_OPTIONS = [
  'Primary',
  'Office',
  'Home',
  'Personal',
  'Sales',
  'Manager',
  'Work',
  'Other'
];

export const PhoneContactManager: React.FC<PhoneContactManagerProps> = ({
  phones,
  onChangePhones,
  accentColor = '#1464F4',
  error
}) => {
  // Guarantee at least 1 phone item exists
  const currentPhones = React.useMemo(() => {
    if (!phones || phones.length === 0) {
      return [{
        id: 'p-default-1',
        phone: '',
        normalized: '',
        label: 'Primary',
        isWhatsApp: true,
        isPrimary: true
      }];
    }
    return phones.map((p, idx) => ({
      ...p,
      id: p.id || `p-${idx + 1}`,
      label: idx === 0 ? 'Primary' : (p.label || 'Personal'),
      isPrimary: idx === 0
    }));
  }, [phones]);

  const updatePhoneItem = (index: number, updates: Partial<ContactPhoneItem>) => {
    const updated = [...currentPhones];
    const item = { ...updated[index], ...updates };

    if (updates.phone !== undefined) {
      const valRes = validateSriLankanPhone(updates.phone);
      item.normalized = valRes.isValid ? valRes.normalized : updates.phone.replace(/[^\d+]/g, '');
    }

    updated[index] = item;
    
    // Ensure primary item is flagged properly
    updated[0] = { ...updated[0], isPrimary: true, label: 'Primary' };
    onChangePhones(updated);
  };

  const handleAddPhone = () => {
    if (currentPhones.length >= 3) return;
    const newId = `p-${Date.now()}`;
    const newPhone: ContactPhoneItem = {
      id: newId,
      phone: '',
      normalized: '',
      label: 'Personal',
      isWhatsApp: true,
      isPrimary: false
    };
    const updated = [...currentPhones, newPhone];
    updated[0] = { ...updated[0], isPrimary: true, label: 'Primary' };
    onChangePhones(updated);
  };

  const handleRemovePhone = (index: number) => {
    if (currentPhones.length <= 1) return;
    const updated = currentPhones.filter((_, i) => i !== index);
    // Automatically promote top item to Primary
    updated[0] = { ...updated[0], isPrimary: true, label: 'Primary' };
    onChangePhones(updated);
  };

  const handleMovePhone = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= currentPhones.length) return;

    const updated = [...currentPhones];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    // Ensure first item is always Primary
    updated[0] = { ...updated[0], isPrimary: true, label: 'Primary' };
    onChangePhones(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
          <Phone className="w-3.5 h-3.5 text-blue-600" />
          <span>Phone Numbers (Up to 3)</span>
          <span className="text-rose-500">*</span>
        </label>
        <span className="text-[11px] font-semibold text-slate-500">
          {currentPhones.length} / 3 added
        </span>
      </div>

      {error && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-3">
        {currentPhones.map((phoneItem, index) => {
          const valRes = validateSriLankanPhone(phoneItem.phone);
          
          // Check duplicate against other phone entries
          const isDuplicate = phoneItem.phone.trim().length > 0 && currentPhones.some((p, i) => {
            if (i === index) return false;
            const otherNorm = validateSriLankanPhone(p.phone).normalized;
            return valRes.isValid && otherNorm && otherNorm === valRes.normalized;
          });

          return (
            <div
              key={phoneItem.id || index}
              className={`p-3.5 rounded-2xl border transition-all space-y-3 bg-white ${
                isDuplicate
                  ? 'border-rose-300 ring-2 ring-rose-200/60 bg-rose-50/20'
                  : (!valRes.isValid && phoneItem.phone)
                  ? 'border-amber-300 bg-amber-50/20'
                  : 'border-slate-200 shadow-2xs hover:border-slate-300'
              }`}
            >
              {/* Header bar of phone entry */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    index === 0
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    #{index + 1} {index === 0 ? 'Primary' : phoneItem.label}
                  </span>
                  {valRes.isValid && !isDuplicate && (
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Valid LK Format
                    </span>
                  )}
                </div>

                {/* Actions: Reorder & Delete */}
                <div className="flex items-center gap-1">
                  {currentPhones.length > 1 && (
                    <>
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMovePhone(index, 'up')}
                        title="Move Up"
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === currentPhones.length - 1}
                        onClick={() => handleMovePhone(index, 'down')}
                        title="Move Down"
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemovePhone(index)}
                        title="Remove phone number"
                        className="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Form Row: Label + Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Label dropdown */}
                <div className="sm:col-span-1">
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Label
                  </label>
                  <select
                    value={index === 0 ? 'Primary' : phoneItem.label}
                    disabled={index === 0}
                    onChange={(e) => updatePhoneItem(index, { label: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {index === 0 ? (
                      <option value="Primary">Primary</option>
                    ) : (
                      PHONE_LABEL_OPTIONS.filter(opt => opt !== 'Primary').map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Phone Input */}
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={phoneItem.phone}
                      onChange={(e) => updatePhoneItem(index, { phone: e.target.value })}
                      placeholder="077 123 4567"
                      className={`w-full pl-9 pr-3.5 py-2 text-xs font-bold text-slate-900 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDuplicate || (phoneItem.phone && !valRes.isValid)
                          ? 'border-rose-300 ring-1 ring-rose-300'
                          : 'border-slate-200'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Validation / Duplicate Error */}
              {isDuplicate && (
                <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  This phone number has already been added.
                </p>
              )}
              {!isDuplicate && phoneItem.phone && !valRes.isValid && (
                <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {valRes.error || 'Please enter a valid Sri Lankan phone number'}
                </p>
              )}

              {/* Row 2: WhatsApp Toggle */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={phoneItem.isWhatsApp}
                    onChange={(e) => updatePhoneItem(index, { isWhatsApp: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-800">
                      Available on WhatsApp
                    </span>
                  </div>
                </label>
                {phoneItem.isWhatsApp && (
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    WhatsApp Direct
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Button */}
      {currentPhones.length < 3 && (
        <button
          type="button"
          onClick={handleAddPhone}
          className="w-full py-2.5 px-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-blue-600 font-bold text-xs flex items-center justify-center gap-2 transition-all tap-bounce cursor-pointer mt-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add another phone number</span>
        </button>
      )}
    </div>
  );
};
