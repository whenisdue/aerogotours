import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Brand } from "./Brand";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const sectionLink = (section: string) => pathname === "/" ? section : `/${section}`;

  return (
    <header className="site-header">
      <div className="site-header__inner page-shell">
        <Brand onClick={() => setMenuOpen(false)} />
        <button className="menu-toggle" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={`site-nav${menuOpen ? " site-nav--open" : ""}`} aria-label="Main navigation">
          <Link to={sectionLink("#how-it-works")} onClick={() => setMenuOpen(false)}>How it works</Link>
          <Link to={sectionLink("#services")} onClick={() => setMenuOpen(false)}>What we help with</Link>
          <Link to={sectionLink("#companion")} onClick={() => setMenuOpen(false)}>The Companion</Link>
          <Link className="site-nav__cta" to={sectionLink("#inquiry")} onClick={() => setMenuOpen(false)}>Plan my trip <ArrowUpRight size={15} /></Link>
        </nav>
      </div>
    </header>
  );
}
