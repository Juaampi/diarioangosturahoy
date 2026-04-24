import type { Metadata } from "next";

import { PostCard } from "@/components/site/post-card";
import { searchPublishedPosts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Buscar noticias",
  description: "Buscador editorial por titulo, contenido, categoria y etiquetas.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() || "";
  const results = query ? await searchPublishedPosts(query) : [];

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 lg:px-6">
      <section className="rounded-[32px] border border-[color:var(--line)] bg-white p-8 shadow-[0_18px_50px_rgba(18,59,103,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--muted-foreground)]">
          Buscador
        </p>
        <h1 className="mt-2 font-serif text-5xl text-[color:var(--ink)]">
          {query ? `Resultados para "${query}"` : "Buscar noticias"}
        </h1>
        <p className="mt-4 text-lg text-[color:var(--muted-foreground)]">
          {query
            ? `${results.length} resultados encontrados entre noticias publicadas.`
            : "Usa el buscador superior para consultar por titulo, contenido, categoria o etiquetas."}
        </p>
      </section>
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {results.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>
    </div>
  );
}
