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

  const isEditing = Boolean(initialReviewToEdit);

  // Derive target context
  const activeTarget: ReviewTargetContext | null = targetContext || (initialReviewToEdit ? {
    id: initialReviewToEdit.targetId,
    title: initialReviewToEdit.targetTitle,
    imageUrl: initialReviewToEdit.targetImageUrl,
    location: initialReviewToEdit.targetLocation,
    module: initialReviewToEdit.targetModule,
    ownerId: initialReviewToEdit.targetOwnerId
  } : null);

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
  const isSelfListing = Boolean(currentUser && activeTarget?.ownerId && currentUser.id === activeTarget.ownerId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!currentUser) {
      setErrorMsg('You must be signed in to write a review.');
      return;
    }

    if (!activeTarget) {
      setErrorMsg('Target listing missing. Please select a valid listing to review.');
      return;
    }

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

    try {
      let result;
      if (isEditing && initialReviewToEdit && currentUser) {
        result = await ReviewService.updateReview(initialReviewToEdit.id, currentUser.id, {
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
        result = await ReviewService.addReview({
          authorId: currentUser.id,
          authorName: currentUser.user_metadata?.full_name || currentUser.email || 'Community Member',
          authorAvatar: currentUser.user_metadata?.avatar_url,
          targetId: activeTarget.id,
          targetModule: activeTarget.module,
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
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err?.message || 'An unexpected error occurred.');
    }
  };

  const getRatingLabel = (score: number) => {
    if (score >= 5) return 'Excellent (5.0)';
    if (score >= 4) return 'Good (4.0)';
    if (score >= 3) return 'Average (3.0)';
    if (score >= 2) return 'Below Expectations (2.0)';
    return 'Poor (1.0)';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#1464F4] uppercase">
              {isEditing ? 'Edit Your Review' : 'Community Review'}
            </span>
            <h3 className="text-lg font-black text-[#041C43] font-heading">
              {isEditing ? 'Update Review' : 'Write a Review'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Context Summary Card */}
        {activeTarget ? (
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
            {activeTarget.imageUrl ? (
              <img
                src={activeTarget.imageUrl}
                alt={activeTarget.title}
                className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-slate-200 flex items-center justify-center shrink-0">
                <Building className="w-6 h-6 text-slate-400" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-bold text-[#1464F4] uppercase tracking-wider">
                {activeTarget.module}
              </div>
              <h4 className="text-xs font-bold text-slate-900 truncate">
                {activeTarget.title}
              </h4>
              {activeTarget.location && (
                <p className="text-[11px] text-slate-500 truncate">
                  📍 {activeTarget.location}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
            No specific listing selected. Please open a listing page to leave a targeted review.
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Overall Star Rating */}
          <div className="space-y-2 text-center py-2 bg-slate-50 rounded-2xl border border-slate-100">
            <label className="text-xs font-bold text-slate-700 block">
              Overall Experience Rating *
            </label>
            <div className="flex justify-center gap-1.5 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setOverallRating(star)}
                  className="p-1 transition-transform active:scale-95 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      star <= (hoverRating || overallRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 hover:text-amber-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-xs font-bold text-[#1464F4]">
              {getRatingLabel(hoverRating || overallRating)}
            </div>
          </div>

          {/* Subratings Slider / Star Pickers */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 block">
              Detailed Criteria Ratings
            </span>

            <div className="space-y-2.5 text-xs">
              {/* Communication */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">Communication</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <Star
                      key={st}
                      onClick={() => setCommRating(st)}
                      className={`w-4 h-4 cursor-pointer ${
                        st <= commRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Accuracy / Quality */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">Accuracy & Quality</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <Star
                      key={st}
                      onClick={() => setAccuracyRating(st)}
                      className={`w-4 h-4 cursor-pointer ${
                        st <= accuracyRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Condition / Professionalism */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">Condition & Professionalism</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <Star
                      key={st}
                      onClick={() => setConditionRating(st)}
                      className={`w-4 h-4 cursor-pointer ${
                        st <= conditionRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Value for Money */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">Value for Money</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <Star
                      key={st}
                      onClick={() => setValueRating(st)}
                      className={`w-4 h-4 cursor-pointer ${
                        st <= valueRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Timeliness */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">Timeliness & Punctuality</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <Star
                      key={st}
                      onClick={() => setTimeRating(st)}
                      className={`w-4 h-4 cursor-pointer ${
                        st <= timeRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Written Review Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-700">
                Your Written Review *
              </label>
              <span className={`font-medium ${body.length > 1000 ? 'text-rose-600' : 'text-slate-400'}`}>
                {body.length} / 1000
              </span>
            </div>
            <textarea
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Describe your experience with this listing (condition, punctuality, owner communication, overall satisfaction)..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-[#1464F4] focus:bg-white transition-all resize-none font-medium"
            />
            <p className="text-[11px] text-slate-400 italic">
              Reviews are public to the RENTOURA.LK community. Please maintain respectful standards.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isSelfListing || !activeTarget}
              className="px-6 py-2.5 rounded-xl bg-[#1464F4] text-white font-bold text-xs hover:bg-blue-600 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>{isEditing ? 'Update Review' : 'Submit Review'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
