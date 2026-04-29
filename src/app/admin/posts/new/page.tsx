import { AdminShell } from "@/components/admin/admin-shell";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { POST_STATUS_OPTIONS } from "@/lib/constants";
import { savePostAction } from "@/lib/actions";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function NewPostPage() {
  await requireAdmin();
  const [categories, homeOrderAggregate] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.post.aggregate({
      _max: { homeOrder: true },
      where: { deletedAt: null },
    }),
  ]);
  const suggestedHomeOrder = (homeOrderAggregate._max.homeOrder ?? 0) + 1;

  return (
    <AdminShell title="Nueva noticia">
      <form action={savePostAction} className="space-y-6">
        <section className="grid gap-6 rounded-[28px] border border-[color:var(--line)] bg-white p-6 shadow-[0_18px_50px_rgba(18,59,103,0.08)] lg:grid-cols-2">
          <div className="space-y-4 lg:col-span-2">
            <label className="block text-sm font-semibold text-[color:var(--ink)]">Titulo</label>
            <input name="title" required className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[color:var(--ink)]">Bajada</label>
            <textarea name="excerpt" rows={3} className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3" />
          </div>
          <div>
            <ImageUploadField name="featuredImageUrl" />
          </div>
          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-[color:var(--ink)]">Contenido</label>
            <textarea name="content" rows={12} className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[color:var(--ink)]">Categoria</label>
            <select name="categoryId" className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3">
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
            <select name="status" defaultValue="DRAFT" className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3">
              {POST_STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[color:var(--ink)]">Autor o fuente</label>
            <input name="author" className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[color:var(--ink)]">Etiquetas</label>
            <input
              name="tags"
              placeholder="patagonia, turismo, comunidad"
              className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[color:var(--ink)]">Fecha de publicacion</label>
            <input type="datetime-local" name="publishedAt" className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[color:var(--ink)]">Orden en home</label>
            <input
              type="number"
              name="homeOrder"
              defaultValue={suggestedHomeOrder}
              min={0}
              className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
            />
            <p className="mt-2 text-xs text-[color:var(--muted-foreground)]">
              Numero sugerido para salir primero: {suggestedHomeOrder}. A mayor numero, mas arriba aparece en la portada.
            </p>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm text-[color:var(--ink)]">
              <input type="checkbox" name="isMain" />
              Marcar como noticia principal
            </label>
            <label className="flex items-center gap-3 text-sm text-[color:var(--ink)]">
              <input type="checkbox" name="isFeatured" />
              Marcar como destacada
            </label>
          </div>
          <input type="hidden" name="sourceType" value="MANUAL" />
        </section>
        <button className="rounded-full bg-[color:var(--lake-blue)] px-5 py-3 font-semibold text-white">
          Guardar noticia
        </button>
      </form>
    </AdminShell>
  );
}
