import React, { useState } from 'react';
import { ListingHeader } from '../components/listing-details/ListingHeader';
import { JobHeroAndSalary } from '../components/listing-details/JobHeroAndSalary';
import { JobContentSections } from '../components/listing-details/JobContentSections';
import { SafetyFirstCard } from '../components/listing-details/SafetyFirstCard';
import { ReportModal } from '../components/listing-details/ReportModal';
import { StickyActionBar } from '../components/listing-details/StickyActionBar';
import { JobListingDetail } from '../types/listingDetailsTypes';

interface JobDetailPageProps {
  job: JobListingDetail;
  onBack: () => void;
  onNavigate: (route: string) => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

export const JobDetailPage: React.FC<JobDetailPageProps> = ({
  job,
  onBack,
  onNavigate,
  isSaved,
  onToggleSave
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApplyNow = () => {
    setApplied(true);
    setTimeout(() => {
      onNavigate('/messages');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-900">
      {/* Top Sticky Header */}
      <ListingHeader
        onBack={onBack}
        isSaved={isSaved}
        onToggleSave={onToggleSave}
        onOpenReport={() => setIsReportModalOpen(true)}
        shareTitle={`${job.title} at ${job.company.name}`}
        themeColor="#08A34F"
      />

      {/* Main Content */}
      <main className="max-w-2xl mx-auto space-y-4 px-3 sm:px-4 pt-2">
        {/* Hero Banner, Company Info, Tabs & Salary Card */}
        <JobHeroAndSalary
          job={job}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onViewCompany={() => onNavigate('/profile')}
        />

        {/* Dynamic Job Content Sections (Highlights, Requirements, Meta, About Company, Reviews) */}
        <JobContentSections job={job} />

        {/* Safety First Disclaimer */}
        <SafetyFirstCard
          module="jobs"
          onOpenReport={() => setIsReportModalOpen(true)}
        />
      </main>

      {/* Sticky Bottom Action Bar (Apply Now, WhatsApp, Call HR, Save Job) */}
      <div className="fixed bottom-14 left-0 right-0 z-30 max-w-2xl mx-auto">
        <StickyActionBar
          module="jobs"
          phone={job.contact.phone}
          whatsappNumber={job.contact.whatsappNumber}
          isSaved={isSaved}
          onToggleSave={onToggleSave}
          onSendMessage={() => onNavigate('/messages')}
          onApplyNow={handleApplyNow}
          listingTitle={`${job.title} at ${job.company.name}`}
        />
      </div>

      {/* Applied Toast Alert */}
      {applied && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#08A34F] text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-xl animate-in fade-in zoom-in duration-200">
          ✓ Application submitted! Opening conversation...
        </div>
      )}

      {/* Report Job Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        listingId={job.id}
        listingTitle={`${job.title} - ${job.company.name}`}
        module="jobs"
        onOpenFullReportPage={() => onNavigate('/report-listing')}
      />
    </div>
  );
};
