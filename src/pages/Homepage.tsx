import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { EditorialFooter } from "../components/EditorialFooter";
import { EditorialPhoto } from "../components/EditorialPhoto";
import { TravelGuideFeature } from "../components/TravelGuideFeature";
import { travelGuides } from "../data/travelGuides";
import "./Discovery.css";
import { japanDreamImages } from "../data/dreamTrips";
import { TravelUpdatesPreview } from "./TravelUpdates";
import type { DreamTripHandoff } from "../utils/dreamTripEngine";
import { createDreamTrip } from "../utils/dreamTripEngine";
import vietnamHeroPhoto from "../assets/vietnam-hero.webp";

const discoveryDestinations = [
  { slug: "japan", name: "Japan", region: "Asia", summary: "Quiet gardens, neighborhood discoveries and city nights." },
  { slug: "greece", name: "Greece", region: "Europe", summary: "Island lanes, long lunches and blue horizons." },
  { slug: "australia", name: "Australia", region: "Oceania", summary: "Coastal cities, open-air days and room to roam." },
];

const homepageDreamTrip = createDreamTrip({ group: "sample", travelers: 4, duration: 7, interest: "mix", pace: "balanced" });
const AMBIGUOUS_TRAVEL_DATES = /^\d{1,2}$/;
const AMBIGUOUS_TRAVEL_DATES_MESSAGE = "Please add a month or a little more detail, e.g. Oct 17 or December 2026.";

export function Homepage() {
  const [submissionState, setSubmissionState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submissionError, setSubmissionError] = useState("");
  const [datesError, setDatesError] = useState("");
  const formStartedAt = useRef(0);
  const submissionInFlight = useRef(false);
  const inquiryFormRef = useRef<HTMLFormElement>(null);

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

  return <div className="public-site media-homepage" id="discovery-home">
    <SiteHeader />
    <main>
      <section className="discovery-hero page-shell" aria-labelledby="homepage-hero-title">
        <div className="discovery-hero__copy">
          <span className="discovery-eyebrow">The world, a little closer</span>
          <h1 id="homepage-hero-title">See more of<br />the world.</h1>
          <p>Travel stories, useful guides, and places worth exploring — whenever you’re ready.</p>
          <div className="discovery-hero__actions">
            <Link className="discovery-button" to="/guides">Explore Travel Guides <ArrowUpRight size={18} aria-hidden="true" /></Link>
            <a className="discovery-text-link" href="#travel-updates">Latest Travel Updates <ArrowRight size={17} aria-hidden="true" /></a>
          </div>
        </div>
        <figure className="discovery-hero__figure">
          <Link to="/guides/singapore/gardens-by-the-bay" aria-label="Explore our Gardens by the Bay visitor guide">
            <EditorialPhoto image="S25" alt="An elevated daytime view of Supertree Grove, glass conservatories and the waterfront at Gardens by the Bay" priority />
          </Link>
          <figcaption><span>Singapore</span> Gardens by the Bay <ArrowUpRight size={14} aria-hidden="true" /></figcaption>
        </figure>
      </section>
      <section className="discovery-featured page-shell" aria-labelledby="featured-guide-title">
        <div className="discovery-section-label"><h2 id="featured-guide-title">Featured guide</h2><Link to="/guides">All travel guides <ArrowRight size={16} aria-hidden="true" /></Link></div>
        {travelGuides.slice(0, 1).map((guide) => <TravelGuideFeature key={guide.path} guide={guide} />)}
      </section>
      <section className="discovery-destinations page-shell" id="destinations" aria-labelledby="discovery-destinations-title">
        <header className="discovery-destinations__heading">
          <div><span className="discovery-eyebrow">A different place, a different pace</span><h2 id="discovery-destinations-title">Explore Destinations</h2></div>
          <p>A few places to spark your next idea. These destination pages offer inspiration for the journey ahead.</p>
        </header>
        <div className="discovery-destinations__grid">
          <article className="discovery-destination-feature">
            <Link to="/destinations/vietnam" aria-label="Explore Vietnam destination inspiration">
              <img src={vietnamHeroPhoto} width={1600} height={850} alt="Da Nang’s illuminated Dragon Bridge stretching across the river at dusk" loading="lazy" decoding="async" />
              <div className="discovery-destination-feature__copy"><span className="discovery-eyebrow">Asia</span><h3 id="discovery-vietnam-title">Vietnam</h3><p>Coffee mornings, old town lanes and life by the river.</p><span className="discovery-text-link">Explore destination <ArrowUpRight size={17} aria-hidden="true" /></span></div>
            </Link>
            {/* Existing local photo; provenance is also recorded in VietnamProposal.tsx. */}
            <small className="discovery-destination-credit">Da Nang · Photo by <a href="https://unsplash.com/photos/lighted-bridge-B76nvP51iew" target="_blank" rel="noopener noreferrer">Ngô Thanh Tùng / Unsplash</a></small>
          </article>
          <ul className="discovery-destination-list">
            {discoveryDestinations.map((destination) => <li key={destination.slug}>
              <Link to={`/destinations/${destination.slug}`} aria-label={`Explore ${destination.name} destination inspiration`}>
                <div><span className="discovery-eyebrow">{destination.region}</span><h3 id={`discovery-${destination.slug}-title`}>{destination.name}</h3><p>{destination.summary}</p><span className="discovery-text-link">Explore destination</span></div>
                <ArrowUpRight size={20} aria-hidden="true" />
              </Link>
            </li>)}
          </ul>
        </div>
      </section>
      <TravelUpdatesPreview />
      <section className="discovery-planning page-shell" aria-labelledby="planning-title">
        <div className="discovery-planning__heading"><div><span className="discovery-eyebrow">Personal travel planning</span><h2 id="planning-title">Ready to turn an idea into a trip?</h2><p>If you’d like a hand with the details, AeroGo can help you shape a plan around your pace and priorities.</p></div><a className="discovery-text-link" href="#inquiry">Plan my trip <ArrowUpRight size={17} aria-hidden="true" /></a></div>
        <div className="discovery-planning__details">
          <article id="how-it-works"><h3>How it works</h3><p>Share your destination, dates and travel style. We research public options and bring the details together so you can make informed choices.</p></article>
          <article id="services"><h3>What we help with</h3><p>Flights, hotels, transfers, activities, day-by-day plans, booking organization and pre-trip reminders.</p><a className="discovery-text-link" href="#inquiry">Tell us what you need <ArrowRight size={15} aria-hidden="true" /></a></article>
          <article id="companion"><h3>The Companion</h3><p>For qualifying trips booked with AeroGo, a private space for your itinerary, booking details, reminders and support.</p><Link className="discovery-text-link" to="/companion">Preview a sample trip <ArrowUpRight size={15} aria-hidden="true" /></Link><small>The sample trip is a fictional demo.</small></article>
        </div>
      </section>

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
    <EditorialFooter />
  </div>;
}

export function HomepageDreamPreview() {
  const highlights = [homepageDreamTrip.days[0], homepageDreamTrip.days[2], homepageDreamTrip.days[4]];

  return <section className="homepage-dream-preview" aria-labelledby="homepage-dream-preview-title">
    <div className="page-shell">
      <div className="homepage-dream-preview__heading"><div><span className="eyebrow">TRY A DREAM TRIP · JAPAN</span><h2 id="homepage-dream-preview-title">See what seven days in Japan could look like.</h2></div></div>
      <div className="homepage-dream-preview__feature">
        <div className="homepage-dream-preview__visual"><img src={japanDreamImages.hero.image} alt={japanDreamImages.hero.alt} loading="lazy" /><span className="homepage-dream-preview__visual-label">JAPAN · ILLUSTRATIVE ONLY</span></div>
        <div className="homepage-dream-preview__copy"><p>Explore a curated sample journey through Tokyo and Kyoto, then shape it around your travel style.</p><p className="homepage-dream-preview__honesty">Japan is one of AeroGo’s interactive Dream Trip examples. This is an illustrative itinerary, not a confirmed booking. Routes, activities, availability and prices can be refined with AeroGo.</p><div className="homepage-dream-preview__highlights">{highlights.map((day) => <div className="homepage-dream-highlight" key={day.day}><span>DAY {String(day.day).padStart(2, "0")}</span><div><strong>{day.title}</strong><small>{day.location}</small></div><ArrowRight size={16} /></div>)}</div><Link className="button homepage-dream-preview__button" to="/dream/japan">Explore the Japan Dream Trip <ArrowUpRight size={16} /></Link></div>
      </div>
    </div>
  </section>;
}
