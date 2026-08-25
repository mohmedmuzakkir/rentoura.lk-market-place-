import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, ArrowRight, CheckCircle2, ShieldCheck, Wrench, User, MapPin, Clock, DollarSign, Image, PhoneCall, Sparkles } from 'lucide-react';
import { ListingDraft, LocationDataState } from '../../../types/postFormTypes';
import { PostStepIndicator, StepItem } from '../PostStepIndicator';
import { PostDraftService } from '../../../services/postDraftService';
import { ListingSubmissionService } from '../../../services/listingSubmissionService';
import { SubmissionSuccessModal } from '../SubmissionSuccessModal';
import { ServiceBasicInfoStep } from './ServiceBasicInfoStep';
import { ServiceProviderStep } from './ServiceProviderStep';
import { ServiceLocationStep } from './ServiceLocationStep';
import { ServiceAvailabilityStep } from './ServiceAvailabilityStep';
import { ServicePricingStep } from './ServicePricingStep';
import { ServiceGalleryStep } from './ServiceGalleryStep';
import { ServiceContactStep } from './ServiceContactStep';
import { ServiceReviewStep } from './ServiceReviewStep';

import { AppRoute } from '../../../types';

interface ServicePostFlowProps {
  initialDraft?: ListingDraft;
  onNavigate?: (route: AppRoute) => void;
  onCancel?: () => void;
  onSuccess?: (listingId: string) => void;
}

const SERVICE_STEPS: StepItem[] = [
  { number: 1, label: 'Category', shortLabel: 'Category', icon: Wrench },
  { number: 2, label: 'Provider', shortLabel: 'Provider', icon: User },
  { number: 3, label: 'Location', shortLabel: 'Location', icon: MapPin },
  { number: 4, label: 'Hours', shortLabel: 'Hours', icon: Clock },
  { number: 5, label: 'Pricing', shortLabel: 'Pricing', icon: DollarSign },
  { number: 6, label: 'Gallery', shortLabel: 'Gallery', icon: Image },
  { number: 7, label: 'Contact', shortLabel: 'Contact', icon: PhoneCall },
  { number: 8, label: 'Review', shortLabel: 'Review', icon: CheckCircle2 }
];

export const ServicePostFlow: React.FC<ServicePostFlowProps> = ({
  initialDraft,
  onNavigate,
  onCancel,
  onSuccess
}) => {
  const accentColor = '#FF650A'; // Service Orange Accent

  // Initialize draft state
  const [draft, setDraft] = useState<ListingDraft>(() => {
    if (initialDraft && initialDraft.module === 'services') {
      return initialDraft;
    }
    const saved = PostDraftService.getDraft('services');
    if (saved) return saved;

    // Create fresh initial draft
    const fresh = PostDraftService.createInitialDraft('services');
    return {
      ...fresh,
      module: 'services',
      categoryId: 'electrical-services',
      categoryName: 'Electrical Services',
      subcategoryId: 'house-wiring-full',
      subcategoryName: 'House & Building Wiring',
      categoryPath: 'Services > Electrical Services > House & Building Wiring',
      formValues: {
        title: 'Professional House Wiring & Electrical Repair Service',
        shortDescription: 'Certified electrical service for homes, apartments, offices and commercial shops.',
        description: 'Experienced electrician providing comprehensive electrical solutions across Kandy and Central Province. Services include complete house wiring, tripping fault finding, DB board setup, switch socket fitting, inverter connection, and 24/7 emergency power restoration.',
        providerType: 'individual',
        providerName: 'Muzakkir M.',
        yearsExperience: '5-10',
        pricingModel: 'hourly',
        price: 2500,
        serviceMode: 'customer_location',
        serviceRadius: '25km',
        emergencyAvailable: true,
        minAdvanceNotice: '1-hour'
      },
      location: {
        provinceId: 'central',
        provinceName: 'Central Province',
        districtId: 'kandy',
        districtName: 'Kandy District',
        cityId: 'kandy-city',
        cityName: 'Kandy',
        address: 'Peradeniya Road, Kandy',
        hideExactAddress: false
      },
      contactPreferences: {
        contactName: 'Muzakkir M.',
        showPhone: true,
        phone: '077 123 4567',
        showWhatsApp: true,
        whatsappNumber: '077 123 4567',
        allowDirectChat: true
      }
    };
  });

  const [currentStep, setCurrentStep] = useState<number>(draft.currentStep || 1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdListing, setCreatedListing] = useState<any | null>(null);

  // Auto-save draft on changes
  useEffect(() => {
    const updated = { ...draft, currentStep };
    PostDraftService.saveDraft(updated);
  }, [draft, currentStep]);

  const updateDraft = (fields: Partial<ListingDraft>) => {
    setDraft(prev => ({
      ...prev,
      ...fields
    }));
    // Clear errors for touched fields
    if (errors) setErrors({});
  };

  // Step Validation Logic
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!draft.formValues.title || draft.formValues.title.trim().length < 8) {
        newErrors.title = 'Please enter a clear title (at least 8 characters)';
      }
      if (!draft.categoryId) {
        newErrors.category = 'Please select a service category';
      }
      if (!draft.formValues.description || draft.formValues.description.trim().length < 20) {
        newErrors.description = 'Please enter a detailed service description (at least 20 characters)';
      }
    }

    if (step === 2) {
      if (draft.formValues.providerType === 'business' && (!draft.formValues.businessName || !draft.formValues.businessName.trim())) {
        newErrors.businessName = 'Please enter your business or company name';
      }
      if (draft.formValues.providerType === 'individual' && (!draft.formValues.providerName || !draft.formValues.providerName.trim())) {
        newErrors.providerName = 'Please enter your display name';
      }
    }

    if (step === 3) {
      if (!draft.location?.cityId && !draft.location?.cityName) {
        newErrors.location = 'Please select your primary city or town';
      }
    }

    if (step === 5) {
      if (draft.formValues.pricingModel !== 'contact' && (draft.formValues.price === undefined || draft.formValues.price < 0)) {
        newErrors.price = 'Please enter a valid price rate';
      }
    }

    if (step === 7) {
      if (!draft.contactPreferences?.phone || draft.contactPreferences.phone.trim().length < 9) {
        newErrors.phone = 'Please enter a valid Sri Lankan mobile phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 8) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (onCancel) {
      onCancel();
    }
  };

  const handleManualSaveDraft = () => {
    setSaveStatus('saving');
    PostDraftService.saveDraft({ ...draft, currentStep });
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 500);
  };

  const handleSubmit = async () => {
    // Validate final step requirements
    if (!validateStep(1) || !validateStep(7)) {
      alert('Please complete all required fields in Step 1 and Step 7.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await ListingSubmissionService.submitListing(draft);
      if (result.success) {
        setCreatedListing(result.listing);
        if (onSuccess) onSuccess(result.listing.id);
      } else {
        alert(result.error || 'Failed to submit service listing.');
      }
    } catch (e: any) {
      alert('An unexpected error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-32">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="p-1.5 -ml-1.5 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Exit
          </button>

          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <span className="text-xs font-extrabold text-slate-900 tracking-tight uppercase">
              Offer Your Service or Skill
            </span>
          </div>

          <button
            type="button"
            onClick={handleManualSaveDraft}
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/60 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Draft'}
          </button>
        </div>
      </header>

      {/* Interactive 8-Step Indicator */}
      <PostStepIndicator
        currentStep={currentStep}
        totalSteps={8}
        steps={SERVICE_STEPS}
        onSelectStep={(step) => {
          if (step < currentStep) setCurrentStep(step);
        }}
        accentColor={accentColor}
      />

      {/* Main Step Body */}
      <main className="max-w-xl mx-auto px-4 pt-4">
        {currentStep === 1 && (
          <ServiceBasicInfoStep
            draft={draft}
            onChange={updateDraft}
            errors={errors}
            accentColor={accentColor}
          />
        )}

        {currentStep === 2 && (
          <ServiceProviderStep
            draft={draft}
            onChange={updateDraft}
            errors={errors}
            accentColor={accentColor}
          />
        )}

        {currentStep === 3 && (
          <ServiceLocationStep
            draft={draft}
            onChange={updateDraft}
            errors={errors}
            accentColor={accentColor}
          />
        )}

        {currentStep === 4 && (
          <ServiceAvailabilityStep
            draft={draft}
            onChange={updateDraft}
            errors={errors}
            accentColor={accentColor}
          />
        )}

        {currentStep === 5 && (
          <ServicePricingStep
            draft={draft}
            onChange={updateDraft}
            errors={errors}
            accentColor={accentColor}
          />
        )}

        {currentStep === 6 && (
          <ServiceGalleryStep
            draft={draft}
            onChange={updateDraft}
            errors={errors}
            accentColor={accentColor}
          />
        )}

        {currentStep === 7 && (
          <ServiceContactStep
            draft={draft}
            onChange={updateDraft}
            errors={errors}
            accentColor={accentColor}
          />
        )}

        {currentStep === 8 && (
          <ServiceReviewStep
            draft={draft}
            onGoToStep={setCurrentStep}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            accentColor={accentColor}
          />
        )}
      </main>

      {/* Sticky Step Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-3 px-4 shadow-lg">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <button
            type="button"
            onClick={handleManualSaveDraft}
            className="hidden sm:flex px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5 text-slate-400" /> Save Draft
          </button>

          {currentStep < 8 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white transition-all shadow-md flex items-center gap-2 active:scale-95"
              style={{ backgroundColor: accentColor }}
            >
              Save & Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white transition-all shadow-md flex items-center gap-2 bg-[#FF650A] hover:bg-amber-600"
            >
              {isSubmitting ? 'Submitting...' : 'SUBMIT FOR REVIEW'}
            </button>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {createdListing && (
        <SubmissionSuccessModal
          listing={createdListing}
          onNavigate={onNavigate}
          onClose={() => {
            if (onCancel) onCancel();
          }}
        />
      )}
    </div>
  );
};
