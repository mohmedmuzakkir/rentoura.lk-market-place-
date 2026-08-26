import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Star, 
  Search, 
  Filter, 
  ThumbsUp, 
  ShieldCheck, 
  Plus, 
  Sparkles, 
  Globe, 
  Building, 
  CheckCircle2, 
  Flag, 
  Trash2, 
  Edit, 
  CornerDownRight, 
  ExternalLink, 
  AlertTriangle 
} from 'lucide-react';
import { AppRoute } from '../types';
import { RentouraLogo } from '../components/RentouraLogo';
import { CanonicalReview, ReviewFilterParams, ReviewSummary, ReviewModule } from '../types/reviewTypes';
import { ReviewService } from '../services/reviewService';
import { AuthService } from '../services/authService';
import { WriteReviewModal, ReviewTargetContext } from '../components/reviews/WriteReviewModal';
import { ReportReviewModal } from '../components/reviews/ReportReviewModal';
import { supabase } from '../lib/supabase';

interface ReviewsPageProps {
  onNavigate: (route: AppRoute) => void;
  targetListingId?: string | null;
  targetUserId?: string | null;
  targetModule?: ReviewModule | 'all';
  onOpenListingDetail?: (listingId: string, module: ReviewModule) => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({
  onNavigate,
  targetListingId = null,
  targetUserId = null,
  targetModule = 'all',
  onOpenListingDetail
}) => {
  const currentUser = AuthService.getCurrentUser();

  // Language state
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'SI' | 'TA'>('EN');

  // Filter State
  const [activeTab, setActiveTab] = useState<'all' | 'my_written' | 'my_received'>('all');
  const [activeModule, setActiveModule] = useState<ReviewModule | 'all'>(targetModule || 'all');
  const [activeStarFilter, setActiveStarFilter] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'highest' | 'lowest' | 'most_helpful'>('latest');

  // Modal States
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reviewToReport, setReviewToReport] = useState<CanonicalReview | null>(null);
  const [reviewToEdit, setReviewToEdit] = useState<CanonicalReview | null>(null);

  // Reply State
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [actionError, setActionError] = useState<string | null>(null);

  // Active Context Listing Info fetched dynamically from Supabase
  const [targetListing, setTargetListing] = useState<{
    id: string;
    title: string;
    imageUrl?: string;
    location?: string;
    module: ReviewModule;
    ownerId?: string;
  } | null>(null);

  useEffect(() => {
    if (!targetListingId) {
      setTargetListing(null);
      return;
    }

    async function loadListingContext() {
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('id, title, thumbnail_url, images, location_name, district, module, user_id')
          .eq('id', targetListingId)
          .maybeSingle();

        if (data) {
          setTargetListing({
            id: data.id,
            title: data.title,
            imageUrl: data.thumbnail_url || (Array.isArray(data.images) ? data.images[0] : undefined),
            location: data.location_name || data.district || 'Sri Lanka',
            module: data.module as ReviewModule,
            ownerId: data.user_id
          });
        } else {
          setTargetListing(null);
        }
      } catch (err) {
        console.error('Failed to load target listing:', err);
        setTargetListing(null);
      }
    }

    loadListingContext();
  }, [targetListingId]);

  // Data Loading
  const [reviews, setReviews] = useState<CanonicalReview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<ReviewSummary>({
    averageRating: 0,
    totalCount: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    categoryBreakdown: {
      communication: 0,
      trustworthiness: 0,
      itemOrServiceQuality: 0,
      valueForMoney: 0,
      timeliness: 0
    }
  });

  const refreshReviews = async () => {
    setIsLoading(true);
    const params: ReviewFilterParams = {
      listingId: targetListingId || undefined,
      userId: targetUserId || undefined,
      targetModule: activeModule,
      ratingFilter: activeStarFilter,
      searchQuery,
      sortBy,
      tab: activeTab
    };

    try {
      const fetched = await ReviewService.fetchFilteredReviews(params, currentUser?.id);
      setReviews(fetched);

      const sum = await ReviewService.fetchSummary(targetListingId || undefined, activeModule !== 'all' ? activeModule : undefined);
      setSummary(sum);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshReviews();
  }, [targetListingId, targetUserId, activeModule, activeStarFilter, searchQuery, sortBy, activeTab]);

  // Handle Helpful Click
  const handleToggleHelpful = async (reviewId: string) => {
    const userId = currentUser ? currentUser.id : 'usr-guest-voter';
    await ReviewService.toggleHelpful(reviewId, userId);
    refreshReviews();
  };

  // Handle Delete Review
  const handleDeleteReview = async (reviewId: string) => {
    if (!currentUser) return;
    if (window.confirm('Are you sure you want to delete this review?')) {
      const res = await ReviewService.deleteReview(reviewId, currentUser.id);
      if (res.success) {
        refreshReviews();
      } else {
        setActionError(res.error || 'Failed to delete review.');
      }
    }
  };

  // Handle Submit Reply
  const handleOwnerReplySubmit = async (e: React.FormEvent, reviewId: string) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const ownerName = currentUser ? (currentUser.user_metadata?.full_name || currentUser.email || 'Listing Owner') : 'Listing Owner';
    const res = await ReviewService.addOwnerReply(reviewId, ownerName, replyText);
    if (res.success) {
      setReplyingReviewId(null);
      setReplyText('');
      refreshReviews();
    } else {
      setActionError(res.error || 'Failed to submit response.');
    }
  };

  // Target context for WriteReviewModal
  const writeTargetContext: ReviewTargetContext | null = targetListing
    ? {
        id: targetListing.id,
        title: targetListing.title,
        imageUrl: targetListing.imageUrl,
        location: targetListing.location,
        module: targetListing.module,
        ownerId: targetListing.ownerId
      }
    : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-28">
      
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors tap-bounce shrink-0"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div onClick={() => onNavigate('/')} className="cursor-pointer">
              <RentouraLogo />
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl text-[11px] font-bold text-slate-600">
            <Globe className="w-3.5 h-3.5 text-[#1464F4] ml-1" />
            {(['EN', 'SI', 'TA'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  selectedLanguage === lang ? 'bg-white text-[#1464F4] shadow-xs font-black' : 'hover:text-slate-900'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-4xl mx-auto px-4 pt-4 space-y-5">

        {/* Action Error Alert */}
        {actionError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{actionError}</span>
            </div>
            <button onClick={() => setActionError(null)} className="text-rose-600 font-bold hover:underline ml-2">
              Dismiss
            </button>
          </div>
        )}

        {/* 2. HERO BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#041C43] via-[#0a3170] to-[#1464F4] p-6 sm:p-8 text-white shadow-xl">
          <div className="relative z-10 max-w-lg space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/15">
              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>Marketplace Ratings & Feedback</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-heading">
              Community Reviews & Ratings
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              Transparent feedback from community members and clients across Sri Lanka.
            </p>
          </div>

          <div className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 items-center gap-4 text-white shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-black text-2xl shadow-lg">
              {summary.averageRating > 0 ? summary.averageRating.toFixed(1) : '0.0'}
            </div>
            <div>
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(summary.averageRating)
                        ? 'fill-amber-300 text-amber-300'
                        : 'text-white/30'
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs font-bold text-white">Trust & Authenticity</div>
              <div className="text-[10px] text-slate-200">
                {summary.totalCount} {summary.totalCount === 1 ? 'Review' : 'Reviews'} Published
              </div>
            </div>
          </div>
        </div>

        {/* 3. CONTEXTUAL LISTING BANNER */}
        {targetListing && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              {targetListing.imageUrl ? (
                <img
                  src={targetListing.imageUrl}
                  alt={targetListing.title}
                  className="w-12 h-12 rounded-xl object-cover shrink-0 border border-blue-200 shadow-xs"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                  <Building className="w-6 h-6" />
                </div>
              )}
              <div>
                <div className="text-[10px] font-bold text-[#1464F4] uppercase tracking-wider">
                  Target Listing
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-[#041C43]">
                  {targetListing.title}
                </h2>
                <span className="text-[11px] text-slate-500">📍 {targetListing.location}</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (onOpenListingDetail) {
                  onOpenListingDetail(targetListing.id, targetListing.module);
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-white border border-blue-200 text-[#1464F4] font-bold text-xs hover:bg-blue-100/50 transition-colors shrink-0"
            >
              View Listing
            </button>
          </div>
        )}

        {/* 4. OVERALL RATING & DISTRIBUTION PANEL */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Overall Score Box */}
            <div className="md:col-span-4 bg-slate-50 rounded-2xl p-5 border border-slate-100 text-center flex flex-col items-center justify-center space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Overall Rating
              </span>

              <div className="text-4xl sm:text-5xl font-black text-[#041C43] font-heading">
                {summary.totalCount > 0 ? summary.averageRating.toFixed(1) : '0.0'}
              </div>

              {/* Stars */}
              <div className="flex gap-1 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      summary.totalCount > 0 && star <= Math.round(summary.averageRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>

              <div className="text-xs font-bold text-slate-600">
                Based on <span className="text-[#1464F4]">{summary.totalCount}</span> {summary.totalCount === 1 ? 'review' : 'reviews'}
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200 mt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                <span>Community Reviews</span>
              </div>
            </div>

            {/* Distribution Bar Chart */}
            <div className="md:col-span-8 space-y-2.5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Rating Distribution
              </h3>

              {[5, 4, 3, 2, 1].map((star) => {
                const count = summary.distribution[star as 1 | 2 | 3 | 4 | 5] || 0;
                const percentage = summary.totalCount > 0 ? Math.round((count / summary.totalCount) * 100) : 0;

                return (
                  <div key={star} className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 w-12 shrink-0 font-bold text-slate-700">
                      <span>{star}</span>
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    </div>

                    <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden relative border border-slate-200/50">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <span className="w-8 text-right text-slate-500 font-bold text-[11px]">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Category Breakdown Ratings Bar */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-[#041C43] mb-3">
              Detailed Category Scores
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-400 font-semibold">Communication</div>
                <div className="text-sm font-black text-[#041C43] mt-0.5 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{summary.totalCount > 0 ? summary.categoryBreakdown.communication.toFixed(1) : '0.0'}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-400 font-semibold">Listing Accuracy</div>
                <div className="text-sm font-black text-[#041C43] mt-0.5 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{summary.totalCount > 0 ? summary.categoryBreakdown.trustworthiness.toFixed(1) : '0.0'}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-400 font-semibold">Quality & Condition</div>
                <div className="text-sm font-black text-[#041C43] mt-0.5 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{summary.totalCount > 0 ? summary.categoryBreakdown.itemOrServiceQuality.toFixed(1) : '0.0'}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-400 font-semibold">Value for Money</div>
                <div className="text-sm font-black text-[#041C43] mt-0.5 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{summary.totalCount > 0 ? summary.categoryBreakdown.valueForMoney.toFixed(1) : '0.0'}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 5. TABS & MODULE FILTERS */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-[#1464F4] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Reviews
            </button>
            {currentUser && (
              <>
                <button
                  onClick={() => setActiveTab('my_written')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'my_written'
                      ? 'bg-[#1464F4] text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  My Written
                </button>
                <button
                  onClick={() => setActiveTab('my_received')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'my_received'
                      ? 'bg-[#1464F4] text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Received
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {(['all', 'rentals', 'jobs', 'services'] as const).map((mod) => (
              <button
                key={mod}
                onClick={() => setActiveModule(mod)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                  activeModule === mod
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {mod === 'all' ? 'All Modules' : mod}
              </button>
            ))}
          </div>
        </div>

        {/* 6. SEARCH & STAR FILTERS */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reviews by keyword, author, or listing title..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#1464F4] focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={activeStarFilter}
              onChange={(e) => setActiveStarFilter(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#1464F4]"
            >
              <option value={0}>All Stars</option>
              <option value={5}>5 Stars Only</option>
              <option value={4}>4 Stars Only</option>
              <option value={3}>3 Stars Only</option>
              <option value={2}>2 Stars Only</option>
              <option value={1}>1 Star Only</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#1464F4]"
            >
              <option value="latest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="most_helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        {/* 7. REVIEWS LIST */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
              <div className="w-8 h-8 border-3 border-[#1464F4] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-medium">Loading reviews from database...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#041C43]">No Reviews Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No published reviews match your current filters. Be the first community member to write a review!
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveStarFilter(0);
                  setActiveModule('all');
                  setActiveTab('all');
                }}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            reviews.map((review) => {
              const isAuthor = Boolean(currentUser && currentUser.id === review.authorId);
              const isOwner = Boolean(currentUser && review.targetOwnerId === currentUser.id);

              const moduleStyle = {
                rentals: { label: 'RENTAL', bg: 'bg-[#1464F4]/10 text-[#1464F4]' },
                jobs: { label: 'JOB', bg: 'bg-[#08A34F]/10 text-[#08A34F]' },
                services: { label: 'SERVICE', bg: 'bg-[#FF650A]/10 text-[#FF650A]' }
              }[review.targetModule] || { label: 'MARKETPLACE', bg: 'bg-slate-100 text-slate-700' };

              return (
                <div 
                  key={review.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4 hover:border-blue-200 transition-all"
                >
                  
                  {/* CARD HEADER: AUTHOR INFO + TARGET COVER THUMBNAIL */}
                  <div className="flex items-start justify-between gap-3">
                    
                    {/* Left: Author Identity */}
                    <div className="flex items-center gap-3">
                      {review.authorAvatar ? (
                        <img
                          src={review.authorAvatar}
                          alt={review.authorName}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center ring-2 ring-slate-100">
                          {review.authorName.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-xs sm:text-sm text-[#041C43]">
                            {review.authorName}
                          </h4>
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            Community Member
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium mt-0.5">
                          <span>{review.createdAt}</span>
                          {review.locationName && (
                            <>
                              <span>•</span>
                              <span>📍 {review.locationName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Listing Thumbnail */}
                    {review.targetImageUrl && (
                      <div 
                        onClick={() => {
                          if (onOpenListingDetail) {
                            onOpenListingDetail(review.targetId, review.targetModule);
                          }
                        }}
                        className="cursor-pointer shrink-0 group"
                      >
                        <img
                          src={review.targetImageUrl}
                          alt={review.targetTitle}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-200 group-hover:scale-105 transition-transform shadow-xs"
                        />
                      </div>
                    )}
                  </div>

                  {/* TARGET LISTING LINK */}
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${moduleStyle.bg}`}>
                        {moduleStyle.label}
                      </span>
                      <span className="text-xs font-bold text-slate-800 truncate">
                        Reviewed "{review.targetTitle}"
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (onOpenListingDetail) {
                          onOpenListingDetail(review.targetId, review.targetModule);
                        }
                      }}
                      className="text-[11px] font-bold text-[#1464F4] hover:underline flex items-center gap-0.5 shrink-0"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  {/* RATING STARS & TAG */}
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.overallRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>

                    <span className="text-xs font-bold text-slate-800">
                      {review.overallRating.toFixed(1)}
                    </span>

                    {review.experienceTag && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                        {review.experienceTag}
                      </span>
                    )}
                  </div>

                  {/* REVIEW BODY */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {review.body}
                  </p>

                  {/* CARD ACTIONS ROW */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    
                    {/* Helpful Vote Button */}
                    <button
                      onClick={() => handleToggleHelpful(review.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all tap-bounce ${
                        currentUser && review.helpfulUserIds.includes(currentUser.id)
                          ? 'bg-blue-50 border-blue-200 text-[#1464F4]'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Helpful ({review.helpfulCount})</span>
                    </button>

                    {/* Action buttons (Report / Edit / Delete / Reply) */}
                    <div className="flex items-center gap-2">
                      {isAuthor && (
                        <>
                          <button
                            onClick={() => {
                              setReviewToEdit(review);
                              setIsWriteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#1464F4] hover:bg-blue-50 transition-colors"
                            title="Edit Review"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {isOwner && !review.ownerReply && (
                        <button
                          onClick={() => setReplyingReviewId(replyingReviewId === review.id ? null : review.id)}
                          className="px-2.5 py-1 rounded-xl bg-blue-50 text-[#1464F4] font-bold text-[11px] hover:bg-blue-100"
                        >
                          Reply
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setReviewToReport(review);
                          setIsReportModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Report Review"
                      >
                        <Flag className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                  {/* INLINE OWNER REPLY FORM */}
                  {replyingReviewId === review.id && (
                    <form onSubmit={(e) => handleOwnerReplySubmit(e, review.id)} className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-2">
                      <div className="text-[11px] font-bold text-[#041C43]">
                        Write response as listing owner:
                      </div>
                      <textarea
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Thank the reviewer or address feedback..."
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 resize-none focus:outline-none focus:border-[#1464F4]"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setReplyingReviewId(null)}
                          className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 bg-[#1464F4] text-white text-xs font-bold rounded-lg shadow-xs"
                        >
                          Submit Response
                        </button>
                      </div>
                    </form>
                  )}

                  {/* NESTED OWNER REPLY CARD */}
                  {review.ownerReply && (
                    <div className="mt-3 p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-1.5 ml-4 sm:ml-8">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#041C43]">
                        <CornerDownRight className="w-3.5 h-3.5 text-[#1464F4]" />
                        <span>Response from {review.ownerReply.authorName}</span>
                        <span className="text-[10px] text-slate-400 font-normal ml-auto">
                          {review.ownerReply.createdAt}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium pl-5">
                        {review.ownerReply.body}
                      </p>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

        {/* 8. SHARE YOUR EXPERIENCE FLOATING BANNER */}
        <div className="bg-gradient-to-r from-[#041C43] to-[#1464F4] rounded-3xl p-6 text-white text-center space-y-3 shadow-lg">
          <Sparkles className="w-8 h-8 text-amber-300 mx-auto" />
          <h3 className="text-base sm:text-lg font-bold font-heading">
            Have you completed a transaction or rental on RENTOURA.LK?
          </h3>
          <p className="text-xs text-slate-200 max-w-md mx-auto">
            Your authentic review helps thousands of users across Sri Lanka make safer decisions.
          </p>
          <button
            onClick={() => {
              setReviewToEdit(null);
              setIsWriteModalOpen(true);
            }}
            className="px-6 py-3 rounded-2xl bg-white text-[#041C43] font-black text-xs hover:bg-slate-100 shadow-md transition-all tap-bounce inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#1464F4]" />
            <span>Write a Review Now</span>
          </button>
        </div>

      </main>

      {/* WRITE REVIEW MODAL */}
      <WriteReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => {
          setIsWriteModalOpen(false);
          setReviewToEdit(null);
        }}
        targetContext={writeTargetContext}
        initialReviewToEdit={reviewToEdit}
        onReviewSubmitted={refreshReviews}
      />

      {/* REPORT REVIEW MODAL */}
      <ReportReviewModal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setReviewToReport(null);
        }}
        reviewToReport={reviewToReport}
      />

    </div>
  );
};
