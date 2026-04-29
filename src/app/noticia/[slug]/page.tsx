import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BannerSlot } from "@/components/site/banner-slot";
import { PostCard } from "@/components/site/post-card";
import { getPublishedPostBySlug } from "@/lib/queries";
import { absoluteUrl, formatDate, paragraphize, toOpenGraphImageUrl } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPublishedPostBySlug(slug);

  if (!data) {
    return { title: "Noticia no encontrada" };
  }

  const articleUrl = absoluteUrl(`/noticia/${slug}`);
  const imageUrl = toOpenGraphImageUrl(data.post.featuredImageUrl);
  const description = data.post.excerpt || data.post.title;

  return {
    title: data.post.title,
    description,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: data.post.title,
      description,
      url: articleUrl,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: data.post.title,
              width: 1200,
              height: 630,
            },
          ]
        : [],
      type: "article",
      publishedTime: data.post.publishedAt?.toISOString(),
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title: data.post.title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPublishedPostBySlug(slug);

  if (!data) notFound();

  const { post, relatedPosts, articleBottomBanners } = data;
  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(
    `${post.title} ${absoluteUrl(`/noticia/${post.slug}`)}`,
  )}`;

  return (
    <article className="mx-auto max-w-7xl space-y-10 px-4 py-8 lg:px-6">
      <header className="rounded-[32px] border border-[color:var(--line)] bg-white p-8 shadow-[0_18px_50px_rgba(18,59,103,0.08)]">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--muted-foreground)]">
          {post.category ? <Link href={`/categoria/${post.category.slug}`}>{post.category.name}</Link> : null}
          <span>{formatDate(post.publishedAt)}</span>
          {post.sourceName ? <span>{post.sourceName}</span> : null}
        </div>
        <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-tight text-balance text-[color:var(--ink)]">
          {post.title}
        </h1>
        {post.excerpt ? (
          <p className="mt-5 max-w-3xl text-xl leading-9 text-[color:var(--muted-foreground)]">
            {post.excerpt}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(absoluteUrl(`/noticia/${post.slug}`))}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[color:var(--line)] px-4 py-2 text-sm font-semibold text-[color:var(--lake-blue)]"
          >
            Compartir
          </a>
          <a
            href={whatsappShare}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[color:var(--line)] px-4 py-2 text-sm font-semibold text-[color:var(--forest-green)]"
          >
            WhatsApp
          </a>
        </div>
      </header>

      {post.featuredImageUrl ? (
        <div
          className="h-[420px] rounded-[32px] border border-[color:var(--line)] bg-cover bg-center shadow-[0_18px_50px_rgba(18,59,103,0.08)]"
          style={{ backgroundImage: `url(${post.featuredImageUrl})` }}
        />
      ) : null}

      <div className="grid gap-10 lg:grid-cols-[1.8fr_1fr]">
        <section className="rounded-[32px] border border-[color:var(--line)] bg-white p-8 shadow-[0_18px_50px_rgba(18,59,103,0.08)]">
          <div className="story-content max-w-none text-lg">
            {paragraphize(post.content).map((paragraph, index) => (
              <p key={`${post.id}-${index}`}>{paragraph}</p>
            ))}
          </div>
          {post.tags.length ? (
            <div className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.tagId}
                  className="rounded-full bg-[color:var(--mist)] px-3 py-2 text-sm text-[color:var(--lake-blue)]"
                >
                  #{tag.tag.name}
                </span>
              ))}
            </div>
          ) : null}
        </section>

        <aside className="space-y-6">
          <div className="rounded-[28px] border border-[color:var(--line)] bg-white p-6 shadow-[0_18px_50px_rgba(18,59,103,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--muted-foreground)]">
              Datos de la nota
            </p>
            <div className="mt-4 space-y-3 text-sm text-[color:var(--muted-foreground)]">
              <p>Autor: {post.author || post.sourceName || "Redaccion"}</p>
              <p>Estado: {post.status}</p>
              {post.externalUrl ? (
                <a href={post.externalUrl} target="_blank" rel="noreferrer" className="text-[color:var(--lake-blue)]">
                  Ver fuente original
                </a>
              ) : null}
            </div>
          </div>
          <BannerSlot banners={articleBottomBanners} className="space-y-4" />
        </aside>
      </div>

      {relatedPosts.length ? (
        <section className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--muted-foreground)]">
              Relacionadas
            </p>
            <h2 className="mt-2 font-serif text-4xl text-[color:var(--ink)]">Mas para seguir leyendo</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <PostCard key={relatedPost.id} post={relatedPost} compact />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
