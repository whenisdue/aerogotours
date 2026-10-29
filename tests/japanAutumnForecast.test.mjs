import test from "node:test";
import assert from "node:assert/strict";
import { getFeaturedTravelGuide, travelGuides } from "../src/data/travelGuides.ts";
import { jmcCityForecasts, jmcForecastPublishedAt, japanAutumnForecastCheckedAt, jwaLocationForecasts, jwaSecondForecastPublishedAt } from "../src/data/japanAutumnForecast.ts";

test("Japan autumn guide has distinct publication and source-check dates, a licensed image, and the canonical route", () => {
  const guide = travelGuides.find((item) => item.path === "/guides/japan/autumn-leaves-2026");
  assert.ok(guide);
  assert.equal(guide.publishedAt, "2026-10-26");
  assert.equal(guide.sourcesCheckedAt, japanAutumnForecastCheckedAt);
  assert.equal(guide.imageSrc, "/images/guides/japan-autumn/kiyomizu-dera-kyoto-2016.jpg");
  assert.equal(guide.imageCredit?.license, "CC BY-SA 4.0");
  assert.equal(guide.imageCredit?.licenseUrl, "https://creativecommons.org/licenses/by-sa/4.0");
  assert.ok(travelGuides.some((item) => item.path === guide.path), "the evergreen Japan guide remains available in the directory");
  assert.equal(getFeaturedTravelGuide(new Date("2026-11-04T00:00:00+08:00")).path, guide.path);
});

test("JMC city table contains the 11 requested cities and their October 1 maple and ginkgo forecasts", () => {
  assert.equal(jmcForecastPublishedAt, "2026-10-01");
  assert.deepEqual(jmcCityForecasts.map(({ city }) => city), ["Sapporo", "Aomori", "Sendai", "Tokyo", "Nagano", "Kanazawa", "Nagoya", "Osaka", "Kyoto", "Hiroshima", "Fukuoka"]);
  assert.deepEqual(jmcCityForecasts.map(({ redMaple, yellowGinkgo }) => [redMaple, yellowGinkgo]), [
    ["Nov 4", "Nov 3"], ["Nov 13", "Nov 5"], ["Nov 24", "Nov 29"], ["Nov 28", "Nov 26"],
    ["Nov 21", "Nov 14"], ["Nov 30", "Nov 10"], ["Dec 2", "Nov 17"], ["Dec 4", "Nov 24"],
    ["Dec 11", "Nov 27"], ["Nov 28", "Nov 21"], ["Dec 7", "Nov 28"],
  ]);
});

test("JWA spot timing remains separately dated from the JMC sample-tree city forecast", () => {
  assert.equal(jwaSecondForecastPublishedAt, "2026-10-14");
  assert.deepEqual(jwaLocationForecasts, [{ place: "Kyoto (Arashiyama)", viewingWindowStarts: "Nov 13", forecastPublishedAt: "2026-10-14" }]);
  assert.notEqual(jwaLocationForecasts[0].viewingWindowStarts, jmcCityForecasts.find(({ city }) => city === "Kyoto")?.redMaple);
});
