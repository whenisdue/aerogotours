import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { Brand } from "./Brand";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header__inner page-shell">
        <Brand onClick={() => setMenuOpen(false)} />
        <button className="menu-toggle" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={`site-nav${menuOpen ? " site-nav--open" : ""}`} aria-label="Main navigation">
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#services" onClick={() => setMenuOpen(false)}>What we help with</a>
          <a href="#companion" onClick={() => setMenuOpen(false)}>The Companion</a>
          <a className="site-nav__cta" href="#inquiry" onClick={() => setMenuOpen(false)}>Plan my trip <ArrowUpRight size={15} /></a>
        </nav>
      </div>
    </header>
  );
}
