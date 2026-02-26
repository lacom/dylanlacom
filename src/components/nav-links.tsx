'use client';

import { Link, useRouter } from 'waku';

type NavLinksProps = {
  onNavigate?: () => void;
};

const normalizePath = (value: string) => {
  if (value === '/') {
    return '/';
  }

  return value.replace(/\/+$/, '');
};

export const NavLinks = ({ onNavigate }: NavLinksProps) => {
  const router = useRouter();
  const currentPath = normalizePath(router.path);

  const isActive = (href: '/about' | '/contact') => currentPath === normalizePath(href);

  return (
    <span>
      <Link
        to="/about"
        title="About"
        className={`site-nav-link ${isActive('/about') ? 'is-active' : ''}`}
        onClick={onNavigate}
      >
        About
      </Link>
      <Link
        to="/contact"
        title="Contact"
        className={`site-nav-link ${isActive('/contact') ? 'is-active' : ''}`}
        onClick={onNavigate}
      >
        Contact
      </Link>
      <a href="/rss.xml" title="RSS" className="site-nav-link secondary" onClick={onNavigate}>
        rss
      </a>
    </span>
  );
};
