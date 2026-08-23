import React, { useState, useEffect, useCallback } from 'react';
import { CategoryService, CategoryRecord, CategoryModule } from '../../services/categoryService';
import { Check, ChevronRight, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { CategoryIcon } from '../CategoryIcon';

interface CategorySelectorStepProps {
  module: 'rentals' | 'jobs' | 'services';
  selectedCategoryId: string;
  selectedSubcategoryId: string;
  selectedThirdLevelId?: string;
  onSelectCategory: (data: {
    categoryId: string;
    categoryName: string;
    subcategoryId: string;
    subcategoryName: string;
    thirdLevelId?: string;
    thirdLevelName?: string;
    categoryPath: string;
  }) => void;
  accentColor?: string;
}

export const CategorySelectorStep: React.FC<CategorySelectorStepProps> = ({
  module,
  selectedCategoryId,
  selectedSubcategoryId,
  selectedThirdLevelId,
  onSelectCategory,
  accentColor = '#1464F4'
}) => {
  const [categoriesTree, setCategoriesTree] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const dbModule: CategoryModule = module === 'rentals' ? 'rental' : module === 'jobs' ? 'job' : 'service';

  const [activeMainCatId, setActiveMainCatId] = useState<string>(selectedCategoryId || '');
  const [activeSubCatId, setActiveSubCatId] = useState<string>(selectedSubcategoryId || '');

  const loadCategories = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    const res = await CategoryService.getCategories(dbModule, { forceRefresh });
    if (!res.success) {
      setError(res.error || 'Unable to load categories.');
      setCategoriesTree([]);
    } else {
      const tree = CategoryService.buildTree(res.data);
      setCategoriesTree(tree);
      if (tree.length > 0 && !activeMainCatId) {
        setActiveMainCatId(tree[0].id);
      }
    }
    setLoading(false);
  }, [dbModule, activeMainCatId]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const activeMainCat = categoriesTree.find((c) => c.id === activeMainCatId);

  // Filter main categories by search query
  const filteredCategories = searchQuery.trim()
    ? categoriesTree.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (c.children && c.children.some((sub) => sub.name.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : categoriesTree;

  const handleSelectSubCategory = (sub: CategoryRecord, third?: CategoryRecord) => {
    if (!activeMainCat) return;

    let path = `${activeMainCat.name} › ${sub.name}`;
    if (third) {
      path += ` › ${third.name}`;
    }

    onSelectCategory({
      categoryId: activeMainCat.id,
      categoryName: activeMainCat.name,
      subcategoryId: sub.id,
      subcategoryName: sub.name,
      thirdLevelId: third?.id,
      thirdLevelName: third?.name,
      categoryPath: path,
    });
  };

  return (
    <div className="space-y-4 text-left">
      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${module} categories (e.g. Cars, Houses, Developers)...`}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
        />
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 text-center space-y-2">
          <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading categories...</p>
        </div>
      )}

      {/* Error State with Retry */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-red-700 font-semibold text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Unable to load categories.</span>
          </div>
          <button
            type="button"
            onClick={() => loadCategories(true)}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Real Empty State */}
      {!loading && !error && categoriesTree.length === 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-500 font-medium">
          No {dbModule} categories are available yet.
        </div>
      )}

      {/* Main & Subcategory 2-Column Split */}
      {!loading && !error && categoriesTree.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 min-h-[380px]">
          {/* Left: Main Categories */}
          <div className="md:col-span-5 bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-xs space-y-1 overflow-y-auto max-h-[420px]">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 px-2 py-1 block">
              1. Select Primary Category
            </span>
            {filteredCategories.map((cat) => {
              const isSelected = activeMainCatId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveMainCatId(cat.id);
                    setActiveSubCatId('');
                  }}
                  className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all tap-bounce cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/80 border border-blue-200 text-slate-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 border border-transparent font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CategoryIcon 
                      iconKey={cat.icon_key} 
                      slug={cat.slug} 
                      name={cat.name} 
                      module={cat.module} 
                      className="w-4 h-4 text-[#1464F4] flex-shrink-0" 
                    />
                    <span className="text-xs truncate">{cat.name}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-[#1464F4]' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Right: Subcategories & Options */}
          <div className="md:col-span-7 bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs space-y-3 overflow-y-auto max-h-[420px]">
            <div className="border-b border-slate-100 pb-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                2. Select Specific Subcategory
              </span>
              <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                {activeMainCat ? activeMainCat.name : 'Choose a category'}
              </h4>
            </div>

            {activeMainCat && activeMainCat.children && activeMainCat.children.length > 0 ? (
              <div className="space-y-1.5">
                {activeMainCat.children.map((sub) => {
                  const isSelectedSub = selectedSubcategoryId === sub.id;
                  const hasThirdLevel = sub.children && sub.children.length > 0;

                  return (
                    <div key={sub.id} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSubCatId(sub.id);
                          if (!hasThirdLevel) {
                            handleSelectSubCategory(sub);
                          }
                        }}
                        className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all tap-bounce cursor-pointer ${
                          isSelectedSub
                            ? 'bg-emerald-50/80 border border-emerald-300 text-emerald-900 font-bold'
                            : 'bg-slate-50/70 hover:bg-slate-100 border border-slate-200/60 text-slate-700 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <CategoryIcon 
                            iconKey={sub.icon_key} 
                            slug={sub.slug} 
                            name={sub.name} 
                            module={sub.module}
                            parentIconKey={activeMainCat?.icon_key}
                            parentSlug={activeMainCat?.slug}
                            parentName={activeMainCat?.name}
                            className="w-3.5 h-3.5 text-slate-500 shrink-0" 
                          />
                          <div>
                            <p className="text-xs">{sub.name}</p>
                            {sub.description && (
                              <p className="text-[10px] text-slate-400 font-normal truncate">{sub.description}</p>
                            )}
                          </div>
                        </div>
                        {isSelectedSub ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </button>

                      {/* Third level options if expanded */}
                      {hasThirdLevel && activeSubCatId === sub.id && (
                        <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-slate-200 ml-2 animate-in fade-in duration-150">
                          {sub.children?.map((third) => {
                            const isSelectedThird = selectedThirdLevelId === third.id;
                            return (
                              <button
                                key={third.id}
                                type="button"
                                onClick={() => handleSelectSubCategory(sub, third)}
                                className={`w-full py-1.5 px-2.5 rounded-lg flex items-center justify-between text-left text-xs transition-all cursor-pointer ${
                                  isSelectedThird
                                    ? 'bg-blue-100/70 font-bold text-blue-900'
                                    : 'text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                <span>{third.name}</span>
                                {isSelectedThird && <Check className="w-3 h-3 text-blue-600 stroke-[3]" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-8 text-center">
                {activeMainCat ? 'No subcategories available under this category.' : 'Please choose a main category from the left list.'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
