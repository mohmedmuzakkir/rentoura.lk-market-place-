import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  FileText, 
  Globe, 
  CheckCircle2, 
  AlertTriangle, 
  Handshake, 
  CreditCard, 
  ShieldAlert, 
  Gavel, 
  Printer, 
  ChevronUp, 
  Lock, 
  Search, 
  Check, 
  Users, 
  Briefcase, 
  Car, 
  Wrench, 
  MessageSquare, 
  AlertCircle, 
  HelpCircle,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { RentouraLogo } from '../components/RentouraLogo';
import { AppRoute } from '../types';
import { UserProfile } from '../types/profileTypes';
import { AuthService, CURRENT_AGREEMENT_VERSION } from '../services/authService';

interface UserAgreementPageProps {
  onNavigate: (route: AppRoute) => void;
  selectedLanguage?: 'English' | 'Sinhala' | 'Tamil';
  onLanguageChange?: (lang: 'English' | 'Sinhala' | 'Tamil') => void;
  onAgreeAndContinue?: () => void;
  userProfile?: UserProfile | null;
}

export const UserAgreementPage: React.FC<UserAgreementPageProps> = ({
  onNavigate,
  selectedLanguage = 'English',
  onLanguageChange,
  onAgreeAndContinue,
  userProfile
}) => {
  const [agreedChecked, setAgreedChecked] = useState<boolean>(() => {
    return AuthService.hasAcceptedCurrentAgreement(userProfile || null);
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [currentLang, setCurrentLang] = useState<'English' | 'Sinhala' | 'Tamil'>(selectedLanguage);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState<string>('sec-1');
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // Scroll listener for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAgreeAndSubmit = async () => {
    if (!agreedChecked || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await AuthService.acceptUserAgreement();
      if (onAgreeAndContinue) {
        onAgreeAndContinue();
      } else {
        onNavigate('/');
      }
    } catch (err: any) {
      console.error('Failed to record agreement acceptance:', err);
      setSubmitError(err.message || 'Failed to record acceptance in database. Please check your network connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = () => {
    onNavigate('/');
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const languageLabels = {
    English: '🇱🇰 English',
    Sinhala: '🇱🇰 සිංහල',
    Tamil: '🇱🇰 தமிழ்'
  };

  const sectionsList = [
    { id: 'sec-1', number: '1', title: 'Introduction' },
    { id: 'sec-2', number: '2', title: 'Eligibility & Accounts' },
    { id: 'sec-3', number: '3', title: 'Marketplace Role' },
    { id: 'sec-4', number: '4', title: 'User Responsibilities' },
    { id: 'sec-5', number: '5', title: 'Rental Safety & Listings' },
    { id: 'sec-6', number: '6', title: 'Jobs & Employment' },
    { id: 'sec-7', number: '7', title: 'Services & Skills' },
    { id: 'sec-8', number: '8', title: 'Payments & Advance Payments' },
    { id: 'sec-9', number: '9', title: 'Communication Safety' },
    { id: 'sec-10', number: '10', title: 'Listing Rules' },
    { id: 'sec-11', number: '11', title: 'Moderation & Pending Review' },
    { id: 'sec-12', number: '12', title: 'Reports & Fraud Prevention' },
    { id: 'sec-13', number: '13', title: 'Reviews & Ratings' },
    { id: 'sec-14', number: '14', title: 'Prohibited Conduct' },
    { id: 'sec-15', number: '15', title: 'Content & IP License' },
    { id: 'sec-16', number: '16', title: 'Account Actions & Enforcement' },
    { id: 'sec-17', number: '17', title: 'Platform Availability' },
    { id: 'sec-18', number: '18', title: 'Limitation of Liability' },
    { id: 'sec-19', number: '19', title: 'Indemnity' },
    { id: 'sec-20', number: '20', title: 'Privacy Policy Link' },
    { id: 'sec-21', number: '21', title: 'Changes to Agreement' },
    { id: 'sec-22', number: '22', title: 'Governing Law & Support' },
  ];

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
            onClick={handleDecline}
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all tap-bounce"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <RentouraLogo variant="header" theme="light" className="scale-90" />
          </div>

          <div className="flex items-center gap-2">
            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all tap-bounce"
              title="Print User Agreement"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            {/* Language Dropdown */}
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
      <main className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8 flex-1 space-y-8">
        
        {/* HERO SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#1464F4] text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>IMPORTANT LEGAL NOTICE</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#041C43] font-heading tracking-tight leading-tight">
              User <span className="text-[#1464F4]">Agreement</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Please read this agreement carefully before using RENTOURA.LK. By continuing, you agree to the terms and conditions outlined below.
            </p>

            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5 text-xs text-slate-700">
              <ShieldCheck className="w-4 h-4 text-[#1464F4] shrink-0 mt-0.5" />
              <p className="font-medium text-[11.5px] leading-relaxed">
                This agreement is designed to establish trust, transparency, and safety for all renters, job seekers, and service providers across Sri Lanka.
              </p>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Last Updated: August 16, 2026
              </span>
              <span>•</span>
              <span className="text-[#1464F4]">Version 1.0</span>
            </div>
          </div>

          {/* Hero Illustration Graphic */}
          <div className="shrink-0 w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-tr from-[#041C43] via-[#08285C] to-[#1464F4] p-4 text-white flex flex-col items-center justify-center text-center shadow-lg shadow-blue-500/20 relative">
            <FileText className="w-12 h-12 text-[#00C2FF] mb-2" />
            <span className="text-xs font-bold tracking-wide text-white">RENTOURA.LK</span>
            <span className="text-[10px] text-slate-200">Terms of Service</span>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* QUICK SUMMARY CARD: "AGREEMENT AT A GLANCE" */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-slate-200/50 border border-slate-100 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#1464F4] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#041C43] font-heading">
                  Important Points to Note
                </h2>
                <p className="text-[11px] text-slate-400 font-medium">
                  Quick summary of key community policies
                </p>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600">
              Agreement at a Glance
            </span>
          </div>

          {/* 6 Compact Cards Grid (Matching reference image) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {/* Card 1 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100/80 text-[#1464F4] flex items-center justify-center shrink-0">
                  <Handshake className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-[#041C43]">We are Just a Platform</h3>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                RENTOURA.LK is a marketplace platform that connects people. We are not a party to any rental, service or job agreement made directly between users.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#1464F4]/10 text-[#1464F4] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-[#041C43]">No Responsibility for Transactions</h3>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                We are not responsible for any damages, losses, disputes, frauds or issues that may happen between users independently.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-amber-900">No Advance Payments</h3>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Do not make advance bank transfers or payments to unverified parties. All transactions are directly between you and the other party.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100/80 text-[#1464F4] flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-[#041C43]">Safety is Your Responsibility</h3>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Safety, security, meetings and property/service quality are your own responsibility. Always inspect items in safe public locations.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100/80 text-[#1464F4] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-[#041C43]">Accuracy of Information</h3>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Users are solely responsible for the accuracy of the information, images, prices and details they provide on published listings.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100/80 text-[#1464F4] flex items-center justify-center shrink-0">
                  <Gavel className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-[#041C43]">Right to Take Action</h3>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                We reserve the right to remove listings, suspend accounts or take legal action if platform terms or community guidelines are violated.
              </p>
            </div>
          </div>

          {/* Legal Disclaimer Box */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-[11px]">
              By using our platform, you agree that RENTOURA.LK and its team will not be held liable for any direct or indirect loss or damage.
            </p>
          </div>

          {/* Mandatory Checkbox & Actions Row */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-4">
            {submitError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between gap-2 animate-in fade-in duration-150">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{submitError}</span>
                </div>
                <button
                  type="button"
                  onClick={handleAgreeAndSubmit}
                  className="px-2.5 py-1 rounded-xl bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreedChecked}
                onChange={(e) => setAgreedChecked(e.target.checked)}
                className="w-5 h-5 rounded-md border-slate-300 text-[#1464F4] focus:ring-[#1464F4]/30 transition-all cursor-pointer mt-0.5 shrink-0"
              />
              <div>
                <span className="text-xs font-bold text-slate-900">
                  I have read, understood and agree to the above terms <span className="text-rose-500">*</span>
                </span>
                <p className="text-[11px] text-slate-500 font-medium">
                  You must agree to continue using RENTOURA.LK safely.
                </p>
              </div>
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleDecline}
                className="w-full sm:w-auto flex-1 py-3 px-4 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all tap-bounce"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Decline & Go Back</span>
              </button>

              <button
                type="button"
                onClick={handleAgreeAndSubmit}
                disabled={!agreedChecked || isSubmitting}
                className="w-full sm:w-auto flex-1 py-3 px-6 rounded-2xl bg-[#1464F4] hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all tap-bounce disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Saving Acceptance...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>I Agree & Continue</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[10px] text-slate-400 font-medium text-center flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Your trust and safety are our top priority.</span>
            </p>
          </div>
        </div>

        {/* SEARCH & TABLE OF CONTENTS NAVIGATION */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* LEFT SIDEBAR: Table of Contents (Sticky on Desktop) */}
          <div className="md:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 md:sticky md:top-20 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs font-bold text-[#041C43] font-heading flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#1464F4]" />
                  <span>Table of Contents</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-semibold">22 Sections</span>
              </div>

              {/* Quick Search inside Agreement */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter terms (e.g. advance payment, job)..."
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1464F4]"
                />
              </div>

              {/* Navigation Jump List */}
              <div className="max-h-[360px] md:max-h-[460px] overflow-y-auto space-y-1 pr-1 custom-scrollbar text-xs">
                {sectionsList
                  .filter(sec => !searchTerm || sec.title.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((sec) => (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-[11px] font-semibold transition-all flex items-center gap-2 ${
                        activeSection === sec.id
                          ? 'bg-blue-50 text-[#1464F4] font-bold border-l-3 border-[#1464F4]'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className="w-4 text-[10px] text-slate-400 font-mono">{sec.number}.</span>
                      <span className="truncate">{sec.title}</span>
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Full 22 Detailed Legal Sections */}
          <div className="md:col-span-8 space-y-6">
            
            {/* SECTION 1: Introduction */}
            <div id="sec-1" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1464F4] text-xs font-bold flex items-center justify-center">1</span>
                <h3 className="text-sm font-bold text-[#041C43]">Introduction</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                RENTOURA.LK provides an online marketplace platform that allows users across Sri Lanka to discover, publish, and interact regarding rentals (vehicles, property, items), jobs, and services.
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                By accessing or using any feature of RENTOURA.LK, you agree to comply with and be legally bound by this User Agreement. RENTOURA.LK acts strictly as a neutral communications and discovery platform and is generally not a party to agreements independently entered into between users.
              </p>
            </div>

            {/* SECTION 2: Eligibility & Accounts */}
            <div id="sec-2" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1464F4] text-xs font-bold flex items-center justify-center">2</span>
                <h3 className="text-sm font-bold text-[#041C43]">Eligibility & Accounts</h3>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4 leading-relaxed">
                <li>Users must provide accurate, current, and complete registration information including Full Name, valid Email Address, and an active Sri Lankan mobile phone number.</li>
                <li>You are responsible for maintaining the confidentiality and security of your account login credentials.</li>
                <li>Impersonation of any individual, business, or entity is strictly prohibited.</li>
                <li>Accounts must not be used for fraudulent activities, deceptive marketing, or unauthorized access.</li>
                <li>Users must comply with all applicable local laws and statutory regulations in Sri Lanka.</li>
              </ul>
            </div>

            {/* SECTION 3: Marketplace Role */}
            <div id="sec-3" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1464F4] text-xs font-bold flex items-center justify-center">3</span>
                <h3 className="text-sm font-bold text-[#041C43]">Marketplace Role & Legal Position</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                RENTOURA.LK helps connect renters ↔ listing owners, employers ↔ applicants, and service providers ↔ customers. The platform does not automatically become a landlord, tenant, employer, employee, contractor, customer, agent, insurer, or guarantor simply because users connect through RENTOURA.LK.
              </p>
              <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 text-[11px] text-slate-700 space-y-1">
                <span className="font-bold text-[#1464F4]">Core Distinction:</span>
                <p>RENTOURA.LK does not own listed items, employ workers shown on the platform, or directly perform user-listed services unless explicitly specified in writing by platform management.</p>
              </div>
            </div>

            {/* SECTION 4: User Responsibilities */}
            <div id="sec-4" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1464F4] text-xs font-bold flex items-center justify-center">4</span>
                <h3 className="text-sm font-bold text-[#041C43]">User Responsibilities</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Users are solely responsible for verifying listing details, asking relevant questions, inspecting physical items or property, confirming identity where appropriate, confirming pricing and payment terms, and making independent decisions before finalizing any agreement.
              </p>
            </div>

            {/* SECTION 5: Rental Safety & Listings */}
            <div id="sec-5" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1464F4] text-xs font-bold flex items-center justify-center">5</span>
                <h3 className="text-sm font-bold text-[#041C43]">Rental Safety & Listings</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                For all rental transactions (vehicles, properties, machinery, equipment, electronics):
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>Inspect the physical item or property in person before completing payments or signing private rental contracts.</li>
                <li>Confirm owner identity, right to rent, pricing, security deposit terms, rental duration, return conditions, damage liability rules, and pickup/delivery terms.</li>
                <li>RENTOURA.LK does not guarantee listing accuracy or guarantee physical item safety.</li>
              </ul>
            </div>

            {/* SECTION 6: Jobs & Employment */}
            <div id="sec-6" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-lg bg-emerald-50 text-[#08A34F] text-xs font-bold flex items-center justify-center">6</span>
                <h3 className="text-sm font-bold text-[#041C43]">Jobs & Employment</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Job listings are posted directly by independent employers, recruitment managers, or businesses. Applicants should independently verify the employer identity, job role, salary package, workplace safety, location, and employment terms. RENTOURA.LK does not guarantee employment, interviews, or hiring outcomes.
              </p>
            </div>

            {/* SECTION 7: Services & Skills */}
            <div id="sec-7" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-lg bg-orange-50 text-[#FF650A] text-xs font-bold flex items-center justify-center">7</span>
                <h3 className="text-sm font-bold text-[#041C43]">Services & Skills</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Customers seeking services (repairs, catering, photography, tutoring, construction) should independently evaluate provider suitability, experience, scope of work, pricing, and required statutory qualifications or licenses. Service providers are responsible for accurate representations of their skills and credentials.
              </p>
            </div>

            {/* SECTION 8: Payments & Advance Payment Warning */}
            <div id="sec-8" className="bg-amber-50/80 rounded-3xl p-6 border border-amber-200/80 space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2 pb-2 border-b border-amber-200">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-amber-900">8. Payments & Advance Payment Warning</h3>
              </div>
              <div className="p-3 rounded-2xl bg-white/80 border border-amber-200 text-xs font-bold text-amber-900">
                ⚠️ CRITICAL SAFETY RULE: Be extremely cautious with advance payments!
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                Users should never send advance bank transfers or money merely because another person pressures them through a listing or chat. Always verify the person, verify the physical listing, inspect items in person, and understand contract terms before making payments.
              </p>
            </div>

            {/* SECTION 9: Communication Safety */}
            <div id="sec-9" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1464F4] text-xs font-bold flex items-center justify-center">9</span>
                <h3 className="text-sm font-bold text-[#041C43]">Communication Safety</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Keep initial communications on the RENTOURA.LK messaging system whenever practical. Never share account passwords, OTP codes, verification numbers, or bank PINs with anyone. Be cautious if a party demands moving immediately to external unmonitored channels.
              </p>
            </div>

            {/* SECTION 10: Listing Rules */}
            <div id="sec-10" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1464F4] text-xs font-bold flex items-center justify-center">10</span>
                <h3 className="text-sm font-bold text-[#041C43]">Listing Rules</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                All published listings must contain truthful, accurate information. Users are strictly prohibited from publishing fake listings, misleading prices, stolen photographs or descriptions, fraudulent offers, illegal items, duplicate spam, or deceptive job offers.
              </p>
            </div>

            {/* SECTION 11: Moderation & Pending Review */}
            <div id="sec-11" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1464F4] text-xs font-bold flex items-center justify-center">11</span>
                <h3 className="text-sm font-bold text-[#041C43]">Moderation & Pending Review</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Newly submitted listings enter a <span className="font-bold text-[#1464F4]">Pending Review</span> state and are not immediately visible to the public. Reviews aim to be completed promptly (typically within 24 hours depending on review volume). Authorized staff reserve the right to approve, reject, request corrections, or remove listings according to platform standards.
              </p>
            </div>

            {/* SECTION 12: Reports & Fraud Prevention */}
            <div id="sec-12" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1464F4] text-xs font-bold flex items-center justify-center">12</span>
                <h3 className="text-sm font-bold text-[#041C43]">Reports & Fraud Prevention</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Users may submit reports against suspicious listings, abusive users, inappropriate conversations, or fraudulent activities. Submitted reports enter RENTOURA.LK's moderation workflow for investigation.
              </p>
            </div>

            {/* SECTION 13: Reviews & Ratings */}
            <div id="sec-13" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1464F4] text-xs font-bold flex items-center justify-center">13</span>
                <h3 className="text-sm font-bold text-[#041C43]">Reviews & Ratings</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reviews and ratings must reflect genuine, authentic marketplace experiences. Fake reviews, rating manipulation, extortion, or defamatory content are strictly banned and subject to removal.
              </p>
            </div>

            {/* SECTION 14: Prohibited Conduct */}
            <div id="sec-14" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 text-xs font-bold flex items-center justify-center">14</span>
                <h3 className="text-sm font-bold text-[#041C43]">Prohibited Conduct</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prohibited actions include: fraud, scams, harassment, abusive language, spamming, impersonation, introducing malicious code, illegal activities, attempting to compromise user accounts, or manipulating marketplace search rankings.
              </p>
            </div>

            {/* SECTION 15: Content & IP License */}
            <div id="sec-15" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1464F4] text-xs font-bold flex items-center justify-center">15</span>
                <h3 className="text-sm font-bold text-[#041C43]">Content & Intellectual Property License</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Users retain responsibility for content they upload (photos, text, logos). Users grant RENTOURA.LK a non-exclusive, worldwide, limited license solely to host, store, display, and distribute user content to operate and promote the marketplace.
              </p>
            </div>

            {/* SECTION 16: Account Actions & Enforcement */}
            <div id="sec-16" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1464F4] text-xs font-bold flex items-center justify-center">16</span>
                <h3 className="text-sm font-bold text-[#041C43]">Account Actions & Enforcement</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                RENTOURA.LK may take proportionate action against accounts or listings that violate platform rules, including warnings, listing rejection/removal, temporary feature restrictions, or permanent account suspension.
              </p>
            </div>

            {/* SECTION 17: Platform Availability */}
            <div id="sec-17" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1464F4] text-xs font-bold flex items-center justify-center">17</span>
                <h3 className="text-sm font-bold text-[#041C43]">Platform Availability</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                While we strive for continuous service, RENTOURA.LK does not guarantee 100% uptime or error-free operation. Scheduled maintenance, updates, or technical issues may occasionally affect availability.
              </p>
            </div>

            {/* SECTION 18: Limitation of Liability */}
            <div id="sec-18" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1464F4] text-xs font-bold flex items-center justify-center">18</span>
                <h3 className="text-sm font-bold text-[#041C43]">Limitation of Liability</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-mono text-[11px] bg-slate-50 p-3 rounded-2xl border border-slate-100">
                To the maximum extent permitted by applicable law, RENTOURA.LK and its team shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or loss of profits or revenues arising out of or related to your use of the platform or transactions conducted between users.
              </p>
            </div>

            {/* SECTION 19: Indemnity */}
            <div id="sec-19" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1464F4] text-xs font-bold flex items-center justify-center">19</span>
                <h3 className="text-sm font-bold text-[#041C43]">Indemnity</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                You agree to defend, indemnify, and hold harmless RENTOURA.LK and its operators from any claims, liabilities, damages, or expenses arising out of your breach of this User Agreement or violation of third-party rights.
              </p>
            </div>

            {/* SECTION 20: Privacy Policy Link */}
            <div id="sec-20" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1464F4] text-xs font-bold flex items-center justify-center">20</span>
                <h3 className="text-sm font-bold text-[#041C43]">Privacy & Personal Data</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our collection and handling of personal information is governed by the RENTOURA.LK Privacy Policy.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('/privacy-policy')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1464F4] hover:underline pt-1"
              >
                <span>Read Full Privacy Policy</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* SECTION 21: Changes to Agreement */}
            <div id="sec-21" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1464F4] text-xs font-bold flex items-center justify-center">21</span>
                <h3 className="text-sm font-bold text-[#041C43]">Changes to Agreement</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                We reserve the right to update this agreement at any time. Material changes will be communicated on the platform. Continued use of RENTOURA.LK after updates constitutes acceptance of revised terms.
              </p>
            </div>

            {/* SECTION 22: Governing Law & Support */}
            <div id="sec-22" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1464F4] text-xs font-bold flex items-center justify-center">22</span>
                <h3 className="text-sm font-bold text-[#041C43]">Governing Law & Support</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                This agreement is governed by and construed in accordance with applicable statutory laws of the Democratic Socialist Republic of Sri Lanka.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                <span className="text-slate-500 font-medium">Questions or Concerns?</span>
                <button
                  type="button"
                  onClick={() => onNavigate('/notifications')}
                  className="font-bold text-[#1464F4] hover:underline"
                >
                  Contact Support →
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM STICKY/FIXED BACK TO TOP BUTTON */}
        {showBackToTop && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-2xl bg-[#1464F4] text-white shadow-xl shadow-blue-500/30 flex items-center justify-center hover:bg-blue-600 transition-all tap-bounce"
            aria-label="Back to Top"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        )}

      </main>

      {/* FOOTER */}
      <footer className="w-full bg-white border-t border-slate-200/80 py-6 px-4 mt-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <RentouraLogo variant="header" theme="light" className="scale-75 origin-left" />
            <span>— © 2026 RENTOURA.LK. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-bold text-slate-600">
            <button type="button" onClick={() => onNavigate('/user-agreement')} className="text-[#1464F4] hover:underline">
              User Agreement
            </button>
            <span>•</span>
            <button type="button" onClick={() => onNavigate('/privacy-policy')} className="hover:underline">
              Privacy Policy
            </button>
            <span>•</span>
            <button type="button" onClick={() => onNavigate('/notifications')} className="hover:underline">
              Support
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
