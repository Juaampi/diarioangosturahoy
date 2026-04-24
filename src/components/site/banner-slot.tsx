import Image from "next/image";

type Banner = {
  id: string;
  title: string;
  imageUrl: string;
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
        const content = (
          <div className="overflow-hidden rounded-[24px] border border-[color:var(--line)] bg-white shadow-[0_14px_40px_rgba(18,59,103,0.08)]">
            <div className="relative h-36">
              <Image src={banner.imageUrl} alt={banner.title} fill className="object-cover" />
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold text-[color:var(--ink)]">{banner.title}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
                Espacio publicitario
              </p>
            </div>
          </div>
        );

        return banner.link ? (
          <a key={banner.id} href={banner.link} target="_blank" rel="noreferrer" className="block">
            {content}
          </a>
        ) : (
          <div key={banner.id}>{content}</div>
        );
      })}
    </div>
  );
}
