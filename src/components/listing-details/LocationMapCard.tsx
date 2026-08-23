import React from 'react';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';

interface LocationMapCardProps {
  location: {
    province: string;
    district: string;
    city: string;
    area?: string;
    address?: string;
    lat?: number;
    lng?: number;
  };
  themeColor?: string;
}

export const LocationMapCard: React.FC<LocationMapCardProps> = ({
  location,
  themeColor = '#1464F4'
}) => {
  if (!location) return null;

  const fullLocationString = [
    location.area,
    location.city,
    location.district,
    location.province
  ]
    .filter(Boolean)
    .join(', ');

  const handleOpenGoogleMaps = () => {
    const query = location.lat && location.lng 
      ? `${location.lat},${location.lng}` 
      : encodeURIComponent(`${location.city}, ${location.district || ''}, Sri Lanka`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <MapPin className="w-3.5 h-3.5" style={{ color: themeColor }} />
            <span>Location</span>
          </div>
          <p className="text-xs font-medium text-slate-600 mt-0.5">
            {fullLocationString}
          </p>
        </div>

        <button
          onClick={handleOpenGoogleMaps}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all tap-bounce"
        >
          <ExternalLink className="w-3.5 h-3.5" style={{ color: themeColor }} />
          <span>Open in Maps</span>
        </button>
      </div>

      {/* Stylized Map View Box */}
      <div 
        onClick={handleOpenGoogleMaps}
        className="relative w-full h-36 rounded-xl overflow-hidden bg-emerald-50/50 border border-slate-200 cursor-pointer group select-none"
      >
        {/* Stylized Map Graphic background */}
        <div className="absolute inset-0 bg-[#E8F1EC] opacity-80" />
        
        {/* Road/Water vectors pattern simulation */}
        <svg className="absolute inset-0 w-full h-full text-white/80" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 Q150,20 300,70 T600,30" fill="none" stroke="#D1E2D8" strokeWidth="16" />
          <path d="M0,40 Q150,20 300,70 T600,30" fill="none" stroke="#FFFFFF" strokeWidth="10" />
          <path d="M100,0 Q180,80 220,150" fill="none" stroke="#D1E2D8" strokeWidth="12" />
          <path d="M100,0 Q180,80 220,150" fill="none" stroke="#FFFFFF" strokeWidth="8" />
          <path d="M350,150 Q400,90 480,0" fill="none" stroke="#D1E2D8" strokeWidth="10" />
          {/* Lake/Water shape */}
          <path d="M40,70 Q120,60 160,95 Q140,130 60,120 Z" fill="#BAE6FD" opacity="0.6" />
        </svg>

        {/* Landmarks Labels */}
        <div className="absolute top-4 left-6 text-[9.5px] font-bold text-slate-500 bg-white/70 px-1.5 py-0.5 rounded-md shadow-2xs">
          {location.city || 'Kandy'} Center
        </div>
        <div className="absolute bottom-4 right-8 text-[9.5px] font-bold text-slate-500 bg-white/70 px-1.5 py-0.5 rounded-md shadow-2xs">
          {location.area || 'Heritage Zone'}
        </div>

        {/* Center Animated Map Pin */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-xl animate-bounce"
            style={{ backgroundColor: themeColor }}
          >
            <Navigation className="w-5 h-5 fill-white" />
          </div>
          <div className="w-4 h-1.5 bg-slate-800/30 rounded-full blur-[1px] -mt-1" />
        </div>

        {/* Tap to open overlay hover */}
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors flex items-end justify-center pb-2">
          <span className="text-[10px] font-bold text-slate-700 bg-white/90 px-2 py-0.5 rounded-full shadow-xs">
            Tap to navigate with Google Maps
          </span>
        </div>
      </div>
    </div>
  );
};
