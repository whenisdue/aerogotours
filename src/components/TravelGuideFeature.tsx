import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { TravelGuide } from "../data/travelGuides";
import { EditorialPhoto } from "./EditorialPhoto";

export function TravelGuideFeature({ guide }: { guide: TravelGuide }) {
  return <article className="guide-feature">
    <Link className="guide-feature__link" to={guide.path}>
      <div className="guide-feature__image">{guide.image === "japan-tax-refund" ? <div className="guide-feature__tax-art" role="img" aria-label={guide.imageAlt}><span>JAPAN / SHOPPING GUIDE</span><strong>01 NOV 2026</strong><small>PAY FIRST → CUSTOMS → REFUND</small></div> : <EditorialPhoto image={guide.image} alt={guide.imageAlt} />}</div>
      <div className="guide-feature__copy">
        <span className="discovery-eyebrow">{guide.destination} · Visitor guide</span>
        <h2>{guide.title}</h2>
        <p>{guide.summary}</p>
        <span className="discovery-read">Read the guide <ArrowUpRight size={19} aria-hidden="true" /></span>
        {guide.topics?.length ? <span className="guide-feature__topics">{guide.topics.join(" · ")}</span> : null}
      </div>
    </Link>
  </article>;
}
