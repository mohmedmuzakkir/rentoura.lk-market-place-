import React, { useState, useEffect } from 'react';
import { Briefcase, Building2, PlusCircle, Wrench } from 'lucide-react';
import { AppRoute } from '../types';
import { HomeService } from '../services/homeService';
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
  const [dbSlides, setDbSlides] = useState<MarketplaceHeroSlide[]>([]);

  useEffect(() => {
    let active = true;
    HomeService.getHeroSlides().then((raw) => {
      if (!active || !raw || raw.length === 0) return;
      const mapped: MarketplaceHeroSlide[] = raw.map((s) => ({
        id: s.id,
        image: s.imageUrl,
        alt: s.title || 'Marketplace hero banner',
        width: 1672,
        height: 941,
        imageFit: 'cover',
        accentColor: s.themeColor || '#1464F4',
        glowColor: 'rgba(20, 100, 244, 0.42)',
        primaryAction: {
          label: s.ctaLabel || 'Explore Now',
          icon: <Building2 className="h-4 w-4 shrink-0" />,
          onClick: () => onNavigate((s.ctaRoute as AppRoute) || '/'),
        },
        secondaryAction: {
          label: 'Post an Ad',
          icon: <PlusCircle className="h-4 w-4 shrink-0" />,
          onClick: () => onNavigate('/post/rental'),
        },
      }));
      setDbSlides(mapped);
    });
    return () => {
      active = false;
    };
  }, [onNavigate]);

  const defaultSlides: MarketplaceHeroSlide[] = HOME_HERO_SLIDES.map((slide) => ({
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

  const slides = [...dbSlides, ...defaultSlides];

  return (
    <MarketplaceHeroCarousel
      ariaLabel="RENTOURA.LK marketplace highlights"
      moduleName="Home"
      slides={slides}
      theme={HOME_THEME}
    />
  );
};
