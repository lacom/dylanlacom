import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

const rootDir = process.cwd();
const postsDir = path.join(rootDir, 'content', 'posts');
const publicDir = path.join(rootDir, 'public');

const siteConfig = {
  title: 'Dylan La Com',
  description: "Dylan La Com's website",
  siteUrl: 'https://www.dylanla.com',
};

const postFilenamePattern = /^(\d{4}-\d{2}-\d{2})-([a-z0-9-]+)\.md$/;
const markdownRenderer = new MarkdownIt({ html: true, linkify: true, typographer: false });

const xmlEscape = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const cdata = (value) => `<![CDATA[${value.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;

const ensureTrailingSlash = (value) => {
  if (value === '/') {
    return '/';
  }

  return value.endsWith('/') ? value : `${value}/`;
};

const readPosts = async () => {
  const files = await readdir(postsDir);
  const posts = [];

  for (const filename of files) {
    const match = filename.match(postFilenamePattern);
    if (!match) {
      continue;
    }

    const [, fallbackDate, slug] = match;
    const filePath = path.join(postsDir, filename);
    const raw = await readFile(filePath, 'utf8');
    const { data, content } = matter(raw);

    if (!data.title || typeof data.title !== 'string') {
      throw new Error(`Missing title in ${filePath}`);
    }

    if (data.draft) {
      continue;
    }

    const dateValue = typeof data.date === 'string' ? data.date : `${fallbackDate}T00:00:00.000Z`;

    posts.push({
      slug,
      title: data.title,
      date: new Date(dateValue).toISOString(),
      html: markdownRenderer.render(content),
    });
  }

  posts.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf());
  return posts;
};

const buildRssXml = async (posts) => {
  const itemXml = posts
    .map((post) => {
      const permalink = `${siteConfig.siteUrl}${ensureTrailingSlash(`/${post.slug}`)}`;
      return [
        '<item>',
        `<title>${cdata(post.title)}</title>`,
        `<link>${xmlEscape(permalink)}</link>`,
        `<guid isPermaLink="false">${xmlEscape(permalink)}</guid>`,
        `<pubDate>${xmlEscape(new Date(post.date).toUTCString())}</pubDate>`,
        `<content:encoded>${cdata(post.html)}</content:encoded>`,
        '</item>',
      ].join('');
    })
    .join('');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">',
    '<channel>',
    `<title>${cdata(`${siteConfig.title}' website RSS feed`)}</title>`,
    `<description>${cdata(siteConfig.description)}</description>`,
    `<link>${xmlEscape(siteConfig.siteUrl)}</link>`,
    '<generator>Waku</generator>',
    `<lastBuildDate>${xmlEscape(new Date().toUTCString())}</lastBuildDate>`,
    itemXml,
    '</channel>',
    '</rss>',
  ].join('');
};

const buildSitemapXml = async (posts) => {
  const staticPaths = ['/', '/about', '/contact'];
  const postPaths = posts.map((post) => `/${post.slug}`);

  const urlXml = [...staticPaths, ...postPaths]
    .map((pathname) => {
      const loc = `${siteConfig.siteUrl}${ensureTrailingSlash(pathname)}`;
      return `<url><loc>${xmlEscape(loc)}</loc></url>`;
    })
    .join('');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlXml,
    '</urlset>',
  ].join('');
};

const main = async () => {
  const posts = await readPosts();

  const rssXml = await buildRssXml(posts);
  const sitemapXml = await buildSitemapXml(posts);

  await Promise.all([
    writeFile(path.join(publicDir, 'rss.xml'), rssXml, 'utf8'),
    writeFile(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8'),
  ]);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
