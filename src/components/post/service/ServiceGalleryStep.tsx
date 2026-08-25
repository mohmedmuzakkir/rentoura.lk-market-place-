import React, { useState } from 'react';
import { Upload, X, Star, Image as ImageIcon, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { ListingDraft, UploadedImage } from '../../../types/postFormTypes';

interface ServiceGalleryStepProps {
  draft: ListingDraft;
  onChange: (updated: Partial<ListingDraft>) => void;
  errors: Record<string, string>;
  accentColor: string;
}

export const ServiceGalleryStep: React.FC<ServiceGalleryStepProps> = ({
  draft,
  onChange,
  errors,
  accentColor = '#FF650A'
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const images = draft.images || [];

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);

    const newImages: UploadedImage[] = [];

    Array.from(files).forEach((file, index) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select valid image files (JPG, PNG, WEBP).');
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`File "${file.name}" exceeds 10MB limit.`);
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      const isCover = images.length === 0 && index === 0;

      newImages.push({
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        url: objectUrl,
        name: file.name,
        size: file.size,
        file: file,
        isCover
      });
    });

    if (newImages.length > 0) {
      onChange({
        images: [...images, ...newImages]
      });
    }
  };

  const handleSetCover = (id: string) => {
    const updated = images.map(img => ({
      ...img,
      isCover: img.id === id
    }));
    onChange({ images: updated });
  };

  const handleRemoveImage = (id: string) => {
    const updated = images.filter(img => img.id !== id);
    // If cover was removed, assign first remaining as cover
    if (updated.length > 0 && !updated.some(i => i.isCover)) {
      updated[0].isCover = true;
    }
    onChange({ images: updated });
  };

  const updateImageCaption = (id: string, caption: string) => {
    const updated = images.map(img => img.id === id ? { ...img, name: caption } : img);
    onChange({ images: updated });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Intro Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Step 6 of 8</span>
        </div>
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Gallery & Work Portfolio</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Upload clear photos of your past projects, tools, workshop, or team. Real photos build customer trust!
        </p>
      </div>

      {/* Uploader Box */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div
          onDragOver={e => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={e => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
            dragActive
              ? 'border-amber-500 bg-amber-50/50 scale-[0.99]'
              : 'border-slate-200 hover:border-amber-400 bg-slate-50/40 hover:bg-slate-50'
          }`}
        >
          <input
            type="file"
            id="service-image-upload"
            multiple
            accept="image/*"
            onChange={e => handleFiles(e.target.files)}
            className="hidden"
          />

          <label htmlFor="service-image-upload" className="cursor-pointer block">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-800">
              Drag & Drop your project photos here, or <span className="text-amber-600 underline">Browse Files</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Supports JPG, PNG, WEBP up to 10MB each. Up to 10 photos recommended.
            </p>
          </label>
        </div>

        {uploadError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            {uploadError}
          </div>
        )}

        {/* Uploaded Photos Grid */}
        {images.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Uploaded Work Photos ({images.length})
              </span>
              <span className="text-[11px] text-slate-500">
                Click <Star className="w-3 h-3 text-amber-500 inline" /> to select cover photo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {images.map((img) => (
                <div
                  key={img.id}
                  className={`p-3 bg-slate-50 border rounded-2xl flex items-center gap-3 relative transition-all ${
                    img.isCover ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/20' : 'border-slate-200'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.name || 'Work photo'}
                    className="w-20 h-20 object-cover rounded-xl shrink-0 border border-slate-200"
                  />

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <input
                      type="text"
                      value={img.name || ''}
                      onChange={e => updateImageCaption(img.id, e.target.value)}
                      placeholder="Caption (e.g. House Wiring in Kandy)"
                      className="w-full px-2 py-1 text-[11px] font-semibold bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                    />

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSetCover(img.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all flex items-center gap-1 ${
                          img.isCover
                            ? 'bg-amber-500 text-white border-amber-600'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Star className={`w-3 h-3 ${img.isCover ? 'fill-white' : ''}`} />
                        {img.isCover ? 'Cover Photo' : 'Set as Cover'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(img.id)}
                        className="text-[10px] font-bold text-rose-600 hover:text-rose-800 transition-colors ml-auto"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
