import React, { useState, useEffect, useCallback } from 'react';
import { CategoryIcon, getCategoryIconComponent } from '../components/CategoryIcon';
import { 
  Search, 
  ChevronDown, 
  SlidersHorizontal, 
  Wrench, 
  Siren, 
  MapPin, 
  Heart, 
  Star, 
  ArrowRight, 
  Home, 
  Tv, 
  Car, 
  Laptop, 
  Briefcase, 
  Palette, 
  GraduationCap, 
  LayoutGrid, 
  ShieldCheck, 
  MessageCircle, 
  Plug, 
  Snowflake, 
  Paintbrush, 
  Hammer, 
  Sparkles,
  PhoneCall,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { 
  SERVICE_CATEGORIES, 
  FEATURED_SERVICES, 
  SERVICES_NEAR_YOU, 
  SRI_LANKA_LOCATIONS 
} from '../data/mockData';
import { AppRoute, ServiceItem } from '../types';
import { CategoryService } from '../services/categoryService';

interface ServicesPageProps {
  onNavigate: (route: AppRoute) => void;
  onOpenListingDetail?: (id: string, moduleHint?: 'rentals' | 'jobs' | 'services') => void;
  savedListings?: string[];
  onToggleSave?: (id: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ 
  onNavigate, 
  onOpenListingDetail,
  savedListings = [],
  onToggleSave
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Sri Lanka');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedPrice, setSelectedPrice] = useState('Any Price');
  const [selectedServiceType, setSelectedServiceType] = useState('All Types');
  const [localSavedServices, setLocalSavedServices] = useState<string[]>([]);

  // Dropdowns
  const [activeDropdown, setActiveDropdown] = useState<'location' | 'category' | 'price' | 'serviceType' | null>(null);

  const priceOptions = ['Any Price', '< Rs. 2,000', 'Rs. 2,000 - 5,000', 'Rs. 5,000 - 15,000', 'Rs. 15,000+'];
  const serviceTypeOptions = ['All Types', 'On-Demand / Emergency', 'Scheduled Visit', 'Remote / Online', 'Package Service'];
  
  const [categoryOptions, setCategoryOptions] = useState<string[]>(['All Categories']);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const loadServiceCategories = useCallback(async (forceRefresh = false) => {
    setCategoriesLoading(true);
    setCategoriesError(null);
    const res = await CategoryService.getMainCategories('service');
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
    loadServiceCategories();
  }, [loadServiceCategories]);

  const getServiceCategoryIcon = (iconName: string) => {
    return getCategoryIconComponent({ iconKey: iconName, module: 'service', className: 'w-5 h-5 text-[#FF650A]' });
  };

  const getNearYouIcon = (iconName: string) => {
    switch (iconName) {
      case 'Plug': return <Plug className="w-4 h-4 text-[#FF650A]" />;
      case 'Snowflake': return <Snowflake className="w-4 h-4 text-[#0284C7]" />;
      case 'Paintbrush': return <Paintbrush className="w-4 h-4 text-[#08A34F]" />;
      case 'Hammer': return <Hammer className="w-4 h-4 text-[#8B5CF6]" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-[#EC4899]" />;
      default: return <Wrench className="w-4 h-4 text-[#FF650A]" />;
    }
  };

  const toggleSaveService = (id: string) => {
    if (onToggleSave) {
      onToggleSave(id);
    } else {
      setLocalSavedServices(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-28 overflow-x-hidden selection:bg-[#FF650A] selection:text-white">
      {/* Hero Section matching Image 4 with Amber/Warm Navy Glow & Professional Service Specialist Backdrop */}
      <div className="relative bg-gradient-to-b from-[#1C0F02] via-[#2A1705] to-[#3D1F08] text-white pt-4 pb-7 px-4 overflow-hidden shadow-md">
        {/* Background Visual Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=80"
            alt="Professional Technician in Sri Lanka"
            className="w-full h-full object-cover object-right opacity-30 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2A1705] via-[#2A1705]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C0F02] via-[#1C0F02]/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-md lg:max-w-7xl mx-auto">
          {/* Main Hero Headline matching Image 4 */}
          <div className="mt-1">
            <h1 className="text-3xl font-extrabold tracking-tight leading-[1.15] font-heading text-white">
              Professional<br />
              <span className="text-[#FF650A] text-orange-400">Services</span><br />
              Right at Your<br />
              Fingertips
            </h1>
            <p className="text-xs text-orange-100/90 mt-1.5 max-w-[280px] leading-relaxed">
              Find trusted experts and skilled professionals near you.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-3 relative z-20 space-y-5">
        {/* Floating Search & Filter Card matching Image 4 */}
        <div className="bg-white rounded-2xl p-3 shadow-md border border-slate-200/80 space-y-2.5">
          {/* Main Search Input with Orange Search Circle */}
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-1.5 border border-slate-200">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onNavigate('/search');
              }}
              placeholder="Search services, skills or providers..."
              className="flex-1 bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none py-1.5 font-medium"
            />
            <button 
              onClick={() => onNavigate('/search')}
              className="w-8 h-8 rounded-full bg-[#FF650A] text-white flex items-center justify-center shadow-md shadow-orange-500/25 tap-bounce shrink-0"
              aria-label="Search services"
            >
              <Search className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Filter Pills matching Image 4 */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[11px]">
            {/* Location Pill */}
            <div className="relative shrink-0">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'location' ? null : 'location')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold"
              >
                <MapPin className="w-3.5 h-3.5 text-[#FF650A]" />
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
                      className="w-full px-3 py-1.5 text-left text-xs hover:bg-orange-50 text-slate-800 font-medium flex items-center justify-between"
                    >
                      <span>{loc.name}</span>
                      {selectedLocation === loc.name && <span className="text-[#FF650A] font-bold">✓</span>}
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
                <LayoutGrid className="w-3.5 h-3.5 text-[#FF650A]" />
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
                        onClick={() => loadServiceCategories(true)}
                        className="px-2 py-0.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded text-[10px] inline-flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Retry
                      </button>
                    </div>
                  )}
                  {!categoriesLoading && !categoriesError && categoryOptions.length <= 1 && (
                    <div className="px-3 py-2 text-xs text-slate-400 font-medium">
                      No service categories are available yet.
                    </div>
                  )}
                  {!categoriesLoading && !categoriesError && categoryOptions.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setActiveDropdown(null); }}
                      className="w-full px-3 py-1.5 text-left text-xs hover:bg-orange-50 text-slate-800 font-medium flex items-center justify-between cursor-pointer"
                    >
                      <span>{cat}</span>
                      {selectedCategory === cat && <span className="text-[#FF650A] font-bold">✓</span>}
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
                <span className="text-[#FF650A] font-bold text-xs">🏷️</span>
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
                      className="w-full px-3 py-1.5 text-left text-xs hover:bg-orange-50 text-slate-800 font-medium flex items-center justify-between"
                    >
                      <span>{pr}</span>
                      {selectedPrice === pr && <span className="text-[#FF650A] font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Service Type Pill */}
            <div className="relative shrink-0">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'serviceType' ? null : 'serviceType')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold"
              >
                <Wrench className="w-3.5 h-3.5 text-[#FF650A]" />
                <span className="text-[10.5px]">Service Type:</span>
                <span className="font-bold text-slate-900 truncate max-w-[65px]">{selectedServiceType}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {activeDropdown === 'serviceType' && (
                <div className="absolute top-full right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95">
                  {serviceTypeOptions.map((st) => (
                    <button
                      key={st}
                      onClick={() => { setSelectedServiceType(st); setActiveDropdown(null); }}
                      className="w-full px-3 py-1.5 text-left text-xs hover:bg-orange-50 text-slate-800 font-medium flex items-center justify-between"
                    >
                      <span>{st}</span>
                      {selectedServiceType === st && <span className="text-[#FF650A] font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* More Filters button */}
            <button
              onClick={() => onNavigate('/filters')}
              className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#FF650A] text-white font-bold tap-bounce shadow-xs cursor-pointer"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span className="text-[10.5px]">More Filters</span>
            </button>
          </div>
        </div>

        {/* 3 Quick Action Cards Row matching Image 4 */}
        <div className="grid grid-cols-3 gap-2">
          {/* Action 1: Offer Your Service */}
          <div 
            onClick={() => onNavigate('/post')}
            className="bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-xs flex flex-col justify-between cursor-pointer hover:border-orange-400 transition-colors tap-bounce"
          >
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF650A] flex items-center justify-center mb-1.5">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-slate-900 leading-tight">Offer Your Service</h4>
              <p className="text-[9px] text-slate-500 leading-tight mt-0.5">Join thousands of service providers.</p>
            </div>
            <div className="w-5 h-5 rounded-full bg-[#FF650A] text-white flex items-center justify-center mt-2 self-end">
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Action 2: Emergency Services */}
          <div 
            onClick={() => setSelectedServiceType('On-Demand / Emergency')}
            className="bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-xs flex flex-col justify-between cursor-pointer hover:border-orange-400 transition-colors tap-bounce"
          >
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF650A] flex items-center justify-center mb-1.5">
              <Siren className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-slate-900 leading-tight">Emergency Services</h4>
              <p className="text-[9px] text-slate-500 leading-tight mt-0.5">24/7 urgent help near you.</p>
            </div>
            <div className="w-5 h-5 rounded-full bg-[#FF650A] text-white flex items-center justify-center mt-2 self-end">
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Action 3: Near Me */}
          <div 
            onClick={() => setSelectedLocation('Colombo')}
            className="bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-xs flex flex-col justify-between cursor-pointer hover:border-orange-400 transition-colors tap-bounce"
          >
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF650A] flex items-center justify-center mb-1.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-slate-900 leading-tight">Near Me</h4>
              <p className="text-[9px] text-slate-500 leading-tight mt-0.5">Find services near your location.</p>
            </div>
            <div className="w-5 h-5 rounded-full bg-[#FF650A] text-white flex items-center justify-center mt-2 self-end">
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Popular Service Categories matching Image 4 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 font-heading">
              Popular Service Categories
            </h2>
            <button 
              onClick={() => setSelectedCategory('All Categories')}
              className="text-xs font-bold text-[#FF650A] hover:underline flex items-center gap-0.5"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {SERVICE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#FF650A] transition-all group tap-bounce"
              >
                <div 
                  className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{ backgroundColor: cat.bgColor }}
                >
                  {getServiceCategoryIcon(cat.iconName)}
                </div>
                <span className="text-[10.5px] font-bold text-slate-700 text-center leading-tight truncate w-full">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Services matching Image 4 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 font-heading">
              Featured Services
            </h2>
            <button 
              onClick={() => setSelectedCategory('All Categories')}
              className="text-xs font-bold text-[#FF650A] hover:underline flex items-center gap-0.5"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
            {FEATURED_SERVICES.map((srv) => {
              const isSaved = savedListings.includes(srv.id) || localSavedServices.includes(srv.id);
              return (
                <div
                  key={srv.id}
                  onClick={() => {
                    if (onOpenListingDetail) {
                      onOpenListingDetail(srv.id, 'services');
                    } else {
                      onNavigate('/service-detail');
                    }
                  }}
                  className="w-64 shrink-0 bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow"
                >
                  {/* Photo & badges */}
                  <div className="relative h-36 w-full bg-slate-100">
                    <img
                      src={srv.imageUrl}
                      alt={srv.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-[#FF650A] text-white text-[9.5px] font-black uppercase tracking-wider shadow-sm">
                        FEATURED
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveService(srv.id);
                      }}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 text-white hover:bg-black/60 flex items-center justify-center backdrop-blur-xs tap-bounce"
                      aria-label="Save service"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                    </button>

                    <div className="absolute bottom-2 left-2.5">
                      <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold uppercase">
                        {srv.categoryTag}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 line-clamp-1 font-heading">
                        {srv.title}
                      </h3>

                      <div className="flex items-center gap-1 text-[11px] text-slate-700 font-semibold mt-1">
                        <span>{srv.providerName}</span>
                        {srv.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                      </div>

                      <div className="flex items-center gap-1 text-[10.5px] text-slate-500 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{srv.location}</span>
                      </div>
                    </div>

                    {/* Rating & Price */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-[11px] font-bold text-slate-900">{srv.rating}</span>
                        <span className="text-[10px] text-slate-400">({srv.reviewsCount})</span>
                      </div>
                      <div className="text-xs font-black text-[#FF650A] font-heading">
                        {srv.price} <span className="text-[10px] text-slate-500 font-normal">{srv.priceUnit}</span>
                      </div>
                    </div>

                    {/* WhatsApp & View Details Action buttons matching Image 4 */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <a
                        href={`https://wa.me/${srv.whatsappNumber}?text=Hi%20${encodeURIComponent(srv.providerName)},%20I%20saw%20your%20listing%20on%20RENTOURA`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 rounded-xl bg-[#25D366] text-white flex items-center justify-center hover:bg-[#20bd5a] tap-bounce shrink-0 shadow-xs"
                        aria-label="WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4 fill-white text-white" />
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenListingDetail) {
                            onOpenListingDetail(srv.id, 'services');
                          } else {
                            onNavigate('/service-detail');
                          }
                        }}
                        className="flex-1 py-1.5 bg-[#FF650A] hover:bg-orange-600 text-white rounded-xl text-[10.5px] font-bold text-center tap-bounce shadow-xs"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Services Near You matching Image 4 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 font-heading">
              Services Near You
            </h2>
            <button 
              onClick={() => setSelectedCategory('All Categories')}
              className="text-xs font-bold text-[#FF650A] hover:underline flex items-center gap-0.5"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
            {SERVICES_NEAR_YOU.map((near) => (
              <div
                key={near.id}
                onClick={() => {
                  if (onOpenListingDetail) {
                    onOpenListingDetail(near.id, 'services');
                  } else {
                    setSelectedCategory(near.name);
                  }
                }}
                className="w-28 shrink-0 bg-white rounded-2xl p-2.5 border border-slate-200 shadow-xs flex flex-col items-center text-center cursor-pointer hover:border-orange-400 transition-colors"
              >
                <div 
                  className="w-10 h-10 rounded-2xl flex items-center justify-center mb-1.5 shadow-xs"
                  style={{ backgroundColor: near.bgColor }}
                >
                  {getNearYouIcon(near.iconName)}
                </div>
                <h4 className="text-[11px] font-bold text-slate-900 truncate w-full">
                  {near.name}
                </h4>
                <p className="text-[9.5px] text-slate-500 mt-0.5">{near.distance}</p>
                <div className="flex items-center gap-0.5 mt-1 text-[10px] font-bold text-slate-800">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{near.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Banner matching Image 4 */}
        <div className="bg-gradient-to-r from-[#FF5100] via-[#FF650A] to-[#FF8C38] text-white rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-md shadow-orange-500/20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 border border-white/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold font-heading text-white">Safe. Trusted. Verified.</h3>
              <p className="text-[10px] text-orange-100 truncate max-w-[190px]">
                All service providers are verified for your safety.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('/help')}
            className="px-3 py-2 rounded-xl bg-white text-[#FF650A] hover:bg-orange-50 text-[11px] font-extrabold flex items-center gap-1 shrink-0 tap-bounce shadow-sm"
          >
            Learn More <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
