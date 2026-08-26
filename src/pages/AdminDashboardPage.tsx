import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Star, 
  Users, 
  ShieldCheck, 
  Megaphone, 
  Bell, 
  FileText, 
  Globe, 
  Database, 
  LogOut, 
  ExternalLink, 
  Search, 
  ChevronRight, 
  RotateCw, 
  Menu,
  X,
  TrendingUp,
  Server,
  PanelLeftClose,
  PanelLeftOpen,
  FolderTree,
  MapPin,
  Inbox,
  KeyRound,
  Sliders,
  Building2
} from 'lucide-react';
import { AppRoute } from '../types';
import { StaffAccount, AuditLogItem, AdminKpiMetrics, PlatformAnnouncement } from '../types/adminTypes';
import { UserListingItem } from '../types/profileTypes';
import { ListingReport, ReportService } from '../services/reportService';
import { AdminService } from '../services/adminService';
import { ProfileService } from '../services/profileService';
import { ListingModerationModal } from '../components/admin/ListingModerationModal';
import { AdminUsersView } from '../components/admin/AdminUsersView';
import { AdminStaffView } from '../components/admin/AdminStaffView';
import { AdminListingsView } from '../components/admin/AdminListingsView';
import { AdminAuditLogsView } from '../components/admin/AdminAuditLogsView';
import { AdminReportsView } from '../components/admin/AdminReportsView';
import { AdminAnnouncementsView } from '../components/admin/AdminAnnouncementsView';
import { AdminReviewsView } from '../components/admin/AdminReviewsView';
import { AdminModerationQueue } from '../components/admin/AdminModerationQueue';
import { AdminStatesView } from '../components/admin/AdminStatesView';
import { AdminListingReview } from '../components/admin/AdminListingReview';
import { AdminCategoryView } from '../components/admin/AdminCategoryView';
import { AdminLocationView } from '../components/admin/AdminLocationView';
import { AdminSecurityView } from '../components/admin/AdminSecurityView';
import { AdminSlidesView } from '../components/admin/AdminSlidesView';
import { AdminCompaniesView } from '../components/admin/AdminCompaniesView';

interface AdminDashboardPageProps {
  staff: StaffAccount;
  onNavigate: (route: AppRoute) => void;
  onLogout: () => void;
}

type ActiveSection = 
  | 'overview' 
  | 'all-listings' 
  | 'pending-approvals' 
  | 'moderation-queue'
  | 'listing-review'
  | 'active-listings' 
  | 'rejected-listings' 
  | 'reported-listings' 
  | 'all-users' 
  | 'staff-roles' 
  | 'security'
  | 'slides'
  | 'companies'
  | 'announcements' 
  | 'notifications' 
  | 'reviews' 
  | 'reports' 
  | 'categories'
  | 'locations'
  | 'audit-logs' 
  | 'states'
  | 'settings';

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  staff,
  onNavigate,
  onLogout
}) => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');
  const [moduleFilter, setModuleFilter] = useState<'all' | 'rentals' | 'jobs' | 'services'>('all');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Single Source of Truth Data State
  const [kpiMetrics, setKpiMetrics] = useState<AdminKpiMetrics>(() => AdminService.getKpiMetrics(moduleFilter));
  const [listings, setListings] = useState<UserListingItem[]>(() => ProfileService.getUserListings());
  const [reports, setReports] = useState<ListingReport[]>(() => ReportService.getReports());
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => AdminService.getAuditLogs());
  const [announcements, setAnnouncements] = useState<PlatformAnnouncement[]>(() => AdminService.getAnnouncements());

  // Moderation Target Listing
  const [selectedModerationListing, setSelectedModerationListing] = useState<UserListingItem | null>(null);
  const [selectedReviewListingId, setSelectedReviewListingId] = useState<string>('rent-prius-2018');

  // Announcement Creation Modal State
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [newAncTitle, setNewAncTitle] = useState('');
  const [newAncMessage, setNewAncMessage] = useState('');
  const [newAncModule, setNewAncModule] = useState<'all' | 'rentals' | 'jobs' | 'services'>('all');
  const [newAncPriority, setNewAncPriority] = useState<'normal' | 'urgent'>('normal');

  // Refresh single source of truth data
  const refreshDashboardData = async () => {
    const updatedListings = ProfileService.getUserListings();
    const updatedReports = ReportService.getReports();

    setListings(updatedListings);
    setReports(updatedReports);

    try {
      const metrics = await AdminService.getKpiMetricsAsync(moduleFilter);
      setKpiMetrics(metrics);

      const updatedLogs = await AdminService.getAuditLogsAsync();
      setAuditLogs(updatedLogs);

      const updatedAncs = await AdminService.getAnnouncementsAsync(moduleFilter);
      setAnnouncements(updatedAncs);
    } catch (err) {
      console.error('Failed to refresh async Supabase metrics:', err);
    }
  };

  useEffect(() => {
    refreshDashboardData();
  }, [moduleFilter]);

  // Derived filtered lists based on active module filter and searchQuery
  const filteredListings = listings.filter(item => {
    const matchesModule = moduleFilter === 'all' || item.module === moduleFilter;
    const matchesQuery = !searchQuery.trim() || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModule && matchesQuery;
  });

  const pendingListingsQueue = filteredListings.filter(l => l.status === 'pending');
  const activeListingsQueue = filteredListings.filter(l => l.status === 'active');
  const rejectedListingsQueue = filteredListings.filter(l => l.status === 'rejected');

  const handleCreateAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAncTitle.trim() || !newAncMessage.trim()) return;

    AdminService.createAnnouncement({
      title: newAncTitle.trim(),
      message: newAncMessage.trim(),
      targetModule: newAncModule,
      priority: newAncPriority,
      createdBy: staff.fullName
    }, staff);

    setShowAnnouncementModal(false);
    setNewAncTitle('');
    setNewAncMessage('');
    refreshDashboardData();
  };

  // Helper title renderer for breadcrumbs
  const getSectionTitle = () => {
    switch (activeSection) {
      case 'overview': return 'Overview Dashboard';
      case 'all-listings': return 'Marketplace Listings';
      case 'pending-approvals': 
      case 'moderation-queue': return 'Moderation Queue';
      case 'listing-review': return 'Listing Review Workspace';
      case 'active-listings': return 'Active Listings';
      case 'rejected-listings': return 'Rejected Listings';
      case 'reported-listings': return 'Reported Content';
      case 'categories': return 'Category Management';
      case 'locations': return 'Location Management';
      case 'all-users': return 'User Directory & Moderation';
      case 'staff-roles': return 'Staff Account Management';
      case 'security': return 'Security & Challenge Settings';
      case 'slides': return 'Marketplace Hero Slides';
      case 'companies': return 'Top Hiring Companies';
      case 'announcements': return 'Platform Broadcast Announcements';
      case 'reviews': return 'Reviews & Rating Moderation';
      case 'reports': return 'Community Violations Reports';
      case 'audit-logs': return 'Staff Operation Audit Trail';
      case 'states': return 'Empty & Error States System';
      default: return 'Admin Portal';
    }
  };

  // Shared Navigation Links Content
  const renderNavLinks = (isCollapsed: boolean = false, onSelect?: () => void) => {
    const handleNavClick = (section: ActiveSection) => {
      setActiveSection(section);
      if (onSelect) onSelect();
    };

    return (
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 text-xs font-medium">
        
        {/* Main Section */}
        <div>
          {!isCollapsed && (
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Dashboard
            </div>
          )}
          <button
            type="button"
            onClick={() => handleNavClick('overview')}
            title="Overview"
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
              activeSection === 'overview'
                ? 'bg-[#1464F4] text-white font-bold shadow-lg shadow-[#1464F4]/30'
                : 'hover:bg-slate-800/60 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>Overview</span>}
            </div>
          </button>
        </div>

        {/* Marketplace Section */}
        <div>
          {!isCollapsed && (
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Marketplace Management
            </div>
          )}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => handleNavClick('all-listings')}
              title="All Listings"
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                activeSection === 'all-listings' ? 'bg-[#1464F4] text-white font-bold' : 'hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>All Listings</span>}
              </div>
              {!isCollapsed && <span className="text-[10px] text-slate-400 font-semibold">{listings.length}</span>}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('pending-approvals')}
              title="Pending Approvals"
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                activeSection === 'pending-approvals' ? 'bg-[#1464F4] text-white font-bold' : 'hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                {!isCollapsed && <span>Pending Approvals</span>}
              </div>
              {pendingListingsQueue.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-900 font-black text-[10px] shrink-0">
                  {pendingListingsQueue.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('active-listings')}
              title="Active Listings"
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                activeSection === 'active-listings' ? 'bg-[#1464F4] text-white font-bold' : 'hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                {!isCollapsed && <span>Active Listings</span>}
              </div>
              {!isCollapsed && <span className="text-[10px] text-emerald-400 font-bold">{activeListingsQueue.length}</span>}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('rejected-listings')}
              title="Rejected Listings"
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                activeSection === 'rejected-listings' ? 'bg-[#1464F4] text-white font-bold' : 'hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                {!isCollapsed && <span>Rejected Listings</span>}
              </div>
              {!isCollapsed && <span className="text-[10px] text-slate-400 font-semibold">{rejectedListingsQueue.length}</span>}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('reported-listings')}
              title="Reported Listings"
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                activeSection === 'reported-listings' ? 'bg-[#1464F4] text-white font-bold' : 'hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                {!isCollapsed && <span>Reported Content</span>}
              </div>
              {reports.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[10px] shrink-0">
                  {reports.length}
                </span>
              )}
            </button>

            {(staff.role === 'SUPER_ADMIN' || staff.role === 'ADMIN') && (
              <>
                <button
                  type="button"
                  onClick={() => handleNavClick('categories')}
                  title="Category Taxonomy"
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                    activeSection === 'categories' ? 'bg-[#1464F4] text-white font-bold' : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FolderTree className="w-4 h-4 text-cyan-400 shrink-0" />
                    {!isCollapsed && <span>Categories</span>}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick('locations')}
                  title="Locations DB"
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                    activeSection === 'locations' ? 'bg-[#1464F4] text-white font-bold' : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    {!isCollapsed && <span>Locations</span>}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick('slides')}
                  title="Hero Slides Manager"
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                    activeSection === 'slides' ? 'bg-[#1464F4] text-white font-bold' : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sliders className="w-4 h-4 text-[#00C2FF] shrink-0" />
                    {!isCollapsed && <span>Hero Slides</span>}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick('companies')}
                  title="Hiring Companies Manager"
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                    activeSection === 'companies' ? 'bg-[#1464F4] text-white font-bold' : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-[#08A34F] shrink-0" />
                    {!isCollapsed && <span>Hiring Companies</span>}
                  </div>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Users & Staff Section */}
        {(staff.role === 'SUPER_ADMIN' || staff.role === 'ADMIN') && (
          <div>
            {!isCollapsed && (
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                Users & Roles
              </div>
            )}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => handleNavClick('all-users')}
                title="All Users"
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  activeSection === 'all-users' ? 'bg-[#1464F4] text-white font-bold' : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>All Users</span>}
                </div>
                {!isCollapsed && <span className="text-[10px] text-slate-400 font-semibold">{kpiMetrics.totalUsers.toLocaleString()}</span>}
              </button>

              {staff.role === 'SUPER_ADMIN' && (
                <button
                  type="button"
                  onClick={() => handleNavClick('staff-roles')}
                  title="Staff & Roles"
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                    activeSection === 'staff-roles' ? 'bg-[#1464F4] text-white font-bold' : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                    {!isCollapsed && <span>Staff & Roles</span>}
                  </div>
                </button>
              )}

              {staff.role === 'SUPER_ADMIN' && (
                <button
                  type="button"
                  onClick={() => handleNavClick('security')}
                  title="Security & Password"
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                    activeSection === 'security' ? 'bg-[#1464F4] text-white font-bold' : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <KeyRound className="w-4 h-4 text-amber-400 shrink-0" />
                    {!isCollapsed && <span>Security & Password</span>}
                  </div>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content & Moderation Section */}
        <div>
          {!isCollapsed && (
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Content & Moderation
            </div>
          )}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => handleNavClick('announcements')}
              title="Announcements"
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                activeSection === 'announcements' ? 'bg-[#1464F4] text-white font-bold' : 'hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Megaphone className="w-4 h-4 text-amber-400 shrink-0" />
                {!isCollapsed && <span>Announcements</span>}
              </div>
              {!isCollapsed && <span className="text-[10px] text-slate-400 font-semibold">{announcements.length}</span>}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('reviews')}
              title="Reviews & Ratings"
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                activeSection === 'reviews' ? 'bg-[#1464F4] text-white font-bold' : 'hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Star className="w-4 h-4 text-amber-400 shrink-0" />
                {!isCollapsed && <span>Reviews & Ratings</span>}
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('audit-logs')}
              title="Audit Logs"
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                activeSection === 'audit-logs' ? 'bg-[#1464F4] text-white font-bold' : 'hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                {!isCollapsed && <span>Audit Logs</span>}
              </div>
              {!isCollapsed && <span className="text-[10px] text-slate-400 font-semibold">{auditLogs.length}</span>}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('states')}
              title="Empty & Error States (Page 40)"
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                activeSection === 'states' ? 'bg-[#1464F4] text-white font-bold' : 'hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Inbox className="w-4 h-4 text-cyan-400 shrink-0" />
                {!isCollapsed && <span>Empty & Error States</span>}
              </div>
              {!isCollapsed && <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold text-[9px]">40</span>}
            </button>
          </div>
        </div>
      </nav>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-slate-800 flex flex-col font-sans select-none w-full overflow-x-hidden">
      
      {/* Admin Desktop & Mobile Top Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 h-16 px-4 md:px-6 flex items-center justify-between shadow-md w-full shrink-0">
        <div className="flex items-center gap-3 md:gap-4">
          
          {/* Menu Toggle Button */}
          <button
            type="button"
            onClick={() => {
              if (window.innerWidth < 1024) {
                setMobileDrawerOpen(!mobileDrawerOpen);
              } else {
                setSidebarCollapsed(!sidebarCollapsed);
              }
            }}
            className="p-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            title="Toggle Menu Sidebar"
          >
            <Menu className="w-5 h-5 lg:hidden" />
            <span className="hidden lg:block">
              {sidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </span>
          </button>

          {/* Logo & Portal Branding */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveSection('overview')}>
            <span className="text-xl font-black tracking-tight text-white">
              <span className="text-[#1464F4]">R</span>ENTOURA<span className="text-[#1464F4]">.LK</span>
            </span>
            <span className="hidden sm:inline-block bg-[#1464F4]/20 border border-[#1464F4]/40 text-[#1464F4] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
              Admin Portal
            </span>
          </div>

          <div className="hidden xl:flex items-center gap-2 text-xs text-slate-400 border-l border-slate-800 pl-4 font-semibold">
            <span>Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-bold">{getSectionTitle()}</span>
          </div>
        </div>

        {/* Global Admin Search Input */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search listings, users, reports, audit logs..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
          />
        </div>

        {/* Top Right Controls & Staff Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          <button
            type="button"
            onClick={refreshDashboardData}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Refresh Platform Data"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Pending Approvals Notification Badge */}
          <button
            type="button"
            onClick={() => setActiveSection('pending-approvals')}
            className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Pending Approvals Notifications"
          >
            <Bell className="w-4 h-4" />
            {pendingListingsQueue.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-900 font-black text-[10px] rounded-full flex items-center justify-center animate-pulse">
                {pendingListingsQueue.length}
              </span>
            )}
          </button>

          {/* Language Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>English</span>
          </div>

          {/* Go to Marketplace Action */}
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1464F4] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-sm"
            title="Switch to Marketplace (Stay signed in)"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Go to Marketplace</span>
          </button>

          {/* Current Staff Avatar */}
          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-800">
            {staff.avatarUrl ? (
              <img
                src={staff.avatarUrl}
                alt={staff.fullName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#1464F4] shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1464F4] to-cyan-500 text-white font-black text-xs flex items-center justify-center ring-2 ring-[#1464F4] shrink-0">
                {staff.fullName ? staff.fullName.charAt(0).toUpperCase() : 'S'}
              </div>
            )}
            <div className="hidden md:block text-left">
              <div className="text-xs font-extrabold text-white leading-none">{staff.displayName || staff.fullName}</div>
              <div className="text-[10px] text-cyan-400 font-semibold mt-0.5">{staff.role.replace('_', ' ')}</div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 rounded-xl text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-colors ml-1"
              title="Log Out Staff Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Body Area */}
      <div className="flex-1 flex w-full relative min-h-[calc(100vh-4rem)]">
        
        {/* Desktop Fixed Left Sidebar */}
        <aside
          className={`hidden lg:flex bg-[#041C43] text-slate-300 border-r border-slate-800/80 flex-col justify-between transition-all duration-300 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto ${
            sidebarCollapsed ? 'w-20' : 'w-[260px]'
          }`}
        >
          {/* Staff Info Card Header */}
          {!sidebarCollapsed ? (
            <div className="p-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  {staff.avatarUrl ? (
                    <img
                      src={staff.avatarUrl}
                      alt={staff.fullName}
                      className="w-10 h-10 rounded-2xl object-cover ring-2 ring-[#1464F4]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1464F4] to-cyan-500 text-white font-black text-sm flex items-center justify-center ring-2 ring-[#1464F4] shrink-0">
                      {staff.fullName ? staff.fullName.charAt(0).toUpperCase() : 'S'}
                    </div>
                  )}
                  <span className="w-2.5 h-2.5 bg-emerald-500 border-2 border-[#041C43] rounded-full absolute -bottom-0.5 -right-0.5" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-extrabold text-white truncate">{staff.fullName}</div>
                  <div className="text-[10px] text-slate-400 truncate">{staff.email}</div>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-[#1464F4] text-white text-[8px] font-black uppercase rounded-md tracking-wider">
                    {staff.role.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 border-b border-slate-800/80 flex justify-center">
              {staff.avatarUrl ? (
                <img
                  src={staff.avatarUrl}
                  alt={staff.fullName}
                  className="w-9 h-9 rounded-2xl object-cover ring-2 ring-[#1464F4]"
                  title={staff.fullName}
                />
              ) : (
                <div 
                  className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#1464F4] to-cyan-500 text-white font-black text-xs flex items-center justify-center ring-2 ring-[#1464F4]"
                  title={staff.fullName}
                >
                  {staff.fullName ? staff.fullName.charAt(0).toUpperCase() : 'S'}
                </div>
              )}
            </div>
          )}

          {/* Sidebar Links List */}
          {renderNavLinks(sidebarCollapsed)}

          {/* Bottom Action Footer */}
          <div className="p-3 border-t border-slate-800/80 space-y-1">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              title="View Public Marketplace Website"
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-2.5 px-3'} py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors text-xs font-semibold`}
            >
              <ExternalLink className="w-4 h-4 text-cyan-400 shrink-0" />
              {!sidebarCollapsed && <span>View Website</span>}
            </button>

            <button
              type="button"
              onClick={onLogout}
              title="Log Out Staff Account"
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-2.5 px-3'} py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-xs font-bold`}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Log Out</span>}
            </button>
          </div>
        </aside>

        {/* Mobile Slide-over Drawer Overlay (Screens < 1024px) */}
        {mobileDrawerOpen && (
          <div className="lg:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 transition-opacity"
              onClick={() => setMobileDrawerOpen(false)}
            />
            
            {/* Drawer Container */}
            <aside className="fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] bg-[#041C43] text-slate-300 shadow-2xl flex flex-col justify-between overflow-y-auto">
              
              {/* Drawer Top Branding Header */}
              <div>
                <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black tracking-tight text-white">
                      <span className="text-[#1464F4]">R</span>ENTOURA<span className="text-[#1464F4]">.LK</span>
                    </span>
                    <span className="bg-[#1464F4]/20 border border-[#1464F4]/40 text-[#1464F4] text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                      Admin
                    </span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Staff Profile Card inside Drawer */}
                <div className="p-4 bg-slate-800/50 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    {staff.avatarUrl ? (
                      <img
                        src={staff.avatarUrl}
                        alt={staff.fullName}
                        className="w-10 h-10 rounded-2xl object-cover ring-2 ring-[#1464F4] shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1464F4] to-cyan-500 text-white font-black text-sm flex items-center justify-center ring-2 ring-[#1464F4] shrink-0">
                        {staff.fullName ? staff.fullName.charAt(0).toUpperCase() : 'S'}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <div className="text-xs font-extrabold text-white truncate">{staff.fullName}</div>
                      <div className="text-[10px] text-cyan-400 font-semibold">{staff.role.replace('_', ' ')}</div>
                    </div>
                  </div>
                </div>

                {/* Mobile Drawer Links */}
                {renderNavLinks(false, () => setMobileDrawerOpen(false))}
              </div>

              {/* Drawer Bottom Actions */}
              <div className="p-3 border-t border-slate-800 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    onNavigate('/');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors text-xs font-semibold"
                >
                  <ExternalLink className="w-4 h-4 text-cyan-400" />
                  <span>View Public Website</span>
                </button>

                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-xs font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out Session</span>
                </button>
              </div>

            </aside>
          </div>
        )}

        {/* Main Dashboard Content Workspace */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto bg-[#F5F7FB]">
          
          {activeSection === 'moderation-queue' || activeSection === 'pending-approvals' ? (
            <AdminModerationQueue 
              staff={staff} 
              onReviewListing={(id) => {
                setSelectedReviewListingId(id);
                setActiveSection('listing-review');
              }}
              onRefresh={refreshDashboardData} 
            />
          ) : activeSection === 'listing-review' ? (
            <AdminListingReview 
              listingId={selectedReviewListingId || 'rent-prius-2018'} 
              staff={staff} 
              onBackToQueue={() => setActiveSection('moderation-queue')} 
              onNavigateToListing={(id) => setSelectedReviewListingId(id)}
              onRefresh={refreshDashboardData}
            />
          ) : activeSection === 'all-users' ? (
            <AdminUsersView 
              staff={staff} 
              onRefresh={refreshDashboardData} 
              onNavigateToListings={(userId) => setActiveSection('all-listings')}
            />
          ) : activeSection === 'categories' ? (
            <AdminCategoryView staff={staff} onRefresh={refreshDashboardData} />
          ) : activeSection === 'locations' ? (
            <AdminLocationView staff={staff} onRefresh={refreshDashboardData} />
          ) : activeSection === 'staff-roles' ? (
            staff.role === 'SUPER_ADMIN' ? (
              <AdminStaffView currentStaff={staff} onRefresh={refreshDashboardData} />
            ) : (
              <div className="p-8 bg-white rounded-3xl border border-rose-200 text-center space-y-2">
                <h2 className="text-lg font-bold text-rose-600">Access Restricted</h2>
                <p className="text-xs text-slate-500">Only Super Admin accounts can manage staff members and system permissions.</p>
              </div>
            )
          ) : activeSection === 'security' ? (
            <AdminSecurityView staff={staff} />
          ) : activeSection === 'slides' ? (
            <AdminSlidesView staff={staff} />
          ) : activeSection === 'companies' ? (
            <AdminCompaniesView staff={staff} />
          ) : activeSection === 'all-listings' || activeSection === 'active-listings' || activeSection === 'rejected-listings' ? (
            <AdminListingsView 
              staff={staff} 
              initialTab={activeSection === 'active-listings' ? 'active' : activeSection === 'rejected-listings' ? 'rejected' : 'all'} 
              onRefresh={refreshDashboardData} 
            />
          ) : activeSection === 'audit-logs' ? (
            <AdminAuditLogsView staff={staff} />
          ) : activeSection === 'reports' || activeSection === 'reported-listings' ? (
            <AdminReportsView 
              staff={staff} 
              onRefresh={refreshDashboardData} 
              onNavigateToTarget={(targetType, targetId) => {
                if (targetType === 'listing') {
                  setSelectedReviewListingId(targetId);
                  setActiveSection('listing-review');
                } else if (targetType === 'user') {
                  setActiveSection('all-users');
                } else if (targetType === 'review') {
                  setActiveSection('reviews');
                }
              }}
            />
          ) : activeSection === 'announcements' ? (
            <AdminAnnouncementsView staff={staff} onRefresh={refreshDashboardData} />
          ) : activeSection === 'reviews' ? (
            <AdminReviewsView staff={staff} onRefresh={refreshDashboardData} />
          ) : activeSection === 'states' ? (
            <AdminStatesView staff={staff} onNavigateSection={(sec) => setActiveSection(sec as ActiveSection)} />
          ) : (
            <>
              {/* Welcome Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Welcome back, {staff.displayName || staff.fullName}</span>
                    <span className="animate-bounce">👋</span>
                  </h1>
                  <p className="text-slate-500 text-xs mt-1 font-medium">
                    Here is your live marketplace operational overview. All metrics are synchronized in real time.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Marketplace Module Switcher Tabs */}
                  <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 text-xs font-bold border border-slate-200">
                    {(['all', 'rentals', 'jobs', 'services'] as const).map(mod => (
                      <button
                        key={mod}
                        type="button"
                        onClick={() => setModuleFilter(mod)}
                        className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                          moduleFilter === mod 
                            ? (mod === 'rentals' ? 'bg-[#1464F4] text-white shadow-xs' :
                               mod === 'jobs' ? 'bg-[#08A34F] text-white shadow-xs' :
                               mod === 'services' ? 'bg-[#FF650A] text-white shadow-xs' :
                               'bg-slate-900 text-white shadow-xs')
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {mod}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={refreshDashboardData}
                    className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Refresh Live Data"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Desktop & Mobile Responsive KPI Metric Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5">
                
                {/* Total Listings Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider truncate">Total Listings</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1464F4] flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">{kpiMetrics.totalListings.toLocaleString()}</div>
                  <div className="text-[11px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">+12.5% this week</span>
                  </div>
                </div>

                {/* Active Listings Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider truncate">Active Listings</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">{kpiMetrics.activeListings.toLocaleString()}</div>
                  <div className="text-[11px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">+8.7% active growth</span>
                  </div>
                </div>

                {/* Pending Approvals Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider truncate">Pending Queue</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">{kpiMetrics.pendingListings.toLocaleString()}</div>
                  <div className="text-[11px] text-amber-600 font-bold mt-1.5 flex items-center gap-1">
                    <span className="truncate">Requires moderation</span>
                  </div>
                </div>

                {/* Reported Content Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider truncate">Reported Content</span>
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">{kpiMetrics.reportedListings.toLocaleString()}</div>
                  <div className="text-[11px] text-rose-600 font-bold mt-1.5 flex items-center gap-1">
                    <span className="truncate">{reports.filter(r => r.status === 'submitted').length} pending reports</span>
                  </div>
                </div>

                {/* Total Users Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow min-w-0 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider truncate">Total Users</span>
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">{kpiMetrics.totalUsers.toLocaleString()}</div>
                  <div className="text-[11px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">+18.6% user growth</span>
                  </div>
                </div>
              </div>

              {/* Primary Dashboard Grid (Left 2/3 + Right 1/3) */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Left 2 Columns Workspace */}
                <div className="xl:col-span-2 space-y-6 min-w-0">
                  
                  {/* Overview Analytics Chart Card */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900">Overview Analytics</h3>
                        <p className="text-slate-500 text-xs mt-0.5">Live platform activity trends across Sri Lanka</p>
                      </div>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">Last 7 Days</span>
                    </div>

                    {/* SVG Analytics Graph */}
                    <div className="h-44 w-full relative my-2">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                        <path
                          d="M 0 110 Q 75 80, 150 95 T 300 60 T 450 40 T 500 20"
                          fill="none"
                          stroke="#1464F4"
                          strokeWidth="3.5"
                        />
                        <path
                          d="M 0 130 Q 75 110, 150 120 T 300 90 T 450 80 T 500 70"
                          fill="none"
                          stroke="#08A34F"
                          strokeWidth="3"
                          strokeDasharray="4 4"
                        />
                      </svg>
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                      </div>
                    </div>

                    {/* Breakdown Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 text-xs">
                      <div className="p-3 bg-slate-50 rounded-2xl">
                        <div className="text-slate-400 text-[10px] font-bold uppercase">New Listings</div>
                        <div className="text-base font-black text-slate-900 mt-0.5">+231</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-2xl">
                        <div className="text-slate-400 text-[10px] font-bold uppercase">New Users</div>
                        <div className="text-base font-black text-slate-900 mt-0.5">+642</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-2xl">
                        <div className="text-slate-400 text-[10px] font-bold uppercase">Total Views</div>
                        <div className="text-base font-black text-slate-900 mt-0.5">128.6K</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-2xl">
                        <div className="text-slate-400 text-[10px] font-bold uppercase">Messages</div>
                        <div className="text-base font-black text-slate-900 mt-0.5">1,324</div>
                      </div>
                    </div>
                  </div>

                  {/* Pending Listings Queue Card */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                          <span>Pending Listings Queue</span>
                          {pendingListingsQueue.length > 0 && (
                            <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                              {pendingListingsQueue.length} Waiting
                            </span>
                          )}
                        </h3>
                        <p className="text-slate-500 text-xs mt-0.5">Listings submitted by users awaiting moderation review</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveSection('pending-approvals')}
                        className="text-xs font-bold text-[#1464F4] hover:underline shrink-0"
                      >
                        View Queue →
                      </button>
                    </div>

                    {pendingListingsQueue.length === 0 ? (
                      <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                        <div className="font-bold text-slate-800 text-sm">Queue is Clear!</div>
                        <div className="text-slate-500 text-xs mt-0.5">There are currently no pending listings waiting for moderation.</div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {pendingListingsQueue.slice(0, 4).map(item => (
                          <div
                            key={item.id}
                            className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 transition-colors flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3 overflow-hidden min-w-0">
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                              />
                              <div className="overflow-hidden min-w-0">
                                <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">{item.title}</div>
                                <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5 truncate">
                                  <span className="capitalize font-semibold text-[#1464F4]">{item.module}</span>
                                  <span>•</span>
                                  <span className="truncate">{item.location}</span>
                                </div>
                                <div className="text-[10px] text-slate-400 mt-0.5">Submitted {item.postedDate}</div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => setSelectedModerationListing(item)}
                              className="px-4 py-2 rounded-xl bg-[#1464F4] hover:bg-[#1052cd] text-white font-bold text-xs shadow-xs shrink-0 transition-all"
                            >
                              Review
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Community Violation Reports Card */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900">Reported Content Violations</h3>
                        <p className="text-slate-500 text-xs mt-0.5">Reports submitted by community members regarding content</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveSection('reports')}
                        className="text-xs font-bold text-[#1464F4] hover:underline shrink-0"
                      >
                        View All Reports →
                      </button>
                    </div>

                    {reports.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl">
                        No unresolved user reports at this time.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {reports.slice(0, 3).map(rep => (
                          <div key={rep.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-3 overflow-hidden min-w-0">
                              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-4 h-4" />
                              </div>
                              <div className="overflow-hidden min-w-0">
                                <div className="font-bold text-slate-900 truncate">{rep.reasonLabel}</div>
                                <div className="text-slate-500 text-[11px] truncate max-w-sm">{rep.targetTitle}</div>
                              </div>
                            </div>
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 shrink-0">
                              {rep.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* Right Column Workspace (Quick Actions & System Health) */}
                <div className="space-y-6 min-w-0">
                  
                  {/* Quick Actions Card */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                    <h3 className="text-base font-extrabold text-slate-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <button
                        type="button"
                        onClick={() => setActiveSection('pending-approvals')}
                        className="p-3.5 bg-blue-50/80 hover:bg-blue-100/80 text-[#1464F4] font-bold rounded-2xl border border-blue-100 text-left transition-all flex flex-col gap-1.5"
                      >
                        <Clock className="w-5 h-5 text-[#1464F4]" />
                        <span>Approve Listings</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowAnnouncementModal(true)}
                        className="p-3.5 bg-emerald-50/80 hover:bg-emerald-100/80 text-emerald-700 font-bold rounded-2xl border border-emerald-100 text-left transition-all flex flex-col gap-1.5"
                      >
                        <Megaphone className="w-5 h-5 text-emerald-600" />
                        <span>Add Announcement</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveSection('reports')}
                        className="p-3.5 bg-rose-50/80 hover:bg-rose-100/80 text-rose-700 font-bold rounded-2xl border border-rose-100 text-left transition-all flex flex-col gap-1.5"
                      >
                        <AlertTriangle className="w-5 h-5 text-rose-600" />
                        <span>View Reports</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveSection('all-users')}
                        className="p-3.5 bg-purple-50/80 hover:bg-purple-100/80 text-purple-700 font-bold rounded-2xl border border-purple-100 text-left transition-all flex flex-col gap-1.5"
                      >
                        <Users className="w-5 h-5 text-purple-600" />
                        <span>Manage Users</span>
                      </button>
                    </div>
                  </div>

                  {/* System Health Status Card */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                    <h3 className="text-base font-extrabold text-slate-900 mb-3">System Health Status</h3>
                    
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <span className="text-slate-600 font-semibold flex items-center gap-2 truncate">
                          <Globe className="w-4 h-4 text-emerald-500 shrink-0" /> Application
                        </span>
                        <span className="font-bold text-emerald-600 bg-emerald-100 px-2.5 py-0.5 rounded-md shrink-0">Online</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <span className="text-slate-600 font-semibold flex items-center gap-2 truncate">
                          <Database className="w-4 h-4 text-emerald-500 shrink-0" /> Supabase Database
                        </span>
                        <span className="font-bold text-emerald-600 bg-emerald-100 px-2.5 py-0.5 rounded-md shrink-0">Online</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <span className="text-slate-600 font-semibold flex items-center gap-2 truncate">
                          <Server className="w-4 h-4 text-amber-500 shrink-0" /> Storage Usage
                        </span>
                        <span className="font-bold text-slate-800 shrink-0">72% Used</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Staff Audit Log Feed */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                    <h3 className="text-base font-extrabold text-slate-900 mb-3">Recent Staff Audit Activity</h3>
                    <div className="space-y-3">
                      {auditLogs.slice(0, 3).map(log => (
                        <div key={log.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
                          <div className="flex items-center justify-between font-bold text-slate-900">
                            <span className="truncate">{log.actorName}</span>
                            <span className="text-[10px] text-slate-400 font-normal shrink-0">{log.createdAt}</span>
                          </div>
                          <div className="text-slate-600 mt-1 font-medium">{log.details}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </>
          )}

        </main>

      </div>

      {/* Listing Moderation Modal Drawer */}
      {selectedModerationListing && (
        <ListingModerationModal
          listing={selectedModerationListing}
          staff={staff}
          onClose={() => setSelectedModerationListing(null)}
          onActionCompleted={refreshDashboardData}
        />
      )}

      {/* Create Broadcast Announcement Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">Create Platform Announcement</h3>
            <form onSubmit={handleCreateAnnouncementSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Announcement Title</label>
                <input
                  type="text"
                  required
                  value={newAncTitle}
                  onChange={(e) => setNewAncTitle(e.target.value)}
                  placeholder="e.g. Scheduled System Upgrade Notice"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Module</label>
                <select
                  value={newAncModule}
                  onChange={(e: any) => setNewAncModule(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                >
                  <option value="all">All Marketplace Modules</option>
                  <option value="rentals">Rentals Only</option>
                  <option value="jobs">Jobs Only</option>
                  <option value="services">Services Only</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Announcement Message</label>
                <textarea
                  required
                  rows={3}
                  value={newAncMessage}
                  onChange={(e) => setNewAncMessage(e.target.value)}
                  placeholder="Enter details of announcement broadcasted to users..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAnnouncementModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#1464F4] hover:bg-[#1052cd] text-white font-bold rounded-xl shadow-md shadow-[#1464F4]/20 transition-all"
                >
                  Broadcast Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
