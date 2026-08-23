import React from 'react';
import { X, Flag, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ReportResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId?: string;
}

export const ReportResolutionModal: React.FC<ReportResolutionModalProps> = ({
  isOpen,
  onClose,
  reportId = 'REP-884'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl z-10 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Report Status Update
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Reference ID: {reportId}
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
        <div className="py-4 space-y-3.5 overflow-y-auto no-scrollbar">
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-emerald-900">
                Action Taken by Trust & Safety Team
              </h4>
              <p className="text-[11.5px] text-emerald-800 leading-relaxed mt-0.5">
                Thank you for helping keep RENTOURA.LK safe. Our moderation team has reviewed your report and taken appropriate corrective enforcement action.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              Community Safety Notice
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              RENTOURA.LK enforces strict community guidelines against misleading pricing, impersonation, and fraudulent listings. To protect user privacy, individual disciplinary records are kept confidential.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#1464F4] text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:bg-blue-600 transition-colors tap-bounce"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
