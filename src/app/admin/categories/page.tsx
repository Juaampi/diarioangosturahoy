import { AdminShell } from "@/components/admin/admin-shell";
import { deleteCategoryAction, saveCategoryAction } from "@/lib/actions";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <AdminShell title="Categorias">
      <section className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <form
          action={saveCategoryAction}
          className="rounded-[28px] border border-[color:var(--line)] bg-white p-6 shadow-[0_18px_50px_rgba(18,59,103,0.08)]"
        >
          <h3 className="font-serif text-3xl text-[color:var(--ink)]">Nueva categoria</h3>
          <div className="mt-5 space-y-4">
            <input
              name="name"
              placeholder="Nombre"
              className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
            />
            <textarea
              name="description"
              placeholder="Descripcion"
              rows={4}
              className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
            />
            <button className="rounded-full bg-[color:var(--lake-blue)] px-5 py-3 font-semibold text-white">
              Guardar categoria
            </button>
          </div>
        </form>

        <div className="rounded-[28px] border border-[color:var(--line)] bg-white p-6 shadow-[0_18px_50px_rgba(18,59,103,0.08)]">
          <h3 className="font-serif text-3xl text-[color:var(--ink)]">Categorias existentes</h3>
          <div className="mt-5 space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="rounded-2xl border border-[color:var(--line)] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[color:var(--ink)]">{category.name}</p>
                    <p className="text-sm text-[color:var(--muted-foreground)]">{category.slug}</p>
                  </div>
                  <form action={deleteCategoryAction}>
                    <input type="hidden" name="id" value={category.id} />
                    <button className="text-sm font-semibold text-red-600">Eliminar</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
