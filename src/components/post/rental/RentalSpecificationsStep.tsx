import React from 'react';
import { getCategoryFormSchema } from '../../../data/formSchemas/categorySchemas';
import { DynamicFieldRenderer } from '../DynamicFieldRenderer';
import { Sliders, Sparkles, AlertCircle } from 'lucide-react';

interface RentalSpecificationsStepProps {
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
  formValues: Record<string, any>;
  errors: Record<string, string>;
  onChangeFormValues: (values: Record<string, any>) => void;
  accentColor?: string;
}

export const RentalSpecificationsStep: React.FC<RentalSpecificationsStepProps> = ({
  categoryId,
  categoryName,
  subcategoryId,
  subcategoryName,
  formValues,
  errors,
  onChangeFormValues,
  accentColor = '#1464F4'
}) => {
  // Resolve specialized schema for this category
  const schema = getCategoryFormSchema('rentals', categoryId, subcategoryId, categoryName, subcategoryName);

  const handleFieldChange = (fieldId: string, value: any) => {
    onChangeFormValues({
      ...formValues,
      [fieldId]: value
    });
  };

  return (
    <div className="space-y-5 text-left animate-in fade-in duration-200">
      {/* Header Info */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3">
        <Sliders className="w-5 h-5 text-[#1464F4] flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold text-slate-900">Step 4: {schema.title || 'Asset Specifications & Inclusions'}</p>
          <p className="text-slate-600 mt-0.5 leading-relaxed">
            {schema.description || 'Provide key technical specifications, amenities, and details tailored to this rental type.'}
          </p>
        </div>
      </div>

      {/* Dynamic Schema Form */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1464F4]" />
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
              {subcategoryName || categoryName || 'Rental'} Specifications
            </h3>
          </div>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            Category-Specific
          </span>
        </div>

        {/* Dynamic Fields */}
        <div className="space-y-4 pt-1">
          <DynamicFieldRenderer
            fields={schema.fields || []}
            formValues={formValues}
            errors={errors}
            onChangeField={handleFieldChange}
            accentColor={accentColor}
          />
        </div>
      </div>
    </div>
  );
};
