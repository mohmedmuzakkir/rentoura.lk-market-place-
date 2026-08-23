import React from 'react';
import { X, Check, MapPin, LayoutGrid, SlidersHorizontal, Bell, ShieldCheck } from 'lucide-react';
import { SRI_LANKA_LOCATIONS, CATEGORIES_DATA } from '../data/mockData';
import { FilterState } from '../types';

// 1. LOCATION MODAL
interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: string;
  onSelect: (location: string) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  selectedLocation,
  onSelect
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl z-10 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#1464F4]" />
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Select Location
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto py-2 space-y-1.5 no-scrollbar mt-2">
          {SRI_LANKA_LOCATIONS.map((loc) => {
            const isSelected = selectedLocation.includes(loc.name) || (loc.name === 'All Sri Lanka' && !selectedLocation);
            return (
              <button
                key={loc.name}
                onClick={() => {
                  onSelect(loc.name === 'All Sri Lanka' ? '' : `${loc.name}, ${loc.province}`);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                  isSelected
                    ? 'bg-[#1464F4]/10 text-[#1464F4] font-bold border border-[#1464F4]/20'
                    : 'hover:bg-slate-50 text-slate-700 font-medium'
                }`}
              >
                <div>
                  <div className="text-[13px]">{loc.name}</div>
                  <div className="text-[11px] text-slate-400 font-normal">{loc.province}</div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#1464F4]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 2. CATEGORY MODAL
interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelect
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl z-10 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-[#08A34F]" />
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Select Category
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto py-2 space-y-1.5 no-scrollbar mt-2">
          <button
            onClick={() => {
              onSelect('');
              onClose();
            }}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
              !selectedCategory
                ? 'bg-[#08A34F]/10 text-[#08A34F] font-bold border border-[#08A34F]/20'
                : 'hover:bg-slate-50 text-slate-700 font-medium'
            }`}
          >
            <span className="text-[13px]">All Categories</span>
            {!selectedCategory && <Check className="w-4 h-4 text-[#08A34F]" />}
          </button>

          {CATEGORIES_DATA.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelect(cat.name);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                  isSelected
                    ? 'bg-[#08A34F]/10 text-[#08A34F] font-bold border border-[#08A34F]/20'
                    : 'hover:bg-slate-50 text-slate-700 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: cat.bgColor, color: cat.color }}
                  >
                    •
                  </div>
                  <span className="text-[13px]">{cat.name}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#08A34F]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 3. FILTERS MODAL
interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterState: FilterState;
  onApplyFilters: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filterState,
  onApplyFilters,
  onResetFilters
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl z-10 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#FF650A]" />
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Filter Listings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto py-3 space-y-4 no-scrollbar">
          {/* Sort By */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Sort By</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Featured First', value: 'featured' },
                { label: 'Newest First', value: 'newest' },
                { label: 'Price: Low to High', value: 'price_low' },
                { label: 'Price: High to Low', value: 'price_high' }
              ].map((sort) => (
                <button
                  key={sort.value}
                  onClick={() => onApplyFilters({ sortBy: sort.value as any })}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition-all ${
                    filterState.sortBy === sort.value
                      ? 'bg-[#1464F4] text-white border-[#1464F4] shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {sort.label}
                </button>
              ))}
            </div>
          </div>

          {/* Verified Only Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <div className="text-xs font-bold text-slate-800">Verified Listings Only</div>
              <div className="text-[10px] text-slate-500">Only show listings verified by RENTOURA.LK</div>
            </div>
            <button
              onClick={() => onApplyFilters({ verifiedOnly: !filterState.verifiedOnly })}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                filterState.verifiedOnly ? 'bg-[#08A34F]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  filterState.verifiedOnly ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
          <button
            onClick={() => {
              onResetFilters();
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 tap-bounce"
          >
            Reset All
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-[#1464F4] text-white text-xs font-bold hover:bg-[#0e52cd] shadow-md shadow-blue-500/20 tap-bounce"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. NOTIFICATIONS MODAL
interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: '1',
      title: 'New Featured Rental in Kandy',
      message: 'A 4-bedroom luxury villa matching your search has just been listed.',
      time: '10m ago',
      unread: true
    },
    {
      id: '2',
      title: 'Safety Check Reminder',
      message: 'Always use in-app verified badges when communicating with owners.',
      time: '2h ago',
      unread: true
    },
    {
      id: '3',
      title: 'New Job Vacancies in Colombo',
      message: 'Virtusa and WSO2 posted senior engineering roles today.',
      time: '1d ago',
      unread: false
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl z-10 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#1464F4]" />
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Notifications (3)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto py-2 space-y-2 no-scrollbar mt-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 rounded-xl border transition-all ${
                n.unread ? 'bg-blue-50/60 border-blue-200/80' : 'bg-slate-50/50 border-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                <span className="text-[10px] text-slate-400">{n.time}</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1 leading-snug">{n.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 5. LEARN MORE / TRUST MODAL
interface LearnMoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LearnMoreModal: React.FC<LearnMoreModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl z-10 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#1464F4]" />
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Safety & Verification
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto py-3 space-y-3.5 no-scrollbar text-xs text-slate-600">
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
            <h4 className="font-bold text-[#1464F4] text-xs mb-1">Sri Lanka's Verified Marketplace</h4>
            <p className="text-[11px] leading-relaxed">
              Every listing on RENTOURA.LK goes through strict identity and quality verification to ensure authenticity and peace of mind across all provinces.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">✓</span>
              <div>
                <strong className="text-slate-800">Phone & NIC Verification:</strong> Property owners and service providers submit proof of identity.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1464F4] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">✓</span>
              <div>
                <strong className="text-slate-800">Direct Inquiries:</strong> Contact listing owners directly via phone, WhatsApp, or instant messaging.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">✓</span>
              <div>
                <strong className="text-slate-800">Community Ratings:</strong> Real customer reviews and star ratings for trusted service delivery.
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#1464F4] text-white font-bold rounded-xl shadow-md text-xs mt-2 tap-bounce"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
