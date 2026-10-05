import test from "node:test";
import assert from "node:assert/strict";
import {
  filterTravelUpdates,
  getActiveTravelUpdates,
  getFeaturedTravelUpdate,
  getHomepageTravelUpdates,
  getTravelUpdateBySlug,
  travelUpdates,
} from "../src/data/travelUpdates.ts";

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

test("expired stories cannot be the homepage hero", () => {
  const beforeExpiry = getHomepageTravelUpdates(new Date("2026-10-18T23:59:59+08:00"));
  const atExpiry = getHomepageTravelUpdates(new Date("2026-10-19T00:00:00+08:00"));

  assert.equal(beforeExpiry[0]?.slug, "jinju-namgang-yudeung-festival-2026");
  assert.equal(atExpiry[0]?.slug, "kasanggayahan-festival-sorsogon-2026");
  assert.equal(beforeExpiry.some((update) => update.slug === "lego-experience-the-thrill-singapore-2026"), false);
  assert.equal(atExpiry.some((update) => update.slug === "jinju-namgang-yudeung-festival-2026"), false);
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

test("the October 5 updates lead while earlier event stories expire", () => {
  const afterOctober5Publication = new Date("2026-10-06T12:00:00+08:00");
  assert.deepEqual(getActiveTravelUpdates(afterOctober5Publication).map((update) => update.slug), [
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
  assert.equal(getFeaturedTravelUpdate(afterOctober5Publication)?.slug, "busan-international-film-festival-2026");
  assert.equal(getTravelUpdateBySlug("singapore-lights-by-the-lake-2026")?.featured, false);
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
