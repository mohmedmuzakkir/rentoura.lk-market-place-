import React from 'react';
import { RentouraLogo } from './RentouraLogo';
import { AppRoute } from '../types';
import { ShieldCheck, HelpCircle, FileText, Heart, Plus, MapPin, PhoneCall } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: AppRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#041C43] text-slate-300 border-t border-slate-800/80 pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800/80">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <RentouraLogo variant="footer" theme="dark-header" />
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-normal">
              RENTOURA.LK is a trusted marketplace for rentals, jobs and professional services across Sri Lanka.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-[#1464F4]" />
                Kandy, Sri Lanka
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified Marketplace
              </span>
            </div>
          </div>

          {/* Column 1: Marketplace */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-bold tracking-wide uppercase font-heading">Marketplace</h4>
            <ul className="space-y-2 text-sm text-slate-400 font-medium">
              <li>
                <button onClick={() => onNavigate('/rentals')} className="hover:text-white transition-colors">
                  Rentals & Properties
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/jobs')} className="hover:text-white transition-colors">
                  Job Openings
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/services')} className="hover:text-white transition-colors">
                  Services & Experts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/search')} className="hover:text-white transition-colors">
                  Search All Listings
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/post')} className="text-[#1464F4] hover:text-blue-400 font-semibold flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5 stroke-[3]" /> Post an Ad
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Safety & Support */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-bold tracking-wide uppercase font-heading">Safety & Help</h4>
            <ul className="space-y-2 text-sm text-slate-400 font-medium">
              <li>
                <button onClick={() => onNavigate('/safety')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Safety Center
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/help')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-400" /> Help & Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/agreement')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" /> Terms & User Agreement
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/agreement')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-bold tracking-wide uppercase font-heading">My Account</h4>
            <ul className="space-y-2 text-sm text-slate-400 font-medium">
              <li>
                <button onClick={() => onNavigate('/saved')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400" /> Saved Items
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/messages')} className="hover:text-white transition-colors">
                  My Messages
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/profile')} className="hover:text-white transition-colors">
                  Profile & Settings
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/my-listings')} className="hover:text-white transition-colors">
                  My Active Listings
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 RENTOURA.LK. All rights reserved. Sri Lanka Marketplace.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('/agreement')} className="hover:text-slate-300">Terms of Use</button>
            <button onClick={() => onNavigate('/agreement')} className="hover:text-slate-300">Privacy Policy</button>
            <button onClick={() => onNavigate('/safety')} className="hover:text-slate-300">Safety Guidelines</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
