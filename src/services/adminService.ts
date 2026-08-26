import { 
  StaffAccount, 
  StaffRole, 
  AuditLogItem, 
  AdminKpiMetrics, 
  SystemHealthStatus, 
  PlatformAnnouncement,
  UserAccountStatus,
  RegisteredUser,
  HomeSlideItem,
  JobCompanyItem
} from '../types/adminTypes';
import { UserListingItem, UserProfile } from '../types/profileTypes';
import { ListingReport, ReportService } from './reportService';
import { ProfileService } from './profileService';
import { NotificationService } from './notificationService';
import { ReviewService } from './reviewService';
import { AppNotification } from '../types/notificationTypes';
import { AuthService } from './authService';
import { supabase } from '../lib/supabase';

const STAFF_ACCOUNTS_KEY = 'rentoura_staff_accounts_v1';
const AUDIT_LOGS_KEY = 'rentoura_audit_logs_v1';
const ANNOUNCEMENTS_KEY = 'rentoura_announcements_v1';
const USERS_ACCOUNTS_KEY = 'rentoura_registered_users_v1';

// Seed Registered Platform Users
const SEED_USERS: RegisteredUser[] = [];

// Seed Staff Accounts
const SEED_STAFF_ACCOUNTS: StaffAccount[] = [];

// Seed Audit Logs
const SEED_AUDIT_LOGS: AuditLogItem[] = [];

export class AdminService {
  /**
   * Returns all registered staff accounts from persistent store
   */
  static getStaffAccounts(): StaffAccount[] {
    try {
      const stored = localStorage.getItem(STAFF_ACCOUNTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse staff accounts:', e);
    }
    localStorage.setItem(STAFF_ACCOUNTS_KEY, JSON.stringify(SEED_STAFF_ACCOUNTS));
    return SEED_STAFF_ACCOUNTS;
  }

  /**
   * Saves updated staff accounts
   */
  static saveStaffAccounts(accounts: StaffAccount[]): void {
    try {
      localStorage.setItem(STAFF_ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.error('Failed to save staff accounts:', e);
    }
  }

  /**
   * Returns current active admin staff session (Deprecated: Authorization depends purely on live public.profiles)
   */
  static getCurrentStaffSession(): StaffAccount | null {
    return null;
  }

  /**
   * Super Admin / Staff Change Own Password with strict validation
   */
  static async changeOwnPassword(currentPasswordInput: string, newPasswordInput: string): Promise<{ success: boolean; error?: string }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email) {
      return { success: false, error: 'Unauthenticated session. Please sign in again.' };
    }

    if (!currentPasswordInput) {
      return { success: false, error: 'Current password is required.' };
    }
    if (!newPasswordInput) {
      return { success: false, error: 'New password is required.' };
    }

    // Strict Password Rules
    if (newPasswordInput.length < 10) {
      return { success: false, error: 'New password must be at least 10 characters in length.' };
    }
    if (!/[A-Z]/.test(newPasswordInput)) {
      return { success: false, error: 'New password must contain at least one uppercase letter (A-Z).' };
    }
    if (!/[a-z]/.test(newPasswordInput)) {
      return { success: false, error: 'New password must contain at least one lowercase letter (a-z).' };
    }
    if (!/[0-9]/.test(newPasswordInput)) {
      return { success: false, error: 'New password must contain at least one numeric digit (0-9).' };
    }
    if (!/[^A-Za-z0-9]/.test(newPasswordInput)) {
      return { success: false, error: 'New password must contain at least one special character (!@#$%^&* etc.).' };
    }
    if (currentPasswordInput === newPasswordInput) {
      return { success: false, error: 'New password cannot be identical to your current password.' };
    }

    try {
      // Re-authenticate with current password to confirm authorization
      const { error: reAuthErr } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPasswordInput
      });

      if (reAuthErr) {
        return { success: false, error: 'Current password is incorrect. Verification failed.' };
      }

      // Update password in Supabase Auth
      const { error: updateErr } = await supabase.auth.updateUser({
        password: newPasswordInput
      });

      if (updateErr) {
        return { success: false, error: updateErr.message || 'Failed to update password.' };
      }

      this.addAuditLog({
        actorId: user.id,
        actorName: user.user_metadata?.full_name || user.email,
        actorRole: 'ADMIN',
        action: 'STAFF_PASSWORD_CHANGED',
        targetType: 'user',
        targetId: user.id,
        targetTitle: user.email,
        details: 'Staff member changed account password securely.'
      });

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Password update failed.' };
    }
  }

  /**
   * Fetches real staff accounts directly from Supabase public.profiles
   */
  static async getStaffAccountsAsync(): Promise<StaffAccount[]> {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, account_status, phone_normalized, created_at')
        .in('role', ['super_admin', 'admin', 'moderator']);

      if (error || !profiles) {
        console.error('Failed to fetch staff profiles from Supabase:', error);
        return [];
      }

      return profiles.map(p => {
        const roleStr = (p.role || 'user').toLowerCase();
        const staffRole: StaffRole = roleStr === 'super_admin' ? 'SUPER_ADMIN' : roleStr === 'admin' ? 'ADMIN' : 'MODERATOR';
        const isSuspended = p.account_status === 'suspended' || p.account_status === 'disabled' || p.account_status === 'banned';

        return {
          id: p.id,
          fullName: p.full_name || p.email || 'Staff Member',
          displayName: p.full_name || 'Staff Member',
          email: p.email || '',
          role: staffRole,
          status: isSuspended ? 'Suspended' : 'Active',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          phone: p.phone_normalized || '',
          lastLogin: 'Active',
          createdAt: p.created_at || new Date().toISOString()
        };
      });
    } catch (e) {
      console.error('Error loading staff accounts from DB:', e);
      return [];
    }
  }

  /**
   * Create/Promote staff user in public.profiles and send setup email
   */
  static async addStaffAccountAsync(
    newStaff: { fullName: string; email: string; role: StaffRole; phone?: string },
    currentStaff: StaffAccount
  ): Promise<{ success: boolean; error?: string }> {
    if (currentStaff.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized: Only Super Admins can add or provision staff accounts.' };
    }

    const cleanEmail = newStaff.email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Email address is required.' };
    }

    // Role safety check: newly added staff accounts NEVER become Super Admin automatically
    if (newStaff.role === 'SUPER_ADMIN') {
      return { success: false, error: 'Newly provisioned staff accounts cannot be created directly as Super Admin. Create as Admin or Moderator first.' };
    }

    const dbRole = newStaff.role === 'ADMIN' ? 'admin' : 'moderator';

    try {
      // Find existing user in profiles by email
      const { data: existingProf } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (existingProf) {
        // Update existing user profile role
        const { error: updateErr } = await supabase
          .from('profiles')
          .update({
            role: dbRole,
            account_status: 'active',
            full_name: newStaff.fullName,
            phone_normalized: newStaff.phone || null
          })
          .eq('id', existingProf.id);

        if (updateErr) {
          return { success: false, error: updateErr.message };
        }
      }

      // Send password setup / reset email via Supabase Auth
      await supabase.auth.resetPasswordForEmail(cleanEmail);

      this.addAuditLog({
        actorId: currentStaff.id,
        actorName: currentStaff.fullName,
        actorRole: currentStaff.role,
        action: 'STAFF_CREATED',
        targetType: 'user',
        targetId: existingProf?.id || cleanEmail,
        targetTitle: newStaff.fullName,
        details: `Provisioned staff access (${newStaff.role}) for ${cleanEmail} and sent password setup instructions.`
      });

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to add staff account.' };
    }
  }

  /**
   * Update staff member role in public.profiles
   */
  static async updateStaffRoleAsync(
    targetStaffId: string,
    newRole: StaffRole,
    currentStaff: StaffAccount
  ): Promise<{ success: boolean; error?: string }> {
    if (currentStaff.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized: Only Super Admin can change staff roles.' };
    }

    const dbRole = newRole === 'SUPER_ADMIN' ? 'super_admin' : newRole === 'ADMIN' ? 'admin' : newRole === 'MODERATOR' ? 'moderator' : 'user';

    try {
      // Check target profile
      const { data: targetProf } = await supabase
        .from('profiles')
        .select('id, role, email')
        .eq('id', targetStaffId)
        .maybeSingle();

      if (!targetProf) {
        return { success: false, error: 'Staff account record not found.' };
      }

      // Prevent demoting the final Super Admin
      if (targetProf.role === 'super_admin' && newRole !== 'SUPER_ADMIN') {
        const { data: superAdmins } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'super_admin')
          .eq('account_status', 'active');

        if (superAdmins && superAdmins.length <= 1) {
          return { success: false, error: 'Cannot demote the final active Super Admin account.' };
        }
      }

      const { error: updateErr } = await supabase
        .from('profiles')
        .update({ role: dbRole })
        .eq('id', targetStaffId);

      if (updateErr) {
        return { success: false, error: updateErr.message };
      }

      // Send real in-app notification for role change
      if (newRole === 'ADMIN') {
        NotificationService.addNotification({
          title: 'You now have Admin access',
          message: 'Congratulations! Your RENTOURA.LK account has been granted Admin access. You can now access the Admin Dashboard from your account menu.',
          category: 'system',
          actionUrl: '/admin',
          actionLabel: 'Admin Dashboard'
        });
      } else if (newRole === 'MODERATOR') {
        NotificationService.addNotification({
          title: 'You now have Moderator access',
          message: 'Congratulations! Your RENTOURA.LK account has been granted Moderator access. You can now access the Moderator Dashboard from your account menu.',
          category: 'system',
          actionUrl: '/moderator',
          actionLabel: 'Moderator Dashboard'
        });
      } else {
        NotificationService.addNotification({
          title: 'Your staff access has been removed',
          message: 'Your RENTOURA.LK staff access has been removed. Your normal marketplace account remains active.',
          category: 'system'
        });
      }

      this.addAuditLog({
        actorId: currentStaff.id,
        actorName: currentStaff.fullName,
        actorRole: currentStaff.role,
        action: 'ROLE_UPDATED',
        targetType: 'user',
        targetId: targetStaffId,
        targetTitle: targetProf.email || targetStaffId,
        details: `Updated staff role to ${newRole}.`
      });

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to update staff role.' };
    }
  }

  /**
   * Update staff account status (active, suspended, disabled) in public.profiles
   */
  static async updateStaffStatusAsync(
    targetStaffId: string,
    newStatus: 'Active' | 'Suspended' | 'Disabled',
    currentStaff: StaffAccount
  ): Promise<{ success: boolean; error?: string }> {
    if (currentStaff.role !== 'SUPER_ADMIN' && currentStaff.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Staff status can only be modified by Super Admin or Admin.' };
    }

    const dbStatus = newStatus === 'Active' ? 'active' : 'suspended';

    try {
      const { data: targetProf } = await supabase
        .from('profiles')
        .select('id, role, email')
        .eq('id', targetStaffId)
        .maybeSingle();

      if (!targetProf) {
        return { success: false, error: 'Staff record not found.' };
      }

      if (targetProf.role === 'super_admin' && newStatus !== 'Active' && currentStaff.id === targetStaffId) {
        return { success: false, error: 'You cannot suspend or disable your own active Super Admin account.' };
      }

      const { error: updateErr } = await supabase
        .from('profiles')
        .update({ account_status: dbStatus })
        .eq('id', targetStaffId);

      if (updateErr) {
        return { success: false, error: updateErr.message };
      }

      // Send real in-app notification for status change
      if (newStatus === 'Active') {
        NotificationService.addNotification({
          title: 'Staff access restored',
          message: 'Your RENTOURA.LK staff dashboard access has been restored.',
          category: 'system'
        });
      } else {
        NotificationService.addNotification({
          title: 'Staff access suspended',
          message: 'Your RENTOURA.LK staff dashboard access has been suspended.',
          category: 'system'
        });
      }

      this.addAuditLog({
        actorId: currentStaff.id,
        actorName: currentStaff.fullName,
        actorRole: currentStaff.role,
        action: newStatus === 'Active' ? 'STAFF_ACTIVATED' : 'STAFF_SUSPENDED',
        targetType: 'user',
        targetId: targetStaffId,
        targetTitle: targetProf.email || targetStaffId,
        details: `Updated staff account status to ${newStatus}.`
      });

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to update staff status.' };
    }
  }

  /**
   * Send password reset email to staff member
   */
  static async sendStaffPasswordReset(staffEmail: string, currentStaff: StaffAccount): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(staffEmail.trim().toLowerCase());
      if (error) {
        return { success: false, error: error.message };
      }

      this.addAuditLog({
        actorId: currentStaff.id,
        actorName: currentStaff.fullName,
        actorRole: currentStaff.role,
        action: 'PASSWORD_RESET_SENT',
        targetType: 'user',
        targetId: staffEmail,
        targetTitle: staffEmail,
        details: `Sent password reset email to staff member ${staffEmail}.`
      });

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to send password reset.' };
    }
  }

  /**
   * Performs standard user logout
   */
  static async logoutStaff(): Promise<void> {
    try {
      await AuthService.logout();
    } catch (e) {
      console.warn('AuthService logout warning:', e);
    }
  }

  /**
   * Calculates KPI metrics derived directly from single-source-of-truth stores
   */
  static getKpiMetrics(moduleFilter: 'all' | 'rentals' | 'jobs' | 'services' = 'all'): AdminKpiMetrics {
    const allListings = ProfileService.getUserListings();
    const reports = ReportService.getReports();
    const reviews = ReviewService.getAllReviews();

    // Filter listings by module if not 'all'
    const filteredListings = moduleFilter === 'all' 
      ? allListings 
      : allListings.filter(l => l.module === moduleFilter);

    const filteredReports = moduleFilter === 'all'
      ? reports
      : reports.filter(r => r.targetModule === moduleFilter);

    const filteredReviews = moduleFilter === 'all'
      ? reviews
      : reviews.filter(r => r.targetModule === moduleFilter);

    const rentalsCount = allListings.filter(l => l.module === 'rentals').length;
    const jobsCount = allListings.filter(l => l.module === 'jobs').length;
    const servicesCount = allListings.filter(l => l.module === 'services').length;

    const totalListings = filteredListings.length;
    const activeListings = filteredListings.filter(l => l.status === 'active').length;
    const pendingListings = filteredListings.filter(l => l.status === 'pending').length;
    const rejectedListings = filteredListings.filter(l => l.status === 'rejected').length;
    const featuredListings = filteredListings.filter(l => (l.viewsCount || 0) > 100 || l.status === 'active').length;
    const expiredListings = filteredListings.filter(l => l.status === 'expired').length;
    const reportedListings = filteredReports.length;

    // Derived views & totals
    const totalViews = filteredListings.reduce((sum, l) => sum + (l.viewsCount || 0), 0);
    const totalMessages = filteredListings.reduce((sum, l) => sum + (l.inquiriesCount || 0), 0);
    const totalReviews = filteredReviews.length;

    const platformUsers = this.getPlatformUsers();
    const totalUsers = platformUsers.length;
    const verifiedUsers = platformUsers.filter(u => u.isVerified).length;
    const bannedUsers = platformUsers.filter(u => u.status === 'Banned').length;

    return {
      totalListings,
      activeListings,
      pendingListings,
      rejectedListings,
      reportedListings,
      featuredListings,
      expiredListings,
      totalUsers,
      verifiedUsers,
      bannedUsers,
      totalViews,
      totalMessages,
      totalReviews,
      totalRevenue: 0,
      rentalsCount,
      jobsCount,
      servicesCount
    };
  }

  /**
   * Approve a pending listing:
   * 1. Updates status to 'active'
   * 2. Notifies owner via NotificationService
   * 3. Creates entry in Audit Log
   */
  static approveListing(listingId: string, staff: StaffAccount): { success: boolean; listing?: UserListingItem; error?: string } {
    try {
      const listings = ProfileService.getUserListings();
      const listing = listings.find(l => l.id === listingId);
      if (!listing) {
        return { success: false, error: 'Listing not found.' };
      }

      // Update status in ProfileService
      ProfileService.updateListingStatus(listingId, 'active', 'Approved by moderation team.');

      // Notify listing owner
      const notif: AppNotification = {
        id: `notif-appr-${Date.now()}`,
        type: 'LISTING_APPROVED',
        category: 'listings',
        title: 'Listing Approved & Live! 🎉',
        body: `“${listing.title}” has been reviewed and approved by our staff. It is now live on RENTOURA.LK!`,
        createdAt: 'Just now',
        timestamp: Date.now(),
        read: false,
        priority: 'high',
        entityType: listing.module,
        entityId: listing.id,
        listingId: listing.id
      };
      const notifs = NotificationService.getNotifications();
      NotificationService.saveNotifications([notif, ...notifs]);

      // Audit Log
      this.addAuditLog({
        actorId: staff.id,
        actorName: staff.fullName,
        actorRole: staff.role,
        action: 'LISTING_APPROVED',
        targetType: 'listing',
        targetId: listing.id,
        targetTitle: listing.title,
        details: `Approved listing in category "${listing.category}" for public marketplace.`
      });

      return { success: true, listing: { ...listing, status: 'active' } };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to approve listing.' };
    }
  }

  /**
   * Reject a pending listing:
   * Requires mandatory rejectionReason.
   * Updates status to 'rejected', notifies owner with reason, and logs audit entry.
   */
  static rejectListing(listingId: string, reason: string, staff: StaffAccount): { success: boolean; error?: string } {
    if (!reason || !reason.trim()) {
      return { success: false, error: 'Rejection reason is required.' };
    }

    try {
      const listings = ProfileService.getUserListings();
      const listing = listings.find(l => l.id === listingId);
      if (!listing) {
        return { success: false, error: 'Listing not found.' };
      }

      // Update listing in ProfileService with status 'rejected' and reason
      const updatedListing: UserListingItem = {
        ...listing,
        status: 'rejected',
        statusNote: `Rejected: ${reason.trim()}`,
        rejectionReason: reason.trim(),
        updatedAt: new Date().toISOString()
      };
      ProfileService.updateListing(updatedListing);

      // Create notification
      const notif: AppNotification = {
        id: `notif-rej-${Date.now()}`,
        type: 'LISTING_REJECTED',
        category: 'listings',
        title: 'Listing Update: Action Required ⚠️',
        body: `“${listing.title}” was not approved. Reason: "${reason.trim()}". You can update your listing in My Listings.`,
        createdAt: 'Just now',
        timestamp: Date.now(),
        read: false,
        priority: 'high',
        entityType: listing.module,
        entityId: listing.id,
        listingId: listing.id
      };
      const notifs = NotificationService.getNotifications();
      NotificationService.saveNotifications([notif, ...notifs]);

      // Audit log
      this.addAuditLog({
        actorId: staff.id,
        actorName: staff.fullName,
        actorRole: staff.role,
        action: 'LISTING_REJECTED',
        targetType: 'listing',
        targetId: listing.id,
        targetTitle: listing.title,
        details: `Rejected listing. Reason: "${reason.trim()}".`
      });

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to reject listing.' };
    }
  }

  /**
   * Request changes for a listing:
   * Sets status to 'changes_requested', records instructions, notifies owner.
   */
  static requestListingChanges(listingId: string, note: string, staff: StaffAccount): { success: boolean; error?: string } {
    if (!note || !note.trim()) {
      return { success: false, error: 'Feedback instructions are required.' };
    }

    try {
      const listings = ProfileService.getUserListings();
      const listing = listings.find(l => l.id === listingId);
      if (!listing) {
        return { success: false, error: 'Listing not found.' };
      }

      const updatedListing: UserListingItem = {
        ...listing,
        status: 'changes_requested',
        statusNote: `Changes requested: ${note.trim()}`,
        changesRequestedNote: note.trim(),
        updatedAt: new Date().toISOString()
      };
      ProfileService.updateListing(updatedListing);

      // Notification
      const notif: AppNotification = {
        id: `notif-chg-${Date.now()}`,
        type: 'LISTING_PENDING',
        category: 'listings',
        title: 'Changes Requested for Listing 📝',
        body: `Our moderation team requested changes on “${listing.title}”: "${note.trim()}". Please update and resubmit.`,
        createdAt: 'Just now',
        timestamp: Date.now(),
        read: false,
        priority: 'high',
        entityType: listing.module,
        entityId: listing.id,
        listingId: listing.id
      };
      const notifs = NotificationService.getNotifications();
      NotificationService.saveNotifications([notif, ...notifs]);

      // Audit Log
      this.addAuditLog({
        actorId: staff.id,
        actorName: staff.fullName,
        actorRole: staff.role,
        action: 'LISTING_CHANGES_REQUESTED',
        targetType: 'listing',
        targetId: listing.id,
        targetTitle: listing.title,
        details: `Requested changes from owner. Instructions: "${note.trim()}".`
      });

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to request changes.' };
    }
  }

  /**
   * Resolve a report
   */
  static resolveReport(reportId: string, actionTaken: 'Resolved' | 'Dismissed', resolutionNote: string, staff: StaffAccount): { success: boolean; error?: string } {
    try {
      const reports = ReportService.getReports();
      const targetReport = reports.find(r => r.id === reportId);
      if (!targetReport) {
        return { success: false, error: 'Report record not found.' };
      }

      targetReport.status = actionTaken === 'Resolved' ? 'resolved' : 'dismissed';
      targetReport.statusNote = resolutionNote || `Marked as ${actionTaken.toLowerCase()} by moderation.`;

      localStorage.setItem('rentoura_user_reports_v1', JSON.stringify(reports));

      this.addAuditLog({
        actorId: staff.id,
        actorName: staff.fullName,
        actorRole: staff.role,
        action: actionTaken === 'Resolved' ? 'REPORT_RESOLVED' : 'REPORT_DISMISSED',
        targetType: 'report',
        targetId: reportId,
        targetTitle: targetReport.targetTitle,
        details: `Report ${actionTaken}. Note: ${resolutionNote || 'N/A'}`
      });

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to update report.' };
    }
  }

  /**
   * Retrieves Audit Logs
   */
  static getAuditLogs(): AuditLogItem[] {
    try {
      const stored = localStorage.getItem(AUDIT_LOGS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse audit logs:', e);
    }
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(SEED_AUDIT_LOGS));
    return SEED_AUDIT_LOGS;
  }

  /**
   * Adds new entry to Audit Logs
   */
  static addAuditLog(entry: Omit<AuditLogItem, 'id' | 'timestamp' | 'createdAt'>): void {
    try {
      const logs = this.getAuditLogs();
      const newLog: AuditLogItem = {
        ...entry,
        id: `audit-${Date.now()}`,
        timestamp: Date.now(),
        createdAt: 'Just now'
      };
      const updated = [newLog, ...logs].slice(0, 200); // keep last 200 logs
      localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to add audit log:', e);
    }
  }

  /**
   * System Health Status
   */
  static getSystemHealth(): SystemHealthStatus {
    return {
      website: 'Online',
      database: 'Online',
      storagePercentage: 72,
      server: 'Online',
      lastBackupTime: '2 hours ago'
    };
  }

  /**
   * Creates a platform-wide announcement
   */
  static createAnnouncement(announcement: Omit<PlatformAnnouncement, 'id' | 'createdAt' | 'active'>, staff: StaffAccount): PlatformAnnouncement {
    const newAnc: PlatformAnnouncement = {
      ...announcement,
      id: `anc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      active: true
    };

    try {
      const existing = this.getAnnouncements();
      const updated = [newAnc, ...existing];
      localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(updated));

      // Broadcast as App Notification
      const notif: AppNotification = {
        id: `notif-anc-${Date.now()}`,
        type: 'SYSTEM_UPDATE',
        category: 'system',
        title: `📢 ${newAnc.title}`,
        body: newAnc.message,
        createdAt: 'Just now',
        timestamp: Date.now(),
        read: false,
        priority: newAnc.priority === 'urgent' ? 'high' : 'normal'
      };
      const notifs = NotificationService.getNotifications();
      NotificationService.saveNotifications([notif, ...notifs]);

      this.addAuditLog({
        actorId: staff.id,
        actorName: staff.fullName,
        actorRole: staff.role,
        action: 'ANNOUNCEMENT_CREATED',
        targetType: 'announcement',
        targetId: newAnc.id,
        targetTitle: newAnc.title,
        details: `Broadcasted announcement to ${newAnc.targetModule} module.`
      });
    } catch (e) {
      console.error('Failed to save announcement:', e);
    }

    return newAnc;
  }

  static getAnnouncements(): PlatformAnnouncement[] {
    try {
      const stored = localStorage.getItem(ANNOUNCEMENTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        id: 'anc-1',
        title: 'Platform Maintenance Notice',
        message: 'Scheduled system performance upgrades on Sunday 2:00 AM - 3:00 AM.',
        targetModule: 'all',
        priority: 'normal',
        createdAt: '2026-08-10T10:00:00.000Z',
        createdBy: 'Mohmed Muzakkir',
        active: true
      }
    ];
  }

  static toggleAnnouncementActive(id: string, staff: StaffAccount): void {
    const announcements = this.getAnnouncements();
    const updated = announcements.map(a => a.id === id ? { ...a, active: !a.active } : a);
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(updated));

    const anc = announcements.find(a => a.id === id);
    if (anc) {
      this.addAuditLog({
        actorId: staff.id,
        actorName: staff.fullName,
        actorRole: staff.role,
        action: 'ANNOUNCEMENT_UPDATED',
        targetType: 'announcement',
        targetId: id,
        targetTitle: anc.title,
        details: `Toggled active status to ${!anc.active}`
      });
    }
  }

  static deleteAnnouncement(id: string, staff: StaffAccount): void {
    const announcements = this.getAnnouncements();
    const anc = announcements.find(a => a.id === id);
    const updated = announcements.filter(a => a.id !== id);
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(updated));

    if (anc) {
      this.addAuditLog({
        actorId: staff.id,
        actorName: staff.fullName,
        actorRole: staff.role,
        action: 'ANNOUNCEMENT_DELETED',
        targetType: 'announcement',
        targetId: id,
        targetTitle: anc.title,
        details: 'Deleted announcement from platform.'
      });
    }
  }

  /**
   * Get Platform Users
   */
  static getPlatformUsers(): RegisteredUser[] {
    try {
      const stored = localStorage.getItem(USERS_ACCOUNTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse registered users:', e);
    }
    return [];
  }

  /**
   * Update User Account Status in Supabase public.profiles
   */
  static async updateUserStatusAsync(userId: string, status: UserAccountStatus, staff: StaffAccount): Promise<void> {
    const dbStatus = status === 'Active' ? 'active' : status === 'Suspended' ? 'suspended' : 'banned';
    try {
      await supabase
        .from('profiles')
        .update({ account_status: dbStatus })
        .eq('id', userId);
    } catch (e) {
      console.error('Failed to update user status in profiles:', e);
    }

    this.addAuditLog({
      actorId: staff.id,
      actorName: staff.fullName,
      actorRole: staff.role,
      action: status === 'Suspended' ? 'USER_SUSPENDED' : status === 'Banned' ? 'USER_BANNED' : 'USER_ACTIVATED',
      targetType: 'user',
      targetId: userId,
      targetTitle: userId,
      details: `Changed account status to ${status}.`
    });
  }

  /**
   * Suspend user with mandatory reason & duration
   */
  static suspendUser(userId: string, reason: string, staff: StaffAccount): { success: boolean; error?: string } {
    if (!reason || !reason.trim()) {
      return { success: false, error: 'Suspension reason is mandatory.' };
    }
    
    // Update Supabase profile asynchronously
    supabase
      .from('profiles')
      .update({ account_status: 'suspended' })
      .eq('id', userId)
      .then(({ error }) => {
        if (error) console.error('Failed to suspend profile in DB:', error);
      });

    this.addAuditLog({
      actorId: staff.id,
      actorName: staff.fullName,
      actorRole: staff.role,
      action: 'USER_SUSPENDED',
      targetType: 'user',
      targetId: userId,
      targetTitle: userId,
      details: `Suspended user account (${userId}). Reason: "${reason.trim()}"`
    });

    return { success: true };
  }

  /**
   * Restore suspended user account
   */
  static restoreUser(userId: string, staff: StaffAccount): { success: boolean; error?: string } {
    // Update Supabase profile asynchronously
    supabase
      .from('profiles')
      .update({ account_status: 'active' })
      .eq('id', userId)
      .then(({ error }) => {
        if (error) console.error('Failed to restore profile in DB:', error);
      });

    this.addAuditLog({
      actorId: staff.id,
      actorName: staff.fullName,
      actorRole: staff.role,
      action: 'USER_RESTORED',
      targetType: 'user',
      targetId: userId,
      targetTitle: userId,
      details: `Restored user account (${userId}) to active status.`
    });

    return { success: true };
  }

  /**
   * Ban user account permanently
   */
  static banUser(userId: string, reason: string, staff: StaffAccount): { success: boolean; error?: string } {
    if (staff.role !== 'ADMIN' && staff.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized: Only Admins or Super Admins can ban accounts.' };
    }
    if (!reason || !reason.trim()) {
      return { success: false, error: 'Ban reason is mandatory.' };
    }

    // Update Supabase profile asynchronously
    supabase
      .from('profiles')
      .update({ account_status: 'banned' })
      .eq('id', userId)
      .then(({ error }) => {
        if (error) console.error('Failed to ban profile in DB:', error);
      });

    this.addAuditLog({
      actorId: staff.id,
      actorName: staff.fullName,
      actorRole: staff.role,
      action: 'USER_BANNED',
      targetType: 'user',
      targetId: userId,
      targetTitle: userId,
      details: `Permanently banned user account (${userId}). Reason: "${reason.trim()}"`
    });

    return { success: true };
  }

  /**
   * Export Users as CSV safely (excluding secrets)
   */
  static exportUsersCsv(): void {
    const users = this.getPlatformUsers();
    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Account Type', 'Status', 'Verified', 'City', 'District', 'Listings Count', 'Joined Date'];
    const rows = users.map(u => [
      u.id,
      `"${u.fullName}"`,
      `"${u.email}"`,
      `"${u.phone}"`,
      u.accountType,
      u.status,
      u.isVerified ? 'Yes' : 'No',
      `"${u.city}"`,
      `"${u.district}"`,
      u.listingsCount,
      `"${u.createdAt}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Rentoura_Users_Directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Toggle Verification Status for User
   */
  static toggleUserVerification(userId: string, isVerified: boolean, staff: StaffAccount): void {
    const users = this.getPlatformUsers();
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    targetUser.isVerified = isVerified;
    if (isVerified && targetUser.status === 'Pending Verification') {
      targetUser.status = 'Active';
    }
    localStorage.setItem(USERS_ACCOUNTS_KEY, JSON.stringify(users));

    this.addAuditLog({
      actorId: staff.id,
      actorName: staff.fullName,
      actorRole: staff.role,
      action: isVerified ? 'USER_VERIFIED' : 'USER_UNVERIFIED',
      targetType: 'user',
      targetId: userId,
      targetTitle: targetUser.fullName,
      details: `${isVerified ? 'Verified' : 'Revoked verification for'} user ${targetUser.email}.`
    });
  }

  /**
   * Add a new Staff Account (Super Admin / Admin / Moderator)
   */
  static addStaffAccount(newStaffData: Omit<StaffAccount, 'id' | 'createdAt' | 'lastLogin'>, currentStaff: StaffAccount): StaffAccount {
    const allStaff = this.getStaffAccounts();
    const newStaff: StaffAccount = {
      ...newStaffData,
      id: `staff-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastLogin: 'Never'
    };

    const updated = [...allStaff, newStaff];
    this.saveStaffAccounts(updated);

    this.addAuditLog({
      actorId: currentStaff.id,
      actorName: currentStaff.fullName,
      actorRole: currentStaff.role,
      action: 'STAFF_CREATED',
      targetType: 'user',
      targetId: newStaff.id,
      targetTitle: newStaff.fullName,
      details: `Created new staff account with role ${newStaff.role}.`
    });

    return newStaff;
  }

  /**
   * Update Staff Role
   */
  static updateStaffRole(staffId: string, newRole: StaffRole, currentStaff: StaffAccount): void {
    const allStaff = this.getStaffAccounts();
    const target = allStaff.find(s => s.id === staffId);
    if (!target) return;

    target.role = newRole;
    this.saveStaffAccounts(allStaff);

    this.addAuditLog({
      actorId: currentStaff.id,
      actorName: currentStaff.fullName,
      actorRole: currentStaff.role,
      action: 'ROLE_UPDATED',
      targetType: 'user',
      targetId: staffId,
      targetTitle: target.fullName,
      details: `Updated role of staff member to ${newRole}.`
    });
  }

  /**
   * Delete review by admin
   */
  static deleteReview(reviewId: string, staff: StaffAccount): void {
    const reviews = ReviewService.getAllReviews();
    const target = reviews.find(r => r.id === reviewId);
    if (!target) return;

    const updated = reviews.filter(r => r.id !== reviewId);
    ReviewService.saveReviews(updated);

    this.addAuditLog({
      actorId: staff.id,
      actorName: staff.fullName,
      actorRole: staff.role,
      action: 'REVIEW_DELETED',
      targetType: 'review',
      targetId: reviewId,
      targetTitle: target.targetTitle,
      details: `Deleted user review by ${target.authorName}.`
    });
  }

  /**
   * Delete listing by admin
   */
  static deleteListingAdmin(listingId: string, staff: StaffAccount): void {
    const listings = ProfileService.getUserListings();
    const target = listings.find(l => l.id === listingId);
    if (!target) return;

    ProfileService.deleteListing(listingId);

    this.addAuditLog({
      actorId: staff.id,
      actorName: staff.fullName,
      actorRole: staff.role,
      action: 'LISTING_DELETED',
      targetType: 'listing',
      targetId: listingId,
      targetTitle: target.title,
      details: `Permanently removed listing from platform.`
    });
  }

  // ==========================================
  // REAL SUPABASE ASYNC CONTROL PLANE METHODS
  // ==========================================

  /**
   * Real Supabase KPI metrics query
   */
  static async getKpiMetricsAsync(moduleFilter: 'all' | 'rentals' | 'jobs' | 'services' = 'all'): Promise<AdminKpiMetrics> {
    try {
      // 1. Fetch listings summary directly from public.listings
      let listingsQuery = supabase
        .from('listings')
        .select('id, module, status, views_count, inquiries_count');

      if (moduleFilter !== 'all') {
        listingsQuery = listingsQuery.eq('module', moduleFilter);
      }
      const { data: listings } = await listingsQuery;

      const allListings = listings || [];
      const totalListings = allListings.length;
      const activeListings = allListings.filter(l => l.status === 'active').length;
      const pendingListings = allListings.filter(l => l.status === 'pending').length;
      const rejectedListings = allListings.filter(l => l.status === 'rejected').length;
      const expiredListings = allListings.filter(l => l.status === 'expired').length;
      const featuredListings = allListings.filter(l => l.status === 'active').length;

      const rentalsCount = allListings.filter(l => l.module === 'rentals').length;
      const jobsCount = allListings.filter(l => l.module === 'jobs').length;
      const servicesCount = allListings.filter(l => l.module === 'services').length;

      const totalViews = allListings.reduce((sum, l) => sum + (l.views_count || 0), 0);
      const totalMessages = allListings.reduce((sum, l) => sum + (l.inquiries_count || 0), 0);

      // 2. Fetch profiles summary directly from public.profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, is_identity_verified, account_status');

      const allProfiles = profiles || [];
      const totalUsers = allProfiles.length;
      const verifiedUsers = allProfiles.filter(p => p.is_identity_verified).length;
      const bannedUsers = allProfiles.filter(p => p.account_status === 'banned' || p.account_status === 'suspended').length;

      // 3. Fetch reports summary if table exists
      let reportedListings = 0;
      try {
        const { count } = await supabase.from('listing_reports').select('id', { count: 'exact', head: true });
        reportedListings = count || 0;
      } catch (e) {}

      // 4. Fetch reviews summary if table exists
      let totalReviews = 0;
      try {
        const { count } = await supabase.from('listing_reviews').select('id', { count: 'exact', head: true });
        totalReviews = count || 0;
      } catch (e) {}

      return {
        totalListings,
        activeListings,
        pendingListings,
        rejectedListings,
        reportedListings,
        featuredListings,
        expiredListings,
        totalUsers,
        verifiedUsers,
        bannedUsers,
        totalViews,
        totalMessages,
        totalReviews,
        totalRevenue: 0,
        rentalsCount,
        jobsCount,
        servicesCount
      };
    } catch (e) {
      console.warn('[AdminService] Fallback to zero KPI metrics:', e);
      return {
        totalListings: 0,
        activeListings: 0,
        pendingListings: 0,
        rejectedListings: 0,
        reportedListings: 0,
        featuredListings: 0,
        expiredListings: 0,
        totalUsers: 0,
        verifiedUsers: 0,
        bannedUsers: 0,
        totalViews: 0,
        totalMessages: 0,
        totalReviews: 0,
        totalRevenue: 0,
        rentalsCount: 0,
        jobsCount: 0,
        servicesCount: 0
      };
    }
  }

  /**
   * Real Supabase Audit Logs
   */
  static async getAuditLogsAsync(): Promise<AuditLogItem[]> {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (error || !data) {
        return this.getAuditLogs();
      }

      return data.map(item => ({
        id: item.id,
        actorId: item.actor_id || '',
        actorName: item.actor_name,
        actorRole: (item.actor_role?.toUpperCase() || 'MODERATOR') as StaffRole,
        action: item.action,
        targetType: item.target_type || 'listing',
        targetId: item.target_id || '',
        targetTitle: item.target_title || '',
        details: item.details || '',
        timestamp: new Date(item.created_at).getTime(),
        createdAt: item.created_at
      }));
    } catch (e) {
      return this.getAuditLogs();
    }
  }

  static async addAuditLogAsync(entry: Omit<AuditLogItem, 'id' | 'timestamp' | 'createdAt'>): Promise<void> {
    this.addAuditLog(entry);
    try {
      await supabase.from('audit_logs').insert({
        actor_id: entry.actorId || null,
        actor_name: entry.actorName,
        actor_role: entry.actorRole,
        action: entry.action,
        target_type: entry.targetType,
        target_id: entry.targetId,
        target_title: entry.targetTitle,
        details: entry.details
      });
    } catch (e) {
      console.warn('[AdminService] Could not persist audit log to DB:', e);
    }
  }

  /**
   * Real Supabase Announcements
   */
  static async getAnnouncementsAsync(targetModule?: string): Promise<PlatformAnnouncement[]> {
    try {
      let query = supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (targetModule && targetModule !== 'all') {
        query = query.or(`target_module.eq.${targetModule},target_module.eq.all`);
      }

      const { data, error } = await query;

      if (error || !data) {
        return this.getAnnouncements();
      }

      return data.map(a => ({
        id: a.id,
        title: a.title,
        message: a.message,
        targetModule: (a.target_module || 'all') as any,
        priority: (a.priority || 'normal') as any,
        createdAt: a.created_at,
        createdBy: a.created_by || 'Staff',
        active: a.is_active
      }));
    } catch (e) {
      return this.getAnnouncements();
    }
  }

  static async createAnnouncementAsync(
    announcement: Omit<PlatformAnnouncement, 'id' | 'createdAt' | 'active'>,
    staff: StaffAccount
  ): Promise<PlatformAnnouncement> {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert({
          title: announcement.title,
          message: announcement.message,
          target_module: announcement.targetModule,
          priority: announcement.priority,
          is_active: true,
          created_by: staff.fullName
        })
        .select('*')
        .single();

      if (error || !data) {
        return this.createAnnouncement(announcement, staff);
      }

      const created: PlatformAnnouncement = {
        id: data.id,
        title: data.title,
        message: data.message,
        targetModule: data.target_module as any,
        priority: data.priority as any,
        createdAt: data.created_at,
        createdBy: data.created_by,
        active: data.is_active
      };

      await this.addAuditLogAsync({
        actorId: staff.id,
        actorName: staff.fullName,
        actorRole: staff.role,
        action: 'ANNOUNCEMENT_CREATED',
        targetType: 'announcement',
        targetId: created.id,
        targetTitle: created.title,
        details: `Broadcasted announcement to ${created.targetModule} module.`
      });

      return created;
    } catch (e) {
      return this.createAnnouncement(announcement, staff);
    }
  }

  static async toggleAnnouncementActiveAsync(id: string, staff: StaffAccount): Promise<void> {
    try {
      const announcements = await this.getAnnouncementsAsync();
      const current = announcements.find(a => a.id === id);
      if (!current) return;

      const newStatus = !current.active;
      const { error } = await supabase
        .from('announcements')
        .update({ is_active: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        this.toggleAnnouncementActive(id, staff);
        return;
      }

      await this.addAuditLogAsync({
        actorId: staff.id,
        actorName: staff.fullName,
        actorRole: staff.role,
        action: 'ANNOUNCEMENT_UPDATED',
        targetType: 'announcement',
        targetId: id,
        targetTitle: current.title,
        details: `Toggled active status to ${newStatus}`
      });
    } catch (e) {
      this.toggleAnnouncementActive(id, staff);
    }
  }

  static async deleteAnnouncementAsync(id: string, staff: StaffAccount): Promise<void> {
    try {
      const announcements = await this.getAnnouncementsAsync();
      const current = announcements.find(a => a.id === id);

      const { error } = await supabase.from('announcements').delete().eq('id', id);
      if (error) {
        this.deleteAnnouncement(id, staff);
        return;
      }

      if (current) {
        await this.addAuditLogAsync({
          actorId: staff.id,
          actorName: staff.fullName,
          actorRole: staff.role,
          action: 'ANNOUNCEMENT_DELETED',
          targetType: 'announcement',
          targetId: id,
          targetTitle: current.title,
          details: 'Deleted announcement from platform.'
        });
      }
    } catch (e) {
      this.deleteAnnouncement(id, staff);
    }
  }

  /**
   * Site Assets (Slide images & logos) File Upload to `site-assets` bucket
   */
  static async uploadSiteAssetAsync(file: File, folder: string = 'slides'): Promise<{ url?: string; error?: string }> {
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const filePath = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) {
        return { error: uploadError.message };
      }

      const { data } = supabase.storage.from('site-assets').getPublicUrl(filePath);
      return { url: data.publicUrl };
    } catch (e: any) {
      return { error: e?.message || 'Upload failed' };
    }
  }

  /**
   * Real Supabase Home Slides Manager
   */
  static async getHomeSlidesAsync(placementFilter?: string): Promise<HomeSlideItem[]> {
    try {
      let query = supabase.from('home_slides').select('*').order('display_order', { ascending: true });
      if (placementFilter && placementFilter !== 'all') {
        query = query.or(`placement.eq.${placementFilter},module.eq.${placementFilter}`);
      }
      const { data, error } = await query;
      if (error || !data) return [];

      return data.map(s => ({
        id: s.id,
        title: s.title,
        subtitle: s.subtitle,
        description: s.description,
        imageUrl: s.image_url,
        mobileImageUrl: s.mobile_image_url,
        module: s.module || 'home',
        placement: s.placement || s.module || 'home',
        ctaText: s.cta_text,
        ctaRoute: s.cta_route,
        displayOrder: s.display_order ?? 0,
        durationMs: s.duration_ms,
        overlayStrength: s.overlay_strength,
        isActive: s.is_active ?? true,
        createdAt: s.created_at,
        updatedAt: s.updated_at
      }));
    } catch (e) {
      console.error('Failed to load home slides:', e);
      return [];
    }
  }

  static async saveHomeSlideAsync(slide: Partial<HomeSlideItem>, staff: StaffAccount): Promise<{ success: boolean; data?: HomeSlideItem; error?: string }> {
    try {
      const payload = {
        title: slide.title,
        subtitle: slide.subtitle || null,
        description: slide.description || null,
        image_url: slide.imageUrl || null,
        mobile_image_url: slide.mobileImageUrl || null,
        module: slide.module || 'home',
        placement: slide.placement || slide.module || 'home',
        cta_text: slide.ctaText || null,
        cta_route: slide.ctaRoute || null,
        display_order: slide.displayOrder ?? 0,
        duration_ms: slide.durationMs || null,
        overlay_strength: slide.overlayStrength || null,
        is_active: slide.isActive ?? true,
        updated_at: new Date().toISOString()
      };

      if (slide.id) {
        const { data, error } = await supabase
          .from('home_slides')
          .update(payload)
          .eq('id', slide.id)
          .select('*')
          .single();
        if (error) return { success: false, error: error.message };

        await this.addAuditLogAsync({
          actorId: staff.id,
          actorName: staff.fullName,
          actorRole: staff.role,
          action: 'SLIDE_UPDATED',
          targetType: 'settings',
          targetId: slide.id,
          targetTitle: slide.title,
          details: `Updated marketplace slide "${slide.title}".`
        });
        return { success: true };
      } else {
        const { data, error } = await supabase
          .from('home_slides')
          .insert(payload)
          .select('*')
          .single();
        if (error) return { success: false, error: error.message };

        await this.addAuditLogAsync({
          actorId: staff.id,
          actorName: staff.fullName,
          actorRole: staff.role,
          action: 'SLIDE_CREATED',
          targetType: 'settings',
          targetId: data.id,
          targetTitle: data.title,
          details: `Created new slide "${data.title}" for placement ${data.placement}.`
        });
        return { success: true };
      }
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to save slide.' };
    }
  }

  static async deleteHomeSlideAsync(slideId: string, staff: StaffAccount): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.from('home_slides').delete().eq('id', slideId);
      if (error) return { success: false, error: error.message };

      await this.addAuditLogAsync({
        actorId: staff.id,
        actorName: staff.fullName,
        actorRole: staff.role,
        action: 'SLIDE_DELETED',
        targetType: 'settings',
        targetId: slideId,
        details: `Deleted slide ID ${slideId}.`
      });
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to delete slide.' };
    }
  }

  /**
   * Real Supabase Job Companies Manager
   */
  static async getJobCompaniesAsync(): Promise<JobCompanyItem[]> {
    try {
      const { data, error } = await supabase
        .from('job_companies')
        .select('*')
        .order('display_order', { ascending: true })
        .order('name', { ascending: true });

      if (error || !data) return [];

      return data.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        logoUrl: c.logo_url,
        websiteUrl: c.website_url,
        shortDescription: c.short_description,
        subtitle: c.subtitle,
        brandKey: c.brand_key || 'custom',
        isFeatured: c.is_featured ?? false,
        displayOrder: c.display_order ?? 0,
        isActive: c.is_active ?? true,
        createdAt: c.created_at,
        updatedAt: c.updated_at
      }));
    } catch (e) {
      console.error('Failed to load job companies:', e);
      return [];
    }
  }

  static async saveJobCompanyAsync(company: Partial<JobCompanyItem>, staff: StaffAccount): Promise<{ success: boolean; error?: string }> {
    try {
      const cleanSlug = (company.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const payload = {
        name: company.name,
        slug: company.slug || cleanSlug,
        logo_url: company.logoUrl || null,
        website_url: company.websiteUrl || null,
        short_description: company.shortDescription || null,
        subtitle: company.subtitle || null,
        brand_key: company.brandKey || 'custom',
        is_featured: company.isFeatured ?? false,
        display_order: company.displayOrder ?? 0,
        is_active: company.isActive ?? true,
        updated_at: new Date().toISOString()
      };

      if (company.id) {
        const { error } = await supabase
          .from('job_companies')
          .update(payload)
          .eq('id', company.id);
        if (error) return { success: false, error: error.message };

        await this.addAuditLogAsync({
          actorId: staff.id,
          actorName: staff.fullName,
          actorRole: staff.role,
          action: 'COMPANY_UPDATED',
          targetType: 'settings',
          targetId: company.id,
          targetTitle: company.name,
          details: `Updated hiring company profile for ${company.name}.`
        });
        return { success: true };
      } else {
        const { data, error } = await supabase
          .from('job_companies')
          .insert(payload)
          .select('id')
          .single();
        if (error) return { success: false, error: error.message };

        await this.addAuditLogAsync({
          actorId: staff.id,
          actorName: staff.fullName,
          actorRole: staff.role,
          action: 'COMPANY_CREATED',
          targetType: 'settings',
          targetId: data.id,
          targetTitle: company.name,
          details: `Created new hiring company profile for ${company.name}.`
        });
        return { success: true };
      }
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to save company.' };
    }
  }

  static async deleteJobCompanyAsync(companyId: string, staff: StaffAccount): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.from('job_companies').delete().eq('id', companyId);
      if (error) return { success: false, error: error.message };

      await this.addAuditLogAsync({
        actorId: staff.id,
        actorName: staff.fullName,
        actorRole: staff.role,
        action: 'COMPANY_DELETED',
        targetType: 'settings',
        targetId: companyId,
        details: `Deleted company ID ${companyId}.`
      });
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to delete company.' };
    }
  }

  /**
   * Real Support Tickets Summary
   */
  static async getSupportTicketsSummaryAsync(): Promise<{ total: number; open: number; unread: number }> {
    try {
      const { data, error } = await supabase.from('support_tickets').select('id, status, is_read');
      if (error || !data) return { total: 0, open: 0, unread: 0 };

      const total = data.length;
      const open = data.filter(t => t.status === 'open' || t.status === 'pending').length;
      const unread = data.filter(t => !t.is_read).length;

      return { total, open, unread };
    } catch (e) {
      return { total: 0, open: 0, unread: 0 };
    }
  }
}


