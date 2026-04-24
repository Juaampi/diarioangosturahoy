import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { deletePostAction } from "@/lib/actions";
import { requireAdmin } from "@/lib/auth";
import { getAdminDashboardData } from "@/lib/queries";

export default async function AdminPostsPage() {
  await requireAdmin();
  const { posts } = await getAdminDashboardData();

  return (
    <AdminShell title="Gestion de noticias">
      <div className="rounded-[28px] border border-[color:var(--line)] bg-white p-6 shadow-[0_18px_50px_rgba(18,59,103,0.08)]">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-[color:var(--muted-foreground)]">
            Crea, edita, archiva o elimina por soft delete.
          </p>
          <Link
            href="/admin/posts/new"
            className="rounded-full bg-[color:var(--lake-blue)] px-4 py-3 text-sm font-semibold text-white"
          >
            Nueva noticia
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-[color:var(--muted-foreground)]">
              <tr>
                <th className="pb-3">Titulo</th>
                <th className="pb-3">Categoria</th>
                <th className="pb-3">Estado</th>
                <th className="pb-3">Fuente</th>
                <th className="pb-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-t border-[color:var(--line)]">
                  <td className="py-4 font-semibold text-[color:var(--ink)]">{post.title}</td>
                  <td className="py-4">{post.category?.name || "Sin categoria"}</td>
                  <td className="py-4">{post.status}</td>
                  <td className="py-4">{post.sourceType === "NEWSAPI" ? post.sourceName || "NewsAPI" : "Manual"}</td>
                  <td className="py-4">
                    <div className="flex flex-wrap gap-3">
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
      </div>
    </AdminShell>
  );
}
