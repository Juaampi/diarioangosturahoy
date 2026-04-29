"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, PlayCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

import { RadioPlayButton } from "@/components/site/radio-play-button";
import { SearchForm } from "@/components/site/search-form";
import {
  DEFAULT_HEADER_FACEBOOK_URL,
  DEFAULT_HEADER_INSTAGRAM_URL,
  DEFAULT_HEADER_X_URL,
  DEFAULT_RADIO_IMAGE,
  DEFAULT_RADIO_URL,
  DEFAULT_RADIO_STREAM_URL,
  DEFAULT_YOUTUBE_URL,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

type HeaderProps = {
  categories: { id: number; name: string; slug: string }[];
  siteName: string;
  tagline: string;
  radioUrl?: string | null;
  youtubeUrl?: string | null;
  radioStreamUrl?: string | null;
};

export function Header({ categories, siteName, radioUrl, youtubeUrl, radioStreamUrl }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY;

      setIsCompact((previous) => {
        if (!previous && scrollY > 220) return true;
        if (previous && scrollY <= 0) return false;
        return previous;
      });
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const categoryOrder = ["locales", "regionales", "nacionales", "internacionales", "deporte"];
  const orderedCategories = [...categories].sort((left, right) => {
    const leftIndex = categoryOrder.indexOf(left.slug);
    const rightIndex = categoryOrder.indexOf(right.slug);

    return (leftIndex === -1 ? 999 : leftIndex) - (rightIndex === -1 ? 999 : rightIndex);
  });

  const navItems = orderedCategories.map((category) => ({
    href: `/categoria/${category.slug}`,
    label: category.slug === "deporte" ? "Deportes" : category.name,
  }));
  const socialLinks = [
    {
      href: DEFAULT_HEADER_FACEBOOK_URL,
      label: "Facebook",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.3-1.5 1.6-1.5H16V5.1c-.2 0-.9-.1-1.8-.1-1.8 0-3.1 1.1-3.1 3.2V11H9v3h2.3v7h2.2Z" />
        </svg>
      ),
    },
    {
      href: DEFAULT_HEADER_INSTAGRAM_URL,
      label: "Instagram",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm0 1.8A2.7 2.7 0 0 0 4.8 7.5v9a2.7 2.7 0 0 0 2.7 2.7h9a2.7 2.7 0 0 0 2.7-2.7v-9a2.7 2.7 0 0 0-2.7-2.7h-9Zm9.6 1.35a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1ZM12 7.2A4.8 4.8 0 1 1 7.2 12 4.8 4.8 0 0 1 12 7.2Zm0 1.8A3 3 0 1 0 15 12a3 3 0 0 0-3-3Z" />
        </svg>
      ),
    },
    {
      href: DEFAULT_HEADER_X_URL,
      label: "X",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M18.9 3H21l-4.7 5.4L22 21h-4.6l-3.6-4.8L9.5 21H7.4l5-5.8L2 3h4.7l3.3 4.4L18.9 3Zm-1.6 15.2h1.3L6 4.7H4.7l12.6 13.5Z" />
        </svg>
      ),
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-[#eaeaea]/95 backdrop-blur-xl">
      <div className="mx-auto max-w-[1600px] px-4 py-3 lg:px-6 2xl:px-10">
        {!isCompact ? (
          <div className="overflow-hidden rounded-[32px] bg-white/62 px-4 py-4 shadow-[0_14px_50px_rgba(15,77,134,0.08)] ring-1 ring-black/5 lg:px-6">
            <div className="flex items-center justify-between gap-4">
              <Link href="/" className="flex min-w-0 items-center gap-4 lg:gap-5">
                <div className="overflow-hidden rounded-[18px] bg-[#eaeaea] px-2.5 py-1.5 shadow-[inset_0_0_0_1px_rgba(17,40,63,0.06)]">
                  <Image
                    src="/logo.jpg"
                    alt={`${siteName} logo`}
                    width={1344}
                    height={756}
                    className="h-[52px] w-auto object-contain sm:h-[62px] lg:h-[74px]"
                    priority
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-serif text-2xl font-bold leading-none text-[color:var(--ink)] sm:text-3xl lg:text-[2.6rem]">
                    Diario Angostura Hoy
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.42em] text-[color:var(--muted-foreground)] sm:text-xs">
                    Diario Digital
                  </p>
                </div>
              </Link>

              <div className="hidden min-[980px]:flex min-[980px]:flex-1 min-[980px]:items-center min-[980px]:justify-end min-[980px]:gap-4">
                <div className="w-full max-w-[640px]">
                  <SearchForm />
                </div>
                <div className="flex items-center gap-2">
                  {socialLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.label}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--line)] bg-white text-[color:var(--lake-blue)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[color:var(--mist)]"
                    >
                      {item.icon}
                    </a>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen((value) => !value)}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--lake-blue)] text-white shadow-[0_10px_30px_rgba(15,77,134,0.25)] min-[980px]:hidden"
                aria-label={isOpen ? "Cerrar menu" : "Abrir menu"}
                aria-expanded={isOpen}
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        ) : (
          <div className="hidden min-[980px]:flex min-[980px]:items-center min-[980px]:justify-between min-[980px]:gap-4 rounded-[28px] bg-white/78 px-4 py-3 shadow-[0_10px_35px_rgba(15,77,134,0.08)] ring-1 ring-black/5 transition-all duration-500">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <div className="overflow-hidden rounded-[14px] bg-[#eaeaea] px-2 py-1 shadow-[inset_0_0_0_1px_rgba(17,40,63,0.06)]">
                <Image
                  src="/logo.jpg"
                  alt={`${siteName} logo`}
                  width={1344}
                  height={756}
                  className="h-[42px] w-auto object-contain transition-all duration-500"
                  priority
                />
              </div>
              <div className="min-w-0">
                <p className="truncate font-serif text-xl font-bold leading-none text-[color:var(--ink)] transition-all duration-500">
                  Diario Angostura Hoy
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.38em] text-[color:var(--muted-foreground)] transition-all duration-500">
                  Diario Digital
                </p>
              </div>
            </Link>

            <div className="flex flex-1 items-center justify-end gap-4">
              <div className="w-full max-w-[520px]">
                <SearchForm />
              </div>
              <div className="flex items-center gap-2">
                {socialLinks.map((item) => (
                  <a
                    key={`compact-${item.label}`}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--line)] bg-white text-[color:var(--lake-blue)] shadow-sm transition duration-500 hover:-translate-y-0.5 hover:bg-[color:var(--mist)]"
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-3 rounded-[28px] bg-white/72 p-3 shadow-[0_10px_35px_rgba(15,77,134,0.08)] ring-1 ring-black/5 transition-all duration-500">
          <div className="flex flex-col gap-3 min-[980px]:flex-row min-[980px]:items-center min-[980px]:justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex h-14 w-24 items-center justify-center overflow-hidden rounded-2xl border border-[color:var(--line)] bg-white p-2">
                <Image src={DEFAULT_RADIO_IMAGE} alt="Radio live" fill className="object-contain" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--forest-green)]">
                  Radio Live
                </p>
                <p className="text-sm text-[color:var(--muted-foreground)]">
                  Escucha la radio online o mira la transmision en YouTube.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <RadioPlayButton
                streamUrl={radioStreamUrl || DEFAULT_RADIO_STREAM_URL}
                className="px-4 py-2.5"
                label="Escuchar radio"
              />
              <a
                href={radioUrl || DEFAULT_RADIO_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-4 py-2.5 text-sm font-semibold text-[color:var(--forest-green)]"
              >
                Ir a la radio
              </a>
              <a
                href={youtubeUrl || DEFAULT_YOUTUBE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#ff0000] px-4 py-2.5 text-sm font-semibold text-white"
              >
                <PlayCircle className="h-4 w-4" />
                Ver YouTube live
              </a>
            </div>
          </div>
        </div>

        <div className="mt-4 hidden min-[980px]:block">
          <nav className="flex flex-wrap items-center gap-3">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full font-semibold uppercase tracking-[0.24em] transition-all duration-300",
                  isCompact ? "px-4 py-2.5 text-[13px]" : "px-5 py-3 text-sm",
                  index === 0
                    ? "bg-[color:var(--lake-blue)] !text-white shadow-[0_10px_30px_rgba(15,77,134,0.2)]"
                    : "bg-white/85 text-[color:var(--muted-foreground)] shadow-sm ring-1 ring-black/5 hover:bg-white",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {isOpen ? (
          <div className="mt-4 rounded-[28px] bg-white/88 p-4 shadow-[0_18px_50px_rgba(15,77,134,0.1)] ring-1 ring-black/5 min-[980px]:hidden">
            <div className="mb-4">
              <SearchForm />
            </div>
            <div className="mb-4 flex items-center gap-2">
              {socialLinks.map((item) => (
                <a
                  key={`mobile-${item.label}`}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--line)] bg-white text-[color:var(--lake-blue)]"
                >
                  {item.icon}
                </a>
              ))}
            </div>
            <nav className="grid gap-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition",
                    index === 0
                      ? "bg-[color:var(--lake-blue)] text-white"
                      : "bg-[color:var(--mist)] text-[color:var(--ink)]",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
