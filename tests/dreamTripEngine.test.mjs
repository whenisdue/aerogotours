import test from "node:test";
import assert from "node:assert/strict";
import {
  buildDreamTripHandoff,
  createDreamTrip,
  getDurationLabel,
  getDreamDestination,
  getInterestOptions,
  getStayAreas,
} from "../src/utils/dreamTripEngine.ts";

const answers = (overrides = {}) => ({
  group: "family",
  travelers: 4,
  duration: 7,
  interest: "mix",
  pace: "balanced",
  ...overrides,
});

const durations = [3, 4, 5, 7, 10];

test("creates an exact three-day Tokyo journey without intercity travel", () => {
  const preview = createDreamTrip("japan", answers({ duration: 3 }));
  assert.equal(preview.days.length, 3);
  assert.deepEqual(preview.days.map((day) => day.day), [1, 2, 3]);
  assert.ok(preview.days.every((day) => day.location === "Tokyo"));
  assert.equal(getDurationLabel(3), "3 days / 2 nights");
});

test("creates an exact four-day focused Tokyo journey", () => {
  const preview = createDreamTrip("japan", answers({ duration: 4 }));
  assert.equal(preview.days.length, 4);
  assert.deepEqual(preview.days.map((day) => day.day), [1, 2, 3, 4]);
  assert.ok(preview.days.every((day) => day.location.includes("Tokyo")));
});

test("creates an exact five-day Tokyo and nearby journey", () => {
  const preview = createDreamTrip("japan", answers({ duration: 5 }));
  assert.equal(preview.days.length, 5);
  assert.deepEqual(preview.days.map((day) => day.day), [1, 2, 3, 4, 5]);
  assert.ok(preview.days.some((day) => day.location === "Tokyo & nearby"));
  assert.equal(getDurationLabel(5), "5 days / 4 nights");
});

test("creates an exact seven-day Tokyo and Kyoto journey", () => {
  const preview = createDreamTrip("japan", answers({ duration: 7 }));
  assert.equal(preview.days.length, 7);
  assert.deepEqual(preview.days.map((day) => day.day), [1, 2, 3, 4, 5, 6, 7]);
  assert.ok(preview.days.some((day) => day.location === "Kyoto"));
});

test("creates an exact ten-day multi-city Japan journey", () => {
  const preview = createDreamTrip("japan", answers({ duration: 10 }));
  assert.equal(preview.days.length, 10);
  assert.deepEqual(preview.days.map((day) => day.day), Array.from({ length: 10 }, (_, index) => index + 1));
  assert.ok(preview.days.some((day) => day.location === "Osaka"));
});

test("creates Thailand itineraries for every supported duration", () => {
  for (const duration of durations) {
    const preview = createDreamTrip("thailand", answers({ duration }));
    assert.equal(preview.destination, "thailand");
    assert.equal(preview.days.length, duration);
    assert.deepEqual(preview.days.map((day) => day.day), Array.from({ length: duration }, (_, index) => index + 1));
    assert.ok(preview.days.every((day) => !/Tokyo|Kyoto|Osaka/.test(`${day.location} ${day.title} ${day.overview}`)));
  }
});

test("creates South Korea itineraries for every supported duration", () => {
  for (const duration of durations) {
    const preview = createDreamTrip("south-korea", answers({ duration }));
    assert.equal(preview.destination, "south-korea");
    assert.equal(preview.days.length, duration);
    assert.deepEqual(preview.days.map((day) => day.day), Array.from({ length: duration }, (_, index) => index + 1));
    const content = preview.days.map((day) => `${day.location} ${day.title} ${day.overview} ${day.experiences.join(" ")}`).join(" ");
    assert.doesNotMatch(content, /Tokyo|Kyoto|Osaka|Bangkok|Chiang Mai|Phuket/);
  }
});

test("creates Hong Kong itineraries for every supported duration without regional leakage", () => {
  for (const duration of durations) {
    const preview = createDreamTrip("hong-kong", answers({ duration }));
    assert.equal(preview.destination, "hong-kong");
    assert.equal(preview.days.length, duration);
    assert.deepEqual(preview.days.map((day) => day.day), Array.from({ length: duration }, (_, index) => index + 1));
    const content = preview.days.map((day) => `${day.location} ${day.title} ${day.overview} ${day.experiences.join(" ")}`).join(" ");
    assert.doesNotMatch(content, /Tokyo|Kyoto|Osaka|Bangkok|Chiang Mai|Phuket|Seoul|Busan|Gyeongju/);
  }
});

test("creates Bali itineraries for every supported duration without country leakage", () => {
  for (const duration of durations) {
    const preview = createDreamTrip("bali", answers({ duration }));
    assert.equal(preview.destination, "bali");
    assert.equal(preview.days.length, duration);
    assert.deepEqual(preview.days.map((day) => day.day), Array.from({ length: duration }, (_, index) => index + 1));
    const content = preview.days.map((day) => `${day.location} ${day.title} ${day.overview} ${day.experiences.join(" ")}`).join(" ");
    assert.doesNotMatch(content, /Tokyo|Kyoto|Osaka|Bangkok|Chiang Mai|Phuket|Seoul|Busan|Gyeongju|Hong Kong/);
  }
});

test("Bali routes protect short stays and use a real Ubud-to-coast transition", () => {
  const threeDay = createDreamTrip("bali", answers({ duration: 3, group: "sample" }));
  assert.ok(threeDay.days.every((day) => day.location === "Ubud" || day.location === "Bali" || day.location.includes("Campuhan")));

  const sevenDay = createDreamTrip("bali", answers({ duration: 7, group: "sample" }));
  assert.ok(sevenDay.days.some((day) => day.location.includes("Ubud")));
  assert.ok(sevenDay.days.some((day) => day.location.includes("Sanur") && day.practicalNote?.includes("Road time")));
  assert.ok(sevenDay.days.some((day) => day.experiences.some((experience) => /Uluwatu|Jimbaran/i.test(experience))));
  assert.equal(new Set(sevenDay.days.map((day) => day.image)).size, 7);

  const tenDay = createDreamTrip("bali", answers({ duration: 10, group: "sample" }));
  assert.ok(tenDay.days.some((day) => day.experiences.some((experience) => /Tanah Lot/i.test(experience))));
  assert.ok(tenDay.days.some((day) => day.location === "Nusa Dua"));
});

test("Bali nature and city routes stay geographically focused", () => {
  const natureShort = createDreamTrip("bali", answers({ duration: 3, interest: "nature" }));
  assert.ok(natureShort.days.every((day) => /Ubud|Campuhan|Bali/.test(day.location)));
  assert.ok(natureShort.days.some((day) => day.experiences.some((experience) => /Campuhan Ridge Walk/i.test(experience))));

  const cityShort = createDreamTrip("bali", answers({ duration: 3, interest: "city" }));
  assert.ok(cityShort.days.some((day) => day.location === "Sanur"));
  assert.ok(cityShort.days.every((day) => !/Tegallalang|Tirta Empul|Uluwatu/.test(`${day.location} ${day.experiences.join(" ")}`) || day.location === "Sanur"));
});

test("creates Singapore itineraries for every supported duration without country leakage", () => {
  for (const duration of durations) {
    const preview = createDreamTrip("singapore", answers({ duration, group: "sample" }));
    assert.equal(preview.destination, "singapore");
    assert.equal(preview.days.length, duration);
    assert.deepEqual(preview.days.map((day) => day.day), Array.from({ length: duration }, (_, index) => index + 1));
    const content = preview.days.map((day) => `${day.location} ${day.title} ${day.overview} ${day.experiences.join(" ")}`).join(" ");
    assert.doesNotMatch(content, /Tokyo|Kyoto|Osaka|Bangkok|Chiang Mai|Phuket|Seoul|Busan|Gyeongju|Hong Kong|Bali|Ubud|Kuala Lumpur|Hanoi/);
  }
});

test("Singapore routes keep short stays compact and add gardens, coast and open time later", () => {
  const threeDay = createDreamTrip("singapore", answers({ duration: 3, group: "sample" }));
  assert.ok(threeDay.days.every((day) => !/Sentosa|Jewel|Rain Vortex|Botanic Gardens/i.test(`${day.location} ${day.experiences.join(" ")}`)));
  assert.ok(threeDay.days.some((day) => day.location.includes("Civic")));

  const sevenDay = createDreamTrip("singapore", answers({ duration: 7, group: "sample" }));
  assert.ok(sevenDay.days.some((day) => /Chinatown/i.test(`${day.location} ${day.experiences.join(" ")}`)));
  assert.ok(sevenDay.days.some((day) => day.experiences.some((experience) => /Supertree Grove/i.test(experience))));
  assert.ok(sevenDay.days.some((day) => day.location === "Singapore Botanic Gardens"));
  assert.ok(sevenDay.days.some((day) => day.location === "Sentosa"));
  assert.ok(sevenDay.days.some((day) => day.practicalNote?.includes("Jewel is not a guaranteed layover")));
  assert.equal(new Set(sevenDay.days.map((day) => day.image)).size, 7);

  const tenDay = createDreamTrip("singapore", answers({ duration: 10, group: "sample" }));
  assert.ok(tenDay.days.some((day) => day.title.includes("deliberately open")));
  assert.ok(tenDay.days.some((day) => day.location === "Kampong Gelam"));
  assert.ok(tenDay.days.every((day) => !day.experiences.some((experience) => /Kuala Lumpur|Johor Bahru/i.test(experience))));
});

test("Singapore nature and city routes stay geographically coherent", () => {
  const natureShort = createDreamTrip("singapore", answers({ duration: 3, interest: "nature", group: "sample" }));
  assert.ok(natureShort.days.some((day) => day.location === "Singapore Botanic Gardens"));
  assert.ok(natureShort.days.every((day) => !day.experiences.some((experience) => /Sentosa|Jewel|Rain Vortex/i.test(experience))));

  const cityShort = createDreamTrip("singapore", answers({ duration: 3, interest: "city", group: "sample" }));
  assert.ok(cityShort.days.some((day) => day.location.includes("Civic")));
  assert.ok(cityShort.days.every((day) => !/Botanic Gardens|Southern Ridges|Sentosa/.test(`${day.location} ${day.experiences.join(" ")}`)));
});

test("creates Vietnam itineraries for every supported duration without country leakage", () => {
  for (const duration of durations) {
    const preview = createDreamTrip("vietnam", answers({ duration, group: "sample" }));
    assert.equal(preview.destination, "vietnam");
    assert.equal(preview.days.length, duration);
    assert.deepEqual(preview.days.map((day) => day.day), Array.from({ length: duration }, (_, index) => index + 1));
    const content = preview.days.map((day) => `${day.location} ${day.title} ${day.overview} ${day.experiences.join(" ")}`).join(" ");
    assert.doesNotMatch(content, /Tokyo|Kyoto|Osaka|Bangkok|Chiang Mai|Phuket|Seoul|Busan|Gyeongju|Hong Kong|Bali|Ubud|Singapore|Kuala Lumpur/);
  }
});

test("Vietnam routes keep short stays local and allocate the regional transfer with time", () => {
  const threeDay = createDreamTrip("vietnam", answers({ duration: 3, group: "sample" }));
  assert.ok(threeDay.days.every((day) => day.location === "Hanoi" || day.location.includes("Old Quarter") || day.location.includes("Hoan Kiem")));
  assert.ok(threeDay.days.every((day) => !/Ninh Binh|Da Nang|Hoi An/i.test(`${day.location} ${day.experiences.join(" ")}`)));

  const fiveDay = createDreamTrip("vietnam", answers({ duration: 5, group: "sample" }));
  assert.ok(fiveDay.days.some((day) => day.location.includes("Ninh Binh")));
  assert.ok(fiveDay.days.some((day) => day.practicalNote?.includes("real travel day")));

  const sevenDay = createDreamTrip("vietnam", answers({ duration: 7, group: "sample" }));
  assert.ok(sevenDay.days.some((day) => day.location === "Ninh Binh"));
  assert.ok(sevenDay.days.some((day) => day.title.includes("Change the base")));
  assert.ok(sevenDay.days.some((day) => day.title.includes("Return to Hanoi")));
  assert.ok(sevenDay.days.every((day) => !/Da Nang|Hoi An|Ho Chi Minh/i.test(`${day.location} ${day.experiences.join(" ")}`)));

  const tenDay = createDreamTrip("vietnam", answers({ duration: 10, group: "sample" }));
  assert.ok(tenDay.days.some((day) => day.location.includes("Ninh Binh → Da Nang")));
  assert.ok(tenDay.days.some((day) => day.location === "Hoi An Ancient Town"));
  assert.ok(tenDay.days.some((day) => day.location === "Da Nang"));
  assert.ok(tenDay.days.some((day) => day.practicalNote?.includes("Domestic transport")));
});

test("Vietnam nature and city routes stay regionally focused", () => {
  const natureShort = createDreamTrip("vietnam", answers({ duration: 3, interest: "nature", group: "sample" }));
  assert.ok(natureShort.days.every((day) => !/Da Nang|Hoi An|Ninh Binh/i.test(day.location)));
  assert.ok(natureShort.days.some((day) => day.experiences.some((experience) => /Hoan Kiem Lake|green/i.test(experience))));

  const natureLong = createDreamTrip("vietnam", answers({ duration: 10, interest: "nature", group: "sample" }));
  assert.ok(natureLong.days.some((day) => day.location === "Ninh Binh → Da Nang"));
  assert.ok(natureLong.days.some((day) => day.location === "Da Nang & Son Tra Peninsula"));

  const cityShort = createDreamTrip("vietnam", answers({ duration: 3, interest: "city", group: "sample" }));
  assert.ok(cityShort.days.every((day) => !/Ninh Binh|Da Nang|Hoi An/i.test(`${day.location} ${day.experiences.join(" ")}`)));
  assert.ok(cityShort.days.some((day) => day.experiences.some((experience) => /Old Quarter|Hoan Kiem/i.test(experience))));
});

test("creates Malaysia itineraries for every supported duration without regional leakage", () => {
  for (const duration of durations) {
    const preview = createDreamTrip("malaysia", answers({ duration, group: "sample" }));
    assert.equal(preview.destination, "malaysia");
    assert.equal(preview.days.length, duration);
    assert.deepEqual(preview.days.map((day) => day.day), Array.from({ length: duration }, (_, index) => index + 1));
    const content = preview.days.map((day) => `${day.location} ${day.title} ${day.overview} ${day.experiences.join(" ")}`).join(" ");
    assert.doesNotMatch(content, /Tokyo|Kyoto|Osaka|Bangkok|Chiang Mai|Phuket|Seoul|Busan|Gyeongju|Hong Kong|Bali|Ubud|Singapore|Hanoi|Ninh Binh|Da Nang/);
  }
});

test("Malaysia routes protect short stays and the Kuala Lumpur-to-Penang transition", () => {
  const threeDay = createDreamTrip("malaysia", answers({ duration: 3, group: "sample" }));
  assert.ok(threeDay.days.every((day) => day.location === "Kuala Lumpur" || day.location.includes("Merdeka") || day.location.includes("Central Market")));
  assert.ok(threeDay.days.every((day) => !/George Town|Penang|Melaka/i.test(`${day.location} ${day.experiences.join(" ")}`)));
  assert.match(threeDay.days.at(-1).title, /Leave Kuala Lumpur/);

  const fiveDay = createDreamTrip("malaysia", answers({ duration: 5, group: "sample" }));
  assert.ok(fiveDay.days.some((day) => day.location === "Melaka Historic Centre"));
  assert.ok(fiveDay.days.some((day) => day.practicalNote?.includes("west-coast day excursion")));
  assert.match(fiveDay.days.at(-1).title, /Leave Kuala Lumpur/);

  const sevenDay = createDreamTrip("malaysia", answers({ duration: 7, group: "sample" }));
  assert.ok(sevenDay.days.some((day) => day.location === "Kuala Lumpur → George Town"));
  assert.ok(sevenDay.days.some((day) => day.location === "George Town · Penang"));
  assert.ok(sevenDay.days.some((day) => day.location === "Penang Hill · Air Itam"));
  assert.ok(sevenDay.days.some((day) => day.practicalNote?.includes("real transition day")));

  const tenDay = createDreamTrip("malaysia", answers({ duration: 10, group: "sample" }));
  assert.ok(tenDay.days.some((day) => day.title.includes("room to breathe")));
  assert.ok(tenDay.days.some((day) => day.location === "George Town · Penang"));
  assert.ok(tenDay.days.some((day) => day.location === "Penang Hill · Air Itam"));
  assert.ok(tenDay.days.every((day) => !/Langkawi|Cameron Highlands|Kota Kinabalu/i.test(`${day.location} ${day.experiences.join(" ")}`)));
  assert.ok(new Set(tenDay.days.map((day) => day.image)).size >= 6);
});

test("Malaysia nature and city routes stay west-coast focused", () => {
  const natureShort = createDreamTrip("malaysia", answers({ duration: 3, interest: "nature", group: "sample" }));
  assert.ok(natureShort.days.some((day) => day.location.includes("Batu Caves")));
  assert.ok(natureShort.days.every((day) => !/George Town|Penang|Melaka/i.test(`${day.location} ${day.experiences.join(" ")}`)));

  const natureLong = createDreamTrip("malaysia", answers({ duration: 10, interest: "nature", group: "sample" }));
  assert.ok(natureLong.days.some((day) => day.location === "Penang Hill · Air Itam"));
  assert.ok(natureLong.days.some((day) => day.title.includes("room to breathe")));

  const cityShort = createDreamTrip("malaysia", answers({ duration: 3, interest: "city", group: "sample" }));
  assert.ok(cityShort.days.some((day) => day.location.includes("KLCC")));
  assert.ok(cityShort.days.every((day) => !/Penang Hill|George Town|Batu Caves/i.test(`${day.location} ${day.experiences.join(" ")}`)));
});

test("Hong Kong routes keep short stays urban and add island options with time", () => {
  const threeDay = createDreamTrip("hong-kong", answers({ duration: 3 }));
  assert.ok(threeDay.days.every((day) => !/Lantau|Disneyland|Ocean Park/i.test(`${day.location} ${day.experiences.join(" ")}`)));
  assert.ok(threeDay.days.some((day) => day.experiences.some((experience) => experience.includes("Victoria Harbour"))));

  const sevenDay = createDreamTrip("hong-kong", answers({ duration: 7 }));
  assert.ok(sevenDay.days.some((day) => day.location.includes("Lantau") || day.experiences.some((experience) => /Ngong Ping|Lantau/i.test(experience))));
  assert.ok(sevenDay.days.some((day) => day.experiences.some((experience) => experience.includes("Star Ferry"))));

  const tenDay = createDreamTrip("hong-kong", answers({ duration: 10, group: "sample" }));
  assert.ok(tenDay.days.every((day) => !day.practicalNote?.includes("Theme parks are optional")));
  const familyTenDay = createDreamTrip("hong-kong", answers({ duration: 10, group: "family" }));
  assert.ok(familyTenDay.days.some((day) => day.practicalNote?.includes("Theme parks are optional")));
  const foodCoupleTenDay = createDreamTrip("hong-kong", answers({ duration: 10, group: "couple", interest: "food" }));
  assert.ok(foodCoupleTenDay.days.every((day) => !/Disneyland|Ocean Park/i.test(`${day.title} ${day.experiences.join(" ")}`)));
});

test("Hong Kong nature routes remain island and hill focused", () => {
  const short = createDreamTrip("hong-kong", answers({ duration: 3, interest: "nature" }));
  assert.ok(short.days.some((day) => /Peak/i.test(`${day.location} ${day.title} ${day.overview}`)));
  assert.ok(short.days.every((day) => !day.experiences.some((experience) => /Disneyland|Ocean Park/i.test(experience))));

  const longer = createDreamTrip("hong-kong", answers({ duration: 7, interest: "nature" }));
  assert.ok(longer.days.some((day) => day.experiences.some((experience) => /Ngong Ping|Lantau/i.test(experience))));
});

test("South Korea short and long routes keep regional movement realistic", () => {
  const threeDay = createDreamTrip("south-korea", answers({ duration: 3 }));
  assert.ok(threeDay.days.every((day) => day.location === "Seoul"));

  const sevenDay = createDreamTrip("south-korea", answers({ duration: 7 }));
  assert.ok(sevenDay.days.some((day) => day.location === "Busan"));
  assert.ok(sevenDay.days.some((day) => /Seoul-to-Busan|intercity/i.test(day.practicalNote ?? "")));

  const tenDay = createDreamTrip("south-korea", answers({ duration: 10, interest: "city" }));
  assert.ok(tenDay.days.some((day) => day.location === "Gyeongju"));
  assert.ok(tenDay.days.some((day) => day.experiences.some((experience) => experience.includes("Bulguksa Temple"))));
});

test("South Korea nature routes keep short stays local and bring in the coast later", () => {
  const short = createDreamTrip("south-korea", answers({ duration: 3, interest: "nature" }));
  assert.ok(short.days.every((day) => day.location === "Seoul"));
  assert.ok(short.days.some((day) => day.experiences.some((experience) => experience.includes("Haneul Park"))));

  const longer = createDreamTrip("south-korea", answers({ duration: 7, interest: "nature" }));
  assert.ok(longer.days.some((day) => day.location === "Busan"));
  assert.ok(longer.days.some((day) => day.experiences.some((experience) => experience.includes("Haeundae Beach"))));
});

test("changing South Korea duration leaves the other selected profile values intact", () => {
  const selected = answers({ duration: 3, group: "couple", travelers: 2, interest: "food", pace: "slow" });
  const short = createDreamTrip("south-korea", selected);
  const longer = createDreamTrip("south-korea", { ...selected, duration: 10 });
  assert.equal(short.groupLabel, longer.groupLabel);
  assert.equal(short.interestLabel, longer.interestLabel);
  assert.equal(short.paceLabel, longer.paceLabel);
  assert.notEqual(short.routeLabel, longer.routeLabel);
  assert.notEqual(short.days.length, longer.days.length);
});

test("Thailand's balanced route names real places and protects regional transitions", () => {
  const preview = createDreamTrip("thailand", answers({ duration: 7 }));
  assert.ok(preview.days.some((day) => day.experiences.some((experience) => experience.includes("Grand Palace"))));
  assert.ok(preview.days.some((day) => day.experiences.some((experience) => experience.includes("Doi Suthep"))));
  assert.ok(preview.days.some((day) => day.practicalNote?.includes("move between regions")));
});

test("Thailand nature routes stay coherent around Phuket", () => {
  const preview = createDreamTrip("thailand", answers({ duration: 7, interest: "nature" }));
  assert.ok(preview.days.every((day) => day.location === "Phuket"));
  assert.ok(preview.days.some((day) => day.experiences.some((experience) => experience.includes("Kata"))));
});

test("slower pace reduces the number of suggested activities for all destinations", () => {
  for (const destination of ["japan", "thailand", "south-korea", "hong-kong", "bali", "singapore", "vietnam", "malaysia"]) {
    const balanced = createDreamTrip(destination, answers({ pace: "balanced" }));
    const slow = createDreamTrip(destination, answers({ pace: "slow" }));
    assert.ok(slow.days.every((day, index) => day.experiences.length <= balanced.days[index].experiences.length));
    assert.ok(slow.days.some((day, index) => day.experiences.length < balanced.days[index].experiences.length));
  }
});

test("interest and group selections change each destination preview meaningfully", () => {
  const foodFriends = createDreamTrip("thailand", answers({ group: "friends", interest: "food", travelers: 5 }));
  const natureSolo = createDreamTrip("thailand", answers({ group: "solo", interest: "nature", travelers: 1 }));
  assert.notEqual(foodFriends.subtitle, natureSolo.subtitle);
  assert.notEqual(foodFriends.interestLabel, natureSolo.interestLabel);
  assert.notDeepEqual(foodFriends.days[1].experiences, natureSolo.days[1].experiences);
});

test("South Korea interests and group choices change the journey", () => {
  const foodFamily = createDreamTrip("south-korea", answers({ group: "family", interest: "food", travelers: 4 }));
  const natureSolo = createDreamTrip("south-korea", answers({ group: "solo", interest: "nature", travelers: 1 }));
  assert.notEqual(foodFamily.subtitle, natureSolo.subtitle);
  assert.notEqual(foodFamily.interestLabel, natureSolo.interestLabel);
  assert.notDeepEqual(foodFamily.days[1].experiences, natureSolo.days[1].experiences);
});

test("Hong Kong interests and group choices change the journey", () => {
  const foodFamily = createDreamTrip("hong-kong", answers({ group: "family", interest: "food", travelers: 4 }));
  const natureCouple = createDreamTrip("hong-kong", answers({ group: "couple", interest: "nature", travelers: 2 }));
  assert.notEqual(foodFamily.subtitle, natureCouple.subtitle);
  assert.notEqual(foodFamily.interestLabel, natureCouple.interestLabel);
  assert.notDeepEqual(foodFamily.days[1].experiences, natureCouple.days[1].experiences);
  assert.match(foodFamily.subtitle, /family/i);
});

test("Bali interests and group choices change the journey", () => {
  const foodFriends = createDreamTrip("bali", answers({ group: "friends", interest: "food", travelers: 5 }));
  const natureFamily = createDreamTrip("bali", answers({ group: "family", interest: "nature", travelers: 4 }));
  assert.notEqual(foodFriends.subtitle, natureFamily.subtitle);
  assert.notEqual(foodFriends.interestLabel, natureFamily.interestLabel);
  assert.notDeepEqual(foodFriends.days[1].experiences, natureFamily.days[1].experiences);
  assert.notDeepEqual(createDreamTrip("bali", answers({ group: "sample", interest: "mix" })).days.map((day) => day.title), createDreamTrip("bali", answers({ group: "family", interest: "mix" })).days.map((day) => day.title));
});

test("Singapore interests and group choices change the journey", () => {
  const foodFriends = createDreamTrip("singapore", answers({ group: "friends", interest: "food", travelers: 5 }));
  const natureFamily = createDreamTrip("singapore", answers({ group: "family", interest: "nature", travelers: 4 }));
  assert.notEqual(foodFriends.subtitle, natureFamily.subtitle);
  assert.notEqual(foodFriends.interestLabel, natureFamily.interestLabel);
  assert.notDeepEqual(foodFriends.days[1].experiences, natureFamily.days[1].experiences);
  assert.notDeepEqual(createDreamTrip("singapore", answers({ group: "sample", interest: "mix" })).days.map((day) => day.title), createDreamTrip("singapore", answers({ group: "family", interest: "mix" })).days.map((day) => day.title));
});

test("Vietnam interests and group choices change the journey", () => {
  const foodFriends = createDreamTrip("vietnam", answers({ group: "friends", interest: "food", travelers: 5 }));
  const natureFamily = createDreamTrip("vietnam", answers({ group: "family", interest: "nature", travelers: 4 }));
  assert.notEqual(foodFriends.subtitle, natureFamily.subtitle);
  assert.notEqual(foodFriends.interestLabel, natureFamily.interestLabel);
  assert.notDeepEqual(foodFriends.days[1].experiences, natureFamily.days[1].experiences);
  assert.notDeepEqual(createDreamTrip("vietnam", answers({ group: "sample", interest: "mix" })).days.map((day) => day.title), createDreamTrip("vietnam", answers({ group: "family", interest: "mix" })).days.map((day) => day.title));
});

test("Malaysia interests and group choices change the journey", () => {
  const foodFriends = createDreamTrip("malaysia", answers({ group: "friends", interest: "food", travelers: 5 }));
  const natureFamily = createDreamTrip("malaysia", answers({ group: "family", interest: "nature", travelers: 4 }));
  assert.notEqual(foodFriends.subtitle, natureFamily.subtitle);
  assert.notEqual(foodFriends.interestLabel, natureFamily.interestLabel);
  assert.notDeepEqual(foodFriends.days[1].experiences, natureFamily.days[1].experiences);
  assert.notDeepEqual(createDreamTrip("malaysia", answers({ group: "sample", interest: "mix" })).days.map((day) => day.title), createDreamTrip("malaysia", answers({ group: "family", interest: "mix" })).days.map((day) => day.title));
});

test("destination interest options are adapted for Thailand", () => {
  const options = getInterestOptions("thailand");
  assert.equal(options.find((option) => option.value === "food")?.label, "Food, markets and culture");
  assert.equal(options.find((option) => option.value === "nature")?.label, "Islands and nature");
});

test("destination interest options are adapted for South Korea", () => {
  const options = getInterestOptions("south-korea");
  assert.equal(options.find((option) => option.value === "food")?.label, "Food, markets and culture");
  assert.equal(options.find((option) => option.value === "nature")?.label, "Parks, coast and open views");
});

test("destination interest options are adapted for Hong Kong", () => {
  const options = getInterestOptions("hong-kong");
  assert.equal(options.find((option) => option.value === "food")?.label, "Food, markets and harbour flavours");
  assert.equal(options.find((option) => option.value === "nature")?.label, "Islands, hills and open views");
});

test("destination interest options are adapted for Bali", () => {
  const options = getInterestOptions("bali");
  assert.equal(options.find((option) => option.value === "food")?.label, "Food, markets and living culture");
  assert.equal(options.find((option) => option.value === "nature")?.label, "Rice fields, forest and coast");
});

test("destination interest options are adapted for Singapore", () => {
  const options = getInterestOptions("singapore");
  assert.equal(options.find((option) => option.value === "food")?.label, "Food, hawker centres and neighborhoods");
  assert.equal(options.find((option) => option.value === "nature")?.label, "Gardens, coast and green walks");
});

test("destination interest options are adapted for Vietnam", () => {
  const options = getInterestOptions("vietnam");
  assert.equal(options.find((option) => option.value === "food")?.label, "Food, markets and local neighborhoods");
  assert.equal(options.find((option) => option.value === "nature")?.label, "Karsts, coast and green landscapes");
});

test("destination interest options are adapted for Malaysia", () => {
  const options = getInterestOptions("malaysia");
  assert.equal(options.find((option) => option.value === "food")?.label, "Street food, markets and heritage kitchens");
  assert.equal(options.find((option) => option.value === "nature")?.label, "Hill views, green pauses and open-air days");
});

test("stay-area guidance is available for all interactive destinations", () => {
  const japanAreas = getStayAreas("japan");
  const thailandAreas = getStayAreas("thailand");
  const southKoreaAreas = getStayAreas("south-korea");
  const hongKongAreas = getStayAreas("hong-kong");
  const baliAreas = getStayAreas("bali");
  const singaporeAreas = getStayAreas("singapore");
  const vietnamAreas = getStayAreas("vietnam");
  const malaysiaAreas = getStayAreas("malaysia");
  assert.ok(japanAreas.length > 0);
  assert.ok(thailandAreas.length > 0);
  assert.ok(southKoreaAreas.length > 0);
  assert.ok(hongKongAreas.length > 0);
  assert.ok(baliAreas.length > 0);
  assert.ok(singaporeAreas.length > 0);
  assert.ok(vietnamAreas.length > 0);
  assert.ok(malaysiaAreas.length > 0);
  assert.ok(thailandAreas.some((area) => area.name.includes("Bangkok")));
  assert.ok(southKoreaAreas.some((area) => area.name.includes("Seoul")));
  assert.ok(southKoreaAreas.some((area) => area.name.includes("Busan")));
  assert.ok(hongKongAreas.some((area) => area.name.includes("Central")));
  assert.ok(hongKongAreas.some((area) => area.name.includes("Tsim Sha Tsui")));
  assert.ok(baliAreas.some((area) => area.name.includes("Ubud")));
  assert.ok(baliAreas.some((area) => area.name.includes("Sanur")));
  assert.ok(singaporeAreas.some((area) => area.name.includes("Marina Bay")));
  assert.ok(singaporeAreas.some((area) => area.name.includes("Chinatown")));
  assert.ok(vietnamAreas.some((area) => area.name.includes("Hanoi")));
  assert.ok(vietnamAreas.some((area) => area.name.includes("Ninh Binh")));
  assert.ok(malaysiaAreas.some((area) => area.name.includes("Kuala Lumpur")));
  assert.ok(malaysiaAreas.some((area) => area.name.includes("George Town")));
  assert.ok(thailandAreas.every((area) => area.description && area.description.length > 20));
  assert.ok(southKoreaAreas.every((area) => area.description && area.description.length > 20));
  assert.ok(hongKongAreas.every((area) => area.description && area.description.length > 20));
  assert.ok(baliAreas.every((area) => area.description && area.description.length > 20));
  assert.ok(singaporeAreas.every((area) => area.description && area.description.length > 20));
  assert.ok(vietnamAreas.every((area) => area.description && area.description.length > 20));
  assert.ok(malaysiaAreas.every((area) => area.description && area.description.length > 20));
});

test("stay guidance follows explicit overnight bases in the selected route", () => {
  const malaysiaShort = createDreamTrip("malaysia", answers({ duration: 5, group: "sample" }));
  assert.deepEqual(malaysiaShort.overnightBases, ["kuala-lumpur"]);
  assert.equal(malaysiaShort.days.some((day) => day.overnightBase === "george-town"), false);

  const singaporeLong = createDreamTrip("singapore", answers({ duration: 7, group: "sample" }));
  assert.deepEqual(singaporeLong.overnightBases, ["city", "sentosa"]);

  const baliLong = createDreamTrip("bali", answers({ duration: 7, group: "sample" }));
  assert.deepEqual(baliLong.overnightBases, ["ubud", "sanur"]);

  const malaysiaMultiRegion = createDreamTrip("malaysia", answers({ duration: 7, group: "sample" }));
  assert.deepEqual(malaysiaMultiRegion.overnightBases, ["kuala-lumpur", "george-town"]);

  const japanLong = createDreamTrip("japan", answers({ duration: 10, group: "sample" }));
  assert.deepEqual(japanLong.overnightBases, ["tokyo", "kyoto", "osaka"]);
});

test("every selected route exposes only stay areas registered for its destination", () => {
  for (const destination of ["japan", "thailand", "south-korea", "hong-kong", "bali", "singapore", "vietnam", "malaysia"]) {
    const areaIds = new Set(getStayAreas(destination).map((area) => area.id));
    for (const duration of durations) {
      const preview = createDreamTrip(destination, answers({ duration, interest: "nature" }));
      assert.ok(preview.overnightBases.every((baseId) => areaIds.has(baseId)));
    }
  }
});

test("every generated day has complete content for all interactive destinations", () => {
  for (const destination of ["japan", "thailand", "south-korea", "hong-kong", "bali", "singapore", "vietnam", "malaysia"]) {
    for (const duration of durations) {
      const preview = createDreamTrip(destination, answers({ duration }));
      for (const day of preview.days) {
        assert.ok(day.title);
        assert.ok(day.location);
        assert.ok(day.overview);
        assert.ok(day.image);
        assert.ok(day.experiences.length > 0);
        assert.ok(day.overnightBase || day.day === preview.days.length);
      }
    }
  }
});

test("builds a Japan inquiry handoff without personal details", () => {
  const selected = answers({ group: "friends", travelers: 6, duration: 10, interest: "city", pace: "slow" });
  const preview = createDreamTrip("japan", selected);
  const handoff = buildDreamTripHandoff(selected, preview, true);
  assert.deepEqual(handoff, {
    destination: "Japan",
    travelers: "5+",
    style: "family",
    summary: `Personalized from visitor choices. Destination: Japan. Duration: 10 days / 9 nights. ${preview.title} ${preview.subtitle} Interests: ${preview.interestLabel}. Pace: ${preview.paceLabel}. Route: ${preview.routeLabel}.`,
    personalized: true,
  });
  assert.equal("email" in handoff, false);
  assert.equal("name" in handoff, false);
});

test("builds a Thailand inquiry handoff with the correct destination", () => {
  const selected = answers({ group: "couple", travelers: 2, duration: 5, interest: "nature", pace: "slow" });
  const preview = createDreamTrip("thailand", selected);
  const handoff = buildDreamTripHandoff(selected, preview, true);
  assert.equal(handoff.destination, "Thailand");
  assert.match(handoff.summary, /Destination: Thailand\./);
  assert.match(handoff.summary, /Duration: 5 days \/ 4 nights\./);
  assert.doesNotMatch(handoff.summary, /Tokyo|Kyoto|Osaka/);
});

test("builds a South Korea inquiry handoff with the correct destination", () => {
  const selected = answers({ group: "friends", travelers: 5, duration: 5, interest: "city", pace: "full" });
  const preview = createDreamTrip("south-korea", selected);
  const handoff = buildDreamTripHandoff(selected, preview, true);
  assert.equal(handoff.destination, "South Korea");
  assert.match(handoff.summary, /Destination: South Korea\./);
  assert.match(handoff.summary, /Duration: 5 days \/ 4 nights\./);
  assert.match(handoff.summary, /Seoul/);
  assert.doesNotMatch(handoff.summary, /Tokyo|Kyoto|Osaka|Bangkok|Chiang Mai|Phuket/);
});

test("builds a Hong Kong inquiry handoff with the correct destination", () => {
  const selected = answers({ group: "friends", travelers: 5, duration: 5, interest: "city", pace: "full" });
  const preview = createDreamTrip("hong-kong", selected);
  const handoff = buildDreamTripHandoff(selected, preview, true);
  assert.equal(handoff.destination, "Hong Kong");
  assert.match(handoff.summary, /Destination: Hong Kong\./);
  assert.match(handoff.summary, /Duration: 5 days \/ 4 nights\./);
  assert.match(handoff.summary, /Central|Victoria Peak|Hong Kong/);
  assert.doesNotMatch(handoff.summary, /Tokyo|Kyoto|Osaka|Bangkok|Chiang Mai|Phuket|Seoul|Busan/);
});

test("builds a Bali inquiry handoff with the correct destination", () => {
  const selected = answers({ group: "friends", travelers: 5, duration: 7, interest: "nature", pace: "slow" });
  const preview = createDreamTrip("bali", selected);
  const handoff = buildDreamTripHandoff(selected, preview, true);
  assert.equal(handoff.destination, "Bali");
  assert.match(handoff.summary, /Destination: Bali\./);
  assert.match(handoff.summary, /Duration: 7 days \/ 6 nights\./);
  assert.match(handoff.summary, /Ubud|Sanur|Bali/);
  assert.doesNotMatch(handoff.summary, /Tokyo|Kyoto|Osaka|Bangkok|Chiang Mai|Phuket|Seoul|Busan|Hong Kong/);
});

test("builds a Singapore inquiry handoff with the correct destination", () => {
  const selected = answers({ group: "friends", travelers: 5, duration: 7, interest: "city", pace: "slow" });
  const preview = createDreamTrip("singapore", selected);
  const handoff = buildDreamTripHandoff(selected, preview, true);
  assert.equal(handoff.destination, "Singapore");
  assert.match(handoff.summary, /Destination: Singapore\./);
  assert.match(handoff.summary, /Duration: 7 days \/ 6 nights\./);
  assert.match(handoff.summary, /Marina Bay|Chinatown|Singapore/);
  assert.doesNotMatch(handoff.summary, /Tokyo|Kyoto|Osaka|Bangkok|Chiang Mai|Phuket|Seoul|Busan|Hong Kong|Bali/);
});

test("builds a Vietnam inquiry handoff with the correct destination", () => {
  const selected = answers({ group: "couple", travelers: 2, duration: 10, interest: "nature", pace: "slow" });
  const preview = createDreamTrip("vietnam", selected);
  const handoff = buildDreamTripHandoff(selected, preview, true);
  assert.equal(handoff.destination, "Vietnam");
  assert.match(handoff.summary, /Destination: Vietnam\./);
  assert.match(handoff.summary, /Duration: 10 days \/ 9 nights\./);
  assert.match(handoff.summary, /Ninh Binh|Da Nang|Vietnam/);
  assert.doesNotMatch(handoff.summary, /Tokyo|Kyoto|Osaka|Bangkok|Chiang Mai|Phuket|Seoul|Busan|Hong Kong|Bali|Singapore/);
});

test("builds a Malaysia inquiry handoff with the correct destination", () => {
  const selected = answers({ group: "couple", travelers: 2, duration: 10, interest: "food", pace: "slow" });
  const preview = createDreamTrip("malaysia", selected);
  const handoff = buildDreamTripHandoff(selected, preview, true);
  assert.equal(handoff.destination, "Malaysia");
  assert.match(handoff.summary, /Destination: Malaysia\./);
  assert.match(handoff.summary, /Duration: 10 days \/ 9 nights\./);
  assert.match(handoff.summary, /Kuala Lumpur|George Town|Penang/);
  assert.doesNotMatch(handoff.summary, /Tokyo|Kyoto|Osaka|Bangkok|Chiang Mai|Phuket|Seoul|Busan|Hong Kong|Bali|Singapore|Hanoi|Da Nang/);
});

test("changing Hong Kong duration preserves the selected profile", () => {
  const selected = answers({ duration: 3, group: "couple", travelers: 2, interest: "food", pace: "slow" });
  const short = createDreamTrip("hong-kong", selected);
  const longer = createDreamTrip("hong-kong", { ...selected, duration: 10 });
  assert.equal(short.groupLabel, longer.groupLabel);
  assert.equal(short.interestLabel, longer.interestLabel);
  assert.equal(short.paceLabel, longer.paceLabel);
  assert.notEqual(short.routeLabel, longer.routeLabel);
  assert.notEqual(short.days.length, longer.days.length);
});

test("only implemented destinations expose interactive Dream Trips", () => {
  for (const destination of ["japan", "thailand", "south-korea", "hong-kong", "bali", "singapore", "vietnam", "malaysia"]) {
    assert.ok(getDreamDestination(destination));
  }
  for (const destination of ["switzerland"]) {
    assert.equal(getDreamDestination(destination), undefined);
  }
});

test("keeps the default Japan sample handoff neutral", () => {
  const sample = answers({ group: "sample", travelers: 4 });
  const preview = createDreamTrip("japan", sample);
  assert.equal(preview.days.length, 7);
  assert.equal(preview.groupLabel, "Sample travel profile");
  const handoff = buildDreamTripHandoff(sample, preview, false);
  assert.deepEqual(handoff, {
    destination: "Japan",
    travelers: "",
    style: "",
    summary: `Sample itinerary — preferences not selected. Destination: Japan. Duration: 7 days / 6 nights. ${preview.title} ${preview.subtitle} Interests: ${preview.interestLabel}. Pace: ${preview.paceLabel}. Route: ${preview.routeLabel}.`,
    personalized: false,
  });
});
