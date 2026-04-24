import { AdminShell } from "@/components/admin/admin-shell";
import { saveSettingsAction } from "@/lib/actions";
import { requireAdmin } from "@/lib/auth";
import { getAdminDashboardData } from "@/lib/queries";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const { settings, embeds } = await getAdminDashboardData();
  const radio = embeds.find((embed) => embed.type === "RADIO");
  const youtube = embeds.find((embed) => embed.type === "YOUTUBE");

  return (
    <AdminShell title="Configuracion general">
      <form action={saveSettingsAction} className="space-y-6">
        <section className="grid gap-6 rounded-[28px] border border-[color:var(--line)] bg-white p-6 shadow-[0_18px_50px_rgba(18,59,103,0.08)] lg:grid-cols-2">
          <input name="siteName" defaultValue={settings.siteName} placeholder="Nombre del sitio" className="rounded-2xl border border-[color:var(--line)] px-4 py-3" />
          <input name="tagline" defaultValue={settings.tagline} placeholder="Tagline" className="rounded-2xl border border-[color:var(--line)] px-4 py-3" />
          <input name="location" defaultValue={settings.location} placeholder="Ubicacion" className="rounded-2xl border border-[color:var(--line)] px-4 py-3 lg:col-span-2" />
          <input name="whatsappNumber" defaultValue={settings.whatsappNumber || ""} placeholder="WhatsApp" className="rounded-2xl border border-[color:var(--line)] px-4 py-3" />
          <input name="contactEmail" defaultValue={settings.contactEmail || ""} placeholder="Email de contacto" className="rounded-2xl border border-[color:var(--line)] px-4 py-3" />
          <input name="facebookUrl" defaultValue={settings.facebookUrl || ""} placeholder="Facebook URL" className="rounded-2xl border border-[color:var(--line)] px-4 py-3" />
          <input name="instagramUrl" defaultValue={settings.instagramUrl || ""} placeholder="Instagram URL" className="rounded-2xl border border-[color:var(--line)] px-4 py-3" />
          <input name="youtubeUrl" defaultValue={settings.youtubeUrl || ""} placeholder="YouTube URL" className="rounded-2xl border border-[color:var(--line)] px-4 py-3 lg:col-span-2" />
          <input name="contactAddress" defaultValue={settings.contactAddress || ""} placeholder="Direccion" className="rounded-2xl border border-[color:var(--line)] px-4 py-3 lg:col-span-2" />
          <textarea name="footerText" defaultValue={settings.footerText || ""} placeholder="Texto del footer" rows={4} className="rounded-2xl border border-[color:var(--line)] px-4 py-3 lg:col-span-2" />
        </section>

        <section className="grid gap-6 rounded-[28px] border border-[color:var(--line)] bg-white p-6 shadow-[0_18px_50px_rgba(18,59,103,0.08)] lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="font-serif text-3xl text-[color:var(--ink)]">Radio en vivo</h3>
            <input name="radioTitle" defaultValue={radio?.title || "Radio en vivo"} className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3" />
            <input name="radioUrl" defaultValue={radio?.url || ""} placeholder="URL de radio" className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3" />
            <textarea name="radioIframe" defaultValue={radio?.iframe || ""} rows={5} placeholder="<iframe ...>" className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3" />
            <label className="flex items-center gap-3 text-sm text-[color:var(--ink)]">
              <input type="checkbox" name="radioIsActive" defaultChecked={radio?.isActive} />
              Activar modulo de radio
            </label>
          </div>
          <div className="space-y-4">
            <h3 className="font-serif text-3xl text-[color:var(--ink)]">YouTube en vivo</h3>
            <input name="youtubeTitle" defaultValue={youtube?.title || "YouTube en vivo"} className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3" />
            <input name="youtubeStreamUrl" defaultValue={youtube?.url || ""} placeholder="URL de YouTube" className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3" />
            <textarea name="youtubeIframe" defaultValue={youtube?.iframe || ""} rows={5} placeholder="<iframe ...>" className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3" />
            <label className="flex items-center gap-3 text-sm text-[color:var(--ink)]">
              <input type="checkbox" name="youtubeIsActive" defaultChecked={youtube?.isActive} />
              Activar modulo de YouTube
            </label>
          </div>
        </section>

        <button className="rounded-full bg-[color:var(--lake-blue)] px-5 py-3 font-semibold text-white">
          Guardar configuracion
        </button>
      </form>
    </AdminShell>
  );
}
