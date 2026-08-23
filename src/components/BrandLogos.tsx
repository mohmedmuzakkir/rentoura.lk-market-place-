import React from 'react';

interface CompanyLogoProps {
  brand: 'virtusa' | 'ndb' | 'wso2' | 'upwork' | 'ttec' | 'gitlab' | 'dialog' | 'mas' | 'daraz' | 'hnb' | 'softlogic' | 'lolc' | '99x';
  className?: string;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({ brand, className = '' }) => {
  switch (brand) {
    case 'virtusa':
      return (
        <div className={`bg-[#1E3A8A] text-white px-2 py-1.5 rounded-lg font-black text-xs tracking-tighter flex items-center justify-center font-sans ${className}`}>
          virtusa
        </div>
      );
    case 'ndb':
      return (
        <div className={`flex items-center gap-1 font-bold text-xs ${className}`}>
          <span className="w-2.5 h-3.5 bg-[#DC2626] -skew-x-12 inline-block rounded-xs"></span>
          <span className="text-[#DC2626] font-black italic tracking-tight">NDB</span>
          <span className="text-slate-600 font-semibold text-[10px]">bank</span>
        </div>
      );
    case 'wso2':
      return (
        <div className={`flex items-center gap-0.5 font-black text-xs text-[#E65100] ${className}`}>
          <span className="tracking-tighter">WS</span>
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#E65100]" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M2 12h4l3-7 4 14 3-7h6" />
          </svg>
          <span>2</span>
        </div>
      );
    case 'upwork':
      return (
        <div className={`w-8 h-8 rounded-lg bg-[#14A800] text-white font-extrabold text-xs flex items-center justify-center shadow-xs ${className}`}>
          up
        </div>
      );
    case 'ttec':
      return (
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] text-white font-black text-[11px] flex items-center justify-center shadow-xs ${className}`}>
          T
        </div>
      );
    case 'gitlab':
      return (
        <div className={`w-8 h-8 rounded-lg bg-[#1E293B] text-[#FC6D26] flex items-center justify-center p-1.5 shadow-xs ${className}`}>
          <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
            <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 5.48 2h.06a.43.43 0 0 1 .4.28L8.6 10.3h6.8l2.66-8.02a.43.43 0 0 1 .4-.28h.06a.42.42 0 0 1 .39.16l2.44 7.51 1.22 3.78a.84.84 0 0 1-.3.94z" />
          </svg>
        </div>
      );
    case 'dialog':
      return (
        <div className={`flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-slate-100 shadow-xs h-14 min-w-[76px] ${className}`}>
          <div className="flex items-center gap-0.5 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]"></span>
            <span className="w-1.5 h-2 rounded-full bg-[#EAB308]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
          </div>
          <span className="text-[#E11D48] font-bold text-[11px] tracking-tight">Dialog</span>
        </div>
      );
    case 'mas':
      return (
        <div className={`flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-slate-100 shadow-xs h-14 min-w-[76px] ${className}`}>
          <div className="flex items-center gap-1 font-black text-xs text-[#DC2626]">
            <span className="text-amber-500">▲</span>
            <span>MAS</span>
          </div>
          <span className="text-[7.5px] text-slate-400 font-bold tracking-tighter uppercase whitespace-nowrap">CHANGE IS COURAGE</span>
        </div>
      );
    case 'daraz':
      return (
        <div className={`flex items-center justify-center p-2 rounded-xl bg-white border border-slate-100 shadow-xs h-14 min-w-[76px] ${className}`}>
          <span className="text-[#FF5100] font-extrabold text-xs tracking-tight">daraz</span>
        </div>
      );
    case 'hnb':
      return (
        <div className={`flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-slate-100 shadow-xs h-14 min-w-[76px] ${className}`}>
          <span className="text-[#1E3A8A] font-black text-xs tracking-tight">HNB</span>
          <span className="text-[7px] text-slate-400 font-medium tracking-tighter whitespace-nowrap">PARTNER IN PROGRESS</span>
        </div>
      );
    case 'softlogic':
      return (
        <div className={`flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-slate-100 shadow-xs h-14 min-w-[76px] ${className}`}>
          <span className="text-[#0284C7] font-extrabold text-[11px] tracking-tight italic">softlogic</span>
        </div>
      );
    case 'lolc':
      return (
        <div className={`flex items-center justify-center p-2 rounded-xl bg-white border border-slate-100 shadow-xs h-14 min-w-[76px] ${className}`}>
          <div className="px-1.5 py-0.5 bg-[#1E3A8A] text-white font-black text-[10px] rounded-sm">
            LOLC
          </div>
        </div>
      );
    case '99x':
      return (
        <div className={`flex items-center justify-center p-2 rounded-xl bg-white border border-slate-100 shadow-xs h-14 min-w-[76px] ${className}`}>
          <span className="text-[#08A34F] font-black text-xs tracking-tight">99X</span>
        </div>
      );
    default:
      return null;
  }
};
