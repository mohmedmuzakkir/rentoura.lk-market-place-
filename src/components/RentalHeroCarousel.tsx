import React from 'react';
import { Building2, LayoutGrid, List, PlusCircle } from 'lucide-react';
import { AppRoute } from '../types';
import {
  MarketplaceHeroCarousel,
  MarketplaceHeroSlide,
  MarketplaceHeroTheme,
} from './common/MarketplaceHeroCarousel';

interface RentalHeroCarouselProps {
  onNavigate: (route: AppRoute) => void;
  onExploreRentals: () => void;
  onBrowseCategories: () => void;
}

const RENTALS_THEME: MarketplaceHeroTheme = {
  accentColor: '#1464F4',
  glowColor: 'rgba(20, 100, 244, 0.42)',
  sectionBackground: '#02091f',
  frameBackground: '#06142f',
  imageBackground: '#041c43',
  controlsFrom: '#071a3b',
  controlsTo: '#040d22',
  borderColor: 'rgba(147,197,253,0.2)',
};

export const RentalHeroCarousel: React.FC<RentalHeroCarouselProps> = ({
  onNavigate,
  onExploreRentals,
  onBrowseCategories,
}) => {
  const slides: MarketplaceHeroSlide[] = [
    {
      id: 'explore',
      image: '/brand/rentals-hero/rentals-slide-1-explore.png',
      alt: 'Explore rentals across Sri Lanka in English, Sinhala and Tamil',
      width: 1672,
      height: 941,
      imageFit: 'contain',
      primaryAction: {
        label: 'Explore Rentals',
        icon: <Building2 className="h-4 w-4 shrink-0" />,
        onClick: onExploreRentals,
      },
      secondaryAction: {
        label: 'Post a Rental',
        icon: <PlusCircle className="h-4 w-4 shrink-0" />,
        onClick: () => onNavigate('/post/rental'),
      },
    },
    {
      id: 'post',
      image: '/brand/rentals-hero/rentals-slide-2-post.png',
      alt: 'Post a rental listing in English, Sinhala and Tamil',
      width: 1672,
      height: 941,
      imageFit: 'contain',
      primaryAction: {
        label: 'Post Rental Listing',
        icon: <PlusCircle className="h-4 w-4 shrink-0" />,
        onClick: () => onNavigate('/post/rental'),
      },
      secondaryAction: {
        label: 'My Listings',
        icon: <List className="h-4 w-4 shrink-0" />,
        onClick: () => onNavigate('/my-listings'),
      },
    },
    {
      id: 'categories',
      image: '/brand/rentals-hero/rentals-slide-3-categories.png',
      alt: 'Browse RENTOURA rental categories in English, Sinhala and Tamil',
      width: 1672,
      height: 941,
      imageFit: 'contain',
      primaryAction: {
        label: 'Browse Categories',
        icon: <LayoutGrid className="h-4 w-4 shrink-0" />,
        onClick: onBrowseCategories,
      },
      secondaryAction: {
        label: 'View All Rentals',
        icon: <List className="h-4 w-4 shrink-0" />,
        onClick: onExploreRentals,
      },
    },
  ];

  return (
    <MarketplaceHeroCarousel
      ariaLabel="RENTOURA.LK Rentals highlights"
      moduleName="Rentals"
      slides={slides}
      theme={RENTALS_THEME}
    />
  );
};
