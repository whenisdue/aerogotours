import { ArrowRight, ArrowUpRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { EditorialFooter } from "../components/EditorialFooter";
import { SiteHeader } from "../components/SiteHeader";
import { findDestination } from "../data/destinations";
import { publishedVideos, publishedVideoSeries, videoPlatformLabels, type PublishedVideo } from "../data/publishedVideos";
import "./Watch.css";

function VideoCover({ video, priority = false }: { video: PublishedVideo; priority?: boolean }) {
  return <span className={`watch-cover${video.cover ? " watch-cover--photo" : " watch-cover--fallback"}`} aria-hidden="true">
    {video.cover ? <img src={video.cover.src} width={video.cover.width} height={video.cover.height} alt="" loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} decoding="async" />
      : <span className="watch-cover__fallback"><span>Destination Discovery</span><strong>{video.destination.split(",")[0]}</strong><small>Singapore</small></span>}
    <span className="watch-cover__play"><Play size={21} fill="currentColor" /></span>
  </span>;
}

function VideoCredit({ video }: { video: PublishedVideo }) {
  if (!video.cover) return <p className="watch-video-credit">AeroGo typographic cover</p>;
  return <p className="watch-video-credit">{video.cover.creditUrl
    ? <a href={video.cover.creditUrl} target="_blank" rel="noopener noreferrer">{video.cover.credit}</a>
    : video.cover.credit}</p>;
}

function VideoCard({ video, featured = false }: { video: PublishedVideo; featured?: boolean }) {
  const destination = findDestination(video.destinationSlug);
  return <article className={`watch-video${featured ? " watch-video--featured" : ""}`} id={`video-${video.id}`}>
    <a className="watch-video__outbound" href={video.url} target="_blank" rel="noopener noreferrer" aria-label={`${video.title}. Watch on ${videoPlatformLabels[video.platform]} (opens in a new tab)`}>
      <VideoCover video={video} priority={featured} />
      <span className="watch-video__body">
        <span className="watch-video__meta">{video.series} <span aria-hidden="true">/</span> {video.destination}</span>
        {featured ? <h2>{video.title}</h2> : <h3>{video.title}</h3>}
        <span className="watch-video__action">Watch on {videoPlatformLabels[video.platform]} <ArrowUpRight size={17} aria-hidden="true" /></span>
      </span>
    </a>
    <VideoCredit video={video} />
    {destination && <Link className="watch-video__destination" to={`/destinations/${video.destinationSlug}`}>Explore {destination.name} <ArrowRight size={15} aria-hidden="true" /></Link>}
  </article>;
}

export function WatchPage() {
  const featured = publishedVideos[0];
  if (!featured) return null;
  const moreVideos = publishedVideos.slice(1);

  return <div className="public-site watch-page editorial-foundation">
    <SiteHeader />
    <main className="watch-main watch-shell">
      <header className="watch-intro">
        <div><span className="watch-kicker">Original AeroGo videos</span><h1>Watch AeroGo</h1></div>
        <p>Short travel stories from places worth exploring. Open each published video on its original channel.</p>
      </header>

      <div className="watch-discovery-grid">
        <VideoCard video={featured} featured />

        {moreVideos.length > 0 && <section className="watch-library" aria-labelledby="watch-library-title">
          <div className="watch-library__heading"><span className="watch-kicker">Published AeroGo videos</span><h2 id="watch-library-title">More to watch</h2></div>
          <div className="watch-library__grid">{moreVideos.map((video) => <VideoCard key={video.id} video={video} />)}</div>
        </section>}
      </div>

      <nav className="watch-series-nav" aria-label="Browse video series">
        <span>Browse by series</span>
        {publishedVideoSeries.map((series) => {
          const firstInSeries = moreVideos.find((video) => video.series === series) ?? featured;
          return <a key={series} href={`#video-${firstInSeries.id}`}>{series} <ArrowRight size={15} aria-hidden="true" /></a>;
        })}
      </nav>

    </main>
    <EditorialFooter editorial />
  </div>;
}
