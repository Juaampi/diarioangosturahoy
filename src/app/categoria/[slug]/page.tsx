import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BannerSlot } from "@/components/site/banner-slot";
import { PostCard } from "@/components/site/post-card";
import { getActiveBanners, getPublishedPostsByCategory } from "@/lib/queries";
import { absoluteUrl } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getPublishedPostsByCategory(slug);

  if (!category) {
    return { title: "Categoria no encontrada" };
  }

  return {
    title: category.name,
    description: category.description || `Noticias de ${category.name} en Diario Angostura Hoy.`,
    openGraph: {
      title: `${category.name} | Diario Angostura Hoy`,
      description: category.description || `Cobertura de ${category.name}.`,
      url: absoluteUrl(`/categoria/${category.slug}`),
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [category, banners] = await Promise.all([
    getPublishedPostsByCategory(slug),
    getActiveBanners("CATEGORY_TOP"),
  ]);

  if (!category) notFound();

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 lg:px-6">
      <section className="rounded-[32px] border border-[color:var(--line)] bg-white p-8 shadow-[0_18px_50px_rgba(18,59,103,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--muted-foreground)]">
          Seccion
        </p>
        <h1 className="mt-2 font-serif text-5xl text-[color:var(--ink)]">{category.name}</h1>
        <p className="mt-4 max-w-3xl text-lg text-[color:var(--muted-foreground)]">
          {category.description || `Noticias de ${category.name} seleccionadas para la portada editorial.`}
        </p>
      </section>
      <BannerSlot banners={banners} className="grid gap-4 md:grid-cols-2" />
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {category.posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>
    </div>
  );
}
