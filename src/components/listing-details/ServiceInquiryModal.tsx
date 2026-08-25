import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Wrench, Send, User, Phone, Mail, Calendar, MessageSquare } from 'lucide-react';
import { ServiceListingDetail } from '../../types/listingDetailsTypes';
import { ServiceInquiryService } from '../../services/serviceInquiryService';
import { supabase } from '../../lib/supabase';

interface ServiceInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceListingDetail;
  onSuccess?: () => void;
  onNavigateLogin?: () => void;
}

export const ServiceInquiryModal: React.FC<ServiceInquiryModalProps> = ({
  isOpen,
  onClose,
  service,
  onSuccess,
  onNavigateLogin
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [inquiryDetails, setInquiryDetails] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setIsSuccess(false);

      // Prefill user data if authenticated
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
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !inquiryDetails.trim()) {
      setErrorMsg('Please fill in your name, phone number, and inquiry details.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await ServiceInquiryService.submitInquiry({
      serviceId: service.id,
      serviceTitle: service.title,
      providerName: service.provider?.name || 'Service Provider',
      senderName: name.trim(),
      senderPhone: phone.trim(),
      senderEmail: email.trim(),
      preferredDate,
      inquiryDetails: inquiryDetails.trim()
    });

    setIsSubmitting(false);

    if (res.success) {
      setIsSuccess(true);
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
        setErrorMsg(res.error || 'Failed to send inquiry.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-orange-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF650A]/10 text-[#FF650A] flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                Request Service / Quote
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {service.title} • {service.provider?.name}
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
          {isSuccess ? (
            <div className="p-6 text-center space-y-3 animate-fadeIn">
              <div className="w-14 h-14 bg-orange-50 text-[#FF650A] rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-xl">Inquiry Sent!</h4>
              <p className="text-xs text-slate-500">
                Your service inquiry has been delivered to {service.provider?.name}. Opening chat...
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

              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Your Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF650A] focus:bg-white transition-all"
                />
              </div>

              {/* Phone & Date Row */}
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
                    placeholder="077 123 4567"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF650A] focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={e => setPreferredDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF650A] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Service Details */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  Service Requirements / Details <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={inquiryDetails}
                  onChange={e => setInquiryDetails(e.target.value)}
                  placeholder="Describe what you need, your location, or any specific requirements..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF650A] focus:bg-white transition-all resize-none"
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
                  className="flex-1 py-3 bg-[#FF650A] text-white text-xs font-extrabold rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Inquiry
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
