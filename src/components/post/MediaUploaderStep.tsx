import React, { useRef, useState } from 'react';
import { UploadedImage } from '../../types/postFormTypes';
import { Upload, X, Star, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface MediaUploaderStepProps {
  images: UploadedImage[];
  onChangeImages: (images: UploadedImage[]) => void;
  maxImages?: number;
  accentColor?: string;
}

export const MediaUploaderStep: React.FC<MediaUploaderStepProps> = ({
  images,
  onChangeImages,
  maxImages = 10,
  accentColor = '#1464F4'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMsg(null);

    const validFiles: UploadedImage[] = [];
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Only JPG, PNG and WebP images are allowed.');
        continue;
      }
      if (file.size > maxSizeBytes) {
        setErrorMsg(`"${file.name}" exceeds 5MB limit. Please choose smaller photos.`);
        continue;
      }

      const tempUrl = URL.createObjectURL(file);
      validFiles.push({
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        url: tempUrl,
        name: file.name,
        size: file.size,
        file: file,
        isCover: images.length === 0 && validFiles.length === 0
      });
    }

    const merged = [...images, ...validFiles].slice(0, maxImages);
    onChangeImages(merged);
  };

  const handleRemove = (id: string) => {
    const next = images.filter(img => img.id !== id);
    // If removed cover, make first remaining as cover
    if (next.length > 0 && !next.some(img => img.isCover)) {
      next[0].isCover = true;
    }
    onChangeImages(next);
  };

  const handleSetCover = (id: string) => {
    const next = images.map(img => ({
      ...img,
      isCover: img.id === id
    }));
    onChangeImages(next);
  };

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-800">
            Upload Real Photos ({images.length}/{maxImages})
          </h4>
          <p className="text-[11px] text-slate-500">
            First photo will be your listing's primary cover image.
          </p>
        </div>
        {images.length > 0 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-bold text-[#1464F4] hover:text-blue-700 tap-bounce"
          >
            + Add more
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* Drop Zone */}
      {images.length < maxImages && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
            dragActive
              ? 'border-blue-500 bg-blue-50/80 scale-[1.01]'
              : 'border-slate-300 hover:border-blue-400 bg-slate-50/70 hover:bg-blue-50/30'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-100/80 text-[#1464F4] flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-800">
            Click to upload photos or drag & drop
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Supports JPG, PNG, WEBP up to 5MB each
          </p>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-1.5 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Uploaded Gallery Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {images.map((img, index) => (
            <div
              key={img.id}
              className="group relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 aspect-square shadow-xs"
            >
              <img
                src={img.url}
                alt="Upload preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Cover badge */}
              {img.isCover && (
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#1464F4] text-white text-[9px] font-extrabold tracking-wider uppercase shadow-md flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 fill-white" /> Cover
                </div>
              )}

              {/* Action overlay */}
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!img.isCover && (
                  <button
                    type="button"
                    onClick={() => handleSetCover(img.id)}
                    title="Make Cover"
                    className="p-1.5 rounded-lg bg-white/90 text-slate-700 hover:bg-white text-[10px] font-bold tap-bounce"
                  >
                    Set Cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(img.id)}
                  title="Remove Image"
                  className="p-1.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600 tap-bounce"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
