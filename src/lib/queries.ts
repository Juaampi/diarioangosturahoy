import { BannerPosition, PostStatus } from "@prisma/client";

import {
  BANNER_PLACEHOLDER_IMAGES,
  MIN_HOME_BETWEEN_SECTION_BANNERS,
  MIN_HOME_MIDDLE_BANNERS,
  MIN_HOME_SIDEBAR_BANNERS,
  MIN_HOME_TOP_BANNERS,
} from "@/lib/constants";
import { prisma } from "@/lib/prisma";

const PUBLISHED_FILTER = {
  status: PostStatus.PUBLISHED,
  deletedAt: null,
};

const HOME_ORDER = [{ homeOrder: "desc" as const }, { publishedAt: "desc" as const }, { createdAt: "desc" as const }];

type BannerLike = Awaited<ReturnType<typeof getActiveBanners>>[number];

function withBannerPlaceholders(banners: BannerLike[], position: BannerPosition, minimum: number) {
  // Show placeholders only when a slot has no real banners yet, so we avoid
  // mixing production ads with fallback creatives in the same block.
  if (banners.length > 0) {
    return banners;
  }

  const placeholders = Array.from({ length: minimum }, (_, index) => {
    const placeholderSlides = BANNER_PLACEHOLDER_IMAGES.map((imageUrl) => ({
      title: `Publicidad Diario Angostura ${index + 1}`,
      imageUrl,
      link: null,
    }));

    return {
      id: `placeholder-${position.toLowerCase()}-${index + 1}`,
      title: `Publicidad Diario Angostura ${index + 1}`,
      imageUrl: placeholderSlides[0].imageUrl,
      slideUrls: placeholderSlides
        .slice(1)
        .map((slide) => slide.imageUrl)
        .join("\n"),
      slidesJson: JSON.stringify(
        placeholderSlides.map((slide, slideIndex) => ({
          ...slide,
          title: `${slide.title} - slide ${slideIndex + 1}`,
        })),
      ),
      link: null,
      position,
      displayOrder: 1000 + index,
      isActive: true,
      startsAt: null,
      endsAt: null,
      createdAt: new Date(0),
      updatedAt: new Date(0),
    };
  }) as BannerLike[];

  return [...banners, ...placeholders];
}

export async function getLayoutData() {
  const [settings, embeds, categories] = await Promise.all([
    prisma.siteSetting.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    }),
    prisma.liveEmbed.findMany({ orderBy: { type: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return { settings, embeds, categories };
}

export async function getHomeData() {
  const [mainPost, featuredPosts, latestPosts, categories, topBanners, betweenSectionBanners, middleBanners, sidebarBanners] =
    await Promise.all([
      prisma.post.findFirst({
        where: { ...PUBLISHED_FILTER, isMain: true },
        include: { category: true, tags: { include: { tag: true } } },
        orderBy: HOME_ORDER,
      }),
      prisma.post.findMany({
        where: { ...PUBLISHED_FILTER, isFeatured: true },
        include: { category: true, tags: { include: { tag: true } } },
        orderBy: HOME_ORDER,
        take: 4,
      }),
      prisma.post.findMany({
        where: PUBLISHED_FILTER,
        include: { category: true, tags: { include: { tag: true } } },
        orderBy: HOME_ORDER,
        take: 12,
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
        include: {
          posts: {
            where: PUBLISHED_FILTER,
            include: { category: true, tags: { include: { tag: true } } },
            orderBy: HOME_ORDER,
            take: 6,
          },
        },
      }),
      getActiveBanners(BannerPosition.HOME_TOP),
      getActiveBanners(BannerPosition.HOME_BETWEEN_SECTIONS),
      getActiveBanners(BannerPosition.HOME_MIDDLE),
      getActiveBanners(BannerPosition.SIDEBAR),
    ]);

  return {
    mainPost: mainPost || latestPosts[0] || null,
    featuredPosts,
    latestPosts,
    categories,
    topBanners: withBannerPlaceholders(topBanners, BannerPosition.HOME_TOP, MIN_HOME_TOP_BANNERS),
    betweenSectionBanners: withBannerPlaceholders(
      betweenSectionBanners,
      BannerPosition.HOME_BETWEEN_SECTIONS,
      MIN_HOME_BETWEEN_SECTION_BANNERS,
    ),
    middleBanners: withBannerPlaceholders(middleBanners, BannerPosition.HOME_MIDDLE, MIN_HOME_MIDDLE_BANNERS),
    sidebarBanners: withBannerPlaceholders(sidebarBanners, BannerPosition.SIDEBAR, MIN_HOME_SIDEBAR_BANNERS),
  };
}

export async function getActiveBanners(position: BannerPosition) {
  const now = new Date();

  return prisma.banner.findMany({
    where: {
      position,
      isActive: true,
      OR: [{ startsAt: null }, { startsAt: { lte: now } }],
      AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
    },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function getPublishedPostsByCategory(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      posts: {
        where: PUBLISHED_FILTER,
        include: { category: true, tags: { include: { tag: true } } },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      },
    },
  });
}

export async function getPublishedPostBySlug(slug: string) {
  const post = await prisma.post.findFirst({
    where: {
      slug,
      ...PUBLISHED_FILTER,
    },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  if (!post) return null;

  const relatedPosts = await prisma.post.findMany({
    where: {
      ...PUBLISHED_FILTER,
      id: { not: post.id },
      OR: [
        { categoryId: post.categoryId ?? undefined },
        {
          tags: {
            some: {
              tagId: { in: post.tags.map((item) => item.tagId) || [-1] },
            },
          },
        },
      ],
    },
    include: { category: true, tags: { include: { tag: true } } },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 3,
  });

  const articleBottomBanners = await getActiveBanners(BannerPosition.ARTICLE_BOTTOM);

  return { post, relatedPosts, articleBottomBanners };
}

export async function searchPublishedPosts(query: string) {
  return prisma.post.findMany({
    where: {
      ...PUBLISHED_FILTER,
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { excerpt: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
        { category: { name: { contains: query, mode: "insensitive" } } },
        {
          tags: {
            some: { tag: { name: { contains: query, mode: "insensitive" } } },
          },
        },
      ],
    },
    include: { category: true, tags: { include: { tag: true } } },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
}

export async function getAdminDashboardData() {
  const [posts, categories, banners, settings, embeds] = await Promise.all([
    prisma.post.findMany({
      where: { deletedAt: null },
      include: { category: true, tags: { include: { tag: true } } },
      orderBy: [{ isMain: "desc" }, { homeOrder: "desc" }, { updatedAt: "desc" }],
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.banner.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.siteSetting.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } }),
    prisma.liveEmbed.findMany({ orderBy: { type: "asc" } }),
  ]);

  return { posts, categories, banners, settings, embeds };
}
