import { DEFAULT_WHATSAPP_NUMBER } from "@/lib/constants";

export function WhatsAppFab({ number }: { number?: string | null }) {
  const phone = (
    number ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    DEFAULT_WHATSAPP_NUMBER
  ).replace(/\D/g, "");

  if (!phone) return null;

  const href = `https://wa.me/${phone}?text=${encodeURIComponent(
    "Hola, quiero comunicarme con Diario Angostura Hoy.",
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#1fa855] text-lg font-bold text-white shadow-[0_20px_50px_rgba(31,168,85,0.4)] transition hover:-translate-y-1"
      aria-label="Contactar por WhatsApp"
    >
      WA
    </a>
  );
}
