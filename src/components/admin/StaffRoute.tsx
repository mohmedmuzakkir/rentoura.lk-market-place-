import React from 'react';
import { ShieldCheck, AlertCircle, RotateCw, LogOut } from 'lucide-react';
import { AppRoute } from '../../types';
import { UserProfile } from '../../types/profileTypes';
import { StaffAccount } from '../../types/adminTypes';
import { AdminDashboardPage } from '../../pages/AdminDashboardPage';
import { AuthService } from '../../services/authService';
import { 
  normalizeRole, 
  isActiveAccount, 
  getDashboardRouteForRole,
  NormalizedRole 
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
  // 1. Loading state (session restore / profile fetch)
  if (isAuthLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-[#041C43] text-white flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-[#1464F4] border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-bold tracking-tight mb-1">RENTOURA.LK</h2>
        <p className="text-slate-300 text-sm font-medium">Loading your account...</p>
        <p className="text-slate-500 text-xs mt-1">Verifying permissions from server...</p>
      </div>
    );
  }

  // 2. Unauthenticated state
  const currentUser = AuthService.getCurrentUser();
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-800 rounded-2xl p-6 border border-slate-700 text-center shadow-2xl">
          <ShieldCheck className="w-12 h-12 text-[#1464F4] mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
          <p className="text-slate-300 text-sm mb-6">
            Please sign in with your RENTOURA.LK account to access the staff portal.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onNavigate('/login')}
              className="px-5 py-2.5 bg-[#1464F4] hover:bg-blue-600 text-white font-bold text-sm rounded-xl transition-all"
            >
              Sign In to Account
            </button>
            <button
              onClick={() => onNavigate('/')}
              className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm rounded-xl transition-all"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Profile query failure / missing profile
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-800 rounded-2xl p-6 border border-slate-700 text-center shadow-2xl">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Profile Load Error</h2>
          <p className="text-slate-300 text-sm mb-6">
            We couldn't load your account profile. Please try again or sign out.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => AuthService.refreshProfile()}
              className="px-5 py-2.5 bg-[#1464F4] hover:bg-blue-600 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <RotateCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
            <button
              onClick={onLogout}
              className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Validate Account Status
  if (!isActiveAccount(userProfile.accountStatus)) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-800 rounded-2xl p-6 border border-slate-700 text-center shadow-2xl">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
          <p className="text-slate-300 text-sm mb-6">
            Your account is currently inactive or suspended. Staff dashboard access is unavailable.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => onNavigate('/')}
              className="px-5 py-2.5 bg-[#1464F4] hover:bg-blue-600 text-white font-bold text-sm rounded-xl transition-all"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. Validate Role
  const normRole = normalizeRole(userProfile.role);

  if (normRole === null) {
    // Fail closed on unknown/unrecognized role
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-800 rounded-2xl p-6 border border-slate-700 text-center shadow-2xl">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Role Configuration Error</h2>
          <p className="text-slate-300 text-sm mb-6">
            Account role configuration error. Please contact platform administration.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => onNavigate('/')}
              className="px-5 py-2.5 bg-[#1464F4] hover:bg-blue-600 text-white font-bold text-sm rounded-xl transition-all"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (normRole === 'user') {
    // Normal marketplace user attempting to access a staff route
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-800 rounded-2xl p-6 border border-slate-700 text-center shadow-2xl">
          <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
          <p className="text-slate-300 text-sm mb-6">
            This area is available only to authorized RENTOURA.LK staff.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onNavigate('/')}
              className="px-5 py-2.5 bg-[#1464F4] hover:bg-blue-600 text-white font-bold text-sm rounded-xl transition-all"
            >
              Return Home
            </button>
            <button
              onClick={() => onNavigate('/profile')}
              className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm rounded-xl transition-all"
            >
              My Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Staff member detected. Check primary dashboard route!
  const targetDashboardRoute = getDashboardRouteForRole(normRole, userProfile.accountStatus);

  // If a staff member enters a staff route that is not their primary dashboard, redirect them to their primary dashboard
  if (currentRoute !== targetDashboardRoute && targetDashboardRoute !== '/') {
    onNavigate(targetDashboardRoute);
  }

  // Construct StaffAccount object
  const staffAccount: StaffAccount = {
    id: userProfile.id,
    fullName: userProfile.fullName || 'Staff Member',
    displayName: userProfile.displayName || userProfile.fullName || 'Staff Member',
    email: userProfile.email || '',
    role: normRole === 'super_admin' ? 'SUPER_ADMIN' : normRole === 'admin' ? 'ADMIN' : 'MODERATOR',
    status: 'Active',
    avatarUrl: userProfile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
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
