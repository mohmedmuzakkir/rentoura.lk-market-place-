import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, LayoutGrid, List, PlusCircle } from 'lucide-react';
import { AppRoute } from '../types';

interface Props { onNavigate: (route: AppRoute) => void; onExploreRentals: () => void; onBrowseCategories: () => void; }
interface Slide { id: string; image: string; alt: string; primaryLabel: string; secondaryLabel: string; primaryIcon: React.ReactNode; secondaryIcon: React.ReactNode; onPrimary: () => void; onSecondary: () => void; }
const AUTOPLAY_MS = 5500;
const SWIPE_THRESHOLD_PX = 44;

export const RentalHeroCarousel: React.FC<Props> = ({ onNavigate, onExploreRentals, onBrowseCategories }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pointerStartX = useRef<number | null>(null);
  const pointerCurrentX = useRef<number | null>(null);
  const slides: Slide[] = [
    { id: 'explore', image: '/brand/rentals-hero/rentals-slide-1-explore.png', alt: 'Explore Rentals across Sri Lanka in English, Sinhala and Tamil', primaryLabel: 'Explore Rentals', secondaryLabel: 'Post a Rental', primaryIcon: <List className="h-4 w-4 shrink-0" />, secondaryIcon: <PlusCircle className="h-4 w-4 shrink-0" />, onPrimary: onExploreRentals, onSecondary: () => onNavigate('/post/rental') },
    { id: 'post', image: '/brand/rentals-hero/rentals-slide-2-post.png', alt: 'Post your rental in minutes in English, Sinhala and Tamil', primaryLabel: 'Post Rental Listing', secondaryLabel: 'My Listings', primaryIcon: <PlusCircle className="h-4 w-4 shrink-0" />, secondaryIcon: <List className="h-4 w-4 shrink-0" />, onPrimary: () => onNavigate('/post/rental'), onSecondary: () => onNavigate('/my-listings') },
    { id: 'categories', image: '/brand/rentals-hero/rentals-slide-3-categories.png', alt: 'Browse real RENTOURA rental categories in English, Sinhala and Tamil', primaryLabel: 'Browse Categories', secondaryLabel: 'View All Rentals', primaryIcon: <LayoutGrid className="h-4 w-4 shrink-0" />, secondaryIcon: <List className="h-4 w-4 shrink-0" />, onPrimary: onBrowseCategories, onSecondary: onExploreRentals },
  ];
  const goToSlide = useCallback((index: number) => setCurrentIndex((index + 3) % 3), []);
  const nextSlide = useCallback(() => goToSlide(currentIndex + 1), [currentIndex, goToSlide]);
  const previousSlide = useCallback(() => goToSlide(currentIndex - 1), [currentIndex, goToSlide]);
  useEffect(() => {
    if (isPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(nextSlide, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [currentIndex, isPaused, nextSlide]);
  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => { pointerStartX.current = event.clientX; pointerCurrentX.current = event.clientX; setIsPaused(true); event.currentTarget.setPointerCapture?.(event.pointerId); };
  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => { if (pointerStartX.current !== null) pointerCurrentX.current = event.clientX; };
  const handlePointerEnd = () => {
    if (pointerStartX.current !== null && pointerCurrentX.current !== null) { const distance = pointerStartX.current - pointerCurrentX.current; if (distance > SWIPE_THRESHOLD_PX) nextSlide(); if (distance < -SWIPE_THRESHOLD_PX) previousSlide(); }
    pointerStartX.current = null; pointerCurrentX.current = null; setIsPaused(false);
  };
  const currentSlide = slides[currentIndex];
  return (
    <section className="relative overflow-hidden bg-[#02091f] px-2 pb-8 pt-3 sm:px-5 sm:pb-10 sm:pt-4 lg:px-8 lg:pb-12 lg:pt-5" aria-roledescription="carousel" aria-label="RENTOURA.LK Rentals highlights" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(20,100,244,0.45),transparent_68%)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1040px] 2xl:max-w-[1120px]">
        <div className="relative touch-pan-y select-none overflow-hidden rounded-[22px] border border-blue-300/20 bg-[#06142f] shadow-[0_24px_80px_rgba(20,100,244,0.32)] sm:rounded-[28px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerEnd} onPointerCancel={handlePointerEnd}>
          <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-white/10 bg-[#041c43]">
            {slides.map((slide, index) => <img key={slide.id} src={slide.image} alt={slide.alt} width="1672" height="941" loading={index === 0 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'auto'} draggable={false} className={`absolute inset-0 h-full w-full object-contain transition-[opacity,transform] duration-700 ease-out ${index === currentIndex ? 'scale-100 opacity-100' : 'pointer-events-none scale-[1.015] opacity-0'}`} aria-hidden={index !== currentIndex} />)}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#06142f]/55 to-transparent" aria-hidden="true" />
            <button type="button" onClick={previousSlide} className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-[#1464f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-4 sm:h-11 sm:w-11" aria-label="Previous rental slide"><ChevronLeft className="h-6 w-6" /></button>
            <button type="button" onClick={nextSlide} className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-[#1464f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-4 sm:h-11 sm:w-11" aria-label="Next rental slide"><ChevronRight className="h-6 w-6" /></button>
          </div>
          <div className="bg-gradient-to-b from-[#071a3b] to-[#040d22] p-2.5 sm:p-3 lg:px-4 lg:py-3.5">
            <div className="mx-auto grid max-w-2xl grid-cols-2 gap-2 sm:gap-3">
              <button type="button" onClick={currentSlide.onPrimary} className="flex min-h-13 items-center justify-center gap-1.5 rounded-xl bg-[#1464f4] px-2 py-3 text-center text-[11px] font-extrabold leading-tight text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-[#2174ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:min-h-14 sm:gap-2 sm:px-3 sm:text-sm">{currentSlide.primaryIcon}<span>{currentSlide.primaryLabel}</span><ArrowRight className="hidden h-4 w-4 shrink-0 sm:block" /></button>
              <button type="button" onClick={currentSlide.onSecondary} className="flex min-h-13 items-center justify-center gap-1.5 rounded-xl border border-[#2082ff] bg-white/[0.07] px-2 py-3 text-center text-[11px] font-extrabold leading-tight text-white transition hover:-translate-y-0.5 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:min-h-14 sm:gap-2 sm:px-3 sm:text-sm">{currentSlide.secondaryIcon}<span>{currentSlide.secondaryLabel}</span><ArrowRight className="hidden h-4 w-4 shrink-0 sm:block" /></button>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2" role="tablist" aria-label="Choose rental hero slide">{slides.map((slide, index) => <button key={slide.id} type="button" role="tab" aria-selected={index === currentIndex} aria-label={`Show slide ${index + 1}: ${slide.primaryLabel}`} onClick={() => goToSlide(index)} className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${index === currentIndex ? 'w-9 bg-[#1981ff]' : 'w-2.5 bg-white/35 hover:bg-white/60'}`} />)}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
