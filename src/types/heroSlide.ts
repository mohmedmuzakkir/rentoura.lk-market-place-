import { AppRoute } from '../types';

export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  mobileImageUrl?: string;
  module: 'platform' | 'rentals' | 'jobs' | 'services' | 'post';
  themeColor: string; // e.g. '#1464F4', '#08A34F', '#FF650A', '#7C3AED'
  ctaLabel: string;
  ctaRoute: AppRoute;
  overlayStrength?: number; // 0.0 to 1.0
  textAlignment?: 'left' | 'center' | 'right';
  isEnabled: boolean;
  displayOrder: number;
  autoplayDurationMs?: number; // Optional override per slide
  createdAt?: string;
  updatedAt?: string;
}

export interface CarouselConfig {
  autoplayIntervalMs: number; // Global interval, default 5000
  pauseOnHover: boolean;
  enableTouchSwipe: boolean;
}
