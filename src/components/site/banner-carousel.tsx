"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { parseBannerSlides } from "@/lib/banner-slides";

type BannerCarouselProps = {
  banner: {
    title: string;
    imageUrl: string;
    slideUrls?: string | null;
    slidesJson?: string | null;
    link?: string | null;
  };
  showMeta?: boolean;
  variant?: "default" | "sidebar";
};

export function BannerCarousel({ banner, showMeta = true, variant = "default" }: BannerCarouselProps) {
  const slides = useMemo(() => parseBannerSlides(banner), [banner]);
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const normalizedActiveIndex = slides.length ? activeIndex % slides.length : 0;
  const currentSlide = slides[normalizedActiveIndex];
  const imageHeightClass = variant === "sidebar" ? "h-44 sm:h-48 xl:h-56" : "h-40 sm:h-44";
  const metaPaddingClass = variant === "sidebar" ? "p-5" : "p-4";

  function goToSlide(nextIndex: number) {
    if (!slides.length) return;
    setActiveIndex((nextIndex + slides.length) % slides.length);
  }

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 3000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  function onTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function onTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null || slides.length <= 1) {
      touchStartX.current = null;
      return;
    }

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const deltaX = touchEndX - touchStartX.current;

    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        goToSlide(normalizedActiveIndex - 1);
      } else {
        goToSlide(normalizedActiveIndex + 1);
      }
    }

    touchStartX.current = null;
  }

  const content = (
    <div
      className="overflow-hidden rounded-[24px] border border-[color:var(--line)] bg-white shadow-[0_14px_40px_rgba(18,59,103,0.08)]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className={`relative overflow-hidden bg-[color:var(--mist)]/25 ${imageHeightClass}`}>
        {slides.map((slide, index) => (
          <div
            key={`${slide.imageUrl}-${index}`}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === normalizedActiveIndex ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.title || banner.title}
              fill
              className={`object-cover ${index === normalizedActiveIndex ? "banner-zoom-out" : ""}`}
            />
          </div>
        ))}

      </div>

      {showMeta ? (
        <div className={metaPaddingClass}>
          <p className="text-sm font-semibold text-[color:var(--ink)]">
            {currentSlide?.title || banner.title}
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
            Espacio publicitario
          </p>
        </div>
      ) : null}
    </div>
  );

  return (
    <div className="relative">
      {currentSlide?.link ? (
        <a
          href={currentSlide.link}
          target="_blank"
          rel="noreferrer"
          className="absolute inset-0 z-10 block"
          aria-label={currentSlide.title || banner.title}
        />
      ) : null}
      {content}
    </div>
  );
}
