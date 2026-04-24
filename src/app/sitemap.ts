import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, posts] = await Promise.all([
    prisma.category.findMany(),
    prisma.post.findMany({
      where: { status: "PUBLISHED", deletedAt: null },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
    },
    ...categories.map((category) => ({
      url: absoluteUrl(`/categoria/${category.slug}`),
      lastModified: category.updatedAt,
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/noticia/${post.slug}`),
      lastModified: post.updatedAt,
    })),
  ];
}
