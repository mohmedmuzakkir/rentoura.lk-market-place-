import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Globe, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  KeyRound, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { RentouraLogo } from '../components/RentouraLogo';
import { AuthService } from '../services/authService';
import { supabase } from '../lib/supabase';
import { validatePassword } from '../utils/passwordValidator';
import { AppRoute } from '../types';

interface ResetPasswordPageProps {
  onNavigate: (route: AppRoute) => void;
  selectedLanguage?: 'English' | 'Sinhala' | 'Tamil';
  onLanguageChange?: (lang: 'English' | 'Sinhala' | 'Tamil') => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({
  onNavigate,
  selectedLanguage = 'English',
  onLanguageChange
}) => {
  // Verification states
  const [isVerifyingLink, setIsVerifyingLink] = useState(true);
  const [linkVerified, setLinkVerified] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [associatedEmail, setAssociatedEmail] = useState('');

  // Form states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Submit states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  // Language dropdown
  const [currentLang, setCurrentLang] = useState<'English' | 'Sinhala' | 'Tamil'>(selectedLanguage);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  // Live password validation
  const passValidation = validatePassword(newPassword);
  const passwordsMatch = newPassword.length > 0 && confirmPassword.length > 0 && newPassword === confirmPassword;

  // On mount, parse URL and verify Supabase recovery session
  useEffect(() => {
    let isMounted = true;
    let fallbackTimer: NodeJS.Timeout | null = null;

    const verifyRecoverySession = async () => {
      setIsVerifyingLink(true);
      setVerifyError('');

      // 1. Check if URL contains error flags from Supabase (e.g. #error=unauthorized_client&error_description=...)
      const hash = window.location.hash || '';
      const search = window.location.search || '';
      const searchParams = new URLSearchParams(search);
      const hashParams = new URLSearchParams(hash.startsWith('#') ? hash.substring(1) : hash);

      const urlError = searchParams.get('error_description') || 
                       hashParams.get('error_description') || 
                       searchParams.get('error') || 
                       hashParams.get('error');

      if (urlError) {
        if (isMounted) {
          const decoded = decodeURIComponent(urlError.replace(/\+/g, ' '));
          setVerifyError(decoded || 'This password reset link is invalid or has expired.');
          setLinkVerified(false);
          setIsVerifyingLink(false);
        }
        return;
      }

      // 2. Check existing session directly
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          if (isMounted) {
            setAssociatedEmail(session.user?.email || '');
            setLinkVerified(true);
            setIsVerifyingLink(false);
          }
          return;
        }
      } catch (e) {
        // Fall through to subscription & timer check
      }

      // 3. Fallback timer if session initialization is delayed
      fallbackTimer = setTimeout(async () => {
        if (!isMounted) return;
        const { data: { session: finalSession } } = await supabase.auth.getSession();
        if (finalSession) {
          setAssociatedEmail(finalSession.user?.email || '');
          setLinkVerified(true);
        } else {
          setVerifyError('No password reset session detected or your link has expired. Please request a new password reset link.');
          setLinkVerified(false);
        }
        setIsVerifyingLink(false);
      }, 1200);
    };

    // Listen for PASSWORD_RECOVERY event from Supabase auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        if (isMounted) {
          if (fallbackTimer) clearTimeout(fallbackTimer);
          setAssociatedEmail(session?.user?.email || '');
          setLinkVerified(true);
          setIsVerifyingLink(false);
        }
      }
    });

    verifyRecoverySession();

    return () => {
      isMounted = false;
      if (fallbackTimer) clearTimeout(fallbackTimer);
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !linkVerified) return;

    setFormError('');

    if (!passValidation.isValid) {
      setFormError(passValidation.error || 'Please ensure your new password meets all security requirements.');
      return;
    }

    if (!confirmPassword) {
      setFormError('Please confirm your new password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError('Passwords do not match. Please ensure both passwords are identical.');
      return;
    }

    // Email prefix reuse check if email available
    if (associatedEmail && associatedEmail.includes('@')) {
      const emailPrefix = associatedEmail.split('@')[0].toLowerCase();
      if (emailPrefix.length >= 4 && newPassword.toLowerCase().includes(emailPrefix)) {
        setFormError('Password should not contain your email address for security reasons.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      await AuthService.updatePasswordFromRecoverySession(newPassword);
      // Clear password values from memory for safety
      setNewPassword('');
      setConfirmPassword('');
      setIsCompleted(true);
    } catch (err: any) {
      setFormError(err.message || 'Failed to update password. Please request a new reset link.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to mask email for display safety (e.g. m***@example.com)
  const maskEmail = (emailStr: string) => {
    if (!emailStr || !emailStr.includes('@')) return '';
    const [name, domain] = emailStr.split('@');
    if (name.length <= 2) return `${name}***@${domain}`;
    return `${name.substring(0, 1)}***${name.substring(name.length - 1)}@${domain}`;
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
      <div className="w-full max-w-2xl mx-auto px-4 py-6 flex-1 flex flex-col justify-center items-center z-10">
        {/* Top Hero Icon Illustration */}
        <div className="text-center mb-6 space-y-2">
          <div className="relative inline-block">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#1464F4] to-sky-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
              <KeyRound className="w-8 h-8" />
            </div>
            <Sparkles className="w-5 h-5 text-sky-400 absolute -top-1 -right-1 animate-pulse" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#041C43] font-heading tracking-tight mt-2">
            Reset Your <span className="text-[#1464F4]">Password</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
            Create a new strong password for your account
          </p>
        </div>

        {/* Progress Step Bar */}
        <div className="w-full max-w-md bg-white rounded-2xl p-3 shadow-sm border border-slate-100 mb-6 flex items-center justify-between text-center">
          {/* Step 1 */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 mt-1">
              Verify Link
            </span>
          </div>

          <div className={`h-0.5 flex-1 mx-2 transition-all ${isCompleted ? 'bg-emerald-500' : 'bg-[#1464F4]'}`} />

          {/* Step 2 */}
          <div className="flex-1 flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              isCompleted ? 'bg-emerald-500 text-white' : 'bg-[#1464F4] text-white ring-4 ring-blue-100'
            }`}>
              {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : '2'}
            </div>
            <span className={`text-[10px] font-bold mt-1 ${isCompleted ? 'text-emerald-600' : 'text-[#1464F4]'}`}>
              Reset Password
            </span>
          </div>

          <div className={`h-0.5 flex-1 mx-2 transition-all ${isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`} />

          {/* Step 3 */}
          <div className="flex-1 flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              isCompleted ? 'bg-[#1464F4] text-white ring-4 ring-blue-100' : 'bg-slate-100 text-slate-400'
            }`}>
              3
            </div>
            <span className={`text-[10px] font-bold mt-1 ${isCompleted ? 'text-[#1464F4]' : 'text-slate-400'}`}>
              Completed
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-100 relative">
          
          {/* STATE 1: VERIFYING LINK */}
          {isVerifyingLink && (
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 border-3 border-[#1464F4] border-t-transparent rounded-full animate-spin mx-auto" />
              <h3 className="text-sm font-bold text-[#041C43]">
                Verifying your reset link...
              </h3>
              <p className="text-xs text-slate-400">
                Please hold on while we validate your secure security token.
              </p>
            </div>
          )}

          {/* STATE 2: INVALID / EXPIRED LINK ERROR */}
          {!isVerifyingLink && !linkVerified && (
            <div className="py-4 text-center space-y-4 animate-in fade-in duration-200">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-base font-bold text-[#041C43]">
                  Invalid or Expired Link
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1 max-w-xs mx-auto">
                  {verifyError || 'This password reset link is invalid or has already expired. Please request a new link.'}
                </p>
              </div>

              <div className="pt-2 space-y-2.5">
                <button
                  type="button"
                  onClick={() => onNavigate('/forgot-password')}
                  className="w-full py-3 rounded-2xl bg-[#1464F4] hover:bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all tap-bounce"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Request a New Reset Link</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/login')}
                  className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all tap-bounce"
                >
                  <span>Back to Login</span>
                </button>
              </div>
            </div>
          )}

          {/* STATE 3: RESET SUCCESSFUL */}
          {!isVerifyingLink && linkVerified && isCompleted && (
            <div className="py-4 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-black text-[#041C43] font-heading">
                  Password Reset Successfully
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1 max-w-xs mx-auto">
                  Your password has been updated. You can now sign in with your new password.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-100 text-[11px] text-emerald-800 text-left flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Your account is protected. Use your new password the next time you log in to RENTOURA.LK.
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('/login')}
                  className="w-full py-3.5 rounded-2xl bg-[#1464F4] hover:bg-blue-600 active:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all tap-bounce"
                >
                  <span>Back to Login</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STATE 4: RESET PASSWORD FORM */}
          {!isVerifyingLink && linkVerified && !isCompleted && (
            <form onSubmit={handleSubmit} noValidate className="space-y-4 animate-in fade-in duration-200">
              {/* Informational Header Box */}
              <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-100 text-xs text-slate-700 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#1464F4] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#041C43]">
                    Almost there! Enter your new password
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {associatedEmail ? `Resetting password for ${maskEmail(associatedEmail)}` : "Make sure it's strong and secure."}
                  </p>
                </div>
              </div>

              {/* Form Error Message */}
              {formError && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* New Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (formError) setFormError('');
                    }}
                    placeholder="Enter your new password"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#1464F4] focus:ring-2 focus:ring-[#1464F4]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Bar */}
                {newPassword.length > 0 && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full flex-1 rounded-full ${
                        passValidation.strength === 'Weak' ? 'bg-rose-500' : passValidation.strength === 'Fair' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                      <div className={`h-full flex-1 rounded-full ${
                        passValidation.strength === 'Fair' || passValidation.strength === 'Good' || passValidation.strength === 'Strong' ? (passValidation.strength === 'Fair' ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-slate-200'
                      }`} />
                      <div className={`h-full flex-1 rounded-full ${
                        passValidation.strength === 'Good' || passValidation.strength === 'Strong' ? 'bg-emerald-500' : 'bg-slate-200'
                      }`} />
                      <div className={`h-full flex-1 rounded-full ${
                        passValidation.strength === 'Strong' ? 'bg-emerald-500' : 'bg-slate-200'
                      }`} />
                    </div>
                    <span className={`text-[10px] font-bold ${
                      passValidation.strength === 'Weak' ? 'text-rose-500' : passValidation.strength === 'Fair' ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      Password strength: {passValidation.strength}
                    </span>
                  </div>
                )}
              </div>

              {/* Password Requirements Panel */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                <p className="font-bold text-slate-700 text-[11px]">
                  Your password must include:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                  <div className={`flex items-center gap-1.5 ${passValidation.requirements.hasMinLength ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${passValidation.requirements.hasMinLength ? 'text-emerald-500' : 'text-slate-300'}`} />
                    <span>At least 8 characters</span>
                  </div>

                  <div className={`flex items-center gap-1.5 ${passValidation.requirements.hasUppercase ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${passValidation.requirements.hasUppercase ? 'text-emerald-500' : 'text-slate-300'}`} />
                    <span>One uppercase letter (A-Z)</span>
                  </div>

                  <div className={`flex items-center gap-1.5 ${passValidation.requirements.hasLowercase ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${passValidation.requirements.hasLowercase ? 'text-emerald-500' : 'text-slate-300'}`} />
                    <span>One lowercase letter (a-z)</span>
                  </div>

                  <div className={`flex items-center gap-1.5 ${passValidation.requirements.hasNumber ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${passValidation.requirements.hasNumber ? 'text-emerald-500' : 'text-slate-300'}`} />
                    <span>One number (0-9)</span>
                  </div>

                  <div className={`flex items-center gap-1.5 sm:col-span-2 ${passValidation.requirements.hasSpecialChar ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${passValidation.requirements.hasSpecialChar ? 'text-emerald-500' : 'text-slate-300'}`} />
                    <span>One special character (!@#$%^&*)</span>
                  </div>
                </div>
              </div>

              {/* Confirm New Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (formError) setFormError('');
                    }}
                    placeholder="Confirm your new password"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#1464F4] focus:ring-2 focus:ring-[#1464F4]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Match indicator */}
                {confirmPassword.length > 0 && (
                  <div className={`mt-1.5 p-2 rounded-xl text-[11px] font-bold flex items-center gap-1.5 ${
                    passwordsMatch ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'
                  }`}>
                    {passwordsMatch ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Passwords match</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !passValidation.isValid || !passwordsMatch}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#1464F4] hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all tap-bounce disabled:opacity-60 disabled:cursor-not-allowed mt-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Updating password...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Reset Password</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

        </div>

        {/* Back to Login link footer */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => onNavigate('/login')}
            className="text-xs font-bold text-[#1464F4] hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};
