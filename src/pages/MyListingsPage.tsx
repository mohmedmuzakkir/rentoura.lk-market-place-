import React, { useState, useMemo } from 'react';
import { Plus, Check, Sparkles, X, ShieldAlert } from 'lucide-react';
import { UserListingItem, UserListingStatus } from '../types/profileTypes';
import { AppRoute } from '../types';
import { MyListingsHeader } from '../components/my-listings/MyListingsHeader';
import { MyListingsHero } from '../components/my-listings/MyListingsHero';
import { MyListingsStatsBar, StatusFilterType } from '../components/my-listings/MyListingsStatsBar';
import { MyListingsModuleTabs, ModuleTabType } from '../components/my-listings/MyListingsModuleTabs';
import { MyListingsSearchBar, SortOptionType } from '../components/my-listings/MyListingsSearchBar';
import { MyListingCard } from '../components/my-listings/MyListingCard';
import { DeleteListingDialog } from '../components/my-listings/DeleteListingDialog';
import { ListingStatusModal } from '../components/my-listings/ListingStatusModal';
import { ListingFilterModal, MyListingsFilterOptions } from '../components/my-listings/ListingFilterModal';
import { QuickEditListingModal } from '../components/my-listings/QuickEditListingModal';
import { EmptyMyListingsState } from '../components/my-listings/EmptyMyListingsState';

interface MyListingsPageProps {
  listings: UserListingItem[];
  onNavigate: (route: AppRoute) => void;
  onOpenListingDetail: (listingId: string, module?: 'rentals' | 'jobs' | 'services') => void;
  onDeleteListing: (listingId: string) => void;
  onUpdateListing: (updated: UserListingItem) => void;
  onUpdateListingStatus: (listingId: string, status: UserListingStatus, note?: string) => void;
  unreadNotificationsCount?: number;
  initialStatusFilter?: StatusFilterType;
  initialModuleFilter?: ModuleTabType;
}

export const MyListingsPage: React.FC<MyListingsPageProps> = ({
  listings,
  onNavigate,
  onOpenListingDetail,
  onDeleteListing,
  onUpdateListing,
  onUpdateListingStatus,
  unreadNotificationsCount = 0,
  initialStatusFilter = 'all',
  initialModuleFilter = 'all'
}) => {
  // Filter States
  const [selectedModule, setSelectedModule] = useState<ModuleTabType>(initialModuleFilter);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilterType>(initialStatusFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOptionType>('newest');
  const [locationFilter, setLocationFilter] = useState('All Locations');

  // Modal States
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [statusModalListing, setStatusModalListing] = useState<UserListingItem | null>(null);
  const [editModalListing, setEditModalListing] = useState<UserListingItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [boostListing, setBoostListing] = useState<UserListingItem | null>(null);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ==========================================
  // 1. DERIVE ALL STATUS COUNTS (SSOT)
  // ==========================================
  const totalCount = listings.length;
  const activeCount = listings.filter(l => l.status === 'active').length;
  const pendingCount = listings.filter(l => l.status === 'pending').length;
  const rejectedCount = listings.filter(l => l.status === 'rejected').length;
  const expiredCount = listings.filter(l => l.status === 'expired').length;

  // ==========================================
  // 2. FILTER & SORT LISTINGS
  // ==========================================
  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      // Module filter
      if (selectedModule !== 'all' && item.module !== selectedModule) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && item.status !== selectedStatus) {
        return false;
      }

      // Location filter
      if (locationFilter && locationFilter !== 'All Locations') {
        if (!item.location.toLowerCase().includes(locationFilter.toLowerCase())) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        const matchLoc = item.location.toLowerCase().includes(q);
        const matchComp = item.companyName?.toLowerCase().includes(q);
        const matchProv = item.providerName?.toLowerCase().includes(q);
        const matchTag = item.tags?.some(t => t.toLowerCase().includes(q));

        if (!matchTitle && !matchCat && !matchLoc && !matchComp && !matchProv && !matchTag) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Sorting
      if (sortBy === 'newest') {
        return (new Date(b.createdAt || b.postedDate).getTime() || 0) - (new Date(a.createdAt || a.postedDate).getTime() || 0);
      }
      if (sortBy === 'oldest') {
        return (new Date(a.createdAt || a.postedDate).getTime() || 0) - (new Date(b.createdAt || b.postedDate).getTime() || 0);
      }
      if (sortBy === 'most_viewed') {
        return (b.viewsCount || 0) - (a.viewsCount || 0);
      }
      if (sortBy === 'price_asc' || sortBy === 'price_desc') {
        const getNumericPrice = (p: string) => {
          const digits = p.replace(/[^0-9]/g, '');
          return parseInt(digits, 10) || 0;
        };
        const priceA = getNumericPrice(a.price);
        const priceB = getNumericPrice(b.price);
        return sortBy === 'price_asc' ? priceA - priceB : priceB - priceA;
      }
      return 0;
    });
  }, [listings, selectedModule, selectedStatus, locationFilter, searchQuery, sortBy]);

  // ==========================================
  // 3. ACTION HANDLERS
  // ==========================================
  const handleConfirmDelete = () => {
    if (deleteTarget) {
      onDeleteListing(deleteTarget.id);
      showToast('Listing deleted');
      setDeleteTarget(null);
    }
  };

  const handleTogglePause = (listingId: string, currentStatus: UserListingStatus) => {
    if (currentStatus === 'active') {
      onUpdateListingStatus(listingId, 'paused', 'Paused by owner');
      showToast('Listing paused');
    } else if (currentStatus === 'paused') {
      onUpdateListingStatus(listingId, 'active');
      showToast('Listing resumed & active');
    }
  };

  const handleSaveListingEdits = (updated: UserListingItem) => {
    onUpdateListing(updated);
    if (updated.status === 'pending') {
      showToast('Listing resubmitted for review');
    } else {
      showToast('Listing updated successfully');
    }
  };

  const handleClearAllFilters = () => {
    setSelectedModule('all');
    setSelectedStatus('all');
    setLocationFilter('All Locations');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-xs text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-800 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header with Back, Centered Logo, Search, and Notification Bell */}
      <MyListingsHeader
        onBack={() => onNavigate('/profile')}
        onNavigate={onNavigate}
        isSearchOpen={isSearchOpen}
        onToggleSearch={() => setIsSearchOpen(!isSearchOpen)}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      {/* Main Container */}
      <main className="max-w-xl mx-auto px-4 py-4 space-y-4">
        {/* Hero Section */}
        <MyListingsHero />

        {/* Status Statistics Compact Cards (Interactive) */}
        <MyListingsStatsBar
          totalCount={totalCount}
          activeCount={activeCount}
          pendingCount={pendingCount}
          rejectedCount={rejectedCount}
          expiredCount={expiredCount}
          selectedStatus={selectedStatus}
          onSelectStatus={(status) => setSelectedStatus(status)}
        />

        {/* Module Filter Tabs + Filter Drawer Trigger */}
        <MyListingsModuleTabs
          activeTab={selectedModule}
          onSelectTab={(tab) => setSelectedModule(tab)}
          onOpenFilters={() => setIsFilterModalOpen(true)}
          isFilterActive={locationFilter !== 'All Locations' || selectedStatus !== 'all'}
        />

        {/* Search Bar + Sort Header */}
        <MyListingsSearchBar
          totalFound={filteredListings.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          isSearchOpen={isSearchOpen}
          onCloseSearch={() => setIsSearchOpen(false)}
        />

        {/* Listings Feed */}
        {filteredListings.length > 0 ? (
          <div className="space-y-3">
            {filteredListings.map(listing => (
              <MyListingCard
                key={listing.id}
                listing={listing}
                onView={(id, mod) => onOpenListingDetail(id, mod)}
                onEdit={(item) => setEditModalListing(item)}
                onDelete={(id, title) => setDeleteTarget({ id, title })}
                onViewStatusModal={(item) => setStatusModalListing(item)}
                onTogglePause={handleTogglePause}
                onBoost={(item) => setBoostListing(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyMyListingsState
            filterStatus={selectedStatus}
            filterModule={selectedModule}
            searchQuery={searchQuery}
            onClearFilters={handleClearAllFilters}
            onNavigate={onNavigate}
          />
        )}

        {/* Bottom CTA Banner (Matching reference image) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
          <div className="text-center sm:text-left space-y-0.5">
            <h4 className="text-sm sm:text-base font-bold text-slate-900">
              Want to list something new?
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Reach thousands of users today.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/post')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1464F4] hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Listing</span>
          </button>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <DeleteListingDialog
        isOpen={!!deleteTarget}
        listingTitle={deleteTarget?.title || ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Moderation Status / Review Details Modal */}
      <ListingStatusModal
        isOpen={!!statusModalListing}
        listing={statusModalListing}
        onClose={() => setStatusModalListing(null)}
        onEditAndResubmit={(item) => {
          setStatusModalListing(null);
          setEditModalListing(item);
        }}
      />

      {/* Filter Drawer / Modal */}
      <ListingFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={{
          module: selectedModule,
          status: selectedStatus,
          location: locationFilter
        }}
        onApply={(newFilters: MyListingsFilterOptions) => {
          setSelectedModule(newFilters.module);
          setSelectedStatus(newFilters.status);
          setLocationFilter(newFilters.location);
        }}
        onReset={handleClearAllFilters}
      />

      {/* Quick Edit Listing Modal */}
      <QuickEditListingModal
        isOpen={!!editModalListing}
        listing={editModalListing}
        onClose={() => setEditModalListing(null)}
        onSave={handleSaveListingEdits}
      />

      {/* Boost Informational Modal */}
      {boostListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1464F4] mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Boost Listing Visibility
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Featured promotional boosts will pin "{boostListing.title}" to the top of category searches and marketplace feeds.
            </p>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4 text-left text-xs space-y-1.5 text-slate-600">
              <div className="flex items-center justify-between">
                <span>Priority Placement</span>
                <span className="font-bold text-emerald-600">✓ Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Featured Badge</span>
                <span className="font-bold text-blue-600">✓ Highlighted</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Est. Extra Reach</span>
                <span className="font-bold text-slate-900">+350% Views</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setBoostListing(null)}
                className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setBoostListing(null);
                  showToast('Boost activated for listing');
                }}
                className="py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-[#1464F4] hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
              >
                Activate Boost
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
