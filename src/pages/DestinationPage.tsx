import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { EditorialBreadcrumb } from "../components/EditorialBreadcrumb";
import { EditorialFooter } from "../components/EditorialFooter";
import { SiteHeader } from "../components/SiteHeader";
import { destinations, findDestination } from "../data/destinations";
import { getActiveTravelUpdates } from "../data/travelUpdates";
import { travelGuides } from "../data/travelGuides";
import { getVideosForDestination, videoPlatformLabels } from "../data/publishedVideos";
import { getDreamDestination } from "../utils/dreamTripEngine";
import "./DestinationPage.css";

const formatPublishedDate = (publishedAt: string) => new Intl.DateTimeFormat("en-GB", {
  day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Manila",
}).format(new Date(`${publishedAt.slice(0, 10)}T00:00:00+08:00`));
const imageAtWidth = (url: string, width: number) => url.replace(/([?&])w=\d+/, `$1w=${width}`);

export function DestinationPage() {
  const { slug } = useParams();
  const destination = findDestination(slug);

  if (!destination) return <div className="public-site destination-site editorial-foundation">
    <SiteHeader />
    <main className="destination-not-found destination-shell">
      <p className="destination-kicker">Destination inspiration</p>
      <h1>We couldn’t find that place.</h1>
      <p>Explore another destination in AeroGo’s collection.</p>
      <Link to="/">Back to Discover <ArrowLeft size={16} aria-hidden="true" /></Link>
    </main>
    <EditorialFooter editorial />
  </div>;

  const relatedGuides = travelGuides.filter((guide) => guide.destination === destination.name);
  const videos = getVideosForDestination(destination.slug);
  const newsCountry = destination.slug === "bali" ? "Indonesia" : destination.name;
  const relatedNews = getActiveTravelUpdates().filter((update) => update.country === newsCountry).slice(0, 2);
  const hasPublishedConnections = relatedGuides.length + videos.length + relatedNews.length > 0;
  const hasDreamTrip = Boolean(getDreamDestination(destination.slug));
  const moreDestinations = destinations
    .filter((item) => item.slug !== destination.slug)
    .sort((a, b) => Number(b.region === destination.region) - Number(a.region === destination.region))
    .slice(0, 3);

  return <div className="public-site destination-site editorial-foundation">
    <SiteHeader />
    <main>
      <div className="destination-shell"><EditorialBreadcrumb items={[{ label: "Discover", to: "/" }, { label: "Destinations" }, { label: destination.name }]} /></div>

      <article>
        <header className="destination-article-header destination-shell">
          <span className="destination-kicker">Destination inspiration / {destination.region}</span>
          <h1>{destination.name}</h1>
          <p>{destination.tagline}</p>
        </header>

        <figure className="destination-lead-photo destination-shell">
          <img src={destination.heroImage} srcSet={`${imageAtWidth(destination.heroImage, 720)} 720w, ${imageAtWidth(destination.heroImage, 1440)} 1440w, ${destination.heroImage} 2200w`} sizes="(max-width: 700px) 90vw, 92vw" width="2200" height="1238" alt={destination.imageAlt} fetchPriority="high" decoding="async" />
          <figcaption>Destination image via <a href={destination.heroImage} target="_blank" rel="noopener noreferrer">Unsplash</a>. This page offers inspiration, not a reported itinerary.</figcaption>
        </figure>

        <div className={`destination-opening destination-shell${hasPublishedConnections ? " destination-opening--with-links" : ""}`}>
          <section className="destination-intro" aria-labelledby="destination-intro-title">
            <span className="destination-kicker">Get to know the place</span>
            <h2 id="destination-intro-title">A starting point for {destination.name}</h2>
            <div className="destination-reading">{destination.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          </section>
          {hasPublishedConnections && <aside className="destination-published" aria-labelledby="destination-published-title">
            <span className="destination-kicker">From AeroGo</span>
            <h2 id="destination-published-title">Explore more</h2>
            {relatedGuides.map((guide) => <div className="destination-published__item" key={guide.path}>
              <span>Published guide</span><Link to={guide.path}>{guide.title} <ArrowUpRight size={16} aria-hidden="true" /></Link>
            </div>)}
            {videos.map((video) => <div className="destination-published__item" key={video.url}>
              <span>Original AeroGo video · {videoPlatformLabels[video.platform]}</span><a href={video.url} target="_blank" rel="noopener noreferrer">{video.title} <ExternalLink size={16} aria-hidden="true" /></a>
            </div>)}
            {videos.length > 0 && <Link className="destination-published__watch" to="/watch">Browse Watch AeroGo <ArrowRight size={16} aria-hidden="true" /></Link>}
            {relatedNews.map((update) => <div className="destination-published__item" key={update.slug}>
              <span>Travel News · Published <time dateTime={update.publishedAt}>{formatPublishedDate(update.publishedAt)}</time></span>
              <Link to={`/travel-updates/${update.slug}`}>{update.headline} <ArrowUpRight size={16} aria-hidden="true" /></Link>
            </div>)}
          </aside>}
        </div>

        <section className="destination-moments" aria-labelledby="destination-moments-title">
          <div className="destination-shell">
            <div className="destination-section-heading"><span className="destination-kicker">Ideas for your visit</span><h2 id="destination-moments-title">Follow what interests you</h2></div>
            <div className="destination-moments__grid">{destination.moments.map((moment, index) => <div className="destination-moment" key={moment.title}>
              <span className="destination-moment__number">0{index + 1}</span><h3>{moment.title}</h3><p>{moment.description}</p>
            </div>)}</div>
          </div>
        </section>

        <section className="destination-journey destination-shell" aria-labelledby="destination-journey-title">
          <div className="destination-section-heading"><span className="destination-kicker">One possible route</span><h2 id="destination-journey-title">A four-day outline</h2><p>These are inspiration ideas. Choose places and timing that suit your trip.</p></div>
          <ol className="destination-journey__list">{destination.journey.map((day) => <li key={day.day}>
            <span>Day {day.day}</span><div><h3>{day.title}</h3><p>{day.description}</p></div>
          </li>)}</ol>
        </section>

        <section className="destination-more destination-shell" aria-labelledby="destination-more-title">
          <div className="destination-section-heading"><span className="destination-kicker">Keep discovering</span><h2 id="destination-more-title">More destinations</h2></div>
          <div className="destination-more__grid">{moreDestinations.map((item) => <Link key={item.slug} to={`/destinations/${item.slug}`}>
            <span>{item.region}</span><strong>{item.name}</strong><ArrowRight size={18} aria-hidden="true" />
          </Link>)}</div>
        </section>

        <aside className="destination-planning" aria-label="Travel planning help"><div className="destination-shell">
          <div><span className="destination-kicker">Travel planning</span><h2>Need help with the details?</h2><p>Tell us what kind of trip you have in mind. We’ll help you compare the options and organize the details.</p></div>
          <div className="destination-planning__links">
            {hasDreamTrip && <Link to={`/dream/${destination.slug}`}>Explore a Dream Trip <ArrowUpRight size={17} aria-hidden="true" /></Link>}
            <Link to="/#inquiry">Send a trip inquiry <ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
        </div></aside>
      </article>
    </main>
    <EditorialFooter editorial />
  </div>;
}
