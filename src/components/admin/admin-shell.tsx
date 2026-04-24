import Link from "next/link";

import { logoutAction } from "@/lib/actions";

const navItems = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/posts", label: "Noticias" },
  { href: "/admin/import", label: "Importador" },
  { href: "/admin/categories", label: "Categorias" },
  { href: "/admin/banners", label: "Banners" },
  { href: "/admin/settings", label: "Configuracion" },
];

export function AdminShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="min-h-screen bg-[color:var(--paper)]">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_1fr] lg:px-6">
        <aside className="rounded-[28px] bg-[color:var(--ink)] p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
            Diario Angostura Hoy
          </p>
          <h1 className="mt-3 font-serif text-3xl">Panel admin</h1>
          <nav className="mt-8 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-2xl px-4 py-3 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <form action={logoutAction} className="mt-8">
            <button className="w-full rounded-2xl border border-white/20 px-4 py-3 text-sm font-semibold">
              Cerrar sesion
            </button>
          </form>
        </aside>
        <main className="space-y-6">
          <div className="rounded-[28px] border border-[color:var(--line)] bg-white p-6 shadow-[0_18px_50px_rgba(18,59,103,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--muted-foreground)]">
              Administracion
            </p>
            <h2 className="mt-2 font-serif text-4xl text-[color:var(--ink)]">{title}</h2>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
