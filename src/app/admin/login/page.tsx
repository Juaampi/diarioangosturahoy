import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/auth";
import { loginAction } from "@/lib/actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--paper)] px-4 py-12">
      <div className="w-full max-w-md rounded-[32px] border border-[color:var(--line)] bg-white p-8 shadow-[0_18px_60px_rgba(18,59,103,0.12)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--muted-foreground)]">
          Acceso seguro
        </p>
        <h1 className="mt-3 font-serif text-4xl text-[color:var(--ink)]">Panel de administracion</h1>
        <p className="mt-4 text-sm leading-7 text-[color:var(--muted-foreground)]">
          Inicia sesion con `ADMIN_EMAIL` y `ADMIN_PASSWORD` definidos en variables de entorno.
        </p>
        {params.error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {params.error}
          </div>
        ) : null}
        <form action={loginAction} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[color:var(--ink)]">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3 outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[color:var(--ink)]">Contrasena</label>
            <input
              type="password"
              name="password"
              required
              className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3 outline-none"
            />
          </div>
          <button className="w-full rounded-2xl bg-[color:var(--lake-blue)] px-4 py-3 font-semibold text-white">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
