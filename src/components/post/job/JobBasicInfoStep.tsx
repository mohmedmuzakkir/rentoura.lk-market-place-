import React, { useState, useEffect, useCallback } from 'react';
import { Briefcase, Sparkles, ChevronDown, Check, AlertCircle, FileText, Clock, Award, Users, RefreshCw } from 'lucide-react';
import { ListingDraft } from '../../../types/postFormTypes';
import { CategoryService, CategoryRecord } from '../../../services/categoryService';
import { CategoryIcon } from '../../CategoryIcon';

interface JobBasicInfoStepProps {
  draft: ListingDraft;
  onChange: (updatedDraftPartial: Partial<ListingDraft>) => void;
  errors: Record<string, string>;
  accentColor?: string;
}

export const JobBasicInfoStep: React.FC<JobBasicInfoStepProps> = ({
  draft,
  onChange,
  errors,
  accentColor = '#08A34F'
}) => {
  const [catSearchQuery, setCatSearchQuery] = useState('');
  const [categoriesTree, setCategoriesTree] = useState<CategoryRecord[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [catError, setCatError] = useState<string | null>(null);

  const title = draft.formValues.title || '';
  const description = draft.formValues.description || '';
  const employmentType = draft.formValues.employmentType || 'full-time';
  const experienceLevel = draft.formValues.experienceLevel || 'mid';
  const vacancies = draft.formValues.vacancies !== undefined ? draft.formValues.vacancies : 1;

  const loadCategories = useCallback(async (forceRefresh = false) => {
    setLoadingCats(true);
    setCatError(null);
    const res = await CategoryService.getCategories('job', { forceRefresh });
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

  // Filter main job categories based on search
  const filteredCategories = categoriesTree.filter((cat) => {
    if (!catSearchQuery.trim()) return true;
    const q = catSearchQuery.toLowerCase();
    return (
      cat.name.toLowerCase().includes(q) ||
      (cat.description && cat.description.toLowerCase().includes(q)) ||
      (cat.children && cat.children.some((sub) => sub.name.toLowerCase().includes(q)))
    );
  });

  const selectedCategoryObj = categoriesTree.find((c) => c.id === draft.categoryId);

  const handleSelectCategory = (catId: string, catName: string) => {
    const catObj = categoriesTree.find((c) => c.id === catId);
    const firstSub = catObj?.children?.[0];
    const firstL3 = firstSub?.children?.[0];
    onChange({
      categoryId: catId,
      categoryName: catName,
      subcategoryId: firstSub ? firstSub.id : '',
      subcategoryName: firstSub ? firstSub.name : '',
      thirdLevelId: firstL3 ? firstL3.id : undefined,
      thirdLevelName: firstL3 ? firstL3.name : undefined,
      categoryPath: `Jobs > ${catName}${firstSub ? ` > ${firstSub.name}` : ''}`,
      formValues: {
        ...draft.formValues,
        // Clear category-specific fields so stale values do not persist across categories
        primarySkills: undefined,
        frameworks: undefined,
        devLevel: undefined,
        msOfficeSkills: undefined,
        typingSpeed: undefined,
        salesType: undefined,
        drivingLicenseType: undefined,
        vehicleType: undefined,
        cuisineTypes: undefined,
        teachingSubject: undefined,
        nvqLevel: undefined
      }
    });
  };

  const handleSelectSubcategory = (subId: string, subName: string) => {
    const subObj = selectedCategoryObj?.children?.find((s) => s.id === subId);
    const firstL3 = subObj?.children?.[0];
    onChange({
      subcategoryId: subId,
      subcategoryName: subName,
      thirdLevelId: firstL3 ? firstL3.id : undefined,
      thirdLevelName: firstL3 ? firstL3.name : undefined,
      categoryPath: `Jobs > ${draft.categoryName} > ${subName}${firstL3 ? ` > ${firstL3.name}` : ''}`,
    });
  };

  const updateFormValue = (key: string, val: any) => {
    onChange({
      formValues: {
        ...draft.formValues,
        [key]: val,
      },
    });
  };

  const employmentTypeOptions = [
    { id: 'full-time', label: 'Full Time', icon: Briefcase },
    { id: 'part-time', label: 'Part Time', icon: Clock },
    { id: 'contract', label: 'Contract', icon: FileText },
    { id: 'internship', label: 'Internship', icon: Award },
    { id: 'temporary', label: 'Temporary', icon: Clock },
    { id: 'freelance', label: 'Freelance', icon: Sparkles },
    { id: 'casual', label: 'Casual / Daily', icon: Users },
  ];

  const experienceOptions = [
    { id: 'no-exp', label: 'No Experience Required' },
    { id: 'entry', label: 'Entry Level / Trainee (0 - 1 Year)' },
    { id: 'junior', label: 'Junior Level (1 - 2 Years)' },
    { id: 'mid', label: 'Mid Level (2 - 5 Years)' },
    { id: 'senior', label: 'Senior Level (5+ Years)' },
    { id: 'executive', label: 'Executive / Director / Lead' },
  ];

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-200">
      {/* Title Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
            Step 1: Job Information
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            14% Completed
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Start by telling job seekers about the role, category, and working terms.
        </p>
      </div>

      {/* Main Form Fields */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
        {/* Job Title */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              Job Title <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono">{title.length}/100</span>
          </div>
          <div className="relative">
            <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              maxLength={100}
              value={title}
              onChange={(e) => updateFormValue('title', e.target.value)}
              placeholder="e.g. Software Developer, Heavy Lorry Driver, Accountant, Receptionist"
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.title ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
              }`}
            />
          </div>
          {errors.title ? (
            <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.title}
            </p>
          ) : (
            <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
              💡 Use a clear and specific job title to attract the right candidates.
            </p>
          )}
        </div>

        {/* Job Category Selection */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-2">
            Job Category <span className="text-rose-500">*</span>
          </label>

          {/* Category Search Filter */}
          <div className="mb-3">
            <input
              type="text"
              value={catSearchQuery}
              onChange={(e) => setCatSearchQuery(e.target.value)}
              placeholder="Search category (e.g. software, driver, accountant, chef, teacher)..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Loading Skeleton */}
          {loadingCats && (
            <div className="p-4 text-center text-xs text-slate-400 font-medium">Loading job categories...</div>
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
              No job categories are available yet.
            </div>
          )}

          {/* Category Cards Grid */}
          {!loadingCats && !catError && categoriesTree.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {filteredCategories.map((cat) => {
                const isSelected = draft.categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat.id, cat.name)}
                    className={`p-3 rounded-xl border text-left transition-all tap-bounce flex flex-col justify-between h-20 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/90 border-[#08A34F] ring-1 ring-[#08A34F]'
                        : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="mb-1">
                      <CategoryIcon 
                        iconKey={cat.icon_key} 
                        slug={cat.slug} 
                        name={cat.name} 
                        module="job" 
                        className={`w-5 h-5 ${isSelected ? 'text-[#08A34F]' : 'text-slate-600'}`} 
                      />
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-[11px] font-bold line-clamp-1 ${isSelected ? 'text-[#08A34F]' : 'text-slate-800'}`}>
                        {cat.name}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#08A34F] flex-shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {errors.category && (
            <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.category}
            </p>
          )}
        </div>

        {/* Subcategory / Role Selector */}
        {selectedCategoryObj && selectedCategoryObj.children && selectedCategoryObj.children.length > 0 && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
            <label className="text-xs font-bold text-slate-800 block">
              Subcategory / Specific Role <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {selectedCategoryObj.children.map((sub) => {
                const isSubSelected = draft.subcategoryId === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => handleSelectSubcategory(sub.id, sub.name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isSubSelected
                        ? 'bg-[#08A34F] text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <CategoryIcon 
                      iconKey={sub.icon_key} 
                      slug={sub.slug} 
                      name={sub.name} 
                      module="job"
                      parentIconKey={selectedCategoryObj?.icon_key}
                      parentSlug={selectedCategoryObj?.slug}
                      parentName={selectedCategoryObj?.name}
                      className="w-3.5 h-3.5 inline-block mr-1.5 shrink-0" 
                    />
                    {sub.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Job Description */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-bold text-slate-800">
              Job Description <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono">{description.length}/2000</span>
          </div>
          <textarea
            rows={5}
            maxLength={2000}
            value={description}
            onChange={(e) => updateFormValue('description', e.target.value)}
            placeholder="Describe key responsibilities, daily workflow, team structure, and why candidates should apply to your company..."
            className={`w-full p-3.5 rounded-xl border text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed ${
              errors.description ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
            }`}
          />
          {errors.description ? (
            <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.description}
            </p>
          ) : (
            <p className="text-[11px] text-emerald-700 font-medium mt-1">
              💡 Describe the role, responsibilities and what makes this job exciting.
            </p>
          )}
        </div>

        {/* Employment Type */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-2">
            Employment Type <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {employmentTypeOptions.map((opt) => {
              const IconComp = opt.icon;
              const isSelected = employmentType === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateFormValue('employmentType', opt.id)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-2 tap-bounce cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 border-[#08A34F] text-[#08A34F] shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <IconComp className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Experience Level & No. of Vacancies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              Experience Level <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={experienceLevel}
                onChange={(e) => updateFormValue('experienceLevel', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none pr-8 cursor-pointer"
              >
                {experienceOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              No. of Vacancies <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="number"
                min={1}
                max={500}
                value={vacancies}
                onChange={(e) => updateFormValue('vacancies', Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            {errors.vacancies && <p className="text-[11px] text-rose-600 font-medium mt-1">{errors.vacancies}</p>}
          </div>
        </div>
      </div>

      {/* Green Pro Tip Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/90 text-emerald-900 flex items-start gap-3 shadow-xs">
        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
          💡
        </div>
        <div>
          <h4 className="text-xs font-extrabold text-emerald-900 mb-0.5">Pro Tip</h4>
          <p className="text-[11px] text-emerald-800 font-medium leading-relaxed">
            Provide complete details to get more and better-quality applications. Jobs with full information get 4x more responses!
          </p>
        </div>
      </div>
    </div>
  );
};
