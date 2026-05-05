"use client";

import { useMemo, useState } from "react";

import type { PostContentBlock } from "@/lib/post-content";

type PostParagraphsFieldProps = {
  name: string;
  defaultBlocks?: PostContentBlock[];
};

const EMPTY_BLOCK: PostContentBlock = { paragraph: "", imageUrl: null };

export function PostParagraphsField({ name, defaultBlocks = [EMPTY_BLOCK] }: PostParagraphsFieldProps) {
  const [blocks, setBlocks] = useState<PostContentBlock[]>(
    defaultBlocks.length ? defaultBlocks.slice(0, 10) : [EMPTY_BLOCK],
  );
  const [status, setStatus] = useState("");

  const serializedBlocks = useMemo(
    () => JSON.stringify(blocks.map((block) => ({ paragraph: block.paragraph, imageUrl: block.imageUrl || null }))),
    [blocks],
  );

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/cloudinary/upload", {
      method: "POST",
      body: formData,
    });

    const data = (await response.json()) as { url?: string; error?: string };

    if (!response.ok || !data.url) {
      throw new Error(data.error || "No se pudo subir la imagen.");
    }

    return data.url;
  }

  function updateBlock(index: number, field: keyof PostContentBlock, value: string | null) {
    setBlocks((current) =>
      current.map((block, blockIndex) => (blockIndex === index ? { ...block, [field]: value } : block)),
    );
  }

  async function onImageChange(index: number, file: File) {
    try {
      setStatus(`Subiendo imagen del parrafo ${index + 1}...`);
      const url = await uploadFile(file);
      updateBlock(index, "imageUrl", url);
      setStatus(`Imagen del parrafo ${index + 1} subida correctamente.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "No se pudo subir la imagen.");
    }
  }

  function addBlock() {
    if (blocks.length >= 10) {
      setStatus("Una noticia puede tener hasta 10 parrafos.");
      return;
    }

    setBlocks((current) => [...current, { ...EMPTY_BLOCK }]);
  }

  function removeBlock(index: number) {
    if (blocks.length === 1) {
      setBlocks([{ ...EMPTY_BLOCK }]);
      return;
    }

    setBlocks((current) => current.filter((_, blockIndex) => blockIndex !== index));
  }

  return (
    <div className="space-y-4 lg:col-span-2">
      <input type="hidden" name={name} value={serializedBlocks} />

      <div className="flex items-center justify-between gap-3">
        <div>
          <label className="block text-sm font-semibold text-[color:var(--ink)]">Contenido por parrafos</label>
          <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">
            Maximo 10 parrafos. Cada parrafo puede llevar una imagen opcional.
          </p>
        </div>
        <span className="rounded-full bg-[color:var(--mist)] px-3 py-1 text-xs font-semibold text-[color:var(--lake-blue)]">
          {blocks.length}/10 parrafos
        </span>
      </div>

      <div className="space-y-4">
        {blocks.map((block, index) => (
          <div key={index} className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--mist)]/25 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[color:var(--ink)]">Parrafo {index + 1}</p>
              <button type="button" onClick={() => removeBlock(index)} className="text-sm font-semibold text-red-600">
                Quitar
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
              <textarea
                rows={8}
                value={block.paragraph}
                onChange={(event) => updateBlock(index, "paragraph", event.target.value)}
                placeholder="Escribe el parrafo..."
                className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
              />
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-[color:var(--ink)]">Imagen opcional</label>
                <input
                  type="url"
                  value={block.imageUrl || ""}
                  onChange={(event) => updateBlock(index, "imageUrl", event.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      void onImageChange(index, file);
                    }
                    event.target.value = "";
                  }}
                  className="block w-full text-sm text-[color:var(--muted-foreground)] file:mr-4 file:rounded-full file:border-0 file:bg-[color:var(--mist)] file:px-4 file:py-2 file:font-semibold file:text-[color:var(--lake-blue)]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={addBlock}
          className="rounded-full border border-[color:var(--line)] px-4 py-2 text-sm font-semibold text-[color:var(--lake-blue)]"
        >
          Agregar parrafo
        </button>
        {status ? <p className="text-xs text-[color:var(--muted-foreground)]">{status}</p> : null}
      </div>
    </div>
  );
}
