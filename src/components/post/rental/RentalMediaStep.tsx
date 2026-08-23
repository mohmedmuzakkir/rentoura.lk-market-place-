import React, { useRef, useState } from 'react';
import { UploadedImage } from '../../../types/postFormTypes';
import { Image, Upload, Trash2, Star, Plus, CheckCircle, Lightbulb, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';

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
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Sample curated rental presets for quick testing
  const samplePresets: Record<string, UploadedImage[]> = {
    car: [
      { id: 'img-c1', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80', name: 'Front Profile', isCover: true },
      { id: 'img-c2', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80', name: 'Cockpit & Interior', isCover: false },
      { id: 'img-c3', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80', name: 'Rear & Trunk', isCover: false }
    ],
    house: [
      { id: 'img-h1', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80', name: 'Front Elevation', isCover: true },
      { id: 'img-h2', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', name: 'Living Room', isCover: false },
      { id: 'img-h3', url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80', name: 'Master Bedroom', isCover: false }
    ],
    camera: [
      { id: 'img-cam1', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', name: 'Camera Body & Lens', isCover: true },
      { id: 'img-cam2', url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80', name: 'Accessories & Pelican Case', isCover: false }
    ]
  };

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

    const availableSlots = MAX_PHOTOS - images.length;
    if (files.length > availableSlots) {
      setMaxPhotoError(`Maximum 5 photos allowed. Only ${availableSlots} more photo(s) added.`);
    } else {
      setMaxPhotoError(null);
    }

    const filesToProcess = Array.from(files).slice(0, availableSlots) as File[];
    const newImages: UploadedImage[] = [];
    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i];
      const objectUrl = URL.createObjectURL(file);
      newImages.push({
        id: `upload-${Date.now()}-${i}`,
        url: objectUrl,
        name: file.name,
        size: file.size,
        isCover: images.length === 0 && i === 0
      });
    }

    onChangeImages([...images, ...newImages]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    if (images.length >= MAX_PHOTOS) {
      setMaxPhotoError('Maximum 5 photos allowed per rental listing.');
      return;
    }
    setMaxPhotoError(null);
    const newImage: UploadedImage = {
      id: `url-${Date.now()}`,
      url: urlInput.trim(),
      name: 'Web Image',
      isCover: images.length === 0
    };
    onChangeImages([...images, newImage]);
    setUrlInput('');
    setShowUrlInput(false);
  };

  const handleSetCover = (id: string) => {
    const updated = images.map(img => ({
      ...img,
      isCover: img.id === id
    }));
    onChangeImages(updated);
  };

  const handleDeleteImage = (id: string) => {
    const remaining = images.filter(img => img.id !== id);
    // If the removed image was cover, make first remaining as cover
    if (remaining.length > 0 && !remaining.some(img => img.isCover)) {
      remaining[0].isCover = true;
    }
    onChangeImages(remaining);
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    onChangeImages(updated);
  };

  const handleApplyPreset = (presetKey: string) => {
    const preset = samplePresets[presetKey];
    if (preset) {
      onChangeImages([...preset]);
    }
  };

  return (
    <div className="space-y-5 text-left animate-in fade-in duration-200">
      {/* Header Info */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3">
        <Image className="w-5 h-5 text-[#1464F4] flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold text-slate-900">Step 5: Photos & Media Management</p>
          <p className="text-slate-600 mt-0.5 leading-relaxed">
            High-resolution photos increase rental inquiries by over 300%. Add up to 5 photos and select your preferred cover shot.
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

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleApplyPreset(categoryName?.toLowerCase().includes('vehic') ? 'car' : 'house')}
              className="text-[10px] font-bold text-[#1464F4] hover:underline flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md"
            >
              <Sparkles className="w-3 h-3" /> Quick Sample Photos
            </button>
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
              Supports JPG, PNG, WEBP up to 10MB each
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Add from URL option */}
        <div className="flex items-center justify-between pt-1">
          {!showUrlInput ? (
            <button
              type="button"
              onClick={() => setShowUrlInput(true)}
              className="text-[11px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Or paste image web link (URL)
            </button>
          ) : (
            <div className="w-full flex gap-2 animate-in fade-in">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800"
              />
              <button
                type="button"
                onClick={handleAddUrl}
                className="px-3 py-1.5 bg-[#1464F4] text-white text-xs font-bold rounded-xl"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowUrlInput(false)}
                className="px-2 py-1.5 text-xs text-slate-500 font-bold"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

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
                    src={img.url}
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
