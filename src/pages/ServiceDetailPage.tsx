import React, { useState } from 'react';
import { ListingHeader } from '../components/listing-details/ListingHeader';
import { MediaGallery } from '../components/listing-details/MediaGallery';
import { ServiceContentSections } from '../components/listing-details/ServiceContentSections';
import { LocationMapCard } from '../components/listing-details/LocationMapCard';
import { SafetyFirstCard } from '../components/listing-details/SafetyFirstCard';
import { ReportModal } from '../components/listing-details/ReportModal';
import { StickyActionBar } from '../components/listing-details/StickyActionBar';
import { ServiceListingDetail } from '../types/listingDetailsTypes';

interface ServiceDetailPageProps {
  service: ServiceListingDetail;
  onBack: () => void;
  onNavigate: (route: string) => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  service,
  onBack,
  onNavigate,
  isSaved,
  onToggleSave
}) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleOpenMap = () => {
    const query = service.location.lat && service.location.lng
      ? `${service.location.lat},${service.location.lng}`
      : encodeURIComponent(`${service.location.city}, Sri Lanka`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-900">
      {/* Top Sticky Header */}
      <ListingHeader
        onBack={onBack}
        isSaved={isSaved}
        onToggleSave={onToggleSave}
        onOpenReport={() => setIsReportModalOpen(true)}
        shareTitle={service.title}
        themeColor="#FF650A"
      />

      {/* Main Content */}
      <main className="max-w-2xl mx-auto space-y-4 px-3 sm:px-4 pt-2">
        {/* Media Hero Gallery */}
        <div className="rounded-3xl overflow-hidden shadow-xs border border-slate-100 bg-white">
          <MediaGallery
            images={service.images}
            badgeLabel="SERVICE"
            badgeBgColor="#FF650A"
          />
        </div>

        {/* Primary Details, 8-Matrix Specs, Pricing Packages, Provider Profile & Reviews */}
        <ServiceContentSections
          service={service}
          onOpenMap={handleOpenMap}
        />

        {/* Location & Map Card */}
        <LocationMapCard
          location={service.location}
          themeColor="#FF650A"
        />

        {/* Safety First Disclaimer & Report Service Action */}
        <SafetyFirstCard
          module="services"
          onOpenReport={() => setIsReportModalOpen(true)}
        />
      </main>

      {/* Sticky Bottom Action Bar (WhatsApp, Call Now, Message) */}
      <div className="fixed bottom-14 left-0 right-0 z-30 max-w-2xl mx-auto">
        <StickyActionBar
          module="services"
          phone={service.contact.phone}
          whatsappNumber={service.contact.whatsappNumber}
          isSaved={isSaved}
          onToggleSave={onToggleSave}
          onSendMessage={() => onNavigate('/messages')}
          listingTitle={service.title}
        />
      </div>

      {/* Report Service Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        listingId={service.id}
        listingTitle={service.title}
        module="services"
        onOpenFullReportPage={() => onNavigate('/report-listing')}
      />
    </div>
  );
};
