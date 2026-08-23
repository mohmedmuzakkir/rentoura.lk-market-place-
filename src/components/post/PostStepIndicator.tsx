import React from 'react';
import { Check, Layers, MapPin, DollarSign, Sliders, Image, PhoneCall, CheckCircle2, LucideIcon } from 'lucide-react';

export interface StepItem {
  number: number;
  label: string;
  shortLabel?: string;
  icon?: LucideIcon;
}

interface PostStepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  steps?: StepItem[];
  onSelectStep?: (step: number) => void;
  accentColor?: string;
}

export const PostStepIndicator: React.FC<PostStepIndicatorProps> = ({
  currentStep,
  totalSteps,
  steps: customSteps,
  onSelectStep,
  accentColor = '#1464F4'
}) => {
  // Default 7-step sequence for rentals or custom
  const defaultRentalSteps: StepItem[] = [
    { number: 1, label: 'Category', shortLabel: 'Category', icon: Layers },
    { number: 2, label: 'Location', shortLabel: 'Location', icon: MapPin },
    { number: 3, label: 'Pricing', shortLabel: 'Pricing', icon: DollarSign },
    { number: 4, label: 'Specs', shortLabel: 'Specs', icon: Sliders },
    { number: 5, label: 'Photos', shortLabel: 'Photos', icon: Image },
    { number: 6, label: 'Contact', shortLabel: 'Contact', icon: PhoneCall },
    { number: 7, label: 'Review', shortLabel: 'Review', icon: CheckCircle2 }
  ];

  const steps = customSteps || defaultRentalSteps;
  const numSteps = totalSteps || steps.length;
  const activeStepItem = steps.find(s => s.number === currentStep) || steps[0];

  return (
    <div className="w-full bg-white border-b border-slate-200/90 shadow-xs">
      {/* Mobile Top Progress Bar & Header */}
      <div className="max-w-xl mx-auto px-4 pt-2.5 pb-2">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <div className="flex items-center gap-1.5">
            <span
              className="w-5 h-5 rounded-full text-[11px] font-extrabold text-white flex items-center justify-center shadow-xs"
              style={{ backgroundColor: accentColor }}
            >
              {currentStep}
            </span>
            <span className="font-extrabold text-slate-900 tracking-tight text-xs">
              {activeStepItem?.label}
            </span>
          </div>

          <span className="text-[11px] font-bold text-slate-500">
            Step {currentStep} of {numSteps}
          </span>
        </div>

        {/* Continuous Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${(currentStep / numSteps) * 100}%`,
              backgroundColor: accentColor
            }}
          />
        </div>
      </div>

      {/* Interactive Step Pills / Nodes */}
      <div className="max-w-xl mx-auto px-2 pb-2.5 overflow-x-auto scrollbar-none">
        <div className="flex items-center justify-between min-w-[320px] sm:min-w-0 px-2 pt-1 gap-1">
          {steps.map((step) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;
            const Icon = step.icon || Layers;

            return (
              <button
                key={step.number}
                type="button"
                onClick={() => {
                  if (isCompleted && onSelectStep) {
                    onSelectStep(step.number);
                  }
                }}
                disabled={!isCompleted && !isCurrent}
                title={`Step ${step.number}: ${step.label}`}
                className={`flex-1 flex flex-col items-center group relative transition-all ${
                  isCompleted ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                    isCompleted
                      ? 'text-white shadow-xs'
                      : isCurrent
                      ? 'text-white ring-2 ring-blue-200 scale-105 shadow-sm font-extrabold'
                      : 'bg-slate-100 border border-slate-200 text-slate-400'
                  }`}
                  style={{
                    backgroundColor: isCompleted || isCurrent ? accentColor : undefined
                  }}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </div>

                <span
                  className={`text-[9px] sm:text-[10px] font-bold mt-1 tracking-tight truncate max-w-[46px] sm:max-w-none text-center transition-colors ${
                    isCurrent
                      ? 'text-slate-900 font-extrabold'
                      : isCompleted
                      ? 'text-slate-600 font-semibold'
                      : 'text-slate-400 font-normal'
                  }`}
                >
                  {step.shortLabel || step.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
