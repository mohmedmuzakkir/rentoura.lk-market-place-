import React from 'react';
import { Briefcase, LayoutGrid, List, PlusCircle } from 'lucide-react';
import { AppRoute } from '../types';
import {
  MarketplaceHeroCarousel,
  MarketplaceHeroSlide,
  MarketplaceHeroTheme,
} from './common/MarketplaceHeroCarousel';

interface JobHeroCarouselProps {
  onNavigate: (route: AppRoute) => void;
  onExploreJobs: () => void;
  onBrowseCategories: () => void;
}

const JOBS_THEME: MarketplaceHeroTheme = {
  accentColor: '#08A34F',
  glowColor: 'rgba(8, 163, 79, 0.4)',
  sectionBackground: '#011b0d',
  frameBackground: '#032315',
  imageBackground: '#022b17',
  controlsFrom: '#062c1b',
  controlsTo: '#02160d',
  borderColor: 'rgba(110,231,183,0.2)',
};

export const JobHeroCarousel: React.FC<JobHeroCarouselProps> = ({
  onNavigate,
  onExploreJobs,
  onBrowseCategories,
}) => {
  const slides: MarketplaceHeroSlide[] = [
    {
      id: 'explore',
      image: '/brand/jobs-hero/jobs-slide-1-explore.png',
      alt: 'Explore job opportunities across Sri Lanka in English, Sinhala and Tamil',
      width: 1774,
      height: 887,
      imageFit: 'contain',
      primaryAction: {
        label: 'Explore Jobs',
        icon: <Briefcase className="h-4 w-4 shrink-0" />,
        onClick: onExploreJobs,
      },
      secondaryAction: {
        label: 'Post a Job',
        icon: <PlusCircle className="h-4 w-4 shrink-0" />,
        onClick: () => onNavigate('/post/job'),
      },
    },
    {
      id: 'post',
      image: '/brand/jobs-hero/jobs-slide-2-post.png',
      alt: 'Post a job in English, Sinhala and Tamil',
      width: 1672,
      height: 941,
      imageFit: 'contain',
      primaryAction: {
        label: 'Post a Job',
        icon: <PlusCircle className="h-4 w-4 shrink-0" />,
        onClick: () => onNavigate('/post/job'),
      },
      secondaryAction: {
        label: 'My Job Posts',
        icon: <List className="h-4 w-4 shrink-0" />,
        onClick: () => onNavigate('/my-listings'),
      },
    },
    {
      id: 'categories',
      image: '/brand/jobs-hero/jobs-slide-3-categories.png',
      alt: 'Browse RENTOURA job categories in English, Sinhala and Tamil',
      width: 1672,
      height: 941,
      imageFit: 'contain',
      primaryAction: {
        label: 'Browse Categories',
        icon: <LayoutGrid className="h-4 w-4 shrink-0" />,
        onClick: onBrowseCategories,
      },
      secondaryAction: {
        label: 'Explore Jobs',
        icon: <Briefcase className="h-4 w-4 shrink-0" />,
        onClick: onExploreJobs,
      },
    },
  ];

  return (
    <MarketplaceHeroCarousel
      ariaLabel="RENTOURA.LK Jobs highlights"
      moduleName="Jobs"
      slides={slides}
      theme={JOBS_THEME}
    />
  );
};
