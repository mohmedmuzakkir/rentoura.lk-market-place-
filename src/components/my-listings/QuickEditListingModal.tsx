import React, { useState } from 'react';
import { X, Save, Edit3, AlertCircle } from 'lucide-react';
import { UserListingItem, UserListingStatus } from '../../types/profileTypes';

interface QuickEditListingModalProps {
  isOpen: boolean;
  listing: UserListingItem | null;
  onClose: () => void;
  onSave: (updated: UserListingItem) => void;
}

export const QuickEditListingModal: React.FC<QuickEditListingModalProps> = ({
  isOpen,
  listing,
  onClose,
  onSave
}) => {
  if (!isOpen || !listing) return null;

  const [title, setTitle] = useState(listing.title);
  const [price, setPrice] = useState(listing.price);
  const [pricePeriod, setPricePeriod] = useState(listing.pricePeriod || '/ Month');
  const [location, setLocation] = useState(listing.location);
  const [description, setDescription] = useState(listing.description || '');
  const [tagsInput, setTagsInput] = useState((listing.tags || []).join(', '));
  const [resubmitForReview, setResubmitForReview] = useState(
    listing.status === 'rejected' || listing.status === 'changes_requested'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    let newStatus: UserListingStatus = listing.status;
    let newStatusNote = listing.statusNote;

    if (resubmitForReview || listing.status === 'rejected' || listing.status === 'changes_requested') {
      newStatus = 'pending';
      newStatusNote = 'Resubmitted - Under moderation review';
    }

    const updated: UserListingItem = {
      ...listing,
      title,
      price,
      pricePeriod,
      location,
      description,
      tags: updatedTags,
      status: newStatus,
      statusNote: newStatusNote,
      updatedAt: new Date().toISOString()
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-100 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#1464F4]">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Edit Listing</h3>
              <p className="text-[11px] text-slate-500">ID: {listing.id}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          {/* Rejection / Action Needed Notice */}
          {(listing.status === 'rejected' || listing.status === 'changes_requested') && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900">
                <span className="font-bold block mb-0.5">Resubmitting will trigger moderation review</span>
                <span className="text-amber-800">
                  After saving changes, your listing status will change to <strong>Pending Review</strong> for verification.
                </span>
              </div>
            </div>
          )}

          {/* Title Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Listing Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1464F4]/30 focus:border-[#1464F4]"
            />
          </div>

          {/* Price & Period Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Price / Salary *
              </label>
              <input
                type="text"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. Rs. 85,000"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1464F4]/30 focus:border-[#1464F4]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Period / Unit
              </label>
              <input
                type="text"
                value={pricePeriod}
                onChange={(e) => setPricePeriod(e.target.value)}
                placeholder="e.g. / Month, / Day"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1464F4]/30 focus:border-[#1464F4]"
              />
            </div>
          </div>

          {/* Location / Context Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Location / Company *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1464F4]/30 focus:border-[#1464F4]"
            />
          </div>

          {/* Tags Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Residential, House, 4 Bedrooms"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1464F4]/30 focus:border-[#1464F4]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the listing..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1464F4]/30 focus:border-[#1464F4]"
            />
          </div>

          {/* Footer Save / Submit Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#1464F4] hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
