import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface PostHeroProps {
  onExploreModule?: (module: 'rentals' | 'jobs' | 'services') => void;
}

export const PostHero: React.FC<PostHeroProps> = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#041C43] via-[#0A2E6E] to-[#1464F4] text-white p-6 sm:p-8 shadow-xl">
      {/* Background Decorative Rings and Glows */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 bg-emerald-400/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-32 h-32 bg-orange-400/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Content */}
        <div className="max-w-md text-left space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-100 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>Post & Reach All 9 Provinces</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight font-heading">
            What would you like to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200 underline decoration-blue-400/60 decoration-wavy decoration-2">
              post
            </span>{' '}
            today?
          </h1>

          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Choose the right category to publish your listing, find verified clients, and grow your presence across Sri Lanka.
          </p>

          {/* Key Trust Points */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-[11px] text-blue-200 font-medium">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Free draft autosaving
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Guided 3-min forms
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified inquiries
            </span>
          </div>
        </div>

        {/* Right Graphic / Phone Mockup Card */}
        <div className="relative flex-shrink-0 w-full sm:w-64">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/15 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-200">
                RENTOURA POST
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/15 border border-white/10">
                <div className="w-7 h-7 rounded-lg bg-[#1464F4] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  🏠
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-white truncate">Rentals</p>
                  <p className="text-[9px] text-blue-200 truncate">Properties, Vehicles & Items</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/15 border border-white/10">
                <div className="w-7 h-7 rounded-lg bg-[#08A34F] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  💼
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-white truncate">Jobs</p>
                  <p className="text-[9px] text-emerald-200 truncate">Hiring & Vacancies</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/15 border border-white/10">
                <div className="w-7 h-7 rounded-lg bg-[#FF650A] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  🛠️
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-white truncate">Services</p>
                  <p className="text-[9px] text-orange-200 truncate">Home & Professional</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
