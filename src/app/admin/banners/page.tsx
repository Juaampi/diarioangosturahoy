import { AdminShell } from "@/components/admin/admin-shell";
import { BannerImagesField } from "@/components/admin/banner-images-field";
import { BannerCarousel } from "@/components/site/banner-carousel";
import { deleteBannerAction, saveBannerAction } from "@/lib/actions";
import { BANNER_POSITIONS, MAX_BANNER_SLIDES } from "@/lib/constants";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseBannerSlides } from "@/lib/banner-slides";
import { cn } from "@/lib/utils";

type AdminBannerRecord = {
  id: string;
  title: string;
  imageUrl: string;
  slideUrls: string | null;
  slidesJson: string | null;
  link: string | null;
  position: string;
  displayOrder: number;
  isActive: boolean;
  startsAt: Date | null;
  endsAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const BANNER_POSITION_LABELS = Object.fromEntries(BANNER_POSITIONS.map((position) => [position.value, position.label]));
const BANNER_POSITION_HELP: Record<string, { homeArea: string; description: string; tone: string }> = {
  HOME_TOP: {
    homeArea: "Debajo de la noticia principal",
    description: "Son las 2 publicidades horizontales que aparecen primero, justo abajo del bloque principal del home.",
    tone: "bg-[#eef6ff] text-[#16507a]",
  },
  HOME_BETWEEN_SECTIONS: {
    homeArea: "Entre Locales y Regionales",
    description: "Son las 2 publicidades horizontales nuevas que van despues de la seccion Locales y antes de Regionales.",
    tone: "bg-[#e9f7ee] text-[#1f7a46]",
  },
  HOME_MIDDLE: {
    homeArea: "Despues de Regionales",
    description: "Es el bloque grande de espacios publicitarios que queda entre Regionales y Nacionales en el home.",
    tone: "bg-[#fff3e8] text-[#9a4d14]",
  },
  SIDEBAR: {
    homeArea: "Columna derecha",
    description: "Son los banners verticales o compactos que se muestran en el sidebar del home.",
    tone: "bg-[#f3efff] text-[#5d3ea8]",
  },
  ARTICLE_BOTTOM: {
    homeArea: "Debajo de cada noticia",
    description: "Aparecen al final de la nota individual, no en el home.",
    tone: "bg-[#f4f4f5] text-[#52525b]",
  },
  CATEGORY_TOP: {
    homeArea: "Arriba de categorias",
    description: "Se muestran en el encabezado de las paginas de categoria, no en el home.",
    tone: "bg-[#eef2f7] text-[#3b556f]",
  },
};

export default async function AdminBannersPage() {
  await requireAdmin();
  const banners = (await prisma.banner.findMany({
    orderBy: [{ position: "asc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
  })) as AdminBannerRecord[];
  const groupedBanners = BANNER_POSITIONS.map((position) => ({
    ...position,
    items: banners.filter((banner) => banner.position === position.value),
    help: BANNER_POSITION_HELP[position.value] || null,
  }));

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
              Cada banner puede funcionar como slider automatico de hasta {MAX_BANNER_SLIDES} imagenes y se administra
              desde este mismo panel.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {BANNER_POSITIONS.map((position) => {
              const help = BANNER_POSITION_HELP[position.value];

              return (
                <div
                  key={position.value}
                  className="rounded-[22px] border border-[color:var(--line)] bg-[color:var(--mist)]/20 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--lake-blue)]">
                    {position.label}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[color:var(--ink)]">
                    {help?.homeArea || "Otra ubicacion"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--muted-foreground)]">
                    {help?.description || "Ubicacion disponible para mostrar banners en otra parte del sitio."}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <select name="position" className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3">
              {BANNER_POSITIONS.map((position) => (
                <option key={position.value} value={position.value}>
                  {position.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="displayOrder"
              min="0"
              step="1"
              placeholder="Orden visual"
              className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
            />
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
              Ahora estan agrupados por ubicacion real del sitio para que se entienda mejor donde aparece cada banner.
            </p>
          </div>

          <div className="space-y-5">
            {groupedBanners.map((group) => (
              <section key={group.value} className="space-y-4 rounded-[24px] border border-[color:var(--line)] bg-[color:var(--mist)]/16 p-4">
                <div className="flex flex-col gap-3 rounded-[20px] border border-[color:var(--line)] bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--lake-blue)]">
                      {group.label}
                    </p>
                    <h4 className="mt-2 font-serif text-2xl text-[color:var(--ink)]">
                      {group.help?.homeArea || "Ubicacion del sitio"}
                    </h4>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[color:var(--muted-foreground)]">
                      {group.help?.description || "Bloque disponible para otras zonas del sitio."}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn("rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]", group.help?.tone || "bg-[color:var(--mist)] text-[color:var(--lake-blue)]")}>
                      {group.items.length} cargados
                    </span>
                  </div>
                </div>

                {group.items.length ? (
                  <div className="space-y-5">
                    {group.items.map((banner) => {
                      const slides = parseBannerSlides(banner);
                      const positionLabel = BANNER_POSITION_LABELS[banner.position] || banner.position;
                      const toneClass = BANNER_POSITION_HELP[banner.position]?.tone || "bg-[color:var(--mist)] text-[color:var(--lake-blue)]";

                      return (
                        <form
                          key={banner.id}
                          action={saveBannerAction}
                          className="rounded-[24px] border border-[color:var(--line)] bg-white p-5"
                        >
                          <input type="hidden" name="id" value={banner.id} />

                          <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
                            <div className="space-y-3">
                              <div className="overflow-hidden rounded-2xl border border-[color:var(--line)] bg-white">
                                <BannerCarousel banner={banner} showMeta />
                              </div>
                              <div className="grid gap-3 rounded-2xl border border-[color:var(--line)] bg-white p-4 text-sm">
                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-[color:var(--muted-foreground)]">Posicion</span>
                                  <span className={cn("rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]", toneClass)}>
                                    {positionLabel}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-[color:var(--muted-foreground)]">Estado</span>
                                  <span className="font-semibold text-[color:var(--ink)]">
                                    {banner.isActive ? "Activo" : "Inactivo"}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-[color:var(--muted-foreground)]">Orden</span>
                                  <span className="font-semibold text-[color:var(--ink)]">#{banner.displayOrder}</span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-[color:var(--muted-foreground)]">Imagenes</span>
                                  <span className="font-semibold text-[color:var(--ink)]">
                                    {slides.length}/{MAX_BANNER_SLIDES}
                                  </span>
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
                                <input
                                  type="number"
                                  name="displayOrder"
                                  min="0"
                                  step="1"
                                  defaultValue={banner.displayOrder}
                                  className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-4 py-3"
                                />
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
                ) : (
                  <div className="rounded-[20px] border border-dashed border-[color:var(--line)] bg-white p-5 text-sm text-[color:var(--muted-foreground)]">
                    Todavia no hay banners cargados en esta ubicacion.
                  </div>
                )}
              </section>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
