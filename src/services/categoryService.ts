import { supabase } from '../lib/supabase';
import { ModuleType } from '../data/categorySelectorData';

export type CategoryModule = 'rental' | 'job' | 'service';
export type FrontendModule = ModuleType | CategoryModule;
export type CategoryStatus = 'active' | 'inactive';

export interface CategoryRecord { id: string; module: CategoryModule; name: string; slug: string; parent_id: string | null; level: number; status: CategoryStatus; sort_order: number; icon_key: string | null; description: string | null; created_at?: string; updated_at?: string; children?: CategoryRecord[]; }
export interface FetchCategoriesResult { success: boolean; data: CategoryRecord[]; error: string | null; }
export interface CategorySearchResult { category: CategoryRecord; pathString: string; pathRecords: CategoryRecord[]; mainCategory?: CategoryRecord; subCategory?: CategoryRecord; thirdLevel?: CategoryRecord; }
export interface CategoryMutationValues { module?: CategoryModule; level?: number; name?: string; slug?: string; parent_id?: string | null; status?: CategoryStatus; sort_order?: number; icon_key?: string | null; description?: string | null; reason?: string; }

export class CategoryService {
  private static cache = new Map<string, CategoryRecord[]>();

  static normalizeModule(value?: string | null): CategoryModule | undefined {
    const module = value?.trim().toLowerCase();
    if (module === 'rental' || module === 'rentals') return 'rental';
    if (module === 'job' || module === 'jobs') return 'job';
    if (module === 'service' || module === 'services') return 'service';
    return undefined;
  }
  static toUIModule(module: CategoryModule): ModuleType { return module === 'rental' ? 'rentals' : module === 'job' ? 'jobs' : 'services'; }

  static async getCategories(moduleInput?: FrontendModule | string, options: { forceRefresh?: boolean; includeInactive?: boolean } = {}): Promise<FetchCategoriesResult> {
    const module = this.normalizeModule(moduleInput);
    const key = `${module ?? 'all'}:${options.includeInactive ? 'all' : 'active'}`;
    const cached = this.cache.get(key);
    if (cached && !options.forceRefresh) return { success: true, data: cached, error: null };
    try {
      let query = supabase.from('categories').select('*').order('sort_order', { ascending: true }).order('name', { ascending: true });
      if (!options.includeInactive) query = query.eq('status', 'active');
      if (module) query = query.eq('module', module);
      const { data, error } = await query;
      if (error) return { success: false, data: [], error: error.message };
      const rows = (data ?? []) as CategoryRecord[];
      this.cache.set(key, rows);
      return { success: true, data: rows, error: null };
    } catch (error) {
      return { success: false, data: [], error: error instanceof Error ? error.message : 'Unable to load categories' };
    }
  }

  static invalidateCache(): void { this.cache.clear(); if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('rentoura_categories_updated')); }
  static async getMainCategories(module: FrontendModule | string, forceRefresh = false): Promise<FetchCategoriesResult> { const r = await this.getCategories(module, { forceRefresh }); return r.success ? { ...r, data: r.data.filter((x) => x.level === 1) } : r; }
  static async getChildCategories(parentId: string, includeInactive = false): Promise<CategoryRecord[]> { const r = await this.getCategories(undefined, { includeInactive }); return r.success ? r.data.filter((x) => x.parent_id === parentId) : []; }
  static async getCategoryById(id: string): Promise<CategoryRecord | null> { const r = await this.getCategories(undefined, { includeInactive: true }); return r.success ? r.data.find((x) => x.id === id) ?? null : null; }
  static async getCategoryBySlug(module: FrontendModule | string, slug: string): Promise<CategoryRecord | null> { const r = await this.getCategories(module); return r.success ? r.data.find((x) => x.slug === slug) ?? null : null; }

  static async getCategoryPath(id: string): Promise<CategoryRecord[]> {
    const r = await this.getCategories(undefined, { includeInactive: true }); if (!r.success) return [];
    const byId = new Map(r.data.map((x) => [x.id, x])); const path: CategoryRecord[] = []; const visited = new Set<string>(); let current = byId.get(id);
    while (current && !visited.has(current.id)) { visited.add(current.id); path.unshift(current); current = current.parent_id ? byId.get(current.parent_id) : undefined; }
    return path;
  }

  static buildTree(categories: CategoryRecord[]): CategoryRecord[] {
    const nodes = new Map(categories.map((x) => [x.id, { ...x, children: [] as CategoryRecord[] }])); const roots: CategoryRecord[] = [];
    nodes.forEach((x) => { const parent = x.parent_id ? nodes.get(x.parent_id) : undefined; if (parent) parent.children?.push(x); else roots.push(x); });
    const sort = (items: CategoryRecord[]) => items.sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name)).forEach((x) => sort(x.children ?? [])); sort(roots); return roots;
  }

  static async searchCategories(term: string, module?: FrontendModule | string): Promise<CategorySearchResult[]> {
    const r = await this.getCategories(module); if (!r.success) return []; const q = term.trim().toLowerCase(); const byId = new Map(r.data.map((x) => [x.id, x]));
    return r.data.filter((x) => !q || `${x.name} ${x.slug} ${x.description ?? ''}`.toLowerCase().includes(q)).map((category) => { const pathRecords: CategoryRecord[] = []; let current: CategoryRecord | undefined = category; while (current) { pathRecords.unshift(current); current = current.parent_id ? byId.get(current.parent_id) : undefined; } return { category, pathRecords, pathString: pathRecords.map((x) => x.name).join(' › '), mainCategory: pathRecords[0], subCategory: pathRecords[1], thirdLevel: pathRecords[2] }; });
  }

  private static async mutate(action: string, categoryId: string | null, values: CategoryMutationValues = {}): Promise<void> { const { error } = await supabase.rpc('admin_manage_category', { p_action: action, p_category_id: categoryId, p_values: values }); if (error) throw new Error(error.message); this.invalidateCache(); }
  static createCategory(values: CategoryMutationValues): Promise<void> { return this.mutate('create', null, values); }
  static updateCategory(id: string, values: CategoryMutationValues): Promise<void> { return this.mutate('update', id, values); }
  static setCategoryStatus(id: string, status: CategoryStatus): Promise<void> { return this.mutate('set_status', id, { status }); }
  static deleteCategory(id: string): Promise<void> { return this.mutate('delete', id); }
  static async reorderCategory(id: string, direction: 'up' | 'down'): Promise<void> { const { error } = await supabase.rpc('admin_reorder_category', { p_category_id: id, p_direction: direction }); if (error) throw new Error(error.message); this.invalidateCache(); }
  static slugify(value: string): string { return value.toLowerCase().trim().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
}
