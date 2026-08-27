import { HeroSlide } from '../types/heroSlide';

export interface ServiceHeroSlide extends HeroSlide {
  module: 'services';
}

export const SERVICE_HERO_SLIDES: ServiceHeroSlide[] = [
  {
    id: 'service-slide-1',
    module: 'services',
    themeColor: '#FF650A',
    title: 'Professional',
    titleHighlight: 'Services',
    subtitle: 'Right at Your Fingertips Across Sri Lanka',
    description: 'Find trusted experts, technicians, and skilled service professionals near you.',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
    ctaLabel: 'Explore All Services',
    ctaRoute: '/services',
    ctaAction: 'explore',
    displayOrder: 1,
    durationMs: 5000,
    overlayStrength: 0.65,
    isEnabled: true
  },
  {
    id: 'service-slide-2',
    module: 'services',
    themeColor: '#FF650A',
    title: 'Home &',
    titleHighlight: 'Repair Experts',
    subtitle: 'Plumbing, Electrical, AC & Maintenance',
    description: 'Browse technicians offering home repair, appliance servicing, and property maintenance.',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
    ctaLabel: 'Find Repair Experts',
    ctaRoute: '/services',
    ctaAction: 'home_repair',
    displayOrder: 2,
    durationMs: 5000,
    overlayStrength: 0.65,
    isEnabled: true
  },
  {
    id: 'service-slide-3',
    module: 'services',
    themeColor: '#FF650A',
    title: 'Digital &',
    titleHighlight: 'Creative Skills',
    subtitle: 'Web Design, Software, Media & Business',
    description: 'Hire experienced Sri Lankan freelancers and agencies for software development, design, legal, and business services.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    ctaLabel: 'Browse Professional Skills',
    ctaRoute: '/services',
    ctaAction: 'digital_creative',
    displayOrder: 3,
    durationMs: 5000,
    overlayStrength: 0.65,
    isEnabled: true
  },
  {
    id: 'service-slide-4',
    module: 'services',
    themeColor: '#FF650A',
    title: 'Services',
    titleHighlight: 'Near You',
    subtitle: 'Local Providers in Your Area & City',
    description: 'Discover reliable nearby service providers available for scheduled appointments and emergency requests.',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    ctaLabel: 'Find Nearby Services',
    ctaRoute: '/services',
    ctaAction: 'near_me',
    displayOrder: 4,
    durationMs: 5000,
    overlayStrength: 0.65,
    isEnabled: true
  },
  {
    id: 'service-slide-5',
    module: 'services',
    themeColor: '#FF650A',
    title: 'Offer Your',
    titleHighlight: 'Service',
    subtitle: 'Grow Your Business Across Sri Lanka',
    description: 'List your professional services, reach local clients, and boost your earnings with Rentoura.lk.',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
    ctaLabel: 'Post Your Service',
    ctaRoute: '/post/service',
    ctaAction: 'post_service',
    displayOrder: 5,
    durationMs: 5000,
    overlayStrength: 0.65,
    isEnabled: true
  }
];
