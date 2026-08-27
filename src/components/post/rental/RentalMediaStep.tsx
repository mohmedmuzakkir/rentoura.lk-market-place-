import React, { useRef, useState } from 'react';
import { UploadedImage } from '../../../types/postFormTypes';
import { createPendingImages, normalizeImagePositions, revokePendingImage } from '../../../utils/pendingUploadImages';
import { Image, Upload, Trash2, Star, CheckCircle, Lightbulb, ArrowLeft, ArrowRight } from 'lucide-react';

interface RentalMediaStepProps {
  images: UploadedImage[];
  errors: Record<string, string>;
  categoryName?: string;
  onChangeImages: (images: UploadedImage[]) => void;
  accentColor?: string;
}

export const RentalMediaStep: React.FC<RentalMediaStepProps> = ({
  images,
  errors,
  categoryName,
  onChangeImages,
  accentColor = '#1464F4'
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const MAX_PHOTOS = 5;
  const [maxPhotoError, setMaxPhotoError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length >= MAX_PHOTOS) {
      setMaxPhotoError('Maximum 5 photos allowed per rental listing.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const result = createPendingImages(Array.from(files), images.length);
    setMaxPhotoError(result.errors[0] || null);
    onChangeImages(normalizeImagePositions([...images, ...result.images]));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSetCover = (id: string) => {
    const updated = images.map(img => ({
      ...img,
      isCover: img.id === id
    }));
    onChangeImages(updated);
  };

  const handleDeleteImage = (id: string) => {
    const removed = images.find(img => img.id === id);
    if (removed) revokePendingImage(removed);
    const remaining = images.filter(img => img.id !== id);
    // If the removed image was cover, make first remaining as cover
    if (remaining.length > 0 && !remaining.some(img => img.isCover)) {
      remaining[0].isCover = true;
    }
    onChangeImages(normalizeImagePositions(remaining));
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    onChangeImages(normalizeImagePositions(updated));
  };

  return (
    <div className="space-y-5 text-left animate-in fade-in duration-200">
      {/* Header Info */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3">
        <Image className="w-5 h-5 text-[#1464F4] flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold text-slate-900">Step 5: Photos & Media Management</p>
          <p className="text-slate-600 mt-0.5 leading-relaxed">
            Clear, accurate photos help people understand the rental. Add up to 5 photos and select your preferred cover shot.
          </p>
        </div>
      </div>

      {/* Upload Box */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
        {maxPhotoError && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center justify-between">
            <span>{maxPhotoError}</span>
            <button
              type="button"
              onClick={() => setMaxPhotoError(null)}
              className="text-amber-600 hover:text-amber-900 font-bold ml-2 text-[11px]"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
              Upload Photos
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              images.length === 5 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
            }`}>
              {images.length} / 5 photos added
            </span>
          </div>

        </div>

        {/* Drag & Drop Trigger */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-blue-200 hover:border-[#1464F4] bg-blue-50/30 hover:bg-blue-50/60 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform text-[#1464F4]">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-slate-900">
              Click to select files or drag photos here
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Supports JPEG, PNG, WEBP up to 5 MB each
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Uploaded Photos Grid */}
        {images.length > 0 && (
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <p className="text-[11px] font-bold text-slate-700">
              Uploaded Images (Click ⭐ to set as Cover Photo):
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  className={`relative rounded-xl overflow-hidden border group bg-slate-50 shadow-xs transition-all ${
                    img.isCover ? 'ring-2 ring-[#1464F4] border-transparent' : 'border-slate-200'
                  }`}
                >
                  <img
                    src={img.previewUrl}
                    alt={img.name || `Photo ${idx + 1}`}
                    className="w-full h-28 object-cover"
                  />

                  {/* Cover Badge */}
                  {img.isCover ? (
                    <div className="absolute top-1.5 left-1.5 bg-[#1464F4] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-white" /> Cover
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetCover(img.id)}
                      title="Set as Cover Photo"
                      className="absolute top-1.5 left-1.5 bg-black/60 hover:bg-[#1464F4] text-white text-[9px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs opacity-80 hover:opacity-100 transition-all flex items-center gap-1"
                    >
                      <Star className="w-2.5 h-2.5" /> Make Cover
                    </button>
                  )}

                  {/* Action Controls */}
                  <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1">
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => handleMoveImage(idx, 'left')}
                        title="Move Left"
                        className="w-6 h-6 rounded-md bg-black/70 hover:bg-black text-white flex items-center justify-center"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                    )}
                    {idx < images.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleMoveImage(idx, 'right')}
                        title="Move Right"
                        className="w-6 h-6 rounded-md bg-black/70 hover:bg-black text-white flex items-center justify-center"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img.id)}
                      title="Remove Photo"
                      className="w-6 h-6 rounded-md bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-xs"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Photography Guide Card */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-amber-900">Rental Photography Guidelines</p>
          <ul className="text-amber-800 text-[11px] list-disc list-inside space-y-0.5">
            <li>Take photos in bright, natural daylight without heavy filters.</li>
            <li>For vehicles: capture front, side, cockpit dashboard, rear, and clean interior.</li>
            <li>For properties: capture main bedroom, living room, kitchen, and bathroom.</li>
            <li>For tools & gear: capture close-ups of included accessories and brand tags.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
