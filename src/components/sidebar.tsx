import { Link } from 'waku';
import { NavLinks } from './nav-links';

type SidebarProps = {
  siteTitle: string;
};

export const Sidebar = ({ siteTitle }: SidebarProps) => {
  return (
    <aside className="site-sidebar">
      <header className="site-sidebar-header">
        <Link to="/" className="site-title-link">
          {siteTitle}
        </Link>
      </header>
      <nav className="site-sidebar-nav">
        <NavLinks />
      </nav>
    </aside>
  );
};
