import { AppRoute } from '../types';
import { UserProfile } from '../types/profileTypes';

export type NormalizedRole = 'user' | 'moderator' | 'admin' | 'super_admin';
export type NormalizedStatus = 'active' | 'suspended' | 'restricted' | 'banned' | 'disabled';

export function normalizeRole(role?: string | null): NormalizedRole | null {
  if (!role) return 'user';
  const clean = role.toString().trim().toLowerCase();
  
  if (clean === 'user') return 'user';
  if (clean === 'moderator' || clean === 'mod') return 'moderator';
  if (clean === 'admin' || clean === 'administrator') return 'admin';
  if (clean === 'super_admin' || clean === 'superadmin' || clean === 'super admin') return 'super_admin';

  // Unknown or unrecognized role strings fail closed by returning null
  return null;
}

export function normalizeAccountStatus(status?: string | null): NormalizedStatus {
  if (!status) return 'active';
  const clean = status.toString().trim().toLowerCase();
  
  if (clean === 'active') return 'active';
  if (clean === 'suspended') return 'suspended';
  if (clean === 'restricted') return 'restricted';
  if (clean === 'banned') return 'banned';
  
  return 'disabled';
}

export function isActiveAccount(status?: string | null): boolean {
  return normalizeAccountStatus(status) === 'active';
}

export function isUser(profile?: UserProfile | { role?: string; accountStatus?: string; account_status?: string } | null): boolean {
  if (!profile) return false;
  const role = normalizeRole(profile.role);
  return role === 'user';
}

export function isSuperAdmin(profile?: UserProfile | { role?: string; accountStatus?: string; account_status?: string } | null): boolean {
  if (!profile) return false;
  const role = normalizeRole(profile.role);
  const status = (profile as any).accountStatus || (profile as any).account_status;
  return role === 'super_admin' && isActiveAccount(status);
}

export function isAdmin(profile?: UserProfile | { role?: string; accountStatus?: string; account_status?: string } | null): boolean {
  if (!profile) return false;
  const role = normalizeRole(profile.role);
  const status = (profile as any).accountStatus || (profile as any).account_status;
  return role === 'admin' && isActiveAccount(status);
}

export function isModerator(profile?: UserProfile | { role?: string; accountStatus?: string; account_status?: string } | null): boolean {
  if (!profile) return false;
  const role = normalizeRole(profile.role);
  const status = (profile as any).accountStatus || (profile as any).account_status;
  return role === 'moderator' && isActiveAccount(status);
}

export function isStaff(profile?: UserProfile | { role?: string; accountStatus?: string; account_status?: string } | null): boolean {
  if (!profile) return false;
  const role = normalizeRole(profile.role);
  const status = (profile as any).accountStatus || (profile as any).account_status;
  return !!role && ['moderator', 'admin', 'super_admin'].includes(role) && isActiveAccount(status);
}

export function getDashboardRouteForRole(role?: string | null, accountStatus?: string | null): AppRoute {
  if (!isActiveAccount(accountStatus)) return '/';
  const normRole = normalizeRole(role);
  if (normRole === 'super_admin') return '/super-admin';
  if (normRole === 'admin') return '/admin';
  if (normRole === 'moderator') return '/moderator';
  return '/';
}
