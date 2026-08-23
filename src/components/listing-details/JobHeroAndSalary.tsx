import React from 'react';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  Users,
  GraduationCap,
  Sparkles,
  Info
} from 'lucide-react';
import { JobListingDetail } from '../../types/listingDetailsTypes';

interface JobHeroAndSalaryProps {
  job: JobListingDetail;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onViewCompany: () => void;
}

export const JobHeroAndSalary: React.FC<JobHeroAndSalaryProps> = ({
  job,
  activeTab,
  onTabChange,
  onViewCompany
}) => {
  const tabs = [
    { id: 'overview', label: 'Job Overview' },
    { id: 'requirements', label: 'Requirements' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'company', label: 'Company' },
    { 
      id: 'reviews', 
      label: job.companyReviews?.count ? `Reviews (${job.companyReviews.count})` : 'Reviews' 
    }
  ];

  const formattedSalary = () => {
    if (job.salary.type === 'range' && job.salary.min && job.salary.max) {
      return `Rs. ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}`;
    }
    if (job.salary.type === 'fixed' && job.salary.min) {
      return `Rs. ${job.salary.min.toLocaleString()}`;
    }
    if (job.salary.type === 'negotiable') {
      return 'Salary Negotiable';
    }
    return 'Salary not disclosed';
  };

  return (
    <div className="space-y-4">
      {/* Job Hero Container */}
      <div className="relative bg-white rounded-3xl border border-slate-100 p-5 shadow-xs overflow-hidden">
        {/* Background Image / Illustration if present */}
        {job.jobHeroImage && (
          <div className="absolute right-0 top-0 w-1/3 h-full opacity-20 pointer-events-none hidden sm:block">
            <img
              src={job.jobHeroImage}
              alt=""
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        <div className="relative z-10 space-y-3">
          {/* Badge */}
          <div className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#08A34F] text-white text-[11px] font-black tracking-wider uppercase shadow-2xs">
            JOB OPPORTUNITY
          </div>

          {/* Job Title */}
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {job.title}
          </h1>

          {/* Company Row & View Company Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3">
              {/* Company Logo / Avatar */}
              <div 
                className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs text-white shadow-xs overflow-hidden"
                style={{ backgroundColor: job.company.logoBg || '#0F172A' }}
              >
                {job.company.logoUrl ? (
                  <img 
                    src={job.company.logoUrl} 
                    alt={job.company.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span>{job.company.logoText || job.company.name.slice(0, 3).toLowerCase()}</span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                  <span>{job.company.name}</span>
                  {job.company.isVerified && (
                    <CheckCircle2 className="w-4 h-4 text-[#08A34F] fill-white" />
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{job.location.city}, {job.location.province}</span>
                </div>
              </div>
            </div>

            {/* View Company CTA */}
            <button
              onClick={onViewCompany}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#08A34F] font-bold text-xs transition-colors tap-bounce"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>View Company</span>
            </button>
          </div>

          {/* Quick Meta Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
              <Briefcase className="w-3.5 h-3.5 text-slate-500" />
              {job.employmentType}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5 text-[#08A34F]" />
              {job.workArrangement}
            </span>
            {job.postedDateStr && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {job.postedDateStr}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200/80">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3 py-2 text-xs font-bold whitespace-nowrap transition-all border-b-2 -mb-[1px] tap-bounce ${
                isActive
                  ? 'border-[#08A34F] text-[#08A34F]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Salary & Quick Specs Bento Card (Image 2) */}
      <div className="bg-white rounded-3xl border border-emerald-100 p-4 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Salary Box */}
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-[#08A34F] tracking-tight">
                {formattedSalary()}
              </span>
              {job.salary.period && job.salary.type !== 'undisclosed' && (
                <span className="text-xs font-bold text-slate-500">
                  / {job.salary.period}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
              <span>Salary Range</span>
              <Info className="w-3 h-3 text-slate-400" />
            </div>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-2 md:pt-0 md:border-l md:border-slate-100 md:pl-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 text-[#08A34F] shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-semibold">Vacancies</div>
                <div className="text-xs font-bold text-slate-800">{job.vacancies}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 text-[#08A34F] shrink-0">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-semibold">Experience</div>
                <div className="text-xs font-bold text-slate-800">{job.experienceLevel}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 text-[#08A34F] shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-semibold">Job Type</div>
                <div className="text-xs font-bold text-slate-800">{job.employmentType}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 text-[#08A34F] shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-semibold">Education</div>
                <div className="text-xs font-bold text-slate-800">{job.educationLevel}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
