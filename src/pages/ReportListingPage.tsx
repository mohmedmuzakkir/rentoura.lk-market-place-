import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Shield, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink, 
  AlertTriangle, 
  Ban, 
  Image as ImageIcon, 
  Copyright, 
  MoreHorizontal, 
  Lock, 
  Phone, 
  Mail, 
  X, 
  Globe,
  ChevronRight,
  Send,
  Flag,
  FileText
} from 'lucide-react';
import { RentouraLogo } from '../components/RentouraLogo';
import { AppRoute, FeaturedListingItem, JobItem, ServiceItem } from '../types';
import { AuthService } from '../services/authService';
import { ReportService } from '../services/reportService';

export interface ReportListingTarget {
  id: string;
  title: string;
  location: string;
  price: string;
  pricePeriod?: string;
  imageUrl: string;
  module: 'rentals' | 'jobs' | 'services';
  category?: string;
  ownerId?: string;
}

interface ReportListingPageProps {
  onNavigate: (route: AppRoute) => void;
  targetListing?: ReportListingTarget | null;
  selectedLanguage?: 'English' | 'Sinhala' | 'Tamil';
  onLanguageChange?: (lang: 'English' | 'Sinhala' | 'Tamil') => void;
}

export const ReportListingPage: React.FC<ReportListingPageProps> = ({
  onNavigate,
  targetListing,
  selectedLanguage = 'English',
  onLanguageChange
}) => {
  const currentUser = AuthService.getCurrentUser();

  // Fallback target if none passed in route state (e.g. sample active listing)
  const defaultTarget: ReportListingTarget = targetListing || {
    id: 'prop-kandy-1',
    title: 'Cozy 3 Bedroom House for Rent in Kandy',
    location: 'Kandy, Central Province',
    price: 'Rs. 120,000',
    pricePeriod: '/ Month',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    module: 'rentals',
    category: 'House',
    ownerId: 'usr-owner-99'
  };

  const isSelfListing = currentUser && defaultTarget.ownerId && currentUser.id === defaultTarget.ownerId;

  // Form State
  const [selectedReason, setSelectedReason] = useState<string>('scam');
  const [description, setDescription] = useState<string>('');
  const [contactInfo, setContactInfo] = useState<string>(currentUser ? (currentUser.email || '') : '');
  const [allowContact, setAllowContact] = useState<boolean>(true);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Language display
  const [currentLang, setCurrentLang] = useState<'English' | 'Sinhala' | 'Tamil'>(selectedLanguage);
  const [showLangDropdown, setShowLangDropdown] = useState<boolean>(false);

  const languageLabels = {
    English: '🇱🇰 English',
    Sinhala: '🇱🇰 සිංහල',
    Tamil: '🇱🇰 தமிழ்'
  };

  // 6 Primary Reasons Matching Page 30 Reference Image
  const reportReasons = [
    {
      id: 'incorrect_info',
      label: 'Incorrect Information',
      desc: 'Details are wrong or misleading.',
      icon: AlertTriangle,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50'
    },
    {
      id: 'spam',
      label: 'Spam or Irrelevant',
      desc: 'The listing is spam or not related to our platform.',
      icon: Ban,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'inappropriate',
      label: 'Inappropriate Images',
      desc: 'Images are offensive or not appropriate.',
      icon: ImageIcon,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50'
    },
    {
      id: 'scam',
      label: 'Scam or Fraud',
      desc: 'Possible scam, fake listing or fraud.',
      icon: ShieldAlert,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'copyright',
      label: 'Copyright Violation',
      desc: 'Uses someone else\'s content without permission.',
      icon: Copyright,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'other',
      label: 'Other',
      desc: 'Something else that violates our rules.',
      icon: MoreHorizontal,
      color: 'text-slate-500',
      bgColor: 'bg-slate-100'
    }
  ];

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!selectedReason) {
      setErrorMsg('Please select a reason for reporting this listing.');
      return;
    }

    if (selectedReason === 'other' && !description.trim()) {
      setErrorMsg('Please provide a short description when selecting "Other".');
      return;
    }

    if (description.length > 500) {
      setErrorMsg('Description must not exceed 500 characters.');
      return;
    }

    setIsSubmitting(true);

    const activeReason = reportReasons.find(r => r.id === selectedReason);

    // Submit via ReportService
    setTimeout(() => {
      const result = ReportService.submitReport({
        reporterId: currentUser ? currentUser.id : 'guest-reporter',
        targetId: defaultTarget.id,
        targetModule: defaultTarget.module,
        targetTitle: defaultTarget.title,
        targetLocation: defaultTarget.location,
        targetPrice: defaultTarget.price,
        targetImageUrl: defaultTarget.imageUrl,
        reasonCode: selectedReason,
        reasonLabel: activeReason ? activeReason.label : 'Reported Issue',
        description: description.trim(),
        contactInfo: contactInfo.trim(),
        allowContact
      });

      setIsSubmitting(false);

      if (result.success) {
        setIsSubmitted(true);
      } else {
        setErrorMsg(result.error || 'Failed to submit report. Please try again.');
      }
    }, 600);
  };

  // Helper to open canonical detail page
  const handleViewListing = () => {
    if (defaultTarget.module === 'rentals') {
      onNavigate('/rental-detail');
    } else if (defaultTarget.module === 'jobs') {
      onNavigate('/job-detail');
    } else {
      onNavigate('/service-detail');
    }
  };

  // Module Badge styling
  const moduleBadgeConfig = {
    rentals: { label: 'RENTAL', bg: 'bg-[#1464F4]/10', text: 'text-[#1464F4]', border: 'border-[#1464F4]/20' },
    jobs: { label: 'JOB', bg: 'bg-[#08A34F]/10', text: 'text-[#08A34F]', border: 'border-[#08A34F]/20' },
    services: { label: 'SERVICE', bg: 'bg-[#FF650A]/10', text: 'text-[#FF650A]', border: 'border-[#FF650A]/20' }
  }[defaultTarget.module];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between relative selection:bg-blue-100 selection:text-[#1464F4]">
      
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 shadow-xs">
        <div className="w-full max-w-4xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all tap-bounce"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <RentouraLogo variant="header" theme="light" className="scale-90" />

          {/* Language Switcher */}
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
      </header>

      {/* MAIN CONTAINER */}
      <main className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 flex-1 space-y-6">

        {/* SELF-LISTING GUARD NOTICE */}
        {isSelfListing ? (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-amber-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-[#041C43]">You cannot report your own listing</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              This is a listing published under your account. To edit, pause, or remove your listing, visit your My Listings dashboard.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/my-listings')}
              className="px-6 py-3 rounded-2xl bg-[#1464F4] text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:bg-blue-600 transition-all tap-bounce"
            >
              Go to My Listings
            </button>
          </div>
        ) : isSubmitted ? (

          /* SUCCESS STATE (Matching Page 30 Post-Submission) */
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-100 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 uppercase tracking-wider">
                Report Submitted
              </span>
              <h2 className="text-2xl font-black text-[#041C43] font-heading">
                Thank you for your report
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto font-medium">
                Your report regarding “{defaultTarget.title}” has been received. Our moderation team will review the issue and take appropriate action if platform rules were violated.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-100 text-left text-xs text-slate-600 space-y-1">
              <div className="font-bold text-[#041C43] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#1464F4]" />
                <span>Confidentiality Guaranteed</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Your identity is never disclosed to the listing owner.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleViewListing}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all tap-bounce"
              >
                Back to Listing
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/safety')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-[#1464F4] hover:bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all tap-bounce"
              >
                Visit Safety Center
              </button>
            </div>
          </div>

        ) : (

          /* FORM STATE (Exact Page 30 Visual Match) */
          <div className="space-y-6">

            {/* HERO SECTION WITH ILLUSTRATION GRAPHIC */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-3 max-w-lg">
                <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
                  <span className="text-[#041C43]">Report </span>
                  <span className="text-[#1464F4]">a Listing</span>
                </h1>

                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Help us keep RENTOURA.LK safe and trustworthy. Please let us know if this listing goes against our rules.
                </p>

                {/* Important Report Notice Alert Box */}
                <div className="p-3.5 rounded-2xl bg-blue-50/90 border border-blue-100 flex items-start gap-3 text-xs text-[#041C43]">
                  <div className="w-6 h-6 rounded-xl bg-[#1464F4] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[11.5px]">Your report is important</h3>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      All reports are reviewed by our team. Your identity will remain confidential.
                    </p>
                  </div>
                </div>
              </div>

              {/* Shield Illustration Graphic (Page 30 Visual Match) */}
              <div className="shrink-0 w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-tr from-[#041C43] via-[#08285C] to-[#1464F4] p-4 text-white flex flex-col items-center justify-center text-center shadow-lg shadow-blue-500/20 relative mx-auto md:mx-0">
                <ShieldAlert className="w-16 h-16 text-[#00C2FF] mb-1" />
                <span className="text-[11px] font-bold tracking-wide text-white">SAFETY REVIEW</span>
              </div>
            </div>

            {/* TARGET LISTING SUMMARY CARD (Mandatory Context) */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-100 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 w-full sm:w-auto">
                <img
                  src={defaultTarget.imageUrl}
                  alt={defaultTarget.title}
                  className="w-20 h-20 sm:w-24 sm:h-20 rounded-2xl object-cover shrink-0 border border-slate-100 shadow-xs"
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${moduleBadgeConfig.bg} ${moduleBadgeConfig.text} ${moduleBadgeConfig.border}`}>
                      {moduleBadgeConfig.label}
                    </span>
                    {defaultTarget.category && (
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        • {defaultTarget.category}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs font-bold text-[#041C43] line-clamp-1 font-heading">
                    {defaultTarget.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                    📍 {defaultTarget.location}
                  </p>
                  <p className="text-xs font-black text-[#1464F4]">
                    {defaultTarget.price} <span className="text-[10px] font-normal text-slate-400">{defaultTarget.pricePeriod}</span>
                  </p>
                </div>
              </div>

              {/* View Listing CTA Button */}
              <button
                type="button"
                onClick={handleViewListing}
                className="w-full sm:w-auto shrink-0 px-4 py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-all tap-bounce flex items-center justify-center gap-1.5"
              >
                <span>View Listing</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#1464F4]" />
              </button>
            </div>

            {/* FORM BODY */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ERROR ALERT */}
              {errorMsg && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* STEP 1: WHY ARE YOU REPORTING? (Page 30 Radio Card Grid) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-100 space-y-4">
                <div className="flex items-center gap-2 font-heading">
                  <div className="w-6 h-6 rounded-full bg-[#1464F4] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <h2 className="text-sm font-bold text-[#041C43]">
                    Why are you reporting this listing?
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {reportReasons.map((reason) => {
                    const IconComponent = reason.icon;
                    const isSelected = selectedReason === reason.id;
                    return (
                      <button
                        key={reason.id}
                        type="button"
                        onClick={() => {
                          setSelectedReason(reason.id);
                          setErrorMsg(null);
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all tap-bounce flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'bg-blue-50/80 border-[#1464F4] ring-2 ring-[#1464F4]/20 shadow-xs'
                            : 'bg-slate-50/60 hover:bg-slate-100/80 border-slate-200/80'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-xl ${reason.bgColor} ${reason.color} flex items-center justify-center shrink-0 mt-0.5`}>
                            <IconComponent className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <h3 className="text-xs font-bold text-[#041C43]">
                              {reason.label}
                            </h3>
                            <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                              {reason.desc}
                            </p>
                          </div>
                        </div>

                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 transition-all ${
                          isSelected ? 'border-[#1464F4] bg-[#1464F4]' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2: DESCRIBE THE ISSUE */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-100 space-y-4">
                <div className="flex items-center justify-between font-heading">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#1464F4] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      2
                    </div>
                    <h2 className="text-sm font-bold text-[#041C43]">
                      Describe the issue <span className="text-xs font-normal text-slate-400">(optional)</span>
                    </h2>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    rows={4}
                    maxLength={500}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide more details to help us understand the problem..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#1464F4] transition-all resize-none"
                  />
                  <div className="text-[10px] font-bold text-slate-400 text-right mt-1">
                    {description.length} / 500
                  </div>
                </div>
              </div>

              {/* STEP 3: CONTACT INFORMATION */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-100 space-y-4">
                <div className="flex items-center gap-2 font-heading">
                  <div className="w-6 h-6 rounded-full bg-[#1464F4] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <h2 className="text-sm font-bold text-[#041C43]">
                    How can we contact you? <span className="text-xs font-normal text-slate-400">(optional)</span>
                  </h2>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      placeholder="Enter your email or phone number"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-[#1464F4] transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium pl-1">
                    This will not be shared with the listing owner.
                  </p>
                </div>
              </div>

              {/* TRUST & CONFIDENTIALITY BANNER (Page 30 Visual Match) */}
              <div className="p-5 rounded-3xl bg-blue-50/80 border border-blue-100/90 shadow-2xs flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#1464F4] text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#041C43]">We take your reports seriously</h3>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">
                    Our team will review your report and take action if it violates our policies. Thank you for helping us build a safe community.
                  </p>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-[#1464F4] hover:bg-blue-600 text-white font-bold text-xs shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all tap-bounce disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting Report...</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4.5 h-4.5" />
                      <span>Submit Report</span>
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>Your report is confidential and secure.</span>
                </p>
              </div>

            </form>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="w-full bg-white border-t border-slate-200/80 py-6 px-4 mt-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <RentouraLogo variant="header" theme="light" className="scale-75 origin-left" />
            <span>— © 2026 RENTOURA.LK. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-bold text-slate-600">
            <button type="button" onClick={() => onNavigate('/safety')} className="hover:underline text-[#1464F4]">
              Safety Center
            </button>
            <span>•</span>
            <button type="button" onClick={() => onNavigate('/help')} className="hover:underline">
              Help Center
            </button>
            <span>•</span>
            <button type="button" onClick={() => onNavigate('/user-agreement')} className="hover:underline">
              User Agreement
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
