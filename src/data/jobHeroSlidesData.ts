import { HeroSlide } from '../types/heroSlide';

export interface JobHeroSlide extends HeroSlide {
  module: 'jobs';
}

export const JOB_HERO_SLIDES: JobHeroSlide[] = [
  {
    id: 'job-slide-1',
    module: 'jobs',
    themeColor: '#08A34F',
    title: 'Find Your',
    titleHighlight: 'Dream Job',
    subtitle: 'Career Opportunities Across Sri Lanka',
    description: 'Explore active full-time, part-time, and contract job listings across Sri Lanka.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    ctaLabel: 'Explore All Jobs',
    ctaRoute: '/jobs',
    ctaAction: 'explore',
    displayOrder: 1,
    durationMs: 5000,
    overlayStrength: 0.65,
    isEnabled: true
  },
  {
    id: 'job-slide-2',
    module: 'jobs',
    themeColor: '#08A34F',
    title: 'Discover',
    titleHighlight: 'Remote Jobs',
    subtitle: 'Work From Anywhere in Sri Lanka or Abroad',
    description: 'Access flexible work-from-home roles in IT, design, customer service, writing, and digital marketing.',
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&q=80',
    ctaLabel: 'Browse Remote Roles',
    ctaRoute: '/jobs',
    ctaAction: 'remote',
    displayOrder: 2,
    durationMs: 5000,
    overlayStrength: 0.65,
    isEnabled: true
  },
  {
    id: 'job-slide-3',
    module: 'jobs',
    themeColor: '#08A34F',
    title: 'Explore',
    titleHighlight: 'Top Companies',
    subtitle: 'Join Industry Leaders & Growing Tech Hubs',
    description: 'Connect with Sri Lanka\'s top employers in banking, technology, telecommunications, and manufacturing.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    ctaLabel: 'View Top Employers',
    ctaRoute: '/jobs',
    ctaAction: 'companies',
    displayOrder: 3,
    durationMs: 5000,
    overlayStrength: 0.65,
    isEnabled: true
  },
  {
    id: 'job-slide-4',
    module: 'jobs',
    themeColor: '#08A34F',
    title: 'Fast Hiring',
    titleHighlight: 'Opportunities',
    subtitle: 'Urgent Vacancies & Immediate Start Roles',
    description: 'Apply directly to active recruiters and hiring managers looking for immediate talent in Colombo and beyond.',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    ctaLabel: 'View Immediate Openings',
    ctaRoute: '/jobs',
    ctaAction: 'fast_hiring',
    displayOrder: 4,
    durationMs: 5000,
    overlayStrength: 0.65,
    isEnabled: true
  },
  {
    id: 'job-slide-5',
    module: 'jobs',
    themeColor: '#08A34F',
    title: 'Post a Job',
    titleHighlight: 'Opportunity',
    subtitle: 'Reach Top Talent Nationwide',
    description: 'Recruiting for your business? Post your vacancy in minutes and receive applications from qualified candidates.',
    imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80',
    ctaLabel: 'Post a Job Now',
    ctaRoute: '/post/job',
    ctaAction: 'post_job',
    displayOrder: 5,
    durationMs: 5000,
    overlayStrength: 0.65,
    isEnabled: true
  }
];
