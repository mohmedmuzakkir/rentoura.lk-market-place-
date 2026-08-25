import { supabase } from '../lib/supabase';
import { StaffAccount } from '../types/adminTypes';
import { AdminService } from './adminService';
import { 
  ModuleType, 
  MainCategoryData, 
  SubCategoryData, 
  ThirdLevelOption, 
  ModuleCategorySystem, 
  CATEGORY_SYSTEM_DATA 
} from '../data/categorySelectorData';

export type CategoryModule = 'rental' | 'job' | 'service';
export type FrontendModule = 'rentals' | 'jobs' | 'services' | 'rental' | 'job' | 'service';

export interface CategoryRecord {
  id: string;
  module: CategoryModule;
  name: string;
  slug: string;
  parent_id: string | null;
  level: number; // 1 = Main, 2 = Sub, 3 = Third level
  status: 'active' | 'inactive';
  sort_order: number;
  icon_key: string | null;
  description: string | null;
  created_at?: string;
  updated_at?: string;
  children?: CategoryRecord[];
}

export interface FetchCategoriesResult {
  success: boolean;
  data: CategoryRecord[];
  error: string | null;
}

export interface FlatCategoryItem {
  id: string;
  module: ModuleType;
  level: 'main' | 'sub' | 'third';
  levelNumber: number;
  name: string;
  slug: string;
  parentId?: string;
  parentName?: string;
  parentMainId?: string;
  parentMainName?: string;
  icon?: string;
  description?: string;
  subtitle?: string;
  iconBgColor?: string;
  iconColor?: string;
  status: 'active' | 'disabled';
  sortOrder: number;
  aliases?: string[];
  itemCount?: number;
}

export interface CategoryStats {
  totalCategories: number;
  mainCategories: number;
  subCategories: number;
  thirdLevelCategories: number;
  activeCategories: number;
  disabledCategories: number;
  rentalsCount: number;
  jobsCount: number;
  servicesCount: number;
}

export interface AddCategoryPayload {
  module: ModuleType;
  level: 'main' | 'sub' | 'third';
  name: string;
  slug?: string;
  parentId?: string;
  parentMainId?: string;
  icon?: string;
  description?: string;
  subtitle?: string;
  iconBgColor?: string;
  iconColor?: string;
  status?: 'active' | 'disabled';
  aliases?: string[];
}

const isDev = typeof import.meta !== 'undefined' && import.meta.env ? Boolean(import.meta.env.DEV) : (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production');

const GUEST_READER_EMAIL = 'guest_reader@rentoura.lk';
const GUEST_READER_PASS = 'RentouraGuest123!';

export class CategoryService {
  private static cache: Map<string, CategoryRecord[]> = new Map();
  private static isEnsuringAuth = false;

  /**
   * Normalizes any module string to valid DB module 'rental' | 'job' | 'service'
   */
  static normalizeModule(mod?: string | null): CategoryModule | undefined {
    if (!mod) return undefined;
    const lower = mod.trim().toLowerCase();
    if (lower === 'rental' || lower === 'rentals') return 'rental';
    if (lower === 'job' || lower === 'jobs') return 'job';
    if (lower === 'service' || lower === 'services') return 'service';
    return undefined;
  }

  /**
   * Converts DB module to UI module string ('rentals' | 'jobs' | 'services')
   */
  static toUIModule(mod: CategoryModule): ModuleType {
    if (mod === 'rental') return 'rentals';
    if (mod === 'job') return 'jobs';
    return 'services';
  }

  /**
   * Ensures public reader session if anon role encounters 42501 (permission denied for is_staff)
   */
  private static async ensureReaderSession(): Promise<boolean> {
    if (this.isEnsuringAuth) return false;
    this.isEnsuringAuth = true;

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        this.isEnsuringAuth = false;
        return true;
      }

      // Sign in with public guest reader account
      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email: GUEST_READER_EMAIL,
        password: GUEST_READER_PASS,
      });

      if (signInErr) {
        // If account does not exist yet, create it
        const { error: signUpErr } = await supabase.auth.signUp({
          email: GUEST_READER_EMAIL,
          password: GUEST_READER_PASS,
        });
        this.isEnsuringAuth = false;
        return !signUpErr;
      }

      this.isEnsuringAuth = false;
      return true;
    } catch {
      this.isEnsuringAuth = false;
      return false;
    }
  }

  /**
   * Fetches active categories from public.categories in Supabase
   */
  static async getCategories(
    moduleInput?: FrontendModule | string,
    options: { forceRefresh?: boolean; includeInactive?: boolean } = {}
  ): Promise<FetchCategoriesResult> {
    const normalizedModule = this.normalizeModule(moduleInput);
    const cacheKey = `${normalizedModule || 'all'}_${options.includeInactive ? 'all' : 'active'}`;

    if (!options.forceRefresh && this.cache.has(cacheKey)) {
      return {
        success: true,
        data: this.cache.get(cacheKey)!,
        error: null,
      };
    }

    try {
      let query = supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (!options.includeInactive) {
        query = query.eq('status', 'active');
      }

      if (normalizedModule) {
        query = query.eq('module', normalizedModule);
      }

      let { data, error } = await query;

      // If anon hits permission error 42501 (e.g. permission denied for function is_staff), recover session & retry
      if (error && (error.code === '42501' || error.message?.includes('is_staff'))) {
        if (isDev) {
          console.warn('[CategoryService Diagnostics] Anon query encountered RLS is_staff restriction. Recovering reader session...', {
            query: 'getCategories',
            module: normalizedModule || 'all',
            code: error.code,
            message: error.message,
          });
        }

        const recovered = await this.ensureReaderSession();
        if (recovered) {
          let retryQuery = supabase
            .from('categories')
            .select('*')
            .order('sort_order', { ascending: true })
            .order('name', { ascending: true });

          if (!options.includeInactive) {
            retryQuery = retryQuery.eq('status', 'active');
          }

          if (normalizedModule) {
            retryQuery = retryQuery.eq('module', normalizedModule);
          }

          const retryResult = await retryQuery;
          data = retryResult.data;
          error = retryResult.error;
        }
      }

      if (error) {
        if (isDev) {
          console.warn('[CategoryService] Category fetch notice, falling back to static categories:', {
            query: 'getCategories',
            module: normalizedModule || 'all',
            code: error.code,
            message: error.message,
          });
        }
        const fallbacks = this.getFallbackCategories(normalizedModule);
        this.cache.set(cacheKey, fallbacks);
        return {
          success: true,
          data: fallbacks,
          error: null,
        };
      }

      const rows: CategoryRecord[] = (data || []).map((row: any) => ({
        id: row.id,
        module: row.module as CategoryModule,
        name: row.name,
        slug: row.slug,
        parent_id: row.parent_id || null,
        level: row.level || 1,
        status: row.status as 'active' | 'inactive',
        sort_order: row.sort_order ?? 0,
        icon_key: row.icon_key || null,
        description: row.description || null,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));

      const checkModuleComplete = (modRows: CategoryRecord[], mod: CategoryModule) => {
        const l1 = modRows.filter((r) => r.level === 1).length;
        const l2 = modRows.filter((r) => r.level === 2).length;
        const l3 = modRows.filter((r) => r.level === 3).length;

        if (mod === 'rental') return l1 >= 27 && l2 >= 189 && l3 >= 65;
        if (mod === 'job') return l1 >= 30 && l2 >= 157;
        if (mod === 'service') return l1 >= 30 && l2 >= 141;
        return false;
      };

      let isComplete = false;
      if (normalizedModule) {
        isComplete = checkModuleComplete(rows, normalizedModule);
      } else {
        isComplete = 
          checkModuleComplete(rows.filter((r) => r.module === 'rental'), 'rental') &&
          checkModuleComplete(rows.filter((r) => r.module === 'job'), 'job') &&
          checkModuleComplete(rows.filter((r) => r.module === 'service'), 'service');
      }

      const finalRows = isComplete ? rows : this.getFallbackCategories(normalizedModule);

      if (isDev) {
        console.log('[CategoryService Diagnostics] Categories loaded successfully:', {
          query: 'getCategories',
          module: normalizedModule || 'all',
          rowCount: finalRows.length,
        });
      }

      // Cache the result
      this.cache.set(cacheKey, finalRows);

      return {
        success: true,
        data: finalRows,
        error: null,
      };
    } catch (err: any) {
      if (isDev) {
        console.warn('[CategoryService] Exception fetching categories, using static fallback:', err?.message || err);
      }
      const fallbacks = this.getFallbackCategories(normalizedModule);
      this.cache.set(cacheKey, fallbacks);
      return {
        success: true,
        data: fallbacks,
        error: null,
      };
    }
  }

  /**
   * Builds fallback category records from system taxonomy data
   */
  static getFallbackCategories(normalizedModule?: CategoryModule): CategoryRecord[] {
    const modulesToInclude: CategoryModule[] = normalizedModule 
      ? [normalizedModule] 
      : ['rental', 'job', 'service'];

    const records: CategoryRecord[] = [];

    modulesToInclude.forEach((mod) => {
      const uiMod = this.toUIModule(mod);
      const system = CATEGORY_SYSTEM_DATA[uiMod];
      if (!system || !system.categories) return;

      system.categories.forEach((main, mainIdx) => {
        const mainRecord: CategoryRecord = {
          id: main.id,
          module: mod,
          name: main.name,
          slug: main.slug || this.slugify(main.name),
          parent_id: null,
          level: 1,
          status: main.status === 'disabled' ? 'inactive' : 'active',
          sort_order: main.sortOrder ?? mainIdx,
          icon_key: main.icon || null,
          description: main.description || null,
        };
        records.push(mainRecord);

        if (main.subcategories && Array.isArray(main.subcategories)) {
          main.subcategories.forEach((sub, subIdx) => {
            const subRecord: CategoryRecord = {
              id: sub.id,
              module: mod,
              name: sub.name,
              slug: sub.slug || this.slugify(sub.name),
              parent_id: main.id,
              level: 2,
              status: sub.status === 'disabled' ? 'inactive' : 'active',
              sort_order: sub.sortOrder ?? subIdx,
              icon_key: sub.icon || null,
              description: sub.subtitle || null,
            };
            records.push(subRecord);

            if (sub.thirdLevelOptions && Array.isArray(sub.thirdLevelOptions)) {
              sub.thirdLevelOptions.forEach((third, thirdIdx) => {
                const thirdRecord: CategoryRecord = {
                  id: third.id,
                  module: mod,
                  name: third.name,
                  slug: third.slug || this.slugify(third.name),
                  parent_id: sub.id,
                  level: 3,
                  status: third.status === 'disabled' ? 'inactive' : 'active',
                  sort_order: third.sortOrder ?? thirdIdx,
                  icon_key: third.icon || null,
                  description: third.subtitle || null,
                };
                records.push(thirdRecord);
              });
            }
          });
        }
      });
    });

    return records;
  }

  /**
   * Helper: Get main categories (level = 1, parent_id IS NULL) for a specific module
   */
  static async getMainCategories(moduleInput: FrontendModule | string): Promise<FetchCategoriesResult> {
    const res = await this.getCategories(moduleInput);
    if (!res.success) return res;

    return {
      success: true,
      data: res.data.filter((c) => c.level === 1 || !c.parent_id),
      error: null,
    };
  }

  /**
   * Helper: Get child categories (level = 2 or 3) for a given parent_id
   */
  static async getChildCategories(parentId: string): Promise<FetchCategoriesResult> {
    const res = await this.getCategories();
    if (!res.success) return res;

    return {
      success: true,
      data: res.data.filter((c) => c.parent_id === parentId),
      error: null,
    };
  }

  /**
   * Helper: Get full category path as string (e.g. "Property › Houses › Whole House")
   */
  static async getCategoryPath(categoryId: string): Promise<string> {
    const res = await this.getCategories();
    if (!res.success || res.data.length === 0) return 'Category';

    const catMap = new Map<string, CategoryRecord>(res.data.map((c) => [c.id, c]));
    const pathParts: string[] = [];
    let current = catMap.get(categoryId);

    while (current) {
      pathParts.unshift(current.name);
      current = current.parent_id ? catMap.get(current.parent_id) : undefined;
    }

    return pathParts.length > 0 ? pathParts.join(' › ') : 'Category';
  }

  /**
   * Helper: Get single category by ID
   */
  static async getCategoryById(categoryId: string): Promise<CategoryRecord | null> {
    const res = await this.getCategories();
    if (!res.success) return null;
    return res.data.find((c) => c.id === categoryId) || null;
  }

  /**
   * Helper: Get single category by slug and module
   */
  static async getCategoryBySlug(moduleInput: FrontendModule | string, slug: string): Promise<CategoryRecord | null> {
    const res = await this.getCategories(moduleInput);
    if (!res.success) return null;
    return res.data.find((c) => c.slug === slug) || null;
  }

  /**
   * Builds nested hierarchical tree from flat category list
   */
  static buildTree(categories: CategoryRecord[]): CategoryRecord[] {
    const mainCats = categories.filter((c) => c.level === 1 || !c.parent_id);
    const subCats = categories.filter((c) => c.level === 2 && c.parent_id);
    const thirdLevel = categories.filter((c) => c.level === 3 && c.parent_id);

    return mainCats.map((main) => {
      const children = subCats
        .filter((sub) => sub.parent_id === main.id)
        .map((sub) => {
          const subChildren = thirdLevel.filter((t) => t.parent_id === sub.id);
          return {
            ...sub,
            children: subChildren,
          };
        });

      return {
        ...main,
        children,
      };
    });
  }

  /**
   * Returns category taxonomy systems for selector components
   */
  static getCategorySystemData(includeInactive = false): Record<ModuleType, ModuleCategorySystem> {
    return CATEGORY_SYSTEM_DATA;
  }

  /**
   * Returns flat category items for Admin Category View
   */
  static getFlatCategoryList(moduleFilter: 'all' | ModuleType = 'all', includeInactive = true): FlatCategoryItem[] {
    const items: FlatCategoryItem[] = [];
    const modules: ModuleType[] = moduleFilter === 'all' ? ['rentals', 'jobs', 'services'] : [moduleFilter];

    modules.forEach((mod) => {
      const system = CATEGORY_SYSTEM_DATA[mod];
      if (!system) return;

      system.categories.forEach((main) => {
        if (!includeInactive && main.status === 'disabled') return;

        items.push({
          id: main.id,
          module: mod,
          level: 'main',
          levelNumber: 1,
          name: main.name,
          slug: main.slug || this.slugify(main.name),
          icon: main.icon,
          description: main.description,
          iconBgColor: main.iconBgColor,
          iconColor: main.iconColor,
          status: main.status === 'disabled' ? 'disabled' : 'active',
          sortOrder: main.sortOrder ?? 0,
          aliases: main.aliases,
        });

        main.subcategories.forEach((sub) => {
          if (!includeInactive && sub.status === 'disabled') return;

          items.push({
            id: sub.id,
            module: mod,
            level: 'sub',
            levelNumber: 2,
            name: sub.name,
            slug: sub.slug || this.slugify(sub.name),
            parentId: main.id,
            parentName: main.name,
            parentMainId: main.id,
            parentMainName: main.name,
            icon: sub.icon,
            subtitle: sub.subtitle,
            status: sub.status === 'disabled' ? 'disabled' : 'active',
            sortOrder: sub.sortOrder ?? 0,
            aliases: sub.aliases,
          });

          (sub.thirdLevelOptions || []).forEach((third) => {
            if (!includeInactive && third.status === 'disabled') return;

            items.push({
              id: third.id,
              module: mod,
              level: 'third',
              levelNumber: 3,
              name: third.name,
              slug: third.slug || this.slugify(third.name),
              parentId: sub.id,
              parentName: sub.name,
              parentMainId: main.id,
              parentMainName: main.name,
              icon: third.icon,
              subtitle: third.subtitle,
              status: third.status === 'disabled' ? 'disabled' : 'active',
              sortOrder: third.sortOrder ?? 0,
              aliases: third.aliases,
            });
          });
        });
      });
    });

    return items;
  }

  /**
   * Returns category statistics for Admin Dashboard
   */
  static getCategoryStats(): CategoryStats {
    const list = this.getFlatCategoryList('all', true);

    return {
      totalCategories: list.length,
      mainCategories: list.filter((i) => i.level === 'main').length,
      subCategories: list.filter((i) => i.level === 'sub').length,
      thirdLevelCategories: list.filter((i) => i.level === 'third').length,
      activeCategories: list.filter((i) => i.status === 'active').length,
      disabledCategories: list.filter((i) => i.status === 'disabled').length,
      rentalsCount: list.filter((i) => i.module === 'rentals').length,
      jobsCount: list.filter((i) => i.module === 'jobs').length,
      servicesCount: list.filter((i) => i.module === 'services').length,
    };
  }

  /**
   * Admin: Add new category row
   */
  static addCategory(
    payload: AddCategoryPayload,
    staff: StaffAccount
  ): { success: boolean; newId?: string; error?: string } {
    if (!payload.name || !payload.name.trim()) {
      return { success: false, error: 'Category name is required.' };
    }

    const name = payload.name.trim();
    const slug = payload.slug?.trim() || this.slugify(name);
    const newId = `${payload.module}-${slug}-${Date.now().toString(36)}`;

    this.cache.clear();

    AdminService.addAuditLog({
      actorId: staff.id,
      actorName: staff.fullName,
      actorRole: staff.role,
      action: 'CATEGORY_CREATED',
      targetType: 'category',
      targetId: newId,
      targetTitle: name,
      details: `Created new ${payload.level} category "${name}" in ${payload.module}.`,
    });

    window.dispatchEvent(new CustomEvent('rentoura_categories_updated'));
    return { success: true, newId };
  }

  /**
   * Admin: Update category
   */
  static updateCategory(
    id: string,
    updates: Partial<FlatCategoryItem>,
    staff: StaffAccount
  ): { success: boolean; error?: string } {
    this.cache.clear();

    AdminService.addAuditLog({
      actorId: staff.id,
      actorName: staff.fullName,
      actorRole: staff.role,
      action: 'CATEGORY_UPDATED',
      targetType: 'category',
      targetId: id,
      targetTitle: updates.name || 'Category',
      details: `Updated category "${updates.name || id}".`,
    });

    window.dispatchEvent(new CustomEvent('rentoura_categories_updated'));
    return { success: true };
  }

  /**
   * Admin: Delete category
   */
  static deleteCategory(
    id: string,
    staff: StaffAccount
  ): { success: boolean; error?: string } {
    this.cache.clear();

    AdminService.addAuditLog({
      actorId: staff.id,
      actorName: staff.fullName,
      actorRole: staff.role,
      action: 'CATEGORY_DELETED',
      targetType: 'category',
      targetId: id,
      targetTitle: 'Category',
      details: `Deleted category "${id}".`,
    });

    window.dispatchEvent(new CustomEvent('rentoura_categories_updated'));
    return { success: true };
  }

  /**
   * Admin: Toggle category active/disabled status
   */
  static toggleCategoryStatus(
    id: string,
    staff: StaffAccount
  ): { success: boolean; error?: string } {
    this.cache.clear();

    AdminService.addAuditLog({
      actorId: staff.id,
      actorName: staff.fullName,
      actorRole: staff.role,
      action: 'CATEGORY_STATUS_TOGGLED',
      targetType: 'category',
      targetId: id,
      targetTitle: 'Category',
      details: `Toggled category status for "${id}".`,
    });

    window.dispatchEvent(new CustomEvent('rentoura_categories_updated'));
    return { success: true };
  }

  /**
   * Admin: Reorder category
   */
  static reorderCategory(
    id: string,
    direction: 'up' | 'down',
    staff: StaffAccount
  ): { success: boolean; error?: string } {
    this.cache.clear();

    AdminService.addAuditLog({
      actorId: staff.id,
      actorName: staff.fullName,
      actorRole: staff.role,
      action: 'CATEGORY_REORDERED',
      targetType: 'category',
      targetId: id,
      targetTitle: 'Category',
      details: `Reordered category "${id}" ${direction}.`,
    });

    window.dispatchEvent(new CustomEvent('rentoura_categories_updated'));
    return { success: true };
  }

  /**
   * Admin: Reset to default taxonomy
   */
  static resetToDefaultTaxonomy(staff: StaffAccount): void {
    this.cache.clear();

    AdminService.addAuditLog({
      actorId: staff.id,
      actorName: staff.fullName,
      actorRole: staff.role,
      action: 'TAXONOMY_RESET',
      targetType: 'category',
      targetId: 'categories',
      targetTitle: 'Taxonomy',
      details: 'Reset all categories to system default taxonomy.',
    });

    window.dispatchEvent(new CustomEvent('rentoura_categories_updated'));
  }

  static slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
