import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
import { NavigationDrawer } from './components/NavigationDrawer';
import { SavedListingService } from './services/savedListingService';
import { MessagingService } from './services/messagingService';
import { 
  LocationModal, 
  CategoryModal, 
  FilterModal, 
  NotificationModal, 
  LearnMoreModal 
} from './components/FilterModals';
import { HomePage } from './pages/HomePage';
import { RentalsPage } from './pages/RentalsPage';
import { JobsPage } from './pages/JobsPage';
import { ServicesPage } from './pages/ServicesPage';
import { SavedPage } from './pages/SavedPage';
import { PostPage } from './pages/PostPage';
import { MessagesPage } from './pages/MessagesPage';
import { ChatPage } from './pages/ChatPage';
import { ProfileOverviewPage } from './pages/ProfileOverviewPage';
import { EditProfilePage } from './pages/EditProfilePage';
import { MyListingsPage } from './pages/MyListingsPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { LocationSelectorPage } from './pages/LocationSelectorPage';
import { LocationValueModel } from './services/locationService';
import { CategorySelectorPage } from './pages/CategorySelectorPage';
import { AdvancedFiltersPage } from './pages/AdvancedFiltersPage';
import { RentalDetailPage } from './pages/RentalDetailPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { UserAgreementPage } from './pages/UserAgreementPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { SafetyCenterPage } from './pages/SafetyCenterPage';
import { HelpCenterPage } from './pages/HelpCenterPage';
import { ReportListingPage, ReportListingTarget } from './pages/ReportListingPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { StaffRoute } from './components/admin/StaffRoute';
import { AdminService } from './services/adminService';
import { StaffAccount } from './types/adminTypes';
import { ForgotPasswordModal } from './components/auth/ForgotPasswordModal';
import { LegalModal } from './components/auth/LegalModals';
import { AuthService } from './services/authService';
import { PostFlowContainer } from './components/post/PostFlowContainer';
import { getListingDetailById } from './data/listingDetailsData';
import { ListingDetailService } from './services/listingDetailService';
import { RentalListingDetail, JobListingDetail, ServiceListingDetail } from './types/listingDetailsTypes';
import { AppRoute, FilterState } from './types';
import { SelectedCategoryState } from './data/categorySelectorData';
import { AdvancedFilterState, INITIAL_ADVANCED_FILTER_STATE } from './types/filterTypes';
import { Conversation, ChatMessage } from './types/messagesTypes';
import { INITIAL_CONVERSATIONS } from './data/messagesData';
import { AppNotification, NotificationPreferences } from './types/notificationTypes';
import { NotificationService } from './services/notificationService';
import { UserProfile, UserListingItem, UserReviewItem, UserReportItem } from './types/profileTypes';
import { ProfileService } from './services/profileService';
import { ErrorBoundary, OfflineState, Page404 } from './components/common/StateComponents';
import { Footer } from './components/Footer';

import { isSuperAdmin, isAdmin, isModerator, isStaff } from './utils/roleUtils';

export default function App() {
  // Navigation Route State
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    const path = window.location.pathname;
    if (path.startsWith('/rentals/') && path.length > 9) {
      return path as AppRoute;
    }
    if (path.startsWith('/rental-detail')) {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      if (id) {
        window.history.replaceState({}, '', `/rentals/${id}`);
        return `/rentals/${id}` as AppRoute;
      }
    }
    if (path.startsWith('/jobs/') && path.length > 6) {
      return path as AppRoute;
    }
    if (path.startsWith('/job-detail')) {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      if (id) {
        window.history.replaceState({}, '', `/jobs/${id}`);
        return `/jobs/${id}` as AppRoute;
      }
    }
    if (path.startsWith('/services/') && path.length > 10) {
      return path as AppRoute;
    }
    if (path.startsWith('/service-detail')) {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      if (id) {
        window.history.replaceState({}, '', `/services/${id}`);
        return `/services/${id}` as AppRoute;
      }
    }

    const validRoutes: AppRoute[] = [
      '/', 
      '/rentals', 
      '/jobs', 
      '/services', 
      '/saved', 
      '/post', 
      '/post/rental',
      '/post/job',
      '/post/service',
      '/messages', 
      '/chat',
      '/profile',
      '/profile/edit',
      '/my-listings',
      '/search',
      '/select-location',
      '/select-category',
      '/filters',
      '/rental-detail',
      '/job-detail',
      '/service-detail',
      '/notifications',
      '/login',
      '/register',
      '/forgot-password',
      '/reset-password',
      '/user-agreement',
      '/privacy-policy',
      '/safety',
      '/help',
      '/report-listing',
      '/reviews',
      '/admin',
      '/admin/dashboard',
      '/moderator',
      '/super-admin'
    ];
    return validRoutes.includes(path as AppRoute) ? (path as AppRoute) : '/';
  });

  // Auth & Profile Loading States
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(true);

  // Selected Listing Detail State
  const [selectedListingId, setSelectedListingId] = useState<string>(() => {
    const path = window.location.pathname;
    if (path.startsWith('/rentals/') && path.length > 9) {
      return path.slice(9);
    }
    if (path.startsWith('/rental-detail')) {
      return new URLSearchParams(window.location.search).get('id') || '';
    }
    if (path.startsWith('/jobs/') && path.length > 6) {
      return path.slice(6);
    }
    if (path.startsWith('/job-detail')) {
      return new URLSearchParams(window.location.search).get('id') || '';
    }
    if (path.startsWith('/services/') && path.length > 10) {
      return path.slice(10);
    }
    if (path.startsWith('/service-detail')) {
      return new URLSearchParams(window.location.search).get('id') || '';
    }
    return '';
  });
  const [reviewsTargetListingId, setReviewsTargetListingId] = useState<string | null>(null);
  const [previousRoute, setPreviousRoute] = useState<AppRoute>('/');
  const [reportTargetListing, setReportTargetListing] = useState<ReportListingTarget | null>(null);
  const [pendingAgreementRoute, setPendingAgreementRoute] = useState<AppRoute | null>(null);

  const UNGATED_ROUTES: string[] = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/user-agreement',
    '/privacy-policy',
    '/safety',
    '/help'
  ];

  const isGatedMarketplaceRoute = (route: string): boolean => {
    if (UNGATED_ROUTES.includes(route)) {
      return false;
    }
    return true;
  };

  // Filter State
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: '',
    selectedLocation: '',
    selectedCategory: '',
    selectedFilter: 'All Filters',
    priceRange: [0, 500000],
    sortBy: 'featured'
  });

  // Advanced Filter State for PAGE 8
  const [advancedFilterState, setAdvancedFilterState] = useState<AdvancedFilterState>(INITIAL_ADVANCED_FILTER_STATE);

  // Category Selector Detailed State
  const [selectedCategoryState, setSelectedCategoryState] = useState<SelectedCategoryState | null>(null);

  // Origin & Return Navigation Context for Selectors
  const [selectorOrigin, setSelectorOrigin] = useState<{
    returnTo: AppRoute;
    module?: 'all' | 'rentals' | 'jobs' | 'services' | 'rental' | 'job' | 'service';
    initialLocation?: string;
    initialLocationModel?: LocationValueModel;
    initialCategoryPath?: string;
  }>({ returnTo: '/' });

  const handleOpenLocationSelector = (opts?: {
    returnTo?: AppRoute;
    module?: 'all' | 'rentals' | 'jobs' | 'services' | 'rental' | 'job' | 'service';
    initialLocation?: string;
    initialLocationModel?: LocationValueModel;
  }) => {
    setSelectorOrigin({
      returnTo: opts?.returnTo || currentRoute || '/',
      module: opts?.module || 'all',
      initialLocation: opts?.initialLocation || filterState.selectedLocation,
      initialLocationModel: opts?.initialLocationModel || filterState.selectedLocationModel
    });
    handleNavigate('/select-location');
  };

  const handleOpenCategorySelector = (opts?: {
    returnTo?: AppRoute;
    module?: 'all' | 'rentals' | 'jobs' | 'services' | 'rental' | 'job' | 'service';
    initialCategoryPath?: string;
  }) => {
    setSelectorOrigin({
      returnTo: opts?.returnTo || currentRoute || '/',
      module: opts?.module || 'all',
      initialCategoryPath: opts?.initialCategoryPath || filterState.selectedCategory
    });
    handleNavigate('/select-category');
  };

  // Profile State (Synced strictly with AuthService & Supabase public.profiles)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Active Conversation ID (from URL query or selected)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(() => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('conversation') || searchParams.get('id') || null;
  });

  // Saved Listings State (syncs strictly with Supabase saved_listings for authenticated users)
  const [savedListings, setSavedListings] = useState<string[]>([]);

  // Messaging / Conversations State (backed by real Supabase messaging tables)
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const loadConversations = React.useCallback(async () => {
    if (userProfile) {
      const data = await MessagingService.getConversations();
      setConversations(data);
    } else {
      setConversations([]);
    }
  }, [userProfile]);

  useEffect(() => {
    loadConversations();
  }, [userProfile, currentRoute, loadConversations]);

  // Notifications State with Supabase Backend & Realtime
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>({
    messages: true,
    listingUpdates: true,
    jobUpdates: true,
    serviceUpdates: true,
    reviews: true,
    systemAnnouncements: true,
    promotions: true
  });

  const loadNotifications = useCallback(async () => {
    if (userProfile?.id) {
      const data = await NotificationService.fetchNotifications();
      setNotifications(data);
    } else {
      setNotifications([]);
    }
  }, [userProfile?.id]);

  const loadNotificationPreferences = useCallback(async () => {
    if (userProfile?.id) {
      const prefs = await NotificationService.getPreferences();
      setNotificationPreferences(prefs);
    }
  }, [userProfile?.id]);

  useEffect(() => {
    loadNotifications();
    loadNotificationPreferences();
  }, [loadNotifications, loadNotificationPreferences, currentRoute]);

  // Real-time notifications subscription
  useEffect(() => {
    if (userProfile?.id) {
      const unsubscribe = NotificationService.subscribeToNotifications(userProfile.id, () => {
        loadNotifications();
      });
      return () => {
        unsubscribe();
      };
    }
  }, [userProfile?.id, loadNotifications]);

  const handleSaveNotificationPreferences = async (prefs: NotificationPreferences) => {
    setNotificationPreferences(prefs);
    await NotificationService.savePreferences(prefs);
  };

  const handleMarkNotificationRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    await NotificationService.markAsRead(id);
    await loadNotifications();
  };

  const handleMarkAllNotificationsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    await NotificationService.markAllAsRead();
    await loadNotifications();
  };

  const handleDeleteNotification = async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    await NotificationService.deleteNotification(id);
    await loadNotifications();
  };

  const handleClearReadNotifications = async () => {
    setNotifications(prev => prev.filter(n => !n.read));
    await NotificationService.clearReadNotifications();
    await loadNotifications();
  };

  const [userListings, setUserListings] = useState<UserListingItem[]>([]);
  const [userReviews, setUserReviews] = useState<UserReviewItem[]>([]);
  const [userReports, setUserReports] = useState<UserReportItem[]>([]);

  const handleSaveProfile = async (updated: UserProfile) => {
    try {
      await AuthService.updateUserProfile(updated);
      setUserProfile(updated);
      ProfileService.saveProfile(updated);
    } catch (e) {
      console.error('Failed to update profile:', e);
      throw e;
    }
  };

  const handleDeleteUserListing = async (listingId: string) => {
    if (userProfile?.id) {
      const res = await ProfileService.deleteListingInSupabase(listingId, userProfile.id);
      if (res.success) {
        setUserListings(prev => prev.filter(item => item.id !== listingId));
      } else {
        console.error('Failed to delete listing in Supabase:', res.error);
      }
    } else {
      setUserListings(prev => prev.filter(item => item.id !== listingId));
    }
  };

  const handleUpdateUserListing = async (updatedListing: UserListingItem) => {
    if (userProfile?.id) {
      const res = await ProfileService.updateListingInSupabase(updatedListing, userProfile.id);
      if (res.success) {
        setUserListings(prev => prev.map(item => item.id === updatedListing.id ? updatedListing : item));
      } else {
        console.error('Failed to update listing in Supabase:', res.error);
      }
    } else {
      setUserListings(prev => prev.map(item => item.id === updatedListing.id ? updatedListing : item));
    }
  };

  const handleUpdateListingStatus = async (listingId: string, status: UserListingItem['status'], note?: string) => {
    if (userProfile?.id) {
      const res = await ProfileService.updateListingStatusInSupabase(listingId, userProfile.id, status, note);
      if (res.success) {
        setUserListings(prev => prev.map(item => item.id === listingId ? { ...item, status, statusNote: note } : item));
      } else {
        console.error('Failed to update listing status in Supabase:', res.error);
      }
    } else {
      setUserListings(prev => prev.map(item => item.id === listingId ? { ...item, status, statusNote: note } : item));
    }
  };

  // Single source of truth auth listener
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = AuthService.subscribe(async (user, profile) => {
      if (!isMounted) return;

      console.log('[DIAGNOSTIC] App auth state notification:', {
        hasUser: Boolean(user),
        userId: user?.id,
        userEmail: user?.email,
        hasProfile: Boolean(profile),
        profileRole: profile?.role,
        accountStatus: profile?.accountStatus
      });

      if (!user) {
        setUserProfile(null);
        setUserListings([]);
        setUserReviews([]);
        setUserReports([]);
        setSavedListings([]);
        setIsAuthLoading(false);
        setIsProfileLoading(false);
        return;
      }

      setIsAuthLoading(false);

      // Fetch user saved listings from Supabase
      SavedListingService.getSavedListingIds().then((ids) => {
        if (isMounted) setSavedListings(ids);
      });

      // Asynchronously fetch user listings, reviews, and reports from Supabase
      const loadUserData = async (userId: string) => {
        try {
          const [listings, reviews, reports] = await Promise.all([
            ProfileService.fetchUserListings(userId),
            ProfileService.fetchUserReviews(userId),
            ProfileService.fetchUserReports(userId)
          ]);
          if (isMounted) {
            setUserListings(listings);
            setUserReviews(reviews);
            setUserReports(reports);
          }
        } catch (e) {
          console.warn('Error fetching user profile data from Supabase:', e);
        }
      };

      if (profile) {
        setUserProfile(profile);
        setIsProfileLoading(false);
        loadUserData(user.id);
      } else {
        setIsProfileLoading(true);
        const fresh = await AuthService.fetchUserProfile(user.id);
        if (isMounted) {
          setUserProfile(fresh);
          setIsProfileLoading(false);
          if (fresh) {
            loadUserData(user.id);
          }
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Centralized Logout Action
  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (err) {
      console.error('Logout error in App:', err);
      throw err;
    } finally {
      setUserProfile(null);
      setUserListings([]);
      setUserReviews([]);
      setUserReports([]);
      setNotifications([]);
      setConversations([]);
      setActiveConversationId('');
      handleNavigate('/');
    }
  };

  // Modal Visibility States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isLearnMoreModalOpen, setIsLearnMoreModalOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isUserAgreementOpen, setIsUserAgreementOpen] = useState(false);
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);

  // Sync browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/rentals/') && path.length > 9) {
        const id = path.slice(9);
        setSelectedListingId(id);
        setCurrentRoute(path as AppRoute);
        return;
      }
      if (path.startsWith('/rental-detail')) {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if (id) {
          window.history.replaceState({}, '', `/rentals/${id}`);
          setSelectedListingId(id);
          setCurrentRoute(`/rentals/${id}` as AppRoute);
          return;
        }
      }
      if (path.startsWith('/jobs/') && path.length > 6) {
        const id = path.slice(6);
        setSelectedListingId(id);
        setCurrentRoute(path as AppRoute);
        return;
      }
      if (path.startsWith('/job-detail')) {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if (id) {
          window.history.replaceState({}, '', `/jobs/${id}`);
          setSelectedListingId(id);
          setCurrentRoute(`/jobs/${id}` as AppRoute);
          return;
        }
      }
      if (path.startsWith('/services/') && path.length > 10) {
        const id = path.slice(10);
        setSelectedListingId(id);
        setCurrentRoute(path as AppRoute);
        return;
      }
      if (path.startsWith('/service-detail')) {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if (id) {
          window.history.replaceState({}, '', `/services/${id}`);
          setSelectedListingId(id);
          setCurrentRoute(`/services/${id}` as AppRoute);
          return;
        }
      }

      const validRoutes: AppRoute[] = [
        '/', 
        '/rentals', 
        '/jobs', 
        '/services', 
        '/saved', 
        '/post', 
        '/post/rental',
        '/post/job',
        '/post/service',
        '/messages', 
        '/chat',
        '/profile',
        '/profile/edit',
        '/my-listings',
        '/search',
        '/select-location',
        '/select-category',
        '/filters',
        '/rental-detail',
        '/job-detail',
        '/service-detail',
        '/notifications',
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/user-agreement',
        '/privacy-policy',
        '/safety',
        '/help',
        '/report-listing',
        '/reviews',
        '/admin',
        '/admin/dashboard',
        '/moderator',
        '/super-admin'
      ];
      if (validRoutes.includes(path as AppRoute)) {
        setCurrentRoute(path as AppRoute);
      } else {
        setCurrentRoute('/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Gate check effect for direct URL or auth state changes
  useEffect(() => {
    if (!isAuthLoading && !isProfileLoading) {
      if (isGatedMarketplaceRoute(currentRoute) && !AuthService.hasAcceptedCurrentAgreement(userProfile)) {
        setPendingAgreementRoute(currentRoute);
        setCurrentRoute('/user-agreement');
        if (window.location.pathname !== '/user-agreement') {
          window.history.replaceState({}, '', '/user-agreement');
        }
      }
    }
  }, [isAuthLoading, isProfileLoading, userProfile, currentRoute]);

  const handleNavigate = (route: AppRoute) => {
    if (isGatedMarketplaceRoute(route) && !AuthService.hasAcceptedCurrentAgreement(userProfile)) {
      setPendingAgreementRoute(route);
      if (currentRoute !== '/user-agreement' && !['/rental-detail', '/job-detail', '/service-detail'].includes(currentRoute) && !currentRoute.startsWith('/rentals/') && !currentRoute.startsWith('/jobs/') && !currentRoute.startsWith('/services/')) {
        setPreviousRoute(currentRoute);
      }
      setCurrentRoute('/user-agreement');
      if (window.location.pathname !== '/user-agreement') {
        window.history.pushState({}, '', '/user-agreement');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentRoute !== route && !['/rental-detail', '/job-detail', '/service-detail'].includes(currentRoute) && !currentRoute.startsWith('/rentals/') && !currentRoute.startsWith('/jobs/') && !currentRoute.startsWith('/services/')) {
      setPreviousRoute(currentRoute);
    }
    setCurrentRoute(route);
    if (window.location.pathname !== route) {
      window.history.pushState({}, '', route);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Detail Pages
  const handleOpenListingDetail = (
    id: string, 
    moduleHint?: 'rentals' | 'jobs' | 'services' | 'rental' | 'job' | 'service'
  ) => {
    const normHint = moduleHint?.toLowerCase();
    let canonicalPath = `/rentals/${id}`;
    let targetRoute: AppRoute = `/rentals/${id}` as AppRoute;

    if (normHint?.includes('job') || id.includes('job')) {
      targetRoute = `/jobs/${id}` as AppRoute;
      canonicalPath = `/jobs/${id}`;
    } else if (normHint?.includes('serv') || id.includes('srv') || id.includes('service')) {
      targetRoute = `/services/${id}` as AppRoute;
      canonicalPath = `/services/${id}`;
    }

    if (!AuthService.hasAcceptedCurrentAgreement(userProfile)) {
      setPendingAgreementRoute(targetRoute);
      setPreviousRoute(currentRoute);
      setCurrentRoute('/user-agreement');
      if (window.location.pathname !== '/user-agreement') {
        window.history.pushState({}, '', '/user-agreement');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSelectedListingId(id);
    setPreviousRoute(currentRoute);

    if (window.location.pathname !== canonicalPath) {
      window.history.pushState({ id }, '', canonicalPath);
    }

    setCurrentRoute(targetRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromDetail = () => {
    if (previousRoute && previousRoute !== currentRoute) {
      handleNavigate(previousRoute);
    } else {
      handleNavigate('/');
    }
  };

  const handleToggleSave = async (listingId: string): Promise<boolean> => {
    if (!userProfile) {
      handleNavigate('/login');
      return false;
    }
    const result = await SavedListingService.toggleSaveListing(listingId);
    if (result.requiresLogin) {
      handleNavigate('/login');
      return false;
    }
    if (result.error) {
      throw new Error(result.error);
    }
    setSavedListings(prev => 
      result.saved
        ? (prev.includes(listingId) ? prev : [...prev, listingId])
        : prev.filter(id => id !== listingId)
    );
    return result.saved;
  };

  // Select conversation from inbox
  const handleSelectConversation = async (convId: string) => {
    setActiveConversationId(convId);
    window.history.pushState({}, '', `/chat?conversation=${convId}`);
    await MessagingService.markAsRead(convId);
    setConversations(prev => prev.map(c => 
      c.id === convId ? { ...c, unreadCount: 0 } : c
    ));
    handleNavigate('/chat');
  };

  // Send message
  const handleSendMessage = async (
    convId: string, 
    text: string, 
    type: 'text' | 'location' | 'contact' = 'text'
  ) => {
    const createdMsg = await MessagingService.sendMessage(convId, text, type);
    if (createdMsg) {
      const updatedList = await MessagingService.getConversations();
      setConversations(updatedList);
    }
  };

  // Actions: Mark all read, Toggle Archive, Toggle Mute, Mark Unread
  const handleMarkAllAsRead = async () => {
    for (const c of conversations) {
      if (c.unreadCount > 0) {
        await MessagingService.markAsRead(c.id);
      }
    }
    await loadConversations();
  };

  const handleToggleArchive = async (convId: string, isArchived: boolean) => {
    await MessagingService.toggleArchive(convId, isArchived);
    await loadConversations();
  };

  const handleToggleMute = async (convId: string, isMuted: boolean) => {
    await MessagingService.toggleMute(convId, isMuted);
    await loadConversations();
  };

  const handleMarkUnread = async (convId: string) => {
    await MessagingService.markAsUnread(convId);
    await loadConversations();
  };

  // Start chat from any listing detail page (with real listing owner)
  const handleStartChatFromListing = async (listingInfo: {
    id: string;
    title?: string;
    module: 'rentals' | 'jobs' | 'services';
    ownerId?: string;
    price?: string;
    location?: string;
    imageUrl?: string;
  }) => {
    if (!userProfile) {
      handleNavigate('/login');
      return;
    }

    let targetOwnerId = listingInfo.ownerId;
    if (!targetOwnerId) {
      const detail = await ListingDetailService.getListingDetail(listingInfo.id, listingInfo.module);
      if ((detail as any)?.owner?.id) {
        targetOwnerId = (detail as any).owner.id;
      }
    }

    if (targetOwnerId && targetOwnerId === userProfile.id) {
      alert('You cannot send messages to your own listing.');
      return;
    }

    if (!targetOwnerId) {
      alert('Unable to identify the listing owner. Please try again later.');
      return;
    }

    try {
      const convId = await MessagingService.getOrCreateConversation(listingInfo.id, targetOwnerId);
      if (convId) {
        const freshList = await MessagingService.getConversations();
        setConversations(freshList);
        setActiveConversationId(convId);
        window.history.pushState({}, '', `/chat?conversation=${convId}`);
        handleNavigate('/chat');
      }
    } catch (err: any) {
      alert(err.message || 'Could not start conversation');
    }
  };

  const handleApplyFilters = (newFilters: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilterState({
      searchQuery: '',
      selectedLocation: '',
      selectedCategory: '',
      selectedFilter: 'All Filters',
      priceRange: [0, 500000],
      sortBy: 'featured'
    });
  };

  const isDetailPage = [
    '/rental-detail', 
    '/job-detail', 
    '/service-detail'
  ].includes(currentRoute);

  const hideGlobalHeader = [
    '/rental-detail', 
    '/job-detail', 
    '/service-detail',
    '/notifications',
    '/profile',
    '/profile/edit',
    '/my-listings',
    '/post/rental',
    '/post/job',
    '/post/service',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/user-agreement',
    '/privacy-policy',
    '/safety',
    '/help',
    '/report-listing',
    '/reviews',
    '/admin',
    '/admin/dashboard'
  ].includes(currentRoute);

  const hideBottomNav = [
    '/rental-detail', 
    '/job-detail', 
    '/service-detail',
    '/profile/edit',
    '/post/rental',
    '/post/job',
    '/post/service',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/user-agreement',
    '/privacy-policy',
    '/safety',
    '/help',
    '/report-listing',
    '/reviews',
    '/admin',
    '/admin/dashboard'
  ].includes(currentRoute);

  const unreadMessagesCount = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  const unreadNotificationsCount = NotificationService.getUnreadCount(notifications);
  const activeConversation = conversations.find(c => c.id === activeConversationId) || conversations[0];

  const handleAdminLogout = async () => {
    await AdminService.logoutStaff();
    setCurrentRoute('/');
  };

  // Render current active view
  const renderCurrentPage = () => {
    const protectedRoutes: AppRoute[] = [
      '/profile',
      '/profile/edit',
      '/my-listings',
      '/post',
      '/post/rental',
      '/post/job',
      '/post/service',
      '/messages',
      '/chat'
    ];

    if (!userProfile && protectedRoutes.includes(currentRoute)) {
      return (
        <LoginPage
          onNavigate={handleNavigate}
          returnUrl={currentRoute}
        />
      );
    }

    if (currentRoute.startsWith('/rentals/') || currentRoute === '/rental-detail') {
      const activeListingId = currentRoute.startsWith('/rentals/')
        ? currentRoute.slice(9)
        : selectedListingId;

      return (
        <RentalDetailPage
          listingId={activeListingId}
          onBack={handleBackFromDetail}
          onNavigate={(route) => {
            if (route === '/messages' || route === '/chat') {
              handleStartChatFromListing({
                id: activeListingId,
                title: 'Rental Listing',
                module: 'rentals',
                price: 'Contact for price',
                location: 'Sri Lanka'
              });
            } else if (route === '/report-listing') {
              setReportTargetListing({
                id: activeListingId,
                title: 'Rental Listing',
                location: 'Sri Lanka',
                price: 'Contact for price',
                pricePeriod: '/ Month',
                imageUrl: '',
                module: 'rentals',
                category: 'Rentals',
                ownerId: ''
              });
              handleNavigate('/report-listing');
            } else {
              handleNavigate(route as AppRoute);
            }
          }}
          isSaved={savedListings.includes(activeListingId)}
          onToggleSave={() => handleToggleSave(activeListingId)}
        />
      );
    }

    if (currentRoute.startsWith('/jobs/') || currentRoute === '/job-detail') {
      const activeJobId = currentRoute.startsWith('/jobs/')
        ? currentRoute.slice(6)
        : selectedListingId;

      return (
        <JobDetailPage
          listingId={activeJobId}
          onBack={handleBackFromDetail}
          onNavigate={(route) => {
            if (route === '/messages' || route === '/chat') {
              handleStartChatFromListing({
                id: activeJobId,
                title: 'Job Opportunity',
                module: 'jobs',
                price: 'Contact Employer',
                location: 'Sri Lanka'
              });
            } else if (route === '/report-listing') {
              setReportTargetListing({
                id: activeJobId,
                title: 'Job Opportunity',
                location: 'Sri Lanka',
                price: 'Contact Employer',
                pricePeriod: '',
                imageUrl: '',
                module: 'jobs',
                category: 'Jobs',
                ownerId: ''
              });
              handleNavigate('/report-listing');
            } else {
              handleNavigate(route as AppRoute);
            }
          }}
          isSaved={savedListings.includes(activeJobId)}
          onToggleSave={() => handleToggleSave(activeJobId)}
        />
      );
    }

    if (currentRoute.startsWith('/services/') || currentRoute === '/service-detail') {
      const activeServiceId = currentRoute.startsWith('/services/')
        ? currentRoute.slice(10)
        : selectedListingId;

      return (
        <ServiceDetailPage
          listingId={activeServiceId}
          onBack={handleBackFromDetail}
          onNavigate={(route) => {
            if (route === '/messages' || route === '/chat') {
              handleStartChatFromListing({
                id: activeServiceId,
                title: 'Service Listing',
                module: 'services',
                price: 'Contact Provider',
                location: 'Sri Lanka'
              });
            } else if (route === '/report-listing') {
              setReportTargetListing({
                id: activeServiceId,
                title: 'Service Listing',
                location: 'Sri Lanka',
                price: 'Contact Provider',
                pricePeriod: '',
                imageUrl: '',
                module: 'services',
                category: 'Services',
                ownerId: ''
              });
              handleNavigate('/report-listing');
            } else {
              handleNavigate(route as AppRoute);
            }
          }}
          isSaved={savedListings.includes(activeServiceId)}
          onToggleSave={() => handleToggleSave(activeServiceId)}
        />
      );
    }

    switch (currentRoute) {
      case '/notifications':
        return (
          <NotificationsPage
            notifications={notifications}
            onBack={() => {
              if (previousRoute && previousRoute !== '/notifications') {
                handleNavigate(previousRoute);
              } else {
                handleNavigate('/');
              }
            }}
            onNavigate={handleNavigate}
            onOpenListingDetail={handleOpenListingDetail}
            onSelectConversation={handleSelectConversation}
            onMarkAsRead={handleMarkNotificationRead}
            onMarkAllAsRead={handleMarkAllNotificationsRead}
            onDeleteNotification={handleDeleteNotification}
            onClearReadNotifications={handleClearReadNotifications}
            preferences={notificationPreferences}
            onSavePreferences={handleSaveNotificationPreferences}
            unreadMessagesCount={unreadMessagesCount}
          />
        );
      case '/filters':
        return (
          <AdvancedFiltersPage
            onNavigate={handleNavigate}
            savedCount={savedListings.length}
            initialFilterState={advancedFilterState}
            onApplyFilters={(newAdvFilters) => {
              setAdvancedFilterState(newAdvFilters);
              const locStr = newAdvFilters.location.cityName 
                ? `${newAdvFilters.location.cityName}, ${newAdvFilters.location.provinceName || 'Sri Lanka'}`
                : newAdvFilters.location.districtName || '';
              const catStr = newAdvFilters.category.fullPath || newAdvFilters.category.mainCatName || '';
              setFilterState(prev => ({
                ...prev,
                selectedLocation: locStr || prev.selectedLocation,
                selectedCategory: catStr || prev.selectedCategory,
                priceRange: [newAdvFilters.price.min, newAdvFilters.price.max]
              }));
            }}
          />
        );
      case '/search':
        return (
          <SearchResultsPage
            onNavigate={handleNavigate}
            savedListings={savedListings}
            onToggleSave={handleToggleSave}
            selectedLocation={filterState.selectedLocation}
            selectedCategoryPath={filterState.selectedCategory}
            filterState={filterState}
            onUpdateFilterState={(newFilters) => setFilterState(prev => ({ ...prev, ...newFilters }))}
            onOpenLocationSelector={() => handleOpenLocationSelector({ returnTo: '/search' })}
            onOpenCategorySelector={() => handleOpenCategorySelector({ returnTo: '/search' })}
            onOpenFilterModal={() => handleNavigate('/filters')}
            onOpenListingDetail={handleOpenListingDetail}
          />
        );
      case '/select-location':
        return (
          <LocationSelectorPage
            onNavigate={handleNavigate}
            returnTo={selectorOrigin.returnTo || '/'}
            initialLocation={selectorOrigin.initialLocation || filterState.selectedLocation}
            initialLocationModel={selectorOrigin.initialLocationModel || filterState.selectedLocationModel}
            savedCount={savedListings.length}
            onApplyLocation={(locModel, displayName) => {
              setFilterState(prev => ({ 
                ...prev, 
                selectedLocation: displayName,
                selectedLocationModel: locModel
              }));
              const targetRoute = selectorOrigin.returnTo || '/';
              if (targetRoute === '/filters') {
                setAdvancedFilterState(prev => ({
                  ...prev,
                  location: {
                    ...prev.location,
                    provinceId: locModel.provinceId,
                    provinceName: locModel.provinceName,
                    districtId: locModel.districtId,
                    districtName: locModel.districtName,
                    cityId: locModel.cityId,
                    cityName: locModel.cityName,
                    areaId: locModel.areaId,
                    areaName: locModel.areaName,
                    displayName: displayName
                  }
                }));
              }
            }}
            onCancel={() => {
              handleNavigate(selectorOrigin.returnTo || '/');
            }}
          />
        );
      case '/select-category':
        return (
          <CategorySelectorPage
            onNavigate={handleNavigate}
            returnTo={selectorOrigin.returnTo || '/'}
            initialModule={selectorOrigin.module || 'all'}
            initialCategoryPath={selectorOrigin.initialCategoryPath || filterState.selectedCategory}
            savedCount={savedListings.length}
            onApplyCategory={(categoryPath, state) => {
              setFilterState(prev => ({ ...prev, selectedCategory: categoryPath }));
              setSelectedCategoryState(state);
              const targetRoute = selectorOrigin.returnTo || '/';
              if (targetRoute === '/filters') {
                setAdvancedFilterState(prev => ({
                  ...prev,
                  category: {
                    mainCatId: state.selectedMainCat?.id || state.mainCategory?.id,
                    mainCatName: state.selectedMainCat?.name || state.mainCategory?.name,
                    subCatId: state.selectedSubCat?.id || state.subCategory?.id,
                    subCatName: state.selectedSubCat?.name || state.subCategory?.name,
                    thirdLevelId: state.selectedThirdLevel?.id || state.thirdLevel?.id,
                    thirdLevelName: state.selectedThirdLevel?.name || state.thirdLevel?.name,
                    fullPath: categoryPath
                  }
                }));
              }
            }}
            onCancel={() => {
              handleNavigate(selectorOrigin.returnTo || '/');
            }}
          />
        );
      case '/rentals':
        return (
          <RentalsPage
            onNavigate={handleNavigate}
            savedListings={savedListings}
            onToggleSave={handleToggleSave}
            onOpenListingDetail={handleOpenListingDetail}
          />
        );
      case '/jobs':
        return (
          <JobsPage 
            onNavigate={handleNavigate} 
            onOpenListingDetail={handleOpenListingDetail}
            savedListings={savedListings}
            onToggleSave={handleToggleSave}
          />
        );
      case '/services':
        return (
          <ServicesPage 
            onNavigate={handleNavigate} 
            onOpenListingDetail={handleOpenListingDetail}
            savedListings={savedListings}
            onToggleSave={handleToggleSave}
          />
        );
      case '/saved':
        return (
          <SavedPage
            savedListings={savedListings}
            onToggleSave={handleToggleSave}
            onNavigate={handleNavigate}
            onOpenListingDetail={handleOpenListingDetail}
            notificationCount={unreadNotificationsCount}
          />
        );
      case '/post':
        if (!userProfile) {
          return <LoginPage onNavigate={handleNavigate} returnUrl="/post" />;
        }
        return (
          <PostPage
            onNavigate={handleNavigate}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            unreadNotificationsCount={unreadNotificationsCount}
            userListings={userListings}
          />
        );
      case '/post/rental':
        if (!userProfile) {
          return <LoginPage onNavigate={handleNavigate} returnUrl="/post/rental" />;
        }
        return (
          <PostFlowContainer
            module="rentals"
            onNavigate={handleNavigate}
            onListingCreated={(newListing) => {
              setUserListings(prev => [newListing, ...prev]);
            }}
          />
        );
      case '/post/job':
        if (!userProfile) {
          return <LoginPage onNavigate={handleNavigate} returnUrl="/post/job" />;
        }
        return (
          <PostFlowContainer
            module="jobs"
            onNavigate={handleNavigate}
            onListingCreated={(newListing) => {
              setUserListings(prev => [newListing, ...prev]);
            }}
          />
        );
      case '/post/service':
        if (!userProfile) {
          return <LoginPage onNavigate={handleNavigate} returnUrl="/post/service" />;
        }
        return (
          <PostFlowContainer
            module="services"
            onNavigate={handleNavigate}
            onListingCreated={(newListing) => {
              setUserListings(prev => [newListing, ...prev]);
            }}
          />
        );
      case '/messages':
        return (
          <MessagesPage
            conversations={conversations}
            onSelectConversation={handleSelectConversation}
            onNavigate={handleNavigate}
            onOpenListingDetail={handleOpenListingDetail}
            onRefreshInbox={loadConversations}
            onMarkAllAsRead={handleMarkAllAsRead}
            onToggleArchive={handleToggleArchive}
            onToggleMute={handleToggleMute}
            onMarkUnread={handleMarkUnread}
          />
        );
      case '/chat':
        if (!activeConversation) {
          return (
            <MessagesPage
              conversations={conversations}
              onSelectConversation={handleSelectConversation}
              onNavigate={handleNavigate}
              onOpenListingDetail={handleOpenListingDetail}
              onRefreshInbox={loadConversations}
              onMarkAllAsRead={handleMarkAllAsRead}
              onToggleArchive={handleToggleArchive}
              onToggleMute={handleToggleMute}
              onMarkUnread={handleMarkUnread}
            />
          );
        }
        return (
          <ChatPage
            conversation={activeConversation}
            onBack={() => handleNavigate('/messages')}
            onNavigate={handleNavigate}
            onOpenListingDetail={handleOpenListingDetail}
            onSendMessage={handleSendMessage}
            notificationCount={unreadNotificationsCount}
            userProfile={userProfile}
            onRefreshMessages={loadConversations}
            onToggleMute={handleToggleMute}
            onToggleArchive={handleToggleArchive}
            onMarkUnread={handleMarkUnread}
          />
        );
      case '/profile':
        if (!userProfile) {
          return <LoginPage onNavigate={handleNavigate} returnUrl="/profile" />;
        }
        return (
          <ProfileOverviewPage
            profile={userProfile}
            listings={userListings}
            savedCount={savedListings.length}
            unreadMessagesCount={unreadMessagesCount}
            unreadNotificationsCount={unreadNotificationsCount}
            reviews={userReviews}
            reports={userReports}
            onNavigate={handleNavigate}
            onOpenListingDetail={handleOpenListingDetail}
            onDeleteListing={handleDeleteUserListing}
            onLogout={handleLogout}
          />
        );
      case '/profile/edit':
        if (!userProfile) {
          return <LoginPage onNavigate={handleNavigate} returnUrl="/profile/edit" />;
        }
        return (
          <EditProfilePage
            profile={userProfile}
            unreadNotificationsCount={unreadNotificationsCount}
            onSaveProfile={handleSaveProfile}
            onBack={() => {
              if (previousRoute && previousRoute !== '/profile/edit') {
                handleNavigate(previousRoute);
              } else {
                handleNavigate('/profile');
              }
            }}
            onNavigate={handleNavigate}
          />
        );
      case '/my-listings':
        if (!userProfile) {
          return <LoginPage onNavigate={handleNavigate} returnUrl="/my-listings" />;
        }
        return (
          <MyListingsPage
            listings={userListings}
            onNavigate={handleNavigate}
            onOpenListingDetail={handleOpenListingDetail}
            onDeleteListing={handleDeleteUserListing}
            onUpdateListing={handleUpdateUserListing}
            onUpdateListingStatus={handleUpdateListingStatus}
            unreadNotificationsCount={unreadNotificationsCount}
          />
        );
      case '/login':
        return (
          <LoginPage
            onNavigate={handleNavigate}
            returnUrl={previousRoute && !['/login', '/register', '/forgot-password', '/user-agreement', '/privacy-policy'].includes(previousRoute) ? previousRoute : '/'}
          />
        );
      case '/register':
        return (
          <RegisterPage
            onNavigate={handleNavigate}
            returnUrl={previousRoute && !['/login', '/register', '/forgot-password', '/user-agreement', '/privacy-policy'].includes(previousRoute) ? previousRoute : '/'}
            onOpenUserAgreement={() => setIsUserAgreementOpen(true)}
            onOpenPrivacyPolicy={() => setIsPrivacyPolicyOpen(true)}
          />
        );
      case '/forgot-password':
        return (
          <ForgotPasswordPage
            onNavigate={handleNavigate}
          />
        );
      case '/reset-password':
        return (
          <ResetPasswordPage
            onNavigate={handleNavigate}
          />
        );
      case '/user-agreement':
        return (
          <UserAgreementPage
            onNavigate={handleNavigate}
            userProfile={userProfile}
            onAgreeAndContinue={() => {
              const target = pendingAgreementRoute || (previousRoute && previousRoute !== '/user-agreement' ? previousRoute : '/');
              setPendingAgreementRoute(null);
              handleNavigate(target);
            }}
          />
        );
      case '/privacy-policy':
        return (
          <PrivacyPolicyPage
            onNavigate={handleNavigate}
          />
        );
      case '/safety':
        return (
          <SafetyCenterPage
            onNavigate={handleNavigate}
          />
        );
      case '/help':
        return (
          <HelpCenterPage
            onNavigate={handleNavigate}
          />
        );
      case '/report-listing':
        return (
          <ReportListingPage
            onNavigate={handleNavigate}
            targetListing={reportTargetListing}
          />
        );
      case '/reviews':
        return (
          <ReviewsPage
            onNavigate={handleNavigate}
            targetListingId={reviewsTargetListingId}
            onOpenListingDetail={handleOpenListingDetail}
          />
        );
      case '/admin':
      case '/admin/dashboard':
      case '/admin/moderation':
      case '/admin/queue':
      case '/admin/review':
        return (
          <StaffRoute
            requiredRole="ADMIN"
            currentRoute={currentRoute}
            isAuthLoading={isAuthLoading}
            isProfileLoading={isProfileLoading}
            userProfile={userProfile}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case '/moderator':
        return (
          <StaffRoute
            requiredRole="MODERATOR"
            currentRoute={currentRoute}
            isAuthLoading={isAuthLoading}
            isProfileLoading={isProfileLoading}
            userProfile={userProfile}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case '/super-admin':
        return (
          <StaffRoute
            requiredRole="SUPER_ADMIN"
            currentRoute={currentRoute}
            isAuthLoading={isAuthLoading}
            isProfileLoading={isProfileLoading}
            userProfile={userProfile}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case '/':
      default:
        return (
          <HomePage
            filterState={filterState}
            setFilterState={setFilterState}
            onNavigate={handleNavigate}
            onOpenLocationModal={() => handleOpenLocationSelector({ returnTo: '/', module: 'all' })}
            onOpenCategoryModal={() => handleOpenCategorySelector({ returnTo: '/', module: 'all' })}
            onOpenFilterModal={() => handleNavigate('/filters')}
            onOpenLearnMore={() => setIsLearnMoreModalOpen(true)}
            onToggleSave={handleToggleSave}
            savedListings={savedListings}
            onOpenListingDetail={handleOpenListingDetail}
          />
        );
    }
  };

  const isAdminRoute = currentRoute.startsWith('/admin') || currentRoute === '/moderator' || currentRoute === '/super-admin';

  return (
    <div className={`min-h-screen bg-[#041C43] text-slate-800 flex justify-center selection:bg-[#1464F4] selection:text-white ${isAdminRoute ? 'w-full' : ''}`}>
      {/* Mobile Device Frame / Responsive Wrapper */}
      <div className={`w-full ${isAdminRoute ? 'max-w-none shadow-none' : 'max-w-[430px] lg:max-w-none shadow-2xl lg:shadow-none'} min-h-screen bg-slate-50 relative flex flex-col overflow-x-hidden`}>
        {/* Global Top Header — mobile or desktop */}
        {!hideGlobalHeader && (
          <Header
            currentRoute={currentRoute}
            onNavigate={handleNavigate}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            onOpenNotifications={() => handleNavigate('/notifications')}
            savedCount={savedListings.length}
            unreadMessagesCount={unreadMessagesCount}
            unreadNotificationsCount={unreadNotificationsCount}
            userProfile={userProfile}
          />
        )}

        {/* Dynamic Main View */}
        <main className="flex-1 w-full overflow-x-hidden">
          <ErrorBoundary>
            {renderCurrentPage()}
          </ErrorBoundary>
        </main>

        {/* Global Offline State Banner */}
        <OfflineState />

        {/* Desktop Footer on Public Pages */}
        {!isAdminRoute && (
          <div className="hidden lg:block">
            <Footer onNavigate={handleNavigate} />
          </div>
        )}

        {/* Global Bottom Navigation (hidden on desktop) */}
        {!hideBottomNav && (
          <BottomNavigation
            currentRoute={currentRoute}
            onNavigate={handleNavigate}
            savedCount={savedListings.length}
            unreadMessagesCount={unreadMessagesCount}
          />
        )}

        {/* Navigation Drawer Sidebar */}
        <NavigationDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          currentRoute={currentRoute}
          onNavigate={handleNavigate}
          savedCount={savedListings.length}
          unreadNotificationsCount={unreadNotificationsCount}
          unreadMessagesCount={unreadMessagesCount}
          userProfile={userProfile}
          onLogout={handleLogout}
        />

        {/* Modals & Dialogs */}
        <ForgotPasswordModal
          isOpen={isForgotPasswordOpen || currentRoute === '/forgot-password'}
          onClose={() => {
            setIsForgotPasswordOpen(false);
            if (currentRoute === '/forgot-password') handleNavigate('/login');
          }}
          onBackToLogin={() => {
            setIsForgotPasswordOpen(false);
            handleNavigate('/login');
          }}
        />

        <LegalModal
          isOpen={isUserAgreementOpen || currentRoute === '/user-agreement'}
          onClose={() => {
            setIsUserAgreementOpen(false);
            if (currentRoute === '/user-agreement') handleNavigate('/register');
          }}
          type="agreement"
        />

        <LegalModal
          isOpen={isPrivacyPolicyOpen || currentRoute === '/privacy-policy'}
          onClose={() => {
            setIsPrivacyPolicyOpen(false);
            if (currentRoute === '/privacy-policy') handleNavigate('/register');
          }}
          type="privacy"
        />

        <LocationModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          selectedLocation={filterState.selectedLocation}
          onSelect={(loc) => setFilterState(prev => ({ ...prev, selectedLocation: loc }))}
        />

        <CategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          selectedCategory={filterState.selectedCategory}
          onSelect={(cat) => setFilterState(prev => ({ ...prev, selectedCategory: cat }))}
        />

        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          filterState={filterState}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />

        <NotificationModal
          isOpen={isNotificationsModalOpen}
          onClose={() => setIsNotificationsModalOpen(false)}
        />

        <LearnMoreModal
          isOpen={isLearnMoreModalOpen}
          onClose={() => setIsLearnMoreModalOpen(false)}
        />
      </div>
    </div>
  );
}
