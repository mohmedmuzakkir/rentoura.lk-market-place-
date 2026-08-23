import React from 'react';
import { ListingDraft, normalizeNumericPrice } from '../../types/postFormTypes';
import { CategoryFormSchema } from '../../types/postFormTypes';
import { Edit3, CheckCircle2, ShieldCheck, MapPin, Tag, Image as ImageIcon, Phone, Clock } from 'lucide-react';

interface ReviewSubmissionStepProps {
  draft: ListingDraft;
  schema: CategoryFormSchema;
  onEditStep: (stepNumber: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  accentColor?: string;
}

export const ReviewSubmissionStep: React.FC<ReviewSubmissionStepProps> = ({
  draft,
  schema,
  onEditStep,
  onSubmit,
  isSubmitting,
  accentColor = '#1464F4'
}) => {
  const { formValues, location, images } = draft;
  const title = formValues.title || 'Untitled Listing';
  const rawPrice = formValues.price || formValues.minSalary || formValues.fixedSalary || 0;
  const { formatted } = normalizeNumericPrice(rawPrice);

  return (
    <div className="space-y-4 text-left">
      {/* Moderation Guarantee Card */}
      <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 flex items-start gap-3">
        <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <p className="font-bold">Moderation & Quality Verification</p>
          <p className="text-amber-800/90 mt-0.5">
            Your listing will be submitted for review (Status: <strong>Pending</strong>) to protect against spam. It will appear in your <strong>My Listings</strong> page immediately and go live after review.
          </p>
        </div>
      </div>

      {/* 1. Category Summary */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase text-slate-400">1. Category & Type</span>
          <p className="text-xs font-bold text-slate-900 mt-0.5">
            {draft.categoryPath || `${draft.categoryName} › ${draft.subcategoryName}`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onEditStep(1)}
          className="text-xs font-bold text-[#1464F4] hover:text-blue-700 flex items-center gap-1 tap-bounce"
        >
          <Edit3 className="w-3.5 h-3.5" /> Edit
        </button>
      </div>

      {/* 2. Listing Title & Key Fields */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">2. Listing Details</span>
          <button
            type="button"
            onClick={() => onEditStep(2)}
            className="text-xs font-bold text-[#1464F4] hover:text-blue-700 flex items-center gap-1 tap-bounce"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-slate-900">{title}</h3>
          <p className="text-xs font-bold text-[#1464F4]">
            {formatted} <span className="text-slate-500 font-normal">{formValues.rentalPeriod ? `/${formValues.rentalPeriod}` : ''}</span>
          </p>
        </div>

        {/* Dynamic Key Values Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
          {schema.fields.map((f) => {
            if (['title', 'description', 'price'].includes(f.id)) return null;
            const val = formValues[f.id];
            if (val === undefined || val === '') return null;

            let displayVal = String(val);
            if (typeof val === 'boolean') {
              displayVal = val ? 'Yes' : 'No';
            } else if (Array.isArray(val)) {
              displayVal = val.join(', ');
            } else if (f.options) {
              const matched = f.options.find(o => o.id === val);
              if (matched) displayVal = matched.label;
            }

            return (
              <div key={f.id} className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">{f.label}</span>
                <span className="font-bold text-slate-800 truncate block">{displayVal}</span>
              </div>
            );
          })}
        </div>

        {formValues.description && (
          <div className="pt-2">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Description</span>
            <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              {formValues.description}
            </p>
          </div>
        )}
      </div>

      {/* 3. Location & Photos Summary */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">3. Location & Media</span>
          <button
            type="button"
            onClick={() => onEditStep(3)}
            className="text-xs font-bold text-[#1464F4] hover:text-blue-700 flex items-center gap-1 tap-bounce"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-700">
          <MapPin className="w-4 h-4 text-[#1464F4]" />
          <span>
            {location.cityName || 'City'}, {location.districtName || 'District'} ({location.provinceName || 'Sri Lanka'})
            {location.address ? ` — ${location.address}` : ''}
          </span>
        </div>

        {/* Photos Preview */}
        {images.length > 0 ? (
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {images.map((img) => (
              <img
                key={img.id}
                src={img.url}
                alt="Preview"
                className="w-14 h-14 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                referrerPolicy="no-referrer"
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No photos uploaded (default category visual will be used).</p>
        )}
      </div>

      {/* Final Submit CTA */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full py-4 px-6 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all tap-bounce disabled:opacity-50"
          style={{ backgroundColor: accentColor }}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Submitting for Review...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              <span>Submit Listing for Review</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
