import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { getFeaturedTravelGuide, travelGuides } from "../src/data/travelGuides.ts";

const guidePath = "/guides/europe/ees-etias-entry-rules-2026";
const articlePath = new URL("../src/pages/EuropeEesEtiasGuide.tsx", import.meta.url);
const article = readFileSync(articlePath, "utf8");
const metadata = readFileSync(new URL("../scripts/generate-static-seo.ts", import.meta.url), "utf8");

test("Europe EES/ETIAS guide has one route and separate first-publication and source-check dates", () => {
  const guide = travelGuides.find((item) => item.path === guidePath);
  assert.ok(guide);
  assert.equal(travelGuides.filter((item) => item.path === guidePath).length, 1);
  assert.equal(guide.publishedAt, "2026-10-27");
  assert.equal(guide.sourcesCheckedAt, "2026-10-27");
  assert.equal(guide.imageSrc, "/images/guides/europe/ees-etias-2026.png");
  assert.equal(guide.socialImageSrc, guide.imageSrc);
  assert.match(guide.imageAlt, /original AeroGo editorial illustration/i);
  assert.equal(getFeaturedTravelGuide(new Date("2026-10-27T12:00:00+08:00")).path, "/guides/philippines/cebu-pacific-undas-2026-flight-checklist");
});

test("guide distinguishes current EES operation from unopened ETIAS and explains differing launch windows", () => {
  assert.match(article, /fully operational since 10 April 2026/);
  assert.match(article, /applications are not being accepted/);
  assert.match(article, /last quarter of 2026/);
  assert.match(article, /planned for 2027/);
  assert.match(article, /There is no confirmed start date/);
  assert.match(article, /Neither system replaces a visa/);
  assert.match(article, /not a visa and does not guarantee admission/);
});

test("guide explains EES eligibility, biometrics, country scope, and internationally relevant examples", () => {
  assert.match(article, /non-EU nationals on a short stay/);
  assert.match(article, /four fingerprints/);
  assert.match(article, /children under 12/);
  assert.match(article, /Optional advance registration/);
  assert.match(article, /not an EES application and does not replace the border check/);
  assert.match(article, /separate from ETIAS/);
  assert.match(article, /currently lists Sweden and Portugal/);
  assert.match(article, /United States, Canadian and Australian nationals/);
  assert.match(article, /Indian and Philippine nationals/);
  assert.match(article, /29 European countries/);
  assert.match(article, /30 countries/);
  assert.match(article, /Ireland is outside both systems/);
  assert.match(article, /Cyprus is an EU member but is not currently part of EES/);
});

test("official references and source-check date remain separate from article publication metadata", () => {
  for (const url of [
    "https://home-affairs.ec.europa.eu/policies/schengen/smart-borders/entry-exit-system_en",
    "https://travel-europe.europa.eu/ees/faq",
    "https://travel-europe.europa.eu/ees/Travel-to-Europe-mobile-app.html",
    "https://travel-europe.europa.eu/etias/faq",
    "https://home-affairs.ec.europa.eu/news/main-differences-between-ees-and-etias-what-travellers-need-know-2026-04-28_en",
    "https://www.gov.pl/web/denmark/introduction-of-etias-in-2027",
    "https://home-affairs.ec.europa.eu/policies/schengen/visa-policy_en",
  ]) assert.ok(article.includes(url), `missing source URL: ${url}`);
  assert.match(article, /2026-10-27/);
  assert.match(article, /<strong>Published:<\/strong>\s*<time dateTime=\{guide\.publishedAt\}>/);
  assert.match(article, /<strong>Official information checked:<\/strong>\s*<time dateTime=\{guide\.sourcesCheckedAt\}>/);
  assert.match(metadata, /path: europeEesGuide\.path,[\s\S]*?type: "article",[\s\S]*?mainEntityOfPage/);
  const europeMetadata = metadata.match(/path: europeEesGuide\.path,[\s\S]*?\n  },/)?.[0] ?? "";
  assert.match(europeMetadata, /publishedAt: europeEesGuide\.publishedAt/);
  assert.match(europeMetadata, /datePublished: europeEesGuide\.publishedAt/);
  assert.match(article, /datePublished: guide\.publishedAt/);
});
