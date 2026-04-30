export type BannerSlide = {
  title: string;
  imageUrl: string;
  link?: string | null;
};

type BannerLike = {
  title: string;
  imageUrl: string;
  link?: string | null;
  slideUrls?: string | null;
  slidesJson?: string | null;
};

export function parseBannerSlides(banner: BannerLike): BannerSlide[] {
  const baseSlide: BannerSlide = {
    title: banner.title,
    imageUrl: banner.imageUrl,
    link: banner.link || null,
  };

  if (banner.slidesJson) {
    try {
      const parsed = JSON.parse(banner.slidesJson) as BannerSlide[];
      const normalized = parsed
        .map((slide) => ({
          title: String(slide?.title || "").trim(),
          imageUrl: String(slide?.imageUrl || "").trim(),
          link: typeof slide?.link === "string" ? slide.link.trim() : null,
        }))
        .filter((slide) => slide.imageUrl.length)
        .slice(0, 10);

      if (normalized.length) {
        return normalized;
      }
    } catch {}
  }

  const extraSlides = (banner.slideUrls || "")
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean)
    .map((imageUrl) => ({
      title: banner.title,
      imageUrl,
      link: banner.link || null,
    }));

  return [baseSlide, ...extraSlides].slice(0, 10);
}
