import React, { useState, useMemo, useEffect } from 'react';
import { CategoryIcon, getCategoryIconComponent } from '../CategoryIcon';
import { 
  FolderTree, 
  Search, 
  Plus, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  Tag, 
  CornerDownRight, 
  Layers, 
  RotateCcw, 
  Download, 
  Eye, 
  EyeOff, 
  List, 
  Grid, 
  X, 
  AlertTriangle, 
  ShoppingBag, 
  Briefcase, 
  Wrench, 
  Sparkles,
  Info,
  Building,
  Car,
  Home,
  Check,
  Package,
  Shield,
  Zap,
  Star,
  Smartphone,
  Truck,
  Heart,
  Globe,
  Award,
  BookOpen,
  Camera,
  Coffee,
  Compass,
  Cpu,
  Feather,
  Gift,
  HardDrive,
  Key,
  MapPin,
  Music,
  Settings
} from 'lucide-react';
import { StaffAccount } from '../../types/adminTypes';
import { ModuleType, MainCategoryData, SubCategoryData, ThirdLevelOption } from '../../data/categorySelectorData';
import { CategoryService, FlatCategoryItem, CategoryStats, AddCategoryPayload } from '../../services/categoryService';

interface AdminCategoryViewProps {
  staff: StaffAccount;
  onRefresh?: () => void;
}

// Available Lucide Icon options for Category Icon Selector
const ICON_OPTIONS = [
  'Folder', 'Tag', 'CornerDownRight', 'Home', 'Building', 'Car', 'Truck', 
  'Briefcase', 'Wrench', 'Sparkles', 'Package', 'Shield', 'Zap', 'Star', 
  'Smartphone', 'Heart', 'Globe', 'Award', 'Camera', 'Coffee', 'Cpu', 'Key', 'Settings', 'Wrench'
];

export const AdminCategoryView: React.FC<AdminCategoryViewProps> = ({ staff, onRefresh }) => {
  // Master Category Tree & Flat State
  const [flatList, setFlatList] = useState<FlatCategoryItem[]>(() => CategoryService.getFlatCategoryList('all', true));
  const [categoryStats, setCategoryStats] = useState<CategoryStats>(() => CategoryService.getCategoryStats());
  
  // View mode: 'tree' or 'table'
  const [viewMode, setViewMode] = useState<'tree' | 'table'>('tree');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState<'all' | ModuleType>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  // Expanded tree items (main cat IDs and sub cat IDs)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    // Expand all main categories by default
    const set = new Set<string>();
    CategoryService.getFlatCategoryList('all', true).forEach(item => {
      if (item.level === 'main' || item.level === 'sub') {
        set.add(item.id);
      }
    });
    return set;
  });

  // Table Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addPayload, setAddPayload] = useState<AddCategoryPayload>({
    module: 'rentals',
    level: 'main',
    name: '',
    slug: '',
    parentId: '',
    parentMainId: '',
    icon: 'Folder',
    description: '',
    subtitle: '',
    iconBgColor: '#EFF6FF',
    iconColor: '#1464F4',
    status: 'active',
    aliases: []
  });
  const [addError, setAddError] = useState('');

  const [editingItem, setEditingItem] = useState<FlatCategoryItem | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    slug: '',
    icon: 'Folder',
    description: '',
    subtitle: '',
    iconBgColor: '#EFF6FF',
    iconColor: '#1464F4',
    status: 'active' as 'active' | 'disabled'
  });
  const [editError, setEditError] = useState('');

  const [deleteConfirmItem, setDeleteConfirmItem] = useState<FlatCategoryItem | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Action Dropdown state
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Refresh helper
  const reloadData = () => {
    setFlatList(CategoryService.getFlatCategoryList('all', true));
    setCategoryStats(CategoryService.getCategoryStats());
    if (onRefresh) onRefresh();
  };

  useEffect(() => {
    const handleCategoryUpdate = () => {
      reloadData();
    };
    window.addEventListener('rentoura_categories_updated', handleCategoryUpdate);
    return () => {
      window.removeEventListener('rentoura_categories_updated', handleCategoryUpdate);
    };
  }, []);

  // Filtered Flat List for Table View
  const filteredFlatList = useMemo(() => {
    return flatList.filter(item => {
      // Module filter
      if (moduleFilter !== 'all' && item.module !== moduleFilter) return false;
      
      // Status filter
      if (statusFilter === 'active' && item.status !== 'active') return false;
      if (statusFilter === 'disabled' && item.status !== 'disabled') return false;

      // Level filter
      if (levelFilter !== 'all' && item.level !== levelFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q);
        const matchSlug = item.slug.toLowerCase().includes(q);
        const matchParent = item.parentName ? item.parentName.toLowerCase().includes(q) : false;
        const matchDesc = item.description ? item.description.toLowerCase().includes(q) : false;
        const matchAliases = item.aliases ? item.aliases.some(a => a.toLowerCase().includes(q)) : false;

        return matchName || matchSlug || matchParent || matchDesc || matchAliases;
      }

      return true;
    });
  }, [flatList, moduleFilter, statusFilter, levelFilter, searchQuery]);

  // Paginated Data Table
  const totalPages = Math.ceil(filteredFlatList.length / rowsPerPage) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredFlatList.slice(start, start + rowsPerPage);
  }, [filteredFlatList, currentPage, rowsPerPage]);

  // Toggle tree node expansion
  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Toggle Category Active/Disabled Status
  const handleToggleStatus = (id: string) => {
    const res = CategoryService.toggleCategoryStatus(id, staff);
    if (res.success) {
      reloadData();
    }
  };

  // Reorder Item Position
  const handleReorder = (id: string, direction: 'up' | 'down') => {
    const res = CategoryService.reorderCategory(id, direction, staff);
    if (res.success) {
      reloadData();
    }
  };

  // Open Add Subcategory Modal directly pre-configured
  const handleOpenAddChild = (parentItem: FlatCategoryItem) => {
    if (parentItem.level === 'main') {
      setAddPayload({
        module: parentItem.module,
        level: 'sub',
        name: '',
        slug: '',
        parentId: parentItem.id,
        parentMainId: parentItem.id,
        icon: parentItem.icon || 'Tag',
        description: '',
        subtitle: '',
        iconBgColor: parentItem.iconBgColor || '#EFF6FF',
        iconColor: parentItem.iconColor || '#1464F4',
        status: 'active',
        aliases: []
      });
    } else if (parentItem.level === 'sub') {
      setAddPayload({
        module: parentItem.module,
        level: 'third',
        name: '',
        slug: '',
        parentId: parentItem.id,
        parentMainId: parentItem.parentMainId || parentItem.parentId,
        icon: 'CornerDownRight',
        description: '',
        subtitle: '',
        iconBgColor: '#EFF6FF',
        iconColor: '#1464F4',
        status: 'active',
        aliases: []
      });
    }
    setAddError('');
    setIsAddModalOpen(true);
  };

  // Handle Submit Add Category Form
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addPayload.name.trim()) {
      setAddError('Category name is required.');
      return;
    }

    const res = CategoryService.addCategory(addPayload, staff);
    if (res.success) {
      setIsAddModalOpen(false);
      setAddPayload({
        module: 'rentals',
        level: 'main',
        name: '',
        slug: '',
        parentId: '',
        parentMainId: '',
        icon: 'Folder',
        description: '',
        subtitle: '',
        iconBgColor: '#EFF6FF',
        iconColor: '#1464F4',
        status: 'active',
        aliases: []
      });
      reloadData();
    } else {
      setAddError(res.error || 'Failed to create category.');
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (item: FlatCategoryItem) => {
    setEditingItem(item);
    setEditForm({
      name: item.name,
      slug: item.slug,
      icon: item.icon || 'Folder',
      description: item.description || '',
      subtitle: item.subtitle || '',
      iconBgColor: item.iconBgColor || '#EFF6FF',
      iconColor: item.iconColor || '#1464F4',
      status: item.status
    });
    setEditError('');
  };

  // Submit Edit Form
  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (!editForm.name.trim()) {
      setEditError('Category name is required.');
      return;
    }

    const res = CategoryService.updateCategory(editingItem.id, {
      name: editForm.name,
      slug: editForm.slug,
      icon: editForm.icon,
      description: editForm.description,
      subtitle: editForm.subtitle,
      iconBgColor: editForm.iconBgColor,
      iconColor: editForm.iconColor,
      status: editForm.status
    }, staff);

    if (res.success) {
      setEditingItem(null);
      reloadData();
    } else {
      setEditError(res.error || 'Failed to update category.');
    }
  };

  // Handle Delete Confirmation
  const handleDeleteCategory = () => {
    if (!deleteConfirmItem) return;
    const res = CategoryService.deleteCategory(deleteConfirmItem.id, staff);
    if (res.success) {
      setDeleteConfirmItem(null);
      reloadData();
    }
  };

  // Reset Taxonomy
  const handleResetTaxonomy = () => {
    CategoryService.resetToDefaultTaxonomy(staff);
    setIsResetConfirmOpen(false);
    reloadData();
  };

  // Helper render icon dynamically
  const renderCategoryIcon = (iconName: string, className: string = 'w-4 h-4') => {
    return getCategoryIconComponent({ iconKey: iconName, className });
  };

  // Render Module Badge
  const renderModuleBadge = (mod: ModuleType) => {
    switch (mod) {
      case 'rentals':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-blue-50 text-blue-600 border border-blue-200">
            <ShoppingBag className="w-3 h-3" />
            Rentals
          </span>
        );
      case 'jobs':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-600 border border-emerald-200">
            <Briefcase className="w-3 h-3" />
            Jobs
          </span>
        );
      case 'services':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-orange-50 text-orange-600 border border-orange-200">
            <Wrench className="w-3 h-3" />
            Services
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-2xl bg-blue-50 border border-blue-100 text-[#1464F4]">
              <FolderTree className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Category Taxonomy Control Center
              </h1>
              <p className="text-slate-500 text-xs font-medium mt-0.5">
                Central single-source-of-truth administrator for marketplace modules, hierarchy depth, and form mappings.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Reset store to default approved RENTOURA.LK taxonomy"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAddPayload({
                module: moduleFilter !== 'all' ? moduleFilter : 'rentals',
                level: 'main',
                name: '',
                slug: '',
                parentId: '',
                parentMainId: '',
                icon: 'Folder',
                description: '',
                subtitle: '',
                iconBgColor: '#EFF6FF',
                iconColor: '#1464F4',
                status: 'active',
                aliases: []
              });
              setAddError('');
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-[#1464F4] hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Category</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Categories</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{categoryStats.totalCategories}</div>
          <div className="text-[10px] text-slate-400 font-semibold mt-1">
            {categoryStats.mainCount} Main · {categoryStats.subCount} Sub · {categoryStats.thirdLevelCount} 3rd
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Taxonomy</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{categoryStats.activeCount}</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">
            Live in search & forms
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-rose-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Disabled / Hidden</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{categoryStats.disabledCount}</div>
          <div className="text-[10px] text-rose-500 font-bold mt-1">
            Hidden from frontend
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Mapped Listings</span>
            <ShoppingBag className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{categoryStats.totalListingsMapped}</div>
          <div className="text-[10px] text-slate-400 font-semibold mt-1">
            Across active marketplace
          </div>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Module Counts</div>
          <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
            <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-bold border border-blue-100">
              Rentals: {categoryStats.rentalsCount}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
              Jobs: {categoryStats.jobsCount}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-orange-50 text-orange-700 font-bold border border-orange-100">
              Services: {categoryStats.servicesCount}
            </span>
          </div>
        </div>

      </div>

      {/* Search, Module Tabs, and Filter Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3.5">
        
        {/* Module Switcher Tabs & View Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => { setModuleFilter('all'); setCurrentPage(1); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                moduleFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Modules ({categoryStats.totalCategories})
            </button>

            <button
              type="button"
              onClick={() => { setModuleFilter('rentals'); setCurrentPage(1); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                moduleFilter === 'rentals'
                  ? 'bg-[#1464F4] text-white shadow-xs'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Rentals ({categoryStats.rentalsCount})</span>
            </button>

            <button
              type="button"
              onClick={() => { setModuleFilter('jobs'); setCurrentPage(1); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                moduleFilter === 'jobs'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Jobs ({categoryStats.jobsCount})</span>
            </button>

            <button
              type="button"
              onClick={() => { setModuleFilter('services'); setCurrentPage(1); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                moduleFilter === 'services'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Services ({categoryStats.servicesCount})</span>
            </button>
          </div>

          {/* Dual View Mode Switcher */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('tree')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'tree' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5 text-blue-600" />
              <span>Hierarchy Tree</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5 text-blue-600" />
              <span>Data Table</span>
            </button>
          </div>

        </div>

        {/* Search input & Secondary Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search category name, slug, description or parent..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="disabled">Disabled Only</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
            >
              <option value="all">All Category Levels</option>
              <option value="main">Main Categories Only</option>
              <option value="sub">Subcategories Only</option>
              <option value="third">3rd Level Options Only</option>
            </select>
          </div>

        </div>

      </div>

      {/* View Mode 1: Hierarchy Tree Presentation */}
      {viewMode === 'tree' && (
        <div className="space-y-4">
          {(moduleFilter === 'all' ? ['rentals', 'jobs', 'services'] as ModuleType[] : [moduleFilter]).map(mod => {
            const moduleTree = CategoryService.getCategorySystemData(true)[mod];
            if (!moduleTree || !moduleTree.categories) return null;

            // Filter main categories inside this module based on status/search
            const mainCategories = moduleTree.categories.filter(main => {
              if (statusFilter === 'active' && main.status === 'disabled') return false;
              if (statusFilter === 'disabled' && main.status !== 'disabled') return false;
              if (levelFilter === 'sub' || levelFilter === 'third') return true;

              if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                const matchMain = main.name.toLowerCase().includes(q) || (main.slug && main.slug.includes(q));
                const matchSubs = main.subcategories.some(s => 
                  s.name.toLowerCase().includes(q) || 
                  (s.thirdLevelOptions || []).some(t => t.name.toLowerCase().includes(q))
                );
                return matchMain || matchSubs;
              }
              return true;
            });

            if (mainCategories.length === 0) return null;

            return (
              <div key={mod} className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                
                {/* Module Tree Header Banner */}
                <div className={`p-4 border-b flex items-center justify-between ${
                  mod === 'rentals' ? 'bg-blue-50/70 border-blue-100 text-blue-900' :
                  mod === 'jobs' ? 'bg-emerald-50/70 border-emerald-100 text-emerald-900' :
                  'bg-orange-50/70 border-orange-100 text-orange-900'
                }`}>
                  <div className="flex items-center gap-2.5">
                    {renderModuleBadge(mod)}
                    <span className="text-xs font-black uppercase tracking-wider">
                      {mod.toUpperCase()} TAXONOMY TREE
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      ({mainCategories.length} Main Categories)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setAddPayload({
                        module: mod,
                        level: 'main',
                        name: '',
                        slug: '',
                        parentId: '',
                        parentMainId: '',
                        icon: 'Folder',
                        description: '',
                        subtitle: '',
                        iconBgColor: mod === 'rentals' ? '#EFF6FF' : mod === 'jobs' ? '#ECFDF5' : '#FFF7ED',
                        iconColor: mod === 'rentals' ? '#1464F4' : mod === 'jobs' ? '#08A34F' : '#FF650A',
                        status: 'active',
                        aliases: []
                      });
                      setAddError('');
                      setIsAddModalOpen(true);
                    }}
                    className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-blue-600" />
                    <span>Add Main Category</span>
                  </button>
                </div>

                {/* Tree Branch Items */}
                <div className="p-4 space-y-3">
                  {mainCategories.map((main, mainIdx) => {
                    const isMainExpanded = expandedItems.has(main.id);
                    const mainFlat = flatList.find(f => f.id === main.id);

                    return (
                      <div 
                        key={main.id} 
                        className={`rounded-2xl border transition-all ${
                          main.status === 'disabled' 
                            ? 'bg-slate-50 border-slate-200/80 opacity-75' 
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {/* Main Category Row */}
                        <div className="p-3.5 flex items-center justify-between gap-3">
                          
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Expand/Collapse Chevron */}
                            <button
                              type="button"
                              onClick={() => toggleExpand(main.id)}
                              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 shrink-0"
                            >
                              {isMainExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>

                            {/* Main Icon Badge */}
                            <div 
                              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                              style={{ backgroundColor: main.iconBgColor || '#EFF6FF', color: main.iconColor || '#1464F4' }}
                            >
                              {renderCategoryIcon(main.icon || 'Folder', 'w-4 h-4')}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-extrabold text-slate-900 truncate">{main.name}</span>
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[10px] font-bold">
                                  /{main.slug || CategoryService.slugify(main.name)}
                                </span>
                                {main.status === 'disabled' ? (
                                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                                    Disabled
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                    Active
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-400 text-xs truncate mt-0.5 font-medium">
                                {main.description || `${main.subcategories.length} Subcategories`}
                              </p>
                            </div>
                          </div>

                          {/* Controls & Badges */}
                          <div className="flex items-center gap-2 shrink-0">
                            
                            {/* Mapped Listings Count */}
                            <span className="hidden sm:inline-flex px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
                              {mainFlat?.listingsCount || 0} Listings
                            </span>

                            {/* Add Subcategory */}
                            <button
                              type="button"
                              onClick={() => mainFlat && handleOpenAddChild(mainFlat)}
                              className="p-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1464F4] transition-colors"
                              title="Add Subcategory"
                            >
                              <Plus className="w-4 h-4" />
                            </button>

                            {/* Reorder Up/Down */}
                            <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                              <button
                                type="button"
                                onClick={() => handleReorder(main.id, 'up')}
                                disabled={mainIdx === 0}
                                className="p-1 rounded-lg text-slate-600 hover:text-slate-900 disabled:opacity-30"
                                title="Move Up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReorder(main.id, 'down')}
                                disabled={mainIdx === mainCategories.length - 1}
                                className="p-1 rounded-lg text-slate-600 hover:text-slate-900 disabled:opacity-30"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Status Toggle */}
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(main.id)}
                              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-colors ${
                                main.status === 'disabled'
                                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              }`}
                            >
                              {main.status === 'disabled' ? 'Enable' : 'Disable'}
                            </button>

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => mainFlat && handleOpenEdit(mainFlat)}
                              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                              title="Edit Category"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => mainFlat && setDeleteConfirmItem(mainFlat)}
                              className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                              title="Delete Category"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                        </div>

                        {/* Nested Subcategories View */}
                        {isMainExpanded && main.subcategories.length > 0 && (
                          <div className="px-4 pb-4 pt-1 ml-6 border-l-2 border-slate-200 space-y-2.5">
                            {main.subcategories.map((sub, subIdx) => {
                              const isSubExpanded = expandedItems.has(sub.id);
                              const subFlat = flatList.find(f => f.id === sub.id);

                              return (
                                <div 
                                  key={sub.id} 
                                  className={`p-3 rounded-2xl border transition-all ${
                                    sub.status === 'disabled' ? 'bg-slate-50/80 border-slate-200 opacity-80' : 'bg-slate-50/50 border-slate-200/90'
                                  }`}
                                >
                                  {/* Subcategory Row */}
                                  <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      {sub.thirdLevelOptions && sub.thirdLevelOptions.length > 0 && (
                                        <button
                                          type="button"
                                          onClick={() => toggleExpand(sub.id)}
                                          className="p-0.5 text-slate-400 hover:text-slate-700"
                                        >
                                          {isSubExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                        </button>
                                      )}

                                      <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                                        {renderCategoryIcon(sub.icon || 'Tag', 'w-3.5 h-3.5')}
                                      </div>

                                      <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-extrabold text-slate-900 truncate">{sub.name}</span>
                                          <span className="px-1.5 py-0.5 rounded bg-white text-slate-500 font-mono text-[9px] font-bold border border-slate-200">
                                            /{sub.slug || CategoryService.slugify(sub.name)}
                                          </span>
                                        </div>
                                        {sub.subtitle && (
                                          <p className="text-[11px] text-slate-400 truncate">{sub.subtitle}</p>
                                        )}
                                      </div>
                                    </div>

                                    {/* Sub Controls */}
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <span className="hidden sm:inline-block px-2 py-0.5 rounded-lg bg-white text-slate-600 text-[11px] font-bold border border-slate-200">
                                        {subFlat?.listingsCount || 0} listings
                                      </span>

                                      <button
                                        type="button"
                                        onClick={() => subFlat && handleOpenAddChild(subFlat)}
                                        className="p-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                                        title="Add 3rd Level Option"
                                      >
                                        <Plus className="w-3.5 h-3.5" />
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleToggleStatus(sub.id)}
                                        className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                                          sub.status === 'disabled' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                        }`}
                                      >
                                        {sub.status === 'disabled' ? 'Enable' : 'Disable'}
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => subFlat && handleOpenEdit(subFlat)}
                                        className="p-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => subFlat && setDeleteConfirmItem(subFlat)}
                                        className="p-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Nested 3rd Level Options */}
                                  {isSubExpanded && sub.thirdLevelOptions && sub.thirdLevelOptions.length > 0 && (
                                    <div className="mt-2.5 pt-2 pl-4 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                      {sub.thirdLevelOptions.map(third => {
                                        const thirdFlat = flatList.find(f => f.id === third.id);
                                        return (
                                          <div 
                                            key={third.id} 
                                            className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2"
                                          >
                                            <div className="flex items-center gap-1.5 min-w-0">
                                              <CornerDownRight className="w-3 h-3 text-slate-400 shrink-0" />
                                              <span className="text-[11px] font-bold text-slate-800 truncate">{third.name}</span>
                                            </div>

                                            <div className="flex items-center gap-1 shrink-0">
                                              <button
                                                type="button"
                                                onClick={() => thirdFlat && handleOpenEdit(thirdFlat)}
                                                className="p-1 rounded bg-slate-100 text-slate-600 hover:text-slate-900 text-[10px]"
                                              >
                                                <Edit3 className="w-3 h-3" />
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => thirdFlat && setDeleteConfirmItem(thirdFlat)}
                                                className="p-1 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 text-[10px]"
                                              >
                                                <Trash2 className="w-3 h-3" />
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      })}
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
            );
          })}
        </div>
      )}

      {/* View Mode 2: Admin Category Data Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider">
                  <th className="p-4">Category & Icon</th>
                  <th className="p-4">Module</th>
                  <th className="p-4">Level</th>
                  <th className="p-4">Parent Trail</th>
                  <th className="p-4">Slug Key</th>
                  <th className="p-4">Mapped Listings</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400 font-medium">
                      No categories found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedList.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Name & Icon */}
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div 
                            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-slate-200"
                            style={{ backgroundColor: item.iconBgColor || '#EFF6FF', color: item.iconColor || '#1464F4' }}
                          >
                            {renderCategoryIcon(item.icon, 'w-4 h-4')}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900">{item.name}</div>
                            {item.description && (
                              <div className="text-[10px] text-slate-400 truncate max-w-[200px]">{item.description}</div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Module */}
                      <td className="p-4">
                        {renderModuleBadge(item.module)}
                      </td>

                      {/* Level */}
                      <td className="p-4">
                        {item.level === 'main' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-50 text-purple-700 border border-purple-200">
                            Main Category
                          </span>
                        ) : item.level === 'sub' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-50 text-cyan-700 border border-cyan-200">
                            Subcategory
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-200">
                            3rd Level Option
                          </span>
                        )}
                      </td>

                      {/* Parent Trail */}
                      <td className="p-4 text-slate-500 font-medium text-[11px]">
                        {item.level === 'main' ? (
                          <span className="text-slate-400">— Root Level —</span>
                        ) : item.level === 'sub' ? (
                          <span className="font-semibold text-slate-700">{item.parentName}</span>
                        ) : (
                          <span>{item.parentMainName} › {item.parentName}</span>
                        )}
                      </td>

                      {/* Slug Key */}
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold border border-slate-200">
                          {item.slug}
                        </span>
                      </td>

                      {/* Mapped Listings */}
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold">
                          {item.listingsCount}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item.id)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                            item.status === 'active' 
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          }`}
                        >
                          {item.status === 'active' ? 'Active' : 'Disabled'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.level !== 'third' && (
                            <button
                              type="button"
                              onClick={() => handleOpenAddChild(item)}
                              className="p-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100"
                              title="Add Child Category"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmItem(item)}
                            className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100"
                            title="Delete"
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

          {/* Table Pagination Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 font-medium">
            <div>
              Showing {filteredFlatList.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredFlatList.length)} of {filteredFlatList.length} categories
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-40 font-bold"
              >
                Previous
              </button>
              <span className="font-bold text-slate-800">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-40 font-bold"
              >
                Next
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ================= MODAL 1: ADD CATEGORY MODAL ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-5 my-8">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-[#1464F4]">
                  <FolderTree className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Add New Category</h3>
                  <p className="text-slate-400 text-xs font-medium">Define a new category in the RENTOURA.LK taxonomy</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
              
              {/* Level & Module Pickers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Module</label>
                  <select
                    value={addPayload.module}
                    onChange={(e) => setAddPayload({ ...addPayload, module: e.target.value as ModuleType, parentId: '' })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    <option value="rentals">Rentals</option>
                    <option value="jobs">Jobs</option>
                    <option value="services">Services</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category Level</label>
                  <select
                    value={addPayload.level}
                    onChange={(e) => setAddPayload({ ...addPayload, level: e.target.value as any, parentId: '' })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    <option value="main">Main Category</option>
                    <option value="sub">Subcategory</option>
                    <option value="third">3rd Level Option</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Parent Selector */}
              {addPayload.level === 'sub' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Parent Main Category *</label>
                  <select
                    value={addPayload.parentId}
                    onChange={(e) => setAddPayload({ ...addPayload, parentId: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    <option value="">-- Select Parent Main Category --</option>
                    {flatList
                      .filter(f => f.module === addPayload.module && f.level === 'main')
                      .map(main => (
                        <option key={main.id} value={main.id}>{main.name}</option>
                      ))
                    }
                  </select>
                </div>
              )}

              {addPayload.level === 'third' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Parent Subcategory *</label>
                  <select
                    value={addPayload.parentId}
                    onChange={(e) => setAddPayload({ ...addPayload, parentId: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    <option value="">-- Select Parent Subcategory --</option>
                    {flatList
                      .filter(f => f.module === addPayload.module && f.level === 'sub')
                      .map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.parentName} › {sub.name}</option>
                      ))
                    }
                  </select>
                </div>
              )}

              {/* Name & Slug */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  value={addPayload.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setAddPayload({ ...addPayload, name, slug: CategoryService.slugify(name) });
                  }}
                  placeholder="e.g. Heavy Machinery, Graphic Design..."
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Slug / System Key</label>
                <input
                  type="text"
                  value={addPayload.slug}
                  onChange={(e) => setAddPayload({ ...addPayload, slug: e.target.value })}
                  placeholder="auto-generated-slug"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-700"
                />
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Icon</label>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-50 text-[#1464F4] border border-blue-200 shrink-0">
                    {renderCategoryIcon(addPayload.icon || 'Folder', 'w-5 h-5')}
                  </div>
                  <select
                    value={addPayload.icon}
                    onChange={(e) => setAddPayload({ ...addPayload, icon: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  >
                    {ICON_OPTIONS.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description / Subtitle */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Subtitle</label>
                <textarea
                  value={addPayload.description}
                  onChange={(e) => setAddPayload({ ...addPayload, description: e.target.value })}
                  rows={2}
                  placeholder="Brief description of items listed under this category..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                />
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1464F4] hover:bg-blue-600 text-white font-bold shadow-xs"
                >
                  Save Category
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ================= MODAL 2: EDIT CATEGORY MODAL ================= */}
      {editingItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-5 my-8">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-[#1464F4]">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Edit Category</h3>
                  <p className="text-slate-400 text-xs font-medium">Update parameters for "{editingItem.name}"</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateCategory} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Slug / Key</label>
                <input
                  type="text"
                  value={editForm.slug}
                  onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Icon</label>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-50 text-[#1464F4] border border-blue-200 shrink-0">
                    {renderCategoryIcon(editForm.icon, 'w-5 h-5')}
                  </div>
                  <select
                    value={editForm.icon}
                    onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  >
                    {ICON_OPTIONS.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Subtitle</label>
                <textarea
                  value={editForm.description || editForm.subtitle}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value, subtitle: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as 'active' | 'disabled' })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                >
                  <option value="active">Active (Visible on platform)</option>
                  <option value="disabled">Disabled (Hidden from frontend)</option>
                </select>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1464F4] hover:bg-blue-600 text-white font-bold shadow-xs"
                >
                  Save Changes
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ================= MODAL 3: DELETE CONFIRMATION DIALOG ================= */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4">
            
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Delete Category?</h3>
                <p className="text-xs text-slate-500 font-medium">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-slate-600 text-xs leading-relaxed font-medium">
              Are you sure you want to delete <strong className="text-slate-900">"{deleteConfirmItem.name}"</strong> from the RENTOURA.LK category taxonomy? 
              {deleteConfirmItem.level === 'main' && ' Deleting a main category will also remove all its subcategories and options.'}
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCategory}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
              >
                Delete Category
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL 4: RESET CONFIRMATION DIALOG ================= */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4">
            
            <div className="flex items-center gap-3 text-amber-600">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Reset Taxonomy Defaults?</h3>
                <p className="text-xs text-slate-500 font-medium">Restores initial approved RENTOURA.LK categories</p>
              </div>
            </div>

            <p className="text-slate-600 text-xs leading-relaxed font-medium">
              Resetting will revert all custom categories, subcategories, and order adjustments back to the official default RENTOURA.LK taxonomy definitions.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetTaxonomy}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-xs shadow-xs"
              >
                Reset to Defaults
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
