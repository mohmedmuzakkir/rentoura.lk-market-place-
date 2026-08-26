import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Info, 
  Building2, 
  Calendar, 
  Clock, 
  MapPin, 
  Globe, 
  Users, 
  Star, 
  ChevronRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { JobListingDetail } from '../../types/listingDetailsTypes';

interface JobContentSectionsProps {
  job: JobListingDetail;
  onOpenReviews?: () => void;
}

export const JobContentSections: React.FC<JobContentSectionsProps> = ({ job, onOpenReviews }) => {
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [showAllRequirements, setShowAllRequirements] = useState(false);

  const displayedRequirements = showAllRequirements 
    ? job.requirementsList 
    : job.requirementsList?.slice(0, 7);

  return (
    <div className="space-y-4">
      {/* 2-Column Grid for Job Description & Job Highlights (Reference Image 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Job Description Card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-xs flex flex-col">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-2">
            <Info className="w-3.5 h-3.5 text-[#08A34F]" />
            <span>Job Description</span>
          </div>
          <div className="text-xs leading-relaxed text-slate-600 flex-1">
            <p className={!isDescExpanded ? 'line-clamp-4' : ''}>
              {job.description}
            </p>
            {job.description && job.description.length > 150 && (
              <button
                onClick={() => setIsDescExpanded(!isDescExpanded)}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#08A34F] mt-2 tap-bounce"
              >
                <span>{isDescExpanded ? 'Show Less' : 'Read More'}</span>
                {isDescExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>

        {/* Job Highlights Card */}
        {job.highlights && job.highlights.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-xs flex flex-col">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#08A34F]" />
              <span>Job Highlights</span>
            </div>
            <div className="space-y-2 text-xs text-slate-700 flex-1">
              {job.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rotate-45 bg-[#08A34F] shrink-0" />
                  <span className="font-semibold text-slate-800">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2-Column Grid for Requirements & Job Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Requirements Card */}
        {job.requirementsList && job.requirementsList.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-xs flex flex-col">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-2.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#08A34F]" />
              <span>Requirements</span>
            </div>
            <div className="space-y-2 text-xs text-slate-600 flex-1">
              {displayedRequirements?.map((req, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{req}</span>
                </div>
              ))}
            </div>

            {job.requirementsList.length > 7 && (
              <button
                onClick={() => setShowAllRequirements(!showAllRequirements)}
                className="flex items-center gap-1 text-xs font-bold text-[#08A34F] mt-3 tap-bounce self-start"
              >
                <span>{showAllRequirements ? 'View Fewer Requirements' : 'View All Requirements'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Job Details Meta Card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-xs flex flex-col">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-2.5">
            <Info className="w-3.5 h-3.5 text-[#08A34F]" />
            <span>Job Details</span>
          </div>

          <div className="space-y-2 text-xs divide-y divide-slate-50 flex-1">
            {job.jobIdNumber && (
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-500 font-medium">Job ID</span>
                <span className="font-semibold text-slate-800">{job.jobIdNumber}</span>
              </div>
            )}
            {job.postedDateStr && (
              <div className="flex justify-between items-center pt-1.5">
                <span className="text-slate-500 font-medium">Posted Date</span>
                <span className="font-semibold text-slate-800">{job.postedDateStr}</span>
              </div>
            )}
            {job.applicationDeadline && (
              <div className="flex justify-between items-center pt-1.5">
                <span className="text-slate-500 font-medium">Application Deadline</span>
                <span className="font-semibold text-rose-600">{job.applicationDeadline}</span>
              </div>
            )}
            {job.workingHours && (
              <div className="flex justify-between items-center pt-1.5">
                <span className="text-slate-500 font-medium">Working Hours</span>
                <span className="font-semibold text-slate-800">{job.workingHours}</span>
              </div>
            )}
            {job.workingDays && (
              <div className="flex justify-between items-center pt-1.5">
                <span className="text-slate-500 font-medium">Working Days</span>
                <span className="font-semibold text-slate-800">{job.workingDays}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-1.5">
              <span className="text-slate-500 font-medium">Job Location</span>
              <span className="font-semibold text-slate-800">
                {job.location.city} ({job.workArrangement})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Grid for About the Company & Company Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* About Company Card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-xs flex flex-col">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-2">
            <Building2 className="w-3.5 h-3.5 text-[#08A34F]" />
            <span>About the Company</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            {job.company.about || `${job.company.name} is a verified employer in Sri Lanka.`}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-[11px]">
            {job.company.foundedYear && (
              <div>
                <div className="text-slate-400 font-medium">Founded</div>
                <div className="font-bold text-slate-800">{job.company.foundedYear}</div>
              </div>
            )}
            {job.company.employeeCount && (
              <div>
                <div className="text-slate-400 font-medium">Employees</div>
                <div className="font-bold text-slate-800">{job.company.employeeCount}</div>
              </div>
            )}
            {job.company.industry && (
              <div>
                <div className="text-slate-400 font-medium">Industry</div>
                <div className="font-bold text-slate-800">{job.company.industry}</div>
              </div>
            )}
            {job.company.websiteUrl && (
              <div>
                <div className="text-slate-400 font-medium">Website</div>
                <a 
                  href={`https://${job.company.websiteUrl}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="font-bold text-[#08A34F] hover:underline"
                >
                  {job.company.websiteUrl}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Company Reviews Card */}
        {job.companyReviews && (
          <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900">Company Reviews</span>
              <button 
                onClick={onOpenReviews}
                className="text-[11px] font-bold text-[#08A34F] hover:underline"
              >
                View All
              </button>
            </div>

            <div className="flex items-center gap-3 my-2">
              <div className="text-2xl font-black text-slate-900">
                {job.companyReviews.rating}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(job.companyReviews?.rating || 0)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-[10px] text-slate-400">
                  ({job.companyReviews.count} Reviews)
                </div>
              </div>
            </div>

            {job.companyReviews.featuredReview && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 mt-2">
                <p className="text-xs text-slate-600 italic">
                  "{job.companyReviews.featuredReview.comment}"
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {job.companyReviews.featuredReview.avatarUrl && (
                    <img
                      src={job.companyReviews.featuredReview.avatarUrl}
                      alt={job.companyReviews.featuredReview.author}
                      className="w-5 h-5 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <span className="text-[11px] font-bold text-slate-800">
                    {job.companyReviews.featuredReview.author}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    • {job.companyReviews.featuredReview.role}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
