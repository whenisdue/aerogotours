import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Homepage } from "./pages/Homepage";
import { SITE_ORIGIN, DEFAULT_SOCIAL_IMAGE, DEFAULT_SOCIAL_IMAGE_ALT, getSocialImageUrl } from "./utils/siteMetadata";
import "./App.css";

const CompanionPage = lazy(() => import("./pages/Companion").then((module) => ({ default: module.CompanionPage })));
const DestinationPage = lazy(() => import("./pages/DestinationPage").then((module) => ({ default: module.DestinationPage })));
const DreamTripPage = lazy(() => import("./pages/DreamTripPage").then((module) => ({ default: module.DreamTripPage })));
const DreamTripNotFound = lazy(() => import("./pages/DreamTripPage").then((module) => ({ default: module.DreamTripNotFound })));
const MyTripPage = lazy(() => import("./pages/MyTrip").then((module) => ({ default: module.MyTripPage })));
const TravelUpdatesPage = lazy(() => import("./pages/TravelUpdates").then((module) => ({ default: module.TravelUpdatesPage })));
const TravelUpdateArticlePage = lazy(() => import("./pages/TravelUpdates").then((module) => ({ default: module.TravelUpdateArticlePage })));
const GardensByTheBayGuide = lazy(() => import("./pages/GardensByTheBayGuide").then((module) => ({ default: module.GardensByTheBayGuide })));
const JapanTaxFreeGuide = lazy(() => import("./pages/JapanTaxFreeGuide").then((module) => ({ default: module.JapanTaxFreeGuide })));
const JapanAutumnGuide = lazy(() => import("./pages/JapanAutumnGuide").then((module) => ({ default: module.JapanAutumnGuide })));
const CebuUndasGuide = lazy(() => import("./pages/CebuUndasGuide").then((module) => ({ default: module.CebuUndasGuide })));
const TravelGuidesPage = lazy(() => import("./pages/TravelGuides").then((module) => ({ default: module.TravelGuidesPage })));
const WatchPage = lazy(() => import("./pages/Watch").then((module) => ({ default: module.WatchPage })));
const TripPlanner = lazy(() => import("./features/tripPlanner/TripPlanner").then((module) => ({ default: module.TripPlanner })));
const VietnamProposalPage = lazy(() => import("./pages/VietnamProposal").then((module) => ({ default: module.VietnamProposalPage })));

const HOME_TITLE = "Travel Stories, News & Guides · AeroGo";
const HOME_DESCRIPTION = "Discover destination stories, travel news, practical guides and original AeroGo videos for curious Filipino travelers.";
const NEWS_DESCRIPTION = "AeroGo Travel News: published travel developments, events and destination updates, with dates and original source links.";

function PageTitle() {
  const { pathname } = useLocation();
  const isPrivateTrip = pathname.startsWith("/trip/");
  const isNewsArticle = pathname.startsWith("/travel-updates/");
  const isDestination = pathname.startsWith("/destinations/");
  const isGardensGuide = pathname === "/guides/singapore/gardens-by-the-bay";
  const isJapanTaxGuide = pathname === "/guides/japan/tax-free-refund-system-november-2026";
  const isJapanAutumnGuide = pathname === "/guides/japan/autumn-leaves-2026";
  const isCebuUndasGuide = pathname === "/guides/philippines/cebu-pacific-undas-2026-flight-checklist";
  const isGuideDirectory = pathname === "/guides";
  const isWatchPage = pathname === "/watch";
  const isNewsListing = pathname === "/travel-updates";
  const isHomePage = pathname === "/";
  const isCompanionDemo = pathname === "/companion";
  const isDreamTrip = pathname.startsWith("/dream/");

  useEffect(() => {
    const applyMetadata = () => {
    const article = document.querySelector<HTMLElement>(".news-article[data-seo-title]");
    const autumnGuide = document.querySelector<HTMLElement>(".japan-autumn__article[data-seo-title]");
    const cebuUndasGuide = document.querySelector<HTMLElement>(".cebu-undas__article[data-seo-title]");
    const heading = document.querySelector<HTMLElement>("main h1")?.textContent?.trim();
    const pageTitle = isHomePage ? HOME_TITLE
      : isNewsListing ? "Travel News · AeroGo"
        : isNewsArticle ? article?.dataset.seoTitle ?? `${heading || "Travel News"} · AeroGo Travel News`
          : isGardensGuide ? "Gardens by the Bay Visitor Guide · Singapore · AeroGo"
            : isJapanTaxGuide ? "Japan Tax-Free Shopping Changes Nov. 1: A Filipino Traveler’s Guide · AeroGo"
              : isJapanAutumnGuide ? autumnGuide?.dataset.seoTitle ?? "Japan Autumn Leaves 2026: Forecast Dates by City | AeroGo"
                : isCebuUndasGuide ? cebuUndasGuide?.dataset.seoTitle ?? "Cebu Pacific Undas 2026: 7 Flight-Day Checks | AeroGo"
            : isGuideDirectory ? "Travel Guides · AeroGo"
              : isWatchPage ? "Watch AeroGo · Original Travel Videos"
                : pathname === "/trip-planner" ? "Free Singapore Trip Planner · AeroGo Travel & Tours"
                  : pathname === "/companion" ? "Sample Trip Companion · AeroGo"
                    : pathname === "/trip/vietnam-danang-hanoi" ? "Vietnam Trip Proposal · Da Nang + Hanoi · AeroGo"
                      : isPrivateTrip ? "AeroGo My Trip · Private trip space"
                        : pathname.startsWith("/dream/") ? "Dream Trip Preview · AeroGo"
                          : isDestination ? `${heading || "Destination"} inspiration · AeroGo`
                            : HOME_TITLE;

    const pageDescription = isHomePage ? HOME_DESCRIPTION
      : isNewsListing ? NEWS_DESCRIPTION
        : isNewsArticle ? article?.dataset.seoDescription ?? document.querySelector(".news-article__deck")?.textContent?.trim() ?? heading ?? NEWS_DESCRIPTION
          : isGardensGuide ? "A practical visitor guide to Gardens by the Bay in Singapore: free and ticketed areas, Cloud Forest, changing floral displays, Supertrees and planning tips."
          : isJapanTaxGuide ? "Japan’s tax-free system changes November 1, 2026. Learn when to pay consumption tax, how to complete customs confirmation before baggage check-in, and how refunds work."
            : isJapanAutumnGuide ? autumnGuide?.dataset.seoDescription ?? "Planning Japan in autumn 2026? Compare red-maple and yellow-ginkgo forecasts for 11 cities, dated foliage reports and practical checks before you go."
            : isCebuUndasGuide ? cebuUndasGuide?.dataset.seoDescription ?? "Flying Cebu Pacific during Undas 2026? Check airport arrival times, check-in deadlines, baggage, documents and what to do if your flight changes."
              : isGuideDirectory ? "Practical travel guides for Cebu Pacific’s 2026 Undas peak period, Japan autumn planning, tax-free shopping and Singapore attractions."
              : isWatchPage ? "Watch published AeroGo travel videos from Singapore and Vietnam, including destination discovery and the Golden Bridge at Ba Na Hills."
                : pathname === "/trip-planner" ? "Create a free three, four or five day Singapore itinerary with a travel checklist. No account needed; save, share or print your plan."
                  : isDestination ? document.querySelector(".destination-article-header > p")?.textContent?.trim() ?? `Explore AeroGo’s destination inspiration for ${heading ?? "this destination"}.`
                    : pathname.startsWith("/dream/") ? document.querySelector(".dream-preview__hero-copy > p")?.textContent?.trim() ?? "Explore a flexible sample itinerary with AeroGo."
                      : isPrivateTrip ? "Private trip information for invited travelers."
                        : isNewsArticle ? NEWS_DESCRIPTION
                          : "AeroGo Travel & Tours helps make your trip feel easy. Thoughtful travel planning, booking organization, and a private trip companion.";

    document.title = pageTitle;
    setMeta("name", "description", pageDescription);
    setMeta("name", "robots", isPrivateTrip ? "noindex, nofollow" : isCompanionDemo || isDreamTrip ? "noindex, follow" : "index, follow");

    if (isPrivateTrip) {
      document.head.querySelector('link[rel="canonical"]')?.remove();
      ["og:title", "og:description", "og:url", "og:type", "og:image", "og:image:alt", "article:published_time", "article:modified_time"].forEach((key) => removeMeta("property", key));
      ["twitter:card", "twitter:title", "twitter:description", "twitter:image", "twitter:image:alt"].forEach((key) => removeMeta("name", key));
      return;
    }

    const canonicalPath = pathname === "/travel-guides" ? "/guides"
      : pathname.startsWith("/travel-updates/") && !article ? "/travel-updates"
        : pathname.startsWith("/destinations/") && !document.querySelector(".destination-article-header") ? "/"
          : pathname;
    const canonicalUrl = new URL(canonicalPath || "/", SITE_ORIGIN).href;
    setCanonical(canonicalUrl);
    setMeta("property", "og:site_name", "AeroGo");
    setMeta("property", "og:title", pageTitle);
    setMeta("property", "og:description", pageDescription);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:type", isNewsArticle || isGardensGuide || isJapanTaxGuide || isJapanAutumnGuide || isCebuUndasGuide ? "article" : "website");
    setMeta("name", "twitter:title", pageTitle);
    setMeta("name", "twitter:description", pageDescription);

    const pageImage = article?.dataset.seoImage
      ?? (isJapanAutumnGuide ? autumnGuide?.dataset.seoImage : undefined)
      ?? (isCebuUndasGuide ? cebuUndasGuide?.dataset.seoImage : undefined)
      ?? (isHomePage || isGuideDirectory || isGardensGuide || isWatchPage || pathname === "/trip-planner" ? DEFAULT_SOCIAL_IMAGE : undefined)
      ?? (isNewsListing ? document.querySelector<HTMLImageElement>(".news-lead__image img")?.src : undefined)
      ?? document.querySelector<HTMLImageElement>(".destination-lead-photo img, .watch-video--featured img")?.src
      ?? document.querySelector<HTMLImageElement>(".desk-lead img")?.src;
    const pageImageAlt = article?.dataset.seoImageAlt
      ?? (isJapanAutumnGuide ? autumnGuide?.dataset.seoImageAlt : undefined)
      ?? (isCebuUndasGuide ? cebuUndasGuide?.dataset.seoImageAlt : undefined)
      ?? (isHomePage || isGuideDirectory || isGardensGuide || isWatchPage || pathname === "/trip-planner" ? DEFAULT_SOCIAL_IMAGE_ALT : undefined)
      ?? (isNewsListing ? document.querySelector<HTMLImageElement>(".news-lead__image img")?.alt : undefined)
      ?? document.querySelector<HTMLImageElement>(".destination-lead-photo img, .watch-video--featured img, .desk-lead img")?.alt;

    setMeta("name", "twitter:card", pageImage ? "summary_large_image" : "summary");
    if (pageImage) {
      const absoluteImage = getSocialImageUrl(pageImage);
      setMeta("property", "og:image", absoluteImage);
      setMeta("name", "twitter:image", absoluteImage);
      if (pageImageAlt) setMeta("property", "og:image:alt", pageImageAlt);
      else removeMeta("property", "og:image:alt");
      if (pageImageAlt) setMeta("name", "twitter:image:alt", pageImageAlt);
      else removeMeta("name", "twitter:image:alt");
    } else {
      ["og:image", "og:image:alt"].forEach((key) => removeMeta("property", key));
      removeMeta("name", "twitter:image");
      removeMeta("name", "twitter:image:alt");
    }

    const publishedAt = isJapanTaxGuide
      ? document.querySelector<HTMLElement>(".japan-refund__article")?.dataset.seoPublished
      : isJapanAutumnGuide ? autumnGuide?.dataset.seoPublished
      : isCebuUndasGuide ? cebuUndasGuide?.dataset.seoPublished
      : article?.dataset.seoPublished;
    const updatedAt = article?.dataset.seoUpdated;
    if ((isNewsArticle || isJapanTaxGuide || isJapanAutumnGuide || isCebuUndasGuide) && publishedAt) setMeta("property", "article:published_time", publishedAt);
    else removeMeta("property", "article:published_time");
    if (isNewsArticle && updatedAt) setMeta("property", "article:modified_time", updatedAt);
    else removeMeta("property", "article:modified_time");
    };

    applyMetadata();
    window.addEventListener("aerogo:metadata-ready", applyMetadata);

    const needsRouteContent = isNewsArticle || isJapanTaxGuide || isJapanAutumnGuide || isCebuUndasGuide || isDestination || isNewsListing;
    let observer: MutationObserver | undefined;
    if (needsRouteContent) {
      observer = new MutationObserver(() => {
        const routeContent = isNewsArticle
          ? document.querySelector(".news-article[data-seo-title]")
          : isJapanTaxGuide ? document.querySelector(".japan-refund__article[data-seo-published]")
          : isJapanAutumnGuide ? document.querySelector(".japan-autumn__article[data-seo-title]")
          : isCebuUndasGuide ? document.querySelector(".cebu-undas__article[data-seo-title]")
          : isDestination ? document.querySelector(".destination-article-header")
            : document.querySelector(".news-lead");
        if (routeContent) {
          applyMetadata();
          observer?.disconnect();
        }
      });
      observer.observe(document.querySelector("#root") ?? document.body, { childList: true, subtree: true });
    }

    return () => {
      window.removeEventListener("aerogo:metadata-ready", applyMetadata);
      observer?.disconnect();
    };
  }, [isCompanionDemo, isDestination, isDreamTrip, isGardensGuide, isJapanTaxGuide, isJapanAutumnGuide, isCebuUndasGuide, isGuideDirectory, isHomePage, isNewsArticle, isNewsListing, isPrivateTrip, isWatchPage, pathname]);

  return null;
}

function setMeta(attribute: "name" | "property", key: string, content: string) {
  const selector = `meta[${attribute}="${key}"]`;
  const meta = document.head.querySelector<HTMLMetaElement>(selector) ?? document.head.appendChild(document.createElement("meta"));
  meta.setAttribute(attribute, key);
  meta.setAttribute("content", content);
}

function removeMeta(attribute: "name" | "property", key: string) {
  document.head.querySelector(`meta[${attribute}="${key}"]`)?.remove();
}

function setCanonical(url: string) {
  const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]') ?? document.head.appendChild(document.createElement("link"));
  canonical.setAttribute("rel", "canonical");
  canonical.setAttribute("href", url);
}

function ScrollToHash() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (hash) {
        const targetId = decodeURIComponent(hash.slice(1));
        document.getElementById(targetId)?.scrollIntoView({ behavior: "auto" });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    }, 50);
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return <BrowserRouter><PageTitle /><ScrollToHash /><Suspense fallback={<p role="status" className="route-loading">Loading AeroGo…</p>}><Routes>
    <Route path="/" element={<Homepage />} />
    <Route path="/companion" element={<CompanionPage />} />
    <Route path="/trip-planner" element={<TripPlanner />} />
    <Route path="/trip/vietnam-danang-hanoi" element={<VietnamProposalPage />} />
    <Route path="/trip/:token" element={<MyTripPage />} />
    <Route path="/travel-updates" element={<TravelUpdatesPage />} />
    <Route path="/travel-updates/sunchang-jangryu-food-festival-2026" element={<Navigate replace to="/travel-updates/sunchang-jangryu-festival-2026" />} />
    <Route path="/travel-updates/:slug" element={<TravelUpdateArticlePage />} />
    <Route path="/guides" element={<TravelGuidesPage />} />
    <Route path="/watch" element={<WatchPage />} />
    <Route path="/travel-guides" element={<Navigate replace to="/guides" />} />
    <Route path="/guides/singapore/gardens-by-the-bay" element={<GardensByTheBayGuide />} />
    <Route path="/guides/japan/tax-free-refund-system-november-2026" element={<JapanTaxFreeGuide />} />
    <Route path="/guides/japan/autumn-leaves-2026" element={<JapanAutumnGuide />} />
    <Route path="/guides/philippines/cebu-pacific-undas-2026-flight-checklist" element={<CebuUndasGuide />} />
    <Route path="/destinations/:slug" element={<DestinationPage />} />
    <Route path="/dream/:slug" element={<DreamTripPage />} />
    <Route path="/dream/*" element={<DreamTripNotFound />} />
    <Route path="*" element={<Homepage />} />
  </Routes></Suspense></BrowserRouter>;
}
