import React, { useState, useMemo, useCallback } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  AlertTriangle, 
  ShieldCheck, 
  MoreVertical, 
  UserCheck, 
  UserX, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Eye, 
  X,
  Download,
  RefreshCw,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  ShieldAlert,
  FileText,
  ExternalLink,
  Ban,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { RegisteredUser, StaffAccount, UserAccountStatus } from '../../types/adminTypes';
import { AdminService } from '../../services/adminService';
import { ProfileService } from '../../services/profileService';
import { supabase } from '../../lib/supabase';

interface AdminUsersViewProps {
  staff: StaffAccount;
  onRefresh: () => void;
  onNavigateToListings?: (userId: string) => void;
}

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({ staff, onRefresh, onNavigateToListings }) => {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountTypeFilter, setAccountTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  
  // Selected user for detailed drawer / modal
  const [selectedUser, setSelectedUser] = useState<RegisteredUser | null>(null);
  
  // Modals
  const [suspendModalUser, setSuspendModalUser] = useState<RegisteredUser | null>(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendDuration, setSuspendDuration] = useState('Indefinite');
  const [suspendError, setSuspendError] = useState('');

  const [restoreModalUser, setRestoreModalUser] = useState<RegisteredUser | null>(null);
  
  const [banModalUser, setBanModalUser] = useState<RegisteredUser | null>(null);
  const [banReason, setBanReason] = useState('');
  const [banError, setBanError] = useState('');

  // Dropdown menu state
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const loadSupabaseProfiles = useCallback(async () => {
    if (!staff || !['SUPER_ADMIN', 'ADMIN', 'MODERATOR'].includes(staff.role)) return;
    setIsLoading(true);
    setFetchError(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setFetchError(error.message || 'Failed to load user profiles from database.');
        setUsers([]);
      } else if (data) {
        const mappedUsers: RegisteredUser[] = data.map((p: any) => {
          const createdAtDate = p.created_at ? new Date(p.created_at) : new Date();
          return {
            id: p.id,
            fullName: p.full_name || p.display_name || 'Rentoura User',
            email: p.email || 'N/A',
            phone: p.phone_normalized || 'N/A',
            avatarUrl: p.profile_photo_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
            accountType: 'Individual',
            status: p.account_status === 'active' ? 'Active' : p.account_status === 'suspended' ? 'Suspended' : p.account_status === 'banned' ? 'Banned' : 'Active',
            isVerified: true,
            emailVerified: true,
            phoneVerified: !!p.phone_normalized,
            idVerified: false,
            city: p.city_id || 'N/A',
            district: p.district_id || 'N/A',
            listingsCount: 0,
            createdAt: createdAtDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
            lastActive: 'Recently'
          };
        });

        setUsers(mappedUsers);
      }
    } catch (err: any) {
      setFetchError(err?.message || 'An unexpected error occurred while fetching user profiles.');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [staff]);

  // Fetch live profiles on mount or when staff changes
  React.useEffect(() => {
    loadSupabaseProfiles();
  }, [loadSupabaseProfiles]);

  const refreshUsers = () => {
    loadSupabaseProfiles();
    onRefresh();
  };

  // KPI Math
  const kpiTotal = users.length;
  const kpiVerified = users.filter(u => u.isVerified).length;
  const kpiActive = users.filter(u => u.status === 'Active').length;
  const kpiSuspendedBanned = users.filter(u => u.status === 'Suspended' || u.status === 'Banned').length;
  const kpiPending = users.filter(u => u.status === 'Pending Verification').length;

  // District options
  const districts = useMemo(() => {
    const set = new Set<string>();
    users.forEach(u => {
      if (u.district) set.add(u.district);
    });
    return Array.from(set).sort();
  }, [users]);

  // Filter Users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        user.fullName.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.phone.toLowerCase().includes(q) ||
        user.id.toLowerCase().includes(q) ||
        user.city.toLowerCase().includes(q) ||
        user.district.toLowerCase().includes(q);

      const matchesType = accountTypeFilter === 'all' || user.accountType === accountTypeFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesDistrict = districtFilter === 'all' || user.district === districtFilter;

      let matchesVerification = true;
      if (verificationFilter === 'verified') matchesVerification = user.isVerified;
      else if (verificationFilter === 'unverified') matchesVerification = !user.isVerified;
      else if (verificationFilter === 'email') matchesVerification = !!user.emailVerified;
      else if (verificationFilter === 'phone') matchesVerification = !!user.phoneVerified;
      else if (verificationFilter === 'id') matchesVerification = !!user.idVerified;

      return matchesSearch && matchesType && matchesStatus && matchesDistrict && matchesVerification;
    });
  }, [users, searchQuery, accountTypeFilter, statusFilter, districtFilter, verificationFilter]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / rowsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedUsers = useMemo(() => {
    const start = (validCurrentPage - 1) * rowsPerPage;
    return filteredUsers.slice(start, start + rowsPerPage);
  }, [filteredUsers, validCurrentPage, rowsPerPage]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setAccountTypeFilter('all');
    setStatusFilter('all');
    setVerificationFilter('all');
    setDistrictFilter('all');
    setCurrentPage(1);
  };

  const handleToggleVerification = (userId: string, currentVerified: boolean) => {
    AdminService.toggleUserVerification(userId, !currentVerified, staff);
    refreshUsers();
  };

  const handleOpenSuspendModal = (user: RegisteredUser) => {
    setSuspendModalUser(user);
    setSuspendReason('');
    setSuspendDuration('Indefinite');
    setSuspendError('');
    setOpenDropdownId(null);
  };

  const handleConfirmSuspend = () => {
    if (!suspendModalUser) return;
    if (!suspendReason.trim()) {
      setSuspendError('Please provide a mandatory reason for suspending this user account.');
      return;
    }

    const fullReason = `${suspendReason.trim()} [Duration: ${suspendDuration}]`;
    const res = AdminService.suspendUser(suspendModalUser.id, fullReason, staff);
    if (!res.success) {
      setSuspendError(res.error || 'Failed to suspend user.');
      return;
    }

    setSuspendModalUser(null);
    refreshUsers();
  };

  const handleOpenRestoreModal = (user: RegisteredUser) => {
    setRestoreModalUser(user);
    setOpenDropdownId(null);
  };

  const handleConfirmRestore = () => {
    if (!restoreModalUser) return;
    const res = AdminService.restoreUser(restoreModalUser.id, staff);
    if (res.success) {
      setRestoreModalUser(null);
      refreshUsers();
    }
  };

  const handleOpenBanModal = (user: RegisteredUser) => {
    setBanModalUser(user);
    setBanReason('');
    setBanError('');
    setOpenDropdownId(null);
  };

  const handleConfirmBan = () => {
    if (!banModalUser) return;
    if (!banReason.trim()) {
      setBanError('Please provide a mandatory reason for banning this account.');
      return;
    }

    const res = AdminService.banUser(banModalUser.id, banReason.trim(), staff);
    if (!res.success) {
      setBanError(res.error || 'Failed to ban user.');
      return;
    }

    setBanModalUser(null);
    refreshUsers();
  };

  // Get user listing details for modal
  const userListings = useMemo(() => {
    if (!selectedUser) return [];
    const all = ProfileService.getUserListings();
    return all.filter(l => 
      (l.ownerId && l.ownerId === selectedUser.id) ||
      (l.providerName && l.providerName.toLowerCase().includes(selectedUser.fullName.toLowerCase())) ||
      (l.companyName && l.companyName.toLowerCase().includes(selectedUser.fullName.toLowerCase())) ||
      l.id.includes(selectedUser.id)
    );
  }, [selectedUser]);

  // Audit history for selected user
  const userAuditLogs = useMemo(() => {
    if (!selectedUser) return [];
    const logs = AdminService.getAuditLogs();
    return logs.filter(l => l.targetId === selectedUser.id || l.details.toLowerCase().includes(selectedUser.email.toLowerCase()));
  }, [selectedUser]);

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Page Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-[#1464F4]/10 rounded-2xl text-[#1464F4]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Users Management</h1>
              <p className="text-slate-500 text-xs mt-0.5 font-medium">
                Manage RENTOURA.LK marketplace users, verify identity badges, and control account access.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => AdminService.exportUsersCsv()}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Users CSV</span>
          </button>

          <button
            type="button"
            onClick={refreshUsers}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
            title="Refresh Users Directory"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Total Users */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Users</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{kpiTotal}</div>
          <div className="text-[10px] text-slate-500 mt-1 font-medium flex items-center gap-1">
            <span className="text-emerald-600 font-bold">100%</span> registered marketplace
          </div>
        </div>

        {/* Verified Users */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Verified Users</div>
          <div className="text-2xl font-black text-sky-600 mt-1">{kpiVerified}</div>
          <div className="text-[10px] text-slate-500 mt-1 font-medium">
            {kpiTotal > 0 ? Math.round((kpiVerified / kpiTotal) * 100) : 0}% verification rate
          </div>
        </div>

        {/* Active Accounts */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Accounts</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{kpiActive}</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">
            Normal operational state
          </div>
        </div>

        {/* Pending Verification */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Review</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{kpiPending}</div>
          <div className="text-[10px] text-amber-600 font-bold mt-1">
            Awaiting identity badge
          </div>
        </div>

        {/* Suspended & Banned */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm col-span-2 lg:col-span-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Suspended / Banned</div>
          <div className="text-2xl font-black text-rose-600 mt-1">{kpiSuspendedBanned}</div>
          <div className="text-[10px] text-rose-600 font-bold mt-1">
            Access restricted
          </div>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search user name, email, phone, ID, city..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ×
              </button>
            )}
          </div>

          {/* Filters dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto text-xs font-semibold">
            {/* Account Type Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[11px] font-bold">Type:</span>
              <select
                value={accountTypeFilter}
                onChange={(e) => { setAccountTypeFilter(e.target.value); setCurrentPage(1); }}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold text-xs"
              >
                <option value="all">All Types</option>
                <option value="Individual">Individual</option>
                <option value="Business">Business</option>
                <option value="Dealer">Dealer</option>
                <option value="Agent">Agent</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[11px] font-bold">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold text-xs"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending Verification">Pending Verification</option>
                <option value="Suspended">Suspended</option>
                <option value="Banned">Banned</option>
              </select>
            </div>

            {/* Verification Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[11px] font-bold">Verification:</span>
              <select
                value={verificationFilter}
                onChange={(e) => { setVerificationFilter(e.target.value); setCurrentPage(1); }}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold text-xs"
              >
                <option value="all">All Verification</option>
                <option value="verified">Verified Badge</option>
                <option value="unverified">Unverified</option>
                <option value="email">Email Verified</option>
                <option value="phone">Phone Verified</option>
                <option value="id">ID Verified</option>
              </select>
            </div>

            {/* District Filter */}
            {districts.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[11px] font-bold">District:</span>
                <select
                  value={districtFilter}
                  onChange={(e) => { setDistrictFilter(e.target.value); setCurrentPage(1); }}
                  className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold text-xs"
                >
                  <option value="all">All Districts</option>
                  {districts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            )}

            {(searchQuery || accountTypeFilter !== 'all' || statusFilter !== 'all' || verificationFilter !== 'all' || districtFilter !== 'all') && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-3 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl font-bold text-xs transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Users Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 text-[10px]">
              <tr>
                <th className="py-3.5 px-4">User Info</th>
                <th className="py-3.5 px-4">Account Type</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Listings</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-8 h-8 border-3 border-[#1464F4] border-t-transparent rounded-full animate-spin"></div>
                      <div className="text-xs font-bold text-slate-600">Loading registered user profiles from Supabase...</div>
                    </div>
                  </td>
                </tr>
              ) : fetchError ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500">
                    <div className="max-w-md mx-auto text-center space-y-2 p-4 bg-rose-50 border border-rose-200 rounded-2xl">
                      <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
                      <div className="font-bold text-rose-900 text-sm">Failed to fetch users</div>
                      <p className="text-xs text-rose-600 font-medium">{fetchError}</p>
                      <button
                        type="button"
                        onClick={() => loadSupabaseProfiles()}
                        className="mt-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-sm transition-colors"
                      >
                        Retry Connection
                      </button>
                    </div>
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500">
                    <div className="max-w-xs mx-auto text-center space-y-2">
                      <Users className="w-8 h-8 text-slate-300 mx-auto" />
                      <div className="font-bold text-slate-800 text-sm">No marketplace users found</div>
                      <p className="text-xs text-slate-400">
                        Try adjusting your search terms or filter selection.
                      </p>
                      <button
                        type="button"
                        onClick={handleClearFilters}
                        className="mt-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* User Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatarUrl}
                          alt={user.fullName}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200 shrink-0"
                        />
                        <div className="overflow-hidden">
                          <div className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                            <span className="hover:text-[#1464F4] cursor-pointer" onClick={() => setSelectedUser(user)}>
                              {user.fullName}
                            </span>
                            {user.isVerified && (
                              <ShieldCheck className="w-3.5 h-3.5 text-sky-500 inline shrink-0" title="Verified User" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{user.email}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{user.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Account Type */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-xl font-bold text-[11px] inline-block ${
                        user.accountType === 'Business' ? 'bg-indigo-50 text-indigo-700' :
                        user.accountType === 'Dealer' ? 'bg-purple-50 text-purple-700' :
                        user.accountType === 'Agent' ? 'bg-sky-50 text-sky-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {user.accountType}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{user.city}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 ml-4">{user.district}</div>
                    </td>

                    {/* Verification Badges */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <button
                          type="button"
                          onClick={() => handleToggleVerification(user.id, user.isVerified)}
                          className={`px-2 py-0.5 rounded-lg font-extrabold text-[10px] flex items-center gap-1 transition-all ${
                            user.isVerified
                              ? 'bg-sky-100 text-sky-800 hover:bg-sky-200'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>{user.isVerified ? 'Verified Badge' : 'Unverified'}</span>
                        </button>
                        
                        <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                          <span className={user.emailVerified ? 'text-emerald-600' : 'text-slate-300'}>Email ✓</span>
                          <span>•</span>
                          <span className={user.phoneVerified ? 'text-emerald-600' : 'text-slate-300'}>Phone ✓</span>
                          <span>•</span>
                          <span className={user.idVerified ? 'text-emerald-600' : 'text-slate-300'}>ID ✓</span>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full font-extrabold text-[10px] uppercase tracking-wider inline-block ${
                        user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                        user.status === 'Pending Verification' ? 'bg-amber-100 text-amber-800' :
                        user.status === 'Suspended' ? 'bg-orange-100 text-orange-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {user.status}
                      </span>
                      {user.suspensionReason && (
                        <div className="text-[9px] text-rose-600 font-medium max-w-[120px] truncate mt-0.5" title={user.suspensionReason}>
                          {user.suspensionReason}
                        </div>
                      )}
                    </td>

                    {/* Listings */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-xs">
                        {user.listingsCount} Listings
                      </div>
                      {onNavigateToListings && (
                        <button
                          type="button"
                          onClick={() => onNavigateToListings(user.id)}
                          className="text-[10px] font-bold text-[#1464F4] hover:underline flex items-center gap-0.5 mt-0.5"
                        >
                          <span>View listings</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      )}
                    </td>

                    {/* Joined Date */}
                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      <div>{user.createdAt}</div>
                      <div className="text-[10px] text-slate-400">Active: {user.lastActive}</div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right relative">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedUser(user)}
                          className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1"
                          title="View Profile Details"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden xl:inline text-[11px]">View</span>
                        </button>

                        {user.status === 'Active' || user.status === 'Pending Verification' ? (
                          <button
                            type="button"
                            onClick={() => handleOpenSuspendModal(user)}
                            className="px-2 py-1 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-[11px] transition-colors flex items-center gap-1"
                          >
                            <Lock className="w-3 h-3" />
                            <span>Suspend</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenRestoreModal(user)}
                            className="px-2 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] transition-colors flex items-center gap-1"
                          >
                            <Unlock className="w-3 h-3" />
                            <span>Restore</span>
                          </button>
                        )}

                        {/* More Menu */}
                        <button
                          type="button"
                          onClick={() => setOpenDropdownId(openDropdownId === user.id ? null : user.id)}
                          className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openDropdownId === user.id && (
                          <div className="absolute right-4 top-12 z-20 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 text-left text-xs font-semibold space-y-1">
                            <button
                              type="button"
                              onClick={() => { setSelectedUser(user); setOpenDropdownId(null); }}
                              className="w-full px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2"
                            >
                              <FileText className="w-3.5 h-3.5 text-slate-400" />
                              <span>View Profile & Activity</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleVerification(user.id, user.isVerified)}
                              className="w-full px-3 py-2 text-sky-700 hover:bg-sky-50 rounded-xl flex items-center gap-2"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
                              <span>{user.isVerified ? 'Revoke Verified Badge' : 'Grant Verified Badge'}</span>
                            </button>

                            {onNavigateToListings && (
                              <button
                                type="button"
                                onClick={() => { onNavigateToListings(user.id); setOpenDropdownId(null); }}
                                className="w-full px-3 py-2 text-indigo-700 hover:bg-indigo-50 rounded-xl flex items-center gap-2"
                              >
                                <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
                                <span>Filter User Listings</span>
                              </button>
                            )}

                            {(staff.role === 'ADMIN' || staff.role === 'SUPER_ADMIN') && user.status !== 'Banned' && (
                              <button
                                type="button"
                                onClick={() => handleOpenBanModal(user)}
                                className="w-full px-3 py-2 text-rose-700 hover:bg-rose-50 rounded-xl flex items-center gap-2"
                              >
                                <Ban className="w-3.5 h-3.5 text-rose-500" />
                                <span>Ban Account</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-2">
            <span>Showing {filteredUsers.length === 0 ? 0 : (validCurrentPage - 1) * rowsPerPage + 1} to {Math.min(validCurrentPage * rowsPerPage, filteredUsers.length)} of {filteredUsers.length} Users</span>
            <span className="text-slate-300">|</span>
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-800 font-bold"
            >
              <option value={8}>8</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={validCurrentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-bold text-slate-800">
              Page {validCurrentPage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={validCurrentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Analytics & Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* User Types Distribution */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-[#1464F4]" />
            <span>Account Type Breakdown</span>
          </h3>
          <div className="space-y-2">
            {[
              { type: 'Individual', count: users.filter(u => u.accountType === 'Individual').length, color: 'bg-blue-500' },
              { type: 'Business', count: users.filter(u => u.accountType === 'Business').length, color: 'bg-indigo-500' },
              { type: 'Dealer', count: users.filter(u => u.accountType === 'Dealer').length, color: 'bg-purple-500' },
              { type: 'Agent', count: users.filter(u => u.accountType === 'Agent').length, color: 'bg-sky-500' }
            ].map(item => {
              const pct = kpiTotal > 0 ? Math.round((item.count / kpiTotal) * 100) : 0;
              return (
                <div key={item.type} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{item.type}</span>
                    <span>{item.count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Verification Overview */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-sky-500" />
            <span>Verification Status</span>
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Email Verified Users</span>
              <span className="font-bold text-emerald-600">
                {users.filter(u => u.emailVerified || u.isVerified).length} / {kpiTotal}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Phone Verified Users</span>
              <span className="font-bold text-emerald-600">
                {users.filter(u => u.phoneVerified || u.isVerified).length} / {kpiTotal}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-600 font-medium">NIC / ID Verified Users</span>
              <span className="font-bold text-sky-600">
                {users.filter(u => u.idVerified).length} / {kpiTotal}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-600 font-medium">Business / BR Verified</span>
              <span className="font-bold text-indigo-600">
                {users.filter(u => u.businessVerified).length} / {users.filter(u => u.accountType === 'Business' || u.accountType === 'Dealer').length || 1}
              </span>
            </div>
          </div>
        </div>

        {/* Security Controls */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>Security & Governance</span>
          </h3>
          <p className="text-xs text-slate-500">
            Staff access level: <span className="font-bold text-slate-900">{staff.role}</span>.
            All user status changes, suspensions, and badge grants are logged in audit history with staff timestamps.
          </p>
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStatusFilter('Suspended')}
              className="px-3 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs rounded-xl transition-colors"
            >
              Filter Suspended Users ({kpiSuspendedBanned})
            </button>
          </div>
        </div>
      </div>

      {/* USER DETAIL MODAL / DRAWER */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 relative space-y-6">
            <button
              type="button"
              onClick={() => setSelectedUser(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
              <img
                src={selectedUser.avatarUrl}
                alt={selectedUser.fullName}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-[#1464F4]/20"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900">{selectedUser.fullName}</h2>
                  {selectedUser.isVerified && (
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-extrabold text-[10px] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{selectedUser.email} • {selectedUser.phone}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 font-bold text-[10px] rounded-lg">
                    {selectedUser.accountType}
                  </span>
                  <span className={`px-2.5 py-0.5 font-extrabold text-[10px] rounded-lg ${
                    selectedUser.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                    selectedUser.status === 'Suspended' ? 'bg-orange-100 text-orange-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Key Information Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="text-slate-400 text-[10px] font-bold uppercase">City & District</div>
                <div className="font-extrabold text-slate-900 mt-1">{selectedUser.city}</div>
                <div className="text-[10px] text-slate-500">{selectedUser.district}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="text-slate-400 text-[10px] font-bold uppercase">Listings Count</div>
                <div className="font-extrabold text-[#1464F4] text-lg mt-0.5">{selectedUser.listingsCount}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="text-slate-400 text-[10px] font-bold uppercase">Registered On</div>
                <div className="font-bold text-slate-800 mt-1">{selectedUser.createdAt}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="text-slate-400 text-[10px] font-bold uppercase">Last Activity</div>
                <div className="font-bold text-slate-800 mt-1">{selectedUser.lastActive}</div>
              </div>
            </div>

            {/* Verification Status List */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Identity Verification Check</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                  <span>Email Verification</span>
                  <span className={selectedUser.emailVerified ? 'text-emerald-600 font-bold' : 'text-slate-400 font-bold'}>
                    {selectedUser.emailVerified ? 'Verified ✓' : 'Unverified'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                  <span>Phone Verification</span>
                  <span className={selectedUser.phoneVerified ? 'text-emerald-600 font-bold' : 'text-slate-400 font-bold'}>
                    {selectedUser.phoneVerified ? 'Verified ✓' : 'Unverified'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                  <span>National ID / Passport</span>
                  <span className={selectedUser.idVerified ? 'text-emerald-600 font-bold' : 'text-slate-400 font-bold'}>
                    {selectedUser.idVerified ? 'Verified ✓' : 'Pending'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                  <span>Business Registration</span>
                  <span className={selectedUser.businessVerified ? 'text-emerald-600 font-bold' : 'text-slate-400 font-bold'}>
                    {selectedUser.businessVerified ? 'Verified ✓' : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* User Activity / Listings */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">User Listing Records</h4>
                {onNavigateToListings && (
                  <button
                    type="button"
                    onClick={() => {
                      const id = selectedUser.id;
                      setSelectedUser(null);
                      onNavigateToListings(id);
                    }}
                    className="text-xs font-bold text-[#1464F4] hover:underline"
                  >
                    View in Moderation Queue →
                  </button>
                )}
              </div>

              {userListings.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-2xl text-center text-xs text-slate-500 font-medium">
                  No active items currently listed by this user.
                </div>
              ) : (
                <div className="space-y-2">
                  {userListings.slice(0, 3).map(listing => (
                    <div key={listing.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
                      <div className="font-bold text-slate-900 truncate max-w-[280px]">{listing.title}</div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold text-[10px]">{listing.category}</span>
                        <span className="font-black text-[#1464F4]">{listing.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Audit History relative to user */}
            {userAuditLogs.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Recent Moderation Audit Logs</h4>
                <div className="space-y-1 text-xs">
                  {userAuditLogs.slice(0, 3).map(log => (
                    <div key={log.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px]">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>{log.action}</span>
                        <span className="text-slate-400 text-[10px]">{log.createdAt}</span>
                      </div>
                      <div className="text-slate-600 text-[10px] mt-0.5">{log.details}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  handleToggleVerification(selectedUser.id, selectedUser.isVerified);
                }}
                className="px-4 py-2 bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold rounded-xl text-xs transition-colors"
              >
                {selectedUser.isVerified ? 'Revoke Verified Badge' : 'Grant Verified Badge'}
              </button>

              <div className="flex items-center gap-2">
                {selectedUser.status === 'Active' ? (
                  <button
                    type="button"
                    onClick={() => {
                      const u = selectedUser;
                      setSelectedUser(null);
                      handleOpenSuspendModal(u);
                    }}
                    className="px-4 py-2 bg-orange-50 text-orange-700 hover:bg-orange-100 font-bold rounded-xl text-xs transition-colors"
                  >
                    Suspend User
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const u = selectedUser;
                      setSelectedUser(null);
                      handleOpenRestoreModal(u);
                    }}
                    className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-xl text-xs transition-colors"
                  >
                    Restore User
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-5 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUSPEND USER MODAL */}
      {suspendModalUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-2xl text-orange-600">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Suspend User Account</h3>
                <p className="text-xs text-slate-500">{suspendModalUser.fullName} ({suspendModalUser.email})</p>
              </div>
            </div>

            {suspendError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{suspendError}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Suspension Duration <span className="text-rose-500">*</span>
                </label>
                <select
                  value={suspendDuration}
                  onChange={(e) => setSuspendDuration(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
                >
                  <option value="7 Days">7 Days Temporary</option>
                  <option value="30 Days">30 Days Temporary</option>
                  <option value="Indefinite">Indefinite (Until Staff Review)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mandatory Suspension Reason <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={suspendReason}
                  onChange={(e) => { setSuspendReason(e.target.value); setSuspendError(''); }}
                  placeholder="State clear reasons for account suspension (e.g., suspicious activity, non-payment, report violations)..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
                />
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 font-medium">
              ⚠️ Suspended users cannot create listings or initiate marketplace messages. This action will be recorded in staff audit logs.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSuspendModalUser(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSuspend}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs shadow-sm"
              >
                Confirm Suspension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESTORE USER MODAL */}
      {restoreModalUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
                <Unlock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Restore User Account</h3>
                <p className="text-xs text-slate-500">{restoreModalUser.fullName} ({restoreModalUser.email})</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to restore active status for this marketplace user? They will regain full marketplace publishing and communication permissions.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRestoreModalUser(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRestore}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm"
              >
                Restore Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BAN USER MODAL */}
      {banModalUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-100 rounded-2xl text-rose-600">
                <Ban className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Ban User Account Permanently</h3>
                <p className="text-xs text-slate-500">{banModalUser.fullName} ({banModalUser.email})</p>
              </div>
            </div>

            {banError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{banError}</span>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 text-xs mb-1">
                Mandatory Ban Reason <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={banReason}
                onChange={(e) => { setBanReason(e.target.value); setBanError(''); }}
                placeholder="State severe violation justification for permanent account ban..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-[11px] text-rose-800 font-medium">
              🚨 Permanent Ban is restricted to Admin & Super Admin staff. Account will be blocked indefinitely across all platform endpoints.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setBanModalUser(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBan}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-sm"
              >
                Confirm Permanent Ban
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
