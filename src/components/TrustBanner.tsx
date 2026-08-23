import React from 'react';
import { ShieldCheck, ChevronRight, CheckCircle2 } from 'lucide-react';

interface TrustBannerProps {
  onLearnMore: () => void;
}

export const TrustBanner: React.FC<TrustBannerProps> = ({ onLearnMore }) => {
  return (
    <section className="px-4 lg:px-8 mt-8 mb-16 lg:mb-20 max-w-md lg:max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-[#041C43] via-[#083070] to-[#0A3D94] rounded-2xl lg:rounded-3xl p-3.5 lg:p-8 shadow-lg border border-blue-400/20 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Shield Badge + Main Title */}
        <div className="flex items-center gap-3 lg:gap-4 w-full md:w-auto">
          <div className="w-11 h-11 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-[#1464F4]/30 border border-[#1464F4]/50 flex items-center justify-center text-white shrink-0 shadow-inner">
            <ShieldCheck className="w-6 h-6 lg:w-8 lg:h-8 text-[#2E86FF] stroke-[2.2]" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-white text-[12.5px] lg:text-xl font-bold tracking-tight leading-tight font-heading">
              Trusted Marketplace for Sri Lanka
            </h3>
            <p className="text-blue-100/80 text-[10px] lg:text-xs leading-tight mt-0.5 lg:mt-1 font-normal">
              Your safety is our priority. Every listing is reviewed for a safer experience.
            </p>
          </div>
        </div>

        {/* Desktop Trust Highlights */}
        <div className="hidden lg:flex items-center gap-6 text-xs text-blue-100 font-medium border-x border-white/10 px-8 py-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Verified Phone Contacts</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Active Spam Monitoring</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Direct Provider Chat</span>
          </div>
        </div>

        {/* Right: Pill Button */}
        <button
          onClick={onLearnMore}
          className="shrink-0 w-full md:w-auto px-4 py-2 lg:px-6 lg:py-3 rounded-full bg-[#1464F4] hover:bg-[#0f54d4] active:bg-[#1464F4] text-white border border-[#1464F4]/60 text-[11px] lg:text-xs font-bold flex items-center justify-center gap-1.5 transition-all tap-bounce whitespace-nowrap shadow-md"
        >
          Learn More <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>
    </section>
  );
};
