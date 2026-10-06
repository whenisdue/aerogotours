import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Brand } from "../components/Brand";
import { SiteHeader } from "../components/SiteHeader";
import { filterTravelUpdates, getActiveTravelUpdates, getHomepageTravelUpdates, getTravelUpdateBySlug, type TravelUpdate, type TravelUpdateCategory } from "../data/travelUpdates";

const categoryLabels: Record<TravelUpdateCategory, string> = {
  "events-experiences": "Events & experiences",
  "food-experiences": "Food & experiences",
  "flights-airports": "Flights & airports",
  "travel-requirements": "Travel requirements",
  "deals-savings": "Deals & savings",
  "destination-tips": "Destination tips",
};

const formatDate = (date: string) => new Intl.DateTimeFormat("en-PH", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Manila",
}).format(new Date(`${date.slice(0, 10)}T00:00:00+08:00`));

const formatPublishedUpdateDay = (publishedAt: string) => {
  const dateOnly = publishedAt.slice(0, 10);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateOnly);
  if (!match) return null;

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const calendarDate = new Date(Date.UTC(year, month - 1, day));
  if (
    calendarDate.getUTCFullYear() !== year ||
    calendarDate.getUTCMonth() !== month - 1 ||
    calendarDate.getUTCDate() !== day
  ) return null;

  const date = new Date(`${dateOnly}T00:00:00+08:00`);
  if (!Number.isFinite(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-PH", {
    day: "numeric",
    month: "long",
    timeZone: "Asia/Manila",
  }).format(date);
};

const formatCategory = (category: TravelUpdateCategory) => categoryLabels[category];

export function TravelUpdatesPreview() {
  const [featured, ...supporting] = getHomepageTravelUpdates();
  if (!featured) return null;
  const updatedDay = formatPublishedUpdateDay(featured.publishedAt);

  return <section className="travel-updates-preview" id="travel-updates" tabIndex={-1} aria-labelledby="travel-updates-preview-title">
    <div className="page-shell travel-updates-preview__inner">
      <div className="travel-updates-preview__heading">
        <div className="travel-updates-preview__heading-copy">
          <div className="travel-updates-preview__label-row">
            <span className="eyebrow travel-updates-eyebrow">AEROGO TRAVEL UPDATE</span>
            {updatedDay && <time className="travel-updates-preview__updated" dateTime={`${featured.publishedAt.slice(0, 10)}T00:00:00+08:00`}>Updated {updatedDay}</time>}
          </div>
          <h2 id="travel-updates-preview-title">Today’s Travel Update</h2>
          <p>Events, destination news and useful things worth knowing before your next trip.</p>
        </div>
        <Link className="travel-updates-preview__all" to="/travel-updates">View all updates <ArrowRight size={16} /></Link>
      </div>
      <div className="travel-updates-preview__grid">
        <TravelUpdateFeaturedCard update={featured} />
        <div className="travel-updates-preview__supporting">
          {supporting.map((update) => <TravelUpdateCard key={update.id} update={update} />)}
        </div>
      </div>
    </div>
  </section>;
}

export function TravelUpdatesPage() {
  const activeUpdates = useMemo(() => getActiveTravelUpdates(), []);
  const [destinationFilter, setDestinationFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState<TravelUpdateCategory | "all">("all");
  const destinations = [...new Set(activeUpdates.map((update) => update.destination))];
  const filteredUpdates = filterTravelUpdates(activeUpdates, destinationFilter, categoryFilter);

  return <div className="public-site travel-updates-site">
    <SiteHeader />
    <main>
      <section className="travel-updates-page__intro" aria-labelledby="travel-updates-title">
        <div className="page-shell">
          <span className="eyebrow travel-updates-eyebrow">AEROGO TRAVEL UPDATES</span>
          <h1 id="travel-updates-title">Useful things to know before you go.</h1>
          <p>Useful events, travel changes and destination ideas for your next trip.</p>
        </div>
      </section>
      <section className="travel-updates-page__listing" aria-labelledby="current-updates-title">
        <div className="page-shell">
          <div className="travel-updates-page__listing-heading">
            <div>
              <span className="eyebrow">CURRENT UPDATES</span>
              <h2 id="current-updates-title">Worth knowing now</h2>
            </div>
            <div className="travel-updates-filters" aria-label="Filter travel updates">
              <label>Destination
                <select value={destinationFilter} onChange={(event) => setDestinationFilter(event.target.value)}>
                  <option value="all">All destinations</option>
                  {destinations.map((destination) => <option key={destination} value={destination}>{destination}</option>)}
                </select>
              </label>
              <label>Category
                <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value as TravelUpdateCategory | "all")}>
                  <option value="all">All categories</option>
                  {Object.entries(categoryLabels).map(([category, label]) => <option key={category} value={category}>{label}</option>)}
                </select>
              </label>
            </div>
          </div>
          {filteredUpdates.length > 0 ? <div className="travel-updates-listing-grid">{filteredUpdates.map((update) => <TravelUpdateCard key={update.id} update={update} />)}</div> : <p className="travel-updates-empty">No current updates match those filters.</p>}
        </div>
      </section>
    </main>
    <TravelUpdatesFooter />
  </div>;
}

export function TravelUpdateArticlePage() {
  const { slug } = useParams();
  const update = getTravelUpdateBySlug(slug);

  if (!update) return <TravelUpdateNotFound />;

  return <div className="public-site travel-updates-site">
    <SiteHeader />
    <main>
      <article className="travel-update-article page-shell" aria-labelledby="travel-update-article-title">
        <Link className="travel-update-article__back" to="/travel-updates"><ArrowLeft size={16} /> Back to Travel Updates</Link>
        <div className="travel-update-article__meta"><span>{formatCategory(update.category)}</span><span>{formatLocation(update)}</span></div>
        <h1 id="travel-update-article-title">{update.headline}</h1>
        <p className="travel-update-article__summary">{update.summary}</p>
        <div className="travel-update-article__dates"><time dateTime={update.publishedAt}>Published {formatDate(update.publishedAt)}</time>{update.updatedAt && <time dateTime={update.updatedAt}>Updated {formatDate(update.updatedAt)}</time>}</div>
        <figure className="travel-update-article__hero"><img src={update.image.src} alt={update.image.alt} fetchPriority="high" /><figcaption>{update.image.credit}</figcaption></figure>
        <div className="travel-update-article__body">{update.body.map((block, index) => <TravelUpdateBlock key={`${block.type}-${index}`} block={block} />)}</div>
        <section className="travel-update-sources" aria-labelledby="travel-update-sources-title">
          <span className="eyebrow">CHECK THE DETAILS</span>
          <h2 id="travel-update-sources-title">Official information &amp; sources</h2>
          <p>AeroGo has summarised the information for planning purposes. Check the original source for the latest programme details before travelling.</p>
          <ul>{update.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} <ExternalLink size={14} /></a>{source.publisher && <span>{source.publisher}</span>}</li>)}</ul>
        </section>
      </article>
      <section className="travel-update-article__cta" aria-labelledby="travel-update-cta-title">
        <div className="page-shell">
          <span className="eyebrow eyebrow--light">PLANNING A TRIP?</span>
          <h2 id="travel-update-cta-title">Want help shaping the route?</h2>
          <p>Tell AeroGo what you are considering and we can help you organise the details.</p>
          <Link className="button button--coral" to="/#inquiry">Tell us about your trip <ArrowUpRight size={16} /></Link>
        </div>
      </section>
    </main>
    <TravelUpdatesFooter />
  </div>;
}

function TravelUpdateFeaturedCard({ update }: { update: TravelUpdate }) {
  return <article className="travel-update-feature">
    <Link className="travel-update-feature__image" to={`/travel-updates/${update.slug}`} aria-label={`Read ${update.headline}`}><img src={update.image.src} alt={update.image.alt} fetchPriority="high" /></Link>
    <div className="travel-update-feature__body">
      <UpdateMeta update={update} />
      <h3><Link to={`/travel-updates/${update.slug}`}>{update.headline}</Link></h3>
      <p>{update.summary}</p>
      <div className="travel-update-card__footer"><time dateTime={update.publishedAt}>{formatDate(update.publishedAt)}</time><Link className="text-link" to={`/travel-updates/${update.slug}`}>Read update <ArrowUpRight size={15} /></Link></div>
    </div>
  </article>;
}

function TravelUpdateCard({ update }: { update: TravelUpdate }) {
  return <article className="travel-update-card">
    <Link className="travel-update-card__image" to={`/travel-updates/${update.slug}`} aria-label={`Read ${update.headline}`}><img src={update.image.src} alt={update.image.alt} loading="lazy" decoding="async" /></Link>
    <div className="travel-update-card__body">
      <UpdateMeta update={update} />
      <h3><Link to={`/travel-updates/${update.slug}`}>{update.headline}</Link></h3>
      <p>{update.summary}</p>
      <div className="travel-update-card__footer"><time dateTime={update.publishedAt}>{formatDate(update.publishedAt)}</time><Link className="text-link" to={`/travel-updates/${update.slug}`}>Read update <ArrowUpRight size={14} /></Link></div>
    </div>
  </article>;
}

function UpdateMeta({ update }: { update: TravelUpdate }) {
  return <div className="travel-update-card__meta"><span>{formatCategory(update.category)}</span><span>{update.destination}</span></div>;
}

function formatLocation(update: TravelUpdate) {
  return update.destination === update.country ? update.destination : `${update.destination}, ${update.country}`;
}

function TravelUpdateBlock({ block }: { block: TravelUpdate["body"][number] }) {
  if (block.type === "heading") return <h2>{block.text}</h2>;
  if (block.type === "list") return <ul>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
  return <p>{block.text}</p>;
}

function TravelUpdateNotFound() {
  return <div className="public-site travel-updates-site">
    <SiteHeader />
    <main className="travel-update-not-found page-shell">
      <span className="eyebrow">A LITTLE DETOUR</span>
      <h1>We couldn’t find that update.</h1>
      <p>Try the latest travel updates instead.</p>
      <Link className="text-link" to="/travel-updates">Back to Travel Updates <ArrowRight size={16} /></Link>
    </main>
    <TravelUpdatesFooter />
  </div>;
}

function TravelUpdatesFooter() {
  return <footer className="site-footer"><div className="page-shell site-footer__inner"><Brand light /><span>Thoughtful travel planning, made simpler.</span><span className="site-footer__domain">aerogotours.com</span><span className="site-footer__legal">© 2026 AeroGo Travel &amp; Tours · Sample prototype</span></div></footer>;
}
