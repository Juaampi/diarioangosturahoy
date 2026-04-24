export const SITE_NAME = "Diario Angostura Hoy";
export const SITE_TAGLINE = "Diario Digital";
export const SITE_LOCATION = "Villa La Angostura, Neuquen, Argentina";
export const DEFAULT_WHATSAPP_NUMBER = "+549 2944 345171";
export const DEFAULT_FACEBOOK_URL = "https://www.facebook.com/fm.estilo.vla";
export const DEFAULT_YOUTUBE_URL = "https://youtu.be/Xkb-Onz87CU";
export const DEFAULT_YOUTUBE_EMBED =
  "https://www.youtube.com/embed/Xkb-Onz87CU";

export const CATEGORY_SEED = [
  { name: "Locales", slug: "locales" },
  { name: "Nacionales", slug: "nacionales" },
  { name: "Internacionales", slug: "internacionales" },
  { name: "Deporte", slug: "deporte" },
] as const;

export const POST_STATUS_OPTIONS = [
  { value: "DRAFT", label: "Borrador" },
  { value: "PENDING_REVIEW", label: "Pendiente de revision" },
  { value: "PUBLISHED", label: "Publicada" },
  { value: "ARCHIVED", label: "Archivada" },
  { value: "DELETED", label: "Eliminada" },
] as const;

export const BANNER_POSITIONS = [
  { value: "HOME_TOP", label: "Home superior" },
  { value: "HOME_MIDDLE", label: "Home medio" },
  { value: "SIDEBAR", label: "Sidebar" },
  { value: "ARTICLE_BOTTOM", label: "Debajo del articulo" },
  { value: "CATEGORY_TOP", label: "Encabezado de categoria" },
] as const;

export const NEWS_IMPORT_TYPES = [
  { value: "nacionales", label: "Nacionales" },
  { value: "internacionales", label: "Internacionales" },
] as const;
