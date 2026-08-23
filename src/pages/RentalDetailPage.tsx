import React, { useState } from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  ChevronRight, 
  Sparkles,
  Heart,
  Phone,
  MessageSquare
} from 'lucide-react';
import { ListingHeader } from '../components/listing-details/ListingHeader';
import { MediaGallery } from '../components/listing-details/MediaGallery';
import { DynamicAttributeGrid } from '../components/listing-details/DynamicAttributeGrid';
import { RentalPriceCard } from '../components/listing-details/RentalPriceCard';
import { CategoryFeatures } from '../components/listing-details/CategoryFeatures';
import { RentalSpecsSection } from '../components/listing-details/RentalSpecsSection';
import { DescriptionCard } from '../components/listing-details/DescriptionCard';
import { OwnerProfileCard } from '../components/listing-details/OwnerProfileCard';
import { LocationMapCard } from '../components/listing-details/LocationMapCard';
import { SafetyFirstCard } from '../components/listing-details/SafetyFirstCard';
import { ReportModal } from '../components/listing-details/ReportModal';
import { StickyActionBar } from '../components/listing-details/StickyActionBar';
import { RentalListingDetail, RentalPeriodUnit } from '../types/listingDetailsTypes';

interface RentalDetailPageProps {
  listing: RentalListingDetail;
  onBack: () => void;
  onNavigate: (route: string) => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

export const RentalDetailPage: React.FC<RentalDetailPageProps> = ({
  listing,
  onBack,
  onNavigate,
  isSaved,
  onToggleSave
}) => {
  const [activePeriod, setActivePeriod] = useState<RentalPeriodUnit>(
    listing.pricing.activePeriod || 'Day'
  );
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const fullLocationString = [
    listing.location.city,
    listing.location.district,
    listing.location.province
  ]
    .filter(Boolean)
    .join(', ');

  const handleOpenMap = () => {
    const query = listing.location.lat && listing.location.lng
      ? `${listing.location.lat},${listing.location.lng}`
      : encodeURIComponent(`${listing.location.city}, Sri Lanka`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 lg:pb-16 text-slate-900">
      {/* Top Header */}
      <ListingHeader
        onBack={onBack}
        isSaved={isSaved}
        onToggleSave={onToggleSave}
        onOpenReport={() => setIsReportModalOpen(true)}
        shareTitle={listing.title}
        themeColor="#1464F4"
      />

      {/* Main Content Container (Mobile single column, Desktop 12-col grid) */}
      <main className="max-w-2xl lg:max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-2 lg:pt-6">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          {/* Left Main Content (8 cols on Desktop) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4 lg:space-y-6">
            {/* Media Hero Gallery */}
            <div className="rounded-3xl overflow-hidden shadow-xs border border-slate-100 bg-white">
              <MediaGallery
                images={listing.images}
                badgeLabel="RENTAL"
                badgeBgColor="#1464F4"
              />
            </div>

            {/* Primary Information Header */}
            <div className="bg-white rounded-3xl border border-slate-100 p-4 lg:p-6 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                  {listing.title}
                </h1>

                {listing.isVerified && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-[#1464F4] text-xs font-bold border border-blue-200/80">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>VERIFIED LISTING</span>
                  </div>
                )}
              </div>

              {/* Location row */}
              <div className="flex items-center justify-between gap-2 text-xs lg:text-sm">
                <div className="flex items-center gap-1.5 text-slate-600 font-medium truncate">
                  <MapPin className="w-4 h-4 text-[#1464F4] shrink-0" />
                  <span className="truncate">{fullLocationString}</span>
                </div>
                <button
                  onClick={handleOpenMap}
                  className="text-[#1464F4] font-bold flex items-center gap-0.5 hover:underline shrink-0 tap-bounce"
                >
                  <span>View on Map</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Dynamic Attributes Grid */}
              <DynamicAttributeGrid attributes={listing.attributes} />
            </div>

            {/* Price Card for Mobile only inside left flow */}
            <div className="lg:hidden">
              <RentalPriceCard
                rates={listing.pricing.rates}
                activePeriod={activePeriod}
                onPeriodChange={setActivePeriod}
                isNegotiable={listing.pricing.isNegotiable}
              />
            </div>

            {/* Category Features */}
            {listing.features && listing.features.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-100 p-4 lg:p-6 shadow-xs">
                <CategoryFeatures features={listing.features} />
              </div>
            )}

            {/* Specs & Security Policies */}
            <RentalSpecsSection listing={listing} />

            {/* Description Card */}
            <DescriptionCard
              title="Description"
              description={listing.description}
              themeColor="#1464F4"
            />

            {/* Location & Map Card */}
            <LocationMapCard
              location={listing.location}
              themeColor="#1464F4"
            />

            {/* Safety First Disclaimer */}
            <SafetyFirstCard
              module="rentals"
              onOpenReport={() => setIsReportModalOpen(true)}
            />
          </div>

          {/* Right Sticky Column (4 cols on Desktop) */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Desktop Price Card */}
            <RentalPriceCard
              rates={listing.pricing.rates}
              activePeriod={activePeriod}
              onPeriodChange={setActivePeriod}
              isNegotiable={listing.pricing.isNegotiable}
            />

            {/* Owner Profile Card */}
            <OwnerProfileCard
              owner={listing.owner}
              onClick={() => onNavigate('/profile')}
            />

            {/* Direct Contact Actions Box */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-lg space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Contact Rental Owner</h3>
              
              <a
                href={`tel:${listing.contact.phone}`}
                className="w-full py-3 px-4 bg-[#1464F4] hover:bg-blue-600 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Phone className="w-4 h-4" />
                Call {listing.contact.phone}
              </a>

              <button
                onClick={() => onNavigate('/messages')}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <MessageSquare className="w-4 h-4 text-sky-400" />
                Chat on Rentoura
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Action Bar for Mobile */}
      <div className="lg:hidden fixed bottom-14 left-0 right-0 z-30 max-w-2xl mx-auto">
        <StickyActionBar
          module="rentals"
          phone={listing.contact.phone}
          whatsappNumber={listing.contact.whatsappNumber}
          isSaved={isSaved}
          onToggleSave={onToggleSave}
          onSendMessage={() => onNavigate('/messages')}
          listingTitle={listing.title}
        />
      </div>

      {/* Report Listing Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        listingId={listing.id}
        listingTitle={listing.title}
        module="rentals"
        onOpenFullReportPage={() => onNavigate('/report-listing')}
      />
    </div>
  );
};
