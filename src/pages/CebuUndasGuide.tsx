import { useEffect } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { EditorialBreadcrumb } from "../components/EditorialBreadcrumb";
import { EditorialFooter } from "../components/EditorialFooter";
import { SiteHeader } from "../components/SiteHeader";
import { travelGuides } from "../data/travelGuides";
import { SITE_ORIGIN } from "../utils/siteMetadata";
import "./CebuUndasGuide.css";

const guideEntry = travelGuides.find((item) => item.path === "/guides/philippines/cebu-pacific-undas-2026-flight-checklist");
if (!guideEntry) throw new Error("Cebu Pacific Undas guide metadata is missing");
const { sourcesCheckedAt, imageSrc } = guideEntry;
if (!sourcesCheckedAt || !imageSrc) throw new Error("Cebu Pacific Undas guide metadata is incomplete");
const guide = { ...guideEntry, sourcesCheckedAt, imageSrc };

const formatDate = (date: string) => new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
}).format(new Date(`${date}T00:00:00Z`));

const sourceLinks = [
  { label: "Cebu Pacific — Peak Travel Season Guidelines", url: "https://help.cebupacificair.com/article/peak-travel-season-guidelines-122760", note: "Current page lists the October 28–November 3, 2026 peak period and arrival recommendations." },
  { label: "Cebu Pacific — Check-in and Boarding", url: "https://help.cebupacificair.com/article/check-in-and-boarding-122499", note: "Online check-in windows, counter guidance and boarding instructions." },
  { label: "Cebu Pacific — Hand Carry Guidelines", url: "https://help.cebupacificair.com/article/hand-carry-guidelines-272309", note: "Updated hand-carry policy effective September 15, 2026; 5J and DG allowances differ." },
  { label: "Cebu Pacific — Baggage Guidelines and Upgrade Options", url: "https://help.cebupacificair.com/article/ceb-baggage-guidelines-and-upgrade-options-118500", note: "Checked-baggage allowances by fare bundle and Manage Booking instructions." },
  { label: "Cebu Pacific — Domestic Travel Guide", url: "https://help.cebupacificair.com/article/cebu-pacific-domestic-travel-guide-162560", note: "Domestic travel documents and airport guidance; some baggage and arrival wording differs from newer peak-season or dedicated baggage pages." },
  { label: "Philippine eTravel — Frequently Asked Questions", url: "https://etravel.gov.ph/frequently-asked-questions", note: "Official eligibility, free registration, QR-code instructions and the FAQ’s 72-hour wording." },
  { label: "Bureau of Immigration — eTravel Registration Advisory, October 5, 2026", url: "https://immigration.gov.ph/advisory-etravel-registration/", note: "Advisory says to register or update eTravel at least 72 hours before intended travel." },
  { label: "Cebu Pacific — Manage Your Disrupted Flight", url: "https://help.cebupacificair.com/article/how-to-manage-your-disrupted-flight-120721", note: "Current flight-status, booking-management and disruption-option guidance." },
  { label: "Cebu Pacific — Flight Status", url: "https://www.cebupacificair.com/en-PH/flight-status", note: "Carrier flight-status lookup; use the date and flight number on your itinerary." },
  { label: "Cebu Pacific — Manage Booking", url: "https://www.cebupacificair.com/en-PH/manage-booking", note: "Check booking details, baggage entitlements and any disruption options made available to your booking." },
];

export function CebuUndasGuide() {
  useEffect(() => {
    const articleUrl = new URL(guide.path, SITE_ORIGIN).href;
    const hasArticleSchema = Array.from(document.head.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]')).some((script) => {
      try {
        const parsed: unknown = JSON.parse(script.textContent ?? "{}");
        const graph = parsed && typeof parsed === "object" && "@graph" in parsed && Array.isArray(parsed["@graph"])
          ? parsed["@graph"]
          : [parsed];
        return graph.some((entry) => entry && typeof entry === "object"
          && entry["@type"] === "Article"
          && entry.mainEntityOfPage?.["@id"] === articleUrl);
      } catch {
        return false;
      }
    });

    let dynamicSchema: HTMLScriptElement | undefined;
    if (!hasArticleSchema) {
      dynamicSchema = document.createElement("script");
      dynamicSchema.type = "application/ld+json";
      dynamicSchema.dataset.cebuUndasSchema = "";
      dynamicSchema.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: guide.title,
        description: guide.seoDescription ?? guide.summary,
        image: new URL(guide.imageSrc, SITE_ORIGIN).href,
        ...(guide.publishedAt ? { datePublished: guide.publishedAt } : {}),
        author: { "@type": "Organization", name: "AeroGo", url: `${SITE_ORIGIN}/` },
        publisher: { "@type": "Organization", name: "AeroGo", url: `${SITE_ORIGIN}/` },
        mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
        inLanguage: "en",
      });
      document.head.append(dynamicSchema);
    }
    window.dispatchEvent(new Event("aerogo:metadata-ready"));
    return () => dynamicSchema?.remove();
  }, []);

  const manilaToday = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const afterPeakWindow = manilaToday > "2026-11-03";

  return <div className="public-site cebu-undas-site editorial-foundation">
    <SiteHeader />
    <main className="cebu-undas page-shell">
      <EditorialBreadcrumb items={[
        { label: "Discover", to: "/" },
        { label: "Guides", to: "/guides" },
        { label: "Cebu Pacific Undas checklist" },
      ]} />
      <article
        className="cebu-undas__article"
        data-seo-title={guide.seoTitle}
        data-seo-description={guide.seoDescription}
        data-seo-image={guide.imageSrc}
        data-seo-image-alt={guide.socialImageAlt ?? guide.imageAlt}
        data-seo-published={guide.publishedAt}
      >
        <header className="cebu-undas__hero">
          <p className="cebu-undas__eyebrow">PHILIPPINES / PRACTICAL FLIGHT GUIDE</p>
          <p className="cebu-undas__period">FOR CEBU PACIFIC TRAVEL · 28 OCTOBER–3 NOVEMBER 2026</p>
          <h1>Flying Cebu Pacific During Undas 2026? <span>7 Things to Check Before You Leave</span></h1>
          <p className="cebu-undas__standfirst">Flying during Cebu Pacific’s listed Undas peak period? Check your airport and flight details, plan to arrive <strong>3 hours before a domestic flight or 4 hours before an international flight</strong>, and confirm the rules for your own booking. Those are airport-arrival recommendations—not check-in deadlines.</p>
          <dl className="cebu-undas__dateline">
            {guide.publishedAt && <div><dt>Published</dt><dd><time dateTime={guide.publishedAt}>{formatDate(guide.publishedAt)}</time></dd></div>}
            <div><dt>Sources checked</dt><dd><time dateTime={guide.sourcesCheckedAt}>{formatDate(guide.sourcesCheckedAt)}</time></dd></div>
          </dl>
        </header>

        {afterPeakWindow && <aside className="cebu-undas__archive" aria-label="Archived peak travel guidance">
          <strong>This is a 2026 holiday-period snapshot.</strong> The October 28–November 3 window has passed. Check Cebu Pacific’s current guidance and your booking for any later trip; these peak-period arrival recommendations may no longer apply.
        </aside>}

        <figure className="cebu-undas__image">
          <img src={guide.imageSrc} width="1536" height="1024" alt={guide.imageAlt} fetchPriority="high" decoding="async" />
          <figcaption>Original AeroGo illustration for this checklist. It is illustrative, not a photograph of an airport, Cebu Pacific aircraft or current flight operation.</figcaption>
        </figure>

        <section className="cebu-undas__arrival" aria-label="Cebu Pacific peak-period airport arrival recommendations">
          <div className="cebu-undas__arrival-heading"><span>THE QUICK ANSWER</span><h2>Give yourself time before the holiday rush</h2></div>
          <div className="cebu-undas__arrival-times">
            <div><span>DOMESTIC</span><strong>3 <small>hours</small></strong><p>before scheduled departure</p></div>
            <div><span>INTERNATIONAL</span><strong>4 <small>hours</small></strong><p>before scheduled departure</p></div>
          </div>
          <p>These are Cebu Pacific’s recommendations for its listed peak dates, October 28–November 3, 2026. They are not check-in closing times. <a href={sourceLinks[0].url} target="_blank" rel="noopener noreferrer">Read the carrier’s peak-season guidance <ExternalLink size={14} aria-hidden="true" /></a></p>
        </section>

        <nav className="cebu-undas__jump" aria-label="Seven travel checks">
          <span>JUMP TO</span>
          <a href="#check-1">Flight &amp; terminal</a><a href="#check-2">Arrival time</a><a href="#check-3">Online check-in</a><a href="#check-4">Baggage</a><a href="#check-5">Documents</a><a href="#check-6">Airport steps</a><a href="#check-7">Flight changes</a>
        </nav>

        <div className="cebu-undas__checks">
          <section className="cebu-undas__check" id="check-1" aria-labelledby="check-title-1">
            <div className="cebu-undas__number">01</div><div className="cebu-undas__check-content"><p className="cebu-undas__kicker">BEFORE YOU LEAVE HOME</p><h2 id="check-title-1">Know your departure time and airport terminal</h2>
              <p>Open the Cebu Pacific app or your itinerary and confirm the date, flight number, departure airport and terminal. Check the flight again in the carrier’s <a href={sourceLinks[8].url} target="_blank" rel="noopener noreferrer">flight-status tool</a> before travelling. Do not assume that every Cebu Pacific or Cebgo service uses the same terminal, or that a terminal instruction for one airport applies to another.</p>
              <p>If you booked through an agent or another booking site, compare its itinerary with the airline’s booking record. If details differ, contact the airline or booking provider before setting out.</p>
              <p className="cebu-undas__source">Carrier references: <a href={sourceLinks[0].url} target="_blank" rel="noopener noreferrer">Peak travel guidance</a> · <a href={sourceLinks[8].url} target="_blank" rel="noopener noreferrer">Flight status</a> <ExternalLink size={13} aria-hidden="true" /></p>
            </div>
          </section>

          <section className="cebu-undas__check" id="check-2" aria-labelledby="check-title-2">
            <div className="cebu-undas__number">02</div><div className="cebu-undas__check-content"><p className="cebu-undas__kicker">ALLOW TIME FOR THE AIRPORT</p><h2 id="check-title-2">Plan to arrive early</h2>
              <p>For the October 28–November 3 peak period, Cebu Pacific recommends arriving at least <strong>3 hours before domestic departures</strong> and <strong>4 hours before international departures</strong>. Treat this as the time to be at the airport, not the time your check-in counter closes.</p>
              <p><strong>Why we use 3 hours for a domestic flight:</strong> the carrier’s peak-season page recommends 3 hours, while its general Domestic Travel Guide still says 2 hours. For this named peak period, follow the stricter peak-season instruction and recheck the airline’s current notice before travel.</p>
              <p className="cebu-undas__source">Source: <a href={sourceLinks[0].url} target="_blank" rel="noopener noreferrer">Cebu Pacific Peak Travel Season Guidelines</a> · <a href={sourceLinks[4].url} target="_blank" rel="noopener noreferrer">Domestic Travel Guide</a> <ExternalLink size={13} aria-hidden="true" /></p>
            </div>
          </section>

          <section className="cebu-undas__check" id="check-3" aria-labelledby="check-title-3">
            <div className="cebu-undas__number">03</div><div className="cebu-undas__check-content"><p className="cebu-undas__kicker">CHECK IN ONLINE</p><h2 id="check-title-3">Know the separate check-in deadlines</h2>
              <p>Cebu Pacific says online check-in opens <strong>48 hours before departure</strong>. It closes <strong>1 hour before a domestic flight</strong> and <strong>2 hours before an international flight</strong>. Those are online check-in cutoffs—not the recommended airport-arrival time.</p>
              <div className="cebu-undas__deadline-table" role="group" aria-label="Check-in time comparison">
                <div><span>Online check-in opens</span><strong>Both: 48 hours before</strong></div>
                <div><span>Online check-in closes</span><strong>Domestic: 1 hour · International: 2 hours</strong></div>
                <div><span>Airport counter closes</span><strong>Domestic: 45 min · International: 1 hour</strong></div>
              </div>
              <p>If the app does not issue a boarding pass, your visa or documents need checking, or you need assistance that cannot be completed online, go to the staffed counter earlier. Cebu Pacific says some international bookings require staff verification before the boarding pass is issued.</p>
              <p className="cebu-undas__source">Source: <a href={sourceLinks[1].url} target="_blank" rel="noopener noreferrer">Cebu Pacific Check-in and Boarding</a> <ExternalLink size={13} aria-hidden="true" /></p>
            </div>
          </section>

          <section className="cebu-undas__check" id="check-4" aria-labelledby="check-title-4">
            <div className="cebu-undas__number">04</div><div className="cebu-undas__check-content"><p className="cebu-undas__kicker">PACK TO YOUR TICKET</p><h2 id="check-title-4">Check your baggage allowance</h2>
              <p><strong>Hand-carry</strong> means bags you take into the cabin. Cebu Pacific’s policy effective September 15, 2026 allows one overhead item (up to 56 × 36 × 23 cm) and one under-seat personal item (up to 20 × 20 × 35 cm). The combined weight limit is <strong>10 kg on Cebu Pacific (5J)</strong> flights and <strong>7 kg on Cebgo (DG)</strong> flights. For a connecting 5J–DG itinerary, the allowance applies separately to each flight.</p>
              <p><strong>Checked baggage</strong> is handed over at bag drop. The current fare table says GO Basic includes no checked bag, while GO Easy and GO Flexi include one 20 kg piece. Add-ons and entitlements are booking-specific, so check every flight sector in your ticket or <a href={sourceLinks[9].url} target="_blank" rel="noopener noreferrer">Manage Booking</a>. Do not assume baggage is included or that the same allowance applies to all fares.</p>
              <p>The carrier’s older Domestic Travel Guide still mentions a 7 kg hand-carry limit, but its newer dedicated baggage page distinguishes 5J (10 kg) from DG (7 kg). Check the flight code on your itinerary and use the dedicated current baggage page if you are unsure.</p>
              <p className="cebu-undas__source">Sources: <a href={sourceLinks[2].url} target="_blank" rel="noopener noreferrer">Hand Carry Guidelines</a> · <a href={sourceLinks[3].url} target="_blank" rel="noopener noreferrer">Checked-baggage fare table</a> · <a href={sourceLinks[4].url} target="_blank" rel="noopener noreferrer">Domestic Travel Guide</a> <ExternalLink size={13} aria-hidden="true" /></p>
            </div>
          </section>

          <section className="cebu-undas__check" id="check-5" aria-labelledby="check-title-5">
            <div className="cebu-undas__number">05</div><div className="cebu-undas__check-content"><p className="cebu-undas__kicker">DOCUMENTS &amp; FORMS</p><h2 id="check-title-5">Prepare IDs, passports, visas and required forms</h2>
              <div className="cebu-undas__split">
                <div><h3>Domestic-only trip</h3><p>Bring the physical ID or other document required for your booking and keep your itinerary or boarding pass accessible. Cebu Pacific’s domestic guide describes separate ID requirements for Filipino and foreign passengers. <strong>An ordinary domestic-only trip does not require an international eTravel form.</strong></p></div>
                <div><h3>International trip</h3><p>Check your passport validity, destination visa and transit-visa rules with official sources. Cebu Pacific’s check-in guide asks passengers to make sure the passport is valid for at least six months beyond the scheduled trip; destination-specific rules can vary. Carry any required onward-ticket, entry or health documents specified for your route.</p></div>
              </div>
              <p><strong>Philippine eTravel:</strong> registration is free and is required for arriving passengers and crew and departing Filipino passengers, with exceptions listed in the official FAQ. The FAQ says registration is available <em>within</em> 72 hours before arrival or departure; the Bureau of Immigration’s October 5 advisory says to register or update information <em>at least</em> 72 hours before travel. These instructions conflict, and we found no later official clarification as of October 26, so we cannot give you a precise deadline. When the registration window becomes available for your trip on the official <a href="https://etravel.gov.ph" target="_blank" rel="noopener noreferrer">etravel.gov.ph</a> portal, complete the form before you travel and save or screenshot your QR code. Check the portal and Bureau of Immigration for current instructions. Use only the free government service.</p>
              <p className="cebu-undas__source">Sources: <a href={sourceLinks[4].url} target="_blank" rel="noopener noreferrer">Cebu Pacific Domestic Travel Guide</a> · <a href={sourceLinks[1].url} target="_blank" rel="noopener noreferrer">Check-in and Boarding</a> · <a href={sourceLinks[5].url} target="_blank" rel="noopener noreferrer">eTravel FAQ</a> · <a href={sourceLinks[6].url} target="_blank" rel="noopener noreferrer">BI advisory (October 5, 2026)</a> <ExternalLink size={13} aria-hidden="true" /></p>
            </div>
          </section>

          <section className="cebu-undas__check" id="check-6" aria-labelledby="check-title-6">
            <div className="cebu-undas__number">06</div><div className="cebu-undas__check-content"><p className="cebu-undas__kicker">AT THE AIRPORT</p><h2 id="check-title-6">Follow the procedures for your airport</h2>
              <ol className="cebu-undas__steps"><li>Use the terminal, entrance and check-in area shown in your current itinerary and airport information.</li><li>Drop checked bags before the airline’s counter cutoff; keep your travel documents and medication with you.</li><li>Pass through security screening. For international travel, complete departure immigration procedures and keep your passport ready.</li><li>Check airport monitors and airline announcements for your gate and boarding time. A gate or counter assignment can change; follow the latest airport and carrier instructions.</li></ol>
              <p>Some airport instructions are location-specific. For example, Cebu Pacific’s page for flights departing from NAIA Terminal 3 currently says to enter through Gates 5 and 6 and use the check-in kiosks between Aisles A and B. That instruction is only for the stated terminal; other airports have their own arrangements.</p>
              <p className="cebu-undas__source">Sources: <a href={sourceLinks[0].url} target="_blank" rel="noopener noreferrer">Peak-season airport notes</a> · <a href={sourceLinks[1].url} target="_blank" rel="noopener noreferrer">Check-in and Boarding</a> <ExternalLink size={13} aria-hidden="true" /></p>
            </div>
          </section>

          <section className="cebu-undas__check" id="check-7" aria-labelledby="check-title-7">
            <div className="cebu-undas__number">07</div><div className="cebu-undas__check-content"><p className="cebu-undas__kicker">IF SOMETHING CHANGES</p><h2 id="check-title-7">Check your flight and booking before making plans</h2>
              <p>Cebu Pacific says affected passengers may be notified by staff, email or text, and advises checking its live flight-status page. Open <a href={sourceLinks[9].url} target="_blank" rel="noopener noreferrer">Manage Booking</a> or the app to see whether the airline has added options to your specific booking. Use contact details in your itinerary if you booked through a travel provider.</p>
              <p>The carrier’s current disrupted-flight page lists different options for different situations: for example, it lists rebooking, refund or Travel Fund for a cancellation; a schedule change under one hour has no listed options; and a change of an hour or more lists rebooking or Travel Fund, but not a refund. Eligibility and choices depend on the disruption and booking. Read the option shown to you carefully: Cebu Pacific says a selected option cannot be undone. This guide does not promise a refund, rebooking, compensation or any particular result.</p>
              <p className="cebu-undas__source">Sources: <a href={sourceLinks[7].url} target="_blank" rel="noopener noreferrer">Cebu Pacific disruption guidance</a> · <a href={sourceLinks[8].url} target="_blank" rel="noopener noreferrer">Flight status</a> · <a href={sourceLinks[9].url} target="_blank" rel="noopener noreferrer">Manage Booking</a> <ExternalLink size={13} aria-hidden="true" /></p>
            </div>
          </section>
        </div>

        <section className="cebu-undas__save" aria-labelledby="cebu-undas-save-title">
          <p>BEFORE YOU LEAVE / SAVE THIS CHECKLIST</p><h2 id="cebu-undas-save-title">Seven quick checks</h2>
          <ol><li>Confirm flight date, flight number, airport and terminal.</li><li>Plan airport arrival: 3 hours domestic / 4 hours international during the listed peak period.</li><li>Check in online at the right time—or arrive early for document verification.</li><li>Measure and weigh cabin bags; confirm checked baggage on each booking sector.</li><li>Pack the correct ID, passport, visa and required forms; save any eTravel QR code.</li><li>Follow airport-specific screening, bag-drop, immigration and gate instructions.</li><li>Check live status and Manage Booking if your flight changes.</li></ol>
          <p className="cebu-undas__save-note">Airline schedules, airport procedures and travel rules can change. Recheck the operating airline, airport and official government sources before leaving. Your operating airline is the authority for your flight and booking.</p>
        </section>

        <section className="cebu-undas__sources" aria-labelledby="cebu-undas-sources-title">
          <p className="cebu-undas__kicker">CHECKED 26 OCTOBER 2026</p><h2 id="cebu-undas-sources-title">Official sources</h2>
          <p>We checked these live carrier and government pages on October 26, 2026. Some pages do not show a publication date. Check them again on your actual travel date; the eTravel timing statements conflict as described above.</p>
          <ul>{sourceLinks.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} <ExternalLink size={14} aria-hidden="true" /></a><span>{source.note}</span></li>)}</ul>
          <p className="cebu-undas__archive-policy">Archive policy: this page is a dated guide to Cebu Pacific’s listed October 28–November 3, 2026 peak period. After the holiday, it will remain available as a 2026 snapshot with a clear notice; the homepage feature will return to an evergreen guide. Any future holiday guidance should be rechecked and dated before the page is refreshed.</p>
        </section>

        <nav className="cebu-undas__related" aria-label="Related AeroGo guides">
          <Link to="/travel-updates/undas-2026-pitx-holiday-travel-rush">Taking the bus for Undas? Read our PITX travel update <ArrowUpRight size={17} aria-hidden="true" /></Link>
          <Link to="/guides">Browse all travel guides <ArrowUpRight size={17} aria-hidden="true" /></Link>
        </nav>
      </article>
    </main>
    <EditorialFooter editorial />
  </div>;
}
