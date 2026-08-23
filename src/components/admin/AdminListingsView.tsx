import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  Trash2, 
  MapPin, 
  RotateCw,
  X
} from 'lucide-react';
import { StaffAccount } from '../../types/adminTypes';
import { UserListingItem } from '../../types/profileTypes';
import { ProfileService } from '../../services/profileService';
import { AdminService } from '../../services/adminService';
import { ListingModerationModal } from './ListingModerationModal';

interface AdminListingsViewProps {
  staff: StaffAccount;
  initialTab?: 'all' | 'pending' | 'active' | 'rejected' | 'reported';
  onRefresh: () => void;
}

export const AdminListingsView: React.FC<AdminListingsViewProps> = ({ 
  staff, 
  initialTab = 'all',
  onRefresh 
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'active' | 'rejected' | 'reported'>(initialTab);
  const [moduleFilter, setModuleFilter] = useState<'all' | 'rentals' | 'jobs' | 'services'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [listings, setListings] = useState<UserListingItem[]>(() => ProfileService.getUserListings());
  const [selectedModerationListing, setSelectedModerationListing] = useState<UserListingItem | null>(null);

  const refreshData = () => {
    setListings(ProfileService.getUserListings());
    onRefresh();
  };

  const handleDeleteListing = (listingId: string, title: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      AdminService.deleteListingAdmin(listingId, staff);
      refreshData();
    }
  };

  const handleQuickApprove = (listingId: string) => {
    AdminService.approveListing(listingId, staff);
    refreshData();
  };

  const filteredListings = listings.filter(item => {
    // Tab Filter
    let matchesTab = true;
    if (activeTab === 'pending') matchesTab = item.status === 'pending';
    else if (activeTab === 'active') matchesTab = item.status === 'active';
    else if (activeTab === 'rejected') matchesTab = item.status === 'rejected';

    // Module Filter
    const matchesModule = moduleFilter === 'all' || item.module === moduleFilter;

    // Search Query
    const matchesQuery = !searchQuery.trim() || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesModule && matchesQuery;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-[#1464F4]" />
            <span>Marketplace Listings Management</span>
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-medium">
            Review, moderate, approve, or reject listings across Rentals, Jobs, and Services.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({listings.length})
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'pending' ? 'bg-amber-500 text-slate-900 shadow-sm font-extrabold' : 'text-amber-600 hover:text-amber-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending ({listings.filter(l => l.status === 'pending').length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'active' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active ({listings.filter(l => l.status === 'active').length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rejected')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'rejected' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected ({listings.filter(l => l.status === 'rejected').length})</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, category, location..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          {(['all', 'rentals', 'jobs', 'services'] as const).map(mod => (
            <button
              key={mod}
              type="button"
              onClick={() => setModuleFilter(mod)}
              className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                moduleFilter === mod ? 'bg-[#1464F4] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {mod}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Listing Title & Category</th>
                <th className="py-3.5 px-4">Module</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Posted Date</th>
                <th className="py-3.5 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredListings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    No listings found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredListings.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div className="overflow-hidden">
                          <div className="font-bold text-slate-900 truncate max-w-xs">{item.title}</div>
                          <div className="text-[11px] text-slate-500 font-semibold">{item.category}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-xl font-bold text-[10px] uppercase ${
                        item.module === 'rentals' ? 'bg-blue-100 text-[#1464F4]' :
                        item.module === 'jobs' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {item.module}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[120px]">{item.location}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      Rs. {item.price} {item.pricePeriod && <span className="text-[10px] text-slate-400 font-normal">/{item.pricePeriod}</span>}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider inline-block ${
                        item.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                        item.status === 'pending' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                        item.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {item.postedDate}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedModerationListing(item)}
                          className="px-3 py-1.5 rounded-xl bg-[#1464F4] hover:bg-[#1052cd] text-white font-bold text-xs transition-all shadow-sm"
                        >
                          Review
                        </button>

                        {item.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => handleQuickApprove(item.id)}
                            className="p-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-bold text-xs"
                            title="Quick Approve"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteListing(item.id, item.title)}
                          className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs"
                          title="Delete Listing"
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
      </div>

      {/* Moderation Modal Drawer */}
      {selectedModerationListing && (
        <ListingModerationModal
          listing={selectedModerationListing}
          staff={staff}
          onClose={() => setSelectedModerationListing(null)}
          onActionCompleted={refreshData}
        />
      )}

    </div>
  );
};
