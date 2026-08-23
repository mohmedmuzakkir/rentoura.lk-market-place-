import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus, 
  ChevronRight, 
  Home, 
  Briefcase, 
  Handshake, 
  Globe, 
  AlertCircle,
  CheckCircle2,
  Heart
} from 'lucide-react';
import { RentouraLogo } from '../components/RentouraLogo';
import { AuthService, validateAndNormalizeEmail } from '../services/authService';
import { AppRoute } from '../types';
import { getDashboardRouteForRole, isActiveAccount } from '../utils/roleUtils';

interface LoginPageProps {
  onNavigate: (route: AppRoute) => void;
  returnUrl?: AppRoute;
  selectedLanguage?: 'English' | 'Sinhala' | 'Tamil';
  onLanguageChange?: (lang: 'English' | 'Sinhala' | 'Tamil') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigate,
  returnUrl,
  selectedLanguage = 'English',
  onLanguageChange
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [currentLang, setCurrentLang] = useState<'English' | 'Sinhala' | 'Tamil'>(selectedLanguage);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  // Validation & Loading States
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Check if already authenticated and redirect to staff dashboard or returnUrl
  useEffect(() => {
    let isMounted = true;
    const user = AuthService.getCurrentUser();
    if (user) {
      AuthService.fetchUserProfile(user.id).then((profile) => {
        if (!isMounted) return;
        if (profile) {
          const dest = getDashboardRouteForRole(profile.role, profile.accountStatus);
          if (dest !== '/') {
            onNavigate(dest);
          } else {
            onNavigate(returnUrl || '/');
          }
        } else {
          onNavigate('/');
        }
      });
    }
    return () => { isMounted = false; };
  }, [onNavigate, returnUrl]);

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
    setGeneralError('');
    setSuccessMsg('');

    // Reset error states
    let hasError = false;

    // Validate email
    const emailVal = validateAndNormalizeEmail(email);
    if (!emailVal.isValid) {
      setEmailError(emailVal.error || 'Please enter a valid email address.');
      hasError = true;
    } else {
      setEmailError('');
      setEmail(emailVal.normalized);
    }

    // Validate password
    if (!password) {
      setPasswordError('Please enter your password.');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (hasError) return;

    setIsSubmitting(true);

    try {
      const { profile } = await AuthService.login(email, password, rememberMe);

      if (!isActiveAccount(profile.accountStatus)) {
        setGeneralError('Your account is currently inactive or suspended. Please contact platform support.');
        return;
      }

      const destRoute = getDashboardRouteForRole(profile.role, profile.accountStatus);

      setSuccessMsg(`Welcome back, ${profile.fullName}! Redirecting...`);

      if (destRoute !== '/') {
        onNavigate(destRoute);
      } else {
        onNavigate(returnUrl || '/');
      }
    } catch (err: any) {
      setGeneralError(err.message || 'Login failed. Please check your credentials and try again.');
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between relative overflow-x-hidden selection:bg-blue-100 selection:text-[#1464F4]">
      {/* Background Decorative Gradient Elements */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-blue-600/10 via-sky-400/5 to-transparent pointer-events-none" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-2 flex items-center justify-between">
        <button
          onClick={() => onNavigate(returnUrl || '/')}
          className="w-10 h-10 rounded-2xl bg-white/80 backdrop-blur-md shadow-sm border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all tap-bounce"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Center Logo */}
        <div className="scale-90 sm:scale-100">
          <RentouraLogo variant="header" theme="light" />
        </div>

        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm text-xs font-bold text-slate-700 hover:border-slate-300 transition-all tap-bounce"
          >
            <Globe className="w-3.5 h-3.5 text-[#1464F4]" />
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
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-md w-full mx-auto px-4 py-4 sm:py-6 flex flex-col justify-center">
        {/* Welcome Hero Heading */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-[#041C43] tracking-tight font-heading">
            Welcome Back!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Login to your Rentoura.lk account
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-[#1464F4] to-cyan-400 rounded-full mx-auto mt-2.5" />
        </div>

        {/* Login Card Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100/80 backdrop-blur-xl">
          {generalError && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <div className="flex-1">{generalError}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <div>{successMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
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

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  className={`w-full pl-10 pr-10 py-3 bg-slate-50 border rounded-2xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    passwordError 
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' 
                      : 'border-slate-200 focus:border-[#1464F4] focus:ring-[#1464F4]/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1.5 text-[11px] font-medium text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{passwordError}</span>
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between pt-1 pb-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isSubmitting}
                  className="w-4 h-4 rounded-md border-slate-300 text-[#1464F4] focus:ring-[#1464F4]/30 transition-all cursor-pointer"
                />
                <span>Remember Me</span>
              </label>

              <button
                type="button"
                onClick={() => onNavigate('/forgot-password')}
                className="font-bold text-[#1464F4] hover:underline focus:outline-none"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#1464F4] hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all tap-bounce disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </>
              )}
            </button>
          </form>

          {/* New to Rentoura.lk Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative inline-block px-3 bg-white text-[11px] font-semibold text-slate-400">
              New to Rentoura.lk?
            </div>
          </div>

          {/* Create Account Button */}
          <button
            type="button"
            onClick={() => onNavigate('/register')}
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-2xl bg-white border-2 border-[#1464F4] text-[#1464F4] hover:bg-blue-50 active:bg-blue-100 font-bold text-sm flex items-center justify-center gap-2 transition-all tap-bounce"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </main>

      {/* Bottom Trust & Benefit Cards */}
      <footer className="relative z-10 w-full max-w-md mx-auto px-4 pb-8 pt-4 space-y-4">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3.5 border border-slate-200/80 shadow-sm grid grid-cols-3 divide-x divide-slate-100 text-center">
          <div className="px-2 flex flex-col items-center">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1464F4] flex items-center justify-center mb-1">
              <Home className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-800">Rent Anything</span>
            <span className="text-[9px] text-slate-400 font-medium leading-tight">Homes, Vehicles, Events...</span>
          </div>

          <div className="px-2 flex flex-col items-center">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1464F4] flex items-center justify-center mb-1">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-800">Find Work</span>
            <span className="text-[9px] text-slate-400 font-medium leading-tight">Jobs & Services</span>
          </div>

          <div className="px-2 flex flex-col items-center">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1464F4] flex items-center justify-center mb-1">
              <Handshake className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-800">Grow Together</span>
            <span className="text-[9px] text-slate-400 font-medium leading-tight">Sri Lanka's Trusted Hub</span>
          </div>
        </div>

        {/* Hand-drawn style blue tag banner */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1464F4] text-white text-xs font-bold shadow-md shadow-blue-500/20">
            <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300" />
            <span>Make Life Easier with Rentoura.lk</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
