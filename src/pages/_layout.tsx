import '../styles.css';

import type { ReactNode } from 'react';
import { siteConfig } from '../../core/routes';
import { MobileHeader } from '../components/mobile-header';
import { Sidebar } from '../components/sidebar';

type RootLayoutProps = {
  children: ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="site-layout-container">
      <meta name="description" content={siteConfig.description} />
      <link rel="icon" type="image/png" href="/images/favicon.png" />
      <link rel="alternate" type="application/rss+xml" title={`${siteConfig.title} website RSS feed`} href="/rss.xml" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Merriweather:700|Source+Sans+Pro:400,400i,700"
        precedence="font"
      />

      <MobileHeader siteTitle={siteConfig.title} />

      <div className="site-content-layout">
        <Sidebar siteTitle={siteConfig.title} />
        <main className="site-content">{children}</main>
      </div>

      <footer className="site-footer">
        <div>
          &copy; {new Date().getFullYear()} {siteConfig.title}
        </div>
      </footer>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
