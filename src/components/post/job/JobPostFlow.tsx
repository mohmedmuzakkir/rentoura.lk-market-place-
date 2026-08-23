import React, { useState, useEffect } from 'react';
import { AppRoute } from '../../../types';
import { UserListingItem } from '../../../types/profileTypes';
import { ListingDraft, validateSriLankanPhone } from '../../../types/postFormTypes';
import { PostDraftService } from '../../../services/postDraftService';
import { ListingSubmissionService } from '../../../services/listingSubmissionService';
import { PostStepIndicator, StepItem } from '../PostStepIndicator';
import { SubmissionSuccessModal } from '../SubmissionSuccessModal';
import { JobBasicInfoStep } from './JobBasicInfoStep';
import { JobCompanyStep } from './JobCompanyStep';
import { JobLocationStep } from './JobLocationStep';
import { JobRequirementsStep } from './JobRequirementsStep';
import { JobCompensationStep } from './JobCompensationStep';
import { JobApplicationStep } from './JobApplicationStep';
import { JobReviewStep } from './JobReviewStep';
import { ArrowLeft, ArrowRight, Save, Trash2, Briefcase, Building2, MapPin, Award, DollarSign, Send, CheckCircle2 } from 'lucide-react';

interface JobPostFlowProps {
  onNavigate: (route: AppRoute) => void;
  onListingCreated?: (listing: UserListingItem) => void;
}

export const JobPostFlow: React.FC<JobPostFlowProps> = ({
  onNavigate,
  onListingCreated
}) => {
  const accentColor = '#08A34F'; // Vibrant emerald green theme for jobs

  // Initialize draft from localStorage or create new
  const [draft, setDraft] = useState<ListingDraft>(() => {
    const existing = PostDraftService.getDraft('jobs');
    if (existing) {
      return {
        ...existing,
        categoryId: existing.categoryId || 'it-tech',
        categoryName: existing.categoryName || 'IT & Technology',
        subcategoryId: existing.subcategoryId || 'software-dev',
        subcategoryName: existing.subcategoryName || 'Software Developer',
        categoryPath: existing.categoryPath || 'Jobs > IT & Technology > Software Developer'
      };
    }
    const initial = PostDraftService.createInitialDraft('jobs');
    return {
      ...initial,
      categoryId: 'it-tech',
      categoryName: 'IT & Technology',
      subcategoryId: 'software-dev',
      subcategoryName: 'Software Developer',
      categoryPath: 'Jobs > IT & Technology > Software Developer',
      formValues: {
        title: 'Senior React / Full-Stack Engineer',
        description: 'We are seeking a talented Senior React / Full-Stack Engineer to lead frontend development for our high-scale Sri Lankan marketplace platform. Minimum 3+ years experience with React, TypeScript, and modern Node.js services.',
        employmentType: 'full-time',
        experienceLevel: 'mid',
        vacancies: 2,
        employerType: 'company',
        companyName: 'Synapse Tech Solutions (Pvt) Ltd',
        industry: 'Information Technology & Software',
        workMode: 'onsite',
        workingDays: 'mon-fri',
        shiftType: 'day',
        educationLevel: 'degree',
        skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'REST APIs'],
        languages: ['English', 'Sinhala'],
        salaryStructure: 'monthly-range',
        minSalary: 150000,
        maxSalary: 250000,
        showSalary: true,
        benefits: ['meals', 'transport', 'insurance', 'bonus', 'flexible_hours'],
        appMethods: ['direct', 'phone', 'email'],
        reqCv: true
      },
      location: {
        provinceId: 'central',
        provinceName: 'Central',
        districtId: 'kandy',
        districtName: 'Kandy',
        cityId: 'kandy-city',
        cityName: 'Kandy City',
        address: 'No. 120, Peradeniya Road, Kandy'
      },
      contactPreferences: {
        showPhone: true,
        phone: '0771234567',
        showWhatsApp: true,
        whatsappNumber: '0771234567',
        allowDirectChat: true,
        email: 'careers@synapsetech.lk'
      }
    };
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
  const jobSteps: StepItem[] = [
    { number: 1, label: 'Job Information', shortLabel: 'Job Info', icon: Briefcase },
    { number: 2, label: 'Company Details', shortLabel: 'Company', icon: Building2 },
    { number: 3, label: 'Location & Work Type', shortLabel: 'Location', icon: MapPin },
    { number: 4, label: 'Requirements', shortLabel: 'Requirements', icon: Award },
    { number: 5, label: 'Compensation', shortLabel: 'Pay & Perks', icon: DollarSign },
    { number: 6, label: 'Application', shortLabel: 'Application', icon: Send },
    { number: 7, label: 'Review & Submit', shortLabel: 'Review', icon: CheckCircle2 }
  ];

  // Validate step before proceeding
  const validateStep = (stepNumber: number): boolean => {
    const errors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!draft.categoryId) {
        errors.category = 'Please select a job category';
      }
      const title = draft.formValues.title || '';
      if (!title.trim() || title.trim().length < 5) {
        errors.title = 'Job title must be at least 5 characters long';
      }
      const desc = draft.formValues.description || '';
      if (!desc.trim() || desc.trim().length < 20) {
        errors.description = 'Please provide a detailed job description (min 20 characters)';
      }
    }

    if (stepNumber === 2) {
      const compName = draft.formValues.companyName || '';
      if (!compName.trim()) {
        errors.companyName = 'Company or employer name is required';
      }
    }

    if (stepNumber === 3) {
      const workMode = draft.formValues.workMode || 'onsite';
      if (workMode !== 'remote') {
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
    }

    if (stepNumber === 4) {
      // Dynamic specs and education qualification checks pass by default
    }

    if (stepNumber === 5) {
      const salaryStructure = draft.formValues.salaryStructure || 'monthly-range';
      if (salaryStructure !== 'negotiable') {
        const minSal = Number(draft.formValues.minSalary) || 0;
        if (minSal <= 0) {
          errors.salary = 'Please enter a valid salary amount in LKR';
        }
        if (salaryStructure === 'monthly-range') {
          const maxSal = Number(draft.formValues.maxSalary) || 0;
          if (maxSal < minSal) {
            errors.salary = 'Maximum salary cannot be less than minimum salary';
          }
        }
      }
    }

    if (stepNumber === 6) {
      const appMethods: string[] = Array.isArray(draft.formValues.appMethods) ? draft.formValues.appMethods : [];
      if (appMethods.length === 0) {
        errors.appMethods = 'Select at least one application method';
      }
      if (appMethods.includes('phone') || appMethods.includes('whatsapp')) {
        const phoneCheck = validateSriLankanPhone(draft.contactPreferences.phone);
        if (!phoneCheck.isValid) {
          errors.phone = phoneCheck.error || 'Please enter a valid Sri Lankan mobile number';
        }
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

  const handleStepClick = (stepNum: number) => {
    if (stepNum < currentStep) {
      setCurrentStep(stepNum);
      setStepErrors({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (stepNum === currentStep + 1 && validateStep(currentStep)) {
      setCurrentStep(stepNum);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePartialChange = (updatedPartial: Partial<ListingDraft>) => {
    setDraft(prev => ({
      ...prev,
      ...updatedPartial,
      formValues: {
        ...prev.formValues,
        ...(updatedPartial.formValues || {})
      },
      location: {
        ...prev.location,
        ...(updatedPartial.location || {})
      },
      contactPreferences: {
        ...prev.contactPreferences,
        ...(updatedPartial.contactPreferences || {})
      }
    }));
  };

  const handleClearDraft = () => {
    if (window.confirm('Are you sure you want to discard this job draft? All entered data will be reset.')) {
      PostDraftService.deleteDraft('jobs');
      const freshDraft = PostDraftService.createInitialDraft('jobs');
      setDraft(freshDraft);
      setCurrentStep(1);
      setStepErrors({});
    }
  };

  const handleSubmitFinal = () => {
    setIsSubmitting(true);
    setStepErrors({});

    setTimeout(() => {
      const result = ListingSubmissionService.submitListing(draft);
      setIsSubmitting(false);

      if (result.success) {
        setSubmittedListing(result.listing);
        if (onListingCreated) {
          onListingCreated(result.listing);
        }
      } else {
        setStepErrors({ submit: result.error || 'Failed to submit job opportunity.' });
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-28">
      {/* Top Fixed Progress Bar & Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors tap-bounce"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
                <h1 className="text-sm font-extrabold text-slate-900">Post a Job Opportunity</h1>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Step {currentStep} of 7: {jobSteps.find(s => s.number === currentStep)?.label}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 hidden md:inline-block">
              {lastSavedText}
            </span>
            <button
              onClick={handleClearDraft}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Discard Draft"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Progress Component */}
        <PostStepIndicator
          steps={jobSteps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          accentColor={accentColor}
        />
      </div>

      {/* Main Step Body */}
      <div className="max-w-3xl mx-auto px-4 pt-6">
        {currentStep === 1 && (
          <JobBasicInfoStep
            draft={draft}
            onChange={handlePartialChange}
            errors={stepErrors}
            accentColor={accentColor}
          />
        )}

        {currentStep === 2 && (
          <JobCompanyStep
            draft={draft}
            onChange={handlePartialChange}
            errors={stepErrors}
            accentColor={accentColor}
          />
        )}

        {currentStep === 3 && (
          <JobLocationStep
            draft={draft}
            onChange={handlePartialChange}
            errors={stepErrors}
            accentColor={accentColor}
          />
        )}

        {currentStep === 4 && (
          <JobRequirementsStep
            draft={draft}
            onChange={handlePartialChange}
            errors={stepErrors}
            accentColor={accentColor}
          />
        )}

        {currentStep === 5 && (
          <JobCompensationStep
            draft={draft}
            onChange={handlePartialChange}
            errors={stepErrors}
            accentColor={accentColor}
          />
        )}

        {currentStep === 6 && (
          <JobApplicationStep
            draft={draft}
            onChange={handlePartialChange}
            errors={stepErrors}
            accentColor={accentColor}
          />
        )}

        {currentStep === 7 && (
          <JobReviewStep
            draft={draft}
            onEditStep={(s) => {
              setCurrentStep(s);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSubmit={handleSubmitFinal}
            isSubmitting={isSubmitting}
            errors={stepErrors}
            accentColor={accentColor}
          />
        )}
      </div>

      {/* Sticky Bottom Navigation Bar */}
      {currentStep < 7 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-3 shadow-lg">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  PostDraftService.saveDraft(draft);
                  setLastSavedText('Saved just now');
                }}
                className="px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold hidden sm:flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-3.5 h-3.5" /> Save Draft
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-[#08A34F] hover:bg-emerald-600 text-white text-xs font-extrabold shadow-md transition-all tap-bounce flex items-center gap-2"
              >
                Save &amp; Continue <ArrowRight className="w-4 h-4" />
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
          onClose={() => setSubmittedListing(null)}
        />
      )}
    </div>
  );
};
