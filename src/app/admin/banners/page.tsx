import Image from "next/image";

import { AdminShell } from "@/components/admin/admin-shell";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { deleteBannerAction, saveBannerAction } from "@/lib/actions";
import { BANNER_POSITIONS } from "@/lib/constants";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminBannersPage() {
  await requireAdmin();
  const banners = await prisma.banner.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <AdminShell title="Banners y publicidad">
      <section className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <form
          action={saveBannerAction}
          className="space-y-4 rounded-[28px] border border-[color:var(--line)] bg-white p-6 shadow-[0_18px_50px_rgba(18,59,103,0.08)]"
        >
          <h3 className="font-serif text-3xl text-[color:var(--ink)]">Nuevo banner</h3>
          <input
            name="title"
            placeholder="Titulo"
            className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
          />
          <ImageUploadField name="imageUrl" label="Imagen del banner" />
          <input
            name="link"
            placeholder="https://anunciante.com"
            className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
          />
          <select name="position" className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3">
            {BANNER_POSITIONS.map((position) => (
              <option key={position.value} value={position.value}>
                {position.label}
              </option>
            ))}
          </select>
          <div className="grid gap-4 md:grid-cols-2">
            <input type="datetime-local" name="startsAt" className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3" />
            <input type="datetime-local" name="endsAt" className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3" />
          </div>
          <label className="flex items-center gap-3 text-sm text-[color:var(--ink)]">
            <input type="checkbox" name="isActive" defaultChecked />
            Banner activo
          </label>
          <button className="rounded-full bg-[color:var(--lake-blue)] px-5 py-3 font-semibold text-white">
            Guardar banner
          </button>
        </form>

        <div className="rounded-[28px] border border-[color:var(--line)] bg-white p-6 shadow-[0_18px_50px_rgba(18,59,103,0.08)]">
          <h3 className="font-serif text-3xl text-[color:var(--ink)]">Banners cargados</h3>
          <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
            Cada bloque muestra claramente su posicion y puede actualizarse desde aca mismo.
          </p>
          <div className="mt-5 space-y-4">
            {banners.map((banner) => (
              <form
                key={banner.id}
                action={saveBannerAction}
                className="space-y-4 rounded-2xl border border-[color:var(--line)] p-4"
              >
                <input type="hidden" name="id" value={banner.id} />
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[color:var(--ink)]">{banner.title}</p>
                    <p className="text-sm text-[color:var(--muted-foreground)]">
                      Posicion: {banner.position} · {banner.isActive ? "Activo" : "Inactivo"}
                    </p>
                  </div>
                  <span className="rounded-full bg-[color:var(--mist)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--lake-blue)]">
                    {banner.position}
                  </span>
                </div>
                <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-2xl border border-[color:var(--line)] bg-white p-3">
                  <Image src={banner.imageUrl} alt={banner.title} fill className="object-contain p-2" />
                </div>
                <div className="grid gap-4">
                  <input
                    name="title"
                    defaultValue={banner.title}
                    className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
                  />
                  <input
                    name="imageUrl"
                    defaultValue={banner.imageUrl}
                    className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
                  />
                  <input
                    name="link"
                    defaultValue={banner.link || ""}
                    className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
                  />
                  <select
                    name="position"
                    defaultValue={banner.position}
                    className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
                  >
                    {BANNER_POSITIONS.map((position) => (
                      <option key={position.value} value={position.value}>
                        {position.label}
                      </option>
                    ))}
                  </select>
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      type="datetime-local"
                      name="startsAt"
                      defaultValue={banner.startsAt ? new Date(banner.startsAt).toISOString().slice(0, 16) : ""}
                      className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
                    />
                    <input
                      type="datetime-local"
                      name="endsAt"
                      defaultValue={banner.endsAt ? new Date(banner.endsAt).toISOString().slice(0, 16) : ""}
                      className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
                    />
                  </div>
                  <label className="flex items-center gap-3 text-sm text-[color:var(--ink)]">
                    <input type="checkbox" name="isActive" defaultChecked={banner.isActive} />
                    Banner activo
                  </label>
                </div>
                <div className="flex flex-wrap gap-4">
                  <button className="rounded-full bg-[color:var(--lake-blue)] px-5 py-3 text-sm font-semibold text-white">
                    Actualizar banner
                  </button>
                  <button
                    formAction={deleteBannerAction}
                    className="rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </form>
            ))}
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
