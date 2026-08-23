import { UserProfile, UserListingItem, UserReviewItem, UserReportItem } from '../types/profileTypes';
import { INITIAL_USER_PROFILE, INITIAL_USER_LISTINGS, INITIAL_USER_REVIEWS, INITIAL_USER_REPORTS } from '../data/profileData';

const PROFILE_STORAGE_KEY = 'rentoura_user_profile';
const LISTINGS_STORAGE_KEY = 'rentoura_user_listings';
const REVIEWS_STORAGE_KEY = 'rentoura_user_reviews';
const REPORTS_STORAGE_KEY = 'rentoura_user_reports';

export class ProfileService {
  static getProfile(): UserProfile | null {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserProfile;
        if (parsed) {
          // Sanitize legacy demo strings from localStorage
          if (parsed.bio === 'Member of RENTOURA.LK community marketplace.') {
            parsed.bio = '';
          }
          if (parsed.avatarUrl && parsed.avatarUrl.includes('images.unsplash.com')) {
            parsed.avatarUrl = '';
          }
          if (parsed.accountType === 'Individual') {
            parsed.accountType = '';
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse user profile from localStorage:', e);
    }
    return null;
  }

  static clearSessionData(): void {
    try {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
      localStorage.removeItem(LISTINGS_STORAGE_KEY);
      localStorage.removeItem(REVIEWS_STORAGE_KEY);
      localStorage.removeItem(REPORTS_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear session data from localStorage:', e);
    }
  }

  static saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save user profile to localStorage:', e);
    }
  }

  static getUserListings(): UserListingItem[] {
    try {
      const stored = localStorage.getItem(LISTINGS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse user listings from localStorage:', e);
    }
    return [];
  }

  static saveUserListings(listings: UserListingItem[]): void {
    try {
      localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(listings));
    } catch (e) {
      console.error('Failed to save user listings to localStorage:', e);
    }
  }

  static updateListing(updatedListing: UserListingItem): UserListingItem[] {
    const current = this.getUserListings();
    const updated = current.map(item => item.id === updatedListing.id ? { ...item, ...updatedListing, updatedAt: new Date().toISOString() } : item);
    this.saveUserListings(updated);
    return updated;
  }

  static updateListingStatus(listingId: string, newStatus: UserListingItem['status'], note?: string): UserListingItem[] {
    const current = this.getUserListings();
    const updated = current.map(item => {
      if (item.id === listingId) {
        return {
          ...item,
          status: newStatus,
          statusNote: note || (newStatus === 'pending' ? 'Under moderation review' : undefined),
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    });
    this.saveUserListings(updated);
    return updated;
  }

  static deleteListing(listingId: string): UserListingItem[] {
    const current = this.getUserListings();
    const updated = current.filter(item => item.id !== listingId);
    this.saveUserListings(updated);
    return updated;
  }

  static addListing(newListing: UserListingItem): UserListingItem[] {
    const current = this.getUserListings();
    const updated = [newListing, ...current];
    this.saveUserListings(updated);
    return updated;
  }

  static getReviews(): UserReviewItem[] {
    try {
      const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse reviews from localStorage:', e);
    }
    return [];
  }

  static getReports(): UserReportItem[] {
    try {
      const stored = localStorage.getItem(REPORTS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse reports from localStorage:', e);
    }
    return [];
  }

  static addReport(report: Omit<UserReportItem, 'id' | 'submittedDate'>): UserReportItem {
    const existing = this.getReports();
    const newReport: UserReportItem = {
      ...report,
      id: `rep-${Date.now()}`,
      submittedDate: 'Just now'
    };
    const updated = [newReport, ...existing];
    try {
      localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save report:', e);
    }
    return newReport;
  }
}
