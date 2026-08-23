import React, { useState } from 'react';
import { 
  Shield, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Clock, 
  MapPin, 
  Tag, 
  User, 
  SlidersHorizontal, 
  Download, 
  CheckCheck, 
  AlertTriangle, 
  RotateCw, 
  ChevronRight, 
  ChevronLeft, 
  FileText, 
  Info, 
  X, 
  Layers, 
  Building2, 
  Briefcase, 
  Wrench,
  Check,
  Send,
  AlertCircle
} from 'lucide-react';
import { StaffAccount } from '../../types/adminTypes';
import { UserListingItem } from '../../types/profileTypes';
import { ProfileService } from '../../services/profileService';
import { AdminService } from '../../services/adminService';
import { ReportService } from '../../services/reportService';

interface AdminModerationQueueProps {
  staff: StaffAccount;
  onReviewListing: (listingId: string) => void;
  onRefresh: () => void;
}

export const AdminModerationQueue: React.FC<AdminModerationQueueProps> = ({
  staff,
  onReviewListing,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'rentals' | 'jobs' | 'services' | 'reported'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price-high' | 'price-low'>('newest');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  
  // Filter Drawer States
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | '24h' | '7d'>('all');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['New', 'Reported', 'Edited', 'Under Review']);

  // Selection for Bulk Actions
  const [selectedListingIds, setSelectedListingIds] = useState<string[]>([]);

  // Action Modals State
  const [rejectingListing, setRejectingListing] = useState<UserListingItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [bulkRejectModalOpen, setBulkRejectModalOpen] = useState(false);
  const [bulkRejectionReason, setBulkRejectionReason] = useState('');
  const [bulkApproveModalOpen, setBulkApproveModalOpen] = useState(false);
  const [quickApproveConfirmListing, setQuickApproveConfirmListing] = useState<UserListingItem | null>(null);
  
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch real listings and reports from Single Source of Truth
  const allListings = ProfileService.getUserListings();
  const allReports = ReportService.getReports();

  const pendingListings = allListings.filter(l => l.status === 'pending');
  const reportedListings = allListings.filter(l => 
    allReports.some(r => r.targetId === l.id && (r.status === 'submitted' || r.status === 'under_review'))
  );

  // KPI Calculations
  const totalPendingCount = pendingListings.length;
  const rentalsPendingCount = pendingListings.filter(l => l.module === 'rentals').length;
  const jobsPendingCount = pendingListings.filter(l => l.module === 'jobs').length;
  const servicesPendingCount = pendingListings.filter(l => l.module === 'services').length;
  const reportedPendingCount = reportedListings.length;

  // Filter listings based on active tab, search, category, and filter drawer
  const baseListings = activeTab === 'reported' ? reportedListings : pendingListings;

  const filteredListings = baseListings.filter(item => {
    // Tab Module Filter
    if (activeTab === 'rentals' && item.module !== 'rentals') return false;
    if (activeTab === 'jobs' && item.module !== 'jobs') return false;
    if (activeTab === 'services' && item.module !== 'services') return false;

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = item.title.toLowerCase().includes(q);
      const matchesCategory = item.category.toLowerCase().includes(q);
      const matchesLocation = item.location.toLowerCase().includes(q);
      const matchesId = item.id.toLowerCase().includes(q);
      const matchesOwner = (item.companyName || item.providerName || item.ownerId || '').toLowerCase().includes(q);
      if (!matchesTitle && !matchesCategory && !matchesLocation && !matchesId && !matchesOwner) return false;
    }

    // Category Filter
    if (selectedCategory !== 'all' && item.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }

    // Province Filter
    if (selectedProvinces.length > 0) {
      const matchesProv = selectedProvinces.some(p => item.location.toLowerCase().includes(p.toLowerCase()));
      if (!matchesProv) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'newest') return (b.createdAt || b.postedDate).localeCompare(a.createdAt || a.postedDate);
    if (sortBy === 'oldest') return (a.createdAt || a.postedDate).localeCompare(b.createdAt || b.postedDate);
    return 0;
  });

  // Unique categories for filter dropdown
  const categoriesList = Array.from(new Set(pendingListings.map(l => l.category)));

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage) || 1;
  const paginatedListings = filteredListings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Toggle selection for bulk actions
  const toggleSelectListing = (id: string) => {
    setSelectedListingIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedListingIds.length === paginatedListings.length) {
      setSelectedListingIds([]);
    } else {
      setSelectedListingIds(paginatedListings.map(l => l.id));
    }
  };

  // Quick Action Handlers
  const handleQuickApprove = (listing: UserListingItem) => {
    const result = AdminService.approveListing(listing.id, staff);
    if (result.success) {
      setFeedbackMessage({ type: 'success', text: `Approved "${listing.title}" successfully!` });
      setQuickApproveConfirmListing(null);
      onRefresh();
      setTimeout(() => setFeedbackMessage(null), 3000);
    } else {
      setFeedbackMessage({ type: 'error', text: result.error || 'Failed to approve listing.' });
    }
  };

  const handleSingleReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingListing || !rejectionReason.trim()) return;

    const result = AdminService.rejectListing(rejectingListing.id, rejectionReason.trim(), staff);
    if (result.success) {
      setFeedbackMessage({ type: 'success', text: `Rejected "${rejectingListing.title}" with notification sent to owner.` });
      setRejectingListing(null);
      setRejectionReason('');
      onRefresh();
      setTimeout(() => setFeedbackMessage(null), 3000);
    } else {
      setFeedbackMessage({ type: 'error', text: result.error || 'Failed to reject listing.' });
    }
  };

  const handleBulkApprove = () => {
    if (selectedListingIds.length === 0) return;
    let count = 0;
    selectedListingIds.forEach(id => {
      const res = AdminService.approveListing(id, staff);
      if (res.success) count++;
    });

    setFeedbackMessage({ type: 'success', text: `Successfully bulk-approved ${count} listing(s)!` });
    setSelectedListingIds([]);
    setBulkApproveModalOpen(false);
    onRefresh();
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleBulkReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedListingIds.length === 0 || !bulkRejectionReason.trim()) return;

    let count = 0;
    selectedListingIds.forEach(id => {
      const res = AdminService.rejectListing(id, bulkRejectionReason.trim(), staff);
      if (res.success) count++;
    });

    setFeedbackMessage({ type: 'success', text: `Successfully bulk-rejected ${count} listing(s).` });
    setSelectedListingIds([]);
    setBulkRejectionReason('');
    setBulkRejectModalOpen(false);
    onRefresh();
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Module', 'Category', 'Location', 'Price', 'Posted Date', 'Status'];
    const rows = filteredListings.map(l => [
      l.id,
      `"${l.title.replace(/"/g, '""')}"`,
      l.module,
      `"${l.category}"`,
      `"${l.location.replace(/"/g, '""')}"`,
      `"${l.price}"`,
      l.postedDate,
      l.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rentoura_moderation_queue_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">

      {/* Alert Feedback Toast */}
      {feedbackMessage && (
        <div className={`p-4 rounded-2xl border shadow-lg flex items-center justify-between animate-fadeIn ${
          feedbackMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
            : 'bg-rose-50 text-rose-900 border-rose-200'
        }`}>
          <div className="flex items-center gap-3">
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <p className="text-xs font-bold">{feedbackMessage.text}</p>
          </div>
          <button onClick={() => setFeedbackMessage(null)} className="p-1 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* PAGE 34 MAIN HEADER */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#1464F4]/10 text-[#1464F4] flex items-center justify-center border border-[#1464F4]/20 shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Moderation Queue</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500/10 text-amber-600 border border-amber-500/20">
                {totalPendingCount} Pending
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Review and take action on pending content before it goes live on the RENTOURA.LK marketplace.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={onRefresh}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-1.5 text-xs font-bold"
            title="Refresh Single Source of Truth"
          >
            <RotateCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
          
          <button
            type="button"
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              showFilterDrawer 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter Panel</span>
          </button>
        </div>
      </div>

      {/* KPI SUMMARY CARDS (PAGE 34) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Total Pending */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Pending</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalPendingCount}</span>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
              Queue Total
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* Rentals Pending */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rentals Pending</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1464F4] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{rentalsPendingCount}</span>
            <span className="text-[10px] font-bold text-[#1464F4] bg-blue-50 px-1.5 py-0.5 rounded-md">
              Rentals
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#1464F4] h-full rounded-full" style={{ width: `${(rentalsPendingCount / (totalPendingCount || 1)) * 100}%` }}></div>
          </div>
        </div>

        {/* Jobs Pending */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jobs Pending</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{jobsPendingCount}</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
              Vacancies
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(jobsPendingCount / (totalPendingCount || 1)) * 100}%` }}></div>
          </div>
        </div>

        {/* Services Pending */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Services Pending</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{servicesPendingCount}</span>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-md">
              Services
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: `${(servicesPendingCount / (totalPendingCount || 1)) * 100}%` }}></div>
          </div>
        </div>

        {/* Reported / Urgent */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reported Items</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{reportedPendingCount}</span>
            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md">
              Requires Review
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: `${(reportedPendingCount / (totalPendingCount || 1)) * 100}%` }}></div>
          </div>
        </div>

      </div>

      {/* QUEUE TABS BAR (PAGE 34) */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-2 overflow-x-auto">
        
        <button
          type="button"
          onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'all' 
              ? 'bg-slate-900 text-white shadow-sm' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>All Pending</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {totalPendingCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('rentals'); setCurrentPage(1); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'rentals' 
              ? 'bg-[#1464F4] text-white shadow-sm' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Rentals</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            activeTab === 'rentals' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {rentalsPendingCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('jobs'); setCurrentPage(1); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'jobs' 
              ? 'bg-emerald-600 text-white shadow-sm' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Jobs</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            activeTab === 'jobs' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {jobsPendingCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('services'); setCurrentPage(1); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'services' 
              ? 'bg-purple-600 text-white shadow-sm' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Services</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            activeTab === 'services' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {servicesPendingCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('reported'); setCurrentPage(1); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'reported' 
              ? 'bg-rose-600 text-white shadow-sm' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Reported Items</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            activeTab === 'reported' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
          }`}>
            {reportedPendingCount}
          </span>
        </button>

      </div>

      {/* FILTER DRAWER / PANEL (PAGE 34) */}
      {showFilterDrawer && (
        <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl animate-fadeIn space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-[#1464F4]" />
              <h3 className="text-sm font-black text-white">Advanced Filter Drawer</h3>
            </div>
            <button 
              onClick={() => setShowFilterDrawer(false)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Category Filter */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-xs font-bold text-white rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
              >
                <option value="all">All Categories</option>
                {categoriesList.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Sort Order</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 text-xs font-bold text-white rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            {/* Time Filter */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Submitted Within</label>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 text-xs font-bold text-white rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSortBy('newest');
                  setTimeFilter('all');
                  setSelectedProvinces([]);
                  setSearchQuery('');
                }}
                className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition-all"
              >
                Clear All
              </button>

              <button
                type="button"
                onClick={() => setShowFilterDrawer(false)}
                className="w-1/2 py-2.5 bg-[#1464F4] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Apply Filters
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SEARCH AND CONTROL BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search by title, user, ID or keyword..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          
          {/* Category Filter Select */}
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 py-2 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
          >
            <option value="all">All Categories</option>
            {categoriesList.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Sort Order Select */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 py-2 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

        </div>

      </div>

      {/* QUEUE WORKSPACE GRID (MAIN LIST + SIDEBAR CARDS) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* LEFT / MAIN COLUMN (3 COLS) - PENDING LISTINGS */}
        <div className="lg:col-span-3 space-y-4">

          {/* Selection Bar for Bulk Actions */}
          {filteredListings.length > 0 && (
            <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedListingIds.length === paginatedListings.length && paginatedListings.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded text-[#1464F4] focus:ring-[#1464F4] accent-[#1464F4]"
                />
                <span>Select Page Items ({selectedListingIds.length} selected)</span>
              </label>

              {selectedListingIds.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBulkApproveModalOpen(true)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Selected ({selectedListingIds.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBulkRejectModalOpen(true)}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject Selected ({selectedListingIds.length})</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* LISTING CARDS */}
          {paginatedListings.length === 0 ? (
            /* EMPTY QUEUE STATE (PAGE 34) */
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCheck className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-xl font-black text-slate-900">You're All Caught Up! 🎉</h3>
                <p className="text-slate-500 text-xs font-medium">
                  There are currently no pending listings waiting for moderation review in this section.
                </p>
              </div>
              <button
                onClick={onRefresh}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-all inline-flex items-center gap-2"
              >
                <RotateCw className="w-4 h-4" />
                <span>Check for New Submissions</span>
              </button>
            </div>
          ) : (
            paginatedListings.map(item => {
              const isSelected = selectedListingIds.includes(item.id);

              return (
                <div 
                  key={item.id}
                  className={`bg-white rounded-2xl border transition-all hover:shadow-md p-4 sm:p-5 flex flex-col sm:flex-row gap-4 relative ${
                    isSelected ? 'border-[#1464F4] bg-blue-50/20 shadow-sm' : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  
                  {/* Select Checkbox */}
                  <div className="absolute top-4 left-4 z-10">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectListing(item.id)}
                      className="w-4 h-4 rounded text-[#1464F4] focus:ring-[#1464F4] accent-[#1464F4] cursor-pointer"
                    />
                  </div>

                  {/* THUMBNAIL PHOTO PREVIEW */}
                  <div className="w-full sm:w-48 h-36 sm:h-auto rounded-xl bg-slate-100 overflow-hidden relative shrink-0 ml-6 sm:ml-0">
                    <img 
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80'} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Photo count badge */}
                    <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span>{item.imagesCount || 5} Photos</span>
                    </div>

                    {/* Module Badge Overlay */}
                    <div className="absolute top-2 left-2">
                      {item.module === 'rentals' && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-[#1464F4] text-white shadow-sm">
                          RENTAL
                        </span>
                      )}
                      {item.module === 'jobs' && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-emerald-600 text-white shadow-sm">
                          JOB
                        </span>
                      )}
                      {item.module === 'services' && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-amber-600 text-white shadow-sm">
                          SERVICE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ITEM DETAILS CONTENT */}
                  <div className="flex-1 flex flex-col justify-between space-y-3">
                    
                    <div>
                      {/* Top Meta row */}
                      <div className="flex items-center justify-between gap-2 text-xs mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            {item.category}
                          </span>
                          {item.subcategory && (
                            <span className="text-slate-400 font-medium">› {item.subcategory}</span>
                          )}
                        </div>

                        <span className="text-[11px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          Pending Moderation
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-slate-900 hover:text-[#1464F4] cursor-pointer transition-colors line-clamp-2"
                          onClick={() => onReviewListing(item.id)}>
                        {item.title}
                      </h3>

                      {/* Location & Price */}
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                        <div className="flex items-center gap-1 text-slate-600 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.location}</span>
                        </div>

                        <div className="font-black text-[#1464F4]">
                          {item.price} <span className="text-slate-500 font-normal">{item.pricePeriod || ''}</span>
                        </div>
                      </div>

                      {/* Listed By / Submitted info */}
                      <div className="mt-2.5 flex items-center gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>Listed by: {item.companyName || item.providerName || 'Kasun Kalhara'}</span>
                          <span className="text-emerald-600 text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded font-bold border border-emerald-200">
                            ✓ Verified
                          </span>
                        </div>

                        <span>•</span>

                        <div className="flex items-center gap-1 font-mono text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Submitted {item.postedDate}</span>
                        </div>

                        <span className="font-mono text-slate-400 text-[11px]">
                          (ID: {item.id})
                        </span>
                      </div>
                    </div>

                    {/* CARD ACTION BUTTONS */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      
                      <button
                        type="button"
                        onClick={() => setQuickApproveConfirmListing(item)}
                        className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Approve</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => { setRejectingListing(item); setRejectionReason(''); }}
                        className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Reject</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onReviewListing(item.id)}
                        className="px-4 py-2 bg-[#1464F4] hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Review Listing</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                    </div>

                  </div>

                </div>
              );
            })
          )}

          {/* PAGINATION (PAGE 34) */}
          {filteredListings.length > 0 && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-500">
                Showing <span className="font-bold text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-bold text-slate-900">{Math.min(currentPage * itemsPerPage, filteredListings.length)}</span> of{' '}
                <span className="font-bold text-slate-900">{filteredListings.length}</span> pending items
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                      currentPage === idx + 1
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN (1 COL) - QUICK ACTIONS & GUIDELINES CARDS */}
        <div className="space-y-6">

          {/* QUICK ACTIONS CARD */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <CheckCheck className="w-5 h-5 text-[#1464F4]" />
              <h3 className="text-sm font-black text-slate-900">Quick Moderation Actions</h3>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                disabled={selectedListingIds.length === 0}
                onClick={() => setBulkApproveModalOpen(true)}
                className="w-full py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-200 rounded-xl text-xs font-bold transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Bulk Approve Selected</span>
                </div>
                <span className="text-[10px] font-black bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded">
                  {selectedListingIds.length}
                </span>
              </button>

              <button
                type="button"
                disabled={selectedListingIds.length === 0}
                onClick={() => setBulkRejectModalOpen(true)}
                className="w-full py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-800 disabled:opacity-50 disabled:cursor-not-allowed border border-rose-200 rounded-xl text-xs font-bold transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Bulk Reject Selected</span>
                </div>
                <span className="text-[10px] font-black bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded">
                  {selectedListingIds.length}
                </span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Export Moderation Queue</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">CSV</span>
              </button>
            </div>
          </div>

          {/* MODERATION GUIDELINES CARD */}
          <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Info className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-black text-white">Review Guidelines</h3>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Ensure title, description, and price are in clear LKR formatting.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Check photos for watermarks or offensive imagery.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Verify that contact numbers match Sri Lanka dialing format (+94).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Rejections MUST state clear, actionable instructions for the owner.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

      {/* QUICK APPROVE CONFIRMATION MODAL */}
      {quickApproveConfirmListing && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">Approve Listing & Make Live?</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Are you sure you want to approve “<span className="font-bold text-slate-900">{quickApproveConfirmListing.title}</span>”? It will immediately go live on the public marketplace.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setQuickApproveConfirmListing(null)}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleQuickApprove(quickApproveConfirmListing)}
                className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SINGLE REJECT MODAL WITH MANDATORY REASON */}
      {rejectingListing && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <form onSubmit={handleSingleReject} className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Reject Listing</h3>
                  <p className="text-xs text-slate-500 font-medium">Mandatory rejection reason required for owner notification</p>
                </div>
              </div>
              <button type="button" onClick={() => setRejectingListing(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium">
              Target Listing: <span className="font-bold">{rejectingListing.title}</span> (ID: {rejectingListing.id})
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Rejection Reason / Guidance <span className="text-rose-600">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain clearly why this listing is being rejected (e.g. missing safety clearance certificate, unverified price, duplicate listing)..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectingListing(null)}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!rejectionReason.trim()}
                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Submit Rejection</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BULK APPROVE MODAL */}
      {bulkApproveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <CheckCheck className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">Bulk Approve {selectedListingIds.length} Listings?</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                All {selectedListingIds.length} selected listings will be approved and published immediately.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBulkApproveModalOpen(false)}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkApprove}
                className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Approve {selectedListingIds.length} Items
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK REJECT MODAL */}
      {bulkRejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <form onSubmit={handleBulkReject} className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Bulk Reject {selectedListingIds.length} Listings</h3>
                  <p className="text-xs text-slate-500 font-medium">Rejection reason will be sent to all selected owners</p>
                </div>
              </div>
              <button type="button" onClick={() => setBulkRejectModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Bulk Rejection Reason <span className="text-rose-600">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={bulkRejectionReason}
                onChange={(e) => setBulkRejectionReason(e.target.value)}
                placeholder="State rejection reason to apply to all selected listings..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBulkRejectModalOpen(false)}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!bulkRejectionReason.trim()}
                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Bulk Reject Items</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
