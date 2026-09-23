import { ArrowRight, CalendarDays, CheckCircle2, ChevronDown, CircleAlert, CircleHelp, Clock3, ExternalLink, Hotel, Map, MapPin, Navigation, Phone, Plane, RefreshCw, ShieldCheck, Ticket, WalletCards } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { reservationStatusLabel, tripStageLabels } from "../data/myTripPresentation";
import type { DemoSimulationPreset, FlightSummary, ItineraryDay, ItineraryItem, MyTripRecord, ReservationState, TravelMoment, TripStage } from "../data/myTripTypes";
import { expenseCurrency, expenseGroupAmount, expensePerPersonAmount, expensePhpEquivalent, formatCurrencyAmount, summarizeExpenses } from "../utils/expensePresentation";
import { safeContactUrl, safeExternalUrl, safeTelephoneUrl } from "../utils/safeUrl";
import { formatZonedTime, friendlyTimeZoneName, selectContextualHome, shouldShowPhilippineTime, type ContextualHomeState, type NextAction } from "../utils/nextAction";
import { getWalletCategorySummaries, type WalletCategoryId, type WalletCategorySummary } from "../utils/walletSummary";

type ClientTrip = Omit<MyTripRecord, "token">;
type CompanionView = "home" | "plan" | "wallet" | "help";

const views: Array<{ id: CompanionView; label: string; icon: typeof Map }> = [
  { id: "home", label: "Home", icon: MapPin },
  { id: "plan", label: "Plan", icon: CalendarDays },
  { id: "wallet", label: "Wallet", icon: WalletCards },
  { id: "help", label: "Help", icon: CircleHelp },
];

const momentOrder: TravelMoment[] = ["before-departure", "departure-day", "arrival", "active-travel-day", "end-of-day", "return-journey", "completed"];
const demoStageOrder: TripStage[] = ["proposal", "booking", "companion", "completed"];

export function TravelCompanion({ trip, demoStage, demoMoment, onDemoStageChange, onDemoMomentChange }: { trip: ClientTrip; demoStage: TripStage; demoMoment: TravelMoment; onDemoStageChange: (stage: TripStage) => void; onDemoMomentChange: (moment: TravelMoment) => void }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [clock, setClock] = useState(() => new Date());
  const requestedView = searchParams.get("view") as CompanionView | null;
  const view: CompanionView = requestedView && views.some((item) => item.id === requestedView) ? requestedView : "home";
  const demoPreset = trip.isDemo ? trip.companion.demoSimulation?.[demoMoment] : undefined;
  const contextNow = demoPreset ? new Date(demoPreset.now) : clock;
  const home = selectContextualHome(trip, { now: contextNow, momentOverride: demoPreset ? demoMoment : undefined });
  const currentTimeZone = home.destinationTimeZone ?? trip.companion.homeTimeZone;

  useEffect(() => {
    const refresh = () => setClock(new Date());
    const interval = window.setInterval(refresh, 60_000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  const setView = (nextView: CompanionView) => {
    setSearchParams((current) => {
      current.set("view", nextView);
      return current;
    });
  };

  return <section className="travel-companion-shell" aria-label="AeroGo Travel Companion">
    <div className="travel-companion-main">
      <CompanionCurrentTime now={clock} destination={trip.destinationShort} timeZone={currentTimeZone} />
      {view === "home" && <CompanionHome trip={trip} home={home} onViewChange={setView} demoStage={demoStage} demoPreset={demoPreset} demoMoment={demoMoment} onDemoStageChange={onDemoStageChange} onDemoMomentChange={onDemoMomentChange} />}
      {view === "plan" && <CompanionPlan trip={trip} />}
      {view === "wallet" && <CompanionWallet trip={trip} />}
      {view === "help" && <CompanionHelp trip={trip} onViewChange={setView} />}
    </div>
    <nav className="travel-companion-nav" aria-label="Travel Companion navigation">
      {views.map(({ id, label, icon: Icon }) => <button key={id} type="button" className={`travel-companion-nav__item${view === id ? " is-active" : ""}`} onClick={() => setView(id)} aria-current={view === id ? "page" : undefined}>
        <Icon size={22} strokeWidth={view === id ? 2.2 : 1.8} aria-hidden="true" /><span>{label}</span>
      </button>)}
    </nav>
  </section>;
}

function CompanionCurrentTime({ now, destination, timeZone }: { now: Date; destination: string; timeZone?: string }) {
  const destinationTime = formatZonedTime(now, timeZone);
  const philippineTime = destinationTime && shouldShowPhilippineTime(now, timeZone) ? formatZonedTime(now, "Asia/Manila") : null;
  return <aside className="travel-current-time-bar" aria-label="Current time" role="status">
    <Clock3 size={21} aria-hidden="true" />
    <div className="travel-current-time-bar__main">
      <span>CURRENT TIME</span>
      <strong>{destinationTime ?? "Time unavailable"}</strong>
      <small>{destinationTime ? `${destination} time` : "Destination time is not configured"}</small>
    </div>
    {philippineTime && <div className="travel-current-time-bar__secondary"><span>Philippine time</span><strong>{philippineTime}</strong></div>}
  </aside>;
}

function CompanionHeader({ trip, home, eyebrow = "AEROGO MY TRIP" }: { trip: ClientTrip; home?: ContextualHomeState; eyebrow?: string }) {
  return <header className="travel-companion-header">
    <div>
      <span className="travel-companion-eyebrow"><ShieldCheck size={15} /> {eyebrow}</span>
      <h1>{trip.destinationShort}</h1>
      <p>{home?.destinationLocalDate ?? trip.dates}</p>
    </div>
    {home && <span className="travel-companion-freshness"><RefreshCw size={14} /> {home.freshnessText}</span>}
  </header>;
}

function CompanionHome({ trip, home, onViewChange, demoStage, demoPreset, demoMoment, onDemoStageChange, onDemoMomentChange }: { trip: ClientTrip; home: ContextualHomeState; onViewChange: (view: CompanionView) => void; demoStage: TripStage; demoPreset?: DemoSimulationPreset; demoMoment: TravelMoment; onDemoStageChange: (stage: TripStage) => void; onDemoMomentChange: (moment: TravelMoment) => void }) {
  return <div className="travel-home-view">
    <CompanionHeader trip={trip} home={home} />
    <section className="travel-next-action" aria-labelledby="travel-next-action-heading">
      <div className="travel-next-action__label"><span><span className="travel-live-dot" /> WHAT'S NEXT</span><span className="travel-status-badge">{home.moment === "neutral" ? "Needs more detail" : momentLabel(home.moment)}</span></div>
      {home.moment === "end-of-day" ? <EndOfDayCard home={home} headingId="travel-next-action-heading" /> : home.nextAction ? <NextActionCard action={home.nextAction} headingId="travel-next-action-heading" /> : <NeutralNextAction home={home} headingId="travel-next-action-heading" />}
    </section>
    {trip.isDemo && <DemoSimulationControls trip={trip} stage={demoStage} selected={demoMoment} onStageChange={onDemoStageChange} onChange={onDemoMomentChange} preset={demoPreset} />}
    {home.preparationTasks.length > 0 && <section className="travel-preparation-card" aria-labelledby="travel-preparation-heading"><div className="travel-section-heading"><div><span className="travel-section-eyebrow">IMPORTANT REMINDERS</span><h2 id="travel-preparation-heading">Before you go.</h2></div><CheckCircle2 size={22} /></div><ul>{home.preparationTasks.map((task) => <li key={task}><span aria-hidden="true" />{task}</li>)}</ul></section>}
    {home.afterThis && <section className="travel-after-card" aria-labelledby="travel-after-heading"><div><span className="travel-section-eyebrow">UP NEXT</span><h2 id="travel-after-heading">{home.afterThis.title}</h2><p>{home.afterThis.dateLabel ?? "Date to be confirmed"}{home.afterThis.timeLabel ? ` · ${home.afterThis.timeLabel}` : ""} · {home.afterThis.statusLabel}</p></div><button type="button" onClick={() => onViewChange("plan")} aria-label={`Open the plan for ${home.afterThis.title}`}><ArrowRight size={20} /></button></section>}
    {home.moment === "end-of-day" && !home.afterThis && <EmptyState title="Nothing else is scheduled yet." text="AeroGo will show the next known activity here when timing is available." />}
    <div className="travel-home-actions"><button type="button" className="travel-primary-button" onClick={() => onViewChange("plan")}>View today’s plan <ArrowRight size={18} /></button><button type="button" className="travel-secondary-button" onClick={() => onViewChange("help")}>Need help with your trip? <CircleHelp size={18} /></button>{home.moment === "arrival" && <button type="button" className="travel-secondary-button travel-arrival-button" onClick={() => onViewChange("help")}>Open Arrival Guide <MapPin size={18} /></button>}</div>
    {trip.isDemo && <p className="travel-demo-disclaimer"><CircleAlert size={14} /> Fictional demo. Schedules, places, prices and booking details are examples only.</p>}
  </div>;
}

function DemoSimulationControls({ trip, stage, selected, onStageChange, onChange, preset }: { trip: ClientTrip; stage: TripStage; selected: TravelMoment; onStageChange: (stage: TripStage) => void; onChange: (moment: TravelMoment) => void; preset?: DemoSimulationPreset }) {
  const simulation = trip.companion.demoSimulation;
  if (!simulation) return null;
  const simulationDescription = preset?.description ?? "Choose a trip stage.";
  return <details className="travel-demo-simulator">
    <summary className="travel-demo-simulator__summary">
      <span><CircleAlert size={16} /> FICTIONAL DEMO</span>
      <strong>Test Another Trip Stage</strong>
      <small>{preset?.label ?? "Choose a state"}</small>
      <ChevronDown size={22} aria-hidden="true" />
    </summary>
    <div className="travel-demo-simulator__panel" aria-labelledby="travel-demo-simulator-heading">
      <p id="travel-demo-simulator-heading">{simulationDescription} The current time stays real; only this trip stage is simulated.</p>
      <span className="travel-demo-simulator__label">Demo journey stage</span>
      <div className="travel-demo-simulator__stage-controls" role="group" aria-label="Demo journey stage">
        {demoStageOrder.map((stageId) => <button key={stageId} type="button" className={stage === stageId ? "is-selected" : ""} aria-pressed={stage === stageId} onClick={() => onStageChange(stageId)}>{tripStageLabels[stageId].short}</button>)}
      </div>
      <span className="travel-demo-simulator__label">Trip moment</span>
      <div className="travel-demo-simulator__controls" role="group" aria-label="Demo travel moment">
        {momentOrder.map((moment) => <button key={moment} type="button" className={selected === moment ? "is-selected" : ""} aria-pressed={selected === moment} onClick={() => onChange(moment)}>{simulation[moment]?.label ?? momentLabel(moment)}</button>)}
      </div>
    </div>
  </details>;
}

function NextActionCard({ action, headingId }: { action: NextAction; headingId: string }) {
  const isFlight = action.kind === "flight" || action.kind === "return-flight";
  const isPlanned = action.status !== "confirmed";
  const directionsUrl = safeExternalUrl(action.directionsUrl);
  const ticketUrl = safeExternalUrl(action.ticketUrl);
  const bookingUrl = safeExternalUrl(action.bookingUrl);
  const checkInUrl = safeExternalUrl(action.checkInUrl);
  const airlineStatusUrl = safeExternalUrl(action.airlineStatusUrl);
  const providerPhoneUrl = safeTelephoneUrl(action.providerPhone);
  return <div className="travel-next-action__content">
    <div className="travel-next-action__icon" aria-hidden="true">{isFlight ? <Plane size={25} /> : action.kind === "transfer" ? <Navigation size={25} /> : <MapPin size={25} />}</div>
    <div className="travel-next-action__copy">
      <span className="travel-action-status"><span className={`travel-status-dot is-${action.status}`} /> {action.statusLabel}</span>
      <h2 id={headingId}>{action.title}</h2>
      <div className="travel-next-action__time"><strong>{action.timeLabel ?? "Time to be confirmed"}</strong>{action.dateLabel && <span>{action.dateLabel}</span>}</div>
      <p className="travel-next-action__location"><MapPin size={18} /> {action.location}</p>
      {action.transportSummary && action.transportSummary !== action.location && <p className="travel-next-action__transport"><Navigation size={16} /> {action.transportSummary}</p>}
      {action.kind === "transfer" && action.meetingPoint && <p className="travel-next-action__transport"><MapPin size={16} /> Meeting point: {action.meetingPoint}</p>}
      {action.kind === "transfer" && action.providerContact && <p className="travel-next-action__transport"><Phone size={16} /> {action.providerContact}</p>}
      {action.leaveByLabel && <div className="travel-leave-by"><Clock3 size={20} /><span><small>{action.leaveByAt ? "LEAVE BY" : "LEAVE-BY TIME"}</small><strong>{action.leaveByAt ? action.leaveByLabel : action.leaveByLabel}</strong></span></div>}
      <div className="travel-next-action__buttons">
        {directionsUrl ? <a className="travel-primary-button" href={directionsUrl} target="_blank" rel="noreferrer"><Navigation size={18} /> Directions</a> : <span className="travel-action-unavailable"><Navigation size={17} /> Directions not configured</span>}
        {bookingUrl && <a className="travel-secondary-button" href={bookingUrl} target="_blank" rel="noreferrer"><Ticket size={18} /> Show booking</a>}
        {ticketUrl && <a className="travel-secondary-button" href={ticketUrl} target="_blank" rel="noreferrer"><Ticket size={18} /> Show ticket</a>}
        {providerPhoneUrl && <a className="travel-secondary-button" href={providerPhoneUrl}><Phone size={18} /> Call driver</a>}
        {isFlight && checkInUrl && <a className="travel-secondary-button" href={checkInUrl} target="_blank" rel="noreferrer">Check in <ExternalLink size={16} /></a>}
        {isFlight && airlineStatusUrl && <a className="travel-secondary-button" href={airlineStatusUrl} target="_blank" rel="noreferrer">Airline status <ExternalLink size={16} /></a>}
      </div>
      {isPlanned && <p className="travel-next-action__note"><CircleAlert size={15} /> {action.note}</p>}
    </div>
  </div>;
}

function NeutralNextAction({ home, headingId }: { home: ContextualHomeState; headingId: string }) {
  return <div className="travel-neutral-state"><div className="travel-neutral-state__icon"><CircleAlert size={26} /></div><h2 id={headingId}>Your trip overview</h2><p>{home.supportingText}</p>{home.neutralReason && <small>{home.neutralReason}</small>}<span>A next step will appear when AeroGo has a reliable date, time or status.</span></div>;
}

function EndOfDayCard({ home, headingId }: { home: ContextualHomeState; headingId: string }) {
  return <div className="travel-end-of-day"><div className="travel-end-of-day__icon"><CheckCircle2 size={27} /></div><h2 id={headingId}>Today’s plan is complete.</h2><p>{home.supportingText}</p><span>{home.afterThis ? "Your next activity is shown below." : "AeroGo will show it here when the date and time are available."}</span></div>;
}

function CompanionPlan({ trip }: { trip: ClientTrip }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const itinerary = trip.companion.itinerary ?? [];
  const requestedDay = Number(searchParams.get("day"));
  const selectedDay = itinerary.find((day) => day.day === requestedDay) ?? itinerary.find((day) => day.items.some((item) => item.startsAt)) ?? itinerary[0];
  const setDay = (day: number) => {
    setSearchParams((current) => {
      current.set("view", "plan");
      current.set("day", String(day));
      return current;
    });
  };
  return <div className="travel-subview"><CompanionHeader trip={trip} eyebrow="YOUR PLAN" /><div className="travel-subview-heading travel-subview-heading--compact"><span className="travel-section-eyebrow">DAY BY DAY</span><h2>Find your day.</h2><p>Choose a day to see its times, places and booking status.</p></div>{itinerary.length === 0 ? <EmptyState title="No trip plan yet." text="AeroGo will add your day-by-day plan here when it is ready." /> : <><nav className="travel-plan-day-picker" aria-label="Plan days">{itinerary.map((day) => <button key={`${day.day}-${day.date}`} type="button" className={selectedDay?.day === day.day ? "is-selected" : ""} aria-pressed={selectedDay?.day === day.day} onClick={() => setDay(day.day)}><strong>Day {day.day}</strong><small>{day.date}</small></button>)}</nav>{selectedDay && <section className="travel-plan-selected-day" aria-label={`Day ${selectedDay.day}: ${selectedDay.title}`}><PlanDay day={selectedDay} trip={trip} open /></section>}</>}</div>;
}

function PlanDay({ day, trip, open = false }: { day: ItineraryDay; trip: ClientTrip; open?: boolean }) {
  return <details className="travel-plan-day" open={open}><summary><span className="travel-plan-day__number">{String(day.day).padStart(2, "0")}</span><span><small>{day.date}</small><strong>{day.title}</strong><em>{day.summary}</em></span><ChevronDown size={22} /></summary><div className="travel-plan-day__items">{day.items.length === 0 ? <p className="travel-muted-copy">No activities are listed for this day.</p> : day.items.map((item, index) => <PlanItem key={item.id ?? `${day.day}-${item.time}-${index}`} item={item} day={day} trip={trip} />)}</div></details>;
}

function PlanItem({ item, day, trip }: { item: ItineraryItem; day: ItineraryDay; trip: ClientTrip }) {
  const timeZone = item.timeZone ?? day.timeZone ?? trip.companion.homeTimeZone;
  const time = formatZonedTime(item.startsAt, timeZone) ?? item.time;
  const status = item.status ?? "planned";
  const statusContext = item.kind === "experience" ? "activity" : item.kind === "stay" ? "hotel" : item.kind;
  const directionsUrl = safeExternalUrl(item.directionsUrl);
  const ticketUrl = safeExternalUrl(item.ticketUrl);
  return <article className={`travel-plan-item is-${status}`}><div className="travel-plan-item__time"><strong>{time}</strong><span>{day.date}</span></div><div className="travel-plan-item__marker" aria-hidden="true"><MapPin size={17} /></div><div className="travel-plan-item__body"><div className="travel-plan-item__title"><h3>{item.title}</h3><span className="travel-status-badge">{reservationStatusLabel(status, statusContext)}</span></div><p><MapPin size={16} /> {item.location}</p><small>{item.note}</small>{item.transportSummary && item.transportSummary !== item.location && <small className="travel-plan-item__transport"><Navigation size={14} /> {item.transportSummary}</small>}{status !== "cancelled" && <div className="travel-plan-item__actions">{directionsUrl && <a href={directionsUrl} target="_blank" rel="noreferrer"><Navigation size={16} /> Directions</a>}{ticketUrl && <a href={ticketUrl} target="_blank" rel="noreferrer"><Ticket size={16} /> Show ticket</a>}</div>}</div></article>;
}

function CompanionWallet({ trip }: { trip: ClientTrip }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const summaries = getWalletCategorySummaries(trip);
  const requestedCategory = searchParams.get("wallet");
  const activeCategory = isWalletCategory(requestedCategory) ? requestedCategory : null;
  const activeSummary = summaries.find((summary) => summary.id === activeCategory);
  const bookingUpdates = summaries.filter((summary) => summary.needsAttention);
  const setCategory = (category: WalletCategoryId | null) => {
    setSearchParams((current) => {
      current.set("view", "wallet");
      if (category) current.set("wallet", category);
      else current.delete("wallet");
      return current;
    });
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [activeCategory]);
  return <div className="travel-subview"><section className={`travel-wallet-overview${activeCategory ? " is-hidden" : ""}`} aria-labelledby="wallet-overview-heading"><span className="travel-section-eyebrow">YOUR TRIP DETAILS</span><h2 id="wallet-overview-heading">{trip.destinationShort}</h2><p>{trip.dates} · {trip.duration}</p></section>{!activeCategory && bookingUpdates.length > 0 && <section className="travel-wallet-attention is-attention" aria-labelledby="wallet-booking-update-heading"><strong id="wallet-booking-update-heading">Booking update</strong><p>Check {bookingUpdates.map((summary) => summary.label.toLowerCase()).join(", ")} for updated details.</p><div className="travel-wallet-attention__actions">{bookingUpdates.map((summary) => <button key={summary.id} type="button" className="travel-wallet-attention__action" onClick={() => setCategory(summary.id)}>Open {summary.label}</button>)}</div></section>}<nav className={`travel-wallet-dashboard${activeCategory ? " is-hidden" : ""}`} aria-label="Trip detail categories"><span className="travel-section-eyebrow">FIND A DETAIL</span><div className="travel-wallet-category-grid">{summaries.map((summary) => <button key={summary.id} type="button" className={`travel-wallet-category${activeCategory === summary.id ? " is-selected" : ""}${summary.needsAttention ? " is-attention" : ""}`} aria-pressed={activeCategory === summary.id} onClick={() => setCategory(summary.id)}><span className="travel-wallet-category__icon"><WalletCategoryIcon category={summary.id} /></span><span><strong>{summary.label}</strong><small>{summary.summary}</small><em>{summary.status}</em></span><ChevronDown size={19} aria-hidden="true" /></button>)}</div></nav>{activeSummary && <WalletCategoryView trip={trip} summary={activeSummary} onBack={() => setCategory(null)} />}</div>;
}

function WalletCategoryView({ trip, summary, onBack }: { trip: ClientTrip; summary: WalletCategorySummary; onBack: () => void }) {
  return <section className="travel-wallet-detail-view" aria-labelledby={`wallet-${summary.id}-heading`}><div className="travel-wallet-detail-view__top"><button type="button" className="travel-wallet-back" onClick={onBack}><ArrowRight size={17} /> All trip details</button></div><div className="travel-wallet-category-heading"><div className="travel-wallet-category-heading__title"><WalletCategoryIcon category={summary.id} /><h2 id={`wallet-${summary.id}-heading`}>{summary.label}</h2></div><p className={summary.needsAttention ? "is-attention" : undefined}><strong>{summary.status}</strong> · {summary.summary}</p></div><WalletCategoryContent trip={trip} category={summary.id} /></section>;
}

function WalletCategoryContent({ trip, category }: { trip: ClientTrip; category: WalletCategoryId }) {
  const flights = trip.companion.flights ?? [];
  const transfers = itineraryItems(trip, (item) => item.kind === "transfer");
  const activities = itineraryItems(trip, (item) => item.kind === "experience");
  const expenses = trip.companion.expenses ?? [];
  if (category === "flights") return flights.length ? <div className="travel-flight-list">{flights.map((flight) => <FlightBookingCard key={`${flight.label}-${flight.route}`} flight={flight} />)}</div> : <EmptyState title="Flight details are not ready yet." text="Confirmed flight details will appear here when AeroGo receives them." />;
  if (category === "hotel") return <HotelBookingCard hotel={trip.companion.hotel} />;
  if (category === "transfers") return transfers.length ? <div className="travel-booking-list">{transfers.map(({ day, item }) => <TransferBookingCard key={item.id ?? `${day.day}-${item.title}`} day={day} item={item} trip={trip} />)}</div> : <EmptyState title="Transfer details are not provided yet." text="AeroGo will show pickup and meeting details here when they are confirmed." />;
  if (category === "activities") return activities.length ? <div className="travel-booking-list">{activities.map(({ day, item }) => <ActivityBookingCard key={item.id ?? `${day.day}-${item.title}`} day={day} item={item} trip={trip} />)}</div> : <EmptyState title="No activity bookings are listed yet." text="AeroGo will show visit times and ticket details here when they are available." />;
  return <CostSummarySection expenses={expenses} travelerCount={trip.travelerCount} summary={summarizeExpenses(expenses)} />;
}

function WalletCategoryIcon({ category }: { category: WalletCategoryId }) {
  if (category === "flights") return <Plane size={21} aria-hidden="true" />;
  if (category === "hotel") return <Hotel size={21} aria-hidden="true" />;
  if (category === "transfers") return <Navigation size={21} aria-hidden="true" />;
  if (category === "activities") return <Ticket size={21} aria-hidden="true" />;
  return <WalletCards size={21} aria-hidden="true" />;
}

function isWalletCategory(value: string | null): value is WalletCategoryId {
  return value === "flights" || value === "hotel" || value === "transfers" || value === "activities" || value === "costs";
}

function FlightBookingCard({ flight }: { flight: FlightSummary }) {
  const departureTime = formatZonedTime(flight.departureAt, flight.departureTimeZone) ?? flight.times.split("→")[0]?.trim() ?? "Time to be confirmed";
  const arrivalTime = formatZonedTime(flight.arrivalAt, flight.arrivalTimeZone) ?? flight.times.split("→")[1]?.trim() ?? "Time to be confirmed";
  const status = flightReservationStatus(flight);
  const bookingUrl = safeExternalUrl(flight.bookingUrl);
  const ticketUrl = safeExternalUrl(flight.ticketUrl);
  const checkInUrl = safeExternalUrl(flight.checkInUrl);
  const airlineStatusUrl = safeExternalUrl(flight.airlineStatusUrl);
  const directionsUrl = safeExternalUrl(flight.directionsUrl);
  const airlineDetails = [flight.airline, flight.flightNumber].filter(Boolean).join(" · ");
  return <details className="travel-wallet-detail-card travel-flight-card"><summary className="travel-wallet-detail-summary"><div className="travel-wallet-detail-summary__copy"><div className="travel-wallet-status-row"><span className="travel-section-eyebrow"><Plane size={18} /> {flight.label}</span><span className={`travel-status-badge is-${status}`}>{reservationStatusLabel(status, "flight")}</span></div><h3>{flight.route}</h3><p>{flight.date || "Date to be confirmed"} · {departureTime}</p></div><ChevronDown size={22} aria-hidden="true" /></summary><div className="travel-wallet-detail-body"><div className="travel-flight-card__times"><span><strong>{departureTime}</strong><small>{friendlyTimeZoneName(flight.departureTimeZone) ?? "Departure local time to be confirmed"}</small></span><ArrowRight size={18} /><span><strong>{arrivalTime}</strong><small>{friendlyTimeZoneName(flight.arrivalTimeZone) ?? "Arrival local time to be confirmed"}</small></span></div><div className="travel-detail-grid">{airlineDetails && <DetailRow label="Airline" value={airlineDetails} />}{flight.departureAirport && <DetailRow label="Departure" value={`${flight.departureAirport}${flight.departureTerminal ? ` · Terminal ${flight.departureTerminal}` : ""}`} />}{flight.arrivalAirport && <DetailRow label="Arrival" value={`${flight.arrivalAirport}${flight.arrivalTerminal ? ` · Terminal ${flight.arrivalTerminal}` : ""}`} />}{flight.date && <DetailRow label="Date" value={flight.date} />}{flight.bookingReference ? <DetailRow label="Booking reference" value={flight.bookingReference} /> : <DetailRow label="Booking reference" value="Not provided yet." muted />}</div><p>{flight.note}</p><div className="travel-flight-card__actions">{directionsUrl && <a href={directionsUrl} target="_blank" rel="noreferrer"><Navigation size={16} /> Directions</a>}{bookingUrl && <a href={bookingUrl} target="_blank" rel="noreferrer"><Ticket size={16} /> Show booking</a>}{ticketUrl && <a href={ticketUrl} target="_blank" rel="noreferrer"><Ticket size={16} /> Show ticket</a>}{checkInUrl && <a href={checkInUrl} target="_blank" rel="noreferrer">Check in <ExternalLink size={15} /></a>}{airlineStatusUrl && <a href={airlineStatusUrl} target="_blank" rel="noreferrer">Airline status <ExternalLink size={15} /></a>}</div></div></details>;
}

function HotelBookingCard({ hotel }: { hotel: ClientTrip["companion"]["hotel"] }) {
  const bookingUrl = safeExternalUrl(hotel.bookingUrl);
  const phoneUrl = safeTelephoneUrl(hotel.phone);
  const directionsUrl = safeExternalUrl(hotel.directionsUrl) ?? (hotel.address?.trim() ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.address)}` : undefined);
  const status = hotel.reservationStatus ?? (hotel.status === "confirmed" ? "confirmed" : "planned");
  return <details className="travel-wallet-detail-card travel-stay-card"><summary className="travel-wallet-detail-summary"><div className="travel-wallet-detail-summary__copy"><div className="travel-wallet-status-row"><span className="travel-section-eyebrow"><Hotel size={18} /> YOUR HOTEL</span><span className={`travel-status-badge is-${status}`}>{reservationStatusLabel(status, "hotel")}</span></div><h3>{hotel.name || "Hotel details"}</h3><p>{hotel.area || "Hotel area not provided yet."} · {hotel.dates || "Stay dates to be confirmed"}</p></div><ChevronDown size={22} aria-hidden="true" /></summary><div className="travel-wallet-detail-body"><div className="travel-detail-grid"><DetailRow label="Address" value={hotel.address || "Hotel address not provided yet."} muted={!hotel.address} />{hotel.room && <DetailRow label="Room" value={hotel.room} />}{hotel.bookingReference ? <DetailRow label="Booking reference" value={hotel.bookingReference} /> : <DetailRow label="Booking reference" value="Not provided yet." muted />}{hotel.phone ? <DetailRow label="Hotel phone" value={hotel.phone} /> : <DetailRow label="Hotel phone" value="Not provided yet." muted />}</div><small>{hotel.note}</small><div className="travel-stay-card__actions">{directionsUrl && <a href={directionsUrl} target="_blank" rel="noreferrer"><Navigation size={17} /> Directions to hotel</a>}{bookingUrl && <a href={bookingUrl} target="_blank" rel="noreferrer"><Ticket size={16} /> Show booking</a>}{phoneUrl && <a href={phoneUrl}><Phone size={16} /> Call hotel</a>}</div></div></details>;
}

function TransferBookingCard({ day, item, trip }: { day: ItineraryDay; item: ItineraryItem; trip: ClientTrip }) {
  const timeZone = item.timeZone ?? day.timeZone ?? trip.companion.homeTimeZone;
  const directionsUrl = safeExternalUrl(item.directionsUrl);
  const phoneUrl = safeTelephoneUrl(item.providerPhone);
  const status = item.status ?? "planned";
  const pickupTime = formatZonedTime(item.startsAt, timeZone) ?? "Pickup time to be confirmed";
  return <details className="travel-wallet-detail-card travel-booking-card"><summary className="travel-wallet-detail-summary"><div className="travel-wallet-detail-summary__copy"><div className="travel-wallet-status-row"><span className="travel-section-eyebrow"><Navigation size={18} /> {item.providerName ?? "AIRPORT TRANSFER"}</span><span className={`travel-status-badge is-${status}`}>{reservationStatusLabel(status, "transfer")}</span></div><h3>{item.title}</h3><p>{day.date} · {pickupTime} · {item.location || "Pickup location to be confirmed"}</p></div><ChevronDown size={22} aria-hidden="true" /></summary><div className="travel-wallet-detail-body"><div className="travel-detail-grid"><DetailRow label="Pickup" value={item.location || "Pickup location not provided yet."} muted={!item.location} /><DetailRow label="Pickup time" value={pickupTime} muted={!item.startsAt} /><DetailRow label="Meeting point" value={item.meetingPoint ?? "Meeting point not provided yet."} muted={!item.meetingPoint} /><DetailRow label="Drop-off" value={item.dropOffLocation ?? trip.companion.hotel.name ?? "Drop-off not provided yet."} muted={!item.dropOffLocation} />{item.bookingReference ? <DetailRow label="Booking reference" value={item.bookingReference} /> : <DetailRow label="Booking reference" value="Not provided yet." muted />}{item.providerContact && <DetailRow label="Provider contact" value={item.providerContact} />}</div><p className="travel-booking-card__note">{item.instructions ?? item.note}</p><div className="travel-flight-card__actions">{directionsUrl && <a href={directionsUrl} target="_blank" rel="noreferrer"><Navigation size={16} /> Directions</a>}{phoneUrl && <a href={phoneUrl}><Phone size={16} /> Call driver</a>}</div></div></details>;
}

function ActivityBookingCard({ day, item, trip }: { day: ItineraryDay; item: ItineraryItem; trip: ClientTrip }) {
  const timeZone = item.timeZone ?? day.timeZone ?? trip.companion.homeTimeZone;
  const ticketUrl = safeExternalUrl(item.ticketUrl);
  const bookingUrl = safeExternalUrl(item.bookingUrl);
  const directionsUrl = safeExternalUrl(item.directionsUrl);
  const status = item.status ?? "planned";
  const entryTime = item.entryTime ?? formatZonedTime(item.startsAt, timeZone) ?? "Time to be confirmed";
  return <details className="travel-wallet-detail-card travel-booking-card"><summary className="travel-wallet-detail-summary"><div className="travel-wallet-detail-summary__copy"><div className="travel-wallet-status-row"><span className="travel-section-eyebrow"><Ticket size={18} /> ACTIVITY</span><span className={`travel-status-badge is-${status}`}>{reservationStatusLabel(status, "activity")}</span></div><h3>{item.title}</h3><p>{day.date} · {entryTime} · {item.location || "Location to be confirmed"}</p></div><ChevronDown size={22} aria-hidden="true" /></summary><div className="travel-wallet-detail-body"><div className="travel-detail-grid"><DetailRow label="Visit date" value={day.date || "Date to be confirmed"} /><DetailRow label="Entry time" value={entryTime} muted={!item.entryTime && !item.startsAt} /><DetailRow label="Location" value={item.location || "Location not provided yet."} muted={!item.location} />{item.meetingPoint && <DetailRow label="Meeting point" value={item.meetingPoint} />}{item.bookingReference ? <DetailRow label="Booking reference" value={item.bookingReference} /> : <DetailRow label="Booking reference" value="Not provided yet." muted />}</div><p className="travel-booking-card__note">{item.instructions ?? item.note}</p><div className="travel-flight-card__actions">{directionsUrl && <a href={directionsUrl} target="_blank" rel="noreferrer"><Navigation size={16} /> Directions</a>}{ticketUrl && <a href={ticketUrl} target="_blank" rel="noreferrer"><Ticket size={16} /> Show ticket</a>}{bookingUrl && <a href={bookingUrl} target="_blank" rel="noreferrer"><Ticket size={16} /> Show booking</a>}</div></div></details>;
}

function CostSummarySection({ expenses, travelerCount, summary }: { expenses: ClientTrip["companion"]["expenses"]; travelerCount: number; summary: ReturnType<typeof summarizeExpenses> }) {
  return <div className="travel-cost-content">{expenses.length === 0 ? <EmptyState title="No cost estimates have been added." text="AeroGo will show planning estimates here when they are available." /> : <><div className="travel-expense-list">{expenses.map((expense) => { const currency = expenseCurrency(expense); const groupAmount = expenseGroupAmount(expense); const perPerson = expensePerPersonAmount(expense, travelerCount); const phpEquivalent = expensePhpEquivalent(expense); return <div key={expense.label}><span><strong>{expense.label}</strong><small>{formatCurrencyAmount(groupAmount, currency)} estimated total for {travelerCount} people · {perPerson === null ? "Price per person to be confirmed" : `${formatCurrencyAmount(perPerson, currency)} per person`}</small><small>{expense.note}</small>{phpEquivalent === null && currency !== "PHP" ? <small>PHP equivalent not provided.</small> : <small>Estimated PHP equivalent: {formatCurrencyAmount(phpEquivalent ?? groupAmount, "PHP")}</small>}</span><b>{formatCurrencyAmount(groupAmount, currency)}</b></div>; })}<div className="travel-expense-total"><span><strong>Estimated totals</strong>{summary.currencyTotals.map((total) => <small key={total.currency}>{formatCurrencyAmount(total.amount, total.currency)} for {travelerCount} people</small>)}{summary.phpTotal === null && summary.missingPhpConversion && <small>Estimated PHP total not available because an exchange rate is missing.</small>}{summary.phpTotal !== null && <small>Estimated PHP total: {formatCurrencyAmount(summary.phpTotal, "PHP")}</small>}</span></div></div><p className="travel-cost-note">Amounts are estimates only. Taxes, fees and final prices may change unless AeroGo confirms them.</p></>}</div>;
}

function flightReservationStatus(flight: FlightSummary): ReservationState {
  return flight.reservationStatus ?? (flight.status === "confirmed" ? "confirmed" : "planned");
}

function CompanionHelp({ trip, onViewChange }: { trip: ClientTrip; onViewChange: (view: CompanionView) => void }) {
  const transfers = itineraryItems(trip, (item) => item.kind === "transfer");
  const primaryTransfer = transfers[0];
  const arrivalGuide = trip.companion.arrivalGuide;
  const contactUrl = safeContactUrl(trip.contact.href) ?? "/#inquire";
  return <div className="travel-subview"><CompanionHeader trip={trip} eyebrow="HELP" /><section className="travel-help-card"><div className="travel-help-card__icon"><CircleHelp size={26} /></div><span className="travel-section-eyebrow">NEED HELP WITH YOUR BOOKING?</span><h2>Message AeroGo</h2><p>{trip.contact.note} This space does not show live airline or transport updates unless a link has been added.</p><a className="travel-primary-button" href={contactUrl}>Message AeroGo <ArrowRight size={18} /></a></section><details className="travel-help-details"><summary><div><span className="travel-section-eyebrow">ARRIVAL GUIDE</span><h2>After you land.</h2><p>Airport steps, transfer details and hotel information.</p></div><ChevronDown size={22} aria-hidden="true" /></summary><div className="travel-help-details__body">{arrivalGuide?.airportName && <p className="travel-arrival-guide__airport">Arriving at {arrivalGuide.airportName}</p>}{arrivalGuide?.steps?.length ? <ol className="travel-arrival-steps">{arrivalGuide.steps.map((step) => <li key={step}>{step}</li>)}</ol> : <EmptyState title="Arrival steps are not provided yet." text="AeroGo will add airport instructions when they are ready." />}{primaryTransfer ? <ArrivalTransferSummary day={primaryTransfer.day} item={primaryTransfer.item} trip={trip} /> : <EmptyState title="Airport transfer details are not provided yet." text="Check with AeroGo before leaving the airport." />}<ArrivalHotelSummary hotel={trip.companion.hotel} guide={arrivalGuide} />{arrivalGuide?.officialLinks?.length ? <div className="travel-official-links"><span className="travel-section-eyebrow">OFFICIAL INFORMATION</span>{arrivalGuide.officialLinks.map((link) => { const href = safeExternalUrl(link.url); return href ? <a key={link.label} href={href} target="_blank" rel="noreferrer">{link.label} <ExternalLink size={15} />{link.lastCheckedAt && <small>Last checked {link.lastCheckedAt}</small>}</a> : null; })}</div> : null}</div></details><section className="travel-info-card"><ShieldCheck size={21} /><div><span className="travel-section-eyebrow">PRIVATE TRIP SPACE</span><h2>Your trip is private.</h2><p>Only people with access can see these trip details. Lock the trip at the top when using a shared device.</p></div></section><button type="button" className="travel-secondary-button travel-back-home" onClick={() => onViewChange("home")}>Back to Home <ArrowRight size={18} /></button></div>;
}

function ArrivalTransferSummary({ day, item, trip }: { day: ItineraryDay; item: ItineraryItem; trip: ClientTrip }) {
  const timeZone = item.timeZone ?? day.timeZone ?? trip.companion.homeTimeZone;
  const directionsUrl = safeExternalUrl(item.directionsUrl);
  const phoneUrl = safeTelephoneUrl(item.providerPhone);
  return <div className="travel-arrival-guide__block"><div className="travel-booking-card__top"><div><span className="travel-section-eyebrow">YOUR AIRPORT TRANSFER</span><h3>{item.title}</h3></div><span className="travel-status-badge">{reservationStatusLabel(item.status ?? "planned", "transfer")}</span></div><div className="travel-detail-grid"><DetailRow label="Pickup" value={item.location || "Pickup location not provided yet."} muted={!item.location} /><DetailRow label="Pickup time" value={formatZonedTime(item.startsAt, timeZone) ?? "Pickup time to be confirmed."} muted={!item.startsAt} /><DetailRow label="Meeting point" value={item.meetingPoint ?? "Meeting point not provided yet."} muted={!item.meetingPoint} /><DetailRow label="Drop-off" value={item.dropOffLocation ?? trip.companion.hotel.name ?? "Drop-off not provided yet."} muted={!item.dropOffLocation} />{item.providerContact && <DetailRow label="Driver or provider" value={item.providerContact} />}</div><p>{item.instructions ?? item.note}</p><div className="travel-flight-card__actions">{directionsUrl && <a href={directionsUrl} target="_blank" rel="noreferrer"><Navigation size={16} /> Directions</a>}{phoneUrl && <a href={phoneUrl}><Phone size={16} /> Call driver</a>}</div></div>;
}

function ArrivalHotelSummary({ hotel, guide }: { hotel: ClientTrip["companion"]["hotel"]; guide?: ClientTrip["companion"]["arrivalGuide"] }) {
  const directionsUrl = safeExternalUrl(hotel.directionsUrl) ?? (hotel.address?.trim() ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.address)}` : undefined);
  const phoneUrl = safeTelephoneUrl(hotel.phone);
  return <div className="travel-arrival-guide__block"><div className="travel-booking-card__top"><div><span className="travel-section-eyebrow">YOUR HOTEL</span><h3>{hotel.name || "Hotel details"}</h3></div><span className="travel-status-badge">{reservationStatusLabel(hotel.reservationStatus ?? (hotel.status === "confirmed" ? "confirmed" : "planned"), "hotel")}</span></div><div className="travel-detail-grid"><DetailRow label="Address" value={hotel.address || "Hotel address not provided yet."} muted={!hotel.address} /><DetailRow label="Stay dates" value={hotel.dates || "Stay dates to be confirmed"} muted={!hotel.dates} />{guide?.hotelCheckIn && <DetailRow label="Check-in" value={guide.hotelCheckIn} />}</div><div className="travel-flight-card__actions">{directionsUrl && <a href={directionsUrl} target="_blank" rel="noreferrer"><Navigation size={16} /> Directions to hotel</a>}{phoneUrl && <a href={phoneUrl}><Phone size={16} /> Call hotel</a>}</div></div>;
}

function DetailRow({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return <div className={`travel-detail-row${muted ? " is-muted" : ""}`}><span>{label}</span><strong>{value}</strong></div>;
}

function itineraryItems(trip: ClientTrip, predicate: (item: ItineraryItem) => boolean): Array<{ day: ItineraryDay; item: ItineraryItem }> {
  return (trip.companion.itinerary ?? []).flatMap((day) => day.items.filter(predicate).map((item) => ({ day, item })));
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return <div className="travel-empty-state"><CircleAlert size={22} /><div><strong>{title}</strong><p>{text}</p></div></div>;
}

function momentLabel(moment: ContextualHomeState["moment"] | TravelMoment): string {
  const labels: Record<string, string> = { "before-departure": "Before departure", "departure-day": "Departure day", arrival: "Arrival", "active-travel-day": "Today", "end-of-day": "Today complete", "return-journey": "Return journey", completed: "Completed", neutral: "Overview" };
  return labels[moment] ?? "Overview";
}
