import React, { useState } from 'react';
import { CheckCircle2, Edit3, MapPin, Clock, DollarSign, User, Phone, Image as ImageIcon, AlertCircle, ShieldCheck, Sparkles, Send } from 'lucide-react';
import { ListingDraft, normalizeNumericPrice } from '../../../types/postFormTypes';

interface ServiceReviewStepProps {
  draft: ListingDraft;
  onGoToStep: (stepNumber: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  accentColor: string;
}

export const ServiceReviewStep: React.FC<ServiceReviewStepProps> = ({
  draft,
  onGoToStep,
  onSubmit,
  isSubmitting,
  accentColor = '#FF650A'
}) => {
  const [agreedTerms, setAgreedTerms] = useState(true);

  const priceVal = draft.formValues.price || 0;
  const { formatted } = normalizeNumericPrice(priceVal);

  const missingTitle = !(draft.formValues.title || '').trim();
  const missingCategory = !draft.categoryId;
  const missingPhone = !(draft.contactPreferences?.phone || '').trim();

  const hasMissingFields = missingTitle || missingCategory || missingPhone;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Step 8 of 8</span>
        </div>
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Review & Final Submission</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review your service listing summary below before submitting for moderation approval.
        </p>
      </div>

      {/* Missing Fields Warning Banner */}
      {hasMissingFields && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600" /> Action Required Before Submitting:
          </div>
          <ul className="text-xs text-rose-700 space-y-1 pl-6 list-disc">
            {missingTitle && (
              <li>Service / Skill Name is missing. <button type="button" onClick={() => onGoToStep(1)} className="underline font-bold">Fix in Step 1</button></li>
            )}
            {missingCategory && (
              <li>Service category is missing. <button type="button" onClick={() => onGoToStep(1)} className="underline font-bold">Fix in Step 1</button></li>
            )}
            {missingPhone && (
              <li>Contact phone number is missing. <button type="button" onClick={() => onGoToStep(7)} className="underline font-bold">Fix in Step 7</button></li>
            )}
          </ul>
        </div>
      )}

      {/* Summary Cards Grid */}
      <div className="space-y-4">
        {/* Step 1: Basic Info */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" /> 1. Service & Category
            </span>
            <button
              type="button"
              onClick={() => onGoToStep(1)}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>
          <div className="text-xs space-y-1 pt-1">
            <p><strong className="text-slate-900">Title:</strong> {draft.formValues.title || 'Untitled Service'}</p>
            <p><strong className="text-slate-900">Category:</strong> {draft.categoryPath || 'Not selected'}</p>
            <p className="text-slate-600 line-clamp-2"><strong className="text-slate-900">Description:</strong> {draft.formValues.description || 'No description'}</p>
          </div>
        </div>

        {/* Step 2: Provider Info */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber-600" /> 2. Provider Details
            </span>
            <button
              type="button"
              onClick={() => onGoToStep(2)}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>
          <div className="text-xs space-y-1 pt-1">
            <p><strong className="text-slate-900">Type:</strong> {draft.formValues.providerType === 'business' ? 'Registered Business / Team' : 'Individual / Freelancer'}</p>
            <p><strong className="text-slate-900">Name:</strong> {draft.formValues.providerName || draft.formValues.businessName || draft.contactPreferences.contactName}</p>
            <p><strong className="text-slate-900">Experience:</strong> {draft.formValues.yearsExperience || '3-5 years'}</p>
          </div>
        </div>

        {/* Step 3: Location */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-600" /> 3. Service Location
            </span>
            <button
              type="button"
              onClick={() => onGoToStep(3)}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>
          <div className="text-xs space-y-1 pt-1">
            <p><strong className="text-slate-900">City & District:</strong> {draft.location?.cityName || 'Kandy'}, {draft.location?.districtName || 'Kandy District'}</p>
            <p><strong className="text-slate-900">Service Mode:</strong> {draft.formValues.serviceMode || 'At Customer Location'}</p>
            <p><strong className="text-slate-900">Travel Radius:</strong> {draft.formValues.serviceRadius || '25 km'}</p>
          </div>
        </div>

        {/* Step 4: Availability */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" /> 4. Availability & Working Hours
            </span>
            <button
              type="button"
              onClick={() => onGoToStep(4)}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>
          <div className="text-xs space-y-1 pt-1">
            <p><strong className="text-slate-900">Emergency Call-outs:</strong> {draft.formValues.emergencyAvailable ? 'Yes (Supported)' : 'No'}</p>
            <p><strong className="text-slate-900">Advance Notice:</strong> {draft.formValues.minAdvanceNotice || '1 Hour'}</p>
          </div>
        </div>

        {/* Step 5: Pricing */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-amber-600" /> 5. Service Pricing
            </span>
            <button
              type="button"
              onClick={() => onGoToStep(5)}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>
          <div className="text-xs space-y-1 pt-1">
            <p><strong className="text-slate-900">Pricing Model:</strong> {draft.formValues.pricingModel || 'hourly'}</p>
            <p><strong className="text-slate-900">Primary Rate:</strong> {formatted}</p>
          </div>
        </div>

        {/* Step 6: Gallery */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-amber-600" /> 6. Gallery Photos ({draft.images?.length || 0})
            </span>
            <button
              type="button"
              onClick={() => onGoToStep(6)}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>
          {draft.images && draft.images.length > 0 ? (
            <div className="flex gap-2 pt-2 overflow-x-auto pb-1">
              {draft.images.slice(0, 5).map(img => (
                <img key={img.id} src={img.url} alt="Work thumbnail" className="w-14 h-14 object-cover rounded-xl border border-slate-200" />
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic pt-1">No photos uploaded. Default service thumbnail will be used.</p>
          )}
        </div>

        {/* Step 7: Contact */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-amber-600" /> 7. Contact Details
            </span>
            <button
              type="button"
              onClick={() => onGoToStep(7)}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>
          <div className="text-xs space-y-1 pt-1">
            <p><strong className="text-slate-900">Name:</strong> {draft.contactPreferences?.contactName}</p>
            <p><strong className="text-slate-900">Phone:</strong> {draft.contactPreferences?.phone}</p>
            <p><strong className="text-slate-900">WhatsApp:</strong> {draft.contactPreferences?.whatsappNumber || draft.contactPreferences?.phone}</p>
          </div>
        </div>
      </div>

      {/* Platform Terms Checkbox */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedTerms}
            onChange={e => setAgreedTerms(e.target.checked)}
            className="mt-0.5 rounded text-amber-500 focus:ring-amber-500"
          />
          <span className="text-xs text-slate-600 leading-relaxed">
            I confirm that all service details, prices, experience and qualifications provided in this listing are accurate and genuine. I agree to <strong className="text-slate-800">RENTOURA.LK Terms of Service</strong> and understand my listing will be reviewed by moderation.
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting || !agreedTerms || hasMissingFields}
        className={`w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-extrabold text-white transition-all shadow-md flex items-center justify-center gap-2 ${
          isSubmitting || !agreedTerms || hasMissingFields
            ? 'bg-slate-300 cursor-not-allowed shadow-none'
            : 'bg-[#FF650A] hover:bg-amber-600 shadow-amber-500/20 active:scale-[0.99]'
        }`}
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Submitting Service Listing for Review...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" /> SUBMIT FOR REVIEW
          </>
        )}
      </button>
    </div>
  );
};
