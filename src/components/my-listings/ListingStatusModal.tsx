import React from 'react';
import { 
  X, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  HelpCircle,
  Edit2,
  RefreshCw
} from 'lucide-react';
import { UserListingItem } from '../../types/profileTypes';

interface ListingStatusModalProps {
  isOpen: boolean;
  listing: UserListingItem | null;
  onClose: () => void;
  onEditAndResubmit?: (listing: UserListingItem) => void;
}

export const ListingStatusModal: React.FC<ListingStatusModalProps> = ({
  isOpen,
  listing,
  onClose,
  onEditAndResubmit
}) => {
  if (!isOpen || !listing) return null;

  const isPending = listing.status === 'pending';
  const isRejected = listing.status === 'rejected';
  const isChangesReq = listing.status === 'changes_requested';
  const isActive = listing.status === 'active';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 relative overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Status Icon Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-5">
          {isPending && (
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
              <Clock className="w-7 h-7" />
            </div>
          )}
          {isRejected && (
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <XCircle className="w-7 h-7" />
            </div>
          )}
          {isChangesReq && (
            <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
              <AlertCircle className="w-7 h-7" />
            </div>
          )}
          {isActive && (
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-7 h-7" />
            </div>
          )}

          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isPending && 'Listing Under Review'}
              {isRejected && 'Listing Not Approved'}
              {isChangesReq && 'Action Required'}
              {isActive && 'Listing is Active & Published'}
            </h3>
            <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
              {listing.title}
            </p>
          </div>
        </div>

        {/* Status Content Body */}
        <div className="space-y-4 mb-6">
          {/* PENDING EXPLANATION */}
          {isPending && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-2">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 leading-relaxed">
                  <p className="font-semibold text-amber-900 mb-1">
                    Your listing is being reviewed by our moderation team.
                  </p>
                  <p className="text-slate-600">
                    To maintain trusted standards across Sri Lanka, all new and updated listings undergo quality checks. The typical review window is <strong>2 to 4 hours</strong>.
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-amber-800">
                <span>Submitted: {listing.postedDate}</span>
                <span className="font-semibold">Status: Pending</span>
              </div>
            </div>
          )}

          {/* REJECTED EXPLANATION */}
          {isRejected && (
            <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 leading-relaxed">
                  <p className="font-semibold text-rose-900 mb-1">
                    Reason for Rejection:
                  </p>
                  <p className="text-slate-700 bg-white/80 p-2.5 rounded-xl border border-rose-100 font-medium">
                    {listing.rejectionReason || 'The listing content did not meet RENTOURA marketplace safety & verification guidelines. Missing license or unverified information.'}
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                You can edit your listing to address the points above and resubmit for moderation.
              </p>
            </div>
          )}

          {/* CHANGES REQUESTED EXPLANATION */}
          {isChangesReq && (
            <div className="bg-orange-50/70 border border-orange-200/80 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 leading-relaxed">
                  <p className="font-semibold text-orange-900 mb-1">
                    Requested Changes:
                  </p>
                  <p className="text-slate-700 bg-white/80 p-2.5 rounded-xl border border-orange-100 font-medium">
                    {listing.changesRequestedNote || 'Please update details with clear specifications, pricing clarity, or valid credentials.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE EXPLANATION */}
          {isActive && (
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 leading-relaxed">
                  <p className="font-semibold text-emerald-900 mb-0.5">
                    Live on RENTOURA.LK
                  </p>
                  <p className="text-slate-600">
                    This listing is active and discoverable by renters across Sri Lanka in search and category feeds.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all"
          >
            Close
          </button>
          
          {(isRejected || isChangesReq || isPending) && onEditAndResubmit && (
            <button
              onClick={() => {
                onClose();
                onEditAndResubmit(listing);
              }}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#1464F4] hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isRejected || isChangesReq ? 'Edit & Resubmit' : 'Edit Listing'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
