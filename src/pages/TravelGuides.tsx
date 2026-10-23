import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { EditorialFooter } from "../components/EditorialFooter";
import { TravelGuideFeature } from "../components/TravelGuideFeature";
import { travelGuides } from "../data/travelGuides";
import "./Discovery.css";
import "./TravelGuides.css";

export function TravelGuidesPage() {
  return <div className="public-site guides-directory editorial-foundation">
    <SiteHeader />
    <main className="page-shell guides-directory__main">
      <header className="guides-directory__heading">
        <h1>Travel Guides</h1>
        <span>Practical visitor information</span>
      </header>
      <div className="guides-directory__list">{travelGuides.map((guide) => <TravelGuideFeature key={guide.path} guide={guide} />)}</div>
      {travelGuides.length === 1 && travelGuides[0].destinationPath && <div className="guides-directory__more">
        <p>Explore the place behind the guide.</p>
        <Link to={travelGuides[0].destinationPath}>Discover {travelGuides[0].destination} <span aria-hidden="true">↗</span></Link>
      </div>}
    </main>
    <EditorialFooter editorial />
  </div>;
}
