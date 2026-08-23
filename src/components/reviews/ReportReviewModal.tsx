import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { CanonicalReview } from '../../types/reviewTypes';
import { ReportService } from '../../services/reportService';
import { AuthService } from '../../services/authService';

interface ReportReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewToReport: CanonicalReview | null;
}

const REVIEW_REPORT_REASONS = [
  { id: 'spam', label: 'Spam or Advertising', desc: 'Promotional content, repeated text, or commercial links.' },
  { id: 'harassment', label: 'Harassment or Abuse', desc: 'Personal attacks, hateful language, or threats.' },
  { id: 'false_review', label: 'False or Misleading Review', desc: 'Fake experience, conflict of interest, or extortion.' },
  { id: 'inappropriate_content', label: 'Inappropriate Content', desc: 'Offensive language or inappropriate media.' },
  { id: 'privacy', label: 'Personal Information Exposure', desc: 'Exposes private phone, address, or identity details.' },
  { id: 'other', label: 'Other Policy Violation', desc: 'Violates general community guidelines.' }
];

export const ReportReviewModal: React.FC<ReportReviewModalProps> = ({
  isOpen,
  onClose,
  reviewToReport
}) => {
  const currentUser = AuthService.getCurrentUser();
  const [selectedReason, setSelectedReason] = useState<string>('spam');
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !reviewToReport) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    const activeReason = REVIEW_REPORT_REASONS.find(r => r.id === selectedReason);

    setTimeout(() => {
      const result = ReportService.submitReport({
        reporterId: currentUser ? currentUser.id : 'guest-reporter',
        targetId: reviewToReport.id,
        targetModule: reviewToReport.targetModule,
        targetTitle: `Review on "${reviewToReport.targetTitle}" by ${reviewToReport.authorName}`,
        targetLocation: reviewToReport.locationName,
        reasonCode: selectedReason,
        reasonLabel: activeReason ? activeReason.label : 'Reported Review',
        description: description.trim(),
        allowContact: true
      });

      setIsSubmitting(false);

      if (result.success) {
        setIsSubmitted(true);
      } else {
        setErrorMsg(result.error || 'Unable to submit report.');
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-rose-50/40">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h3 className="text-sm font-bold text-[#041C43]">
              Report Review
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#041C43]">
              Report Queued for Moderation
            </h4>
            <p className="text-xs text-slate-500">
              Thank you for helping keep RENTOURA.LK safe. Our team will review this review.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-[#1464F4] text-white font-bold text-xs rounded-2xl shadow-md"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 text-[11px] text-amber-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Report review written by <strong>{reviewToReport.authorName}</strong> for "{reviewToReport.targetTitle}".
              </span>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-rose-800 text-xs">
                {errorMsg}
              </div>
            )}

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
              {REVIEW_REPORT_REASONS.map((reason) => (
                <button
                  key={reason.id}
                  type="button"
                  onClick={() => setSelectedReason(reason.id)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all text-xs flex items-start justify-between gap-2 ${
                    selectedReason === reason.id
                      ? 'bg-blue-50/80 border-[#1464F4] font-semibold text-[#041C43]'
                      : 'bg-slate-50/60 border-slate-200/80 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-bold">{reason.label}</div>
                    <div className="text-[10px] text-slate-500">{reason.desc}</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    selectedReason === reason.id ? 'border-[#1464F4] bg-[#1464F4]' : 'border-slate-300'
                  }`}>
                    {selectedReason === reason.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional details (optional)..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 resize-none focus:outline-none focus:border-[#1464F4]"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-[#1464F4] hover:bg-blue-600 text-white font-bold text-xs shadow-md disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting Report...' : 'Submit Report'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
