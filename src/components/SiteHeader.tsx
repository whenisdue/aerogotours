import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { Brand } from "./Brand";
import "./SiteHeader.css";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const sectionLink = (section: string) => pathname === "/" ? section : `/${section}`;

  useEffect(() => {
    if (!menuOpen) return;
    nav.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const closeOnResize = () => {
      if (window.innerWidth > 700) setMenuOpen(false);
    };
    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, [menuOpen]);

  const handleMenuKey = (event: KeyboardEvent<HTMLElement>) => {
    if (!menuOpen) return;
    if (event.key === "Escape") {
      setMenuOpen(false);
      menuButton.current?.focus();
    } else if (event.key === "Tab") {
      const links = nav.current?.querySelectorAll<HTMLAnchorElement>("a");
      const first = links?.[0];
      const last = links?.[links.length - 1];
      if (event.shiftKey && document.activeElement === menuButton.current) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        menuButton.current?.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        menuButton.current?.focus();
      }
    }
  };

  const closeMenu = (hash?: string) => {
    setMenuOpen(false);
    if (menuOpen) menuButton.current?.focus({ preventScroll: true });
    if (hash && pathname === "/") {
      // Move focus with in-page navigation, including the existing updates anchor.
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
      }
    }
  };

  return <header className="site-header site-header--editorial" onKeyDown={handleMenuKey}>
    <div className="site-header__inner page-shell">
      <Brand onClick={() => setMenuOpen(false)} />
      <button ref={menuButton} className="menu-toggle" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-controls="main-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
        {menuOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
      </button>
      <nav ref={nav} id="main-navigation" className={`site-nav${menuOpen ? " site-nav--open" : ""}`} aria-label="Main navigation">
        <Link className="site-nav__guides" to="/guides" aria-current={pathname.startsWith("/guides") ? "page" : undefined} onClick={() => closeMenu()}>Travel Guides</Link>
        <Link to={sectionLink("#travel-updates")} onClick={() => closeMenu("#travel-updates")}>Travel Updates</Link>
        <Link className="site-nav__secondary" to="/companion" onClick={() => closeMenu()}>The Companion</Link>
        <Link className="site-nav__secondary" to={sectionLink("#inquiry")} onClick={() => closeMenu("#inquiry")}>Plan my trip</Link>
        <Link className="site-nav__mobile" to={sectionLink("#how-it-works")} onClick={() => closeMenu("#how-it-works")}>How it works</Link>
        <Link className="site-nav__mobile" to={sectionLink("#services")} onClick={() => closeMenu("#services")}>What we help with</Link>
      </nav>
    </div>
  </header>;
}
