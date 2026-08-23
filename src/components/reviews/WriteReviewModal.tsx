import React, { useState, useEffect } from 'react';
import { X, Star, AlertTriangle, CheckCircle2, ShieldCheck, Sparkles, Building, Briefcase, Wrench } from 'lucide-react';
import { CanonicalReview, ReviewModule } from '../../types/reviewTypes';
import { ReviewService } from '../../services/reviewService';
import { AuthService } from '../../services/authService';

export interface ReviewTargetContext {
  id: string;
  title: string;
  imageUrl?: string;
  location?: string;
  module: ReviewModule;
  ownerId?: string;
  price?: string;
}

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetContext?: ReviewTargetContext | null;
  initialReviewToEdit?: CanonicalReview | null;
  onReviewSubmitted: () => void;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
  targetContext,
  initialReviewToEdit,
  onReviewSubmitted
}) => {
  const currentUser = AuthService.getCurrentUser();

  // Target context fallback
  const activeTarget: ReviewTargetContext = targetContext || {
    id: 'rent-prius-2018',
    title: 'Toyota Prius Hybrid 2018',
    imageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80',
    location: 'Kandy, Central Province',
    module: 'rentals',
    ownerId: 'usr-owner-99',
    price: 'Rs. 12,500 / Day'
  };

  const isEditing = Boolean(initialReviewToEdit);

  // Form State
  const [overallRating, setOverallRating] = useState<number>(initialReviewToEdit?.overallRating || 5);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const [commRating, setCommRating] = useState<number>(initialReviewToEdit?.subratings?.communication || 5);
  const [accuracyRating, setAccuracyRating] = useState<number>(initialReviewToEdit?.subratings?.accuracyOrQuality || 5);
  const [conditionRating, setConditionRating] = useState<number>(initialReviewToEdit?.subratings?.conditionOrProfessionalism || 5);
  const [valueRating, setValueRating] = useState<number>(initialReviewToEdit?.subratings?.valueForMoney || 5);
  const [timeRating, setTimeRating] = useState<number>(initialReviewToEdit?.subratings?.timeliness || 5);

  const [body, setBody] = useState<string>(initialReviewToEdit?.body || '');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (initialReviewToEdit) {
      setOverallRating(initialReviewToEdit.overallRating);
      setBody(initialReviewToEdit.body);
      if (initialReviewToEdit.subratings) {
        setCommRating(initialReviewToEdit.subratings.communication);
        setAccuracyRating(initialReviewToEdit.subratings.accuracyOrQuality);
        setConditionRating(initialReviewToEdit.subratings.conditionOrProfessionalism);
        setValueRating(initialReviewToEdit.subratings.valueForMoney);
        setTimeRating(initialReviewToEdit.subratings.timeliness);
      }
    } else {
      setOverallRating(5);
      setBody('');
      setCommRating(5);
      setAccuracyRating(5);
      setConditionRating(5);
      setValueRating(5);
      setTimeRating(5);
    }
    setErrorMsg(null);
  }, [initialReviewToEdit, isOpen]);

  if (!isOpen) return null;

  // Self-review guard
  const isSelfListing = currentUser && activeTarget.ownerId && currentUser.id === activeTarget.ownerId;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isSelfListing) {
      setErrorMsg('You cannot write a review for your own listing.');
      return;
    }

    if (!body.trim() || body.trim().length < 15) {
      setErrorMsg('Please write at least 15 characters describing your experience.');
      return;
    }

    if (body.length > 1000) {
      setErrorMsg('Review text must not exceed 1000 characters.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      let result;
      if (isEditing && initialReviewToEdit && currentUser) {
        result = ReviewService.updateReview(initialReviewToEdit.id, currentUser.id, {
          overallRating,
          body,
          subratings: {
            communication: commRating,
            accuracyOrQuality: accuracyRating,
            conditionOrProfessionalism: conditionRating,
            valueForMoney: valueRating,
            timeliness: timeRating
          }
        });
      } else {
        result = ReviewService.addReview({
          authorId: currentUser ? currentUser.id : 'usr-guest-user',
          authorName: currentUser ? ((currentUser as any).displayName || (currentUser as any).fullName || (currentUser as any).name || 'Verified RENTOURA User') : 'Verified User',
          authorAvatar: (currentUser as any)?.avatarUrl || (currentUser as any)?.avatar,
          isAuthorVerified: true,
          targetType: 'listing',
          targetId: activeTarget.id,
          targetModule: activeTarget.module,
          targetTitle: activeTarget.title,
          targetImageUrl: activeTarget.imageUrl,
          targetLocation: activeTarget.location,
          targetOwnerId: activeTarget.ownerId,
          overallRating,
          subratings: {
            communication: commRating,
            accuracyOrQuality: accuracyRating,
            conditionOrProfessionalism: conditionRating,
            valueForMoney: valueRating,
            timeliness: timeRating
          },
          body,
          locationName: activeTarget.location ? activeTarget.location.split(',')[0] : 'Sri Lanka'
        });
      }

      setIsSubmitting(false);

      if (result.success) {
        onReviewSubmitted();
        onClose();
      } else {
        setErrorMsg(result.error || 'Failed to submit review. Please try again.');
      }
    }, 500);
  };

  const starLabels: Record<number, string> = {
    5: 'Excellent ⭐⭐⭐⭐⭐',
    4: 'Good ⭐⭐⭐⭐',
    3: 'Average ⭐⭐⭐',
    2: 'Below Expectations ⭐⭐',
    1: 'Poor ⭐'
  };

  // Module Badge styling
  const moduleBadge = {
    rentals: { label: 'RENTAL', bg: 'bg-[#1464F4]/10 text-[#1464F4]', icon: Building },
    jobs: { label: 'JOB', bg: 'bg-[#08A34F]/10 text-[#08A34F]', icon: Briefcase },
    services: { label: 'SERVICE', bg: 'bg-[#FF650A]/10 text-[#FF650A]', icon: Wrench }
  }[activeTarget.module];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* HEADER */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#041C43]">
                {isEditing ? 'Edit Your Review' : 'Write a Review'}
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                Share genuine feedback to help our community
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BODY FORM */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5 flex-1 custom-scrollbar">

          {/* TARGET CONTEXT CARD */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
            {activeTarget.imageUrl && (
              <img
                src={activeTarget.imageUrl}
                alt={activeTarget.title}
                className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200 shadow-xs"
              />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${moduleBadge.bg}`}>
                  {moduleBadge.label}
                </span>
                {activeTarget.location && (
                  <span className="text-[10px] text-slate-400 truncate">
                    📍 {activeTarget.location}
                  </span>
                )}
              </div>
              <h3 className="text-xs font-bold text-[#041C43] truncate">
                {activeTarget.title}
              </h3>
              {activeTarget.price && (
                <p className="text-[11px] font-black text-[#1464F4]">
                  {activeTarget.price}
                </p>
              )}
            </div>
          </div>

          {/* ERROR ALERT */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* SELF LISTING WARNING */}
          {isSelfListing && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>You cannot review a listing that you published.</span>
            </div>
          )}

          {/* OVERALL RATING SELECTOR */}
          <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100/80 text-center space-y-2">
            <label className="text-xs font-bold text-[#041C43] block">
              Overall Rating <span className="text-rose-500">*</span>
            </label>

            {/* Interactive Stars */}
            <div className="flex items-center justify-center gap-1.5 py-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const isActive = (hoverRating || overallRating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setOverallRating(star)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none tap-bounce"
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    <Star className={`w-8 h-8 transition-colors ${
                      isActive ? 'fill-amber-400 text-amber-400 drop-shadow-xs' : 'text-slate-300'
                    }`} />
                  </button>
                );
              })}
            </div>

            <div className="text-xs font-bold text-[#1464F4]">
              {starLabels[hoverRating || overallRating]}
            </div>
          </div>

          {/* CATEGORY SUBRATINGS */}
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-bold text-[#041C43]">
              Category Breakdown Ratings
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              
              {/* Communication */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-slate-700">Communication</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setCommRating(s)}
                      className="p-0.5"
                    >
                      <Star className={`w-4 h-4 ${s <= commRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Accuracy / Quality */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-slate-700">
                  {activeTarget.module === 'services' ? 'Service Quality' : 'Listing Accuracy'}
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setAccuracyRating(s)}
                      className="p-0.5"
                    >
                      <Star className={`w-4 h-4 ${s <= accuracyRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition / Professionalism */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-slate-700">
                  {activeTarget.module === 'services' ? 'Professionalism' : 'Item Condition'}
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setConditionRating(s)}
                      className="p-0.5"
                    >
                      <Star className={`w-4 h-4 ${s <= conditionRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Value for Money */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-slate-700">Value for Money</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setValueRating(s)}
                      className="p-0.5"
                    >
                      <Star className={`w-4 h-4 ${s <= valueRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* REVIEW TEXT AREA */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#041C43]">
                Your Review <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] font-bold text-slate-400">
                {body.length} / 1000
              </span>
            </div>

            <textarea
              rows={4}
              maxLength={1000}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Tell others about your experience... Was it as described? How was communication and timeliness?"
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#1464F4] transition-all resize-none"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || isSelfListing}
              className="w-full py-3.5 rounded-2xl bg-[#1464F4] hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all tap-bounce disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isEditing ? 'Save Changes' : 'Publish Review'}</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
