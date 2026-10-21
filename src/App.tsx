import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Homepage } from "./pages/Homepage";
import { CompanionPage } from "./pages/Companion";
import { DestinationPage } from "./pages/DestinationPage";
import { DreamTripNotFound, DreamTripPage } from "./pages/DreamTripPage";
import { MyTripPage } from "./pages/MyTrip";
import { findDestination } from "./data/destinations";
import { getTravelUpdateBySlug } from "./data/travelUpdates";
import { buildTravelNewsStructuredData } from "./utils/newsSeo";
import { TravelUpdateArticlePage, TravelUpdatesPage } from "./pages/TravelUpdates";
import { GardensByTheBayGuide } from "./pages/GardensByTheBayGuide";
import { TravelGuidesPage } from "./pages/TravelGuides";
import { TripPlanner } from "./features/tripPlanner/TripPlanner";
import { VietnamProposalPage } from "./pages/VietnamProposal";
import "./App.css";

function PageTitle() {
  const { pathname } = useLocation();
  const destinationSlug = pathname.startsWith("/destinations/") ? pathname.split("/").at(-1) : undefined;
  const destination = findDestination(destinationSlug);
  const travelUpdateSlug = pathname.startsWith("/travel-updates/") ? pathname.split("/").at(-1) : undefined;
  const travelUpdate = getTravelUpdateBySlug(travelUpdateSlug);
  const isTravelUpdatesRoute = pathname === "/travel-updates" || pathname.startsWith("/travel-updates/");
  const isTravelUpdateArticle = Boolean(travelUpdate);
  const isDestinationArticle = Boolean(destination);
  const isGardensGuide = pathname === "/guides/singapore/gardens-by-the-bay";
  const isGuidesDirectory = pathname === "/guides";
  const isTripPlanner = pathname === "/trip-planner";
  const isDiscoveryPage = pathname === "/" || isGuidesDirectory;
  const isVietnamProposal = pathname === "/trip/vietnam-danang-hanoi";
  const pageTitle = isTripPlanner ? "Free Singapore Trip Planner · AeroGo Travel & Tours" : isGuidesDirectory ? "Travel Guides · AeroGo" : isGardensGuide
    ? "Gardens by the Bay Visitor Guide · Singapore · AeroGo"
    : travelUpdate
    ? travelUpdate.seoTitle ?? `${travelUpdate.headline} · AeroGo Travel News`
    : pathname.startsWith("/companion")
      ? "Sample Trip Companion · AeroGo"
      : isVietnamProposal
        ? "Vietnam Trip Proposal · Da Nang + Hanoi · AeroGo"
      : pathname.startsWith("/trip/")
        ? "AeroGo My Trip · Private trip space"
      : pathname.startsWith("/dream/")
        ? "Dream Trip Preview · AeroGo"
      : destination
          ? `${destination.name} inspiration · AeroGo`
          : pathname.startsWith("/destinations/")
            ? "Destination inspiration · AeroGo"
          : isTravelUpdatesRoute
            ? "Travel News · AeroGo"
          : pathname === "/"
            ? "Travel Stories, News & Guides · AeroGo"
            : "Travel Planning for Filipino Travelers · AeroGo Travel & Tours";
  const pageDescription = (isTripPlanner ? "Create a free three, four or five day Singapore itinerary with a travel checklist. No account needed; save, share or print your plan." : undefined)
    ?? (isGuidesDirectory ? "Explore AeroGo’s travel guides, with original photography and practical visitor information. Start with Gardens by the Bay in Singapore." : undefined)
    ?? (pathname === "/" ? "Discover destination stories, travel news, practical guides and original AeroGo videos for curious Filipino travelers." : undefined)
    ?? (isGardensGuide ? "A practical visitor guide to Gardens by the Bay in Singapore: free and ticketed areas, Cloud Forest, changing floral displays, Supertrees and planning tips." : undefined)
    ?? (destination ? `${destination.intro[0]} Explore AeroGo’s destination inspiration for ${destination.name}.` : undefined)
    ?? travelUpdate?.seoDescription
    ?? travelUpdate?.summary
    ?? (isVietnamProposal ? "A six-day Vietnam itinerary through Da Nang and Hanoi, with guided tours, free time and confirmed package inclusions." : undefined)
    ?? (isTravelUpdatesRoute ? "AeroGo Travel News: published travel developments, events and destination updates, with dates and original source links." : "AeroGo Travel & Tours helps make your trip feel easy. Thoughtful travel planning, booking organization, and a private trip companion.");

  useEffect(() => {
    document.title = pageTitle;
    setMeta("name", "description", pageDescription);

    if (isTravelUpdatesRoute || isGardensGuide || isDiscoveryPage || isTripPlanner || isDestinationArticle) {
      const canonicalUrl = new URL(pathname, window.location.origin).href;
      setCanonical(canonicalUrl);
      setMeta("property", "og:title", pageTitle);
      setMeta("property", "og:description", pageDescription);
      setMeta("property", "og:url", canonicalUrl);
      setMeta("property", "og:type", isTravelUpdateArticle || isGardensGuide ? "article" : "website");
      setMeta("name", "twitter:card", isTravelUpdateArticle || isGardensGuide || isDiscoveryPage || isDestinationArticle ? "summary_large_image" : "summary");
      setMeta("name", "twitter:title", pageTitle);
      setMeta("name", "twitter:description", pageDescription);
      if (travelUpdate) {
        setMeta("property", "og:image", travelUpdate.image.src);
        setMeta("name", "twitter:image", travelUpdate.image.src);
        setMeta("property", "og:image:alt", travelUpdate.image.alt);
        setMeta("property", "article:published_time", travelUpdate.publishedAt);
        if (travelUpdate.updatedAt) setMeta("property", "article:modified_time", travelUpdate.updatedAt);
        else removeMeta("property", "article:modified_time");
        const structuredData = document.head.querySelector<HTMLScriptElement>('script[data-aerogo-news-schema]') ?? document.head.appendChild(document.createElement("script"));
        structuredData.type = "application/ld+json";
        structuredData.dataset.aerogoNewsSchema = "";
        structuredData.textContent = JSON.stringify(buildTravelNewsStructuredData(travelUpdate, window.location.origin));
      } else if (isGardensGuide || isDiscoveryPage) {
        const shareImage = new URL("/images/gardens-by-the-bay/optimized/S25-1440.jpg", window.location.origin).href;
        setMeta("property", "og:image", shareImage);
        setMeta("name", "twitter:image", shareImage);
        setMeta("property", "og:image:alt", "An elevated daytime view of Supertree Grove and the conservatories at Gardens by the Bay");
      } else if (destination) {
        setMeta("property", "og:image", destination.heroImage);
        setMeta("name", "twitter:image", destination.heroImage);
        setMeta("property", "og:image:alt", destination.imageAlt);
      } else {
        removeMeta("property", "og:image");
        removeMeta("name", "twitter:image");
        removeMeta("property", "og:image:alt");
      }
      if (!travelUpdate) {
        removeMeta("property", "article:published_time");
        removeMeta("property", "article:modified_time");
        document.head.querySelector('script[data-aerogo-news-schema]')?.remove();
      }
    } else {
      removeTravelUpdatesMeta();
    }
  }, [destination, isDestinationArticle, isDiscoveryPage, isGardensGuide, isTravelUpdateArticle, isTravelUpdatesRoute, isTripPlanner, pageDescription, pageTitle, pathname, travelUpdate]);
  useEffect(() => {
    const robots = document.querySelector('meta[name="robots"]') ?? document.head.appendChild(document.createElement("meta"));
    robots.setAttribute("name", "robots");
    robots.setAttribute("content", pathname.startsWith("/trip/") ? "noindex, nofollow" : "index, follow");
  }, [pathname]);
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

function removeTravelUpdatesMeta() {
  ["og:title", "og:description", "og:url", "og:type", "og:image", "og:image:alt", "article:published_time", "article:modified_time"].forEach((key) => removeMeta("property", key));
  ["twitter:card", "twitter:title", "twitter:description", "twitter:image"].forEach((key) => removeMeta("name", key));
  document.head.querySelector('link[rel="canonical"]')?.remove();
  document.head.querySelector('script[data-aerogo-news-schema]')?.remove();
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
  return <BrowserRouter><PageTitle /><ScrollToHash /><Routes>
    <Route path="/" element={<Homepage />} />
    <Route path="/companion" element={<CompanionPage />} />
    <Route path="/trip-planner" element={<TripPlanner />} />
    <Route path="/trip/vietnam-danang-hanoi" element={<VietnamProposalPage />} />
    <Route path="/trip/:token" element={<MyTripPage />} />
    <Route path="/travel-updates" element={<TravelUpdatesPage />} />
    <Route path="/travel-updates/sunchang-jangryu-food-festival-2026" element={<Navigate replace to="/travel-updates/sunchang-jangryu-festival-2026" />} />
    <Route path="/travel-updates/:slug" element={<TravelUpdateArticlePage />} />
    <Route path="/guides" element={<TravelGuidesPage />} />
    <Route path="/travel-guides" element={<Navigate replace to="/guides" />} />
    <Route path="/guides/singapore/gardens-by-the-bay" element={<GardensByTheBayGuide />} />
    <Route path="/destinations/:slug" element={<DestinationPage />} />
    <Route path="/dream/:slug" element={<DreamTripPage />} />
    <Route path="/dream/*" element={<DreamTripNotFound />} />
    <Route path="*" element={<Homepage />} />
  </Routes></BrowserRouter>;
}
