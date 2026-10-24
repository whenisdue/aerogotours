import test from "node:test";
import assert from "node:assert/strict";
import {
  filterTravelUpdates,
  getActiveTravelUpdates,
  getArchivedTravelUpdates,
  getFeaturedTravelUpdate,
  getHomepageTravelUpdates,
  getTravelUpdateBySlug,
  isArchivedTravelUpdate,
  travelUpdates,
} from "../src/data/travelUpdates.ts";
import { buildTravelNewsStructuredData } from "../src/utils/newsSeo.ts";
import { getSocialImageUrl } from "../src/utils/siteMetadata.ts";

const validCategories = new Set([
  "events-experiences",
  "food-experiences",
  "flights-airports",
  "travel-requirements",
  "deals-savings",
  "destination-tips",
]);

const september30Noon = new Date("2026-09-30T12:00:00+08:00");
const october2Noon = new Date("2026-10-02T12:00:00+08:00");
const october3Noon = new Date("2026-10-03T12:00:00+08:00");
const october5Noon = new Date("2026-10-05T12:00:00+08:00");
const october14Noon = new Date("2026-10-14T12:00:00+08:00");
const october15Noon = new Date("2026-10-15T12:00:00+08:00");
const october17Noon = new Date("2026-10-17T12:00:00+08:00");

test("expired event stories stay accessible in the archive without entering latest", () => {
  const now = new Date("2026-10-21T12:00:00+08:00");
  const slug = "cordillera-festival-of-festivals-baguio-2026";
  const archived = getArchivedTravelUpdates(now);
  assert.ok(archived.some((update) => update.slug === slug));
  assert.equal(getActiveTravelUpdates(now).some((update) => update.slug === slug), false);
  assert.equal(isArchivedTravelUpdate(getTravelUpdateBySlug(slug), now), true);
  assert.ok(archived.every((update) => getTravelUpdateBySlug(update.slug) === update));
  assert.ok(archived.every((update) => update.expiresAt && new Date(update.expiresAt) <= now));
});

test("news schema uses genuine publication and revision dates only", () => {
  const origin = "https://aerogotours.com";
  const previewOrigin = "https://aerogotours-preview.vercel.app";
  const original = getTravelUpdateBySlug("pal-manila-saipan-flights-october-2026");
  const revised = getTravelUpdateBySlug("thailand-visa-free-stay-30-days-filipino-passports-2026");
  assert.equal(revised.effectiveAt, "2026-09-15");
  const first = buildTravelNewsStructuredData(original, origin);
  const second = buildTravelNewsStructuredData(revised, origin);
  const preview = buildTravelNewsStructuredData(original, origin, previewOrigin);
  assert.equal(first["@graph"][0].datePublished, original.publishedAt);
  assert.equal(Object.hasOwn(first["@graph"][0], "dateModified"), false);
  assert.equal(second["@graph"][0].dateModified, revised.updatedAt);
  assert.equal(first["@graph"][1].itemListElement[2].item, `${origin}/travel-updates/${original.slug}`);
  assert.equal(preview["@graph"][0].image, getSocialImageUrl(original.image.src, previewOrigin));
  assert.equal(preview["@graph"][0].mainEntityOfPage["@id"], `${origin}/travel-updates/${original.slug}`);
  assert.equal(preview["@graph"][0].publisher.url, origin);
});

test("Typhoon Champi update preserves its archive while separating October 23 totals from October 24 airline notices", () => {
  const slug = "typhoon-champi-taiwan-flight-disruptions-october-2026";
  const update = getTravelUpdateBySlug(slug);
  const now = new Date("2026-10-24T12:00:00+08:00");
  const copy = update?.body.map((block) => block.text ?? block.items?.join(" ") ?? "").join(" ") ?? "";

  assert.ok(update);
  assert.equal(update.publishedAt, "2026-10-23");
  assert.equal(update.expiresAt, "2026-10-25T00:00:00+08:00");
  assert.equal(update.updatedAt, "2026-10-24");
  assert.equal(update.listingImage?.src, "/images/news/typhoon-champi-travel-news-2026.png");
  assert.equal(update.socialImage?.src, update.listingImage.src);
  assert.equal(update.listingImage.width, 1672);
  assert.equal(update.listingImage.height, 941);
  assert.ok(update.image.src.endsWith("typhoon-champi-flight-advisory-2026.svg"));
  assert.match(update.image.alt, /historical October 23.*checked October 24/);
  assert.match(update.summary, /Notices published October 23 for October 24 flights/);
  assert.ok(getHomepageTravelUpdates(now).some((item) => item.slug === slug));
  assert.equal(getHomepageTravelUpdates(now).find((item) => item.slug === slug)?.updatedAt, "2026-10-24");
  assert.equal(getFeaturedTravelUpdate(now)?.slug, slug);
  assert.match(copy, /Updated and re-verified October 24, 2026/);
  assert.match(copy, /Originally published October 23, 2026/);
  assert.match(copy, /Notices published on Friday, October 23 for Saturday, October 24/);
  assert.match(copy, /JX789 from Taoyuan \(TPE\) to Clark \(CRK\) was delayed for October 24—not cancelled/);
  assert.match(copy, /JX761 \(Taoyuan–Jakarta\)/);
  assert.match(copy, /Tigerair Taiwan/);
  assert.match(copy, /IT230\/231 \(Okinawa\)/);
  assert.match(copy, /AirAsia Group/);
  assert.match(copy, /730 days/);
  assert.match(copy, /within 30 days for AK, FD and Z2/);
  assert.match(copy, /977 cancellations from Thursday.*through 10 AM Friday/);
  assert.match(copy, /262 domestic and 715 international and cross-strait/);
  assert.match(copy, /more than 350 international flights/);
  assert.match(copy, /different reports with different stated periods and categories/);
  assert.match(copy, /separate Reuters report published October 24, Taiwan’s transport ministry said 242 flights were cancelled on Saturday, October 24, compared with almost 1,000 on Friday, October 23/);
  assert.match(copy, /separately reported Saturday snapshot; do not add it to, or treat it as a replacement for, the October 23 Reuters and CNA figures/);
  assert.match(copy, /does not confirm recovery for STARLUX JX789 Taoyuan–Clark or any Manila–Taipei flight/);
  assert.match(copy, /SQ876 and SQ878/);
  assert.match(copy, /SQ877 and SQ879/);
  assert.match(copy, /No blanket Manila–Taipei cancellation has been established/);
  assert.match(copy, /reported STARLUX JX789 flight runs from Taoyuan to Clark, not Manila/);
  assert.ok(update.sources.every((source) => (source.recheckedAt ?? source.accessedAt) === "2026-10-24"));
  assert.ok(update.sources.some((source) => source.accessedAt === "2026-10-23" && source.recheckedAt === "2026-10-24"));
  assert.ok(update.sources.some((source) => source.publisher?.startsWith("Reuters") && source.url.includes("marketscreener.com")));
  assert.ok(update.sources.some((source) => source.publisher === "Reuters" && source.url === "https://www.reuters.com/business/environment/typhoon-champi-sweeps-past-taiwan-one-dead-500-injured-2026-10-24/" && source.accessedAt === "2026-10-24"));
  assert.ok(update.sources.some((source) => source.publisher?.includes("Central News Agency") && source.url.includes("202610230007")));
  const structuredData = buildTravelNewsStructuredData(update, "https://aerogotours.com");
  assert.equal(structuredData["@graph"][0].datePublished, "2026-10-23");
  assert.equal(structuredData["@graph"][0].dateModified, "2026-10-24");
  assert.match(structuredData["@graph"][0].image, /typhoon-champi-travel-news-2026\.png$/);
  assert.equal(isArchivedTravelUpdate(update, new Date("2026-10-24T23:59:59+08:00")), false);
  const archiveDate = new Date("2026-10-25T00:00:00+08:00");
  assert.equal(isArchivedTravelUpdate(update, archiveDate), true);
  assert.ok(update.archiveNotice.includes("does not confirm that flight operations have returned to normal"));
  assert.ok(getArchivedTravelUpdates(archiveDate).some((item) => item.slug === slug));
  assert.equal(getHomepageTravelUpdates(archiveDate).some((item) => item.slug === slug), false);
  assert.equal(getTravelUpdateBySlug(slug), update);
});

test("travel update slugs are unique and records have the required fields", () => {
  const slugs = travelUpdates.map((update) => update.slug);
  assert.equal(new Set(slugs).size, slugs.length);

  for (const update of travelUpdates) {
    assert.ok(update.id);
    assert.ok(update.slug);
    assert.ok(update.headline);
    assert.ok(update.summary);
    assert.ok(update.destination);
    assert.ok(update.country);
    assert.ok(validCategories.has(update.category));
    assert.match(update.publishedAt, /^\d{4}-\d{2}-\d{2}/);
    assert.ok(update.image.src);
    assert.ok(update.image.alt);
    assert.ok(update.body.length > 0);
    assert.ok(update.sources.length > 0);
    assert.ok(update.sources.every((source) => source.url.startsWith("https://")));
  }
});

test("published stories remain in current listings and the homepage follows recency", () => {
  const active = getActiveTravelUpdates(october2Noon);
  assert.deepEqual(active.slice(0, 4).map((update) => update.slug), [
    "wakatobi-wave-festival-2026",
    "geumsan-world-k-insam-festival-2026",
    "asia-pacific-traditional-arts-festival-taiwan-2026",
    "lego-experience-the-thrill-singapore-2026",
  ]);
  assert.deepEqual(getHomepageTravelUpdates(october2Noon).map((update) => update.slug), [
    "wakatobi-wave-festival-2026",
    "geumsan-world-k-insam-festival-2026",
    "asia-pacific-traditional-arts-festival-taiwan-2026",
  ]);
  assert.equal(getFeaturedTravelUpdate(october2Noon)?.slug, "wakatobi-wave-festival-2026");
  assert.deepEqual(getHomepageTravelUpdates(september30Noon).map((update) => update.slug), [
    "lego-experience-the-thrill-singapore-2026",
    "festival-pesona-raja-ampat-2026",
    "kasanggayahan-festival-sorsogon-2026",
  ]);
  assert.equal(getTravelUpdateBySlug("japan-chiba-rail-disruptions-typhoon-25-2026")?.featured, false);
  assert.equal(getTravelUpdateBySlug("japan-chiba-rail-disruptions-typhoon-25-2026")?.expiresAt, undefined);
  assert.ok(active.some((update) => update.slug === "lego-experience-the-thrill-singapore-2026"));
  assert.ok(active.some((update) => update.slug === "festival-pesona-raja-ampat-2026"));
  assert.ok(active.some((update) => update.slug === "kasanggayahan-festival-sorsogon-2026"));
  assert.ok(active.some((update) => update.slug === "wayang-jogja-night-carnival-2026"));
  assert.ok(active.some((update) => update.slug === "singapore-grand-prix-season-experiences-2026"));
  assert.equal(active.some((update) => update.slug === "bangkok-airport-travel-update-september-2026"), false);
  assert.ok(active.some((update) => update.slug === "bangkok-royal-barge-rehearsal-october-2-2026"));
  assert.ok(active.some((update) => update.slug === "central-highlands-gong-culture-festival-vietnam-2026"));
  assert.equal(active.some((update) => update.slug === "lapay-bantigue-dance-festival-masbate-2026"), false);
  assert.ok(active.some((update) => update.slug === "pal-manila-delhi-mumbai-flights-2026"));
  assert.equal(active.some((update) => update.slug === "hong-kong-mid-autumn-k-festival-2026"), false);
  assert.equal(active.some((update) => update.slug === "korea-chuseok-2026-travel-guide"), false);
  assert.equal(active.some((update) => update.slug === "seoul-chuseok-free-attractions-holiday-schedule-2026"), false);
  assert.equal(active.some((update) => update.slug === "macao-international-fireworks-september-25-2026"), false);
  assert.equal(active.some((update) => update.slug === "kuala-lumpur-autumn-music-cultural-festival-2026"), false);
  assert.equal(active.some((update) => update.slug === "sandeq-silumba-west-sulawesi-2026"), false);
  assert.equal(active.some((update) => update.slug === "tourism-expo-japan-public-days-tokyo-2026"), false);
  assert.ok(active.some((update) => update.slug === "wonderful-indonesia-gastronomy-2026"));
});

test("an older featured flag cannot override the newest homepage story", () => {
  const thailand = getTravelUpdateBySlug("thailand-visa-free-stay-30-days-filipino-passports-2026");
  assert.equal(thailand?.featured, true);
  assert.equal(getFeaturedTravelUpdate(september30Noon)?.slug, "lego-experience-the-thrill-singapore-2026");
  assert.equal(getHomepageTravelUpdates(september30Noon)[0]?.slug, "lego-experience-the-thrill-singapore-2026");
});

test("future-dated stories enter the homepage on their Manila publication date", () => {
  const beforePublication = new Date("2026-10-01T23:59:59+08:00");
  const newSlugs = [
    "wakatobi-wave-festival-2026",
    "geumsan-world-k-insam-festival-2026",
    "asia-pacific-traditional-arts-festival-taiwan-2026",
  ];

  for (const slug of newSlugs) {
    assert.ok(getTravelUpdateBySlug(slug));
    assert.equal(getActiveTravelUpdates(beforePublication).some((update) => update.slug === slug), false);
    assert.equal(getHomepageTravelUpdates(beforePublication).some((update) => update.slug === slug), false);
    assert.equal(getActiveTravelUpdates(new Date("2026-10-02T00:00:00+08:00")).some((update) => update.slug === slug), true);
  }
  assert.deepEqual(getHomepageTravelUpdates(october2Noon).slice(0, 3).map((update) => update.slug), newSlugs);
});

test("October 15 event updates lead deterministically and expire at destination-local midnight", () => {
  const cases = [
    { slug: "masskara-festival-bacolod-grand-weekend-2026", headline: "MassKara's biggest weekend begins Friday in Bacolod", destination: "Bacolod City, Negros Occidental", country: "Philippines", eventStartAt: "2026-10-16", eventEndAt: "2026-10-18", expiresAt: "2026-10-19T00:00:00+08:00", zone: "+08:00" },
    { slug: "sun-moon-lake-fireworks-music-october-2026", headline: "Fireworks and live music return to Sun Moon Lake this Saturday", destination: "Sun Moon Lake, Nantou County", country: "Taiwan", eventStartAt: "2026-10-17", eventEndAt: "2026-10-18", expiresAt: "2026-10-19T00:00:00+08:00", zone: "+08:00" },
    { slug: "nagoya-festival-2026-parade-change-free-attractions", headline: "Nagoya Festival is on this weekend, but its famous parade is canceled", destination: "Nagoya, Aichi Prefecture", country: "Japan", eventStartAt: "2026-10-17", eventEndAt: "2026-10-18", expiresAt: "2026-10-19T00:00:00+09:00", zone: "+09:00" },
  ];
  const slugs = cases.map(({ slug }) => slug);
  const beforePublication = new Date("2026-10-14T23:59:59+08:00");
  const active = getActiveTravelUpdates(october15Noon);

  assert.deepEqual(active.slice(0, 3).map((update) => update.slug), slugs);
  assert.deepEqual(getHomepageTravelUpdates(october15Noon).map((update) => update.slug), slugs);
  assert.equal(getFeaturedTravelUpdate(october15Noon)?.slug, slugs[0]);

  for (const { slug, headline, destination, country, eventStartAt, eventEndAt, expiresAt, zone } of cases) {
    const update = getTravelUpdateBySlug(slug);
    assert.ok(update);
    assert.equal(update.headline, headline);
    assert.equal(update.publishedAt, "2026-10-15");
    assert.equal(update.destination, destination);
    assert.equal(update.country, country);
    assert.equal(update.category, "events-experiences");
    assert.equal(update.eventStartAt, eventStartAt);
    assert.equal(update.eventEndAt, eventEndAt);
    assert.equal(update.expiresAt, expiresAt);
    assert.equal(getActiveTravelUpdates(beforePublication).some((activeUpdate) => activeUpdate.slug === slug), false);
    assert.ok(getTravelUpdateBySlug(slug));
    assert.ok(getActiveTravelUpdates(new Date(`2026-10-18T23:59:59${zone}`)).some((activeUpdate) => activeUpdate.slug === slug));
    assert.equal(getActiveTravelUpdates(new Date(expiresAt)).some((activeUpdate) => activeUpdate.slug === slug), false);
    assert.ok(update.sources.every((source) => source.accessedAt === "2026-10-15"));
    assert.ok(update.sources.every((source) => source.url.startsWith("https://")));
    assert.deepEqual(filterTravelUpdates(active, destination, "events-experiences").map((filtered) => filtered.slug), [slug]);
    assert.ok(filterTravelUpdates(active, "all", "events-experiences").some((filtered) => filtered.slug === slug));
  }

  const masskara = getTravelUpdateBySlug(cases[0].slug);
  const masskaraCopy = [masskara?.summary, ...(masskara?.body.map((block) => block.text ?? block.items?.join(" ") ?? "") ?? [])].join(" ");
  assert.match(masskaraCopy, /October 16–18/);
  assert.match(masskaraCopy, /The Upper East/);
  assert.match(masskaraCopy, /Araneta Street/);
  assert.match(masskaraCopy, /reclamation area by SM City Bacolod/);
  assert.match(masskaraCopy, /not the 2026 arena site/);
  assert.match(masskaraCopy, /October 25/);
  assert.match(masskaraCopy, /B.S. Aquino Drive to SSS-Cottage Road/);
  assert.match(masskaraCopy, /10:00 AM to 9:00 PM/);
  assert.match(masskaraCopy, /separate areas and do not mean every Bacolod road is closed/);
  assert.match(masskaraCopy, /do not confirm a general admission price/);

  const sunMoonLake = getTravelUpdateBySlug(cases[1].slug);
  const sunMoonLakeCopy = [sunMoonLake?.summary, ...(sunMoonLake?.body.map((block) => block.text ?? block.items?.join(" ") ?? "") ?? [])].join(" ");
  assert.match(sunMoonLakeCopy, /6:30 to 9:30 PM at Zhongxing Parking Lot/);
  assert.match(sunMoonLakeCopy, /coordinated with the live music/);
  assert.match(sunMoonLakeCopy, /Xiangshan Visitor Center/);
  assert.match(sunMoonLakeCopy, /8:00 AM to 11:00 PM/);
  assert.match(sunMoonLakeCopy, /not mean every road around Sun Moon Lake is closed/);
  assert.match(sunMoonLakeCopy, /flexible timing/);

  const nagoya = getTravelUpdateBySlug(cases[2].slug);
  const nagoyaCopy = [nagoya?.summary, ...(nagoya?.body.map((block) => block.text ?? block.items?.join(" ") ?? "") ?? [])].join(" ");
  assert.match(nagoyaCopy, /festival is still happening/);
  assert.match(nagoyaCopy, /street parade is canceled/);
  assert.match(nagoyaCopy, /Asian Para Games torch relay and opening ceremony/);
  assert.match(nagoyaCopy, /Nagoya Castle is free to enter on both October 17 and 18/);
  assert.match(nagoyaCopy, /city lists 12 free-admission facilities/);
  assert.match(nagoyaCopy, /Noritake Forest/);
  assert.match(nagoyaCopy, /Toyota Commemorative Museum/);
  assert.match(nagoyaCopy, /no 2026 procession is planned/);

  const afterWeekend = new Date("2026-10-19T01:00:00+09:00");
  for (const slug of slugs) {
    assert.equal(getActiveTravelUpdates(afterWeekend).some((update) => update.slug === slug), false);
    assert.equal(getHomepageTravelUpdates(afterWeekend).some((update) => update.slug === slug), false);
  }
  assert.equal(getFeaturedTravelUpdate(afterWeekend)?.slug, getActiveTravelUpdates(afterWeekend)[0]?.slug);
  assert.equal(getFeaturedTravelUpdate(afterWeekend)?.slug, "pal-riyadh-flight-suspension-november-2026");
});

test("October 2 festival updates use verified facts, preserve filters and expire after their final dates", () => {
  const cases = [
    { slug: "wakatobi-wave-festival-2026", headline: "Wakatobi’s maritime festival begins today", eventStartAt: "2026-10-02", eventEndAt: "2026-10-04", expiresAt: "2026-10-05T00:00:00+08:00", destination: "Wakatobi, Southeast Sulawesi" },
    { slug: "geumsan-world-k-insam-festival-2026", headline: "Korea’s Geumsan ginseng festival begins today", eventStartAt: "2026-10-02", eventEndAt: "2026-10-11", expiresAt: "2026-10-12T00:00:00+08:00", destination: "Geumsan, Chungcheongnam-do" },
    { slug: "asia-pacific-traditional-arts-festival-taiwan-2026", headline: "Asia-Pacific Traditional Arts Festival begins in Taiwan October 3", eventStartAt: "2026-10-03", eventEndAt: "2026-10-11", expiresAt: "2026-10-12T00:00:00+08:00", destination: "Yilan" },
  ];

  for (const { slug, headline, eventStartAt, eventEndAt, expiresAt, destination } of cases) {
    const update = getTravelUpdateBySlug(slug);
    assert.ok(update);
    assert.equal(update.headline, headline);
    assert.equal(update.publishedAt, "2026-10-02");
    assert.equal(update.destination, destination);
    assert.equal(update.category, "events-experiences");
    assert.equal(update.eventStartAt, eventStartAt);
    assert.equal(update.eventEndAt, eventEndAt);
    assert.equal(update.expiresAt, expiresAt);
    assert.ok(getActiveTravelUpdates(october2Noon).some((activeUpdate) => activeUpdate.id === update.id));
    assert.ok(getActiveTravelUpdates(new Date(new Date(expiresAt).getTime() - 1)).some((activeUpdate) => activeUpdate.id === update.id));
    assert.equal(getActiveTravelUpdates(new Date(expiresAt)).some((activeUpdate) => activeUpdate.id === update.id), false);
  }

  const active = getActiveTravelUpdates(october2Noon);
  assert.deepEqual(filterTravelUpdates(active, "Wakatobi, Southeast Sulawesi", "events-experiences").map((update) => update.slug), ["wakatobi-wave-festival-2026"]);
  assert.deepEqual(filterTravelUpdates(active, "Geumsan, Chungcheongnam-do", "events-experiences").map((update) => update.slug), ["geumsan-world-k-insam-festival-2026"]);
  assert.deepEqual(filterTravelUpdates(active, "Yilan", "events-experiences").map((update) => update.slug), ["asia-pacific-traditional-arts-festival-taiwan-2026"]);

  const wakatobi = getTravelUpdateBySlug("wakatobi-wave-festival-2026");
  assert.ok(wakatobi);
  const wakatobiCopy = [wakatobi.summary, ...wakatobi.body.map((block) => block.text ?? block.items?.join(" ") ?? "")].join(" ");
  assert.match(wakatobiCopy, /admission as free/);
  assert.match(wakatobiCopy, /tourism exhibitions/);
  assert.match(wakatobiCopy, /National Priority Tourist Destinations/);
  assert.match(wakatobiCopy, /standalone event description still says November/);
  assert.ok(wakatobi.sources.some((source) => source.url === "https://www.indonesia.travel/kr/en/events/event-detail/wakatobi-wonderful-festival-2026"));
  assert.ok(wakatobi.sources.some((source) => source.url === "https://www.wakatobitourism.com/events/"));

  const geumsan = getTravelUpdateBySlug("geumsan-world-k-insam-festival-2026");
  assert.ok(geumsan);
  const geumsanCopy = geumsan.body.map((block) => block.text ?? block.items?.join(" ") ?? "").join(" ");
  assert.match(geumsanCopy, /Insam is the Korean word for ginseng/);
  assert.match(geumsanCopy, /performance hours of 10:00 a\.m\. to 9:00 p\.m\./);
  assert.match(geumsanCopy, /fees varying by program/);
  assert.doesNotMatch(geumsanCopy, /ginseng (?:cures?|treats?|prevents?) /i);
  assert.ok(geumsan.sources.some((source) => source.url === "https://english.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=1593098"));
  assert.ok(geumsan.sources.some((source) => source.url === "https://english.visitkorea.or.kr/svc/sp/festivals/contentsView.do?dataSetId=297&menuSn=1040&vcontsId=104212"));

  const yilan = getTravelUpdateBySlug("asia-pacific-traditional-arts-festival-taiwan-2026");
  assert.ok(yilan);
  const yilanCopy = yilan.body.map((block) => block.text ?? block.items?.join(" ") ?? "").join(" ");
  assert.match(yilanCopy, /Where All Waters Meet/);
  assert.match(yilanCopy, /Taiwan, India, Indonesia, Japan and South Korea/);
  assert.match(yilanCopy, /advance registration/);
  assert.match(yilanCopy, /park admission must be purchased separately/i);
  assert.match(yilanCopy, /NT\$150 per person/);
  assert.ok(yilan.sources.some((source) => source.url === "https://festival.ncfta.gov.tw/APTAF/zh-tw"));
  assert.ok(yilan.sources.some((source) => source.url === "https://www.px-sunmake.org.tw/info"));
  assert.ok(yilan.sources.some((source) => source.url === "https://www.accupass.com/event/2607150609041594653775"));
});

test("October 3 updates lead by publication date, preserve filters and expire after their event dates", () => {
  const cases = [
    { slug: "nantou-global-tea-expo-2026", headline: "Nantou Global Tea Expo begins in Central Taiwan today", destination: "Nantou County", country: "Taiwan", eventStartAt: "2026-10-03", eventEndAt: "2026-10-11", expiresAt: "2026-10-12T00:00:00+08:00" },
    { slug: "gangnam-festival-seoul-2026", headline: "Gangnam Festival opens today with Grand Parade on Dosan-daero", destination: "Gangnam, Seoul", country: "South Korea", eventStartAt: "2026-10-03", eventEndAt: "2026-10-05", expiresAt: "2026-10-06T00:00:00+08:00" },
    { slug: "taichung-ocean-sightseeing-season-2026", headline: "Taichung’s new coastal landmark takes center stage this weekend", destination: "Taichung", country: "Taiwan", eventStartAt: "2026-10-03", eventEndAt: "2026-10-04", expiresAt: "2026-10-05T00:00:00+08:00" },
    { slug: "jamsugyo-gourmet-road-seoul-2026", headline: "More than 100 food trucks take over Seoul’s Jamsugyo Bridge Sunday", destination: "Seoul", country: "South Korea", eventStartAt: "2026-10-04", eventEndAt: "2026-10-04", expiresAt: "2026-10-05T00:00:00+08:00" },
  ];
  const slugs = cases.map(({ slug }) => slug);
  const beforePublication = new Date("2026-10-02T23:59:59+08:00");

  assert.deepEqual(getActiveTravelUpdates(october3Noon).slice(0, 4).map((update) => update.slug), slugs);
  assert.deepEqual(getHomepageTravelUpdates(october3Noon).map((update) => update.slug), slugs.slice(0, 3));
  assert.equal(getFeaturedTravelUpdate(october3Noon)?.slug, "nantou-global-tea-expo-2026");

  for (const { slug, headline, destination, country, eventStartAt, eventEndAt, expiresAt } of cases) {
    const update = getTravelUpdateBySlug(slug);
    assert.ok(update);
    assert.equal(update.headline, headline);
    assert.equal(update.publishedAt, "2026-10-03");
    assert.equal(update.destination, destination);
    assert.equal(update.country, country);
    assert.equal(update.category, "events-experiences");
    assert.equal(update.eventStartAt, eventStartAt);
    assert.equal(update.eventEndAt, eventEndAt);
    assert.equal(update.expiresAt, expiresAt);
    assert.equal(getActiveTravelUpdates(beforePublication).some((activeUpdate) => activeUpdate.id === update.id), false);
    assert.ok(getActiveTravelUpdates(october3Noon).some((activeUpdate) => activeUpdate.id === update.id));
    assert.ok(getActiveTravelUpdates(new Date(new Date(expiresAt).getTime() - 1)).some((activeUpdate) => activeUpdate.id === update.id));
    assert.equal(getActiveTravelUpdates(new Date(expiresAt)).some((activeUpdate) => activeUpdate.id === update.id), false);
    assert.ok(update.sources.every((source) => source.accessedAt === "2026-10-03"));
  }

  const active = getActiveTravelUpdates(october3Noon);
  assert.deepEqual(filterTravelUpdates(active, "Nantou County", "events-experiences").map((update) => update.slug), ["nantou-global-tea-expo-2026"]);
  assert.deepEqual(filterTravelUpdates(active, "Gangnam, Seoul", "events-experiences").map((update) => update.slug), ["gangnam-festival-seoul-2026"]);
  assert.deepEqual(filterTravelUpdates(active, "Taichung", "events-experiences").map((update) => update.slug), ["taichung-ocean-sightseeing-season-2026"]);
  assert.deepEqual(filterTravelUpdates(active, "Seoul", "events-experiences").map((update) => update.slug), [
    "jamsugyo-gourmet-road-seoul-2026",
    "free-royal-court-parade-hyundai-seoul-2026",
  ]);

  const nantou = getTravelUpdateBySlug("nantou-global-tea-expo-2026");
  assert.ok(nantou);
  const nantouCopy = [nantou.summary, ...nantou.body.map((block) => block.text ?? block.items?.join(" ") ?? "")].join(" ");
  assert.match(nantouCopy, /Chung Hsing New Village/);
  assert.match(nantouCopy, /main tea-producing area/);
  assert.match(nantouCopy, /35 themed exhibition halls and more than 200 sales booths/);
  assert.match(nantouCopy, /09:00–17:00 on weekdays and 09:00–18:00 on weekends and holidays/);
  assert.match(nantouCopy, /do not set out one admission arrangement for every area or activity/);
  assert.ok(nantou.sources.some((source) => source.url === "https://eng.taiwan.net.tw/m1.aspx?lid=081760&sNo=0002019"));
  assert.ok(nantou.sources.some((source) => source.url === "https://www.nantou.gov.tw/big5/news_content.php?cid=75&dptid=376480000&id=168742"));

  const gangnam = getTravelUpdateBySlug("gangnam-festival-seoul-2026");
  assert.ok(gangnam);
  const gangnamCopy = [gangnam.summary, ...gangnam.body.map((block) => block.text ?? block.items?.join(" ") ?? "")].join(" ");
  assert.match(gangnamCopy, /Grand Parade is scheduled for October 3, 16:00–18:00/);
  assert.match(gangnamCopy, /closed to vehicles in both directions from 00:00 on October 3 until 05:00 on Monday, October 5/);
  assert.match(gangnamCopy, /Some buses and stops are also diverted or suspended/);
  assert.match(gangnamCopy, /Use the subway where possible/);
  assert.ok(gangnam.sources.some((source) => source.url === "https://english.visitseoul.net/eventsx/The15thGangnamFestival/ENPpvlkiw"));
  assert.ok(gangnam.sources.some((source) => source.url === "https://visitgangnam.net/en/festival/notice/traffic-control"));

  const taichung = getTravelUpdateBySlug("taichung-ocean-sightseeing-season-2026");
  assert.ok(taichung);
  const taichungCopy = [taichung.summary, ...taichung.body.map((block) => block.text ?? block.items?.join(" ") ?? "")].join(" ");
  assert.match(taichungCopy, /latest Taichung City Government update and current tourism schedule place the statue donation and festival ceremony on October 3 at 09:00/);
  assert.match(taichungCopy, /An earlier city programme listed 10:00, so use the newer time/);
  assert.match(taichungCopy, /53.6 metres high including its base/);
  assert.match(taichungCopy, /Ming Hwa Yuan Arts & Cultural Group presents “The Great Immortal of Penglai” at 19:00/);
  assert.match(taichungCopy, /registration deadline was September 25/);
  assert.doesNotMatch(taichungCopy, /all (?:activities|events|admission) (?:are|is) free/i);
  assert.ok(taichung.sources.some((source) => source.url === "https://www.taichung.gov.tw/3382489/post"));
  assert.ok(taichung.sources.some((source) => source.url === "https://travel.taichung.gov.tw/zh-tw/event/activitydetail/10372"));

  const jamsugyo = getTravelUpdateBySlug("jamsugyo-gourmet-road-seoul-2026");
  assert.ok(jamsugyo);
  const jamsugyoCopy = [jamsugyo.summary, ...jamsugyo.body.map((block) => block.text ?? block.items?.join(" ") ?? "")].join(" ");
  assert.match(jamsugyoCopy, /more than 100 food trucks serving dishes from around the world/);
  assert.match(jamsugyoCopy, /dining areas for up to 800 people at a time/);
  assert.match(jamsugyoCopy, /from 12:00 noon to midnight on about 1.1 km/);
  assert.match(jamsugyoCopy, /strongly recommends public transport/);
  assert.match(jamsugyoCopy, /check the official Seoul festival notice for weather-related cancellation/);
  assert.doesNotMatch(jamsugyoCopy, /free admission|\$\d+|₩\d+/i);
  assert.ok(jamsugyo.sources.some((source) => source.url === "https://english.seoul.go.kr/car-free-jamsugyo-bridge-festival-with-cumulative-visitors-of-6-47-million-returns-with-weekly-themes-for-fall-2026/"));
});

test("October 5 updates use an intentional same-day order, preserve filters and expire after their event dates", () => {
  const cases = [
    { slug: "busan-international-film-festival-2026", headline: "Busan becomes a city of cinema tomorrow as BIFF begins", destination: "Busan", country: "South Korea", eventStartAt: "2026-10-06", eventEndAt: "2026-10-15", expiresAt: "2026-10-16T00:00:00+08:00" },
    { slug: "jinju-namgang-yudeung-festival-2026", headline: "Jinju’s Namgang River is glowing nightly through October 18", destination: "Jinju", country: "South Korea", eventStartAt: "2026-10-03", eventEndAt: "2026-10-18", expiresAt: "2026-10-19T00:00:00+08:00" },
    { slug: "matsuyama-autumn-festival-dogo-2026", headline: "Matsuyama’s autumn festival begins today, with Dogo’s famous mikoshi clash still to come", destination: "Matsuyama, Ehime", country: "Japan", eventStartAt: "2026-10-05", eventEndAt: "2026-10-07", expiresAt: "2026-10-08T00:00:00+08:00" },
    { slug: "pelicula-pelikula-manila-2026", headline: "Free Spanish film festival begins its Makati cinema program today", destination: "Makati, Metro Manila", country: "Philippines", eventStartAt: "2026-10-05", eventEndAt: "2026-10-11", expiresAt: "2026-10-12T00:00:00+08:00" },
  ];
  const slugs = cases.map(({ slug }) => slug);
  const beforePublication = new Date("2026-10-04T23:59:59+08:00");
  const active = getActiveTravelUpdates(october5Noon);

  assert.deepEqual(active.slice(0, 4).map((update) => update.slug), slugs);
  assert.deepEqual(getHomepageTravelUpdates(october5Noon).map((update) => update.slug), slugs.slice(0, 3));
  assert.equal(getFeaturedTravelUpdate(october5Noon)?.slug, "busan-international-film-festival-2026");

  for (const { slug, headline, destination, country, eventStartAt, eventEndAt, expiresAt } of cases) {
    const update = getTravelUpdateBySlug(slug);
    assert.ok(update);
    assert.equal(update.headline, headline);
    assert.equal(update.publishedAt, "2026-10-05");
    assert.equal(update.destination, destination);
    assert.equal(update.country, country);
    assert.equal(update.category, "events-experiences");
    assert.equal(update.eventStartAt, eventStartAt);
    assert.equal(update.eventEndAt, eventEndAt);
    assert.equal(update.expiresAt, expiresAt);
    assert.equal(getActiveTravelUpdates(beforePublication).some((activeUpdate) => activeUpdate.id === update.id), false);
    assert.ok(active.some((activeUpdate) => activeUpdate.id === update.id));
    assert.ok(getActiveTravelUpdates(new Date(new Date(expiresAt).getTime() - 1)).some((activeUpdate) => activeUpdate.id === update.id));
    assert.equal(getActiveTravelUpdates(new Date(expiresAt)).some((activeUpdate) => activeUpdate.id === update.id), false);
    assert.ok(update.sources.every((source) => source.accessedAt === "2026-10-05"));
  }

  assert.deepEqual(filterTravelUpdates(active, "Busan", "events-experiences").map((update) => update.slug), ["busan-international-film-festival-2026"]);
  assert.deepEqual(filterTravelUpdates(active, "Jinju", "events-experiences").map((update) => update.slug), ["jinju-namgang-yudeung-festival-2026"]);
  assert.deepEqual(filterTravelUpdates(active, "Matsuyama, Ehime", "events-experiences").map((update) => update.slug), ["matsuyama-autumn-festival-dogo-2026"]);
  assert.deepEqual(filterTravelUpdates(active, "Makati, Metro Manila", "events-experiences").map((update) => update.slug), ["pelicula-pelikula-manila-2026"]);

  const busan = getTravelUpdateBySlug("busan-international-film-festival-2026");
  const busanCopy = busan?.body.map((block) => block.text ?? block.items?.join(" ") ?? "").join(" ") ?? "";
  assert.match(busanCopy, /October 6–15/);
  assert.match(busanCopy, /18:00 at Busan Cinema Center’s Roof Theater/);
  assert.match(busanCopy, /Check the live portal for each screening’s current availability/);
  assert.ok(busan?.sources.some((source) => source.url === "https://www.biff.kr/eng/addon/10000001/page.asp?page_num=11402"));

  const jinju = getTravelUpdateBySlug("jinju-namgang-yudeung-festival-2026");
  const jinjuCopy = jinju?.body.map((block) => block.text ?? block.items?.join(" ") ?? "").join(" ") ?? "";
  assert.match(jinjuCopy, /18:00 to midnight/);
  assert.match(jinjuCopy, /Fireworks: October 9 and 17 at 20:00/);
  assert.match(jinjuCopy, /Drone light show: October 10 at 20:00 and October 17 at 19:50/);
  assert.ok(jinju?.sources.some((source) => source.url === "https://yudeung.com/info/transport?lang=en"));

  const matsuyama = getTravelUpdateBySlug("matsuyama-autumn-festival-dogo-2026");
  const matsuyamaCopy = matsuyama?.body.map((block) => block.text ?? block.items?.join(" ") ?? "").join(" ") ?? "";
  assert.match(matsuyamaCopy, /does not take place today/);
  assert.match(matsuyamaCopy, /early morning of October 7 in front of Dogo Onsen Station/);
  assert.match(matsuyamaCopy, /Public viewing is listed as free/);
  assert.ok(matsuyama?.sources.some((source) => source.url === "https://ehime.travel/en/articles/matsuyama-event-map10/"));

  const pelicula = getTravelUpdateBySlug("pelicula-pelikula-manila-2026");
  const peliculaCopy = pelicula?.body.map((block) => block.text ?? block.items?.join(" ") ?? "").join(" ") ?? "";
  assert.match(peliculaCopy, /Rondallas at 14:00, La cena at 17:00 and El cautivo at 19:30/);
  assert.match(peliculaCopy, /selection of Filipino short films at Power Plant Cinema 2 on October 11/);
  assert.match(peliculaCopy, /does not state the subtitle language/);
  assert.match(peliculaCopy, /free film screenings do not mean every workshop or talk is free/);
  assert.ok(pelicula?.sources.some((source) => source.url.includes("fbid0Qc2YEi3MLgc1mBNTtritTeQXjeSAaFxS5AwNfKVcYNzaaJdPyGeCMySmQKdyzDa4l")));
});

test("older expired stories stay out while the newest active story remains the homepage hero", () => {
  const beforeExpiry = getHomepageTravelUpdates(new Date("2026-10-14T23:59:59+08:00"));
  const atExpiry = getHomepageTravelUpdates(new Date("2026-10-19T00:00:00+08:00"));

  assert.equal(beforeExpiry[0]?.slug, "sunchang-jangryu-festival-2026");
  assert.equal(atExpiry[0]?.slug, "pal-riyadh-flight-suspension-november-2026");
  assert.equal(atExpiry.some((update) => update.slug === "sunchang-jangryu-festival-2026"), false);
  assert.equal(atExpiry.some((update) => update.slug === "festival-pinisi-bulukumba-2026"), false);
  assert.equal(beforeExpiry.some((update) => update.slug === "lego-experience-the-thrill-singapore-2026"), false);
  assert.equal(atExpiry.some((update) => update.slug === "jinju-namgang-yudeung-festival-2026"), false);
  assert.equal(atExpiry.some((update) => update.slug === "phuket-vegetarian-festival-2026"), false);
});

test("a newly added later update moves into the homepage hero automatically", () => {
  const newUpdate = {
    ...travelUpdates[0],
    id: "hypothetical-october-1-update",
    slug: "hypothetical-october-1-update",
    publishedAt: "2026-10-01",
    expiresAt: undefined,
    featured: false,
  };
  const insertAt = travelUpdates.length;
  travelUpdates.push(newUpdate);

  try {
    assert.deepEqual(getHomepageTravelUpdates(new Date("2026-10-01T12:00:00+08:00")).map((update) => update.slug), [
      "hypothetical-october-1-update",
      "lego-experience-the-thrill-singapore-2026",
      "festival-pesona-raja-ampat-2026",
    ]);
  } finally {
    travelUpdates.splice(insertAt, 1);
  }
});

test("Travel Updates listing keeps its active order through destination and category filters", () => {
  const active = getActiveTravelUpdates(september30Noon);
  const singaporeEvents = filterTravelUpdates(active, "Singapore", "events-experiences");
  const requirements = filterTravelUpdates(active, "all", "travel-requirements");

  assert.deepEqual(active.slice(0, 4).map((update) => update.slug), [
    "lego-experience-the-thrill-singapore-2026",
    "festival-pesona-raja-ampat-2026",
    "kasanggayahan-festival-sorsogon-2026",
    "wayang-jogja-night-carnival-2026",
  ]);
  assert.deepEqual(singaporeEvents.slice(0, 2).map((update) => update.slug), [
    "lego-experience-the-thrill-singapore-2026",
    "singapore-grand-prix-season-experiences-2026",
  ]);
  assert.deepEqual(requirements.map((update) => update.slug), ["thailand-visa-free-stay-30-days-filipino-passports-2026"]);
  assert.equal(active.some((update) => update.slug === "bangkok-airport-travel-update-september-2026"), false);
});

test("September 30 festival updates distinguish each event window and expire after it", () => {
  const cases = [
    { slug: "lego-experience-the-thrill-singapore-2026", eventStartAt: "2026-09-30", eventEndAt: "2026-10-17", expiresAt: "2026-10-18T00:00:00+08:00" },
    { slug: "festival-pesona-raja-ampat-2026", eventStartAt: "2026-10-01", eventEndAt: "2026-10-03", expiresAt: "2026-10-04T00:00:00+08:00" },
    { slug: "kasanggayahan-festival-sorsogon-2026", eventStartAt: "2026-10-01", eventEndAt: "2026-10-31", expiresAt: "2026-11-01T00:00:00+08:00" },
    { slug: "wayang-jogja-night-carnival-2026", eventStartAt: "2026-10-01", eventEndAt: "2026-10-07", expiresAt: "2026-10-08T00:00:00+08:00" },
  ];

  for (const { slug, eventStartAt, eventEndAt, expiresAt } of cases) {
    const update = getTravelUpdateBySlug(slug);
    assert.ok(update);
    assert.equal(update.publishedAt, "2026-09-30");
    assert.equal(update.category, "events-experiences");
    assert.equal(update.eventStartAt, eventStartAt);
    assert.equal(update.eventEndAt, eventEndAt);
    assert.equal(update.expiresAt, expiresAt);
    assert.ok(getActiveTravelUpdates(new Date(new Date(expiresAt).getTime() - 1)).some((activeUpdate) => activeUpdate.id === update.id));
    assert.equal(getActiveTravelUpdates(new Date(expiresAt)).some((activeUpdate) => activeUpdate.id === update.id), false);
  }

  const lego = getTravelUpdateBySlug("lego-experience-the-thrill-singapore-2026");
  assert.ok(lego);
  assert.equal(lego.headline, "A life-size LEGO race car experience opens in Singapore today");
  assert.ok(lego.sources.some((source) => source.url === "https://www.visitsingapore.com/whats-happening/all-happenings/events/singapore-grand-prix-season/"));
  const legoCopy = [lego.summary, ...lego.body.map((block) => block.text ?? block.items?.join(" ") ?? "")].join(" ");
  assert.match(legoCopy, /Grand Prix Season Singapore runs October 2–11/);
  assert.match(legoCopy, /Formula 1 Singapore Airlines Singapore Grand Prix weekend is October 9–11/);
  assert.match(legoCopy, /does not say whether admission charges apply.*or whether a Formula 1 race ticket is required/);

  const rajaAmpat = getTravelUpdateBySlug("festival-pesona-raja-ampat-2026");
  assert.ok(rajaAmpat);
  assert.match(rajaAmpat.summary, /October 1–3/);
  const rajaCopy = [rajaAmpat.summary, ...rajaAmpat.body.map((block) => block.text ?? block.items?.join(" ") ?? "")].join(" ");
  assert.match(rajaCopy, /lists its ticket price as free/);
  assert.match(rajaCopy, /marine-conservation activities/);
  assert.match(rajaCopy, /does not provide a specific venue, daily schedule or transport arrangements/);

  const kasanggayahan = getTravelUpdateBySlug("kasanggayahan-festival-sorsogon-2026");
  assert.ok(kasanggayahan);
  assert.match(kasanggayahan.summary, /festival month on October 1/);
  const kasanggayahanCopy = [kasanggayahan.summary, ...kasanggayahan.body.map((block) => block.text ?? block.items?.join(" ") ?? "")].join(" ");
  assert.match(kasanggayahanCopy, /October 12 at 3:00 PM/);
  assert.match(kasanggayahanCopy, /from Plaza Rizal to the Sorsogon Sports Arena/);
  assert.match(kasanggayahanCopy, /October 1 is not the parade date/);
  assert.match(kasanggayahanCopy, /Pantomina sa Tinampo/);
  assert.ok(kasanggayahan.sources.some((source) => source.url === "https://tpb.gov.ph/events/kasanggayahan-festival/"));

  const wjnc = getTravelUpdateBySlug("wayang-jogja-night-carnival-2026");
  assert.ok(wjnc);
  assert.match(wjnc.headline, /Festival week ahead of its October 7 night carnival/);
  const wjncCopy = [wjnc.summary, ...wjnc.body.map((block) => block.text ?? block.items?.join(" ") ?? "")].join(" ");
  assert.match(wjncCopy, /WJNC Festival week begins October 1 and runs through October 7/);
  assert.match(wjncCopy, /main Wayang Jogja Night Carnival takes place on October 7/);
  assert.match(wjncCopy, /all 14 kemantren/);
  assert.match(wjncCopy, /Gana Kalajaya/);
});

test("September 29 updates use the official facts and Manila expiry boundaries", () => {
  const bangkok = getTravelUpdateBySlug("bangkok-airport-travel-update-september-2026");
  assert.ok(bangkok);
  assert.equal(bangkok.headline, "Bangkok airports remain open as some journeys take longer");
  assert.equal(bangkok.publishedAt, "2026-09-29");
  assert.equal(bangkok.category, "destination-tips");
  assert.equal(bangkok.expiresAt, "2026-09-30T00:00:00+08:00");
  const bangkokCopy = [bangkok.summary, ...bangkok.body.map((block) => block.text ?? block.items?.join(" ") ?? "")].join(" ");
  assert.match(bangkokCopy, /remain open and operational/);
  assert.match(bangkokCopy, /Airport Rail Link, SRT Red Line, BTS Skytrain and MRT are operating/);
  assert.match(bangkokCopy, /Some Eastern Line sections remain affected/);
  assert.match(bangkokCopy, /does not give a specific number of extra minutes or hours/);
  assert.doesNotMatch(bangkokCopy, /Lat Krabang|Motorway No\. 7|Burapha Withi|three hours|2–3 hours|locali[sz]ed flooding/i);
  assert.ok(bangkok.sources.some((source) => source.url === "https://www.tatnews.org/2026/09/weather-and-travel-conditions-in-bangkok-and-surrounding-areas-visitor-information/"));

  const barge = getTravelUpdateBySlug("bangkok-royal-barge-rehearsal-october-2-2026");
  assert.ok(barge);
  assert.equal(barge.headline, "Travelers can watch Thailand’s Royal Barges rehearse this Friday");
  assert.equal(barge.eventStartAt, "2026-10-02");
  assert.equal(barge.eventEndAt, "2026-10-02");
  assert.equal(barge.expiresAt, "2026-10-03T00:00:00+08:00");
  const bargeCopy = barge.body.map((block) => block.text ?? block.items?.join(" ") ?? "").join(" ");
  assert.match(bargeCopy, /This is a rehearsal, not the actual procession/);
  assert.match(bargeCopy, /approximately 14:30/);
  assert.match(bargeCopy, /between Krung Thon Bridge and Wat Arun/);
  assert.match(bargeCopy, /does not list ticket requirements, reserved viewing areas or exact road and riverfront closures/);
  assert.match(bargeCopy, /52 royal barges carrying 2,200 Royal Thai Navy personnel/);

  const gong = getTravelUpdateBySlug("central-highlands-gong-culture-festival-vietnam-2026");
  assert.ok(gong);
  assert.equal(gong.eventStartAt, "2026-10-01");
  assert.equal(gong.eventEndAt, "2026-10-31");
  assert.equal(gong.expiresAt, "2026-11-01T00:00:00+08:00");
  assert.ok(gong.sources.some((source) => source.url === "https://ich.unesco.org/en/RL/space-of-gong-culture-00120"));
  const gongCopy = gong.body.map((block) => block.text ?? block.items?.join(" ") ?? "").join(" ");
  assert.match(gongCopy, /1–31 October/);
  assert.match(gongCopy, /does not say which activities visitors can attend/);
  assert.match(gongCopy, /provide daily schedules/);

  for (const update of [bangkok, barge, gong]) {
    const justBeforeExpiry = new Date(new Date(update.expiresAt).getTime() - 1);
    assert.ok(getActiveTravelUpdates(justBeforeExpiry).some((activeUpdate) => activeUpdate.id === update.id));
    assert.equal(getActiveTravelUpdates(new Date(update.expiresAt)).some((activeUpdate) => activeUpdate.id === update.id), false);
  }
});

test("September 28 events expire after their covered dates while PAL remains current", () => {
  const grandPrix = getTravelUpdateBySlug("singapore-grand-prix-season-experiences-2026");
  assert.ok(grandPrix);
  assert.equal(grandPrix.eventEndAt, "2026-10-14");
  assert.equal(grandPrix.expiresAt, "2026-10-15T00:00:00+08:00");
  assert.ok(getActiveTravelUpdates(new Date("2026-10-14T23:59:59+08:00")).some((update) => update.id === grandPrix.id));
  assert.equal(getActiveTravelUpdates(new Date("2026-10-15T00:00:00+08:00")).some((update) => update.id === grandPrix.id), false);

  const lapay = getTravelUpdateBySlug("lapay-bantigue-dance-festival-masbate-2026");
  assert.ok(lapay);
  assert.equal(lapay.eventEndAt, "2026-09-28");
  assert.equal(lapay.expiresAt, "2026-09-29T00:00:00+08:00");
  assert.ok(getActiveTravelUpdates(new Date("2026-09-28T23:59:59+08:00")).some((update) => update.id === lapay.id));
  assert.equal(getActiveTravelUpdates(new Date("2026-09-29T00:00:00+08:00")).some((update) => update.id === lapay.id), false);

  const pal = getTravelUpdateBySlug("pal-manila-delhi-mumbai-flights-2026");
  assert.ok(pal);
  assert.equal(pal.category, "flights-airports");
  assert.equal(pal.expiresAt, undefined);
  assert.equal(pal.eventEndAt, undefined);
  assert.ok(getActiveTravelUpdates(new Date("2027-01-01T00:00:00+08:00")).some((update) => update.id === pal.id));
});

test("September 27 event stories follow their verified expiry boundaries", () => {
  const cases = [
    { slug: "salo-karajae-festival-parepare-2026", eventEndAt: "2026-10-01", expiresAt: "2026-10-02T00:00:00+08:00" },
    { slug: "fukuro-matsuri-ikebukuro-tokyo-2026", eventEndAt: "2026-09-27", expiresAt: "2026-09-28T00:00:00+08:00" },
    { slug: "free-royal-court-parade-hyundai-seoul-2026", eventEndAt: "2026-10-04", expiresAt: "2026-10-05T00:00:00+08:00" },
  ];

  for (const { slug, eventEndAt, expiresAt } of cases) {
    const update = getTravelUpdateBySlug(slug);
    assert.ok(update);
    assert.equal(update.eventEndAt, eventEndAt);
    assert.equal(update.expiresAt, expiresAt);
    assert.ok(getActiveTravelUpdates(new Date(new Date(expiresAt).getTime() - 1)).some((activeUpdate) => activeUpdate.id === update.id));
    assert.equal(getActiveTravelUpdates(new Date(expiresAt)).some((activeUpdate) => activeUpdate.id === update.id), false);
  }
});

test("expired stories are excluded while remaining retrievable by slug", () => {
  const afterHongKongExpiry = new Date("2026-09-29T12:00:00+08:00");
  const active = getActiveTravelUpdates(afterHongKongExpiry);

  assert.equal(active.some((update) => update.slug === "hong-kong-mid-autumn-k-festival-2026"), false);
  assert.ok(getTravelUpdateBySlug("hong-kong-mid-autumn-k-festival-2026"));
});

test("October 6 updates lead in their intentional same-day order while earlier event stories expire", () => {
  const afterOctober5Publication = new Date("2026-10-06T12:00:00+08:00");
  assert.deepEqual(getActiveTravelUpdates(afterOctober5Publication).map((update) => update.slug), [
    "singapore-f1-road-closures-transport-2026",
    "hangeul-week-seoul-2026",
    "phuket-vegetarian-festival-2026",
    "mambulawan-festival-camarines-norte-2026",
    "busan-international-film-festival-2026",
    "jinju-namgang-yudeung-festival-2026",
    "matsuyama-autumn-festival-dogo-2026",
    "pelicula-pelikula-manila-2026",
    "nantou-global-tea-expo-2026",
    "geumsan-world-k-insam-festival-2026",
    "asia-pacific-traditional-arts-festival-taiwan-2026",
    "lego-experience-the-thrill-singapore-2026",
    "kasanggayahan-festival-sorsogon-2026",
    "wayang-jogja-night-carnival-2026",
    "central-highlands-gong-culture-festival-vietnam-2026",
    "singapore-grand-prix-season-experiences-2026",
    "pal-manila-delhi-mumbai-flights-2026",
    "thailand-visa-free-stay-30-days-filipino-passports-2026",
    "japan-chiba-rail-disruptions-typhoon-25-2026",
  ]);
  assert.equal(getFeaturedTravelUpdate(afterOctober5Publication)?.slug, "singapore-f1-road-closures-transport-2026");
  assert.equal(getTravelUpdateBySlug("singapore-lights-by-the-lake-2026")?.featured, false);
});

test("October 6 updates preserve same-day order, filters, official details and expiry boundaries", () => {
  const beforePublication = new Date("2026-10-05T23:59:59+08:00");
  const publishedToday = new Date("2026-10-06T12:00:00+08:00");
  const cases = [
    { slug: "singapore-f1-road-closures-transport-2026", headline: "Singapore F1 bus changes begin today before major road closures", destination: "Singapore", country: "Singapore", eventEndAt: "2026-10-13", expiresAt: "2026-10-14T00:00:00+08:00" },
    { slug: "hangeul-week-seoul-2026", headline: "Hangeul Week begins in Seoul today as Hangeul Day marks 100 years", destination: "Seoul", country: "South Korea", eventEndAt: "2026-10-17", expiresAt: "2026-10-18T00:00:00+08:00" },
    { slug: "phuket-vegetarian-festival-2026", headline: "Phuket festival listings differ on its 2026 opening date", destination: "Phuket", country: "Thailand", eventEndAt: "2026-10-18", expiresAt: "2026-10-19T00:00:00+08:00" },
    { slug: "mambulawan-festival-camarines-norte-2026", headline: "Mambulawan Festival is listed for October 6–7 in Camarines Norte", destination: "Jose Panganiban, Camarines Norte", country: "Philippines", eventEndAt: "2026-10-07", expiresAt: "2026-10-08T00:00:00+08:00" },
  ];
  const active = getActiveTravelUpdates(publishedToday);
  const expectedOrder = cases.map(({ slug }) => slug);

  assert.deepEqual(active.slice(0, 4).map((update) => update.slug), expectedOrder);
  assert.deepEqual(getHomepageTravelUpdates(publishedToday).map((update) => update.slug), expectedOrder.slice(0, 3));
  assert.equal(getFeaturedTravelUpdate(publishedToday)?.slug, "singapore-f1-road-closures-transport-2026");

  for (const { slug, headline, destination, country, eventEndAt, expiresAt } of cases) {
    const update = getTravelUpdateBySlug(slug);
    assert.ok(update);
    assert.equal(update.headline, headline);
    assert.equal(update.publishedAt, "2026-10-06");
    assert.equal(update.destination, destination);
    assert.equal(update.country, country);
    assert.equal(update.category, "events-experiences");
    assert.equal(update.eventEndAt, eventEndAt);
    assert.equal(update.expiresAt, expiresAt);
    assert.equal(getActiveTravelUpdates(beforePublication).some((item) => item.id === update.id), false);
    assert.ok(active.some((item) => item.id === update.id));
    assert.ok(getActiveTravelUpdates(new Date(new Date(expiresAt).getTime() - 1)).some((item) => item.id === update.id));
    assert.equal(getActiveTravelUpdates(new Date(expiresAt)).some((item) => item.id === update.id), false);
    assert.ok(update.sources.length > 0);
    assert.ok(update.sources.every((source) => source.accessedAt === "2026-10-06"));
    assert.ok(filterTravelUpdates(active, destination, "events-experiences").some((item) => item.id === update.id));
  }

  const singapore = getTravelUpdateBySlug("singapore-f1-road-closures-transport-2026");
  const singaporeCopy = singapore?.body.map((block) => block.text ?? block.items?.join(" ") ?? "").join(" ") ?? "";
  assert.match(singaporeCopy, /12:01 AM on Wednesday, October 7/);
  assert.match(singaporeCopy, /last North-South and East-West Line trains from City Hall/);
  assert.ok(singapore?.sources.some((source) => source.url.endsWith("FA_LTA_F1_2026_Brochure.pdf")));
  assert.ok(singapore?.sources.some((source) => source.url.includes("List%20of%20Skipped%20Bus%20Stops")));

  const hangeul = getTravelUpdateBySlug("hangeul-week-seoul-2026");
  const hangeulCopy = hangeul?.body.map((block) => block.text ?? block.items?.join(" ") ?? "").join(" ") ?? "";
  assert.match(hangeulCopy, /Hangeul Week opens today and runs through October 17/);
  assert.match(hangeulCopy, /media façade is also later, not today/);
  assert.ok(hangeul?.sources.some((source) => source.url === "https://www.mcst.go.kr/english/policy/pressView.jsp?pSeq=669"));

  const phuket = getTravelUpdateBySlug("phuket-vegetarian-festival-2026");
  const phuketCopy = phuket?.body.map((block) => block.text ?? block.items?.join(" ") ?? "").join(" ") ?? "";
  assert.match(phuketCopy, /listings currently differ/);
  assert.match(phuketCopy, /does not provide this year’s individual shrine schedules/);
  assert.ok(phuket?.sources.some((source) => source.url.includes("thailand.go.th")));
  assert.ok(phuket?.sources.some((source) => source.publisher === "Tourism Authority of Thailand"));

  const mambulawan = getTravelUpdateBySlug("mambulawan-festival-camarines-norte-2026");
  const mambulawanCopy = mambulawan?.body.map((block) => block.text ?? block.items?.join(" ") ?? "").join(" ") ?? "";
  assert.match(mambulawanCopy, /does not give a detailed 2026 schedule/);
  assert.ok(mambulawan?.sources.some((source) => source.url === "https://tpb.gov.ph/events/mambulawan-festival/"));
});

test("event end date and listing expiry can be different", () => {
  const singapore = getTravelUpdateBySlug("singapore-lights-by-the-lake-2026");
  assert.ok(singapore);
  assert.equal(singapore.eventEndAt, "2026-10-04");
  assert.equal(singapore.expiresAt, "2026-10-05T00:00:00+08:00");
  assert.ok(getActiveTravelUpdates(new Date("2026-10-04T20:00:00+08:00")).some((update) => update.id === singapore.id));
  assert.equal(getActiveTravelUpdates(new Date("2026-10-05T00:00:00+08:00")).some((update) => update.id === singapore.id), false);

  for (const slug of ["sandeq-silumba-west-sulawesi-2026", "tourism-expo-japan-public-days-tokyo-2026"]) {
    const update = getTravelUpdateBySlug(slug);
    assert.ok(update);
    assert.equal(update.eventEndAt, "2026-09-27");
    assert.equal(update.expiresAt, "2026-09-28T00:00:00+08:00");
    assert.ok(getActiveTravelUpdates(new Date("2026-09-27T23:59:59+08:00")).some((activeUpdate) => activeUpdate.id === update.id));
    assert.equal(getActiveTravelUpdates(new Date("2026-09-28T00:00:00+08:00")).some((activeUpdate) => activeUpdate.id === update.id), false);
  }

  const gastronomy = getTravelUpdateBySlug("wonderful-indonesia-gastronomy-2026");
  assert.ok(gastronomy);
  assert.equal(gastronomy.eventEndAt, "2026-10-04");
  assert.equal(gastronomy.expiresAt, "2026-10-05T00:00:00+08:00");
  assert.ok(getActiveTravelUpdates(new Date("2026-10-04T23:59:59+08:00")).some((update) => update.id === gastronomy.id));
  assert.equal(getActiveTravelUpdates(new Date("2026-10-05T00:00:00+08:00")).some((update) => update.id === gastronomy.id), false);
});

test("October 11 updates retain automatic homepage selection", () => {
  const slugs = [
    "tokyo-bay-grand-fireworks-festival-2026",
    "pal-manila-saipan-flights-october-2026",
  ];
  const beforePublication = new Date("2026-10-10T23:59:59+08:00");
  const publishedToday = new Date("2026-10-11T12:00:00+08:00");
  const newArticles = travelUpdates.filter((update) => update.publishedAt === "2026-10-11");

  assert.deepEqual(newArticles.map((update) => update.slug), slugs);
  assert.deepEqual(getHomepageTravelUpdates(publishedToday).slice(0, 2).map((update) => update.slug), slugs);
  assert.equal(getFeaturedTravelUpdate(publishedToday)?.slug, slugs[0]);

  const cases = [
    { slug: slugs[0], headline: "Tokyo Bay's Grand Fireworks Festival returns after 11 years: What travelers should know", destination: "Tokyo", country: "Japan", category: "events-experiences", eventStartAt: "2026-10-24", eventEndAt: "2026-10-24", expiresAt: "2026-10-25T00:00:00+08:00" },
    { slug: slugs[1], headline: "Philippine Airlines to restore nonstop Manila–Saipan flights October 25", destination: "Manila / Saipan", country: "Philippines / Northern Mariana Islands", category: "flights-airports", eventStartAt: "2026-10-25", eventEndAt: undefined, expiresAt: undefined },
  ];

  for (const expected of cases) {
    const update = getTravelUpdateBySlug(expected.slug);
    assert.ok(update);
    assert.equal(update.headline, expected.headline);
    assert.equal(update.publishedAt, "2026-10-11");
    assert.equal(update.destination, expected.destination);
    assert.equal(update.country, expected.country);
    assert.equal(update.category, expected.category);
    assert.equal(update.eventStartAt, expected.eventStartAt);
    assert.equal(update.eventEndAt, expected.eventEndAt);
    assert.equal(update.expiresAt, expected.expiresAt);
    assert.equal(update.featured, undefined);
    assert.equal(getActiveTravelUpdates(beforePublication).some((item) => item.id === update.id), false);
    assert.ok(getActiveTravelUpdates(publishedToday).some((item) => item.id === update.id));
    assert.ok(update.sources.every((source) => source.accessedAt === "2026-10-11"));
    assert.ok(filterTravelUpdates(getActiveTravelUpdates(publishedToday), update.destination, update.category).some((item) => item.id === update.id));
  }

  const tokyo = getTravelUpdateBySlug(slugs[0]);
  const tokyoCopy = tokyo?.body.map((block) => block.text ?? block.items?.join(" ") ?? "").join(" ") ?? "";
  assert.match(tokyoCopy, /ticket-only/);
  assert.match(tokyoCopy, /Do not stop on sidewalks/);
  assert.match(tokyoCopy, /after 2:00 PM on October 24/);
  assert.ok(tokyo?.sources.some((source) => source.publisher === "Tokyo Metropolitan Government"));

  const pal = getTravelUpdateBySlug(slugs[1]);
  const palCopy = pal?.body.map((block) => block.text ?? block.items?.join(" ") ?? "").join(" ") ?? "";
  assert.match(palCopy, /Philippine passport holders are not among the nationalities listed/);
  assert.match(palCopy, /do not assume Saipan is visa-free/);
  assert.match(palCopy, /effective only through October 24/);
  assert.ok(pal?.sources.some((source) => source.publisher === "U.S. Department of State"));
  assert.ok(pal?.sources.some((source) => source.publisher === "U.S. Customs and Border Protection"));

  assert.equal(getActiveTravelUpdates(new Date("2026-10-25T00:00:00+08:00")).some((item) => item.slug === slugs[0]), false);
  assert.ok(getActiveTravelUpdates(new Date("2027-01-01T00:00:00+08:00")).some((item) => item.slug === slugs[1]));
});

test("October 14 festival updates resolve, preserve filters and expire in their local time zones", () => {
  const slugs = [
    "sunchang-jangryu-festival-2026",
    "festival-pinisi-bulukumba-2026",
    "buglasan-festival-negros-oriental-2026",
  ];
  const beforePublication = new Date("2026-10-13T23:59:59+08:00");
  const newArticles = travelUpdates.filter((update) => update.publishedAt === "2026-10-14");
  const active = getActiveTravelUpdates(october14Noon);

  assert.deepEqual(newArticles.map((update) => update.slug), slugs);
  assert.deepEqual(getHomepageTravelUpdates(october14Noon).map((update) => update.slug), slugs);
  assert.equal(getFeaturedTravelUpdate(october14Noon)?.slug, slugs[0]);
  assert.equal(getTravelUpdateBySlug("sunchang-jangryu-food-festival-2026"), undefined);

  const cases = [
    { slug: slugs[0], headline: "Korea's famous gochujang festival begins this week in Sunchang", destination: "Sunchang, Jeonbuk", country: "South Korea", category: "food-experiences", eventStartAt: "2026-10-15", eventEndAt: "2026-10-18", expiresAt: "2026-10-19T00:00:00+09:00" },
    { slug: slugs[1], headline: "Indonesia's traditional sailing heritage takes center stage at Festival Pinisi", destination: "Bulukumba, South Sulawesi", country: "Indonesia", category: "events-experiences", eventStartAt: "2026-10-15", eventEndAt: "2026-10-17", expiresAt: "2026-10-18T00:00:00+08:00" },
    { slug: slugs[2], headline: "Negros Oriental celebrates Buglasan Festival with parades, culture and a provincial holiday", destination: "Dumaguete City, Negros Oriental", country: "Philippines", category: "events-experiences", eventStartAt: "2026-10-15", eventEndAt: "2026-10-25", expiresAt: "2026-10-26T00:00:00+08:00" },
  ];

  for (const expected of cases) {
    const update = getTravelUpdateBySlug(expected.slug);
    assert.ok(update);
    assert.equal(update.headline, expected.headline);
    assert.equal(update.publishedAt, "2026-10-14");
    assert.equal(update.destination, expected.destination);
    assert.equal(update.country, expected.country);
    assert.equal(update.category, expected.category);
    assert.equal(update.eventStartAt, expected.eventStartAt);
    assert.equal(update.eventEndAt, expected.eventEndAt);
    assert.equal(update.expiresAt, expected.expiresAt);
    assert.equal(update.featured, undefined);
    assert.equal(getActiveTravelUpdates(beforePublication).some((item) => item.id === update.id), false);
    assert.ok(active.some((item) => item.id === update.id));
    assert.ok(filterTravelUpdates(active, update.destination, update.category).some((item) => item.id === update.id));
    assert.ok(update.sources.every((source) => source.accessedAt === "2026-10-14"));
    assert.ok(update.sources.every((source) => source.url.startsWith("https://")));
  }

  const sunchang = getTravelUpdateBySlug(slugs[0]);
  assert.ok(sunchang);
  const sunchangCopy = sunchang.body.map((block) => block.text ?? block.items?.join(" ") ?? "").join(" ");
  assert.match(sunchangCopy, /older listing on the county's legacy tourism site still shows October 16–18/);
  assert.match(sunchangCopy, /newer county and organizer information confirms the October 15 opening/);
  assert.match(sunchangCopy, /Global Gochujang Making/);
  assert.match(sunchangCopy, /disagree about whether it ends at 5:00 or 6:00 PM/);
  assert.match(sunchangCopy, /not for this festival/);
  assert.ok(sunchang.sources.some((source) => source.publisher === "Sunchang Jangryu Festival"));
  assert.ok(sunchang.sources.some((source) => source.publisher === "UNESCO Intangible Cultural Heritage"));

  const pinisi = getTravelUpdateBySlug(slugs[1]);
  assert.ok(pinisi);
  const pinisiCopy = pinisi.body.map((block) => block.text ?? block.items?.join(" ") ?? "").join(" ");
  assert.match(pinisiCopy, /not Festival Pinisi itself/);
  assert.match(pinisiCopy, /do not publish a day-by-day 2026 programme/);
  assert.match(pinisiCopy, /general festival admission as free/);
  assert.ok(pinisi.sources.some((source) => source.publisher === "Bulukumba Tourism, Youth and Sports Department"));
  assert.ok(pinisi.sources.some((source) => source.publisher === "UNESCO Intangible Cultural Heritage"));

  const buglasan = getTravelUpdateBySlug(slugs[2]);
  assert.ok(buglasan);
  const buglasanCopy = buglasan.body.map((block) => block.text ?? block.items?.join(" ") ?? "").join(" ");
  assert.match(buglasanCopy, /not the whole Philippines/);
  assert.match(buglasanCopy, /traffic advisories cover festival-related downtown adjustments from October 15–25/);
  assert.match(buglasanCopy, /street dancing from 2:00 PM that day/);
  assert.match(buglasanCopy, /check the official advisories for affected streets and alternatives/);
  assert.doesNotMatch(buglasanCopy, /parade route is .+? to .+?/i);
  assert.ok(buglasan.sources.some((source) => source.publisher === "Philippine Information Agency / Presidential Communications Office"));
  assert.ok(buglasan.sources.some((source) => source.publisher === "Dumaguete City Public Information Office / Traffic Management Office"));

  assert.ok(getActiveTravelUpdates(new Date("2026-10-18T23:59:59+09:00")).some((item) => item.slug === slugs[0]));
  assert.equal(getActiveTravelUpdates(new Date("2026-10-19T00:00:00+09:00")).some((item) => item.slug === slugs[0]), false);
  assert.ok(getActiveTravelUpdates(new Date("2026-10-17T23:59:59+08:00")).some((item) => item.slug === slugs[1]));
  assert.equal(getActiveTravelUpdates(new Date("2026-10-18T00:00:00+08:00")).some((item) => item.slug === slugs[1]), false);
  assert.ok(getActiveTravelUpdates(new Date("2026-10-25T23:59:59+08:00")).some((item) => item.slug === slugs[2]));
  assert.equal(getActiveTravelUpdates(new Date("2026-10-26T00:00:00+08:00")).some((item) => item.slug === slugs[2]), false);
  const afterFestivalExpiry = getActiveTravelUpdates(new Date("2026-10-26T00:00:00+08:00"));
  assert.equal(getFeaturedTravelUpdate(new Date("2026-10-26T00:00:00+08:00"))?.slug, "pal-riyadh-flight-suspension-november-2026");
  assert.equal(afterFestivalExpiry.some((item) => slugs.includes(item.slug)), false);
});

test("October 17 event updates lead deterministically, preserve filters and expire in destination time", () => {
  const cases = [
    { slug: "cordillera-festival-of-festivals-baguio-2026", headline: "Baguio brings the Cordillera's festivals together in one grand parade", destination: "Baguio City", country: "Philippines", eventStartAt: "2026-10-17", eventEndAt: "2026-10-17", expiresAt: "2026-10-18T00:00:00+08:00" },
    { slug: "kinmen-tunnel-music-festival-2026", headline: "Taiwan's Kinmen turns a former military tunnel into a concert hall", destination: "Kinmen", country: "Taiwan", eventStartAt: "2026-10-17", eventEndAt: "2026-10-18", expiresAt: "2026-10-19T00:00:00+08:00" },
    { slug: "taipei-tourism-market-day-2026", headline: "Explore Taiwan in one stop at Taipei's Tourism Market Day", destination: "Taipei", country: "Taiwan", eventStartAt: "2026-10-16", eventEndAt: "2026-10-19", expiresAt: "2026-10-20T00:00:00+08:00" },
  ];
  const slugs = cases.map(({ slug }) => slug);
  const beforePublication = new Date("2026-10-16T23:59:59+08:00");
  const sameDayArticles = travelUpdates.filter((update) => update.publishedAt === "2026-10-17");
  const active = getActiveTravelUpdates(october17Noon);

  assert.deepEqual(sameDayArticles.map((update) => update.slug), slugs);
  assert.deepEqual(active.slice(0, 3).map((update) => update.slug), slugs);
  assert.deepEqual(getHomepageTravelUpdates(october17Noon).map((update) => update.slug), slugs);
  assert.equal(getFeaturedTravelUpdate(october17Noon)?.slug, slugs[0]);

  for (const expected of cases) {
    const update = getTravelUpdateBySlug(expected.slug);
    assert.ok(update);
    assert.equal(update.headline, expected.headline);
    assert.equal(update.publishedAt, "2026-10-17");
    assert.equal(update.destination, expected.destination);
    assert.equal(update.country, expected.country);
    assert.equal(update.category, "events-experiences");
    assert.equal(update.eventStartAt, expected.eventStartAt);
    assert.equal(update.eventEndAt, expected.eventEndAt);
    assert.equal(update.expiresAt, expected.expiresAt);
    assert.equal(update.featured, undefined);
    assert.equal(getActiveTravelUpdates(beforePublication).some((item) => item.slug === expected.slug), false);
    assert.ok(active.some((item) => item.slug === expected.slug));
    assert.ok(filterTravelUpdates(active, expected.destination, "events-experiences").some((item) => item.slug === expected.slug));
    assert.ok(update.sources.length > 0);
    assert.ok(update.sources.every((source) => source.accessedAt === "2026-10-17"));
    assert.ok(update.sources.every((source) => source.url.startsWith("https://")));
    assert.ok(getActiveTravelUpdates(new Date(new Date(expected.expiresAt).getTime() - 1)).some((item) => item.slug === expected.slug));
    assert.equal(getActiveTravelUpdates(new Date(expected.expiresAt)).some((item) => item.slug === expected.slug), false);
  }

  const baguio = getTravelUpdateBySlug(slugs[0]);
  const baguioCopy = [baguio?.summary, ...(baguio?.body.map((block) => block.text ?? block.items?.join(" ") ?? "") ?? [])].join(" ");
  assert.match(baguioCopy, /begins at 8:00 AM/);
  assert.match(baguioCopy, /Harrison Road, along Session Road, and ending at Post Office Park/);
  assert.match(baguioCopy, /Melvin Jones Grounds/);
  assert.match(baguioCopy, /descriptions do not fully align/);
  assert.match(baguioCopy, /Baguio VISITA Local Advisories/);
  assert.match(baguioCopy, /price of ₱0 for the parade/);
  assert.ok(baguio?.sources.some((source) => source.publisher === "Philippine Information Agency"));

  const kinmen = getTravelUpdateBySlug(slugs[1]);
  const kinmenCopy = kinmen?.body.map((block) => block.text ?? block.items?.join(" ") ?? "").join(" ") ?? "";
  assert.match(kinmenCopy, /10:00 AM, 11:30 AM and 2:00 PM/);
  assert.match(kinmenCopy, /all six sessions sold out/);
  assert.match(kinmenCopy, /NT\$200/);
  assert.match(kinmenCopy, /closed the whole Zhaishan Tunnel site to general sightseeing from October 16 through 18/);
  assert.match(kinmenCopy, /Vehicle controls apply/);
  assert.match(kinmenCopy, /wet and slippery/);
  assert.ok(kinmen?.sources.some((source) => source.publisher === "Kinmen National Park Administration"));
  assert.ok(kinmen?.sources.some((source) => source.publisher === "OPENTIX / Kinmen Tunnel Music Festival organizers"));

  const taipei = getTravelUpdateBySlug(slugs[2]);
  const taipeiCopy = taipei?.body.map((block) => block.text ?? block.items?.join(" ") ?? "").join(" ") ?? "";
  assert.match(taipeiCopy, /Around 200 tourism businesses represent 18 tourism regions/);
  assert.match(taipeiCopy, /2:00–8:00 PM/);
  assert.match(taipeiCopy, /2:00–6:00 PM on October 19/);
  assert.match(taipeiCopy, /show a foreign passport to redeem a limited welcome gift/);
  assert.match(taipeiCopy, /do not state a general admission price/);
  assert.ok(taipei?.sources.some((source) => source.publisher === "Taiwan Tourism Administration"));

  assert.equal(getFeaturedTravelUpdate(new Date("2026-10-18T00:00:00+08:00"))?.slug, slugs[1]);
  assert.equal(getFeaturedTravelUpdate(new Date("2026-10-19T00:00:00+08:00"))?.slug, "pal-riyadh-flight-suspension-november-2026");
  const afterAllExpiries = new Date("2026-10-20T00:00:00+08:00");
  assert.equal(getFeaturedTravelUpdate(afterAllExpiries)?.slug, "pal-riyadh-flight-suspension-november-2026");
  assert.ok(slugs.every((slug) => !getHomepageTravelUpdates(afterAllExpiries).some((update) => update.slug === slug)));
});

test("October 19 updates resolve, lead in stable order, preserve filters and use correct lifecycles", () => {
  const cases = [
    { slug: "pal-riyadh-flight-suspension-november-2026", headline: "PAL Riyadh Flights Suspended Until November 29: What Filipino Passengers Should Know", destination: "Riyadh / Manila", country: "Saudi Arabia / Philippines", category: "flights-airports", eventStartAt: undefined, eventEndAt: undefined, expiresAt: undefined },
    { slug: "south-korea-iksan-chrysanthemum-festival-2026", headline: "South Korea's Free Iksan Chrysanthemum Festival Opens October 23: Dates and Visitor Guide", destination: "Iksan, Jeonbuk State", country: "South Korea", category: "events-experiences", eventStartAt: "2026-10-23", eventEndAt: "2026-11-01", expiresAt: "2026-11-02T00:00:00+09:00" },
    { slug: "malaysia-mhlife-festival-2026", headline: "Malaysia's Free MHLife Festival Begins October 23: Food, Culture and Family Activities", destination: "Shah Alam, Selangor", country: "Malaysia", category: "events-experiences", eventStartAt: "2026-10-23", eventEndAt: "2026-10-25", expiresAt: "2026-10-26T00:00:00+08:00" },
  ];
  const slugs = cases.map(({ slug }) => slug);
  const beforePublication = new Date("2026-10-18T23:59:59+08:00");
  const publicationNoon = new Date("2026-10-19T12:00:00+08:00");
  const sameDayArticles = travelUpdates.filter((update) => update.publishedAt === "2026-10-19");
  const active = getActiveTravelUpdates(publicationNoon);

  assert.deepEqual(sameDayArticles.map((update) => update.slug), slugs);
  assert.deepEqual(active.slice(0, 3).map((update) => update.slug), slugs);
  assert.deepEqual(getHomepageTravelUpdates(publicationNoon).map((update) => update.slug), slugs);
  assert.equal(getFeaturedTravelUpdate(publicationNoon)?.slug, slugs[0]);

  for (const expected of cases) {
    const update = getTravelUpdateBySlug(expected.slug);
    assert.ok(update);
    assert.equal(update.headline, expected.headline);
    assert.equal(update.publishedAt, "2026-10-19");
    assert.equal(update.destination, expected.destination);
    assert.equal(update.country, expected.country);
    assert.equal(update.category, expected.category);
    assert.equal(update.eventStartAt, expected.eventStartAt);
    assert.equal(update.eventEndAt, expected.eventEndAt);
    assert.equal(update.expiresAt, expected.expiresAt);
    assert.equal(update.featured, undefined);
    assert.equal(getActiveTravelUpdates(beforePublication).some((item) => item.slug === expected.slug), false);
    assert.ok(active.some((item) => item.slug === expected.slug));
    assert.ok(filterTravelUpdates(active, expected.destination, expected.category).some((item) => item.slug === expected.slug));
    assert.ok(update.body.length >= 8);
    assert.ok(update.sources.every((source) => source.accessedAt === "2026-10-19"));
    assert.ok(update.sources.every((source) => source.url.startsWith("https://")));
  }

  const pal = getTravelUpdateBySlug(slugs[0]);
  const palCopy = pal?.body.map((block) => block.text ?? block.items?.join(" ") ?? "").join(" ") ?? "";
  assert.match(palCopy, /October 12/);
  assert.match(palCopy, /PR654 and PR655/);
  assert.match(palCopy, /evolving security situation at King Khalid International Airport/);
  assert.match(palCopy, /does not confirm a service restart on November 30/);
  assert.match(palCopy, /does not announce that other airlines' flights/);
  assert.match(palCopy, /refund entitlement, rebooking waiver/);
  assert.ok(pal?.sources.some((source) => source.publisher === "Philippine Airlines" && source.url.includes("riyadh-flights-pr654-pr655-suspended")));

  const iksan = getTravelUpdateBySlug(slugs[1]);
  const iksanCopy = iksan?.body.map((block) => block.text ?? block.items?.join(" ") ?? "").join(" ") ?? "";
  assert.match(iksanCopy, /Iksan Central Sports Park/);
  assert.match(iksanCopy, /10:00 AM to 9:00 PM/);
  assert.match(iksanCopy, /600 chrysanthemum sculptures/);
  assert.match(iksanCopy, /60,000 autumn flowering plants/);
  assert.match(iksanCopy, /October 24/);
  assert.match(iksanCopy, /does not mean food, shopping or every hands-on activity is free/);
  assert.match(iksanCopy, /rather than a Seoul venue/);

  const mhlife = getTravelUpdateBySlug(slugs[2]);
  const mhlifeCopy = mhlife?.body.map((block) => block.text ?? block.items?.join(" ") ?? "").join(" ") ?? "";
  assert.match(mhlifeCopy, /Dataran Karnival, Stadium Shah Alam/);
  assert.match(mhlifeCopy, /10:00 AM to 10:00 PM/);
  assert.match(mhlifeCopy, /16 food-and-beverage pavilions/);
  assert.match(mhlifeCopy, /Harmony Night Concert/);
  assert.match(mhlifeCopy, /does not give a separate Harmony Night schedule/);
  assert.match(mhlifeCopy, /That covers entry to the festival, not food, drinks, shopping or paid activities/);
  assert.ok(mhlife?.sources.some((source) => source.publisher === "MHLife 2026 official event website"));

  const iksanExpiry = new Date("2026-11-02T00:00:00+09:00");
  const mhlifeExpiry = new Date("2026-10-26T00:00:00+08:00");
  assert.ok(getActiveTravelUpdates(new Date(iksanExpiry.getTime() - 1)).some((item) => item.slug === slugs[1]));
  assert.equal(getActiveTravelUpdates(iksanExpiry).some((item) => item.slug === slugs[1]), false);
  assert.ok(getActiveTravelUpdates(new Date(mhlifeExpiry.getTime() - 1)).some((item) => item.slug === slugs[2]));
  assert.equal(getActiveTravelUpdates(mhlifeExpiry).some((item) => item.slug === slugs[2]), false);
  assert.ok(getActiveTravelUpdates(new Date("2026-11-29T23:59:59+08:00")).some((item) => item.slug === slugs[0]));
  assert.equal(getFeaturedTravelUpdate(new Date("2026-10-26T12:00:00+08:00"))?.slug, slugs[0]);
});
