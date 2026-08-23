import { RENTALS_CATEGORIES, RENTALS_POPULAR_SEARCHES } from './categories/rentalsData';
import { JOBS_CATEGORIES, JOBS_POPULAR_SEARCHES } from './categories/jobsData';
import { SERVICES_CATEGORIES, SERVICES_POPULAR_SEARCHES } from './categories/servicesData';

export type ModuleType = 'rentals' | 'jobs' | 'services';

export interface ThirdLevelOption {
  id: string;
  name: string;
  slug?: string;
  subtitle?: string;
  icon?: string;
  aliases?: string[];
  status?: 'active' | 'disabled';
  sortOrder?: number;
}

export interface SubCategoryData {
  id: string;
  name: string;
  slug?: string;
  subtitle?: string;
  icon?: string;
  aliases?: string[];
  thirdLevelOptions?: ThirdLevelOption[];
  optionalThirdLevel?: boolean;
  status?: 'active' | 'disabled';
  sortOrder?: number;
}

export interface MainCategoryData {
  id: string;
  name: string;
  slug?: string;
  icon: string;
  description?: string;
  aliases?: string[];
  iconBgColor?: string;
  iconColor?: string;
  subcategories: SubCategoryData[];
  status?: 'active' | 'disabled';
  sortOrder?: number;
}

export interface ModuleCategorySystem {
  module: ModuleType;
  title: string;
  subtitle: string;
  primaryColor: string;
  lightBgColor: string;
  borderColor: string;
  categories: MainCategoryData[];
  popularSearches: {
    label: string;
    icon: string;
    mainCatId: string;
    subCatId?: string;
    thirdLevelId?: string;
  }[];
}

export interface SelectedCategoryState {
  module: ModuleType;
  mainCategory: MainCategoryData | null;
  subCategory: SubCategoryData | null;
  thirdLevel: ThirdLevelOption | null;
}

export const CATEGORY_SYSTEM_DATA: Record<ModuleType, ModuleCategorySystem> = {
  rentals: {
    module: 'rentals',
    title: 'RENTALS',
    subtitle: 'Rent what you need',
    primaryColor: '#1464F4',
    lightBgColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    categories: RENTALS_CATEGORIES,
    popularSearches: RENTALS_POPULAR_SEARCHES
  },
  jobs: {
    module: 'jobs',
    title: 'JOBS',
    subtitle: 'Find your dream job',
    primaryColor: '#08A34F',
    lightBgColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    categories: JOBS_CATEGORIES,
    popularSearches: JOBS_POPULAR_SEARCHES
  },
  services: {
    module: 'services',
    title: 'SERVICES',
    subtitle: 'Hire expert services',
    primaryColor: '#FF650A',
    lightBgColor: '#FFF7ED',
    borderColor: '#FED7AA',
    categories: SERVICES_CATEGORIES,
    popularSearches: SERVICES_POPULAR_SEARCHES
  }
};

/**
 * Formats the selected category state into a clean breadcrumb path string
 * e.g. "Property Rentals › Whole House › 2 Bedrooms"
 */
export function formatSelectedCategoryPath(state: SelectedCategoryState): string {
  const parts: string[] = [];

  if (state.mainCategory) {
    parts.push(state.mainCategory.name);
  }

  if (state.subCategory) {
    parts.push(state.subCategory.name);
  }

  if (state.thirdLevel) {
    parts.push(state.thirdLevel.name);
  }

  if (parts.length === 0) {
    const moduleName = state.module.charAt(0).toUpperCase() + state.module.slice(1);
    return `${moduleName} › All Categories`;
  }

  return parts.join(' › ');
}

/**
 * Searches categories inside a given module with support for search aliases
 */
export function searchModuleCategories(
  categories: MainCategoryData[],
  query: string
): MainCategoryData[] {
  if (!query || !query.trim()) return categories;
  const q = query.toLowerCase().trim();

  return categories.filter(main => {
    // 1. Check main category name, aliases & description
    const matchMainName = main.name.toLowerCase().includes(q);
    const matchMainDesc = main.description ? main.description.toLowerCase().includes(q) : false;
    const matchMainAliases = main.aliases ? main.aliases.some(a => a.toLowerCase().includes(q)) : false;

    if (matchMainName || matchMainDesc || matchMainAliases) {
      return true;
    }

    // 2. Check subcategories name, subtitle & aliases
    const matchSub = main.subcategories.some(sub => {
      const matchSubName = sub.name.toLowerCase().includes(q);
      const matchSubSubtitle = sub.subtitle ? sub.subtitle.toLowerCase().includes(q) : false;
      const matchSubAliases = sub.aliases ? sub.aliases.some(a => a.toLowerCase().includes(q)) : false;

      if (matchSubName || matchSubSubtitle || matchSubAliases) {
        return true;
      }

      // 3. Check third level options name, subtitle & aliases
      if (sub.thirdLevelOptions && sub.thirdLevelOptions.length > 0) {
        return sub.thirdLevelOptions.some(third => {
          const matchThirdName = third.name.toLowerCase().includes(q);
          const matchThirdSub = third.subtitle ? third.subtitle.toLowerCase().includes(q) : false;
          const matchThirdAliases = third.aliases ? third.aliases.some(a => a.toLowerCase().includes(q)) : false;
          return matchThirdName || matchThirdSub || matchThirdAliases;
        });
      }

      return false;
    });

    return matchSub;
  });
}
