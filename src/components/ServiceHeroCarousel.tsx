import React, { useState, useEffect } from 'react';
import { LayoutGrid, List, PlusCircle, Search } from 'lucide-react';
import { AppRoute } from '../types';
import { ServiceService } from '../services/serviceService';
import {
  MarketplaceHeroCarousel,
  MarketplaceHeroSlide,
  MarketplaceHeroTheme,
} from './common/MarketplaceHeroCarousel';

interface ServiceHeroCarouselProps {
  onNavigate: (route: AppRoute) => void;
  onExploreServices: () => void;
  onBrowseCategories: () => void;
  onOpenMyServices?: () => void;
}

const SERVICES_THEME: MarketplaceHeroTheme = {
  accentColor: '#FF650A',
  glowColor: 'rgba(255, 101, 10, 0.42)',
  sectionBackground: '#1a0901',
  frameBackground: '#251005',
  imageBackground: '#2b1003',
  controlsFrom: '#351507',
  controlsTo: '#180801',
  borderColor: 'rgba(253,186,116,0.22)',
};

export const ServiceHeroCarousel: React.FC<ServiceHeroCarouselProps> = ({
  onNavigate,
  onExploreServices,
  onBrowseCategories,
  onOpenMyServices,
}) => {
  const [dbSlides, setDbSlides] = useState<MarketplaceHeroSlide[]>([]);

  useEffect(() => {
    let active = true;
    ServiceService.getServiceHeroSlides().then((raw) => {
      if (!active || !raw || raw.length === 0) return;
      const mapped: MarketplaceHeroSlide[] = raw.map((s) => ({
        id: s.id,
        image: s.imageUrl,
        alt: s.title || 'Services hero banner',
        width: 1536,
        height: 1024,
        imageFit: 'cover',
        accentColor: '#FF650A',
        glowColor: 'rgba(255, 101, 10, 0.42)',
        primaryAction: {
          label: s.ctaLabel || 'Explore Services',
          icon: <Search className="h-4 w-4 shrink-0" />,
          onClick: () => onNavigate((s.ctaRoute as AppRoute) || '/services'),
        },
        secondaryAction: {
          label: 'Offer a Service',
          icon: <PlusCircle className="h-4 w-4 shrink-0" />,
          onClick: () => onNavigate('/post/service'),
        },
      }));
      setDbSlides(mapped);
    });
    return () => {
      active = false;
    };
  }, [onNavigate]);

  const defaultSlides: MarketplaceHeroSlide[] = [
    {
      id: 'explore',
      image: '/brand/services-hero/services-slide-1-explore.png',
      alt: 'Explore RENTOURA services in English, Sinhala and Tamil',
      width: 1536,
      height: 1024,
      imageFit: 'contain',
      primaryAction: {
        label: 'Explore Services',
        icon: <Search className="h-4 w-4 shrink-0" />,
        onClick: onExploreServices,
      },
      secondaryAction: {
        label: 'Offer a Service',
        icon: <PlusCircle className="h-4 w-4 shrink-0" />,
        onClick: () => onNavigate('/post/service'),
      },
    },
    {
      id: 'offer',
      image: '/brand/services-hero/services-slide-2-offer.png',
      alt: 'Offer your service through RENTOURA in English, Sinhala and Tamil',
      width: 1536,
      height: 1024,
      imageFit: 'contain',
      primaryAction: {
        label: 'Offer a Service',
        icon: <PlusCircle className="h-4 w-4 shrink-0" />,
        onClick: () => onNavigate('/post/service'),
      },
      secondaryAction: {
        label: 'My Services',
        icon: <List className="h-4 w-4 shrink-0" />,
        onClick: onOpenMyServices ?? (() => onNavigate('/my-listings')),
      },
    },
    {
      id: 'categories',
      image: '/brand/services-hero/services-slide-3-categories.png',
      alt: 'Browse RENTOURA service categories in English, Sinhala and Tamil',
      width: 1536,
      height: 1024,
      imageFit: 'contain',
      primaryAction: {
        label: 'Browse Categories',
        icon: <LayoutGrid className="h-4 w-4 shrink-0" />,
        onClick: onBrowseCategories,
      },
      secondaryAction: {
        label: 'View All Services',
        icon: <Search className="h-4 w-4 shrink-0" />,
        onClick: onExploreServices,
      },
    },
  ];

  const slides = [...dbSlides, ...defaultSlides];

  return (
    <MarketplaceHeroCarousel
      ariaLabel="RENTOURA.LK Services highlights"
      moduleName="Services"
      slides={slides}
      theme={SERVICES_THEME}
    />
  );
};
