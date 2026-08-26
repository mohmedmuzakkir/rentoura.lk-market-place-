import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Globe, 
  CheckCircle2, 
  Lock, 
  Eye, 
  Database, 
  FileText, 
  Printer, 
  ChevronUp, 
  Clock, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { RentouraLogo } from '../components/RentouraLogo';
import { AppRoute } from '../types';

interface PrivacyPolicyPageProps {
  onNavigate: (route: AppRoute) => void;
  selectedLanguage?: 'English' | 'Sinhala' | 'Tamil';
  onLanguageChange?: (lang: 'English' | 'Sinhala' | 'Tamil') => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({
  onNavigate,
  selectedLanguage = 'English',
  onLanguageChange
}) => {
  const [currentLang, setCurrentLang] = useState<'English' | 'Sinhala' | 'Tamil'>(selectedLanguage);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const languageLabels = {
    English: '🇱🇰 English',
    Sinhala: '🇱🇰 සිංහල',
    Tamil: '🇱🇰 தமிழ்'
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between relative selection:bg-blue-100 selection:text-[#1464F4]">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 left-0 w-[500px] h-[500px] bg-sky-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER BAR */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 shadow-xs">
        <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all tap-bounce"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <RentouraLogo variant="header" theme="light" className="scale-90" />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all tap-bounce"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-all tap-bounce"
              >
                <Globe className="w-3.5 h-3.5 text-[#1464F4]" />
                <span>{languageLabels[currentLang]}</span>
              </button>

              {showLangDropdown && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
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
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 flex-1 space-y-6">
        {/* HERO CARD */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#1464F4] text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>DATA PROTECTION & PRIVACY</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#041C43] font-heading tracking-tight">
              Privacy <span className="text-[#1464F4]">Policy</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              We respect your privacy and protect your personal information on RENTOURA.LK.
            </p>

            <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Last Updated: August 16, 2026
              </span>
              <span>•</span>
              <span className="text-[#1464F4]">Version 1.0</span>
            </div>
          </div>

          <div className="shrink-0 w-32 h-32 rounded-3xl bg-blue-50 border border-blue-100 text-[#1464F4] flex flex-col items-center justify-center text-center shadow-inner">
            <Lock className="w-10 h-10 mb-1" />
            <span className="text-[11px] font-bold">100% Encrypted</span>
          </div>
        </div>

        {/* POLICY SECTIONS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-slate-200/50 border border-slate-100 space-y-6 text-xs text-slate-600 leading-relaxed">
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-1">
            <h3 className="font-bold text-[#041C43] text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#1464F4]" />
              <span>Privacy Overview</span>
            </h3>
            <p className="text-[11.5px] text-slate-600">
              This Privacy Policy explains how RENTOURA.LK collects, uses, stores, and protects personal information provided by renters, job applicants, and service providers.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-[#041C43] text-sm">1. Information We Collect</h3>
            <p>
              When creating an account or publishing a listing on RENTOURA.LK, we collect essential details including your Full Name, Email Address, and valid Sri Lankan Mobile Number (+94 / 07X). We also record user activity such as saved listings, posted items, and messages to deliver your marketplace services.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-[#041C43] text-sm">2. Password & Authentication Security</h3>
            <p>
              Your account password is encrypted and managed exclusively via secure Supabase Authentication infrastructure. We never store passwords in plain text or reveal them to platform staff or third parties.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-[#041C43] text-sm">3. Public Listing Contact Display</h3>
            <p>
              When you publish a rental, job, or service listing on RENTOURA.LK, the mobile phone number associated with that listing is displayed publicly on the listing detail view so interested renters, employers, or clients can contact you directly via phone call or WhatsApp.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-[#041C43] text-sm">4. Data Sharing & Third Parties</h3>
            <p>
              RENTOURA.LK does not sell, rent, or trade user personal data to third-party marketers or advertisers. Data is processed strictly to maintain marketplace functionality, satisfy legal obligations, or prevent fraudulent activities.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-[#041C43] text-sm">5. User Rights & Account Data Control</h3>
            <p>
              You have the right to access, edit, or update your profile details at any time via your Account Settings. You may also request deletion of your account and associated listings by contacting support.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-slate-500 font-medium">Have questions about your data?</span>
            <button
              type="button"
              onClick={() => onNavigate('/user-agreement')}
              className="font-bold text-[#1464F4] hover:underline flex items-center gap-1"
            >
              <span>View User Agreement</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-white border-t border-slate-200/80 py-6 px-4 mt-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <RentouraLogo variant="header" theme="light" className="scale-75 origin-left" />
            <span>— © 2026 RENTOURA.LK. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-bold text-slate-600">
            <button type="button" onClick={() => onNavigate('/user-agreement')} className="hover:underline">
              User Agreement
            </button>
            <span>•</span>
            <button type="button" onClick={() => onNavigate('/privacy-policy')} className="text-[#1464F4] hover:underline">
              Privacy Policy
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
