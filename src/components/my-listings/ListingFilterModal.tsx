import React, { useState, useEffect } from 'react';
import { X, SlidersHorizontal, Check, RotateCcw } from 'lucide-react';
import { UserListingStatus } from '../../types/profileTypes';
import { ModuleTabType } from './MyListingsModuleTabs';
import { LocationService } from '../../services/locationService';

export interface MyListingsFilterOptions {
  module: ModuleTabType;
  status: 'all' | UserListingStatus;
  location: string;
}

interface ListingFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: MyListingsFilterOptions;
  onApply: (newFilters: MyListingsFilterOptions) => void;
  onReset: () => void;
}

export const ListingFilterModal: React.FC<ListingFilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApply,
  onReset
}) => {
  const [localFilters, setLocalFilters] = useState<MyListingsFilterOptions>(filters);
  const [locationOptions, setLocationOptions] = useState<string[]>(['All Locations']);

  useEffect(() => {
    let isMounted = true;
    async function fetchLocations() {
      const provs = await LocationService.getProvinces();
      const names = provs.map(p => p.name);
      if (isMounted) {
        setLocationOptions(['All Locations', ...names]);
      }
    }
    fetchLocations();
    return () => { isMounted = false; };
  }, []);

  if (!isOpen) return null;

  const statusOptions: { id: 'all' | UserListingStatus; label: string; color: string }[] = [
    { id: 'all', label: 'All Statuses', color: 'bg-slate-100 text-slate-700' },
    { id: 'active', label: 'Active', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 'pending', label: 'Pending Review', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { id: 'rejected', label: 'Rejected', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    { id: 'changes_requested', label: 'Changes Requested', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { id: 'paused', label: 'Paused', color: 'bg-slate-100 text-slate-700 border-slate-300' },
    { id: 'expired', label: 'Expired', color: 'bg-slate-100 text-slate-500 border-slate-300' },
    { id: 'draft', label: 'Draft', color: 'bg-slate-100 text-slate-700 border-slate-300' }
  ];

  const moduleOptions: { id: ModuleTabType; label: string; color: string }[] = [
    { id: 'all', label: 'All Modules', color: 'text-slate-700' },
    { id: 'rentals', label: 'Rentals', color: 'text-[#1464F4]' },
    { id: 'jobs', label: 'Jobs', color: 'text-[#08A34F]' },
    { id: 'services', label: 'Services', color: 'text-[#FF650A]' }
  ];

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    const defaultFilters: MyListingsFilterOptions = {
      module: 'all',
      status: 'all',
      location: 'All Locations'
    };
    setLocalFilters(defaultFilters);
    onReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-100 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-[#1464F4]">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Filter My Listings</h3>
              <p className="text-[11px] text-slate-500">Refine by module, status, or location</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Sections */}
        <div className="py-4 space-y-5">
          {/* Module Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Module
            </label>
            <div className="grid grid-cols-2 gap-2">
              {moduleOptions.map(opt => {
                const isSelected = localFilters.module === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setLocalFilters(prev => ({ ...prev, module: opt.id }))}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border ${
                      isSelected
                        ? 'bg-blue-50 border-[#1464F4] text-[#1464F4] shadow-xs'
                        : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100/80'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#1464F4]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Listing Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map(opt => {
                const isSelected = localFilters.status === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setLocalFilters(prev => ({ ...prev, status: opt.id }))}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border ${
                      isSelected
                        ? 'bg-blue-50 border-[#1464F4] text-[#1464F4] shadow-xs'
                        : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100/80'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#1464F4] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Location
            </label>
            <div className="flex flex-wrap gap-1.5">
              {locationOptions.map(loc => {
                const isSelected = localFilters.location === loc || (!localFilters.location && loc === 'All Locations');
                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setLocalFilters(prev => ({ ...prev, location: loc }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-[#1464F4] text-white border-[#1464F4]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {loc}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#1464F4] hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-600/20"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
