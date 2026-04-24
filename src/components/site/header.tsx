"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { SearchForm } from "@/components/site/search-form";
import { cn } from "@/lib/utils";

type HeaderProps = {
  categories: { id: number; name: string; slug: string }[];
  siteName: string;
  tagline: string;
};

export function Header({ categories, siteName }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    function onScroll() {
      setIsCompact(window.scrollY > 40);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { href: "/", label: "Inicio" },
    ...categories.map((category) => ({
      href: `/categoria/${category.slug}`,
      label: category.name,
    })),
    { href: "/noticias-externas", label: "Externas" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-[#eaeaea]/95 backdrop-blur-xl">
      <div
        className={cn(
          "mx-auto max-w-[1600px] px-4 transition-all duration-300 lg:px-6 2xl:px-10",
          isCompact ? "py-2" : "py-3",
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between gap-4 rounded-[32px] bg-white/62 shadow-[0_14px_50px_rgba(15,77,134,0.08)] ring-1 ring-black/5 transition-all duration-300 lg:px-6",
            isCompact ? "px-3 py-2" : "px-4 py-4",
          )}
        >
          <Link href="/" className="flex min-w-0 items-center">
            <div
              className={cn(
                "overflow-hidden rounded-[18px] bg-[#eaeaea] shadow-[inset_0_0_0_1px_rgba(17,40,63,0.06)] transition-all duration-300",
                isCompact ? "px-2 py-1" : "px-2.5 py-1.5",
              )}
            >
              <Image
                src="/logo.jpg"
                alt={`${siteName} logo`}
                width={1344}
                height={756}
                className={cn(
                  "w-auto object-contain transition-all duration-300",
                  isCompact ? "h-[42px] sm:h-[54px] lg:h-[64px]" : "h-[56px] sm:h-[72px] lg:h-[100px]",
                )}
                priority
              />
            </div>
          </Link>

          <div className="hidden min-[980px]:flex min-[980px]:flex-1 min-[980px]:items-center min-[980px]:justify-end min-[980px]:gap-4">
            <div className={cn("w-full transition-all duration-300", isCompact ? "max-w-[520px]" : "max-w-[640px]")}>
              <SearchForm />
            </div>
            <Link
              href="/noticias-externas"
              className={cn(
                "rounded-full border border-[color:var(--cold-sky)] bg-white font-semibold text-[color:var(--lake-blue)] shadow-sm transition hover:bg-[color:var(--mist)]",
                isCompact ? "px-4 py-2.5 text-sm" : "px-5 py-3 text-sm",
              )}
            >
              Externas
            </Link>
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

        <div className={cn("hidden min-[980px]:block", isCompact ? "mt-2" : "mt-4")}>
          <nav className="flex flex-wrap items-center gap-3">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full font-semibold uppercase tracking-[0.24em] transition-all duration-300",
                  isCompact ? "px-4 py-2.5 text-[13px]" : "px-5 py-3 text-sm",
                  index === 0
                    ? "bg-[color:var(--lake-blue)] text-white shadow-[0_10px_30px_rgba(15,77,134,0.2)]"
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
