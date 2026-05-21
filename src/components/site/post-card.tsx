import Image from "next/image";
import Link from "next/link";

import { formatDate } from "@/lib/utils";

type PostCardProps = {
  post: {
    title: string;
    slug: string;
    excerpt: string | null;
    featuredImageUrl: string | null;
    publishedAt: Date | null;
    sourceName: string | null;
    category?: { name: string; slug: string } | null;
  };
  compact?: boolean;
  compactMode?: "default" | "tight";
  externalBadge?: string;
};

export function PostCard({ post, compact = false, compactMode = "default", externalBadge }: PostCardProps) {
  const isTightCompact = compact && compactMode === "tight";

  return (
    <article className="group h-full overflow-hidden rounded-[28px] border border-[color:var(--line)] bg-white shadow-[0_18px_50px_rgba(18,59,103,0.08)]">
      <Link href={`/noticia/${post.slug}`} className="flex h-full flex-col">
        {post.featuredImageUrl ? (
          <div
            className={`relative overflow-hidden bg-[color:var(--mist)]/35 ${
              isTightCompact ? "aspect-[16/8.5]" : "aspect-[16/10]"
            }`}
          >
            <Image
              src={post.featuredImageUrl}
              alt={post.title}
              fill
              className={`transition duration-500 group-hover:scale-[1.02] ${
                isTightCompact ? "object-cover" : "object-contain p-3"
              }`}
            />
          </div>
        ) : (
          <div
            className={`${isTightCompact ? "h-36" : compact ? "h-44" : "h-56"} flex items-end bg-[image:linear-gradient(140deg,var(--lake-blue),var(--cold-sky))] p-6`}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
              Diario Angostura Hoy
            </span>
          </div>
        )}
        <div className={`flex flex-1 flex-col ${isTightCompact ? "space-y-2 p-4" : "space-y-3 p-5"}`}>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
            {post.category ? (
              <span className="rounded-full bg-[color:var(--mist)] px-3 py-1 text-[color:var(--lake-blue)]">
                {post.category.name}
              </span>
            ) : null}
            {externalBadge ? (
              <span className="rounded-full bg-[color:var(--warm-accent)]/20 px-3 py-1 text-[color:var(--forest-green)]">
                {externalBadge}
              </span>
            ) : null}
          </div>
          <h3
            className={`font-serif leading-tight text-[color:var(--ink)] transition group-hover:text-[color:var(--lake-blue)] ${
              isTightCompact ? "line-clamp-3 text-[1.65rem]" : "text-xl"
            }`}
          >
            {post.title}
          </h3>
          {post.excerpt ? (
            <p
              className={`text-[color:var(--muted-foreground)] ${
                isTightCompact ? "line-clamp-3 text-[0.95rem] leading-6" : "text-sm leading-7"
              }`}
            >
              {post.excerpt}
            </p>
          ) : null}
          <div className="mt-auto flex flex-wrap items-center gap-3 pt-2 text-xs text-[color:var(--muted-foreground)]">
            <span>{formatDate(post.publishedAt)}</span>
            {post.sourceName ? <span>{post.sourceName}</span> : null}
          </div>
        </div>
      </Link>
    </article>
  );
}
