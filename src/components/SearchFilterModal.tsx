import React, { useState, useEffect } from 'react';
import { X, Filter, MapPin, Tag, Sliders, Check, RotateCcw } from 'lucide-react';
import { CategoryRecord, CategoryService } from '../services/categoryService';

interface SearchFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule: 'all' | 'rentals' | 'jobs' | 'services';
  selectedModule: 'all' | 'rentals' | 'jobs' | 'services';
  onSelectModule: (mod: 'all' | 'rentals' | 'jobs' | 'services') => void;
  selectedCategoryId: string | null;
  selectedCategoryName?: string;
  onSelectCategory: (catId: string | null, catName?: string) => void;
  selectedLocationName?: string;
  minPrice: number | null;
  maxPrice: number | null;
  onPriceChange: (min: number | null, max: number | null) => void;
  onApply: () => void;
  onReset: () => void;
  onOpenLocationSelector: () => void;
  onOpenCategorySelector: () => void;
}

export const SearchFilterModal: React.FC<SearchFilterModalProps> = ({
  isOpen,
  onClose,
  activeModule,
  selectedModule,
  onSelectModule,
  selectedCategoryId,
  selectedCategoryName,
  onSelectCategory,
  selectedLocationName,
  minPrice,
  maxPrice,
  onPriceChange,
  onApply,
  onReset,
  onOpenLocationSelector,
  onOpenCategorySelector,
}) => {
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [tempMin, setTempMin] = useState<string>(minPrice ? String(minPrice) : '');
  const [tempMax, setTempMax] = useState<string>(maxPrice ? String(maxPrice) : '');

  useEffect(() => {
    setTempMin(minPrice ? String(minPrice) : '');
    setTempMax(maxPrice ? String(maxPrice) : '');
  }, [minPrice, maxPrice]);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setLoadingCategories(true);

    const modInput = selectedModule === 'all' ? undefined : selectedModule;
    CategoryService.getCategories(modInput).then((res) => {
      if (isMounted) {
        if (res.success && res.data) {
          setCategories(res.data);
        } else {
          setCategories([]);
        }
        setLoadingCategories(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedModule]);

  if (!isOpen) return null;

  const handleApplyClick = () => {
    const minVal = tempMin.trim() ? Math.max(0, parseInt(tempMin.replace(/[^0-9]/g, ''), 10) || 0) : null;
    const maxVal = tempMax.trim() ? Math.max(0, parseInt(tempMax.replace(/[^0-9]/g, ''), 10) || 0) : null;
    onPriceChange(minVal, maxVal);
    onApply();
    onClose();
  };

  const handleResetClick = () => {
    setTempMin('');
    setTempMax('');
    onReset();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#1464F4]" />
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Search Filters
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center cursor-pointer tap-bounce"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Module Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Marketplace Module
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'all', label: 'All' },
                { id: 'rentals', label: 'Rentals' },
                { id: 'jobs', label: 'Jobs' },
                { id: 'services', label: 'Services' },
              ].map((m) => {
                const isSelected = selectedModule === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onSelectModule(m.id as any)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-colors text-center ${
                      isSelected
                        ? 'border-[#1464F4] bg-blue-50 text-[#1464F4]'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Location
              </label>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLocationSelector();
                }}
                className="text-xs text-[#1464F4] font-semibold hover:underline"
              >
                Change Location
              </button>
            </div>
            <div
              onClick={() => {
                onClose();
                onOpenLocationSelector();
              }}
              className="p-3 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 cursor-pointer flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="text-xs font-medium text-slate-800">
                  {selectedLocationName || 'All Sri Lanka'}
                </span>
              </div>
              <span className="text-[11px] text-[#1464F4] font-bold">Select</span>
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Category
              </label>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCategorySelector();
                }}
                className="text-xs text-[#1464F4] font-semibold hover:underline"
              >
                Browse All Categories
              </button>
            </div>

            {selectedCategoryName ? (
              <div className="p-3 rounded-2xl border border-blue-200 bg-blue-50/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#1464F4] shrink-0" />
                  <span className="text-xs font-bold text-[#1464F4]">
                    {selectedCategoryName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectCategory(null, undefined)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {loadingCategories ? (
                  <div className="text-xs text-slate-400 p-2">Loading categories...</div>
                ) : categories.length === 0 ? (
                  <div className="text-xs text-slate-400 p-2">No category selected</div>
                ) : (
                  categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => onSelectCategory(cat.id, cat.name)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs font-medium transition-colors ${
                        selectedCategoryId === cat.id
                          ? 'border-[#1464F4] bg-blue-50 text-[#1464F4] font-bold'
                          : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {selectedCategoryId === cat.id && (
                        <Check className="w-3.5 h-3.5 text-[#1464F4]" />
                      )}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Price Range (Rs.)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-slate-500 mb-1 block font-medium">
                  Min Price
                </span>
                <input
                  type="number"
                  placeholder="0"
                  value={tempMin}
                  onChange={(e) => setTempMin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#1464F4]"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 mb-1 block font-medium">
                  Max Price
                </span>
                <input
                  type="number"
                  placeholder="Any"
                  value={tempMax}
                  onChange={(e) => setTempMax(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#1464F4]"
                />
              </div>
            </div>
            {/* Quick Price Preset Chips */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {[
                { label: 'Under 10k', min: 0, max: 10000 },
                { label: '10k - 50k', min: 10000, max: 50000 },
                { label: '50k - 200k', min: 50000, max: 200000 },
                { label: '200k+', min: 200000, max: null },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setTempMin(String(p.min));
                    setTempMax(p.max ? String(p.max) : '');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handleResetClick}
            className="flex items-center gap-1.5 text-xs text-slate-600 font-bold hover:text-slate-900 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyClick}
              className="px-5 py-2 rounded-xl bg-[#1464F4] hover:bg-blue-600 text-white text-xs font-bold shadow-md cursor-pointer tap-bounce"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
