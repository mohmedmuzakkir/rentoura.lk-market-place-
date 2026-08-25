import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  ChevronRight, 
  Phone,
  MessageSquare,
  AlertCircle
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
import { ListingDetailService } from '../services/listingDetailService';

interface RentalDetailPageProps {
  listingId?: string;
  listing?: RentalListingDetail | null;
  onBack: () => void;
  onNavigate: (route: string) => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

export const RentalDetailPage: React.FC<RentalDetailPageProps> = ({
  listingId,
  listing: initialListing = null,
  onBack,
  onNavigate,
  isSaved,
  onToggleSave
}) => {
  const [detail, setDetail] = useState<RentalListingDetail | null>(initialListing);
  const [loading, setLoading] = useState<boolean>(!initialListing && Boolean(listingId));
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activePeriod, setActivePeriod] = useState<RentalPeriodUnit>('Day');

  // Load from Supabase DB if initialListing is not supplied but listingId is
  useEffect(() => {
    if (initialListing) {
      setDetail(initialListing);
      if (initialListing.pricing?.activePeriod) {
        setActivePeriod(initialListing.pricing.activePeriod);
      }
      setLoading(false);
      return;
    }

    if (!listingId) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    ListingDetailService.getListingDetail(listingId, 'rentals')
      .then((res) => {
        if (!isMounted) return;
        if (res && res.module === 'rentals') {
          const rentalRes = res as unknown as RentalListingDetail;
          setDetail(rentalRes);
          if (rentalRes.pricing?.activePeriod) {
            setActivePeriod(rentalRes.pricing.activePeriod);
          }
        } else if (res) {
          // If fetched listing has different module, route accordingly
          onNavigate(`/${res.module}/${res.id}`);
        } else {
          setDetail(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Error fetching rental detail:', err);
        setDetail(null);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [listingId, initialListing, onNavigate]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <ListingHeader
          onBack={onBack}
          shareTitle="Loading Rental..."
          themeColor="#1464F4"
        />
        <div className="max-w-2xl lg:max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-10 h-10 border-4 border-[#1464F4] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Loading rental details...</p>
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
          shareTitle="Listing Not Found"
          themeColor="#1464F4"
        />
        <main className="max-w-md mx-auto px-4 py-16 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">
            <AlertCircle className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Rental Listing Unavailable</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            This rental listing may have been removed, expired, or is currently pending review.
          </p>
          <button
            onClick={onBack}
            className="mt-2 px-6 py-2.5 bg-[#1464F4] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition-all tap-bounce"
          >
            Browse All Rentals
          </button>
        </main>
      </div>
    );
  }

  const fullLocationString = [
    detail.location.city,
    detail.location.district,
    detail.location.province
  ]
    .filter(Boolean)
    .join(', ') || 'Sri Lanka';

  const handleOpenMap = () => {
    const query = detail.location.lat && detail.location.lng
      ? `${detail.location.lat},${detail.location.lng}`
      : encodeURIComponent(`${fullLocationString}, Sri Lanka`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const hasPhone = Boolean(detail.contact?.phone);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 lg:pb-16 text-slate-900">
      {/* Top Header */}
      <ListingHeader
        onBack={onBack}
        isSaved={isSaved}
        onToggleSave={onToggleSave}
        onOpenReport={() => setIsReportModalOpen(true)}
        shareTitle={detail.title}
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
                images={detail.images || []}
                badgeLabel="RENTAL"
                badgeBgColor="#1464F4"
              />
            </div>

            {/* Primary Information Header */}
            <div className="bg-white rounded-3xl border border-slate-100 p-4 lg:p-6 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                  {detail.title}
                </h1>

                {detail.isVerified && (
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
              {detail.attributes && (
                <DynamicAttributeGrid attributes={detail.attributes} />
              )}
            </div>

            {/* Price Card for Mobile only inside left flow */}
            {detail.pricing?.rates && (
              <div className="lg:hidden">
                <RentalPriceCard
                  rates={detail.pricing.rates}
                  activePeriod={activePeriod}
                  onPeriodChange={setActivePeriod}
                  isNegotiable={detail.pricing.isNegotiable}
                  deposit={detail.pricing.deposit}
                />
              </div>
            )}

            {/* Category Features */}
            {detail.features && detail.features.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-100 p-4 lg:p-6 shadow-xs">
                <CategoryFeatures features={detail.features} />
              </div>
            )}

            {/* Specs & Security Policies */}
            <RentalSpecsSection listing={detail} />

            {/* Description Card */}
            {detail.description && (
              <DescriptionCard
                title="Description"
                description={detail.description}
                themeColor="#1464F4"
              />
            )}

            {/* Location & Map Card */}
            <LocationMapCard
              location={detail.location}
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
            {detail.pricing?.rates && (
              <RentalPriceCard
                rates={detail.pricing.rates}
                activePeriod={activePeriod}
                onPeriodChange={setActivePeriod}
                isNegotiable={detail.pricing.isNegotiable}
                deposit={detail.pricing.deposit}
              />
            )}

            {/* Owner Profile Card (non-navigating as required) */}
            {detail.owner && (
              <OwnerProfileCard
                owner={detail.owner}
              />
            )}

            {/* Direct Contact Actions Box */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-lg space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Contact Rental Owner</h3>
              
              {hasPhone ? (
                <a
                  href={`tel:${detail.contact.phone}`}
                  className="w-full py-3 px-4 bg-[#1464F4] hover:bg-blue-600 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Phone className="w-4 h-4" />
                  Call {detail.contact.phone}
                </a>
              ) : (
                <button
                  disabled
                  className="w-full py-3 px-4 bg-slate-100 text-slate-400 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <Phone className="w-4 h-4" />
                  Phone Number Hidden
                </button>
              )}

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
          phone={detail.contact?.phone}
          whatsappNumber={detail.contact?.whatsappNumber}
          isSaved={isSaved}
          onToggleSave={onToggleSave}
          onSendMessage={() => onNavigate('/messages')}
          listingTitle={detail.title}
        />
      </div>

      {/* Report Listing Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        listingId={detail.id}
        listingTitle={detail.title}
        module="rentals"
        onOpenFullReportPage={() => onNavigate('/report-listing')}
      />
    </div>
  );
};
