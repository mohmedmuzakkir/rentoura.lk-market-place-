import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  UserPlus, 
  ChevronRight, 
  ShieldCheck, 
  LockKeyhole, 
  Globe, 
  AlertCircle,
  CheckCircle2,
  Users,
  Zap,
  Headphones
} from 'lucide-react';
import { RentouraLogo } from '../components/RentouraLogo';
import { 
  AuthService, 
  validateAndNormalizeEmail, 
  normalizeSriLankanPhone, 
  calculatePasswordStrength 
} from '../services/authService';
import { AppRoute } from '../types';

interface RegisterPageProps {
  onNavigate: (route: AppRoute) => void;
  returnUrl?: AppRoute;
  selectedLanguage?: 'English' | 'Sinhala' | 'Tamil';
  onLanguageChange?: (lang: 'English' | 'Sinhala' | 'Tamil') => void;
  onOpenUserAgreement?: () => void;
  onOpenPrivacyPolicy?: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onNavigate,
  returnUrl,
  selectedLanguage = 'English',
  onLanguageChange,
  onOpenUserAgreement,
  onOpenPrivacyPolicy
}) => {
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreementAccepted, setAgreementAccepted] = useState(false);

  // Field UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentLang, setCurrentLang] = useState<'English' | 'Sinhala' | 'Tamil'>(selectedLanguage);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  // Errors & Submit States
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [agreementError, setAgreementError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Password strength
  const passwordStrength = calculatePasswordStrength(password);

  // Check if already authenticated
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      onNavigate(returnUrl || '/');
    }
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

  const handlePhoneBlur = () => {
    if (!phone.trim()) {
      setPhoneError('Sri Lankan mobile number is required.');
      return;
    }
    const norm = normalizeSriLankanPhone(phone);
    if (!norm.isValid) {
      setPhoneError(norm.error || 'Please enter a valid Sri Lankan mobile number.');
    } else {
      setPhone(norm.normalized);
      setPhoneError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessMsg('');

    let hasError = false;

    // 1. Name validation
    const trimmedName = fullName.trim();
    if (!trimmedName) {
      setNameError('Full Name is required.');
      hasError = true;
    } else if (trimmedName.length < 2) {
      setNameError('Please enter your full name (at least 2 characters).');
      hasError = true;
    } else {
      setNameError('');
    }

    // 2. Email validation
    const emailVal = validateAndNormalizeEmail(email);
    if (!emailVal.isValid) {
      setEmailError(emailVal.error || 'Please enter a valid email address.');
      hasError = true;
    } else {
      setEmailError('');
      setEmail(emailVal.normalized);
    }

    // 3. Phone validation
    const phoneVal = normalizeSriLankanPhone(phone);
    if (!phoneVal.isValid) {
      setPhoneError(phoneVal.error || 'Please enter a valid Sri Lankan mobile number.');
      hasError = true;
    } else {
      setPhoneError('');
      setPhone(phoneVal.normalized);
    }

    // 4. Password validation
    if (!password) {
      setPasswordError('Password is required.');
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      hasError = true;
    } else {
      setPasswordError('');
    }

    // 5. Confirm password
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password.');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match. Please verify your password.');
      hasError = true;
    } else {
      setConfirmPasswordError('');
    }

    // 6. Agreement check
    if (!agreementAccepted) {
      setAgreementError('You must agree to the User Agreement and Privacy Policy.');
      hasError = true;
    } else {
      setAgreementError('');
    }

    if (hasError) return;

    setIsSubmitting(true);

    try {
      const res = await AuthService.register({
        fullName: trimmedName,
        email: emailVal.normalized,
        phone: phoneVal.normalized,
        password,
        confirmPassword,
        agreementAccepted
      });

      if (res.requiresEmailConfirmation) {
        setSuccessMsg('Account created. Please verify your email before logging in.');
      } else {
        setSuccessMsg(`Account created successfully! Welcome to Rentoura, ${res.profile?.fullName || trimmedName}.`);
        setTimeout(() => {
          onNavigate(returnUrl || '/');
        }, 1000);
      }
    } catch (err: any) {
      setGeneralError(err.message || 'Account registration failed. Please check your details and try again.');
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
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container - Split view on Desktop / Single form on Mobile */}
      <div className="w-full max-w-6xl mx-auto px-4 py-4 sm:py-8 flex-1 flex items-center justify-center">
        <div className="w-full bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[640px]">

          {/* LEFT SIDE PANEL (Desktop & Tablet only) */}
          <div className="hidden md:flex md:col-span-5 lg:col-span-4 bg-gradient-to-br from-[#041C43] via-[#08285C] to-[#1464F4] text-white p-8 flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <RentouraLogo variant="header" theme="dark" className="scale-105 origin-left mb-8" />

              <h2 className="text-2xl lg:text-3xl font-black font-heading tracking-tight text-white leading-tight mb-3">
                Create Your <span className="text-[#00C2FF]">Account</span> Today!
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed font-normal mb-8">
                Join thousands of Sri Lankans who trust Rentoura.lk for rentals, jobs & services.
              </p>

              {/* Honest Benefit Highlights */}
              <div className="space-y-5">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 text-[#00C2FF]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Safe & Secure</h3>
                    <p className="text-[11px] text-slate-300 mt-0.5">Your data is protected with industry-standard security.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 text-[#00C2FF]">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Trusted Platform</h3>
                    <p className="text-[11px] text-slate-300 mt-0.5">Connect with verified renters and providers across Sri Lanka.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 text-[#00C2FF]">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Post & Connect</h3>
                    <p className="text-[11px] text-slate-300 mt-0.5">Post rentals, jobs or services and connect instantly.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 text-[11px] text-slate-300">
              <span>RENTOURA.LK — Everything for Rent, All in One Place</span>
            </div>
          </div>

          {/* RIGHT SIDE FORM PANEL (Mobile + Desktop) */}
          <div className="md:col-span-7 lg:col-span-8 p-5 sm:p-8 flex flex-col justify-between">
            {/* Top Bar inside form */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <button
                type="button"
                onClick={() => onNavigate(returnUrl || '/login')}
                className="w-9 h-9 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-all tap-bounce"
                aria-label="Go Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="md:hidden">
                <RentouraLogo variant="header" theme="light" className="scale-75" />
              </div>

              {/* Language Selector Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all tap-bounce"
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
            </div>

            {/* Form Title */}
            <div className="mb-5 text-center sm:text-left">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-blue-50 text-[#1464F4] mb-2 sm:hidden">
                <UserPlus className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-black text-[#041C43] font-heading tracking-tight">
                Create Account
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Fill in the details below to get started
              </p>
            </div>

            {/* General Banner Alert Messages */}
            {generalError && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                <div className="flex-1">{generalError}</div>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2.5 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <div>{successMsg}</div>
              </div>
            )}

            {/* REGISTRATION FORM */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Full Name Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (nameError) setNameError('');
                    }}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-2xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      nameError 
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' 
                        : 'border-slate-200 focus:border-[#1464F4] focus:ring-[#1464F4]/20'
                    }`}
                  />
                </div>
                {nameError && (
                  <p className="mt-1 text-[11px] font-medium text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{nameError}</span>
                  </p>
                )}
              </div>

              {/* Email Address Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
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
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-2xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      emailError 
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' 
                        : 'border-slate-200 focus:border-[#1464F4] focus:ring-[#1464F4]/20'
                    }`}
                  />
                </div>
                {emailError && (
                  <p className="mt-1 text-[11px] font-medium text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{emailError}</span>
                  </p>
                )}
              </div>

              {/* Sri Lankan Mobile Number Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sri Lankan Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-2 flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-200/80 text-[11px] font-bold text-slate-700 border border-slate-300/80 pointer-events-none">
                    <span>🇱🇰</span>
                    <span>+94</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (phoneError) setPhoneError('');
                    }}
                    onBlur={handlePhoneBlur}
                    placeholder="07XXXXXXXX"
                    autoComplete="tel"
                    inputMode="tel"
                    disabled={isSubmitting}
                    className={`w-full pl-20 pr-4 py-2.5 bg-slate-50 border rounded-2xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      phoneError 
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' 
                        : 'border-slate-200 focus:border-[#1464F4] focus:ring-[#1464F4]/20'
                    }`}
                  />
                </div>
                {phoneError ? (
                  <p className="mt-1 text-[11px] font-medium text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{phoneError}</span>
                  </p>
                ) : (
                  <p className="mt-1 text-[10px] text-slate-400 font-medium">
                    Enter a valid Sri Lankan mobile number (07XXXXXXXX or +947XXXXXXXX)
                  </p>
                )}
              </div>

              {/* Password & Strength Indicator */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
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
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-2xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      passwordError 
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' 
                        : 'border-slate-200 focus:border-[#1464F4] focus:ring-[#1464F4]/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full flex-1 rounded-full ${passwordStrength === 'Weak' ? 'bg-rose-500' : passwordStrength === 'Fair' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      <div className={`h-full flex-1 rounded-full ${passwordStrength === 'Fair' || passwordStrength === 'Strong' ? (passwordStrength === 'Fair' ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-slate-200'}`} />
                      <div className={`h-full flex-1 rounded-full ${passwordStrength === 'Strong' ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                    </div>
                    <span className={`text-[10px] font-bold ${passwordStrength === 'Weak' ? 'text-rose-500' : passwordStrength === 'Fair' ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {passwordStrength} Password
                    </span>
                  </div>
                )}

                {passwordError && (
                  <p className="mt-1 text-[11px] font-medium text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{passwordError}</span>
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
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
                      if (confirmPasswordError) setConfirmPasswordError('');
                    }}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-2xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      confirmPasswordError 
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' 
                        : 'border-slate-200 focus:border-[#1464F4] focus:ring-[#1464F4]/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPasswordError && (
                  <p className="mt-1 text-[11px] font-medium text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{confirmPasswordError}</span>
                  </p>
                )}
              </div>

              {/* User Agreement Checkbox */}
              <div>
                <label className="flex items-start gap-2 cursor-pointer select-none text-slate-600 font-medium text-xs leading-relaxed">
                  <input
                    type="checkbox"
                    checked={agreementAccepted}
                    onChange={(e) => {
                      setAgreementAccepted(e.target.checked);
                      if (agreementError) setAgreementError('');
                    }}
                    disabled={isSubmitting}
                    className="w-4 h-4 rounded-md border-slate-300 text-[#1464F4] focus:ring-[#1464F4]/30 transition-all cursor-pointer mt-0.5"
                  />
                  <span>
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenUserAgreement ? onOpenUserAgreement() : onNavigate('/user-agreement');
                      }}
                      className="font-bold text-[#1464F4] hover:underline focus:outline-none"
                    >
                      User Agreement
                    </button>{' '}
                    and{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenPrivacyPolicy ? onOpenPrivacyPolicy() : onNavigate('/privacy-policy');
                      }}
                      className="font-bold text-[#1464F4] hover:underline focus:outline-none"
                    >
                      Privacy Policy
                    </button>
                  </span>
                </label>
                {agreementError && (
                  <p className="mt-1 text-[11px] font-medium text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{agreementError}</span>
                  </p>
                )}
              </div>

              {/* Create Account Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-2xl bg-[#1464F4] hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all tap-bounce disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Already have an account link */}
            <div className="mt-5 text-center pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('/login')}
                  className="font-bold text-[#1464F4] hover:underline"
                >
                  Login Now
                </button>
              </span>
            </div>

            {/* Honest Trust Badges Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-xl bg-slate-50 flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-[#1464F4] mb-0.5" />
                <span className="text-[10px] font-bold text-slate-800">100% Secure</span>
                <span className="text-[8px] text-slate-400">Data protection</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 flex flex-col items-center">
                <LockKeyhole className="w-4 h-4 text-[#1464F4] mb-0.5" />
                <span className="text-[10px] font-bold text-slate-800">No Spam</span>
                <span className="text-[8px] text-slate-400">Privacy respected</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 flex flex-col items-center">
                <Users className="w-4 h-4 text-[#1464F4] mb-0.5" />
                <span className="text-[10px] font-bold text-slate-800">Trusted Platform</span>
                <span className="text-[8px] text-slate-400">Sri Lanka's network</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 flex flex-col items-center">
                <Headphones className="w-4 h-4 text-[#1464F4] mb-0.5" />
                <span className="text-[10px] font-bold text-slate-800">24/7 Support</span>
                <span className="text-[8px] text-slate-400">Help anytime</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
