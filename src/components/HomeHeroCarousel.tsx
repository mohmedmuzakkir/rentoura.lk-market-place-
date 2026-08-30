import React from 'react';
import { Briefcase, Building2, PlusCircle, Wrench } from 'lucide-react';
import { AppRoute } from '../types';
import {
  MarketplaceHeroCarousel,
  MarketplaceHeroSlide,
  MarketplaceHeroTheme,
} from './common/MarketplaceHeroCarousel';

interface HomeHeroCarouselProps {
  onNavigate: (route: AppRoute) => void;
}

interface HomeHeroSlideDefinition {
  id: 'rentals' | 'jobs' | 'services';
  label: string;
  image: string;
  accentColor: string;
  glowColor: string;
  browseLabel: string;
  browseRoute: AppRoute;
  postLabel: string;
  postRoute: AppRoute;
  browseIcon: React.ReactNode;
}

const HOME_HERO_SLIDES: HomeHeroSlideDefinition[] = [
  {
    id: 'rentals',
    label: 'Rentals',
    image: '/brand/home-hero/rentals-home-hero.png',
    accentColor: '#1464F4',
    glowColor: 'rgba(20, 100, 244, 0.42)',
    browseLabel: 'Explore Rentals',
    browseRoute: '/rentals',
    postLabel: 'Post a Rental',
    postRoute: '/post/rental',
    browseIcon: <Building2 className="h-4 w-4 shrink-0" />,
  },
  {
    id: 'jobs',
    label: 'Jobs',
    image: '/brand/home-hero/jobs-home-hero.png',
    accentColor: '#08A34F',
    glowColor: 'rgba(8, 163, 79, 0.38)',
    browseLabel: 'Explore Jobs',
    browseRoute: '/jobs',
    postLabel: 'Post a Job',
    postRoute: '/post/job',
    browseIcon: <Briefcase className="h-4 w-4 shrink-0" />,
  },
  {
    id: 'services',
    label: 'Services',
    image: '/brand/home-hero/services-home-hero.png',
    accentColor: '#FF650A',
    glowColor: 'rgba(255, 101, 10, 0.4)',
    browseLabel: 'Explore Services',
    browseRoute: '/services',
    postLabel: 'Offer a Service',
    postRoute: '/post/service',
    browseIcon: <Wrench className="h-4 w-4 shrink-0" />,
  },
];

const HOME_THEME: MarketplaceHeroTheme = {
  accentColor: '#1464F4',
  glowColor: 'rgba(20, 100, 244, 0.42)',
  sectionBackground: '#02091f',
  frameBackground: '#06142f',
  imageBackground: '#041c43',
  controlsFrom: '#071a3b',
  controlsTo: '#040d22',
  borderColor: 'rgba(255,255,255,0.15)',
};

export const HomeHeroCarousel: React.FC<HomeHeroCarouselProps> = ({ onNavigate }) => {
  const slides: MarketplaceHeroSlide[] = HOME_HERO_SLIDES.map((slide) => ({
    id: slide.id,
    image: slide.image,
    alt: `${slide.label} marketplace hero in English, Sinhala and Tamil`,
    width: 1672,
    height: 941,
    imageFit: 'contain',
    accentColor: slide.accentColor,
    glowColor: slide.glowColor,
    primaryAction: {
      label: slide.browseLabel,
      icon: slide.browseIcon,
      onClick: () => onNavigate(slide.browseRoute),
    },
    secondaryAction: {
      label: slide.postLabel,
      icon: <PlusCircle className="h-4 w-4 shrink-0" />,
      onClick: () => onNavigate(slide.postRoute),
    },
  }));

  return (
    <MarketplaceHeroCarousel
      ariaLabel="RENTOURA.LK marketplace highlights"
      moduleName="Home"
      slides={slides}
      theme={HOME_THEME}
    />
  );
};
