"use client";

import { useState } from "react";

type Props = {
  name: string;
  defaultValue?: string | null;
  label?: string;
};

export function ImageUploadField({ name, defaultValue, label = "Imagen destacada" }: Props) {
  const [value, setValue] = useState(defaultValue || "");
  const [status, setStatus] = useState("");

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus("Subiendo imagen...");

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/cloudinary/upload", {
      method: "POST",
      body: formData,
    });

    const data = (await response.json()) as { url?: string; error?: string };

    if (!response.ok || !data.url) {
      setStatus(data.error || "No se pudo subir la imagen. Puedes pegar una URL manualmente.");
      return;
    }

    setValue(data.url);
    setStatus("Imagen subida correctamente.");
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-[color:var(--ink)]">{label}</label>
      <input
        type="url"
        name={name}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="https://..."
        className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3 outline-none"
      />
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="block w-full text-sm text-[color:var(--muted-foreground)] file:mr-4 file:rounded-full file:border-0 file:bg-[color:var(--mist)] file:px-4 file:py-2 file:font-semibold file:text-[color:var(--lake-blue)]"
      />
      {status ? <p className="text-xs text-[color:var(--muted-foreground)]">{status}</p> : null}
    </div>
  );
}
