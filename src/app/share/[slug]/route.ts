import { NextResponse } from "next/server";

import { getPublishedPostBySlug } from "@/lib/queries";
import { absoluteUrl, toOpenGraphImageUrl } from "@/lib/utils";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function toFacebookSafeText(value: string) {
  return escapeHtml(value).replace(/[^\u0000-\u007F]/g, (character) => `&#${character.charCodeAt(0)};`);
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const data = await getPublishedPostBySlug(slug);

  if (!data) {
    return NextResponse.redirect(absoluteUrl("/"), 302);
  }

  const articleUrl = absoluteUrl(`/noticia/${slug}`);
  const shareUrl = absoluteUrl(`/share/${slug}`);
  const imageUrl = toOpenGraphImageUrl(data.post.featuredImageUrl) || absoluteUrl("/logo.jpg");
  const title = toFacebookSafeText(data.post.title);
  const description = toFacebookSafeText(data.post.excerpt || data.post.title);
  const safeArticleUrl = escapeHtml(articleUrl);
  const safeShareUrl = escapeHtml(shareUrl);
  const safeImageUrl = escapeHtml(imageUrl);

  const html = `<html xmlns="http://www.w3.org/1999/xhtml" lang="es" xml:lang="es">
  <head prefix="">
    <meta charset="utf-8" />
    <meta name="description" content="${description}" />
    <meta property="og:url" content="${safeShareUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Diario Angostura Hoy" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${safeImageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="${safeShareUrl}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${safeImageUrl}" />
  </head>
</html>
<script>window.location.href='${safeArticleUrl}';</script>`;

  return new NextResponse(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, s-maxage=600, stale-while-revalidate=3600",
    },
  });
}
