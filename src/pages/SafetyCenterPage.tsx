import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Globe, 
  CheckCircle2, 
  AlertTriangle, 
  CreditCard, 
  ShieldAlert, 
  Phone, 
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
  ChevronDown,
  ChevronUp,
  Flag,
  Send,
  MapPin,
  Eye,
  Printer,
  Share2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { RentouraLogo } from '../components/RentouraLogo';
import { AppRoute } from '../types';
import { ReportService } from '../services/reportService';
import { supabase } from '../lib/supabase';

interface SafetyCenterPageProps {
  onNavigate: (route: AppRoute) => void;
  selectedLanguage?: 'English' | 'Sinhala' | 'Tamil';
  onLanguageChange?: (lang: 'English' | 'Sinhala' | 'Tamil') => void;
  initialTopic?: string;
}

export const SafetyCenterPage: React.FC<SafetyCenterPageProps> = ({
  onNavigate,
  selectedLanguage = 'English',
  onLanguageChange,
  initialTopic
}) => {
  const [agreedChecked, setAgreedChecked] = useState<boolean>(() => {
    return localStorage.getItem('rentoura_safety_guidelines_read') === 'true';
  });

  const [currentLang, setCurrentLang] = useState<'English' | 'Sinhala' | 'Tamil'>(selectedLanguage);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Report State
  const [reportCategory, setReportCategory] = useState('Suspected Scam / Fake Listing');
  const [reportDescription, setReportDescription] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle initial topic anchor
  useEffect(() => {
    if (initialTopic) {
      const element = document.getElementById(initialTopic);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      }
    }
  }, [initialTopic]);

  const handleUnderstandAndContinue = () => {
    if (!agreedChecked) return;
    localStorage.setItem('rentoura_safety_guidelines_read', 'true');
    onNavigate('/');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'RENTOURA.LK Safety Center',
        text: 'Review essential safety guidelines, emergency contacts, and transaction precautions on RENTOURA.LK.',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDescription.trim()) return;

    setReportSubmitting(true);
    setReportError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const res = await ReportService.submitReport({
        reporterId: user?.id || 'guest-reporter',
        reporterName: user?.user_metadata?.full_name || user?.email || (reporterContact.trim() || 'Guest User'),
        reporterEmail: user?.email || (reporterContact.includes('@') ? reporterContact.trim() : undefined),
        targetType: 'user',
        targetId: 'safety-center-general-incident',
        targetModule: 'general',
        targetTitle: `Safety Concern: ${reportCategory}`,
        reasonCode: 'safety_concern',
        reasonLabel: reportCategory,
        description: reportDescription.trim(),
        contactInfo: reporterContact.trim() || user?.email || '',
        allowContact: true,
        source: 'safety_center'
      });

      if (res.success) {
        setReportSubmitted(true);
        setReportDescription('');
        setReporterContact('');
      } else {
        setReportError(res.error || 'Failed to submit report. Please try again.');
      }
    } catch (err: any) {
      console.error('[SafetyCenterPage] Error submitting report:', err);
      setReportError(err?.message || 'Network error submitting report. Please check your connection.');
    } finally {
      setReportSubmitting(false);
    }
  };

  const languageLabels = {
    English: '🇱🇰 English',
    Sinhala: '🇱🇰 සිංහල',
    Tamil: '🇱🇰 தமிழ்'
  };

  const topicChips = [
    { id: 'rentals', label: 'Renting Safely', icon: Car, color: 'text-[#1464F4]', bg: 'bg-blue-50' },
    { id: 'jobs', label: 'Job Safety', icon: Briefcase, color: 'text-[#08A34F]', bg: 'bg-emerald-50' },
    { id: 'services', label: 'Service Safety', icon: Wrench, color: 'text-[#FF650A]', bg: 'bg-orange-50' },
    { id: 'messaging', label: 'Safe Messaging', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'payments', label: 'Payments & Deposits', icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'meeting', label: 'Meeting Safely', icon: MapPin, color: 'text-sky-600', bg: 'bg-sky-50' },
    { id: 'scams', label: 'Avoid Scams', icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-50' },
    { id: 'report', label: 'Report a Problem', icon: Flag, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  const safetyFaqs = [
    {
      q: 'Should I pay any advance money before inspecting a rental or meeting in person?',
      a: 'No. RENTOURA.LK strongly advises never sending advance bank transfers or security deposits to unknown parties prior to inspecting the rental item, vehicle, or property in person.'
    },
    {
      q: 'Are job applicants ever required to pay registration or visa fees?',
      a: 'Never. Legitimate employers on RENTOURA.LK do not demand "registration fees", "processing deposits", or payment for job interviews. Any listing asking for payment to apply is a scam.'
    },
    {
      q: 'What should I do if someone asks for my OTP code, password, or bank PIN?',
      a: 'Never share your OTP (One-Time Password), account password, or bank PIN with anyone under any circumstances. RENTOURA.LK staff will NEVER ask for your password or OTP.'
    },
    {
      q: 'Does RENTOURA.LK inspect or guarantee every physical listing?',
      a: 'No. RENTOURA.LK is an open marketplace platform connecting users across Sri Lanka. Users are responsible for independently inspecting items, verifying property/owner identity, and confirming transaction terms.'
    },
    {
      q: 'How do I report a suspicious user or fake listing?',
      a: 'You can tap the "Report Listing" button on any item detail page, or use the "Report a Safety Concern" form below on this Safety Center page to notify our moderation team.'
    },
    {
      q: 'Where should I meet when renting an item or receiving a service?',
      a: 'Always choose public, well-lit places during daytime hours for item pickups or service consultations. Consider taking a friend or family member with you.'
    },
    {
      q: 'Is my national identity card (NIC) or passport safe to share casually?',
      a: 'Do not casually share photos of sensitive identity documents like your NIC, Passport, or Driving License. Only present identification in person when reasonably required for verified contracts.'
    },
    {
      q: 'What if a listing price looks unusually cheap or too good to be true?',
      a: 'If a rental price or job salary is suspiciously low/unrealistic compared to market rates, proceed with extreme caution as it is often a tactic used by scammers to lure victims.'
    }
  ];

  const filteredFaqs = safetyFaqs.filter(faq => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return faq.q.toLowerCase().includes(term) || faq.a.toLowerCase().includes(term);
  });

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
            {/* Share / Print Buttons */}
            <button
              type="button"
              onClick={handlePrint}
              title="Print Guidelines"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-all tap-bounce"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={handleShareLink}
              title="Share Safety Center Link"
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-all tap-bounce"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-[#1464F4]" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Share'}</span>
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
            <div className="inline-flex items-center gap-2">
              <h1 className="text-2xl sm:text-4xl font-black text-[#041C43] font-heading tracking-tight">
                Safety First, Always
              </h1>
              <div className="w-7 h-7 rounded-full bg-[#1464F4] text-white flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Your safety is our priority. Review these practical guidelines to trade, rent, hire, and communicate securely across Sri Lanka on RENTOURA.LK.
            </p>

            {/* Quick Search */}
            <div className="pt-2 relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search safety topics (e.g. advance payment, OTP, vehicle)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#1464F4] transition-all"
              />
            </div>
          </div>

          {/* Hero Shield Graphic */}
          <div className="shrink-0 w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-tr from-[#041C43] via-[#08285C] to-[#1464F4] p-4 text-white flex flex-col items-center justify-center text-center shadow-lg shadow-blue-500/20 relative">
            <ShieldCheck className="w-16 h-16 text-[#00C2FF] mb-1" />
            <span className="text-xs font-bold tracking-wide text-white">SAFETY CENTER</span>
            <RentouraLogo variant="icon-only" theme="dark-header" size="sm" />
          </div>
        </div>

        {/* CRITICAL SECURITY BANNER: NEVER SHARE OTP / PASSWORDS / NO ADVANCE PAYMENTS */}
        <div className="bg-rose-50 border-2 border-rose-200/90 rounded-3xl p-5 sm:p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-rose-900">
            <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 animate-pulse" />
            <h2 className="text-sm sm:text-base font-black uppercase tracking-wider font-heading">
              Critical Security Warning
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-rose-950 font-medium leading-relaxed pt-1">
            <div className="p-3.5 bg-white/80 rounded-2xl border border-rose-100 space-y-1">
              <p className="font-bold text-rose-900 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-rose-600 shrink-0" />
                Never Share OTP, Passwords, or Bank PINs
              </p>
              <p className="text-[11.5px] text-rose-900">
                RENTOURA.LK staff will NEVER call, text, or email asking for your password, SMS OTP, or bank card PIN. Anyone asking for these is attempting to scam you.
              </p>
            </div>

            <div className="p-3.5 bg-white/80 rounded-2xl border border-rose-100 space-y-1">
              <p className="font-bold text-rose-900 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-rose-600 shrink-0" />
                Never Make Advance Payments Before Inspection
              </p>
              <p className="text-[11.5px] text-rose-900">
                Do not send bank transfer deposits, reservation fees, or delivery charges before physically inspecting the property, vehicle, item, or meeting the seller in person.
              </p>
            </div>
          </div>
        </div>

        {/* QUICK TOPIC CHIPS NAVIGATION */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Quick Safety Topics
          </h2>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {topicChips.map((chip) => {
              const IconComp = chip.icon;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => scrollToSection(chip.id)}
                  className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-300 shadow-xs transition-all tap-bounce ${chip.bg}`}
                >
                  <IconComp className={`w-4 h-4 ${chip.color}`} />
                  <span className="text-xs font-bold text-slate-800">{chip.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SAFETY GUIDELINES 8-CARD GRID */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-slate-200/50 border border-slate-100 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-[#1464F4]" />
            <h2 className="text-base font-bold text-[#041C43] font-heading">
              Core Safety Guidelines
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Card 1 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3 hover:border-blue-200 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-blue-100/80 text-[#1464F4] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#041C43]">Meet in Safe Places</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                  Always meet in public, well-lit places during daylight hours for initial inspections or pickups. Avoid isolated locations.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3 hover:border-blue-200 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-blue-100/80 text-[#1464F4] flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#041C43]">Communicate Within the Platform</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                  Use our in-app messaging system to communicate and keep a record of all agreement terms and inquiries.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-amber-900">No Advance Payments</h3>
                <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
                  Do not make advance money transfers prior to physical inspection. All transaction payments occur directly between parties.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3 hover:border-blue-200 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-blue-100/80 text-[#1464F4] flex items-center justify-center shrink-0">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#041C43]">Review Available Listing Info</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                  Review available profile information, listing descriptions, and transaction history where provided before proceeding.
                </p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3 hover:border-blue-200 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-blue-100/80 text-[#1464F4] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#041C43]">Inspect Before You Pay</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                  For vehicle and equipment rentals or housing, physically inspect the item, check mileage/condition, and verify working state before paying.
                </p>
              </div>
            </div>

            {/* Card 6 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3 hover:border-blue-200 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-blue-100/80 text-[#1464F4] flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#041C43]">Protect Sensitive Identity Data</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                  Do not send photos of sensitive documents (NIC, Passport, Driving License) over unverified chats. Only present ID in person when legally necessary.
                </p>
              </div>
            </div>

            {/* Card 7 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3 hover:border-blue-200 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-blue-100/80 text-[#1464F4] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#041C43]">Trust Your Instincts</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                  If a deal seems unrealistically cheap or a party creates high pressure urgency, stop the interaction immediately.
                </p>
              </div>
            </div>

            {/* Card 8 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3 hover:border-blue-200 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-blue-100/80 text-[#1464F4] flex items-center justify-center shrink-0">
                <Flag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#041C43]">Report Suspicious Activity</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                  Report any suspicious users, fake listings, or advance fee demands to our moderation team via the form below.
                </p>
              </div>
            </div>
          </div>

          {/* Platform Role & Responsibility Disclaimer Banner */}
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-start gap-3 text-xs text-slate-700">
            <div className="w-8 h-8 rounded-full bg-[#1464F4] text-white flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
              i
            </div>
            <p className="text-[11.5px] leading-relaxed">
              <span className="font-bold text-[#041C43]">RENTOURA.LK Marketplace Role:</span> RENTOURA.LK is an online marketplace connecting listing providers and clients across Sri Lanka. RENTOURA.LK does not conduct physical property inspections or guarantee private agreements. Users are advised to independently inspect items, verify ownership, and agree on clear terms.
            </p>
          </div>
        </div>

        {/* WHAT TO DO STEPS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-slate-200/50 border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <CheckCircle2 className="w-5 h-5 text-[#1464F4]" />
            <h2 className="text-base font-bold text-[#041C43] font-heading">
              Recommended Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Step 1 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <h3 className="text-xs font-bold text-[#041C43]">Review History</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Review available profile information, listing descriptions, and transaction history where provided.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#041C43]">Meet Safely</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Meet in public daytime places and bring a companion when possible.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#041C43]">In-App Chat</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Keep all communications inside RENTOURA chat to maintain a clear trail.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#041C43]">Stay Alert</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Never send advance money prior to physical inspection.
              </p>
            </div>
          </div>
        </div>

        {/* EMERGENCY CONTACTS & DISCLAIMER */}
        <div className="bg-rose-50/70 border border-rose-200/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-rose-200">
            <div className="flex items-center gap-2">
              <div className="px-2.5 py-1 rounded-xl bg-rose-600 text-white font-bold text-[10px] tracking-wider uppercase">
                SOS
              </div>
              <h2 className="text-base font-bold text-rose-900 font-heading">
                Emergency Contacts & Legal Disclaimer
              </h2>
            </div>
            <p className="text-xs text-rose-700 font-medium">
              For immediate physical danger or crimes, contact Sri Lanka emergency authorities immediately.
            </p>
          </div>

          <p className="text-[11px] text-rose-900 leading-relaxed bg-white/60 p-3 rounded-2xl border border-rose-100">
            <strong>Emergency Disclaimer:</strong> RENTOURA.LK is an online classifieds platform and does not provide emergency dispatch or active security intervention. If you encounter active fraud, threats, or emergencies, contact the Sri Lanka Police or Emergency Services below.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Police */}
            <a
              href="tel:119"
              className="p-3.5 rounded-2xl bg-white border border-rose-100 shadow-xs hover:border-rose-300 transition-all flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-800">Police Emergency</p>
                <p className="text-sm font-black text-rose-600 font-mono">119</p>
              </div>
            </a>

            {/* Fire Service */}
            <a
              href="tel:110"
              className="p-3.5 rounded-2xl bg-white border border-rose-100 shadow-xs hover:border-rose-300 transition-all flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-800">Fire Service</p>
                <p className="text-sm font-black text-rose-600 font-mono">110</p>
              </div>
            </a>

            {/* Suwa Seriya Ambulance */}
            <a
              href="tel:1990"
              className="p-3.5 rounded-2xl bg-white border border-rose-100 shadow-xs hover:border-rose-300 transition-all flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-800">Suwa Seriya Ambulance</p>
                <p className="text-sm font-black text-rose-600 font-mono">1990</p>
              </div>
            </a>

            {/* Tourist Police */}
            <a
              href="tel:1912"
              className="p-3.5 rounded-2xl bg-white border border-rose-100 shadow-xs hover:border-rose-300 transition-all flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-800">Tourist Police</p>
                <p className="text-sm font-black text-rose-600 font-mono">1912</p>
              </div>
            </a>
          </div>
        </div>

        {/* DETAILED CATEGORIZED GUIDANCE SECTIONS */}
        <div className="space-y-6">

          {/* RENTAL SAFETY SECTION */}
          <div id="rentals" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4 scroll-mt-24">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1464F4] flex items-center justify-center shrink-0">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#041C43]">Renting Safely (Vehicles, Property & Items)</h3>
                <p className="text-[11px] text-slate-400">Essential checklist for renters and listing owners</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <p>When renting through RENTOURA.LK, follow these practical steps before finalizing deals:</p>
              <ul className="space-y-2 list-disc pl-4 text-[11.5px]">
                <li><strong className="text-slate-900">Inspect Property / Items in Person:</strong> Never pay rent or security deposits without physically inspecting the house, vehicle, camera, or machinery first.</li>
                <li><strong className="text-slate-900">Verify Owner Identity:</strong> Confirm the owner's legal authority to lease the property or item.</li>
                <li><strong className="text-slate-900">Vehicle Specifics:</strong> For cars and bikes, note existing scratches, test brakes, verify fuel level, and agree on daily mileage limits.</li>
                <li><strong className="text-slate-900">Clarify Deposits:</strong> Ensure security deposit return terms and damage liability conditions are clearly stated in writing.</li>
              </ul>
            </div>
          </div>

          {/* JOB SAFETY SECTION */}
          <div id="jobs" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4 scroll-mt-24">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#08A34F] flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#041C43]">Job Application Safety</h3>
                <p className="text-[11px] text-slate-400">Avoid employment scams and fake job offers</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-emerald-900 text-[11px] font-medium">
                🛡️ <strong className="text-emerald-950">Zero Fee Guarantee:</strong> Applying for a job on RENTOURA.LK is 100% free. Never pay any company for interview scheduling, uniform fees, or application processing.
              </div>
              <ul className="space-y-2 list-disc pl-4 text-[11.5px]">
                <li><strong className="text-slate-900">Independently Verify Employer:</strong> Research the company address, official website, and business registration details.</li>
                <li><strong className="text-slate-900">Protect Sensitive Passports & NIC:</strong> Do not send photos of sensitive identity documents until you have verified a legitimate employment contract in person.</li>
                <li><strong className="text-slate-900">Beware Unrealistic Salaries:</strong> Be cautious if an entry-level remote job promises unusually high earnings with no experience required.</li>
              </ul>
            </div>
          </div>

          {/* SERVICE SAFETY SECTION */}
          <div id="services" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4 scroll-mt-24">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF650A] flex items-center justify-center shrink-0">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#041C43]">Using & Offering Services Safely</h3>
                <p className="text-[11px] text-slate-400">For customers and skilled service providers</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 leading-relaxed text-[11.5px]">
              <p><strong className="text-slate-900">For Customers:</strong> Confirm service scope, hourly/fixed rate, required materials, and check previous customer reviews before hiring technicians or tutors.</p>
              <p><strong className="text-slate-900">For Service Providers:</strong> Confirm job locations beforehand, ensure personal safety when visiting customer premises, and agree on clear payment terms upon service completion.</p>
            </div>
          </div>

          {/* ADVANCE PAYMENT WARNING SECTION */}
          <div id="payments" className="bg-amber-50/80 rounded-3xl p-6 border border-amber-200/80 space-y-3 scroll-mt-24">
            <div className="flex items-center gap-2 pb-2 border-b border-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold text-amber-900">Be Careful With Advance Payments</h3>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              RENTOURA.LK does not encourage users to send money before appropriately verifying the person, listing, service, job, or transaction. Beware of fake reservation fees, delivery charges, or urgent bank transfer requests.
            </p>
          </div>

          {/* CHAT SAFETY SECTION */}
          <div id="messaging" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3 scroll-mt-24">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#041C43]">Chat & Messaging Safety</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Keep initial communications inside RENTOURA.LK messaging. Be suspicious if a party insists on moving immediately off-platform or sends unknown external links asking for login credentials.
            </p>
          </div>

          {/* MEETING SAFELY SECTION */}
          <div id="meeting" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3 scroll-mt-24">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#041C43]">Meeting Safely</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Always select busy public locations (e.g. near supermarkets, main roads, or prominent landmarks) during daylight hours when meeting for rental exchanges or service consultations. Tell a friend or family member where you are going.
            </p>
          </div>

          {/* COMMON SCAM WARNING SIGNS */}
          <div id="scams" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3 scroll-mt-24">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#041C43]">Common Scam Warning Signs</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              <div className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-100 flex items-center gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Demand for advance bank transfer prior to meeting</span>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-100 flex items-center gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Refusal to meet in person or show property</span>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-100 flex items-center gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Job registration or processing fee demands</span>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-100 flex items-center gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Requests for account OTP, passwords, or bank PINs</span>
              </div>
            </div>
          </div>

          {/* REAL BACKEND REPORT SAFETY CONCERN FORM */}
          <div id="report" className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-100 space-y-4 scroll-mt-24">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Flag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#041C43]">Report a Safety Concern</h3>
                  <p className="text-[11px] text-slate-400">Connected to RENTOURA Trust & Moderation System</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('/report-listing')}
                className="text-xs font-bold text-[#1464F4] hover:underline flex items-center gap-1"
              >
                <span>Report Specific Item</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {reportSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900">Report Submitted to Moderation Backend</h4>
                <p className="text-xs text-slate-600">
                  Thank you. Your report has been submitted to RENTOURA's moderation database for immediate review.
                </p>
                <button
                  type="button"
                  onClick={() => setReportSubmitted(false)}
                  className="mt-2 text-xs font-bold text-[#1464F4] hover:underline"
                >
                  Submit Another Report
                </button>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                {reportError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{reportError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Issue Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-[#1464F4]"
                  >
                    <option value="Suspected Scam / Fake Listing">Suspected Scam / Fake Listing</option>
                    <option value="Advance Payment / Deposit Demand">Advance Payment / Deposit Demand</option>
                    <option value="Fake Job / Upfront Fee Demand">Fake Job / Upfront Fee Demand</option>
                    <option value="Harassment / Unsafe Behavior">Harassment / Unsafe Behavior</option>
                    <option value="Impersonation or False Qualifications">Impersonation or False Qualifications</option>
                    <option value="Other Safety Violation">Other Safety Violation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Contact Email / Phone (Optional)
                  </label>
                  <input
                    type="text"
                    value={reporterContact}
                    onChange={(e) => setReporterContact(e.target.value)}
                    placeholder="Provide your email or phone if you wish moderation staff to follow up..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-[#1464F4]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Description & Details <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Describe the suspicious listing, user, message or safety concern..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-[#1464F4] resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={reportSubmitting || !reportDescription.trim()}
                  className="w-full py-3 rounded-2xl bg-[#1464F4] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all tap-bounce disabled:opacity-50"
                >
                  {reportSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Safety Report to Backend</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* SAFETY FAQ ACCORDION SECTION */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <HelpCircle className="w-5 h-5 text-[#1464F4]" />
              <h2 className="text-base font-bold text-[#041C43] font-heading">
                Frequently Asked Safety Questions
              </h2>
            </div>

            {filteredFaqs.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                No safety FAQs found matching "{searchTerm}". Try another search term.
              </p>
            ) : (
              <div className="space-y-2">
                {filteredFaqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between text-xs font-bold text-[#041C43] hover:bg-slate-100/50 transition-colors"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-[#1464F4] shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-3 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100/80 bg-white">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* BOTTOM CHECKLIST & AGREEMENT BUTTONS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-4">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreedChecked}
              onChange={(e) => setAgreedChecked(e.target.checked)}
              className="w-5 h-5 rounded-md border-slate-300 text-[#1464F4] focus:ring-[#1464F4]/30 transition-all cursor-pointer mt-0.5 shrink-0"
            />
            <div>
              <span className="text-xs font-bold text-slate-900">
                I have read and reviewed the Safety Guidelines <span className="text-rose-500">*</span>
              </span>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                I understand these safety recommendations (Local UI acknowledgment; formal legal terms governed by RENTOURA User Agreement).
              </p>
            </div>
          </label>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="w-full sm:w-auto flex-1 py-3 px-4 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all tap-bounce"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/user-agreement')}
              className="w-full sm:w-auto flex-1 py-3 px-4 rounded-2xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all tap-bounce"
            >
              <span>View Legal Agreement</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <button
              type="button"
              onClick={handleUnderstandAndContinue}
              disabled={!agreedChecked}
              className="w-full sm:w-auto flex-1 py-3 px-6 rounded-2xl bg-[#1464F4] hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all tap-bounce disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>I Understand & Continue</span>
            </button>
          </div>

          <p className="text-[10px] text-slate-400 font-medium text-center flex items-center justify-center gap-1 pt-1">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>Your safety and trust are our top priority.</span>
          </p>
        </div>

        {/* BACK TO TOP BUTTON */}
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
            <button type="button" onClick={() => onNavigate('/safety')} className="text-[#1464F4] hover:underline">
              Safety Center
            </button>
            <span>•</span>
            <button type="button" onClick={() => onNavigate('/user-agreement')} className="hover:underline">
              User Agreement
            </button>
            <span>•</span>
            <button type="button" onClick={() => onNavigate('/privacy-policy')} className="hover:underline">
              Privacy Policy
            </button>
            <span>•</span>
            <button type="button" onClick={() => onNavigate('/help')} className="hover:underline">
              Help Center
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
