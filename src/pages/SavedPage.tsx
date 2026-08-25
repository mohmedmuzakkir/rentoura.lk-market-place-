import React, { useState } from 'react';
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
  ExternalLink,
  Trash2
} from 'lucide-react';
import { RentouraLogo } from '../components/RentouraLogo';
import { AppRoute } from '../types';
import { 
  getSavedRentals,
  getSavedJobs,
  getSavedServices,
  SavedRentalItem,
  SavedJobItem,
  SavedServiceItem
} from '../data/savedListingsData';
import { SavedListingService } from '../services/savedListingService';

interface SavedPageProps {
  savedListings: string[];
  onToggleSave: (listingId: string) => void;
  onNavigate: (route: AppRoute) => void;
  onOpenListingDetail?: (id: string, module?: 'rentals' | 'jobs' | 'services') => void;
  notificationCount?: number;
}

type TabType = 'all' | 'rentals' | 'jobs' | 'services';

export const SavedPage: React.FC<SavedPageProps> = ({
  savedListings,
  onToggleSave,
  onNavigate,
  onOpenListingDetail,
  notificationCount = 3
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const [dbSavedRentals, setDbSavedRentals] = useState<SavedRentalItem[]>([]);
  const [dbSavedJobs, setDbSavedJobs] = useState<SavedJobItem[]>([]);
  const [dbSavedServices, setDbSavedServices] = useState<SavedServiceItem[]>([]);

  React.useEffect(() => {
    SavedListingService.getSavedListingsWithDetails().then(res => {
      setDbSavedRentals(res.rentals);
      setDbSavedJobs(res.jobs);
      setDbSavedServices(res.services);
    });
  }, [savedListings]);

  // Filter saved rentals
  const staticRentals = getSavedRentals(savedListings);
  const combinedRentals = [...staticRentals, ...dbSavedRentals.filter(d => !staticRentals.some(s => s.id === d.id))];
  const savedRentals = combinedRentals.filter(item => 
    !searchQuery || 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter saved jobs
  const staticJobs = getSavedJobs(savedListings);
  const combinedJobs = [...staticJobs, ...dbSavedJobs.filter(d => !staticJobs.some(s => s.id === d.id))];
  const savedJobs = combinedJobs.filter(item => 
    !searchQuery || 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter saved services
  const staticServices = getSavedServices(savedListings);
  const combinedServices = [...staticServices, ...dbSavedServices.filter(d => !staticServices.some(s => s.id === d.id))];
  const savedServices = combinedServices.filter(item => 
    !searchQuery || 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.providerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSavedCount = combinedRentals.length + combinedJobs.length + combinedServices.length;

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

  const renderCompanyLogo = (logoType?: string, companyName?: string) => {
    if (logoType === 'microsoft') {
      return (
        <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center p-2 shrink-0 shadow-xs">
          <div className="grid grid-cols-2 gap-1 w-6 h-6">
            <div className="bg-[#F25022] rounded-[2px]" />
            <div className="bg-[#7FBA00] rounded-[2px]" />
            <div className="bg-[#00A4EF] rounded-[2px]" />
            <div className="bg-[#FFB900] rounded-[2px]" />
          </div>
        </div>
      );
    }
    if (logoType === 'wso2') {
      return (
        <div className="w-11 h-11 rounded-xl bg-[#FF7300] flex items-center justify-center font-black text-white text-xs shrink-0 shadow-xs tracking-tight">
          WSO2
        </div>
      );
    }
    if (logoType === 'ey') {
      return (
        <div className="w-11 h-11 rounded-xl bg-[#2E2E38] flex items-center justify-center font-black text-[#FFE600] text-sm shrink-0 shadow-xs">
          EY
        </div>
      );
    }
    if (logoType === 'daraz') {
      return (
        <div className="w-11 h-11 rounded-xl bg-[#FF4500] flex items-center justify-center font-black text-white text-xs shrink-0 shadow-xs">
          daraz
        </div>
      );
    }
    return (
      <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#1464F4] flex items-center justify-center font-bold text-sm shrink-0 border border-blue-100">
        {companyName ? companyName.charAt(0) : 'J'}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-28">
      {/* Top Header Bar matching Image 1 */}
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
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors tap-bounce"
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

            <button
              onClick={() => onNavigate('/filters')}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors tap-bounce"
              aria-label="Filters"
            >
              <SlidersHorizontal className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Expandable Search Input */}
        {showSearch && (
          <div className="max-w-4xl mx-auto mt-2 pt-2 border-t border-slate-100">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search your saved listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1464F4]/20 border border-slate-200"
                autoFocus
              />
            </div>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 pt-4 space-y-4">
        {/* Title Header Card matching Image 1 */}
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

        {/* Tab Filters matching Image 1 */}
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
            Rentals ({savedRentals.length})
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap tap-bounce flex items-center gap-1.5 ${
              activeTab === 'jobs'
                ? 'bg-[#08A34F] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            Jobs ({savedJobs.length})
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap tap-bounce flex items-center gap-1.5 ${
              activeTab === 'services'
                ? 'bg-[#FF650A] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            Services ({savedServices.length})
          </button>
        </div>

        {/* Global Empty State */}
        {totalSavedCount === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-xs">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Heart className="w-8 h-8 fill-rose-500/20 text-rose-500" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg font-heading">No saved listings yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Tap the heart icon on any rental, job, or service listing to save it here for quick access later.
            </p>
            <button
              onClick={() => onNavigate('/')}
              className="mt-5 px-6 py-2.5 rounded-xl bg-[#1464F4] text-white text-xs font-bold tap-bounce shadow-xs hover:bg-blue-600 transition-colors"
            >
              Explore Listings
            </button>
          </div>
        )}

        {/* ================= SECTION 1: RENTALS SAVED ================= */}
        {(activeTab === 'all' || activeTab === 'rentals') && savedRentals.length > 0 && (
          <section className="space-y-3">
            {/* Section Header */}
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
                  View All ({savedRentals.length}) <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Rentals Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {savedRentals.map((rental) => (
                <div
                  key={rental.id}
                  onClick={() => onOpenListingDetail && onOpenListingDetail(rental.id, 'rentals')}
                  className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={rental.imageUrl}
                      alt={rental.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Badge RENTAL */}
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-[#1464F4] text-white text-[10px] font-extrabold uppercase rounded tracking-wider shadow-xs">
                      RENTAL
                    </div>

                    {/* Heart Unsave Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(rental.id);
                      }}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs text-[#1464F4] hover:bg-white flex items-center justify-center transition-all shadow-xs tap-bounce"
                      aria-label="Unsave listing"
                    >
                      <Heart className="w-4 h-4 fill-[#1464F4] text-[#1464F4]" />
                    </button>

                    {/* Photo Count */}
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-semibold rounded">
                      {rental.photoCount}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h3 className="font-bold text-slate-900 text-sm font-heading line-clamp-1 group-hover:text-[#1464F4] transition-colors">
                          {rental.title}
                        </h3>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="text-slate-400 hover:text-slate-600 p-0.5 -mr-1"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-1 text-slate-500 text-[11px] mt-1 font-medium">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{rental.location}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="pt-1">
                      <div className="text-sm font-extrabold text-[#1464F4] font-heading">
                        {rental.price}{' '}
                        <span className="text-[11px] font-normal text-slate-500">
                          {rental.pricePeriod}
                        </span>
                      </div>

                      {/* Specs Row */}
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
        {(activeTab === 'all' || activeTab === 'jobs') && savedJobs.length > 0 && (
          <section className="space-y-3 pt-2">
            {/* Section Header */}
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
                  View All ({savedJobs.length}) <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Jobs List matching Image 1 */}
            <div className="space-y-2.5">
              {savedJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => onOpenListingDetail && onOpenListingDetail(job.id, 'jobs')}
                  className="group bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-between gap-3"
                >
                  {/* Left: Logo & Details */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {renderCompanyLogo(job.logoType, job.company)}

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

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(job.id);
                      }}
                      className="w-8 h-8 rounded-full bg-emerald-50 text-[#08A34F] hover:bg-emerald-100 flex items-center justify-center transition-colors tap-bounce"
                      aria-label="Unsave Job"
                    >
                      <Heart className="w-4 h-4 fill-[#08A34F] text-[#08A34F]" />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= SECTION 3: SERVICES SAVED ================= */}
        {(activeTab === 'all' || activeTab === 'services') && savedServices.length > 0 && (
          <section className="space-y-3 pt-2">
            {/* Section Header */}
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
                  View All ({savedServices.length}) <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Services Grid matching Image 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
              {savedServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => onOpenListingDetail && onOpenListingDetail(service.id, 'services')}
                  className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-orange-300 transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* SERVICE Badge */}
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-[#FF650A] text-white text-[10px] font-extrabold uppercase rounded tracking-wider shadow-xs">
                      SERVICE
                    </div>

                    {/* Heart Unsave Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(service.id);
                      }}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs text-[#1464F4] hover:bg-white flex items-center justify-center transition-all shadow-xs tap-bounce"
                      aria-label="Unsave service"
                    >
                      <Heart className="w-4 h-4 fill-[#1464F4] text-[#1464F4]" />
                    </button>
                  </div>

                  {/* Body Content */}
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
      </main>
    </div>
  );
};
