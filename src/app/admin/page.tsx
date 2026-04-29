import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { getAdminDashboardData } from "@/lib/queries";

export default async function AdminPage() {
  await requireAdmin();
  const { posts, banners, categories, settings, embeds } = await getAdminDashboardData();
  const categoryNameById = new Map(categories.map((category) => [category.id, category.name]));

  const cards = [
    { label: "Noticias", value: posts.length },
    { label: "Categorias", value: categories.length },
    { label: "Banners", value: banners.length },
    { label: "Embeds activos", value: embeds.filter((embed) => embed.isActive).length },
  ];

  return (
    <AdminShell title="Resumen general">
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.label}
            className="rounded-[28px] border border-[color:var(--line)] bg-white p-6 shadow-[0_18px_50px_rgba(18,59,103,0.08)]"
          >
            <p className="text-sm text-[color:var(--muted-foreground)]">{card.label}</p>
            <p className="mt-3 font-serif text-5xl text-[color:var(--ink)]">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[28px] border border-[color:var(--line)] bg-white p-6 shadow-[0_18px_50px_rgba(18,59,103,0.08)]">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-serif text-3xl text-[color:var(--ink)]">Ultimas noticias</h3>
            <Link href="/admin/posts/new" className="text-sm font-semibold text-[color:var(--lake-blue)]">
              Nueva noticia
            </Link>
          </div>
          <div className="space-y-4">
            {posts.slice(0, 6).map((post) => (
              <Link
                key={post.id}
                href={`/admin/posts/${post.id}`}
                className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] px-4 py-4"
              >
                <div>
                  <p className="font-semibold text-[color:var(--ink)]">{post.title}</p>
                  <p className="text-sm text-[color:var(--muted-foreground)]">
                    {categoryNameById.get(post.categoryId ?? -1) || "Sin categoria"} · {post.status}
                  </p>
                </div>
                <span className="text-sm font-semibold text-[color:var(--lake-blue)]">Editar</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-[color:var(--line)] bg-white p-6 shadow-[0_18px_50px_rgba(18,59,103,0.08)]">
            <h3 className="font-serif text-3xl text-[color:var(--ink)]">Configuracion actual</h3>
            <div className="mt-4 space-y-3 text-sm text-[color:var(--muted-foreground)]">
              <p>Nombre: {settings.siteName}</p>
              <p>Tagline: {settings.tagline}</p>
              <p>WhatsApp: {settings.whatsappNumber || "No configurado"}</p>
              <p>Email: {settings.contactEmail || "No configurado"}</p>
            </div>
          </div>
          <div className="rounded-[28px] border border-[color:var(--line)] bg-[color:var(--deep-lake)] p-6 text-white shadow-[0_18px_50px_rgba(18,59,103,0.2)]">
            <h3 className="font-serif text-3xl">Importador NewsAPI</h3>
            <p className="mt-3 text-sm leading-7 text-white/75">
              Consulta, revisa y trae noticias nacionales o internacionales con estado inicial en borrador o revision.
            </p>
            <Link
              href="/admin/import"
              className="mt-5 inline-flex rounded-full bg-white px-4 py-3 text-sm font-semibold text-[color:var(--deep-lake)]"
            >
              Abrir importador
            </Link>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
