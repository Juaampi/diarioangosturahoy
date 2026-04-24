import type { Metadata } from "next";
import { Merriweather, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/site/site-shell";
import { DEFAULT_FACEBOOK_URL, DEFAULT_WHATSAPP_NUMBER } from "@/lib/constants";
import { getLayoutData } from "@/lib/queries";
import { absoluteUrl } from "@/lib/utils";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: "Diario Angostura Hoy | Diario Digital",
    template: "%s | Diario Angostura Hoy",
  },
  description:
    "Portal periodistico de Villa La Angostura con noticias locales, nacionales, internacionales, deporte y agenda en vivo.",
  openGraph: {
    title: "Diario Angostura Hoy",
    description:
      "Noticias locales de Villa La Angostura con mirada patagonica, secciones editoriales y panel de administracion.",
    url: absoluteUrl("/"),
    siteName: "Diario Angostura Hoy",
    locale: "es_AR",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { settings, categories } = await getLayoutData();
  const mergedSettings = {
    ...settings,
    whatsappNumber: settings.whatsappNumber || DEFAULT_WHATSAPP_NUMBER,
    facebookUrl: settings.facebookUrl || DEFAULT_FACEBOOK_URL,
  };

  return (
    <html
      lang="es-AR"
      className={`${sourceSans.variable} ${merriweather.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[color:var(--paper)] text-[color:var(--ink)]">
        <SiteShell settings={mergedSettings} categories={categories}>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
