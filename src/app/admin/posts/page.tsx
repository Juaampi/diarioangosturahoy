import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { PostDisplayControls } from "@/components/admin/post-display-controls";
import { deletePostAction } from "@/lib/actions";
import { requireAdmin } from "@/lib/auth";
import { getAdminDashboardData } from "@/lib/queries";

const CATEGORY_ORDER = ["locales", "regionales", "nacionales", "internacionales", "deporte"];

export default async function AdminPostsPage() {
  await requireAdmin();
  const { posts } = await getAdminDashboardData();

  const groupedPosts = posts.reduce<
    Record<
      string,
      {
        title: string;
        slug: string;
        posts: typeof posts;
      }
    >
  >((accumulator, post) => {
    const slug = post.category?.slug || "sin-categoria";
    const title = post.category?.name || "Sin categoria";

    if (!accumulator[slug]) {
      accumulator[slug] = { title, slug, posts: [] };
    }

    accumulator[slug].posts.push(post);
    return accumulator;
  }, {});

  const orderedGroups = Object.values(groupedPosts).sort((left, right) => {
    const leftIndex = CATEGORY_ORDER.indexOf(left.slug);
    const rightIndex = CATEGORY_ORDER.indexOf(right.slug);

    return (leftIndex === -1 ? 999 : leftIndex) - (rightIndex === -1 ? 999 : rightIndex);
  });

  return (
    <AdminShell title="Gestion de noticias">
      <div className="space-y-6">
        <div className="rounded-[28px] border border-[color:var(--line)] bg-white p-6 shadow-[0_18px_50px_rgba(18,59,103,0.08)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <h2 className="font-serif text-3xl text-[color:var(--ink)]">Orden editorial del home</h2>
              <p className="max-w-3xl text-sm text-[color:var(--muted-foreground)]">
                El numero mas alto sale primero en la portada. Las noticias nuevas toman automaticamente el siguiente numero disponible, y desde aca podes corregir el orden o elegir una sola noticia principal.
              </p>
            </div>
            <Link
              href="/admin/posts/new"
              className="rounded-full bg-[color:var(--lake-blue)] px-4 py-3 text-sm font-semibold text-white"
            >
              Nueva noticia
            </Link>
          </div>
        </div>

        {orderedGroups.map((group) => (
          <section
            key={group.slug}
            className="rounded-[28px] border border-[color:var(--line)] bg-white p-6 shadow-[0_18px_50px_rgba(18,59,103,0.08)]"
          >
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--forest-green)]">
                  Categoria
                </p>
                <h3 className="mt-2 font-serif text-3xl text-[color:var(--ink)]">{group.title}</h3>
              </div>
              <span className="rounded-full bg-[color:var(--mist)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--lake-blue)]">
                {group.posts.length} noticias
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[1120px] table-fixed text-left text-sm">
                <colgroup>
                  <col className="w-[220px]" />
                  <col className="w-[420px]" />
                  <col className="w-[120px]" />
                  <col className="w-[120px]" />
                  <col className="w-[140px]" />
                  <col className="w-[140px]" />
                </colgroup>
                <thead className="text-[color:var(--muted-foreground)]">
                  <tr>
                    <th className="pb-3">Orden home</th>
                    <th className="pb-3">Titulo</th>
                    <th className="pb-3">Principal</th>
                    <th className="pb-3">Estado</th>
                    <th className="pb-3">Fuente</th>
                    <th className="pb-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {group.posts.map((post) => (
                    <tr key={post.id} className="border-t border-[color:var(--line)] align-top">
                      <td className="py-4 pr-4">
                        <PostDisplayControls id={post.id} homeOrder={post.homeOrder} isMain={post.isMain} />
                      </td>
                      <td className="py-4 pr-4">
                        <div className="space-y-1">
                          <p className="line-clamp-3 font-semibold leading-7 text-[color:var(--ink)]">{post.title}</p>
                          <p className="text-xs text-[color:var(--muted-foreground)]">Orden actual: {post.homeOrder}</p>
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        {post.isMain ? (
                          <span className="rounded-full bg-[color:var(--lake-blue)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                            Principal
                          </span>
                        ) : (
                          <span className="text-xs text-[color:var(--muted-foreground)]">No</span>
                        )}
                      </td>
                      <td className="py-4 pr-4">
                        <span className="whitespace-nowrap">{post.status}</span>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="whitespace-nowrap">
                          {post.sourceType === "NEWSAPI" ? post.sourceName || "NewsAPI" : "Manual"}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex min-w-[120px] flex-col gap-3">
                          <Link href={`/admin/posts/${post.id}`} className="font-semibold text-[color:var(--lake-blue)]">
                            Editar
                          </Link>
                          <form action={deletePostAction}>
                            <input type="hidden" name="id" value={post.id} />
                            <button className="font-semibold text-red-600">Eliminar</button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </AdminShell>
  );
}
