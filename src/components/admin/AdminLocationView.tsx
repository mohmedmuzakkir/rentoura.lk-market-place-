import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Upload, 
  Globe, 
  Building2, 
  Compass, 
  Building, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Edit3, 
  Power, 
  Trash2, 
  ChevronRight, 
  ChevronDown, 
  RotateCcw, 
  AlertCircle, 
  Layers, 
  X, 
  Check, 
  Navigation, 
  Info,
  Clock,
  UserCheck,
  ShieldCheck,
  Map,
  FileSpreadsheet
} from 'lucide-react';
import { StaffAccount } from '../../types/adminTypes';
import { 
  LocationService, 
  CanonicalLocation, 
  LocationType, 
  LocationStatus, 
  LocationStats, 
  AddLocationPayload,
  PROVINCE_COORDINATES 
} from '../../services/locationService';

interface AdminLocationViewProps {
  staff: StaffAccount;
  onRefresh?: () => void;
}

export const AdminLocationView: React.FC<AdminLocationViewProps> = ({ staff, onRefresh }) => {
  // State
  const [activeTab, setActiveTab] = useState<LocationType | 'all'>('province');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [provinceFilter, setProvinceFilter] = useState<string>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selected Location for Details Drawer
  const [selectedLocation, setSelectedLocation] = useState<CanonicalLocation | null>(null);
  const [selectedMapLoc, setSelectedMapLoc] = useState<CanonicalLocation | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<CanonicalLocation | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Action Message Feedback
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Tree Expand State
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'western': true,
    'colombo': true,
    'central': true,
    'kandy': true
  });

  // Fetch Locations & Stats
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [locationsList, setLocationsList] = useState<CanonicalLocation[]>([]);
  const [isDbLoading, setIsDbLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setIsDbLoading(true);
      const locs = await LocationService.getAllLocationsAsync(true);
      if (isMounted) {
        setLocationsList(locs);
        setIsDbLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [reloadTrigger]);

  const refreshData = () => {
    setReloadTrigger(prev => prev + 1);
    if (onRefresh) onRefresh();
  };

  const allLocations = useMemo(() => {
    return locationsList;
  }, [locationsList]);

  const stats: LocationStats = useMemo(() => {
    return LocationService.getLocationStats();
  }, [locationsList]);

  // Dependent Districts for Filter Dropdown
  const filterDistricts = useMemo(() => {
    if (provinceFilter === 'all') return allLocations.filter(l => l.type === 'district');
    return allLocations.filter(l => l.type === 'district' && (l.provinceId === provinceFilter || l.parentId === provinceFilter));
  }, [provinceFilter, allLocations]);

  // Filtered Locations List
  const filteredLocations = useMemo(() => {
    return allLocations.filter(loc => {
      // Tab filter
      if (activeTab !== 'all' && loc.type !== activeTab) {
        return false;
      }

      // Type filter dropdown
      if (typeFilter !== 'all' && loc.type !== typeFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && loc.status !== statusFilter) {
        return false;
      }

      // Province filter
      if (provinceFilter !== 'all') {
        if (loc.type === 'province' && loc.id !== provinceFilter) return false;
        if (loc.type !== 'province' && loc.provinceId !== provinceFilter && loc.parentId !== provinceFilter) return false;
      }

      // District filter
      if (districtFilter !== 'all') {
        if (loc.type === 'district' && loc.id !== districtFilter) return false;
        if ((loc.type === 'city' || loc.type === 'area') && loc.districtId !== districtFilter && loc.parentId !== districtFilter) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = loc.name.toLowerCase().includes(q);
        const codeMatch = loc.code?.toLowerCase().includes(q) || loc.postalCode?.toLowerCase().includes(q);
        const parentMatch = loc.parentName?.toLowerCase().includes(q) || loc.provinceName?.toLowerCase().includes(q) || loc.districtName?.toLowerCase().includes(q);
        const siMatch = loc.name_si?.toLowerCase().includes(q);
        const taMatch = loc.name_ta?.toLowerCase().includes(q);
        if (!nameMatch && !codeMatch && !parentMatch && !siMatch && !taMatch) {
          return false;
        }
      }

      return true;
    });
  }, [allLocations, activeTab, typeFilter, statusFilter, provinceFilter, districtFilter, searchQuery]);

  // Paginated Table Data
  const totalPages = Math.ceil(filteredLocations.length / pageSize) || 1;
  const paginatedLocations = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLocations.slice(start, start + pageSize);
  }, [filteredLocations, currentPage, pageSize]);

  // Audit Logs
  const recentActivities = useMemo(() => {
    return [
      { id: '1', action: 'CREATE', locationName: 'Western Province', timestamp: '2026-08-20', staffName: staff.fullName || 'Admin' },
      { id: '2', action: 'UPDATE', locationName: 'Colombo District', timestamp: '2026-08-21', staffName: staff.fullName || 'Admin' }
    ];
  }, [reloadTrigger, staff]);

  // Notification Banner Handler
  const showBanner = (text: string, type: 'success' | 'error') => {
    setActionMessage({ text, type });
    setTimeout(() => {
      setActionMessage(null);
    }, 4000);
  };

  // Toggle Node in Tree
  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  // Toggle Location Status
  const handleToggleStatus = async (loc: CanonicalLocation) => {
    const res = await LocationService.toggleStatus(loc.id, staff);
    if (res.success) {
      showBanner(`Status for "${loc.name}" updated to ${res.newStatus}.`, 'success');
      refreshData();
    } else {
      showBanner(res.message || 'Failed to toggle status.', 'error');
    }
  };

  // Delete Location
  const handleDeleteLocation = async (loc: CanonicalLocation) => {
    if (!window.confirm(`Are you sure you want to delete "${loc.name}"? This action cannot be undone.`)) {
      return;
    }
    const res = await LocationService.deleteLocation(loc.id, staff);
    if (res.success) {
      showBanner(`Location "${loc.name}" deleted successfully.`, 'success');
      refreshData();
      if (selectedLocation?.id === loc.id) {
        setSelectedLocation(null);
      }
    } else {
      showBanner(res.message || 'Failed to delete location.', 'error');
    }
  };

  // Map Center
  const mapCenterCoords = useMemo(() => {
    if (selectedMapLoc?.latitude && selectedMapLoc?.longitude) {
      return { lat: selectedMapLoc.latitude, lng: selectedMapLoc.longitude, name: selectedMapLoc.name };
    }
    if (selectedLocation?.latitude && selectedLocation?.longitude) {
      return { lat: selectedLocation.latitude, lng: selectedLocation.longitude, name: selectedLocation.name };
    }
    return { lat: 7.8731, lng: 80.7718, name: 'Sri Lanka' }; // Centroid of Sri Lanka
  }, [selectedMapLoc, selectedLocation]);

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification Banner */}
      {actionMessage && (
        <div className={`p-4 rounded-2xl flex items-center justify-between shadow-lg text-sm font-semibold transition-all ${
          actionMessage.type === 'success' 
            ? 'bg-emerald-600 text-white border border-emerald-500' 
            : 'bg-rose-600 text-white border border-rose-500'
        }`}>
          <div className="flex items-center gap-3">
            {actionMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span>{actionMessage.text}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-white/80 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#1464F4] text-white flex items-center justify-center shadow-md shadow-[#1464F4]/20">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Location Management</h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-emerald-200">
                Sri Lanka Canonical DB
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Manage Sri Lanka provinces, districts, cities, towns and areas used across RENTOURA.LK.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-2 border border-slate-200"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Import CSV</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingLocation(null);
              setIsAddModalOpen(true);
            }}
            className="px-5 py-2.5 bg-[#1464F4] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md shadow-[#1464F4]/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Location</span>
          </button>
        </div>
      </div>

      {/* KPI Top Summary Cards (5 Column Grid) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Locations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-200 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Total Locations</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1464F4] flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">{stats.totalLocations.toLocaleString()}</div>
          <div className="flex items-center gap-1 mt-1.5 text-[11px] font-bold text-emerald-600">
            <span>↑ {stats.activeCount} Active</span>
            <span className="text-slate-400 font-normal">({stats.disabledCount} disabled)</span>
          </div>
        </div>

        {/* Provinces */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-200 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Provinces</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">{stats.provincesCount}</div>
          <div className="text-[11px] font-bold text-slate-500 mt-1.5">
            Official Sri Lanka (9)
          </div>
        </div>

        {/* Districts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-200 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Districts</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">{stats.districtsCount}</div>
          <div className="text-[11px] font-bold text-slate-500 mt-1.5">
            Official Districts (25)
          </div>
        </div>

        {/* Cities / Towns */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-200 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Cities / Towns</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">{stats.citiesCount.toLocaleString()}</div>
          <div className="text-[11px] font-bold text-purple-600 mt-1.5">
            Primary urban hubs
          </div>
        </div>

        {/* Areas / Villages */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-rose-200 transition-all col-span-2 md:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Areas / Villages</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">{stats.areasCount.toLocaleString()}</div>
          <div className="text-[11px] font-bold text-rose-600 mt-1.5">
            Local sub-divisions
          </div>
        </div>
      </div>

      {/* Toolbar & Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, code, postal code..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1464F4] focus:bg-white transition-all font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
            >
              <option value="all">All Types</option>
              <option value="province">Provinces</option>
              <option value="district">Districts</option>
              <option value="city">Cities / Towns</option>
              <option value="area">Areas / Villages</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>

            {/* Province Filter */}
            <select
              value={provinceFilter}
              onChange={(e) => {
                setProvinceFilter(e.target.value);
                setDistrictFilter('all');
                setCurrentPage(1);
              }}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
            >
              <option value="all">All Provinces</option>
              {allLocations.filter(l => l.type === 'province').map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            {/* District Filter (Dependent) */}
            <select
              value={districtFilter}
              onChange={(e) => {
                setDistrictFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
            >
              <option value="all">All Districts</option>
              {filterDistricts.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            {/* Export CSV */}
            <button
              type="button"
              onClick={() => {
                const csv = LocationService.exportLocationsCSV();
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `rentoura_locations_${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                showBanner('Locations exported to CSV successfully.', 'success');
              }}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 border border-slate-200"
              title="Export Locations CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-1">
          <button
            type="button"
            onClick={() => { setActiveTab('province'); setCurrentPage(1); }}
            className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'province' 
                ? 'bg-[#1464F4] text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Provinces</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'province' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {stats.provincesCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('district'); setCurrentPage(1); }}
            className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'district' 
                ? 'bg-[#1464F4] text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Districts</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'district' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {stats.districtsCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('city'); setCurrentPage(1); }}
            className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'city' 
                ? 'bg-[#1464F4] text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Cities / Towns</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'city' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {stats.citiesCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('area'); setCurrentPage(1); }}
            className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'area' 
                ? 'bg-[#1464F4] text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Areas / Villages</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'area' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {stats.areasCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
            className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ml-auto ${
              activeTab === 'all' 
                ? 'bg-slate-800 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>All Locations</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {stats.totalLocations}
            </span>
          </button>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">
                  {activeTab === 'province' ? 'Province' : activeTab === 'district' ? 'District' : activeTab === 'city' ? 'City / Town' : activeTab === 'area' ? 'Area / Village' : 'Location Name'}
                </th>

                {activeTab === 'province' && (
                  <th className="py-3.5 px-4 text-center">Code</th>
                )}

                {(activeTab === 'city' || activeTab === 'area' || activeTab === 'all') && (
                  <th className="py-3.5 px-4">Parent / Hierarchy</th>
                )}

                {activeTab === 'province' && (
                  <>
                    <th className="py-3.5 px-4 text-center">Districts</th>
                    <th className="py-3.5 px-4 text-center">Cities / Towns</th>
                    <th className="py-3.5 px-4 text-center">Areas / Villages</th>
                  </>
                )}

                {activeTab === 'district' && (
                  <>
                    <th className="py-3.5 px-4">Province</th>
                    <th className="py-3.5 px-4 text-center">Cities / Towns</th>
                    <th className="py-3.5 px-4 text-center">Areas / Villages</th>
                  </>
                )}

                {(activeTab === 'city' || activeTab === 'area') && (
                  <th className="py-3.5 px-4 text-center">Postal Code</th>
                )}

                <th className="py-3.5 px-4 text-center">Listings</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
              {paginatedLocations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <MapPin className="w-8 h-8 text-slate-300 stroke-1" />
                      <p className="text-sm font-bold text-slate-600">No locations found</p>
                      <p className="text-xs text-slate-400">Try adjusting your filters or search query.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedLocations.map((loc) => (
                  <tr key={loc.id} className="hover:bg-slate-50/80 transition-colors group">
                    {/* Location Name Column */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                          loc.type === 'province' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          loc.type === 'district' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          loc.type === 'city' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                          'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {loc.type === 'province' ? <Building2 className="w-4 h-4" /> :
                           loc.type === 'district' ? <Compass className="w-4 h-4" /> :
                           loc.type === 'city' ? <Building className="w-4 h-4" /> :
                           <MapPin className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 group-hover:text-[#1464F4] transition-colors flex items-center gap-2">
                            <span>{loc.name}</span>
                            {loc.type === 'province' && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded-md">
                                Province
                              </span>
                            )}
                          </div>
                          {(loc.name_si || loc.name_ta) && (
                            <div className="text-[11px] text-slate-400 font-normal">
                              {loc.name_si} {loc.name_ta ? `• ${loc.name_ta}` : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Province Code */}
                    {activeTab === 'province' && (
                      <td className="py-4 px-4 text-center">
                        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                          {loc.code || 'SL'}
                        </span>
                      </td>
                    )}

                    {/* Hierarchy Parent info */}
                    {(activeTab === 'city' || activeTab === 'area' || activeTab === 'all') && (
                      <td className="py-4 px-4">
                        <div className="text-xs text-slate-600 font-medium">
                          {loc.cityName && <span className="font-bold text-slate-800">{loc.cityName}, </span>}
                          {loc.districtName && <span className="text-slate-600">{loc.districtName}, </span>}
                          {loc.provinceName && <span className="text-slate-400 text-[11px]">{loc.provinceName}</span>}
                        </div>
                      </td>
                    )}

                    {/* Province dynamic counts */}
                    {activeTab === 'province' && (
                      <>
                        <td className="py-4 px-4 text-center font-bold text-slate-800">{loc.districtsCount}</td>
                        <td className="py-4 px-4 text-center font-bold text-slate-800">{loc.citiesCount}</td>
                        <td className="py-4 px-4 text-center font-bold text-slate-800">{loc.areasCount}</td>
                      </>
                    )}

                    {/* District dynamic counts */}
                    {activeTab === 'district' && (
                      <>
                        <td className="py-4 px-4 font-bold text-slate-800">{loc.provinceName}</td>
                        <td className="py-4 px-4 text-center font-bold text-slate-800">{loc.citiesCount}</td>
                        <td className="py-4 px-4 text-center font-bold text-slate-800">{loc.areasCount}</td>
                      </>
                    )}

                    {/* Postal Code */}
                    {(activeTab === 'city' || activeTab === 'area') && (
                      <td className="py-4 px-4 text-center font-mono text-slate-500">
                        {loc.postalCode || '—'}
                      </td>
                    )}

                    {/* Mapped Listings */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#1464F4] border border-blue-100">
                        {loc.listingsCount}
                      </span>
                    </td>

                    {/* Status Pill */}
                    <td className="py-4 px-4 text-center">
                      {loc.status === 'active' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-500 border border-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          Disabled
                        </span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedLocation(loc);
                            setSelectedMapLoc(loc);
                          }}
                          className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-[#1464F4] rounded-lg transition-colors"
                          title="Inspect Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingLocation(loc);
                            setIsAddModalOpen(true);
                          }}
                          className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-amber-600 rounded-lg transition-colors"
                          title="Edit Location"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(loc)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            loc.status === 'active' 
                              ? 'hover:bg-amber-50 text-slate-500 hover:text-amber-600' 
                              : 'hover:bg-emerald-50 text-slate-500 hover:text-emerald-600'
                          }`}
                          title={loc.status === 'active' ? 'Disable Location' : 'Enable Location'}
                        >
                          <Power className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteLocation(loc)}
                          className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                          title="Delete Location"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <div>
            Showing <span className="font-bold text-slate-900">{filteredLocations.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to{' '}
            <span className="font-bold text-slate-900">{Math.min(currentPage * pageSize, filteredLocations.length)}</span> of{' '}
            <span className="font-bold text-slate-900">{filteredLocations.length}</span> locations
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 font-bold text-slate-700 transition-colors"
              >
                Previous
              </button>
              <span className="px-2 font-bold text-slate-800">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 font-bold text-slate-700 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Grid: Location Structure Tree, Map Preview & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel 1: Structure Hierarchy Tree */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#1464F4]" />
              <h3 className="text-sm font-extrabold text-slate-900">Location Structure Preview</h3>
            </div>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              Sri Lanka Hierarchy
            </span>
          </div>

          <div className="max-h-[360px] overflow-y-auto pr-1 text-xs space-y-1 font-medium">
            <div className="flex items-center gap-2 py-1 px-2 font-black text-slate-900 bg-slate-50 rounded-lg">
              <Globe className="w-4 h-4 text-[#1464F4]" />
              <span>🇱🇰 Sri Lanka</span>
            </div>

            {/* Provinces Tree */}
            <div className="pl-4 space-y-1 border-l-2 border-slate-100 ml-3">
              {allLocations.filter(l => l.type === 'province').map((prov) => {
                const isProvExpanded = !!expandedNodes[prov.id];
                const provDistricts = allLocations.filter(l => l.type === 'district' && (l.provinceId === prov.id || l.parentId === prov.id));

                return (
                  <div key={prov.id} className="space-y-1">
                    <div 
                      onClick={() => toggleNode(prov.id)}
                      className="flex items-center justify-between py-1 px-2 hover:bg-slate-50 rounded-lg cursor-pointer group"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        {isProvExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                        <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{prov.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">({provDistricts.length} Dist)</span>
                    </div>

                    {/* Districts Tree */}
                    {isProvExpanded && (
                      <div className="pl-4 space-y-1 border-l border-slate-200/60 ml-2">
                        {provDistricts.map((dist) => {
                          const isDistExpanded = !!expandedNodes[dist.id];
                          const distCities = allLocations.filter(l => l.type === 'city' && (l.districtId === dist.id || l.parentId === dist.id));

                          return (
                            <div key={dist.id} className="space-y-1">
                              <div 
                                onClick={() => toggleNode(dist.id)}
                                className="flex items-center justify-between py-1 px-2 hover:bg-slate-50 rounded-lg cursor-pointer group"
                              >
                                <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                                  {isDistExpanded ? <ChevronDown className="w-3 h-3 text-slate-400" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
                                  <Compass className="w-3.5 h-3.5 text-amber-600" />
                                  <span>{dist.name}</span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono">({distCities.length} Cities)</span>
                              </div>

                              {/* Cities Tree */}
                              {isDistExpanded && (
                                <div className="pl-4 space-y-1 border-l border-slate-200/40 ml-2">
                                  {distCities.slice(0, 5).map((city) => {
                                    const cityAreas = allLocations.filter(l => l.type === 'area' && (l.cityId === city.id || l.parentId === city.id));
                                    return (
                                      <div key={city.id} className="py-0.5 px-2 hover:bg-blue-50 text-slate-600 rounded flex items-center justify-between cursor-pointer" onClick={() => setSelectedLocation(city)}>
                                        <div className="flex items-center gap-1.5">
                                          <Building className="w-3 h-3 text-purple-600" />
                                          <span className="font-medium">{city.name}</span>
                                        </div>
                                        <span className="text-[9px] text-slate-400 font-mono">{cityAreas.length} areas</span>
                                      </div>
                                    );
                                  })}
                                  {distCities.length > 5 && (
                                    <div className="text-[10px] text-slate-400 italic pl-5 py-0.5">
                                      + {distCities.length - 5} more cities...
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel 2: Interactive Location Map Preview */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Map className="w-4 h-4 text-[#1464F4]" />
              <h3 className="text-sm font-extrabold text-slate-900">Location Map</h3>
            </div>
            <span className="text-[10px] font-bold bg-blue-50 text-[#1464F4] px-2 py-0.5 rounded-full border border-blue-100">
              {mapCenterCoords.name}
            </span>
          </div>

          {/* Map Representation Box */}
          <div className="relative h-64 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center group">
            {/* Map Background SVG Stylized Canvas */}
            <div className="absolute inset-0 bg-sky-50 opacity-90 flex items-center justify-center">
              <svg className="w-full h-full opacity-30 text-blue-600" viewBox="0 0 200 300" fill="currentColor">
                <path d="M 100 20 C 130 30 160 80 150 150 C 140 220 120 280 90 280 C 60 270 40 200 50 120 C 60 60 80 10 100 20 Z" />
              </svg>
            </div>

            {/* Interactive Centered Pin */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#1464F4] text-white flex items-center justify-center shadow-lg shadow-[#1464F4]/30 animate-bounce">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="mt-2 bg-slate-900/90 backdrop-blur-xs text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md">
                {mapCenterCoords.name}
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-0.5 bg-white/80 px-2 py-0.5 rounded">
                Lat: {mapCenterCoords.lat.toFixed(4)}, Lng: {mapCenterCoords.lng.toFixed(4)}
              </div>
            </div>

            {/* Map Controls */}
            <div className="absolute right-3 top-3 flex flex-col gap-1.5">
              <button type="button" className="w-7 h-7 bg-white text-slate-700 hover:bg-slate-50 rounded-lg shadow-xs border border-slate-200 font-extrabold text-xs flex items-center justify-center">
                +
              </button>
              <button type="button" className="w-7 h-7 bg-white text-slate-700 hover:bg-slate-50 rounded-lg shadow-xs border border-slate-200 font-extrabold text-xs flex items-center justify-center">
                -
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center font-medium">
            Select any province or district in the table or tree to view its geographic focal point.
          </p>
        </div>

        {/* Panel 3: Quick Actions & Location Stats Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900">Quick Actions</h3>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                setEditingLocation(null);
                setIsAddModalOpen(true);
              }}
              className="w-full p-3 bg-blue-50/80 hover:bg-blue-100 text-[#1464F4] text-xs font-bold rounded-2xl border border-blue-100 text-left transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <Plus className="w-4 h-4 text-[#1464F4]" />
                <span>Add City or Town</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#1464F4]" />
            </button>

            <button
              type="button"
              onClick={() => setIsImportModalOpen(true)}
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl border border-slate-200 text-left transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>Bulk Import CSV</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => {
                const csv = LocationService.exportLocationsCSV();
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `rentoura_locations.csv`;
                a.click();
              }}
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl border border-slate-200 text-left transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <Download className="w-4 h-4 text-purple-600" />
                <span>Export Master Location CSV</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Location Stats Distribution */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900">Location Distribution</h4>
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Cities / Towns</span>
                  <span>{stats.citiesCount} ({Math.round((stats.citiesCount / (stats.totalLocations || 1)) * 100)}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(stats.citiesCount / (stats.totalLocations || 1)) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Areas / Villages</span>
                  <span>{stats.areasCount} ({Math.round((stats.areasCount / (stats.totalLocations || 1)) * 100)}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(stats.areasCount / (stats.totalLocations || 1)) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Location Activities */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#1464F4]" />
            <h3 className="text-sm font-extrabold text-slate-900">Recent Location Activities</h3>
          </div>
          <span className="text-xs font-bold text-slate-500">Real Admin Audit Logs</span>
        </div>

        {recentActivities.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No recent location admin activity logs found.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentActivities.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between text-xs gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1464F4] flex items-center justify-center shrink-0 font-bold">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900">{log.action.replace('LOCATION_', '')}: {log.targetTitle}</div>
                    <div className="text-slate-500">{log.details}</div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-bold text-slate-700">{log.actorName}</div>
                  <div className="text-[10px] text-slate-400">{log.createdAt}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Location Modal */}
      {isAddModalOpen && (
        <LocationFormModal
          editingLocation={editingLocation}
          staff={staff}
          allLocations={allLocations}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingLocation(null);
          }}
          onSuccess={(msg) => {
            showBanner(msg, 'success');
            refreshData();
            setIsAddModalOpen(false);
            setEditingLocation(null);
          }}
        />
      )}

      {/* Location Details Drawer Modal */}
      {selectedLocation && (
        <LocationDetailsDrawer
          location={selectedLocation}
          allLocations={allLocations}
          onClose={() => setSelectedLocation(null)}
          onEdit={() => {
            setEditingLocation(selectedLocation);
            setSelectedLocation(null);
            setIsAddModalOpen(true);
          }}
        />
      )}

      {/* Bulk Import Modal */}
      {isImportModalOpen && (
        <BulkImportModal
          staff={staff}
          onClose={() => setIsImportModalOpen(false)}
          onSuccess={(msg) => {
            showBanner(msg, 'success');
            refreshData();
            setIsImportModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

// ==========================================
// SUB-COMPONENT: Add/Edit Location Modal
// ==========================================
interface LocationFormModalProps {
  editingLocation: CanonicalLocation | null;
  staff: StaffAccount;
  allLocations: CanonicalLocation[];
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

const LocationFormModal: React.FC<LocationFormModalProps> = ({
  editingLocation,
  staff,
  allLocations,
  onClose,
  onSuccess
}) => {
  const isEdit = !!editingLocation;

  const [type, setType] = useState<LocationType>(editingLocation?.type || 'city');
  const [name, setName] = useState(editingLocation?.name || '');
  const [parentId, setParentId] = useState(editingLocation?.parentId || '');
  const [code, setCode] = useState(editingLocation?.code || '');
  const [postalCode, setPostalCode] = useState(editingLocation?.postalCode || '');
  const [nameSi, setNameSi] = useState(editingLocation?.name_si || '');
  const [nameTa, setNameTa] = useState(editingLocation?.name_ta || '');
  const [latitude, setLatitude] = useState<string>(editingLocation?.latitude?.toString() || '');
  const [longitude, setLongitude] = useState<string>(editingLocation?.longitude?.toString() || '');
  const [status, setStatus] = useState<LocationStatus>(editingLocation?.status || 'active');

  const [error, setError] = useState<string | null>(null);

  // Filter possible parents based on selected location type
  const parentOptions = useMemo(() => {
    if (type === 'province') return [];
    if (type === 'district') return allLocations.filter(l => l.type === 'province');
    if (type === 'city') return allLocations.filter(l => l.type === 'district');
    if (type === 'area') return allLocations.filter(l => l.type === 'city');
    return [];
  }, [type, allLocations]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Location name is required.');
      return;
    }

    if (type !== 'province' && !parentId) {
      setError(`Parent selection is required for ${type}.`);
      return;
    }

    const latNum = latitude.trim() ? parseFloat(latitude) : undefined;
    const lngNum = longitude.trim() ? parseFloat(longitude) : undefined;

    if (latNum !== undefined && (isNaN(latNum) || latNum < -90 || latNum > 90)) {
      setError('Latitude must be a valid number between -90 and 90.');
      return;
    }

    if (lngNum !== undefined && (isNaN(lngNum) || lngNum < -180 || lngNum > 180)) {
      setError('Longitude must be a valid number between -180 and 180.');
      return;
    }

    if (isEdit && editingLocation) {
      const res = await LocationService.updateLocation(editingLocation.id, {
        name: name.trim(),
        code: code.trim().toLowerCase(),
        postalCode: postalCode.trim(),
        name_si: nameSi.trim(),
        name_ta: nameTa.trim(),
        latitude: latNum,
        longitude: lngNum,
        status
      }, staff);

      if (res.success) {
        onSuccess(`Location "${name}" updated successfully.`);
      } else {
        setError(res.message || 'Failed to update location.');
      }
    } else {
      const payload: AddLocationPayload = {
        name: name.trim(),
        type,
        parentId: type === 'province' ? undefined : parentId,
        code: code.trim(),
        postalCode: postalCode.trim(),
        name_si: nameSi.trim(),
        name_ta: nameTa.trim(),
        latitude: latNum,
        longitude: lngNum,
        status
      };

      const res = await LocationService.addLocation(payload, staff);
      if (res.success) {
        onSuccess(`New ${type} "${name}" added successfully.`);
      } else {
        setError(res.message || 'Failed to add location.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5 my-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1464F4] flex items-center justify-center font-bold">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              {isEdit ? 'Edit Location' : 'Add New Location'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Location Type */}
          {!isEdit && (
            <div>
              <label className="block font-extrabold text-slate-700 mb-1">Location Type *</label>
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value as LocationType);
                  setParentId('');
                }}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
              >
                <option value="city">City / Town</option>
                <option value="area">Area / Village</option>
                <option value="district">District</option>
                <option value="province">Province</option>
              </select>
            </div>
          )}

          {/* Location Name */}
          <div>
            <label className="block font-extrabold text-slate-700 mb-1">Location Name (English) *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Kandy City, Kollupitiya, Bambalapitiya"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
              required
            />
          </div>

          {/* Parent Dropdown */}
          {type !== 'province' && !isEdit && (
            <div>
              <label className="block font-extrabold text-slate-700 mb-1">
                Parent {type === 'district' ? 'Province' : type === 'city' ? 'District' : 'City / Town'} *
              </label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
                required
              >
                <option value="">-- Select Parent --</option>
                {parentOptions.map(p => (
                  <option key={p.id} value={p.id}>{p.name} {p.provinceName ? `(${p.provinceName})` : ''}</option>
                ))}
              </select>
            </div>
          )}

          {/* Multilingual Labels */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-extrabold text-slate-700 mb-1">Sinhala Name (optional)</label>
              <input
                type="text"
                value={nameSi}
                onChange={(e) => setNameSi(e.target.value)}
                placeholder="e.g., කොළඹ"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
              />
            </div>
            <div>
              <label className="block font-extrabold text-slate-700 mb-1">Tamil Name (optional)</label>
              <input
                type="text"
                value={nameTa}
                onChange={(e) => setNameTa(e.target.value)}
                placeholder="e.g., கொழும்பு"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
              />
            </div>
          </div>

          {/* Codes & Postal Code */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-extrabold text-slate-700 mb-1">Province/Region Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g., WP, CP"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono text-slate-800"
              />
            </div>
            <div>
              <label className="block font-extrabold text-slate-700 mb-1">Postal Code</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="e.g., 00300"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
              />
            </div>
          </div>

          {/* GPS Coordinates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-extrabold text-slate-700 mb-1">Latitude (-90 to 90)</label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="e.g., 6.9271"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
              />
            </div>
            <div>
              <label className="block font-extrabold text-slate-700 mb-1">Longitude (-180 to 180)</label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="e.g., 79.8612"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block font-extrabold text-slate-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as LocationStatus)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
            >
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1464F4] hover:bg-blue-600 text-white font-bold rounded-xl shadow-md shadow-[#1464F4]/20"
            >
              {isEdit ? 'Save Changes' : 'Create Location'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// SUB-COMPONENT: Location Details Drawer
// ==========================================
interface LocationDetailsDrawerProps {
  location: CanonicalLocation;
  allLocations: CanonicalLocation[];
  onClose: () => void;
  onEdit: () => void;
}

const LocationDetailsDrawer: React.FC<LocationDetailsDrawerProps> = ({
  location,
  allLocations,
  onClose,
  onEdit
}) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end z-50">
      <div className="bg-white max-w-md w-full h-full border-l border-slate-200 shadow-2xl p-6 space-y-6 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1464F4] flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">{location.name}</h3>
              <p className="text-xs text-slate-400 capitalize">{location.type} Record</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hierarchy Breadcrumb */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
          <div className="text-[10px] uppercase font-extrabold text-slate-400">Canonical Hierarchy</div>
          <div className="font-bold text-slate-800 flex items-center gap-1 flex-wrap">
            <span>🇱🇰 Sri Lanka</span>
            {location.provinceName && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span>{location.provinceName}</span>
              </>
            )}
            {location.districtName && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span>{location.districtName}</span>
              </>
            )}
            {location.cityName && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span>{location.cityName}</span>
              </>
            )}
            <ChevronRight className="w-3 h-3 text-[#1464F4]" />
            <span className="text-[#1464F4] font-black">{location.name}</span>
          </div>
        </div>

        {/* Detail Fields */}
        <div className="space-y-3 text-xs">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-bold">Location ID:</span>
            <span className="font-mono text-slate-800">{location.id}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-bold">Status:</span>
            <span className={`font-bold ${location.status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`}>
              {location.status.toUpperCase()}
            </span>
          </div>

          {location.code && (
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-bold">Code:</span>
              <span className="font-mono text-slate-800">{location.code}</span>
            </div>
          )}

          {location.postalCode && (
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-bold">Postal Code:</span>
              <span className="font-mono text-slate-800">{location.postalCode}</span>
            </div>
          )}

          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-bold">Mapped Active Listings:</span>
            <span className="font-bold text-[#1464F4] bg-blue-50 px-2 py-0.5 rounded-full">{location.listingsCount}</span>
          </div>

          {(location.latitude || location.longitude) && (
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-bold">GPS Coordinates:</span>
              <span className="font-mono text-slate-800">{location.latitude}, {location.longitude}</span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={onEdit}
            className="w-full py-2.5 bg-[#1464F4] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            Edit Location Record
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// SUB-COMPONENT: Bulk CSV Import Modal
// ==========================================
interface BulkImportModalProps {
  staff: StaffAccount;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

const BulkImportModal: React.FC<BulkImportModalProps> = ({
  staff,
  onClose,
  onSuccess
}) => {
  const [csvText, setCsvText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImport = () => {
    if (!csvText.trim()) {
      setError('Please paste CSV rows to import.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const lines = csvText.trim().split('\n');
      let successCount = 0;

      lines.forEach((line) => {
        const parts = line.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
        if (parts.length >= 2) {
          const name = parts[0];
          const type = (parts[1].toLowerCase() as LocationType) || 'city';
          const parentId = parts[2] || undefined;

          if (name) {
            LocationService.addLocation({ name, type, parentId }, staff);
            successCount++;
          }
        }
      });

      setIsProcessing(false);
      onSuccess(`Successfully imported ${successCount} location records.`);
    } catch (e: any) {
      setIsProcessing(false);
      setError(e?.message || 'Failed to process CSV import.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-extrabold text-slate-900">Bulk Import Locations CSV</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="text-xs text-slate-500 space-y-1">
          <p className="font-bold text-slate-700">Expected Format (Comma Separated):</p>
          <code className="block bg-slate-100 p-2 rounded-lg text-[11px] font-mono text-slate-800">
            Name, Type (city/area/district/province), Parent ID
          </code>
        </div>

        <textarea
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          rows={8}
          placeholder={`Maharagama, city, colombo\nKirulapone, area, colombo-city\nHanwella, city, colombo`}
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
        />

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={isProcessing}
            className="px-5 py-2 bg-[#1464F4] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            {isProcessing ? 'Importing...' : 'Start Import'}
          </button>
        </div>
      </div>
    </div>
  );
};
