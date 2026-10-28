import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { travelGuides, getFeaturedTravelGuide, isHomepageTravelGuideLinkActive } from "../src/data/travelGuides.ts";
import { SITE_ORIGIN, getSocialImageUrl } from "../src/utils/siteMetadata.ts";

const guidePath = "/guides/mexico/mexico-city-day-of-the-dead-2026";
const guide = travelGuides.find((item) => item.path === guidePath);

test("Mexico City guide has one route and keeps publication and source-check dates separate", () => {
  assert.ok(guide);
  assert.equal(travelGuides.filter((item) => item.path === guidePath).length, 1);
  assert.equal(guide.sourcesCheckedAt, "2026-10-29");
  assert.equal(guide.publishedAt, "2026-10-29");
  assert.equal(guide.homepageFeaturedThrough, undefined);
  assert.equal(guide.imageSrc, "/images/guides/mexico/zocalo-ofrenda-2025.jpg");
  assert.match(guide.imageAlt, /31 October 2025.*does not show.*2026 installation/);
  assert.match(guide.socialImageAlt, /CC BY-SA 4\.0/);
  assert.equal(guide.imageCredit?.author, "Luisalvaz");
  assert.equal(guide.imageCredit?.license, "CC BY-SA 4.0");
  assert.equal(guide.imageCredit?.licenseUrl, "https://creativecommons.org/licenses/by-sa/4.0/");
  assert.equal(existsSync(new URL(`../public${guide.imageSrc}`, import.meta.url)), true);
});

test("seasonal homepage link expires after the listed event window without displacing the current lead guide", () => {
  assert.ok(guide);
  assert.equal(isHomepageTravelGuideLinkActive(guide, new Date("2026-11-04T23:59:00-06:00")), true);
  assert.equal(isHomepageTravelGuideLinkActive(guide, new Date("2026-11-05T00:01:00-06:00")), false);
  assert.equal(getFeaturedTravelGuide(new Date("2026-10-31T12:00:00+08:00")).path, "/guides/philippines/cebu-pacific-undas-2026-flight-checklist");
});

test("guide copy separates scheduled 2026 details, older 2025 route information and unannounced access details", () => {
  const article = readFileSync(new URL("../src/pages/MexicoDayOfTheDeadGuide.tsx", import.meta.url), "utf8");
  assert.match(article, /Saturday, 31 October, at 2 p\.m\. local time/);
  assert.match(article, /Diana Cazadora.*Paseo de la Reforma.*Zócalo/);
  assert.match(article, /2025 parade/);
  assert.match(article, /No 2026 parade-specific street closure or Metro\/Metrobús service plan/);
  assert.match(article, /does not yet specify accessible viewing areas/);
  assert.match(article, /29 October–2 November/);
  assert.match(article, /29 October–4 November/);
  assert.match(article, /Sources checked/);
  assert.match(article, /Published<\/dt><dd><time dateTime=\{guide\.publishedAt\}>\{dateLabel\(guide\.publishedAt\)\}<\/time>/);
  assert.match(article, /data-seo-published=\{guide\.publishedAt\}/);
  const staticSeo = readFileSync(new URL("../scripts/generate-static-seo.ts", import.meta.url), "utf8");
  assert.match(staticSeo, /publishedAt: mexicoDayGuide\.publishedAt/);
  assert.match(staticSeo, /datePublished: mexicoDayGuide\.publishedAt/);
});

test("guide social image uses the dated archival photo on production and preview origins", () => {
  assert.ok(guide?.imageSrc);
  assert.equal(getSocialImageUrl(guide.imageSrc), `${SITE_ORIGIN}${guide.imageSrc}`);
  assert.equal(getSocialImageUrl(guide.imageSrc, "https://aerogo-preview.vercel.app"), `https://aerogo-preview.vercel.app${guide.imageSrc}`);
});

test("local previews use their own origin for social images so the new asset can be checked", () => {
  assert.ok(guide?.imageSrc);
  const previousWindow = globalThis.window;
  try {
    globalThis.window = { location: { hostname: "localhost", origin: "http://localhost:4183" } };
    assert.equal(getSocialImageUrl(guide.imageSrc), `http://localhost:4183${guide.imageSrc}`);
    globalThis.window = { location: { hostname: "127.0.0.1", origin: "http://127.0.0.1:4183" } };
    assert.equal(getSocialImageUrl(guide.imageSrc), `http://127.0.0.1:4183${guide.imageSrc}`);
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});
