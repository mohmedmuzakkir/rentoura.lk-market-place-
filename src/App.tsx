import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
import { NavigationDrawer } from './components/NavigationDrawer';
import { SavedListingService } from './services/savedListingService';
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
    const path = window.location.pathname as AppRoute;
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
    return validRoutes.includes(path) ? path : '/';
  });

  // Auth & Profile Loading States
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(true);

  // Selected Listing Detail State
  const [selectedListingId, setSelectedListingId] = useState<string>('rent-prius-2018');
  const [reviewsTargetListingId, setReviewsTargetListingId] = useState<string | null>(null);
  const [previousRoute, setPreviousRoute] = useState<AppRoute>('/');
  const [reportTargetListing, setReportTargetListing] = useState<ReportListingTarget | null>(null);

  // Filter State
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: '',
    selectedLocation: '',
    selectedCategory: '',
    selectedFilter: 'All Filters',
    priceRange: [0, 500000],
    verifiedOnly: false,
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
    initialCategoryPath?: string;
  }>({ returnTo: '/' });

  const handleOpenLocationSelector = (opts?: {
    returnTo?: AppRoute;
    module?: 'all' | 'rentals' | 'jobs' | 'services' | 'rental' | 'job' | 'service';
    initialLocation?: string;
  }) => {
    setSelectorOrigin({
      returnTo: opts?.returnTo || currentRoute || '/',
      module: opts?.module || 'all',
      initialLocation: opts?.initialLocation || filterState.selectedLocation
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

  // Saved Listings State (syncs strictly with Supabase saved_listings for authenticated users)
  const [savedListings, setSavedListings] = useState<string[]>([]);

  // Messaging / Conversations State
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('rentoura_conversations');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_CONVERSATIONS;
  });

  useEffect(() => {
    localStorage.setItem('rentoura_conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Notifications State with Persistence
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    return NotificationService.getNotifications();
  });

  useEffect(() => {
    NotificationService.saveNotifications(notifications);
  }, [notifications]);

  // Notification Preferences State
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>(() => {
    return NotificationService.getPreferences();
  });

  const handleSaveNotificationPreferences = (prefs: NotificationPreferences) => {
    setNotificationPreferences(prefs);
    NotificationService.savePreferences(prefs);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearReadNotifications = () => {
    setNotifications(prev => prev.filter(n => !n.read));
  };

  // Active Conversation ID
  const [activeConversationId, setActiveConversationId] = useState<string>('conv-nimal-perera');

  // Profile State (Synced strictly with AuthService & Supabase public.profiles)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

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

  const handleDeleteUserListing = (listingId: string) => {
    const updated = ProfileService.deleteListing(listingId);
    setUserListings(updated);
  };

  const handleUpdateUserListing = (updatedListing: UserListingItem) => {
    const updated = ProfileService.updateListing(updatedListing);
    setUserListings(updated);
  };

  const handleUpdateListingStatus = (listingId: string, status: UserListingItem['status'], note?: string) => {
    const updated = ProfileService.updateListingStatus(listingId, status, note);
    setUserListings(updated);
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

      if (profile) {
        setUserProfile(profile);
        setUserListings(ProfileService.getUserListings());
        setUserReviews(ProfileService.getReviews());
        setUserReports(ProfileService.getReports());
        setIsProfileLoading(false);
      } else {
        setIsProfileLoading(true);
        const fresh = await AuthService.fetchUserProfile(user.id);
        if (isMounted) {
          setUserProfile(fresh);
          if (fresh) {
            setUserListings(ProfileService.getUserListings());
            setUserReviews(ProfileService.getReviews());
            setUserReports(ProfileService.getReports());
          }
          setIsProfileLoading(false);
          console.log('[DIAGNOSTIC] App fetched fresh profile from DB:', {
            id: fresh?.id,
            email: fresh?.email,
            role: fresh?.role,
            accountStatus: fresh?.accountStatus
          });
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
      const path = window.location.pathname as AppRoute;
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
      if (validRoutes.includes(path)) {
        setCurrentRoute(path);
      } else {
        setCurrentRoute('/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (route: AppRoute) => {
    if (currentRoute !== route && !['/rental-detail', '/job-detail', '/service-detail'].includes(currentRoute)) {
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
    setSelectedListingId(id);
    setPreviousRoute(currentRoute);

    const normHint = moduleHint?.toLowerCase();
    if (normHint?.includes('job') || id.includes('job')) {
      handleNavigate('/job-detail');
    } else if (normHint?.includes('serv') || id.includes('srv') || id.includes('service')) {
      handleNavigate('/service-detail');
    } else {
      handleNavigate('/rental-detail');
    }
  };

  const handleBackFromDetail = () => {
    if (previousRoute && previousRoute !== currentRoute) {
      handleNavigate(previousRoute);
    } else {
      handleNavigate('/');
    }
  };

  const handleToggleSave = async (listingId: string) => {
    if (!userProfile) {
      handleNavigate('/login');
      return;
    }
    const result = await SavedListingService.toggleSaveListing(listingId);
    if (result.requiresLogin) {
      handleNavigate('/login');
      return;
    }
    setSavedListings(prev => 
      result.saved
        ? (prev.includes(listingId) ? prev : [...prev, listingId])
        : prev.filter(id => id !== listingId)
    );
  };

  // Select conversation from inbox
  const handleSelectConversation = (convId: string) => {
    setActiveConversationId(convId);
    setConversations(prev => prev.map(c => 
      c.id === convId ? { ...c, unreadCount: 0 } : c
    ));
    handleNavigate('/chat');
  };

  // Send message
  const handleSendMessage = (
    convId: string, 
    text: string, 
    type: 'text' | 'location' | 'contact' = 'text'
  ) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      type
    };

    setConversations(prev => {
      const convIndex = prev.findIndex(c => c.id === convId);
      if (convIndex === -1) return prev;

      const targetConv = prev[convIndex];
      const updatedConv: Conversation = {
        ...targetConv,
        messages: [...targetConv.messages, newMsg],
        lastMessage: text,
        lastMessageTime: 'Just now',
        lastMessageTimestamp: Date.now()
      };

      const rest = prev.filter(c => c.id !== convId);
      return [updatedConv, ...rest];
    });

    // Realistic auto-reply simulation from seller / employer / provider after 1.8s
    setTimeout(() => {
      setConversations(prev => {
        const convIndex = prev.findIndex(c => c.id === convId);
        if (convIndex === -1) return prev;
        const targetConv = prev[convIndex];

        let replyText = 'Thanks for your message! We will get back to you shortly.';
        if (text.toLowerCase().includes('available')) {
          replyText = 'Yes, this is still available! Would you like to schedule an inspection?';
        } else if (text.toLowerCase().includes('visit') || text.toLowerCase().includes('schedule')) {
          replyText = 'Sure! We can arrange a visit this weekend. What time works best for you?';
        } else if (text.toLowerCase().includes('price') || text.toLowerCase().includes('cost')) {
          replyText = `The current price is ${targetConv.listing.price}. We can also discuss flexible terms.`;
        } else if (text.toLowerCase().includes('location')) {
          replyText = `Got your location! We are located at ${targetConv.listing.location || 'Kandy, Sri Lanka'}.`;
        } else if (text.toLowerCase().includes('contact')) {
          replyText = `Thanks for sharing your contact info. I will call you soon!`;
        }

        const replyMsg: ChatMessage = {
          id: `reply-${Date.now()}`,
          sender: 'them',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: Date.now(),
          isRead: false
        };

        const updatedWithReply: Conversation = {
          ...targetConv,
          messages: [...targetConv.messages, replyMsg],
          lastMessage: replyText,
          lastMessageTime: 'Just now',
          lastMessageTimestamp: Date.now()
        };

        const otherConvs = prev.filter(c => c.id !== convId);
        return [updatedWithReply, ...otherConvs];
      });
    }, 1800);
  };

  // Start chat from any listing detail page
  const handleStartChatFromListing = (listingInfo: {
    id: string;
    title: string;
    module: 'rentals' | 'jobs' | 'services';
    price: string;
    location?: string;
    imageUrl?: string;
    participantName?: string;
    participantAvatar?: string;
    phone?: string;
  }) => {
    // Check if an existing conversation exists for this listing
    const existing = conversations.find(c => c.listing.id === listingInfo.id);
    if (existing) {
      handleSelectConversation(existing.id);
      return;
    }

    // Create new conversation associated with this listing
    const newConvId = `conv-${listingInfo.id}-${Date.now()}`;
    const newConv: Conversation = {
      id: newConvId,
      module: listingInfo.module,
      participant: {
        id: `usr-${listingInfo.id}`,
        name: listingInfo.participantName || (listingInfo.module === 'jobs' ? 'Hiring Manager' : 'Listing Owner'),
        avatarUrl: listingInfo.participantAvatar,
        isOnline: true,
        memberSince: 'Member since 2024',
        location: listingInfo.location || 'Sri Lanka',
        phone: listingInfo.phone,
        verified: true
      },
      listing: {
        id: listingInfo.id,
        title: listingInfo.title,
        price: listingInfo.price,
        location: listingInfo.location,
        imageUrl: listingInfo.imageUrl,
        badge: (listingInfo.module === 'jobs' ? 'JOB' : listingInfo.module === 'services' ? 'SERVICE' : 'RENTAL') as any,
        badgeColor: listingInfo.module === 'jobs' ? '#08A34F' : listingInfo.module === 'services' ? '#FF650A' : '#1464F4',
        module: listingInfo.module
      },
      lastMessage: 'Conversation started',
      lastMessageTime: 'Just now',
      lastMessageTimestamp: Date.now(),
      unreadCount: 0,
      quickReplies: listingInfo.module === 'jobs' 
        ? ['Is this position available?', 'How can I apply?', 'Can you share more details?']
        : listingInfo.module === 'services'
        ? ['Are you available?', "What's the price?", 'Can I book?']
        : ['Is it available?', 'Can I visit?', "What's the price?"],
      messages: [
        {
          id: `msg-init-${Date.now()}`,
          sender: 'them',
          text: `Hello! Thank you for inquiring about "${listingInfo.title}". How can we help you?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: Date.now(),
          isRead: true
        }
      ]
    };

    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConvId);
    handleNavigate('/chat');
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
      verifiedOnly: false,
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
      case '/rental-detail': {
        const listing = getListingDetailById(selectedListingId, 'rentals') as RentalListingDetail;
        return (
          <RentalDetailPage
            listing={listing}
            onBack={handleBackFromDetail}
            onNavigate={(route) => {
              if (route === '/messages' || route === '/chat') {
                handleStartChatFromListing({
                  id: listing.id,
                  title: listing.title,
                  module: 'rentals',
                  price: listing.pricing?.rates?.[0]?.label || 'Rs. 85,000 / Month',
                  location: `${listing.location.city}, ${listing.location.province}`,
                  imageUrl: listing.images?.[0],
                  participantName: listing.owner?.name,
                  participantAvatar: listing.owner?.photoUrl,
                  phone: listing.contact?.phone
                });
              } else if (route === '/report-listing') {
                setReportTargetListing({
                  id: listing.id,
                  title: listing.title,
                  location: `${listing.location.city}, ${listing.location.province}`,
                  price: listing.pricing?.rates?.[0]?.price ? `Rs. ${listing.pricing.rates[0].price.toLocaleString()}` : 'Rs. 120,000',
                  pricePeriod: listing.pricing?.rates?.[0]?.unit ? `/ ${listing.pricing.rates[0].unit}` : '/ Month',
                  imageUrl: listing.images?.[0] || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
                  module: 'rentals',
                  category: listing.categoryPath,
                  ownerId: listing.owner?.id || 'usr-owner-99'
                });
                handleNavigate('/report-listing');
              } else {
                handleNavigate(route as AppRoute);
              }
            }}
            isSaved={savedListings.includes(listing.id)}
            onToggleSave={() => handleToggleSave(listing.id)}
          />
        );
      }
      case '/job-detail': {
        const job = getListingDetailById(selectedListingId, 'jobs') as JobListingDetail;
        return (
          <JobDetailPage
            job={job}
            onBack={handleBackFromDetail}
            onNavigate={(route) => {
              if (route === '/messages' || route === '/chat') {
                handleStartChatFromListing({
                  id: job.id,
                  title: `${job.title} at ${job.company.name}`,
                  module: 'jobs',
                  price: job.salary?.min && job.salary?.max 
                    ? `Rs. ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} / ${job.salary.period}`
                    : 'Rs. 120,000 - 180,000 / Month',
                  location: `${job.location.city}, ${job.location.province}`,
                  imageUrl: job.company?.logoUrl,
                  participantName: job.company?.name || 'Recruitment Team',
                  participantAvatar: job.company?.logoUrl,
                  phone: job.contact?.phone
                });
              } else if (route === '/report-listing') {
                setReportTargetListing({
                  id: job.id,
                  title: job.title,
                  location: `${job.location.city}, ${job.location.province}`,
                  price: job.salary?.min ? `Rs. ${job.salary.min.toLocaleString()}` : 'Rs. 120,000',
                  pricePeriod: `/ ${job.salary?.period || 'Month'}`,
                  imageUrl: job.company?.logoUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
                  module: 'jobs',
                  category: job.categoryPath,
                  ownerId: 'usr-company-1'
                });
                handleNavigate('/report-listing');
              } else {
                handleNavigate(route as AppRoute);
              }
            }}
            isSaved={savedListings.includes(job.id)}
            onToggleSave={() => handleToggleSave(job.id)}
          />
        );
      }
      case '/service-detail': {
        const service = getListingDetailById(selectedListingId, 'services') as ServiceListingDetail;
        return (
          <ServiceDetailPage
            service={service}
            onBack={handleBackFromDetail}
            onNavigate={(route) => {
              if (route === '/messages' || route === '/chat') {
                handleStartChatFromListing({
                  id: service.id,
                  title: service.title,
                  module: 'services',
                  price: service.startingPrice ? `Rs. ${service.startingPrice.amount} ${service.startingPrice.unit}` : 'Rs. 1,500 / Visit',
                  location: `${service.location.city}, ${service.location.province}`,
                  imageUrl: service.images?.[0],
                  participantName: service.provider?.name || 'Service Provider',
                  participantAvatar: service.provider?.photoUrl,
                  phone: service.contact?.phone
                });
              } else if (route === '/report-listing') {
                setReportTargetListing({
                  id: service.id,
                  title: service.title,
                  location: `${service.location.city}, ${service.location.province}`,
                  price: service.startingPrice?.amount ? `Rs. ${service.startingPrice.amount.toLocaleString()}` : 'Rs. 2,500',
                  pricePeriod: `/ ${service.startingPrice?.unit || 'Visit'}`,
                  imageUrl: service.images?.[0] || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
                  module: 'services',
                  category: service.categoryPath,
                  ownerId: service.provider?.id || 'usr-provider-1'
                });
                handleNavigate('/report-listing');
              } else {
                handleNavigate(route as AppRoute);
              }
            }}
            isSaved={savedListings.includes(service.id)}
            onToggleSave={() => handleToggleSave(service.id)}
          />
        );
      }
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
                priceRange: [newAdvFilters.price.min, newAdvFilters.price.max],
                verifiedOnly: newAdvFilters.verifiedOnly
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
            savedCount={savedListings.length}
            onApplyLocation={(locModel, displayName) => {
              setFilterState(prev => ({ ...prev, selectedLocation: displayName }));
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
        return (
          <PostPage
            onNavigate={handleNavigate}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            unreadNotificationsCount={unreadNotificationsCount}
            userListings={userListings}
          />
        );
      case '/post/rental':
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
          />
        );
      case '/chat':
        return (
          <ChatPage
            conversation={activeConversation}
            onBack={() => handleNavigate('/messages')}
            onNavigate={handleNavigate}
            onOpenListingDetail={handleOpenListingDetail}
            onSendMessage={handleSendMessage}
            notificationCount={unreadNotificationsCount}
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
            onAgreeAndContinue={() => {
              if (previousRoute && previousRoute !== '/user-agreement') {
                handleNavigate(previousRoute);
              } else {
                handleNavigate('/');
              }
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
