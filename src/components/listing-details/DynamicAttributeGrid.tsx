import React from 'react';
import { 
  Calendar, 
  Fuel, 
  Gauge, 
  Users, 
  Palette, 
  Layers, 
  Check, 
  Info,
  Car,
  Home,
  Shield,
  Zap,
  Tag
} from 'lucide-react';
import { ListingAttribute } from '../../types/listingDetailsTypes';

interface DynamicAttributeGridProps {
  attributes: ListingAttribute[];
  themeColor?: string;
}

export const DynamicAttributeGrid: React.FC<DynamicAttributeGridProps> = ({ attributes = [], themeColor = '#1464F4' }) => {
  if (!attributes || attributes.length === 0) return null;

  const renderIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'calendar':
        return <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: themeColor }} />;
      case 'fuel':
        return <Fuel className="w-3.5 h-3.5 shrink-0" style={{ color: themeColor }} />;
      case 'gauge':
      case 'speed':
        return <Gauge className="w-3.5 h-3.5 shrink-0" style={{ color: themeColor }} />;
      case 'users':
      case 'user':
        return <Users className="w-3.5 h-3.5 shrink-0" style={{ color: themeColor }} />;
      case 'palette':
      case 'color':
        return <Palette className="w-3.5 h-3.5 shrink-0" style={{ color: themeColor }} />;
      case 'car':
        return <Car className="w-3.5 h-3.5 shrink-0" style={{ color: themeColor }} />;
      case 'home':
        return <Home className="w-3.5 h-3.5 shrink-0" style={{ color: themeColor }} />;
      case 'zap':
        return <Zap className="w-3.5 h-3.5 shrink-0" style={{ color: themeColor }} />;
      default:
        return <Tag className="w-3.5 h-3.5 shrink-0" style={{ color: themeColor }} />;
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-2 border-t border-slate-100">
      {attributes.map((attr, idx) => (
        <div
          key={idx}
          className="bg-slate-50/90 rounded-2xl p-2.5 border border-slate-100 flex flex-col justify-center"
        >
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">
            {renderIcon(attr.iconName)}
            <span className="truncate">{attr.label}</span>
          </div>
          <span className="text-xs font-bold text-slate-900 truncate">
            {attr.value}
          </span>
        </div>
      ))}
    </div>
  );
};
