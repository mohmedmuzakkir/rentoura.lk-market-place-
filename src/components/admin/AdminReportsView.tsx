import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Calendar, 
  Building2, 
  Flag, 
  PieChart, 
  UserCheck, 
  FileText, 
  ExternalLink, 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  SlidersHorizontal,
  X,
  Sparkles,
  Info,
  CheckSquare
} from 'lucide-react';
import { ListingReport, ReportService, ReportStatus, ReportTargetModule } from '../../services/reportService';
import { StaffAccount } from '../../types/adminTypes';
import { AdminService } from '../../services/adminService';
import { ProfileService } from '../../services/profileService';

interface AdminReportsViewProps {
  staff: StaffAccount;
  onRefresh: () => void;
  onNavigateToTarget?: (targetType: string, targetId: string) => void;
}

export const AdminReportsView: React.FC<AdminReportsViewProps> = ({ 
  staff, 
  onRefresh,
  onNavigateToTarget
}) => {
  // Report state
  const [reports, setReports] = useState<ListingReport[]>(() => ReportService.getReports());
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusTab, setStatusTab] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [reasonFilter, setReasonFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'updated'>('newest');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Selected Report for Detail Workspace / Modal
  const [selectedReport, setSelectedReport] = useState<ListingReport | null>(null);
  
  // Resolution & Action Modals
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showDismissModal, setShowDismissModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showBulkResolveModal, setShowBulkResolveModal] = useState(false);
  
  // Form states inside detail workspace
  const [resolutionOutcome, setResolutionOutcome] = useState<string>('No Violation Found');
  const [resolutionInternalNote, setResolutionInternalNote] = useState<string>('');
  const [resolutionUserMessage, setResolutionUserMessage] = useState<string>('');
  const [dismissReason, setDismissReason] = useState<string>('');
  const [newInternalNote, setNewInternalNote] = useState<string>('');
  const [selectedAssignee, setSelectedAssignee] = useState<string>(staff.fullName);
  const [triggerLinkedTargetAction, setTriggerLinkedTargetAction] = useState<boolean>(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  // Notification feedback banner
  const [feedbackBanner, setFeedbackBanner] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Reload data
  const refreshData = () => {
    const updated = ReportService.getReports();
    setReports(updated);
    if (selectedReport) {
      const refreshedSelected = updated.find(r => r.id === selectedReport.id);
      if (refreshedSelected) setSelectedReport(refreshedSelected);
    }
    onRefresh();
  };

  const triggerBanner = (type: 'success' | 'error' | 'info', message: string) => {
    setFeedbackBanner({ type, message });
    setTimeout(() => setFeedbackBanner(null), 4000);
  };

  // KPI Calculations
  const metrics = useMemo(() => {
    const total = reports.length;
    const pending = reports.filter(r => r.status === 'submitted').length;
    const underReview = reports.filter(r => r.status === 'under_review').length;
    const resolved = reports.filter(r => r.status === 'resolved').length;
    const dismissed = reports.filter(r => r.status === 'dismissed').length;

    return { total, pending, underReview, resolved, dismissed };
  }, [reports]);

  // Top Reasons Stats
  const topReasons = useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach(r => {
      counts[r.reasonLabel] = (counts[r.reasonLabel] || 0) + 1;
    });
    const sorted = Object.entries(counts)
      .map(([label, count]) => ({ label, count, percentage: Math.round((count / (reports.length || 1)) * 100) }))
      .sort((a, b) => b.count - a.count);
    return sorted.slice(0, 5);
  }, [reports]);

  // Filtered Reports
  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      // Status Tab Filter
      if (statusTab === 'pending' && r.status !== 'submitted') return false;
      if (statusTab === 'in_progress' && r.status !== 'under_review') return false;
      if (statusTab === 'resolved' && r.status !== 'resolved') return false;
      if (statusTab === 'dismissed' && r.status !== 'dismissed') return false;

      // Category Filter
      if (categoryFilter !== 'all') {
        if (categoryFilter === 'rentals' && r.targetModule !== 'rentals') return false;
        if (categoryFilter === 'jobs' && r.targetModule !== 'jobs') return false;
        if (categoryFilter === 'services' && r.targetModule !== 'services') return false;
        if (categoryFilter === 'reviews' && r.targetType !== 'review') return false;
        if (categoryFilter === 'users' && r.targetType !== 'user') return false;
      }

      // Reason Filter
      if (reasonFilter !== 'all' && r.reasonCode !== reasonFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = r.id.toLowerCase().includes(q) || (r.targetId && r.targetId.toLowerCase().includes(q));
        const matchesTitle = r.targetTitle.toLowerCase().includes(q);
        const matchesReason = r.reasonLabel.toLowerCase().includes(q);
        const matchesReporter = (r.reporterName || '').toLowerCase().includes(q) || (r.reporterEmail || '').toLowerCase().includes(q);
        const matchesDesc = (r.description || '').toLowerCase().includes(q);

        if (!matchesId && !matchesTitle && !matchesReason && !matchesReporter && !matchesDesc) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'oldest') return a.timestamp - b.timestamp;
      if (sortBy === 'updated') return (b.updatedAt || b.timestamp) - (a.updatedAt || a.timestamp);
      return b.timestamp - a.timestamp; // default newest
    });
  }, [reports, statusTab, categoryFilter, reasonFilter, searchQuery, sortBy]);

  // Paginated Reports
  const totalPages = Math.ceil(filteredReports.length / rowsPerPage) || 1;
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredReports.slice(start, start + rowsPerPage);
  }, [filteredReports, currentPage, rowsPerPage]);

  // Action Handlers
  const handleMarkUnderReview = (report: ListingReport) => {
    const res = ReportService.updateReportStatus({
      reportId: report.id,
      status: 'under_review',
      statusNote: `Marked under active review by ${staff.displayName || staff.fullName}.`,
      assignedTo: staff.id,
      assignedToName: staff.displayName || staff.fullName,
      staff
    });

    if (res.success) {
      triggerBanner('success', `Report #${report.id} marked as Under Review.`);
      refreshData();
    } else {
      triggerBanner('error', res.error || 'Failed to update report status.');
    }
  };

  const handleConfirmResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    const res = ReportService.resolveReport({
      reportId: selectedReport.id,
      outcome: resolutionOutcome,
      internalNote: resolutionInternalNote,
      userFacingMessage: resolutionUserMessage,
      staff,
      linkedTargetAction: triggerLinkedTargetAction ? 'Target listing/review action executed' : undefined
    });

    if (res.success) {
      // If trigger linked action on listing (e.g., rejecting or suspending the listing)
      if (triggerLinkedTargetAction && selectedReport.targetType === 'listing') {
        AdminService.rejectListing(selectedReport.targetId, `Listing rejected following moderation report #${selectedReport.id} (${resolutionOutcome})`, staff);
      }

      triggerBanner('success', `Report #${selectedReport.id} successfully resolved with outcome: "${resolutionOutcome}".`);
      setShowResolveModal(false);
      setResolutionInternalNote('');
      setResolutionUserMessage('');
      setTriggerLinkedTargetAction(false);
      refreshData();
    } else {
      triggerBanner('error', res.error || 'Failed to resolve report.');
    }
  };

  const handleConfirmDismiss = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    const res = ReportService.dismissReport({
      reportId: selectedReport.id,
      reasonNote: dismissReason,
      staff
    });

    if (res.success) {
      triggerBanner('info', `Report #${selectedReport.id} dismissed.`);
      setShowDismissModal(false);
      setDismissReason('');
      refreshData();
    } else {
      triggerBanner('error', res.error || 'Failed to dismiss report.');
    }
  };

  const handleConfirmAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    const res = ReportService.assignReport(selectedReport.id, staff, selectedAssignee);
    if (res.success) {
      triggerBanner('success', `Report #${selectedReport.id} assigned to ${selectedAssignee}.`);
      setShowAssignModal(false);
      refreshData();
    } else {
      triggerBanner('error', res.error || 'Assignment failed.');
    }
  };

  const handleAddInternalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport || !newInternalNote.trim()) return;

    const res = ReportService.addInternalNote(selectedReport.id, newInternalNote, staff);
    if (res.success) {
      triggerBanner('success', 'Internal note added.');
      setNewInternalNote('');
      refreshData();
    } else {
      triggerBanner('error', res.error || 'Failed to add note.');
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    try {
      const headers = ['Report ID', 'Target Title', 'Target Type', 'Module', 'Reason', 'Reporter Name', 'Reporter Email', 'Submitted Date', 'Status', 'Assigned To'];
      const rows = filteredReports.map(r => [
        `"${r.id}"`,
        `"${r.targetTitle.replace(/"/g, '""')}"`,
        `"${r.targetType}"`,
        `"${r.targetModule}"`,
        `"${r.reasonLabel}"`,
        `"${r.reporterName || 'Anonymous'}"`,
        `"${r.reporterEmail || ''}"`,
        `"${r.createdAt}"`,
        `"${r.status}"`,
        `"${r.assignedToName || 'Unassigned'}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `rentoura_reports_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      triggerBanner('success', 'Reports exported to CSV successfully.');
    } catch (e) {
      triggerBanner('error', 'Failed to export reports CSV.');
    }
  };

  // Activity Log
  const activities = useMemo(() => ReportService.getReportActivities(), [reports]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-12">
      
      {/* Feedback Notification Banner */}
      {feedbackBanner && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-md transition-all ${
          feedbackBanner.type === 'success' ? 'bg-emerald-500 text-white' :
          feedbackBanner.type === 'error' ? 'bg-rose-600 text-white' : 'bg-[#1464F4] text-white'
        }`}>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span>{feedbackBanner.message}</span>
          </div>
          <button type="button" onClick={() => setFeedbackBanner(null)} className="opacity-80 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-[#1464F4]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Reports Management</span>
            </h1>
            <p className="text-slate-500 text-xs mt-1 font-medium">
              Review marketplace reports, investigate concerns and record moderation outcomes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs shadow-xs flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Reports</span>
          </button>
        </div>
      </div>

      {/* 5 SUMMARY KPI METRICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Card 1: Total Reports */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Total Reports</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Flag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">{metrics.total}</div>
            <div className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
              <span>↑ 18.7% this month</span>
            </div>
          </div>
        </div>

        {/* Card 2: Pending Review */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Pending Review</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-600 tracking-tight">{metrics.pending}</div>
            <div className="text-[11px] font-semibold text-amber-700 mt-1">
              Needs attention
            </div>
          </div>
        </div>

        {/* Card 3: Under Investigation */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Under Investigation</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1464F4] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#1464F4] tracking-tight">{metrics.underReview}</div>
            <div className="text-[11px] font-semibold text-blue-600 mt-1">
              In progress
            </div>
          </div>
        </div>

        {/* Card 4: Resolved */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Resolved</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600 tracking-tight">{metrics.resolved}</div>
            <div className="text-[11px] font-semibold text-emerald-600 mt-1">
              ↑ 22.3% this month
            </div>
          </div>
        </div>

        {/* Card 5: Dismissed / Rejected */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Rejected Reports</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-700 tracking-tight">{metrics.dismissed}</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-1">
              Not valid
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR BAR */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search by ID, listing title, reporter or reason..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1464F4] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Selectors */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#1464F4]"
            >
              <option value="all">All Categories</option>
              <option value="rentals">Rentals</option>
              <option value="jobs">Jobs</option>
              <option value="services">Services</option>
              <option value="reviews">Reviews</option>
              <option value="users">Users</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#1464F4]"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="updated">Sort: Recently Updated</option>
            </select>

            {/* Filters Toggle Button */}
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-3.5 py-2.5 rounded-2xl border font-bold text-xs flex items-center gap-2 transition-all ${
                showAdvancedFilters ? 'bg-[#1464F4] text-white border-[#1464F4]' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Extended Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-150">
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">Report Reason Taxonomy</label>
              <select
                value={reasonFilter}
                onChange={(e) => { setReasonFilter(e.target.value); setCurrentPage(1); }}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
              >
                <option value="all">All Violation Reasons</option>
                <option value="inappropriate_content">Inappropriate Content</option>
                <option value="spam_fake_ad">Spam / Fake Ad</option>
                <option value="misleading_information">Misleading Information</option>
                <option value="suspicious_activity">Suspicious Activity</option>
                <option value="false_review">False / Misleading Review</option>
                <option value="other">Other Policy Violation</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">Time Horizon</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setCategoryFilter('all');
                  setReasonFilter('all');
                  setDateFilter('all');
                  setSearchQuery('');
                  setStatusTab('all');
                  setCurrentPage(1);
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}

        {/* TOP STATUS NAVIGATION TABS */}
        <div className="flex items-center gap-1 overflow-x-auto pt-1 pb-1 custom-scrollbar border-t border-slate-100">
          {[
            { id: 'all', label: 'All Reports', count: metrics.total },
            { id: 'pending', label: 'Pending', count: metrics.pending, color: 'text-amber-600 bg-amber-50' },
            { id: 'in_progress', label: 'In Progress', count: metrics.underReview, color: 'text-blue-600 bg-blue-50' },
            { id: 'resolved', label: 'Resolved', count: metrics.resolved, color: 'text-emerald-600 bg-emerald-50' },
            { id: 'dismissed', label: 'Rejected', count: metrics.dismissed, color: 'text-slate-600 bg-slate-100' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => { setStatusTab(tab.id); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-2xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
                statusTab === tab.id
                  ? 'bg-[#1464F4] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                statusTab === tab.id ? 'bg-white/20 text-white' : tab.color || 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2-COLUMN MAIN WORKSPACE (LEFT TABLE / RIGHT PANELS) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* LEFT MAIN TABLE CONTAINER (3 COLS) */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between min-h-[550px]">
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/90 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200 text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Report Details</th>
                    <th className="py-3.5 px-4">Type & Reason</th>
                    <th className="py-3.5 px-4">Reported By</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {paginatedReports.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16 text-slate-400">
                        <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center mx-auto mb-3">
                          <Flag className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-slate-700">No reports match criteria</p>
                        <p className="text-xs text-slate-400 mt-1">Try adjusting search filters or selecting another tab.</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedReports.map(rep => {
                      // Badge color helper
                      const moduleColor = 
                        rep.targetModule === 'rentals' ? 'bg-blue-50 text-[#1464F4] border-blue-200' :
                        rep.targetModule === 'jobs' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        rep.targetModule === 'services' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-purple-50 text-purple-700 border-purple-200';

                      const reasonBadgeColor =
                        rep.reasonCode === 'inappropriate_content' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        rep.reasonCode === 'spam_fake_ad' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        rep.reasonCode === 'misleading_information' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        rep.reasonCode === 'suspicious_activity' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                        'bg-slate-100 text-slate-800 border-slate-200';

                      return (
                        <tr key={rep.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* Report Details Column */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              {rep.targetImageUrl ? (
                                <img
                                  src={rep.targetImageUrl}
                                  alt=""
                                  className="w-11 h-11 rounded-xl object-cover shrink-0 border border-slate-200 shadow-2xs"
                                />
                              ) : (
                                <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 text-slate-400 font-bold">
                                  {rep.targetModule[0].toUpperCase()}
                                </div>
                              )}
                              <div className="min-w-0 max-w-[210px]">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <span className={`px-1.5 py-0.2 rounded-md font-extrabold text-[9px] uppercase border ${moduleColor}`}>
                                    {rep.targetModule === 'rentals' ? 'RENTAL' : rep.targetModule === 'jobs' ? 'JOB' : rep.targetModule === 'services' ? 'SERVICE' : rep.targetType.toUpperCase()}
                                  </span>
                                </div>
                                <h4 className="font-bold text-slate-900 text-xs truncate leading-tight" title={rep.targetTitle}>
                                  {rep.targetTitle}
                                </h4>
                                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                                  {rep.targetLocation || 'Sri Lanka'} • <span className="font-semibold text-slate-600">ID: {rep.id}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Type & Reason Column */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-1 max-w-[180px]">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg font-bold text-[10px] border ${reasonBadgeColor}`}>
                                <AlertTriangle className="w-3 h-3 shrink-0" />
                                <span className="truncate">{rep.reasonLabel}</span>
                              </span>
                              <p className="text-[10px] text-slate-500 line-clamp-1 italic">
                                "{rep.description || rep.details || 'No detail'}"
                              </p>
                            </div>
                          </td>

                          {/* Reported By Column */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              {rep.reporterAvatar ? (
                                <img src={rep.reporterAvatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200" />
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-[10px]">
                                  {rep.reporterName ? rep.reporterName[0] : 'U'}
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 text-xs truncate">{rep.reporterName || 'User'}</div>
                                <div className="text-[10px] text-slate-400 truncate">ID: {rep.reporterId}</div>
                              </div>
                            </div>
                          </td>

                          {/* Date Column */}
                          <td className="py-3.5 px-4 text-slate-600">
                            <div className="font-semibold text-xs">{rep.createdAt}</div>
                            <div className="text-[10px] text-slate-400">
                              {Math.round((Date.now() - rep.timestamp) / (1000 * 3600)) < 24 
                                ? `${Math.max(1, Math.round((Date.now() - rep.timestamp) / (1000 * 3600)))} hours ago`
                                : `${Math.round((Date.now() - rep.timestamp) / (1000 * 3600 * 24))} days ago`}
                            </div>
                          </td>

                          {/* Status Badge Column */}
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-extrabold text-[10px] uppercase tracking-wide ${
                              rep.status === 'submitted' ? 'bg-amber-100/80 text-amber-800 border border-amber-200/60' :
                              rep.status === 'under_review' ? 'bg-blue-100/80 text-[#1464F4] border border-blue-200/60' :
                              rep.status === 'resolved' ? 'bg-emerald-100/80 text-emerald-800 border border-emerald-200/60' :
                              'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                rep.status === 'submitted' ? 'bg-amber-500 animate-pulse' :
                                rep.status === 'under_review' ? 'bg-[#1464F4] animate-pulse' :
                                rep.status === 'resolved' ? 'bg-emerald-500' : 'bg-slate-400'
                              }`} />
                              <span>{rep.status === 'submitted' ? 'Pending' : rep.status === 'under_review' ? 'Under Review' : rep.status}</span>
                            </span>
                          </td>

                          {/* Actions Column */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedReport(rep)}
                                title="View Report Workspace"
                                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-[#1464F4] hover:text-white text-slate-600 flex items-center justify-center transition-all"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {rep.status === 'submitted' && (
                                <button
                                  type="button"
                                  onClick={() => handleMarkUnderReview(rep)}
                                  title="Mark Under Review"
                                  className="px-2.5 py-1 rounded-xl bg-blue-50 text-[#1464F4] hover:bg-[#1464F4] hover:text-white font-bold text-[10px] transition-all"
                                >
                                  Investigate
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* PAGINATION FOOTER */}
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/50">
            <div>
              Showing <span className="font-bold text-slate-900">{paginatedReports.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}</span> to{' '}
              <span className="font-bold text-slate-900">{Math.min(currentPage * rowsPerPage, filteredReports.length)}</span> of{' '}
              <span className="font-bold text-slate-900">{filteredReports.length}</span> reports
            </div>

            <div className="flex items-center gap-2">
              <select
                value={rowsPerPage}
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="px-2 py-1 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
              </select>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center disabled:opacity-40 hover:bg-slate-100 font-bold"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 font-bold text-slate-900">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center disabled:opacity-40 hover:bg-slate-100 font-bold"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR ANALYTICS & QUICK ACTIONS (1 COL) */}
        <div className="space-y-4">
          
          {/* Reports Overview Analytics Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#1464F4]" />
                <span>Reports Overview</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-semibold">This Month</span>
            </div>

            {/* Visual Progress Bar / Donut Ratio */}
            <div className="space-y-2">
              <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                <div style={{ width: `${Math.round((metrics.pending / (metrics.total || 1)) * 100)}%` }} className="bg-amber-400 h-full" title="Pending" />
                <div style={{ width: `${Math.round((metrics.underReview / (metrics.total || 1)) * 100)}%` }} className="bg-[#1464F4] h-full" title="In Progress" />
                <div style={{ width: `${Math.round((metrics.resolved / (metrics.total || 1)) * 100)}%` }} className="bg-emerald-500 h-full" title="Resolved" />
                <div style={{ width: `${Math.round((metrics.dismissed / (metrics.total || 1)) * 100)}%` }} className="bg-slate-400 h-full" title="Rejected" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                  <span className="text-slate-600">Pending ({metrics.pending})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1464F4] shrink-0" />
                  <span className="text-slate-600">In Progress ({metrics.underReview})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-slate-600">Resolved ({metrics.resolved})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
                  <span className="text-slate-600">Rejected ({metrics.dismissed})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Report Reasons Bar Chart */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Top Report Reasons</span>
            </h3>

            <div className="space-y-2.5">
              {topReasons.map(r => (
                <div key={r.label} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-700">
                    <span className="truncate pr-2">{r.label}</span>
                    <span className="text-slate-500 shrink-0">{r.count} ({r.percentage}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div style={{ width: `${r.percentage}%` }} className="h-full bg-[#1464F4] rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Report Source Breakdown */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Report Source</span>
            </h3>

            <div className="space-y-2 text-xs font-semibold">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                <span className="text-slate-700">Platform Users</span>
                <span className="font-bold text-[#1464F4]">87.2%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                <span className="text-slate-700">Automated System Flags</span>
                <span className="font-bold text-amber-600">9.5%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                <span className="text-slate-700">Staff & Moderators</span>
                <span className="font-bold text-emerald-600">3.3%</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-3">
              Quick Actions
            </h3>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowBulkResolveModal(true)}
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-2xl text-left flex items-center gap-2.5 transition-all border border-slate-200/60"
              >
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <span>Bulk Resolve Reports</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-2xl text-left flex items-center gap-2.5 transition-all border border-slate-200/60"
              >
                <Download className="w-4 h-4 text-[#1464F4]" />
                <span>Export All Reports (CSV)</span>
              </button>
            </div>
          </div>

          {/* Important Safety Notes */}
          <div className="p-4 rounded-3xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 space-y-2">
            <div className="font-black text-amber-900 flex items-center gap-1.5 text-xs">
              <Info className="w-4 h-4 text-amber-600" />
              <span>Moderation Guidelines</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
              All user reports must be evaluated against RENTOURA Community Guidelines. Reporter identities remain strictly private.
            </p>
          </div>

        </div>
      </div>

      {/* BOTTOM RECENT REPORT ACTIVITIES TIMELINE PANEL */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#1464F4]" />
            <span>Recent Report Activities</span>
          </h3>
          <span className="text-xs font-bold text-slate-400">Live Staff Audit Trail</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {activities.map(act => (
            <div key={act.id} className="p-3.5 bg-slate-50/80 border border-slate-200/70 rounded-2xl flex items-start gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                act.iconType === 'success' ? 'bg-emerald-100 text-emerald-700' :
                act.iconType === 'danger' ? 'bg-rose-100 text-rose-700' :
                act.iconType === 'assigned' ? 'bg-purple-100 text-purple-700' :
                'bg-blue-100 text-[#1464F4]'
              }`}>
                {act.iconType === 'success' ? <CheckCircle2 className="w-4 h-4" /> :
                 act.iconType === 'danger' ? <XCircle className="w-4 h-4" /> :
                 <Clock className="w-4 h-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 line-clamp-1">{act.title}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 flex items-center justify-between">
                  <span>By {act.actorName}</span>
                  <span>{act.timeAgo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REPORT DETAIL WORKSPACE DRAWER / MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-[#1464F4] flex items-center justify-center font-bold">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                      Report #{selectedReport.id}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                      selectedReport.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                      selectedReport.status === 'dismissed' ? 'bg-slate-200 text-slate-700' :
                      selectedReport.status === 'under_review' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {selectedReport.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Submitted on {selectedReport.createdAt} • Target Type: <span className="font-bold capitalize">{selectedReport.targetType}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="w-9 h-9 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - 2 Columns */}
            <div className="p-6 overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
              
              {/* LEFT 2 COLS: TARGET SUMMARY, DESCRIPTION, HISTORY */}
              <div className="md:col-span-2 space-y-5">
                
                {/* Target Item Summary Card */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span>Reported Target Summary</span>
                    <span className="text-[#1464F4] font-extrabold capitalize">{selectedReport.targetModule}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    {selectedReport.targetImageUrl ? (
                      <img src={selectedReport.targetImageUrl} alt="" className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-200 text-slate-500 font-black text-xl flex items-center justify-center shrink-0">
                        {selectedReport.targetModule[0].toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-900 text-sm">{selectedReport.targetTitle}</h4>
                      <div className="text-xs text-slate-500 mt-1">
                        Location: {selectedReport.targetLocation || 'Not specified'} • Price: {selectedReport.targetPrice || 'N/A'}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Target ID: <span className="font-mono text-slate-700 font-semibold">{selectedReport.targetId}</span>
                      </div>
                    </div>
                  </div>

                  {/* Open Target Button */}
                  <div className="pt-2 border-t border-slate-200/80 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (onNavigateToTarget) {
                          onNavigateToTarget(selectedReport.targetType, selectedReport.targetId);
                        } else {
                          triggerBanner('info', `Opening target: ${selectedReport.targetTitle}`);
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[#1464F4] hover:bg-blue-50 font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Target in Admin Moderation</span>
                    </button>
                  </div>
                </div>

                {/* Reporter Submitted Description */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5 text-rose-700">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Report Reason: {selectedReport.reasonLabel}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Source: {selectedReport.source || 'listing_detail'}</span>
                  </div>

                  <p className="text-xs text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200/80 leading-relaxed font-medium">
                    {selectedReport.description || selectedReport.details || 'No additional text details provided.'}
                  </p>
                </div>

                {/* Reporter Info (Privacy Protected) */}
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2 text-xs">
                  <div className="font-bold text-[#041C43] flex items-center justify-between">
                    <span>Reporter Details</span>
                    <span className="text-[10px] text-blue-700 font-normal">Protected Privacy Mode</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <span className="text-slate-400">Name:</span> <strong className="text-slate-900">{selectedReport.reporterName || 'Registered User'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Email:</span> <strong className="text-slate-900">{selectedReport.reporterEmail || 'N/A'}</strong>
                    </div>
                  </div>
                </div>

                {/* Audit History Timeline */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">Report Activity Timeline</h4>
                  <div className="space-y-2 border-l-2 border-slate-200 pl-4 ml-1">
                    {(selectedReport.history || []).map((h, i) => (
                      <div key={h.id || i} className="text-xs space-y-0.5 relative">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#1464F4] absolute -left-[21px] top-1" />
                        <div className="font-bold text-slate-900">{h.actorName} ({h.actorRole})</div>
                        <div className="text-slate-600">{h.details}</div>
                        <div className="text-[10px] text-slate-400">{h.createdAt}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* RIGHT 1 COL: MODERATION CONTROLS, INTERNAL NOTES, ACTIONS */}
              <div className="space-y-5 border-t md:border-t-0 md:border-l border-slate-200 pt-5 md:pt-0 md:pl-5">
                
                {/* Assignee & Quick Actions */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Assigned Staff
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">
                      {selectedReport.assignedToName || 'Unassigned'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAssignModal(true)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl"
                    >
                      Reassign
                    </button>
                  </div>
                </div>

                {/* Internal Staff Notes Feed */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span>Internal Staff Notes</span>
                    <span className="text-[10px] text-amber-700">Staff Only</span>
                  </div>

                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                    {(!selectedReport.internalNotes || selectedReport.internalNotes.length === 0) ? (
                      <div className="p-3 text-[11px] text-slate-400 italic bg-slate-50 rounded-xl">
                        No internal staff notes yet.
                      </div>
                    ) : (
                      selectedReport.internalNotes.map(n => (
                        <div key={n.id} className="p-2.5 bg-amber-50/60 border border-amber-200/60 rounded-xl text-xs space-y-1">
                          <div className="flex justify-between font-bold text-amber-900 text-[11px]">
                            <span>{n.authorName}</span>
                            <span className="text-[10px] text-amber-700">{n.createdAt}</span>
                          </div>
                          <p className="text-slate-800 text-[11px] leading-tight">{n.note}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Note Form */}
                  <form onSubmit={handleAddInternalNote} className="space-y-2 pt-1">
                    <textarea
                      rows={2}
                      value={newInternalNote}
                      onChange={(e) => setNewInternalNote(e.target.value)}
                      placeholder="Add private staff note..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#1464F4]"
                    />
                    <button
                      type="submit"
                      disabled={!newInternalNote.trim()}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl disabled:opacity-40 transition-all"
                    >
                      Post Internal Note
                    </button>
                  </form>
                </div>

                {/* Primary Moderation Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Moderation Actions
                  </div>

                  {selectedReport.status === 'submitted' && (
                    <button
                      type="button"
                      onClick={() => handleMarkUnderReview(selectedReport)}
                      className="w-full py-2.5 rounded-xl bg-blue-50 text-[#1464F4] hover:bg-[#1464F4] hover:text-white font-bold text-xs transition-all border border-blue-200"
                    >
                      Mark Under Review
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowResolveModal(true)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Resolve Report</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowDismissModal(true)}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Dismiss Report</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* RESOLUTION MODAL */}
      {showResolveModal && selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Resolve Report #{selectedReport.id}</span>
              </h3>
              <button type="button" onClick={() => setShowResolveModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmResolve} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Resolution Outcome</label>
                <select
                  value={resolutionOutcome}
                  onChange={(e) => setResolutionOutcome(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="No Violation Found">No Violation Found</option>
                  <option value="Content Removed">Content Removed</option>
                  <option value="Listing Rejected">Listing Rejected</option>
                  <option value="Listing Suspended/Hidden">Listing Suspended / Hidden</option>
                  <option value="Review Removed">Review Removed</option>
                  <option value="User Restricted">User Restricted</option>
                  <option value="User Suspended">User Suspended</option>
                  <option value="Warning Issued">Warning Issued to Owner</option>
                  <option value="Other">Other Outcome</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Internal Resolution Note (Staff Only)</label>
                <textarea
                  rows={2}
                  value={resolutionInternalNote}
                  onChange={(e) => setResolutionInternalNote(e.target.value)}
                  placeholder="Private rationale for staff audit trail..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">User-Facing Resolution Message (Sent to Reporter)</label>
                <textarea
                  rows={2}
                  value={resolutionUserMessage}
                  onChange={(e) => setResolutionUserMessage(e.target.value)}
                  placeholder="Optional polite update for reporter..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              {selectedReport.targetType === 'listing' && (
                <label className="flex items-center gap-2 p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={triggerLinkedTargetAction}
                    onChange={(e) => setTriggerLinkedTargetAction(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span className="font-bold">Also automatically reject target listing in Page 35 Listing Queue</span>
                </label>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowResolveModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                >
                  Confirm Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISMISS MODAL */}
      {showDismissModal && selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-600" />
                <span>Dismiss Report #{selectedReport.id}</span>
              </h3>
              <button type="button" onClick={() => setShowDismissModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmDismiss} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Dismissal</label>
                <textarea
                  rows={3}
                  required
                  value={dismissReason}
                  onChange={(e) => setDismissReason(e.target.value)}
                  placeholder="Explain why no moderation action is required..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDismissModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-md"
                >
                  Confirm Dismissal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN MODAL */}
      {showAssignModal && selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-sm font-black text-slate-900">Assign Report #{selectedReport.id}</h3>
            <form onSubmit={handleConfirmAssign} className="space-y-3">
              <select
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Nimal Perera">Nimal Perera (Moderator)</option>
                <option value="Hasini K.">Hasini K. (Moderator)</option>
                <option value="Dilini Fernando">Dilini Fernando (Moderator)</option>
                <option value="Tharindu Jayasekara">Tharindu Jayasekara (Moderator)</option>
              </select>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAssignModal(false)} className="px-3.5 py-2 rounded-xl bg-slate-100 text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-[#1464F4] text-white text-xs font-bold">
                  Assign Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BULK RESOLVE MODAL */}
      {showBulkResolveModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-600" />
              <span>Bulk Resolve Pending Reports</span>
            </h3>
            <p className="text-xs text-slate-500">
              There are currently <strong>{metrics.pending}</strong> pending reports awaiting review. Would you like to mark all pending reports as under review or resolved with standard no-violation outcome?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowBulkResolveModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  reports.filter(r => r.status === 'submitted').forEach(r => {
                    ReportService.updateReportStatus({
                      reportId: r.id,
                      status: 'under_review',
                      statusNote: 'Batch assigned for review',
                      staff
                    });
                  });
                  triggerBanner('success', 'All pending reports moved to Under Review.');
                  setShowBulkResolveModal(false);
                  refreshData();
                }}
                className="px-4 py-2 rounded-xl bg-[#1464F4] text-white text-xs font-bold"
              >
                Mark Pending as Under Review
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
