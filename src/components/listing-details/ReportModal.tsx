import React, { useState } from 'react';
import { X, Flag, CheckCircle, AlertTriangle } from 'lucide-react';
import { ListingModule } from '../../types/listingDetailsTypes';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
  module: ListingModule;
  onOpenFullReportPage?: () => void;
}

const REPORT_REASONS = [
  'Scam / Fraud / Fake Listing',
  'Incorrect or Misleading Information',
  'Suspicious Payment or Advance Fee Request',
  'Duplicate or Spam Listing',
  'Item / Job / Service Not Available',
  'Prohibited or Illegal Content',
  'Harassment / Abusive Behavior',
  'Other Policy Violation'
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  listingId,
  listingTitle,
  module,
  onOpenFullReportPage
}) => {
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Flag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Report Listing</h3>
              <p className="text-[11px] text-slate-400 truncate max-w-[240px]">
                {listingTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content / Form */}
        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-base text-slate-900 mb-1">
              Report Submitted
            </h4>
            <p className="text-xs text-slate-500 max-w-xs">
              Thank you for keeping RENTOURA.LK safe. Our trust and safety team will investigate this listing promptly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="flex items-start justify-between gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100 text-[11px] text-amber-800">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>
                  Please help us identify what is wrong with this listing. Reports are reviewed by moderation staff.
                </span>
              </div>
              {onOpenFullReportPage && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenFullReportPage();
                  }}
                  className="text-[10px] font-bold text-[#1464F4] underline shrink-0 whitespace-nowrap"
                >
                  Full Form ↗
                </button>
              )}
            </div>

            {/* Reason selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Reason for Reporting
              </label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {REPORT_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                      selectedReason === reason
                        ? 'border-rose-300 bg-rose-50/50 text-rose-900 font-semibold'
                        : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                      className="accent-rose-600 w-3.5 h-3.5"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional details */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">
                Additional Details (Optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe why you believe this listing violates RENTOURA policies..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all tap-bounce"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
