import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Homepage } from "./pages/Homepage";
import { CompanionPage } from "./pages/Companion";
import "./App.css";

function PageTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = pathname.startsWith("/companion") ? "Sample Trip Companion · AeroGo" : "AeroGo Travel & Tours | Your trip, taken care of.";
  }, [pathname]);
  return null;
}

export default function App() {
  return <BrowserRouter><PageTitle /><Routes><Route path="/" element={<Homepage />} /><Route path="/companion" element={<CompanionPage />} /><Route path="*" element={<Homepage />} /></Routes></BrowserRouter>;
}
