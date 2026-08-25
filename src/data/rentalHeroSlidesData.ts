import { AppRoute } from '../types';

export interface RentalHeroSlide {
  id: string;
  page: 'rentals';
  title: string;
  titleHighlight?: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  mobileImageUrl?: string;
  ctaLabel: string;
  ctaRoute?: AppRoute;
  ctaAction?: 'post' | 'category_property' | 'category_vehicles' | 'category_equipment' | 'explore';
  displayOrder: number;
  durationMs: number;
  overlayStrength: number;
  isEnabled: boolean;
}

export const RENTAL_HERO_SLIDES: RentalHeroSlide[] = [
  {
    id: 'rental-slide-1',
    page: 'rentals',
    title: 'Rent Anything',
    titleHighlight: 'Across Sri Lanka',
    subtitle: 'General Rentals Marketplace',
    description: 'Find homes, vehicles, equipment & more near you — quick, easy and trusted.',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    ctaLabel: 'Explore All Rentals',
    ctaAction: 'explore',
    displayOrder: 1,
    durationMs: 5000,
    overlayStrength: 0.65,
    isEnabled: true
  },
  {
    id: 'rental-slide-2',
    page: 'rentals',
    title: 'Homes, Rooms',
    titleHighlight: '& Property',
    subtitle: 'Houses, Apartments, Rooms & Land',
    description: 'Discover rental houses, apartments, annexes and rooms across Sri Lanka.',
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    ctaLabel: 'Browse Properties',
    ctaAction: 'category_property',
    displayOrder: 2,
    durationMs: 5000,
    overlayStrength: 0.65,
    isEnabled: true
  },
  {
    id: 'rental-slide-3',
    page: 'rentals',
    title: 'Vehicles for Every',
    titleHighlight: 'Journey',
    subtitle: 'Cars, Vans, Bikes, Trucks & More',
    description: 'Rent self-drive or driven cars, bikes, vans and lorries at best rates.',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    ctaLabel: 'Explore Vehicles',
    ctaAction: 'category_vehicles',
    displayOrder: 3,
    durationMs: 5000,
    overlayStrength: 0.65,
    isEnabled: true
  },
  {
    id: 'rental-slide-4',
    page: 'rentals',
    title: 'Events, Equipment',
    titleHighlight: '& Everyday Gear',
    subtitle: 'Events, Equipment, Tech & Furniture',
    description: 'Rent event gear, power tools, electronics, furniture and outdoor gear.',
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    ctaLabel: 'Rent Equipment',
    ctaAction: 'category_equipment',
    displayOrder: 4,
    durationMs: 5000,
    overlayStrength: 0.65,
    isEnabled: true
  },
  {
    id: 'rental-slide-5',
    page: 'rentals',
    title: 'List Your Rental',
    titleHighlight: 'For Free',
    subtitle: 'Turn Your Idle Assets Into Income',
    description: 'Reach thousands of verified renters across Sri Lanka every single day.',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    ctaLabel: 'List Your Rental',
    ctaAction: 'post',
    ctaRoute: '/post/rental',
    displayOrder: 5,
    durationMs: 5000,
    overlayStrength: 0.65,
    isEnabled: true
  }
];
