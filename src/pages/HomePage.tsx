import React, { useState, useEffect, useCallback } from 'react';
import { SearchAndFilterPanel } from '../components/SearchAndFilterPanel';
import { HomeHeroCarousel } from '../components/HomeHeroCarousel';
import { ModuleCards } from '../components/ModuleCards';
import { BrowseCategories } from '../components/BrowseCategories';
import { PopularLocations } from '../components/PopularLocations';
import { FeaturedListings } from '../components/FeaturedListings';
import { HomeListingFeed, FeedListingItem } from '../components/HomeListingFeed';
import { TrustBanner } from '../components/TrustBanner';
import { AppRoute, FilterState, FeaturedListingItem, LocationItem } from '../types';
import { HeroSlide } from '../types/heroSlide';
import { HomeService, MarketplaceStats } from '../services/homeService';
import { SavedListingService } from '../services/savedListingService';

interface HomePageProps {
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  onNavigate: (route: AppRoute) => void;
  onOpenLocationModal: () => void;
  onOpenCategoryModal: () => void;
  onOpenFilterModal: () => void;
  onOpenLearnMore: () => void;
  onToggleSave: (listingId: string) => void;
  savedListings: string[];
  onOpenListingDetail?: (id: string, module?: 'rentals' | 'jobs' | 'services') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  filterState,
  setFilterState,
  onNavigate,
  onOpenLocationModal,
  onOpenCategoryModal,
  onOpenFilterModal,
  onOpenLearnMore,
  onToggleSave,
  savedListings: parentSavedListings,
  onOpenListingDetail
}) => {
  // State from Supabase
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [stats, setStats] = useState<MarketplaceStats | undefined>(undefined);
  const [featured, setFeatured] = useState<FeaturedListingItem[]>([]);
  const [popularLocations, setPopularLocations] = useState<(LocationItem & { searchCount?: number })[]>([]);
  
  // Feed state
  const [feedItems, setFeedItems] = useState<FeedListingItem[]>([]);
  const [feedTotalCount, setFeedTotalCount] = useState<number>(0);
  const [feedHasMore, setFeedHasMore] = useState<boolean>(false);
  const [activeFeedTab, setActiveFeedTab] = useState<'all' | 'rentals' | 'jobs' | 'services'>('all');
  const [feedPage, setFeedPage] = useState<number>(1);
  const [isFeedLoading, setIsFeedLoading] = useState<boolean>(true);
  const [isFeedLoadingMore, setIsFeedLoadingMore] = useState<boolean>(false);

  // Local saved state merged with parent
  const [localSaved, setLocalSaved] = useState<string[]>(parentSavedListings);

  // Fetch initial home page data on mount
  useEffect(() => {
    let isMounted = true;

    async function loadHomeData() {
      try {
        const [fetchedSlides, fetchedStats, fetchedFeatured, fetchedLocations, initialSaved] = await Promise.all([
          HomeService.getHeroSlides(),
          HomeService.getMarketplaceStats(),
          HomeService.getFeaturedListings(),
          HomeService.getPopularLocations(),
          SavedListingService.getSavedListingIds()
        ]);

        if (isMounted) {
          setSlides(fetchedSlides);
          setStats(fetchedStats);
          setFeatured(fetchedFeatured);
          setPopularLocations(fetchedLocations);
          if (initialSaved.length > 0) {
            setLocalSaved(initialSaved);
          }
        }
      } catch (err) {
        console.error('Error loading Home Page Supabase data:', err);
      }
    }

    loadHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch feed items whenever activeFeedTab or page changes
  const loadFeed = useCallback(async (tab: 'all' | 'rentals' | 'jobs' | 'services', page: number, isMore: boolean = false) => {
    if (isMore) {
      setIsFeedLoadingMore(true);
    } else {
      setIsFeedLoading(true);
    }

    try {
      const res = await HomeService.getLatestListingsFeed(page, 16, tab);
      if (isMore) {
        setFeedItems(prev => [...prev, ...res.items]);
      } else {
        setFeedItems(res.items);
      }
      setFeedTotalCount(res.totalCount);
      setFeedHasMore(res.hasMore);
    } catch (e) {
      console.error('Error loading feed:', e);
    } finally {
      setIsFeedLoading(false);
      setIsFeedLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setFeedPage(1);
    loadFeed(activeFeedTab, 1, false);
  }, [activeFeedTab, loadFeed]);

  const handleLoadMoreFeed = () => {
    if (feedHasMore && !isFeedLoadingMore) {
      const nextPage = feedPage + 1;
      setFeedPage(nextPage);
      loadFeed(activeFeedTab, nextPage, true);
    }
  };

  const handleTabChange = (tab: 'all' | 'rentals' | 'jobs' | 'services') => {
    setActiveFeedTab(tab);
  };

  const handleSearchChange = (query: string) => {
    setFilterState(prev => ({ ...prev, searchQuery: query }));
  };

  const handleSelectCategory = (categoryName: string) => {
    setFilterState(prev => ({ ...prev, selectedCategory: categoryName }));
    onNavigate('/search');
  };

  const handleSelectLocation = (locationName: string) => {
    HomeService.recordLocationActivity(locationName);
    setFilterState(prev => ({ ...prev, selectedLocation: `${locationName}, Sri Lanka` }));
    onNavigate('/search');
  };

  const handleSelectListing = (listing: any) => {
    if (onOpenListingDetail && listing.id) {
      const mod = listing.module || 'rentals';
      onOpenListingDetail(listing.id, mod);
    } else {
      onNavigate('/search');
    }
  };

  const handlePerformSearch = () => {
    onNavigate('/search');
  };

  const handleToggleSaveLocal = async (listingId: string) => {
    onToggleSave(listingId);
  };

  // Map isSaved to featured items
  const featuredWithSaved = featured.map(item => ({
    ...item,
    isSaved: parentSavedListings.includes(item.id)
  }));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16 overflow-x-hidden selection:bg-[#1464F4] selection:text-white">
      {/* 1. HERO CAROUSEL */}
      <HomeHeroCarousel slides={slides.length > 0 ? slides : undefined} onNavigate={onNavigate} />

      {/* 2. SEARCH AND FILTER PANEL (Overlaps Hero) */}
      <SearchAndFilterPanel
        filterState={filterState}
        onSearchChange={handleSearchChange}
        onOpenLocationModal={onOpenLocationModal}
        onOpenCategoryModal={onOpenCategoryModal}
        onOpenFilterModal={onOpenFilterModal}
        onPerformSearch={handlePerformSearch}
      />

      {/* 3. THREE MODULE CARDS: RENTALS / JOBS / SERVICES */}
      <ModuleCards onNavigate={onNavigate} stats={stats} />

      {/* 4. BROWSE BY CATEGORY */}
      <BrowseCategories
        onSelectCategory={handleSelectCategory}
        onNavigate={onNavigate}
        activeModule="rental"
      />

      {/* 5. POPULAR LOCATIONS */}
      <PopularLocations
        locations={popularLocations}
        onSelectLocation={handleSelectLocation}
        onNavigate={onNavigate}
      />

      {/* 6. FEATURED LISTINGS */}
      <FeaturedListings
        listings={featuredWithSaved}
        onToggleSave={handleToggleSaveLocal}
        onSelectListing={handleSelectListing}
        onNavigate={onNavigate}
      />

      {/* 7. CONTINUOUS MARKETPLACE LISTING FEED */}
      <HomeListingFeed
        items={feedItems}
        totalCount={feedTotalCount}
        hasMore={feedHasMore}
        isLoading={isFeedLoading}
        isLoadingMore={isFeedLoadingMore}
        onLoadMore={handleLoadMoreFeed}
        activeTab={activeFeedTab}
        onTabChange={handleTabChange}
        savedListings={parentSavedListings}
        onToggleSave={handleToggleSaveLocal}
        onSelectListing={handleSelectListing}
        onNavigate={onNavigate}
      />

      {/* 8. TRUST & SAFETY BANNER */}
      <TrustBanner onLearnMore={onOpenLearnMore} />
    </div>
  );
};
