import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export interface MarketplaceHeroAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export interface MarketplaceHeroSlide {
  id: string;
  image: string;
  alt: string;
  width: number;
  height: number;
  primaryAction: MarketplaceHeroAction;
  secondaryAction: MarketplaceHeroAction;
  accentColor?: string;
  glowColor?: string;
  imageFit?: 'cover' | 'contain';
  imagePosition?: string;
}

export interface MarketplaceHeroTheme {
  accentColor: string;
  glowColor: string;
  sectionBackground: string;
  frameBackground: string;
  imageBackground: string;
  controlsFrom: string;
  controlsTo: string;
  borderColor: string;
}

interface MarketplaceHeroCarouselProps {
  ariaLabel: string;
  moduleName: string;
  slides: MarketplaceHeroSlide[];
  theme: MarketplaceHeroTheme;
  autoplayMs?: number;
}

const DEFAULT_AUTOPLAY_MS = 5500;
const SWIPE_THRESHOLD_PX = 44;

export const MarketplaceHeroCarousel: React.FC<MarketplaceHeroCarouselProps> = ({
  ariaLabel,
  moduleName,
  slides,
  theme,
  autoplayMs = DEFAULT_AUTOPLAY_MS,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [autoplayReset, setAutoplayReset] = useState(0);
  const pointerStartX = useRef<number | null>(null);
  const pointerCurrentX = useRef<number | null>(null);
  const slideCount = slides.length;

  useEffect(() => {
    setCurrentIndex((index) => (slideCount > 0 ? Math.min(index, slideCount - 1) : 0));
  }, [slideCount]);

  const advance = useCallback((distance: number, manual = true) => {
    if (slideCount < 2) return;
    setCurrentIndex((index) => (index + distance + slideCount) % slideCount);
    if (manual) setAutoplayReset((value) => value + 1);
  }, [slideCount]);

  const goToSlide = useCallback((index: number) => {
    if (index < 0 || index >= slideCount) return;
    setCurrentIndex(index);
    setAutoplayReset((value) => value + 1);
  }, [slideCount]);

  useEffect(() => {
    if (
      slideCount < 2
      || isPaused
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return;

    const timer = window.setTimeout(() => advance(1, false), autoplayMs);
    return () => window.clearTimeout(timer);
  }, [advance, autoplayMs, autoplayReset, currentIndex, isPaused, slideCount]);

  const resetPointer = () => {
    pointerStartX.current = null;
    pointerCurrentX.current = null;
    setIsPaused(false);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if ((event.target as HTMLElement).closest('button, a')) return;

    pointerStartX.current = event.clientX;
    pointerCurrentX.current = event.clientX;
    setIsPaused(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current !== null) pointerCurrentX.current = event.clientX;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current !== null) {
      const distance = pointerStartX.current - event.clientX;
      if (distance > SWIPE_THRESHOLD_PX) advance(1);
      else if (distance < -SWIPE_THRESHOLD_PX) advance(-1);
    }
    resetPointer();
  };

  if (slideCount === 0) return null;

  const activeSlide = slides[currentIndex];
  const accentColor = activeSlide.accentColor ?? theme.accentColor;
  const glowColor = activeSlide.glowColor ?? theme.glowColor;

  const invokeAction = (action: MarketplaceHeroAction) => {
    setAutoplayReset((value) => value + 1);
    action.onClick();
  };

  return (
    <section
      className="relative overflow-hidden px-2 pb-8 pt-3 sm:px-5 sm:pb-10 sm:pt-4 lg:px-8 lg:pb-12 lg:pt-5"
      style={{ backgroundColor: theme.sectionBackground }}
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      data-hero-carousel={moduleName.toLowerCase()}
      data-active-slide={activeSlide.id}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-colors duration-700 motion-reduce:transition-none"
        style={{ background: `radial-gradient(circle at 50% 25%, ${glowColor}, transparent 68%)` }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1040px]">
        <div
          className="relative isolate select-none overflow-hidden rounded-[22px] border shadow-2xl sm:rounded-[28px]"
          style={{
            backgroundColor: theme.frameBackground,
            borderColor: theme.borderColor,
            boxShadow: `0 24px 80px ${glowColor}`,
          }}
        >
          <div
            className="relative aspect-video min-h-[190px] w-full touch-pan-y overflow-hidden border-b border-white/10"
            style={{ backgroundColor: theme.imageBackground }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={resetPointer}
          >
            {slides.map((slide, index) => {
              const isActive = index === currentIndex;
              const imageFitClass = slide.imageFit === 'contain' ? 'object-contain' : 'object-cover';

              return (
                <div
                  key={slide.id}
                  className={`pointer-events-none absolute inset-0 transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${
                    isActive ? 'scale-100 opacity-100' : 'scale-[1.012] opacity-0'
                  }`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${slideCount}`}
                  aria-hidden={!isActive}
                >
                  {slide.imageFit === 'contain' && (
                    <img
                      src={slide.image}
                      alt=""
                      aria-hidden="true"
                      width={slide.width}
                      height={slide.height}
                      draggable={false}
                      className="absolute inset-0 h-full w-full scale-110 object-cover opacity-35 blur-xl"
                      style={{ objectPosition: slide.imagePosition ?? 'center' }}
                    />
                  )}
                  <img
                    src={slide.image}
                    alt={isActive ? slide.alt : ''}
                    width={slide.width}
                    height={slide.height}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    decoding="async"
                    draggable={false}
                    className={`absolute inset-0 h-full w-full ${imageFitClass}`}
                    style={{ objectPosition: slide.imagePosition ?? 'center' }}
                  />
                </div>
              );
            })}

            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[18%]"
              style={{ background: `linear-gradient(to top, ${theme.frameBackground}cc, transparent)` }}
              aria-hidden="true"
            />

            {slideCount > 1 && (
              <>
                <button
                  type="button"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => advance(-1)}
                  className="pointer-events-auto absolute left-4 top-1/2 z-40 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/55 text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:brightness-125 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none md:flex"
                  style={{ boxShadow: `0 8px 24px ${glowColor}` }}
                  aria-label={`Previous ${moduleName} slide`}
                  data-carousel-control="previous"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => advance(1)}
                  className="pointer-events-auto absolute right-4 top-1/2 z-40 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/55 text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:brightness-125 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none md:flex"
                  style={{ boxShadow: `0 8px 24px ${glowColor}` }}
                  aria-label={`Next ${moduleName} slide`}
                  data-carousel-control="next"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          <div
            className="p-2.5 sm:p-3 lg:px-4 lg:py-3.5"
            style={{ background: `linear-gradient(to bottom, ${theme.controlsFrom}, ${theme.controlsTo})` }}
          >
            <div className="mx-auto grid max-w-2xl grid-cols-2 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => invokeAction(activeSlide.primaryAction)}
                className="flex min-h-13 items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-center text-[11px] font-extrabold leading-tight text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none sm:min-h-14 sm:gap-2 sm:px-3 sm:text-sm"
                style={{ backgroundColor: accentColor, boxShadow: `0 10px 28px ${glowColor}` }}
                data-carousel-action="primary"
              >
                {activeSlide.primaryAction.icon}
                <span>{activeSlide.primaryAction.label}</span>
                <ArrowRight className="hidden h-4 w-4 shrink-0 sm:block" />
              </button>
              <button
                type="button"
                onClick={() => invokeAction(activeSlide.secondaryAction)}
                className="flex min-h-13 items-center justify-center gap-1.5 rounded-xl border bg-white/[0.07] px-2 py-3 text-center text-[11px] font-extrabold leading-tight text-white transition hover:-translate-y-0.5 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none sm:min-h-14 sm:gap-2 sm:px-3 sm:text-sm"
                style={{ borderColor: accentColor }}
                data-carousel-action="secondary"
              >
                {activeSlide.secondaryAction.icon}
                <span>{activeSlide.secondaryAction.label}</span>
                <ArrowRight className="hidden h-4 w-4 shrink-0 sm:block" />
              </button>
            </div>

            {slideCount > 1 && (
              <div className="mt-1.5 flex items-center justify-center" role="tablist" aria-label={`Choose ${moduleName} hero slide`}>
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={index === currentIndex}
                    aria-label={`Show ${moduleName} slide ${index + 1}: ${slide.primaryAction.label}`}
                    onClick={() => goToSlide(index)}
                    className="flex h-8 min-w-8 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white"
                    data-carousel-dot={index}
                  >
                    <span
                      className={`block h-2.5 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                        index === currentIndex ? 'w-8' : 'w-2.5 bg-white/35 hover:bg-white/60'
                      }`}
                      style={index === currentIndex ? { backgroundColor: accentColor } : undefined}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
