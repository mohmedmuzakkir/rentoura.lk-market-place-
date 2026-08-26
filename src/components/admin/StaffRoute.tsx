import React, { useEffect } from 'react';
import { AlertCircle, RotateCw, LogOut } from 'lucide-react';
import { AppRoute } from '../../types';
import { UserProfile } from '../../types/profileTypes';
import { StaffAccount } from '../../types/adminTypes';
import { AdminDashboardPage } from '../../pages/AdminDashboardPage';
import { AdminLoginPage } from '../../pages/admin/AdminLoginPage';
import { AuthService } from '../../services/authService';
import { 
  normalizeRole, 
  isActiveAccount, 
  getDashboardRouteForRole,
  isStaff 
} from '../../utils/roleUtils';

interface StaffRouteProps {
  requiredRole: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR';
  currentRoute: AppRoute;
  isAuthLoading: boolean;
  isProfileLoading: boolean;
  userProfile: UserProfile | null;
  onNavigate: (route: AppRoute) => void;
  onLogout: () => void;
}

export const StaffRoute: React.FC<StaffRouteProps> = ({
  requiredRole,
  currentRoute,
  isAuthLoading,
  isProfileLoading,
  userProfile,
  onNavigate,
  onLogout
}) => {
  // Use Effect for router redirection to prevent state updates during render
  useEffect(() => {
    if (userProfile && isStaff(userProfile) && isActiveAccount(userProfile.accountStatus)) {
      const normRole = normalizeRole(userProfile.role);
      const targetDashboardRoute = getDashboardRouteForRole(normRole, userProfile.accountStatus);
      if (currentRoute !== targetDashboardRoute && targetDashboardRoute !== '/') {
        onNavigate(targetDashboardRoute);
      }
    }
  }, [currentRoute, userProfile, onNavigate]);

  // 1. Loading state (session restore / profile fetch)
  if (isAuthLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-[#041C43] text-white flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-[#1464F4] border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-bold tracking-tight mb-1 font-heading">RENTOURA.LK STAFF</h2>
        <p className="text-slate-300 text-sm font-medium">Loading staff account...</p>
        <p className="text-slate-500 text-xs mt-1">Verifying server-authoritative permissions...</p>
      </div>
    );
  }

  // 2. Unauthenticated state -> Render Staff Gateway Login
  const currentUser = AuthService.getCurrentUser();
  if (!currentUser) {
    return <AdminLoginPage onNavigate={onNavigate} />;
  }

  // 3. Profile query failure -> Offer retry or sign out
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-[#041C43] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 rounded-3xl p-8 border border-slate-800 text-center shadow-2xl space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold font-heading">Staff Profile Error</h2>
          <p className="text-slate-300 text-xs leading-relaxed">
            Could not verify staff profile data. Please try again or sign in with an authorized staff account.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              type="button"
              onClick={() => AuthService.refreshProfile()}
              className="px-5 py-2.5 bg-[#1464F4] hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <RotateCw className="w-4 h-4" />
              <span>Retry Profile Load</span>
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Validate Account Status (banned/suspended) or Non-Staff Role -> Render Staff Gateway Login with error state
  if (!isActiveAccount(userProfile.accountStatus) || !isStaff(userProfile)) {
    return <AdminLoginPage onNavigate={onNavigate} />;
  }

  // 5. Active Staff Member Confirmed
  const normRole = normalizeRole(userProfile.role);

  // Construct StaffAccount object (NO fake Unsplash fallback avatars)
  const staffAccount: StaffAccount = {
    id: userProfile.id,
    fullName: userProfile.fullName || 'Staff Member',
    displayName: userProfile.displayName || userProfile.fullName || 'Staff Member',
    email: userProfile.email || '',
    role: normRole === 'super_admin' ? 'SUPER_ADMIN' : normRole === 'admin' ? 'ADMIN' : 'MODERATOR',
    status: 'Active',
    avatarUrl: userProfile.avatarUrl || '', // Clean avatarUrl, initials rendered if empty
    phone: userProfile.phone || '',
    lastLogin: 'Just now',
    createdAt: userProfile.memberSinceYear || new Date().getFullYear().toString()
  };

  return (
    <AdminDashboardPage
      staff={staffAccount}
      onNavigate={onNavigate}
      onLogout={onLogout}
    />
  );
};
