import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { EditorialFooter } from "../components/EditorialFooter";
import { EditorialPhoto } from "../components/EditorialPhoto";
import { travelGuides } from "../data/travelGuides";
import { publishedVideos, videoPlatformLabels } from "../data/publishedVideos";
import "./Discovery.css";
import "./Homepage.css";
import type { TravelUpdate, TravelUpdateCategory } from "../data/travelUpdates";
import type { DreamTripHandoff } from "../utils/dreamTripEngine";
import vietnamHeroPhoto from "../assets/vietnam-hero.webp";

const discoveryDestinations = [
  { slug: "japan", name: "Japan", region: "Asia", summary: "Quiet gardens, neighborhood discoveries and city nights." },
  { slug: "australia", name: "Australia", region: "Oceania", summary: "Coastal cities, open-air days and room to roam." },
];

const newsCategories: Record<TravelUpdateCategory, string> = {
  "events-experiences": "Events & experiences",
  "food-experiences": "Food & experiences",
  "flights-airports": "Flights & airports",
  "travel-requirements": "Travel requirements",
  "deals-savings": "Deals & savings",
  "destination-tips": "Destination tips",
};

const formatNewsDate = (publishedAt: string) => new Intl.DateTimeFormat("en-GB", {
  day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Manila",
}).format(new Date(`${publishedAt.slice(0, 10)}T00:00:00+08:00`));

const AMBIGUOUS_TRAVEL_DATES = /^\d{1,2}$/;
const AMBIGUOUS_TRAVEL_DATES_MESSAGE = "Please add a month or a little more detail, e.g. Oct 17 or December 2026.";

type HomepageNewsItem = Pick<TravelUpdate, "slug" | "category" | "headline" | "summary" | "publishedAt" | "updatedAt">;

function readHomepageNews(): HomepageNewsItem[] {
  try {
    const serialized = document.getElementById("aerogo-homepage-news")?.textContent;
    const value: unknown = serialized ? JSON.parse(serialized) : [];
    return Array.isArray(value) ? value as HomepageNewsItem[] : [];
  } catch {
    return [];
  }
}
export function Homepage() {
  const [newsItems, setNewsItems] = useState<HomepageNewsItem[]>(readHomepageNews);
  const [newsLoaded, setNewsLoaded] = useState(() => newsItems.length > 0);
  const leadGuide = travelGuides[0];
  const [submissionState, setSubmissionState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submissionError, setSubmissionError] = useState("");
  const [datesError, setDatesError] = useState("");
  const formStartedAt = useRef(0);
  const submissionInFlight = useRef(false);
  const inquiryFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (newsLoaded) return;
    let active = true;
    void import("../data/travelUpdates").then(({ getHomepageTravelUpdates }) => {
      if (!active) return;
      setNewsItems(getHomepageTravelUpdates().slice(0, 2));
      setNewsLoaded(true);
    });
    return () => { active = false; };
  }, [newsLoaded]);

  useEffect(() => {
    formStartedAt.current = Date.now();
  }, []);

  useEffect(() => {
    try {
      const storedHandoff = window.sessionStorage.getItem("aerogo.dreamTripInquiry");
      if (!storedHandoff || !inquiryFormRef.current) return;

      const handoff = JSON.parse(storedHandoff) as Partial<DreamTripHandoff>;
      const form = inquiryFormRef.current;
      const setField = (name: string, value: string | undefined) => {
        if (value === undefined) return;
        const field = form.elements.namedItem(name);
        if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
          field.value = value;
        }
      };

      setField("destination", handoff.destination);
      setField("travelers", handoff.personalized ? handoff.travelers : "");
      setField("style", handoff.personalized ? handoff.style : "");
      setField("notes", handoff.summary);
      window.sessionStorage.removeItem("aerogo.dreamTripInquiry");
    } catch {
      try {
        window.sessionStorage.removeItem("aerogo.dreamTripInquiry");
      } catch {
        // Ignore storage errors and leave the form available for manual completion.
      }
    }
  }, []);

  const submitInquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity() || submissionInFlight.current) return;

    const datesField = form.elements.namedItem("dates");
    if (datesField instanceof HTMLInputElement) {
      const dates = datesField.value.trim();
      datesField.value = dates;
      if (AMBIGUOUS_TRAVEL_DATES.test(dates)) {
        setDatesError(AMBIGUOUS_TRAVEL_DATES_MESSAGE);
        datesField.focus();
        return;
      }
      setDatesError("");
    }

    submissionInFlight.current = true;
    setSubmissionState("submitting");
    setSubmissionError("");

    const formData = Object.fromEntries(new FormData(form).entries());
    formData.formStartedAt = String(formStartedAt.current || Date.now());

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json().catch(() => null) as { ok?: boolean; error?: string } | null;

      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || "Unable to send inquiry");
      }

      form.reset();
      setSubmissionState("success");
    } catch {
      setSubmissionError("We couldn't send your inquiry right now. Please try again.");
      setSubmissionState("error");
    } finally {
      submissionInFlight.current = false;
    }
  };

  return <div className="public-site media-homepage editorial-foundation" id="discovery-home">
    <SiteHeader />
    <main>
      <section className="desk-lead desk-shell" aria-labelledby="homepage-hero-title">
        <div className="desk-overline"><span>Discover / Asia &amp; beyond</span><span>Selected stories and useful updates</span></div>
        <div className="desk-lead__grid">
          <article className="desk-feature">
            <figure className="desk-feature__figure">
              <Link to={leadGuide.path} aria-label={`Read ${leadGuide.title}`}><EditorialPhoto image="S25" alt="Supertree Grove and the glass conservatories at Gardens by the Bay, Singapore" priority sizes="(max-width: 650px) 90vw, (max-width: 1000px) 56vw, 55vw" /></Link>
              <figcaption>Gardens by the Bay, Singapore · AeroGo public image</figcaption>
            </figure>
            <div className="desk-feature__body">
              <span className="desk-kicker">Featured guide · Singapore</span>
              <h1 id="homepage-hero-title"><Link to={leadGuide.path}>{leadGuide.title}</Link></h1>
              <p>{leadGuide.summary}</p>
              <Link className="desk-text-link" to={leadGuide.path}>Read the visitor guide <ArrowUpRight size={18} aria-hidden="true" /></Link>
            </div>
          </article>
          <aside className="desk-news" id="travel-updates" aria-labelledby="desk-news-title">
            <div className="desk-section-heading"><h2 id="desk-news-title">Travel news</h2><Link className="desk-text-link" to="/travel-updates">See all updates <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
            {newsItems.length ? <ol className="desk-news__list">{newsItems.map((item, index) => <li key={item.slug}>
              <div className="desk-news__meta"><span>{String(index + 1).padStart(2, "0")} / {newsCategories[item.category]}</span><div className="desk-news__date"><time dateTime={item.publishedAt.slice(0, 10)}>Published {formatNewsDate(item.publishedAt)}</time>{item.updatedAt && item.updatedAt !== item.publishedAt && <span className="desk-news__updated">Updated <time dateTime={item.updatedAt.slice(0, 10)}>{formatNewsDate(item.updatedAt)}</time></span>}</div></div>
              <h3><Link to={`/travel-updates/${item.slug}`}>{item.headline} <ArrowUpRight size={18} aria-hidden="true" /></Link></h3>
              <p>{item.summary}</p>
            </li>)}</ol> : <p className="desk-news__empty">Browse our published travel updates and check official sources before making plans.</p>}
            <div className="desk-news__watch"><span>Watch / Original videos</span><Link to="/watch">Explore AeroGo videos <ArrowUpRight size={17} aria-hidden="true" /></Link><p>Published travel videos from Singapore and Vietnam.</p></div>
          </aside>
        </div>
      </section>

      <section className="desk-watch desk-shell" id="watch" aria-labelledby="desk-watch-title">
        <div className="desk-module-heading"><div><span className="desk-kicker">Original AeroGo videos</span><h2 id="desk-watch-title">Watch AeroGo</h2></div><p>Short videos from places worth exploring. Watch the published posts on Facebook.</p></div>
        <div className="desk-watch__grid">{publishedVideos.map((video, index) => <a key={video.url} href={video.url} target="_blank" rel="noopener noreferrer" className="desk-watch__item"><span className="desk-watch__number">{String(index + 1).padStart(2, "0")} / {video.destination}</span><h3>{video.title}</h3><span className="desk-watch__action">Watch on {videoPlatformLabels[video.platform]} <ArrowUpRight size={17} aria-hidden="true" /></span></a>)}</div>
        <Link className="desk-watch__all" to="/watch">Browse the video library <ArrowUpRight size={17} aria-hidden="true" /></Link>
      </section>

      <section className="desk-destinations desk-shell" id="destinations" aria-labelledby="desk-destinations-title">
        <div className="desk-module-heading"><div><span className="desk-kicker">Places to discover</span><h2 id="desk-destinations-title">Destination Stories</h2></div><p>Explore our published destination pages, from city streets to slower days outdoors.</p></div>
        <div className="desk-destinations__grid">
          <article className="desk-destinations__feature"><Link to="/destinations/vietnam"><img src={vietnamHeroPhoto} width={1600} height={850} alt="Da Nang’s illuminated Dragon Bridge crossing the Han River at dusk" loading="lazy" decoding="async" /><span className="desk-kicker">Vietnam / Destination</span><h3>Vietnam: riverfront evenings and old town days <ArrowUpRight size={19} aria-hidden="true" /></h3><p>Explore Da Nang, Hanoi and the places between.</p></Link><small>Da Nang · Photo by <a href="https://unsplash.com/photos/lighted-bridge-B76nvP51iew" target="_blank" rel="noopener noreferrer">Ngô Thanh Tùng / Unsplash</a></small></article>
          <div className="desk-destinations__list">{discoveryDestinations.map((destination) => <article key={destination.slug}><Link to={`/destinations/${destination.slug}`}><span className="desk-kicker">{destination.region} / Destination</span><h3>{destination.name} <ArrowUpRight size={18} aria-hidden="true" /></h3><p>{destination.summary}</p></Link></article>)}</div>
        </div>
      </section>

      <section className="desk-guides desk-shell" aria-labelledby="desk-guides-title"><div><span className="desk-kicker">Useful before you go</span><h2 id="desk-guides-title">Practical Travel Guides</h2><p>Our Gardens by the Bay visitor guide is featured above. Browse the guide library for practical details on what to see, what needs a ticket and how to plan your visit.</p></div><Link className="desk-guides__button" to="/guides">Explore all guides <ArrowUpRight size={18} aria-hidden="true" /></Link></section>

      <section className="desk-planning desk-shell" id="how-it-works" aria-labelledby="planning-title"><div id="services"><span className="desk-kicker">Travel planning</span><h2 id="planning-title">Need a hand with the details?</h2><p>Share your destination, dates and preferences. AeroGo can help shape a practical itinerary and organize your next steps.</p></div><div className="desk-planning__links"><Link className="desk-text-link" to="#inquiry">Send a trip inquiry <ArrowUpRight size={17} aria-hidden="true" /></Link><Link className="desk-text-link" to="/trip-planner">Try the free trip planner <ArrowUpRight size={17} aria-hidden="true" /></Link><p id="companion">See a <Link to="/companion">sample Trip Companion</Link> for an illustrative private trip space.</p></div></section>

      <section className="inquiry-section section-pad" id="inquiry">
        <div className="page-shell inquiry-layout">
          <div className="inquiry-copy"><span className="eyebrow eyebrow--light">LET'S MAKE IT EASIER</span><h2>Tell us where<br /><em>you want to go.</em></h2><p>Share a few details and we’ll have a better idea of how to help. No pressure, just a good place to start.</p><div className="inquiry-note"><span className="inquiry-note__icon"><MessageCircle size={17} /></span><span><strong>A real conversation, first.</strong><small>We’ll learn what matters to you before suggesting next steps.</small></span></div><div className="inquiry-doodle"><span>Have a destination in mind?</span><ArrowDown size={18} /></div></div>
          <form className="inquiry-form" ref={inquiryFormRef} onSubmit={submitInquiry}>
            {submissionState === "success" ? <div className="form-success" role="status"><span className="form-success__icon"><Check size={22} /></span><span className="eyebrow">THANKS FOR SHARING</span><h3>Your inquiry has been received.</h3><p>Thank you! We'll review your trip details and get back to you.</p><button className="text-link" type="button" onClick={() => { formStartedAt.current = Date.now(); setSubmissionState("idle"); }}>Send another inquiry <ArrowRight size={15} /></button></div> : <>
              <div className="form-heading"><span className="eyebrow">START WITH THE BASICS</span><span className="form-required">* Required</span></div>
              <div className="form-row"><label>Your name *<input required name="name" placeholder="e.g. Maria Santos" autoComplete="name" /></label><label>Your email *<input required type="email" name="email" placeholder="Where can we reach you?" autoComplete="email" /></label></div>
              <div className="form-row"><label>Where would you like to go? *<input required name="destination" placeholder="City, country or 'not sure yet'" /></label><label>Approximate travel dates<input name="dates" placeholder="e.g. Oct 17–20, 2026 or December 2026" aria-invalid={datesError ? true : undefined} aria-describedby={datesError ? "inquiry-dates-error" : undefined} onChange={(event) => {
                if (datesError && !AMBIGUOUS_TRAVEL_DATES.test(event.currentTarget.value.trim())) setDatesError("");
              }} />{datesError && <span className="form-feedback form-feedback--error" id="inquiry-dates-error" role="alert">{datesError}</span>}</label></div>
              <div className="form-row form-row--small"><label>Travelers<select name="travelers" defaultValue="2"><option value="">Not specified</option><option value="1">1 traveler</option><option value="2">2 travelers</option><option value="3">3 travelers</option><option value="4">4 travelers</option><option value="5+">5 or more</option></select></label><label>Trip style<select name="style" defaultValue="family"><option value="">Not specified</option><option value="family">Family / group</option><option value="couple">Couple</option><option value="solo">Solo</option><option value="work">Work trip</option><option value="other">Other</option></select></label></div>
              <label>Anything you'd like us to know?<textarea name="notes" placeholder="What would make this trip feel easy for you?" rows={3} /></label>
              <div className="inquiry-form__honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
              {submissionState === "error" && <p className="form-feedback form-feedback--error" role="alert">{submissionError}</p>}
              <div className="form-submit"><span>Just an inquiry. No commitment.</span><button type="submit" className="button button--coral" disabled={submissionState === "submitting"}>{submissionState === "submitting" ? "Sending inquiry…" : "Send trip inquiry"} <ArrowUpRight size={16} /></button></div>
              <p className="form-privacy-note">We use these details to review your travel inquiry and respond. Please don't include passport, payment, or government ID information.</p>
            </>}
          </form>
        </div>
      </section>
    </main>
    <EditorialFooter editorial />
  </div>;
}
