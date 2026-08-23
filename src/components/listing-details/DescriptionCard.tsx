import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

interface DescriptionCardProps {
  title?: string;
  description?: string;
  themeColor?: string;
}

export const DescriptionCard: React.FC<DescriptionCardProps> = ({
  title = 'Description',
  description = '',
  themeColor = '#1464F4'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!description) return null;

  const isLong = description.length > 220;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-xs space-y-2.5">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
        <Info className="w-4 h-4" style={{ color: themeColor }} />
        <span>{title}</span>
      </div>

      <div className="text-xs leading-relaxed text-slate-700 whitespace-pre-line">
        <p className={!isExpanded && isLong ? 'line-clamp-3' : ''}>
          {description}
        </p>
      </div>

      {isLong && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-bold flex items-center gap-1 hover:underline pt-1 tap-bounce"
          style={{ color: themeColor }}
        >
          <span>{isExpanded ? 'Show Less' : 'Read Full Description'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      )}
    </div>
  );
};
