import React, { useState, useEffect } from 'react';
import { AlertCircle, Wrench, X } from 'lucide-react';
import { ListingHeader } from '../components/listing-details/ListingHeader';
import { MediaGallery } from '../components/listing-details/MediaGallery';
import { ServiceContentSections } from '../components/listing-details/ServiceContentSections';
import { LocationMapCard } from '../components/listing-details/LocationMapCard';
import { SafetyFirstCard } from '../components/listing-details/SafetyFirstCard';
import { ReportModal } from '../components/listing-details/ReportModal';
import { StickyActionBar } from '../components/listing-details/StickyActionBar';
import { ServiceInquiryModal } from '../components/listing-details/ServiceInquiryModal';
import { ServiceListingDetail } from '../types/listingDetailsTypes';
import { ListingDetailService } from '../services/listingDetailService';
import { ProtectedActionRequest } from '../services/protectedActionService';
import { buildOwnerWhatsAppUrl } from '../utils/contactLinks';

interface ServiceDetailPageProps {
  listingId?: string;
  service?: ServiceListingDetail | null;
  onBack: () => void;
  onNavigate: (route: string) => void;
  isSaved: boolean;
  onToggleSave: () => void;
  onProtectedAction: (request: ProtectedActionRequest) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  listingId,
  service: initialService = null,
  onBack,
  onNavigate,
  isSaved,
  onToggleSave,
  onProtectedAction
}) => {
  const [detail, setDetail] = useState<ServiceListingDetail | null>(initialService);
  const [loading, setLoading] = useState<boolean>(!initialService && Boolean(listingId));
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [activeLightboxImg, setActiveLightboxImg] = useState<string | null>(null);

  useEffect(() => {
    if (initialService) {
      setDetail(initialService);
      setLoading(false);
      return;
    }

    if (!listingId) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    ListingDetailService.getListingDetail(listingId, 'services')
      .then((res) => {
        if (!isMounted) return;
        if (res && res.module === 'services') {
          setDetail(res as ServiceListingDetail);
        } else if (res) {
          onNavigate(`/${res.module}/${res.id}`);
        } else {
          setDetail(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Error fetching service detail:', err);
        setDetail(null);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [listingId, initialService, onNavigate]);

  const handleOpenMap = () => {
    if (!detail) return;
    const locationParts = [detail.location.city, detail.location.district, detail.location.province].filter(Boolean);
    const query = detail.location.lat && detail.location.lng
      ? `${detail.location.lat},${detail.location.lng}`
      : encodeURIComponent(`${locationParts.join(', ')}, Sri Lanka`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-900">
        <ListingHeader
          onBack={onBack}
          isSaved={isSaved}
          onToggleSave={onToggleSave}
          onOpenReport={() => {}}
          shareTitle="Loading Service..."
          themeColor="#FF650A"
        />
        <div className="max-w-2xl mx-auto p-6 text-center space-y-4 pt-12">
          <div className="w-12 h-12 border-4 border-[#FF650A]/20 border-t-[#FF650A] rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-900">
        <ListingHeader
          onBack={onBack}
          isSaved={false}
          onToggleSave={() => {}}
          onOpenReport={() => {}}
          shareTitle="Service Unavailable"
          themeColor="#FF650A"
        />
        <div className="max-w-md mx-auto p-6 text-center space-y-4 pt-16">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-600">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-black text-slate-900">Service Not Available</h2>
          <p className="text-xs text-slate-500">
            This service listing could not be found or is no longer active.
          </p>
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-[#FF650A] text-white text-xs font-bold rounded-xl hover:bg-orange-600 transition-colors"
          >
            Back to Services
          </button>
        </div>
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
        shareTitle={detail.title}
        themeColor="#FF650A"
      />

      {/* Main Content */}
      <main className="max-w-2xl mx-auto space-y-4 px-3 sm:px-4 pt-2">
        {/* Media Hero Gallery */}
        <div className="rounded-3xl overflow-hidden shadow-xs border border-slate-100 bg-white">
          <MediaGallery
            images={detail.images && detail.images.length > 0 ? detail.images : ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80']}
            badgeLabel="SERVICE"
            badgeBgColor="#FF650A"
          />
        </div>

        {/* Primary Details, Matrix Specs, Pricing Packages, Provider Profile */}
        <ServiceContentSections
          service={detail}
          onOpenMap={handleOpenMap}
          onOpenPortfolioLightbox={() => {
            if (detail.portfolioImages && detail.portfolioImages.length > 0) {
              setActiveLightboxImg(detail.portfolioImages[0]);
            }
          }}
        />

        {/* Location & Map Card */}
        <LocationMapCard
          location={detail.location}
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
          phone={detail.contact?.phone}
          whatsappNumber={detail.contact?.whatsappNumber}
          isSaved={isSaved}
          onToggleSave={onToggleSave}
          onSendMessage={() => onProtectedAction({ type: 'inquiry', returnRoute: `/services/${detail.id}`, execute: () => setIsInquiryModalOpen(true) })}
          onCall={detail.contact?.phone ? () => onProtectedAction({ type: 'call', returnRoute: `/services/${detail.id}`, execute: () => { window.location.href = `tel:${detail.contact.phone}`; } }) : undefined}
          onWhatsApp={(detail.contact?.whatsappNumber || detail.contact?.phone) ? () => onProtectedAction({ type: 'whatsapp', returnRoute: `/services/${detail.id}`, execute: () => { const url = buildOwnerWhatsAppUrl(detail.contact?.whatsappNumber || detail.contact?.phone, detail.title); if (url) window.location.href = url; } }) : undefined}
        />
      </div>

      {/* Service Inquiry Modal */}
      <ServiceInquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        service={detail}
        onSuccess={() => onNavigate('/messages')}
        onNavigateLogin={() => onNavigate('/login')}
      />

      {/* Report Service Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        listingId={detail.id}
        listingTitle={detail.title}
        module="services"
        onOpenFullReportPage={() => onNavigate('/report-listing')}
      />

      {/* Portfolio Lightbox Modal */}
      {activeLightboxImg && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <button
            onClick={() => setActiveLightboxImg(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 text-white rounded-full hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={activeLightboxImg}
            alt="Portfolio Lightbox"
            className="max-w-full max-h-[85vh] object-contain rounded-2xl"
          />
        </div>
      )}
    </div>
  );
};
