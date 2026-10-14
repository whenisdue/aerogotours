import { Link } from "react-router-dom";
import { Brand } from "./Brand";

export function EditorialFooter() {
  return <footer className="site-footer editorial-footer">
    <div className="page-shell editorial-footer__inner">
      <div><Brand light /><p>Travel stories. Useful guides.<br />Places worth exploring.</p></div>
      <nav aria-label="Explore AeroGo"><span>Explore</span><Link to="/guides">Travel Guides</Link><Link to="/travel-updates">Travel Updates</Link></nav>
      <nav aria-label="Destination inspiration"><span>Destinations</span><Link to="/destinations/singapore">Singapore</Link><Link to="/destinations/japan">Japan</Link><Link to="/destinations/vietnam">Vietnam</Link></nav>
      <nav aria-label="Travel planning"><span>Travel planning</span><Link to="/#inquiry">Plan my trip</Link><Link to="/#how-it-works">How it works</Link><Link to="/#services">What we help with</Link><Link to="/companion">The Companion</Link></nav>
    </div>
    <div className="page-shell editorial-footer__legal">© 2026 AeroGo Travel &amp; Tours <span>aerogotours.com</span></div>
  </footer>;
}
