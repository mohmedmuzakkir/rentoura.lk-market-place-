import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Wrench, ShieldCheck, Zap, MapPin, PlusCircle, Check } from 'lucide-react';
import { ServiceHeroSlide } from '../data/serviceHeroSlidesData';
import { AppRoute } from '../types';

interface ServiceHeroCarouselProps {
  slides: ServiceHeroSlide[];
  onNavigate: (route: AppRoute) => void;
  onFilterHomeRepair?: () => void;
  onFilterDigitalCreative?: () => void;
  onFilterNearMe?: () => void;
  onExploreAll?: () => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80';

export const ServiceHeroCarousel: React.FC<ServiceHeroCarouselProps> = ({
  slides,
  onNavigate,
  onFilterHomeRepair,
  onFilterDigitalCreative,
  onFilterNearMe,
  onExploreAll
}) => {
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

  const nextSlide = useCallback(() => {
    if (activeSlides.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const prevSlide = useCallback(() => {
    if (activeSlides.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  // Autoplay Timer (~5s)
  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused) return;

    const currentSlide = activeSlides[currentIndex];
    const duration = currentSlide?.durationMs && currentSlide.durationMs >= 2000
      ? currentSlide.durationMs
      : 5000;

    const timer = setInterval(() => {
      nextSlide();
    }, duration);

    return () => clearInterval(timer);
  }, [activeSlides, currentIndex, isPaused, nextSlide]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const distance = touchStartX.current - touchEndX.current;
      const minSwipeDistance = 40;
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

  const handleCtaClick = (slide: ServiceHeroSlide) => {
    if (slide.ctaAction === 'post_service' || slide.ctaRoute === '/post/service') {
      onNavigate('/post/service');
    } else if (slide.ctaAction === 'home_repair') {
      if (onFilterHomeRepair) onFilterHomeRepair();
    } else if (slide.ctaAction === 'digital_creative') {
      if (onFilterDigitalCreative) onFilterDigitalCreative();
    } else if (slide.ctaAction === 'near_me') {
      if (onFilterNearMe) onFilterNearMe();
    } else {
      if (onExploreAll) onExploreAll();
    }
  };

  const getSlideBadgeIcon = (action?: string) => {
    switch (action) {
      case 'home_repair':
        return <Wrench className="w-3.5 h-3.5 text-orange-400" />;
      case 'digital_creative':
        return <Zap className="w-3.5 h-3.5 text-orange-400" />;
      case 'near_me':
        return <MapPin className="w-3.5 h-3.5 text-orange-400" />;
      case 'post_service':
        return <PlusCircle className="w-3.5 h-3.5 text-orange-400" />;
      default:
        return <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />;
    }
  };

  return (
    <div 
      className="relative w-full rounded-2xl overflow-hidden bg-[#1A0B02] shadow-xl border border-orange-950/50 select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Services Marketplace Hero Carousel"
    >
      {/* Slide Track */}
      <div className="relative w-full min-h-[220px] sm:min-h-[280px] lg:min-h-[320px] flex items-center">
        {activeSlides.map((slide, index) => {
          const isActive = index === currentIndex;
          const hasImgError = imgErrorMap[slide.id];
          const bgSrc = hasImgError ? FALLBACK_IMAGE : (slide.imageUrl || FALLBACK_IMAGE);

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Image Layer */}
              <img
                src={bgSrc}
                alt={slide.title}
                onError={() => setImgErrorMap(prev => ({ ...prev, [slide.id]: true }))}
                className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000 ease-out"
                loading={index === 0 ? 'eager' : 'lazy'}
              />

              {/* Gradient Overlays for High Contrast Readability */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-[#1A0B02] via-[#1A0B02]/90 lg:via-[#1A0B02]/80 to-transparent"
                style={{ opacity: slide.overlayStrength ?? 0.8 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0B02] via-transparent to-black/30" />

              {/* Slide Content Layout */}
              <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6 py-5 sm:py-7">
                {/* Left Content Box */}
                <div className="max-w-xl">
                  {/* Top Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-950/80 backdrop-blur-md border border-orange-500/30 text-orange-200 text-[11px] sm:text-xs font-bold tracking-wider uppercase mb-2 sm:mb-3">
                    {getSlideBadgeIcon(slide.ctaAction)}
                    <span>{slide.subtitle || 'SERVICES MARKETPLACE'}</span>
                  </div>

                  {/* Main Headline */}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-heading tracking-tight leading-tight drop-shadow-sm">
                    {slide.title}{' '}
                    <span className="text-[#FF650A] font-black">
                      {slide.titleHighlight || ''}
                    </span>
                  </h1>

                  {/* Description Paragraph */}
                  {slide.description && (
                    <p className="mt-2 text-xs sm:text-sm text-orange-100/90 font-medium max-w-lg leading-relaxed line-clamp-2 sm:line-clamp-none">
                      {slide.description}
                    </p>
                  )}

                  {/* CTA Action Buttons */}
                  <div className="mt-4 sm:mt-5 flex items-center gap-3">
                    <button
                      onClick={() => handleCtaClick(slide)}
                      className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-[#FF650A] hover:bg-orange-600 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg shadow-orange-950/50 transition-all tap-bounce cursor-pointer"
                    >
                      <span>{slide.ctaLabel || 'Explore Services'}</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                    <button
                      onClick={() => onNavigate('/post/service')}
                      className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-md border border-white/15 transition-all tap-bounce cursor-pointer"
                    >
                      Offer Your Service
                    </button>
                  </div>
                </div>

                {/* Right Desktop Feature Card */}
                <div className="hidden lg:block shrink-0 w-[300px] bg-orange-950/40 backdrop-blur-md rounded-2xl p-4 border border-orange-500/20 shadow-xl">
                  <div className="flex items-center gap-3 pb-3 border-b border-orange-500/20">
                    <div className="w-9 h-9 rounded-xl bg-[#FF650A] flex items-center justify-center text-white text-base font-bold shadow-md">
                      🔧
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-xs">RENTOURA SERVICES</h3>
                      <p className="text-[10.5px] text-orange-200 font-medium">Verified Local Experts</p>
                    </div>
                  </div>
                  <div className="pt-2.5 space-y-1.5 text-xs text-orange-100">
                    <div className="flex items-center gap-2 bg-orange-900/20 p-1.5 rounded-lg border border-orange-500/10">
                      <ShieldCheck className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      <span className="text-[11px]">Verified Technicians & Pros</span>
                    </div>
                    <div className="flex items-center gap-2 bg-orange-900/20 p-1.5 rounded-lg border border-orange-500/10">
                      <ShieldCheck className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      <span className="text-[11px]">Emergency & On-Site Visits</span>
                    </div>
                    <div className="flex items-center gap-2 bg-orange-900/20 p-1.5 rounded-lg border border-orange-500/10">
                      <ShieldCheck className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      <span className="text-[11px]">Zero Middleman Platform Fees</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Left/Right Navigation Arrows */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/40 hover:bg-[#FF650A] text-white items-center justify-center backdrop-blur-xs transition-colors border border-white/20 opacity-0 group-hover:opacity-100 cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <button
            onClick={nextSlide}
            className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/40 hover:bg-[#FF650A] text-white items-center justify-center backdrop-blur-xs transition-colors border border-white/20 opacity-0 group-hover:opacity-100 cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </>
      )}

      {/* Slide Indicators Dots */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-3 right-4 z-30 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/15">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === currentIndex
                  ? 'w-5 h-1.5 bg-[#FF650A]'
                  : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
