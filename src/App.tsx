import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Homepage } from "./pages/Homepage";
import { CompanionPage } from "./pages/Companion";
import { DestinationPage } from "./pages/DestinationPage";
import { DreamTripNotFound, DreamTripPage } from "./pages/DreamTripPage";
import { MyTripPage } from "./pages/MyTrip";
import { findDestination } from "./data/destinations";
import { getTravelUpdateBySlug } from "./data/travelUpdates";
import { TravelUpdateArticlePage, TravelUpdatesPage } from "./pages/TravelUpdates";
import "./App.css";

function PageTitle() {
  const { pathname } = useLocation();
  const destinationSlug = pathname.startsWith("/destinations/") ? pathname.split("/").at(-1) : undefined;
  const destination = findDestination(destinationSlug);
  const travelUpdateSlug = pathname.startsWith("/travel-updates/") ? pathname.split("/").at(-1) : undefined;
  const travelUpdate = getTravelUpdateBySlug(travelUpdateSlug);
  const isTravelUpdatesRoute = pathname === "/travel-updates" || pathname.startsWith("/travel-updates/");
  const isTravelUpdateArticle = Boolean(travelUpdate);
  const pageTitle = travelUpdate
    ? `${travelUpdate.headline} · AeroGo Travel Updates`
    : pathname.startsWith("/companion")
      ? "Sample Trip Companion · AeroGo"
      : pathname.startsWith("/trip/")
        ? "AeroGo My Trip · Private trip space"
      : pathname.startsWith("/dream/")
        ? "Dream Trip Preview · AeroGo"
      : destination
          ? `${destination.name} inspiration · AeroGo`
          : pathname.startsWith("/destinations/")
            ? "Destination inspiration · AeroGo"
          : isTravelUpdatesRoute
            ? "AeroGo Travel Updates · AeroGo"
          : "AeroGo Travel & Tours | From what if? to we're going.";
  const pageDescription = travelUpdate?.summary
    ?? (isTravelUpdatesRoute ? "Useful events, travel changes and destination ideas for your next trip." : "AeroGo Travel & Tours helps make your trip feel easy. Thoughtful travel planning, booking organization, and a private trip companion.");

  useEffect(() => {
    document.title = pageTitle;
    setMeta("name", "description", pageDescription);

    if (isTravelUpdatesRoute) {
      const canonicalUrl = new URL(pathname, window.location.origin).href;
      setCanonical(canonicalUrl);
      setMeta("property", "og:title", pageTitle);
      setMeta("property", "og:description", pageDescription);
      setMeta("property", "og:url", canonicalUrl);
      setMeta("property", "og:type", isTravelUpdateArticle ? "article" : "website");
      setMeta("name", "twitter:card", isTravelUpdateArticle ? "summary_large_image" : "summary");
      setMeta("name", "twitter:title", pageTitle);
      setMeta("name", "twitter:description", pageDescription);
      if (travelUpdate) {
        setMeta("property", "og:image", travelUpdate.image.src);
        setMeta("name", "twitter:image", travelUpdate.image.src);
      } else {
        removeMeta("property", "og:image");
        removeMeta("name", "twitter:image");
      }
    } else {
      removeTravelUpdatesMeta();
    }
  }, [isTravelUpdateArticle, isTravelUpdatesRoute, pageDescription, pageTitle, pathname, travelUpdate]);
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
  ["og:title", "og:description", "og:url", "og:type", "og:image"].forEach((key) => removeMeta("property", key));
  ["twitter:card", "twitter:title", "twitter:description", "twitter:image"].forEach((key) => removeMeta("name", key));
  document.head.querySelector('link[rel="canonical"]')?.remove();
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
    <Route path="/trip/:token" element={<MyTripPage />} />
    <Route path="/travel-updates" element={<TravelUpdatesPage />} />
    <Route path="/travel-updates/:slug" element={<TravelUpdateArticlePage />} />
    <Route path="/destinations/:slug" element={<DestinationPage />} />
    <Route path="/dream/:slug" element={<DreamTripPage />} />
    <Route path="/dream/*" element={<DreamTripNotFound />} />
    <Route path="*" element={<Homepage />} />
  </Routes></BrowserRouter>;
}
