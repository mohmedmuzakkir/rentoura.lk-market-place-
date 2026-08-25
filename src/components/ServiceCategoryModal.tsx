import React, { useState, useEffect } from 'react';
import { X, Search, ChevronRight, ChevronLeft, Wrench, CheckCircle2, RefreshCw, Sparkles } from 'lucide-react';
import { CategoryService, CategoryRecord } from '../services/categoryService';
import { getCategoryIconComponent } from './CategoryIcon';

interface ServiceCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  selectedCategoryId?: string;
  onSelectCategory: (categoryName: string, categoryId?: string, categorySlug?: string) => void;
}

export const ServiceCategoryModal: React.FC<ServiceCategoryModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  selectedCategoryId,
  onSelectCategory
}) => {
  const [allCategories, setAllCategories] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Drilldown states
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3>(1);
  const [selectedL1, setSelectedL1] = useState<CategoryRecord | null>(null);
  const [selectedL2, setSelectedL2] = useState<CategoryRecord | null>(null);

  // Draft selection
  const [draftName, setDraftName] = useState(selectedCategory || 'All Categories');
  const [draftId, setDraftId] = useState<string | undefined>(selectedCategoryId);
  const [draftSlug, setDraftSlug] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!isOpen) return;

    setDraftName(selectedCategory || 'All Categories');
    setDraftId(selectedCategoryId);
    setSearchTerm('');
    setActiveLevel(1);
    setSelectedL1(null);
    setSelectedL2(null);

    let isMounted = true;
    setLoading(true);

    CategoryService.getCategories('service').then((res) => {
      if (!isMounted) return;
      if (res.success && res.data) {
        setAllCategories(res.data);
      }
      setLoading(false);
    }).catch(() => {
      if (!isMounted) return;
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedCategory, selectedCategoryId]);

  if (!isOpen) return null;

  const handleApply = () => {
    onSelectCategory(draftName, draftId, draftSlug);
    onClose();
  };

  const handleSelectAllCategories = () => {
    setDraftName('All Categories');
    setDraftId(undefined);
    setDraftSlug(undefined);
    onSelectCategory('All Categories', undefined, undefined);
    onClose();
  };

  const getIcon = (iconKey: string | null) => {
    return getCategoryIconComponent({ iconKey, module: 'service', className: 'w-5 h-5 text-[#FF650A]' });
  };

  // Category filtering & drilldown helpers
  const l1Categories = allCategories.filter((c) => c.level === 1 || !c.parent_id);
  const l2Categories = selectedL1 ? allCategories.filter((c) => c.parent_id === selectedL1.id) : [];
  const l3Categories = selectedL2 ? allCategories.filter((c) => c.parent_id === selectedL2.id) : [];

  // Search filter across all levels
  const searchResults = searchTerm.trim()
    ? allCategories.filter((c) => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase().trim()))
      )
    : [];

  const getCategoryPathString = (cat: CategoryRecord): string => {
    const parts: string[] = [cat.name];
    let curr: CategoryRecord | undefined = cat;
    const catMap = new Map<string, CategoryRecord>(allCategories.map((c) => [c.id, c]));
    while (curr?.parent_id) {
      const parent = catMap.get(curr.parent_id);
      if (parent) {
        parts.unshift(parent.name);
        curr = parent;
      } else {
        break;
      }
    }
    return parts.join(' › ');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh] sm:max-h-[82vh] animate-in slide-in-from-bottom duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-[#1C0F02] to-[#3D1F08] text-white flex items-center justify-between border-b border-orange-900 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            {activeLevel > 1 && !searchTerm ? (
              <button
                onClick={() => {
                  if (activeLevel === 3) {
                    setActiveLevel(2);
                  } else if (activeLevel === 2) {
                    setActiveLevel(1);
                    setSelectedL1(null);
                  }
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer shrink-0"
                aria-label="Back"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-[#FF650A] text-white flex items-center justify-center shadow-sm shrink-0">
                <Wrench className="w-4 h-4 stroke-[2.5]" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold font-heading truncate">
                {activeLevel === 1 || searchTerm ? 'Service Categories' : activeLevel === 2 ? selectedL1?.name : selectedL2?.name}
              </h3>
              <p className="text-[10.5px] text-orange-200 truncate">
                {searchTerm
                  ? 'Search results across taxonomy'
                  : activeLevel === 1
                  ? 'Level 1: Main Sector'
                  : activeLevel === 2
                  ? `Level 2: Service Groups of ${selectedL1?.name}`
                  : `Level 3: Specific Services for ${selectedL2?.name}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors tap-bounce cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Breadcrumb Indicator */}
        {!searchTerm && (selectedL1 || selectedL2) && (
          <div className="px-5 py-2 bg-slate-50 border-b border-slate-200 text-xs flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <button
              onClick={() => {
                setActiveLevel(1);
                setSelectedL1(null);
                setSelectedL2(null);
              }}
              className="text-[#FF650A] font-bold hover:underline shrink-0"
            >
              All
            </button>
            {selectedL1 && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                <button
                  onClick={() => {
                    setActiveLevel(2);
                    setSelectedL2(null);
                  }}
                  className={`shrink-0 font-semibold ${activeLevel === 2 ? 'text-slate-900 font-bold' : 'text-[#FF650A] hover:underline'}`}
                >
                  {selectedL1.name}
                </button>
              </>
            )}
            {selectedL2 && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="font-bold text-slate-900 shrink-0">{selectedL2.name}</span>
              </>
            )}
          </div>
        )}

        {/* Search Bar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search services (e.g. AC Repair, Plumbing, Electrician, Cleaning)..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF650A] focus:ring-1 focus:ring-[#FF650A] transition-colors font-medium text-slate-800"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category List Scroll Area */}
        <div className="p-3 overflow-y-auto flex-1 space-y-1.5 min-h-[220px]">
          {loading ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin text-[#FF650A] mx-auto" />
              <p className="text-xs font-medium">Loading service categories...</p>
            </div>
          ) : searchTerm.trim() ? (
            /* SEARCH RESULTS MODE */
            searchResults.length > 0 ? (
              searchResults.map((cat) => {
                const pathStr = getCategoryPathString(cat);
                const isSelected = draftId === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setDraftName(cat.name);
                      setDraftId(cat.id);
                      setDraftSlug(cat.slug);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#FF650A] bg-orange-50/80 text-[#FF650A] font-bold shadow-xs'
                        : 'border-slate-100 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <span className="shrink-0">{getIcon(cat.icon_key)}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{cat.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{pathStr}</p>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#FF650A] shrink-0 stroke-[2.5]" />}
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                No service categories matching &quot;{searchTerm}&quot;.
              </div>
            )
          ) : (
            /* PROGRESSIVE DRILLDOWN MODE */
            <>
              {activeLevel === 1 && (
                <button
                  onClick={handleSelectAllCategories}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between text-xs transition-all cursor-pointer mb-2 ${
                    draftName === 'All Categories' && !draftId
                      ? 'border-[#FF650A] bg-orange-50/90 text-[#FF650A] font-bold shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#FF650A]" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">All Service Categories</p>
                      <p className="text-[10px] text-slate-500">Show all available service listings</p>
                    </div>
                  </div>
                  {draftName === 'All Categories' && !draftId && (
                    <CheckCircle2 className="w-4 h-4 text-[#FF650A] shrink-0 stroke-[2.5]" />
                  )}
                </button>
              )}

              {activeLevel === 1 &&
                l1Categories.map((cat) => {
                  const hasChildren = allCategories.some((c) => c.parent_id === cat.id);
                  const isSelected = draftId === cat.id;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setDraftName(cat.name);
                        setDraftId(cat.id);
                        setDraftSlug(cat.slug);
                        if (hasChildren) {
                          setSelectedL1(cat);
                          setActiveLevel(2);
                        }
                      }}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#FF650A] bg-orange-50/80 text-[#FF650A] font-bold shadow-xs'
                          : 'border-slate-100 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <span className="shrink-0">{getIcon(cat.icon_key)}</span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{cat.name}</p>
                          {cat.description && (
                            <p className="text-[10px] text-slate-500 line-clamp-1">{cat.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#FF650A] stroke-[2.5]" />}
                        {hasChildren && <ChevronRight className="w-4 h-4 text-slate-400 stroke-[2]" />}
                      </div>
                    </button>
                  );
                })}

              {activeLevel === 2 &&
                l2Categories.map((cat) => {
                  const hasChildren = allCategories.some((c) => c.parent_id === cat.id);
                  const isSelected = draftId === cat.id;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setDraftName(cat.name);
                        setDraftId(cat.id);
                        setDraftSlug(cat.slug);
                        if (hasChildren) {
                          setSelectedL2(cat);
                          setActiveLevel(3);
                        }
                      }}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#FF650A] bg-orange-50/80 text-[#FF650A] font-bold shadow-xs'
                          : 'border-slate-100 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <span className="shrink-0">{getIcon(cat.icon_key)}</span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{cat.name}</p>
                          {cat.description && (
                            <p className="text-[10px] text-slate-500 line-clamp-1">{cat.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#FF650A] stroke-[2.5]" />}
                        {hasChildren && <ChevronRight className="w-4 h-4 text-slate-400 stroke-[2]" />}
                      </div>
                    </button>
                  );
                })}

              {activeLevel === 3 &&
                l3Categories.map((cat) => {
                  const isSelected = draftId === cat.id;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setDraftName(cat.name);
                        setDraftId(cat.id);
                        setDraftSlug(cat.slug);
                      }}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#FF650A] bg-orange-50/80 text-[#FF650A] font-bold shadow-xs'
                          : 'border-slate-100 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <span className="shrink-0">{getIcon(cat.icon_key)}</span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{cat.name}</p>
                          {cat.description && (
                            <p className="text-[10px] text-slate-500 line-clamp-1">{cat.description}</p>
                          )}
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#FF650A] shrink-0 stroke-[2.5]" />}
                    </button>
                  );
                })}
            </>
          )}
        </div>

        {/* Sticky Footer */}
        <div className="p-3.5 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg shrink-0">
          <div className="min-w-0 flex-1 w-full sm:w-auto">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-0.5">
              SELECTED CATEGORY
            </span>
            <p className="text-xs sm:text-sm font-black text-slate-900 truncate">
              {draftName}
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
              className="flex-1 sm:flex-none py-2.5 px-5 rounded-xl text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer bg-[#FF650A] hover:bg-[#E05500] active:scale-[0.99]"
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
