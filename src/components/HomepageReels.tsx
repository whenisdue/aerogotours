import { Play } from "lucide-react";
import { featuredReels, type FeaturedReel } from "../data/featuredReels";

type ReadyReel = FeaturedReel & { thumbnail: string; url: string };

const isFacebookReelUrl = (value: string | null): value is string => {
  if (!value) return false;

  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;

    const host = url.hostname.toLowerCase();
    const isFacebookHost = host === "facebook.com" || host.endsWith(".facebook.com");
    return (isFacebookHost && /^\/reel\/[^/]+\/?$/i.test(url.pathname)) ||
      (host === "fb.watch" && url.pathname.length > 1);
  } catch {
    return false;
  }
};

export function HomepageReels() {
  const readyReels = featuredReels.filter((reel): reel is ReadyReel =>
    Boolean(reel.thumbnail && isFacebookReelUrl(reel.url)),
  );

  if (readyReels.length < 3) return null;

  return <section className="homepage-reels" aria-labelledby="homepage-reels-title">
    <div className="page-shell homepage-reels__inner">
      <div className="homepage-reels__heading">
        <span className="eyebrow homepage-reels__eyebrow">TRAVEL VIDEOS</span>
        <h2 id="homepage-reels-title">Watch Before You Go</h2>
        <p>Quick destination ideas, tips and places worth knowing.</p>
      </div>
      <div className="homepage-reels__viewport" role="region" aria-label="Featured travel videos. Scroll horizontally to browse." tabIndex={0}>
        <div className="homepage-reels__grid">
          {readyReels.map((reel) => <a
            className="homepage-reel-card"
            key={reel.id}
            href={reel.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch ${reel.title} in ${reel.destination} on Facebook (opens in a new tab)`}
          >
            <span className="homepage-reel-card__poster">
              <img
                src={reel.thumbnail}
                alt={reel.accessibilityText || `${reel.destination}: ${reel.title}`}
                loading="lazy"
                decoding="async"
              />
              <span className="homepage-reel-card__play" aria-hidden="true"><Play size={17} fill="currentColor" /></span>
            </span>
            <span className="homepage-reel-card__body">
              <span className="homepage-reel-card__meta">
                <span>{reel.destination}</span>
                {reel.label && <span>{reel.label}</span>}
              </span>
              <h3>{reel.title}</h3>
            </span>
          </a>)}
        </div>
      </div>
    </div>
  </section>;
}
