import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  SlidersHorizontal, 
  MoreVertical, 
  MessageSquare, 
  Home, 
  Briefcase, 
  Wrench, 
  ShieldCheck, 
  ShieldAlert, 
  ChevronRight, 
  Circle, 
  CheckCheck,
  Info,
  Car
} from 'lucide-react';
import { RentouraLogo } from '../components/RentouraLogo';
import { AppRoute } from '../types';
import { Conversation, ConversationModule } from '../types/messagesTypes';

interface MessagesPageProps {
  conversations: Conversation[];
  onSelectConversation: (conversationId: string) => void;
  onNavigate: (route: AppRoute) => void;
  onOpenListingDetail?: (id: string, module?: 'rentals' | 'jobs' | 'services') => void;
  onRefreshInbox?: () => void;
  onMarkAllAsRead?: () => void;
  onToggleArchive?: (conversationId: string, isArchived: boolean) => void;
  onToggleMute?: (conversationId: string, isMuted: boolean) => void;
  onMarkUnread?: (conversationId: string) => void;
}

type FilterTab = 'all' | 'rentals' | 'jobs' | 'services' | 'system';

export const MessagesPage: React.FC<MessagesPageProps> = ({
  conversations,
  onSelectConversation,
  onNavigate,
  onOpenListingDetail,
  onRefreshInbox,
  onMarkAllAsRead,
  onToggleArchive,
  onToggleMute,
  onMarkUnread
}) => {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [activeItemMenuId, setActiveItemMenuId] = useState<string | null>(null);

  // Filter conversations by tab, archive status, and search
  const filteredConversations = conversations.filter((c) => {
    if (!showArchived && c.isPinned === false && (c as any).isArchived) return false;
    if (showArchived && !(c as any).isArchived) return false;

    const matchesTab = activeTab === 'all' || c.module === activeTab;
    const matchesSearch = searchQuery.trim() === '' || 
      c.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalCount = conversations.length;
  const rentalsCount = conversations.filter(c => c.module === 'rentals').length;
  const jobsCount = conversations.filter(c => c.module === 'jobs').length;
  const servicesCount = conversations.filter(c => c.module === 'services').length;
  const systemCount = conversations.filter(c => c.module === 'system').length;
  const onlineCount = conversations.filter(c => c.participant.isOnline).length;

  const renderModuleBadge = (module: ConversationModule, badgeText: string, badgeColor: string) => {
    let bg = '#1464F4';
    if (module === 'jobs') bg = '#08A34F';
    if (module === 'services') bg = '#FF650A';
    if (module === 'system') bg = '#64748B';

    return (
      <span
        className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase text-white tracking-wider shrink-0"
        style={{ backgroundColor: badgeColor || bg }}
      >
        {badgeText || module.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-28">
      {/* Top Header Bar matching Image 2 */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Back button */}
          <button
            onClick={() => onNavigate('/')}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors tap-bounce shrink-0"
            aria-label="Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Centered Logo */}
          <div className="cursor-pointer" onClick={() => onNavigate('/')}>
            <RentouraLogo variant="header" theme="light" />
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 shrink-0 relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors tap-bounce"
              aria-label="Filter"
            >
              <SlidersHorizontal className="w-4.5 h-4.5" />
            </button>

            <button
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors tap-bounce"
              aria-label="Options"
            >
              <MoreVertical className="w-4.5 h-4.5" />
            </button>

            {showOptionsMenu && (
              <div className="absolute top-11 right-0 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 w-48 space-y-1 z-50 animate-in fade-in slide-in-from-top-2">
                <button
                  onClick={() => {
                    onMarkAllAsRead?.();
                    setShowOptionsMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2"
                >
                  <CheckCheck className="w-4 h-4 text-[#1464F4]" /> Mark all as read
                </button>
                <button
                  onClick={() => {
                    setShowArchived(!showArchived);
                    setShowOptionsMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2"
                >
                  <Info className="w-4 h-4 text-amber-500" /> {showArchived ? 'View Active Chats' : 'View Archived Chats'}
                </button>
                <button
                  onClick={() => {
                    onRefreshInbox?.();
                    setShowOptionsMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4 text-emerald-500" /> Refresh Inbox
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 pt-4 space-y-4">
        {/* Title Header Card matching Image 2 */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-[#1464F4] flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6 fill-[#1464F4]/20 text-[#1464F4]" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-heading text-slate-900 tracking-tight leading-none">
                Messages
              </h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Chat with buyers, sellers, employers and service seekers.
              </p>
            </div>
          </div>

          {/* Stats Badges matching Image 2 */}
          <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <div className="px-3 py-1.5 rounded-xl bg-blue-50/80 border border-blue-100 text-xs font-bold text-[#1464F4] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{totalCount} Active</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50/80 border border-emerald-100 text-xs font-bold text-[#08A34F] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#08A34F] animate-pulse" />
              <span>{onlineCount} Online</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs matching Image 2 */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap tap-bounce flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-[#1464F4] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            All ({totalCount})
          </button>

          <button
            onClick={() => setActiveTab('rentals')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap tap-bounce flex items-center gap-1.5 ${
              activeTab === 'rentals'
                ? 'bg-[#1464F4] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            Rentals ({rentalsCount})
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap tap-bounce flex items-center gap-1.5 ${
              activeTab === 'jobs'
                ? 'bg-[#08A34F] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Jobs ({jobsCount})
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap tap-bounce flex items-center gap-1.5 ${
              activeTab === 'services'
                ? 'bg-[#FF650A] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            Services ({servicesCount})
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap tap-bounce flex items-center gap-1.5 ${
              activeTab === 'system'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            System ({systemCount})
          </button>
        </div>

        {/* Search Input Bar matching Image 2 */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1464F4]/20 border border-slate-200/90 shadow-2xs placeholder:text-slate-400"
          />
        </div>

        {/* Safety Disclaimer Notice Banner matching Image 2 */}
        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-900 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-[11.5px] leading-tight font-medium">
            <strong>Keep conversations safe:</strong> Never share personal credit card credentials, and avoid advance payments prior to personal inspection.
          </p>
        </div>

        {/* Conversations List matching Image 2 */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {filteredConversations.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">No conversations found</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {searchQuery ? 'No chats matching your search term.' : 'Start a chat from any rental, job, or service listing page.'}
              </p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className="group p-3.5 hover:bg-blue-50/40 transition-colors cursor-pointer flex items-center gap-3.5 tap-bounce"
              >
                {/* User Avatar with Online status dot */}
                <div className="relative shrink-0">
                  {conv.participant.avatarUrl ? (
                    <img
                      src={conv.participant.avatarUrl}
                      alt={conv.participant.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200/80 shadow-2xs"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1464F4] to-[#00D2FF] text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                      {conv.participant.avatarInitials || conv.participant.name.charAt(0)}
                    </div>
                  )}

                  {conv.participant.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-xs" />
                  )}
                </div>

                {/* Body Details */}
                <div className="flex-1 min-w-0">
                  {/* Row 1: Name and Timestamp */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <h3 className="font-bold text-slate-900 text-sm font-heading truncate group-hover:text-[#1464F4] transition-colors">
                        {conv.participant.name}
                      </h3>
                      {conv.participant.verified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-[#1464F4] shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium shrink-0">
                      {conv.lastMessageTime}
                    </span>
                  </div>

                  {/* Row 2: Module Badge & Listing Context Title */}
                  <div className="flex items-center gap-1.5 mt-1 truncate">
                    {renderModuleBadge(conv.module, conv.listing.badge, conv.listing.badgeColor)}
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      {conv.listing.title}
                    </span>
                  </div>

                  {/* Row 3: Last Message snippet */}
                  <p className="text-xs text-slate-500 font-medium truncate mt-1">
                    {conv.lastMessage}
                  </p>
                </div>

                {/* Right side: Unread count badge */}
                {conv.unreadCount > 0 && (
                  <div className="w-5 h-5 rounded-full bg-[#1464F4] text-white text-[10.5px] font-extrabold flex items-center justify-center shrink-0 shadow-xs">
                    {conv.unreadCount}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Safety First Card Footer matching Image 2 */}
        <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-4 flex items-start justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#1464F4] flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs font-heading">Safety First</h4>
              <p className="text-[11.5px] text-slate-600 mt-0.5 leading-relaxed font-medium">
                Meet in person and check the item before renting. We do not encourage or support advance payments.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('/profile')}
            className="text-xs font-bold text-[#1464F4] hover:underline whitespace-nowrap shrink-0 flex items-center gap-0.5 self-center"
          >
            Learn More <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </main>
    </div>
  );
};
