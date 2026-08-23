import React, { useRef } from 'react';
import { Building2, User, Globe, Upload, Trash2, AlertCircle, Image as ImageIcon, Briefcase } from 'lucide-react';
import { ListingDraft, UploadedImage } from '../../../types/postFormTypes';

interface JobCompanyStepProps {
  draft: ListingDraft;
  onChange: (updatedDraftPartial: Partial<ListingDraft>) => void;
  errors: Record<string, string>;
  accentColor?: string;
}

export const JobCompanyStep: React.FC<JobCompanyStepProps> = ({
  draft,
  onChange,
  errors,
  accentColor = '#08A34F'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const employerType = draft.formValues.employerType || 'company';
  const companyName = draft.formValues.companyName || '';
  const industry = draft.formValues.industry || '';
  const companyBio = draft.formValues.companyBio || '';
  const website = draft.formValues.website || '';
  const logoUrl = draft.formValues.logoUrl || '';

  const updateFormValue = (key: string, val: any) => {
    onChange({
      formValues: {
        ...draft.formValues,
        [key]: val
      }
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Company logo size must be under 5MB');
        return;
      }
      const objectUrl = URL.createObjectURL(file);
      updateFormValue('logoUrl', objectUrl);
    }
  };

  const handleRemoveLogo = () => {
    updateFormValue('logoUrl', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const industryOptions = [
    'Information Technology & Software',
    'Sales & Commercial Trading',
    'Finance & Banking',
    'Hospitality, Travel & Tourism',
    'Construction, Engineering & Trades',
    'Logistics, Transport & Supply Chain',
    'Healthcare & Pharmaceuticals',
    'Education & Academic Training',
    'Manufacturing & Industrial Factory',
    'Garments, Textile & Fashion',
    'Media, Creative & Advertising',
    'Other Industry Sector'
  ];

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-200">
      {/* Title Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
            Step 2: Company / Employer Details
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            28% Completed
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Provide accurate details about your business or recruitment entity.
        </p>
      </div>

      {/* Main Form Fields */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
        {/* Employer Type Selection */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-2">
            Employer / Hiring Entity Type <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateFormValue('employerType', 'company')}
              className={`p-3.5 rounded-xl border text-left transition-all tap-bounce flex items-start gap-3 ${
                employerType === 'company'
                  ? 'bg-emerald-50/90 border-[#08A34F] text-slate-900 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className={`p-2 rounded-lg ${employerType === 'company' ? 'bg-[#08A34F] text-white' : 'bg-slate-100 text-slate-600'}`}>
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold">Registered Company / Business</h4>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">PVT Ltd, Enterprise, Brand or Firm</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => updateFormValue('employerType', 'individual')}
              className={`p-3.5 rounded-xl border text-left transition-all tap-bounce flex items-start gap-3 ${
                employerType === 'individual'
                  ? 'bg-emerald-50/90 border-[#08A34F] text-slate-900 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className={`p-2 rounded-lg ${employerType === 'individual' ? 'bg-[#08A34F] text-white' : 'bg-slate-100 text-slate-600'}`}>
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold">Individual / Direct Recruiter</h4>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Private employer, household or contractor</p>
              </div>
            </button>
          </div>
        </div>

        {/* Company / Employer Name */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1.5">
            {employerType === 'company' ? 'Company / Business Name *' : 'Employer / Recruiter Name *'}
          </label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={companyName}
              onChange={(e) => updateFormValue('companyName', e.target.value)}
              placeholder={employerType === 'company' ? 'e.g. Synapse Tech (Pvt) Ltd, Grand Hotel Kandy' : 'e.g. Mr. S. Perera, Kandy Estate Owner'}
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.companyName ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
              }`}
            />
          </div>
          {errors.companyName && (
            <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.companyName}
            </p>
          )}
        </div>

        {/* Company Logo Upload */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1.5">
            Company Logo (Optional)
          </label>
          <div className="flex items-center gap-4">
            {logoUrl ? (
              <div className="relative w-20 h-20 rounded-2xl border border-slate-200 bg-white p-1 shadow-xs flex items-center justify-center overflow-hidden group">
                <img src={logoUrl} alt="Logo preview" className="w-full h-full object-contain rounded-xl" />
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="absolute inset-0 bg-slate-900/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/80 hover:bg-slate-100/80 cursor-pointer flex flex-col items-center justify-center transition-colors text-slate-400 hover:text-slate-600"
              >
                <Upload className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-bold">Logo</span>
              </div>
            )}
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
              >
                {logoUrl ? 'Change Logo' : 'Upload Logo'}
              </button>
              <p className="text-[11px] text-slate-400 mt-1">PNG, JPG or WEBP under 5MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Industry Sector */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1.5">
            Industry Sector
          </label>
          <select
            value={industry}
            onChange={(e) => updateFormValue('industry', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Select Industry Sector (Optional)</option>
            {industryOptions.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        {/* Short Overview / Description */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1.5">
            About the Company / Employer (Optional)
          </label>
          <textarea
            rows={3}
            maxLength={500}
            value={companyBio}
            onChange={(e) => updateFormValue('companyBio', e.target.value)}
            placeholder="Briefly describe your company background, work culture, or business vision..."
            className="w-full p-3.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Company Website */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1.5">
            Company Website / Social Page (Optional)
          </label>
          <div className="relative">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={website}
              onChange={(e) => updateFormValue('website', e.target.value)}
              placeholder="e.g. https://www.yourcompany.com or facebook.com/yourpage"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
