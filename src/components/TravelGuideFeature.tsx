import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { TravelGuide } from "../data/travelGuides";
import { EditorialPhoto } from "./EditorialPhoto";

export function TravelGuideFeature({ guide }: { guide: TravelGuide }) {
  return <article className="guide-feature">
    <Link className="guide-feature__link" to={guide.path}>
      <div className="guide-feature__image"><EditorialPhoto image={guide.image} alt={guide.imageAlt} /></div>
      <div className="guide-feature__copy">
        <span className="discovery-eyebrow">{guide.destination} · Visitor guide</span>
        <h2>{guide.title}</h2>
        <p>{guide.summary}</p>
        <span className="discovery-read">Read the guide <ArrowUpRight size={19} aria-hidden="true" /></span>
        <span className="guide-feature__topics">Free &amp; ticketed areas · Conservatories · Day into night</span>
      </div>
    </Link>
  </article>;
}
