import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  KeyRound, 
  ShieldCheck, 
  Globe, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  Lock, 
  Headphones, 
  Zap, 
  LockKeyhole,
  RotateCcw
} from 'lucide-react';
import { RentouraLogo } from '../components/RentouraLogo';
import { AuthService, validateAndNormalizeEmail } from '../services/authService';
import { AppRoute } from '../types';

interface ForgotPasswordPageProps {
  onNavigate: (route: AppRoute) => void;
  selectedLanguage?: 'English' | 'Sinhala' | 'Tamil';
  onLanguageChange?: (lang: 'English' | 'Sinhala' | 'Tamil') => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onNavigate,
  selectedLanguage = 'English',
  onLanguageChange
}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  // Resend Cooldown (45 seconds)
  const [resendCooldown, setResendCooldown] = useState(0);

  // Language state
  const [currentLang, setCurrentLang] = useState<'English' | 'Sinhala' | 'Tamil'>(selectedLanguage);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  // Cooldown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleEmailBlur = () => {
    if (!email.trim()) {
      setEmailError('Email address is required.');
      return;
    }
    const val = validateAndNormalizeEmail(email);
    if (!val.isValid) {
      setEmailError(val.error || 'Please enter a valid email address.');
    } else {
      setEmail(val.normalized);
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setEmailError('');

    const emailVal = validateAndNormalizeEmail(email);
    if (!emailVal.isValid) {
      setEmailError(emailVal.error || 'Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      await AuthService.sendPasswordReset(emailVal.normalized);
      setSubmittedEmail(emailVal.normalized);
      setIsSuccess(true);
      setResendCooldown(45);
    } catch (err: any) {
      setEmailError(err.message || 'Unable to send reset link. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await AuthService.sendPasswordReset(submittedEmail);
      setResendCooldown(45);
    } catch (err: any) {
      setEmailError(err.message || 'Failed to resend reset email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const languageLabels = {
    English: '🇱🇰 English',
    Sinhala: '🇱🇰 සිංහල',
    Tamil: '🇱🇰 தமிழ்'
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-x-hidden selection:bg-blue-100 selection:text-[#1464F4]">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="w-full max-w-5xl mx-auto px-4 pt-4 sm:pt-6 flex items-center justify-between z-10">
        <button
          type="button"
          onClick={() => onNavigate('/login')}
          className="w-10 h-10 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-100 text-slate-700 flex items-center justify-center shadow-sm transition-all tap-bounce"
          aria-label="Back to Login"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <RentouraLogo variant="header" theme="light" className="scale-90" />
        </div>

        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-slate-200/80 text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-sm transition-all tap-bounce"
          >
            <Globe className="w-4 h-4 text-[#1464F4]" />
            <span>{languageLabels[currentLang]}</span>
          </button>

          {showLangDropdown && (
            <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
              {(['English', 'Sinhala', 'Tamil'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    setCurrentLang(lang);
                    onLanguageChange?.(lang);
                    setShowLangDropdown(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between ${
                    currentLang === lang ? 'bg-blue-50 text-[#1464F4]' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{languageLabels[lang]}</span>
                  {currentLang === lang && <CheckCircle2 className="w-3.5 h-3.5 text-[#1464F4]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-3xl mx-auto px-4 py-6 flex-1 flex flex-col justify-center items-center z-10">
        {/* Top Hero Heading */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#1464F4] text-xs font-bold shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Account Recovery</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#041C43] font-heading tracking-tight">
            Forgot Your <span className="text-[#1464F4]">Password?</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
            No worries! Enter your email address and we'll send you a secure password reset link.
          </p>

          {/* Trust Pills */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
              ✓ Fast Link
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
              ✓ Secure Token
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200">
              ✓ Account Protected
            </span>
          </div>
        </div>

        {/* Progress Step Bar */}
        <div className="w-full max-w-md bg-white rounded-2xl p-3 shadow-sm border border-slate-100 mb-6 flex items-center justify-between text-center">
          {/* Step 1 */}
          <div className="flex-1 flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              isSuccess ? 'bg-emerald-500 text-white' : 'bg-[#1464F4] text-white ring-4 ring-blue-100'
            }`}>
              {isSuccess ? <CheckCircle2 className="w-4 h-4" /> : '1'}
            </div>
            <span className={`text-[10px] font-bold mt-1 ${isSuccess ? 'text-emerald-600' : 'text-[#1464F4]'}`}>
              {isSuccess ? 'Requested' : 'Request Link'}
            </span>
          </div>

          <div className={`h-0.5 flex-1 mx-2 transition-all ${isSuccess ? 'bg-emerald-500' : 'bg-slate-200'}`} />

          {/* Step 2 */}
          <div className="flex-1 flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              isSuccess ? 'bg-[#1464F4] text-white ring-4 ring-blue-100' : 'bg-slate-100 text-slate-400'
            }`}>
              2
            </div>
            <span className={`text-[10px] font-bold mt-1 ${isSuccess ? 'text-[#1464F4]' : 'text-slate-400'}`}>
              Check Email
            </span>
          </div>

          <div className="h-0.5 flex-1 mx-2 bg-slate-200" />

          {/* Step 3 */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-bold">
              3
            </div>
            <span className="text-[10px] font-bold text-slate-400 mt-1">
              Reset Password
            </span>
          </div>
        </div>

        {/* Main Card Container */}
        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-100 relative overflow-hidden">
          
          {isSuccess ? (
            /* SUCCESS CONFIRMATION STATE */
            <div className="text-center py-3 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-black text-[#041C43] font-heading">
                  Check Your Email
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1 max-w-xs mx-auto">
                  If an account exists for <span className="font-bold text-slate-900">{submittedEmail}</span>, we have sent a secure password reset link.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 text-[11px] text-slate-600 text-left space-y-1">
                <p className="font-bold text-[#1464F4] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Next Steps:
                </p>
                <p>1. Open your email inbox (and check spam folder).</p>
                <p>2. Click the secure reset link inside the email.</p>
                <p>3. Create your new password on RENTOURA.LK.</p>
              </div>

              {emailError && (
                <p className="text-xs text-rose-500 font-medium flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{emailError}</span>
                </p>
              )}

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || isSubmitting}
                  className="w-full py-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-all tap-bounce disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : resendCooldown > 0 ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                      <span>Resend link in {resendCooldown}s</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 text-[#1464F4]" />
                      <span>Resend Reset Link</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsSuccess(false);
                    setEmailError('');
                  }}
                  className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all tap-bounce"
                >
                  Change Email Address
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/login')}
                  className="w-full py-3 rounded-2xl bg-[#1464F4] hover:bg-blue-600 active:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all tap-bounce"
                >
                  <span>Back to Login</span>
                </button>
              </div>
            </div>
          ) : (
            /* FORGOT PASSWORD FORM */
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#1464F4] flex items-center justify-center shrink-0">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#041C43]">
                      Verify Account Email
                    </h2>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Enter registered email address
                    </p>
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/80 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Encrypted</span>
                </div>
              </div>

              {/* Email Address Field */}
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
                    onBlur={handleEmailBlur}
                    placeholder="Enter your registered email address"
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
                {emailError ? (
                  <p className="mt-1.5 text-[11px] font-medium text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{emailError}</span>
                  </p>
                ) : (
                  <p className="mt-1.5 text-[11px] text-slate-400 font-medium">
                    Enter the email address linked to your RENTOURA.LK account
                  </p>
                )}
              </div>

              {/* Helpful Info Box */}
              <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5 text-xs text-slate-600">
                <Lock className="w-4 h-4 text-[#1464F4] shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  We'll send a one-time secure link. Click the link in your email to reset your password safely.
                </p>
              </div>

              {/* Send Reset Link Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#1464F4] hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all tap-bounce disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending reset link...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Send Reset Link</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Back to Login Link */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => onNavigate('/login')}
                  className="text-xs font-bold text-[#1464F4] hover:underline flex items-center justify-center gap-1 mx-auto"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Login</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Optional Don't Have an Account Link */}
        <div className="mt-4 text-center">
          <span className="text-xs text-slate-500 font-medium">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('/register')}
              className="font-bold text-[#1464F4] hover:underline"
            >
              Create Account
            </button>
          </span>
        </div>

        {/* Bottom Support & Trust Badges */}
        <div className="w-full max-w-2xl mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1464F4] flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#041C43]">Need Help?</h4>
              <p className="text-[10px] text-slate-400">Still having trouble? We're here to help.</p>
              <button
                type="button"
                onClick={() => onNavigate('/help')}
                className="text-[10px] font-bold text-[#1464F4] hover:underline mt-0.5 inline-block"
              >
                Contact Support →
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#041C43]">Quick Recovery</h4>
              <p className="text-[10px] text-slate-400">Get back to your account in minutes.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <LockKeyhole className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#041C43]">Data Safe</h4>
              <p className="text-[10px] text-slate-400">We never share your personal data.</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-[11px] font-medium text-slate-400">
          💙 Your Account, Your Control 💙
        </div>
      </div>
    </div>
  );
};
