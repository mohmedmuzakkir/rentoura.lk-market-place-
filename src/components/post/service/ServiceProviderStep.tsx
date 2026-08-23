import React from 'react';
import { User, Building2, Briefcase, Award, Users, Globe, ShieldCheck, AlertCircle } from 'lucide-react';
import { ListingDraft } from '../../../types/postFormTypes';

interface ServiceProviderStepProps {
  draft: ListingDraft;
  onChange: (updated: Partial<ListingDraft>) => void;
  errors: Record<string, string>;
  accentColor: string;
}

export const ServiceProviderStep: React.FC<ServiceProviderStepProps> = ({
  draft,
  onChange,
  errors,
  accentColor = '#FF650A'
}) => {
  const providerType = draft.formValues.providerType || 'individual';

  const updateFormValue = (key: string, value: any) => {
    onChange({
      formValues: {
        ...draft.formValues,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Intro Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Step 2 of 8</span>
        </div>
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Provider & Business Details</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Help customers know who is serving them. Specify if you operate as an individual or a registered team.
        </p>
      </div>

      {/* Provider Type Selector */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
          Provider Operating Type <span className="text-rose-500">*</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => updateFormValue('providerType', 'individual')}
            className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
              providerType === 'individual'
                ? 'border-[#FF650A] bg-amber-50/50 shadow-xs ring-2 ring-[#FF650A]/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className={`p-2.5 rounded-xl shrink-0 ${
              providerType === 'individual' ? 'bg-[#FF650A] text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-slate-900">Individual / Freelancer</span>
                {providerType === 'individual' && (
                  <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">Selected</span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                Single tradesperson, technician, tutor, or freelancer operating independently.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => updateFormValue('providerType', 'business')}
            className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
              providerType === 'business'
                ? 'border-[#FF650A] bg-amber-50/50 shadow-xs ring-2 ring-[#FF650A]/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className={`p-2.5 rounded-xl shrink-0 ${
              providerType === 'business' ? 'bg-[#FF650A] text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-slate-900">Business / Registered Team</span>
                {providerType === 'business' && (
                  <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">Selected</span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                Contracting firm, agency, salon, repair shop, or multi-member service company.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Individual Fields */}
      {providerType === 'individual' && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
            <User className="w-4 h-4 text-amber-600" /> Individual Practitioner Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Display Name */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Full Name / Public Display Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={draft.formValues.providerName || draft.contactPreferences.contactName || ''}
                onChange={e => updateFormValue('providerName', e.target.value)}
                placeholder="e.g. Sahan Perera"
                className={`w-full px-3.5 py-2.5 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all ${
                  errors.providerName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
              {errors.providerName && (
                <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.providerName}
                </p>
              )}
            </div>

            {/* Years of Experience */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Years of Experience <span className="text-rose-500">*</span>
              </label>
              <select
                value={draft.formValues.yearsExperience || '3-5'}
                onChange={e => updateFormValue('yearsExperience', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer"
              >
                <option value="under-1">Less than 1 Year</option>
                <option value="1-3">1 - 3 Years</option>
                <option value="3-5">3 - 5 Years</option>
                <option value="5-10">5 - 10 Years</option>
                <option value="10+">10+ Years (Senior Master Tradesperson)</option>
              </select>
            </div>

            {/* Qualifications & Certifications */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Relevant Certifications & Qualifications <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <input
                type="text"
                value={draft.formValues.certifications || ''}
                onChange={e => updateFormValue('certifications', e.target.value)}
                placeholder="e.g. NVQ Level 4 Electrician, CIMA Passed Finalist, Certified Apple Technician"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>

            {/* Team Size / Helpers */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Helper / Assistant Support
              </label>
              <select
                value={draft.formValues.individualAssistants || 'solo'}
                onChange={e => updateFormValue('individualAssistants', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer"
              >
                <option value="solo">Solo Operator (I handle all work directly)</option>
                <option value="1-assistant">I bring 1 Helper / Assistant for heavy tasks</option>
                <option value="2-assistants">I bring 2-3 Trained Assistants</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Business Fields */}
      {providerType === 'business' && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-amber-600" /> Business & Company Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Company Name */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Business / Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={draft.formValues.businessName || ''}
                onChange={e => updateFormValue('businessName', e.target.value)}
                placeholder="e.g. Lanka Tech Electrical Solutions (Pvt) Ltd"
                className={`w-full px-3.5 py-2.5 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all ${
                  errors.businessName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
              {errors.businessName && (
                <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.businessName}
                </p>
              )}
            </div>

            {/* Operating Years */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Years Operating
              </label>
              <select
                value={draft.formValues.businessYears || '3-5'}
                onChange={e => updateFormValue('businessYears', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer"
              >
                <option value="new">Newly Established (&lt; 1 Year)</option>
                <option value="1-3">1 - 3 Years</option>
                <option value="3-5">3 - 5 Years</option>
                <option value="5-10">5 - 10 Years</option>
                <option value="10+">10+ Years Established Business</option>
              </select>
            </div>

            {/* Business Tagline */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Business Tagline / Short Overview
              </label>
              <input
                type="text"
                value={draft.formValues.businessTagline || ''}
                onChange={e => updateFormValue('businessTagline', e.target.value)}
                placeholder="e.g. Premium residential & industrial electrical wiring specialists in Kandy"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>

            {/* Company Team Size */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Company Team Size
              </label>
              <select
                value={draft.formValues.companyTeamSize || '2-5'}
                onChange={e => updateFormValue('companyTeamSize', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer"
              >
                <option value="2-5">2 - 5 Employees</option>
                <option value="5-15">5 - 15 Staff</option>
                <option value="15-50">15 - 50 Technical Staff</option>
                <option value="50+">50+ Large Enterprise</option>
              </select>
            </div>

            {/* Business Registration Number (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                BR Number <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <input
                type="text"
                value={draft.formValues.businessRegistrationNo || ''}
                onChange={e => updateFormValue('businessRegistrationNo', e.target.value)}
                placeholder="e.g. PV 0023412 or W/12345"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>

            {/* Website URL (Optional) */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" /> Website or Social Page <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <input
                type="text"
                value={draft.formValues.businessWebsite || ''}
                onChange={e => updateFormValue('businessWebsite', e.target.value)}
                placeholder="e.g. https://www.lankatechelectrical.lk or Facebook / Instagram URL"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
          </div>
        </div>
      )}

      {/* Verification Transparency Box */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 space-y-1">
          <p className="font-bold text-slate-800">Verification & Transparency Policy</p>
          <p className="leading-relaxed">
            RENTOURA.LK ensures trust by displaying accurate provider details. Verified business badges are awarded after identity or BR review upon request via your Account Settings.
          </p>
        </div>
      </div>
    </div>
  );
};
