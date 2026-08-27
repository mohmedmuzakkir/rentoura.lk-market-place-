import React, { useState } from 'react';
import { ListingDraft, normalizeNumericPrice } from '../../../types/postFormTypes';
import { CheckCircle2, Edit3, ShieldCheck, MapPin, Tag, DollarSign, Image, PhoneCall, Sparkles, AlertCircle, FileCheck, EyeOff } from 'lucide-react';

interface RentalReviewStepProps {
  draft: ListingDraft;
  onJumpToStep: (stepNumber: number) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  accentColor?: string;
}

export const RentalReviewStep: React.FC<RentalReviewStepProps> = ({
  draft,
  onJumpToStep,
  onSubmit,
  isSubmitting = false,
  accentColor = '#1464F4'
}) => {
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const title = draft.formValues.title || `${draft.subcategoryName || draft.categoryName} Listing`;
  const rate = draft.pricing?.rate || draft.formValues.price || 0;
  const ratePeriod = draft.pricing?.ratePeriod || 'day';
  const { formatted: formattedRate } = normalizeNumericPrice(rate);
  const coverImage = draft.images.find(img => img.isCover) || draft.images[0];
  const coverUrl = coverImage?.previewUrl || '';

  const handleFinalSubmit = () => {
    if (!agreedToTerms) {
      setSubmitError('Please accept the listing terms and moderation guidelines before publishing.');
      return;
    }
    setSubmitError(null);
    onSubmit();
  };

  return (
    <div className="space-y-5 text-left animate-in fade-in duration-200">
      {/* Header Info */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-[#1464F4] flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold text-slate-900">Step 7: Final Review & Publish</p>
          <p className="text-slate-600 mt-0.5 leading-relaxed">
            Review your rental listing below. Once submitted, your listing will be queued for rapid moderation and published on RENTOURA.LK.
          </p>
        </div>
      </div>

      {/* Live Visual Listing Card Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
        <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-extrabold uppercase tracking-wide">
              Live Listing Preview
            </span>
          </div>
          <span className="text-[10px] font-bold bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-full">
            Status: Pending Review
          </span>
        </div>

        {/* Cover Photo with Badges */}
        <div className="relative h-48 sm:h-56 bg-slate-900 overflow-hidden flex items-center justify-center">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-4 text-slate-400">
              <Image className="w-10 h-10 mx-auto mb-1 opacity-50" />
              <p className="text-xs font-semibold">No cover photo uploaded</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

          {/* Category Chip */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
              {draft.categoryName || 'Uncategorized'}{draft.subcategoryName ? ` › ${draft.subcategoryName}` : ''}
            </span>
          </div>

          {/* Photos Count */}
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
            <Image className="w-3 h-3" /> {draft.images.length} Photos
          </div>

          {/* Title & Price in overlay */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <h2 className="text-sm sm:text-base font-extrabold line-clamp-2 drop-shadow-sm">
              {title}
            </h2>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-baseline gap-1">
                <span className="text-base sm:text-lg font-black text-amber-400">
                  {formattedRate}
                </span>
                <span className="text-xs text-slate-200 font-medium capitalize">
                  / {ratePeriod}
                </span>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>
                  {draft.location.cityName || draft.location.districtName || 'Sri Lanka'}
                </span>
                {draft.location.hideExactAddress && (
                  <span title="Exact address protected">
                    <EyeOff className="w-3 h-3 text-emerald-400 ml-0.5" />
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card Body Details Breakdown */}
        <div className="p-4 space-y-4">
          {/* Quick Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Condition</span>
              <p className="text-xs font-extrabold text-slate-800 capitalize mt-0.5">
                {draft.condition?.replace('-', ' ') || 'Unspecified'}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Deposit</span>
              <p className="text-xs font-extrabold text-slate-800 mt-0.5">
                {draft.pricing?.depositRequired && draft.pricing.depositAmount
                  ? `Rs. ${draft.pricing.depositAmount.toLocaleString()}`
                  : 'No Deposit'}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Min Period</span>
              <p className="text-xs font-extrabold text-slate-800 mt-0.5">
                {draft.pricing?.minRentalDuration || '1 day'}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Contact</span>
              <p className="text-xs font-extrabold text-slate-800 mt-0.5">
                {draft.contactPreferences.phone || 'Not provided'}
              </p>
            </div>
          </div>

          {/* Description Preview */}
          {draft.formValues.description && (
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900">Description</h4>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {draft.formValues.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Step Breakdown Audit & Jump Links */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
          Listing Verification Checklist
        </h3>

        <div className="divide-y divide-slate-100">
          {/* Step 1 */}
          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Category & Title</p>
                <p className="text-[11px] text-slate-500">{draft.categoryPath || 'Not selected'}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onJumpToStep(1)}
              className="text-xs font-bold text-[#1464F4] hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>

          {/* Step 2 */}
          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Location & Privacy</p>
                <p className="text-[11px] text-slate-500">
                  {draft.location.cityName}, {draft.location.districtName}
                  {draft.location.hideExactAddress ? ' (Address Hidden)' : ''}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onJumpToStep(2)}
              className="text-xs font-bold text-[#1464F4] hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>

          {/* Step 3 */}
          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                3
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Pricing & Availability</p>
                <p className="text-[11px] text-slate-500">
                  {formattedRate} / {ratePeriod}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onJumpToStep(3)}
              className="text-xs font-bold text-[#1464F4] hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>

          {/* Step 4 */}
          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                4
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Specifications & Features</p>
                <p className="text-[11px] text-slate-500">
                  {Object.keys(draft.formValues).length} specifications configured
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onJumpToStep(4)}
              className="text-xs font-bold text-[#1464F4] hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>

          {/* Step 5 */}
          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                5
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Photos & Media</p>
                <p className="text-[11px] text-slate-500">{draft.images.length} photos uploaded</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onJumpToStep(5)}
              className="text-xs font-bold text-[#1464F4] hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>

          {/* Step 6 */}
          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                6
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Contact & Rental Rules</p>
                <p className="text-[11px] text-slate-500">{draft.contactPreferences.phone}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onJumpToStep(6)}
              className="text-xs font-bold text-[#1464F4] hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>
        </div>
      </div>

      {/* Moderation Terms Agreement */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="w-4 h-4 rounded text-[#1464F4] focus:ring-blue-500 border-slate-300 mt-0.5"
          />
          <div className="text-xs">
            <p className="font-bold text-slate-900">
              I confirm that I own or have legal authorization to rent this item / property
            </p>
            <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
              I agree to adhere to RENTOURA.LK Community Standards and Sri Lankan rental marketplace guidelines.
            </p>
          </div>
        </label>

        {submitError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{submitError}</span>
          </div>
        )}
      </div>

      {/* Submit Action Box */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold">Ready to Publish?</h3>
            <p className="text-xs text-blue-200 mt-0.5">
              Your rental listing will be submitted to the moderation queue.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleFinalSubmit}
          disabled={isSubmitting}
          className="w-full py-3 px-6 bg-[#1464F4] hover:bg-blue-600 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 tap-bounce"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Submitting Listing...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>SUBMIT FOR REVIEW</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
