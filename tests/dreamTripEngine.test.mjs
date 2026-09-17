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
  for (const destination of ["japan", "thailand", "south-korea"]) {
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

test("stay-area guidance is available for all interactive destinations", () => {
  const japanAreas = getStayAreas("japan");
  const thailandAreas = getStayAreas("thailand");
  const southKoreaAreas = getStayAreas("south-korea");
  assert.ok(japanAreas.length > 0);
  assert.ok(thailandAreas.length > 0);
  assert.ok(southKoreaAreas.length > 0);
  assert.ok(thailandAreas.some((area) => area.name.includes("Bangkok")));
  assert.ok(southKoreaAreas.some((area) => area.name.includes("Seoul")));
  assert.ok(southKoreaAreas.some((area) => area.name.includes("Busan")));
  assert.ok(thailandAreas.every((area) => area.description && area.description.length > 20));
  assert.ok(southKoreaAreas.every((area) => area.description && area.description.length > 20));
});

test("every generated day has complete content for all interactive destinations", () => {
  for (const destination of ["japan", "thailand", "south-korea"]) {
    for (const duration of durations) {
      const preview = createDreamTrip(destination, answers({ duration }));
      for (const day of preview.days) {
        assert.ok(day.title);
        assert.ok(day.location);
        assert.ok(day.overview);
        assert.ok(day.image);
        assert.ok(day.experiences.length > 0);
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

test("only Japan, Thailand and South Korea expose interactive Dream Trips", () => {
  for (const destination of ["japan", "thailand", "south-korea"]) {
    assert.ok(getDreamDestination(destination));
  }
  for (const destination of ["hong-kong", "bali", "singapore", "vietnam", "malaysia", "switzerland"]) {
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
