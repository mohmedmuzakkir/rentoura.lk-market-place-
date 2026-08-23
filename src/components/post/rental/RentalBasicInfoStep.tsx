import React from 'react';
import { CategorySelectorStep } from '../CategorySelectorStep';
import { Sparkles, HelpCircle, Tag, Check, AlertCircle } from 'lucide-react';

interface RentalBasicInfoStepProps {
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
  thirdLevelId?: string;
  thirdLevelName?: string;
  categoryPath: string;
  title: string;
  condition: string;
  errors: Record<string, string>;
  onSelectCategory: (catData: {
    categoryId: string;
    categoryName: string;
    subcategoryId: string;
    subcategoryName: string;
    thirdLevelId?: string;
    thirdLevelName?: string;
    categoryPath: string;
  }) => void;
  onChangeTitle: (title: string) => void;
  onChangeCondition: (condition: string) => void;
  accentColor?: string;
}

export const RentalBasicInfoStep: React.FC<RentalBasicInfoStepProps> = ({
  categoryId,
  categoryName,
  subcategoryId,
  subcategoryName,
  thirdLevelId,
  categoryPath,
  title,
  condition,
  errors,
  onSelectCategory,
  onChangeTitle,
  onChangeCondition,
  accentColor = '#1464F4'
}) => {
  const conditions = [
    { id: 'brand-new', label: 'Brand New / Pristine', desc: 'Never used or mint showroom condition' },
    { id: 'like-new', label: 'Used - Like New', desc: 'Flawless condition with minimal usage' },
    { id: 'well-maintained', label: 'Well Maintained', desc: 'Fully functional with normal cosmetic wear' },
    { id: 'heavy-duty', label: 'Commercial / Heavy Duty', desc: 'Built for rigorous industrial or jobsite work' }
  ];

  return (
    <div className="space-y-5 text-left animate-in fade-in duration-200">
      {/* Header Info */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[#1464F4] flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold text-slate-900">Step 1: Category & Basic Information</p>
          <p className="text-slate-600 mt-0.5 leading-relaxed">
            Select the exact rental category to unlock specialized questions for vehicles, property, event gear, and tools.
          </p>
        </div>
      </div>

      {/* Listing Title */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
        <label className="text-xs font-bold text-slate-900 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <span>Listing Title</span>
            <span className="text-rose-500">*</span>
          </span>
          <span className="text-[10px] text-slate-400 font-normal">
            {title.length} / 80 characters (min 10)
          </span>
        </label>

        <input
          type="text"
          value={title}
          onChange={(e) => onChangeTitle(e.target.value)}
          placeholder="e.g. Toyota Prius Hybrid 2018 - Self Drive / With Driver"
          maxLength={80}
          className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs ${
            errors.title ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
          }`}
        />

        {errors.title ? (
          <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.title}
          </p>
        ) : (
          <p className="text-[10px] text-slate-500 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-slate-400" />
            Tip: Include brand, model, year, or key distinguishing highlights.
          </p>
        )}
      </div>

      {/* Item Condition / Asset Grade */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <label className="text-xs font-bold text-slate-900 flex items-center gap-1">
          <Tag className="w-3.5 h-3.5 text-[#1464F4]" />
          <span>Item Condition / Asset Grade</span>
          <span className="text-rose-500">*</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {conditions.map((item) => {
            const isSelected = condition === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeCondition(item.id)}
                className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between tap-bounce ${
                  isSelected
                    ? 'border-[#1464F4] bg-blue-50/70 shadow-xs ring-1 ring-blue-400'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <p className={`text-xs font-bold ${isSelected ? 'text-[#1464F4]' : 'text-slate-800'}`}>
                    {item.label}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                    {item.desc}
                  </p>
                </div>
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-[#1464F4] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Selector */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-900 flex items-center gap-1">
            <span>Rental Category & Subcategory</span>
            <span className="text-rose-500">*</span>
          </label>
          {categoryPath && (
            <span className="text-[10px] font-bold text-[#1464F4] bg-blue-50 px-2 py-0.5 rounded-md">
              Selected
            </span>
          )}
        </div>

        {errors.category && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errors.category}</span>
          </div>
        )}

        <CategorySelectorStep
          module="rentals"
          selectedCategoryId={categoryId}
          selectedSubcategoryId={subcategoryId}
          selectedThirdLevelId={thirdLevelId}
          onSelectCategory={onSelectCategory}
          accentColor={accentColor}
        />
      </div>
    </div>
  );
};
