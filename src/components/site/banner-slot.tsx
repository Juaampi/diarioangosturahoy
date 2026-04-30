import { BannerCarousel } from "@/components/site/banner-carousel";

type Banner = {
  id: string;
  title: string;
  imageUrl: string;
  slideUrls?: string | null;
  slidesJson?: string | null;
  link: string | null;
};

export function BannerSlot({
  banners,
  className = "",
}: {
  banners: Banner[];
  className?: string;
}) {
  if (!banners.length) return null;

  return (
    <div className={className}>
      {banners.map((banner) => {
        return <BannerCarousel key={banner.id} banner={banner} />;
      })}
    </div>
  );
}
