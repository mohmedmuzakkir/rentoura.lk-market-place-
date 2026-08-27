import { AppRoute } from '../types';

export const STATIC_ROUTES = [
  '/', '/rentals', '/jobs', '/services', '/saved', '/post', '/post/rental', '/post/job', '/post/service',
  '/messages', '/chat', '/profile', '/profile/edit', '/my-listings', '/search', '/select-location',
  '/select-category', '/filters', '/notifications', '/login', '/register', '/forgot-password',
  '/reset-password', '/user-agreement', '/privacy-policy', '/safety', '/help', '/report-listing', '/reviews',
  '/admin', '/admin/dashboard', '/admin/moderation', '/admin/queue', '/admin/review', '/moderator', '/super-admin', '/404',
] as const satisfies readonly AppRoute[];

const DETAIL_ROUTES = [/^\/rentals\/[^/]+$/, /^\/jobs\/[^/]+$/, /^\/services\/[^/]+$/];
const UUID_OR_SLUG = /^[a-zA-Z0-9_-]+$/;

export interface ResolvedRoute { route: AppRoute; listingId?: string; canonicalPath?: string }

export function resolveRoute(pathname: string, search = ''): ResolvedRoute {
  const path = pathname !== '/' ? pathname.replace(/\/+$/, '') : '/';
  if ((STATIC_ROUTES as readonly string[]).includes(path)) return { route: path as AppRoute };
  if (DETAIL_ROUTES.some(pattern => pattern.test(path))) {
    const listingId = decodeURIComponent(path.split('/').pop() || '');
    return UUID_OR_SLUG.test(listingId) ? { route: path as AppRoute, listingId } : { route: '/404' };
  }
  const legacy: Record<string, 'rentals' | 'jobs' | 'services'> = { '/rental-detail': 'rentals', '/job-detail': 'jobs', '/service-detail': 'services' };
  if (legacy[path]) {
    const id = new URLSearchParams(search).get('id') || '';
    if (UUID_OR_SLUG.test(id)) { const canonicalPath = `/${legacy[path]}/${id}`; return { route: canonicalPath as AppRoute, listingId: id, canonicalPath }; }
  }
  return { route: '/404' };
}

export const isStaffRoute = (route: string) => route.startsWith('/admin') || route === '/moderator' || route === '/super-admin';
