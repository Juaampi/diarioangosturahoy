"use client";

import { usePathname } from "next/navigation";

import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { WhatsAppFab } from "@/components/site/whatsapp-fab";

type SiteShellProps = {
  children: React.ReactNode;
  settings: {
    siteName: string;
    tagline: string;
    location: string;
    contactEmail: string | null;
    footerText: string | null;
    whatsappNumber: string | null;
    facebookUrl: string | null;
    instagramUrl: string | null;
    youtubeUrl: string | null;
  };
  categories: { id: number; name: string; slug: string }[];
};

export function SiteShell({ children, settings, categories }: SiteShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen">
      <Header
        categories={categories}
        siteName={settings.siteName}
        tagline={settings.tagline}
        radioUrl={settings.facebookUrl}
        youtubeUrl={settings.youtubeUrl}
      />
      <main>{children}</main>
      <Footer
        siteName={settings.siteName}
        location={settings.location}
        contactEmail={settings.contactEmail}
        footerText={settings.footerText}
        socialLinks={{
          facebookUrl: settings.facebookUrl,
          instagramUrl: settings.instagramUrl,
          youtubeUrl: settings.youtubeUrl,
        }}
      />
      <WhatsAppFab number={settings.whatsappNumber} />
    </div>
  );
}
