"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

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
};

export function BannerCarousel({ banner, showMeta = true }: BannerCarouselProps) {
  const slides = useMemo(() => parseBannerSlides(banner), [banner]);
  const [activeIndex, setActiveIndex] = useState(0);
  const normalizedActiveIndex = slides.length ? activeIndex % slides.length : 0;
  const currentSlide = slides[normalizedActiveIndex];

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 3000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const content = (
    <div className="overflow-hidden rounded-[24px] border border-[color:var(--line)] bg-white shadow-[0_14px_40px_rgba(18,59,103,0.08)]">
      <div className="relative h-40 overflow-hidden bg-white sm:h-44">
        {slides.map((slide, index) => (
          <div
            key={`${slide.imageUrl}-${index}`}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === normalizedActiveIndex ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <Image src={slide.imageUrl} alt={slide.title || banner.title} fill className="object-contain p-3" />
          </div>
        ))}

        {slides.length > 1 ? (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-white/80 px-3 py-1 shadow-sm backdrop-blur">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`h-2.5 w-2.5 rounded-full ${
                  index === normalizedActiveIndex ? "bg-[color:var(--lake-blue)]" : "bg-[color:var(--line)]"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>

      {showMeta ? (
        <div className="p-4">
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

  return currentSlide?.link ? (
    <a href={currentSlide.link} target="_blank" rel="noreferrer" className="block">
      {content}
    </a>
  ) : (
    content
  );
}
