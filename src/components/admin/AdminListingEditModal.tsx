import React, { useState, useEffect } from 'react';
import { X, Edit3, Save, AlertCircle, CheckCircle2, Shield, Building2, MapPin, Tag } from 'lucide-react';
import { StaffAccount } from '../../types/adminTypes';
import { AdminModerationService } from '../../services/adminModerationService';
import { CategoryService, CategoryRecord } from '../../services/categoryService';
import { LocationService, CanonicalLocation } from '../../services/locationService';

export interface AdminEditableListing {
  id: string;
  title: string;
  module?: string;
  summary?: string | null;
  shortSummary?: string | null;
  description?: string | null;
  price?: number | string | null;
  pricingPeriod?: string | null;
  status?: string;
  categoryId?: string | null;
  categoryName?: string;
  provinceId?: string | null;
  provinceName?: string;
  exactAddress?: string | null;
  moduleData?: Record<string, unknown> | null;
}

interface AdminListingEditModalProps {
  listing: AdminEditableListing;
  staff: StaffAccount;
  onClose: () => void;
  onSaved: () => void;
}

export const AdminListingEditModal: React.FC<AdminListingEditModalProps> = ({
  listing,
  staff: _staff,
  onClose,
  onSaved
}) => {
  const [title, setTitle] = useState(listing.title || '');
  const [shortSummary, setShortSummary] = useState(listing.shortSummary || listing.summary || '');
  const [description, setDescription] = useState(listing.description || '');
  const [price, setPrice] = useState<string>(listing.price !== null && listing.price !== undefined ? String(listing.price) : '');
  const [pricingPeriod, setPricingPeriod] = useState(listing.pricingPeriod || 'per month');
  const [status, setStatus] = useState(listing.status || 'active');
  const [categoryId, setCategoryId] = useState(listing.categoryId || '');
  const [provinceId, setProvinceId] = useState(listing.provinceId || '');
  const [exactAddress, setExactAddress] = useState(listing.exactAddress || '');
  const [reason, setReason] = useState('');

  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [provinces, setProvinces] = useState<CanonicalLocation[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const catRes = await CategoryService.getCategories(listing.module);
        if (catRes.success && isMounted) {
          setCategories(catRes.data);
        }
        const provRes = await LocationService.getProvinces();
        if (isMounted) {
          setProvinces(provRes);
        }
      } catch (err) {
        console.error('Failed to load edit modal options:', err);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [listing.module]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is mandatory.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const parsedPrice = price.trim() !== '' ? parseFloat(price) : null;
      await AdminModerationService.adminEditListing({
        listingId: listing.id,
        title: title.trim(),
        shortSummary: shortSummary.trim() || null,
        description: description.trim() || null,
        price: isNaN(parsedPrice as number) ? null : parsedPrice,
        pricingPeriod: pricingPeriod.trim() || null,
        categoryId: categoryId || null,
        provinceId: provinceId || null,
        exactAddress: exactAddress.trim() || null,
        status: status || null,
        reason: reason.trim() || null
      });

      setSuccess('Listing updated successfully.');
      setTimeout(() => {
        onSaved();
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to update listing content.');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-auto border border-slate-100 overflow-hidden relative flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1464F4]/20 flex items-center justify-center text-[#1464F4]">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-2">
                <span>Staff Direct Editor</span>
                <span>•</span>
                <span className="text-cyan-400 font-mono">ID: {listing.id}</span>
              </div>
              <h2 className="text-base font-bold text-white truncate max-w-md mt-0.5">
                Edit Listing: {listing.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Banners */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Title */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Listing Title"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
            />
          </div>

          {/* Short Summary */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Short Summary
            </label>
            <input
              type="text"
              value={shortSummary}
              onChange={(e) => setShortSummary(e.target.value)}
              placeholder="Brief summary line"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
            />
          </div>

          {/* Price & Pricing Period */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Price (LKR)
              </label>
              <input
                type="number"
                step="any"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 50000"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Pricing Period
              </label>
              <select
                value={pricingPeriod}
                onChange={(e) => setPricingPeriod(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
              >
                <option value="per month">Per Month</option>
                <option value="per day">Per Day</option>
                <option value="per week">Per Week</option>
                <option value="per hour">Per Hour</option>
                <option value="fixed">Fixed Price</option>
                <option value="negotiable">Negotiable</option>
              </select>
            </div>
          </div>

          {/* Category & Province */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
              >
                <option value="">-- Unchanged / Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Province / Region
              </label>
              <select
                value={provinceId}
                onChange={(e) => setProvinceId(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
              >
                <option value="">-- Unchanged / Select Province --</option>
                {provinces.map((prov) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Exact Address & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Exact Address
              </label>
              <input
                type="text"
                value={exactAddress}
                onChange={(e) => setExactAddress(e.target.value)}
                placeholder="Address line"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
              >
                <option value="active">Active</option>
                <option value="pending">Pending Review</option>
                <option value="changes_requested">Changes Requested</option>
                <option value="rejected">Rejected</option>
                <option value="paused">Paused</option>
                <option value="expired">Expired</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Staff Edit Reason / Audit Log Note */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Staff Reason / Edit Note (Saved in Audit History)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Fixed typo in title / Updated contact address per seller request"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-[#1464F4] hover:bg-[#0e4ec2] text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Changes...' : 'Save Listing Content'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
