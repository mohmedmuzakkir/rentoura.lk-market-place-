import React, { useEffect, useState, useCallback } from 'react';
import { 
  ChevronRight, 
  RefreshCw, 
  AlertCircle
} from 'lucide-react';
import { AppRoute } from '../types';
import { CategoryService, CategoryRecord, FrontendModule } from '../services/categoryService';
import { CategoryIcon } from './CategoryIcon';

interface BrowseCategoriesProps {
  onSelectCategory?: (categoryName: string) => void;
  onNavigate: (route: AppRoute) => void;
  activeModule?: FrontendModule | string;
}

export const BrowseCategories: React.FC<BrowseCategoriesProps> = ({
  onSelectCategory,
  onNavigate,
  activeModule = 'rental'
}) => {
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async (forceRefresh: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await CategoryService.getMainCategories(activeModule, forceRefresh);
      if (!res.success) {
        setError(res.error || 'Unable to load categories.');
        setCategories([]);
      } else {
        setCategories(Array.isArray(res.data) ? res.data : []);
      }
    } catch {
      setError('Unable to load categories.');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [activeModule]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return (
    <section className="mt-8 max-w-md lg:max-w-7xl mx-auto px-4 lg:px-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[17px] lg:text-xl font-bold text-slate-900 font-heading tracking-tight">
            Browse by Category
          </h2>
          <p className="hidden lg:block text-xs text-slate-500 font-medium mt-0.5">
            Explore Sri Lanka's top rental and service classifications
          </p>
        </div>
        <button
          onClick={() => onNavigate('/select-category')}
          className="text-[12.5px] lg:text-sm font-bold text-[#1464F4] hover:text-[#0c4cc2] flex items-center gap-0.5 tap-bounce cursor-pointer"
        >
          View All <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>

      {/* Loading Skeleton State */}
      {loading && (
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3.5 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-slate-200/80 rounded-2xl h-24 p-3 flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-slate-300" />
              <div className="w-12 h-3 rounded bg-slate-300" />
            </div>
          ))}
        </div>
      )}

      {/* Error State with Retry */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center space-y-2 my-2">
          <div className="flex items-center justify-center gap-2 text-red-700 font-semibold text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Unable to load categories</span>
          </div>
          <button
            onClick={() => loadCategories(true)}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Real Empty State */}
      {!loading && !error && categories.length === 0 && (
        <div className="bg-slate-100/80 border border-slate-200 rounded-2xl p-6 text-center text-slate-500 text-xs font-medium">
          No categories available
        </div>
      )}

      {/* Categories Grid */}
      {!loading && !error && categories.length > 0 && (
        <div className="flex lg:grid lg:grid-cols-6 items-start gap-3.5 lg:gap-4 overflow-x-auto lg:overflow-visible pb-2 no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                if (onSelectCategory) onSelectCategory(cat.name);
                else onNavigate('/select-category');
              }}
              className="flex flex-col lg:flex-row lg:items-center items-center shrink-0 w-[72px] lg:w-full group text-center lg:text-left tap-bounce focus:outline-none lg:bg-white lg:p-3 lg:rounded-2xl lg:border lg:border-slate-200/70 lg:hover:shadow-md transition-all cursor-pointer"
            >
              {/* Icon Box */}
              <div className="w-12 h-12 lg:w-10 lg:h-10 rounded-2xl lg:rounded-xl bg-blue-50/80 flex items-center justify-center border border-blue-100/80 group-hover:scale-105 group-active:scale-95 transition-all duration-200 shrink-0">
                <CategoryIcon 
                  iconKey={cat.icon_key} 
                  slug={cat.slug} 
                  name={cat.name} 
                  module={cat.module}
                  className="w-5 h-5 text-[#1464F4]" 
                />
              </div>

              {/* Label */}
              <span className="text-[11px] lg:text-xs font-semibold text-slate-700 group-hover:text-slate-900 mt-2 lg:mt-0 lg:ml-3 leading-tight tracking-tight line-clamp-2">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
};
