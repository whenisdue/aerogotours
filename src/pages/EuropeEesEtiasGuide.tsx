import { useEffect } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { EditorialBreadcrumb } from "../components/EditorialBreadcrumb";
import { EditorialFooter } from "../components/EditorialFooter";
import { SiteHeader } from "../components/SiteHeader";
import { travelGuides } from "../data/travelGuides";
import { getSocialImageUrl, SITE_ORIGIN } from "../utils/siteMetadata";
import "./EuropeEesEtiasGuide.css";

const guide = (() => {
  const entry = travelGuides.find((item) => item.path === "/guides/europe/ees-etias-entry-rules-2026");
  if (!entry) throw new Error("Europe EES and ETIAS guide metadata is missing");
  if (!entry.imageSrc || !entry.socialImageSrc || !entry.sourcesCheckedAt) throw new Error("Europe EES and ETIAS guide metadata is incomplete");
  return { ...entry, imageSrc: entry.imageSrc, socialImageSrc: entry.socialImageSrc, sourcesCheckedAt: entry.sourcesCheckedAt };
})();

const formatDate = (value: string) => new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
}).format(new Date(`${value}T00:00:00Z`));

const sources = [
  { label: "European Commission — Entry/Exit System (EES)", date: "10 April 2026", href: "https://home-affairs.ec.europa.eu/policies/schengen/smart-borders/entry-exit-system_en", note: "Confirms that EES became fully operational on 10 April 2026 and describes the records it holds." },
  { label: "EU Travel to Europe — EES frequently asked questions", date: "Checked 27 October 2026", href: "https://travel-europe.europa.eu/ees/faq", note: "Scope, biometric data, exemptions and passport-control procedures." },
  { label: "EU Travel to Europe — Travel to Europe mobile app", date: "Checked 27 October 2026", href: "https://travel-europe.europa.eu/ees/Travel-to-Europe-mobile-app.html", note: "Optional advance EES data registration, current country availability and app features." },
  { label: "EU Travel to Europe — ETIAS frequently asked questions", date: "Checked 27 October 2026", href: "https://travel-europe.europa.eu/etias/faq", note: "Current operating status, who will need authorization and the future application channel." },
  { label: "European Commission — EES and ETIAS: key differences", date: "28 April 2026", href: "https://home-affairs.ec.europa.eu/news/main-differences-between-ees-and-etias-what-travellers-need-know-2026-04-28_en", note: "An EU information article that still describes a fourth-quarter 2026 ETIAS target." },
  { label: "Polish government — Introduction of ETIAS in 2027", date: "20 October 2026", href: "https://www.gov.pl/web/denmark/introduction-of-etias-in-2027", note: "A newer national government notice says launch is planned for 2027, with the operating date to follow." },
  { label: "European Commission — EU visa policy", date: "Checked 27 October 2026", href: "https://home-affairs.ec.europa.eu/policies/schengen/visa-policy_en", note: "Links to the official nationality lists for short-stay visa-required and visa-exempt travelers." },
];

export function EuropeEesEtiasGuide() {
  useEffect(() => {
    const articleUrl = new URL(guide.path, SITE_ORIGIN).href;
    const hasStaticSchema = Array.from(document.head.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]')).some((script) => {
      try {
        const data: unknown = JSON.parse(script.textContent ?? "{}");
        const entries = data && typeof data === "object" && "@graph" in data && Array.isArray(data["@graph"])
          ? data["@graph"]
          : [data];
        return entries.some((entry) => entry && typeof entry === "object"
          && entry["@type"] === "Article"
          && entry.mainEntityOfPage?.["@id"] === articleUrl);
      } catch {
        return false;
      }
    });

    let dynamicSchema: HTMLScriptElement | undefined;
    if (!hasStaticSchema) {
      dynamicSchema = document.createElement("script");
      dynamicSchema.type = "application/ld+json";
      dynamicSchema.dataset.aerogoEuropeGuideSchema = "";
      dynamicSchema.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: guide.title,
        description: guide.seoDescription ?? guide.summary,
        image: getSocialImageUrl(guide.socialImageSrc),
        author: { "@type": "Organization", name: "AeroGo", url: `${SITE_ORIGIN}/` },
        publisher: { "@type": "Organization", name: "AeroGo", url: `${SITE_ORIGIN}/` },
        mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
        inLanguage: "en",
      });
      document.head.appendChild(dynamicSchema);
    }
    window.dispatchEvent(new Event("aerogo:metadata-ready"));
    return () => dynamicSchema?.remove();
  }, []);

  return <div className="public-site europe-ees-site editorial-foundation">
    <SiteHeader />
    <main className="europe-ees page-shell">
      <EditorialBreadcrumb items={[
        { label: "Discover", to: "/" },
        { label: "Guides", to: "/guides" },
        { label: "Europe" },
        { label: "EES vs. ETIAS" },
      ]} />
      <article className="europe-ees__article" data-seo-title={guide.seoTitle} data-seo-description={guide.seoDescription} data-seo-image={guide.socialImageSrc} data-seo-image-alt={guide.socialImageAlt ?? guide.imageAlt}>
        <header className="europe-ees__hero">
          <p className="europe-ees__eyebrow">EUROPE / BORDER GUIDE</p>
          <h1>Traveling to Europe? EES vs. ETIAS Explained for 2026</h1>
          <p className="europe-ees__standfirst">EES is already recording eligible short-stay visitors at participating borders. ETIAS is a separate future travel authorization, but its official application system is not open. Here is what the two systems mean for different travelers—and what to prepare now.</p>
          <p className="europe-ees__source-date"><strong>Official information checked:</strong> <time dateTime={guide.sourcesCheckedAt}>{formatDate(guide.sourcesCheckedAt)}</time></p>
        </header>

        <figure className="europe-ees__hero-image">
          <img src={guide.imageSrc} width="1200" height="750" alt={guide.imageAlt} fetchPriority="high" decoding="async" />
          <figcaption>An original AeroGo explainer illustration, not an official EU graphic or a photograph of an operating border checkpoint.</figcaption>
        </figure>

        <section className="europe-ees__answer" aria-labelledby="europe-ees-answer-title">
          <div><span>THE SHORT ANSWER</span><h2 id="europe-ees-answer-title">EES now. ETIAS later.</h2></div>
          <p><strong>EES has been fully operational since 10 April 2026</strong> at the external borders of 29 participating European countries. It records eligible non-EU short-stay travelers when they cross the border. <strong>ETIAS is not operating and applications are not being accepted</strong> as checked on 27 October 2026. Check your visa requirements now; do not pay a website claiming to submit an ETIAS application before the official EU system opens.</p>
        </section>

        <section className="europe-ees__section" aria-labelledby="europe-ees-compare-title">
          <div className="europe-ees__section-heading"><span>01 / TWO DIFFERENT SYSTEMS</span><h2 id="europe-ees-compare-title">At the border or before the trip?</h2><p>The names are easy to confuse, but the timing and purpose are different.</p></div>
          <div className="europe-ees__compare">
            <article className="europe-ees__system europe-ees__system--ees">
              <p className="europe-ees__system-kicker">ENTRY / EXIT SYSTEM</p><h3>EES</h3><p className="europe-ees__system-status">Operating since 10 April 2026</p>
              <dl><div><dt>When?</dt><dd>At a participating external border when an eligible traveler enters or leaves.</dd></div><div><dt>Who?</dt><dd>Generally, non-EU nationals on a short stay—whether they need a short-stay visa or are visa-exempt—subject to exemptions.</dd></div><div><dt>What happens?</dt><dd>Travel-document and entry/exit details are recorded, along with the biometric identifiers applicable to the traveler.</dd></div><div><dt>Apply in advance?</dt><dd>No EES application. The registration happens through border procedures.</dd></div></dl>
            </article>
            <article className="europe-ees__system europe-ees__system--etias">
              <p className="europe-ees__system-kicker">EUROPEAN TRAVEL INFORMATION AND AUTHORISATION SYSTEM</p><h3>ETIAS</h3><p className="europe-ees__system-status">Not open as checked 27 October 2026</p>
              <dl><div><dt>When?</dt><dd>Before travel, once the official system starts and the requirement applies.</dd></div><div><dt>Who?</dt><dd>Generally, visa-exempt non-EU nationals visiting one of the 30 participating countries for a short stay, with exceptions.</dd></div><div><dt>What is it?</dt><dd>A travel authorization linked to a passport. It is not a visa and does not guarantee admission.</dd></div><div><dt>Apply now?</dt><dd>No. The EU says applications are not being collected and the specific start date will be announced in advance.</dd></div></dl>
            </article>
          </div>
        </section>

        <section className="europe-ees__section" aria-labelledby="europe-ees-who-title">
          <div className="europe-ees__section-heading"><span>02 / WHO MAY BE AFFECTED</span><h2 id="europe-ees-who-title">Your passport and travel status matter</h2><p>These examples describe ordinary short visits. Nationality, destination, residence status, purpose and travel document can change the answer.</p></div>
          <div className="europe-ees__examples">
            <article><span>EU / EEA / SWISS NATIONALS</span><h3>Not the standard EES or ETIAS case</h3><p>These systems are designed around non-EU short-stay travelers. EU citizens and nationals of Iceland, Liechtenstein, Norway and Switzerland are not generally registered as third-country short-stay visitors. Use the passport or identity document appropriate to your trip.</p></article>
            <article><span>VISA-EXEMPT SHORT-STAY VISITORS</span><h3>EES now; ETIAS when it opens</h3><p>For example, United States, Canadian and Australian nationals are generally visa-exempt for short Schengen visits. UK nationals will generally need ETIAS once it is operational; beneficiaries of the Withdrawal Agreement are an exception. EES applies at participating borders now, while individual cases and other passport types can differ.</p></article>
            <article><span>VISA-REQUIRED SHORT-STAY VISITORS</span><h3>Get the visa; expect EES registration</h3><p>For Schengen short stays, Indian and Philippine nationals generally need a visa. EES also covers eligible travelers who hold a short-stay visa; their fingerprints were already collected in the visa process, so EES stores the facial image rather than collecting those fingerprints again. A valid visa means ETIAS is generally not required for that same trip.</p></article>
            <article><span>RESIDENCE / LONG-STAY STATUS</span><h3>Check the exact exemption</h3><p>Some people holding a qualifying residence permit or long-stay visa, and some family members with free-movement rights, are outside the ordinary EES or ETIAS rules. The document type and journey matter. Use the official exemption guidance or ask the relevant national authority before traveling.</p></article>
          </div>
          <p className="europe-ees__note">Visa rules here refer to short stays in the Schengen area. Cyprus and Ireland have different participation and national-entry arrangements; do not assume a Schengen visa or an EES/ETIAS status alone settles every route.</p>
        </section>

        <section className="europe-ees__section europe-ees__section--border" aria-labelledby="europe-ees-border-title">
          <div className="europe-ees__section-heading"><span>03 / WHAT TO EXPECT AT PASSPORT CONTROL</span><h2 id="europe-ees-border-title">EES is a border procedure, not an online form</h2><p>When the system applies to you, registration takes place as part of crossing a participating country’s external border.</p></div>
          <ol className="europe-ees__steps"><li><strong>Present your travel document.</strong><span>Border systems record the relevant personal and passport details, plus the time and place of entry or exit.</span></li><li><strong>Provide the biometric data required for your category.</strong><span>Visa-exempt travelers generally have a facial image and four fingerprints recorded. For short-stay visa holders, EES uses a facial image because fingerprints were collected for the visa. Fingerprints are not scanned from children under 12.</span></li><li><strong>Complete the border check.</strong><span>A self-service kiosk or app may be available at some locations, but it does not replace border control. An officer can still ask questions and decide whether entry conditions are met.</span></li><li><strong>On later crossings, verify your identity.</strong><span>Authorities can compare your face or fingerprints with the existing EES record. EES replaces passport stamping in participating countries; it does not remove the border check.</span></li></ol>
          <p className="europe-ees__note"><strong>Optional advance registration:</strong> Some countries offer limited pre-registration through the official <a href="https://travel-europe.europa.eu/ees/Travel-to-Europe-mobile-app.html" target="_blank" rel="noopener noreferrer">Travel to Europe mobile app</a>. Availability and features vary by country; the EU currently lists Sweden and Portugal. Eligible non-EU visitors can submit an app journey within 72 hours before entering or leaving. This is not an EES application and does not replace the border check. It is separate from ETIAS, which is not yet accepting applications.</p>
          <p className="europe-ees__note">A biometric passport is needed for certain self-service options, not generally as a condition of crossing the border. Check the official guidance for the border you will use.</p>
        </section>

        <section className="europe-ees__section" aria-labelledby="europe-ees-visa-title">
          <div className="europe-ees__section-heading"><span>04 / VISA RULES STILL APPLY</span><h2 id="europe-ees-visa-title">Neither system replaces a visa</h2></div>
          <div className="europe-ees__prose"><p><strong>EES is a digital record of eligible border crossings.</strong> It does not grant permission to travel or change the short-stay limit, which is generally 90 days in any 180-day period across the Schengen area.</p><p><strong>ETIAS will be a pre-travel authorization for visa-exempt visitors.</strong> It is not a Schengen visa, residence permit or guarantee that border officials will admit you. Travelers whose nationality requires a short-stay visa must continue to obtain the appropriate visa; an ETIAS application is not a substitute.</p><p>The European Commission’s visa policy page links to the current official nationality lists. Check the list for your passport and destination rather than relying on a general nationality example in an article.</p></div>
        </section>

        <section className="europe-ees__section europe-ees__timeline" aria-labelledby="europe-ees-date-title">
          <div className="europe-ees__section-heading"><span>05 / ETIAS TIMING</span><h2 id="europe-ees-date-title">Why do official pages mention different years?</h2><p>As of 27 October 2026, ETIAS applications are not open. Official pages describe different planning windows, but none of the sources below gives a confirmed operational date.</p></div>
          <ol><li><time dateTime="2026-04-28">28 April 2026</time><p>A European Commission explainer said ETIAS was scheduled for the last quarter of 2026 and said the exact date would be announced later. This is a target window, not proof the system has started.</p></li><li><time dateTime="2026-10-20">20 October 2026</time><p>A Polish government notice titled “Introduction of ETIAS in 2027” says launch is planned for 2027, with the operating date to be communicated later. It is newer national guidance, not a formally announced EU-wide effective date.</p></li><li><time dateTime="2026-10-27">27 October 2026 status check</time><p>The official EU ETIAS FAQ says the system is not in operation, applications are not being collected, and the EU will communicate a specific start date several months before launch. For travelers, this is the practical status to act on today.</p></li></ol>
          <p className="europe-ees__timeline-conclusion"><strong>There is no confirmed start date in the sources checked.</strong> Recheck the official EU FAQ before a later trip, especially if ETIAS begins operating after this guide’s source-check date.</p>
        </section>

        <section className="europe-ees__section" aria-labelledby="europe-ees-countries-title">
          <div className="europe-ees__section-heading"><span>06 / WHERE THE SYSTEMS APPLY</span><h2 id="europe-ees-countries-title">“Europe” does not mean every country</h2></div>
          <div className="europe-ees__prose"><p><strong>EES is used by 29 European countries in the Schengen area:</strong> 25 EU Member States plus Iceland, Liechtenstein, Norway and Switzerland. <strong>ETIAS is planned for 30 countries:</strong> those 29 plus Cyprus.</p><p><strong>Ireland is outside both systems.</strong> Cyprus is an EU member but is not currently part of EES; it is included among the future ETIAS countries. If your itinerary includes Ireland, Cyprus or other non-Schengen destinations, check that country’s own entry rules as well as the rules for your Schengen stops.</p><p>A connection through an airport can also have different visa or transit requirements from a visit. Check each country where you will cross a border, not just the first city on your itinerary.</p></div>
        </section>

        <section className="europe-ees__section europe-ees__checklist-section" aria-labelledby="europe-ees-checklist-title">
          <div className="europe-ees__section-heading"><span>07 / BEFORE YOUR TRIP</span><h2 id="europe-ees-checklist-title">A practical checklist for late 2026</h2></div>
          <ul className="europe-ees__checklist"><li><strong>Check your visa requirement by passport.</strong> Confirm the short-stay rules for every country on your route with the European Commission or its consulate.</li><li><strong>Check your travel document.</strong> Confirm validity, name details and any country-specific requirements with the carrier and destination authority.</li><li><strong>Expect an EES registration if it applies to your trip.</strong> Follow the border officer’s directions and allow enough flexibility for airport procedures; processing and queues vary by place and time.</li><li><strong>Do not apply or pay for ETIAS today.</strong> The official EU FAQ says it is not accepting applications as checked 27 October 2026. Recheck before departure if you travel later.</li><li><strong>Check residence, family-member or long-stay exemptions carefully.</strong> Use the official FAQ for your exact document status.</li><li><strong>Keep trip evidence accessible.</strong> Carry the documents that support your visit and be ready to answer routine questions about your stay, return or onward travel, as required by the entry rules.</li></ul>
        </section>

        <section className="europe-ees__sources" aria-labelledby="europe-ees-sources-title">
          <span>SOURCE NOTES / OFFICIAL REFERENCES</span><h2 id="europe-ees-sources-title">Check the latest rule before you go</h2><p>EU entry systems and national visa rules can change. These official references were checked on <time dateTime={guide.sourcesCheckedAt}>{formatDate(guide.sourcesCheckedAt)}</time>; confirm your personal requirements with the relevant authority before travel.</p>
          <ul>{sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer">{source.label} <ExternalLink size={13} aria-hidden="true" /></a><span>{source.date} · {source.note}</span></li>)}</ul>
          <p className="europe-ees__disclaimer">This guide summarizes general short-stay information. It is not an individual visa decision or legal advice; eligibility can depend on nationality, route, purpose and residence status.</p>
          <nav className="europe-ees__related" aria-label="Related AeroGo pages"><Link to="/guides">Browse all AeroGo travel guides <ArrowUpRight size={15} aria-hidden="true" /></Link></nav>
        </section>
      </article>
    </main>
    <EditorialFooter editorial />
  </div>;
}
