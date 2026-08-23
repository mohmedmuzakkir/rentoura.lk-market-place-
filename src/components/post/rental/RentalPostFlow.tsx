import React, { useState, useEffect } from 'react';
import { AppRoute } from '../../../types';
import { UserListingItem } from '../../../types/profileTypes';
import { ListingDraft, validateSriLankanPhone, LocationDataState, RentalPricingState, RentalRulesState, UploadedImage } from '../../../types/postFormTypes';
import { PostDraftService } from '../../../services/postDraftService';
import { ListingSubmissionService } from '../../../services/listingSubmissionService';
import { PostStepIndicator, StepItem } from '../PostStepIndicator';
import { SubmissionSuccessModal } from '../SubmissionSuccessModal';
import { RentalBasicInfoStep } from './RentalBasicInfoStep';
import { RentalLocationStep } from './RentalLocationStep';
import { RentalPricingStep } from './RentalPricingStep';
import { RentalSpecificationsStep } from './RentalSpecificationsStep';
import { RentalMediaStep } from './RentalMediaStep';
import { RentalRulesContactStep } from './RentalRulesContactStep';
import { RentalReviewStep } from './RentalReviewStep';
import { ArrowLeft, ArrowRight, Save, Trash2, Layers, MapPin, DollarSign, Sliders, Image, PhoneCall, CheckCircle2, AlertCircle } from 'lucide-react';

interface RentalPostFlowProps {
  onNavigate: (route: AppRoute) => void;
  onListingCreated?: (listing: UserListingItem) => void;
}

export const RentalPostFlow: React.FC<RentalPostFlowProps> = ({
  onNavigate,
  onListingCreated
}) => {
  const accentColor = '#1464F4';

  // Initialize draft from localStorage or create new
  const [draft, setDraft] = useState<ListingDraft>(() => {
    const existing = PostDraftService.getDraft('rentals');
    if (existing) {
      return {
        ...existing,
        pricing: existing.pricing || {
          rate: existing.formValues?.price || 12500,
          ratePeriod: 'day',
          depositRequired: true,
          depositAmount: 25000,
          minRentalDuration: '1 day',
          bookingType: 'inquire',
          availableImmediately: true
        },
        rules: existing.rules || {
          requiredDocuments: ['nic', 'driving_license'],
          smokingAllowed: false,
          petsAllowed: false,
          commercialUsageAllowed: true,
          handoverMode: 'both',
          cancellationPolicy: 'flexible'
        }
      };
    }
    return PostDraftService.createInitialDraft('rentals');
  });

  const [currentStep, setCurrentStep] = useState<number>(draft.currentStep || 1);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedListing, setSubmittedListing] = useState<UserListingItem | null>(null);
  const [lastSavedText, setLastSavedText] = useState('Draft saved');

  // Autosave draft on change
  useEffect(() => {
    const updatedDraft = {
      ...draft,
      currentStep,
      lastSavedAt: Date.now()
    };
    PostDraftService.saveDraft(updatedDraft);
    setLastSavedText('Draft saved');
  }, [draft, currentStep]);

  // Step definitions
  const rentalSteps: StepItem[] = [
    { number: 1, label: 'Category & Info', shortLabel: 'Category', icon: Layers },
    { number: 2, label: 'Location & Privacy', shortLabel: 'Location', icon: MapPin },
    { number: 3, label: 'Pricing & Terms', shortLabel: 'Pricing', icon: DollarSign },
    { number: 4, label: 'Specifications', shortLabel: 'Specs', icon: Sliders },
    { number: 5, label: 'Photos & Media', shortLabel: 'Photos', icon: Image },
    { number: 6, label: 'Contact & Rules', shortLabel: 'Contact', icon: PhoneCall },
    { number: 7, label: 'Review & Publish', shortLabel: 'Review', icon: CheckCircle2 }
  ];

  // Validate step before proceeding
  const validateStep = (stepNumber: number): boolean => {
    const errors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!draft.categoryId) {
        errors.category = 'Please select a rental category';
      }
      const title = draft.formValues.title || '';
      if (!title.trim() || title.trim().length < 10) {
        errors.title = 'Title must be at least 10 characters long';
      }
    }

    if (stepNumber === 2) {
      if (!draft.location.provinceId) {
        errors.province = 'Please select a Province in Sri Lanka';
      }
      if (!draft.location.districtId) {
        errors.district = 'Please select a District';
      }
      if (!draft.location.cityId) {
        errors.city = 'Please select a City / Town';
      }
    }

    if (stepNumber === 3) {
      const rate = draft.pricing?.rate || 0;
      if (!rate || rate <= 0) {
        errors.rate = 'Please specify a valid rental rate in LKR';
      }
    }

    if (stepNumber === 4) {
      const desc = draft.formValues.description || '';
      if (!desc.trim() || desc.trim().length < 20) {
        errors.description = 'Please provide a detailed description (min 20 characters)';
      }
    }

    if (stepNumber === 5) {
      // Allow moving even without photos, but give a reminder if zero
      if (draft.images.length === 0) {
        errors.images = 'At least 1 photo is recommended for verified listings';
      }
    }

    if (stepNumber === 6) {
      const phoneCheck = validateSriLankanPhone(draft.contactPreferences.phone);
      if (!phoneCheck.isValid) {
        errors.phone = phoneCheck.error || 'Please enter a valid Sri Lankan mobile number (e.g. 077 123 4567)';
      }
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 7) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setStepErrors({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onNavigate('/post');
    }
  };

  const handleJumpToStep = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    setStepErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearDraft = () => {
    if (window.confirm('Are you sure you want to reset this rental draft? All changes will be cleared.')) {
      PostDraftService.deleteDraft('rentals');
      setDraft(PostDraftService.createInitialDraft('rentals'));
      setCurrentStep(1);
      setStepErrors({});
    }
  };

  const handleSubmit = () => {
    // Validate final checks
    const isValid = validateStep(1) && validateStep(2) && validateStep(3) && validateStep(4) && validateStep(6);
    if (!isValid) {
      alert('Please fill all required steps before publishing.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      // Sync price into formValues for submission service compatibility
      const submissionDraft: ListingDraft = {
        ...draft,
        formValues: {
          ...draft.formValues,
          price: draft.pricing?.rate || 12500,
          rentalPeriod: draft.pricing?.ratePeriod || 'day'
        }
      };

      const result = ListingSubmissionService.submitListing(submissionDraft);
      setIsSubmitting(false);

      if (result.success && result.listing) {
        if (onListingCreated) {
          onListingCreated(result.listing);
        }
        setSubmittedListing(result.listing);
      } else {
        alert(result.error || 'Failed to submit listing. Please try again.');
      }
    }, 900);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28">
      {/* Top Fixed Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBack}
              className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors tap-bounce"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1464F4]" />
                <h1 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                  Post a Rental
                </h1>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                {draft.categoryPath || 'Rental Asset Creation'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md flex items-center gap-1">
              <Save className="w-3 h-3 text-emerald-600" /> {lastSavedText}
            </span>
            <button
              type="button"
              onClick={handleClearDraft}
              title="Reset draft"
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 7-Step Navigation Indicator */}
        <PostStepIndicator
          currentStep={currentStep}
          totalSteps={7}
          steps={rentalSteps}
          onSelectStep={handleJumpToStep}
          accentColor={accentColor}
        />
      </header>

      {/* Main Content Area Container */}
      <main className="max-w-xl mx-auto px-4 pt-4">
        {/* Step Validation Error Alert */}
        {Object.keys(stepErrors).length > 0 && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5 shadow-xs animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-extrabold text-rose-900">Please complete the required fields below:</p>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-700 font-medium">
                {Object.values(stepErrors).map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Step 1: Category & Basic Info */}
        {currentStep === 1 && (
          <RentalBasicInfoStep
            categoryId={draft.categoryId}
            categoryName={draft.categoryName}
            subcategoryId={draft.subcategoryId}
            subcategoryName={draft.subcategoryName}
            thirdLevelId={draft.thirdLevelId}
            thirdLevelName={draft.thirdLevelName}
            categoryPath={draft.categoryPath}
            title={draft.formValues.title || ''}
            condition={draft.condition || 'like-new'}
            errors={stepErrors}
            onSelectCategory={(catData) => {
              setDraft(prev => ({
                ...prev,
                ...catData
              }));
            }}
            onChangeTitle={(title) => {
              setDraft(prev => ({
                ...prev,
                formValues: { ...prev.formValues, title }
              }));
            }}
            onChangeCondition={(condition) => {
              setDraft(prev => ({
                ...prev,
                condition
              }));
            }}
            accentColor={accentColor}
          />
        )}

        {/* Step 2: Location & Privacy */}
        {currentStep === 2 && (
          <RentalLocationStep
            location={draft.location}
            errors={stepErrors}
            onChangeLocation={(location) => {
              setDraft(prev => ({
                ...prev,
                location
              }));
            }}
            accentColor={accentColor}
          />
        )}

        {/* Step 3: Pricing & Terms */}
        {currentStep === 3 && (
          <RentalPricingStep
            pricing={draft.pricing || {
              rate: 12500,
              ratePeriod: 'day',
              depositRequired: true,
              depositAmount: 25000,
              minRentalDuration: '1 day',
              bookingType: 'inquire',
              availableImmediately: true
            }}
            errors={stepErrors}
            onChangePricing={(pricing) => {
              setDraft(prev => ({
                ...prev,
                pricing
              }));
            }}
            accentColor={accentColor}
          />
        )}

        {/* Step 4: Category Specifications */}
        {currentStep === 4 && (
          <RentalSpecificationsStep
            categoryId={draft.categoryId}
            categoryName={draft.categoryName}
            subcategoryId={draft.subcategoryId}
            subcategoryName={draft.subcategoryName}
            formValues={draft.formValues}
            errors={stepErrors}
            onChangeFormValues={(formValues) => {
              setDraft(prev => ({
                ...prev,
                formValues
              }));
            }}
            accentColor={accentColor}
          />
        )}

        {/* Step 5: Photos & Media */}
        {currentStep === 5 && (
          <RentalMediaStep
            images={draft.images}
            errors={stepErrors}
            categoryName={draft.categoryName}
            onChangeImages={(images) => {
              setDraft(prev => ({
                ...prev,
                images
              }));
            }}
            accentColor={accentColor}
          />
        )}

        {/* Step 6: Contact & Rules */}
        {currentStep === 6 && (
          <RentalRulesContactStep
            contactPreferences={draft.contactPreferences}
            rules={draft.rules || {
              requiredDocuments: ['nic', 'driving_license'],
              smokingAllowed: false,
              petsAllowed: false,
              commercialUsageAllowed: true,
              handoverMode: 'both',
              cancellationPolicy: 'flexible'
            }}
            errors={stepErrors}
            onChangeContact={(contactPreferences) => {
              setDraft(prev => ({
                ...prev,
                contactPreferences
              }));
            }}
            onChangeRules={(rules) => {
              setDraft(prev => ({
                ...prev,
                rules
              }));
            }}
            accentColor={accentColor}
          />
        )}

        {/* Step 7: Review & Final Submit */}
        {currentStep === 7 && (
          <RentalReviewStep
            draft={draft}
            onJumpToStep={handleJumpToStep}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            accentColor={accentColor}
          />
        )}
      </main>

      {/* Bottom Floating Step Action Controls */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200/90 py-3 px-4 shadow-lg backdrop-blur-md bg-white/95">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-all flex items-center gap-1.5 tap-bounce"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentStep === 1 ? 'Cancel' : 'Back'}</span>
          </button>

          {currentStep < 7 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 py-3 px-5 rounded-xl bg-[#1464F4] hover:bg-blue-600 text-white text-xs font-extrabold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 tap-bounce"
            >
              <span>Continue to Step {currentStep + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-[#1464F4] to-blue-700 hover:opacity-90 text-white text-xs font-extrabold shadow-md shadow-blue-500/30 transition-all flex items-center justify-center gap-2 tap-bounce disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>SUBMIT FOR REVIEW</span>
                </>
              )}
            </button>
          )}
        </div>
      </footer>

      {/* Success Modal */}
      {submittedListing && (
        <SubmissionSuccessModal
          listing={submittedListing}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
