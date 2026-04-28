import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import slugify from "slugify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toSlug(value: string) {
  return slugify(value, {
    lower: true,
    strict: true,
    trim: true,
    locale: "es",
  });
}

export function absoluteUrl(pathname = "/") {
  const baseUrl = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.SITE_URL,
    process.env.URL,
    process.env.DEPLOY_PRIME_URL,
  ]
    .find((value) => Boolean(value && value.trim()))
    ?.replace(/\/$/, "") || "https://diarioangosturahoy.com.ar";

  return pathname.startsWith("/") ? `${baseUrl}${pathname}` : `${baseUrl}/${pathname}`;
}

export function toAbsoluteMediaUrl(value?: string | null) {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  return absoluteUrl(value.startsWith("/") ? value : `/${value}`);
}

export function toOpenGraphImageUrl(value?: string | null) {
  const imageUrl = toAbsoluteMediaUrl(value);
  if (!imageUrl) return undefined;

  if (imageUrl.includes("res.cloudinary.com/") && imageUrl.includes("/upload/")) {
    return imageUrl.replace(
      "/upload/",
      "/upload/f_auto,q_auto,c_fill,g_auto,w_1200,h_630/",
    );
  }

  return imageUrl;
}

export function formatDate(date?: Date | string | null) {
  if (!date) return "";

  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date(date));
}

export function truncate(value: string | null | undefined, max = 180) {
  if (!value) return "";
  if (value.length <= max) return value;
  return `${value.slice(0, max).trim()}...`;
}

export function stripTrailingNewsSource(title: string) {
  return title.replace(/\s*-\s*[^-]+$/, "").trim();
}

export function paragraphize(content?: string | null) {
  if (!content) return [];
  return content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
