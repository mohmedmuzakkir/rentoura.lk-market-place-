import React from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';

interface CategoryFeaturesProps {
  features: string[];
}

export const CategoryFeatures: React.FC<CategoryFeaturesProps> = ({ features = [] }) => {
  if (!features || features.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
        <Sparkles className="w-3.5 h-3.5 text-[#1464F4]" />
        <span>Key Features & Amenities</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50/70 border border-blue-100 text-slate-800 text-xs font-medium"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1464F4] shrink-0" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
