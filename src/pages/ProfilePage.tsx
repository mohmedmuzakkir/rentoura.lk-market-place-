import React from 'react';
import { ArrowLeft, User, ShieldCheck, Settings, HelpCircle, PhoneCall, LogOut, ChevronRight, FileText, Heart, ShieldAlert, Plus, LayoutDashboard } from 'lucide-react';
import { AppRoute } from '../types';

interface ProfilePageProps {
  onNavigate: (route: AppRoute) => void;
  onLogout?: () => void | Promise<void>;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate, onLogout }) => {
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      if (onLogout) {
        await onLogout();
      } else {
        onNavigate('/');
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24 overflow-x-hidden">
      {/* Header */}
      <div className="bg-[#041C43] px-4 py-4 lg:py-8 text-white">
        <div className="max-w-md lg:max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-1.5 text-white/90 hover:text-white text-xs lg:text-sm font-semibold tap-bounce"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <h1 className="text-base lg:text-2xl font-bold font-heading">
            My Account & Profile
          </h1>
          <div className="w-8" />
        </div>
      </div>

      <div className="max-w-md lg:max-w-7xl mx-auto p-4 lg:p-8 space-y-4 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8 items-start">
        {/* Left Column (User Card & Quick Stats) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-5 lg:p-6 border border-slate-200/80 shadow-md flex items-center gap-4">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-tr from-[#1464F4] to-[#00D2FF] text-white flex items-center justify-center text-xl lg:text-2xl font-bold shadow-md ring-4 ring-blue-50 shrink-0">
              LK
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg lg:text-xl font-bold text-slate-900 font-heading">Rentoura Member</h2>
                <ShieldCheck className="w-4 h-4 text-[#1464F4]" />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Member Account</p>
              <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10.5px] font-bold border border-emerald-200">
                <span>Active Member</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm grid grid-cols-3 gap-3 text-center">
            <div className="p-2 bg-slate-50 rounded-2xl">
              <p className="text-lg font-black text-[#1464F4]">0</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Active Ads</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-2xl">
              <p className="text-lg font-black text-emerald-600">0%</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Response</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-2xl">
              <p className="text-lg font-black text-amber-500">0 ★</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Rating</p>
            </div>
          </div>
        </div>

        {/* Right Column (Actions & Settings) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md divide-y divide-slate-100 overflow-hidden">
            <button
              onClick={() => onNavigate('/post')}
              className="w-full p-4 hover:bg-slate-50 flex items-center justify-between text-left transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1464F4] flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#1464F4] transition-colors">Post a New Ad</h3>
                  <p className="text-xs text-slate-500">List rentals, jobs, or professional services</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('/saved')}
              className="w-full p-4 hover:bg-slate-50 flex items-center justify-between text-left transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#1464F4] transition-colors">Saved Listings</h3>
                  <p className="text-xs text-slate-500">Quick access to your bookmarked items</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('/admin')}
              className="w-full p-4 hover:bg-slate-50 flex items-center justify-between text-left transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold">
                  <LayoutDashboard className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#1464F4] transition-colors">Admin Dashboard</h3>
                  <p className="text-xs text-slate-500">Platform operations, listings moderation & analytics</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('/help')}
              className="w-full p-4 hover:bg-slate-50 flex items-center justify-between text-left transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#1464F4] transition-colors">Help & Support</h3>
                  <p className="text-xs text-slate-500">FAQs, safety tips, and customer assistance</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full py-3.5 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 font-bold text-xs lg:text-sm rounded-2xl border border-rose-200/80 flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            {isLoggingOut ? 'Signing out...' : 'Sign Out of RENTOURA.LK'}
          </button>
        </div>
      </div>
    </div>
  );
};
