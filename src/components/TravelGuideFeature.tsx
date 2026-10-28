import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { TravelGuide } from "../data/travelGuides";
import { EditorialPhoto } from "./EditorialPhoto";

export function TravelGuideFeature({ guide }: { guide: TravelGuide }) {
  return <article className={`guide-feature${guide.image === "mexico-day-of-dead-zocalo" ? " guide-feature--mexico" : ""}`}>
    <figure className="guide-feature__figure">
      <Link className="guide-feature__image" to={guide.path} aria-label={`Read ${guide.title}`}>
        {guide.image === "japan-tax-refund" ? <div className="guide-feature__tax-art" role="img" aria-label={guide.imageAlt}><span>JAPAN / SHOPPING GUIDE</span><strong>01 NOV 2026</strong><small>PAY FIRST → CUSTOMS → REFUND</small></div> : <EditorialPhoto image={guide.image} imageSrc={guide.imageSrc} alt={guide.imageAlt} />}
      </Link>
      {guide.imageCredit && <figcaption className="guide-feature__credit">
        Photo by <a href={guide.imageCredit.authorUrl} target="_blank" rel="noopener noreferrer">{guide.imageCredit.author}</a> via <a href={guide.imageCredit.sourceUrl} target="_blank" rel="noopener noreferrer">{guide.imageCredit.sourceName}</a> · <a href={guide.imageCredit.licenseUrl} target="_blank" rel="noopener noreferrer">{guide.imageCredit.license}</a>. {guide.imageCredit.note}
      </figcaption>}
    </figure>
    <div className="guide-feature__copy">
      <span className="discovery-eyebrow">{guide.destination} · Visitor guide</span>
      <h2><Link to={guide.path}>{guide.title}</Link></h2>
      <p>{guide.summary}</p>
      <Link className="discovery-read" to={guide.path}>Read the guide <ArrowUpRight size={19} aria-hidden="true" /></Link>
      {guide.topics?.length ? <span className="guide-feature__topics">{guide.topics.join(" · ")}</span> : null}
    </div>
  </article>;
}
