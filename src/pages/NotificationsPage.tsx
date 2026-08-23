import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Search, 
  MoreVertical, 
  CheckCheck, 
  Settings2, 
  Trash2, 
  ShieldAlert, 
  Flag,
  X,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { RentouraLogo } from '../components/RentouraLogo';
import { NotificationHero } from '../components/notifications/NotificationHero';
import { NotificationFilters } from '../components/notifications/NotificationFilters';
import { NotificationCard } from '../components/notifications/NotificationCard';
import { NotificationEmptyState } from '../components/notifications/NotificationEmptyState';
import { NotificationPreferencesModal } from '../components/notifications/NotificationPreferencesModal';
import { ReportResolutionModal } from '../components/notifications/ReportResolutionModal';
import { SystemTermsModal } from '../components/notifications/SystemTermsModal';
import { AppNotification, NotificationCategory, NotificationPreferences } from '../types/notificationTypes';
import { NotificationService } from '../services/notificationService';
import { AppRoute } from '../types';

interface NotificationsPageProps {
  notifications: AppNotification[];
  onBack: () => void;
  onNavigate: (route: AppRoute) => void;
  onOpenListingDetail: (id: string, moduleHint?: 'rentals' | 'jobs' | 'services') => void;
  onSelectConversation?: (convId: string) => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onClearReadNotifications: () => void;
  preferences: NotificationPreferences;
  onSavePreferences: (prefs: NotificationPreferences) => void;
  unreadMessagesCount: number;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  notifications,
  onBack,
  onNavigate,
  onOpenListingDetail,
  onSelectConversation,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onClearReadNotifications,
  preferences,
  onSavePreferences,
  unreadMessagesCount
}) => {
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Calculate dynamic category counts
  const categoryCounts = useMemo(() => {
    return NotificationService.getCategoryCounts(notifications);
  }, [notifications]);

  const totalUnread = useMemo(() => {
    return NotificationService.getUnreadCount(notifications);
  }, [notifications]);

  const unreadAnnouncementsCount = categoryCounts.system?.unread || 0;

  // Filter and search notifications
  const filteredNotifications = useMemo(() => {
    let list = notifications;

    if (activeCategory !== 'all') {
      list = list.filter(n => n.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(n => 
        n.title.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q) ||
        (n.entityType && n.entityType.toLowerCase().includes(q))
      );
    }

    return list;
  }, [notifications, activeCategory, searchQuery]);

  // Group notifications into time sections
  const grouped = useMemo(() => {
    return NotificationService.groupNotifications(filteredNotifications);
  }, [filteredNotifications]);

  // Deep Link Routing on Notification Click
  const handleNotificationClick = (notification: AppNotification) => {
    // 1. Mark as read
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }

    // 2. Canonical Destination Resolution
    if (notification.type === 'MESSAGE_RECEIVED' && notification.conversationId) {
      if (onSelectConversation) {
        onSelectConversation(notification.conversationId);
      } else {
        onNavigate('/messages');
      }
      return;
    }

    if (notification.type === 'REPORT_UPDATE') {
      setIsReportModalOpen(true);
      return;
    }

    if (notification.type === 'SYSTEM_UPDATE') {
      setIsTermsModalOpen(true);
      return;
    }

    if (notification.entityType === 'rentals' && notification.entityId) {
      onOpenListingDetail(notification.entityId, 'rentals');
      return;
    }

    if (notification.entityType === 'jobs' && notification.entityId) {
      onOpenListingDetail(notification.entityId, 'jobs');
      return;
    }

    if (notification.entityType === 'services' && notification.entityId) {
      onOpenListingDetail(notification.entityId, 'services');
      return;
    }

    if (notification.actionUrl) {
      onNavigate(notification.actionUrl as AppRoute);
      return;
    }

    // Default fallback
    showToast('Notification details updated.');
  };

  const handleReportIssue = () => {
    setIsReportModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24 select-none">
      {/* 1. Header (Matching Page 15 Reference) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 shadow-xs">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors tap-bounce shrink-0"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Centered RENTOURA.LK Logo */}
          <div className="cursor-pointer" onClick={() => onNavigate('/')}>
            <RentouraLogo variant="header" theme="light" />
          </div>

          {/* Right Action Icons: Search & More */}
          <div className="flex items-center gap-1.5 shrink-0 relative">
            {/* Search Toggle */}
            <button
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                if (isSearchOpen) setSearchQuery('');
              }}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors tap-bounce ${
                isSearchOpen ? 'bg-blue-50 text-[#1464F4]' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              aria-label="Search notifications"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* More Options / Settings */}
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors tap-bounce ${
                isMoreMenuOpen ? 'bg-slate-200 text-slate-900' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              aria-label="Notification settings"
            >
              <MoreVertical className="w-4.5 h-4.5" />
            </button>

            {/* Dropdown Menu */}
            {isMoreMenuOpen && (
              <div 
                className="absolute right-0 top-11 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 w-52 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setIsMoreMenuOpen(false)}
              >
                <button
                  onClick={() => {
                    onMarkAllAsRead();
                    showToast('All notifications marked as read');
                  }}
                  className="w-full px-3.5 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                >
                  <CheckCheck className="w-4 h-4 text-[#1464F4]" />
                  <span>Mark all as read</span>
                </button>

                <button
                  onClick={() => setIsPreferencesOpen(true)}
                  className="w-full px-3.5 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                >
                  <Settings2 className="w-4 h-4 text-slate-500" />
                  <span>Notification settings</span>
                </button>

                <button
                  onClick={() => {
                    onClearReadNotifications();
                    showToast('Read notifications cleared');
                  }}
                  className="w-full px-3.5 py-2.5 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 border-t border-slate-100"
                >
                  <Trash2 className="w-4 h-4 text-rose-500" />
                  <span>Clear read notifications</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Expandable Search Input Field */}
        {isSearchOpen && (
          <div className="max-w-md mx-auto mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notification history..."
                className="w-full pl-9 pr-8 py-2 bg-slate-100 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1464F4]/30"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <div className="max-w-md mx-auto w-full px-3.5 sm:px-4 pt-3.5 space-y-4">
        {/* 2. Notification Summary Hero */}
        <NotificationHero
          totalUnreadCount={totalUnread}
          unreadMessagesCount={unreadMessagesCount}
          unreadAnnouncementsCount={unreadAnnouncementsCount}
          onFilterMessages={() => setActiveCategory('messages')}
          onFilterAnnouncements={() => setActiveCategory('system')}
        />

        {/* 3. Category Filter Tabs */}
        <NotificationFilters
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          counts={categoryCounts}
        />

        {/* 4. Notification Feed Lists */}
        {filteredNotifications.length === 0 ? (
          <NotificationEmptyState
            categoryLabel={activeCategory !== 'all' ? activeCategory : 'All'}
            isSearchActive={!!searchQuery}
            onResetFilters={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
          />
        ) : (
          <div className="space-y-4">
            {/* Today Section */}
            {grouped.today.length > 0 && (
              <section className="space-y-2">
                <h3 className="text-xs font-bold text-[#1464F4] px-1 uppercase tracking-wider">
                  Today
                </h3>
                <div className="space-y-2">
                  {grouped.today.map((n) => (
                    <NotificationCard
                      key={n.id}
                      notification={n}
                      onClick={handleNotificationClick}
                      onDelete={onDeleteNotification}
                      onToggleRead={onMarkAsRead}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Yesterday Section */}
            {grouped.yesterday.length > 0 && (
              <section className="space-y-2 pt-1">
                <h3 className="text-xs font-bold text-[#1464F4] px-1 uppercase tracking-wider">
                  Yesterday
                </h3>
                <div className="space-y-2">
                  {grouped.yesterday.map((n) => (
                    <NotificationCard
                      key={n.id}
                      notification={n}
                      onClick={handleNotificationClick}
                      onDelete={onDeleteNotification}
                      onToggleRead={onMarkAsRead}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Earlier Section */}
            {grouped.earlier.length > 0 && (
              <section className="space-y-2 pt-1">
                <h3 className="text-xs font-bold text-slate-500 px-1 uppercase tracking-wider">
                  Earlier
                </h3>
                <div className="space-y-2">
                  {grouped.earlier.map((n) => (
                    <NotificationCard
                      key={n.id}
                      notification={n}
                      onClick={handleNotificationClick}
                      onDelete={onDeleteNotification}
                      onToggleRead={onMarkAsRead}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* 5. Safety First Banner Card (From Page 15 Visual Reference) */}
        <div className="rounded-2xl sm:rounded-3xl bg-amber-50/90 border border-amber-200/80 p-3.5 sm:p-4 shadow-xs mt-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-amber-950">
                  Safety First
                </h4>
                <p className="text-[11.5px] text-amber-900/85 leading-relaxed mt-0.5">
                  We are just a platform. Please communicate and meet safely. Avoid any advance payments. Your safety is your responsibility.
                </p>
              </div>
            </div>

            <button
              onClick={handleReportIssue}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold shrink-0 transition-colors shadow-2xs tap-bounce"
            >
              <Flag className="w-3.5 h-3.5 text-rose-500" />
              <span>Report Issue</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-md text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-150">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals & Dialogs */}
      <NotificationPreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        preferences={preferences}
        onSavePreferences={onSavePreferences}
      />

      <ReportResolutionModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      <SystemTermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
    </div>
  );
};
