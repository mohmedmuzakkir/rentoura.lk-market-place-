import React, { useState } from 'react';
import { ArrowLeft, Heart, Share2, MoreVertical, Flag, Check, Copy } from 'lucide-react';
import { RentouraLogo } from '../RentouraLogo';

interface ListingHeaderProps {
  onBack: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
  onOpenReport?: () => void;
  shareTitle?: string;
  themeColor?: string;
}

export const ListingHeader: React.FC<ListingHeaderProps> = ({
  onBack,
  isSaved = false,
  onToggleSave,
  onOpenReport,
  shareTitle = 'Listing on RENTOURA.LK',
  themeColor = '#1464F4'
}) => {
  const [showShareToast, setShowShareToast] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `Check out this listing on RENTOURA.LK: ${shareTitle}`,
          url
        });
        return;
      } catch (err) {
        // user cancelled or share unsupported
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2200);
    } catch (err) {
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2200);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-4 py-2.5 shadow-xs">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors tap-bounce shrink-0"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Brand Logo in Center */}
        <div className="cursor-pointer" onClick={onBack}>
          <RentouraLogo variant="header" theme="light" />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0 relative">
          {/* Favorite Button */}
          {onToggleSave && (
            <button
              onClick={onToggleSave}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all tap-bounce ${
                isSaved
                  ? 'bg-rose-50 text-rose-600 border border-rose-200/80 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              aria-label={isSaved ? 'Remove from saved' : 'Save listing'}
            >
              <Heart className={`w-4.5 h-4.5 ${isSaved ? 'fill-rose-600' : ''}`} />
            </button>
          )}

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors tap-bounce"
            aria-label="Share listing"
          >
            <Share2 className="w-4.5 h-4.5" />
          </button>

          {/* More Options Dropdown */}
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors tap-bounce"
            aria-label="More options"
          >
            <MoreVertical className="w-4.5 h-4.5" />
          </button>

          {/* Dropdown Menu */}
          {showMoreMenu && (
            <div 
              className="absolute right-0 top-11 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 w-44 z-50 animate-in fade-in zoom-in-95 duration-150"
              onClick={() => setShowMoreMenu(false)}
            >
              <button
                onClick={handleShare}
                className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copy Link</span>
              </button>
              {onOpenReport && (
                <button
                  onClick={onOpenReport}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <Flag className="w-4 h-4 text-rose-500" />
                  <span>Report Listing</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Share Toast Notification */}
      {showShareToast && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Listing link copied to clipboard!</span>
        </div>
      )}
    </header>
  );
};
