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
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-7 w-7 fill-current"
      >
        <path d="M19.05 4.94A9.9 9.9 0 0 0 12.04 2C6.6 2 2.17 6.43 2.17 11.87c0 1.74.45 3.43 1.3 4.93L2 22l5.35-1.4a9.8 9.8 0 0 0 4.69 1.2h.01c5.44 0 9.87-4.43 9.87-9.87a9.8 9.8 0 0 0-2.87-6.99Zm-7.01 15.2h-.01a8.14 8.14 0 0 1-4.15-1.13l-.3-.18-3.18.83.85-3.1-.2-.32a8.18 8.18 0 0 1-1.26-4.37c0-4.51 3.67-8.18 8.19-8.18 2.19 0 4.24.85 5.78 2.39a8.12 8.12 0 0 1 2.39 5.79c0 4.51-3.67 8.18-8.18 8.18Zm4.49-6.14c-.25-.13-1.47-.73-1.7-.81-.23-.09-.39-.13-.56.13-.17.25-.64.81-.79.98-.14.17-.29.19-.54.06-.25-.13-1.04-.38-1.98-1.22-.73-.65-1.22-1.45-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.38-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.08s.89 2.41 1.01 2.58c.13.17 1.75 2.67 4.25 3.75.59.26 1.06.42 1.42.54.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.05-.1-.21-.16-.46-.29Z" />
      </svg>
    </a>
  );
}
