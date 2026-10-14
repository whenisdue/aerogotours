import { SiteHeader } from "../components/SiteHeader";
import { EditorialFooter } from "../components/EditorialFooter";
import { TravelGuideFeature } from "../components/TravelGuideFeature";
import { travelGuides } from "../data/travelGuides";
import "./Discovery.css";

export function TravelGuidesPage() {
  return <div className="public-site guides-directory">
    <SiteHeader />
    <main className="page-shell guides-directory__main">
      <header className="guides-directory__heading">
        <span className="discovery-eyebrow">The AeroGo travel journal</span>
        <h1>Travel Guides</h1>
        <p>A closer look at places worth exploring. Practical details, original photography, and room to find your own way.</p>
      </header>
      <div className="guides-directory__list">{travelGuides.map((guide) => <TravelGuideFeature key={guide.path} guide={guide} />)}</div>
      <p className="guides-directory__closing">Start with Singapore. We’ll add more guides here as we publish them.</p>
    </main>
    <EditorialFooter />
  </div>;
}
