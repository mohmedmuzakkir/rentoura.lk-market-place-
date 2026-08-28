import React from 'react';

export const BRAND_ASSETS = { mark: '/brand/rentoura-official-icon-512.png' } as const;

interface RentouraLogoProps {
  variant?: 'header' | 'stacked' | 'horizontal' | 'icon-only' | 'footer';
  theme?: 'dark-header' | 'light' | 'dark';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

const dimensions = { sm: 'h-8 sm:h-9', md: 'h-9 sm:h-10', lg: 'h-12 sm:h-14', xl: 'h-16 sm:h-20' };

export const RentouraLogo: React.FC<RentouraLogoProps> = ({ variant = 'header', theme = 'dark-header', className = '', size = 'md', showTagline = false }) => {
  const dark = theme === 'dark-header' || theme === 'dark';
  const iconOnly = variant === 'icon-only';
  const stacked = variant === 'stacked';
  return <span className={`inline-flex ${stacked ? 'flex-col' : 'flex-row'} items-center justify-center gap-2 select-none ${className}`}>
    <img src={BRAND_ASSETS.mark} alt="RENTOURA.LK logo" width="512" height="512" className={`${dimensions[size]} w-auto shrink-0 rounded-[22%] object-contain`} decoding="async" draggable={false} />
    {!iconOnly && <span className={stacked ? 'text-center' : ''}>
      <span className={`block whitespace-nowrap font-heading text-lg font-black leading-none tracking-[0.02em] sm:text-xl ${dark ? 'text-white' : 'text-[#041C43]'}`}>RENTOURA<span className="text-[#1464F4]">.LK</span></span>
      {(showTagline || variant === 'footer') && <span className={`mt-1 hidden whitespace-nowrap text-[8px] font-bold uppercase tracking-wider sm:block ${dark ? 'text-slate-300' : 'text-slate-500'}`}>Rentals · Jobs · Services</span>}
    </span>}
  </span>;
};
