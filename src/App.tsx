import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Homepage } from "./pages/Homepage";
import { CompanionPage } from "./pages/Companion";
import { DestinationPage } from "./pages/DestinationPage";
import { DreamTripNotFound, DreamTripPage } from "./pages/DreamTripPage";
import { findDestination } from "./data/destinations";
import "./App.css";

function PageTitle() {
  const { pathname } = useLocation();
  const destinationSlug = pathname.startsWith("/destinations/") ? pathname.split("/").at(-1) : undefined;
  const destination = findDestination(destinationSlug);
  useEffect(() => {
    document.title = pathname.startsWith("/companion")
      ? "Sample Trip Companion · AeroGo"
      : pathname.startsWith("/dream/")
        ? "Dream Trip Preview · AeroGo"
      : destination
          ? `${destination.name} inspiration · AeroGo`
          : pathname.startsWith("/destinations/")
            ? "Destination inspiration · AeroGo"
          : "AeroGo Travel & Tours | From what if? to we're going.";
  }, [pathname, destination]);
  return null;
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
    <Route path="/destinations/:slug" element={<DestinationPage />} />
    <Route path="/dream/:slug" element={<DreamTripPage />} />
    <Route path="/dream/*" element={<DreamTripNotFound />} />
    <Route path="*" element={<Homepage />} />
  </Routes></BrowserRouter>;
}
