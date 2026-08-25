import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Check, AlertCircle, ChevronRight, X } from 'lucide-react';
import { AppRoute } from '../../types';
import { ListingDraft, LocationDataState, UploadedImage, FieldSchema } from '../../types/postFormTypes';
import { PostDraftService } from '../../services/postDraftService';
import { ListingSubmissionService } from '../../services/listingSubmissionService';
import { getCategoryFormSchema } from '../../data/formSchemas/categorySchemas';
import { PostStepIndicator } from './PostStepIndicator';
import { CategorySelectorStep } from './CategorySelectorStep';
import { LocationSelectorStep } from './LocationSelectorStep';
import { DynamicFieldRenderer } from './DynamicFieldRenderer';
import { MediaUploaderStep } from './MediaUploaderStep';
import { ReviewSubmissionStep } from './ReviewSubmissionStep';
import { SubmissionSuccessModal } from './SubmissionSuccessModal';
import { RentalPostFlow } from './rental/RentalPostFlow';
import { JobPostFlow } from './job/JobPostFlow';
import { ServicePostFlow } from './service/ServicePostFlow';
import { UserListingItem } from '../../types/profileTypes';

interface PostFlowContainerProps {
  module: 'rentals' | 'jobs' | 'services';
  onNavigate: (route: AppRoute) => void;
  onListingCreated?: (listing: UserListingItem) => void;
}

export const PostFlowContainer: React.FC<PostFlowContainerProps> = ({
  module,
  onNavigate,
  onListingCreated
}) => {
  // If Rentals module, use the complete 7-Step Rental Engine
  if (module === 'rentals') {
    return (
      <RentalPostFlow
        onNavigate={onNavigate}
        onListingCreated={onListingCreated}
      />
    );
  }

  // If Jobs module, use the complete 7-Step Job Engine
  if (module === 'jobs') {
    return (
      <JobPostFlow
        onNavigate={onNavigate}
        onListingCreated={onListingCreated}
      />
    );
  }

  // If Services module, use the complete 8-Step Service Engine
  if (module === 'services') {
    return (
      <ServicePostFlow
        onNavigate={onNavigate}
        onCancel={() => onNavigate('/post')}
        onSuccess={(listingId) => {
          if (onListingCreated) {
            onListingCreated({
              id: listingId,
              title: 'New Service',
              module: 'services',
              status: 'pending',
              postedDate: 'Just now'
            } as UserListingItem);
          }
        }}
      />
    );
  }

  const moduleConfigs = {
    rentals: { title: 'Post a Rental', color: '#1464F4', lightBg: 'bg-blue-50', border: 'border-blue-200' },
    jobs: { title: 'Post a Job Opportunity', color: '#08A34F', lightBg: 'bg-emerald-50', border: 'border-emerald-200' },
    services: { title: 'Offer a Service / Skill', color: '#FF650A', lightBg: 'bg-orange-50', border: 'border-orange-200' }
  };

  const currentConfig = moduleConfigs[module];

  // Initialize draft from PostDraftService or initial
  const [draft, setDraft] = useState<ListingDraft>(() => {
    const existing = PostDraftService.getDraft(module);
    if (existing) return existing;
    return PostDraftService.createInitialDraft(module);
  });

  const [currentStep, setCurrentStep] = useState<number>(draft.currentStep || 1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedListing, setSubmittedListing] = useState<UserListingItem | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Dynamically resolve form schema for selected category
  const schema = getCategoryFormSchema(
    draft.module,
    draft.categoryId,
    draft.subcategoryId,
    draft.categoryName,
    draft.subcategoryName
  );

  // Autosave draft on change
  useEffect(() => {
    const updatedDraft: ListingDraft = {
      ...draft,
      currentStep
    };
    PostDraftService.saveDraft(updatedDraft);
  }, [draft, currentStep]);

  // Handle category selection
  const handleCategorySelect = (catData: {
    categoryId: string;
    categoryName: string;
    subcategoryId: string;
    subcategoryName: string;
    thirdLevelId?: string;
    thirdLevelName?: string;
    categoryPath: string;
  }) => {
    setDraft(prev => ({
      ...prev,
      ...catData
    }));
    setErrors({});
  };

  // Handle field value changes
  const handleFieldChange = (fieldId: string, value: any) => {
    setDraft(prev => ({
      ...prev,
      formValues: {
        ...prev.formValues,
        [fieldId]: value
      }
    }));
    if (errors[fieldId]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    if (!draft.categoryId || !draft.subcategoryId) {
      setErrors({ category: 'Please select both a category and a subcategory.' });
      return false;
    }
    return true;
  };

  // Step 2 Validation (Field schema)
  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    schema.fields.forEach(field => {
      // Check visibility
      if (field.dependsOn) {
        const { fieldId, value, condition } = field.dependsOn;
        const parentVal = draft.formValues[fieldId];
        if (condition === 'truthy' && !parentVal) return;
        if (condition === 'equals' && parentVal !== value) return;
      }

      const val = draft.formValues[field.id];
      if (field.required && (val === undefined || val === '' || (Array.isArray(val) && val.length === 0))) {
        newErrors[field.id] = `${field.label} is required`;
      }
      if (field.validation?.minLength && typeof val === 'string' && val.length < field.validation.minLength) {
        newErrors[field.id] = `${field.label} must be at least ${field.validation.minLength} characters`;
      }
      if (field.validation?.min && typeof val === 'number' && val < field.validation.min) {
        newErrors[field.id] = `${field.label} must be at least ${field.validation.min}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 3 Validation (Location)
  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!draft.location.provinceId) {
      newErrors.province = 'Please select a province';
    }
    if (!draft.location.districtId) {
      newErrors.district = 'Please select a district';
    }
    if (!draft.location.cityId) {
      newErrors.city = 'Please select a city / town';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Advance Step
  const handleNextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !validateStep3()) return;

    setCurrentStep(prev => Math.min(4, prev + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Save Draft Manual
  const handleSaveDraftManual = () => {
    PostDraftService.saveDraft({ ...draft, currentStep });
    setSaveToast('Draft saved successfully!');
    setTimeout(() => setSaveToast(null), 2500);
  };

  // Handle Final Submission
  const handleSubmitListing = async () => {
    if (isSubmitting) return; // Prevent double-tap
    setIsSubmitting(true);

    try {
      const result = await ListingSubmissionService.submitListing(draft);
      setIsSubmitting(false);

      if (result.success) {
        setSubmittedListing(result.listing);
        if (onListingCreated) {
          onListingCreated(result.listing);
        }
      } else {
        setErrors({ submit: result.error || 'Failed to submit listing.' });
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrors({ submit: err?.message || 'Failed to submit listing.' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-28 overflow-x-hidden">
      {/* Top Sticky Header */}
      <div className="sticky top-0 z-40 bg-[#041C43] text-white px-4 py-3.5 shadow-md">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button
            onClick={() => {
              if (Object.keys(draft.formValues).length > 0) {
                setShowExitConfirm(true);
              } else {
                onNavigate('/post');
              }
            }}
            className="flex items-center gap-1.5 text-white/90 hover:text-white text-xs font-semibold tap-bounce"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Chooser
          </button>

          <div className="text-center">
            <h1 className="text-sm font-extrabold tracking-tight">
              {currentConfig.title}
            </h1>
            <p className="text-[10px] text-blue-200">
              Step {currentStep} of 4
            </p>
          </div>

          <button
            onClick={handleSaveDraftManual}
            className="flex items-center gap-1 text-[11px] font-bold text-blue-200 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-xl tap-bounce"
          >
            <Save className="w-3.5 h-3.5" /> Save Draft
          </button>
        </div>
      </div>

      {/* Step Indicator */}
      <PostStepIndicator
        currentStep={currentStep}
        onSelectStep={(step) => {
          if (step < currentStep) {
            setCurrentStep(step);
          }
        }}
        accentColor={currentConfig.color}
      />

      {/* Toast notification */}
      {saveToast && (
        <div className="max-w-xl mx-auto px-4 mt-3">
          <div className="bg-emerald-600 text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center justify-between shadow-lg animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{saveToast}</span>
            </div>
            <button onClick={() => setSaveToast(null)}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Form Content Container */}
      <div className="max-w-xl mx-auto p-4 space-y-4">
        {/* Step 1: Category Selection */}
        {currentStep === 1 && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="text-left">
              <h2 className="text-base font-extrabold text-slate-900 font-heading">
                1. Select Category & Type
              </h2>
              <p className="text-xs text-slate-500">
                Choose the specific category for your {module.slice(0, -1)} to get the right questions.
              </p>
            </div>

            {errors.category && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errors.category}</span>
              </div>
            )}

            <CategorySelectorStep
              module={draft.module}
              selectedCategoryId={draft.categoryId}
              selectedSubcategoryId={draft.subcategoryId}
              selectedThirdLevelId={draft.thirdLevelId}
              onSelectCategory={handleCategorySelect}
              accentColor={currentConfig.color}
            />
          </div>
        )}

        {/* Step 2: Specific Form Details */}
        {currentStep === 2 && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-[#1464F4] text-[10px] font-bold mb-1">
                {draft.categoryPath || `${draft.categoryName} › ${draft.subcategoryName}`}
              </div>
              <h2 className="text-base font-extrabold text-slate-900 font-heading">
                2. {schema.title}
              </h2>
              <p className="text-xs text-slate-500">
                {schema.description || 'Fill out the relevant specifications for your listing.'}
              </p>
            </div>

            <DynamicFieldRenderer
              fields={schema.fields}
              formValues={draft.formValues}
              errors={errors}
              onChangeField={handleFieldChange}
              accentColor={currentConfig.color}
            />
          </div>
        )}

        {/* Step 3: Location & Media Photos */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="text-left">
              <h2 className="text-base font-extrabold text-slate-900 font-heading">
                3. Location & Real Photos
              </h2>
              <p className="text-xs text-slate-500">
                Specify your location in Sri Lanka and add photos to attract authentic seekers.
              </p>
            </div>

            {/* Location Selector */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <LocationSelectorStep
                location={draft.location}
                onChangeLocation={(newLoc) => setDraft(prev => ({ ...prev, location: newLoc }))}
                accentColor={currentConfig.color}
              />
            </div>

            {/* Media Uploader */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <MediaUploaderStep
                images={draft.images}
                onChangeImages={(newImgs) => setDraft(prev => ({ ...prev, images: newImgs }))}
                accentColor={currentConfig.color}
              />
            </div>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="text-left">
              <h2 className="text-base font-extrabold text-slate-900 font-heading">
                4. Review & Submit for Moderation
              </h2>
              <p className="text-xs text-slate-500">
                Double-check your information before sending your listing to our moderation team.
              </p>
            </div>

            <ReviewSubmissionStep
              draft={draft}
              schema={schema}
              onEditStep={(step) => setCurrentStep(step)}
              onSubmit={handleSubmitListing}
              isSubmitting={isSubmitting}
              accentColor={currentConfig.color}
            />
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Bar */}
      {currentStep < 4 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3.5 shadow-lg">
          <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                if (currentStep > 1) {
                  setCurrentStep(prev => prev - 1);
                } else {
                  onNavigate('/post');
                }
              }}
              className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold tap-bounce"
            >
              {currentStep > 1 ? 'Previous' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              className="flex-1 py-3 px-5 rounded-xl text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md tap-bounce"
              style={{ backgroundColor: currentConfig.color }}
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <h3 className="text-base font-bold text-slate-900">
              Save changes before leaving?
            </h3>
            <p className="text-xs text-slate-500">
              Your draft is safely saved and can be resumed anytime from the Post page.
            </p>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  onNavigate('/post');
                }}
                className="w-full py-2.5 rounded-xl bg-[#1464F4] text-white text-xs font-bold tap-bounce"
              >
                Save & Exit
              </button>
              <button
                onClick={() => setShowExitConfirm(false)}
                className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold tap-bounce"
              >
                Keep Editing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submission Success Modal */}
      {submittedListing && (
        <SubmissionSuccessModal
          listing={submittedListing}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
