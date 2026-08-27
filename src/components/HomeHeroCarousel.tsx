import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Sparkles, Building2, Briefcase, Wrench, PlusCircle } from 'lucide-react';
import { HeroSlide, CarouselConfig } from '../types/heroSlide';
import { DEFAULT_HERO_SLIDES, DEFAULT_CAROUSEL_CONFIG } from '../data/heroSlidesData';
import { AppRoute } from '../types';
import { RentouraLogo } from './RentouraLogo';

interface HomeHeroCarouselProps {
  slides?: HeroSlide[];
  config?: Partial<CarouselConfig>;
  onNavigate: (route: AppRoute) => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85';

export const HomeHeroCarousel: React.FC<HomeHeroCarouselProps> = ({
  slides = DEFAULT_HERO_SLIDES,
  config = {},
  onNavigate
}) => {
  const mergedConfig: CarouselConfig = useMemo(() => ({
    ...DEFAULT_CAROUSEL_CONFIG,
    ...config,
  }), [config]);

  // Filter & sort active slides according to admin displayOrder
  const activeSlides = useMemo(() => {
    return slides
      .filter(s => s.isEnabled)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [slides]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imgErrorMap, setImgErrorMap] = useState<Record<string, boolean>>({});

  // Touch Swipe tracking
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Safe navigation
  const nextSlide = useCallback(() => {
    if (activeSlides.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const prevSlide = useCallback(() => {
    if (activeSlides.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  // Autoplay Timer with configurable timing
  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused) return;

    const currentSlide = activeSlides[currentIndex];
    const duration = currentSlide?.autoplayDurationMs && currentSlide.autoplayDurationMs >= 2000
      ? currentSlide.autoplayDurationMs
      : Math.max(2000, mergedConfig.autoplayIntervalMs);

    const timer = setInterval(() => {
      nextSlide();
    }, duration);

    return () => clearInterval(timer);
  }, [activeSlides, currentIndex, isPaused, mergedConfig.autoplayIntervalMs, nextSlide]);

  // Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!mergedConfig.enableTouchSwipe) return;
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!mergedConfig.enableTouchSwipe) return;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!mergedConfig.enableTouchSwipe) return;
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const distance = touchStartX.current - touchEndX.current;
      const minSwipeDistance = 40; // minimum pixels for swipe
      if (distance > minSwipeDistance) {
        nextSlide();
      } else if (distance < -minSwipeDistance) {
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
    setIsPaused(false);
  };

  if (activeSlides.length === 0) {
    return null;
  }

  const currentSlide = activeSlides[currentIndex] || activeSlides[0];

  const getModuleBadgeIcon = (module: string) => {
    switch (module) {
      case 'rentals':
        return <Building2 className="w-3.5 h-3.5 text-sky-400" />;
      case 'jobs':
        return <Briefcase className="w-3.5 h-3.5 text-emerald-400" />;
      case 'services':
        return <Wrench className="w-3.5 h-3.5 text-orange-400" />;
      case 'post':
        return <PlusCircle className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  return (
    <section 
      className="relative bg-[#041C43] overflow-hidden select-none transition-colors duration-500 pt-2 pb-14 lg:py-16"
      onMouseEnter={() => mergedConfig.pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => mergedConfig.pauseOnHover && setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Homepage Hero Carousel"
    >
      {/* Background Slides with Fade Transition */}
      {activeSlides.map((slide, index) => {
        const isActive = index === currentIndex;
        const hasImgError = imgErrorMap[slide.id];
        const displayImage = hasImgError ? FALLBACK_IMAGE : slide.imageUrl;
        const overlayOpacity = slide.overlayStrength ?? 0.5;

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 z-0 transition-opacity duration-700 ease-in-out ${
              isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={displayImage}
              alt={slide.title.replace('\n', ' ')}
              onError={() => setImgErrorMap(prev => ({ ...prev, [slide.id]: true }))}
              className="w-full h-full object-cover object-center scale-105"
            />
            {/* Gradient Overlays */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-[#041C43] via-[#041C43]/90 lg:via-[#041C43]/75 to-transparent"
              style={{ opacity: Math.min(1, overlayOpacity + 0.2) }}
            />
            <div 
              className="absolute inset-0 bg-gradient-to-t from-[#041C43] via-[#041C43]/40 to-transparent"
              style={{ opacity: overlayOpacity }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#041C43] via-transparent to-[#041C43]" />
          </div>
        );
      })}

      {/* Main Slide Content */}
      <div className="relative z-10 px-5 lg:px-8 pt-3 pb-6 max-w-md lg:max-w-7xl mx-auto lg:flex lg:items-center lg:justify-between lg:gap-12 min-h-[220px] lg:min-h-[280px]">
        {/* Left Column: Text & Actions */}
        <div className="max-w-xl">
          {/* Subtitle / Badge */}
          {currentSlide.subtitle && (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white text-xs font-semibold mb-3 backdrop-blur-md">
              {getModuleBadgeIcon(currentSlide.module)}
              <span>{currentSlide.subtitle}</span>
            </span>
          )}

          {/* Headline */}
          <h1 className="text-[30px] sm:text-[36px] lg:text-[50px] font-black text-white leading-[1.08] lg:leading-[1.1] tracking-tight font-heading whitespace-pre-line">
            {currentSlide.title}
          </h1>

          {/* Description */}
          <p className="mt-2.5 lg:mt-4 text-slate-200/90 text-[13px] lg:text-base leading-relaxed font-normal max-w-lg">
            {currentSlide.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3 mt-5 lg:mt-6">
            <button
              onClick={() => onNavigate(currentSlide.ctaRoute)}
              className="px-6 py-3 rounded-xl text-white font-bold text-xs lg:text-sm shadow-xl transition-all flex items-center gap-2 tap-bounce active:scale-95"
              style={{ backgroundColor: currentSlide.themeColor }}
            >
              <span>{currentSlide.ctaLabel}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            {currentSlide.module !== 'platform' && (
              <button
                onClick={() => onNavigate('/search')}
                className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs lg:text-sm backdrop-blur-md border border-white/15 transition-all"
              >
                Search All
              </button>
            )}
          </div>
        </div>

        {/* Right Desktop Feature Card */}
        <div className="hidden lg:block shrink-0 w-[380px] bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/15 shadow-2xl">
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-md"
              style={{ backgroundColor: currentSlide.themeColor }}
            >
              🇱🇰
            </div>
            <div>
              <RentouraLogo variant="horizontal" theme="dark-header" size="sm" />
              <p className="text-xs text-blue-200 font-medium">Sri Lanka's Trusted Network</p>
            </div>
          </div>
          <div className="pt-4 space-y-2.5 text-xs text-slate-200">
            <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Verified Listings Across 9 Provinces</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Direct Contact With Owners & Employers</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero Broker Commission Fee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Desktop Navigation Arrows */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 text-white border border-white/20 backdrop-blur-md items-center justify-center transition-all hover:scale-110 active:scale-95"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 text-white border border-white/20 backdrop-blur-md items-center justify-center transition-all hover:scale-110 active:scale-95"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Pagination Indicators (Dots / Bars) */}
      {activeSlides.length > 1 && (
        <div className="relative z-20 flex items-center justify-center gap-2 mt-2 pb-1">
          {activeSlides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-7 bg-white shadow-md'
                    : 'w-2 bg-white/35 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};
