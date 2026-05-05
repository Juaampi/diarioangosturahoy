import sanitizeHtml from "sanitize-html";

export type PostContentBlock = {
  paragraph: string;
  imageUrl?: string | null;
};

export function normalizePostContentBlocks(input: FormDataEntryValue | null) {
  if (typeof input !== "string" || !input.trim().length) {
    return null;
  }

  try {
    const parsed = JSON.parse(input) as Array<{ paragraph?: string; imageUrl?: string | null }>;
    const normalized = parsed
      .map((block) => ({
        paragraph: sanitizeHtml(String(block?.paragraph || "").trim(), {
          allowedTags: [],
          allowedAttributes: {},
        }),
        imageUrl: typeof block?.imageUrl === "string" ? block.imageUrl.trim() || null : null,
      }))
      .filter((block) => block.paragraph.length)
      .slice(0, 10);

    return normalized.length ? JSON.stringify(normalized) : null;
  } catch {
    return null;
  }
}

export function parsePostContentBlocks(post: {
  content?: string | null;
  contentBlocksJson?: string | null;
}) {
  if (post.contentBlocksJson) {
    try {
      const parsed = JSON.parse(post.contentBlocksJson) as PostContentBlock[];
      const normalized = parsed
        .map((block) => ({
          paragraph: String(block?.paragraph || "").trim(),
          imageUrl: typeof block?.imageUrl === "string" ? block.imageUrl.trim() || null : null,
        }))
        .filter((block) => block.paragraph.length)
        .slice(0, 10);

      if (normalized.length) {
        return normalized;
      }
    } catch {}
  }

  if (post.content?.trim()) {
    return [
      {
        paragraph: sanitizeHtml(post.content, {
          allowedTags: [],
          allowedAttributes: {},
        }).trim(),
        imageUrl: null,
      },
    ].filter((block) => block.paragraph.length);
  }

  return [];
}

export function contentBlocksToPlainText(blocks: PostContentBlock[]) {
  return blocks
    .map((block) => block.paragraph.trim())
    .filter(Boolean)
    .join("\n\n");
}
