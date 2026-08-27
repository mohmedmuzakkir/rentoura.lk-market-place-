import React from 'react';

export const MyListingsHero: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#091F4B] via-[#0E3585] to-[#1464F4] p-5 sm:p-6 text-white shadow-xl shadow-blue-950/15">
      {/* Background Decorative Mesh & Glows */}
      <div className="absolute -right-12 -bottom-12 w-56 h-56 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -top-12 w-48 h-48 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />
      
      {/* Subtle Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '16px 16px' }}
      />

      <div className="relative z-10 flex items-center justify-between gap-3">
        {/* Left Text Block */}
        <div className="max-w-[62%] sm:max-w-[65%] space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            My Listings
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 font-medium leading-relaxed">
            Manage all your rentals, jobs and services in one place.
          </p>
        </div>

        {/* Right 3D Marketplace Storefront Graphic Composition */}
        <div className="relative flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center select-none">
          <div className="relative w-full h-full flex items-center justify-center drop-shadow-2xl">
            {/* SVG 3D Isometric Storefront */}
            <svg 
              viewBox="0 0 140 140" 
              className="w-full h-full overflow-visible"
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Ground Glow & Shadow */}
              <ellipse cx="70" cy="118" rx="52" ry="12" fill="#06132D" fillOpacity="0.45" />
              
              {/* Main Store Building Block */}
              <rect x="24" y="48" width="92" height="66" rx="14" fill="url(#storeWallGrad)" stroke="#60A5FA" strokeWidth="1.5" />

              {/* Roof Wall Top Rim */}
              <path d="M22 48C22 42.4772 26.4772 38 32 38H108C113.523 38 118 42.4772 118 48V52H22V48Z" fill="#1E40AF" />

              {/* Striped Canopy / Awning (Blue & White) */}
              <path d="M18 52L26 72C27.5 75 31.5 75 33 72L40 52H18Z" fill="#3B82F6" />
              <path d="M40 52L44 72C45.5 75 49.5 75 51 72L58 52H40Z" fill="#F8FAFC" />
              <path d="M58 52L62 72C63.5 75 67.5 75 69 72L76 52H58Z" fill="#2563EB" />
              <path d="M76 52L80 72C81.5 75 85.5 75 87 72L94 52H76Z" fill="#F8FAFC" />
              <path d="M94 52L98 72C99.5 75 103.5 75 105 72L112 52H94Z" fill="#1D4ED8" />
              <path d="M112 52L115 72C116.5 75 120.5 75 122 72L124 52H112Z" fill="#F8FAFC" />

              {/* Glass Display Window with Storefront Glow */}
              <rect x="34" y="74" width="46" height="34" rx="8" fill="#0F2554" stroke="#93C5FD" strokeWidth="1.2" />
              <rect x="38" y="78" width="38" height="26" rx="4" fill="url(#windowGlow)" />
              <line x1="57" y1="78" x2="57" y2="104" stroke="#60A5FA" strokeWidth="1" strokeOpacity="0.6" />
              <line x1="38" y1="91" x2="76" y2="91" stroke="#60A5FA" strokeWidth="1" strokeOpacity="0.6" />

              {/* Modern Storefront Door with "R" Sign */}
              <rect x="86" y="72" width="22" height="38" rx="6" fill="#1E3A8A" stroke="#60A5FA" strokeWidth="1.2" />
              <rect x="90" y="78" width="14" height="18" rx="3" fill="#2563EB" />
              
              {/* Storefront signboard with the official RENTOURA.LK mark */}
              <g transform="translate(60, 22)">
                <rect x="-18" y="-12" width="36" height="24" rx="6" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
                <image href="/brand/rentoura-logo-mark.png" x="-10" y="-9" width="20" height="18" preserveAspectRatio="xMidYMid meet" />
              </g>

              {/* Little Potted Plant outside door */}
              <g transform="translate(112, 94)">
                <path d="M0 8L3 18H11L14 8H0Z" fill="#D97706" />
                <circle cx="5" cy="5" r="5" fill="#10B981" />
                <circle cx="10" cy="4" r="4.5" fill="#059669" />
                <circle cx="7" cy="1" r="4" fill="#34D399" />
              </g>

              {/* SVG Gradients */}
              <defs>
                <linearGradient id="storeWallGrad" x1="24" y1="48" x2="116" y2="114" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1E3A8A" />
                  <stop offset="1" stopColor="#0B1B3D" />
                </linearGradient>
                <linearGradient id="windowGlow" x1="38" y1="78" x2="76" y2="104" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#60A5FA" stopOpacity="0.4" />
                  <stop offset="1" stopColor="#1E40AF" stopOpacity="0.1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
