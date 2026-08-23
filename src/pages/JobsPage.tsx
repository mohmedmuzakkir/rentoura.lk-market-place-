import React, { useState, useEffect, useCallback } from 'react';
import { CategoryIcon, getCategoryIconComponent } from '../components/CategoryIcon';
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
  Code, 
  TrendingUp, 
  Calculator, 
  BellRing, 
  HardHat, 
  HeartHandshake, 
  GraduationCap, 
  LayoutGrid,
  CheckCircle2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { 
  JOB_CATEGORIES, 
  FEATURED_JOBS, 
  REMOTE_JOBS, 
  TOP_HIRING_COMPANIES,
  SRI_LANKA_LOCATIONS 
} from '../data/mockData';
import { AppRoute, JobItem } from '../types';
import { CompanyLogo } from '../components/BrandLogos';
import { CategoryService } from '../services/categoryService';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Sri Lanka');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedJobType, setSelectedJobType] = useState('All Types');
  const [selectedSalary, setSelectedSalary] = useState('Any Salary');
  const [localSavedJobs, setLocalSavedJobs] = useState<string[]>([]);
  const [bookmarkedRemote, setBookmarkedRemote] = useState<string[]>([]);

  // Dropdowns
  const [activeDropdown, setActiveDropdown] = useState<'location' | 'category' | 'jobType' | 'salary' | null>(null);

  const jobTypeOptions = ['All Types', 'Full Time', 'Part Time', 'Contract', 'Internship'];
  const salaryOptions = ['Any Salary', '< Rs. 50,000', 'Rs. 50,000 - 100,000', 'Rs. 100,000 - 200,000', 'Rs. 200,000+'];
  
  const [categoryOptions, setCategoryOptions] = useState<string[]>(['All Categories']);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const loadJobCategories = useCallback(async (forceRefresh = false) => {
    setCategoriesLoading(true);
    setCategoriesError(null);
    const res = await CategoryService.getMainCategories('job');
    if (!res.success) {
      setCategoriesError('Unable to load categories.');
      setCategoryOptions(['All Categories']);
    } else {
      const names = ['All Categories', ...res.data.map(c => c.name)];
      setCategoryOptions(names);
    }
    setCategoriesLoading(false);
  }, []);

  useEffect(() => {
    loadJobCategories();
  }, [loadJobCategories]);

  const getJobCategoryIcon = (iconName: string) => {
    return getCategoryIconComponent({ iconKey: iconName, module: 'job', className: 'w-5 h-5 text-[#08A34F]' });
  };

  const toggleSaveJob = (id: string) => {
    if (onToggleSave) {
      onToggleSave(id);
    } else {
      setLocalSavedJobs(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    }
  };

  const toggleBookmarkRemote = (id: string) => {
    if (onToggleSave) {
      onToggleSave(id);
    } else {
      setBookmarkedRemote(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-28 overflow-x-hidden selection:bg-[#08A34F] selection:text-white">
      {/* Hero Section matching Image 3 with Emerald Glow & Professional Portrait Backdrop */}
      <div className="relative bg-gradient-to-b from-[#021A12] via-[#04281A] to-[#0A3D29] text-white pt-4 pb-7 px-4 overflow-hidden shadow-md">
        {/* Background Visual Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80"
            alt="Find Your Dream Job"
            className="w-full h-full object-cover object-right opacity-30 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#04281A] via-[#04281A]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#021A12] via-[#021A12]/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-md lg:max-w-7xl mx-auto">
          {/* Main Hero Headline matching Image 3 */}
          <div className="mt-1">
            <h1 className="text-3xl font-extrabold tracking-tight leading-[1.15] font-heading text-white">
              Find Your<br />
              <span className="text-[#08A34F] text-emerald-400">Dream Job</span>
            </h1>
            <p className="text-xs text-emerald-100/90 mt-1 max-w-[280px] leading-relaxed">
              Explore thousands of opportunities across Sri Lanka.<br />
              Your next career move starts here.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-3 relative z-20 space-y-5">
        {/* Floating Search & Filter Card matching Image 3 */}
        <div className="bg-white rounded-2xl p-3 shadow-md border border-slate-200/80 space-y-2.5">
          {/* Main Search Input */}
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-1.5 border border-slate-200">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onNavigate('/search');
              }}
              placeholder="Search job title, company or skill..."
              className="flex-1 bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none py-1.5 font-medium"
            />
            <button 
              onClick={() => onNavigate('/search')}
              className="w-8 h-8 rounded-full bg-[#08A34F] text-white flex items-center justify-center shadow-md shadow-emerald-500/25 tap-bounce shrink-0"
              aria-label="Search jobs"
            >
              <Search className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Filter Pills matching Image 3 */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[11px]">
            {/* Location Pill */}
            <div className="relative shrink-0">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'location' ? null : 'location')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold"
              >
                <MapPin className="w-3.5 h-3.5 text-[#08A34F]" />
                <span className="text-[10.5px]">Location:</span>
                <span className="font-bold text-slate-900 truncate max-w-[70px]">{selectedLocation}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {activeDropdown === 'location' && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95 max-h-48 overflow-y-auto">
                  {SRI_LANKA_LOCATIONS.map((loc) => (
                    <button
                      key={loc.name}
                      onClick={() => { setSelectedLocation(loc.name); setActiveDropdown(null); }}
                      className="w-full px-3 py-1.5 text-left text-xs hover:bg-emerald-50 text-slate-800 font-medium flex items-center justify-between"
                    >
                      <span>{loc.name}</span>
                      {selectedLocation === loc.name && <span className="text-[#08A34F] font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Category Pill */}
            <div className="relative shrink-0">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'category' ? null : 'category')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-[#08A34F]" />
                <span className="text-[10.5px]">Category:</span>
                <span className="font-bold text-slate-900 truncate max-w-[70px]">{selectedCategory}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {activeDropdown === 'category' && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95 max-h-52 overflow-y-auto">
                  {categoriesLoading && (
                    <div className="px-3 py-2 text-xs text-slate-400 font-medium">Loading categories...</div>
                  )}
                  {!categoriesLoading && categoriesError && (
                    <div className="px-3 py-2 text-xs text-red-600 space-y-1">
                      <p>Unable to load categories.</p>
                      <button
                        onClick={() => loadJobCategories(true)}
                        className="px-2 py-0.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded text-[10px] inline-flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Retry
                      </button>
                    </div>
                  )}
                  {!categoriesLoading && !categoriesError && categoryOptions.length <= 1 && (
                    <div className="px-3 py-2 text-xs text-slate-400 font-medium">
                      No job categories are available yet.
                    </div>
                  )}
                  {!categoriesLoading && !categoriesError && categoryOptions.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setActiveDropdown(null); }}
                      className="w-full px-3 py-1.5 text-left text-xs hover:bg-emerald-50 text-slate-800 font-medium flex items-center justify-between cursor-pointer"
                    >
                      <span>{cat}</span>
                      {selectedCategory === cat && <span className="text-[#08A34F] font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Job Type Pill */}
            <div className="relative shrink-0">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'jobType' ? null : 'jobType')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold"
              >
                <Briefcase className="w-3.5 h-3.5 text-[#08A34F]" />
                <span className="text-[10.5px]">Job Type:</span>
                <span className="font-bold text-slate-900 truncate max-w-[65px]">{selectedJobType}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {activeDropdown === 'jobType' && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95">
                  {jobTypeOptions.map((jt) => (
                    <button
                      key={jt}
                      onClick={() => { setSelectedJobType(jt); setActiveDropdown(null); }}
                      className="w-full px-3 py-1.5 text-left text-xs hover:bg-emerald-50 text-slate-800 font-medium flex items-center justify-between"
                    >
                      <span>{jt}</span>
                      {selectedJobType === jt && <span className="text-[#08A34F] font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Salary Pill */}
            <div className="relative shrink-0">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'salary' ? null : 'salary')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold"
              >
                <span className="text-[#08A34F] font-bold text-xs">🏷️</span>
                <span className="text-[10.5px]">Salary:</span>
                <span className="font-bold text-slate-900 truncate max-w-[65px]">{selectedSalary}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {activeDropdown === 'salary' && (
                <div className="absolute top-full right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95">
                  {salaryOptions.map((sal) => (
                    <button
                      key={sal}
                      onClick={() => { setSelectedSalary(sal); setActiveDropdown(null); }}
                      className="w-full px-3 py-1.5 text-left text-xs hover:bg-emerald-50 text-slate-800 font-medium flex items-center justify-between"
                    >
                      <span>{sal}</span>
                      {selectedSalary === sal && <span className="text-[#08A34F] font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* More Filters button */}
            <button
              onClick={() => onNavigate('/filters')}
              className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#08A34F] text-white font-bold tap-bounce shadow-xs cursor-pointer"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span className="text-[10.5px]">More Filters</span>
            </button>
          </div>
        </div>

        {/* 3 Quick Action Cards Row matching Image 3 */}
        <div className="grid grid-cols-3 gap-2">
          {/* Action 1: Post a Job */}
          <div 
            onClick={() => onNavigate('/post')}
            className="bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-xs flex flex-col justify-between cursor-pointer hover:border-emerald-400 transition-colors tap-bounce"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#08A34F] flex items-center justify-center mb-1.5">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-slate-900 leading-tight">Post a Job</h4>
              <p className="text-[9px] text-slate-500 leading-tight mt-0.5">Hire the perfect candidate today.</p>
            </div>
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center mt-2 self-end">
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Action 2: Remote Jobs */}
          <div 
            onClick={() => setSelectedJobType('Full Time')}
            className="bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-xs flex flex-col justify-between cursor-pointer hover:border-emerald-400 transition-colors tap-bounce"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#08A34F] flex items-center justify-center mb-1.5">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-slate-900 leading-tight">Remote Jobs</h4>
              <p className="text-[9px] text-slate-500 leading-tight mt-0.5">Explore remote opportunities.</p>
            </div>
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center mt-2 self-end">
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Action 3: Browse Companies */}
          <div 
            onClick={() => setSelectedCategory('All Categories')}
            className="bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-xs flex flex-col justify-between cursor-pointer hover:border-emerald-400 transition-colors tap-bounce"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#08A34F] flex items-center justify-center mb-1.5">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-slate-900 leading-tight">Browse Companies</h4>
              <p className="text-[9px] text-slate-500 leading-tight mt-0.5">Find top companies hiring now.</p>
            </div>
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center mt-2 self-end">
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Popular Job Categories matching Image 3 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 font-heading">
              Popular Job Categories
            </h2>
            <button 
              onClick={() => setSelectedCategory('All Categories')}
              className="text-xs font-bold text-[#08A34F] hover:underline flex items-center gap-0.5"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {JOB_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#08A34F] transition-all group tap-bounce"
              >
                <div 
                  className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{ backgroundColor: cat.bgColor }}
                >
                  {getJobCategoryIcon(cat.iconName)}
                </div>
                <span className="text-[10.5px] font-bold text-slate-700 text-center leading-tight truncate w-full">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Jobs matching Image 3 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 font-heading">
              Featured Jobs
            </h2>
            <button 
              onClick={() => setSelectedCategory('All Categories')}
              className="text-xs font-bold text-[#08A34F] hover:underline flex items-center gap-0.5"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
            {FEATURED_JOBS.map((job) => {
              const isSaved = savedListings.includes(job.id) || localSavedJobs.includes(job.id);
              return (
                <div
                  key={job.id}
                  className="w-64 shrink-0 bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-3"
                >
                  {/* Top Bar with Badge, Logo & Heart */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-[#08A34F] text-white text-[9.5px] font-black uppercase tracking-wider">
                        FEATURED
                      </span>
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className="w-7 h-7 rounded-full bg-slate-50 text-slate-400 hover:text-red-500 flex items-center justify-center tap-bounce"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>
                    </div>

                    {/* Company Logo & Job Title */}
                    <div className="mt-2 flex items-start gap-2.5">
                      {job.logoType && (
                        <div className="shrink-0 mt-0.5">
                          <CompanyLogo brand={job.logoType} />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="text-xs font-extrabold text-slate-900 truncate font-heading">
                          {job.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 truncate font-medium">{job.company}</p>
                      </div>
                    </div>

                    {/* Location & Job Type */}
                    <div className="flex items-center gap-2 text-[10.5px] text-slate-500 mt-2">
                      <div className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{job.jobType}</span>
                      </div>
                    </div>

                    {/* Salary */}
                    <div className="text-xs font-black text-slate-900 mt-1.5 font-heading">
                      {job.salary} <span className="text-[10px] text-slate-500 font-normal">{job.salaryPeriod || '/ Month'}</span>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {job.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[9.5px] font-semibold">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons matching Image 3 */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-1">
                      <button
                        onClick={() => {
                          if (onOpenListingDetail) {
                            onOpenListingDetail(job.id, 'jobs');
                          } else {
                            onNavigate('/job-detail');
                          }
                        }}
                        className="flex-1 py-1.5 px-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-[10.5px] font-bold text-center tap-bounce"
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
                        className="flex-1 py-1.5 px-2 rounded-xl bg-[#08A34F] hover:bg-emerald-600 text-white text-[10.5px] font-bold text-center tap-bounce shadow-xs"
                      >
                        Apply Now
                      </button>
                    </div>
                    <span className="text-[9.5px] text-slate-400 shrink-0">{job.postedTime}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Remote Jobs matching Image 3 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 font-heading">
              Remote Jobs
            </h2>
            <button 
              onClick={() => setSelectedJobType('Full Time')}
              className="text-xs font-bold text-[#08A34F] hover:underline flex items-center gap-0.5"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {REMOTE_JOBS.map((rem) => {
              const isBookmarked = savedListings.includes(rem.id) || bookmarkedRemote.includes(rem.id);
              return (
                <div
                  key={rem.id}
                  onClick={() => {
                    if (onOpenListingDetail) {
                      onOpenListingDetail(rem.id, 'jobs');
                    } else {
                      onNavigate('/job-detail');
                    }
                  }}
                  className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs flex items-center justify-between gap-3 cursor-pointer hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {rem.logoType && (
                      <CompanyLogo brand={rem.logoType} className="shrink-0" />
                    )}
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate font-heading">
                        {rem.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        {rem.company} • 🌐 Remote • 🕒 {rem.jobType}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {rem.salary && (
                      <div className="text-right hidden sm:block">
                        <div className="text-xs font-bold text-slate-900">{rem.salary}</div>
                        <div className="text-[9px] text-slate-400">{rem.postedTime}</div>
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmarkRemote(rem.id);
                      }}
                      className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:text-[#08A34F] flex items-center justify-center tap-bounce"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#08A34F] text-[#08A34F]' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Hiring Companies matching Image 3 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 font-heading">
              Top Hiring Companies
            </h2>
            <button 
              onClick={() => setSelectedCategory('All Categories')}
              className="text-xs font-bold text-[#08A34F] hover:underline flex items-center gap-0.5"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
            {TOP_HIRING_COMPANIES.map((comp) => (
              <div key={comp.id} className="shrink-0">
                <CompanyLogo brand={comp.brandKey} />
              </div>
            ))}
            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-slate-200/80 shadow-xs h-14 min-w-[76px] cursor-pointer hover:border-emerald-400 shrink-0">
              <LayoutGrid className="w-4 h-4 text-slate-400 mb-0.5" />
              <span className="text-[10px] text-slate-600 font-bold">More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
