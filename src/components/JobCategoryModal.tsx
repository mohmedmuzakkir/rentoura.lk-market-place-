import React, { useState, useEffect } from 'react';
import { X, Search, Briefcase, Check, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { CategoryService } from '../services/categoryService';
import { JOBS_CATEGORIES } from '../data/categories/jobsData';
import { getCategoryIconComponent } from './CategoryIcon';

interface JobCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
}

export const JobCategoryModal: React.FC<JobCategoryModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string; iconKey?: string; description?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [draftCategory, setDraftCategory] = useState(selectedCategory || 'All Categories');

  useEffect(() => {
    if (!isOpen) return;
    setDraftCategory(selectedCategory || 'All Categories');

    let isMounted = true;
    setLoading(true);

    CategoryService.getMainCategories('job').then(res => {
      if (!isMounted) return;
      if (res.success && res.data && res.data.length > 0) {
        setCategories(res.data.map(c => ({
          id: c.id,
          name: c.name,
          iconKey: c.icon_key || undefined,
          description: c.description || undefined
        })));
      } else {
        // Fallback to local job categories
        setCategories(JOBS_CATEGORIES.map(c => ({
          id: c.id,
          name: c.name,
          iconKey: c.icon,
          description: c.description || `Positions in ${c.name}`
        })));
      }
      setLoading(false);
    }).catch(() => {
      if (!isMounted) return;
      setCategories(JOBS_CATEGORIES.map(c => ({
        id: c.id,
        name: c.name,
        iconKey: c.icon,
        description: c.description || `Positions in ${c.name}`
      })));
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedCategory]);

  if (!isOpen) return null;

  const handleApply = () => {
    onSelectCategory(draftCategory);
    onClose();
  };

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[80vh] animate-in slide-in-from-bottom duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#021A12] to-[#0A3D29] text-white flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#08A34F] text-white flex items-center justify-center shadow-sm">
              <Briefcase className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading">Job Categories</h3>
              <p className="text-[11px] text-emerald-200">Select an approved job sector</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors tap-bounce"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search job categories (e.g. IT, Accounting)..."
              className="w-full pl-10 pr-4 py-2 bg-white text-xs text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-[#08A34F] focus:ring-1 focus:ring-[#08A34F] transition-all font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2 no-scrollbar">
          {/* All Categories Option */}
          <button
            onClick={() => setDraftCategory('All Categories')}
            className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all tap-bounce cursor-pointer ${
              draftCategory === 'All Categories'
                ? 'bg-emerald-50/80 border-[#08A34F] text-[#08A34F] font-bold shadow-xs'
                : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                draftCategory === 'All Categories' ? 'bg-[#08A34F] text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold block">All Job Categories</span>
                <span className="text-[10px] text-slate-500 font-medium">Show opportunities across all sectors</span>
              </div>
            </div>
            {draftCategory === 'All Categories' && (
              <div className="w-5 h-5 rounded-full bg-[#08A34F] text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
          </button>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400 font-medium space-y-2">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#08A34F]" />
              <p>Loading job categories...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 font-medium">
              No job categories match &quot;{searchTerm}&quot;.
            </div>
          ) : (
            filteredCategories.map((cat) => {
              const isSelected = draftCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.id}
                  onClick={() => setDraftCategory(cat.name)}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all tap-bounce cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/80 border-[#08A34F] text-[#08A34F] font-bold shadow-xs'
                      : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#08A34F] text-white' : 'bg-emerald-50 text-[#08A34F]'
                    }`}>
                      {getCategoryIconComponent({ iconKey: cat.iconKey, module: 'job', className: 'w-4 h-4' })}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold block truncate">{cat.name}</span>
                      {cat.description && (
                        <span className="text-[10px] text-slate-500 font-medium block truncate">{cat.description}</span>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#08A34F] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Modal Sticky Footer with Apply Category */}
        <div className="p-3.5 border-t border-slate-200/90 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg shrink-0">
          <div className="min-w-0 flex-1 w-full sm:w-auto">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-0.5">
              SELECTED CATEGORY
            </span>
            <p className="text-xs sm:text-sm font-black text-slate-900 truncate">
              {draftCategory}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer shrink-0"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 sm:flex-none py-2.5 px-5 rounded-xl text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer bg-[#08A34F] hover:bg-[#068640] active:scale-[0.99]"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span className="truncate">Apply Category</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
