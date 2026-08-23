import React, { useState } from 'react';
import { X, Mail, KeyRound, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { AuthService, validateAndNormalizeEmail } from '../../services/authService';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onBackToLogin
}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');

    const emailVal = validateAndNormalizeEmail(email);
    if (!emailVal.isValid) {
      setEmailError(emailVal.error || 'Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await AuthService.sendPasswordReset(emailVal.normalized);
      setSuccess(true);
    } catch (err: any) {
      setEmailError(err.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#1464F4] flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Reset Password
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                We'll send password reset instructions
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

        {/* Modal Body */}
        <div className="py-5">
          {success ? (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Password Reset Email Sent
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                If an account exists with <span className="font-bold text-slate-800">{email}</span>, you will receive a reset link shortly. Please check your inbox and spam folder.
              </p>
              <button
                onClick={onBackToLogin}
                className="mt-4 w-full py-3 rounded-2xl bg-[#1464F4] text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:bg-blue-600 transition-colors tap-bounce"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your registered RENTOURA.LK email address below. We'll send you a password reset link.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    placeholder="Enter your email address"
                    autoComplete="email"
                    inputMode="email"
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-2xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      emailError 
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' 
                        : 'border-slate-200 focus:border-[#1464F4] focus:ring-[#1464F4]/20'
                    }`}
                  />
                </div>
                {emailError && (
                  <p className="mt-1.5 text-[11px] font-medium text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{emailError}</span>
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 tap-bounce"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-2xl bg-[#1464F4] hover:bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all tap-bounce disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Reset Link</span>
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
