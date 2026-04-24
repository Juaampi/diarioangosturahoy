import {
  DEFAULT_FACEBOOK_URL,
  DEFAULT_YOUTUBE_EMBED,
  DEFAULT_YOUTUBE_URL,
} from "@/lib/constants";

type LiveEmbed = {
  id: string;
  title: string;
  url: string | null;
  iframe: string | null;
  isActive: boolean;
  type: "RADIO" | "YOUTUBE";
};

function iframeMarkup(markup?: string | null) {
  return { __html: markup || "" };
}

export function LiveEmbeds({
  embeds,
  facebookUrl,
}: {
  embeds: LiveEmbed[];
  facebookUrl?: string | null;
}) {
  const activeEmbeds = embeds.filter((embed) => embed.isActive);

  if (!activeEmbeds.length) {
    return (
      <section className="grid gap-6 lg:grid-cols-2">
        <article className="overflow-hidden rounded-[28px] border border-[color:var(--line)] bg-white p-6 shadow-[0_18px_50px_rgba(18,59,103,0.08)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
                En vivo
              </p>
              <h3 className="mt-2 font-serif text-2xl text-[color:var(--ink)]">Radio en vivo</h3>
            </div>
            <span className="rounded-full bg-[color:var(--warm-accent)]/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--forest-green)]">
              Streaming
            </span>
          </div>
          <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">
            Este espacio ya quedo reservado para la transmision en vivo de la radio por YouTube. Mientras tanto, dejamos un video demo de Villa La Angostura para mostrar como queda el modulo.
          </p>
          <div className="mt-5 overflow-hidden rounded-[20px] border border-[color:var(--line)] bg-black">
            <iframe
              src={DEFAULT_YOUTUBE_EMBED}
              title="Video demo Villa La Angostura"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="aspect-video w-full"
            />
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={DEFAULT_YOUTUBE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full bg-[color:var(--forest-green)] px-5 py-3 text-sm font-semibold text-white"
            >
              Ver demo en YouTube
            </a>
            <a
              href={facebookUrl || DEFAULT_FACEBOOK_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full bg-[color:var(--lake-blue)] px-5 py-3 text-sm font-semibold text-white"
            >
              Ver Facebook
            </a>
            <a
              href="/admin/settings"
              className="inline-flex rounded-full border border-[color:var(--line)] px-5 py-3 text-sm font-semibold text-[color:var(--lake-blue)]"
            >
              Configurar YouTube
            </a>
          </div>
        </article>
      </section>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      {activeEmbeds.map((embed) => (
        <article
          key={embed.id}
          className="overflow-hidden rounded-[28px] border border-[color:var(--line)] bg-white p-6 shadow-[0_18px_50px_rgba(18,59,103,0.08)]"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
                En vivo
              </p>
              <h3 className="mt-2 font-serif text-2xl text-[color:var(--ink)]">{embed.title}</h3>
            </div>
            <span className="rounded-full bg-[color:var(--warm-accent)]/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--forest-green)]">
              {embed.type === "RADIO" ? "Radio" : "YouTube"}
            </span>
          </div>
          {embed.iframe ? (
            <div
              className="prose max-w-none overflow-hidden rounded-[20px] border border-[color:var(--line)]"
              dangerouslySetInnerHTML={iframeMarkup(embed.iframe)}
            />
          ) : embed.url ? (
            <a
              href={embed.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full bg-[color:var(--lake-blue)] px-5 py-3 text-sm font-semibold text-white"
            >
              Abrir transmision
            </a>
          ) : (
            <p className="text-sm text-[color:var(--muted-foreground)]">
              Carga la URL o el iframe desde el panel de administracion.
            </p>
          )}
        </article>
      ))}
    </section>
  );
}
