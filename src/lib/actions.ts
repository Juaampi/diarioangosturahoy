"use server";

import { BannerPosition, EmbedType, PostStatus, SourceType } from "@prisma/client";
import sanitizeHtml from "sanitize-html";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { clearAdminSession, requireAdmin, setAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toSlug } from "@/lib/utils";

async function ensureUniquePostSlug(title: string, currentId?: string) {
  const baseSlug = toSlug(title) || "noticia";
  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const existing = await prisma.post.findFirst({
      where: {
        slug,
        ...(currentId ? { id: { not: currentId } } : {}),
      },
      select: { id: true },
    });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

async function ensureUniqueCategorySlug(name: string, currentId?: number) {
  const baseSlug = toSlug(name) || "categoria";
  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const existing = await prisma.category.findFirst({
      where: {
        slug,
        ...(currentId ? { id: { not: currentId } } : {}),
      },
      select: { id: true },
    });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

function sanitizeContent(input: FormDataEntryValue | null) {
  const value = typeof input === "string" ? input.trim() : "";

  return sanitizeHtml(value, {
    allowedTags: ["p", "br", "strong", "em", "ul", "ol", "li", "blockquote", "a"],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
  });
}

function toBoolean(input: FormDataEntryValue | null) {
  return input === "on" || input === "true" || input === "1";
}

function toOptionalString(input: FormDataEntryValue | null) {
  if (typeof input !== "string") return null;
  const trimmed = input.trim();
  return trimmed.length ? trimmed : null;
}

function toOptionalDate(input: FormDataEntryValue | null) {
  const value = toOptionalString(input);
  return value ? new Date(value) : null;
}

function toOptionalNumber(input: FormDataEntryValue | null, fallback?: number) {
  if (typeof input !== "string") return fallback ?? null;
  const trimmed = input.trim();
  if (!trimmed.length) return fallback ?? null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : fallback ?? null;
}

function normalizeSlideUrls(input: FormDataEntryValue | null, primaryImageUrl: string) {
  if (typeof input !== "string") return null;

  const urls = input
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean)
    .filter((url) => url !== primaryImageUrl);

  const uniqueUrls = Array.from(new Set(urls)).slice(0, 9);

  return uniqueUrls.length ? uniqueUrls.join("\n") : null;
}

function normalizeSlidesJson(input: FormDataEntryValue | null) {
  if (typeof input !== "string" || !input.trim().length) {
    return null;
  }

  try {
    const parsed = JSON.parse(input) as Array<{ title?: string; imageUrl?: string; link?: string }>;
    const normalized = parsed
      .map((slide) => ({
        title: String(slide?.title || "").trim(),
        imageUrl: String(slide?.imageUrl || "").trim(),
        link: String(slide?.link || "").trim(),
      }))
      .filter((slide) => slide.imageUrl.length)
      .slice(0, 10);

    return normalized.length ? JSON.stringify(normalized) : null;
  } catch {
    return null;
  }
}

async function syncTags(postId: string, tagsValue: string | null) {
  const tagNames = (tagsValue || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  await prisma.postTag.deleteMany({ where: { postId } });

  for (const name of tagNames) {
    const slug = toSlug(name);
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });

    await prisma.postTag.create({
      data: {
        postId,
        tagId: tag.id,
      },
    });
  }
}

async function getNextHomeOrder() {
  const aggregate = await prisma.post.aggregate({
    _max: { homeOrder: true },
    where: { deletedAt: null },
  });

  return (aggregate._max.homeOrder ?? 0) + 1;
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (
    email &&
    email === process.env.ADMIN_EMAIL?.trim().toLowerCase() &&
    password === process.env.ADMIN_PASSWORD
  ) {
    await setAdminSession(email);
    redirect("/admin");
  }

  redirect("/admin/login?error=Credenciales%20invalidas");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function savePostAction(formData: FormData) {
  await requireAdmin();

  const id = toOptionalString(formData.get("id"));
  const title = String(formData.get("title") || "").trim();

  if (!title) {
    throw new Error("El titulo es obligatorio.");
  }

  const externalUrl = toOptionalString(formData.get("externalUrl"));

  if (externalUrl) {
    const duplicate = await prisma.post.findFirst({
      where: {
        externalUrl,
        ...(id ? { id: { not: id } } : {}),
      },
      select: { id: true },
    });

    if (duplicate) {
      throw new Error("Ya existe una noticia importada con esa URL externa.");
    }
  }

  const currentPost = id
    ? await prisma.post.findUnique({
        where: { id },
        select: { homeOrder: true },
      })
    : null;

  const requestedHomeOrder = toOptionalNumber(formData.get("homeOrder"));
  const homeOrder =
    requestedHomeOrder ??
    currentPost?.homeOrder ??
    (await getNextHomeOrder());

  const data = {
    title,
    slug: await ensureUniquePostSlug(title, id || undefined),
    excerpt: toOptionalString(formData.get("excerpt")),
    content: sanitizeContent(formData.get("content")),
    featuredImageUrl: toOptionalString(formData.get("featuredImageUrl")),
    categoryId: Number(formData.get("categoryId")) || null,
    status: (String(formData.get("status") || "DRAFT") as keyof typeof PostStatus) in PostStatus
      ? (String(formData.get("status")) as PostStatus)
      : PostStatus.DRAFT,
    isMain: toBoolean(formData.get("isMain")),
    isFeatured: toBoolean(formData.get("isFeatured")),
    homeOrder,
    sourceType:
      String(formData.get("sourceType") || "MANUAL") === "NEWSAPI"
        ? SourceType.NEWSAPI
        : SourceType.MANUAL,
    sourceName: toOptionalString(formData.get("sourceName")),
    externalUrl,
    author: toOptionalString(formData.get("author")),
    publishedAt: toOptionalDate(formData.get("publishedAt")),
    deletedAt: null,
  };

  if (data.status === PostStatus.PUBLISHED && !data.publishedAt) {
    data.publishedAt = new Date();
  }

  if (data.isMain) {
    await prisma.post.updateMany({
      where: id ? { id: { not: id } } : {},
      data: { isMain: false },
    });
  }

  const post = id
    ? await prisma.post.update({
        where: { id },
        data,
      })
    : await prisma.post.create({
        data,
      });

  await syncTags(post.id, toOptionalString(formData.get("tags")));

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath(`/noticia/${post.slug}`);
  redirect(`/admin/posts/${post.id}?saved=1`);
}

export async function updatePostDisplayAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") || "").trim();

  if (!id) {
    throw new Error("La noticia es obligatoria.");
  }

  const existingPost = await prisma.post.findUnique({
    where: { id },
    select: { homeOrder: true },
  });

  if (!existingPost) {
    throw new Error("La noticia no existe.");
  }

  const homeOrder = toOptionalNumber(formData.get("homeOrder"), existingPost.homeOrder) ?? existingPost.homeOrder;
  const makeMain = toBoolean(formData.get("makeMain"));

  if (makeMain) {
    await prisma.$transaction([
      prisma.post.updateMany({
        where: { id: { not: id } },
        data: { isMain: false },
      }),
      prisma.post.update({
        where: { id },
        data: { isMain: true, homeOrder },
      }),
    ]);
  } else {
    await prisma.post.update({
      where: { id },
      data: { homeOrder },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  redirect("/admin/posts?updated=1");
}

export async function deletePostAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");

  if (!id) return;

  await prisma.post.update({
    where: { id },
    data: {
      status: PostStatus.DELETED,
      deletedAt: new Date(),
      isMain: false,
      isFeatured: false,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/posts");
}

export async function saveCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id")) || undefined;
  const name = String(formData.get("name") || "").trim();

  if (!name) {
    throw new Error("El nombre es obligatorio.");
  }

  const slug = await ensureUniqueCategorySlug(name, id);

  if (id) {
    await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description: toOptionalString(formData.get("description")),
      },
    });
  } else {
    await prisma.category.create({
      data: {
        name,
        slug,
        description: toOptionalString(formData.get("description")),
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/categories");
  revalidatePath("/categoria/[slug]");
  redirect("/admin/categories?saved=1");
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!id) return;

  await prisma.category.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/categories");
}

export async function saveBannerAction(formData: FormData) {
  await requireAdmin();
  const id = toOptionalString(formData.get("id"));
  const normalizedSlidesJson = normalizeSlidesJson(formData.get("slidesJson"));
  const parsedSlides = normalizedSlidesJson
    ? (JSON.parse(normalizedSlidesJson) as Array<{ title: string; imageUrl: string; link?: string }>)
    : [];
  const firstSlide = parsedSlides[0];
  const title = String(firstSlide?.title || formData.get("title") || "").trim();
  const imageUrl = String(firstSlide?.imageUrl || formData.get("imageUrl") || "").trim();

  if (!title || !imageUrl) {
    throw new Error("Titulo e imagen son obligatorios.");
  }

  const data = {
    title,
    imageUrl,
    slideUrls: parsedSlides.length > 1 ? parsedSlides.slice(1).map((slide) => slide.imageUrl).join("\n") : normalizeSlideUrls(formData.get("slideUrls"), imageUrl),
    slidesJson: normalizedSlidesJson,
    link: toOptionalString(firstSlide?.link || formData.get("link")),
    position:
      (String(formData.get("position") || "HOME_TOP") as BannerPosition) || BannerPosition.HOME_TOP,
    isActive: toBoolean(formData.get("isActive")),
    startsAt: toOptionalDate(formData.get("startsAt")),
    endsAt: toOptionalDate(formData.get("endsAt")),
  };

  if (id) {
    await prisma.banner.update({ where: { id }, data });
  } else {
    await prisma.banner.create({ data });
  }

  revalidatePath("/");
  revalidatePath("/admin/banners");
  redirect("/admin/banners?saved=1");
}

export async function deleteBannerAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;

  await prisma.banner.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/banners");
}

export async function saveSettingsAction(formData: FormData) {
  await requireAdmin();

  await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: {
      siteName: String(formData.get("siteName") || "Diario Angostura Hoy"),
      tagline: String(formData.get("tagline") || "Diario Digital"),
      location: String(
        formData.get("location") || "Villa La Angostura, Neuquen, Argentina",
      ),
      contactEmail: toOptionalString(formData.get("contactEmail")),
      contactAddress: toOptionalString(formData.get("contactAddress")),
      footerText: toOptionalString(formData.get("footerText")),
      whatsappNumber: toOptionalString(formData.get("whatsappNumber")),
      facebookUrl: toOptionalString(formData.get("facebookUrl")),
      instagramUrl: toOptionalString(formData.get("instagramUrl")),
      youtubeUrl: toOptionalString(formData.get("youtubeUrl")),
    },
    create: {
      id: 1,
      siteName: String(formData.get("siteName") || "Diario Angostura Hoy"),
      tagline: String(formData.get("tagline") || "Diario Digital"),
      location: String(
        formData.get("location") || "Villa La Angostura, Neuquen, Argentina",
      ),
      contactEmail: toOptionalString(formData.get("contactEmail")),
      contactAddress: toOptionalString(formData.get("contactAddress")),
      footerText: toOptionalString(formData.get("footerText")),
      whatsappNumber: toOptionalString(formData.get("whatsappNumber")),
      facebookUrl: toOptionalString(formData.get("facebookUrl")),
      instagramUrl: toOptionalString(formData.get("instagramUrl")),
      youtubeUrl: toOptionalString(formData.get("youtubeUrl")),
    },
  });

  const embedValues = [
    {
      type: EmbedType.RADIO,
      title: String(formData.get("radioTitle") || "Radio en vivo"),
      url: toOptionalString(formData.get("radioUrl")),
      iframe: toOptionalString(formData.get("radioIframe")),
      isActive: toBoolean(formData.get("radioIsActive")),
    },
    {
      type: EmbedType.YOUTUBE,
      title: String(formData.get("youtubeTitle") || "YouTube en vivo"),
      url: toOptionalString(formData.get("youtubeStreamUrl")),
      iframe: toOptionalString(formData.get("youtubeIframe")),
      isActive: toBoolean(formData.get("youtubeIsActive")),
    },
  ];

  for (const embed of embedValues) {
    await prisma.liveEmbed.upsert({
      where: { type: embed.type },
      update: embed,
      create: embed,
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}

export async function importExternalPostsAction(formData: FormData) {
  await requireAdmin();

  const selectedArticles = formData.getAll("selectedArticles").map((item) => String(item));
  const status =
    String(formData.get("status") || "PENDING_REVIEW") === "PUBLISHED"
      ? PostStatus.PUBLISHED
      : String(formData.get("status") || "PENDING_REVIEW") === "DRAFT"
        ? PostStatus.DRAFT
        : PostStatus.PENDING_REVIEW;
  const categoryId = Number(formData.get("categoryId")) || null;

  let imported = 0;

  for (const raw of selectedArticles) {
    const article = JSON.parse(raw) as {
      title: string;
      excerpt: string;
      content: string;
      imageUrl: string;
      author: string;
      sourceName: string;
      externalUrl: string;
      publishedAt: string;
    };

    if (!article.externalUrl) continue;

    const exists = await prisma.post.findFirst({
      where: { externalUrl: article.externalUrl },
      select: { id: true },
    });

    if (exists) continue;

    await prisma.post.create({
      data: {
        title: article.title,
        slug: await ensureUniquePostSlug(article.title),
        excerpt: article.excerpt,
        content: sanitizeHtml(article.content || article.excerpt || "", {
          allowedTags: [],
          allowedAttributes: {},
        }),
        featuredImageUrl: article.imageUrl || null,
        categoryId,
        status,
        sourceType: SourceType.NEWSAPI,
        sourceName: article.sourceName,
        externalUrl: article.externalUrl,
        author: article.author || article.sourceName,
        publishedAt:
          status === PostStatus.PUBLISHED
            ? new Date(article.publishedAt || Date.now())
            : null,
      },
    });

    imported += 1;
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/import");
  redirect(`/admin/import?imported=${imported}`);
}
