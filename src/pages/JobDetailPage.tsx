import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, CalendarX } from 'lucide-react';
import { ListingHeader } from '../components/listing-details/ListingHeader';
import { JobHeroAndSalary } from '../components/listing-details/JobHeroAndSalary';
import { JobContentSections } from '../components/listing-details/JobContentSections';
import { SafetyFirstCard } from '../components/listing-details/SafetyFirstCard';
import { ReportModal } from '../components/listing-details/ReportModal';
import { StickyActionBar } from '../components/listing-details/StickyActionBar';
import { JobApplicationModal } from '../components/listing-details/JobApplicationModal';
import { JobListingDetail } from '../types/listingDetailsTypes';
import { ListingDetailService } from '../services/listingDetailService';

interface JobDetailPageProps {
  listingId?: string;
  job?: JobListingDetail | null;
  onBack: () => void;
  onNavigate: (route: string) => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

export const JobDetailPage: React.FC<JobDetailPageProps> = ({
  listingId,
  job: initialJob = null,
  onBack,
  onNavigate,
  isSaved,
  onToggleSave
}) => {
  const [detail, setDetail] = useState<JobListingDetail | null>(initialJob);
  const [loading, setLoading] = useState<boolean>(!initialJob && Boolean(listingId));
  const [activeTab, setActiveTab] = useState('overview');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Load from Supabase DB if initialJob is not supplied but listingId is
  useEffect(() => {
    if (initialJob) {
      setDetail(initialJob);
      setLoading(false);
      return;
    }

    if (!listingId) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    ListingDetailService.getListingDetail(listingId, 'jobs')
      .then((res) => {
        if (!isMounted) return;
        if (res && res.module === 'jobs') {
          setDetail(res as JobListingDetail);
        } else if (res) {
          // Route to correct module if mismatched
          onNavigate(`/${res.module}/${res.id}`);
        } else {
          setDetail(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Error fetching job detail:', err);
        setDetail(null);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [listingId, initialJob, onNavigate]);

  // Check if application deadline has passed
  const isDeadlinePassed = (): boolean => {
    if (!detail?.applicationDeadline) return false;
    const deadlineDate = new Date(detail.applicationDeadline);
    if (isNaN(deadlineDate.getTime())) return false;
    const now = new Date();
    // Compare end of deadline day
    deadlineDate.setHours(23, 59, 59, 999);
    return now > deadlineDate;
  };

  const deadlinePassed = isDeadlinePassed();

  const handleApplyNow = () => {
    if (deadlinePassed) return;
    setIsApplyModalOpen(true);
  };

  const handleViewCompany = () => {
    if (!detail) return;
    onNavigate(`/jobs?company=${encodeURIComponent(detail.company.name)}`);
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <ListingHeader
          onBack={onBack}
          shareTitle="Loading Job Opportunity..."
          themeColor="#08A34F"
        />
        <div className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-10 h-10 border-4 border-[#08A34F] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  // Truthful 404 / Unavailable State
  if (!detail) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <ListingHeader
          onBack={onBack}
          shareTitle="Job Not Found"
          themeColor="#08A34F"
        />
        <main className="max-w-md mx-auto px-4 py-16 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">
            <AlertCircle className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Job Opportunity Unavailable</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            This job listing may have been removed, filled by the employer, or is currently under review.
          </p>
          <button
            onClick={() => onNavigate('/jobs')}
            className="mt-2 px-6 py-2.5 bg-[#08A34F] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all tap-bounce"
          >
            Browse All Jobs
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-900">
      {/* Top Sticky Header */}
      <ListingHeader
        onBack={onBack}
        isSaved={isSaved}
        onToggleSave={onToggleSave}
        onOpenReport={() => setIsReportModalOpen(true)}
        shareTitle={`${detail.title} at ${detail.company.name}`}
        themeColor="#08A34F"
      />

      {/* Main Content */}
      <main className="max-w-2xl mx-auto space-y-4 px-3 sm:px-4 pt-2">
        {/* Deadline Passed Banner if applicable */}
        {deadlinePassed && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-amber-900 shadow-xs">
            <CalendarX className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wide">Application Deadline Passed</h4>
              <p className="text-xs text-amber-800/90 mt-0.5">
                The deadline for this job vacancy ({detail.applicationDeadline}) has passed. Submissions are closed.
              </p>
            </div>
          </div>
        )}

        {/* Hero Banner, Company Info, Tabs & Salary Card */}
        <JobHeroAndSalary
          job={detail}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onViewCompany={handleViewCompany}
        />

        {/* Dynamic Job Content Sections */}
        <JobContentSections job={detail} />

        {/* Safety First Disclaimer */}
        <SafetyFirstCard
          module="jobs"
          onOpenReport={() => setIsReportModalOpen(true)}
        />
      </main>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-14 left-0 right-0 z-30 max-w-2xl mx-auto">
        <StickyActionBar
          module="jobs"
          phone={detail.contact?.phone}
          whatsappNumber={detail.contact?.whatsappNumber}
          isSaved={isSaved}
          onToggleSave={onToggleSave}
          onSendMessage={() => onNavigate('/messages')}
          onApplyNow={deadlinePassed ? undefined : handleApplyNow}
          listingTitle={`${detail.title} at ${detail.company.name}`}
        />
      </div>

      {/* Job Application Modal */}
      {!deadlinePassed && (
        <JobApplicationModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          job={detail}
          onSuccess={() => onNavigate('/messages')}
          onNavigateLogin={() => onNavigate('/login')}
        />
      )}

      {/* Report Job Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        listingId={detail.id}
        listingTitle={`${detail.title} - ${detail.company.name}`}
        module="jobs"
        onOpenFullReportPage={() => onNavigate('/report-listing')}
      />
    </div>
  );
};
