import { AdminShell } from "@/components/admin/admin-shell";
import { BannerImagesField } from "@/components/admin/banner-images-field";
import { BannerCarousel } from "@/components/site/banner-carousel";
import { deleteBannerAction, saveBannerAction } from "@/lib/actions";
import { BANNER_POSITIONS } from "@/lib/constants";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseBannerSlides } from "@/lib/banner-slides";

type AdminBannerRecord = {
  id: string;
  title: string;
  imageUrl: string;
  slideUrls: string | null;
  slidesJson: string | null;
  link: string | null;
  position: string;
  isActive: boolean;
  startsAt: Date | null;
  endsAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export default async function AdminBannersPage() {
  await requireAdmin();
  const banners = (await prisma.banner.findMany({
    orderBy: [{ position: "asc" }, { createdAt: "desc" }],
  })) as AdminBannerRecord[];

  return (
    <AdminShell title="Banners y publicidad">
      <div className="space-y-6">
        <form
          action={saveBannerAction}
          className="space-y-5 rounded-[28px] border border-[color:var(--line)] bg-white p-6 shadow-[0_18px_50px_rgba(18,59,103,0.08)]"
        >
          <div className="space-y-2">
            <h3 className="font-serif text-3xl text-[color:var(--ink)]">Nuevo banner</h3>
            <p className="text-sm text-[color:var(--muted-foreground)]">
              Cada banner puede funcionar como slider automatico de hasta 10 imagenes y se administra desde este mismo panel.
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <select name="position" className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3">
              {BANNER_POSITIONS.map((position) => (
                <option key={position.value} value={position.value}>
                  {position.label}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-3 rounded-2xl border border-[color:var(--line)] px-4 py-3 text-sm text-[color:var(--ink)]">
              <input type="checkbox" name="isActive" defaultChecked />
              Banner activo
            </label>
            <input
              type="datetime-local"
              name="startsAt"
              className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
            />
            <input
              type="datetime-local"
              name="endsAt"
              className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
            />
          </div>

          <BannerImagesField name="slidesJson" />

          <button className="rounded-full bg-[color:var(--lake-blue)] px-5 py-3 font-semibold text-white">
            Guardar banner
          </button>
        </form>

        <section className="rounded-[28px] border border-[color:var(--line)] bg-white p-6 shadow-[0_18px_50px_rgba(18,59,103,0.08)]">
          <div className="mb-5 space-y-2">
            <h3 className="font-serif text-3xl text-[color:var(--ink)]">Banners cargados</h3>
            <p className="text-sm text-[color:var(--muted-foreground)]">
              Vista ordenada por posicion. Cada fila permite editar el slider, el enlace y el estado del banner.
            </p>
          </div>

          <div className="space-y-5">
            {banners.map((banner) => {
              const slides = parseBannerSlides(banner);

              return (
                <form
                  key={banner.id}
                  action={saveBannerAction}
                  className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--mist)]/25 p-5"
                >
                  <input type="hidden" name="id" value={banner.id} />

                  <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
                    <div className="space-y-3">
                      <div className="overflow-hidden rounded-2xl border border-[color:var(--line)] bg-white">
                        <BannerCarousel banner={banner} />
                      </div>
                      <div className="grid gap-3 rounded-2xl border border-[color:var(--line)] bg-white p-4 text-sm">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[color:var(--muted-foreground)]">Posicion</span>
                          <span className="rounded-full bg-[color:var(--mist)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--lake-blue)]">
                            {banner.position}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[color:var(--muted-foreground)]">Estado</span>
                          <span className="font-semibold text-[color:var(--ink)]">
                            {banner.isActive ? "Activo" : "Inactivo"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[color:var(--muted-foreground)]">Imagenes</span>
                          <span className="font-semibold text-[color:var(--ink)]">{slides.length}/10</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-4 xl:grid-cols-2">
                        <select
                          name="position"
                          defaultValue={banner.position}
                          className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-4 py-3"
                        >
                          {BANNER_POSITIONS.map((position) => (
                            <option key={position.value} value={position.value}>
                              {position.label}
                            </option>
                          ))}
                        </select>
                        <label className="flex items-center gap-3 rounded-2xl border border-[color:var(--line)] bg-white px-4 py-3 text-sm text-[color:var(--ink)]">
                          <input type="checkbox" name="isActive" defaultChecked={banner.isActive} />
                          Banner activo
                        </label>
                        <input
                          type="datetime-local"
                          name="startsAt"
                          defaultValue={banner.startsAt ? new Date(banner.startsAt).toISOString().slice(0, 16) : ""}
                          className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-4 py-3"
                        />
                        <input
                          type="datetime-local"
                          name="endsAt"
                          defaultValue={banner.endsAt ? new Date(banner.endsAt).toISOString().slice(0, 16) : ""}
                          className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-4 py-3"
                        />
                      </div>

                      <BannerImagesField
                        name="slidesJson"
                        defaultTitle={banner.title}
                        defaultImageUrl={banner.imageUrl}
                        defaultLink={banner.link}
                        defaultSlidesJson={banner.slidesJson}
                      />

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
                    </div>
                  </div>
                </form>
              );
            })}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
