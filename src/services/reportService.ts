import { NotificationService } from './notificationService';
import { AppNotification } from '../types/notificationTypes';
import { StaffAccount, StaffRole } from '../types/adminTypes';
import { AdminService } from './adminService';

export type ReportTargetType = 'listing' | 'review' | 'user' | 'conversation';
export type ReportTargetModule = 'rentals' | 'jobs' | 'services' | 'general';
export type ReportStatus = 'submitted' | 'under_review' | 'resolved' | 'dismissed';
export type ReportSource = 'listing_detail' | 'review_card' | 'safety_center' | 'help_center' | 'chat' | 'user_profile';

export interface InternalStaffNote {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  note: string;
  createdAt: string;
  timestamp: number;
}

export interface ReportHistoryItem {
  id: string;
  action: string;
  actorName: string;
  actorRole: string;
  details: string;
  createdAt: string;
  timestamp: number;
}

export interface ListingReport {
  id: string;
  reporterId: string;
  reporterName?: string;
  reporterEmail?: string;
  reporterAvatar?: string;
  reporterRole?: 'User' | 'Business' | 'Anonymous';
  
  targetType: ReportTargetType;
  targetId: string;
  targetModule: ReportTargetModule;
  targetTitle: string;
  targetLocation?: string;
  targetPrice?: string;
  targetImageUrl?: string;
  targetAuthorName?: string;
  targetAuthorId?: string;

  reasonCode: string;
  reasonLabel: string;
  description?: string;
  details?: string;
  contactInfo?: string;
  allowContact: boolean;
  source?: ReportSource;

  status: ReportStatus;
  statusNote?: string;
  assignedTo?: string;
  assignedToName?: string;

  resolutionOutcome?: string;
  userFacingMessage?: string;

  internalNotes?: InternalStaffNote[];
  history?: ReportHistoryItem[];

  createdAt: string;
  timestamp: number;
  submittedDate?: string;
  updatedAt?: number;
}

const STORAGE_KEY = 'rentoura_user_reports_v1';

// Canonical initial seed reports to represent active system state
const SEED_REPORTS: ListingReport[] = [
  {
    id: 'RP-7854',
    reporterId: 'USR-2456',
    reporterName: 'Sahan De Silva',
    reporterEmail: 'sahan.desilva@gmail.com',
    reporterAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    reporterRole: 'User',
    targetType: 'listing',
    targetId: 'rent-house-kandy',
    targetModule: 'rentals',
    targetTitle: 'Modern 3 Bedroom House in Kandy',
    targetLocation: 'Kandy, Central Province',
    targetPrice: 'Rs. 85,000 / mo',
    targetImageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80',
    reasonCode: 'inappropriate_content',
    reasonLabel: 'Inappropriate Content',
    description: 'Misleading information in description regarding property square footage and parking availability.',
    details: 'Misleading information in description regarding property square footage and parking availability.',
    allowContact: true,
    source: 'listing_detail',
    status: 'submitted',
    statusNote: 'Awaiting initial moderator triage.',
    createdAt: '10 May 2025 10:30 AM',
    submittedDate: '10 May 2025 10:30 AM',
    timestamp: Date.now() - 7200000, // 2 hours ago
    history: [
      {
        id: 'hist-1',
        action: 'REPORT_SUBMITTED',
        actorName: 'Sahan De Silva',
        actorRole: 'User',
        details: 'Report filed via Listing Detail page.',
        createdAt: '10 May 2025 10:30 AM',
        timestamp: Date.now() - 7200000
      }
    ],
    internalNotes: []
  },
  {
    id: 'RP-7853',
    reporterId: 'USR-1245',
    reporterName: 'Dilini Fernando',
    reporterEmail: 'dilini.f@gmail.com',
    reporterAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    reporterRole: 'User',
    targetType: 'listing',
    targetId: 'rent-premio-colombo',
    targetModule: 'rentals',
    targetTitle: 'Toyota Premio 2018 for Rent (Self Drive)',
    targetLocation: 'Colombo, Western Province',
    targetPrice: 'Rs. 12,500 / day',
    targetImageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80',
    reasonCode: 'spam_fake_ad',
    reasonLabel: 'Spam / Fake Ad',
    description: 'Repeated / duplicate listing posted across multiple accounts with contradictory prices.',
    details: 'Repeated / duplicate listing posted across multiple accounts with contradictory prices.',
    allowContact: true,
    source: 'listing_detail',
    status: 'under_review',
    statusNote: 'Under active investigation by moderation staff.',
    assignedTo: 'staff-102',
    assignedToName: 'Hasini K.',
    createdAt: '10 May 2025 09:15 AM',
    submittedDate: '10 May 2025 09:15 AM',
    timestamp: Date.now() - 10800000, // 3 hours ago
    history: [
      {
        id: 'hist-2a',
        action: 'REPORT_SUBMITTED',
        actorName: 'Dilini Fernando',
        actorRole: 'User',
        details: 'Report filed via Listing Detail page.',
        createdAt: '10 May 2025 09:15 AM',
        timestamp: Date.now() - 10800000
      },
      {
        id: 'hist-2b',
        action: 'ASSIGNED',
        actorName: 'Super Admin',
        actorRole: 'Super Admin',
        details: 'Assigned to moderator Hasini K.',
        createdAt: '10 May 2025 09:30 AM',
        timestamp: Date.now() - 9900000
      }
    ],
    internalNotes: [
      {
        id: 'note-1',
        authorId: 'staff-102',
        authorName: 'Hasini K.',
        authorRole: 'Moderator',
        note: 'Cross-checking with vehicle registration database and previous listing history.',
        createdAt: '10 May 2025 09:40 AM',
        timestamp: Date.now() - 9300000
      }
    ]
  },
  {
    id: 'RP-4521',
    reporterId: 'USR-9812',
    reporterName: 'Hasini K.',
    reporterEmail: 'hasinik@gmail.com',
    reporterAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    reporterRole: 'User',
    targetType: 'listing',
    targetId: 'job-wedding-dj',
    targetModule: 'jobs',
    targetTitle: 'DJ for Wedding Events (Weekend)',
    targetLocation: 'Kurunegala, North Western Province',
    targetPrice: 'Rs. 45,000 / event',
    targetImageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80',
    reasonCode: 'inappropriate_content',
    reasonLabel: 'Inappropriate Content',
    description: 'Direct personal phone number and WhatsApp contact details embedded inside description text.',
    details: 'Direct personal phone number and WhatsApp contact details embedded inside description text.',
    allowContact: false,
    source: 'listing_detail',
    status: 'submitted',
    statusNote: 'Queued for content policy review.',
    createdAt: '10 May 2025 08:40 AM',
    submittedDate: '10 May 2025 08:40 AM',
    timestamp: Date.now() - 14400000, // 4 hours ago
    history: [
      {
        id: 'hist-3',
        action: 'REPORT_SUBMITTED',
        actorName: 'Hasini K.',
        actorRole: 'User',
        details: 'Report submitted for policy check.',
        createdAt: '10 May 2025 08:40 AM',
        timestamp: Date.now() - 14400000
      }
    ],
    internalNotes: []
  },
  {
    id: 'RP-6627',
    reporterId: 'USR-7761',
    reporterName: 'Tharindu J.',
    reporterEmail: 'tharindu.j@gmail.com',
    reporterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    reporterRole: 'User',
    targetType: 'listing',
    targetId: 'srv-tiling-galle',
    targetModule: 'services',
    targetTitle: 'Professional Tiling Service',
    targetLocation: 'Galle, Southern Province',
    targetPrice: 'Rs. 3,500 / sq.ft',
    targetImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
    reasonCode: 'misleading_information',
    reasonLabel: 'Misleading Information',
    description: 'Wrong pricing displayed on public card compared to phone quote given to customer.',
    details: 'Wrong pricing displayed on public card compared to phone quote given to customer.',
    allowContact: true,
    source: 'listing_detail',
    status: 'resolved',
    statusNote: 'Moderation review completed. Provider updated pricing info.',
    resolutionOutcome: 'Warning Issued & Pricing Updated',
    userFacingMessage: 'Thank you. The service provider was instructed to clarify pricing structure on their listing.',
    createdAt: '09 May 2025 11:20 AM',
    submittedDate: '09 May 2025 11:20 AM',
    timestamp: Date.now() - 86400000, // 1 day ago
    history: [
      {
        id: 'hist-4a',
        action: 'REPORT_SUBMITTED',
        actorName: 'Tharindu J.',
        actorRole: 'User',
        details: 'Report submitted.',
        createdAt: '09 May 2025 11:20 AM',
        timestamp: Date.now() - 86400000
      },
      {
        id: 'hist-4b',
        action: 'RESOLVED',
        actorName: 'Super Admin',
        actorRole: 'Super Admin',
        details: 'Resolved with provider warning.',
        createdAt: '09 May 2025 03:15 PM',
        timestamp: Date.now() - 72000000
      }
    ],
    internalNotes: []
  },
  {
    id: 'RP-7841',
    reporterId: 'BUS-3321',
    reporterName: 'Event Masters (Pvt) Ltd',
    reporterEmail: 'events@eventmasters.lk',
    reporterAvatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80',
    reporterRole: 'Business',
    targetType: 'listing',
    targetId: 'rent-apt-colombo-3',
    targetModule: 'rentals',
    targetTitle: 'Luxury Apartment for Rent in Colombo 03',
    targetLocation: 'Colombo 03, Western Province',
    targetPrice: 'Rs. 220,000 / mo',
    targetImageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
    reasonCode: 'suspicious_activity',
    reasonLabel: 'Suspicious Activity',
    description: 'Potential scam listing requesting advance bank transfer before property inspection.',
    details: 'Potential scam listing requesting advance bank transfer before property inspection.',
    allowContact: true,
    source: 'listing_detail',
    status: 'under_review',
    statusNote: 'High priority inspection. Verification requested from seller.',
    assignedTo: 'staff-101',
    assignedToName: 'Nimal Perera',
    createdAt: '09 May 2025 06:10 PM',
    submittedDate: '09 May 2025 06:10 PM',
    timestamp: Date.now() - 110000000,
    history: [
      {
        id: 'hist-5',
        action: 'MARKED_UNDER_REVIEW',
        actorName: 'Nimal Perera',
        actorRole: 'Moderator',
        details: 'Investigation initiated. Contacted poster for deed proof.',
        createdAt: '09 May 2025 06:30 PM',
        timestamp: Date.now() - 108000000
      }
    ],
    internalNotes: [
      {
        id: 'note-2',
        authorId: 'staff-101',
        authorName: 'Nimal Perera',
        authorRole: 'Moderator',
        note: 'Requested national ID copy and utility bill proof of ownership.',
        createdAt: '09 May 2025 06:35 PM',
        timestamp: Date.now() - 107700000
      }
    ]
  },
  {
    id: 'RP-2234',
    reporterId: 'USR-5567',
    reporterName: 'Kasun Madusanka',
    reporterEmail: 'kasun.m@gmail.com',
    reporterAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    reporterRole: 'User',
    targetType: 'listing',
    targetId: 'srv-photography-matara',
    targetModule: 'services',
    targetTitle: 'Photography & Video Services',
    targetLocation: 'Matara, Southern Province',
    targetPrice: 'Rs. 25,000 / day',
    targetImageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80',
    reasonCode: 'other',
    reasonLabel: 'Other',
    description: 'Watermarked images belonging to a third-party photography studio without license.',
    details: 'Watermarked images belonging to a third-party photography studio without license.',
    allowContact: false,
    source: 'listing_detail',
    status: 'resolved',
    statusNote: 'Unlicensed images removed from gallery.',
    resolutionOutcome: 'Content Removed',
    userFacingMessage: 'Thank you for reporting. Unlicensed portfolio images have been removed from the listing.',
    createdAt: '08 May 2025 03:45 PM',
    submittedDate: '08 May 2025 03:45 PM',
    timestamp: Date.now() - 172800000,
    history: [
      {
        id: 'hist-6',
        action: 'RESOLVED',
        actorName: 'Tharindu Jayasekara',
        actorRole: 'Moderator',
        details: 'Images removed and seller notified.',
        createdAt: '08 May 2025 04:30 PM',
        timestamp: Date.now() - 169200000
      }
    ],
    internalNotes: []
  },
  {
    id: 'RP-5566',
    reporterId: 'USR-9981',
    reporterName: 'Nimal Perera',
    reporterEmail: 'nimalperera@gmail.com',
    reporterAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    reporterRole: 'User',
    targetType: 'listing',
    targetId: 'rent-scooter-jaffna',
    targetModule: 'rentals',
    targetTitle: 'Honda Dio Scooter for Rent',
    targetLocation: 'Jaffna, Northern Province',
    targetPrice: 'Rs. 2,200 / day',
    targetImageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80',
    reasonCode: 'inappropriate_content',
    reasonLabel: 'Inappropriate Content',
    description: 'Offensive or abusive language in condition guidelines.',
    details: 'Offensive or abusive language in condition guidelines.',
    allowContact: true,
    source: 'listing_detail',
    status: 'submitted',
    statusNote: 'Queued for moderation review.',
    createdAt: '08 May 2025 01:22 PM',
    submittedDate: '08 May 2025 01:22 PM',
    timestamp: Date.now() - 180000000,
    history: [
      {
        id: 'hist-7',
        action: 'REPORT_SUBMITTED',
        actorName: 'Nimal Perera',
        actorRole: 'User',
        details: 'Submitted from listing detail page.',
        createdAt: '08 May 2025 01:22 PM',
        timestamp: Date.now() - 180000000
      }
    ],
    internalNotes: []
  },
  {
    id: 'RP-4433',
    reporterId: 'USR-4490',
    reporterName: 'Chandika S.',
    reporterEmail: 'chandikas@gmail.com',
    reporterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    reporterRole: 'User',
    targetType: 'listing',
    targetId: 'rent-table-negombo',
    targetModule: 'rentals',
    targetTitle: 'Dining Table Set for Rent',
    targetLocation: 'Negombo, Western Province',
    targetPrice: 'Rs. 8,000 / mo',
    targetImageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=400&q=80',
    reasonCode: 'misleading_information',
    reasonLabel: 'Misleading Information',
    description: 'Item no longer available for booking according to poster.',
    details: 'Item no longer available for booking according to poster.',
    allowContact: false,
    source: 'listing_detail',
    status: 'dismissed',
    statusNote: 'Owner marked item as booked natively. No policy violation.',
    resolutionOutcome: 'No Violation Found',
    userFacingMessage: 'Thank you. The listing status was automatically updated by owner.',
    createdAt: '07 May 2025 10:05 AM',
    submittedDate: '07 May 2025 10:05 AM',
    timestamp: Date.now() - 250000000,
    history: [
      {
        id: 'hist-8',
        action: 'DISMISSED',
        actorName: 'Dilini Fernando',
        actorRole: 'Moderator',
        details: 'Report dismissed as no active violation was found.',
        createdAt: '07 May 2025 11:00 AM',
        timestamp: Date.now() - 246000000
      }
    ],
    internalNotes: []
  },
  {
    id: 'RP-8812',
    reporterId: 'USR-101',
    reporterName: 'Nimal Perera',
    reporterEmail: 'nimalperera@gmail.com',
    reporterAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    reporterRole: 'User',
    targetType: 'review',
    targetId: 'rev-302',
    targetModule: 'rentals',
    targetTitle: 'Review on "Canon EOS R6 Camera Rental" by Hasini K.',
    targetLocation: 'Colombo 07',
    targetImageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80',
    targetAuthorName: 'Hasini K.',
    targetAuthorId: 'usr-104',
    reasonCode: 'false_review',
    reasonLabel: 'False or Misleading Review',
    description: 'Reviewer never booked or picked up the equipment. False rating submitted.',
    details: 'Reviewer never booked or picked up the equipment. False rating submitted.',
    allowContact: true,
    source: 'review_card',
    status: 'submitted',
    statusNote: 'Awaiting verification of booking transaction receipt.',
    createdAt: '06 May 2025 04:15 PM',
    submittedDate: '06 May 2025 04:15 PM',
    timestamp: Date.now() - 300000000,
    history: [
      {
        id: 'hist-9',
        action: 'REPORT_SUBMITTED',
        actorName: 'Nimal Perera',
        actorRole: 'User',
        details: 'Review report filed.',
        createdAt: '06 May 2025 04:15 PM',
        timestamp: Date.now() - 300000000
      }
    ],
    internalNotes: []
  }
];

export class ReportService {
  /**
   * Retrieves all user reports from storage (or populates seeds if empty).
   */
  static getReports(reporterId?: string): ListingReport[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      let reports: ListingReport[] = [];

      if (!raw) {
        reports = SEED_REPORTS;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
      } else {
        reports = JSON.parse(raw);
        // Ensure data consistency
        if (!Array.isArray(reports) || reports.length === 0) {
          reports = SEED_REPORTS;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
        }
      }

      if (reporterId) {
        return reports.filter(r => r.reporterId === reporterId);
      }
      return reports;
    } catch (e) {
      console.error('Error reading reports:', e);
      return SEED_REPORTS;
    }
  }

  /**
   * Get a single report by ID.
   */
  static getReportById(reportId: string): ListingReport | null {
    const reports = this.getReports();
    return reports.find(r => r.id === reportId) || null;
  }

  /**
   * Submits a new report for a listing, review, user or conversation.
   */
  static submitReport(params: {
    reporterId: string;
    reporterName?: string;
    reporterEmail?: string;
    reporterAvatar?: string;
    targetType?: ReportTargetType;
    targetId: string;
    targetModule: ReportTargetModule;
    targetTitle: string;
    targetLocation?: string;
    targetPrice?: string;
    targetImageUrl?: string;
    targetAuthorName?: string;
    targetAuthorId?: string;
    reasonCode: string;
    reasonLabel: string;
    description?: string;
    contactInfo?: string;
    allowContact?: boolean;
    source?: ReportSource;
  }): { success: boolean; report?: ListingReport; error?: string } {
    try {
      const reports = this.getReports();

      // Duplicate submission protection (within 2 minutes)
      const recentDup = reports.find(
        r => r.reporterId === params.reporterId &&
             r.targetId === params.targetId &&
             Date.now() - r.timestamp < 120000
      );

      if (recentDup) {
        return {
          success: false,
          error: 'You recently submitted a report for this item. Our moderation team is already investigating.'
        };
      }

      const reportId = `RP-${Math.floor(1000 + Math.random() * 9000)}`;
      const nowStr = new Date().toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const newReport: ListingReport = {
        id: reportId,
        reporterId: params.reporterId,
        reporterName: params.reporterName || 'Registered User',
        reporterEmail: params.reporterEmail || 'user@rentoura.lk',
        reporterAvatar: params.reporterAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        reporterRole: 'User',
        
        targetType: params.targetType || 'listing',
        targetId: params.targetId,
        targetModule: params.targetModule,
        targetTitle: params.targetTitle,
        targetLocation: params.targetLocation,
        targetPrice: params.targetPrice,
        targetImageUrl: params.targetImageUrl,
        targetAuthorName: params.targetAuthorName,
        targetAuthorId: params.targetAuthorId,

        reasonCode: params.reasonCode,
        reasonLabel: params.reasonLabel,
        description: params.description || '',
        details: params.description || '',
        contactInfo: params.contactInfo,
        allowContact: params.allowContact ?? true,
        source: params.source || 'listing_detail',

        status: 'submitted',
        statusNote: 'Thank you. Your report has been queued for moderation review.',
        createdAt: nowStr,
        submittedDate: nowStr,
        timestamp: Date.now(),
        updatedAt: Date.now(),

        history: [
          {
            id: `hist-${Date.now()}`,
            action: 'REPORT_SUBMITTED',
            actorName: params.reporterName || 'User',
            actorRole: 'Reporter',
            details: `Submitted report regarding "${params.targetTitle}".`,
            createdAt: nowStr,
            timestamp: Date.now()
          }
        ],
        internalNotes: []
      };

      const updatedReports = [newReport, ...reports];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReports));

      // Create in-app notification for reporter
      const notif: AppNotification = {
        id: `notif-rep-${Date.now()}`,
        type: 'REPORT_UPDATE',
        category: 'system',
        title: 'Report Received 🚩',
        body: `Your report regarding “${params.targetTitle}” has been received and queued for prompt review.`,
        createdAt: 'Just now',
        timestamp: Date.now(),
        read: false,
        priority: 'normal',
        entityType: (params.targetModule === 'general' ? 'system' : params.targetModule) as any,
        entityId: params.targetId,
        listingId: params.targetId
      };

      const existingNotifs = NotificationService.getNotifications();
      NotificationService.saveNotifications([notif, ...existingNotifs]);

      return {
        success: true,
        report: newReport
      };
    } catch (e: any) {
      console.error('Failed to submit report:', e);
      return {
        success: false,
        error: e?.message || 'Unable to submit report. Please check connection and try again.'
      };
    }
  }

  /**
   * Updates report status (e.g. submitted -> under_review -> resolved/dismissed).
   */
  static updateReportStatus(params: {
    reportId: string;
    status: ReportStatus;
    statusNote?: string;
    assignedTo?: string;
    assignedToName?: string;
    staff?: StaffAccount;
  }): { success: boolean; report?: ListingReport; error?: string } {
    try {
      const reports = this.getReports();
      const index = reports.findIndex(r => r.id === params.reportId);
      if (index === -1) {
        return { success: false, error: 'Report not found.' };
      }

      const report = reports[index];
      const nowStr = new Date().toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const staffName = params.staff ? (params.staff.displayName || params.staff.fullName) : 'Moderation Staff';
      const staffRole: StaffRole = params.staff ? params.staff.role : 'MODERATOR';

      report.status = params.status;
      if (params.statusNote) report.statusNote = params.statusNote;
      if (params.assignedTo) report.assignedTo = params.assignedTo;
      if (params.assignedToName) report.assignedToName = params.assignedToName;
      report.updatedAt = Date.now();

      // Append to history
      if (!report.history) report.history = [];
      report.history.push({
        id: `hist-${Date.now()}`,
        action: `STATUS_CHANGED_${params.status.toUpperCase()}`,
        actorName: staffName,
        actorRole: staffRole,
        details: params.statusNote || `Status updated to ${params.status.replace('_', ' ')}.`,
        createdAt: nowStr,
        timestamp: Date.now()
      });

      reports[index] = report;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));

      // Audit log
      if (params.staff) {
        AdminService.addAuditLog({
          actorId: params.staff.id,
          actorName: staffName,
          actorRole: staffRole,
          action: `REPORT_STATUS_${params.status.toUpperCase()}`,
          targetType: 'report',
          targetId: report.id,
          targetTitle: report.targetTitle,
          details: `Status set to ${params.status}. Note: ${params.statusNote || 'N/A'}`
        });
      }

      return { success: true, report };
    } catch (e: any) {
      console.error('Failed to update report status:', e);
      return { success: false, error: e?.message || 'Failed to update status.' };
    }
  }

  /**
   * Assigns a report to a moderator.
   */
  static assignReport(reportId: string, staff: StaffAccount, assigneeName?: string): { success: boolean; error?: string } {
    try {
      const reports = this.getReports();
      const report = reports.find(r => r.id === reportId);
      if (!report) return { success: false, error: 'Report not found.' };

      const staffName = staff.displayName || staff.fullName;
      const targetAssignee = assigneeName || staffName;

      report.assignedTo = staff.id;
      report.assignedToName = targetAssignee;
      if (report.status === 'submitted') {
        report.status = 'under_review';
      }
      report.updatedAt = Date.now();

      const nowStr = new Date().toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      if (!report.history) report.history = [];
      report.history.push({
        id: `hist-${Date.now()}`,
        action: 'REPORT_ASSIGNED',
        actorName: staffName,
        actorRole: staff.role,
        details: `Assigned report to ${targetAssignee}.`,
        createdAt: nowStr,
        timestamp: Date.now()
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));

      AdminService.addAuditLog({
        actorId: staff.id,
        actorName: staffName,
        actorRole: staff.role,
        action: 'REPORT_ASSIGNED',
        targetType: 'report',
        targetId: report.id,
        targetTitle: report.targetTitle,
        details: `Report assigned to ${targetAssignee}.`
      });

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Assignment failed.' };
    }
  }

  /**
   * Adds an internal staff note (never visible to reporters/reported users).
   */
  static addInternalNote(reportId: string, noteText: string, staff: StaffAccount): { success: boolean; note?: InternalStaffNote; error?: string } {
    try {
      if (!noteText.trim()) return { success: false, error: 'Note cannot be empty.' };

      const reports = this.getReports();
      const report = reports.find(r => r.id === reportId);
      if (!report) return { success: false, error: 'Report not found.' };

      const staffName = staff.displayName || staff.fullName;
      const nowStr = new Date().toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const newNote: InternalStaffNote = {
        id: `note-${Date.now()}`,
        authorId: staff.id,
        authorName: staffName,
        authorRole: staff.role,
        note: noteText.trim(),
        createdAt: nowStr,
        timestamp: Date.now()
      };

      if (!report.internalNotes) report.internalNotes = [];
      report.internalNotes.push(newNote);
      report.updatedAt = Date.now();

      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));

      return { success: true, note: newNote };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to add note.' };
    }
  }

  /**
   * Resolves a report with an outcome, internal note, user-facing message, and optional linked target action.
   */
  static resolveReport(params: {
    reportId: string;
    outcome: string;
    internalNote?: string;
    userFacingMessage?: string;
    staff: StaffAccount;
    linkedTargetAction?: string;
  }): { success: boolean; error?: string } {
    try {
      const reports = this.getReports();
      const report = reports.find(r => r.id === params.reportId);
      if (!report) return { success: false, error: 'Report not found.' };

      const staffName = params.staff.displayName || params.staff.fullName;
      const nowStr = new Date().toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      report.status = 'resolved';
      report.resolutionOutcome = params.outcome;
      report.statusNote = params.internalNote || `Resolved by ${staffName} with outcome: ${params.outcome}.`;
      if (params.userFacingMessage) report.userFacingMessage = params.userFacingMessage;
      report.updatedAt = Date.now();

      // Append internal note if provided
      if (params.internalNote) {
        if (!report.internalNotes) report.internalNotes = [];
        report.internalNotes.push({
          id: `note-${Date.now()}`,
          authorId: params.staff.id,
          authorName: staffName,
          authorRole: params.staff.role,
          note: `Resolution Outcome: ${params.outcome}. Note: ${params.internalNote}`,
          createdAt: nowStr,
          timestamp: Date.now()
        });
      }

      // History
      if (!report.history) report.history = [];
      report.history.push({
        id: `hist-${Date.now()}`,
        action: 'REPORT_RESOLVED',
        actorName: staffName,
        actorRole: params.staff.role,
        details: `Resolved report with outcome: "${params.outcome}".`,
        createdAt: nowStr,
        timestamp: Date.now()
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));

      // Send safe user-facing notification to reporter
      const notif: AppNotification = {
        id: `notif-res-${Date.now()}`,
        type: 'REPORT_UPDATE',
        category: 'system',
        title: 'Report Update 🛡️',
        body: params.userFacingMessage || `Your report regarding “${report.targetTitle}” has been reviewed and resolved by our Trust & Safety team.`,
        createdAt: 'Just now',
        timestamp: Date.now(),
        read: false,
        priority: 'normal',
        entityType: (report.targetModule === 'general' ? 'system' : report.targetModule) as any,
        entityId: report.targetId,
        listingId: report.targetId
      };
      const existingNotifs = NotificationService.getNotifications();
      NotificationService.saveNotifications([notif, ...existingNotifs]);

      // Audit Log
      AdminService.addAuditLog({
        actorId: params.staff.id,
        actorName: staffName,
        actorRole: params.staff.role,
        action: 'REPORT_RESOLVED',
        targetType: 'report',
        targetId: report.id,
        targetTitle: report.targetTitle,
        details: `Outcome: ${params.outcome}. ${params.linkedTargetAction ? `Linked action: ${params.linkedTargetAction}` : ''}`
      });

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Resolution failed.' };
    }
  }

  /**
   * Dismisses a report (invalid, duplicate, or no violation).
   */
  static dismissReport(params: {
    reportId: string;
    reasonNote: string;
    staff: StaffAccount;
  }): { success: boolean; error?: string } {
    try {
      const reports = this.getReports();
      const report = reports.find(r => r.id === params.reportId);
      if (!report) return { success: false, error: 'Report not found.' };

      const staffName = params.staff.displayName || params.staff.fullName;
      const nowStr = new Date().toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      report.status = 'dismissed';
      report.statusNote = params.reasonNote || 'Report dismissed as no active violation was found.';
      report.resolutionOutcome = 'No Violation Found';
      report.updatedAt = Date.now();

      if (params.reasonNote) {
        if (!report.internalNotes) report.internalNotes = [];
        report.internalNotes.push({
          id: `note-${Date.now()}`,
          authorId: params.staff.id,
          authorName: staffName,
          authorRole: params.staff.role,
          note: `Dismissal reason: ${params.reasonNote}`,
          createdAt: nowStr,
          timestamp: Date.now()
        });
      }

      if (!report.history) report.history = [];
      report.history.push({
        id: `hist-${Date.now()}`,
        action: 'REPORT_DISMISSED',
        actorName: staffName,
        actorRole: params.staff.role,
        details: `Dismissed report. Reason: ${params.reasonNote || 'No violation found.'}`,
        createdAt: nowStr,
        timestamp: Date.now()
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));

      AdminService.addAuditLog({
        actorId: params.staff.id,
        actorName: staffName,
        actorRole: params.staff.role,
        action: 'REPORT_DISMISSED',
        targetType: 'report',
        targetId: report.id,
        targetTitle: report.targetTitle,
        details: `Dismissal Note: ${params.reasonNote}`
      });

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Dismissal failed.' };
    }
  }

  /**
   * Computes chronological activity timeline for report moderation logs.
   */
  static getReportActivities(): { id: string; title: string; actorName: string; timeAgo: string; iconType: string }[] {
    const reports = this.getReports();
    const activities: { id: string; title: string; actorName: string; timeAgo: string; iconType: string }[] = [];

    reports.forEach(r => {
      if (r.history && r.history.length > 0) {
        r.history.forEach(h => {
          let iconType = 'info';
          if (h.action.includes('RESOLVED')) iconType = 'success';
          else if (h.action.includes('DISMISSED')) iconType = 'danger';
          else if (h.action.includes('ASSIGNED')) iconType = 'assigned';
          else if (h.action.includes('UNDER_REVIEW')) iconType = 'review';

          activities.push({
            id: h.id,
            title: `Report #${r.id} ${h.action.toLowerCase().replace(/_/g, ' ')} for “${r.targetTitle}”`,
            actorName: h.actorName,
            timeAgo: h.createdAt || 'Recently',
            iconType
          });
        });
      }
    });

    return activities.slice(0, 6);
  }
}
