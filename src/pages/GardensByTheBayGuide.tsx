import { ArrowDown, ArrowUpRight, ExternalLink, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { EditorialBreadcrumb } from "../components/EditorialBreadcrumb";
import { EditorialFooter } from "../components/EditorialFooter";
import { SiteHeader } from "../components/SiteHeader";
import "./GardensByTheBayGuide.css";

const klookAffiliateUrl = "https://affiliate.klook.com/redirect?aid=138622&aff_adid=1492347&k_site=https%3A%2F%2Fwww.klook.com%2Fen-US%2Factivity%2F127-gardens-by-the-bay-singapore";

type GuidePhotoName = "S25" | "S4" | "S7" | "S2" | "S16" | "S14" | "S20" | "S31" | "S24";

function GuidePhoto({
  filename,
  alt,
  sizes,
  priority = false,
}: {
  filename: GuidePhotoName;
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  const base = "/images/gardens-by-the-bay/optimized/" + filename;

  return <picture>
    <source
      type="image/webp"
      srcSet={base + "-720.webp 720w, " + base + "-1440.webp 1440w"}
      sizes={sizes}
    />
    <img
      src={base + "-720.jpg"}
      srcSet={base + "-720.jpg 720w, " + base + "-1440.jpg 1440w"}
      sizes={sizes}
      width="1440"
      height="1800"
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
    />
  </picture>;
}

function OfficialLink({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children} <ExternalLink size={14} aria-hidden="true" /></a>;
}

export function GardensByTheBayGuide() {
  return <div className="public-site gardens-guide-site editorial-foundation">
    <SiteHeader />
    <main className="gardens-guide">
      <div className="page-shell"><EditorialBreadcrumb items={[{ label: "Discover", to: "/" }, { label: "Guides", to: "/guides" }, { label: "Singapore", to: "/destinations/singapore" }, { label: "Gardens by the Bay" }]} /></div>

      <article>
        <header className="gby-hero page-shell">
          <div className="gby-hero__copy">
            <span className="eyebrow"><span className="gby-eyebrow-mark" /> PRACTICAL GUIDE / SINGAPORE</span>
            <h1>Gardens by the Bay: <em>More than just the Supertrees</em></h1>
            <p className="gby-hero__lead">A practical guide to the cool conservatories, changing flower displays, open-air gardens and evening light show, with a clear view of what needs a ticket and what you can enjoy for free.</p>
            <div className="gby-hero__byline">
              <span>Visitor guide</span><span aria-hidden="true">·</span>
              <time dateTime="2026-10-11">Checked 11 October 2026</time>
            </div>
            <a className="gby-hero__jump" href="#visitor-snapshot">Jump to quick answers <ArrowDown size={15} aria-hidden="true" /></a>
          </div>
          <figure className="gby-hero__figure">
            <GuidePhoto
              filename="S25"
              alt="Elevated daytime view across Supertree Grove, the conservatory roofs and the gardens"
              sizes="(max-width: 760px) calc(100vw - 30px), (max-width: 1200px) 48vw, 590px"
              priority
            />
            <figcaption>Supertrees, conservatory roofs and garden paths meet in one wide view.</figcaption>
          </figure>
        </header>

        <section className="gby-snapshot page-shell" id="visitor-snapshot" aria-labelledby="gby-snapshot-title">
          <div className="gby-section-intro">
            <span className="eyebrow">BEFORE YOU GO</span>
            <h2 id="gby-snapshot-title">A quick visit plan</h2>
            <p>The Gardens combine large outdoor spaces with ticketed indoor and elevated attractions. Decide which paid experiences matter to you, then leave enough time to walk between them.</p>
          </div>
          <div className="gby-snapshot__grid">
            <article className="gby-snapshot-card gby-snapshot-card--answer">
              <span className="gby-snapshot-card__index">01</span>
              <h3>Free and ticketed</h3>
              <p>Outdoor garden areas are generally free to enter. Cloud Forest, Flower Dome, OCBC Skyway and Supertree Observatory are ticketed attractions; admission terms can vary by product or event.</p>
              <OfficialLink href="https://www.gardensbythebay.com.sg/en/attractions.html">Compare official attractions</OfficialLink>
            </article>
            <article className="gby-snapshot-card">
              <MapPin size={19} aria-hidden="true" />
              <h3>Where</h3>
              <address>Gardens by the Bay<br />18 Marina Gardens Drive<br />Singapore 018953</address>
              <a href="https://www.google.com/maps/search/?api=1&amp;query=Gardens%20by%20the%20Bay%2C%2018%20Marina%20Gardens%20Drive%2C%20Singapore%20018953" target="_blank" rel="noopener noreferrer">Open directions in Google Maps <ExternalLink size={13} aria-hidden="true" /></a>
            </article>
            <article className="gby-snapshot-card">
              <span className="gby-snapshot-card__index">02</span>
              <h3>How much time</h3>
              <p>As a planning estimate, keep half a day for both conservatories, a relaxed walk outdoors and breaks. Add more time if you want to stay for the evening show or explore extra attractions.</p>
              <OfficialLink href="https://www.gardensbythebay.com.sg/en/plan-your-visit/opening-hours.html">Check hours and closures</OfficialLink>
            </article>
          </div>
        </section>

        <section className="gby-booking gby-booking--inline page-shell" aria-labelledby="gby-booking-inline-title">
          <div>
            <span className="eyebrow">TICKETED ATTRACTIONS</span>
            <h2 id="gby-booking-inline-title">Planning to visit the conservatories?</h2>
            <p>Compare available Gardens by the Bay ticket options on Klook. Check the selected attractions, admission terms, visit date and current price before checkout.</p>
            <p className="gby-affiliate-disclosure">Some links on this page are affiliate links. AeroGo may earn a commission if you book through them, at no additional cost to you.</p>
          </div>
          <a className="button button--dark gby-booking__button" href={klookAffiliateUrl} target="_blank" rel="sponsored noopener noreferrer">View Gardens by the Bay tickets on Klook <ArrowUpRight size={16} aria-hidden="true" /></a>
        </section>

        <section className="gby-feature-section page-shell" id="cloud-forest" aria-labelledby="gby-cloud-title">
          <div className="gby-feature-section__copy">
            <span className="eyebrow">01 · STEP INTO A COOLER WORLD</span>
            <h2 id="gby-cloud-title">Cloud Forest: waterfall, mountain and mist</h2>
            <p>Cloud Forest is an indoor cooled conservatory built around a planted mountain and a large indoor waterfall. Elevated walkways let visitors look across the greenery from different levels, so allow time to pause rather than rushing straight through.</p>
            <p>It is a useful change of pace from Singapore’s outdoor heat. The conservatory is ticketed and can have maintenance closures; check the official visitor information for the date you plan to go. Any special exhibition inside may also change.</p>
            <p className="gby-note">A comfortable visit here is part of the ticketed attraction, not the free outdoor garden areas.</p>
            <OfficialLink href="https://www.gardensbythebay.com.sg/en/things-to-do/attractions/cloud-forest.html">Cloud Forest visitor information</OfficialLink>
          </div>
          <div className="gby-feature-section__visual">
            <figure>
              <GuidePhoto
                filename="S4"
                alt="The indoor waterfall descending beside the planted mountain inside Cloud Forest"
                sizes="(max-width: 760px) calc(100vw - 30px), 46vw"
              />
              <figcaption>Cloud Forest’s indoor waterfall and planted mountain.</figcaption>
            </figure>
            <figure className="gby-feature-section__detail">
              <GuidePhoto
                filename="S7"
                alt="A shaded walkway framed by dense greenery and a living wall"
                sizes="(max-width: 760px) calc(100vw - 30px), 28vw"
              />
              <figcaption>A foliage-lined walkway inside the Gardens.</figcaption>
            </figure>
          </div>
        </section>

        <section className="gby-glass-section" aria-labelledby="gby-glass-title">
          <div className="gby-glass-section__inner page-shell">
            <figure>
              <GuidePhoto
                filename="S2"
                alt="Curving steel ribs and glass panels above gardens and water"
                sizes="(max-width: 760px) calc(100vw - 30px), 41vw"
              />
              <figcaption>Glass, greenery and daylight in one of the Gardens’ indoor spaces.</figcaption>
            </figure>
            <div>
              <span className="eyebrow">A CHANGE OF PACE</span>
              <h2 id="gby-glass-title">Two conservatories, two different moods</h2>
              <p>Cloud Forest leans into a dramatic mountain landscape; Flower Dome focuses on plants from cooler and drier regions, with seasonal displays that change over time. Both are ticketed. Check what is on view and whether your ticket includes both before choosing.</p>
              <OfficialLink href="https://www.gardensbythebay.com.sg/en/things-to-do/attractions.html">See the current attraction list</OfficialLink>
            </div>
          </div>
        </section>

        <section className="gby-floral-section page-shell" id="flower-dome" aria-labelledby="gby-floral-title">
          <div className="gby-section-intro gby-section-intro--wide">
            <span className="eyebrow">02 · FLOWER DOME AND SEASONAL DISPLAYS</span>
            <h2 id="gby-floral-title">A garden that keeps changing</h2>
            <p>Flower Dome is a cooled conservatory with plant collections from regions such as the Mediterranean and seasonal floral displays. The arrangement changes with its programme, so treat any particular flowers or theme as date-specific and check what is on before your visit.</p>
            <p className="gby-note">The photos below show flower scenes at Gardens by the Bay, but their exact conservatory locations are not confirmed. Use them as a glimpse of the garden’s variety, not a promise that a particular display is still there.</p>
            <OfficialLink href="https://www.gardensbythebay.com.sg/en/things-to-do/attractions/flower-dome.html">Flower Dome visitor information</OfficialLink>
          </div>
          <div className="gby-floral-gallery">
            <figure>
              <GuidePhoto
                filename="S16"
                alt="Colorful flowerbeds surrounding a small cottage-style garden display beneath glass"
                sizes="(max-width: 700px) calc(100vw - 30px), 45vw"
              />
              <figcaption>Layered flowerbeds with a cottage-style garden display.</figcaption>
            </figure>
            <figure>
              <GuidePhoto
                filename="S14"
                alt="Mixed flowering plants and broad leaves in a glass-roofed garden"
                sizes="(max-width: 700px) calc(100vw - 30px), 45vw"
              />
              <figcaption>Color and texture among the indoor plantings.</figcaption>
            </figure>
          </div>
        </section>

        <section className="gby-supertree-section" id="supertrees" aria-labelledby="gby-supertree-title">
          <div className="page-shell">
            <div className="gby-section-intro gby-section-intro--wide">
              <span className="eyebrow">03 · OUTDOORS, THEN AFTER DARK</span>
              <h2 id="gby-supertree-title">Supertree Grove by day and night</h2>
              <p>The Supertrees are visible throughout the outdoor garden. The grove is a good reason to slow down between indoor visits, then return after dusk if you want to see the evening lights. General garden access is free; the OCBC Skyway and Supertree Observatory are separate paid attractions.</p>
            </div>
            <div className="gby-day-gallery">
              <figure>
                <GuidePhoto
                  filename="S20"
                  alt="Looking up at a planted Supertree against a bright blue sky"
                  sizes="(max-width: 700px) calc(100vw - 30px), 45vw"
                />
                <figcaption>Supertree Grove in daylight, seen from below.</figcaption>
              </figure>
              <figure>
                <GuidePhoto
                  filename="S31"
                  alt="Several Supertrees rising above garden paths in daylight"
                  sizes="(max-width: 700px) calc(100vw - 30px), 45vw"
                />
                <figcaption>A wider daytime view across the grove.</figcaption>
              </figure>
            </div>
            <div className="gby-rhapsody">
              <figure>
                <GuidePhoto
                  filename="S24"
                  alt="A Supertree illuminated in blue and violet light after dark"
                  sizes="(max-width: 760px) calc(100vw - 30px), 40vw"
                />
                <figcaption>Supertree Grove illuminated after dark.</figcaption>
              </figure>
              <div className="gby-rhapsody__copy">
                <span className="eyebrow">GARDEN RHAPSODY</span>
                <h3>A free evening show in the grove</h3>
                <p>The light-and-music show is called Garden Rhapsody. The Gardens’ current schedule lists daily showings at 7:45 pm and 8:45 pm, with free general admission. Special events or programme changes can affect the usual arrangement, so check the official schedule on your visit day.</p>
                <p>The show is viewed from the outdoor grove. Walking on the OCBC Skyway or going up to the Supertree Observatory is optional and separately ticketed.</p>
                <OfficialLink href="https://www.gardensbythebay.com.sg/en/things-to-do/calendar-of-events/garden-rhapsody.html">Check the Garden Rhapsody schedule</OfficialLink>
              </div>
            </div>
          </div>
        </section>

        <section className="gby-planning page-shell" id="planning" aria-labelledby="gby-planning-title">
          <div className="gby-section-intro">
            <span className="eyebrow">MAKE THE DAY WORK FOR YOU</span>
            <h2 id="gby-planning-title">A simple way to plan the visit</h2>
            <p>There is no single best order. This loose sequence helps balance indoor time, walking and an optional evening show.</p>
          </div>
          <ol className="gby-visit-order">
            <li><span>01</span><div><h3>Choose your indoor stops</h3><p>Start with Cloud Forest and Flower Dome if both are priorities. Check maintenance notices, opening hours, current displays and ticket inclusions before you leave.</p></div></li>
            <li><span>02</span><div><h3>Leave a gap for the outdoor gardens</h3><p>Singapore can feel hot and humid, with sudden rain. Carry water and sun or rain protection, wear comfortable walking shoes and plan shaded or indoor breaks.</p></div></li>
            <li><span>03</span><div><h3>Stay for the grove only if it suits your day</h3><p>If you want to see Garden Rhapsody, check its schedule and allow time to move to the grove. The evening show is optional; you do not need a Skyway ticket to watch from the garden.</p></div></li>
          </ol>
          <aside className="gby-transit-note" id="getting-there">
            <div><span className="eyebrow">GETTING THERE</span><h3>Use the official route guide for your arrival</h3></div>
            <div>
              <p>The Gardens’ current directions page lists Bayfront MRT and Gardens by the Bay MRT as rail options, with station exits and walking routes. Check the page before travelling for the latest access guidance.</p>
              <OfficialLink href="https://www.gardensbythebay.com.sg/en/plan-your-visit/getting-here.html">Official directions and transport options</OfficialLink>
            </div>
          </aside>
        </section>

        <section className="gby-booking gby-booking--closing page-shell" aria-labelledby="gby-booking-closing-title">
          <div>
            <span className="eyebrow eyebrow--light">WHEN YOUR PLAN IS CLEAR</span>
            <h2 id="gby-booking-closing-title">Compare ticket options for your visit</h2>
            <p>Check which conservatories or other attractions are included, the selected date and the current admission terms before you book. For operating details and closure notices, use Gardens by the Bay’s official visitor information too.</p>
            <a className="gby-booking__official" href="https://www.gardensbythebay.com.sg/en/plan-your-visit/opening-hours.html" target="_blank" rel="noopener noreferrer">Official hours and closures <ExternalLink size={14} aria-hidden="true" /></a>
          </div>
          <a className="button button--light gby-booking__button" href={klookAffiliateUrl} target="_blank" rel="sponsored noopener noreferrer">View Gardens by the Bay tickets on Klook <ArrowUpRight size={16} aria-hidden="true" /></a>
        </section>

        <section className="gby-sources page-shell" aria-labelledby="gby-sources-title">
          <span className="eyebrow">KEEP THESE LINKS HANDY</span>
          <h2 id="gby-sources-title">Official information</h2>
          <p>Opening hours, closures, programmes and ticket inclusions can change. Confirm the details for your visit date with Gardens by the Bay.</p>
          <ul>
            <li><OfficialLink href="https://www.gardensbythebay.com.sg/en/attractions.html">Attractions, admission and outdoor gardens</OfficialLink></li>
            <li><OfficialLink href="https://www.gardensbythebay.com.sg/en/things-to-do/attractions/cloud-forest.html">Cloud Forest</OfficialLink></li>
            <li><OfficialLink href="https://www.gardensbythebay.com.sg/en/things-to-do/attractions/flower-dome.html">Flower Dome</OfficialLink></li>
            <li><OfficialLink href="https://www.gardensbythebay.com.sg/en/things-to-do/calendar-of-events/garden-rhapsody.html">Garden Rhapsody</OfficialLink></li>
            <li><OfficialLink href="https://www.gardensbythebay.com.sg/en/plan-your-visit/getting-here.html">Getting here and transport</OfficialLink></li>
            <li><OfficialLink href="https://www.gardensbythebay.com.sg/en/frequently-asked-questions/general.html">Ticketing and visitor FAQs</OfficialLink></li>
          </ul>
          <time className="gby-sources__checked" dateTime="2026-10-11">Information checked 11 October 2026</time>
        </section>
        <aside className="gby-related page-shell" aria-label="Related destination">
          <div><span className="eyebrow">MORE TO DISCOVER</span><h2>Explore Singapore</h2><p>Find more ideas for neighborhoods, gardens and waterfront walks.</p></div>
          <Link to="/destinations/singapore">See Singapore inspiration <ArrowUpRight size={17} aria-hidden="true" /></Link>
        </aside>
      </article>
    </main>
    <EditorialFooter editorial />
  </div>;
}
