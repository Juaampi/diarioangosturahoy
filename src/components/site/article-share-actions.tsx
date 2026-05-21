"use client";

import { useState } from "react";

type ArticleShareActionsProps = {
  title: string;
  url: string;
};

export function ArticleShareActions({ title, url }: ArticleShareActionsProps) {
  const [copied, setCopied] = useState(false);
  const shareText = `${title} ${url}`;

  const actions = [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      tone: "text-[color:var(--lake-blue)]",
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      tone: "text-[color:var(--forest-green)]",
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      tone: "text-[color:var(--ink)]",
    },
    {
      label: "Telegram",
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      tone: "text-[color:var(--lake-blue)]",
    },
    {
      label: "Email",
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText)}`,
      tone: "text-[color:var(--muted-foreground)]",
    },
  ];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function handleNativeShare() {
    if (!navigator.share) return;

    try {
      await navigator.share({ title, url });
    } catch {}
  }

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {actions.map((action) => (
        <a
          key={action.label}
          href={action.href}
          target="_blank"
          rel="noreferrer"
          className={`rounded-full border border-[color:var(--line)] px-4 py-2 text-sm font-semibold ${action.tone}`}
        >
          {action.label}
        </a>
      ))}
      <button
        type="button"
        onClick={handleCopy}
        className="rounded-full border border-[color:var(--line)] px-4 py-2 text-sm font-semibold text-[color:var(--muted-foreground)]"
      >
        {copied ? "Enlace copiado" : "Copiar enlace"}
      </button>
      {"share" in navigator ? (
        <button
          type="button"
          onClick={handleNativeShare}
          className="rounded-full border border-[color:var(--line)] px-4 py-2 text-sm font-semibold text-[color:var(--lake-blue)]"
        >
          Mas opciones
        </button>
      ) : null}
    </div>
  );
}
