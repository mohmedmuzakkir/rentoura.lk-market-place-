import React from 'react';

interface RentouraLogoProps {
  variant?: 'header' | 'stacked' | 'horizontal' | 'icon-only' | 'footer';
  theme?: 'dark-header' | 'light' | 'dark';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const RentouraLogo: React.FC<RentouraLogoProps> = ({
  variant = 'header',
  theme = 'dark-header',
  className = '',
  size = 'md'
}) => {
  const isDark = theme === 'dark-header' || theme === 'dark';

  if (variant === 'icon-only') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        <svg viewBox="0 0 100 100" className="w-8 h-8 sm:w-9 sm:h-9 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="rGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0052FF" />
              <stop offset="50%" stopColor="#1464F4" />
              <stop offset="100%" stopColor="#00C2FF" />
            </linearGradient>
          </defs>
          <path
            d="M20 12 H62 C78 12 88 23 88 38 C88 52 77 62 62 64 L86 92 H68 L48 68 H36 V92 H20 V12 Z"
            fill="url(#rGrad1)"
          />
          <path
            d="M36 28 H60 C68 28 72 32 72 38 C72 44 68 48 60 48 H36 V28 Z"
            fill={isDark ? "#041C43" : "#FFFFFF"}
          />
          <path
            d="M36 68 L52 50 L68 68 L60 68 L52 59 L44 68 Z"
            fill="url(#rGrad1)"
          />
        </svg>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex flex-col items-start select-none ${className}`}>
        <div className="flex items-center gap-2">
          {/* Symbol */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(20,100,244,0.4)]" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="ftrRGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1464F4" />
                  <stop offset="60%" stopColor="#2F80ED" />
                  <stop offset="100%" stopColor="#00D2FF" />
                </linearGradient>
              </defs>
              <path
                d="M18 10 H64 C80 10 90 22 90 38 C90 53 78 63 63 65 L88 94 H68 L47 70 H36 V94 H18 V10 Z"
                fill="url(#ftrRGrad)"
              />
              <path
                d="M36 26 H62 C68 26 73 31 73 38 C73 45 68 50 62 50 H36 V26 Z"
                fill="#041C43"
              />
              <path
                d="M36 68 L52 50 L68 68 L59 68 L52 60 L45 68 Z"
                fill="#00D2FF"
              />
            </svg>
          </div>

          {/* Wordmark */}
          <div className="flex items-baseline tracking-tight font-black text-[20px] sm:text-[22px] leading-none">
            <span className="text-white tracking-[0.02em] font-heading font-black">
              RENTOURA
            </span>
            <span className="text-[#1464F4] font-black ml-0.5 tracking-normal">
              .LK
            </span>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-[10px] sm:text-[11px] font-semibold text-slate-400 mt-1 tracking-wide">
          Rentals · Jobs · Professional Services
        </p>
      </div>
    );
  }

  // Header / Default Logo Variant (Desktop & Mobile Responsive)
  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Symbol */}
        <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(20,100,244,0.4)]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="hdrRGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1464F4" />
                <stop offset="60%" stopColor="#2F80ED" />
                <stop offset="100%" stopColor="#00D2FF" />
              </linearGradient>
            </defs>
            <path
              d="M18 10 H64 C80 10 90 22 90 38 C90 53 78 63 63 65 L88 94 H68 L47 70 H36 V94 H18 V10 Z"
              fill="url(#hdrRGrad)"
            />
            <path
              d="M36 26 H62 C68 26 73 31 73 38 C73 45 68 50 62 50 H36 V26 Z"
              fill={isDark ? "#041C43" : "#FFFFFF"}
            />
            <path
              d="M36 68 L52 50 L68 68 L59 68 L52 60 L45 68 Z"
              fill="#00D2FF"
            />
          </svg>
        </div>

        {/* Wordmark */}
        <div className="flex items-baseline tracking-tight font-black text-[18px] sm:text-[21px] lg:text-[23px] leading-none">
          <span className={isDark ? "text-white tracking-[0.02em] font-heading font-black" : "text-[#041C43] tracking-[0.02em] font-heading font-black"}>
            RENTOURA
          </span>
          <span className="text-[#1464F4] font-black ml-0.5 tracking-normal">
            .LK
          </span>
        </div>
      </div>

      {/* Subtitle / Tagline - Desktop Only for Header to avoid mobile crowding */}
      <div className="hidden sm:flex items-center justify-center gap-1.5 mt-0.5 w-full">
        <span className="h-[1.5px] w-4 lg:w-5 bg-gradient-to-r from-transparent to-[#1464F4] rounded-full"></span>
        <span className={`text-[7.5px] lg:text-[8px] font-bold tracking-wider uppercase whitespace-nowrap ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Everything for Rent, All in One Place
        </span>
        <span className="h-[1.5px] w-4 lg:w-5 bg-gradient-to-l from-transparent to-[#1464F4] rounded-full"></span>
      </div>
    </div>
  );
};
