import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Briefcase, Globe, Building2, Zap, PlusCircle, Check } from 'lucide-react';
import { JobHeroSlide } from '../data/jobHeroSlidesData';
import { AppRoute } from '../types';

interface JobHeroCarouselProps {
  slides: JobHeroSlide[];
  onNavigate: (route: AppRoute) => void;
  onFilterRemote?: () => void;
  onFilterCompanies?: () => void;
  onFilterFastHiring?: () => void;
  onExploreAll?: () => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80';

export const JobHeroCarousel: React.FC<JobHeroCarouselProps> = ({
  slides,
  onNavigate,
  onFilterRemote,
  onFilterCompanies,
  onFilterFastHiring,
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

  // Autoplay Timer
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

  // Swipe Handlers
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

  const handleCtaClick = (slide: JobHeroSlide) => {
    if (slide.ctaAction === 'post_job' || slide.ctaRoute === '/post/job') {
      onNavigate('/post/job');
    } else if (slide.ctaAction === 'remote') {
      if (onFilterRemote) onFilterRemote();
    } else if (slide.ctaAction === 'companies') {
      if (onFilterCompanies) onFilterCompanies();
    } else if (slide.ctaAction === 'fast_hiring') {
      if (onFilterFastHiring) onFilterFastHiring();
    } else {
      if (onExploreAll) onExploreAll();
    }
  };

  const getSlideBadgeIcon = (action?: string) => {
    switch (action) {
      case 'remote':
        return <Globe className="w-3.5 h-3.5 text-emerald-400" />;
      case 'companies':
        return <Building2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'fast_hiring':
        return <Zap className="w-3.5 h-3.5 text-emerald-400" />;
      case 'post_job':
        return <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Briefcase className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div 
      className="relative w-full rounded-2xl overflow-hidden bg-[#021A12] shadow-xl border border-emerald-900/50 select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Jobs Marketplace Hero Carousel"
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

              {/* Gradient Overlay for Text Readability */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-[#021A12] via-[#021A12]/90 lg:via-[#021A12]/80 to-transparent"
                style={{ opacity: slide.overlayStrength ?? 0.8 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#021A12] via-transparent to-black/30" />

              {/* Content Box */}
              <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6 py-5 sm:py-7">
                {/* Left Content Box */}
                <div className="max-w-xl">
                  {/* Top Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-[11px] sm:text-xs font-bold tracking-wider uppercase mb-2 sm:mb-3">
                    {getSlideBadgeIcon(slide.ctaAction)}
                    <span>{slide.subtitle || 'JOBS MARKETPLACE'}</span>
                  </div>

                  {/* Main Headline */}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-heading tracking-tight leading-tight drop-shadow-sm">
                    {slide.title}{' '}
                    <span className="text-[#08A34F] font-black">
                      {slide.titleHighlight || ''}
                    </span>
                  </h1>

                  {/* Description Paragraph */}
                  {slide.description && (
                    <p className="mt-2 text-xs sm:text-sm text-emerald-100/90 font-medium max-w-lg leading-relaxed line-clamp-2 sm:line-clamp-none">
                      {slide.description}
                    </p>
                  )}

                  {/* CTA Action Buttons */}
                  <div className="mt-4 sm:mt-5 flex items-center gap-3">
                    <button
                      onClick={() => handleCtaClick(slide)}
                      className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-[#08A34F] hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all tap-bounce cursor-pointer"
                    >
                      <span>{slide.ctaLabel || 'Explore Opportunities'}</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                    <button
                      onClick={() => onNavigate('/post/job')}
                      className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-md border border-white/15 transition-all tap-bounce cursor-pointer"
                    >
                      Post a Job
                    </button>
                  </div>
                </div>

                {/* Right Desktop Feature Card */}
                <div className="hidden lg:block shrink-0 w-[300px] bg-emerald-950/40 backdrop-blur-md rounded-2xl p-4 border border-emerald-500/20 shadow-xl">
                  <div className="flex items-center gap-3 pb-3 border-b border-emerald-500/20">
                    <div className="w-9 h-9 rounded-xl bg-[#08A34F] flex items-center justify-center text-white text-base font-bold shadow-md">
                      💼
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-xs">RENTOURA JOBS</h3>
                      <p className="text-[10.5px] text-emerald-200 font-medium">Sri Lanka Careers</p>
                    </div>
                  </div>
                  <div className="pt-2.5 space-y-1.5 text-xs text-emerald-100">
                    <div className="flex items-center gap-2 bg-emerald-900/20 p-1.5 rounded-lg border border-emerald-500/10">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-[11px]">Direct Applications to Employers</span>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-900/20 p-1.5 rounded-lg border border-emerald-500/10">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-[11px]">Browse current employer listings</span>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-900/20 p-1.5 rounded-lg border border-emerald-500/10">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-[11px]">Zero Placement Agency Fees</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Navigation Arrows */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-[#08A34F] backdrop-blur-md border border-white/20 text-white items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-[#08A34F] backdrop-blur-md border border-white/20 text-white items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </>
      )}

      {/* Slide Dot Indicators */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? 'w-5 bg-[#08A34F]'
                  : 'w-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
