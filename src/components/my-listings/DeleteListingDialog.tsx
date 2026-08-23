import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteListingDialogProps {
  isOpen: boolean;
  listingTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export const DeleteListingDialog: React.FC<DeleteListingDialogProps> = ({
  isOpen,
  listingTitle,
  onConfirm,
  onCancel,
  isDeleting = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Icon */}
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-4 mx-auto">
          <Trash2 className="w-6 h-6" />
        </div>

        {/* Title and Confirmation Text */}
        <div className="text-center space-y-2 mb-6">
          <h3 className="text-lg font-bold text-slate-900">
            Delete this listing?
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="font-semibold text-slate-700">"{listingTitle}"</span> will be removed from your account and will no longer appear in RENTOURA.LK.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all shadow-md shadow-rose-600/20 disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {isDeleting ? (
              <span>Deleting...</span>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Listing</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
