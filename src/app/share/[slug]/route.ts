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
  const imageUrl = toOpenGraphImageUrl(data.post.featuredImageUrl) || absoluteUrl("/logo.jpg");
  const title = escapeHtml(data.post.title);
  const description = escapeHtml(data.post.excerpt || data.post.title);
  const safeArticleUrl = escapeHtml(articleUrl);
  const safeImageUrl = escapeHtml(imageUrl);

  const html = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${safeArticleUrl}" />
    <meta property="og:url" content="${safeArticleUrl}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Diario Angostura Hoy" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${safeImageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${safeImageUrl}" />
    <meta http-equiv="refresh" content="0;url=${safeArticleUrl}" />
  </head>
  <body>
    <script>window.location.replace(${JSON.stringify(articleUrl)});</script>
    <p>Redirigiendo a <a href="${safeArticleUrl}">${safeArticleUrl}</a></p>
  </body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, s-maxage=600, stale-while-revalidate=3600",
    },
  });
}
