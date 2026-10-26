import { ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { EditorialFooter } from "../components/EditorialFooter";
import { SiteHeader } from "../components/SiteHeader";
import { filterTravelUpdates, getActiveTravelUpdates, getArchivedTravelUpdates, getTravelUpdateBySlug, isArchivedTravelUpdate, type TravelUpdate, type TravelUpdateCategory } from "../data/travelUpdates";
import { buildTravelNewsStructuredData } from "../utils/newsSeo";
import { SITE_ORIGIN } from "../utils/siteMetadata";
import "./TravelNews.css";

const categoryLabels: Record<TravelUpdateCategory, string> = {
  "events-experiences": "Events & experiences",
  "food-experiences": "Food & experiences",
  "flights-airports": "Flights & airports",
  "travel-requirements": "Travel requirements",
  "deals-savings": "Deals & savings",
  "destination-tips": "Destination tips",
};

const formatDate = (date: string) => new Intl.DateTimeFormat("en-GB", {
  day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Manila",
}).format(new Date(`${date.slice(0, 10)}T00:00:00+08:00`));

const articlePath = (update: TravelUpdate) => `/travel-updates/${update.slug}`;
const isEventStory = (update: TravelUpdate) => update.category === "events-experiences" || update.category === "food-experiences";

function StoryLabel({ update, past = false }: { update: TravelUpdate; past?: boolean }) {
  return <div className="news-story-label">
    <span>{categoryLabels[update.category]}</span>
    <span>{update.destination}</span>
    {past && <span className="news-story-label__past">{isEventStory(update) ? "Past event" : "Archived update"}</span>}
  </div>;
}

export function TravelUpdatesPage() {
  const [searchParams] = useSearchParams();
  const archived = searchParams.get("view") === "archive";
  const [destinationFilter, setDestinationFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState<TravelUpdateCategory | "all">("all");
  const [visibleCount, setVisibleCount] = useState(12);
  const updates = archived ? getArchivedTravelUpdates() : getActiveTravelUpdates();
  const destinations = [...new Set(updates.map((update) => update.destination))].sort();
  const filtered = filterTravelUpdates(updates, destinationFilter, categoryFilter);
  const visible = filtered.slice(0, visibleCount);
  const [lead, ...remaining] = visible;
  const supporting = remaining.slice(0, 2);
  const moreStories = remaining.slice(2);
  const resetFilters = () => { setDestinationFilter("all"); setCategoryFilter("all"); setVisibleCount(12); };

  return <div id="travel-news" className="public-site travel-updates-site editorial-foundation">
    <SiteHeader />
    <main className="news-shell">
      <header className="news-listing-header">
        <h1 id="travel-news-title">Travel News</h1>
        <span>{archived ? "Past events & archive" : "Latest published stories"}</span>
      </header>

      <section className="news-listing" aria-labelledby="travel-news-title">
        {lead && <div className="news-lead-layout">
          <NewsLead key={lead.slug} update={lead} past={archived} />
          {supporting.length > 0 && <aside className="news-headlines" aria-labelledby="news-headlines-title">
            <h2 id="news-headlines-title">More headlines</h2>
            {supporting.map((update) => <NewsTeaser key={update.id} update={update} past={archived} />)}
          </aside>}
        </div>}
        <div className="news-browse">
          <div className="news-browse__heading">
            <h2>{archived ? "Browse the archive" : "Browse more stories"}</h2>
            <nav className="news-view-switch" aria-label="Travel news sections">
            <Link to="/travel-updates" aria-current={!archived ? "page" : undefined} onClick={resetFilters}>Latest</Link>
            <Link to="/travel-updates?view=archive" aria-current={archived ? "page" : undefined} onClick={resetFilters}>Past events & archive</Link>
            </nav>
          </div>
          {archived && <p className="news-browse__note">These time-limited updates are kept as a historical record. Check official sources for current details.</p>}
        </div>
        <div className="news-filters" aria-label="Filter travel news">
          <label>Destination
            <select value={destinations.includes(destinationFilter) ? destinationFilter : "all"} onChange={(event) => { setDestinationFilter(event.target.value); setVisibleCount(12); }}>
              <option value="all">All destinations</option>
              {destinations.map((destination) => <option key={destination} value={destination}>{destination}</option>)}
            </select>
          </label>
          <label>Category
            <select value={categoryFilter} onChange={(event) => { setCategoryFilter(event.target.value as TravelUpdateCategory | "all"); setVisibleCount(12); }}>
              <option value="all">All categories</option>
              {Object.entries(categoryLabels).map(([category, label]) => <option key={category} value={category}>{label}</option>)}
            </select>
          </label>
          <span className="news-filters__count" aria-live="polite">{filtered.length} {filtered.length === 1 ? "story" : "stories"}</span>
        </div>
        {lead ? <>
          {moreStories.length > 0 && <div className="news-story-list">{moreStories.map((update) => <NewsRow key={update.id} update={update} past={archived} />)}</div>}
          {visibleCount < filtered.length && <button className="news-load-more" type="button" onClick={() => setVisibleCount((count) => count + 12)}>Show more stories <span>({visible.length} of {filtered.length})</span> <ArrowRight size={17} aria-hidden="true" /></button>}
        </> : <p className="news-empty">No stories match those filters. Try another destination or category.</p>}
      </section>
    </main>
    <EditorialFooter editorial />
  </div>;
}

function NewsTeaser({ update, past }: { update: TravelUpdate; past: boolean }) {
  return <article className="news-teaser">
    <StoryLabel update={update} past={past} />
    <h3><Link to={articlePath(update)}>{update.headline}</Link></h3>
    <p>{update.summary}</p>
    <time dateTime={update.publishedAt}>Published {formatDate(update.publishedAt)}</time>
  </article>;
}

function NewsLead({ update, past }: { update: TravelUpdate; past: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);
  const isGraphic = /graphic|diagram|map/i.test(update.image.alt);
  return <article className={`news-lead${imageFailed || !update.image?.src ? " news-lead--text-only" : ""}`}>
    {update.image?.src && !imageFailed && <Link className={`news-lead__image${isGraphic ? " news-lead__image--graphic" : ""}`} to={articlePath(update)} aria-label={`Read ${update.headline}`}><img src={update.image.src} width="1440" height="720" alt={update.image.alt} loading="eager" decoding="async" fetchPriority="high" onError={() => setImageFailed(true)} /></Link>}
    <div className="news-lead__copy">
      <StoryLabel update={update} past={past} />
      <h2><Link to={articlePath(update)}>{update.headline}</Link></h2>
      {update.summary && <p>{update.summary}</p>}
      <div className="news-story-foot"><span>Published <time dateTime={update.publishedAt}>{formatDate(update.publishedAt)}</time></span><Link to={articlePath(update)}>Read story <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
    </div>
  </article>;
}

function NewsRow({ update, past }: { update: TravelUpdate; past: boolean }) {
  return <article className="news-row">
    <div>
      <StoryLabel update={update} past={past} />
      <h3><Link to={articlePath(update)}>{update.headline}</Link></h3>
      {update.summary && <p>{update.summary}</p>}
    </div>
    <div className="news-row__end"><span>Published <time dateTime={update.publishedAt}>{formatDate(update.publishedAt)}</time></span><Link to={articlePath(update)} aria-label={`Read ${update.headline}`}><ArrowRight size={20} aria-hidden="true" /></Link></div>
  </article>;
}

export function TravelUpdateArticlePage() {
  const { slug } = useParams();
  const update = getTravelUpdateBySlug(slug);

  useEffect(() => {
    if (!update) return;
    const structuredData = document.head.querySelector<HTMLScriptElement>('script[data-aerogo-news-schema]') ?? document.head.appendChild(document.createElement("script"));
    structuredData.type = "application/ld+json";
    structuredData.dataset.aerogoNewsSchema = "";
    const socialImageOrigin = window.location.hostname.endsWith(".vercel.app") ? window.location.origin : SITE_ORIGIN;
    structuredData.textContent = JSON.stringify(buildTravelNewsStructuredData(update, SITE_ORIGIN, socialImageOrigin));
    window.dispatchEvent(new Event("aerogo:metadata-ready"));
    return () => structuredData.remove();
  }, [update]);

  if (!update) return <TravelUpdateNotFound />;

  const past = isArchivedTravelUpdate(update);
  const sourceDates = update.sources.map((source) => source.recheckedAt ?? source.accessedAt).filter((date): date is string => Boolean(date));
  const commonSourceDate = sourceDates.length === update.sources.length && sourceDates.every((date) => date === sourceDates[0]) ? sourceDates[0] : undefined;
  const related = getActiveTravelUpdates().filter((item) => item.slug !== update.slug && (item.destination === update.destination || item.category === update.category)).slice(0, 2);
  const isSaipanRoute = update.slug === "pal-manila-saipan-flights-october-2026";

  return <div id="travel-news" className="public-site travel-updates-site editorial-foundation">
    <SiteHeader />
    <main className="news-shell">
      <article
        className="news-article"
        aria-labelledby="news-article-title"
        data-seo-title={update.seoTitle ?? `${update.headline} · AeroGo Travel News`}
        data-seo-description={update.seoDescription ?? update.summary}
        data-seo-image={update.socialImage === false ? undefined : update.socialImage?.src ?? update.image?.src}
        data-seo-image-alt={update.socialImage === false ? undefined : update.socialImage?.alt ?? update.image?.alt}
        data-seo-published={update.publishedAt}
        data-seo-updated={update.updatedAt}
      >
        <nav className="news-breadcrumb" aria-label="Breadcrumb"><Link to="/">Discover</Link><span aria-hidden="true">/</span><Link to="/travel-updates">Travel News</Link><span aria-hidden="true">/</span><span aria-current="page">{categoryLabels[update.category]}</span></nav>
        {past && <div className="news-status" role="note"><strong>{isEventStory(update) ? "Past event" : "Archived update"}</strong><p>{isEventStory(update) ? "This event has ended. This article is kept as a historical record; check the official sources below for any future edition or current details." : update.archiveNotice ?? "This time-limited update has reached its recorded archive date. This article remains available as a historical record; check the official sources below for current details."}</p></div>}
        <header className="news-article__header">
          <p className="news-kicker">{categoryLabels[update.category]} / {update.destination}</p>
          <h1 id="news-article-title">{update.headline}</h1>
          {update.summary && <p className="news-article__deck">{update.summary}</p>}
          <dl className="news-article__dates">
            <div><dt>Published by AeroGo</dt><dd><time dateTime={update.publishedAt}>{formatDate(update.publishedAt)}</time></dd></div>
            {update.updatedAt && <div><dt>Updated</dt><dd><time dateTime={update.updatedAt}>{formatDate(update.updatedAt)}</time></dd></div>}
            {commonSourceDate && <div><dt>Sources checked</dt><dd><time dateTime={commonSourceDate}>{formatDate(commonSourceDate)}</time></dd></div>}
            {update.effectiveAt && <div><dt>Effective date</dt><dd><time dateTime={update.effectiveAt}>{formatDate(update.effectiveAt)}</time></dd></div>}
            {update.category === "events-experiences" && update.eventStartAt && <div><dt>Event dates</dt><dd><time dateTime={update.eventStartAt}>{formatDate(update.eventStartAt)}</time>{update.eventEndAt && update.eventEndAt !== update.eventStartAt && <> – <time dateTime={update.eventEndAt}>{formatDate(update.eventEndAt)}</time></>}</dd></div>}
            {isSaipanRoute && update.eventStartAt && <div><dt>Announced start</dt><dd><time dateTime={update.eventStartAt}>{formatDate(update.eventStartAt)}</time></dd></div>}
          </dl>
        </header>
        {isSaipanRoute ? <figure className="news-route-graphic">
          <div role="img" aria-label="Information graphic showing Philippine Airlines' announced Manila to Saipan route"><span>MANILA<small>MNL</small></span><span className="news-route-graphic__arrow" aria-hidden="true">→</span><span>SAIPAN<small>SPN</small></span></div>
          <figcaption>Information graphic of PAL’s announced Manila–Saipan route. It does not show an operating flight.</figcaption>
        </figure> : update.image?.src ? <ArticleImage key={update.slug} update={update} /> : null}
        <div className="news-article__layout">
          <div className="news-article__main">
            <div className="news-article__body">
              {update.body.map((block, index) => <TravelUpdateBlock key={index} block={block} />)}
            </div>
            {update.sources.length > 0 && <section className="news-sources" aria-labelledby="news-sources-title">
              <p className="news-kicker">ORIGINAL INFORMATION</p>
              <h2 id="news-sources-title">Sources & status</h2>
              <p>Information can change after publication. Check these sources for the latest details before making travel decisions.</p>
              <ul>{update.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} <ExternalLink size={15} aria-hidden="true" /></a>{(source.publisher || source.accessedAt || source.recheckedAt) && <span>{source.publisher}{source.publisher && source.accessedAt && " · "}{source.accessedAt && <>First checked <time dateTime={source.accessedAt}>{formatDate(source.accessedAt)}</time></>}{source.recheckedAt && source.recheckedAt !== source.accessedAt && <> · Rechecked <time dateTime={source.recheckedAt}>{formatDate(source.recheckedAt)}</time></>}</span>}</li>)}</ul>
            </section>}
          </div>
          <aside className="news-article__aside" aria-label="Article context">
            <p className="news-kicker">AT A GLANCE</p>
            <h2>{update.destination}</h2>
            <p>{update.summary || update.headline}</p>
            {past && <p className="news-article__aside-status">{isEventStory(update) ? "Past event" : "Archived update"} · preserved for reference</p>}
            <div className="news-article__aside-links"><Link to="/travel-updates">Latest travel news <ArrowUpRight size={15} aria-hidden="true" /></Link><Link to="/travel-updates?view=archive">Past events & archive <ArrowUpRight size={15} aria-hidden="true" /></Link></div>
          </aside>
        </div>
      </article>
      {related.length > 0 && <section className="news-related" aria-labelledby="news-related-title"><div className="news-related__heading"><h2 id="news-related-title">More travel news</h2><Link to="/travel-updates">All stories <ArrowRight size={16} aria-hidden="true" /></Link></div><div>{related.map((item) => <NewsRow key={item.id} update={item} past={false} />)}</div></section>}
    </main>
    <EditorialFooter editorial />
  </div>;
}

function ArticleImage({ update }: { update: TravelUpdate }) {
  const [imageFailed, setImageFailed] = useState(false);
  if (imageFailed || !update.image?.src) return null;
  const isGraphic = /graphic|diagram|map/i.test(update.image.alt);
  const mediaLabel = isGraphic ? "Information graphic" : /logo/i.test(update.image.alt) ? "Logo" : /poster/i.test(update.image.alt) ? "Poster" : "Image";
  return <figure className={`news-article__image${isGraphic ? " news-article__image--graphic" : ""}`}><img src={update.image.src} width="1440" height="720" alt={update.image.alt} loading="eager" decoding="async" fetchPriority="high" onError={() => setImageFailed(true)} /><figcaption>{update.image.credit ? <>{mediaLabel}: {update.image.creditUrl ? <a href={update.image.creditUrl} target="_blank" rel="noopener noreferrer">{update.image.credit}</a> : update.image.credit}.</> : `Illustrative ${mediaLabel.toLowerCase()}: ${update.image.alt}.`}</figcaption></figure>;
}

function TravelUpdateBlock({ block }: { block: TravelUpdate["body"][number] }) {
  if (block.type === "heading") return <h2>{block.text}</h2>;
  if (block.type === "list") return <ul>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
  if (block.type === "internalLink") return <p className="news-article__citation"><Link to={block.url}>{block.label} <ArrowUpRight size={15} aria-hidden="true" /></Link></p>;
  if (block.type === "citation") return <p className="news-article__citation">Official source: <a href={block.url} target="_blank" rel="noopener noreferrer">{block.label} <ExternalLink size={15} aria-hidden="true" /></a></p>;
  return <p>{block.text}</p>;
}

function TravelUpdateNotFound() {
  return <div id="travel-news" className="public-site travel-updates-site editorial-foundation"><SiteHeader /><main className="news-shell news-not-found"><p className="news-kicker">TRAVEL NEWS</p><h1>Story not found</h1><p>That address does not match a published AeroGo travel story.</p><Link to="/travel-updates">Browse Travel News <ArrowRight size={16} aria-hidden="true" /></Link></main><EditorialFooter editorial /></div>;
}
