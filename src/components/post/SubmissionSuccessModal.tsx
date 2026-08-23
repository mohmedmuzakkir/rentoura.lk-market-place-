import React from 'react';
import { Clock, CheckCircle2, ArrowRight, Home, Layers, Sparkles } from 'lucide-react';
import { UserListingItem } from '../../types/profileTypes';
import { AppRoute } from '../../types';

interface SubmissionSuccessModalProps {
  listing: UserListingItem;
  onNavigate?: (route: AppRoute) => void;
  onClose?: () => void;
  onViewListings?: () => void;
}

export const SubmissionSuccessModal: React.FC<SubmissionSuccessModalProps> = ({
  listing,
  onNavigate,
  onClose,
  onViewListings
}) => {
  const handleViewListings = () => {
    if (onViewListings) {
      onViewListings();
    } else if (onNavigate) {
      onNavigate('/my-listings');
    } else {
      window.location.hash = '#my-listings';
    }
  };

  const handleReturnHome = () => {
    if (onClose) {
      onClose();
    }
    if (onNavigate) {
      onNavigate('/');
    } else {
      window.location.hash = '#home';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200">
        {/* Animated Success Badge */}
        <div className="relative w-20 h-20 rounded-3xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center mx-auto text-amber-600 shadow-md">
          <Clock className="w-10 h-10 animate-pulse" />
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#08A34F] text-white flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-4 h-4 stroke-[3]" />
          </div>
        </div>

        {/* Title and Explanation */}
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800">
            Pending Moderation Review
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 font-heading">
            Listing Submitted Successfully!
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Your listing “<strong className="text-slate-800">{listing.title}</strong>” has been recorded and is currently under review by our team.
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 text-left space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Listing ID:</span>
            <span className="font-mono font-bold text-slate-800">{listing.id}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Current Status:</span>
            <span className="font-bold text-amber-700">⏳ Pending Review</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Category:</span>
            <span className="font-bold text-slate-800">{listing.category || 'Service'} › {listing.subcategory || 'General'}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Location:</span>
            <span className="font-bold text-slate-800">{listing.location || 'Sri Lanka'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={handleViewListings}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#1464F4] hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 tap-bounce"
          >
            <Layers className="w-4 h-4" />
            <span>View in My Listings</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </button>

          <button
            onClick={handleReturnHome}
            className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 tap-bounce"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
