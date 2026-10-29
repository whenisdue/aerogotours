import { useEffect, type ReactNode } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { EditorialBreadcrumb } from "../components/EditorialBreadcrumb";
import { EditorialFooter } from "../components/EditorialFooter";
import { SiteHeader } from "../components/SiteHeader";
import { travelGuides } from "../data/travelGuides";
import { SITE_ORIGIN } from "../utils/siteMetadata";
import "./MexicoDayOfTheDeadGuide.css";

const guideEntry = travelGuides.find((item) => item.path === "/guides/mexico/mexico-city-day-of-the-dead-2026");
if (!guideEntry?.sourcesCheckedAt || !guideEntry.imageSrc || !guideEntry.imageCredit) {
  throw new Error("Mexico City Day of the Dead guide metadata is incomplete");
}
const guide = { ...guideEntry, sourcesCheckedAt: guideEntry.sourcesCheckedAt, imageSrc: guideEntry.imageSrc, imageCredit: guideEntry.imageCredit };

const tourismProgram = "https://mexicocity.cdmx.gob.mx/e/dia-de-muertos-en-la-ciudad-de-mexico/?lang=en";
const cityAnnouncement = "https://jefadegobierno.cdmx.gob.mx/clara-brugada-anuncia-ofrenda-catrina-monumental-desfile-de-muertos-y-paseo-luminoso-en-reforma-la-produccion-de-cempasuchil-rompe-record/";
const visitMexico2025 = "https://visitmexico.com/es/actividad/28/desfile-de-dia-de-muertos-2025-en-cdmx";
const inpiOfrenda = "https://www.gob.mx/inpi/articulos/conoces-el-significado-de-los-elementos-de-una-ofrenda-de-dia-de-muertos?trk=public_post-text";
const metroCommunications = "https://metro.cdmx.gob.mx/comunicacion/";
const metrobusCommunications = "https://www.metrobus.cdmx.gob.mx/comunicacion";
const metrobusServiceStatus = "https://metrobus.cdmx.gob.mx/ServicioMB?_amp=true";
const semoviCommunications = "https://www.semovi.cdmx.gob.mx/comunicacion";

const dateLabel = (date: string) => new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
}).format(new Date(`${date}T00:00:00Z`));

function SourceLink({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children} <ExternalLink size={14} aria-hidden="true" /></a>;
}

export function MexicoDayOfTheDeadGuide() {
  useEffect(() => {
    const articleUrl = new URL(guide.path, SITE_ORIGIN).href;
    const hasStaticArticleSchema = Array.from(document.head.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]')).some((script) => {
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
    if (!hasStaticArticleSchema) {
      dynamicSchema = document.head.querySelector<HTMLScriptElement>("script[data-aerogo-mexico-guide-schema]")
        ?? document.head.appendChild(document.createElement("script"));
      dynamicSchema.type = "application/ld+json";
      dynamicSchema.dataset.aerogoMexicoGuideSchema = "";
      dynamicSchema.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: guide.title,
        description: guide.seoDescription ?? guide.summary,
        ...(guide.publishedAt ? { datePublished: guide.publishedAt } : {}),
        image: {
          "@type": "ImageObject",
          contentUrl: new URL(guide.imageSrc, SITE_ORIGIN).href,
          creditText: `Photo by ${guide.imageCredit.author}, Wikimedia Commons, ${guide.imageCredit.license}`,
          license: guide.imageCredit.licenseUrl,
        },
        author: { "@type": "Organization", name: "AeroGo", url: `${SITE_ORIGIN}/` },
        publisher: { "@type": "Organization", name: "AeroGo", url: `${SITE_ORIGIN}/` },
        mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
        inLanguage: "en",
      });
    }
    window.dispatchEvent(new Event("aerogo:metadata-ready"));
    return () => dynamicSchema?.remove();
  }, []);

  return <div className="public-site mexico-day-of-the-dead-site editorial-foundation">
    <SiteHeader />
    <main className="mexico-day-of-the-dead page-shell">
      <EditorialBreadcrumb items={[
        { label: "Discover", to: "/" },
        { label: "Guides", to: "/guides" },
        { label: "Mexico City" },
      ]} />
      <article
        className="mexico-day-of-the-dead__article"
        data-seo-title={guide.seoTitle}
        data-seo-description={guide.seoDescription}
        data-seo-image={guide.imageSrc}
        data-seo-image-alt={guide.socialImageAlt ?? guide.imageAlt}
        data-seo-published={guide.publishedAt}
      >
        <header className="mexico-day-of-the-dead__hero">
          <p className="mexico-day-of-the-dead__eyebrow">MEXICO CITY / CULTURAL VISITOR GUIDE</p>
          <h1>Mexico City Day of the Dead 2026: Parade, Ofrendas and What to Know</h1>
          <p className="mexico-day-of-the-dead__standfirst">Mexico City’s main Día de Muertos parade is scheduled for Saturday, 31 October, at 2 p.m. local time. Current city sources list its route from the Diana Cazadora roundabout along Paseo de la Reforma to the Zócalo, where a monumental ofrenda is scheduled for 29 October–2 November. Check for final transport and access notices before setting out.</p>
          <dl className="mexico-day-of-the-dead__dateline">
            {guide.publishedAt && <div><dt>Published</dt><dd><time dateTime={guide.publishedAt}>{dateLabel(guide.publishedAt)}</time></dd></div>}
            <div><dt>Sources checked</dt><dd><time dateTime={guide.sourcesCheckedAt}>{dateLabel(guide.sourcesCheckedAt)}</time></dd></div>
            <div><dt>Event status</dt><dd>Scheduled announcements, not on-site observations</dd></div>
          </dl>
        </header>

        <figure className="mexico-day-of-the-dead__hero-image">
          <img src={guide.imageSrc} width="1280" height="854" alt={guide.imageAlt} fetchPriority="high" decoding="async" />
          <figcaption>{guide.imageCredit.note} Photo by <a href={guide.imageCredit.authorUrl} target="_blank" rel="noopener noreferrer">{guide.imageCredit.author}</a> via <a href={guide.imageCredit.sourceUrl} target="_blank" rel="noopener noreferrer">{guide.imageCredit.sourceName}</a>, licensed under <a href={guide.imageCredit.licenseUrl} target="_blank" rel="noopener noreferrer">{guide.imageCredit.license}</a>. This archival image is not evidence of 2026 conditions.</figcaption>
        </figure>

        <section className="mexico-day-of-the-dead__answer" aria-labelledby="mexico-day-answer-title">
          <div><span>THE SHORT ANSWER</span><h2 id="mexico-day-answer-title">Three dates to plan around</h2></div>
          <ul>
            <li><strong>31 October, 2 p.m.:</strong> the city-listed parade is scheduled to travel from Diana Cazadora to the Zócalo.</li>
            <li><strong>29 October–2 November:</strong> the monumental ofrenda is scheduled for the Zócalo.</li>
            <li><strong>29 October–4 November:</strong> the city lists a Day of the Dead festival in Chapultepec’s Second Section; exact hours and individual access details were not posted in the listing checked.</li>
          </ul>
        </section>

        <section className="mexico-day-of-the-dead__section" aria-labelledby="mexico-day-meaning-title">
          <div className="mexico-day-of-the-dead__section-heading"><span>01 / THE TRADITION</span><h2 id="mexico-day-meaning-title">A celebration of remembrance</h2></div>
          <div className="mexico-day-of-the-dead__prose">
            <p>Día de Muertos is a tradition of remembering loved ones who have died. In many homes and communities, people prepare an <em>ofrenda</em>—an offering or altar—with photographs, candles, food, flowers and other items chosen in memory of a person. Cempasúchil, the vivid orange marigold, is often used in offerings and flower paths.</p>
            <p>There is no single uniform way to observe the holiday: practices differ among families, neighborhoods and Indigenous communities. The city parade and public installations are only one part of a much wider tradition. The National Institute of Indigenous Peoples describes the ofrenda as a way to honor and remember the dead, with elements and meanings that vary by community.</p>
          </div>
        </section>

        <section className="mexico-day-of-the-dead__section" aria-labelledby="mexico-day-dates-title">
          <div className="mexico-day-of-the-dead__section-heading"><span>02 / DATES &amp; PLACES</span><h2 id="mexico-day-dates-title">What the city has announced</h2><p>These are scheduled events in the official city listing checked on 29 October. Event setup, access and conditions may change; the display dates do not mean an installation is already open.</p></div>
          <div className="mexico-day-of-the-dead__event-list">
            <article className="mexico-day-of-the-dead__event mexico-day-of-the-dead__event--highlight">
              <div className="mexico-day-of-the-dead__event-date"><span>31 OCT</span><small>Saturday · 2 p.m.</small></div>
              <div><h3>Great Day of the Dead Parade</h3><p>Scheduled to start at Glorieta de la Diana Cazadora, follow Paseo de la Reforma and finish at the Zócalo. The city government’s 22 October announcement describes more than 4,000 participants, 12 floats and two large balloons as planned parade elements.</p><p className="mexico-day-of-the-dead__event-note">The official listing reviewed does not mention advance tickets or registration. It also does not yet specify accessible viewing areas or final crowd-access arrangements.</p></div>
            </article>
            <article className="mexico-day-of-the-dead__event">
              <div className="mexico-day-of-the-dead__event-date"><span>29 OCT–2 NOV</span><small>Zócalo</small></div>
              <div><h3>Monumental ofrenda</h3><p>The city lists a public installation in the main square honoring José Guadalupe Posada’s Catrina. The government announcement says the planned display includes a 32-metre figure, 100,000 cempasúchil plants, artist-decorated axolotl sculptures and themed lighting.</p><p className="mexico-day-of-the-dead__event-note">The city describes its broader cultural programme as free, but the visitor listing checked does not give daily opening hours or final entry procedures for this installation. Confirm current access information before travelling.</p></div>
            </article>
            <article className="mexico-day-of-the-dead__event">
              <div className="mexico-day-of-the-dead__event-date"><span>29 OCT–4 NOV</span><small>Chapultepec · Second Section</small></div>
              <div><h3>“The Door Between Two Worlds”</h3><p>The city’s listing places this festival at Paseo de los Compositores and Lago Mayor in the Second Section of Bosque de Chapultepec. It describes art, music, dance, food, altars and a nighttime drone show under the theme “The Cempasúchil Trail.”</p><p className="mexico-day-of-the-dead__event-note">No exact opening hours, ticket or reservation requirement, or individual activity schedule was provided in the listing checked. Do not assume every activity is free; check the city and park notices for final details.</p></div>
            </article>
          </div>
        </section>

        <section className="mexico-day-of-the-dead__section" aria-labelledby="mexico-day-route-title">
          <div className="mexico-day-of-the-dead__section-heading"><span>03 / THE 31 OCTOBER PARADE</span><h2 id="mexico-day-route-title">The announced route—and what could still change</h2></div>
          <div className="mexico-day-of-the-dead__route-line" aria-label="Announced parade route: Diana Cazadora, Paseo de la Reforma, Zócalo"><span>Diana Cazadora</span><i aria-hidden="true" /><span>Paseo de la Reforma</span><i aria-hidden="true" /><span>Zócalo</span></div>
          <div className="mexico-day-of-the-dead__prose">
            <p>Two current Mexico City sources—the city tourism programme and the government’s announcement published 22 October—name Diana Cazadora as the parade’s starting point and the Zócalo as its destination. The Visit Mexico page sometimes cited for a different start is specifically for the <strong>2025</strong> parade, when it described Puerta de los Leones; it is not an operational route notice for 2026.</p>
            <p>The route is therefore confirmed in the city’s current programme as of this source check, but day-of traffic controls, viewing access and transit changes can still be announced or adjusted. No 2026 parade-specific street closure or Metro/Metrobús service plan was available in the official mobility notices checked on 29 October. Do not rely on last year’s closures or station changes as this year’s plan.</p>
            <p>The city event listing does not publish a street-by-street route map, accessible viewing plan or queue guidance. Follow official city, mobility and transport channels for the latest operational information, and leave flexibility around central Reforma and the Historic Center.</p>
          </div>
          <div className="mexico-day-of-the-dead__transport-links" aria-label="Official transport and event updates">
            <SourceLink href={semoviCommunications}>Mexico City Mobility Secretariat (SEMOVI) notices</SourceLink>
            <SourceLink href={metroCommunications}>Mexico City Metro notices</SourceLink>
            <SourceLink href={metrobusCommunications}>Metrobús announcements</SourceLink>
            <SourceLink href={metrobusServiceStatus}>Metrobús live service status</SourceLink>
            <SourceLink href={tourismProgram}>Mexico City event programme</SourceLink>
          </div>
        </section>

        <section className="mexico-day-of-the-dead__section" aria-labelledby="mexico-day-etiquette-title">
          <div className="mexico-day-of-the-dead__section-heading"><span>04 / BE A CONSIDERATE VISITOR</span><h2 id="mexico-day-etiquette-title">Enjoy public displays; respect private remembrance</h2></div>
          <div className="mexico-day-of-the-dead__prose">
            <p>Public installations and a city parade are designed for shared viewing. Family ofrendas at home, in a neighborhood or at a cemetery can be personal and sacred. Before taking a close-up photograph of a person, family altar or community observance, ask permission. Do not touch offerings or flowers, block a procession for a photo, or step onto graves. Follow local stewards and any posted instructions.</p>
            <p>If you visit a neighborhood celebration or cemetery, go only where visitors are welcomed and access is permitted. A respectful quiet presence matters more than getting a picture.</p>
          </div>
        </section>

        <section className="mexico-day-of-the-dead__section" aria-labelledby="mexico-day-checklist-title">
          <div className="mexico-day-of-the-dead__section-heading"><span>05 / BEFORE YOU GO</span><h2 id="mexico-day-checklist-title">A practical last-minute checklist</h2></div>
          <ol className="mexico-day-of-the-dead__checklist">
            <li>Recheck the city programme and transport notices on the day you travel; event and service arrangements can change.</li>
            <li>For the parade, use the city-announced 2 p.m. start and Diana Cazadora–Reforma–Zócalo route as your planning reference, then verify day-of access guidance.</li>
            <li>For the Zócalo ofrenda and Chapultepec festival, confirm opening hours, entry arrangements and activity schedules; these details were not in the official listing checked on 29 October.</li>
            <li>Plan a flexible route to and from the central area. Do not assume a particular Metro station, bus stop or street will remain open during an event.</li>
            <li>Ask before photographing people or private offerings, and follow local instructions around community and cemetery observances.</li>
          </ol>
        </section>

        <section className="mexico-day-of-the-dead__sources" aria-labelledby="mexico-day-sources-title">
          <span>ORIGINAL SOURCES</span><h2 id="mexico-day-sources-title">Official programme and cultural context</h2>
          <p>Event schedules and access details checked on <time dateTime={guide.sourcesCheckedAt}>{dateLabel(guide.sourcesCheckedAt)}</time>. Announced events are not observations of completed installations or live operating conditions.</p>
          <ul>
            <li><SourceLink href={tourismProgram}>Mexico City Tourism — Day of the Dead 2026 programme, including event dates, venues and the current listed parade route; checked 29 October 2026</SourceLink></li>
            <li><SourceLink href={cityAnnouncement}>Mexico City Government — programme announcement published 22 October 2026; rechecked 29 October; parade and installation details are planned information</SourceLink></li>
            <li><SourceLink href={inpiOfrenda}>National Institute of Indigenous Peoples (INPI) — meaning and elements of an ofrenda, published 23 October 2019</SourceLink></li>
            <li><SourceLink href={visitMexico2025}>Visit Mexico — 2025 parade listing; cited here to identify why the older Puerta de los Leones route does not establish the 2026 start</SourceLink></li>
            <li><SourceLink href={semoviCommunications}>SEMOVI — official mobility notices; searched for parade-specific updates on 29 October 2026</SourceLink></li>
            <li><SourceLink href={metroCommunications}>Mexico City Metro — official service announcements; searched for parade-specific updates on 29 October 2026</SourceLink></li>
            <li><SourceLink href={metrobusCommunications}>Metrobús — official announcements; searched for parade-specific updates on 29 October 2026</SourceLink></li>
          </ul>
          <p className="mexico-day-of-the-dead__source-note">This is an independent AeroGo visitor guide, not an official government publication. It records the city programme for the 2026 edition; it is not a live event report or a schedule for future years. The route and schedule reflect information available at the source-check time, so verify access, transport and operating details with the city and event operators.</p>
        </section>
        <nav className="mexico-day-of-the-dead__related" aria-label="Explore more AeroGo travel guides">
          <Link to="/guides">All travel guides <ArrowUpRight size={18} aria-hidden="true" /></Link>
          <Link to="/">Discover more with AeroGo <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </nav>
      </article>
    </main>
    <EditorialFooter editorial />
  </div>;
}
