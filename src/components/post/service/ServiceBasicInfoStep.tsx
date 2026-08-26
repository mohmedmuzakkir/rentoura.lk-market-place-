import React, { useState, useEffect, useCallback } from 'react';
import { Search, Sparkles, AlertCircle, Wrench, ChevronDown, RefreshCw } from 'lucide-react';
import { ListingDraft } from '../../../types/postFormTypes';
import { CategoryService, CategoryRecord } from '../../../services/categoryService';
import { getCategoryFormSchema } from '../../../data/formSchemas/categorySchemas';
import { DynamicFieldRenderer } from '../DynamicFieldRenderer';
import { CategoryIcon } from '../../CategoryIcon';

interface ServiceBasicInfoStepProps {
  draft: ListingDraft;
  onChange: (updated: Partial<ListingDraft>) => void;
  errors: Record<string, string>;
  accentColor: string;
}

export const ServiceBasicInfoStep: React.FC<ServiceBasicInfoStepProps> = ({
  draft,
  onChange,
  errors,
  accentColor = '#FF650A'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriesTree, setCategoriesTree] = useState<CategoryRecord[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [catError, setCatError] = useState<string | null>(null);

  const loadCategories = useCallback(async (forceRefresh = false) => {
    setLoadingCats(true);
    setCatError(null);
    const res = await CategoryService.getCategories('service', { forceRefresh });
    if (!res.success) {
      setCatError('Unable to load categories.');
      setCategoriesTree([]);
    } else {
      const tree = CategoryService.buildTree(res.data);
      setCategoriesTree(tree);
    }
    setLoadingCats(false);
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const selectedCategory = categoriesTree.find((c) => c.id === draft.categoryId);
  const subcategories = selectedCategory?.children || [];
  const selectedSubcategory = subcategories.find((s) => s.id === draft.subcategoryId);

  // Dynamic schema for category-specific questions
  const dynamicSchema = getCategoryFormSchema(
    'services',
    draft.categoryId,
    draft.subcategoryId,
    draft.categoryName,
    draft.subcategoryName
  );

  const handleSelectCategory = (catId: string) => {
    const cat = categoriesTree.find((c) => c.id === catId);
    if (!cat) return;

    const firstSub = cat.children?.[0];
    const firstL3 = firstSub?.children?.[0];
    onChange({
      categoryId: cat.id,
      categoryName: cat.name,
      subcategoryId: firstSub ? firstSub.id : '',
      subcategoryName: firstSub ? firstSub.name : '',
      thirdLevelId: firstL3 ? firstL3.id : undefined,
      thirdLevelName: firstL3 ? firstL3.name : undefined,
      categoryPath: `Services > ${cat.name}${firstSub ? ` > ${firstSub.name}` : ''}`,
      formValues: {
        ...draft.formValues,
        serviceFeatures: [],
        electricalExperience: undefined,
        licenseType: undefined,
        plumbingType: undefined,
        subjectArea: undefined,
        cameraEquipment: undefined,
        cleaningType: undefined,
        specialization: undefined
      }
    });
  };

  const handleSelectSubcategory = (subId: string) => {
    const sub = subcategories.find((s) => s.id === subId);
    if (!sub || !selectedCategory) return;
    const firstL3 = sub.children?.[0];

    onChange({
      subcategoryId: sub.id,
      subcategoryName: sub.name,
      thirdLevelId: firstL3 ? firstL3.id : undefined,
      thirdLevelName: firstL3 ? firstL3.name : undefined,
      categoryPath: `Services > ${selectedCategory.name} > ${sub.name}`,
    });
  };

  const updateFormValue = (key: string, value: any) => {
    onChange({
      formValues: {
        ...draft.formValues,
        [key]: value,
      },
    });
  };

  // Service features multiselect handler
  const currentFeatures: string[] = Array.isArray(draft.formValues.serviceFeatures)
    ? draft.formValues.serviceFeatures
    : [];

  const toggleFeature = (featureId: string) => {
    const updated = currentFeatures.includes(featureId)
      ? currentFeatures.filter((f) => f !== featureId)
      : [...currentFeatures, featureId];
    updateFormValue('serviceFeatures', updated);
  };

  // Filter categories by search
  const filteredCategories = categoriesTree.filter((cat) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      cat.name.toLowerCase().includes(q) ||
      (cat.description && cat.description.toLowerCase().includes(q)) ||
      (cat.children && cat.children.some((s) => s.name.toLowerCase().includes(q)))
    );
  });

  const titleLength = (draft.formValues.title || '').length;
  const shortDescLength = (draft.formValues.shortDescription || '').length;
  const detailedDescLength = (draft.formValues.description || '').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Intro Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Step 1 of 8</span>
        </div>
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Service Information</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Start by selecting your service category and describing the skills you offer.
        </p>
      </div>

      {/* Service Category Grid */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            Service Category <span className="text-rose-500">*</span>
          </label>
          <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Need help? Select the closest match
          </span>
        </div>

        {/* Category Search Filter */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search service category (e.g. Electrician, AC Repair, Tuition, Cleaning, Mechanic)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
        </div>

        {/* Loading Skeleton */}
        {loadingCats && (
          <div className="p-4 text-center text-xs text-slate-400 font-medium">Loading service categories...</div>
        )}

        {/* Error State with Retry */}
        {!loadingCats && catError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center space-y-2">
            <p className="text-xs text-red-700 font-semibold">Unable to load categories.</p>
            <button
              type="button"
              onClick={() => loadCategories(true)}
              className="px-3 py-1 bg-red-600 text-white rounded text-xs font-bold inline-flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loadingCats && !catError && categoriesTree.length === 0 && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500 font-medium">
            No service categories are available yet.
          </div>
        )}

        {/* Primary Category Cards Grid */}
        {!loadingCats && !catError && categoriesTree.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {filteredCategories.slice(0, 8).map((cat) => {
              const isSelected = draft.categoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col items-center justify-center gap-1.5 min-h-[84px] text-center cursor-pointer ${
                    isSelected
                      ? 'border-[#FF650A] bg-amber-50/50 shadow-xs ring-2 ring-[#FF650A]/20'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100/60'
                  }`}
                >
                  <CategoryIcon 
                    iconKey={cat.icon_key} 
                    slug={cat.slug} 
                    name={cat.name} 
                    module="service"
                    className={`w-6 h-6 ${isSelected ? 'text-[#FF650A]' : 'text-slate-600'}`} 
                  />
                  <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-[#FF650A]' : 'text-slate-800'}`}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {errors.category && (
          <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.category}
          </p>
        )}

        {/* Subcategory Dropdown */}
        {selectedCategory && subcategories.length > 0 && (
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Sub Category <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={draft.subcategoryId}
                onChange={(e) => handleSelectSubcategory(e.target.value)}
                className="w-full pl-3.5 pr-10 py-2.5 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer"
              >
                {subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} {sub.description ? `— ${sub.description}` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* Service / Skill Name & Description */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Service Title Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Service / Skill Name <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] font-mono text-slate-400">{titleLength}/100</span>
          </div>
          <input
            type="text"
            maxLength={100}
            value={draft.formValues.title || ''}
            onChange={(e) => updateFormValue('title', e.target.value)}
            placeholder="e.g. House Wiring & Electrical Maintenance Service"
            className={`w-full px-3.5 py-2.5 text-xs font-semibold bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all ${
              errors.title ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
            }`}
          />
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Use a clear and professional title to attract more customers.
          </p>
          {errors.title && (
            <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.title}
            </p>
          )}
        </div>

        {/* Short Description */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Short Description <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] font-mono text-slate-400">{shortDescLength}/100</span>
          </div>
          <textarea
            rows={2}
            maxLength={100}
            value={draft.formValues.shortDescription || ''}
            onChange={(e) => updateFormValue('shortDescription', e.target.value)}
            placeholder="Professional electrical service for homes, offices and commercial buildings."
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
        </div>

        {/* Detailed Description */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] font-mono text-slate-400">{detailedDescLength}/500</span>
          </div>
          <textarea
            rows={4}
            maxLength={500}
            value={draft.formValues.description || ''}
            onChange={(e) => updateFormValue('description', e.target.value)}
            placeholder="I provide professional and trusted electrical services including house wiring, lighting installation, socket & switch repair, fault fixing, inverter connection and full electrical maintenance. Quality work, reasonable price and customer satisfaction guaranteed."
            className={`w-full px-3.5 py-2.5 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all ${
              errors.description ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
            }`}
          />
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Explain your service clearly. More details = more customers!
          </p>
          {errors.description && (
            <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.description}
            </p>
          )}
        </div>

        {/* Service Features Checkboxes */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Service Features <span className="text-slate-400 text-[11px] font-normal lowercase">(select all that apply)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'installation', label: 'Installation' },
              { id: 'repair', label: 'Repair' },
              { id: 'maintenance', label: 'Maintenance' },
              { id: 'emergency_service', label: 'Emergency Service' },
              { id: 'onsite', label: 'On-site Service' },
              { id: 'advance_booking', label: 'Advance Booking' },
              { id: 'remote_service', label: 'Remote Service' },
            ].map((feature) => {
              const checked = currentFeatures.includes(feature.id);
              return (
                <button
                  key={feature.id}
                  type="button"
                  onClick={() => toggleFeature(feature.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    checked
                      ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] ${
                      checked ? 'bg-white text-amber-600 border-white' : 'border-slate-300'
                    }`}
                  >
                    {checked ? '✓' : ''}
                  </span>
                  {feature.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Category-Aware Questions */}
      {dynamicSchema && dynamicSchema.fields.length > 0 && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Wrench className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              {dynamicSchema.title || `${selectedSubcategory?.name || selectedCategory?.name || 'Category'} Specific Details`}
            </h3>
          </div>

          <DynamicFieldRenderer
            fields={dynamicSchema.fields}
            values={draft.formValues}
            onChange={updateFormValue}
            errors={errors}
            accentColor={accentColor}
          />
        </div>
      )}

      {/* Pro Tip Banner */}
      <div className="bg-amber-50/80 border border-amber-200/80 p-4 rounded-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-900">Pro Tip</h4>
            <p className="text-[11px] text-amber-800 mt-0.5">
              Add complete details, photos and your experience to get more leads and build your reputation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
