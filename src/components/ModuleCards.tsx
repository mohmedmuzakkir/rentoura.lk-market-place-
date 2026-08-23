import React from 'react';
import { Home, Briefcase, Wrench, ArrowRight } from 'lucide-react';
import { AppRoute } from '../types';

interface ModuleCardsProps {
  onNavigate: (route: AppRoute) => void;
  stats?: {
    activeRentalCount: number;
    activeJobCount: number;
    activeServiceCount: number;
    totalActiveListings: number;
  };
}

export const ModuleCards: React.FC<ModuleCardsProps> = ({ onNavigate, stats }) => {
  return (
    <section className="px-4 mt-6 max-w-md lg:max-w-7xl mx-auto">
      <div className="grid grid-cols-3 lg:grid-cols-3 gap-2.5 lg:gap-6">
        {/* 1. RENTALS CARD */}
        <button
          onClick={() => onNavigate('/rentals')}
          className="relative h-[210px] lg:h-[230px] rounded-2xl lg:rounded-3xl overflow-hidden bg-gradient-to-b from-[#1464F4] via-[#0E52CD] to-[#041C43] text-left p-3.5 lg:p-6 flex flex-col justify-between shadow-[0_8px_20px_rgba(20,100,244,0.25)] hover:shadow-xl border border-blue-400/20 group tap-bounce cursor-pointer transition-all duration-300"
        >
          <div className="relative z-10 flex items-start justify-between w-full">
            <span className="text-[10px] lg:text-xs font-extrabold tracking-wider text-white/90 uppercase">
              RENTALS
            </span>
            <div className="w-7 h-7 lg:w-9 lg:h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/25 shadow-sm">
              <Home className="w-3.5 h-3.5 lg:w-4 lg:h-4 stroke-[2.5]" />
            </div>
          </div>

          <div className="relative z-10 mt-1">
            <h3 className="text-white font-extrabold text-[15px] lg:text-2xl leading-tight font-heading">
              Rent<br className="lg:hidden" /> Anything
            </h3>
            <p className="text-blue-100 text-[9.5px] lg:text-xs leading-snug mt-1 font-medium opacity-90">
              {stats !== undefined ? `${stats.activeRentalCount} Active Ads` : 'Homes, Vehicles & More'}
            </p>
          </div>

          <div className="relative z-10 flex items-end justify-between w-full mt-auto pt-2">
            <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-white flex items-center justify-center text-[#1464F4] shadow-md group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-3.5 h-3.5 lg:w-4 lg:h-4 stroke-[3]" />
            </div>
          </div>

          <div className="absolute -bottom-1 -right-2 w-28 lg:w-48 h-24 lg:h-36 pointer-events-none opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-300">
            <img
              src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=400&q=80"
              alt="Rentals Marketplace"
              className="w-full h-full object-cover object-center rounded-tl-2xl shadow-inner"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#041C43]/80 via-transparent to-transparent" />
          </div>
        </button>

        {/* 2. JOBS CARD */}
        <button
          onClick={() => onNavigate('/jobs')}
          className="relative h-[210px] lg:h-[230px] rounded-2xl lg:rounded-3xl overflow-hidden bg-gradient-to-b from-[#08A34F] via-[#067A3B] to-[#033D1D] text-left p-3.5 lg:p-6 flex flex-col justify-between shadow-[0_8px_20px_rgba(8,163,79,0.25)] hover:shadow-xl border border-emerald-400/20 group tap-bounce cursor-pointer transition-all duration-300"
        >
          <div className="relative z-10 flex items-start justify-between w-full">
            <span className="text-[10px] lg:text-xs font-extrabold tracking-wider text-white/90 uppercase">
              JOBS
            </span>
            <div className="w-7 h-7 lg:w-9 lg:h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/25 shadow-sm">
              <Briefcase className="w-3.5 h-3.5 lg:w-4 lg:h-4 stroke-[2.5]" />
            </div>
          </div>

          <div className="relative z-10 mt-1">
            <h3 className="text-white font-extrabold text-[15px] lg:text-2xl leading-tight font-heading">
              Find<br className="lg:hidden" /> Jobs
            </h3>
            <p className="text-emerald-100 text-[9.5px] lg:text-xs leading-snug mt-1 font-medium opacity-90">
              {stats !== undefined ? `${stats.activeJobCount} Active Openings` : 'Discover Vacancies'}
            </p>
          </div>

          <div className="relative z-10 flex items-end justify-between w-full mt-auto pt-2">
            <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-white flex items-center justify-center text-[#08A34F] shadow-md group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-3.5 h-3.5 lg:w-4 lg:h-4 stroke-[3]" />
            </div>
          </div>

          <div className="absolute -bottom-1 -right-2 w-28 lg:w-48 h-24 lg:h-36 pointer-events-none opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-300">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80"
              alt="Jobs Marketplace"
              className="w-full h-full object-cover object-center rounded-tl-2xl shadow-inner"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#033D1D]/80 via-transparent to-transparent" />
          </div>
        </button>

        {/* 3. SERVICES CARD */}
        <button
          onClick={() => onNavigate('/services')}
          className="relative h-[210px] lg:h-[230px] rounded-2xl lg:rounded-3xl overflow-hidden bg-gradient-to-b from-[#FF650A] via-[#D84F00] to-[#602000] text-left p-3.5 lg:p-6 flex flex-col justify-between shadow-[0_8px_20px_rgba(255,101,10,0.25)] hover:shadow-xl border border-orange-400/20 group tap-bounce cursor-pointer transition-all duration-300"
        >
          <div className="relative z-10 flex items-start justify-between w-full">
            <span className="text-[10px] lg:text-xs font-extrabold tracking-wider text-white/90 uppercase">
              SERVICES
            </span>
            <div className="w-7 h-7 lg:w-9 lg:h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/25 shadow-sm">
              <Wrench className="w-3.5 h-3.5 lg:w-4 lg:h-4 stroke-[2.5]" />
            </div>
          </div>

          <div className="relative z-10 mt-1">
            <h3 className="text-white font-extrabold text-[15px] lg:text-2xl leading-tight font-heading">
              Book<br className="lg:hidden" /> Services
            </h3>
            <p className="text-orange-100 text-[9.5px] lg:text-xs leading-snug mt-1 font-medium opacity-90">
              {stats !== undefined ? `${stats.activeServiceCount} Verified Pros` : 'Trusted Technicians'}
            </p>
          </div>

          <div className="relative z-10 flex items-end justify-between w-full mt-auto pt-2">
            <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-white flex items-center justify-center text-[#FF650A] shadow-md group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-3.5 h-3.5 lg:w-4 lg:h-4 stroke-[3]" />
            </div>
          </div>

          <div className="absolute -bottom-1 -right-2 w-28 lg:w-48 h-24 lg:h-36 pointer-events-none opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-300">
            <img
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80"
              alt="Services Marketplace"
              className="w-full h-full object-cover object-center rounded-tl-2xl shadow-inner"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#602000]/80 via-transparent to-transparent" />
          </div>
        </button>
      </div>
    </section>
  );
};
