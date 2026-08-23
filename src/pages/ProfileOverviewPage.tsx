import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { AppRoute } from '../types';
import { UserProfile, UserListingItem, UserReviewItem, UserReportItem } from '../types/profileTypes';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ProfileHero } from '../components/profile/ProfileHero';
import { ProfileMetricsBar } from '../components/profile/ProfileMetricsBar';
import { ProfileQuickActions } from '../components/profile/ProfileQuickActions';
import { MyListingsSection } from '../components/profile/MyListingsSection';
import { ProfileMenuGrid } from '../components/profile/ProfileMenuGrid';
import { ProfileSafetyCard } from '../components/profile/ProfileSafetyCard';
import { ProfileModals } from '../components/profile/ProfileModals';

interface ProfileOverviewPageProps {
  profile: UserProfile;
  listings: UserListingItem[];
  savedCount: number;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  reviews: UserReviewItem[];
  reports: UserReportItem[];
  onNavigate: (route: AppRoute) => void;
  onOpenListingDetail?: (listingId: string, module: 'rentals' | 'jobs' | 'services') => void;
  onDeleteListing?: (listingId: string) => void;
  onLogout?: () => void;
}

export const ProfileOverviewPage: React.FC<ProfileOverviewPageProps> = ({
  profile,
  listings,
  savedCount,
  unreadMessagesCount,
  unreadNotificationsCount,
  reviews,
  reports,
  onNavigate,
  onOpenListingDetail,
  onDeleteListing,
  onLogout
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Derived real metrics from shared state
  const totalListings = listings.length;
  const activeListings = listings.filter(l => l.status === 'active').length;
  const pendingListings = listings.filter(l => l.status === 'pending').length;
  const reviewsCount = reviews.length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-28 overflow-x-hidden">
      {/* 1. Header with Notifications & Brand */}
      <ProfileHeader
        onNavigate={onNavigate}
        unreadNotificationsCount={unreadNotificationsCount}
        unreadMessagesCount={unreadMessagesCount}
        onOpenSettingsModal={() => onNavigate('/profile/edit')}
      />

      {/* 2. Top Profile Hero (Navy / Royal Blue Gradient) */}
      <ProfileHero
        profile={profile}
        onEditProfile={() => onNavigate('/profile/edit')}
        onAvatarClick={() => onNavigate('/profile/edit')}
      />

      {/* 3. Real Account Metrics Bar */}
      <ProfileMetricsBar
        totalListings={totalListings}
        activeListings={activeListings}
        pendingListings={pendingListings}
        savedCount={savedCount}
        messagesCount={unreadMessagesCount}
        reviewsCount={reviewsCount}
        onNavigate={onNavigate}
        onSelectListingFilter={(filter) => {
          // Scroll smoothly to My Listings section
          const el = document.getElementById('my-listings-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onOpenReviewsModal={() => onNavigate('/reviews')}
      />

      {/* 4. Quick Actions & Featured Member Card */}
      <ProfileQuickActions
        onNavigate={onNavigate}
        onOpenUpgradeModal={() => setActiveModal('upgrade')}
      />

      {/* 5. My Listings Preview Section */}
      <div id="my-listings-section">
        <MyListingsSection
          listings={listings}
          onNavigate={onNavigate}
          onOpenListingDetail={onOpenListingDetail}
          onDeleteListing={onDeleteListing}
        />
      </div>

      {/* 6. Profile Menu Grid */}
      <ProfileMenuGrid
        userProfile={profile}
        onNavigate={onNavigate}
        onOpenReviewsModal={() => setActiveModal('reviews')}
        onOpenVerificationModal={() => setActiveModal('verification')}
        onOpenPaymentsModal={() => setActiveModal('payments')}
        onOpenReportsModal={() => setActiveModal('reports')}
        onOpenSecurityModal={() => setActiveModal('security')}
        onOpenHelpModal={() => setActiveModal('help')}
      />

      {/* 7. Safety First Card */}
      <ProfileSafetyCard
        onLearnMore={() => setActiveModal('help')}
      />

      {/* 8. Logout Button */}
      <div className="max-w-xl mx-auto px-4 mt-6">
        <button
          onClick={() => setActiveModal('logout')}
          className="w-full py-3.5 bg-rose-50/80 hover:bg-rose-100/90 text-rose-600 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 border border-rose-200/80 transition-all tap-bounce shadow-xs"
        >
          <LogOut className="w-4 h-4" />
          Log Out of RENTOURA.LK
        </button>
      </div>

      {/* Sub Modals */}
      <ProfileModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        profile={profile}
        reviews={reviews}
        reports={reports}
        onConfirmLogout={onLogout}
      />
    </div>
  );
};
