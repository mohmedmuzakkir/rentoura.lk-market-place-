import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  X, 
  Check, 
  CheckCircle2, 
  ChevronRight, 
  Heart, 
  MessageCircle, 
  Bell, 
  Home, 
  Briefcase, 
  Wrench, 
  Edit3, 
  Sparkles,
  Layers,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { RentouraLogo } from '../components/RentouraLogo';
import { CategoryService } from '../services/categoryService';
import { 
  ModuleType, 
  MainCategoryData, 
  SubCategoryData, 
  ThirdLevelOption, 
  SelectedCategoryState,
  formatSelectedCategoryPath,
  searchModuleCategories
} from '../data/categorySelectorData';
import { AppRoute } from '../types';

export interface CategorySelectorPageProps {
  onNavigate: (route: AppRoute) => void;
  returnTo?: AppRoute;
  initialModule?: 'all' | 'rentals' | 'jobs' | 'services' | 'rental' | 'job' | 'service';
  initialCategoryPath?: string;
  savedCount?: number;
  onApplyCategory: (categoryPath: string, categoryState: SelectedCategoryState) => void;
  onCancel?: () => void;
}

export const CategorySelectorPage: React.FC<CategorySelectorPageProps> = ({
  onNavigate,
  returnTo = '/',
  initialModule = 'all',
  initialCategoryPath = '',
  savedCount = 0,
  onApplyCategory,
  onCancel
}) => {
  // Determine if module is locked from context
  const normInitModule = useMemo<ModuleType | 'all'>(() => {
    if (!initialModule) return 'all';
    const lower = initialModule.toLowerCase();
    if (lower === 'rental' || lower === 'rentals') return 'rentals';
    if (lower === 'job' || lower === 'jobs') return 'jobs';
    if (lower === 'service' || lower === 'services') return 'services';
    return 'all';
  }, [initialModule]);

  const isModuleLocked = normInitModule !== 'all';

  // Active Module Tab: 'rentals' | 'jobs' | 'services'
  const [activeModule, setActiveModule] = useState<ModuleType>(
    isModuleLocked ? (normInitModule as ModuleType) : 'rentals'
  );

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile active column step: 1 (Main) | 2 (Sub) | 3 (Third)
  const [mobileActiveStep, setMobileActiveStep] = useState<1 | 2 | 3>(1);

  // Cascading Selection State
  const categorySystemData = useMemo(() => CategoryService.getCategorySystemData(false), []);
  const moduleSystem = categorySystemData[activeModule] || categorySystemData['rentals'];

  // Initialize with the first category of the active module
  const [selectedMainCat, setSelectedMainCat] = useState<MainCategoryData | null>(() => {
    return moduleSystem.categories[0] || null;
  });

  const [selectedSubCat, setSelectedSubCat] = useState<SubCategoryData | null>(() => {
    return moduleSystem.categories[0]?.subcategories[0] || null;
  });

  const [selectedThirdLevel, setSelectedThirdLevel] = useState<ThirdLevelOption | null>(() => {
    return moduleSystem.categories[0]?.subcategories[0]?.thirdLevelOptions?.[0] || null;
  });

  // Handle Cancel / Back / Close (X)
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onNavigate(returnTo || '/');
    }
  };

  // Switch Module Tab in Global Mode (clears hierarchy to prevent cross-contamination)
  const handleSwitchModule = (mod: ModuleType) => {
    if (mod === activeModule) return;
    setActiveModule(mod);
    const newSystem = categorySystemData[mod];
    const defaultMain = newSystem.categories[0] || null;
    const defaultSub = defaultMain?.subcategories[0] || null;
    const defaultThird = defaultSub?.thirdLevelOptions?.[0] || null;
    
    setSelectedMainCat(defaultMain);
    setSelectedSubCat(defaultSub);
    setSelectedThirdLevel(defaultThird);
    setMobileActiveStep(1);
    setSearchQuery('');
  };

  // Select Main Category (Level 1)
  const handleSelectMainCategory = (cat: MainCategoryData) => {
    setSelectedMainCat(cat);
    // Reset lower levels
    const firstSub = cat.subcategories.length > 0 ? cat.subcategories[0] : null;
    setSelectedSubCat(firstSub);
    setSelectedThirdLevel(firstSub?.thirdLevelOptions?.[0] || null);
    // Advance mobile step if on mobile
    setMobileActiveStep(2);
  };

  // Select Subcategory (Level 2)
  const handleSelectSubCategory = (sub: SubCategoryData) => {
    setSelectedSubCat(sub);
    // Reset third level
    const firstThird = sub.thirdLevelOptions && sub.thirdLevelOptions.length > 0 ? sub.thirdLevelOptions[0] : null;
    setSelectedThirdLevel(firstThird);
    if (sub.thirdLevelOptions && sub.thirdLevelOptions.length > 0) {
      setMobileActiveStep(3);
    }
  };

  // Select Third Level Option (Level 3 - Optional)
  const handleSelectThirdLevel = (third: ThirdLevelOption) => {
    if (selectedThirdLevel?.id === third.id) {
      setSelectedThirdLevel(null);
    } else {
      setSelectedThirdLevel(third);
    }
  };

  // Quick category shortcut click
  const handleSelectQuickCategory = (item: { mainCatId: string; subCatId?: string; thirdLevelId?: string }) => {
    const main = moduleSystem.categories.find(c => c.id === item.mainCatId);
    if (main) {
      setSelectedMainCat(main);
      if (item.subCatId) {
        const sub = main.subcategories.find(s => s.id === item.subCatId);
        if (sub) {
          setSelectedSubCat(sub);
          if (item.thirdLevelId && sub.thirdLevelOptions) {
            const third = sub.thirdLevelOptions.find(t => t.id === item.thirdLevelId);
            setSelectedThirdLevel(third || null);
          } else {
            setSelectedThirdLevel(sub.thirdLevelOptions?.[0] || null);
          }
        } else {
          setSelectedSubCat(main.subcategories[0] || null);
          setSelectedThirdLevel(main.subcategories[0]?.thirdLevelOptions?.[0] || null);
        }
      } else {
        setSelectedSubCat(main.subcategories[0] || null);
        setSelectedThirdLevel(main.subcategories[0]?.thirdLevelOptions?.[0] || null);
      }
    }
  };

  // Search Filtering using category search algorithm
  const filteredMainCategories = useMemo(() => {
    return searchModuleCategories(moduleSystem.categories, searchQuery);
  }, [moduleSystem.categories, searchQuery]);

  // Auto-sync selectedMainCat if current selection is filtered out by search
  useEffect(() => {
    if (filteredMainCategories.length > 0) {
      const exists = filteredMainCategories.some(c => c.id === selectedMainCat?.id);
      if (!exists) {
        const first = filteredMainCategories[0];
        setSelectedMainCat(first);
        const firstSub = first.subcategories[0] || null;
        setSelectedSubCat(firstSub);
        setSelectedThirdLevel(firstSub?.thirdLevelOptions?.[0] || null);
      }
    }
  }, [filteredMainCategories, selectedMainCat]);

  // Current category selection state
  const currentSelectionState: SelectedCategoryState = {
    module: activeModule,
    mainCategory: selectedMainCat,
    subCategory: selectedSubCat,
    thirdLevel: selectedThirdLevel
  };

  // Formatted category path
  const formattedPath = useMemo(() => {
    return formatSelectedCategoryPath(currentSelectionState);
  }, [currentSelectionState]);

  // Handle Apply Category
  const handleApply = () => {
    onApplyCategory(formattedPath, currentSelectionState);
    onNavigate(returnTo || '/');
  };

  // Module color helpers
  const primaryColor = moduleSystem.primaryColor;
  const isRentals = activeModule === 'rentals';
  const isJobs = activeModule === 'jobs';
  const isServices = activeModule === 'services';

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-48 lg:pb-36 text-slate-800 antialiased font-sans flex flex-col relative select-none">
      {/* 1. Header with clean branding and back navigation */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 px-4 py-3 shadow-2xs backdrop-blur-md">
        <div className="max-w-5xl lg:max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <RentouraLogo variant="header" theme="light" />
          </div>

          <div className="text-right">
            <h1 className="text-sm font-black text-slate-900 tracking-tight">
              Select Category
            </h1>
            <p className="text-[10px] font-semibold text-slate-400 capitalize">
              {isModuleLocked ? `${activeModule} Module` : 'All Marketplace Modules'}
            </p>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl lg:max-w-6xl mx-auto w-full px-3.5 sm:px-6 pt-4 space-y-4">
        {/* Module Switcher Tabs (Only shown if opened in Global Context) */}
        {!isModuleLocked ? (
          <div className="p-1 bg-slate-200/80 rounded-2xl flex items-center gap-1 shadow-inner">
            {[
              { id: 'rentals' as ModuleType, label: 'Rentals', color: '#1464F4', icon: Home },
              { id: 'jobs' as ModuleType, label: 'Jobs', color: '#08A34F', icon: Briefcase },
              { id: 'services' as ModuleType, label: 'Services', color: '#FF650A', icon: Wrench },
            ].map((tab) => {
              const isActive = activeModule === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSwitchModule(tab.id)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isActive ? 'bg-white text-slate-900 shadow-md' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  style={{
                    borderBottom: isActive ? `3px solid ${tab.color}` : 'none'
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: isActive ? tab.color : undefined }} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="px-3 py-2 bg-slate-100 rounded-xl border border-slate-200/80 flex items-center gap-2 text-xs font-bold text-slate-700">
            <Layers className="w-4 h-4" style={{ color: primaryColor }} />
            <span>Category selection locked to <strong className="capitalize" style={{ color: primaryColor }}>{activeModule}</strong> listings</span>
          </div>
        )}

        {/* Search Input Bar */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeModule} categories...`}
            className="w-full pl-9 pr-9 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1464F4] focus:ring-2 focus:ring-blue-100 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Categories Section */}
        {moduleSystem.popularSearches && moduleSystem.popularSearches.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Quick Categories</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {moduleSystem.popularSearches.map((pop, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectQuickCategory(pop)}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
                >
                  <span>{pop.icon}</span>
                  <span>{pop.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3-Column Cascading Hierarchy Desktop / Step View Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 min-h-[380px]">
          {/* LEVEL 1: MAIN CATEGORIES */}
          <div className={`bg-white rounded-2xl border border-slate-200/80 p-3 shadow-2xs flex flex-col ${
            mobileActiveStep !== 1 ? 'hidden md:flex' : 'flex'
          }`}>
            <div className="pb-2 border-b border-slate-100 mb-2 flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                1. Main Category
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {filteredMainCategories.length} available
              </span>
            </div>

            <div className="space-y-1 overflow-y-auto max-h-[360px] no-scrollbar flex-1 pr-1">
              {filteredMainCategories.map((cat) => {
                const isSelected = selectedMainCat?.id === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectMainCategory(cat)}
                    className={`w-full p-2.5 rounded-xl text-left font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base">{cat.icon}</span>
                      <span className="truncate">{cat.name}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* LEVEL 2: SUBCATEGORIES */}
          <div className={`bg-white rounded-2xl border border-slate-200/80 p-3 shadow-2xs flex flex-col ${
            mobileActiveStep !== 2 ? 'hidden md:flex' : 'flex'
          }`}>
            <div className="pb-2 border-b border-slate-100 mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMobileActiveStep(1)}
                  className="md:hidden text-xs font-bold text-[#1464F4] flex items-center gap-0.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Main</span>
                </button>
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider truncate">
                  2. Subcategory
                </span>
              </div>
              {selectedMainCat && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 truncate max-w-[120px]">
                  {selectedMainCat.name}
                </span>
              )}
            </div>

            <div className="space-y-1 overflow-y-auto max-h-[360px] no-scrollbar flex-1 pr-1">
              {!selectedMainCat || selectedMainCat.subcategories.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs font-semibold">
                  Select a main category to view subcategories.
                </div>
              ) : (
                selectedMainCat.subcategories.map((sub) => {
                  const isSelected = selectedSubCat?.id === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => handleSelectSubCategory(sub)}
                      className={`w-full p-2.5 rounded-xl text-left font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'text-white shadow-xs'
                          : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700'
                      }`}
                      style={{
                        backgroundColor: isSelected ? primaryColor : undefined
                      }}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {sub.icon && <span className="text-base">{sub.icon}</span>}
                        <span className="truncate">{sub.name}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* LEVEL 3: THIRD LEVEL OPTIONS (OPTIONAL) */}
          <div className={`bg-white rounded-2xl border border-slate-200/80 p-3 shadow-2xs flex flex-col ${
            mobileActiveStep !== 3 ? 'hidden md:flex' : 'flex'
          }`}>
            <div className="pb-2 border-b border-slate-100 mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMobileActiveStep(2)}
                  className="md:hidden text-xs font-bold text-[#1464F4] flex items-center gap-0.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Sub</span>
                </button>
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider truncate">
                  3. Option (Optional)
                </span>
              </div>
              {selectedSubCat && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 truncate max-w-[120px]">
                  {selectedSubCat.name}
                </span>
              )}
            </div>

            <div className="space-y-1 overflow-y-auto max-h-[360px] no-scrollbar flex-1 pr-1">
              {!selectedSubCat || !selectedSubCat.thirdLevelOptions || selectedSubCat.thirdLevelOptions.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs font-semibold">
                  No additional level 3 options. You can proceed directly with <strong>{selectedSubCat?.name || 'Subcategory'}</strong> selection.
                </div>
              ) : (
                selectedSubCat.thirdLevelOptions.map((third) => {
                  const isSelected = selectedThirdLevel?.id === third.id;
                  return (
                    <button
                      key={third.id}
                      type="button"
                      onClick={() => handleSelectThirdLevel(third)}
                      className={`w-full p-2.5 rounded-xl text-left font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="truncate">{third.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-white stroke-[2.5] shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>

      {/* STICKY BOTTOM APPLY FOOTER */}
      <footer className="fixed bottom-16 lg:bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3 sm:p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="max-w-5xl lg:max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0 w-full sm:w-auto">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs"
              style={{ backgroundColor: selectedMainCat ? primaryColor : '#94A3B8' }}
            >
              <Check className="w-4 h-4 stroke-[3]" />
            </div>

            <div className="min-w-0 flex-1">
              <span 
                className="text-[10px] font-black tracking-wider uppercase block truncate"
                style={{ color: selectedMainCat ? primaryColor : '#64748B' }}
              >
                SELECTED CATEGORY
              </span>
              <p className="text-xs sm:text-sm font-black text-slate-900 truncate">
                {formattedPath || 'Select a Category'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors shrink-0 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApply}
              disabled={!selectedMainCat}
              className={`flex-1 sm:flex-initial py-3 px-6 rounded-xl text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg active:scale-[0.99] transition-all ${
                !selectedMainCat ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
              }`}
              style={{ 
                backgroundColor: selectedMainCat ? primaryColor : '#94A3B8',
                boxShadow: selectedMainCat ? `0 8px 20px -4px ${primaryColor}40` : 'none'
              }}
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>Apply Category</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
