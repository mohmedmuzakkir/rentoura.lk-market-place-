import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { AppRoute } from '../types';

interface HomeHeroCarouselProps { onNavigate: (route: AppRoute) => void; }

interface HomeHeroSlide {
  id: 'rentals' | 'jobs' | 'services';
  label: string;
  image: string;
  theme: string;
  glow: string;
  browseLabel: string;
  browseRoute: AppRoute;
  postLabel: string;
  postRoute: AppRoute;
}

const HOME_HERO_SLIDES: HomeHeroSlide[] = [
  { id: 'rentals', label: 'Rentals', image: '/brand/home-hero/rentals-home-hero.png', theme: '#1464F4', glow: 'rgba(20, 100, 244, 0.42)', browseLabel: 'Explore Rentals', browseRoute: '/rentals', postLabel: 'Post a Rental', postRoute: '/post/rental' },
  { id: 'jobs', label: 'Jobs', image: '/brand/home-hero/jobs-home-hero.png', theme: '#08A34F', glow: 'rgba(8, 163, 79, 0.38)', browseLabel: 'Explore Jobs', browseRoute: '/jobs', postLabel: 'Post a Job', postRoute: '/post/job' },
  { id: 'services', label: 'Services', image: '/brand/home-hero/services-home-hero.png', theme: '#FF650A', glow: 'rgba(255, 101, 10, 0.4)', browseLabel: 'Explore Services', browseRoute: '/services', postLabel: 'Offer a Service', postRoute: '/post/service' },
];

const AUTOPLAY_MS = 5500;
const SWIPE_THRESHOLD_PX = 44;

export const HomeHeroCarousel: React.FC<HomeHeroCarouselProps> = ({ onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pointerStartX = useRef<number | null>(null);
  const pointerCurrentX = useRef<number | null>(null);

  const goToSlide = useCallback((index: number) => setCurrentIndex((index + HOME_HERO_SLIDES.length) % HOME_HERO_SLIDES.length), []);
  const nextSlide = useCallback(() => goToSlide(currentIndex + 1), [currentIndex, goToSlide]);
  const previousSlide = useCallback(() => goToSlide(currentIndex - 1), [currentIndex, goToSlide]);

  useEffect(() => {
    if (isPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(nextSlide, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [currentIndex, isPaused, nextSlide]);

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    pointerStartX.current = event.clientX;
    pointerCurrentX.current = event.clientX;
    setIsPaused(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (pointerStartX.current !== null) pointerCurrentX.current = event.clientX;
  };

  const handlePointerEnd = () => {
    if (pointerStartX.current !== null && pointerCurrentX.current !== null) {
      const distance = pointerStartX.current - pointerCurrentX.current;
      if (distance > SWIPE_THRESHOLD_PX) nextSlide();
      if (distance < -SWIPE_THRESHOLD_PX) previousSlide();
    }
    pointerStartX.current = null;
    pointerCurrentX.current = null;
    setIsPaused(false);
  };

  const currentSlide = HOME_HERO_SLIDES[currentIndex];

  return (
    <section
      className="relative overflow-hidden bg-[#02091f] px-2 pb-10 pt-3 sm:px-5 sm:pb-12 sm:pt-4 lg:px-8 lg:pb-14 lg:pt-5"
      aria-roledescription="carousel"
      aria-label="RENTOURA.LK marketplace highlights"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="pointer-events-none absolute inset-0 transition-colors duration-700" style={{ background: `radial-gradient(circle at 50% 30%, ${currentSlide.glow}, transparent 68%)` }} aria-hidden="true" />
      <div className="relative mx-auto max-w-[1040px] 2xl:max-w-[1120px]">
        <div
          className="relative touch-pan-y overflow-hidden rounded-[22px] border border-white/15 bg-[#06142f] shadow-2xl sm:rounded-[28px]"
          style={{ boxShadow: `0 24px 80px ${currentSlide.glow}` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-white/10 bg-[#041C43]">
            {HOME_HERO_SLIDES.map((slide, index) => (
              <img
                key={slide.id}
                src={slide.image}
                alt={`${slide.label} marketplace hero in English, Sinhala and Tamil`}
                width="1672"
                height="941"
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                draggable={false}
                className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ease-out ${index === currentIndex ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
                aria-hidden={index !== currentIndex}
              />
            ))}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#06142f]/55 to-transparent" aria-hidden="true" />
            <button type="button" onClick={previousSlide} className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-black/65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-4 lg:h-10 lg:w-10" aria-label="Previous hero slide">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button type="button" onClick={nextSlide} className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-black/65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-4 lg:h-10 lg:w-10" aria-label="Next hero slide">
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
          <div className="bg-gradient-to-b from-[#071a3b] to-[#040d22] p-2.5 sm:p-3 lg:px-4 lg:py-3.5">
            <div className="mx-auto grid max-w-2xl grid-cols-2 gap-2 sm:gap-3">
              <button type="button" onClick={() => onNavigate(currentSlide.browseRoute)} className="flex min-h-13 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-2.5 py-3 text-xs font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:min-h-14 sm:gap-2 sm:text-sm" style={{ backgroundColor: currentSlide.theme }}>
                {currentSlide.browseLabel}<ArrowRight className="h-4 w-4 shrink-0" />
              </button>
              <button type="button" onClick={() => onNavigate(currentSlide.postRoute)} className="flex min-h-13 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border bg-white/[0.07] px-2.5 py-3 text-xs font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:min-h-14 sm:gap-2 sm:text-sm" style={{ borderColor: currentSlide.theme }}>
                <PlusCircle className="h-4 w-4 shrink-0" />{currentSlide.postLabel}
              </button>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2" role="tablist" aria-label="Choose hero slide">
              {HOME_HERO_SLIDES.map((slide, index) => (
                <button key={slide.id} type="button" role="tab" aria-selected={index === currentIndex} aria-label={`Show ${slide.label} slide`} onClick={() => goToSlide(index)} className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${index === currentIndex ? 'w-9' : 'w-2.5 bg-white/35 hover:bg-white/60'}`} style={index === currentIndex ? { backgroundColor: slide.theme } : undefined} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
