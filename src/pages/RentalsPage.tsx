import React, { useState, useEffect, useCallback } from 'react';
import { CategoryIcon, getCategoryIconComponent } from '../components/CategoryIcon';
import { 
  ArrowLeft, 
  Search, 
  ChevronDown, 
  SlidersHorizontal, 
  Home, 
  BedDouble, 
  Car, 
  Tent, 
  Drill, 
  Briefcase, 
  Armchair, 
  LayoutGrid, 
  Heart, 
  MapPin, 
  Plus, 
  ArrowRight,
  Sparkles,
  Users,
  Snowflake,
  Cpu,
  Bath,
  Bed,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { CATEGORIES_DATA, FEATURED_RENTALS, NEAR_YOU_RENTALS, SRI_LANKA_LOCATIONS } from '../data/mockData';
import { AppRoute, FeaturedListingItem, FilterState } from '../types';
import { CategoryService } from '../services/categoryService';

interface RentalsPageProps {
  onNavigate: (route: AppRoute) => void;
  savedListings: string[];
  onToggleSave: (id: string) => void;
  onOpenListingDetail?: (id: string, moduleHint?: 'rentals' | 'jobs' | 'services') => void;
}

export const RentalsPage: React.FC<RentalsPageProps> = ({ 
  onNavigate,
  savedListings,
  onToggleSave,
  onOpenListingDetail
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Sri Lanka');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedPrice, setSelectedPrice] = useState('Any Price');
  const [selectedPeriod, setSelectedPeriod] = useState('Any Period');

  // Dynamic filter lists for dropdowns
  const [activeDropdown, setActiveDropdown] = useState<'location' | 'category' | 'price' | 'period' | null>(null);

  const priceOptions = ['Any Price', '< Rs. 25,000', 'Rs. 25,000 - 75,000', 'Rs. 75,000 - 150,000', 'Rs. 150,000+'];
  const periodOptions = ['Any Period', 'Per Day', 'Per Week', 'Per Month', 'Per Event'];
  
  const [categoryOptions, setCategoryOptions] = useState<string[]>(['All Categories']);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const loadRentalCategories = useCallback(async (forceRefresh = false) => {
    setCategoriesLoading(true);
    setCategoriesError(null);
    const res = await CategoryService.getMainCategories('rental');
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
    loadRentalCategories();
  }, [loadRentalCategories]);

  const getCategoryIcon = (iconName: string) => {
    return getCategoryIconComponent({ iconKey: iconName, module: 'rental', className: 'w-5 h-5' });
  };

  const getSpecIcon = (icon: string) => {
    switch (icon) {
      case 'Bed': return <Bed className="w-3 h-3" />;
      case 'Bath': return <Bath className="w-3 h-3" />;
      case 'Car': return <Car className="w-3 h-3" />;
      case 'Cpu': return <Cpu className="w-3 h-3" />;
      case 'Users': return <Users className="w-3 h-3" />;
      case 'Snowflake': return <Snowflake className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-28 overflow-x-hidden selection:bg-[#1464F4] selection:text-white">
      {/* Hero Section with Luxury House & Blue Sedan Backdrop matching Image 2 */}
      <div className="relative bg-[#041C43] text-white pt-4 pb-7 px-4 overflow-hidden shadow-md">
        {/* Background Visual Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80"
            alt="Luxury Rental in Sri Lanka"
            className="w-full h-full object-cover object-right opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041C43] via-[#041C43]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#041C43] via-[#041C43]/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-md lg:max-w-7xl mx-auto">
          {/* Main Hero Headline */}
          <div className="mt-1">
            <h1 className="text-3xl font-extrabold tracking-tight leading-[1.15] font-heading text-white">
              Rent What<br />
              You Need
            </h1>
            <p className="text-base font-semibold text-white/95 mt-1 tracking-tight">
              Across Sri Lanka
            </p>
            <p className="text-xs text-blue-100/90 mt-1 max-w-[280px] leading-relaxed">
              Find the best rentals near you, quick, easy and trusted.
            </p>
          </div>

          {/* Module Switcher Tabs matching Image 2 (White pill frame with 3 items) */}
          <div className="bg-white rounded-full p-1.5 mt-5 flex items-center justify-between shadow-xl">
            {/* Active Rentals Tab */}
            <button 
              className="flex-1 py-2 px-3 rounded-full bg-[#1464F4] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm tap-bounce"
            >
              <Home className="w-3.5 h-3.5" />
              <span>RENTALS</span>
            </button>

            {/* Jobs Tab */}
            <button
              onClick={() => onNavigate('/jobs')}
              className="flex-1 py-2 px-3 rounded-full text-[#08A34F] hover:bg-slate-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors tap-bounce"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>JOBS</span>
            </button>

            {/* Services Tab */}
            <button
              onClick={() => onNavigate('/services')}
              className="flex-1 py-2 px-3 rounded-full text-[#FF650A] hover:bg-slate-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors tap-bounce"
            >
              <Drill className="w-3.5 h-3.5" />
              <span>SERVICES</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-3 relative z-20 space-y-5">
        {/* Floating Search & Filter Card matching Image 2 */}
        <div className="bg-white rounded-2xl p-3 shadow-md border border-slate-200/80 space-y-2.5">
          {/* Main Input Box with Blue Circle Search Icon */}
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-1.5 border border-slate-200">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onNavigate('/search');
              }}
              placeholder="Search homes, vehicles, rooms, equipment..."
              className="flex-1 bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none py-1.5 font-medium"
            />
            <button 
              onClick={() => onNavigate('/search')}
              className="w-8 h-8 rounded-full bg-[#1464F4] text-white flex items-center justify-center shadow-md shadow-blue-500/25 tap-bounce shrink-0"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Dropdown Filters Row matching Image 2 */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[11px]">
            {/* Location Pill */}
            <div className="relative shrink-0">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'location' ? null : 'location')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold"
              >
                <MapPin className="w-3.5 h-3.5 text-[#1464F4]" />
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
                      className="w-full px-3 py-1.5 text-left text-xs hover:bg-blue-50 text-slate-800 font-medium flex items-center justify-between"
                    >
                      <span>{loc.name}</span>
                      {selectedLocation === loc.name && <span className="text-[#1464F4] font-bold">✓</span>}
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
                <LayoutGrid className="w-3.5 h-3.5 text-[#1464F4]" />
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
                        onClick={() => loadRentalCategories(true)}
                        className="px-2 py-0.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded text-[10px] inline-flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Retry
                      </button>
                    </div>
                  )}
                  {!categoriesLoading && !categoriesError && categoryOptions.length <= 1 && (
                    <div className="px-3 py-2 text-xs text-slate-400 font-medium">
                      No rental categories are available yet.
                    </div>
                  )}
                  {!categoriesLoading && !categoriesError && categoryOptions.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setActiveDropdown(null); }}
                      className="w-full px-3 py-1.5 text-left text-xs hover:bg-blue-50 text-slate-800 font-medium flex items-center justify-between cursor-pointer"
                    >
                      <span>{cat}</span>
                      {selectedCategory === cat && <span className="text-[#1464F4] font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Pill */}
            <div className="relative shrink-0">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'price' ? null : 'price')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold"
              >
                <span className="text-[#1464F4] font-bold text-xs">◆</span>
                <span className="text-[10.5px]">Price:</span>
                <span className="font-bold text-slate-900 truncate max-w-[65px]">{selectedPrice}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {activeDropdown === 'price' && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95">
                  {priceOptions.map((pr) => (
                    <button
                      key={pr}
                      onClick={() => { setSelectedPrice(pr); setActiveDropdown(null); }}
                      className="w-full px-3 py-1.5 text-left text-xs hover:bg-blue-50 text-slate-800 font-medium flex items-center justify-between"
                    >
                      <span>{pr}</span>
                      {selectedPrice === pr && <span className="text-[#1464F4] font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Period Pill */}
            <div className="relative shrink-0">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'period' ? null : 'period')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold"
              >
                <span className="text-[#1464F4] font-bold text-[10px]">📅</span>
                <span className="text-[10.5px]">Period:</span>
                <span className="font-bold text-slate-900 truncate max-w-[65px]">{selectedPeriod}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {activeDropdown === 'period' && (
                <div className="absolute top-full right-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95">
                  {periodOptions.map((pd) => (
                    <button
                      key={pd}
                      onClick={() => { setSelectedPeriod(pd); setActiveDropdown(null); }}
                      className="w-full px-3 py-1.5 text-left text-xs hover:bg-blue-50 text-slate-800 font-medium flex items-center justify-between"
                    >
                      <span>{pd}</span>
                      {selectedPeriod === pd && <span className="text-[#1464F4] font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* More Filters button */}
            <button
              onClick={() => onNavigate('/filters')}
              className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#1464F4] text-white font-bold tap-bounce shadow-xs cursor-pointer"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span className="text-[10.5px]">More Filters</span>
            </button>
          </div>
        </div>

        {/* List Your Rental Banner matching Image 2 */}
        <div className="bg-gradient-to-r from-[#0D47A1] via-[#1464F4] to-[#1E88E5] text-white rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-md shadow-blue-500/20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 border border-white/30">
              <Home className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold font-heading text-white">List Your Rental</h3>
              <p className="text-[10px] text-blue-100 truncate max-w-[190px]">
                Reach thousands of people looking to rent every day.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('/post')}
            className="px-3 py-2 rounded-xl bg-white text-[#1464F4] hover:bg-blue-50 text-[11px] font-extrabold flex items-center gap-1 shrink-0 tap-bounce shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> List Your Rental <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Browse Categories matching Image 2 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 font-heading">
              Browse Categories
            </h2>
            <button 
              onClick={() => setSelectedCategory('All Categories')}
              className="text-xs font-bold text-[#1464F4] hover:underline flex items-center gap-0.5"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {CATEGORIES_DATA.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#1464F4] transition-all group tap-bounce"
              >
                <div 
                  className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{ backgroundColor: cat.bgColor, color: cat.color }}
                >
                  {getCategoryIcon(cat.iconName)}
                </div>
                <span className="text-[10.5px] font-bold text-slate-700 text-center leading-tight truncate w-full">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Rentals matching Image 2 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 font-heading">
              Featured Rentals
            </h2>
            <button 
              onClick={() => setSelectedCategory('All Categories')}
              className="text-xs font-bold text-[#1464F4] hover:underline flex items-center gap-0.5"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
            {FEATURED_RENTALS.map((rental) => {
              const isSaved = savedListings.includes(rental.id);
              return (
                <div
                  key={rental.id}
                  onClick={() => {
                    if (onOpenListingDetail) {
                      onOpenListingDetail(rental.id, 'rentals');
                    } else {
                      onNavigate('/rental-detail');
                    }
                  }}
                  className="w-64 shrink-0 bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col cursor-pointer hover:shadow-md transition-shadow"
                >
                  {/* Photo & badges */}
                  <div className="relative h-36 w-full bg-slate-100">
                    <img
                      src={rental.imageUrl}
                      alt={rental.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-[#1464F4] text-white text-[9.5px] font-black uppercase tracking-wider shadow-sm">
                        FEATURED
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(rental.id);
                      }}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 text-white hover:bg-black/60 flex items-center justify-center backdrop-blur-xs tap-bounce"
                      aria-label="Save listing"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                    </button>

                    <div className="absolute bottom-2 left-2.5">
                      <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold uppercase">
                        {rental.categoryType}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 truncate font-heading">
                        {rental.title}
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{rental.location}</span>
                      </div>
                    </div>

                    <div className="text-xs font-extrabold text-[#1464F4]">
                      {rental.price} <span className="text-[10px] text-slate-500 font-normal">{rental.pricePeriod}</span>
                    </div>

                    {/* Specs Pills matching Image 2 */}
                    {rental.specs && (
                      <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 text-[9.5px] text-slate-600 font-medium">
                        {rental.specs.map((spec, i) => (
                          <div key={i} className="flex items-center gap-0.5 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                            {getSpecIcon(spec.icon)}
                            <span>{spec.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Near You Section matching Image 2 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 font-heading">
              Near You
            </h2>
            <button 
              onClick={() => setSelectedCategory('All Categories')}
              className="text-xs font-bold text-[#1464F4] hover:underline flex items-center gap-0.5"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
            {NEAR_YOU_RENTALS.map((item) => {
              const isSaved = savedListings.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (onOpenListingDetail) {
                      onOpenListingDetail(item.id, 'rentals');
                    } else {
                      onNavigate('/rental-detail');
                    }
                  }}
                  className="w-40 shrink-0 bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs flex flex-col cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="relative h-28 w-full bg-slate-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(item.id);
                      }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 text-white flex items-center justify-center tap-bounce"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                    </button>
                    <div className="absolute bottom-1.5 left-2">
                      <span className="px-1.5 py-0.5 rounded bg-black/60 text-white text-[8px] font-bold uppercase">
                        {item.categoryType}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 space-y-1">
                    <h4 className="text-[11px] font-bold text-slate-900 truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-0.5 text-[10px] text-slate-500">
                      <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <div className="text-[11px] font-extrabold text-[#1464F4]">
                      {item.price} <span className="text-[9px] text-slate-500 font-normal">{item.pricePeriod}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
