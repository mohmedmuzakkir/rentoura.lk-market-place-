import React from 'react';
import { Menu, Bell, ArrowLeft, Layers } from 'lucide-react';
import { RentouraLogo } from '../components/RentouraLogo';
import { AppRoute } from '../types';
import { UserListingItem } from '../types/profileTypes';
import { PostHero } from '../components/post/PostHero';
import { PostModuleCard, POST_MODULES_CONFIG } from '../components/post/PostModuleCard';
import { WhatHappensNext } from '../components/post/WhatHappensNext';
import { WhyPostWithUs } from '../components/post/WhyPostWithUs';
import { UserRecentActivity } from '../components/post/UserRecentActivity';
import { ProTipBanner } from '../components/post/ProTipBanner';

interface PostPageProps {
  onNavigate: (route: AppRoute) => void;
  onOpenDrawer?: () => void;
  unreadNotificationsCount?: number;
  userListings?: UserListingItem[];
}

export const PostPage: React.FC<PostPageProps> = ({
  onNavigate,
  onOpenDrawer,
  unreadNotificationsCount = 0,
  userListings = []
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-28 overflow-x-hidden">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 px-4 py-3 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Left: Drawer Menu / Back Button */}
          <div className="flex items-center gap-2">
            {onOpenDrawer ? (
              <button
                onClick={onOpenDrawer}
                aria-label="Open Menu Navigation"
                className="w-10 h-10 rounded-xl bg-slate-100/80 hover:bg-slate-200 text-slate-700 flex items-center justify-center tap-bounce transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => onNavigate('/')}
                aria-label="Go Back to Home"
                className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 text-xs font-bold tap-bounce"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
          </div>

          {/* Center: Rentoura Logo */}
          <div className="flex items-center justify-center cursor-pointer" onClick={() => onNavigate('/')}>
            <RentouraLogo className="h-6" />
          </div>

          {/* Right: Notifications button & My Listings shortcut */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onNavigate('/my-listings')}
              title="My Listings"
              aria-label="My Listings"
              className="p-2 sm:px-3 rounded-xl bg-slate-100/80 hover:bg-blue-50 text-slate-700 hover:text-[#1464F4] text-xs font-bold flex items-center gap-1 tap-bounce transition-colors"
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">My Listings</span>
            </button>

            <button
              onClick={() => onNavigate('/notifications')}
              aria-label="Notifications"
              className="relative w-10 h-10 rounded-xl bg-slate-100/80 hover:bg-slate-200 text-slate-700 flex items-center justify-center tap-bounce transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#EA384D] text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs animate-in zoom-in">
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-5 space-y-7">
        {/* 1. Hero Banner */}
        <PostHero />

        {/* 2. Three Primary Choices (Post a Rental, Post a Job, Offer your Service) */}
        <section className="space-y-3">
          <div className="text-left">
            <h2 className="text-lg font-black text-slate-900 font-heading">
              Select What You Want to Post
            </h2>
            <p className="text-xs text-slate-500">
              Each category includes specific fields, verified locations, and targeted discovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {POST_MODULES_CONFIG.map((config) => (
              <PostModuleCard
                key={config.id}
                config={config}
                onSelect={(route) => onNavigate(route)}
              />
            ))}
          </div>
        </section>

        {/* 3. Short "What happens next?" Moderation Lifecycle Explanation */}
        <WhatHappensNext />

        {/* 4. Why Post With Us Information */}
        <WhyPostWithUs />

        {/* 5. User's Recent Activity (Real Canonical Listings) */}
        <UserRecentActivity
          listings={userListings}
          onNavigate={onNavigate}
        />

        {/* 6. Pro Tip Guidelines Card */}
        <ProTipBanner />
      </main>
    </div>
  );
};
