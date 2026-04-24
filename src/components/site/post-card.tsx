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
  externalBadge?: string;
};

export function PostCard({ post, compact = false, externalBadge }: PostCardProps) {
  return (
    <article className="group h-full overflow-hidden rounded-[28px] border border-[color:var(--line)] bg-white shadow-[0_18px_50px_rgba(18,59,103,0.08)]">
      <Link href={`/noticia/${post.slug}`} className="flex h-full flex-col">
        {post.featuredImageUrl ? (
          <div className={compact ? "relative h-44" : "relative h-56"}>
            <Image
              src={post.featuredImageUrl}
              alt={post.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          </div>
        ) : (
          <div
            className={`${compact ? "h-44" : "h-56"} flex items-end bg-[image:linear-gradient(140deg,var(--lake-blue),var(--cold-sky))] p-6`}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
              Diario Angostura Hoy
            </span>
          </div>
        )}
        <div className="flex flex-1 flex-col space-y-3 p-5">
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
          <h3 className="font-serif text-xl leading-tight text-[color:var(--ink)] transition group-hover:text-[color:var(--lake-blue)]">
            {post.title}
          </h3>
          {post.excerpt ? (
            <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">{post.excerpt}</p>
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
