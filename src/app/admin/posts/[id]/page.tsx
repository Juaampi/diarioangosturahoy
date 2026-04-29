import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { savePostAction } from "@/lib/actions";
import { POST_STATUS_OPTIONS } from "@/lib/constants";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const [post, categories] = await Promise.all([
    prisma.post.findUnique({
      where: { id },
      include: { tags: { include: { tag: true } } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!post) notFound();

  return (
    <AdminShell title="Editar noticia">
      <form action={savePostAction} className="space-y-6">
        <input type="hidden" name="id" value={post.id} />
        <section className="grid gap-6 rounded-[28px] border border-[color:var(--line)] bg-white p-6 shadow-[0_18px_50px_rgba(18,59,103,0.08)] lg:grid-cols-2">
          <div className="space-y-4 lg:col-span-2">
            <label className="block text-sm font-semibold text-[color:var(--ink)]">Titulo</label>
            <input
              name="title"
              required
              defaultValue={post.title}
              className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[color:var(--ink)]">Bajada</label>
            <textarea
              name="excerpt"
              rows={3}
              defaultValue={post.excerpt || ""}
              className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
            />
          </div>
          <div>
            <ImageUploadField name="featuredImageUrl" defaultValue={post.featuredImageUrl} />
          </div>
          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-[color:var(--ink)]">Contenido</label>
            <textarea
              name="content"
              rows={12}
              defaultValue={post.content || ""}
              className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[color:var(--ink)]">Categoria</label>
            <select
              name="categoryId"
              defaultValue={post.categoryId || ""}
              className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
            >
              <option value="">Sin categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[color:var(--ink)]">Estado</label>
            <select
              name="status"
              defaultValue={post.status}
              className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
            >
              {POST_STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[color:var(--ink)]">Autor</label>
            <input
              name="author"
              defaultValue={post.author || ""}
              className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[color:var(--ink)]">Etiquetas</label>
            <input
              name="tags"
              defaultValue={post.tags.map((tag) => tag.tag.name).join(", ")}
              className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[color:var(--ink)]">Fecha de publicacion</label>
            <input
              type="datetime-local"
              name="publishedAt"
              defaultValue={post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : ""}
              className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[color:var(--ink)]">Orden en home</label>
            <input
              type="number"
              name="homeOrder"
              defaultValue={post.homeOrder}
              min={0}
              className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
            />
            <p className="mt-2 text-xs text-[color:var(--muted-foreground)]">
              A mayor numero, mas arriba aparece en la portada.
            </p>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm text-[color:var(--ink)]">
              <input type="checkbox" name="isMain" defaultChecked={post.isMain} />
              Marcar como noticia principal
            </label>
            <label className="flex items-center gap-3 text-sm text-[color:var(--ink)]">
              <input type="checkbox" name="isFeatured" defaultChecked={post.isFeatured} />
              Marcar como destacada
            </label>
          </div>
          <div className="grid gap-4 lg:col-span-2 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[color:var(--ink)]">Tipo de fuente</label>
              <select
                name="sourceType"
                defaultValue={post.sourceType}
                className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
              >
                <option value="MANUAL">Manual</option>
                <option value="NEWSAPI">NewsAPI</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[color:var(--ink)]">Nombre de fuente</label>
              <input
                name="sourceName"
                defaultValue={post.sourceName || ""}
                className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
              />
            </div>
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[color:var(--ink)]">URL externa</label>
              <input
                name="externalUrl"
                defaultValue={post.externalUrl || ""}
                className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
              />
            </div>
          </div>
        </section>
        <button className="rounded-full bg-[color:var(--lake-blue)] px-5 py-3 font-semibold text-white">
          Guardar cambios
        </button>
      </form>
    </AdminShell>
  );
}
