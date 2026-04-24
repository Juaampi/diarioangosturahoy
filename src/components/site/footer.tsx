import { DEFAULT_FACEBOOK_URL } from "@/lib/constants";

type FooterProps = {
  footerText?: string | null;
  siteName: string;
  location: string;
  contactEmail?: string | null;
  socialLinks: {
    facebookUrl?: string | null;
    instagramUrl?: string | null;
    youtubeUrl?: string | null;
  };
};

export function Footer({ footerText, siteName, location, contactEmail, socialLinks }: FooterProps) {
  const links = [
    { label: "Facebook", href: socialLinks.facebookUrl || DEFAULT_FACEBOOK_URL },
    { label: "Instagram", href: socialLinks.instagramUrl },
    { label: "YouTube", href: socialLinks.youtubeUrl },
  ].filter((link) => link.href);

  return (
    <footer className="mt-16 border-t border-[color:var(--line)] bg-[color:var(--ink)] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1.6fr_1fr_1fr] lg:px-6">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Medio local</p>
          <h2 className="font-serif text-3xl">{siteName}</h2>
          <p className="max-w-2xl text-sm leading-7 text-white/75">
            {footerText || "Noticias, comunidad y agenda de Villa La Angostura con una mirada periodistica moderna y cercana."}
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Contacto</p>
          <p className="text-sm text-white/75">{location}</p>
          {contactEmail ? <a href={`mailto:${contactEmail}`}>{contactEmail}</a> : null}
        </div>
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Redes</p>
          <div className="flex flex-wrap gap-3">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href!}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/85"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
