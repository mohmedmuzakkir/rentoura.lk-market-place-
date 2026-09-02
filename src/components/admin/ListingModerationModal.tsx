import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  User, 
  MapPin, 
  Tag, 
  Clock, 
  Shield, 
  ExternalLink,
  MessageSquare,
  FileText,
  AlertCircle,
  Check,
  Send,
  Building2,
  Calendar,
  Phone,
  Eye
} from 'lucide-react';
import { UserListingItem } from '../../types/profileTypes';
import { StaffAccount } from '../../types/adminTypes';
import { AdminService } from '../../services/adminService';
import { SearchService } from '../../services/searchService';

interface ListingModerationModalProps {
  listing: UserListingItem;
  staff: StaffAccount;
  onClose: () => void;
  onActionCompleted: () => void;
}

export const ListingModerationModal: React.FC<ListingModerationModalProps> = ({
  listing,
  staff,
  onClose,
  onActionCompleted
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'owner' | 'history'>('details');
  const [rejectMode, setRejectMode] = useState(false);
  const [requestChangesMode, setRequestChangesMode] = useState(false);
  const [reasonInput, setReasonInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleApprove = async () => {
    setProcessing(true);
    setErrorMessage(null);
    try {
      await AdminService.moderateListing(listing.id, 'approve');
      setSuccessMessage('Listing approved successfully! Status is now Active & Live.');
      setTimeout(() => {
        onActionCompleted();
        onClose();
      }, 1200);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to approve listing.');
      setProcessing(false);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasonInput.trim()) {
      setErrorMessage('Rejection reason is mandatory.');
      return;
    }
    setProcessing(true);
    setErrorMessage(null);

    try {
      await AdminService.moderateListing(listing.id, 'reject', reasonInput);
      setSuccessMessage('Listing rejected. Reason sent to owner via notification.');
      setTimeout(() => {
        onActionCompleted();
        onClose();
      }, 1200);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to reject listing.');
      setProcessing(false);
    }
  };

  const handleRequestChangesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasonInput.trim()) {
      setErrorMessage('Feedback instructions are required.');
      return;
    }
    setProcessing(true);
    setErrorMessage(null);

    try {
      await AdminService.moderateListing(listing.id, 'request_changes', reasonInput);
      setSuccessMessage('Changes requested successfully. Owner notified.');
      setTimeout(() => {
        onActionCompleted();
        onClose();
      }, 1200);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to request changes.');
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full my-auto border border-slate-100 overflow-hidden relative flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1464F4]/20 flex items-center justify-center text-[#1464F4]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-2">
                <span>Moderation Review</span>
                <span>•</span>
                <span className="text-cyan-400 font-mono">ID: {listing.id}</span>
              </div>
              <h2 className="text-lg font-bold text-white truncate max-w-md mt-0.5">
                {listing.title}
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

        {/* Tab Selection Navigation */}
        <div className="px-6 bg-slate-100 border-b border-slate-200 flex items-center gap-4 text-xs font-bold text-slate-600 shrink-0">
          <button
            type="button"
            onClick={() => { setActiveTab('details'); setRejectMode(false); setRequestChangesMode(false); }}
            className={`py-3 border-b-2 transition-all flex items-center gap-1.5 ${activeTab === 'details' && !rejectMode && !requestChangesMode ? 'border-[#1464F4] text-[#1464F4]' : 'border-transparent hover:text-slate-900'}`}
          >
            <FileText className="w-4 h-4" />
            <span>Listing Details</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('owner'); setRejectMode(false); setRequestChangesMode(false); }}
            className={`py-3 border-b-2 transition-all flex items-center gap-1.5 ${activeTab === 'owner' ? 'border-[#1464F4] text-[#1464F4]' : 'border-transparent hover:text-slate-900'}`}
          >
            <User className="w-4 h-4" />
            <span>Owner Info</span>
          </button>

          <div className="ml-auto flex items-center gap-2 py-2">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
              listing.status === 'active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
              listing.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
              listing.status === 'rejected' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
              'bg-slate-200 text-slate-700'
            }`}>
              {listing.status}
            </span>
          </div>
        </div>

        {/* Notification Messages */}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Scrollable Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {rejectMode ? (
            /* Rejection Form Mode */
            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-xs font-semibold">
                <div className="font-bold text-sm text-rose-800 flex items-center gap-1.5 mb-1">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Reject Listing</span>
                </div>
                Please provide a clear rejection reason. This will be sent directly to the owner so they understand why the listing was rejected.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Mandatory Rejection Reason *
                </label>
                <textarea
                  required
                  rows={4}
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  placeholder="e.g. Inappropriate images uploaded, contact details in description violate policy, or inaccurate price specified."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectMode(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/30 flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Confirm Rejection</span>
                </button>
              </div>
            </form>
          ) : requestChangesMode ? (
            /* Request Changes Form Mode */
            <form onSubmit={handleRequestChangesSubmit} className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs font-semibold">
                <div className="font-bold text-sm text-amber-800 flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Request Changes from Owner</span>
                </div>
                Specify required updates (e.g. better photos, clearer address, or correct category). The owner will be notified to edit and resubmit.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Feedback / Instructions for Owner *
                </label>
                <textarea
                  required
                  rows={4}
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  placeholder="e.g. Please upload higher resolution photos showing the vehicle interior and clarify insurance terms."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRequestChangesMode(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/30 flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Request to Owner</span>
                </button>
              </div>
            </form>
          ) : activeTab === 'details' ? (
            /* Main Details View */
            <div className="space-y-6">
              {/* Media & Key Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video sm:aspect-square relative group">
                  <img
                    src={listing.imageUrl || SearchService.NEUTRAL_PLACEHOLDER}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md">
                    {listing.imagesCount || 1} Photo(s)
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#1464F4] bg-[#1464F4]/10 px-2.5 py-1 rounded-full">
                      {listing.module} • {listing.category}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-2">
                      {listing.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1 font-extrabold text-[#1464F4] text-base">
                      <span>Rs. {listing.price}</span>
                      <span className="text-xs text-slate-400 font-normal">{listing.pricePeriod}</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{listing.location}</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Submitted: {listing.postedDate}</span>
                    </div>
                  </div>

                  {listing.tags && listing.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {listing.tags.map((tag, i) => (
                        <span key={i} className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Listing Description
                </h4>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                  {listing.description || 'No description provided by the submitter.'}
                </div>
              </div>

              {/* Status Note or Previous Reason if exists */}
              {listing.statusNote && (
                <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600">
                  <span className="font-bold text-slate-800">Current Moderation Note: </span>
                  {listing.statusNote}
                </div>
              )}
            </div>
          ) : (
            /* Owner Info Tab */
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#1464F4]/10 text-[#1464F4] flex items-center justify-center font-bold text-xl">
                  <User className="w-7 h-7" />
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-base">
                    Listing Owner
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Member ID: <span className="font-mono text-slate-700 font-bold">{listing.ownerId || 'Unavailable'}</span>
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-600 mt-2">
                    <span>Contact details are available in the full review workspace</span>
                    <span>•</span>
                    <span className="text-slate-500 font-medium">Verification data unavailable</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white border border-slate-200 rounded-xl">
                  <div className="text-slate-400 font-bold text-[10px] uppercase">Account Type</div>
                  <div className="font-bold text-slate-800 mt-0.5">Individual Account</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl">
                  <div className="text-slate-400 font-bold text-[10px] uppercase">Member Since</div>
                  <div className="font-bold text-slate-800 mt-0.5">Available in full review</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        {!rejectMode && !requestChangesMode && (
          <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
            >
              Close
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { setRequestChangesMode(true); setReasonInput(''); }}
                className="px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-800 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Request Changes</span>
              </button>

              <button
                type="button"
                onClick={() => { setRejectMode(true); setReasonInput(''); }}
                className="px-4 py-2.5 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-800 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Reject Listing</span>
              </button>

              <button
                type="button"
                onClick={handleApprove}
                disabled={processing || listing.status === 'active'}
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Publish</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
