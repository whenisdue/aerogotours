import { ArrowDownRight, ArrowRight, Bookmark, Check, ChevronDown, Clock3, FileText, MapPin, Navigation, Plane, Hotel, CarFront, Ticket, Utensils, Footprints, Umbrella, Plug, QrCode } from "lucide-react";
import { useState, type ReactNode } from "react";
import { checklistItems, type TripDay, type TripEvent } from "../data/trip";

const eventIcon = (kind?: TripEvent["kind"]) => {
  switch (kind) {
    case "flight": return <Plane size={17} />;
    case "hotel": return <Hotel size={17} />;
    case "transfer": return <CarFront size={17} />;
    case "meal": return <Utensils size={17} />;
    default: return <Ticket size={17} />;
  }
};

export function NextUpCard({ onDetails, onDirections }: { onDetails: () => void; onDirections: () => void }) {
  return (
    <section className="next-up-card" aria-labelledby="next-up-heading">
      <div className="next-up-card__topline"><span className="eyebrow eyebrow--light"><span className="live-dot" /> NEXT UP</span><span className="next-up-card__countdown">In 1 hr 42 min</span></div>
      <div className="next-up-card__main">
        <div className="next-up-card__icon"><Ticket size={21} strokeWidth={1.8} /></div>
        <div>
          <p className="next-up-card__time"><Clock3 size={14} /> 10:30 AM <span>· 1 hr 30 min</span></p>
          <h2 id="next-up-heading">teamLab Planets</h2>
          <p className="next-up-card__location"><MapPin size={14} /> Toyosu, Tokyo</p>
        </div>
      </div>
      <div className="next-up-card__leave"><span className="leave-icon"><Footprints size={16} /></span><span><strong>Leave the hotel by 9:20 AM</strong><small>About 35 min by train · Allow extra time with kids</small></span></div>
      <div className="next-up-card__actions">
        <button type="button" className="button button--light" onClick={onDetails}>View details <ArrowRight size={15} /></button>
        <button type="button" className="button button--outline-light" onClick={onDirections}><Navigation size={15} /> Directions</button>
      </div>
    </section>
  );
}

export function SmartQuestionCard({ icon, question, answer, onClick }: { icon: ReactNode; question: string; answer: string; onClick: () => void }) {
  return (
    <button className="smart-question" type="button" onClick={onClick}>
      <span className="smart-question__icon">{icon}</span>
      <span className="smart-question__copy"><strong>{question}</strong><small>{answer}</small></span>
      <ArrowRight className="smart-question__arrow" size={16} />
    </button>
  );
}

export function ChecklistModule({ checked, onToggle }: { checked: string[]; onToggle: (id: string) => void }) {
  const icons: Record<string, ReactNode> = { passports: <FileText size={17} />, tickets: <QrCode size={17} />, charger: <Plug size={17} />, shoes: <Footprints size={17} />, umbrella: <Umbrella size={17} /> };
  return (
    <div className="checklist-module">
      <div className="checklist-module__intro"><span className="module-icon"><Bookmark size={17} /></span><div><span className="eyebrow">BEFORE YOU HEAD OUT</span><h3>Today’s checklist</h3><p>A few useful things for the day ahead.</p></div></div>
      <div className="checklist-items">
        {checklistItems.map((item) => {
          const isChecked = checked.includes(item.id);
          return <button className={`checklist-item${isChecked ? " checklist-item--checked" : ""}`} key={item.id} onClick={() => onToggle(item.id)} type="button" aria-pressed={isChecked}>
            <span className="checklist-item__check">{isChecked ? <Check size={14} /> : null}</span><span className="checklist-item__icon">{icons[item.id]}</span><span className="checklist-item__label"><strong>{item.label}</strong><small>{item.detail}</small></span>
          </button>;
        })}
      </div>
      <div className="checklist-module__foot"><span>{checked.length} of {checklistItems.length} ready</span><div className="progress-track"><span style={{ width: `${checked.length / checklistItems.length * 100}%` }} /></div></div>
    </div>
  );
}

export function TripEventCard({ event, compact = false, onClick }: { event: TripEvent; compact?: boolean; onClick?: () => void }) {
  const content = <>
    <span className="trip-event__time">{event.time}</span>
    <span className="trip-event__marker">{eventIcon(event.kind)}</span>
    <span className="trip-event__content"><strong>{event.title}</strong><small><MapPin size={12} /> {event.location}</small>{!compact && <span className="trip-event__note">{event.note}</span>}{event.reference && !compact && <span className="trip-event__ref"><FileText size={12} /> {event.reference}</span>}</span>
    {onClick && <ArrowDownRight className="trip-event__open" size={16} />}
  </>;
  return onClick ? <button className={`trip-event${compact ? " trip-event--compact" : ""}`} type="button" onClick={onClick}>{content}</button> : <div className={`trip-event${compact ? " trip-event--compact" : ""}`}>{content}</div>;
}

export function DayItinerary({ day, current = false, initiallyOpen = false, onEventClick }: { day: TripDay; current?: boolean; initiallyOpen?: boolean; onEventClick?: (event: TripEvent) => void }) {
  const [open, setOpen] = useState(initiallyOpen);
  return (
    <section className={`day-itinerary${current ? " day-itinerary--current" : ""}`}>
      <button className="day-itinerary__heading" type="button" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="day-itinerary__number">{String(day.day).padStart(2, "0")}</span>
        <span className="day-itinerary__day-copy"><span className="eyebrow">DAY {day.day} · {day.date.toUpperCase()}</span><strong>{day.title}</strong><small>{day.summary}</small></span>
        {current && <span className="day-itinerary__today">TODAY</span>}
        <ChevronDown className={`day-itinerary__chevron${open ? " day-itinerary__chevron--open" : ""}`} size={18} />
      </button>
      {open && <div className="day-itinerary__events">{day.events.map((event, index) => <TripEventCard key={`${day.day}-${index}`} event={event} onClick={onEventClick ? () => onEventClick(event) : undefined} />)}</div>}
    </section>
  );
}

const documentIcons: Record<string, ReactNode> = {
  plane: <Plane size={18} />, hotel: <Hotel size={18} />, car: <CarFront size={18} />, ticket: <Ticket size={18} />,
};

export function DocumentCard({ title, subtitle, reference, icon, onClick }: { title: string; subtitle: string; reference: string; icon: string; onClick: () => void }) {
  return <button className="document-card" type="button" onClick={onClick}><span className="document-card__icon">{documentIcons[icon] ?? <FileText size={18} />}</span><span className="document-card__copy"><strong>{title}</strong><small>{subtitle}</small><span>{reference}</span></span><span className="document-card__action">View <ArrowRight size={14} /></span></button>;
}

export function MessageBubble({ sender, text, time }: { sender: string; text: string; time: string }) {
  const fromAeroGo = sender === "aerogo";
  return <div className={`message-row${fromAeroGo ? " message-row--aerogo" : ""}`}><div className="message-avatar">{fromAeroGo ? "A" : "S"}</div><div className="message-row__body"><span className="message-row__sender">{fromAeroGo ? "AeroGo" : "Santos Family"}</span><div className="message-bubble">{text}</div><span className="message-row__time">{time}</span></div></div>;
}

export function LeaveTimeCard({ onClick }: { onClick: () => void }) {
  return <button className="leave-time-card" type="button" onClick={onClick}><span className="leave-time-card__icon"><Clock3 size={17} /></span><span><small>YOUR LEAVE-BY TIME</small><strong>9:20 AM</strong><small>Hotel → teamLab Planets</small></span><ArrowRight size={16} /></button>;
}
