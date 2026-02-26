import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');
const POST_FILENAME_PATTERN = /^(\d{4}-\d{2}-\d{2})-([a-z0-9-]+)\.md$/;

const markdownRenderer = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: false,
});

type Frontmatter = {
  title?: unknown;
  date?: unknown;
  description?: unknown;
  draft?: unknown;
  authors?: unknown;
  coverDesc?: unknown;
  featuredImage?: unknown;
  tags?: unknown;
};

export type Post = {
  slug: string;
  title: string;
  date: string;
  description?: string;
  draft: boolean;
  authors: string[];
  coverDesc?: string;
  featuredImage?: string;
  tags: string[];
  markdown: string;
  html: string;
};

export type PostSummary = Omit<Post, 'markdown' | 'html'>;

let postCachePromise: Promise<Post[]> | undefined;

const parseDate = (value: string, fallbackDate: string) => {
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.valueOf())) {
    return parsed.toISOString();
  }

  return new Date(`${fallbackDate}T00:00:00.000Z`).toISOString();
};

const firstParagraphFromMarkdown = (markdown: string) => {
  const blocks = markdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  const firstParagraph = blocks.find(
    (block) =>
      !block.startsWith('#') &&
      !block.startsWith('<') &&
      !block.startsWith('![') &&
      !block.startsWith('---')
  );

  if (!firstParagraph) {
    return undefined;
  }

  const plainText = firstParagraph
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#~-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!plainText) {
    return undefined;
  }

  return plainText.length > 220 ? `${plainText.slice(0, 217)}...` : plainText;
};

const parsePost = async (filename: string): Promise<Post | null> => {
  const match = filename.match(POST_FILENAME_PATTERN);
  if (!match) {
    return null;
  }

  const [, fallbackDate, slug] = match;
  const sourcePath = path.join(POSTS_DIR, filename);
  const raw = await readFile(sourcePath, 'utf8');

  const { data, content } = matter(raw);
  const frontmatter = data as Frontmatter;

  if (typeof frontmatter.title !== 'string' || !frontmatter.title.trim()) {
    throw new Error(`Missing or invalid title in ${sourcePath}`);
  }

  const dateValue =
    typeof frontmatter.date === 'string' && frontmatter.date.trim()
      ? frontmatter.date
      : fallbackDate;

  const authors = Array.isArray(frontmatter.authors)
    ? frontmatter.authors.filter((author): author is string => typeof author === 'string')
    : [];

  const tags = Array.isArray(frontmatter.tags)
    ? frontmatter.tags.filter((tag): tag is string => typeof tag === 'string')
    : [];

  const description =
    typeof frontmatter.description === 'string' && frontmatter.description.trim()
      ? frontmatter.description
      : firstParagraphFromMarkdown(content);

  return {
    slug,
    title: frontmatter.title.trim(),
    date: parseDate(dateValue, fallbackDate),
    description,
    draft: Boolean(frontmatter.draft),
    authors,
    coverDesc:
      typeof frontmatter.coverDesc === 'string' ? frontmatter.coverDesc : undefined,
    featuredImage:
      typeof frontmatter.featuredImage === 'string'
        ? frontmatter.featuredImage
        : undefined,
    tags,
    markdown: content,
    html: markdownRenderer.render(content),
  };
};

const loadAllPosts = async () => {
  const filenames = await readdir(POSTS_DIR);
  const posts = await Promise.all(filenames.map((filename) => parsePost(filename)));

  return posts
    .filter((post): post is Post => post !== null)
    .sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf());
};

const getCachedPosts = async () => {
  postCachePromise ??= loadAllPosts();
  return postCachePromise;
};

export const getAllPosts = async (options?: { includeDrafts?: boolean }) => {
  const includeDrafts = Boolean(options?.includeDrafts);
  const posts = await getCachedPosts();

  return includeDrafts ? posts : posts.filter((post) => !post.draft);
};

export const getPostSummaries = async (options?: { includeDrafts?: boolean }) => {
  const posts = await getAllPosts(options);
  return posts.map(({ markdown: _markdown, html: _html, ...summary }) => summary);
};

export const getPostBySlug = async (slug: string, options?: { includeDrafts?: boolean }) => {
  const posts = await getAllPosts(options);
  return posts.find((post) => post.slug === slug);
};

export const getPostSlugs = async () => {
  const posts = await getAllPosts();
  return posts.map((post) => post.slug);
};
