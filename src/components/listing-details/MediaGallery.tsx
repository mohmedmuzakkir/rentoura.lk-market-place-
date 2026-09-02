import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, Image as ImageIcon } from 'lucide-react';
import { SearchService } from '../../services/searchService';

interface MediaGalleryProps {
  images: string[];
  badgeLabel?: string;
  badgeBgColor?: string;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  images = [],
  badgeLabel,
  badgeBgColor = '#1464F4'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const cleanImages = (images || []).filter(img => typeof img === 'string' && img.trim() !== '');

  if (cleanImages.length === 0) {
    return (
      <div className="relative w-full aspect-16/10 bg-slate-900 flex flex-col items-center justify-center text-slate-400 gap-2 p-4 select-none rounded-3xl">
        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mb-1">
          <ImageIcon className="w-6 h-6" />
        </div>
        <span className="text-xs font-semibold text-slate-300">No photos available</span>
        <span className="text-[10px] text-slate-500">The owner hasn't uploaded photos for this listing</span>
        {badgeLabel && (
          <div
            className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-lg text-white text-[11px] font-black uppercase tracking-wider shadow-md z-10"
            style={{ backgroundColor: badgeBgColor }}
          >
            {badgeLabel}
          </div>
        )}
      </div>
    );
  }

  const validImages = cleanImages;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="relative w-full aspect-16/10 bg-slate-900 overflow-hidden group select-none">
        {/* Main Image */}
        <img
          src={validImages[currentIndex]}
          alt={`Listing preview ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          referrerPolicy="no-referrer"
          onClick={() => setIsLightboxOpen(true)}
        />

        {/* Badge Overlay */}
        {badgeLabel && (
          <div
            className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-lg text-white text-[11px] font-black uppercase tracking-wider shadow-md z-10"
            style={{ backgroundColor: badgeBgColor }}
          >
            {badgeLabel}
          </div>
        )}

        {/* Photo Counter Pill */}
        <div className="absolute bottom-3.5 right-3.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 z-10">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>{currentIndex + 1} / {validImages.length}</span>
        </div>

        {/* Expand / Lightbox Button */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md hover:bg-black/70 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10 tap-bounce"
          aria-label="View Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Carousel Prev/Next Buttons (only if more than 1 image) */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md hover:bg-black/80 text-white flex items-center justify-center transition-all z-10 tap-bounce"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md hover:bg-black/80 text-white flex items-center justify-center transition-all z-10 tap-bounce"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Thumbnails Row */}
        {validImages.length > 1 && (
          <div className="absolute bottom-3 left-3.5 right-20 flex gap-1.5 overflow-x-auto no-scrollbar z-10">
            {validImages.map((img, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`w-9 h-7 rounded-md overflow-hidden shrink-0 border-2 transition-all ${
                  idx === currentIndex ? 'border-white scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumb ${idx + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-between p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Header */}
          <div className="w-full flex items-center justify-between text-white py-2" onClick={e => e.stopPropagation()}>
            <span className="text-sm font-bold">
              {currentIndex + 1} of {validImages.length}
            </span>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Enlarged Image */}
          <div className="relative max-w-4xl max-h-[75vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <img
              src={validImages[currentIndex]}
              alt={`Full view ${currentIndex + 1}`}
              className="max-h-[75vh] max-w-full object-contain rounded-lg"
              referrerPolicy="no-referrer"
            />
            {validImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails strip */}
          <div className="flex gap-2 overflow-x-auto max-w-xl py-2 px-4 no-scrollbar" onClick={e => e.stopPropagation()}>
            {validImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-14 h-11 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  idx === currentIndex ? 'border-[#1464F4] scale-105' : 'border-transparent opacity-50 hover:opacity-90'
                }`}
              >
                <img src={img || SearchService.NEUTRAL_PLACEHOLDER} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
