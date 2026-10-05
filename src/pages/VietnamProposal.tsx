import {
  ArrowRight,
  ArrowUp,
  BusFront,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  Plane,
  Sparkles,
  Ticket,
  Utensils,
} from "lucide-react";
import { Brand } from "../components/Brand";
import vietnamHeroPhoto from "../assets/vietnam-hero.webp";
import baNaHillsPhoto from "../assets/vietnam-bana-hills.webp";
import hanoiTrainStreetPhoto from "../assets/vietnam-hanoi.webp";
import "./VietnamProposal.css";

// Real destination photos, used under the Unsplash License.
// Sources: unsplash.com/photos/lighted-bridge-B76nvP51iew,
// unsplash.com/photos/golden-bridge-held-by-giant-hands-in-vietnam-CsoQ-jm_0vQ,
// unsplash.com/photos/train-approaching-outdoor-cafe-on-railway-tracks-5AnbWpkpFME

const inclusions = [
  {
    title: "Flights & transfers",
    icon: Plane,
    items: [
      "Domestic Da Nang → Hanoi flight",
      "Ba Na Hills hotel pickup and drop-off, with air-conditioned round-trip transport",
      "Feb 16, approximately 11:00 PM: hotel-to-airport transfer",
    ],
  },
  {
    title: "Ba Na Hills & Golden Bridge",
    icon: Ticket,
    items: [
      "Full-day tour with an English-speaking guide",
      "Admission/access associated with the tour",
      "Standard included Fantasy Park games and attractions, subject to the notes below",
    ],
  },
  {
    title: "Hanoi full-day tour",
    icon: BusFront,
    items: [
      "Air-conditioned minivan or bus, English-speaking guide, and entrance fees",
      "Hotel pickup and drop-off within the Old Quarter area",
      "One bottle of water, Vietnamese local-dish lunch, and one egg coffee per person",
    ],
  },
];

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="proposal-check-list">
      {items.map((item) => (
        <li key={item}><span className="proposal-check-list__check"><Check size={13} strokeWidth={2.4} /></span><span>{item}</span></li>
      ))}
    </ul>
  );
}

function Day({
  date,
  label,
  title,
  children,
  kind = "tour",
}: {
  date: string;
  label: string;
  title: string;
  children: React.ReactNode;
  kind?: "tour" | "free" | "flight" | "transfer" | "departure";
}) {
  return (
    <article className={`proposal-day proposal-day--${kind}`}>
      <div className="proposal-day__date" aria-label={date}>
        <span>FEB</span><strong>{date}</strong>
      </div>
      <div className="proposal-day__body">
        <div className="proposal-day__label">{label}</div>
        <h3>{title}</h3>
        <div className="proposal-day__details">{children}</div>
      </div>
    </article>
  );
}

export function VietnamProposalPage() {
  return (
    <div className="vietnam-proposal">
      <header className="proposal-header">
        <div className="proposal-header__inner">
          <Brand />
          <span className="proposal-header__label">AEROGO TRIP PROPOSAL</span>
        </div>
      </header>

      <main>
        <section className="proposal-hero" aria-labelledby="proposal-title">
          <div className="proposal-hero__image">
            <img src={vietnamHeroPhoto} alt="Da Nang’s Dragon Bridge at dusk over the Han River" width="1600" height="850" fetchPriority="high" decoding="async" />
          </div>
          <div className="proposal-hero__inner">
            <div className="proposal-hero__copy">
              <span className="proposal-eyebrow"><span /> YOUR PROPOSED VIETNAM TRIP</span>
              <h1 id="proposal-title">Vietnam</h1>
              <p className="proposal-hero__cities">Da Nang <span>+</span> Hanoi</p>
              <p className="proposal-hero__intro">Two cities. Iconic sights. Free time to explore.</p>
            </div>
            <div className="proposal-price-card">
              <div className="proposal-price-card__date"><CalendarDays size={16} /><span>February 12–17</span></div>
              <div className="proposal-price-card__rule" />
              <div className="proposal-price-card__amount"><strong>₱26,288</strong><span>/ person</span></div>
              <p>Includes the Da Nang → Hanoi domestic flight.</p>
            </div>
            <svg className="proposal-hero__ornament" viewBox="0 0 430 400" fill="none" aria-hidden="true">
              <circle cx="265" cy="195" r="145" stroke="currentColor" />
              <circle cx="265" cy="195" r="105" stroke="currentColor" />
              <circle cx="265" cy="195" r="65" stroke="currentColor" />
              <path d="M38 300C111 261 130 203 187 194c57-9 77 44 126 18 39-21 49-68 79-97" stroke="currentColor" strokeDasharray="3 8" />
              <circle cx="38" cy="300" r="5" fill="currentColor" />
              <circle cx="392" cy="115" r="5" fill="currentColor" />
            </svg>
          </div>
        </section>

        <div className="proposal-content">
          <section className="proposal-route" aria-label="Trip route">
            <div className="proposal-route__stop"><span className="proposal-route__pin"><MapPin size={16} /></span><span><small>START</small><strong>Da Nang</strong></span></div>
            <div className="proposal-route__line"><span /><ArrowRight size={17} /></div>
            <div className="proposal-route__stop"><span className="proposal-route__pin proposal-route__pin--end"><MapPin size={16} /></span><span><small>FINISH</small><strong>Hanoi</strong></span></div>
          </section>

          <section className="proposal-overview" aria-label="Trip at a glance">
            <div><strong>06</strong><span>trip days</span></div>
            <div><strong>02</strong><span>cities</span></div>
            <div><strong>02</strong><span>guided tour days</span></div>
          </section>

          <section className="proposal-itinerary" id="itinerary">
            <div className="proposal-section-heading">
              <div><span className="proposal-section-kicker">YOUR JOURNEY</span><h2>Day by day</h2></div>
              <p>A considered mix of guided experiences and time at your own pace.</p>
            </div>
            <div className="proposal-timeline">
              <Day date="12" label="ARRIVAL · DA NANG" title="Arrive and settle in" kind="free">
                <p>Free time after arrival. Settle in and explore at your own pace; no tour is scheduled.</p>
                <span className="proposal-pill"><Sparkles size={13} /> Free time</span>
              </Day>
              <Day date="13" label="FULL DAY · GUIDED TOUR" title="Ba Na Hills & Golden Bridge">
                <p>A full day at Ba Na Hills, with the Golden Bridge and Fantasy Park.</p>
                <div className="proposal-day__tags"><span>Hotel pickup</span><span>English-speaking guide</span><span>Round-trip transport</span></div>
              </Day>
              <Day date="14" label="EVENING · DOMESTIC FLIGHT" title="Da Nang → Hanoi" kind="flight">
                <p>The included domestic flight departs Da Nang in the evening. Hanoi arrival is after midnight, on February 15.</p>
                <span className="proposal-pill proposal-pill--flight"><Plane size={13} /> Flight included</span>
              </Day>
              <Day date="15" label="HANOI · ARRIVAL + FREE TIME" title="Arrive in Hanoi, then take it easy" kind="free">
                <p>Arrive after the overnight transition, then rest, settle in and explore Hanoi at your own pace. No tour is scheduled.</p>
                <span className="proposal-pill"><Sparkles size={13} /> Free time</span>
              </Day>
              <Day date="16" label="FULL DAY · GUIDED TOUR" title="Discover Hanoi">
                <p>Spend the day with a local guide, visiting Incense Village, Train Street and Hanoi city highlights.</p>
                <div className="proposal-day__tags"><span>Local-dish lunch</span><span>Egg coffee</span><span>Entrance fees</span></div>
              </Day>
              <Day date="16" label="APPROX. 11:00 PM · HOTEL PICKUP" title="Hotel → airport transfer" kind="transfer">
                <p>Pickup is from your hotel and transfer is to the airport, ahead of the departure associated with February 17.</p>
                <span className="proposal-pill proposal-pill--transfer"><BusFront size={13} /> Hotel to airport</span>
              </Day>
              <Day date="17" label="DEPARTURE DAY" title="Trip concludes" kind="departure">
                <p>Your departure day. Flight time and airline details are not listed in this proposal.</p>
              </Day>
            </div>
          </section>

          <section className="proposal-experiences" aria-labelledby="experiences-title">
            <div className="proposal-section-heading">
              <div><span className="proposal-section-kicker">THE GUIDED DAYS</span><h2 id="experiences-title">Included experiences</h2></div>
              <p>The essentials are arranged, with breathing room to enjoy each place.</p>
            </div>
            <div className="proposal-experiences__grid">
              <article className="proposal-experience-card proposal-experience-card--green">
                <img className="proposal-experience-card__image" src={baNaHillsPhoto} alt="The Golden Bridge at Ba Na Hills, held above the mountain landscape by sculpted stone hands" width="1200" height="650" loading="lazy" decoding="async" />
                <span className="proposal-experience-card__index">01 / DA NANG</span>
                <h3>Above the city at Ba Na Hills</h3>
                <p>A full-day outing to Ba Na Hills, the Golden Bridge and Fantasy Park.</p>
                <div className="proposal-experience-card__highlights"><span>Ba Na Hills</span><span>Golden Bridge</span><span>Fantasy Park</span></div>
                <span className="proposal-experience-card__foot"><BusFront size={15} /> Hotel pickup · English-speaking guide · air-conditioned round-trip transport</span>
              </article>
              <article className="proposal-experience-card">
                <img className="proposal-experience-card__image" src={hanoiTrainStreetPhoto} alt="A train approaches along Hanoi Train Street between cafés and close-set shopfronts" width="1200" height="650" loading="lazy" decoding="async" />
                <span className="proposal-experience-card__index">02 / HANOI</span>
                <h3>A full day with Hanoi</h3>
                <p>A guided day through Incense Village, Train Street and Hanoi city highlights.</p>
                <div className="proposal-experience-card__highlights"><span>Incense Village</span><span>Train Street</span><span>City highlights</span></div>
                <span className="proposal-experience-card__foot"><Utensils size={15} /> Vietnamese local-dish lunch · one egg coffee per person</span>
              </article>
            </div>
          </section>

          <section className="proposal-included" aria-labelledby="included-title">
            <div className="proposal-section-heading">
              <div><span className="proposal-section-kicker">PACKAGE DETAILS</span><h2 id="included-title">What’s included</h2></div>
              <p>₱26,288 per person, based on the confirmed items below.</p>
            </div>
            <div className="proposal-included__grid">
              {inclusions.map(({ title, icon: Icon, items }) => (
                <article className="proposal-inclusion-card" key={title}>
                  <span className="proposal-inclusion-card__icon"><Icon size={18} strokeWidth={1.7} /></span>
                  <h3>{title}</h3>
                  <CheckList items={items} />
                </article>
              ))}
            </div>
          </section>

          <section className="proposal-notes" aria-labelledby="notes-title">
            <div className="proposal-notes__heading"><span className="proposal-section-kicker">A FEW HELPFUL NOTES</span><h2 id="notes-title">Before you go</h2><p>A little clarity now helps make the trip feel easy later.</p></div>
            <div className="proposal-notes__columns">
              <div>
                <h3>Ba Na Hills & Fantasy Park</h3>
                <ul><li>Wax Museum, roller coaster, and separately priced games or attractions are not included.</li><li>Ba Na Hills buffet lunch is not included.</li></ul>
              </div>
              <div>
                <h3>Not listed as package inclusions</h3>
                <p>Accommodation, international flights, baggage allowance, insurance, visa fees, airport taxes and meals outside the Hanoi tour lunch are not listed as included.</p>
              </div>
            </div>
          </section>

          <section className="proposal-disclaimer">
            <Clock3 size={17} />
            <p>Package rates are subject to availability and may change until booking is confirmed. Schedules and tour arrangements may be adjusted when necessary.</p>
          </section>
        </div>
      </main>

      <footer className="proposal-footer">
        <div className="proposal-footer__inner"><div><Brand light /><p>Travel planning, with a companion along the way.</p></div><a href="#proposal-title">Back to top <ArrowUp size={14} /></a></div>
        <div className="proposal-footer__bottom">AeroGo Travel &amp; Tours <span>·</span> Your Vietnam proposal</div>
      </footer>
    </div>
  );
}
