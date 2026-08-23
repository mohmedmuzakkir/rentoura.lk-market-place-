import React, { useState, useMemo } from 'react';
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

interface CategorySelectorPageProps {
  onNavigate: (route: AppRoute) => void;
  onApplyCategory: (categoryPath: string, categoryState: SelectedCategoryState) => void;
  initialModule?: ModuleType;
  initialCategoryPath?: string;
  savedCount?: number;
}

export const CategorySelectorPage: React.FC<CategorySelectorPageProps> = ({
  onNavigate,
  onApplyCategory,
  initialModule = 'rentals',
  savedCount = 0
}) => {
  // Active Module Tab: 'rentals' | 'jobs' | 'services'
  const [activeModule, setActiveModule] = useState<ModuleType>(initialModule);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile active column step: 1 (Main) | 2 (Sub) | 3 (Third)
  const [mobileActiveStep, setMobileActiveStep] = useState<1 | 2 | 3>(1);

  // Cascading Selection State
  const categorySystemData = useMemo(() => CategoryService.getCategorySystemData(false), []);
  const moduleSystem = categorySystemData[activeModule];

  // Initialize with the first category of the module (e.g. Property Rentals -> Whole House -> 2 Bedrooms as in reference)
  const [selectedMainCat, setSelectedMainCat] = useState<MainCategoryData | null>(() => {
    return moduleSystem.categories[0] || null;
  });

  const [selectedSubCat, setSelectedSubCat] = useState<SubCategoryData | null>(() => {
    return moduleSystem.categories[0]?.subcategories[0] || null;
  });

  const [selectedThirdLevel, setSelectedThirdLevel] = useState<ThirdLevelOption | null>(() => {
    return moduleSystem.categories[0]?.subcategories[0]?.thirdLevelOptions?.[0] || null;
  });

  // Switch Module Tab
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
      // Allow deselecting third level since it's optional
      setSelectedThirdLevel(null);
    } else {
      setSelectedThirdLevel(third);
    }
  };

  // Popular search chip click
  const handleSelectPopularSearch = (item: { mainCatId: string; subCatId?: string; thirdLevelId?: string }) => {
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

  // Search Filtering using comprehensive search algorithm
  const filteredMainCategories = useMemo(() => {
    return searchModuleCategories(moduleSystem.categories, searchQuery);
  }, [moduleSystem.categories, searchQuery]);

  // Auto-sync selectedMainCat if current selection is filtered out by search
  React.useEffect(() => {
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
    onNavigate('/search');
  };

  // Module color helpers
  const primaryColor = moduleSystem.primaryColor;
  const isRentals = activeModule === 'rentals';
  const isJobs = activeModule === 'jobs';
  const isServices = activeModule === 'services';

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-800 antialiased font-sans">
      {/* 1. Header Matching Uploaded Reference */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 px-4 py-3 shadow-2xs backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/search')}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors tap-bounce"
              aria-label="Back to Search"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <RentouraLogo height={28} />
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => onNavigate('/saved')}
              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors relative"
              aria-label="Saved listings"
            >
              <Heart className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>
            
            <button 
              onClick={() => onNavigate('/messages')}
              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors relative"
              aria-label="Messages"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#1464F4] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                3
              </span>
            </button>

            <button 
              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#1464F4] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                7
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-3.5 sm:px-6 pt-4 space-y-4">
        {/* 2. Page Title */}
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Choose Category
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Select the right category to find exactly what you need
          </p>
        </div>

        {/* 3. Large Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1464F4]/30 focus:border-[#1464F4] shadow-2xs transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 4. Module Tabs (Rentals, Jobs, Services) */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          {/* Tab 1: Rentals */}
          <button
            onClick={() => handleSwitchModule('rentals')}
            className={`py-2.5 px-2 rounded-xl transition-all flex flex-col items-center justify-center text-center tap-bounce ${
              isRentals
                ? 'bg-[#1464F4] text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
              <Home className={`w-4 h-4 ${isRentals ? 'text-white' : 'text-[#1464F4]'}`} />
              <span>RENTALS</span>
            </div>
            <span className={`text-[10px] mt-0.5 font-medium ${isRentals ? 'text-blue-100' : 'text-slate-400'}`}>
              Rent what you need
            </span>
          </button>

          {/* Tab 2: Jobs */}
          <button
            onClick={() => handleSwitchModule('jobs')}
            className={`py-2.5 px-2 rounded-xl transition-all flex flex-col items-center justify-center text-center tap-bounce ${
              isJobs
                ? 'bg-[#08A34F] text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
              <Briefcase className={`w-4 h-4 ${isJobs ? 'text-white' : 'text-[#08A34F]'}`} />
              <span>JOBS</span>
            </div>
            <span className={`text-[10px] mt-0.5 font-medium ${isJobs ? 'text-emerald-100' : 'text-slate-400'}`}>
              Find your dream job
            </span>
          </button>

          {/* Tab 3: Services */}
          <button
            onClick={() => handleSwitchModule('services')}
            className={`py-2.5 px-2 rounded-xl transition-all flex flex-col items-center justify-center text-center tap-bounce ${
              isServices
                ? 'bg-[#FF650A] text-white shadow-md shadow-orange-500/20'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
              <Wrench className={`w-4 h-4 ${isServices ? 'text-white' : 'text-[#FF650A]'}`} />
              <span>SERVICES</span>
            </div>
            <span className={`text-[10px] mt-0.5 font-medium ${isServices ? 'text-orange-100' : 'text-slate-400'}`}>
              Hire expert services
            </span>
          </button>
        </div>

        {/* Mobile Step Navigator Pills (Responsive Helper for 390px screens) */}
        <div className="flex md:hidden items-center justify-between bg-white px-2 py-1.5 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setMobileActiveStep(1)}
            className={`flex-1 py-1 px-1.5 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition-all ${
              mobileActiveStep === 1 
                ? 'bg-slate-900 text-white' 
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
              mobileActiveStep === 1 ? 'bg-white text-slate-900 font-black' : 'bg-slate-200 text-slate-600'
            }`}>1</span>
            <span>Main</span>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-slate-300 mx-0.5" />

          <button
            onClick={() => setMobileActiveStep(2)}
            className={`flex-1 py-1 px-1.5 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition-all ${
              mobileActiveStep === 2 
                ? 'bg-slate-900 text-white' 
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
              mobileActiveStep === 2 ? 'bg-white text-slate-900 font-black' : 'bg-slate-200 text-slate-600'
            }`}>2</span>
            <span>Sub</span>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-slate-300 mx-0.5" />

          <button
            onClick={() => setMobileActiveStep(3)}
            className={`flex-1 py-1 px-1.5 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition-all ${
              mobileActiveStep === 3 
                ? 'bg-slate-900 text-white' 
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
              mobileActiveStep === 3 ? 'bg-white text-slate-900 font-black' : 'bg-slate-200 text-slate-600'
            }`}>3</span>
            <span>Type (Opt)</span>
          </button>
        </div>

        {/* 5. Three-Level Category Grid Container Matching Reference */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-3 sm:p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            
            {/* ========================================================================= */}
            {/* LEVEL 1: MAIN CATEGORY */}
            {/* ========================================================================= */}
            <div className={`space-y-3 ${mobileActiveStep !== 1 ? 'hidden md:block' : 'block'}`}>
              {/* Column 1 Header */}
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <div 
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-xs"
                  style={{ backgroundColor: primaryColor }}
                >
                  1
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                    Main Category
                  </h3>
                  <p className="text-[10.5px] text-slate-400 font-medium">
                    Choose a main category
                  </p>
                </div>
              </div>

              {/* Column 1 Category List */}
              <div className="space-y-1 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                {filteredMainCategories.map((mainCat) => {
                  const isSelected = selectedMainCat?.id === mainCat.id;
                  return (
                    <button
                      key={mainCat.id}
                      onClick={() => handleSelectMainCategory(mainCat)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all tap-bounce ${
                        isSelected
                          ? isRentals
                            ? 'bg-blue-50/80 border border-blue-200 text-[#1464F4] font-bold shadow-2xs'
                            : isJobs
                            ? 'bg-emerald-50/80 border border-emerald-200 text-[#08A34F] font-bold shadow-2xs'
                            : 'bg-orange-50/80 border border-orange-200 text-[#FF650A] font-bold shadow-2xs'
                          : 'hover:bg-slate-50 text-slate-700 font-medium border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base shrink-0">
                          {mainCat.icon}
                        </span>
                        <span className="text-xs truncate">
                          {mainCat.name}
                        </span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${
                        isSelected 
                          ? isRentals ? 'text-[#1464F4]' : isJobs ? 'text-[#08A34F]' : 'text-[#FF650A]'
                          : 'text-slate-300'
                      }`} />
                    </button>
                  );
                })}

                {filteredMainCategories.length === 0 && (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    No matching categories found
                  </div>
                )}
              </div>
            </div>

            {/* ========================================================================= */}
            {/* LEVEL 2: SUBCATEGORY */}
            {/* ========================================================================= */}
            <div className={`space-y-3 md:pl-3 pt-3 md:pt-0 ${mobileActiveStep !== 2 ? 'hidden md:block' : 'block'}`}>
              {/* Column 2 Header */}
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-xs"
                    style={{ backgroundColor: primaryColor }}
                  >
                    2
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                      Sub Category
                    </h3>
                    <p className="text-[10.5px] text-slate-400 font-medium">
                      Choose a sub category
                    </p>
                  </div>
                </div>

                {/* Mobile Back to Main Button */}
                <button
                  onClick={() => setMobileActiveStep(1)}
                  className="md:hidden text-[10.5px] font-bold text-slate-400 hover:text-slate-700"
                >
                  ‹ Back
                </button>
              </div>

              {/* Column 2 Subcategory Cards List */}
              <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                {selectedMainCat?.subcategories.map((subCat) => {
                  const isSelected = selectedSubCat?.id === subCat.id;
                  return (
                    <button
                      key={subCat.id}
                      onClick={() => handleSelectSubCategory(subCat)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all tap-bounce ${
                        isSelected
                          ? isRentals
                            ? 'bg-blue-50/90 border-2 border-[#1464F4] shadow-xs'
                            : isJobs
                            ? 'bg-emerald-50/90 border-2 border-[#08A34F] shadow-xs'
                            : 'bg-orange-50/90 border-2 border-[#FF650A] shadow-xs'
                          : 'bg-slate-50/70 hover:bg-slate-100 border border-slate-200/80 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-base shrink-0 shadow-2xs">
                          {subCat.icon || '📦'}
                        </div>
                        <div className="min-w-0">
                          <h4 className={`text-xs font-bold truncate ${
                            isSelected 
                              ? isRentals ? 'text-[#1464F4]' : isJobs ? 'text-[#08A34F]' : 'text-[#FF650A]'
                              : 'text-slate-800'
                          }`}>
                            {subCat.name}
                          </h4>
                          {subCat.subtitle && (
                            <p className="text-[10px] text-slate-400 truncate font-medium">
                              {subCat.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Selected checkmark or right chevron */}
                      {isSelected ? (
                        <div 
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                      )}
                    </button>
                  );
                })}

                {(!selectedMainCat || selectedMainCat.subcategories.length === 0) && (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    Please select a main category first
                  </div>
                )}
              </div>
            </div>

            {/* ========================================================================= */}
            {/* LEVEL 3: THIRD LEVEL (OPTIONAL) / SPECIFIC TYPE */}
            {/* ========================================================================= */}
            <div className={`space-y-3 md:pl-3 pt-3 md:pt-0 ${mobileActiveStep !== 3 ? 'hidden md:block' : 'block'}`}>
              {/* Column 3 Header */}
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-xs"
                    style={{ backgroundColor: primaryColor }}
                  >
                    3
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                      Third Level (Optional)
                    </h3>
                    <p className="text-[10.5px] text-slate-400 font-medium">
                      Choose specific type
                    </p>
                  </div>
                </div>

                {/* Mobile Back to Sub Button */}
                <button
                  onClick={() => setMobileActiveStep(2)}
                  className="md:hidden text-[10.5px] font-bold text-slate-400 hover:text-slate-700"
                >
                  ‹ Back
                </button>
              </div>

              {/* Column 3 Third Level Option Cards */}
              <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                {selectedSubCat?.thirdLevelOptions && selectedSubCat.thirdLevelOptions.length > 0 ? (
                  selectedSubCat.thirdLevelOptions.map((third) => {
                    const isSelected = selectedThirdLevel?.id === third.id;
                    return (
                      <button
                        key={third.id}
                        onClick={() => handleSelectThirdLevel(third)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all tap-bounce ${
                          isSelected
                            ? isRentals
                              ? 'bg-blue-50/90 border-2 border-[#1464F4] shadow-xs'
                              : isJobs
                              ? 'bg-emerald-50/90 border-2 border-[#08A34F] shadow-xs'
                              : 'bg-orange-50/90 border-2 border-[#FF650A] shadow-xs'
                            : 'bg-slate-50/70 hover:bg-slate-100 border border-slate-200/80 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-base shrink-0">
                            {third.icon || '🏷️'}
                          </span>
                          <div className="min-w-0">
                            <h4 className={`text-xs font-bold truncate ${
                              isSelected 
                                ? isRentals ? 'text-[#1464F4]' : isJobs ? 'text-[#08A34F]' : 'text-[#FF650A]'
                                : 'text-slate-800'
                            }`}>
                              {third.name}
                            </h4>
                            {third.subtitle && (
                              <p className="text-[10px] text-slate-400 truncate font-medium">
                                {third.subtitle}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Selected Checkmark */}
                        {isSelected && (
                          <div 
                            className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs"
                            style={{ backgroundColor: primaryColor }}
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-8 px-3 text-slate-400 space-y-1">
                    <p className="text-xs font-semibold text-slate-500">No further sub-options</p>
                    <p className="text-[11px]">You can apply your category at this level</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* 11. Selected Category Summary Card Matching Reference */}
        <div 
          className="rounded-2xl p-3 sm:p-4 border flex items-center justify-between gap-3 shadow-xs transition-all"
          style={{ 
            backgroundColor: isRentals ? '#EFF6FF' : isJobs ? '#ECFDF5' : '#FFF7ED',
            borderColor: isRentals ? '#BFDBFE' : isJobs ? '#A7F3D0' : '#FED7AA'
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs"
              style={{ backgroundColor: primaryColor }}
            >
              <Check className="w-4 h-4 stroke-[3]" />
            </div>

            <div className="min-w-0">
              <span 
                className="text-[10px] font-black tracking-wider uppercase block"
                style={{ color: primaryColor }}
              >
                SELECTED CATEGORY
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {formattedPath}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setMobileActiveStep(1);
              setSelectedThirdLevel(null);
            }}
            className="flex items-center gap-1 text-xs font-bold shrink-0 hover:underline px-2 py-1 rounded-lg transition-colors"
            style={{ color: primaryColor }}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Change</span>
          </button>
        </div>

        {/* 12. Apply Category Button */}
        <button
          onClick={handleApply}
          className="w-full py-3.5 px-4 rounded-2xl text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:brightness-105 active:scale-[0.99] transition-all tap-bounce"
          style={{ 
            backgroundColor: primaryColor,
            boxShadow: `0 10px 25px -5px ${primaryColor}40`
          }}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Apply Category</span>
        </button>

        {/* 13. Popular Searches Section Matching Reference */}
        <div className="pt-2 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Popular Searches</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {moduleSystem.popularSearches.map((pop, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPopularSearch(pop)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-all shadow-2xs tap-bounce"
              >
                <span>{pop.icon}</span>
                <span>{pop.label}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
