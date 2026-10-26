import { useEffect } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { EditorialBreadcrumb } from "../components/EditorialBreadcrumb";
import { EditorialFooter } from "../components/EditorialFooter";
import { SiteHeader } from "../components/SiteHeader";
import { travelGuides } from "../data/travelGuides";
import { japanAutumnForecastCheckedAt, jmcCityForecasts, jmcForecastPublishedAt, jwaLocationForecasts, jwaSecondForecastPublishedAt } from "../data/japanAutumnForecast";
import { SITE_ORIGIN } from "../utils/siteMetadata";
import "./JapanAutumnGuide.css";

const guideEntry = travelGuides.find((item) => item.path === "/guides/japan/autumn-leaves-2026");
if (!guideEntry) throw new Error("Japan autumn guide metadata is missing");
const guidePublishedAt = guideEntry.publishedAt;
const guideImageSrc = guideEntry.imageSrc;
const guideImageCredit = guideEntry.imageCredit;
if (!guidePublishedAt || !guideImageSrc || !guideImageCredit) throw new Error("Japan autumn guide metadata is incomplete");
const guide = { ...guideEntry, publishedAt: guidePublishedAt, imageSrc: guideImageSrc, imageCredit: guideImageCredit };

const dateLabel = (date: string) => new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
}).format(new Date(`${date}T00:00:00Z`));

const jmcSource = "https://n-kishou.com/corp/news-contents/autumn/?lang=en";
const jwaSource = "https://tenki.jp/kouyou/expectation.html";
const jwaReleaseSource = "https://weather-jwa.jp/en/news/announcements/post16208";
const jntoSource = "https://www.japan.travel/en/see-and-do/autumn-leaves-forecast/";
const odashiroSource = "https://www.nikkoyumoto-vc.com/nature/kouyou_odashiro.html";
const yunokoSource = "https://www.nikkoyumoto-vc.com/nature/kouyou_yunoko.html";
const weathernewsSource = "https://weathernews.jp/news/202610/220161/";

export function JapanAutumnGuide() {
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
      dynamicSchema = document.head.querySelector<HTMLScriptElement>("script[data-aerogo-guide-schema]")
        ?? document.head.appendChild(document.createElement("script"));
      dynamicSchema.type = "application/ld+json";
      dynamicSchema.dataset.aerogoGuideSchema = "";
      dynamicSchema.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: guide.title,
        description: guide.seoDescription ?? guide.summary,
        image: new URL(guide.imageSrc, SITE_ORIGIN).href,
        datePublished: guide.publishedAt,
        author: { "@type": "Organization", name: "AeroGo", url: `${SITE_ORIGIN}/` },
        publisher: { "@type": "Organization", name: "AeroGo", url: `${SITE_ORIGIN}/` },
        mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
        inLanguage: "en",
      });
    }
    window.dispatchEvent(new Event("aerogo:metadata-ready"));
    return () => dynamicSchema?.remove();
  }, []);

  return <div className="public-site japan-autumn-site editorial-foundation">
    <SiteHeader />
    <main className="japan-autumn page-shell">
      <EditorialBreadcrumb items={[
        { label: "Discover", to: "/" },
        { label: "Guides", to: "/guides" },
        { label: "Japan", to: "/destinations/japan" },
        { label: "Autumn leaves 2026" },
      ]} />
      <article
        className="japan-autumn__article"
        data-seo-title={guide.seoTitle}
        data-seo-description={guide.seoDescription}
        data-seo-image={guide.imageSrc}
        data-seo-image-alt={guide.socialImageAlt ?? guide.imageAlt}
        data-seo-published={guide.publishedAt}
      >
        <header className="japan-autumn__hero">
          <p className="japan-autumn__eyebrow">JAPAN / SEASONAL GUIDE</p>
          <h1>Japan Autumn Leaves 2026: When to See Fall Colors by City</h1>
          <p className="japan-autumn__standfirst">Planning Japan between late October and December? Start with the city and your exact dates, then check the individual garden, mountain or temple before you go. The latest Japan Meteorological Corporation city forecast dates for red maples and yellow ginkgo are different—and neither promises every local attraction will be at peak color.</p>
          <dl className="japan-autumn__dateline">
            <div><dt>Published</dt><dd><time dateTime={guide.publishedAt}>{dateLabel(guide.publishedAt)}</time></dd></div>
            <div><dt>Latest city forecast</dt><dd>JMC · <time dateTime={jmcForecastPublishedAt}>{dateLabel(jmcForecastPublishedAt)}</time></dd></div>
            <div><dt>Sources checked</dt><dd><time dateTime={japanAutumnForecastCheckedAt}>{dateLabel(japanAutumnForecastCheckedAt)}</time></dd></div>
          </dl>
        </header>

        <figure className="japan-autumn__hero-image">
          <img src={guide.imageSrc} width="1280" height="788" alt={guide.imageAlt} fetchPriority="high" decoding="async" />
          <figcaption>{guide.imageCredit.note} Photo by <a href={guide.imageCredit.authorUrl} target="_blank" rel="noopener noreferrer">{guide.imageCredit.author}</a> via <a href={guide.imageCredit.sourceUrl} target="_blank" rel="noopener noreferrer">{guide.imageCredit.sourceName}</a>, licensed under <a href={guide.imageCredit.licenseUrl} target="_blank" rel="noopener noreferrer">{guide.imageCredit.license}</a>. The image is an archive photograph, not evidence of 2026 conditions.</figcaption>
        </figure>

        <section className="japan-autumn__answer" aria-labelledby="japan-autumn-answer-title">
          <div><span>THE SHORT ANSWER</span><h2 id="japan-autumn-answer-title">There is no single nationwide peak</h2></div>
          <p>Color usually arrives first in cooler northern areas and at higher elevations, then reaches many lowland cities later. Use the forecast dates below to choose a reasonable region for your travel window—not to assume every temple, park or mountain will look the same on that date.</p>
        </section>

        <section className="japan-autumn__section" aria-labelledby="japan-autumn-city-title">
          <div className="japan-autumn__section-heading"><span>01 / QUICK FORECAST BY CITY</span><h2 id="japan-autumn-city-title">Two trees, two forecast dates</h2><p>JMC’s October 1, 2026 forecast estimates when most leaves on a reference sample tree first turn red or yellow. It does not give a single peak date for the whole city.</p></div>
          <div className="japan-autumn__forecast-key" aria-label="Forecast key"><span><i className="japan-autumn__key-dot japan-autumn__key-dot--red" /> Red maple</span><span><i className="japan-autumn__key-dot japan-autumn__key-dot--yellow" /> Yellow ginkgo</span></div>
          <div className="japan-autumn__table-wrap">
            <table className="japan-autumn__forecast-table">
              <caption>JMC 2026 forecasted sample-tree color-change dates. Released October 1, 2026.</caption>
              <thead><tr><th scope="col">City</th><th scope="col">Red maple</th><th scope="col">Yellow ginkgo</th></tr></thead>
              <tbody>{jmcCityForecasts.map((forecast) => <tr key={forecast.city}>
                <th scope="row">{forecast.city}</th>
                <td><span className="japan-autumn__table-date japan-autumn__table-date--red">{forecast.redMaple}</span></td>
                <td><span className="japan-autumn__table-date japan-autumn__table-date--yellow">{forecast.yellowGinkgo}</span></td>
              </tr>)}</tbody>
            </table>
          </div>
          <p className="japan-autumn__forecast-note">These are forecast dates, not confirmed observations or a guarantee that a named attraction is colorful. JMC said its next release was planned for early November; check the current forecast again closer to your trip.</p>
        </section>

        <section className="japan-autumn__section" aria-labelledby="japan-autumn-date-title">
          <div className="japan-autumn__section-heading"><span>02 / MATCH THE WINDOW TO YOUR DATES</span><h2 id="japan-autumn-date-title">Where to look, and what the dates can tell you</h2></div>
          <div className="japan-autumn__date-windows">
            <article><span>TRAVEL WINDOW / 01</span><h3>Late October to early November</h3><p>Begin with Hokkaido and cooler mountain or highland areas. For a current example, Japan’s Ministry of the Environment visitor center reported on October 25 that larches at Odashirohara were golden and that viewing at Lake Yunoko continued even as leaves began to fall. Those are specific Oku-Nikko observations, not a status report for all of Nikko.</p></article>
            <article><span>TRAVEL WINDOW / 02</span><h3>Mid-November</h3><p>Aomori’s JMC sample-tree dates are November 5 for yellow ginkgo and November 13 for red maple; Nagano’s are November 14 and 21. These make northern Tohoku and inland or higher-elevation routes reasonable places to investigate. Check the exact garden, gorge or mountain before building a day around it.</p></article>
            <article><span>TRAVEL WINDOW / 03</span><h3>Late November</h3><p>Tokyo, Sendai and Hiroshima’s red-maple sample-tree forecasts fall from November 24 to 28, with ginkgo dates between November 21 and 29. Many visitors use this period to look at city parks and streets, but the city dates are not a promise about a particular park’s condition.</p></article>
            <article><span>TRAVEL WINDOW / 04</span><h3>Early to mid-December</h3><p>JMC’s later red-maple sample-tree dates include Nagoya on December 2, Osaka on December 4, Fukuoka on December 7 and Kyoto on December 11. Treat these as city-reference forecasts. A named attraction may be colorful earlier, later or not at its best on the sample-tree date.</p></article>
          </div>
        </section>

        <section className="japan-autumn__section japan-autumn__reports" aria-labelledby="japan-autumn-reports-title">
          <div className="japan-autumn__section-heading"><span>03 / LATEST DATED FIELD REPORTS</span><h2 id="japan-autumn-reports-title">What was colorful in the latest reports?</h2><p>The newest location-specific official observations we verified for this guide were posted October 25. They are one-day snapshots, not live October 26 conditions.</p></div>
          <div className="japan-autumn__report-grid">
            <article><span>OBSERVED / 25 OCTOBER 2026</span><h3>Lake Yunoko, Oku-Nikko</h3><p>The Ministry of the Environment’s Nikko Yumoto Visitor Center said leaves had started to fall, but viewing continued. Yellow was prominent, with red and orange in some areas.</p><a href={yunokoSource} target="_blank" rel="noopener noreferrer">Read the visitor center’s dated updates <ExternalLink size={15} aria-hidden="true" /></a></article>
            <article><span>OBSERVED / 25 OCTOBER 2026</span><h3>Odashirohara, Oku-Nikko</h3><p>The same visitor center described the larches as golden. Its October 11 report said the grass foliage peak had passed, so the October 25 larch note should not be read as a claim that every kind of foliage there was at peak.</p><a href={odashiroSource} target="_blank" rel="noopener noreferrer">Read the visitor center’s dated updates <ExternalLink size={15} aria-hidden="true" /></a></article>
          </div>
          <p className="japan-autumn__reports-note">A separate Weathernews update published October 22 forecast that Kamikochi, Oku-Nikko and Mt Akagi would be in season during October 24–25. That was a forecast for that weekend, not a new observation for October 26. Use local reports for the latest status.</p>
        </section>

        <section className="japan-autumn__section" aria-labelledby="japan-autumn-meaning-title">
          <div className="japan-autumn__section-heading"><span>04 / READ FORECASTS CAREFULLY</span><h2 id="japan-autumn-meaning-title">What a forecast date really means</h2></div>
          <div className="japan-autumn__prose">
            <p><strong>JMC uses sample-tree color change.</strong> Its city table estimates the first day most leaves on a reference tree have turned red or yellow. Red maple and yellow ginkgo have separate dates. That makes the dates useful comparisons between cities, but they are not the peak for every street, park or temple.</p>
            <p><strong>One city can contain several seasons at once.</strong> A mountain slope can turn before the lowlands because temperature changes with elevation. Individual places also differ by tree species, exposure, water and local weather. A report from one viewpoint does not describe every trail or garden nearby.</p>
            <p><strong>JNTO’s broad windows answer a different question.</strong> Its 2026 destination table says it is based on previous years and subject to change with weather. It describes broad seasonal timing. JWA/tenki.jp’s second forecast, published {dateLabel(jwaSecondForecastPublishedAt)}, instead lists individual viewing spots; for example, the Kyoto (Arashiyama) viewing period was forecast to begin {jwaLocationForecasts[0].viewingWindowStarts}. That spot estimate is not the same measure as JMC’s Kyoto sample-tree red date of December 11.</p>
            <p><strong>Forecasts move as the season develops.</strong> JMC’s October 1 release said its next forecast was planned for early November. JWA also publishes updated spot information through tenki.jp. Recheck the specific location rather than relying on an older forecast screenshot.</p>
          </div>
        </section>

        <section className="japan-autumn__section" aria-labelledby="japan-autumn-check-title">
          <div className="japan-autumn__section-heading"><span>05 / BEFORE YOU VISIT</span><h2 id="japan-autumn-check-title">A short check before you set out</h2></div>
          <ol className="japan-autumn__checklist">
            <li><strong>Check a place, not just a city.</strong> Look for a dated foliage report from the attraction, local tourism office or visitor center. Compare the update date with your travel date.</li>
            <li><strong>Confirm access separately.</strong> Check the official attraction, road, ropeway or transit operator for seasonal openings, closures, service hours and any reservation or entry instructions.</li>
            <li><strong>Check weather and local conditions again.</strong> Wind and rain can change how long leaves stay on branches; mountain transport and paths can also be affected by conditions.</li>
            <li><strong>Keep a nearby alternative.</strong> If your first choice is past peak or access changes, a second place at a different elevation may have a different color stage.</li>
          </ol>
          <p className="japan-autumn__checklist-note">Do not assume that last year’s opening dates, transport timetable or attraction rules will apply this season. The destination and operating venue are the final authority on current access.</p>
        </section>

        <section className="japan-autumn__sources" aria-labelledby="japan-autumn-sources-title">
          <span>ORIGINAL SOURCES</span><h2 id="japan-autumn-sources-title">Forecasts and location reports</h2>
          <p>Forecast release dates and field-report dates are shown separately above. Source pages checked on <time dateTime={japanAutumnForecastCheckedAt}>{dateLabel(japanAutumnForecastCheckedAt)}</time>; live forecasts and local access details can change.</p>
          <ul>
            <li><a href={jmcSource} target="_blank" rel="noopener noreferrer">Japan Meteorological Corporation — second 2026 forecast, published October 1 <ExternalLink size={15} aria-hidden="true" /></a></li>
            <li><a href={jwaSource} target="_blank" rel="noopener noreferrer">Japan Weather Association / tenki.jp — second 2026 location forecast, published {dateLabel(jwaSecondForecastPublishedAt)} <ExternalLink size={15} aria-hidden="true" /></a></li>
            <li><a href={jwaReleaseSource} target="_blank" rel="noopener noreferrer">Japan Weather Association — English summary of its October 1 outlook, published October 2 <ExternalLink size={15} aria-hidden="true" /></a></li>
            <li><a href={jntoSource} target="_blank" rel="noopener noreferrer">Japan National Tourism Organization — 2026 destination forecast and broad seasonal windows <ExternalLink size={15} aria-hidden="true" /></a></li>
            <li><a href={odashiroSource} target="_blank" rel="noopener noreferrer">Nikko Yumoto Visitor Center / Ministry of the Environment — Odashirohara updates, including October 25 <ExternalLink size={15} aria-hidden="true" /></a></li>
            <li><a href={yunokoSource} target="_blank" rel="noopener noreferrer">Nikko Yumoto Visitor Center / Ministry of the Environment — Lake Yunoko updates, including October 25 <ExternalLink size={15} aria-hidden="true" /></a></li>
            <li><a href={weathernewsSource} target="_blank" rel="noopener noreferrer">Weathernews — October 22 forecast for the October 24–25 weekend <ExternalLink size={15} aria-hidden="true" /></a></li>
          </ul>
          <p className="japan-autumn__source-note">AeroGo’s date-by-city summary is an original text presentation of JMC’s published forecast, not a reproduced forecast map. This guide is general trip-planning information; confirm current details with the local operator.</p>
        </section>
        <nav className="japan-autumn__related" aria-label="Explore more Japan information">
          <Link to="/destinations/japan">Discover Japan <ArrowUpRight size={18} aria-hidden="true" /></Link>
          <Link to="/guides/japan/tax-free-refund-system-november-2026">Japan tax-free shopping guide <ArrowUpRight size={18} aria-hidden="true" /></Link>
          <Link to="/guides">All travel guides <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </nav>
      </article>
    </main>
    <EditorialFooter editorial />
  </div>;
}
