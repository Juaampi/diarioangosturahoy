import { AdminShell } from "@/components/admin/admin-shell";
import { importExternalPostsAction } from "@/lib/actions";
import { NEWS_IMPORT_TYPES, POST_STATUS_OPTIONS } from "@/lib/constants";
import { requireAdmin } from "@/lib/auth";
import { getExternalNews } from "@/lib/newsapi";
import { prisma } from "@/lib/prisma";

export default async function AdminImportPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: "nacionales" | "internacionales"; q?: string; imported?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const tipo = params.tipo === "internacionales" ? "internacionales" : "nacionales";
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

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
    <AdminShell title="Importador NewsAPI">
      <section className="rounded-[28px] border border-[color:var(--line)] bg-white p-6 shadow-[0_18px_50px_rgba(18,59,103,0.08)]">
        <form className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
          <input
            type="text"
            name="q"
            defaultValue={params.q || ""}
            placeholder="Buscar por palabra clave"
            className="rounded-2xl border border-[color:var(--line)] px-4 py-3"
          />
          <select
            name="tipo"
            defaultValue={tipo}
            className="rounded-2xl border border-[color:var(--line)] px-4 py-3"
          >
            {NEWS_IMPORT_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <button className="rounded-2xl bg-[color:var(--lake-blue)] px-4 py-3 font-semibold text-white">
            Consultar NewsAPI
          </button>
        </form>
        <p className="mt-4 text-sm leading-7 text-[color:var(--muted-foreground)]">
          Se consultan hasta 100 resultados por ingreso, segun el maximo permitido por NewsAPI. Las notas importadas quedan en borrador o revision hasta que el admin las edite y publique.
        </p>
        {params.imported ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {params.imported} noticias importadas.
          </div>
        ) : null}
        {error ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        ) : null}
      </section>

      <form action={importExternalPostsAction} className="space-y-6">
        <section className="grid gap-4 rounded-[28px] border border-[color:var(--line)] bg-white p-6 shadow-[0_18px_50px_rgba(18,59,103,0.08)] md:grid-cols-2 lg:grid-cols-3">
          <select name="categoryId" className="rounded-2xl border border-[color:var(--line)] px-4 py-3">
            <option value="">Sin categoria asignada</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select name="status" defaultValue="PENDING_REVIEW" className="rounded-2xl border border-[color:var(--line)] px-4 py-3">
            {POST_STATUS_OPTIONS.filter((item) => item.value !== "DELETED").map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <button className="rounded-2xl bg-[color:var(--forest-green)] px-4 py-3 font-semibold text-white">
            Importar seleccionadas
          </button>
        </section>

        <section className="grid gap-5">
          {articles.map((article) => (
            <label
              key={article.externalUrl}
              className="grid gap-4 rounded-[28px] border border-[color:var(--line)] bg-white p-6 shadow-[0_18px_50px_rgba(18,59,103,0.08)] lg:grid-cols-[auto_1fr]"
            >
              <input type="checkbox" name="selectedArticles" value={JSON.stringify(article)} className="mt-1 h-5 w-5" />
              <div className="space-y-3">
                <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
                  <span>{article.sourceName}</span>
                  <span>{tipo}</span>
                </div>
                <h3 className="font-serif text-3xl text-[color:var(--ink)]">{article.title}</h3>
                <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">{article.excerpt}</p>
                <div className="flex flex-wrap gap-3 text-sm text-[color:var(--muted-foreground)]">
                  <span>{article.author || "Sin autor"}</span>
                  <span>{new Intl.DateTimeFormat("es-AR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(article.publishedAt))}</span>
                </div>
                <a href={article.externalUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[color:var(--lake-blue)]">
                  Ver fuente original
                </a>
              </div>
            </label>
          ))}
        </section>
      </form>
    </AdminShell>
  );
}
