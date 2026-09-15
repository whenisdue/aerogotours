import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Bell, CalendarDays, Check, ChevronRight, CircleHelp, Clock3, FileText, MapPin, MessageCircle, Navigation, Paperclip, Plane, Send, ShieldCheck, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Brand } from "../components/Brand";
import { ChecklistModule, DayItinerary, DocumentCard, MessageBubble, NextUpCard, SmartQuestionCard, TripEventCard } from "../components/TripComponents";
import { checklistItems, conversationSeed, documents, trip, tripDays, type TripEvent } from "../data/trip";

type Tab = "home" | "trip" | "documents" | "messages";
type Sheet = { title: string; kind: "checklist" | "leave" | "reservation" | "baggage" | "event"; event?: TripEvent } | null;

const tabs: { id: Tab; label: string; short: string; icon: ReactNode }[] = [
  { id: "home", label: "Home", short: "Home", icon: <span className="nav-house">⌂</span> },
  { id: "trip", label: "Trip", short: "Trip", icon: <CalendarDays size={19} /> },
  { id: "documents", label: "Documents", short: "Docs", icon: <FileText size={19} /> },
  { id: "messages", label: "Messages", short: "Messages", icon: <MessageCircle size={19} /> },
];

export function CompanionPage() {
  const [tab, setTab] = useState<Tab>("home");
  const [sheet, setSheet] = useState<Sheet>(null);
  const [checked, setChecked] = useState<string[]>(["passports", "tickets"]);
  const [messages, setMessages] = useState(conversationSeed);
  const [messageInput, setMessageInput] = useState("");
  const dayThree = tripDays.find((day) => day.day === trip.day)!;

  const toggleChecklist = (id: string) => setChecked((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = messageInput.trim();
    if (!text) return;
    setMessages((current) => [...current, { id: `m${Date.now()}`, sender: "traveler", text, time: "Just now" }]);
    setMessageInput("");
  };
  const eventSheet = (event: TripEvent) => setSheet({ title: event.title, kind: "event", event });

  return <div className="companion-app">
    <header className="companion-topbar">
      <div className="companion-topbar__inner">
        <div className="companion-topbar__brand"><Brand /><span className="demo-badge"><span /> SAMPLE TRIP</span></div>
        <Link className="back-to-site" to="/"><ArrowLeft size={15} /> Back to AeroGo</Link>
      </div>
    </header>
    <div className="companion-shell">
      <aside className="companion-sidebar">
        <div className="sidebar-trip"><span className="sidebar-trip__eyebrow">YOUR TRIP</span><div className="sidebar-trip__photo" role="img" aria-label="Tokyo, Japan at dusk" /><div className="sidebar-trip__info"><span className="eyebrow">NOV 12—17, 2026</span><strong>{trip.destination}</strong><small>{trip.family} · 6 days</small></div></div>
        <nav className="companion-nav" aria-label="Travel Companion navigation">
          {tabs.map((item) => <button key={item.id} type="button" className={`companion-nav__item${tab === item.id ? " companion-nav__item--active" : ""}`} onClick={() => setTab(item.id)} aria-current={tab === item.id ? "page" : undefined}>{item.icon}<span>{item.label}</span>{item.id === "messages" && <span className="sidebar-unread" aria-label="1 new message">1</span>}{tab === item.id && <ChevronRight className="companion-nav__chevron" size={15} />}</button>)}
        </nav>
        <div className="sidebar-help"><span className="sidebar-help__icon"><CircleHelp size={17} /></span><span><strong>Need a hand?</strong><small>We're right here if you need us.</small><button type="button" onClick={() => setTab("messages")}>Message AeroGo <ArrowRight size={13} /></button></span></div>
        <div className="sidebar-footer"><ShieldCheck size={14} /> Private trip space <span>·</span> Demo data</div>
      </aside>

      <main className="companion-content">
        <div className="mobile-trip-context"><div><span className="mobile-trip-context__flag">JP</span><span><strong>{trip.city}, Japan</strong><small>Day {trip.day} of {trip.duration} · {trip.dates}</small></span></div><button type="button" aria-label="Trip reminders" className="icon-button" onClick={() => setSheet({ title: "Your trip reminders", kind: "leave" })}><Bell size={18} /></button></div>
        {tab === "home" && <section className="companion-pane home-pane">
          <div className="pane-heading pane-heading--home"><div><span className="eyebrow"><span className="live-dot live-dot--green" /> SATURDAY, NOVEMBER 14 <span className="eyebrow-separator">·</span> DAY 3 OF 6</span><h1>Good morning,<br className="mobile-only" /> Santos Family<span className="heading-period">.</span></h1><p>Here’s what’s ahead today. Take it one step at a time.</p></div><span className="pane-heading__day">03<span>/ 06</span></span></div>
          <div className="home-main-grid">
            <div className="home-main-grid__primary"><NextUpCard onDetails={() => eventSheet(dayThree.events[0])} onDirections={() => setSheet({ title: "Getting to teamLab Planets", kind: "leave" })} />
              <section className="today-timeline"><div className="section-label-row"><div><span className="eyebrow">YOUR DAY, AT A GLANCE</span><h2>Today</h2></div><button type="button" className="small-text-button" onClick={() => setTab("trip")}>Full itinerary <ArrowRight size={14} /></button></div><div className="today-timeline__list">{dayThree.events.map((event, index) => <TripEventCard key={index} event={event} compact onClick={() => eventSheet(event)} />)}</div></section>
            </div>
            <aside className="home-main-grid__aside"><section className="questions-section"><div className="section-label-row section-label-row--compact"><div><span className="eyebrow">A LITTLE HELP, RIGHT HERE</span><h2>You may be wondering</h2></div></div><div className="smart-question-list">
              <SmartQuestionCard icon={<Check size={16} />} question="What do we need today?" answer="Your quick checklist" onClick={() => setSheet({ title: "What do we need today?", kind: "checklist" })} />
              <SmartQuestionCard icon={<Clock3 size={16} />} question="When should we leave?" answer="A relaxed route plan" onClick={() => setSheet({ title: "When should we leave?", kind: "leave" })} />
              <SmartQuestionCard icon={<MapPin size={16} />} question="Where’s our reservation?" answer="The details, in one place" onClick={() => setSheet({ title: "teamLab Planets reservation", kind: "reservation" })} />
              <SmartQuestionCard icon={<Plane size={16} />} question="What’s our baggage allowance?" answer="Packed and ready to check" onClick={() => setSheet({ title: "Baggage allowance", kind: "baggage" })} />
            </div></section>
            <button type="button" className="stay-card" onClick={() => setSheet({ title: trip.hotel, kind: "reservation" })}><span className="stay-card__icon"><span className="stay-card__bed">⌂</span></span><span className="stay-card__text"><small>WHERE YOU’RE STAYING</small><strong>{trip.hotel}</strong><span>Shinjuku · Check-out Nov 17</span></span><ArrowRight size={15} /></button>
            <div className="home-assurance"><span><ShieldCheck size={15} /></span><p>Your bookings and plans are kept together in this private trip space.</p></div></aside>
          </div>
        </section>}

        {tab === "trip" && <section className="companion-pane trip-pane">
          <div className="pane-heading"><div><span className="eyebrow">YOUR SIX-DAY GETAWAY</span><h1>The trip, day by day.</h1><p>One easy-to-follow plan for the whole family.</p></div><span className="pane-heading__date"><CalendarDays size={16} /> {trip.dates}</span></div>
          <div className="trip-summary-strip"><span className="trip-summary-strip__icon"><MapPin size={18} /></span><span><small>YOUR DESTINATION</small><strong>{trip.destination}</strong></span><span className="trip-summary-strip__divider" /><span><small>STAYING AT</small><strong>{trip.hotel}</strong></span><button type="button" onClick={() => setSheet({ title: trip.hotel, kind: "reservation" })} aria-label="Hotel details"><ArrowRight size={16} /></button></div>
          <div className="itinerary-list">{tripDays.map((day) => <DayItinerary key={day.day} day={day} current={day.day === trip.day} initiallyOpen={day.day === trip.day} onEventClick={eventSheet} />)}</div>
          <div className="trip-note"><span><CircleHelp size={17} /></span><p>Plans can flex with the day. Send AeroGo a message if you need help adjusting anything.</p><button type="button" onClick={() => setTab("messages")}>Message us <ArrowRight size={13} /></button></div>
        </section>}

        {tab === "documents" && <section className="companion-pane documents-pane">
          <div className="pane-heading"><div><span className="eyebrow">YOUR DETAILS, ALL TOGETHER</span><h1>Trip documents.</h1><p>Everything here is a fictional sample for this demo.</p></div><span className="pane-heading__date"><ShieldCheck size={15} /> Private trip space</span></div>
          <div className="document-notice"><span className="document-notice__icon"><FileText size={18} /></span><p><strong>Keep important details close.</strong><span>Real travel documents can be added to a qualifying trip. This sample uses fictional booking references only.</span></p></div>
          {(["Flights", "Hotel", "Transfers", "Activities"] as const).map((category) => {
            const entries = documents.filter((item) => item.category === category);
            if (!entries.length) return null;
            return <section className="document-group" key={category}><div className="document-group__heading"><h2>{category}</h2><span>{String(entries.length).padStart(2, "0")}</span></div><div className="document-group__list">{entries.map((doc) => <DocumentCard key={doc.reference} {...doc} onClick={() => setSheet({ title: doc.title, kind: "reservation" })} />)}</div></section>;
          })}
          <section className="document-group checklist-group"><div className="document-group__heading"><h2>Travel checklist</h2><span>{checked.length}/{checklistItems.length}</span></div><ChecklistModule checked={checked} onToggle={toggleChecklist} /></section>
        </section>}

        {tab === "messages" && <section className="companion-pane messages-pane">
          <div className="message-page-heading"><div><span className="eyebrow">A PRIVATE CONVERSATION</span><h1>Messages.</h1><p>Your AeroGo trip support, right here.</p></div><div className="support-status"><span className="support-status__dot" /><span>Trip support</span></div></div>
          <div className="conversation-card"><div className="conversation-header"><span className="conversation-header__avatar">A</span><span><strong>AeroGo Travel Support</strong><small><span className="support-status__dot" /> Here for your trip</small></span><button type="button" className="conversation-header__info" aria-label="Support details" onClick={() => setSheet({ title: "AeroGo trip support", kind: "baggage" })}><CircleHelp size={17} /></button></div>
            <div className="conversation-details"><span><ShieldCheck size={14} /></span><p>Private support for the Santos family’s Tokyo trip. Your plans and booking details are already here.</p></div>
            <div className="conversation-thread" aria-live="polite">{messages.map((message) => <MessageBubble key={message.id} sender={message.sender} text={message.text} time={message.time} />)}<div className="conversation-date">TODAY · NOVEMBER 14</div><div className="quick-help-prompt"><span className="quick-help-prompt__icon"><CircleHelp size={17} /></span><span><small className="quick-help-prompt__label">AEROGO ASSISTANT · FUTURE PREVIEW</small><strong>Quick answers from your trip, in one place.</strong><small>For this demo, tap a question on Home or message the AeroGo team here.</small></span></div></div>
            <form className="message-composer" onSubmit={sendMessage}><button type="button" aria-label="Attachments unavailable in demo" className="message-composer__attach" title="Attachments are not available in this demo"><Paperclip size={17} /></button><label className="sr-only" htmlFor="message-input">Write a message to AeroGo</label><input id="message-input" value={messageInput} onChange={(event) => setMessageInput(event.target.value)} placeholder="Write a message…" autoComplete="off" /><button className="message-composer__send" type="submit" aria-label="Send message" disabled={!messageInput.trim()}><Send size={17} /></button></form>
            <div className="conversation-footnote">Messages stay in this browser for the demo only.</div>
          </div>
        </section>}
      </main>
    </div>

    <nav className="mobile-tabbar" aria-label="Travel Companion navigation">{tabs.map((item) => <button key={item.id} type="button" className={`mobile-tabbar__item${tab === item.id ? " mobile-tabbar__item--active" : ""}`} onClick={() => setTab(item.id)} aria-current={tab === item.id ? "page" : undefined}>{item.icon}<span>{item.short}</span>{item.id === "messages" && <i />}</button>)}</nav>
    {sheet && <InfoSheet sheet={sheet} onClose={() => setSheet(null)} checked={checked} onToggle={toggleChecklist} />}
    <div className="companion-disclaimer"><ShieldCheck size={13} /> Fictional trip · Sample booking information</div>
  </div>;
}

function InfoSheet({ sheet, onClose, checked, onToggle }: { sheet: NonNullable<Sheet>; onClose: () => void; checked: string[]; onToggle: (id: string) => void }) {
  const event = sheet.event;
  return <div className="sheet-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="info-sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
    <div className="info-sheet__handle" /><div className="info-sheet__top"><span className="eyebrow">SANTOS FAMILY · TOKYO</span><button type="button" className="icon-button" onClick={onClose} aria-label="Close details"><X size={19} /></button></div>
    <h2 id="sheet-title">{sheet.title}</h2>
    {sheet.kind === "checklist" && <><p className="sheet-intro">A few useful things to bring for today’s plans.</p><ChecklistModule checked={checked} onToggle={onToggle} /></>}
    {sheet.kind === "leave" && <div className="structured-answer"><div className="answer-highlight"><span className="answer-highlight__icon"><Clock3 size={19} /></span><span><small>LEAVE THE HOTEL BY</small><strong>9:20 AM</strong><em>Today · Saturday, Nov 14</em></span></div><div className="answer-route"><div><span className="answer-route__dot" /><span><small>START</small><strong>Maple Stay Shinjuku</strong><em>Hotel lobby</em></span></div><span className="answer-route__connector" /><div><span className="answer-route__dot answer-route__dot--end" /><span><small>DESTINATION</small><strong>teamLab Planets</strong><em>Toyosu, Tokyo</em></span></div></div><div className="answer-facts"><span><Clock3 size={15} /> Around 35 min by train</span><span><Navigation size={15} /> Allow extra time with kids</span></div><p className="sheet-small-note">Sample travel time. Check local transit signs on the day.</p></div>}
    {sheet.kind === "reservation" && <div className="structured-answer"><div className="reservation-stamp"><span><Check size={16} /></span><span><small>SAMPLE RESERVATION</small><strong>Details are saved in your trip</strong></span></div><div className="reservation-details"><div><small>DATE &amp; TIME</small><strong>Sat, Nov 14 · 10:30 AM</strong></div><div><small>LOCATION</small><strong>teamLab Planets TOKYO</strong><span>Toyosu, Koto City, Tokyo</span></div><div><small>REFERENCE</small><strong className="reference-code">AG-DEMO-TL-1030</strong></div></div><div className="sheet-hint"><FileText size={16} /><span>Arrive 15 minutes early. Your sample ticket is in Documents → Activities.</span></div></div>}
    {sheet.kind === "baggage" && <div className="structured-answer"><div className="answer-highlight"><span className="answer-highlight__icon"><Plane size={19} /></span><span><small>SAMPLE FLIGHT ALLOWANCE</small><strong>1 cabin + 1 checked bag</strong><em>Per traveler · Demo Air sample booking</em></span></div><div className="reservation-details"><div><small>FLIGHT OUT</small><strong>AG 427 · Manila → Narita</strong></div><div><small>FLIGHT HOME</small><strong>AG 428 · Narita → Manila</strong></div></div><p className="sheet-small-note">Fictional information for the prototype. Actual baggage rules depend on the airline and fare.</p></div>}
    {sheet.kind === "event" && event && <div className="structured-answer"><div className="event-detail-time"><span><Clock3 size={15} /> {event.time}</span>{event.kind && <span className="event-kind-label">{event.kind}</span>}</div><p className="event-detail-location"><MapPin size={16} /> {event.location}</p><p className="event-detail-note">{event.note}</p>{event.reference && <div className="event-reference"><small>DEMO REFERENCE</small><strong>{event.reference}</strong></div>}<div className="sheet-hint"><CircleHelp size={16} /><span>Need help with a change? Message AeroGo from the Messages tab.</span></div></div>}
  </section></div>;
}
