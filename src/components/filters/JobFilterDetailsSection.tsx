import React from 'react';
import { JobFilterData } from '../../types/filterTypes';
import { 
  JOB_EMPLOYMENT_TYPES, 
  JOB_WORK_ARRANGEMENTS, 
  JOB_EXPERIENCE_LEVELS, 
  JOB_EDUCATION_LEVELS, 
  JOB_BENEFITS 
} from '../../data/advancedFilterConfig';

interface JobFilterDetailsSectionProps {
  job: JobFilterData;
  onChange: (job: JobFilterData) => void;
  primaryColor: string;
}

export const JobFilterDetailsSection: React.FC<JobFilterDetailsSectionProps> = ({
  job,
  onChange,
  primaryColor
}) => {
  const toggleEmpType = (type: string) => {
    const current = job.employmentType || [];
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    onChange({ ...job, employmentType: updated });
  };

  const toggleWorkArr = (arr: string) => {
    const current = job.workArrangement || [];
    const updated = current.includes(arr)
      ? current.filter(a => a !== arr)
      : [...current, arr];
    onChange({ ...job, workArrangement: updated });
  };

  const toggleBenefit = (b: string) => {
    const current = job.benefits || [];
    const updated = current.includes(b)
      ? current.filter(item => item !== b)
      : [...current, b];
    onChange({ ...job, benefits: updated });
  };

  return (
    <div className="space-y-4">
      {/* 1. Employment Type */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Employment Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {JOB_EMPLOYMENT_TYPES.map(type => {
            const isSelected = job.employmentType?.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleEmpType(type)}
                className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 border-[#08A34F] text-[#08A34F] font-bold shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Work Arrangement */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Work Arrangement
        </label>
        <div className="grid grid-cols-3 gap-2">
          {JOB_WORK_ARRANGEMENTS.map(arr => {
            const isSelected = job.workArrangement?.includes(arr);
            return (
              <button
                key={arr}
                type="button"
                onClick={() => toggleWorkArr(arr)}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 border-[#08A34F] text-[#08A34F] ring-1 ring-[#08A34F]'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {arr}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Experience Level */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Experience Level
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {JOB_EXPERIENCE_LEVELS.map(exp => {
            const isSelected = job.experienceLevel === exp;
            return (
              <button
                key={exp}
                type="button"
                onClick={() => onChange({ ...job, experienceLevel: isSelected ? undefined : exp })}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer truncate ${
                  isSelected
                    ? 'bg-emerald-50 border-[#08A34F] text-[#08A34F] ring-1 ring-[#08A34F]'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {exp}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Benefits */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Benefits & Perks
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {JOB_BENEFITS.map(b => {
            const isChecked = job.benefits?.includes(b);
            return (
              <button
                key={b}
                type="button"
                onClick={() => toggleBenefit(b)}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold border text-left transition-all cursor-pointer truncate ${
                  isChecked
                    ? 'bg-emerald-50 border-[#08A34F] text-[#08A34F] font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {isChecked ? '✓ ' : '+ '} {b}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
