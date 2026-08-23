import React from 'react';
import { X, ShieldCheck, FileText, Check } from 'lucide-react';

interface SystemTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemTermsModal: React.FC<SystemTermsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl z-10 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#1464F4] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Terms & Conditions Update
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Effective: August 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 tap-bounce"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-3 overflow-y-auto no-scrollbar text-xs text-slate-600 leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#1464F4]" />
              <span>Key Policy Highlights</span>
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11.5px]">
              <li>Enhanced safety protocols for vehicle and property inspections.</li>
              <li>Clear guidelines prohibiting advance payments before physical verification.</li>
              <li>Updated verification standards for service providers across Sri Lanka.</li>
            </ul>
          </div>

          <p>
            By continuing to use RENTOURA.LK, you acknowledge and agree to our updated User Agreement and Privacy Policy designed to protect both renters and owners.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#1464F4] text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:bg-blue-600 transition-colors tap-bounce"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
