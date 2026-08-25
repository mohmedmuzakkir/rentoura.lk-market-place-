import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  X, 
  Check, 
  CheckCircle2, 
  ChevronRight, 
  Home, 
  Briefcase, 
  Wrench, 
  Sparkles,
  Layers,
  RefreshCw,
  Globe
} from 'lucide-react';
import { RentouraLogo } from '../components/RentouraLogo';
import { 
  CategoryService, 
  CategoryRecord, 
  CategoryModule, 
  FrontendModule, 
  CategorySearchResult 
} from '../services/categoryService';
import { getCategoryIconComponent } from '../components/CategoryIcon';
import { AppRoute } from '../types';

export interface CategorySelectorPageProps {
  onNavigate: (route: AppRoute) => void;
  returnTo?: AppRoute;
  initialModule?: 'all' | 'rentals' | 'jobs' | 'services' | 'rental' | 'job' | 'service';
  initialCategoryPath?: string;
  savedCount?: number;
  onApplyCategory: (categoryPath: string, categoryState: any) => void;
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
  // Determine if module is locked from caller context
  const normInitModule = useMemo<'rentals' | 'jobs' | 'services' | 'all'>(() => {
    if (!initialModule) return 'all';
    const lower = initialModule.toLowerCase();
    if (lower === 'rental' || lower === 'rentals') return 'rentals';
    if (lower === 'job' || lower === 'jobs') return 'jobs';
    if (lower === 'service' || lower === 'services') return 'services';
    return 'all';
  }, [initialModule]);

  const isModuleLocked = normInitModule !== 'all';

  // Active Module Tab
  const [activeModule, setActiveModule] = useState<'rentals' | 'jobs' | 'services'>(
    isModuleLocked ? (normInitModule as 'rentals' | 'jobs' | 'services') : 'rentals'
  );

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CategorySearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mobile active step: 1 (Main) | 2 (Sub) | 3 (Third)
  const [mobileActiveStep, setMobileActiveStep] = useState<1 | 2 | 3>(1);

  // Loaded DB categories for active module
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Draft selection state (default null = All Categories)
  const [selectedMainCat, setSelectedMainCat] = useState<CategoryRecord | null>(null);
  const [selectedSubCat, setSelectedSubCat] = useState<CategoryRecord | null>(null);
  const [selectedThirdLevel, setSelectedThirdLevel] = useState<CategoryRecord | null>(null);

  // Fetch categories when activeModule changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    CategoryService.getCategories(activeModule).then((res) => {
      if (!isMounted) return;
      if (res.success && res.data) {
        setCategories(res.data);
      } else {
        setCategories([]);
      }
      setLoading(false);
    }).catch(() => {
      if (!isMounted) return;
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [activeModule]);

  // Sync initialCategoryPath on initial load once categories are loaded
  useEffect(() => {
    if (categories.length === 0 || !initialCategoryPath || initialCategoryPath === 'All Categories') {
      return;
    }

    const parts = initialCategoryPath.split('›').map((p) => p.trim());
    if (parts.length === 0) return;

    const mainName = parts[0];
    const subName = parts[1];
    const thirdName = parts[2];

    const main = categories.find((c) => (c.level === 1 || !c.parent_id) && c.name.toLowerCase() === mainName.toLowerCase());
    if (main) {
      setSelectedMainCat(main);
      if (subName) {
        const sub = categories.find((c) => c.parent_id === main.id && c.name.toLowerCase() === subName.toLowerCase());
        if (sub) {
          setSelectedSubCat(sub);
          if (thirdName) {
            const third = categories.find((c) => c.parent_id === sub.id && c.name.toLowerCase() === thirdName.toLowerCase());
            if (third) {
              setSelectedThirdLevel(third);
            }
          }
        }
      }
    }
  }, [categories, initialCategoryPath]);

  // Handle Search Execution
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    let isMounted = true;
    setIsSearching(true);

    CategoryService.searchCategories(searchQuery, activeModule).then((results) => {
      if (isMounted) {
        setSearchResults(results);
        setIsSearching(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, activeModule]);

  // Handle Cancel / Back
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onNavigate(returnTo || '/');
    }
  };

  // Switch Module Tab
  const handleSwitchModule = (mod: 'rentals' | 'jobs' | 'services') => {
    if (mod === activeModule) return;
    setActiveModule(mod);
    setSelectedMainCat(null);
    setSelectedSubCat(null);
    setSelectedThirdLevel(null);
    setMobileActiveStep(1);
    setSearchQuery('');
  };

  // Select Main Category (Level 1)
  const handleSelectMainCategory = (cat: CategoryRecord | null) => {
    if (!cat) {
      // "All Categories" selected
      setSelectedMainCat(null);
      setSelectedSubCat(null);
      setSelectedThirdLevel(null);
      return;
    }

    setSelectedMainCat(cat);
    setSelectedSubCat(null);
    setSelectedThirdLevel(null);

    const hasChildren = categories.some((c) => c.parent_id === cat.id);
    if (hasChildren) {
      setMobileActiveStep(2);
    }
  };

  // Select Subcategory (Level 2)
  const handleSelectSubCategory = (sub: CategoryRecord) => {
    setSelectedSubCat(sub);
    setSelectedThirdLevel(null);

    const hasChildren = categories.some((c) => c.parent_id === sub.id);
    if (hasChildren) {
      setMobileActiveStep(3);
    }
  };

  // Select Third Level Option (Level 3)
  const handleSelectThirdLevel = (third: CategoryRecord) => {
    if (selectedThirdLevel?.id === third.id) {
      setSelectedThirdLevel(null);
    } else {
      setSelectedThirdLevel(third);
    }
  };

  // Select a search result item
  const handleSelectSearchResult = (result: CategorySearchResult) => {
    setSelectedMainCat(result.mainCategory || null);
    setSelectedSubCat(result.subCategory || null);
    setSelectedThirdLevel(result.thirdLevel || null);
    setSearchQuery('');
  };

  // Filter category hierarchy lists
  const l1Categories = useMemo(() => {
    return categories.filter((c) => c.level === 1 || !c.parent_id);
  }, [categories]);

  const l2Categories = useMemo(() => {
    if (!selectedMainCat) return [];
    return categories.filter((c) => c.parent_id === selectedMainCat.id);
  }, [categories, selectedMainCat]);

  const l3Categories = useMemo(() => {
    if (!selectedSubCat) return [];
    return categories.filter((c) => c.parent_id === selectedSubCat.id);
  }, [categories, selectedSubCat]);

  // Formatted selected category display string
  const formattedPath = useMemo(() => {
    if (!selectedMainCat) return 'All Categories';
    const parts = [selectedMainCat.name];
    if (selectedSubCat) parts.push(selectedSubCat.name);
    if (selectedThirdLevel) parts.push(selectedThirdLevel.name);
    return parts.join(' › ');
  }, [selectedMainCat, selectedSubCat, selectedThirdLevel]);

  // Construct structured state payload for caller
  const currentSelectionState = useMemo(() => {
    return {
      module: activeModule,
      mainCategory: selectedMainCat ? { id: selectedMainCat.id, name: selectedMainCat.name, slug: selectedMainCat.slug } : null,
      subCategory: selectedSubCat ? { id: selectedSubCat.id, name: selectedSubCat.name, slug: selectedSubCat.slug } : null,
      thirdLevel: selectedThirdLevel ? { id: selectedThirdLevel.id, name: selectedThirdLevel.name, slug: selectedThirdLevel.slug } : null,
      selectedMainCat,
      selectedSubCat,
      selectedThirdLevel
    };
  }, [activeModule, selectedMainCat, selectedSubCat, selectedThirdLevel]);

  // Handle Apply
  const handleApply = () => {
    onApplyCategory(formattedPath, currentSelectionState);
    if (onCancel) {
      // If modal or caller handles close
    } else {
      onNavigate(returnTo || '/');
    }
  };

  // Module color scheme
  const primaryColor = activeModule === 'rentals' ? '#1464F4' : activeModule === 'jobs' ? '#08A34F' : '#FF650A';
  const moduleDBName: CategoryModule = activeModule === 'rentals' ? 'rental' : activeModule === 'jobs' ? 'job' : 'service';

  const renderIcon = (iconKey: string | null) => {
    return getCategoryIconComponent({ iconKey, module: moduleDBName, className: 'w-4 h-4' });
  };

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
              { id: 'rentals' as const, label: 'Rentals', color: '#1464F4', icon: Home },
              { id: 'jobs' as const, label: 'Jobs', color: '#08A34F', icon: Briefcase },
              { id: 'services' as const, label: 'Services', color: '#FF650A', icon: Wrench },
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
            placeholder={`Search ${activeModule} categories (e.g. House, Car, Driver, AC Repair)...`}
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

        {/* SEARCH RESULTS MODE */}
        {searchQuery.trim() ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs min-h-[360px] flex flex-col space-y-2">
            <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Search Results for &quot;{searchQuery}&quot;
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {searchResults.length} found
              </span>
            </div>

            {isSearching ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin text-[#1464F4] mx-auto" />
                <p className="text-xs font-medium">Searching categories...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-1.5 overflow-y-auto max-h-[420px] pr-1">
                {searchResults.map((res) => {
                  const isSelected = selectedMainCat?.id === res.mainCategory?.id &&
                    (!res.subCategory || selectedSubCat?.id === res.subCategory.id) &&
                    (!res.thirdLevel || selectedThirdLevel?.id === res.thirdLevel.id);

                  return (
                    <button
                      key={res.category.id}
                      type="button"
                      onClick={() => handleSelectSearchResult(res)}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#1464F4] bg-blue-50/80 font-bold shadow-xs'
                          : 'border-slate-100 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <span className="shrink-0">{renderIcon(res.category.icon_key)}</span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{res.category.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{res.pathString}</p>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#1464F4] shrink-0 stroke-[2.5]" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs font-medium">
                No categories matching &quot;{searchQuery}&quot;. Try a different keyword.
              </div>
            )}
          </div>
        ) : loading ? (
          <div className="py-20 text-center text-slate-400 space-y-2">
            <RefreshCw className="w-8 h-8 animate-spin text-[#1464F4] mx-auto" />
            <p className="text-xs font-medium">Loading {activeModule} categories...</p>
          </div>
        ) : (
          /* CASCADING HIERARCHY (3-COLUMN DESKTOP / DRILLDOWN MOBILE) */
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
                  {l1Categories.length} available
                </span>
              </div>

              <div className="space-y-1 overflow-y-auto max-h-[380px] no-scrollbar flex-1 pr-1">
                {/* Neutral "All Categories" Option */}
                <button
                  type="button"
                  onClick={() => handleSelectMainCategory(null)}
                  className={`w-full p-2.5 rounded-xl text-left font-bold text-xs flex items-center justify-between transition-all cursor-pointer mb-1.5 ${
                    !selectedMainCat
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Globe className="w-4 h-4 shrink-0 text-amber-400" />
                    <span className="truncate">All Categories</span>
                  </div>
                  {!selectedMainCat && <Check className="w-4 h-4 text-white stroke-[2.5] shrink-0" />}
                </button>

                {l1Categories.map((cat) => {
                  const isSelected = selectedMainCat?.id === cat.id;
                  const hasChildren = categories.some((c) => c.parent_id === cat.id);

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
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="shrink-0">{renderIcon(cat.icon_key)}</span>
                        <span className="truncate">{cat.name}</span>
                      </div>
                      {hasChildren ? (
                        <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                      ) : isSelected ? (
                        <Check className="w-4 h-4 text-white stroke-[2.5] shrink-0" />
                      ) : null}
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

              <div className="space-y-1 overflow-y-auto max-h-[380px] no-scrollbar flex-1 pr-1">
                {!selectedMainCat ? (
                  <div className="p-6 text-center text-slate-400 text-xs font-semibold">
                    Select a main category to view subcategories.
                  </div>
                ) : l2Categories.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs font-semibold">
                    No subcategories available for <strong>{selectedMainCat.name}</strong>.
                  </div>
                ) : (
                  l2Categories.map((sub) => {
                    const isSelected = selectedSubCat?.id === sub.id;
                    const hasChildren = categories.some((c) => c.parent_id === sub.id);

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
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="shrink-0">{renderIcon(sub.icon_key)}</span>
                          <span className="truncate">{sub.name}</span>
                        </div>
                        {hasChildren ? (
                          <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                        ) : isSelected ? (
                          <Check className="w-4 h-4 text-white stroke-[2.5] shrink-0" />
                        ) : null}
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

              <div className="space-y-1 overflow-y-auto max-h-[380px] no-scrollbar flex-1 pr-1">
                {!selectedSubCat ? (
                  <div className="p-6 text-center text-slate-400 text-xs font-semibold">
                    Select a subcategory to view level 3 options.
                  </div>
                ) : l3Categories.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs font-semibold">
                    No additional level 3 options for <strong>{selectedSubCat.name}</strong>. You can proceed directly.
                  </div>
                ) : (
                  l3Categories.map((third) => {
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
        )}
      </main>

      {/* STICKY BOTTOM APPLY FOOTER */}
      <footer className="fixed bottom-16 lg:bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3 sm:p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="max-w-5xl lg:max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0 w-full sm:w-auto">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs"
              style={{ backgroundColor: primaryColor }}
            >
              <Check className="w-4 h-4 stroke-[3]" />
            </div>

            <div className="min-w-0 flex-1">
              <span 
                className="text-[10px] font-black tracking-wider uppercase block truncate"
                style={{ color: primaryColor }}
              >
                SELECTED CATEGORY
              </span>
              <p className="text-xs sm:text-sm font-black text-slate-900 truncate">
                {formattedPath}
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
              className="flex-1 sm:flex-initial py-3 px-6 rounded-xl text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg active:scale-[0.99] transition-all cursor-pointer"
              style={{ 
                backgroundColor: primaryColor,
                boxShadow: `0 8px 20px -4px ${primaryColor}40`
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
