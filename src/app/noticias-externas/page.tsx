import type { Metadata } from "next";
import Image from "next/image";

import { getExternalNews } from "@/lib/newsapi";

export const metadata: Metadata = {
  title: "Noticias externas",
  description: "Cobertura externa consultada desde NewsAPI para revision editorial.",
};

export default async function ExternalNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: "nacionales" | "internacionales"; q?: string }>;
}) {
  const params = await searchParams;
  const tipo = params.tipo === "internacionales" ? "internacionales" : "nacionales";

  let articles: Awaited<ReturnType<typeof getExternalNews>> = [];
  let error = "";

  try {
    articles = await getExternalNews({
      mode: tipo,
      query: params.q,
      pageSize: 100,
    });
  } catch (issue) {
    error = issue instanceof Error ? issue.message : "No se pudo consultar NewsAPI.";
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 lg:px-6">
      <section className="rounded-[32px] border border-[color:var(--line)] bg-white p-8 shadow-[0_18px_50px_rgba(18,59,103,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--muted-foreground)]">
          Fuentes externas
        </p>
        <h1 className="mt-2 font-serif text-5xl text-[color:var(--ink)]">Noticias externas</h1>
        <p className="mt-4 max-w-3xl text-lg text-[color:var(--muted-foreground)]">
          Esta seccion consulta NewsAPI al ingresar y muestra contenido de fuentes externas. No se publica automaticamente en el portal editorial hasta que se revise desde el panel admin.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/noticias-externas?tipo=nacionales"
            className={`rounded-full px-4 py-2 text-sm font-semibold ${tipo === "nacionales" ? "bg-[color:var(--lake-blue)] text-white" : "border border-[color:var(--line)] text-[color:var(--lake-blue)]"}`}
          >
            Nacionales
          </a>
          <a
            href="/noticias-externas?tipo=internacionales"
            className={`rounded-full px-4 py-2 text-sm font-semibold ${tipo === "internacionales" ? "bg-[color:var(--lake-blue)] text-white" : "border border-[color:var(--line)] text-[color:var(--lake-blue)]"}`}
          >
            Internacionales
          </a>
        </div>
      </section>

      {error ? (
        <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-6 text-amber-900">{error}</div>
      ) : null}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => (
          <article
            key={article.externalUrl}
            className="overflow-hidden rounded-[28px] border border-[color:var(--line)] bg-white shadow-[0_18px_50px_rgba(18,59,103,0.08)]"
          >
            <div className="border-b border-[color:var(--line)] bg-[color:var(--mist)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--lake-blue)]">
              Fuente externa
            </div>
            <div className="space-y-4 p-5">
              <div className="flex flex-wrap gap-3 text-xs text-[color:var(--muted-foreground)]">
                <span>{article.sourceName}</span>
                <span>{new Intl.DateTimeFormat("es-AR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(article.publishedAt))}</span>
              </div>
              <h2 className="font-serif text-2xl text-[color:var(--ink)]">{article.title}</h2>
              <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">{article.excerpt}</p>
              {article.imageUrl ? (
                <div className="relative h-48 overflow-hidden rounded-[20px]">
                  <Image src={article.imageUrl} alt={article.title} fill className="object-cover" />
                </div>
              ) : null}
              <a
                href={article.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border border-[color:var(--line)] px-4 py-2 text-sm font-semibold text-[color:var(--lake-blue)]"
              >
                Ver fuente original
              </a>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
