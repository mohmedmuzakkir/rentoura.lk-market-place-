import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, 
  HelpCircle, 
  Search, 
  ShieldCheck, 
  FileText, 
  Phone, 
  Mail, 
  ChevronDown, 
  ChevronUp,
  ChevronRight,
  Rocket,
  User,
  PlusCircle,
  CreditCard,
  Gavel,
  Flag,
  Star,
  Headphones,
  MessageSquare,
  Sparkles,
  Lock,
  Lightbulb,
  X,
  CheckCircle2,
  ExternalLink,
  Globe,
  AlertTriangle,
  Send,
  Layers,
  Heart,
  Bell,
  Briefcase,
  Car,
  Wrench,
  Clock,
  Eye,
  AlertCircle
} from 'lucide-react';
import { RentouraLogo } from '../components/RentouraLogo';
import { AppRoute } from '../types';
import { SupportTicketService } from '../services/supportTicketService';
import { supabase } from '../lib/supabase';

interface HelpCenterPageProps {
  onNavigate: (route: AppRoute) => void;
  selectedLanguage?: 'English' | 'Sinhala' | 'Tamil';
  onLanguageChange?: (lang: 'English' | 'Sinhala' | 'Tamil') => void;
  initialTopic?: string;
}

interface HelpArticle {
  id: string;
  title: string;
  category: string;
  keywords: string[];
  summary: string;
  content: string[];
  relatedRoute?: AppRoute;
  relatedRouteLabel?: string;
}

export const HelpCenterPage: React.FC<HelpCenterPageProps> = ({
  onNavigate,
  selectedLanguage = 'English',
  onLanguageChange,
  initialTopic
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [currentLang, setCurrentLang] = useState<'English' | 'Sinhala' | 'Tamil'>(selectedLanguage);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  // Technical Support Report / Ticket Modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('Technical Issue');
  const [reportSubject, setReportSubject] = useState('');
  const [reportMessage, setReportMessage] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  // Language display
  const languageLabels = {
    English: '🇱🇰 English',
    Sinhala: '🇱🇰 සිංහල',
    Tamil: '🇱🇰 தமிழ்'
  };

  // Structured Help Categories matching Page 29 visual cards
  const popularTopics = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      subtitle: 'New to RENTOURA.LK? Learn the basics.',
      icon: Rocket,
      color: 'text-[#1464F4]',
      bgColor: 'bg-[#1464F4]/10',
      badge: 'Basics'
    },
    {
      id: 'account-profile',
      title: 'Account & Profile',
      subtitle: 'Manage your account, profile and settings.',
      icon: User,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      badge: 'Account'
    },
    {
      id: 'post-listing',
      title: 'Post a Listing',
      subtitle: 'Learn how to post rentals, jobs or services.',
      icon: PlusCircle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      badge: 'Post'
    },
    {
      id: 'payments',
      title: 'Payments & Deposits',
      subtitle: 'Payment methods, security and guidance.',
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      badge: 'Payments'
    },
    {
      id: 'safety-security',
      title: 'Safety & Security',
      subtitle: 'Safety tips and how we keep you safe.',
      icon: ShieldCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      badge: 'Safety'
    },
    {
      id: 'rules-policies',
      title: 'Rules & Policies',
      subtitle: 'Read our platform rules and policies.',
      icon: Gavel,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      badge: 'Legal'
    },
    {
      id: 'reports-issues',
      title: 'Reports & Issues',
      subtitle: 'Report a problem or inappropriate content.',
      icon: Flag,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      badge: 'Reports'
    },
    {
      id: 'trust-reviews',
      title: 'Trust & Reviews',
      subtitle: 'Ratings, reviews and building trust.',
      icon: Star,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50/80',
      badge: 'Trust'
    }
  ];

  // Comprehensive Database of Help Articles (Audited for real flows)
  const helpArticles: HelpArticle[] = [
    {
      id: 'what-is-rentoura',
      title: 'What is RENTOURA.LK and how does it work?',
      category: 'getting-started',
      keywords: ['rentoura', 'basics', 'rentals', 'jobs', 'services', 'overview', 'how it works'],
      summary: 'RENTOURA.LK is Sri Lanka\'s discovery marketplace connecting users for rentals, jobs, and professional services.',
      content: [
        'RENTOURA.LK connects users across Sri Lanka across three main modules: Rentals (properties, vehicles, equipment), Jobs (vacancies and hiring), and Skilled Services.',
        'Users can directly contact owners, employers, and service providers through in-app messaging or direct phone calls.',
        'RENTOURA.LK acts as an open discovery platform and does not own listed items, employ job applicants, or process direct monetary payments.'
      ]
    },
    {
      id: 'how-to-register',
      title: 'How to create a new account',
      category: 'account-profile',
      keywords: ['register', 'sign up', 'account', 'create account', 'new user'],
      summary: 'Creating an account on RENTOURA.LK takes less than a minute.',
      content: [
        'Tap "Register" in the top header or side drawer.',
        'Provide your Full Name, Email Address, and Sri Lankan Mobile Number.',
        'Create a secure password with at least 8 characters.',
        'Once registered, you can start posting listings, saving bookmarks, and messaging owners.'
      ],
      relatedRoute: '/register',
      relatedRouteLabel: 'Go to Registration'
    },
    {
      id: 'reset-password-help',
      title: 'Forgot or reset your password',
      category: 'account-profile',
      keywords: ['forgot password', 'reset password', 'change password', 'login issue', 'credentials'],
      summary: 'Easily recover your account if you forgot your password.',
      content: [
        'Navigate to the Login page and tap "Forgot Password?".',
        'Enter your registered email address.',
        'A secure password reset link will be sent to your email inbox.',
        'Follow the instructions in the email to set a new password.'
      ],
      relatedRoute: '/forgot-password',
      relatedRouteLabel: 'Reset Password Now'
    },
    {
      id: 'post-rental-listing',
      title: 'How to post a Rental, Job, or Service listing',
      category: 'post-listing',
      keywords: ['post rental', 'post job', 'post service', 'list car', 'list house', 'new listing', 'three way post'],
      summary: 'Step-by-step guide to publishing a listing across any of RENTOURA\'s three modules.',
      content: [
        'Tap the blue "+" button in the center of the bottom navigation bar (or top header).',
        'Choose whether to post a Rental (Property, Vehicles, Tools), a Job Vacancy, or a Skilled Service.',
        'Fill in the listing title, category, location, pricing, and detailed description.',
        'Upload clear photos for rental or service listings.',
        'Submit for review. All newly submitted listings enter "Pending Review" status prior to public display.'
      ],
      relatedRoute: '/post',
      relatedRouteLabel: 'Post a Listing Now'
    },
    {
      id: 'pending-listing-explanation',
      title: 'Why is my listing in "Pending Review"?',
      category: 'post-listing',
      keywords: ['pending', 'review', 'approval', 'how long', 'pending status', 'moderation'],
      summary: 'All new and resubmitted listings undergo manual moderation to maintain marketplace quality.',
      content: [
        'To protect users from scams, inappropriate content, and spam, our moderation team reviews all newly submitted listings.',
        'Listings are usually reviewed promptly within a few hours.',
        'You can check the real-time status of your submission in "My Listings" under your profile menu.',
        'Once approved, your listing status changes to "Active" and becomes visible publicly across Sri Lanka.'
      ],
      relatedRoute: '/my-listings',
      relatedRouteLabel: 'View My Listings'
    },
    {
      id: 'rejected-listing-guide',
      title: 'What to do if your listing is rejected or needs changes',
      category: 'post-listing',
      keywords: ['rejected', 'listing rejected', 'rejection reason', 'fix listing', 'changes requested'],
      summary: 'Understand why a listing was declined and how to edit and resubmit it.',
      content: [
        'Go to "My Listings" and check the "Rejected" or "Changes Requested" tab.',
        'Tap "View Reason" to see feedback from the moderation team (e.g., missing price, unclear photos, or invalid category).',
        'Tap "Edit", update the requested details, and resubmit for approval.'
      ],
      relatedRoute: '/my-listings',
      relatedRouteLabel: 'Manage My Listings'
    },
    {
      id: 'advance-payment-warning-help',
      title: 'Is it safe to make an advance payment or security deposit?',
      category: 'payments',
      keywords: ['advance payment', 'deposit', 'bank transfer', 'scam', 'paying upfront'],
      summary: 'Critical warning regarding advance money transfers before physical inspection.',
      content: [
        'RENTOURA.LK strongly advises NEVER sending advance bank transfers or security deposits to unknown parties.',
        'Always inspect the rental property, vehicle, or equipment in person first.',
        'Verify the owner\'s identity and confirm physical condition before transferring any money.',
        'Report any user who pressures you for urgent upfront payments.'
      ],
      relatedRoute: '/safety',
      relatedRouteLabel: 'Read Safety Center'
    },
    {
      id: 'how-to-report-problem',
      title: 'How to report a suspicious user or fake listing',
      category: 'reports-issues',
      keywords: ['report', 'fake listing', 'scam', 'harassment', 'report user', 'report problem'],
      summary: 'Protect the marketplace by reporting suspicious activity.',
      content: [
        'Open the detail page of any listing and tap "Report Listing".',
        'Alternatively, use the "Report a Safety Concern" form in our Safety Center.',
        'Select the reason (e.g., Suspected Scam, Upfront Fee Demand, Fake Job) and describe the issue.',
        'Our trust and moderation team reviews reports and takes action on fraudulent listings.'
      ],
      relatedRoute: '/safety',
      relatedRouteLabel: 'Open Safety Center'
    },
    {
      id: 'saved-listings-guide',
      title: 'How to save listings and view them later',
      category: 'getting-started',
      keywords: ['saved', 'bookmarks', 'favorite', 'heart', 'saved listings'],
      summary: 'Bookmark items you are interested in for quick access.',
      content: [
        'Tap the Heart icon on any rental, job, or service card.',
        'Access all your bookmarked items anytime under "Saved" in the bottom navigation bar.',
        'If a saved item is removed or updated by the owner, your saved list stays in sync.'
      ],
      relatedRoute: '/saved',
      relatedRouteLabel: 'View Saved Listings'
    },
    {
      id: 'chat-messaging-safety-help',
      title: 'Safe messaging and communication guidelines',
      category: 'safety-security',
      keywords: ['message', 'chat', 'contact', 'otp', 'password', 'safe chat'],
      summary: 'Keep initial conversations on RENTOURA.LK for safe record-keeping.',
      content: [
        'Use the in-app chat to communicate with listing owners and service providers.',
        'NEVER share your account password, SMS OTP code, or bank PIN with anyone.',
        'Be suspicious if someone asks to move immediately to off-platform channels or sends unknown web links.'
      ],
      relatedRoute: '/messages',
      relatedRouteLabel: 'Open Messages'
    },
    {
      id: 'user-agreement-and-terms',
      title: 'Understanding our User Agreement and Terms',
      category: 'rules-policies',
      keywords: ['user agreement', 'terms', 'privacy', 'rules', 'legal', 'policy'],
      summary: 'Learn about platform guidelines and legal obligations.',
      content: [
        'All users on RENTOURA.LK agree to post truthful, accurate listings and respect marketplace safety rules.',
        'RENTOURA.LK does not charge hidden platform fees for browsing or submitting standard job applications.',
        'Review the complete User Agreement and Privacy Policy for detailed information on user rights and responsibilities.'
      ],
      relatedRoute: '/user-agreement',
      relatedRouteLabel: 'Read User Agreement'
    }
  ];

  // FAQs matching Page 29 image
  const accordionFaqs = [
    {
      q: 'How do I create an account on RENTOURA.LK?',
      a: 'Tap "Register" in the header or side menu. Enter your name, email, Sri Lankan phone number, and password. Registration is 100% free for renters, job seekers, and customers.'
    },
    {
      q: 'How can I post a rental listing, job, or service?',
      a: 'Tap the blue "+" button in the bottom navigation, select your module (Rental, Job, or Service), fill in accurate descriptions and prices, upload photos, and submit for moderation review.'
    },
    {
      q: 'Is it safe to pay through RENTOURA.LK?',
      a: 'RENTOURA.LK is a discovery platform connecting users directly. Payments and lease agreements occur directly between users. Never send advance bank deposits before inspecting the item or property in person.'
    },
    {
      q: 'How do I contact the listing owner?',
      a: 'On any listing detail page, tap "Chat with Owner" to send an in-app message or tap "Call Owner" to connect via phone.'
    },
    {
      q: 'What should I do if I face an issue with a listing?',
      a: 'Tap the "Report Listing" button on the listing page, or use the "Report a Safety Concern" form in our Safety Center (/safety). Our trust team will review the issue.'
    },
    {
      q: 'Why is my listing in "Pending Review"?',
      a: 'All new submissions undergo manual moderation to prevent spam and fake ads. Review typically completes within a few hours.'
    },
    {
      q: 'How do I reset my password?',
      a: 'Go to the Login page, tap "Forgot Password?", and enter your registered email to receive a password reset link.'
    }
  ];

  // Synchronize URL search params (deep linking support)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('article');
    const categoryId = params.get('category');
    const query = params.get('q');

    if (articleId) {
      const art = helpArticles.find(a => a.id === articleId);
      if (art) setSelectedArticle(art);
    }
    if (categoryId) setSelectedCategory(categoryId);
    if (query) setSearchTerm(query);
  }, []);

  // Sync state to URL when article selection changes
  const handleSelectArticle = useCallback((art: HelpArticle | null) => {
    setSelectedArticle(art);
    const url = new URL(window.location.href);
    if (art) {
      url.searchParams.set('article', art.id);
    } else {
      url.searchParams.delete('article');
    }
    window.history.replaceState({}, '', url.toString());
  }, []);

  // Sync category change to URL
  const handleSelectCategory = useCallback((catId: string | null) => {
    setSelectedCategory(catId);
    const url = new URL(window.location.href);
    if (catId) {
      url.searchParams.set('category', catId);
    } else {
      url.searchParams.delete('category');
    }
    window.history.replaceState({}, '', url.toString());
  }, []);

  // Keyboard escape key handler for modal accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedArticle) handleSelectArticle(null);
        if (showReportModal) setShowReportModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedArticle, showReportModal, handleSelectArticle]);

  // Pre-fill user contact email if logged in
  useEffect(() => {
    if (showReportModal) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user?.email && !contactEmail) {
          setContactEmail(user.email);
        }
      }).catch(() => {});
    }
  }, [showReportModal, contactEmail]);

  // Filter articles by search term or category
  const filteredArticles = helpArticles.filter(art => {
    const matchesSearch = searchTerm === '' || 
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !selectedCategory || art.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle Support Form Submit connected to real SupportTicketService backend
  const handleSupportFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportMessage.trim() || !contactEmail.trim() || !reportSubject.trim()) return;

    setReportSubmitting(true);
    setReportError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const result = await SupportTicketService.submitTicket({
        userId: user?.id,
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
        category: reportType,
        subject: reportSubject.trim(),
        message: reportMessage.trim(),
        source: 'help_center'
      });

      if (result.success) {
        setReportSubmitted(true);
        setReportMessage('');
        setReportSubject('');
      } else {
        setReportError(result.error || 'Failed to submit support ticket. Please check your details.');
      }
    } catch (err: any) {
      console.error('[HelpCenterPage] Error submitting support ticket:', err);
      setReportError(err?.message || 'Network error submitting ticket. Please try again.');
    } finally {
      setReportSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between relative selection:bg-blue-100 selection:text-[#1464F4]">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 left-0 w-[450px] h-[450px] bg-sky-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER */}
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

      {/* MAIN CONTENT AREA */}
      <main className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8 flex-1 space-y-8">

        {/* HERO SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-3 max-w-xl">
            <h1 className="text-2xl sm:text-4xl font-black font-heading tracking-tight">
              <span className="text-[#041C43]">Help </span>
              <span className="text-[#1464F4]">Center</span>
            </h1>

            <div className="space-y-1">
              <h2 className="text-sm sm:text-base font-bold text-slate-800">
                How can we help you today?
              </h2>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Find answers, guides and support for using RENTOURA.LK.
              </p>
            </div>

            {/* Primary Search Bar */}
            <div className="pt-2 relative max-w-md">
              <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedCategory(null);
                }}
                placeholder="Search for help articles, topics or questions..."
                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#1464F4] transition-all shadow-2xs"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 text-xs"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Headset Graphic Illustration Box */}
          <div className="shrink-0 w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-tr from-[#041C43] via-[#08285C] to-[#1464F4] p-4 text-white flex flex-col items-center justify-center text-center shadow-lg shadow-blue-500/20 relative">
            <Headphones className="w-16 h-16 text-[#00C2FF] mb-1" />
            <span className="text-xs font-bold tracking-wide text-white">24/7 HELP HUB</span>
            <span className="text-[10px] text-slate-200">RENTOURA.LK</span>
          </div>
        </div>

        {/* SEARCH RESULTS VIEW (if actively searching) */}
        {searchTerm && (
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-[#041C43]">
                Search Results ({filteredArticles.length})
              </h2>
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="text-xs text-[#1464F4] hover:underline font-semibold"
              >
                Clear Search
              </button>
            </div>

            {filteredArticles.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">No matching help articles found for "{searchTerm}".</p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
                  >
                    Browse Categories
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('/safety')}
                    className="px-4 py-2 rounded-xl bg-[#1464F4] text-white text-xs font-bold"
                  >
                    Safety Center
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredArticles.map((art) => (
                  <button
                    key={art.id}
                    type="button"
                    onClick={() => handleSelectArticle(art)}
                    className="w-full p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 text-left transition-all group flex items-start justify-between gap-3"
                  >
                    <div>
                      <h3 className="text-xs font-bold text-[#041C43] group-hover:text-[#1464F4]">
                        {art.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                        {art.summary}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1464F4] shrink-0 mt-1" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* POPULAR TOPICS GRID */}
        {!searchTerm && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-4 rounded-full bg-[#1464F4]" />
                <h2 className="text-base font-bold text-[#041C43] font-heading">
                  Popular Topics
                </h2>
              </div>
              {selectedCategory && (
                <button
                  type="button"
                  onClick={() => handleSelectCategory(null)}
                  className="text-xs text-[#1464F4] hover:underline font-bold"
                >
                  Show All Topics
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {popularTopics.map((topic) => {
                const IconComp = topic.icon;
                const isSelected = selectedCategory === topic.id;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleSelectCategory(isSelected ? null : topic.id)}
                    className={`p-4 rounded-3xl text-left border transition-all tap-bounce relative group flex flex-col justify-between ${
                      isSelected 
                        ? 'bg-blue-50/80 border-[#1464F4] shadow-md' 
                        : 'bg-white border-slate-100 hover:border-blue-200 shadow-xs hover:shadow-md'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-2xl ${topic.bgColor} ${topic.color} flex items-center justify-center shrink-0`}>
                          <IconComp className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {topic.badge}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-[#041C43] group-hover:text-[#1464F4] transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">
                        {topic.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center justify-end mt-4 pt-2 border-t border-slate-100/80">
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1464F4] transition-colors" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* FILTERED ARTICLES VIEW BY CATEGORY */}
        {selectedCategory && !searchTerm && (
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-[#041C43]">
                Category Help Articles ({filteredArticles.length})
              </h2>
              <button
                type="button"
                onClick={() => handleSelectCategory(null)}
                className="text-xs text-[#1464F4] font-bold hover:underline"
              >
                Close Category Filter
              </button>
            </div>

            <div className="space-y-2">
              {filteredArticles.map((art) => (
                <button
                  key={art.id}
                  type="button"
                  onClick={() => handleSelectArticle(art)}
                  className="w-full p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 text-left transition-all flex items-start justify-between gap-3 group"
                >
                  <div>
                    <h3 className="text-xs font-bold text-[#041C43] group-hover:text-[#1464F4]">
                      {art.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                      {art.summary}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1464F4] shrink-0 mt-1" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STILL NEED HELP BANNER */}
        <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 rounded-3xl p-6 sm:p-8 border border-blue-100/80 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#1464F4] text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
              <Headphones className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#041C43] font-heading">
                Still need help?
              </h2>
              <p className="text-xs text-slate-600 font-medium leading-relaxed mt-0.5">
                Our support team is ready to assist you. Submit an inquiry to our support backend.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center gap-1 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                setShowReportModal(true);
                setReportSubmitted(false);
                setReportError(null);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#1464F4] hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all tap-bounce"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact Support</span>
            </button>
            <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Direct Backend Support</span>
          </div>
        </div>

        {/* FREQUENTLY ASKED QUESTIONS + SUPPORT CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: FAQ Accordion */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#1464F4]" />
                <h2 className="text-base font-bold text-[#041C43] font-heading">
                  Frequently Asked Questions
                </h2>
              </div>
            </div>

            <div className="space-y-2">
              {accordionFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/60">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full px-4 py-3.5 text-left flex items-center justify-between gap-3 text-xs font-bold text-[#041C43] hover:bg-slate-100/50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-blue-100 text-[#1464F4] flex items-center justify-center shrink-0 text-[10px]">
                          ?
                        </div>
                        <span>{faq.q}</span>
                      </div>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-[#1464F4] shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100/80 bg-white">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Side Support Cards */}
          <div className="space-y-4">

            {/* Technical Problem Card */}
            <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-md space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#041C43]">Report an Issue</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                  Report a technical problem, bug or inappropriate marketplace content.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setReportType('Technical Issue');
                  setShowReportModal(true);
                  setReportSubmitted(false);
                  setReportError(null);
                }}
                className="w-full py-2.5 rounded-2xl border border-emerald-300 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100 text-xs font-bold transition-all tap-bounce"
              >
                Report Issue
              </button>
            </div>

            {/* Send Message Card */}
            <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-md space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#041C43]">Send Inquiry</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                  Submit your query directly to our support ticket database.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setReportType('General Inquiry');
                  setShowReportModal(true);
                  setReportSubmitted(false);
                  setReportError(null);
                }}
                className="w-full py-2.5 rounded-2xl border border-purple-200 text-purple-700 bg-purple-50/50 hover:bg-purple-100 text-xs font-bold transition-all tap-bounce"
              >
                Send Message
              </button>
            </div>

            {/* Safety Hub Link Card */}
            <div className="p-5 rounded-3xl bg-blue-50/80 border border-blue-100 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#1464F4]" />
                <h3 className="text-xs font-bold text-[#041C43]">Marketplace Safety</h3>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Read essential precautions for property rentals, vehicle rentals, jobs, and payments.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('/safety')}
                className="w-full py-2.5 rounded-2xl bg-[#1464F4] text-white text-xs font-bold shadow-xs hover:bg-blue-600 transition-all tap-bounce flex items-center justify-center gap-1.5"
              >
                <span>Visit Safety Center</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

        {/* TIP FOR FASTER SOLUTION BANNER */}
        <div className="p-4 sm:p-5 rounded-3xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-900">Tip for a faster solution</h3>
              <p className="text-[11px] text-amber-800 font-medium">
                Check our Help Articles and FAQs first — most common questions are answered here!
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-amber-700 shrink-0 hidden sm:block" />
        </div>

      </main>

      {/* ARTICLE READER MODAL */}
      {selectedArticle && (
        <div 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="article-modal-title"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => handleSelectArticle(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => handleSelectArticle(null)}
              aria-label="Close Help Article"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-[#1464F4] uppercase tracking-wider">
                Help Article
              </span>
              <h2 id="article-modal-title" className="text-lg font-bold text-[#041C43] font-heading pr-6">
                {selectedArticle.title}
              </h2>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
              {selectedArticle.content.map((paragraph, idx) => (
                <p key={idx} className="flex items-start gap-2">
                  <span className="text-[#1464F4] font-bold">•</span>
                  <span>{paragraph}</span>
                </p>
              ))}
            </div>

            {selectedArticle.relatedRoute && (
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    const route = selectedArticle.relatedRoute!;
                    handleSelectArticle(null);
                    onNavigate(route);
                  }}
                  className="w-full py-3 rounded-2xl bg-[#1464F4] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all tap-bounce"
                >
                  <span>{selectedArticle.relatedRouteLabel || 'Go to Feature'}</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TECHNICAL / SUPPORT TICKET MODAL */}
      {showReportModal && (
        <div 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="support-modal-title"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => {
            setShowReportModal(false);
            setReportSubmitted(false);
            setReportError(null);
          }}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                setShowReportModal(false);
                setReportSubmitted(false);
                setReportError(null);
              }}
              aria-label="Close Support Form"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Headphones className="w-5 h-5 text-[#1464F4]" />
              <h2 id="support-modal-title" className="text-base font-bold text-[#041C43]">Contact Support / Submit Ticket</h2>
            </div>

            {reportSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">Support Request Received</h3>
                <p className="text-xs text-slate-600">
                  Thank you! Your inquiry has been submitted to RENTOURA support. Our team will review and respond as soon as possible.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowReportModal(false);
                    setReportSubmitted(false);
                    setReportError(null);
                  }}
                  className="mt-2 px-6 py-2.5 rounded-2xl bg-[#1464F4] text-white font-bold text-xs shadow-md"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSupportFormSubmit} className="space-y-4">
                {reportError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{reportError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Topic / Category
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-[#1464F4]"
                  >
                    <option value="Technical Issue">Technical Problem / Bug</option>
                    <option value="Account & Login">Account & Login Question</option>
                    <option value="Listing Approval">Listing Approval / Pending Question</option>
                    <option value="General Inquiry">General Marketplace Inquiry</option>
                    <option value="Safety Concern">Safety & Fraud Report</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Contact Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-[#1464F4]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="e.g. 0771234567"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-[#1464F4]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Subject <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={reportSubject}
                    onChange={(e) => setReportSubject(e.target.value)}
                    placeholder="Brief summary of your issue..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-[#1464F4]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Details & Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={reportMessage}
                    onChange={(e) => setReportMessage(e.target.value)}
                    placeholder="Describe what happened or what assistance you need..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-[#1464F4] resize-none"
                    required
                  />
                </div>

                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Never share your account password, SMS OTP code, or bank card PIN.</span>
                </div>

                <button
                  type="submit"
                  disabled={reportSubmitting || !reportMessage.trim() || !contactEmail.trim() || !reportSubject.trim()}
                  className="w-full py-3 rounded-2xl bg-[#1464F4] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all tap-bounce disabled:opacity-50"
                >
                  {reportSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Ticket to Support</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="w-full bg-white border-t border-slate-200/80 py-6 px-4 mt-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <RentouraLogo variant="header" theme="light" className="scale-75 origin-left" />
            <span>— © 2026 RENTOURA.LK. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-bold text-slate-600">
            <button type="button" onClick={() => onNavigate('/help')} className="text-[#1464F4] hover:underline">
              Help Center
            </button>
            <span>•</span>
            <button type="button" onClick={() => onNavigate('/safety')} className="hover:underline">
              Safety Center
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
