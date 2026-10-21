import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { Brand } from "./Brand";
import "./EditorialFoundation.css";
import "./SiteHeader.css";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const isPlanningRoute = pathname === "/trip-planner" || pathname.startsWith("/dream/");
  const sectionLink = (section: string) => pathname === "/" ? section : `/${section}`;

  useEffect(() => {
    if (!menuOpen) return;
    nav.current?.querySelector<HTMLAnchorElement>(isPlanningRoute ? "a" : ".site-nav__more a")?.focus();
    if (!isPlanningRoute) return;
    const closeOnResize = () => {
      if (window.innerWidth > 700) setMenuOpen(false);
    };
    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, [isPlanningRoute, menuOpen]);

  const handleMenuKey = (event: KeyboardEvent<HTMLElement>) => {
    if (!menuOpen) return;
    if (event.key === "Escape") {
      setMenuOpen(false);
      menuButton.current?.focus();
    } else if (isPlanningRoute && event.key === "Tab") {
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

  if (isPlanningRoute) return <header className="site-header site-header--legacy" onKeyDown={handleMenuKey}>
    <div className="site-header__inner page-shell">
      <Brand onClick={() => setMenuOpen(false)} />
      <button ref={menuButton} className="menu-toggle" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-controls="main-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
        {menuOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
      </button>
      <nav ref={nav} id="main-navigation" className={`site-nav${menuOpen ? " site-nav--open" : ""}`} aria-label="Main navigation">
        <Link className="site-nav__guides" to="/guides" aria-current={pathname.startsWith("/guides") ? "page" : undefined} onClick={() => closeMenu()}>Travel Guides</Link>
        <Link to={sectionLink("#travel-updates")} onClick={() => closeMenu("#travel-updates")}>Travel Updates</Link>
        <Link to="/trip-planner" aria-current={pathname === "/trip-planner" ? "page" : undefined} onClick={() => closeMenu()}>Build a free itinerary</Link>
        <Link className="site-nav__secondary" to="/companion" onClick={() => closeMenu()}>Trip Companion</Link>
        <Link className="site-nav__cta" to={sectionLink("#inquiry")} onClick={() => closeMenu("#inquiry")}>Plan with AeroGo</Link>
        <Link className="site-nav__mobile" to={sectionLink("#how-it-works")} onClick={() => closeMenu("#how-it-works")}>How it works</Link>
        <Link className="site-nav__mobile" to={sectionLink("#services")} onClick={() => closeMenu("#services")}>What we help with</Link>
      </nav>
    </div>
  </header>;

  return <header className="site-header site-header--editorial editorial-foundation" onKeyDown={handleMenuKey}>
    <div className="site-header__inner">
      <Brand editorial onClick={() => setMenuOpen(false)} />
    </div>
    <div className="site-header__nav-shell">
      <nav ref={nav} id="main-navigation" className="site-nav" aria-label="Main navigation">
        <Link to="/" aria-current={pathname === "/" ? "page" : undefined} onClick={() => closeMenu()}>Discover</Link>
        <Link to="/travel-updates" aria-current={pathname.startsWith("/travel-updates") ? "page" : undefined} onClick={() => closeMenu()}>Travel News</Link>
        <Link to="/guides" aria-current={pathname.startsWith("/guides") ? "page" : undefined} onClick={() => closeMenu()}>Guides</Link>
        <div id="more-navigation" className={`site-nav__more${menuOpen ? " is-open" : ""}`}>
          <Link to="/trip-planner" onClick={() => closeMenu()}>Build a free itinerary</Link>
          <Link to="/companion" onClick={() => closeMenu()}>Trip Companion</Link>
          <Link to={sectionLink("#inquiry")} onClick={() => closeMenu("#inquiry")}>Plan with AeroGo</Link>
          <Link to={sectionLink("#how-it-works")} onClick={() => closeMenu("#how-it-works")}>How it works</Link>
          <Link to={sectionLink("#services")} onClick={() => closeMenu("#services")}>What we help with</Link>
        </div>
      </nav>
      <button ref={menuButton} className="menu-toggle" type="button" aria-label={menuOpen ? "Close more navigation" : "Open more navigation"} aria-controls="more-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
        {menuOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
      </button>
    </div>
  </header>;
}
