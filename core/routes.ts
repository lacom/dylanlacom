export const siteConfig = {
  title: 'Dylan La Com',
  description: "Dylan La Com's website",
  siteUrl: 'https://www.dylanla.com',
};

export type StaticRoute = {
  id: 'home' | 'about' | 'contact' | 'rss' | 'sitemap';
  path: '/' | '/about' | '/contact' | '/rss.xml' | '/sitemap.xml';
};

export type DynamicRoute = {
  id: 'post';
  pattern: '/:slug';
};

export const staticRoutes: StaticRoute[] = [
  { id: 'home', path: '/' },
  { id: 'about', path: '/about' },
  { id: 'contact', path: '/contact' },
  { id: 'rss', path: '/rss.xml' },
  { id: 'sitemap', path: '/sitemap.xml' },
];

export const dynamicRoutes: DynamicRoute[] = [
  { id: 'post', pattern: '/:slug' },
];

export const primaryNavigation = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'rss', href: '/rss.xml' },
] as const;
