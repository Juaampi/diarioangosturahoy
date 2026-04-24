import { stripTrailingNewsSource, truncate } from "@/lib/utils";

type NewsApiArticle = {
  source: { id: string | null; name: string };
  author?: string | null;
  title: string;
  description?: string | null;
  url: string;
  urlToImage?: string | null;
  publishedAt?: string;
  content?: string | null;
};

type NewsApiResponse = {
  status: "ok" | "error";
  totalResults?: number;
  articles?: NewsApiArticle[];
  code?: string;
  message?: string;
};

export type ExternalArticle = {
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  sourceName: string;
  sourceKey: string;
  externalUrl: string;
  publishedAt: string;
};

const API_BASE = "https://newsapi.org/v2";

function requireApiKey() {
  if (!process.env.NEWSAPI_KEY) {
    throw new Error("Falta NEWSAPI_KEY en variables de entorno.");
  }

  return process.env.NEWSAPI_KEY;
}

async function requestNewsApi(
  endpoint: "everything" | "top-headlines",
  params: Record<string, string | number | undefined>,
) {
  const apiKey = requireApiKey();
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const response = await fetch(`${API_BASE}/${endpoint}?${searchParams.toString()}`, {
    headers: {
      "X-Api-Key": apiKey,
    },
    next: { revalidate: 0 },
  });

  const data = (await response.json()) as NewsApiResponse;

  if (!response.ok || data.status === "error") {
    throw new Error(data.message || "No se pudo consultar NewsAPI.");
  }

  return data;
}

function mapArticle(article: NewsApiArticle): ExternalArticle {
  const title = stripTrailingNewsSource(article.title);
  const content = article.content || article.description || "";

  return {
    title,
    excerpt: truncate(article.description || content, 180),
    content: truncate(content, 400),
    imageUrl: article.urlToImage || "",
    author: article.author || "",
    sourceName: article.source?.name || "Fuente externa",
    sourceKey: article.source?.id || article.source?.name || "externa",
    externalUrl: article.url,
    publishedAt: article.publishedAt || new Date().toISOString(),
  };
}

export async function getExternalNews({
  mode,
  query,
  category,
  pageSize = 100,
}: {
  mode: "nacionales" | "internacionales";
  query?: string;
  category?: string;
  pageSize?: number;
}) {
  if (mode === "nacionales") {
    const data = await requestNewsApi("top-headlines", {
      country: "ar",
      language: "es",
      category: category || "general",
      q: query,
      pageSize: Math.min(pageSize, 100),
      page: 1,
    });

    return (data.articles || []).map(mapArticle);
  }

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 7);

  const data = await requestNewsApi("everything", {
    q: query || "world OR international",
    language: "es",
    sortBy: "publishedAt",
    pageSize: Math.min(pageSize, 100),
    page: 1,
    from: fromDate.toISOString().slice(0, 10),
  });

  return (data.articles || []).map(mapArticle);
}
