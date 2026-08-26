import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Search, 
  Bell, 
  SlidersHorizontal, 
  Bookmark, 
  Home, 
  Briefcase, 
  Wrench, 
  ChevronRight, 
  MapPin, 
  MoreVertical,
  Maximize2,
  Bed,
  Bath,
  Fuel,
  Gauge,
  Users,
  Car,
  Snowflake,
  Clock,
  Trash2,
  AlertTriangle,
  Loader2,
  X,
  CheckCircle2
} from 'lucide-react';
import { RentouraLogo } from '../components/RentouraLogo';
import { AppRoute } from '../types';
import { 
  SavedRentalItem, 
  SavedJobItem, 
  SavedServiceItem,
  SavedUnavailableItem 
} from '../types/savedTypes';
import { SavedListingService } from '../services/savedListingService';

interface SavedPageProps {
  savedListings: string[];
  onToggleSave: (listingId: string) => Promise<boolean | void> | void;
  onNavigate: (route: AppRoute) => void;
  onOpenListingDetail?: (id: string, module?: 'rentals' | 'jobs' | 'services') => void;
  notificationCount?: number;
}

type TabType = 'all' | 'rentals' | 'jobs' | 'services' | 'unavailable';

export const SavedPage: React.FC<SavedPageProps> = ({
  savedListings,
  onToggleSave,
  onNavigate,
  onOpenListingDetail,
  notificationCount = 0
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // DB Fetched Saved State
  const [isLoading, setIsLoading] = useState(true);
  const [dbSavedRentals, setDbSavedRentals] = useState<SavedRentalItem[]>([]);
  const [dbSavedJobs, setDbSavedJobs] = useState<SavedJobItem[]>([]);
  const [dbSavedServices, setDbSavedServices] = useState<SavedServiceItem[]>([]);
  const [dbSavedUnavailable, setDbSavedUnavailable] = useState<SavedUnavailableItem[]>([]);

  // Feedback Toasts & Modals
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showClearUnavailableModal, setShowClearUnavailableModal] = useState(false);
  const [isClearingUnavailable, setIsClearingUnavailable] = useState(false);

  // Fetch full details from Supabase
  const loadSavedDetails = async () => {
    setIsLoading(true);
    try {
      const res = await SavedListingService.getSavedListingsWithDetails();
      setDbSavedRentals(res.rentals);
      setDbSavedJobs(res.jobs);
      setDbSavedServices(res.services);
      setDbSavedUnavailable(res.unavailable);
    } catch (err) {
      console.error('Failed to load saved listings from Supabase:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSavedDetails();
  }, [savedListings]);

  // Handle Unsave with optimistic UI and error rollback
  const handleUnsave = async (id: string, moduleType: 'rental' | 'job' | 'service' | 'unavailable') => {
    // Save current backup state for rollback
    const backupRentals = [...dbSavedRentals];
    const backupJobs = [...dbSavedJobs];
    const backupServices = [...dbSavedServices];
    const backupUnavailable = [...dbSavedUnavailable];

    // Optimistically remove from state
    if (moduleType === 'rental') {
      setDbSavedRentals(prev => prev.filter(item => item.id !== id));
    } else if (moduleType === 'job') {
      setDbSavedJobs(prev => prev.filter(item => item.id !== id));
    } else if (moduleType === 'service') {
      setDbSavedServices(prev => prev.filter(item => item.id !== id));
    } else {
      setDbSavedUnavailable(prev => prev.filter(item => item.listingId !== id));
    }

    try {
      const res = await SavedListingService.toggleSaveListing(id);
      if (res.error) {
        throw new Error(res.error);
      }
      setToastMessage({ text: 'Listing removed from saved items', type: 'success' });
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: any) {
      // Rollback optimistic removal
      setDbSavedRentals(backupRentals);
      setDbSavedJobs(backupJobs);
      setDbSavedServices(backupServices);
      setDbSavedUnavailable(backupUnavailable);
      setToastMessage({ 
        text: err?.message || 'Database error: Could not remove saved listing. Please try again.', 
        type: 'error' 
      });
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  // Handle Bulk Clear Unavailable
  const handleClearUnavailable = async () => {
    if (dbSavedUnavailable.length === 0) return;
    setIsClearingUnavailable(true);
    const unavailableIds = dbSavedUnavailable.map(u => u.listingId);

    try {
      const result = await SavedListingService.clearUnavailableSavedListings(unavailableIds);
      if (!result.success) {
        throw new Error(result.error);
      }
      setDbSavedUnavailable([]);
      setShowClearUnavailableModal(false);
      setToastMessage({ text: 'Unavailable listings cleared successfully', type: 'success' });
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: any) {
      setToastMessage({ text: err?.message || 'Failed to clear unavailable listings', type: 'error' });
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setIsClearingUnavailable(false);
    }
  };

  // Filter rentals by search query
  const filteredRentals = useMemo(() => {
    if (!searchQuery.trim()) return dbSavedRentals;
    const q = searchQuery.toLowerCase();
    return dbSavedRentals.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.location.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  }, [dbSavedRentals, searchQuery]);

  // Filter jobs by search query
  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return dbSavedJobs;
    const q = searchQuery.toLowerCase();
    return dbSavedJobs.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.company.toLowerCase().includes(q) || 
      item.location.toLowerCase().includes(q)
    );
  }, [dbSavedJobs, searchQuery]);

  // Filter services by search query
  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return dbSavedServices;
    const q = searchQuery.toLowerCase();
    return dbSavedServices.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.providerName.toLowerCase().includes(q) || 
      item.location.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  }, [dbSavedServices, searchQuery]);

  const totalSavedCount = dbSavedRentals.length + dbSavedJobs.length + dbSavedServices.length + dbSavedUnavailable.length;

  const renderSpecIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bed': return <Bed className="w-3.5 h-3.5" />;
      case 'Bath': return <Bath className="w-3.5 h-3.5" />;
      case 'Maximize2': return <Maximize2 className="w-3.5 h-3.5" />;
      case 'Fuel': return <Fuel className="w-3.5 h-3.5" />;
      case 'Gauge': return <Gauge className="w-3.5 h-3.5" />;
      case 'Users': return <Users className="w-3.5 h-3.5" />;
      case 'Car': return <Car className="w-3.5 h-3.5" />;
      case 'Snowflake': return <Snowflake className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-28">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-4 ${
          toastMessage.type === 'error' ? 'bg-rose-900 text-white' : 'bg-slate-900 text-white'
        }`}>
          {toastMessage.type === 'error' ? (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Back button */}
          <button
            onClick={() => onNavigate('/')}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors tap-bounce shrink-0"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Centered Logo */}
          <div className="cursor-pointer" onClick={() => onNavigate('/')}>
            <RentouraLogo variant="header" theme="light" />
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors tap-bounce ${
                showSearch ? 'bg-[#1464F4] text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              aria-label="Search"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            <button
              onClick={() => onNavigate('/notifications')}
              className="relative w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors tap-bounce"
              aria-label="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {notificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 bg-[#1464F4] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {notificationCount}
                </span>
              )}
            </button>

            {totalSavedCount > 0 && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors tap-bounce ${
                  showFilters ? 'bg-[#1464F4] text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                aria-label="Filters"
              >
                <SlidersHorizontal className="w-4.5 h-4.5" />
              </button>
            )}
          </div>
        </div>

        {/* Expandable Search Input */}
        {showSearch && (
          <div className="max-w-4xl mx-auto mt-2 pt-2 border-t border-slate-100">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search your saved listings by title, location or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1464F4]/20 border border-slate-200"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 pt-4 space-y-4">
        {/* Title Header Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-[#1464F4] flex items-center justify-center shrink-0">
              <Bookmark className="w-6 h-6 fill-[#1464F4]/20 text-[#1464F4]" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-heading text-slate-900 tracking-tight leading-none">
                Saved Listings
              </h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                All your favorite rentals, jobs and services saved in one place.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2.5 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/80">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Saved</div>
              <div className="text-sm font-black text-slate-900 font-heading leading-tight">{totalSavedCount}</div>
            </div>
          </div>
        </div>

        {/* Unavailable Items Banner & Bulk Clear Button */}
        {dbSavedUnavailable.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900 font-heading">
                  {dbSavedUnavailable.length} listing{dbSavedUnavailable.length > 1 ? 's are' : ' is'} no longer available
                </h4>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Some saved items were deleted or deactivated by their owners.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowClearUnavailableModal(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shrink-0 tap-bounce shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Unavailable ({dbSavedUnavailable.length})</span>
            </button>
          </div>
        )}

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap tap-bounce flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-[#1464F4] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            All Saved ({totalSavedCount})
          </button>
          
          <button
            onClick={() => setActiveTab('rentals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap tap-bounce flex items-center gap-1.5 ${
              activeTab === 'rentals'
                ? 'bg-[#1464F4] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            Rentals ({filteredRentals.length})
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap tap-bounce flex items-center gap-1.5 ${
              activeTab === 'jobs'
                ? 'bg-[#08A34F] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            Jobs ({filteredJobs.length})
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap tap-bounce flex items-center gap-1.5 ${
              activeTab === 'services'
                ? 'bg-[#FF650A] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            Services ({filteredServices.length})
          </button>

          {dbSavedUnavailable.length > 0 && (
            <button
              onClick={() => setActiveTab('unavailable')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap tap-bounce flex items-center gap-1.5 ${
                activeTab === 'unavailable'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              Unavailable ({dbSavedUnavailable.length})
            </button>
          )}
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="py-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <Loader2 className="w-8 h-8 text-[#1464F4] animate-spin mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-500">Loading your saved listings from database...</p>
          </div>
        )}

        {/* Global Empty State */}
        {!isLoading && totalSavedCount === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-xs">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Heart className="w-8 h-8 fill-rose-500/20 text-rose-500" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg font-heading">No saved listings yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
              Tap the heart icon on any rental property, vehicle, job post, or service provider to save it here.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={() => onNavigate('/rentals')}
                className="px-4 py-2 rounded-xl bg-[#1464F4] text-white text-xs font-bold tap-bounce shadow-xs hover:bg-blue-600 transition-colors flex items-center gap-1.5"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Browse Rentals</span>
              </button>

              <button
                onClick={() => onNavigate('/jobs')}
                className="px-4 py-2 rounded-xl bg-[#08A34F] text-white text-xs font-bold tap-bounce shadow-xs hover:bg-emerald-600 transition-colors flex items-center gap-1.5"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Browse Jobs</span>
              </button>

              <button
                onClick={() => onNavigate('/services')}
                className="px-4 py-2 rounded-xl bg-[#FF650A] text-white text-xs font-bold tap-bounce shadow-xs hover:bg-orange-600 transition-colors flex items-center gap-1.5"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Browse Services</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= SECTION 1: RENTALS SAVED ================= */}
        {!isLoading && (activeTab === 'all' || activeTab === 'rentals') && filteredRentals.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1464F4] flex items-center justify-center">
                  <Home className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold font-heading text-slate-900">
                  Rental Saved
                </h2>
              </div>
              {activeTab === 'all' && (
                <button
                  onClick={() => setActiveTab('rentals')}
                  className="text-xs font-bold text-[#1464F4] hover:underline flex items-center gap-1"
                >
                  View All ({filteredRentals.length}) <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {filteredRentals.map((rental) => (
                <div
                  key={rental.id}
                  onClick={() => onOpenListingDetail ? onOpenListingDetail(rental.id, 'rentals') : onNavigate(`/rentals/${rental.id}` as AppRoute)}
                  className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 flex items-center justify-center">
                    {rental.imageUrl ? (
                      <img
                        src={rental.imageUrl}
                        alt={rental.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                        <Home className="w-8 h-8 stroke-1 text-slate-400 mb-1" />
                        <span className="text-[10px] font-medium">No Image Uploaded</span>
                      </div>
                    )}
                    
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-[#1464F4] text-white text-[10px] font-extrabold uppercase rounded tracking-wider shadow-xs">
                      {rental.categoryType || 'RENTAL'}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnsave(rental.id, 'rental');
                      }}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs text-[#1464F4] hover:bg-white flex items-center justify-center transition-all shadow-xs tap-bounce"
                      aria-label="Unsave listing"
                      title="Unsave listing"
                    >
                      <Heart className="w-4 h-4 fill-[#1464F4] text-[#1464F4]" />
                    </button>

                    {rental.photoCount && (
                      <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-semibold rounded">
                        {rental.photoCount}
                      </div>
                    )}
                  </div>

                  <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h3 className="font-bold text-slate-900 text-sm font-heading line-clamp-1 group-hover:text-[#1464F4] transition-colors">
                          {rental.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1 text-slate-500 text-[11px] mt-1 font-medium">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{rental.location}</span>
                      </div>
                    </div>

                    <div className="pt-1">
                      <div className="text-sm font-extrabold text-[#1464F4] font-heading">
                        {rental.price}{' '}
                        <span className="text-[11px] font-normal text-slate-500">
                          {rental.pricePeriod}
                        </span>
                      </div>

                      {rental.specs && rental.specs.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          {rental.specs.map((spec, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-semibold"
                            >
                              {renderSpecIcon(spec.icon)}
                              {spec.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= SECTION 2: JOBS SAVED ================= */}
        {!isLoading && (activeTab === 'all' || activeTab === 'jobs') && filteredJobs.length > 0 && (
          <section className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#08A34F] flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold font-heading text-slate-900">
                  Jobs Saved
                </h2>
              </div>
              {activeTab === 'all' && (
                <button
                  onClick={() => setActiveTab('jobs')}
                  className="text-xs font-bold text-[#08A34F] hover:underline flex items-center gap-1"
                >
                  View All ({filteredJobs.length}) <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => onOpenListingDetail ? onOpenListingDetail(job.id, 'jobs') : onNavigate(`/jobs/${job.id}` as AppRoute)}
                  className="group bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {job.logoUrl ? (
                      <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
                        <img src={job.logoUrl} alt={job.company} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#08A34F] flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-100">
                        {job.company ? job.company.charAt(0).toUpperCase() : 'J'}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-sm font-heading truncate group-hover:text-[#08A34F] transition-colors">
                          {job.title}
                        </h3>
                        <span className="px-2 py-0.5 bg-emerald-50 text-[#08A34F] text-[10px] font-bold rounded-full shrink-0">
                          {job.jobType}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 font-medium">
                        <span className="text-slate-700 font-semibold truncate">{job.company}</span>
                        <span className="text-slate-300">•</span>
                        <div className="flex items-center gap-0.5 shrink-0">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{job.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <div className="text-xs font-bold text-slate-900 font-heading">
                          {job.salary}{' '}
                          <span className="text-[10px] font-normal text-slate-500">
                            {job.salaryPeriod}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {job.postedTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnsave(job.id, 'job');
                      }}
                      className="w-8 h-8 rounded-full bg-emerald-50 text-[#08A34F] hover:bg-emerald-100 flex items-center justify-center transition-colors tap-bounce"
                      aria-label="Unsave Job"
                      title="Unsave Job"
                    >
                      <Heart className="w-4 h-4 fill-[#08A34F] text-[#08A34F]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= SECTION 3: SERVICES SAVED ================= */}
        {!isLoading && (activeTab === 'all' || activeTab === 'services') && filteredServices.length > 0 && (
          <section className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#FF650A] flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold font-heading text-slate-900">
                  Services Saved
                </h2>
              </div>
              {activeTab === 'all' && (
                <button
                  onClick={() => setActiveTab('services')}
                  className="text-xs font-bold text-[#FF650A] hover:underline flex items-center gap-1"
                >
                  View All ({filteredServices.length}) <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => onOpenListingDetail ? onOpenListingDetail(service.id, 'services') : onNavigate(`/services/${service.id}` as AppRoute)}
                  className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-orange-300 transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 flex items-center justify-center">
                    {service.imageUrl ? (
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400 p-3 text-center">
                        <Wrench className="w-7 h-7 stroke-1 text-slate-400 mb-1" />
                        <span className="text-[9px] font-medium">Service Provider</span>
                      </div>
                    )}

                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-[#FF650A] text-white text-[10px] font-extrabold uppercase rounded tracking-wider shadow-xs">
                      SERVICE
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnsave(service.id, 'service');
                      }}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs text-[#1464F4] hover:bg-white flex items-center justify-center transition-all shadow-xs tap-bounce"
                      aria-label="Unsave service"
                      title="Unsave service"
                    >
                      <Heart className="w-4 h-4 fill-[#1464F4] text-[#1464F4]" />
                    </button>
                  </div>

                  <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs font-heading line-clamp-1 group-hover:text-[#FF650A] transition-colors">
                        {service.title}
                      </h3>
                      <div className="text-[11px] text-slate-500 font-medium truncate">
                        {service.providerName}
                      </div>
                    </div>

                    <div className="text-xs font-extrabold text-[#1464F4] font-heading pt-1">
                      {service.price}{' '}
                      <span className="text-[10px] font-normal text-slate-500">
                        {service.priceUnit}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= SECTION 4: UNAVAILABLE LISTINGS ================= */}
        {!isLoading && (activeTab === 'all' || activeTab === 'unavailable') && dbSavedUnavailable.length > 0 && (
          <section className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold font-heading text-slate-900">
                  Unavailable Saved Listings
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dbSavedUnavailable.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex items-center justify-between gap-3 text-slate-500"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-700 font-heading">
                      Listing No Longer Available
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      This item was deleted or deactivated by its owner.
                    </p>
                  </div>

                  <button
                    onClick={() => handleUnsave(item.listingId, 'unavailable')}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-1 transition-all tap-bounce shrink-0"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Confirmation Modal for Clear Unavailable */}
      {showClearUnavailableModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-xs w-full shadow-2xl border border-slate-200 text-center animate-in zoom-in-95">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 font-heading">Clear unavailable listings?</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              This will remove {dbSavedUnavailable.length} listing{dbSavedUnavailable.length > 1 ? 's' : ''} from your saved items. Active listings will remain untouched.
            </p>

            <div className="grid grid-cols-2 gap-2.5 mt-4">
              <button
                onClick={() => setShowClearUnavailableModal(false)}
                disabled={isClearingUnavailable}
                className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleClearUnavailable}
                disabled={isClearingUnavailable}
                className="py-2.5 px-3 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {isClearingUnavailable ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
