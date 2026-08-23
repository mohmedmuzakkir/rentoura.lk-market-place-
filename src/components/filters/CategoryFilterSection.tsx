import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, RefreshCw, AlertCircle } from 'lucide-react';
import { CategoryFilterData } from '../../types/filterTypes';
import { ModuleType } from '../../data/categorySelectorData';
import { CategoryService, CategoryRecord, CategoryModule } from '../../services/categoryService';

interface CategoryFilterSectionProps {
  module: ModuleType;
  category: CategoryFilterData;
  onChange: (category: CategoryFilterData) => void;
  primaryColor: string;
}

export const CategoryFilterSection: React.FC<CategoryFilterSectionProps> = ({
  module,
  category,
  onChange,
  primaryColor
}) => {
  const [categoriesTree, setCategoriesTree] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dbModule: CategoryModule = module === 'rentals' ? 'rental' : module === 'jobs' ? 'job' : 'service';

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
    }
    setLoading(false);
  }, [dbModule]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Find active main category
  const activeMainCat = categoriesTree.find(
    (c) => c.name === category.mainCatName || c.id === category.mainCatId
  );

  // Available subcategories
  const availableSubcategories = activeMainCat?.children || [];

  // Find active subcategory
  const activeSubCat = availableSubcategories.find(
    (s) => s.name === category.subCatName || s.id === category.subCatId
  );

  // Available third level options
  const availableThirdLevel = activeSubCat?.children || [];

  // Handlers
  const handleMainCatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mainName = e.target.value;
    if (!mainName) {
      onChange({});
      return;
    }
    const foundMain = categoriesTree.find((c) => c.name === mainName);
    onChange({
      mainCatId: foundMain?.id,
      mainCatName: foundMain?.name,
      subCatId: undefined,
      subCatName: undefined,
      thirdLevelId: undefined,
      thirdLevelName: undefined,
      fullPath: foundMain?.name,
    });
  };

  const handleSubCatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subName = e.target.value;
    if (!subName) {
      onChange({
        ...category,
        subCatId: undefined,
        subCatName: undefined,
        thirdLevelId: undefined,
        thirdLevelName: undefined,
        fullPath: category.mainCatName,
      });
      return;
    }
    const foundSub = availableSubcategories.find((s) => s.name === subName);
    onChange({
      ...category,
      subCatId: foundSub?.id,
      subCatName: foundSub?.name,
      thirdLevelId: undefined,
      thirdLevelName: undefined,
      fullPath: `${category.mainCatName || ''} › ${foundSub?.name || ''}`,
    });
  };

  const handleThirdLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const thirdName = e.target.value;
    if (!thirdName) {
      onChange({
        ...category,
        thirdLevelId: undefined,
        thirdLevelName: undefined,
        fullPath: `${category.mainCatName || ''} › ${category.subCatName || ''}`,
      });
      return;
    }
    const foundThird = availableThirdLevel.find((t) => t.name === thirdName);
    onChange({
      ...category,
      thirdLevelId: foundThird?.id,
      thirdLevelName: foundThird?.name,
      fullPath: `${category.mainCatName || ''} › ${category.subCatName || ''} › ${foundThird?.name || ''}`,
    });
  };

  if (loading) {
    return <div className="text-xs text-slate-400 py-2">Loading categories...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center space-y-1 text-xs">
        <div className="text-red-700 font-semibold flex items-center justify-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> Unable to load categories.
        </div>
        <button
          type="button"
          onClick={() => loadCategories(true)}
          className="px-2 py-1 bg-red-600 text-white rounded text-[11px] font-bold inline-flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" /> Retry
        </button>
      </div>
    );
  }

  if (categoriesTree.length === 0) {
    return <div className="text-xs text-slate-400 py-2">No categories available.</div>;
  }

  return (
    <div className="space-y-3.5">
      {/* 1. Main Category */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          Main Category
        </label>
        <div className="relative">
          <select
            value={category.mainCatName || ''}
            onChange={handleMainCatChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-semibold focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categoriesTree.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* 2. Sub Category */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          Sub Category
        </label>
        <div className="relative">
          <select
            value={category.subCatName || ''}
            onChange={handleSubCatChange}
            disabled={!category.mainCatName && availableSubcategories.length === 0}
            className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-semibold focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer ${
              !category.mainCatName ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            <option value="">All Sub Categories in {category.mainCatName || 'Main Category'}</option>
            {availableSubcategories.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* 3. Type / Specific Option (Level 3 - Optional) */}
      {availableThirdLevel.length > 0 && (
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Type / Specific Option (Optional)
          </label>
          <div className="relative">
            <select
              value={category.thirdLevelName || ''}
              onChange={handleThirdLevelChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-semibold focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
            >
              <option value="">All Specific Types</option>
              {availableThirdLevel.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      )}
    </div>
  );
};
