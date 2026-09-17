import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, CalendarDays, Check, Compass, Hotel, Luggage, MessageCircle, Plane, Sparkles, Ticket, TrainFront, WalletCards } from "lucide-react";
import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { Brand } from "../components/Brand";
import { destinations } from "../data/destinations";

const services = [
  { icon: <Plane size={19} />, label: "Flights" },
  { icon: <Hotel size={19} />, label: "Hotels" },
  { icon: <TrainFront size={19} />, label: "Transfers" },
  { icon: <Ticket size={19} />, label: "Activities" },
  { icon: <CalendarDays size={19} />, label: "Day-by-day plans" },
  { icon: <WalletCards size={19} />, label: "Booking organization" },
  { icon: <Luggage size={19} />, label: "Pre-trip reminders" },
  { icon: <MessageCircle size={19} />, label: "Travel support" },
];

export function Homepage() {
  const [submissionState, setSubmissionState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submissionError, setSubmissionError] = useState("");
  const formStartedAt = useRef(0);
  const submissionInFlight = useRef(false);

  useEffect(() => {
    formStartedAt.current = Date.now();
  }, []);

  const submitInquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity() || submissionInFlight.current) return;

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

  return <div className="public-site">
    <SiteHeader />
    <main>
      <section className="hero" aria-labelledby="homepage-hero-title">
        <div className="hero__visual">
          <img className="hero__image" src={destinations[0].heroImage} alt={destinations[0].imageAlt} fetchPriority="high" />
          <div className="hero__image-shade" />
          <div className="page-shell hero__inner">
            <div className="hero__copy">
              <span className="eyebrow hero__eyebrow"><span className="eyebrow-mark" /> A CLEARER WAY TO PLAN YOUR TRIP</span>
              <h1 id="homepage-hero-title">Your trip,<br /><em>taken care of.</em></h1>
              <p>Tell us where you want to go. We help compare flights and stays, organize your itinerary and travel requirements, and keep the important details together so you don’t have to.</p>
              <div className="hero__actions"><a className="button hero__primary" href="#inquiry">Tell us about your trip <ArrowUpRight size={17} /></a><a className="text-link hero__secondary" href="#how-it-works">See how it works <ArrowRight size={15} /></a></div>
              <p className="hero__reassurance">No commitment. Start with a few trip details.</p>
            </div>
          </div>
        </div>
        <DestinationRail />
      </section>

      <section className="how-section section-pad" id="how-it-works">
        <div className="page-shell">
          <div className="section-heading section-heading--split"><div><span className="eyebrow">HOW IT WORKS</span><h2>A clearer way to get there.</h2></div><p>From your first idea to your return home, we help keep the details organized so you can travel with confidence.</p></div>
          <div className="steps-grid">
            <article className="step-card"><span className="step-card__num">01</span><div className="step-card__icon"><MessageCircle size={21} /></div><h3>Tell us about your trip</h3><p>Share your destination, dates, who is traveling, and what matters most to you.</p><span className="step-card__bottom">Your goals, our starting point</span></article>
            <article className="step-card"><span className="step-card__num">02</span><div className="step-card__icon"><Compass size={21} /></div><h3>We research and organize it</h3><p>We compare public flight and stay options, shape your itinerary, and bring the important details together.</p><span className="step-card__bottom">Thoughtfully put together</span></article>
            <article className="step-card"><span className="step-card__num">03</span><div className="step-card__icon"><Luggage size={21} /></div><h3>Travel with a clear plan</h3><p>Keep your itinerary, booking details, reminders, and AeroGo support together in one place.</p><span className="step-card__bottom">Ready when you are</span></article>
          </div>
        </div>
      </section>

      <section className="services-section section-pad" id="services">
        <div className="page-shell services-layout">
          <div className="services-copy"><span className="eyebrow">THE PIECES THAT MAKE A TRIP</span><h2>We can help with<br />the whole picture.</h2><p>We compare publicly available options and help you make sense of the details. You stay in control of the choices; we help keep everything moving.</p><a className="text-link" href="#inquiry">Tell us what you need <ArrowRight size={15} /></a></div>
          <div className="service-list">{services.map((service, i) => <div className="service-item" key={service.label}><span className="service-item__icon">{service.icon}</span><span>{service.label}</span><span className="service-item__index">0{i + 1}</span></div>)}</div>
        </div>
      </section>

      <section className="companion-section section-pad" id="companion">
        <div className="page-shell companion-feature">
          <div className="companion-feature__copy"><span className="eyebrow eyebrow--light">THE AEROGO TRAVEL COMPANION</span><h2>Everything you need.<br /><em>Right when you need it.</em></h2><p>For qualifying trips booked with AeroGo, your private Travel Companion keeps your itinerary, booking details, helpful reminders, and a way to reach us together in one simple place.</p>
            <div className="companion-feature__points"><span><Check size={15} /> Your day-by-day plans</span><span><Check size={15} /> Booking details &amp; documents</span><span><Check size={15} /> Helpful reminders &amp; support</span></div>
            <Link className="button button--light" to="/companion">Preview a sample trip <ArrowUpRight size={16} /></Link>
            <small className="feature-disclaimer">The trip shown is a fictional demo.</small>
          </div>
          <div className="companion-feature__visual">
            <div className="feature-orbit feature-orbit--one" /><div className="feature-orbit feature-orbit--two" />
            <div className="floating-note floating-note--left"><span className="floating-note__icon"><CalendarDays size={15} /></span><span><strong>Today, all sorted</strong><small>Your plans at a glance</small></span></div>
            <div className="phone-preview">
              <div className="phone-preview__notch" />
              <div className="phone-preview__status"><span>9:41</span><span>●●● ◖</span></div>
              <div className="phone-preview__header"><span>YOUR TRIP · DAY 3</span><strong>Tokyo, Japan</strong><small>Saturday, November 14</small></div>
              <div className="phone-preview__next"><span>NEXT UP</span><strong>teamLab Planets</strong><small>10:30 AM · Toyosu</small><div className="phone-preview__leave"><ClockBadge /> Leave by 9:20 AM</div></div>
              <div className="phone-preview__today"><span>TODAY</span><span><i /> Odaiba waterfront <small>1:00 PM</small></span><span><i /> Shibuya &amp; dinner <small>6:00 PM</small></span></div>
              <div className="phone-preview__nav"><span className="is-active">⌂<small>Home</small></span><span>▤<small>Trip</small></span><span>▧<small>Docs</small></span><span>◌<small>Messages</small></span></div>
            </div>
            <div className="floating-note floating-note--right"><span className="floating-note__icon"><Check size={15} /></span><span><strong>One less thing to remember</strong><small>Your ticket is right here</small></span></div>
            <div className="feature-caption"><Sparkles size={13} /> A CALMER WAY TO TRAVEL</div>
          </div>
        </div>
      </section>

      <section className="trust-section section-pad">
        <div className="page-shell trust-layout">
          <div className="trust-heading"><span className="eyebrow">A GOOD TRAVEL PARTNER</span><h2>Clear choices.<br /><em>Considered details.</em></h2></div>
          <div className="trust-points"><article><span className="trust-points__num">01</span><div><h3>Options you can understand</h3><p>We work with publicly available travel choices and explain the trade-offs plainly.</p></div></article><article><span className="trust-points__num">02</span><div><h3>Your trip, shaped around you</h3><p>Plans built around your pace, your people, and the way you like to travel.</p></div></article><article><span className="trust-points__num">03</span><div><h3>Details that stay easy to find</h3><p>One clear place for the information you need before and during the trip.</p></div></article></div>
        </div>
      </section>

      <section className="inquiry-section section-pad" id="inquiry">
        <div className="page-shell inquiry-layout">
          <div className="inquiry-copy"><span className="eyebrow eyebrow--light">LET'S MAKE IT EASIER</span><h2>Tell us where<br /><em>you want to go.</em></h2><p>Share a few details and we’ll have a better idea of how to help. No pressure, just a good place to start.</p><div className="inquiry-note"><span className="inquiry-note__icon"><MessageCircle size={17} /></span><span><strong>A real conversation, first.</strong><small>We’ll learn what matters to you before suggesting next steps.</small></span></div><div className="inquiry-doodle"><span>Have a destination in mind?</span><ArrowDown size={18} /></div></div>
          <form className="inquiry-form" onSubmit={submitInquiry}>
            {submissionState === "success" ? <div className="form-success" role="status"><span className="form-success__icon"><Check size={22} /></span><span className="eyebrow">THANKS FOR SHARING</span><h3>Your inquiry has been received.</h3><p>Thank you! We'll review your trip details and get back to you.</p><button className="text-link" type="button" onClick={() => { formStartedAt.current = Date.now(); setSubmissionState("idle"); }}>Send another inquiry <ArrowRight size={15} /></button></div> : <>
              <div className="form-heading"><span className="eyebrow">START WITH THE BASICS</span><span className="form-required">* Required</span></div>
              <div className="form-row"><label>Your name *<input required name="name" placeholder="e.g. Maria Santos" autoComplete="name" /></label><label>Your email *<input required type="email" name="email" placeholder="Where can we reach you?" autoComplete="email" /></label></div>
              <div className="form-row"><label>Where would you like to go? *<input required name="destination" placeholder="City, country or 'not sure yet'" /></label><label>Approximate dates<input name="dates" placeholder="e.g. November 2026" /></label></div>
              <div className="form-row form-row--small"><label>Travelers<select name="travelers" defaultValue="2"><option value="1">1 traveler</option><option value="2">2 travelers</option><option value="3">3 travelers</option><option value="4">4 travelers</option><option value="5+">5 or more</option></select></label><label>Trip style<select name="style" defaultValue="family"><option value="family">Family / group</option><option value="couple">Couple</option><option value="solo">Solo</option><option value="work">Work trip</option><option value="other">Other</option></select></label></div>
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
    <footer className="site-footer"><div className="page-shell site-footer__inner"><Brand light /><span>Thoughtful travel planning, made simpler.</span><span className="site-footer__domain">aerogotours.com</span><span className="site-footer__legal">© 2026 AeroGo Travel &amp; Tours · Sample prototype</span></div></footer>
  </div>;
}

function DestinationRail() {
  const railRef = useRef<HTMLDivElement>(null);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const syncScrollControls = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    setCanScrollPrevious(rail.scrollLeft > 4);
    setCanScrollNext(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 4);
  }, []);

  useEffect(() => {
    syncScrollControls();
    window.addEventListener("resize", syncScrollControls);
    return () => window.removeEventListener("resize", syncScrollControls);
  }, [syncScrollControls]);

  const scrollRail = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    rail.scrollBy({ left: direction * rail.clientWidth * 0.76, behavior });
  };

  return <section className="destination-rail page-shell" aria-labelledby="destination-rail-title">
    <div className="destination-rail__heading">
      <h2 id="destination-rail-title" className="destination-rail__intro eyebrow">A LITTLE INSPIRATION <span aria-hidden="true">·</span> SOMEWHERE WORTH IMAGINING</h2>
      <div className="destination-rail__controls" aria-label="Destination browsing controls">
        <button type="button" onClick={() => scrollRail(-1)} disabled={!canScrollPrevious} aria-label="Show previous destinations"><ArrowRight size={18} className="destination-rail__arrow--back" /></button>
        <button type="button" onClick={() => scrollRail(1)} disabled={!canScrollNext} aria-label="Show more destinations"><ArrowRight size={18} /></button>
      </div>
    </div>
    <div className="destination-rail__viewport" ref={railRef} onScroll={syncScrollControls} onWheel={(event) => {
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX) && event.currentTarget.scrollWidth > event.currentTarget.clientWidth) {
        event.preventDefault();
        event.currentTarget.scrollLeft += event.deltaY;
      }
    }} role="region" aria-label="Browse destination inspiration" tabIndex={0}>
      <div className="destination-rail__track">
        {destinations.map((destination) => <Link className="destination-card" key={destination.slug} to={`/destinations/${destination.slug}`} aria-label={`Explore ${destination.name}: ${destination.tagline}`}>
          <img src={destination.cardImage} alt="" loading="lazy" decoding="async" />
          <span className="destination-card__shade" />
          <span className="destination-card__copy"><strong>{destination.name}</strong><span>{destination.tagline}</span></span>
          <span className="destination-card__arrow" aria-hidden="true"><ArrowUpRight size={18} /></span>
        </Link>)}
      </div>
    </div>
  </section>;
}

function ClockBadge() {
  return <span className="clock-badge">◷</span>;
}
