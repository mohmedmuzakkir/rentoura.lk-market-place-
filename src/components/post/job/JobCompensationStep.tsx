import React from 'react';
import { DollarSign, Check, Eye, EyeOff, AlertCircle, Gift } from 'lucide-react';
import { ListingDraft, normalizeNumericPrice } from '../../../types/postFormTypes';

interface JobCompensationStepProps {
  draft: ListingDraft;
  onChange: (updatedDraftPartial: Partial<ListingDraft>) => void;
  errors: Record<string, string>;
  accentColor?: string;
}

export const JobCompensationStep: React.FC<JobCompensationStepProps> = ({
  draft,
  onChange,
  errors,
  accentColor = '#08A34F'
}) => {
  const salaryStructure = draft.formValues.salaryStructure || 'monthly-range';
  const minSalary = draft.formValues.minSalary !== undefined ? draft.formValues.minSalary : 0;
  const maxSalary = draft.formValues.maxSalary !== undefined ? draft.formValues.maxSalary : 0;
  const showSalary = draft.formValues.showSalary !== undefined ? draft.formValues.showSalary : true;
  const benefitsList: string[] = Array.isArray(draft.formValues.benefits) ? draft.formValues.benefits : [];

  const updateFormValue = (key: string, val: any) => {
    onChange({
      formValues: {
        ...draft.formValues,
        [key]: val
      }
    });
  };

  const toggleBenefit = (benefitId: string) => {
    if (benefitsList.includes(benefitId)) {
      updateFormValue('benefits', benefitsList.filter(b => b !== benefitId));
    } else {
      updateFormValue('benefits', [...benefitsList, benefitId]);
    }
  };

  const salaryStructures = [
    { id: 'monthly-range', label: 'Monthly Salary Range', desc: 'e.g. Rs. 120,000 - Rs. 180,000' },
    { id: 'monthly-fixed', label: 'Fixed Monthly Salary', desc: 'Exact fixed monthly pay' },
    { id: 'hourly', label: 'Hourly Pay Rate', desc: 'Pay per hour worked' },
    { id: 'daily', label: 'Daily Rate', desc: 'Pay per day worked' },
    { id: 'commission', label: 'Commission / Incentive Based', desc: 'Earn based on performance' },
    { id: 'negotiable', label: 'Negotiable at Interview', desc: 'Discuss pay directly with candidate' }
  ];

  const availableBenefits = [
    { id: 'meals', label: 'Meals Provided', icon: '🍲' },
    { id: 'transport', label: 'Transport / Fuel Allowance', icon: '🚌' },
    { id: 'accommodation', label: 'Accommodation / Lodging', icon: '🏠' },
    { id: 'insurance', label: 'Medical & Life Insurance', icon: '🏥' },
    { id: 'bonus', label: 'Performance Bonus', icon: '🎯' },
    { id: 'overtime', label: 'Overtime (OT) Pay', icon: '⏱️' },
    { id: 'training', label: 'Training & Skill Courses', icon: '📚' },
    { id: 'flexible_hours', label: 'Flexible Working Hours', icon: '⏰' },
    { id: 'uniform', label: 'Uniform Provided', icon: '👔' }
  ];

  const minFormatted = normalizeNumericPrice(minSalary).formatted;
  const maxFormatted = normalizeNumericPrice(maxSalary).formatted;

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-200">
      {/* Title Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
            Step 5: Compensation & Benefits
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            70% Completed
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Define salary structure, currency values in LKR, and employee perk benefits.
        </p>
      </div>

      {/* Form Fields */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
        {/* Salary Structure Options */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-2">
            Salary Structure <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {salaryStructures.map((struct) => {
              const isSelected = salaryStructure === struct.id;
              return (
                <button
                  key={struct.id}
                  type="button"
                  onClick={() => updateFormValue('salaryStructure', struct.id)}
                  className={`p-3 rounded-xl border text-left transition-all tap-bounce ${
                    isSelected
                      ? 'bg-emerald-50/90 border-[#08A34F] text-slate-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{struct.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#08A34F]" />}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{struct.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Salary Numeric Inputs (LKR) */}
        {salaryStructure !== 'negotiable' && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-[#08A34F]" /> Pay Amount (LKR - Sri Lankan Rupees)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Min Salary / Fixed Salary */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  {salaryStructure === 'monthly-range' ? 'Minimum Salary (LKR) *' : 'Amount / Rate (LKR) *'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-extrabold text-slate-400">Rs.</span>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={minSalary}
                    onChange={(e) => updateFormValue('minSalary', Number(e.target.value))}
                    placeholder="120000"
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.salary ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
                    }`}
                  />
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold block mt-1">{minFormatted}</span>
              </div>

              {/* Max Salary (If Range) */}
              {salaryStructure === 'monthly-range' && (
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Maximum Salary (LKR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-extrabold text-slate-400">Rs.</span>
                    <input
                      type="number"
                      min={0}
                      step={1000}
                      value={maxSalary}
                      onChange={(e) => updateFormValue('maxSalary', Number(e.target.value))}
                      placeholder="180000"
                      className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        errors.salary ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold block mt-1">{maxFormatted}</span>
                </div>
              )}
            </div>

            {errors.salary && (
              <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.salary}
              </p>
            )}
          </div>
        )}

        {/* Salary Visibility Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-3">
            {showSalary ? <Eye className="w-5 h-5 text-[#08A34F]" /> : <EyeOff className="w-5 h-5 text-slate-400" />}
            <div>
              <h4 className="text-xs font-bold text-slate-800">Show Salary Amount on Job Listing</h4>
              <p className="text-[11px] text-slate-500">
                {showSalary ? 'Job seekers will see the exact salary figure' : 'Displays "Negotiable / Discuss at Interview" instead of numbers'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => updateFormValue('showSalary', !showSalary)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
              showSalary ? 'bg-[#08A34F]' : 'bg-slate-300'
            }`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
              showSalary ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Perks & Benefits Checkboxes */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-2 flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-[#08A34F]" /> Provided Perks & Benefits
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {availableBenefits.map((b) => {
              const isSelected = benefitsList.includes(b.id);
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => toggleBenefit(b.id)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left flex items-center gap-2 tap-bounce ${
                    isSelected
                      ? 'bg-emerald-50 border-[#08A34F] text-[#08A34F] shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-base">{b.icon}</span>
                  <span className="truncate flex-1">{b.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#08A34F]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
