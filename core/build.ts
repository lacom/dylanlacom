import { getAllPosts, getPostSlugs } from './posts';
import { siteConfig, staticRoutes } from './routes';

export type ExpandedRoute =
  | {
      kind: 'static';
      id: 'home' | 'about' | 'contact' | 'rss' | 'sitemap';
      path: string;
    }
  | {
      kind: 'post';
      id: 'post';
      path: string;
      params: { slug: string };
      updatedAt: string;
    };

export const getPostPath = (slug: string) => `/${slug}`;

export const expandRoutes = async (): Promise<ExpandedRoute[]> => {
  const posts = await getAllPosts();

  return [
    ...staticRoutes.map((route) => ({
      kind: 'static' as const,
      id: route.id,
      path: route.path,
    })),
    ...posts.map((post) => ({
      kind: 'post' as const,
      id: 'post' as const,
      path: getPostPath(post.slug),
      params: { slug: post.slug },
      updatedAt: post.date,
    })),
  ];
};

export const getPostStaticPaths = async () => {
  return getPostSlugs();
};

const xmlEscape = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const cdata = (value: string) => `<![CDATA[${value.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;

const ensureTrailingSlash = (path: string) => {
  if (path === '/') {
    return '/';
  }
  if (path.endsWith('.xml')) {
    return path;
  }
  return path.endsWith('/') ? path : `${path}/`;
};

export const buildRssXml = async () => {
  const posts = await getAllPosts();
  const itemXml = posts
    .map((post) => {
      const permalink = `${siteConfig.siteUrl}${ensureTrailingSlash(getPostPath(post.slug))}`;
      const publishDate = new Date(post.date).toUTCString();

      return [
        '<item>',
        `<title>${cdata(post.title)}</title>`,
        `<link>${xmlEscape(permalink)}</link>`,
        `<guid isPermaLink="false">${xmlEscape(permalink)}</guid>`,
        `<pubDate>${xmlEscape(publishDate)}</pubDate>`,
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

export const buildSitemapXml = async () => {
  const routes = await expandRoutes();

  const urlXml = routes
    .filter(
      (route) =>
        route.kind === 'post' ||
        (route.kind === 'static' &&
          (route.id === 'home' || route.id === 'about' || route.id === 'contact'))
    )
    .map((route) => {
      const loc = `${siteConfig.siteUrl}${ensureTrailingSlash(route.path)}`;
      const lastmod = route.kind === 'post' ? new Date(route.updatedAt).toISOString() : undefined;

      return [
        '<url>',
        `<loc>${xmlEscape(loc)}</loc>`,
        lastmod ? `<lastmod>${xmlEscape(lastmod)}</lastmod>` : '',
        '</url>',
      ].join('');
    })
    .join('');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlXml,
    '</urlset>',
  ].join('');
};
