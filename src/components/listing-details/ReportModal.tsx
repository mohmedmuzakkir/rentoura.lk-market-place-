import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Flag, MessageCircle, X } from 'lucide-react';
import { RENTOURA_SUPPORT_WHATSAPP_URL } from '../../config/contact';
import { AuthService } from '../../services/authService';
import { ReportService } from '../../services/reportService';
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
  { code: 'scam', label: 'Suspected scam, fraud, or fake listing' },
  { code: 'incorrect_info', label: 'Incorrect or misleading information' },
  { code: 'advance_fee', label: 'Suspicious payment or advance fee request' },
  { code: 'spam', label: 'Duplicate or spam listing' },
  { code: 'unavailable', label: 'Unavailable item, job, or service' },
  { code: 'prohibited', label: 'Prohibited or unsafe content' },
  { code: 'abusive', label: 'Abusive content or behavior' },
  { code: 'wrong_category', label: 'Wrong category' },
  { code: 'other', label: 'Other policy violation' }
];

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, listingId, listingTitle, module, onOpenFullReportPage }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');
  const [allowContact, setAllowContact] = useState(false);
  const [contactInfo, setContactInfo] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (!selectedReason) return setError('Please select a reason for reporting this listing.');
    if (selectedReason === 'other' && !details.trim()) return setError('Please provide details for an “Other” report.');

    setIsSubmitting(true);
    const user = AuthService.getCurrentUser();
    const reason = REPORT_REASONS.find(item => item.code === selectedReason);
    const result = await ReportService.submitReport({
      reporterId: user?.id || 'guest-reporter', reporterName: user?.email || 'Guest Reporter', reporterEmail: user?.email,
      targetType: 'listing', targetId: listingId, targetModule: module, targetTitle: listingTitle,
      reasonCode: selectedReason, reasonLabel: reason?.label || 'Reported issue', description: details.trim(),
      allowContact, contactInfo: allowContact ? contactInfo.trim() : '', source: 'listing_detail'
    });
    setIsSubmitting(false);
    if (result.success) setSubmitted(true);
    else setError(result.error || 'The report could not be submitted. Please try again.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex min-w-0 items-center gap-2"><Flag className="h-5 w-5 text-rose-600" /><div className="min-w-0"><h3 className="text-sm font-bold">Report Listing</h3><p className="truncate text-[11px] text-slate-400">{listingTitle}</p></div></div>
          <button type="button" onClick={onClose} className="p-1.5 text-slate-400"><X className="h-5 w-5" /></button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center p-8 text-center"><CheckCircle className="mb-3 h-12 w-12 text-emerald-600" /><h4 className="font-bold">Report Submitted</h4><p className="mt-1 text-xs text-slate-500">Your structured report was saved for moderation review.</p><button type="button" onClick={onClose} className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white">Close</button></div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 p-5">
            <div className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 p-3 text-[11px] text-amber-800"><AlertTriangle className="h-4 w-4 shrink-0" /><span>Select the issue that best describes this listing.</span>{onOpenFullReportPage && <button type="button" onClick={() => { onClose(); onOpenFullReportPage(); }} className="shrink-0 font-bold text-blue-600 underline">Full form</button>}</div>
            <fieldset className="space-y-1.5"><legend className="mb-1 text-xs font-bold">Reason for reporting</legend>{REPORT_REASONS.map(reason => <label key={reason.code} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-2 text-xs ${selectedReason === reason.code ? 'border-rose-300 bg-rose-50' : 'border-slate-100 bg-slate-50'}`}><input type="radio" name="reportReason" checked={selectedReason === reason.code} onChange={() => setSelectedReason(reason.code)} /><span>{reason.label}</span></label>)}</fieldset>
            <label className="block space-y-1 text-xs font-bold"><span>Detailed description {selectedReason === 'other' ? '(required)' : '(optional)'}</span><textarea value={details} onChange={event => setDetails(event.target.value)} maxLength={500} rows={3} className="w-full resize-none rounded-xl border border-slate-200 p-3 text-xs font-normal" /></label>
            <label className="flex gap-2 text-xs text-slate-700"><input type="checkbox" checked={allowContact} onChange={event => setAllowContact(event.target.checked)} /><span>Allow RENTOURA support to contact me.</span></label>
            {allowContact && <input value={contactInfo} onChange={event => setContactInfo(event.target.value)} placeholder="Optional email or phone" className="w-full rounded-xl border border-slate-200 p-3 text-xs" />}
            {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">{error}</div>}
            <a href={RENTOURA_SUPPORT_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-700"><MessageCircle className="h-4 w-4" />Need help via WhatsApp?</a>
            <div className="flex gap-2"><button type="button" onClick={onClose} disabled={isSubmitting} className="flex-1 rounded-xl border py-2.5 text-xs font-bold">Cancel</button><button type="submit" disabled={isSubmitting} className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white disabled:opacity-60">{isSubmitting ? 'Submitting…' : 'Submit Report'}</button></div>
          </form>
        )}
      </div>
    </div>
  );
};
