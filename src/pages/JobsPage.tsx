import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Search, 
  ChevronDown, 
  SlidersHorizontal, 
  Briefcase, 
  Globe, 
  Building2, 
  MapPin, 
  Clock, 
  Heart, 
  Bookmark, 
  ArrowRight, 
  LayoutGrid,
  RefreshCw,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { 
  JOB_CATEGORIES
} from '../data/mockData';
import { AppRoute, JobItem, CompanyPartner } from '../types';
import { CompanyLogo } from '../components/BrandLogos';
import { CategoryService } from '../services/categoryService';
import { GlobalLocationModal } from '../components/common/GlobalLocationModal';
import { LocationValueModel } from '../services/locationService';
import { JobCategoryModal } from '../components/JobCategoryModal';
import { JobHeroCarousel } from '../components/JobHeroCarousel';
import { JobService, JobFeedParams } from '../services/jobService';
import { JobHeroSlide } from '../data/jobHeroSlidesData';
import { getCategoryIconComponent } from '../components/CategoryIcon';
import { SavedListingService } from '../services/savedListingService';

interface JobsPageProps {
  onNavigate: (route: AppRoute) => void;
  onOpenListingDetail?: (id: string, moduleHint?: 'rentals' | 'jobs' | 'services') => void;
  savedListings?: string[];
  onToggleSave?: (id: string) => void;
}

export const JobsPage: React.FC<JobsPageProps> = ({ 
  onNavigate, 
  onOpenListingDetail,
  savedListings = [],
  onToggleSave
}) => {
  // Main Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Sri Lanka');
  const [selectedLocationObj, setSelectedLocationObj] = useState<LocationValueModel | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const [selectedJobType, setSelectedJobType] = useState('All Types');
  const [selectedSalary, setSelectedSalary] = useState('Any Salary');
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [isRemoteOnly, setIsRemoteOnly] = useState(false);

  // Saved Jobs State
  const [savedJobs, setSavedJobs] = useState<string[]>(savedListings);

  // Modals & Dropdowns State
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'jobType' | 'salary' | null>(null);

  // Hero Slides & Companies State
  const [heroSlides, setHeroSlides] = useState<JobHeroSlide[]>([]);
  const [hiringCompanies, setHiringCompanies] = useState<CompanyPartner[]>([]);

  // Feed & Featured Items
  const [feedItems, setFeedItems] = useState<JobItem[]>([]);
  const [featuredItems, setFeaturedItems] = useState<JobItem[]>([]);
  const [totalJobsCount, setTotalJobsCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [feedLoading, setFeedLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 12;

  // Ref for Main Feed Anchor
  const feedRef = useRef<HTMLDivElement>(null);
  const companiesRef = useRef<HTMLDivElement>(null);

  // 1. Initial Load: Hero Slides, Companies, Saved Jobs
  useEffect(() => {
    let isMounted = true;

    JobService.getJobHeroSlides().then(slides => {
      if (isMounted) setHeroSlides(slides);
    });

    JobService.getHiringCompanies().then(comps => {
      if (isMounted) setHiringCompanies(comps);
    });

    JobService.getJobsFeed({ isFeaturedOnly: true, limit: 6 }).then(res => {
      if (isMounted) setFeaturedItems(res.items);
    });

    SavedListingService.getSavedListingIds().then(ids => {
      if (isMounted && ids.length > 0) {
        setSavedJobs(prev => Array.from(new Set([...prev, ...ids])));
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch Jobs Feed based on Filters & Page
  const fetchJobsFeed = useCallback(async (resetPage = false) => {
    setFeedLoading(true);
    const currentPage = resetPage ? 1 : page;
    if (resetPage) setPage(1);

    const params: JobFeedParams = {
      searchQuery,
      selectedLocation,
      selectedLocationObj,
      selectedCategory,
      selectedCategoryId,
      selectedJobType,
      selectedSalary,
      selectedCompany: selectedCompany || undefined,
      isRemoteOnly,
      offset: (currentPage - 1) * limit,
      limit
    };

    const result = await JobService.getJobsFeed(params);

    if (resetPage || currentPage === 1) {
      setFeedItems(result.items);
    } else {
      setFeedItems(prev => [...prev, ...result.items]);
    }

    setTotalJobsCount(result.totalCount);
    setHasMore(result.hasMore);
    setFeedLoading(false);
  }, [searchQuery, selectedLocation, selectedLocationObj, selectedCategory, selectedCategoryId, selectedJobType, selectedSalary, selectedCompany, isRemoteOnly, page]);

  // Re-fetch when any filter changes
  useEffect(() => {
    fetchJobsFeed(true);
  }, [searchQuery, selectedLocation, selectedLocationObj, selectedCategory, selectedCategoryId, selectedJobType, selectedSalary, selectedCompany, isRemoteOnly]);

  const handleLoadMore = () => {
    if (!feedLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  // Helper toggle save
  const toggleSaveJob = async (id: string) => {
    const res = await SavedListingService.toggleSaveListing(id);
    if (res.requiresLogin) {
      onNavigate('/login');
      return;
    }
    setSavedJobs(prev => res.saved ? [...prev, id] : prev.filter(item => item !== id));
    if (onToggleSave) {
      onToggleSave(id);
    }
  };

  // Check if any filter is active
  const isAnyFilterActive = 
    searchQuery.trim() !== '' ||
    selectedLocation !== 'All Sri Lanka' ||
    selectedCategory !== 'All Categories' ||
    selectedJobType !== 'All Types' ||
    selectedSalary !== 'Any Salary' ||
    selectedCompany !== null ||
    isRemoteOnly;

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedLocation('All Sri Lanka');
    setSelectedLocationObj(undefined);
    setSelectedCategory('All Categories');
    setSelectedCategoryId(undefined);
    setSelectedJobType('All Types');
    setSelectedSalary('Any Salary');
    setSelectedCompany(null);
    setIsRemoteOnly(false);
  };

  const scrollToFeed = () => {
    if (feedRef.current) {
      feedRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToCompanies = () => {
    if (companiesRef.current) {
      companiesRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const jobTypeOptions = ['All Types', 'Full Time', 'Part Time', 'Contract', 'Internship', 'Temporary', 'Remote'];
  const salaryOptions = ['Any Salary', '< Rs. 50,000', 'Rs. 50,000 - 100,000', 'Rs. 100,000 - 200,000', 'Rs. 200,000+'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-28 overflow-x-hidden selection:bg-[#08A34F] selection:text-white relative">
      
      {/* Invisible Overlay to close active dropdown when clicking outside */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 z-30 bg-transparent" 
          onClick={() => setActiveDropdown(null)} 
        />
      )}

      {/* 1. HERO SECTION & CAROUSEL */}
      <div className="bg-gradient-to-b from-[#021A12] via-[#04281A] to-[#0A3D29] pt-4 pb-8 px-4 sm:px-6 lg:px-8 text-white shadow-md">
        <div className="max-w-7xl mx-auto space-y-4">
          {heroSlides.length > 0 && (
            <JobHeroCarousel
              slides={heroSlides}
              onNavigate={onNavigate}
              onFilterRemote={() => {
                setIsRemoteOnly(true);
                scrollToFeed();
              }}
              onFilterCompanies={() => {
                scrollToCompanies();
              }}
              onFilterFastHiring={() => {
                setSelectedJobType('Full Time');
                scrollToFeed();
              }}
              onExploreAll={() => {
                handleClearAllFilters();
                scrollToFeed();
              }}
            />
          )}
        </div>
      </div>

      {/* 2. MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-6">
        
        {/* Floating Search & Filter Bar Card */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 shadow-lg border border-slate-200/90 space-y-3">
          {/* Search Input Bar */}
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3.5 py-2 border border-slate-200 focus-within:border-[#08A34F] focus-within:ring-2 focus-within:ring-[#08A34F]/20 transition-all">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search job title, company, skills, or keywords..."
              className="flex-1 bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none py-1 font-medium min-w-0"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full tap-bounce"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button 
              onClick={() => scrollToFeed()}
              className="px-4 py-2 rounded-xl bg-[#08A34F] hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 tap-bounce shrink-0 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Search Jobs</span>
            </button>
          </div>

          {/* Filter Control Pills Row */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap pb-1 text-xs">
            {/* Location Filter Pill */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all shrink-0 cursor-pointer tap-bounce ${
                selectedLocation !== 'All Sri Lanka'
                  ? 'bg-emerald-50 border-[#08A34F] text-[#08A34F] shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#08A34F] shrink-0" />
              <span className="text-slate-500 font-semibold hidden sm:inline">Location:</span>
              <span className="truncate max-w-[120px]">{selectedLocation}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {/* Category Filter Pill */}
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all shrink-0 cursor-pointer tap-bounce ${
                selectedCategory !== 'All Categories'
                  ? 'bg-emerald-50 border-[#08A34F] text-[#08A34F] shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#08A34F] shrink-0" />
              <span className="text-slate-500 font-semibold hidden sm:inline">Category:</span>
              <span className="truncate max-w-[120px]">{selectedCategory}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {/* Job Type Dropdown Pill */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'jobType' ? null : 'jobType')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  selectedJobType !== 'All Types'
                    ? 'bg-emerald-50 border-[#08A34F] text-[#08A34F] shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-[#08A34F] shrink-0" />
                <span className="text-slate-500 font-semibold hidden sm:inline">Job Type:</span>
                <span className="truncate max-w-[100px]">{selectedJobType}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>

              {activeDropdown === 'jobType' && (
                <div className="absolute top-full left-0 mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  {jobTypeOptions.map((jt) => (
                    <button
                      key={jt}
                      type="button"
                      onClick={() => {
                        setSelectedJobType(jt);
                        setActiveDropdown(null);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs hover:bg-emerald-50 text-slate-800 font-semibold flex items-center justify-between cursor-pointer"
                    >
                      <span>{jt}</span>
                      {selectedJobType === jt && <Check className="w-3.5 h-3.5 text-[#08A34F] stroke-[3]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Salary Range Dropdown Pill */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'salary' ? null : 'salary')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  selectedSalary !== 'Any Salary'
                    ? 'bg-emerald-50 border-[#08A34F] text-[#08A34F] shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="text-[#08A34F] font-bold text-xs shrink-0">🏷️</span>
                <span className="text-slate-500 font-semibold hidden sm:inline">Salary:</span>
                <span className="truncate max-w-[110px]">{selectedSalary}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>

              {activeDropdown === 'salary' && (
                <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  {salaryOptions.map((sal) => (
                    <button
                      key={sal}
                      type="button"
                      onClick={() => {
                        setSelectedSalary(sal);
                        setActiveDropdown(null);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs hover:bg-emerald-50 text-slate-800 font-semibold flex items-center justify-between cursor-pointer"
                    >
                      <span>{sal}</span>
                      {selectedSalary === sal && <Check className="w-3.5 h-3.5 text-[#08A34F] stroke-[3]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Remote Only Toggle Pill */}
            <button
              onClick={() => setIsRemoteOnly(!isRemoteOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all shrink-0 cursor-pointer tap-bounce ${
                isRemoteOnly
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Globe className={`w-3.5 h-3.5 ${isRemoteOnly ? 'text-white' : 'text-[#08A34F]'}`} />
              <span>Remote Only</span>
            </button>

            {/* Advanced Filters Button */}
            <button
              onClick={() => onNavigate('/filters')}
              className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#08A34F] hover:bg-emerald-600 text-white text-xs font-bold tap-bounce shadow-xs cursor-pointer ml-auto"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">More Filters</span>
            </button>
          </div>

          {/* Active Filter Chips Bar */}
          {isAnyFilterActive && (
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-slate-400 font-medium mr-1">Active Filters:</span>
              
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-[#08A34F] font-bold border border-emerald-200">
                  Search: &quot;{searchQuery}&quot;
                  <button onClick={() => setSearchQuery('')} className="hover:text-emerald-800 ml-0.5 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedLocation !== 'All Sri Lanka' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-[#08A34F] font-bold border border-emerald-200">
                  Location: {selectedLocation}
                  <button onClick={() => { setSelectedLocation('All Sri Lanka'); setSelectedLocationObj(undefined); }} className="hover:text-emerald-800 ml-0.5 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedCategory !== 'All Categories' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-[#08A34F] font-bold border border-emerald-200">
                  Category: {selectedCategory}
                  <button onClick={() => { setSelectedCategory('All Categories'); setSelectedCategoryId(undefined); }} className="hover:text-emerald-800 ml-0.5 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedJobType !== 'All Types' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-[#08A34F] font-bold border border-emerald-200">
                  Type: {selectedJobType}
                  <button onClick={() => setSelectedJobType('All Types')} className="hover:text-emerald-800 ml-0.5 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedSalary !== 'Any Salary' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-[#08A34F] font-bold border border-emerald-200">
                  Salary: {selectedSalary}
                  <button onClick={() => setSelectedSalary('Any Salary')} className="hover:text-emerald-800 ml-0.5 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedCompany && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-[#08A34F] font-bold border border-emerald-200">
                  Company: {selectedCompany}
                  <button onClick={() => setSelectedCompany(null)} className="hover:text-emerald-800 ml-0.5 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {isRemoteOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-[#08A34F] font-bold border border-emerald-200">
                  Remote Only
                  <button onClick={() => setIsRemoteOnly(false)} className="hover:text-emerald-800 ml-0.5 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={handleClearAllFilters}
                className="text-xs font-bold text-red-600 hover:underline ml-auto cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* 3 QUICK ACTION CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Card 1: Post a Job */}
          <div 
            onClick={() => onNavigate('/post/job')}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-[#08A34F] hover:shadow-md transition-all tap-bounce group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#08A34F] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Post a Job</h4>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">Hire top talent across Sri Lanka</p>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>

          {/* Card 2: Remote Jobs */}
          <div 
            onClick={() => {
              setIsRemoteOnly(true);
              scrollToFeed();
            }}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-[#08A34F] hover:shadow-md transition-all tap-bounce group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#08A34F] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Remote Jobs</h4>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">Work-from-home opportunities</p>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>

          {/* Card 3: Browse Companies */}
          <div 
            onClick={() => scrollToCompanies()}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-[#08A34F] hover:shadow-md transition-all tap-bounce group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#08A34F] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Browse Companies</h4>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">Top hiring employers & hubs</p>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* 4. POPULAR JOB CATEGORIES SECTION */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 font-heading">
                Popular Job Categories
              </h2>
              <p className="text-xs text-slate-500 font-medium">Explore vacancies by industry sector</p>
            </div>
            <button 
              onClick={() => setIsCategoryModalOpen(true)}
              className="text-xs font-bold text-[#08A34F] hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {JOB_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  if (cat.name === 'More') {
                    setIsCategoryModalOpen(true);
                  } else {
                    setSelectedCategory(cat.name);
                    scrollToFeed();
                  }
                }}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border shadow-xs hover:border-[#08A34F] transition-all group tap-bounce cursor-pointer ${
                  selectedCategory.toLowerCase() === cat.name.toLowerCase()
                    ? 'border-[#08A34F] ring-2 ring-[#08A34F]/20 bg-emerald-50/50'
                    : 'border-slate-200/90'
                }`}
              >
                <div 
                  className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 shrink-0"
                  style={{ backgroundColor: cat.bgColor || '#EAF8F0' }}
                >
                  {getCategoryIconComponent({ iconKey: cat.iconName, module: 'job', className: 'w-5 h-5 text-[#08A34F]' })}
                </div>
                <span className="text-xs font-bold text-slate-800 text-center leading-tight truncate w-full">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 5. FEATURED JOBS SECTION (Rendered only if active featured jobs exist) */}
        {featuredItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 font-heading">
                  Featured Jobs
                </h2>
                <p className="text-xs text-slate-500 font-medium">Handpicked priority hiring positions</p>
              </div>
              <button 
                onClick={() => {
                  setSelectedCategory('All Categories');
                  scrollToFeed();
                }}
                className="text-xs font-bold text-[#08A34F] hover:underline flex items-center gap-1 cursor-pointer"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex gap-3.5 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
              {featuredItems.map((job) => {
                const isSaved = savedJobs.includes(job.id);
                return (
                  <div
                    key={job.id}
                    className="w-72 sm:w-80 shrink-0 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between space-y-3 hover:border-emerald-300 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-md bg-[#08A34F] text-white text-[9.5px] font-black uppercase tracking-wider">
                          FEATURED
                        </span>
                        <button
                          onClick={() => toggleSaveJob(job.id)}
                          className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:text-red-500 flex items-center justify-center tap-bounce cursor-pointer"
                          aria-label="Save Job"
                        >
                          <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>
                      </div>

                      <div className="mt-2.5 flex items-start gap-3">
                        {job.logoUrl ? (
                          <img src={job.logoUrl} alt={job.company} className="w-9 h-9 rounded-xl object-contain bg-slate-50 border border-slate-100 shrink-0" />
                        ) : (
                          <CompanyLogo brand={job.logoType} className="shrink-0 mt-0.5" />
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate font-heading">
                            {job.title}
                          </h3>
                          <p className="text-xs text-slate-500 truncate font-medium">{job.company}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2.5">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[120px]">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{job.jobType}</span>
                        </div>
                      </div>

                      <div className="text-xs sm:text-sm font-black text-slate-900 mt-2 font-heading">
                        {job.salary} <span className="text-xs text-slate-500 font-normal">{job.salaryPeriod || '/ Month'}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {job.tags.map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <button
                          onClick={() => {
                            if (onOpenListingDetail) {
                              onOpenListingDetail(job.id, 'jobs');
                            } else {
                              onNavigate('/job-detail');
                            }
                          }}
                          className="flex-1 py-2 px-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold text-center tap-bounce cursor-pointer"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            if (onOpenListingDetail) {
                              onOpenListingDetail(job.id, 'jobs');
                            } else {
                              onNavigate('/job-detail');
                            }
                          }}
                          className="flex-1 py-2 px-2.5 rounded-xl bg-[#08A34F] hover:bg-emerald-600 text-white text-xs font-bold text-center tap-bounce shadow-xs cursor-pointer"
                        >
                          Apply Now
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">{job.postedTime}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. TOP HIRING COMPANIES SECTION (Rendered only if active companies exist) */}
        {hiringCompanies.length > 0 && (
          <div ref={companiesRef} className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 font-heading">
                  Top Hiring Companies
                </h2>
                <p className="text-xs text-slate-500 font-medium">Leading employers actively building teams</p>
              </div>
              <button 
                onClick={() => {
                  setSelectedCompany(null);
                  scrollToFeed();
                }}
                className="text-xs font-bold text-[#08A34F] hover:underline flex items-center gap-1 cursor-pointer"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {hiringCompanies.map((comp) => {
                const isSelected = selectedCompany === comp.name || selectedCompany === comp.id;
                return (
                  <div 
                    key={comp.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedCompany(null);
                      } else {
                        setSelectedCompany(comp.name);
                        scrollToFeed();
                      }
                    }}
                    className={`p-3.5 rounded-2xl bg-white border flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all hover:border-[#08A34F] tap-bounce ${
                      isSelected ? 'border-[#08A34F] ring-2 ring-[#08A34F]/20 bg-emerald-50/50' : 'border-slate-200 shadow-xs'
                    }`}
                  >
                    {comp.logoUrl ? (
                      <img src={comp.logoUrl} alt={comp.name} className="w-8 h-8 rounded-xl object-contain" />
                    ) : (
                      <CompanyLogo brand={comp.brandKey} />
                    )}
                    <div className="min-w-0 w-full">
                      <span className="text-xs font-bold text-slate-900 block truncate">{comp.name}</span>
                      <span className="text-[10px] text-slate-500 font-medium block truncate">
                        {comp.subtitle || 'Actively Hiring'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 7. ALL JOBS FEED SECTION (PAGINATED & CONTINUOUS) */}
        <div ref={feedRef} className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-xl font-extrabold text-slate-900 font-heading flex items-center gap-2">
                <span>Explore All Vacancies</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#08A34F] text-xs font-black">
                  {totalJobsCount} Jobs
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {isAnyFilterActive ? 'Showing filtered job opportunities' : 'Latest verified vacancies across Sri Lanka'}
              </p>
            </div>

            {/* Quick Sort / Helper */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs text-slate-500 font-medium">Sort by:</span>
              <span className="text-xs font-bold text-slate-800 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                Newest First
              </span>
            </div>
          </div>

          {/* Feed Content Grid */}
          {feedLoading && feedItems.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-white rounded-2xl border border-slate-200">
              <RefreshCw className="w-6 h-6 animate-spin text-[#08A34F] mx-auto" />
              <p className="text-xs font-semibold text-slate-600">Loading vacancies...</p>
            </div>
          ) : feedItems.length === 0 ? (
            <div className="py-16 px-4 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#08A34F] flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading">No Jobs Found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  We couldn&apos;t find any job positions matching your selected filters or search terms.
                </p>
              </div>
              <button
                onClick={handleClearAllFilters}
                className="px-5 py-2.5 rounded-xl bg-[#08A34F] text-white text-xs font-bold hover:bg-emerald-600 tap-bounce shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {feedItems.map((job) => {
                  const isSaved = savedJobs.includes(job.id);
                  return (
                    <div
                      key={job.id}
                      className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3.5 hover:border-[#08A34F] hover:shadow-md transition-all group"
                    >
                      <div>
                        {/* Header Badge & Heart */}
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-[#08A34F] text-[10px] font-bold border border-emerald-200">
                            {job.category}
                          </span>
                          <button
                            onClick={() => toggleSaveJob(job.id)}
                            className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:text-red-500 flex items-center justify-center tap-bounce cursor-pointer"
                            aria-label="Save Job"
                          >
                            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#08A34F] text-[#08A34F]' : ''}`} />
                          </button>
                        </div>

                        {/* Company & Title */}
                        <div className="mt-2.5 flex items-start gap-3">
                          {job.logoUrl ? (
                            <img src={job.logoUrl} alt={job.company} className="w-9 h-9 rounded-xl object-contain bg-slate-50 border border-slate-100 shrink-0" />
                          ) : (
                            <CompanyLogo brand={job.logoType} className="shrink-0 mt-0.5" />
                          )}
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#08A34F] transition-colors line-clamp-1 font-heading">
                              {job.title}
                            </h3>
                            <p className="text-xs text-slate-500 truncate font-medium">{job.company}</p>
                          </div>
                        </div>

                        {/* Location, Job Type & Remote */}
                        <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 mt-2.5">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[130px]">{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{job.jobType}</span>
                          </div>
                          {job.isRemote && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-[#08A34F] text-[10px] font-bold">
                              <Globe className="w-3 h-3" /> Remote
                            </span>
                          )}
                        </div>

                        {/* Salary */}
                        <div className="text-sm font-black text-slate-900 mt-2 font-heading">
                          {job.salary} <span className="text-xs text-slate-500 font-normal">{job.salaryPeriod || '/ Month'}</span>
                        </div>

                        {/* Description snippet if available */}
                        {job.description && (
                          <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                            {job.description}
                          </p>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {job.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <button
                            onClick={() => {
                              if (onOpenListingDetail) {
                                onOpenListingDetail(job.id, 'jobs');
                              } else {
                                onNavigate('/job-detail');
                              }
                            }}
                            className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold text-center tap-bounce cursor-pointer"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => {
                              if (onOpenListingDetail) {
                                onOpenListingDetail(job.id, 'jobs');
                              } else {
                                onNavigate('/job-detail');
                              }
                            }}
                            className="flex-1 py-2 px-3 rounded-xl bg-[#08A34F] hover:bg-emerald-600 text-white text-xs font-bold text-center tap-bounce shadow-xs cursor-pointer"
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination / Load More Footer */}
              <div className="pt-6 pb-2 text-center space-y-3">
                <p className="text-xs text-slate-500 font-medium">
                  Showing <span className="font-bold text-slate-900">{feedItems.length}</span> of <span className="font-bold text-slate-900">{totalJobsCount}</span> Jobs
                </p>

                {hasMore && (
                  <button
                    onClick={handleLoadMore}
                    disabled={feedLoading}
                    className="px-6 py-3 rounded-2xl bg-white border border-slate-300 hover:border-[#08A34F] text-slate-800 hover:text-[#08A34F] text-xs font-bold shadow-xs tap-bounce inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {feedLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#08A34F]" />
                        <span>Loading more jobs...</span>
                      </>
                    ) : (
                      <>
                        <span>Load More Jobs</span>
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>

      </div>

      {/* GLOBAL SHARED LOCATION MODAL */}
      <GlobalLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedLocation={selectedLocation}
        onSelectLocation={(locStr, locObj) => {
          setSelectedLocation(locStr);
          setSelectedLocationObj(locObj);
          setIsLocationModalOpen(false);
        }}
        accentColor="#08A34F"
        title="Select Job Location"
      />

      {/* JOBS CATEGORY MODAL */}
      <JobCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={(catName) => {
          setSelectedCategory(catName);
          setIsCategoryModalOpen(false);
          scrollToFeed();
        }}
      />
    </div>
  );
};
