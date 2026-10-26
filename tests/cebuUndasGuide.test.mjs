import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { travelGuides, getFeaturedTravelGuide } from "../src/data/travelGuides.ts";

const guidePath = "/guides/philippines/cebu-pacific-undas-2026-flight-checklist";

test("Cebu Pacific Undas checklist has one route, a dated source check and an original social image", () => {
  const guide = travelGuides.find((item) => item.path === guidePath);
  assert.ok(guide);
  assert.equal(travelGuides.filter((item) => item.path === guidePath).length, 1);
  assert.equal(guide.sourcesCheckedAt, "2026-10-26");
  assert.equal(guide.publishedAt, "2026-10-26", "planned first-publication date is distinct from the source-check date");
  assert.equal(guide.imageSrc, "/images/guides/philippines/cebu-undas-checklist.jpg");
  assert.match(guide.imageAlt, /not a photograph/);
  assert.match(guide.socialImageAlt, /not a documentary airport image/);
});

test("holiday checklist leads the homepage only through November 3 in Manila time", () => {
  const beforeWindowEnds = new Date("2026-11-03T15:59:59Z");
  const afterWindowEnds = new Date("2026-11-03T16:00:00Z");
  assert.equal(getFeaturedTravelGuide(beforeWindowEnds).path, guidePath);
  assert.equal(getFeaturedTravelGuide(afterWindowEnds).path, "/guides/japan/autumn-leaves-2026");
});

test("guide copy flags the unresolved eTravel conflict and separates arrival recommendations from cutoffs", () => {
  const article = readFileSync(new URL("../src/pages/CebuUndasGuide.tsx", import.meta.url), "utf8");
  assert.match(article, /within<\/em> 72 hours/);
  assert.match(article, /<em>at least<\/em> 72 hours/);
  assert.match(article, /These instructions conflict/);
  assert.match(article, /When the registration window becomes available.*complete the form before you travel and save or screenshot your QR code/);
  assert.match(article, /An ordinary domestic-only trip does not require an international eTravel form/);
  assert.match(article, /These are Cebu Pacific’s recommendations.*not check-in closing times/);
  assert.match(article, /does not promise a refund, rebooking, compensation/);
});
