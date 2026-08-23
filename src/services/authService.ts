import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types/profileTypes';
import { ProfileService } from './profileService';

export interface PhoneValidationResult {
  normalized: string;
  isValid: boolean;
  error?: string;
}

export function validateAndNormalizeEmail(rawEmail: string): { normalized: string; isValid: boolean; error?: string } {
  if (!rawEmail) {
    return { normalized: '', isValid: false, error: 'Email address is required.' };
  }

  const trimmed = rawEmail.trim();

  // Check for internal spaces
  if (/\s/.test(trimmed)) {
    return { normalized: '', isValid: false, error: 'Email address cannot contain internal spaces.' };
  }

  const normalized = trimmed.toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(normalized)) {
    return { normalized: '', isValid: false, error: 'Please enter a valid email address (e.g. name@example.com).' };
  }

  return { normalized, isValid: true };
}

export function normalizeSriLankanPhone(phoneInput: string): PhoneValidationResult {
  if (!phoneInput) {
    return { normalized: '', isValid: false, error: 'Sri Lankan mobile number is required.' };
  }

  const trimmed = phoneInput.trim().replace(/[\s\-\(\)]/g, '');

  let localDigits = '';

  if (trimmed.startsWith('+94')) {
    localDigits = trimmed.slice(3);
  } else if (trimmed.startsWith('0094')) {
    localDigits = trimmed.slice(4);
  } else if (trimmed.startsWith('94') && trimmed.length === 11) {
    localDigits = trimmed.slice(2);
  } else if (trimmed.startsWith('0')) {
    localDigits = trimmed.slice(1);
  } else {
    localDigits = trimmed;
  }

  if (!/^\d+$/.test(localDigits)) {
    return { normalized: '', isValid: false, error: 'Mobile number must contain digits only.' };
  }

  if (localDigits.length !== 9) {
    return { normalized: '', isValid: false, error: 'Sri Lankan mobile number must be 10 digits starting with 0 (e.g., 0771234567) or +947XXXXXXXX.' };
  }

  if (!localDigits.startsWith('7')) {
    return { normalized: '', isValid: false, error: 'Sri Lankan mobile numbers must start with 07 (e.g., 077XXXXXXX).' };
  }

  const validPrefixes = ['70', '71', '72', '74', '75', '76', '77', '78'];
  const prefix = localDigits.substring(0, 2);
  if (!validPrefixes.includes(prefix)) {
    return { normalized: '', isValid: false, error: 'Please enter a valid Sri Lankan mobile network number (e.g., 070, 071, 072, 074, 075, 076, 077, 078).' };
  }

  return {
    normalized: `+94${localDigits}`,
    isValid: true
  };
}

export function calculatePasswordStrength(password: string): 'Weak' | 'Fair' | 'Strong' {
  if (!password || password.length < 8) return 'Weak';
  
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score >= 4) return 'Strong';
  if (score >= 2) return 'Fair';
  return 'Weak';
}

export class AuthService {
  private static currentUser: User | null = null;
  private static currentSession: Session | null = null;
  private static currentUserProfile: UserProfile | null = null;
  private static authListeners: ((user: User | null, profile: UserProfile | null) => void)[] = [];
  private static isInitialized = false;

  static init() {
    if (AuthService.isInitialized) return;
    AuthService.isInitialized = true;

    // Initial session restore from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      AuthService.handleAuthStateChange(session);
    }).catch(err => {
      console.warn('Initial session restore error:', err);
    });

    // Subscribe to auth state changes as canonical listener
    supabase.auth.onAuthStateChange(async (_event, session) => {
      await AuthService.handleAuthStateChange(session);
    });
  }

  private static async handleAuthStateChange(session: Session | null) {
    AuthService.currentSession = session;
    AuthService.currentUser = session?.user || null;

    if (session?.user) {
      let profile = await AuthService.fetchUserProfile(session.user.id);
      if (!profile) {
        // Construct fallback/initial profile if missing from public.profiles
        const rawCreatedAt = (session.user as any)?.created_at;
        const dateObj = rawCreatedAt ? new Date(rawCreatedAt) : new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const memberSinceStr = `${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
        const metaName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Rentoura Member';
        const metaPhone = session.user.user_metadata?.phone_normalized || session.user.phone || '';

        profile = {
          id: session.user.id,
          fullName: metaName,
          displayName: metaName,
          email: session.user.email || '',
          phone: metaPhone,
          bio: '',
          avatarUrl: '',
          memberSince: memberSinceStr,
          memberSinceYear: String(dateObj.getFullYear()),
          accountType: '',
          isVerified: false,
          province: '',
          district: '',
          city: '',
          preferredLanguage: '',
          currency: 'LKR',
          emailNotifications: true,
          pushNotifications: true,
          twoFactorEnabled: false,
          totalReviews: 0,
          averageRating: 0,
          role: 'user',
          accountStatus: 'active'
        };
      }

      AuthService.currentUserProfile = profile;
      ProfileService.saveProfile(profile);
      AuthService.notifyListeners(session.user, profile);
    } else {
      AuthService.currentUserProfile = null;
      ProfileService.clearSessionData();
      AuthService.notifyListeners(null, null);
    }
  }

  static subscribe(listener: (user: User | null, profile: UserProfile | null) => void) {
    AuthService.authListeners.push(listener);
    const user = AuthService.currentUser;
    const profile = user ? AuthService.currentUserProfile : null;
    listener(user, profile);
    return () => {
      AuthService.authListeners = AuthService.authListeners.filter(l => l !== listener);
    };
  }

  private static notifyListeners(user: User | null, profile: UserProfile | null) {
    AuthService.authListeners.forEach(listener => listener(user, profile));
  }

  static async fetchUserProfile(uid: string, retries = 2): Promise<UserProfile | null> {
    let queryError: any = null;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        console.log(`[DIAGNOSTIC] fetchUserProfile querying public.profiles for UID: ${uid} (attempt ${attempt + 1})`);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', uid)
          .maybeSingle();

        if (error) {
          queryError = error;
          console.warn('[DIAGNOSTIC] fetchUserProfile public.profiles query notice:', error.message);
          break;
        }

        if (data) {
          const rawRole = (data.role || 'user').toString().trim().toLowerCase();
          const rawStatus = (data.account_status || 'active').toString().trim().toLowerCase();

          console.log('[DIAGNOSTIC] public.profiles row retrieved:', {
            id: uid,
            email: data.email,
            role: rawRole,
            account_status: rawStatus,
            full_name: data.full_name
          });

          const createdAtDate = data.created_at ? new Date(data.created_at) : new Date();
          const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          const memberSinceStr = `${monthNames[createdAtDate.getMonth()]} ${createdAtDate.getFullYear()}`;

          return {
            id: uid,
            fullName: data.full_name || data.display_name || 'Rentoura Member',
            displayName: data.display_name || data.full_name || 'Rentoura Member',
            email: data.email || '',
            phone: data.phone_normalized || '',
            bio: data.bio || '',
            avatarUrl: data.profile_photo_url || '',
            memberSince: memberSinceStr,
            memberSinceYear: String(createdAtDate.getFullYear()),
            accountType: '',
            isVerified: false,
            province: data.province_id || '',
            district: data.district_id || '',
            city: data.city_id || '',
            area: data.area_id || '',
            preferredLanguage: (data.preferred_language as any) || '',
            currency: 'LKR',
            emailNotifications: true,
            pushNotifications: true,
            twoFactorEnabled: false,
            totalReviews: 0,
            averageRating: 0,
            role: rawRole,
            accountStatus: rawStatus
          };
        }
      } catch (e: any) {
        console.warn('[DIAGNOSTIC] Exception in fetchUserProfile:', e?.message || e);
      }
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 300));
      }
    }

    // Fallback if public.profiles query failed or gave permission denied
    const sessionUser = AuthService.currentUser;
    if (sessionUser && sessionUser.id === uid) {
      const meta = sessionUser.user_metadata || {};
      const cachedProfile = ProfileService.getProfile();

      console.log('[DIAGNOSTIC] Fallback user profile generated due to public.profiles query result for UID:', uid);

      const rawCreatedAt = (sessionUser as any)?.created_at;
      const dateObj = rawCreatedAt ? new Date(rawCreatedAt) : new Date();
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const memberSinceStr = `${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

      return {
        id: uid,
        fullName: meta.full_name || meta.name || cachedProfile?.fullName || sessionUser.email?.split('@')[0] || 'Rentoura Member',
        displayName: meta.full_name || meta.name || cachedProfile?.displayName || 'Rentoura Member',
        email: sessionUser.email || cachedProfile?.email || '',
        phone: meta.phone_normalized || cachedProfile?.phone || '',
        bio: cachedProfile?.bio || '',
        avatarUrl: cachedProfile?.avatarUrl || '',
        memberSince: memberSinceStr,
        memberSinceYear: String(dateObj.getFullYear()),
        accountType: '',
        isVerified: false,
        province: '',
        district: '',
        city: '',
        preferredLanguage: '',
        currency: 'LKR',
        emailNotifications: true,
        pushNotifications: true,
        twoFactorEnabled: false,
        totalReviews: 0,
        averageRating: 0,
        role: 'user',
        accountStatus: 'active'
      };
    }

    console.warn('[DIAGNOSTIC] No row returned from public.profiles for UID:', uid);
    return null;
  }

  static async login(emailInput: string, passwordInput: string, rememberMe: boolean = true) {
    const emailVal = validateAndNormalizeEmail(emailInput);
    if (!emailVal.isValid) {
      throw new Error(emailVal.error);
    }

    if (!passwordInput) {
      throw new Error('Password is required.');
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailVal.normalized,
        password: passwordInput
      });

      if (error) {
        const msg = error.message || '';
        if (msg.includes('Invalid login credentials') || msg.includes('invalid_grant')) {
          throw new Error('Invalid email or password. Please check your details and try again.');
        } else if (msg.includes('Email not confirmed')) {
          throw new Error('Please check your email and confirm your account before logging in.');
        } else if (msg.includes('rate limit') || msg.includes('too many requests')) {
          throw new Error('Too many failed login attempts. Please try again later.');
        } else {
          throw new Error(msg || 'Login failed. Please verify your credentials and try again.');
        }
      }

      if (!data.user || !data.session) {
        throw new Error('Login failed. Please try again.');
      }

      AuthService.currentSession = data.session;
      AuthService.currentUser = data.user;

      let profile = await AuthService.fetchUserProfile(data.user.id);
      if (!profile) {
        profile = {
          id: data.user.id,
          fullName: data.user.user_metadata?.full_name || emailVal.normalized.split('@')[0],
          displayName: data.user.user_metadata?.full_name || emailVal.normalized.split('@')[0],
          email: emailVal.normalized,
          phone: data.user.user_metadata?.phone_normalized || '',
          bio: 'RENTOURA.LK marketplace member',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          memberSince: 'August 2026',
          memberSinceYear: '2026',
          accountType: 'Individual',
          isVerified: false,
          province: 'Central Province',
          district: 'Kandy',
          city: 'Kandy',
          preferredLanguage: 'English',
          currency: 'LKR',
          emailNotifications: true,
          pushNotifications: true,
          twoFactorEnabled: false,
          totalReviews: 0,
          averageRating: 5.0,
          role: 'user',
          accountStatus: 'active'
        };
      }

      ProfileService.saveProfile(profile);
      AuthService.currentUserProfile = profile;

      return { user: data.user, session: data.session, profile };
    } catch (err: any) {
      throw new Error(err.message || 'Login failed. Please verify your credentials and try again.');
    }
  }

  static async register(params: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    agreementAccepted: boolean;
  }) {
    const { fullName, email, phone, password, confirmPassword, agreementAccepted } = params;

    const trimmedName = fullName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      throw new Error('Please enter your full name (at least 2 characters).');
    }

    const emailVal = validateAndNormalizeEmail(email);
    if (!emailVal.isValid) {
      throw new Error(emailVal.error);
    }

    const phoneVal = normalizeSriLankanPhone(phone);
    if (!phoneVal.isValid) {
      throw new Error(phoneVal.error);
    }

    if (!password) {
      throw new Error('Password is required.');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match. Please ensure both passwords are identical.');
    }

    if (!agreementAccepted) {
      throw new Error('You must accept the User Agreement and Privacy Policy to create an account.');
    }

    try {
      // Pass strictly allowed safe metadata for database trigger
      const { data, error } = await supabase.auth.signUp({
        email: emailVal.normalized,
        password,
        options: {
          data: {
            full_name: trimmedName,
            phone_normalized: phoneVal.normalized,
            agreement_accepted: true,
            agreement_version: '1.0'
          }
        }
      });

      if (error) {
        const msg = error.message || '';
        if (msg.includes('already registered') || msg.includes('User already registered') || msg.includes('user_already_exists') || error.status === 422) {
          throw new Error('An account with this email address already exists. Please login instead or reset your password.');
        } else if (msg.includes('weak') || msg.includes('Password')) {
          throw new Error('Password is too weak. Please choose a stronger password with at least 8 characters.');
        } else {
          throw new Error(msg || 'Account registration failed. Please try again.');
        }
      }

      if (!data.user) {
        throw new Error('Account registration failed. Please try again.');
      }

      // Check if session exists (immediate login) or if email confirmation is required
      if (data.session) {
        AuthService.currentSession = data.session;
        AuthService.currentUser = data.user;

        // Fetch or create profile
        let profile = await AuthService.fetchUserProfile(data.user.id);
        if (!profile) {
          const dateObj = new Date();
          const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          const memberSinceStr = `${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

          profile = {
            id: data.user.id,
            fullName: trimmedName,
            displayName: trimmedName,
            email: emailVal.normalized,
            phone: phoneVal.normalized,
            bio: 'Member of RENTOURA.LK marketplace.',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            memberSince: memberSinceStr,
            memberSinceYear: String(dateObj.getFullYear()),
            accountType: 'Individual',
            isVerified: false,
            province: 'Central Province',
            district: 'Kandy',
            city: 'Kandy',
            preferredLanguage: 'English',
            currency: 'LKR',
            emailNotifications: true,
            pushNotifications: true,
            twoFactorEnabled: false,
            totalReviews: 0,
            averageRating: 5.0,
            role: 'user',
            accountStatus: 'active'
          };
        }

        // Save phone_normalized to profile explicitly
        try {
          await AuthService.safeUpdateProfile(data.user.id, {
            full_name: trimmedName,
            phone_normalized: phoneVal.normalized,
            agreement_version: '1.0',
            agreement_accepted_at: new Date().toISOString()
          });
        } catch (e) {
          console.warn('Profile update warning after signup:', e);
        }

        ProfileService.saveProfile(profile);
        AuthService.currentUserProfile = profile;

        return { user: data.user, session: data.session, profile, requiresEmailConfirmation: false };
      } else {
        // Email confirmation required by Supabase Auth configuration
        return {
          user: data.user,
          session: null,
          profile: null,
          requiresEmailConfirmation: true,
          message: 'Account created. Please check your email to confirm your account.'
        };
      }
    } catch (err: any) {
      throw new Error(err.message || 'Account registration failed. Please check your details and try again.');
    }
  }

  /**
   * Safely updates public.profiles, stripping any columns that do not exist
   * in the active PostgREST / Supabase schema cache (error PGRST204).
   */
  private static async safeUpdateProfile(
    userId: string,
    payload: Record<string, any>
  ): Promise<void> {
    const currentPayload = { ...payload };
    const maxStrippingAttempts = 12;

    for (let attempt = 0; attempt < maxStrippingAttempts; attempt++) {
      const { error } = await supabase
        .from('profiles')
        .update(currentPayload)
        .eq('id', userId);

      if (!error) {
        return; // Success!
      }

      // Check if error is missing column error PGRST204 or message mentions missing column
      const isMissingColumnError =
        error.code === 'PGRST204' ||
        (error.message && error.message.toLowerCase().includes('column'));

      if (isMissingColumnError && error.message) {
        // Extract column name from error message, e.g. "Could not find the 'bio' column of 'profiles' in the schema cache"
        const match = error.message.match(/'([^']+)'/);
        if (match && match[1] && match[1] in currentPayload) {
          const missingCol = match[1];
          console.warn(`[Supabase Profile Schema] Stripping missing column '${missingCol}' from update payload.`);
          delete currentPayload[missingCol];
          if (Object.keys(currentPayload).length === 0) {
            console.warn('[Supabase Profile Schema] All payload columns stripped. Aborting DB update.');
            return;
          }
          continue; // Retry update with stripped payload
        }
      }

      // If it's a different error or we couldn't parse the missing column name, throw
      console.error('Failed to update profile in Supabase:', error);
      throw new Error(error.message);
    }
  }

  static async updateUserProfile(updatedProfile: UserProfile): Promise<void> {
    if (!AuthService.currentUser) {
      throw new Error('You must be logged in to update your profile.');
    }

    try {
      const fullPayload = {
        full_name: updatedProfile.fullName.trim(),
        display_name: updatedProfile.displayName.trim() || updatedProfile.fullName.trim(),
        phone_normalized: updatedProfile.phone,
        bio: updatedProfile.bio?.trim(),
        profile_photo_url: updatedProfile.avatarUrl,
        preferred_language: updatedProfile.preferredLanguage,
        province_id: updatedProfile.province,
        district_id: updatedProfile.district,
        city_id: updatedProfile.city,
        area_id: updatedProfile.area
      };

      await AuthService.safeUpdateProfile(updatedProfile.id, fullPayload);

      AuthService.currentUserProfile = updatedProfile;
      ProfileService.saveProfile(updatedProfile);
      AuthService.notifyListeners(AuthService.currentUser, updatedProfile);
    } catch (e: any) {
      console.error('updateUserProfile error:', e);
      throw e;
    }
  }

  static async sendPasswordReset(rawEmail: string): Promise<boolean> {
    const emailVal = validateAndNormalizeEmail(rawEmail);
    if (!emailVal.isValid) {
      throw new Error(emailVal.error);
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(emailVal.normalized, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        const msg = error.message || '';
        if (msg.includes('rate limit') || msg.includes('too many requests')) {
          throw new Error('Too many attempts. Please wait a few minutes before requesting another reset link.');
        }
      }
      return true;
    } catch (err: any) {
      if (err.message?.includes('Too many attempts')) throw err;
      // Return true to prevent account enumeration
      return true;
    }
  }

  static async verifyResetCode(code: string): Promise<string> {
    if (!code || !code.trim()) {
      throw new Error('This password reset link is missing or invalid.');
    }
    return 'user@rentoura.lk';
  }

  static async confirmResetPassword(code: string, newPassword: string): Promise<boolean> {
    if (!newPassword || newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      throw new Error(error.message);
    }
    return true;
  }

  static async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch (e: any) {
      console.warn('Supabase signOut warning:', e);
    }
    AuthService.currentSession = null;
    AuthService.currentUser = null;
    AuthService.currentUserProfile = null;
    ProfileService.clearSessionData();
    localStorage.removeItem('rentoura_auth_session');
    AuthService.notifyListeners(null, null);
  }

  static async refreshProfile(): Promise<UserProfile | null> {
    if (!AuthService.currentUser) return null;
    const profile = await AuthService.fetchUserProfile(AuthService.currentUser.id);
    if (profile) {
      AuthService.currentUserProfile = profile;
      ProfileService.saveProfile(profile);
      AuthService.notifyListeners(AuthService.currentUser, profile);
    }
    return profile;
  }

  static async signIn(emailInput: string, passwordInput: string, rememberMe: boolean = true) {
    return AuthService.login(emailInput, passwordInput, rememberMe);
  }

  static async signUp(params: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    agreementAccepted: boolean;
  }) {
    return AuthService.register(params);
  }

  static async signOut(): Promise<void> {
    return AuthService.logout();
  }

  static isAuthenticated(): boolean {
    return Boolean(AuthService.currentUser && AuthService.currentSession);
  }

  static getCurrentUser(): User | null {
    return AuthService.currentUser;
  }

  static getCurrentSession(): Session | null {
    return AuthService.currentSession;
  }

  static getCurrentProfile(): UserProfile | null {
    if (!AuthService.currentUser) {
      return null;
    }
    return AuthService.currentUserProfile;
  }
}

// Auto-initialize auth listener on module load
AuthService.init();

