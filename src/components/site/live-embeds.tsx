import {
  DEFAULT_FACEBOOK_URL,
  DEFAULT_RADIO_URL,
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
  const youtubeEmbed = activeEmbeds.find((embed) => embed.type === "YOUTUBE");
  const radioEmbed = activeEmbeds.find((embed) => embed.type === "RADIO");

  if (!activeEmbeds.length) {
    return (
      <section className="grid gap-6 xl:grid-cols-[1.65fr_0.95fr]">
        <article className="overflow-hidden rounded-[32px] border border-[color:var(--line)] bg-white p-5 shadow-[0_18px_50px_rgba(18,59,103,0.08)]">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--forest-green)]">
                YouTube en vivo
              </p>
              <h3 className="mt-2 font-serif text-3xl text-[color:var(--ink)]">Streaming de prueba</h3>
            </div>
            <a
              href={DEFAULT_YOUTUBE_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[#ff0000] px-4 py-2 text-sm font-semibold text-white"
            >
              Abrir YouTube
            </a>
          </div>
          <div className="overflow-hidden rounded-[24px] border border-[color:var(--line)] bg-black shadow-[0_18px_40px_rgba(0,0,0,0.2)]">
            <iframe
              src={DEFAULT_YOUTUBE_EMBED}
              title="Video demo Villa La Angostura"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="aspect-video w-full"
            />
          </div>
        </article>

        <article className="flex flex-col justify-between rounded-[32px] border border-[color:var(--line)] bg-white p-6 shadow-[0_18px_50px_rgba(18,59,103,0.08)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--forest-green)]">
              Radio en vivo
            </p>
            <h3 className="mt-2 font-serif text-3xl text-[color:var(--ink)]">Escuchar online</h3>
            <p className="mt-4 text-sm leading-7 text-[color:var(--muted-foreground)]">
              Este modulo esta listo para la radio live. Por ahora mostramos una version de demo para visualizar como va a convivir con el streaming de YouTube.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <a
              href={DEFAULT_RADIO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[color:var(--forest-green)] px-5 py-3 text-sm font-semibold text-white"
            >
              Escuchar radio
            </a>
            <a
              href={facebookUrl || DEFAULT_FACEBOOK_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--line)] px-5 py-3 text-sm font-semibold text-[color:var(--lake-blue)]"
            >
              Ver Facebook
            </a>
          </div>
        </article>
      </section>
    );
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[1.65fr_0.95fr]">
      <article className="overflow-hidden rounded-[32px] border border-[color:var(--line)] bg-white p-5 shadow-[0_18px_50px_rgba(18,59,103,0.08)]">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--forest-green)]">
              YouTube en vivo
            </p>
            <h3 className="mt-2 font-serif text-3xl text-[color:var(--ink)]">
              {youtubeEmbed?.title || "Streaming en vivo"}
            </h3>
          </div>
          <a
            href={youtubeEmbed?.url || DEFAULT_YOUTUBE_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#ff0000] px-4 py-2 text-sm font-semibold text-white"
          >
            Abrir YouTube
          </a>
        </div>
        {youtubeEmbed?.iframe ? (
          <div
            className="prose max-w-none overflow-hidden rounded-[24px] border border-[color:var(--line)] shadow-[0_18px_40px_rgba(0,0,0,0.2)]"
            dangerouslySetInnerHTML={iframeMarkup(youtubeEmbed.iframe)}
          />
        ) : (
          <div className="overflow-hidden rounded-[24px] border border-[color:var(--line)] bg-black shadow-[0_18px_40px_rgba(0,0,0,0.2)]">
            <iframe
              src={DEFAULT_YOUTUBE_EMBED}
              title="Video demo Villa La Angostura"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="aspect-video w-full"
            />
          </div>
        )}
      </article>

      <article className="flex flex-col justify-between rounded-[32px] border border-[color:var(--line)] bg-white p-6 shadow-[0_18px_50px_rgba(18,59,103,0.08)]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--forest-green)]">
            Radio en vivo
          </p>
          <h3 className="mt-2 font-serif text-3xl text-[color:var(--ink)]">
            {radioEmbed?.title || "Escuchar online"}
          </h3>
          <p className="mt-4 text-sm leading-7 text-[color:var(--muted-foreground)]">
            Acceso rapido a la radio online y a la transmision social del medio. Este bloque esta pensado para convivir con el vivo principal de YouTube.
          </p>
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <a
            href={radioEmbed?.url || DEFAULT_RADIO_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-[color:var(--forest-green)] px-5 py-3 text-sm font-semibold text-white"
          >
            Escuchar radio
          </a>
          <a
            href={facebookUrl || DEFAULT_FACEBOOK_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-[color:var(--line)] px-5 py-3 text-sm font-semibold text-[color:var(--lake-blue)]"
          >
            Ver Facebook
          </a>
          <a
            href="/admin/settings"
            className="inline-flex items-center justify-center rounded-full border border-[color:var(--line)] px-5 py-3 text-sm font-semibold text-[color:var(--muted-foreground)]"
          >
            Configurar vivos
          </a>
        </div>
      </article>
    </section>
  );
}
