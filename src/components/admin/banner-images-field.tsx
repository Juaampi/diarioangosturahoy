"use client";

import { useMemo, useState } from "react";

type SlideItem = {
  title: string;
  imageUrl: string;
  link: string;
};

type BannerImagesFieldProps = {
  name: string;
  defaultTitle?: string | null;
  defaultImageUrl?: string | null;
  defaultLink?: string | null;
  defaultSlidesJson?: string | null;
};

function parseSlidesJson(
  defaultTitle?: string | null,
  defaultImageUrl?: string | null,
  defaultLink?: string | null,
  defaultSlidesJson?: string | null,
) {
  if (defaultSlidesJson) {
    try {
      const parsed = JSON.parse(defaultSlidesJson) as SlideItem[];
      const normalized = parsed
        .map((slide) => ({
          title: String(slide?.title || "").trim(),
          imageUrl: String(slide?.imageUrl || "").trim(),
          link: String(slide?.link || "").trim(),
        }))
        .filter((slide) => slide.imageUrl.length)
        .slice(0, 10);

      if (normalized.length) {
        return normalized;
      }
    } catch {}
  }

  return [
    {
      title: defaultTitle || "",
      imageUrl: defaultImageUrl || "",
      link: defaultLink || "",
    },
  ];
}

export function BannerImagesField({
  name,
  defaultTitle,
  defaultImageUrl,
  defaultLink,
  defaultSlidesJson,
}: BannerImagesFieldProps) {
  const [slides, setSlides] = useState<SlideItem[]>(() =>
    parseSlidesJson(defaultTitle, defaultImageUrl, defaultLink, defaultSlidesJson),
  );
  const [status, setStatus] = useState("");

  const serializedSlides = useMemo(() => JSON.stringify(slides.filter((slide) => slide.imageUrl.trim().length)), [slides]);

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

  async function onFileChange(index: number, file: File) {
    try {
      setStatus(`Subiendo imagen del slide ${index + 1}...`);
      const url = await uploadFile(file);
      setSlides((current) =>
        current.map((slide, slideIndex) =>
          slideIndex === index
            ? {
                ...slide,
                imageUrl: url,
              }
            : slide,
        ),
      );
      setStatus(`Imagen del slide ${index + 1} subida correctamente.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "No se pudo subir la imagen.");
    }
  }

  function updateSlide(index: number, field: keyof SlideItem, value: string) {
    setSlides((current) =>
      current.map((slide, slideIndex) => (slideIndex === index ? { ...slide, [field]: value } : slide)),
    );
  }

  function addSlide() {
    if (slides.length >= 10) {
      setStatus("Ya llegaste al maximo de 10 imagenes por banner.");
      return;
    }

    setSlides((current) => [...current, { title: "", imageUrl: "", link: "" }]);
  }

  function removeSlide(index: number) {
    if (slides.length === 1) {
      setSlides([{ title: "", imageUrl: "", link: "" }]);
      return;
    }

    setSlides((current) => current.filter((_, slideIndex) => slideIndex !== index));
  }

  return (
    <div className="space-y-4 rounded-2xl border border-[color:var(--line)] bg-[color:var(--mist)]/35 p-4">
      <input type="hidden" name={name} value={serializedSlides} />

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[color:var(--ink)]">Slides del banner</p>
          <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">
            Cada slide puede tener su propio titulo, imagen y link.
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[color:var(--lake-blue)]">
          {slides.length}/10 slides
        </span>
      </div>

      <div className="space-y-4">
        {slides.map((slide, index) => (
          <div key={index} className="rounded-2xl border border-[color:var(--line)] bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[color:var(--ink)]">
                {index === 0 ? "Slide principal" : `Slide ${index + 1}`}
              </p>
              <button type="button" onClick={() => removeSlide(index)} className="text-sm font-semibold text-red-600">
                Quitar
              </button>
            </div>

            <div className="grid gap-3">
              <input
                type="text"
                value={slide.title}
                onChange={(event) => updateSlide(index, "title", event.target.value)}
                placeholder="Titulo de la publicidad"
                className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
              />
              <input
                type="url"
                value={slide.imageUrl}
                onChange={(event) => updateSlide(index, "imageUrl", event.target.value)}
                placeholder="https://..."
                className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    void onFileChange(index, file);
                  }
                  event.target.value = "";
                }}
                className="block w-full text-sm text-[color:var(--muted-foreground)] file:mr-4 file:rounded-full file:border-0 file:bg-[color:var(--mist)] file:px-4 file:py-2 file:font-semibold file:text-[color:var(--lake-blue)]"
              />
              <input
                type="url"
                value={slide.link}
                onChange={(event) => updateSlide(index, "link", event.target.value)}
                placeholder="https://anunciante.com"
                className="w-full rounded-2xl border border-[color:var(--line)] px-4 py-3"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={addSlide}
          className="rounded-full border border-[color:var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[color:var(--lake-blue)]"
        >
          Agregar slide
        </button>
        {status ? <p className="text-xs text-[color:var(--muted-foreground)]">{status}</p> : null}
      </div>
    </div>
  );
}
