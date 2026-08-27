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

export const CURRENT_AGREEMENT_VERSION = '1.0';

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
      if (!profile || profile.accountStatus !== 'active') {
        AuthService.currentSession = null;
        AuthService.currentUser = null;
        AuthService.currentUserProfile = null;
        ProfileService.clearSessionData();
        AuthService.notifyListeners(null, null);
        await supabase.auth.signOut();
        return;
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
            fullName: data.full_name || 'Rentoura Member',
            displayName: data.display_name || data.full_name || 'Rentoura Member',
            email: data.email || '',
            phone: data.phone_normalized || '',
            bio: data.bio || '',
            avatarUrl: data.avatar_url || data.avatar_path || '',
            memberSince: memberSinceStr,
            memberSinceYear: String(createdAtDate.getFullYear()),
            accountType: data.account_type || '',
            isVerified: Boolean(data.is_verified),
            province: data.province_id || '',
            district: data.district_id || '',
            city: data.city_id || '',
            area: data.area_id || '',
            preferredLanguage: data.preferred_language || 'English',
            currency: 'LKR',
            emailNotifications: data.email_notifications != null ? Boolean(data.email_notifications) : true,
            pushNotifications: data.push_notifications != null ? Boolean(data.push_notifications) : true,
            twoFactorEnabled: false,
            totalReviews: Number(data.total_reviews || 0),
            averageRating: Number(data.rating || data.average_rating || 0),
            role: rawRole,
            accountStatus: rawStatus,
            agreementVersion: data.agreement_version || '',
            agreementAcceptedAt: data.agreement_accepted_at || ''
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
        accountStatus: 'active',
        agreementVersion: meta.agreement_version || cachedProfile?.agreementVersion || '',
        agreementAcceptedAt: meta.agreement_accepted_at || cachedProfile?.agreementAcceptedAt || ''
      };
    }

    console.warn('[DIAGNOSTIC] No row returned from public.profiles for UID:', uid);
    return null;
  }

  static hasAcceptedCurrentAgreement(profile: UserProfile | null): boolean {
    if (profile) {
      return profile.agreementVersion === CURRENT_AGREEMENT_VERSION && Boolean(profile.agreementAcceptedAt);
    }
    const accepted = localStorage.getItem('rentoura_agreement_accepted') === 'true';
    const version = localStorage.getItem('rentoura_agreement_version');
    return accepted && version === CURRENT_AGREEMENT_VERSION;
  }

  static async acceptUserAgreement(): Promise<boolean> {
    const timestamp = new Date().toISOString();

    if (AuthService.currentUser) {
      await AuthService.safeUpdateProfile(AuthService.currentUser.id, {
        agreement_version: CURRENT_AGREEMENT_VERSION,
        agreement_accepted_at: timestamp
      });

      if (AuthService.currentUserProfile) {
        AuthService.currentUserProfile.agreementVersion = CURRENT_AGREEMENT_VERSION;
        AuthService.currentUserProfile.agreementAcceptedAt = timestamp;
        ProfileService.saveProfile(AuthService.currentUserProfile);
        AuthService.notifyListeners(AuthService.currentUser, AuthService.currentUserProfile);
      }
    }

    localStorage.setItem('rentoura_agreement_accepted', 'true');
    localStorage.setItem('rentoura_agreement_version', CURRENT_AGREEMENT_VERSION);
    localStorage.setItem('rentoura_agreement_accepted_at', timestamp);

    return true;
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
        await supabase.auth.signOut();
        AuthService.currentSession = null;
        AuthService.currentUser = null;
        throw new Error('Your account profile is unavailable. Please contact support.');
      }
      if (profile.accountStatus !== 'active') {
        const status = profile.accountStatus;
        await supabase.auth.signOut();
        AuthService.currentSession = null;
        AuthService.currentUser = null;
        AuthService.currentUserProfile = null;
        throw new Error(`This account is ${status}. Please contact support if you need assistance.`);
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
            bio: '',
            avatarUrl: '',
            memberSince: memberSinceStr,
            memberSinceYear: String(dateObj.getFullYear()),
            accountType: '',
            isVerified: false,
            province: '',
            district: '',
            city: '',
            preferredLanguage: 'English',
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

  static async uploadAvatar(userId: string, file: File): Promise<string> {
    if (!userId) throw new Error('User must be authenticated to upload an avatar.');

    const validMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validMimes.includes(file.type.toLowerCase())) {
      throw new Error('Avatar photo must be in JPG, PNG, or WEBP format.');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Avatar photo must be smaller than 5MB.');
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filePath = `${userId}/avatar_${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type
      });

    if (error) {
      console.warn('Error uploading avatar to Supabase Storage avatars bucket:', error.message);
      throw new Error(`Failed to upload photo to storage: ${error.message}`);
    }

    const { data: signed, error: signedError } = await supabase.storage.from('avatars').createSignedUrl(filePath, 3600);
    if (signedError || !signed?.signedUrl) throw new Error(signedError?.message || 'Unable to access uploaded avatar.');
    return signed.signedUrl;
  }

  static async updateUserProfile(updatedProfile: UserProfile): Promise<void> {
    if (!AuthService.currentUser) {
      throw new Error('You must be logged in to update your profile.');
    }

    // Validate phone if provided
    let phoneNormalized = updatedProfile.phone;
    if (phoneNormalized.trim()) {
      const phoneVal = normalizeSriLankanPhone(phoneNormalized);
      if (!phoneVal.isValid) {
        throw new Error(phoneVal.error);
      }
      phoneNormalized = phoneVal.normalized;
      updatedProfile.phone = phoneNormalized;
    }

    try {
      // Ensure location IDs are valid UUIDs or null (never names like "Kandy")
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const validProvinceId = uuidRegex.test(updatedProfile.province) ? updatedProfile.province : null;
      const validDistrictId = uuidRegex.test(updatedProfile.district) ? updatedProfile.district : null;
      const validCityId = uuidRegex.test(updatedProfile.city) ? updatedProfile.city : null;
      const validAreaId = uuidRegex.test(updatedProfile.area || '') ? updatedProfile.area : null;

      const fullPayload: Record<string, any> = {
        full_name: updatedProfile.fullName.trim(),
        display_name: updatedProfile.displayName ? updatedProfile.displayName.trim() : updatedProfile.fullName.trim(),
        bio: updatedProfile.bio ? updatedProfile.bio.trim() : '',
        avatar_url: updatedProfile.avatarUrl || '',
        preferred_language: updatedProfile.preferredLanguage || 'English',
        email_notifications: Boolean(updatedProfile.emailNotifications),
        push_notifications: Boolean(updatedProfile.pushNotifications),
        phone_normalized: phoneNormalized,
        province_id: validProvinceId,
        district_id: validDistrictId,
        city_id: validCityId,
        area_id: validAreaId,
        updated_at: new Date().toISOString()
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

  static async resendConfirmationEmail(rawEmail: string): Promise<boolean> {
    const emailVal = validateAndNormalizeEmail(rawEmail);
    if (!emailVal.isValid) {
      throw new Error(emailVal.error);
    }
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: emailVal.normalized
      });

      if (error) {
        const msg = error.message || '';
        if (msg.includes('rate limit') || msg.includes('too many requests')) {
          throw new Error('Too many requests. Please wait a few minutes before resending the confirmation email.');
        }
        throw new Error(msg || 'Failed to resend confirmation email. Please try again later.');
      }
      return true;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to resend confirmation email.');
    }
  }

  static async sendPasswordReset(rawEmail: string): Promise<boolean> {
    const emailVal = validateAndNormalizeEmail(rawEmail);
    if (!emailVal.isValid) {
      throw new Error(emailVal.error);
    }

    const origin = typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'https://www.rentoura.lk';
    const redirectTo = `${origin}/reset-password`;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(emailVal.normalized, {
        redirectTo
      });

      if (error) {
        const msg = error.message || '';
        if (msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('too many requests')) {
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

  static async updatePasswordFromRecoverySession(newPassword: string): Promise<boolean> {
    if (!newPassword || newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No active password reset session found. Your reset link may have expired or is invalid.');
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      throw new Error(error.message || 'Failed to update password. Please try requesting a new reset link.');
    }

    // Sign out to clear recovery session and avoid stale auth cache
    await AuthService.logout();
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

