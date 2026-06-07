import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { unstable_cache } from "next/cache";

const postsDirectory = path.join(process.cwd(), "src/content");
const markdownExtension = /\.md$/i;
const excerptMaxLength = 120;

// ISR/cached index refresh interval: 5 minutes.
export const POSTS_REVALIDATE_SECONDS = 300;
export const POSTS_CACHE_TAG = "posts";

export type PostMeta = {
  title: string;
  date?: string;
  tags: string[];
  excerpt: string;
};

export type PostSummary = {
  slug: string;
  meta: PostMeta;
};

type PostIndexEntry = {
  slug: string;
  sourceSlug: string;
  filePath: string;
  meta: PostMeta;
};

export type PostDetail = PostSummary & {
  sourceSlug: string;
  content: string;
};

function normalizeSlug(frontmatterSlug: unknown, fallbackSlug: string): string {
  if (typeof frontmatterSlug !== "string") {
    return fallbackSlug;
  }

  const normalized = frontmatterSlug.trim().replace(/^\/+|\/+$/g, "");
  return normalized || fallbackSlug;
}

function normalizeTitle(title: unknown, fallbackTitle: string): string {
  if (typeof title === "string" && title.trim()) {
    return title.trim();
  }

  return fallbackTitle;
}

function normalizeDate(date: unknown): string | undefined {
  if (typeof date === "string" && date.trim()) {
    return date.trim();
  }

  return undefined;
}

function normalizeTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags
    .filter((tag): tag is string => typeof tag === "string")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

function normalizeExcerpt(excerpt: unknown, content: string): string {
  if (typeof excerpt === "string" && excerpt.trim()) {
    return excerpt.trim();
  }

  const plainText = content.replace(/\s+/g, " ").trim();

  if (plainText.length <= excerptMaxLength) {
    return plainText;
  }

  return `${plainText.slice(0, excerptMaxLength)}...`;
}

function buildMeta(data: Record<string, unknown>, content: string, sourceSlug: string): PostMeta {
  return {
    title: normalizeTitle(data.title, sourceSlug),
    date: normalizeDate(data.date),
    tags: normalizeTags(data.tags),
    excerpt: normalizeExcerpt(data.excerpt, content),
  };
}

async function readAllMarkdownFiles(): Promise<string[]> {
  const fileNames = await fs.readdir(postsDirectory);

  return fileNames
    .filter((fileName) => markdownExtension.test(fileName))
    .sort((a, b) => a.localeCompare(b));
}

async function buildPostIndex(): Promise<PostIndexEntry[]> {
  const markdownFiles = await readAllMarkdownFiles();
  const posts = await Promise.all(
    markdownFiles.map(async (fileName) => {
      const sourceSlug = fileName.replace(markdownExtension, "");
      const filePath = path.join(postsDirectory, fileName);
      const fileContents = await fs.readFile(filePath, "utf8");
      const { data, content } = matter(fileContents);
      const frontmatter = data as Record<string, unknown>;
      const slug = normalizeSlug(frontmatter.slug, sourceSlug);

      return {
        slug,
        sourceSlug,
        filePath,
        meta: buildMeta(frontmatter, content, sourceSlug),
      } satisfies PostIndexEntry;
    }),
  );

  const seen = new Map<string, string>();
  for (const post of posts) {
    const existingFilePath = seen.get(post.slug);
    if (existingFilePath) {
      throw new Error(
        `Duplicate slug "${post.slug}" detected in ${existingFilePath} and ${post.filePath}`,
      );
    }

    seen.set(post.slug, post.filePath);
  }

  return posts;
}

function safeDecodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

const getCachedPostIndex = unstable_cache(
  async () => buildPostIndex(),
  ["posts:index:v1"],
  {
    revalidate: POSTS_REVALIDATE_SECONDS,
    tags: [POSTS_CACHE_TAG],
  },
);

const getCachedPostBySlug = unstable_cache(
  async (requestedSlug: string) => {
    const decodedRequestedSlug = safeDecodeSlug(requestedSlug).trim();
    const posts = await getCachedPostIndex();
    const matchedPost =
      posts.find((post) => post.slug === decodedRequestedSlug) ??
      posts.find((post) => post.sourceSlug === decodedRequestedSlug);

    if (!matchedPost) {
      return null;
    }

    const fileContents = await fs.readFile(matchedPost.filePath, "utf8");
    const { data, content } = matter(fileContents);
    const frontmatter = data as Record<string, unknown>;

    return {
      slug: matchedPost.slug,
      sourceSlug: matchedPost.sourceSlug,
      content,
      meta: buildMeta(frontmatter, content, matchedPost.sourceSlug),
    } satisfies PostDetail;
  },
  ["posts:detail:v1"],
  {
    revalidate: POSTS_REVALIDATE_SECONDS,
    tags: [POSTS_CACHE_TAG],
  },
);

async function getPostIndex(): Promise<PostIndexEntry[]> {
  try {
    return await getCachedPostIndex();
  } catch {
    return buildPostIndex();
  }
}

async function getPostDetailBySlug(requestedSlug: string): Promise<PostDetail | null> {
  try {
    return await getCachedPostBySlug(requestedSlug);
  } catch {
    const decodedRequestedSlug = safeDecodeSlug(requestedSlug).trim();
    const posts = await buildPostIndex();
    const matchedPost =
      posts.find((post) => post.slug === decodedRequestedSlug) ??
      posts.find((post) => post.sourceSlug === decodedRequestedSlug);

    if (!matchedPost) {
      return null;
    }

    const fileContents = await fs.readFile(matchedPost.filePath, "utf8");
    const { data, content } = matter(fileContents);
    const frontmatter = data as Record<string, unknown>;

    return {
      slug: matchedPost.slug,
      sourceSlug: matchedPost.sourceSlug,
      content,
      meta: buildMeta(frontmatter, content, matchedPost.sourceSlug),
    };
  }
}

export async function getAllPosts(): Promise<PostSummary[]> {
  const posts = await getPostIndex();

  return posts.map((post) => ({
    slug: post.slug,
    meta: post.meta,
  }));
}

export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await getPostIndex();
  return posts.map((post) => post.slug);
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  return getPostDetailBySlug(slug);
}
