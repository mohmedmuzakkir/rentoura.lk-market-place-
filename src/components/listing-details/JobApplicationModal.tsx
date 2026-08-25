import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Briefcase, Send, User, Phone, Mail, FileText, Ban } from 'lucide-react';
import { JobListingDetail } from '../../types/listingDetailsTypes';
import { JobApplicationService, ApplicationStatusResult } from '../../services/jobApplicationService';
import { supabase } from '../../lib/supabase';

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobListingDetail;
  onSuccess?: () => void;
  onNavigateLogin?: () => void;
}

export const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  isOpen,
  onClose,
  job,
  onSuccess,
  onNavigateLogin
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [coverNote, setCoverNote] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [appStatus, setAppStatus] = useState<ApplicationStatusResult>({ applied: false });

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setIsSuccess(false);
      setIsCheckingStatus(true);

      // 1. Check status from Supabase backend
      JobApplicationService.getApplicationStatus(job.id).then((res) => {
        setAppStatus(res);
        setIsCheckingStatus(false);
      });

      // 2. Prefill user profile if authenticated
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          setEmail(data.user.email || '');
          supabase.from('profiles').select('*').eq('id', data.user.id).single().then(({ data: prof }) => {
            if (prof) {
              if (prof.full_name) setName(prof.full_name);
              if (prof.phone_normalized) setPhone(prof.phone_normalized);
            }
          });
        }
      });
    }
  }, [isOpen, job.id]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setErrorMsg('Please fill in all required fields (Name, Phone, Email).');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await JobApplicationService.submitApplication({
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.company?.name || 'Employer',
      applicantName: name.trim(),
      applicantPhone: phone.trim(),
      applicantEmail: email.trim(),
      coverNote: coverNote.trim()
    });

    setIsSubmitting(false);

    if (res.success) {
      setIsSuccess(true);
      setAppStatus({ applied: true, status: 'submitted', isOwner: false });
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 1800);
    } else {
      if (res.error?.includes('sign in')) {
        setErrorMsg(res.error);
        if (onNavigateLogin) {
          setTimeout(onNavigateLogin, 1500);
        }
      } else {
        setErrorMsg(res.error || 'Failed to submit application.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                Apply for {job.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {job.company?.name} • {job.location.city}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {isCheckingStatus ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-[#08A34F] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-medium">Checking application status...</p>
            </div>
          ) : appStatus.isOwner ? (
            <div className="p-6 text-center space-y-3">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
                <Ban className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-900 text-lg">Your Own Job Listing</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                You are registered as the creator/owner of this job opportunity and cannot submit an application to yourself.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          ) : appStatus.applied ? (
            <div className="p-6 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-900 text-lg">Application Submitted</h4>
              {appStatus.status && (
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-[#08A34F] text-xs font-extrabold uppercase tracking-wider">
                  Status: {appStatus.status}
                </div>
              )}
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Your application for this job opportunity is registered on RENTOURA.LK. The employer will review your profile.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          ) : isSuccess ? (
            <div className="p-6 text-center space-y-3 animate-fadeIn">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-xl">Application Sent!</h4>
              <p className="text-xs text-slate-500">
                Your application details have been submitted to {job.company?.name}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  {errorMsg}
                </div>
              )}

              {/* Name Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your full legal name"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                />
              </div>

              {/* Phone & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. 077 123 4567"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Cover Note */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Cover Note / Experience Summary
                </label>
                <textarea
                  rows={3}
                  value={coverNote}
                  onChange={e => setCoverNote(e.target.value)}
                  placeholder="Briefly state your qualifications or why you are a great fit for this job..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#08A34F] text-white text-xs font-extrabold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
