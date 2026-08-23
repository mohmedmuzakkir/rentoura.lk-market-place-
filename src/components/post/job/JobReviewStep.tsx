import React, { useState } from 'react';
import { Briefcase, Building2, MapPin, Award, DollarSign, Send, CheckSquare, Edit2, AlertCircle, ShieldCheck, Check, Clock, Users, Globe, Mail, Phone, Calendar } from 'lucide-react';
import { ListingDraft, normalizeNumericPrice } from '../../../types/postFormTypes';

interface JobReviewStepProps {
  draft: ListingDraft;
  onEditStep: (stepNumber: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  errors: Record<string, string>;
  accentColor?: string;
}

export const JobReviewStep: React.FC<JobReviewStepProps> = ({
  draft,
  onEditStep,
  onSubmit,
  isSubmitting,
  errors,
  accentColor = '#08A34F'
}) => {
  const [agreementChecked, setAgreementChecked] = useState(false);

  const title = draft.formValues.title || 'Untitled Job Opportunity';
  const companyName = draft.formValues.companyName || 'Hiring Employer';
  const logoUrl = draft.formValues.logoUrl;
  const description = draft.formValues.description || '';
  const employmentType = draft.formValues.employmentType || 'full-time';
  const experienceLevel = draft.formValues.experienceLevel || 'mid';
  const vacancies = draft.formValues.vacancies || 1;

  const workMode = draft.formValues.workMode || 'onsite';
  const locationCity = draft.location.cityName || 'Kandy';
  const locationDistrict = draft.location.districtName || 'Kandy';
  const locationProvince = draft.location.provinceName || 'Central';
  const formattedLocation = workMode === 'remote'
    ? 'Remote (Islandwide Sri Lanka)'
    : `${locationCity}, ${locationDistrict}`;

  const salaryStructure = draft.formValues.salaryStructure || 'monthly-range';
  const minSalary = draft.formValues.minSalary || 120000;
  const maxSalary = draft.formValues.maxSalary || 180000;
  const showSalary = draft.formValues.showSalary !== false;

  const { formatted: minFormatted } = normalizeNumericPrice(minSalary);
  const { formatted: maxFormatted } = normalizeNumericPrice(maxSalary);

  let salaryDisplay = 'Negotiable';
  if (showSalary) {
    if (salaryStructure === 'monthly-range') {
      salaryDisplay = `${minFormatted} - ${maxFormatted} / mo`;
    } else if (salaryStructure === 'monthly-fixed') {
      salaryDisplay = `${minFormatted} / mo`;
    } else if (salaryStructure === 'hourly') {
      salaryDisplay = `${minFormatted} / hr`;
    } else if (salaryStructure === 'daily') {
      salaryDisplay = `${minFormatted} / day`;
    }
  }

  const skillsList: string[] = Array.isArray(draft.formValues.skills) ? draft.formValues.skills : [];
  const benefitsList: string[] = Array.isArray(draft.formValues.benefits) ? draft.formValues.benefits : [];
  const appMethods: string[] = Array.isArray(draft.formValues.appMethods) ? draft.formValues.appMethods : [];

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-200">
      {/* Step Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
            Step 7: Review & Submit
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            100% Ready
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Review all job posting details before submitting for moderation approval.
        </p>
      </div>

      {/* Live Preview Card */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-md border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-[11px] font-bold tracking-wider text-emerald-400 uppercase flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Live Job Card Preview
          </span>
          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Pending Approval
          </span>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt={companyName} className="w-full h-full object-contain p-1" />
            ) : (
              <Building2 className="w-7 h-7 text-emerald-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold text-slate-400">{companyName}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                {workMode}
              </span>
            </div>
            <h3 className="text-base font-extrabold text-white truncate mb-1.5">{title}</h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <DollarSign className="w-3.5 h-3.5" /> {salaryDisplay}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {formattedLocation}
              </span>
              <span className="flex items-center gap-1 capitalize">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" /> {employmentType.replace('-', ' ')}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" /> {vacancies} {vacancies === 1 ? 'Vacancy' : 'Vacancies'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Step Summaries with Edit Buttons */}
      <div className="space-y-3">
        {/* Step 1 Summary */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold text-[#08A34F] uppercase tracking-wider">1. Job Information</span>
            <h4 className="text-xs font-bold text-slate-900">{title}</h4>
            <p className="text-[11px] text-slate-600">Category: <span className="font-semibold">{draft.categoryName} &gt; {draft.subcategoryName}</span></p>
            <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{description}</p>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(1)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-bold flex items-center gap-1"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>

        {/* Step 2 Summary */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold text-[#08A34F] uppercase tracking-wider">2. Company / Employer</span>
            <h4 className="text-xs font-bold text-slate-900">{companyName}</h4>
            <p className="text-[11px] text-slate-600">Industry: {draft.formValues.industry || 'General'}</p>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(2)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-bold flex items-center gap-1"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>

        {/* Step 3 Summary */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold text-[#08A34F] uppercase tracking-wider">3. Location & Work Type</span>
            <h4 className="text-xs font-bold text-slate-900 capitalize">{workMode} Work Model</h4>
            <p className="text-[11px] text-slate-600">{formattedLocation}</p>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(3)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-bold flex items-center gap-1"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>

        {/* Step 4 Summary */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold text-[#08A34F] uppercase tracking-wider">4. Requirements</span>
            <p className="text-[11px] text-slate-600">Skills: <span className="font-semibold">{skillsList.join(', ') || 'Not specified'}</span></p>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(4)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-bold flex items-center gap-1"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>

        {/* Step 5 Summary */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold text-[#08A34F] uppercase tracking-wider">5. Compensation & Benefits</span>
            <h4 className="text-xs font-bold text-[#08A34F]">{salaryDisplay}</h4>
            <p className="text-[11px] text-slate-600">Benefits: {benefitsList.length} Selected</p>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(5)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-bold flex items-center gap-1"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>

        {/* Step 6 Summary */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold text-[#08A34F] uppercase tracking-wider">6. Application Methods</span>
            <p className="text-[11px] text-slate-600">Methods: <span className="font-semibold capitalize">{appMethods.join(', ')}</span></p>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(6)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-bold flex items-center gap-1"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>
      </div>

      {/* Confirmation Checkbox & Submission Button */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreementChecked}
            onChange={(e) => setAgreementChecked(e.target.checked)}
            className="mt-0.5 w-4 h-4 text-[#08A34F] rounded border-slate-300 focus:ring-[#08A34F]"
          />
          <span className="text-xs text-slate-700 font-medium leading-relaxed">
            I confirm that all job details provided are accurate and I am authorized to post this opportunity on behalf of my business.
          </span>
        </label>

        {errors.submit && (
          <p className="text-xs text-rose-600 font-bold flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> {errors.submit}
          </p>
        )}

        <button
          type="button"
          disabled={!agreementChecked || isSubmitting}
          onClick={onSubmit}
          className="w-full py-3.5 px-6 rounded-xl bg-[#08A34F] hover:bg-emerald-600 text-white font-extrabold text-sm shadow-md transition-all tap-bounce flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Submitting Job Post...
            </span>
          ) : (
            <>
              <Send className="w-4 h-4" /> SUBMIT FOR REVIEW
            </>
          )}
        </button>

        <p className="text-[11px] text-slate-400 text-center font-medium">
          Once submitted, our moderation team will review your post within 2-4 hours.
        </p>
      </div>
    </div>
  );
};
