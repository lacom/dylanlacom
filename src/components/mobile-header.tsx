'use client';

import { useState } from 'react';
import { Link } from 'waku';
import { NavLinks } from './nav-links';

type MobileHeaderProps = {
  siteTitle: string;
};

export const MobileHeader = ({ siteTitle }: MobileHeaderProps) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const closeMenu = () => {
    setMenuVisible(false);
  };

  return (
    <>
      <header className="mobile-header">
        <Link to="/" className="site-title-link" onClick={closeMenu}>
          {siteTitle}
        </Link>
        <button
          type="button"
          className={`mobile-menu-trigger ${menuVisible ? 'is-open' : ''}`}
          onClick={() => setMenuVisible((visible) => !visible)}
          aria-expanded={menuVisible}
          aria-controls="mobile-site-menu"
          aria-label="Toggle navigation menu"
        >
          +
        </button>
      </header>
      <div id="mobile-site-menu" className={`mobile-menu ${menuVisible ? 'is-visible' : ''}`}>
        <NavLinks onNavigate={closeMenu} />
      </div>
    </>
  );
};
