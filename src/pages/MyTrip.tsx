import { useEffect, useState, type ReactNode } from "react";
import { ArrowDownRight, ArrowLeft, ArrowRight, CalendarDays, Check, CircleAlert, ExternalLink, Eye, EyeOff, FileCheck2, Info, LockKeyhole, LogOut, MessageCircle, ReceiptText, ShieldCheck, Star, WalletCards, X } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Brand } from "../components/Brand";
import { TravelCompanion } from "../components/TravelCompanion";
import { formatPhp, tripStageLabels } from "../data/myTripPresentation";
import type { BookingProgressItem, ItineraryDay, MyTripRecord, ProposalOption, TravelMoment, TripStage, TripStatus } from "../data/myTripTypes";
import { resolveInitialTripStage } from "../utils/tripEntry";

const stageOrder: TripStage[] = ["proposal", "booking", "companion", "completed"];
type ClientTrip = Omit<MyTripRecord, "token">;
type AuthState =
  | { status: "loading" }
  | { status: "locked"; token: string; error?: string }
  | { status: "error"; token: string; error: string }
  | { status: "unavailable"; token: string; lifecycle: "expired" | "archived" | "revoked" }
  | { status: "authenticated"; token: string; trip: ClientTrip; sessionExpiresAt: string };

export function MyTripPage() {
  const { token } = useParams();
  const [auth, setAuth] = useState<AuthState>({ status: "loading" });

  useEffect(() => {
    if (!token) return;
    let active = true;
    const restoreSession = async () => {
      try {
        const response = await fetch("/api/trips/session", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
        const payload = await response.json() as { ok?: boolean; trip?: ClientTrip; sessionExpiresAt?: string; error?: string; lifecycle?: "expired" | "archived" | "revoked" };
        if (!active) return;
        if (response.ok && payload.ok && payload.trip && payload.sessionExpiresAt) setAuth({ status: "authenticated", token, trip: payload.trip, sessionExpiresAt: payload.sessionExpiresAt });
        else if (response.status === 410 && payload.lifecycle) setAuth({ status: "unavailable", token, lifecycle: payload.lifecycle });
        else if (response.status === 503) setAuth({ status: "error", token, error: "AeroGo cannot open this trip right now. Please try again later." });
        else setAuth({ status: "locked", token });
      } catch {
        if (active) setAuth({ status: "error", token, error: "We couldn't reach AeroGo right now. Please try again in a moment." });
      }
    };
    void restoreSession();
    return () => { active = false; };
  }, [token]);

  if (!token) return <UnavailableTripPage />;
  const unlock = async (password: string) => {
    setAuth({ status: "loading" });
    try {
      const response = await fetch("/api/trips/access", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password }) });
      const payload = await response.json() as { ok?: boolean; trip?: ClientTrip; sessionExpiresAt?: string; error?: string; lifecycle?: "expired" | "archived" | "revoked" };
      if (response.ok && payload.ok && payload.trip && payload.sessionExpiresAt) setAuth({ status: "authenticated", token, trip: payload.trip, sessionExpiresAt: payload.sessionExpiresAt });
      else if (response.status === 410 && payload.lifecycle) setAuth({ status: "unavailable", token, lifecycle: payload.lifecycle });
      else if (response.status === 503) setAuth({ status: "error", token, error: "AeroGo cannot open this trip right now. Please try again later." });
      else setAuth({ status: "locked", token, error: response.status === 429 ? "Too many attempts for now. Please wait a moment, then try again." : payload.error });
    } catch {
      setAuth({ status: "error", token, error: "We couldn't reach AeroGo right now. Please try again in a moment." });
    }
  };
  const logout = async () => {
    await fetch("/api/trips/logout", { method: "POST", credentials: "include" }).catch(() => undefined);
    setAuth({ status: "locked", token });
  };

  if (auth.status === "authenticated" && auth.token === token) return <TripWorkspace key={`${token}-${auth.sessionExpiresAt}`} trip={auth.trip} onLogout={logout} />;
  if (auth.status === "unavailable" && auth.token === token) return <UnavailableTripPage status={auth.lifecycle === "revoked" ? undefined : auth.lifecycle} />;
  if (auth.status === "error" && auth.token === token) return <TripAccessScreen loading={false} error={auth.error} onUnlock={unlock} />;
  return <TripAccessScreen loading={auth.status === "loading"} error={auth.status === "locked" ? auth.error : undefined} onUnlock={unlock} />;
}

function TripAccessScreen({ loading, error, onUnlock }: { loading: boolean; error?: string; onUnlock: (password: string) => Promise<void> }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  return <div className="mytrip-app mytrip-access-app">
    <header className="mytrip-topbar"><div className="mytrip-topbar__inner"><Brand /><span className="mytrip-secure-label"><ShieldCheck size={14} /> Private trip space</span></div></header>
    <main className="mytrip-access-main">
      <div className="mytrip-access-decoration" aria-hidden="true"><span /><span /><span /></div>
      <div className="mytrip-access-card">
        <span className="mytrip-kicker"><LockKeyhole size={14} /> AEROGO MY TRIP</span>
        <h1>Welcome to<br /><em>your trip.</em></h1>
        <p className="mytrip-access-card__intro">Enter your private trip PIN or password to access your AeroGo travel space.</p>
        <form className="mytrip-access-form" onSubmit={(event) => { event.preventDefault(); if (password.trim()) void onUnlock(password); }}>
          <label htmlFor="trip-password">Private trip PIN or password</label>
          <div className="mytrip-access-input-wrap"><input id="trip-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" inputMode="text" enterKeyHint="go" placeholder="Enter the details AeroGo shared" disabled={loading} autoFocus /><button type="button" className="mytrip-access-show" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide PIN or password" : "Show PIN or password"} disabled={loading}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
          {error && <p className="mytrip-access-error" role="alert"><CircleAlert size={15} /> {error}</p>}
          <button className="mytrip-button mytrip-button--dark mytrip-access-submit" type="submit" disabled={loading || !password.trim()}>{loading ? <><span className="mytrip-spinner" /> Checking your private trip…</> : <>Unlock My Trip <ArrowRight size={16} /></>}</button>
        </form>
        <div className="mytrip-access-help"><MessageCircle size={17} /><span><strong>Need help opening your trip?</strong><small>The link may have expired or been revoked. Contact AeroGo and we’ll help you find your trip details.</small><Link to="/#inquire">Message AeroGo <ArrowRight size={13} /></Link></span></div>
      </div>
    </main>
  </div>;
}

function TripWorkspace({ trip, onLogout }: { trip: ClientTrip; onLogout: () => Promise<void> }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [demoMoment, setDemoMoment] = useState<TravelMoment>("active-travel-day");
  const stage = resolveInitialTripStage(trip.currentStage, trip.isDemo, searchParams.get("stage"));
  const isIllustrativeProposal = stage === "proposal" && trip.proposal?.kind === "illustrative";
  const selectDemoStage = (nextStage: TripStage) => {
    if (!trip.isDemo) return;
    setSearchParams((current) => {
      current.set("stage", nextStage);
      current.delete("view");
      return current;
    });
  };

  return <div className="mytrip-app">
    <header className="mytrip-topbar">
      <div className="mytrip-topbar__inner">
        <Brand />
        <div className="mytrip-topbar__meta"><span className="mytrip-secure-label"><ShieldCheck size={14} /> Private trip space</span><button className="mytrip-logout-button" type="button" onClick={() => void onLogout()}><LogOut size={13} /> Lock trip</button><Link to="/"><ArrowLeft size={14} /> AeroGo home</Link></div>
      </div>
    </header>

    <main className={stage === "companion" ? "mytrip-main mytrip-main--companion" : "mytrip-main"}>
      {stage !== "companion" && !isIllustrativeProposal && <section className="mytrip-stage-bar" aria-label="Trip journey stages">
        <div className="mytrip-stage-bar__inner">
          <div className="mytrip-stage-bar__intro"><span className="mytrip-kicker">YOUR TRIP STAGE</span><p>See what is ready now and what happens next.</p></div>
          {trip.isDemo ? <div className="mytrip-stage-switcher" role="tablist" aria-label="Demo stage switcher">{stageOrder.map((stageId, index) => <button key={stageId} type="button" role="tab" aria-selected={stage === stageId} className={`mytrip-stage-tab${stage === stageId ? " is-active" : ""}`} onClick={() => selectDemoStage(stageId)}><span>{String(index + 1).padStart(2, "0")}</span>{tripStageLabels[stageId].short}</button>)}</div> : <div className="mytrip-stage-progress" aria-label={`Current trip stage: ${tripStageLabels[stage].short}`}>{stageOrder.map((stageId, index) => <span key={stageId} className={stage === stageId ? "is-active" : stageOrder.indexOf(stage) > index ? "is-complete" : ""}><b>{String(index + 1).padStart(2, "0")}</b>{tripStageLabels[stageId].short}</span>)}</div>}
        </div>
      </section>}

      <div className={`mytrip-content${stage === "companion" ? " mytrip-content--companion" : ""}`}>
        {stage !== "companion" && !isIllustrativeProposal && <div className="mytrip-current-stage"><span className="mytrip-kicker">CURRENT VIEW · {tripStageLabels[stage].short.toUpperCase()}</span><p>{tripStageLabels[stage].description}</p></div>}
        {stage === "proposal" && <ProposalStage trip={trip} />}
        {stage === "booking" && <BookingStage trip={trip} />}
        {stage === "companion" && <CompanionStage trip={trip} demoStage={stage} demoMoment={demoMoment} onDemoStageChange={selectDemoStage} onDemoMomentChange={setDemoMoment} />}
        {stage === "completed" && <CompletedStage trip={trip} />}
      </div>
    </main>

    {stage !== "companion" && <footer className="mytrip-footer"><div><Brand light /><span>Your trip details, all in one place.</span></div><p>{trip.isDemo ? "Fictional demo · No real client data · " : trip.proposal?.kind === "illustrative" ? "Illustrative local preview · No client data · " : "Private client trip space · "}<Link to="/">Return to AeroGo</Link></p></footer>}
  </div>;
}

function UnavailableTripPage({ status }: { status?: TripStatus }) {
  const isArchived = status === "archived";
  const isExpired = status === "expired";
  const title = isArchived ? "This trip has been\narchived." : isExpired ? "This trip link has\nexpired." : "This trip space is\nnot available.";
  const description = isArchived ? "This trip space is closed and its details are no longer available." : isExpired ? "This trip link is no longer active. Contact AeroGo if you need your trip details." : "This trip link may have expired, been archived, or may be incorrect. Contact AeroGo if you need help.";
  return <div className="mytrip-app mytrip-unavailable"><header className="mytrip-topbar"><div className="mytrip-topbar__inner"><Brand /><Link to="/"><ArrowLeft size={14} /> AeroGo home</Link></div></header><main className="mytrip-unavailable__main"><span className="mytrip-kicker"><ShieldCheck size={14} /> AEROGO MY TRIP</span><h1>{title.split("\n").map((line, index) => <span key={line}>{index > 0 && <br />}<em>{line}</em></span>)}</h1><p>{description}</p><Link className="mytrip-button mytrip-button--dark" to="/#inquire">Message AeroGo <ArrowRight size={16} /></Link><span className="mytrip-unavailable__note">No customer information is shown for this unavailable trip link.</span></main></div>;
}

function ProposalStage({ trip }: { trip: ClientTrip }) {
  if (trip.proposal?.kind === "illustrative") return <IllustrativeProposalStage trip={trip} />;
  return <PricedProposalStage trip={trip} />;
}

function PricedProposalStage({ trip }: { trip: ClientTrip }) {
  const [selectedOptionId, setSelectedOptionId] = useState(trip.quote.options.find((option) => option.recommended)?.id ?? trip.quote.options[0].id);
  const selectedOption = trip.quote.options.find((option) => option.id === selectedOptionId) ?? trip.quote.options[0];
  return <section className="mytrip-stage mytrip-proposal-stage">
    <StageHeading eyebrow="01 · PROPOSAL" title={tripStageLabels.proposal.title} />
    <div className="mytrip-proposal-grid">
      <article className="mytrip-card mytrip-quote-card"><div className="mytrip-card__topline"><span className="mytrip-status-pill"><span /> {trip.quote.status}</span><span className="mytrip-revision">{trip.quote.revision}</span></div><div className="mytrip-quote-card__heading"><span className="mytrip-kicker">TRIP FOR</span><h2>{trip.travelerName}</h2><p>{trip.destination} <span>·</span> {trip.dates}</p></div><div className="mytrip-quote-card__price"><span>Estimated total</span><strong>{formatPhp(selectedOption.amount)}</strong><small>For {trip.travelerCount} people · {formatPhp(selectedOption.perTraveler)} per person</small></div><div className="mytrip-quote-card__validity"><CalendarDays size={16} /><span><strong>{trip.quote.validity}</strong><small>Availability and final price must still be confirmed.</small></span></div></article>
      <article className="mytrip-card mytrip-quote-summary"><CardKicker icon={<ReceiptText size={15} />} label="YOUR TRIP PLAN" /><h2>A plan for your review.</h2><p>Review the route, hotel and package details below.</p><div className="mytrip-quote-summary__route"><span>MANILA</span><ArrowRight size={15} /><span>{trip.destinationShort.toUpperCase()}</span><i /> <strong>{trip.booking.acceptedQuoteSnapshot.packageName}</strong></div><a className="mytrip-button mytrip-button--dark" href="#package-options">View Your Quote <ArrowDownRight size={16} /></a></article>
    </div>

    <section className="mytrip-section" id="package-options"><SectionHeading eyebrow="CHOOSE YOUR PACKAGE" title="Choose a package." note="All amounts are estimates until confirmed." /><div className="mytrip-option-grid">{trip.quote.options.map((option) => <ProposalOptionCard key={option.id} option={option} selected={option.id === selectedOptionId} onSelect={() => setSelectedOptionId(option.id)} />)}</div></section>
    <div className="mytrip-two-column mytrip-two-column--details"><section className="mytrip-section"><SectionHeading eyebrow="INCLUDED" title="What this package includes." /><div className="mytrip-detail-panel"><div><span className="mytrip-panel-label">IN THIS ESTIMATE</span><ul>{selectedOption.includes.map((item) => <li key={item}><Check size={15} /> {item}</li>)}</ul></div><div className="mytrip-detail-divider" /><div><span className="mytrip-panel-label">NOT INCLUDED</span><ul className="is-muted">{selectedOption.excludes.map((item) => <li key={item}><X size={15} /> {item}</li>)}</ul></div></div></section><section className="mytrip-section"><SectionHeading eyebrow="SAMPLE ITINERARY" title="First few days." /><ItineraryPreview days={trip.companion.itinerary.slice(0, 3)} /></section></div>
    <div className="mytrip-quote-footer"><div><span className="mytrip-kicker">QUOTE VERSIONS</span><strong>{trip.quote.revision} · prepared {trip.quote.revisions[0].date}</strong><small>Older versions are kept separate so your conversations remain clear.</small></div><div className="mytrip-revision-list">{trip.quote.revisions.map((revision) => <span key={revision.label} className={revision.status === "current" ? "is-current" : ""}>{revision.label} <small>{revision.date}</small></span>)}</div></div>
    <ContactCard trip={trip} label="Want to change something?" text="Tell AeroGo what you would like to change." />
  </section>;
}

const vietnamAtAGlanceTitles = [
  "Arrive in Da Nang",
  "Son Tra + Lady Buddha",
  "Ba Na Hills + Golden Bridge",
  "Hoi An by day, lanterns by night",
  "Easy departure from Da Nang",
];

type VietnamHighlight = { label: string; note?: string; optional?: boolean };

function getVietnamDayExperience(day: ItineraryDay) {
  switch (day.day) {
    case 1:
      return "Land in Da Nang, make your way to the hotel and ease into your first evening in Vietnam.";
    case 2:
      return "Explore the greener side of Da Nang with a visit to Son Tra Peninsula and Lady Buddha.";
    case 3:
      return "Spend a full day above Da Nang at Ba Na Hills, ride the cable car into the mountains and walk across the famous Golden Bridge.";
    case 4:
      return "Spend the day wandering Hoi An Old Town, then stay into the evening for the lantern-lit riverside atmosphere.";
    case 5:
      return "Enjoy an easy final morning in Da Nang before checking out and heading to the airport.";
    default:
      return day.summary;
  }
}

function getVietnamHighlights(day: ItineraryDay): VietnamHighlight[] {
  const dragonBridgeNote = day.items.find((item) => item.title.toLowerCase().includes("dragon bridge"))?.note;
  switch (day.day) {
    case 1:
      return [
        { label: "Arrival in Da Nang" },
        { label: "Airport to hotel transfer" },
        { label: "Hotel check-in" },
        { label: "Dragon Bridge evening option", note: dragonBridgeNote, optional: true },
      ];
    case 2:
      return [
        { label: "Son Tra Peninsula" },
        { label: "Lady Buddha" },
        { label: "Viewpoints and surroundings" },
      ];
    case 3:
      return [
        { label: "Ba Na Hills" },
        { label: "Golden Bridge" },
        { label: "Cable car experience" },
      ];
    case 4:
      return [
        { label: "Hoi An Old Town" },
        { label: "Time to explore" },
        { label: "Evening lantern boat", optional: true },
        { label: "Return to Da Nang" },
      ];
    case 5:
      return [
        { label: "Hotel checkout" },
        { label: "Airport transfer" },
        { label: "Departure" },
      ];
    default:
      return day.items.map((item) => ({ label: item.title }));
  }
}

function IllustrativeProposalStage({ trip }: { trip: ClientTrip }) {
  const proposal = trip.proposal;
  if (!proposal) return null;
  return <section className="mytrip-stage mytrip-proposal-stage mytrip-proposal-stage--illustrative">
    <section className="mytrip-vietnam-proposal-brief" aria-labelledby="vietnam-proposal-title">
      <div className="mytrip-vietnam-proposal-brief__topline"><span className="mytrip-status-pill mytrip-status-pill--preview"><span /> {proposal.statusLabel}</span><span>Initial itinerary</span></div>
      <h1 id="vietnam-proposal-title">{trip.destination}</h1>
      <p className="mytrip-vietnam-proposal-brief__dates">{trip.dates} <span>·</span> {trip.duration}</p>
      <a className="mytrip-button mytrip-button--coral" href="#vietnam-itinerary">See the 5-day plan <ArrowDownRight size={16} /></a>
      <p className="mytrip-vietnam-proposal-brief__summary">{proposal.summary}</p>
      <p className="mytrip-vietnam-proposal-brief__planning-note">Initial itinerary for discussion.</p>
    </section>

    <section className="mytrip-vietnam-glance" aria-labelledby="vietnam-at-a-glance-title">
      <div className="mytrip-vietnam-glance__heading"><h2 id="vietnam-at-a-glance-title">AT A GLANCE</h2><span>{trip.duration}</span></div>
      <ol>{trip.companion.itinerary.map((day, index) => <li key={day.day}><span>DAY {String(day.day).padStart(2, "0")}</span><strong>{vietnamAtAGlanceTitles[index] ?? day.title}</strong></li>)}</ol>
    </section>

    <section className="mytrip-section mytrip-vietnam-proposal-section" id="vietnam-itinerary">
      <SectionHeading eyebrow="DAY BY DAY" title="Five days in Central Vietnam." note="Moments to look forward to across Da Nang and Hoi An." />
      <div className="mytrip-vietnam-day-list">
        {trip.companion.itinerary.map((day) => <article className="mytrip-vietnam-day" key={day.day}>
          <div className="mytrip-vietnam-day__heading"><span>DAY {String(day.day).padStart(2, "0")}</span><div><h3>{day.title}</h3><small>{day.date}</small></div></div>
          <p className="mytrip-vietnam-day__experience">{getVietnamDayExperience(day)}</p>
          <div className="mytrip-vietnam-day__highlights"><span className="mytrip-vietnam-day__label">HIGHLIGHTS</span><ul>{getVietnamHighlights(day).map((highlight) => <li className={highlight.optional ? "is-optional" : ""} key={highlight.label}><div><strong>{highlight.label}</strong>{highlight.optional && <span>Evening option</span>}</div>{highlight.note && <small>{highlight.note}</small>}</li>)}</ul></div>
        </article>)}
      </div>
    </section>

    <section className="mytrip-section mytrip-vietnam-proposal-section" id="other-interests">
      <SectionHeading eyebrow="NEXT POSSIBILITIES" title="Also on your wishlist" note="These would work best as a separate route or with additional travel days." />
      <div className="mytrip-vietnam-interest-list">{proposal.otherInterests.map((interest) => <article className="mytrip-vietnam-interest" key={interest.place}><span className="mytrip-vietnam-interest__label">WISHLIST</span><strong>{interest.place}</strong><span>{interest.interest}</span><p>{interest.note}</p></article>)}</div>
    </section>

    <section className="mytrip-section mytrip-vietnam-proposal-section" id="proposal-pricing">
      <SectionHeading eyebrow="PRICING" title="Next: your package price" />
      <div className="mytrip-vietnam-pricing"><strong>Price being prepared</strong><p>We’re preparing the package price around the final trip arrangements.</p></div>
      <div className="mytrip-vietnam-before-booking"><span className="mytrip-vietnam-day__label">BEFORE BOOKING</span><p>{proposal.pricingNote}</p></div>
    </section>

    <div className="mytrip-vietnam-contact"><ContactCard trip={trip} label="Want to shape this trip?" text="Tell AeroGo what you’d like to change, add or prioritize." /></div>
  </section>;
}

function BookingStage({ trip }: { trip: ClientTrip }) {
  const priorityRequirement = trip.booking.requirements.find((requirement) => requirement.status === "needed") ?? trip.booking.requirements.find((requirement) => requirement.status === "not-yet");
  const priorityStatus = priorityRequirement?.status === "needed" ? "Needed from you" : priorityRequirement ? "Not checked yet" : "No action needed from you right now";
  return <section className="mytrip-stage">
    <StageHeading eyebrow="02 · BOOKING" title={tripStageLabels.booking.title} />
    <div className="mytrip-stage-intro"><span className="mytrip-stage-intro__icon"><FileCheck2 size={22} /></span><p>Your accepted plan stays here while AeroGo arranges the details. A booking is final only after the provider confirms it.</p><span className="mytrip-status-pill mytrip-status-pill--soft"><span /> Booking in progress</span></div>
    <section className="mytrip-booking-priority" aria-labelledby="booking-priority-heading"><span className="mytrip-booking-priority__icon"><Info size={18} /></span><div><span className="mytrip-kicker">NEXT REQUIREMENT</span><h3 id="booking-priority-heading">{priorityRequirement?.label ?? "No outstanding requirement"}</h3><p>{priorityRequirement?.detail ?? "AeroGo has no additional information listed for you at this time."}</p><strong>{priorityStatus}</strong></div></section>
    <div className="mytrip-two-column mytrip-booking-layout"><section className="mytrip-section"><SectionHeading eyebrow="ACCEPTED QUOTE" title="Your saved quote." note="This saved quote will not change if a new proposal is prepared." /><div className="mytrip-accepted-quote"><div className="mytrip-accepted-quote__top"><span className="mytrip-kicker">{trip.booking.acceptedQuoteSnapshot.revision} · ACCEPTED {trip.booking.acceptedQuoteSnapshot.date}</span><ShieldCheck size={18} /></div><h2>{trip.booking.acceptedQuoteSnapshot.packageName}</h2><strong>{formatPhp(trip.booking.acceptedQuoteSnapshot.total)}</strong><p>{trip.booking.acceptedQuoteSnapshot.note}</p><div className="mytrip-accepted-quote__line"><span>Destination</span><b>{trip.destination}</b></div><div className="mytrip-accepted-quote__line"><span>Travel dates</span><b>{trip.dates}</b></div></div></section><section className="mytrip-section"><SectionHeading eyebrow="BOOKING STATUS" title="What happens next." /><ProgressList items={trip.booking.progress} /></section></div>
    <div className="mytrip-two-column mytrip-two-column--details"><section className="mytrip-section"><SectionHeading eyebrow="DETAILS WE STILL NEED" title="What AeroGo needs from you." /><div className="mytrip-requirement-list">{trip.booking.requirements.map((requirement) => <div key={requirement.label} className="mytrip-requirement"><span className={`mytrip-requirement__icon is-${requirement.status}`}>{requirement.status === "received" ? <Check size={15} /> : <Info size={15} />}</span><span><strong>{requirement.label}</strong><small>{requirement.detail}</small></span><em>{requirement.status === "needed" ? "Needed from you" : requirement.status === "received" ? "Received" : "Not checked yet"}</em></div>)}</div></section><section className="mytrip-section"><SectionHeading eyebrow="NEXT STEPS" title="What you can do now." /><ol className="mytrip-next-steps">{trip.booking.nextSteps.map((step) => <li key={step}>{step}</li>)}</ol><div className="mytrip-payment-card"><WalletCards size={18} /><span><strong>{trip.booking.paymentStatus}</strong><small>{trip.booking.paymentDetail}</small></span></div></section></div>
    <ContactCard trip={trip} label="Need to change something?" text="Message AeroGo before approving a new version so we keep the correct quote." />
  </section>;
}

function CompanionStage({ trip, demoStage, demoMoment, onDemoStageChange, onDemoMomentChange }: { trip: ClientTrip; demoStage: TripStage; demoMoment: TravelMoment; onDemoStageChange: (stage: TripStage) => void; onDemoMomentChange: (moment: TravelMoment) => void }) {
  return <section className="mytrip-stage mytrip-travel-companion-stage"><TravelCompanion trip={trip} demoStage={demoStage} demoMoment={demoMoment} onDemoStageChange={onDemoStageChange} onDemoMomentChange={onDemoMomentChange} /></section>;
}

function CompletedStage({ trip }: { trip: ClientTrip }) {
  return <section className="mytrip-stage mytrip-completed-stage"><StageHeading eyebrow="04 · TRIP COMPLETED" title={trip.completed.message} /><div className="mytrip-completed-card"><div className="mytrip-completed-card__icon"><Star size={23} /></div><span className="mytrip-kicker">A NOTE FROM AEROGO</span><h2>Thank you for travelling with AeroGo.</h2><p>{trip.completed.note}</p><div className="mytrip-completed-card__actions"><Link className="mytrip-button mytrip-button--coral" to="/#inquire">Plan another trip <ArrowRight size={16} /></Link>{trip.completed.reviewUrl ? <a className="mytrip-button mytrip-button--outline" href={trip.completed.reviewUrl} target="_blank" rel="noreferrer">Share your thoughts <ExternalLink size={15} /></a> : <span className="mytrip-no-review"><MessageCircle size={15} /> Feedback link can be added here when configured.</span>}</div></div><div className="mytrip-completed-note"><ShieldCheck size={18} /><span><strong>About your trip details</strong><small>{trip.completed.retentionNote}{trip.isDemo ? " This demo contains no client documents or sensitive information." : " Keep only the information required by AeroGo's data policy."}</small></span></div><ContactCard trip={trip} label="Planning another trip?" text="AeroGo can help you plan your next trip." /></section>;
}

function StageHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div className="mytrip-stage-heading"><span className="mytrip-kicker">{eyebrow}</span><h2>{title}</h2></div>;
}

function SectionHeading({ eyebrow, title, note }: { eyebrow: string; title: string; note?: string }) {
  return <div className="mytrip-section-heading"><div><span className="mytrip-kicker">{eyebrow}</span><h3>{title}</h3></div>{note && <p>{note}</p>}</div>;
}

function CardKicker({ icon, label }: { icon: ReactNode; label: string }) {
  return <span className="mytrip-card-kicker">{icon}{label}</span>;
}

function ProposalOptionCard({ option, selected, onSelect }: { option: ProposalOption; selected: boolean; onSelect: () => void }) {
  return <article className={`mytrip-option-card${selected ? " is-selected" : ""}`}><button type="button" className="mytrip-option-card__select" onClick={onSelect} aria-pressed={selected}><span className="mytrip-option-card__radio">{selected && <span />}</span><span><strong>{option.name}</strong>{option.recommended && <em>Recommended for your trip</em>}</span><ArrowRight size={17} /></button><p>{option.description}</p><div className="mytrip-option-card__price"><strong>{formatPhp(option.amount)}</strong><span>Estimated total</span><small>{formatPhp(option.perTraveler)} per person</small></div><div className="mytrip-option-card__tags"><span><Check size={13} /> {option.includes[0]}</span><span><Check size={13} /> {option.includes[1]}</span></div></article>;
}

function ItineraryPreview({ days }: { days: ItineraryDay[] }) {
  return <div className="mytrip-itinerary-preview">{days.map((day) => <div key={day.day}><span className="mytrip-itinerary-preview__day">0{day.day}</span><span><strong>{day.title}</strong><small>{day.date} · {day.summary}</small></span></div>)}</div>;
}

function ProgressList({ items }: { items: BookingProgressItem[] }) {
  return <div className="mytrip-progress-list">{items.map((item, index) => <div className={`mytrip-progress-item is-${item.status}`} key={item.label}><span className="mytrip-progress-item__line"><i>{item.status === "complete" ? <Check size={13} /> : String(index + 1).padStart(2, "0")}</i></span><span><strong>{item.label}</strong><small>{item.detail}</small></span></div>)}</div>;
}

function ContactCard({ trip, label, text }: { trip: ClientTrip; label: string; text: string }) {
  return <section className="mytrip-contact-card"><div className="mytrip-contact-card__icon"><MessageCircle size={20} /></div><div><span className="mytrip-kicker">AERO GO SUPPORT</span><h3>{label}</h3><p>{text}</p><small>{trip.contact.note}</small></div><Link className="mytrip-button mytrip-button--light" to={trip.contact.href}>{trip.contact.label} <ArrowRight size={16} /></Link></section>;
}
