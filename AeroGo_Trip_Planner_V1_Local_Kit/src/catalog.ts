/** Curated Singapore-only V1 catalog. Source links and editorial review dates are explicit.
 * No weather predictions, live opening hours, visa determinations or fares are generated.
 */
export type Interest = 'gardens' | 'culture' | 'food' | 'skyline';
export type Pace = 'relaxed' | 'balanced';
export type Mobility = 'minimal' | 'some';
export type Group = 'couple' | 'solo' | 'family' | 'friends';
export type DayCount = 3 | 4 | 5;

export type Preferences = {
  destination: 'singapore';
  days: DayCount;
  group: Group;
  pace: Pace;
  mobility: Mobility;
  interests: Interest[];
};

export type Visit = {
  at: string;
  title: string;
  detail: string;
  place?: string;
  official?: string;
  optional?: boolean;
};

export type ItineraryDay = {
  key: string;
  title: string;
  eyebrow: string;
  intro: string;
  visits: Visit[];
  tip: string;
  tags: Interest[];
};

export const OFFICIAL = {
  ica: 'https://www.ica.gov.sg/enter-transit-depart/entering-singapore',
  sgac: 'https://eservices.ica.gov.sg/sgarrivalcard/',
  gardens: 'https://www.gardensbythebay.com.sg/en.html',
  simplygo: 'https://www.simplygo.com.sg/faqs/cards-and-charms/simplygo/contactless-bank-cards/',
  jewel: 'https://www.jewelchangiairport.com/en/attractions/rain-vortex.html',
  botanic: 'https://www.nparks.gov.sg/sbg',
  gallery: 'https://www.nationalgallery.sg/',
  heritage: 'https://www.visitsingapore.com/see-do-singapore/places-to-see/kampong-gelam/',
  sentosa: 'https://www.sentosa.com.sg/',
  tourism: 'https://www.visitsingapore.com/'
} as const;

export const REVIEWED_ON = '15 October 2026';
export const DEFAULT_PREFERENCES: Preferences = {
  destination: 'singapore', days: 4, group: 'couple', pace: 'relaxed', mobility: 'some', interests: ['gardens', 'skyline']
};

export const PREP_ITEMS: { id: string; title: string; note: string; href?: string }[] = [
  { id: 'passport', title: 'Check each passport', note: 'Singapore generally requires non-Singapore-passport holders to have at least six months of validity.', href: OFFICIAL.ica },
  { id: 'visa', title: 'Check entry and visa rules', note: 'Requirements depend on your travel document, circumstances and any updates. Verify directly with Singapore ICA.', href: OFFICIAL.ica },
  { id: 'flights', title: 'Keep flight and onward-travel details handy', note: 'Save your ticket confirmations and make sure your itinerary matches your actual flight times.' },
  { id: 'hotel', title: 'Save your hotel address and confirmation', note: 'Choose a location that suits your comfort and transport needs.' },
  { id: 'insurance', title: 'Consider travel insurance and essential medication', note: 'Check relevant medication rules and carry necessary documents.' },
  { id: 'contact', title: 'Arrange phone data and payment methods', note: 'Make sure your cards allow overseas payments and keep an offline copy of important details.' },
  { id: 'arrivalcard', title: 'Submit the free SG Arrival Card at the right time', note: 'For most visitors, it must be submitted within three days before arrival, including the arrival day. It is not a visa.', href: OFFICIAL.sgac },
  { id: 'comfortable', title: 'Pack for comfort', note: 'Comfortable footwear, a water bottle, sun protection and an umbrella can help.' }
];

export const DAYS: ItineraryDay[] = [
  {
    key: 'gardens', title: 'Gardens without rushing', eyebrow: 'A day of nature', intro: 'Beautiful indoor gardens, an unhurried lunch and a long rest.', tags: ['gardens', 'skyline'],
    visits: [
      { at: 'Morning', title: 'Flower Dome', detail: 'Explore the cooled conservatory at your pace. Allow time to sit and admire the displays.', place: 'Flower Dome, Gardens by the Bay', official: OFFICIAL.gardens },
      { at: 'Late morning', title: 'Cloud Forest', detail: 'See the indoor waterfall and greenery. Some routes involve ramps or lifts; decide what feels comfortable.', place: 'Cloud Forest, Gardens by the Bay', official: OFFICIAL.gardens },
      { at: 'Afternoon', title: 'Lunch and a proper break', detail: 'Enjoy lunch and return to the hotel before the evening.' },
      { at: 'Optional evening', title: 'Garden Rhapsody', detail: 'The free Supertree light show is usually at 7:45 PM and 8:45 PM. Reconfirm the schedule before travel.', place: 'Supertree Grove, Gardens by the Bay', official: OFFICIAL.gardens, optional: true }
    ],
    tip: 'Flower Dome and Cloud Forest are paid attractions. Review maintenance closures and ticket requirements on the official site.'
  },
  {
    key: 'nature-arts', title: 'A peaceful morning and beautiful art', eyebrow: 'Nature and culture', intro: 'Start with greenery and keep the afternoon open for a museum.', tags: ['gardens', 'culture'],
    visits: [
      { at: 'Morning', title: 'Singapore Botanic Gardens', detail: 'Enjoy a short, gentle walk. You do not need to cover the whole garden.', place: 'Singapore Botanic Gardens', official: OFFICIAL.botanic },
      { at: 'Late morning', title: 'Coffee or brunch', detail: 'Take an unhurried break before traveling back to the hotel.' },
      { at: 'Afternoon', title: 'Rest at the hotel', detail: 'Take a generous break during the warmer part of the day.' },
      { at: 'Optional late afternoon', title: 'National Gallery Singapore', detail: 'Consider the air-conditioned galleries if you still have energy. Admission fees may apply.', place: 'National Gallery Singapore', official: OFFICIAL.gallery, optional: true }
    ],
    tip: 'For lighter walking, use a taxi between your hotel and the chosen garden entrance. Choose just one area to explore.'
  },
  {
    key: 'heritage', title: 'Neighborhood stories and local flavors', eyebrow: 'Culture and food', intro: 'An easy-paced introduction to one of Singapore’s distinct neighborhoods.', tags: ['culture', 'food'],
    visits: [
      { at: 'Morning', title: 'Kampong Gelam', detail: 'See the neighborhood streets and the exterior of Sultan Mosque. Respect prayer times and dress guidance if entering.', place: 'Kampong Gelam, Singapore', official: OFFICIAL.heritage },
      { at: 'Lunch', title: 'Choose a leisurely local meal', detail: 'Pick a café or restaurant nearby. Check accessibility and opening times for your chosen venue.' },
      { at: 'Afternoon', title: 'Return to your hotel', detail: 'Recharge and keep the rest of the afternoon free.' },
      { at: 'Optional evening', title: 'A waterfront dinner', detail: 'If you feel rested, choose a convenient dinner spot near your hotel or Marina Bay.', place: 'Marina Bay, Singapore', optional: true }
    ],
    tip: 'Kampong Gelam can be hot and busy. A short visit is absolutely fine, and respectful attire matters at religious sites.'
  },
  {
    key: 'marina', title: 'A little more of the city', eyebrow: 'Views and city life', intro: 'Enjoy familiar Singapore landmarks without committing to a long walking loop.', tags: ['skyline', 'food'],
    visits: [
      { at: 'Morning', title: 'Civic District', detail: 'Visit a single nearby viewpoint or landmark rather than walking the entire area.', place: 'Civic District, Singapore' },
      { at: 'Lunch', title: 'Comfortable local lunch', detail: 'Take your time, ideally at an air-conditioned restaurant.' },
      { at: 'Afternoon', title: 'Rest and free time', detail: 'Leave space for an unplanned favorite activity.' },
      { at: 'Optional evening', title: 'Marina Bay after dark', detail: 'Enjoy the lights from a convenient vantage point; a short taxi ride may be easier.', place: 'Marina Bay, Singapore', optional: true }
    ],
    tip: 'Marina Bay attractions can be spread apart. Avoid trying to cover the whole waterfront on foot in one evening.'
  }
];

export const ARRIVAL: ItineraryDay = {
  key: 'arrival', title: 'Welcome to Singapore', eyebrow: 'Arrival day', intro: 'An easy arrival, without a race against the clock.', tags: ['skyline'],
  visits: [
    { at: 'After landing', title: 'Airport to hotel', detail: 'Complete arrival formalities and choose a taxi, ride-hail or rail route that suits your bags and energy.' },
    { at: 'After check-in', title: 'Unpack and refresh', detail: 'Rest, drink some water and keep your first few hours free.' },
    { at: 'Optional evening', title: 'A gentle dinner or waterfront view', detail: 'Only if your actual arrival time allows; otherwise stay close to your hotel.', place: 'Marina Bay, Singapore', optional: true }
  ], tip: 'Never assume there is sightseeing time on arrival day. Delays and immigration queues happen.'
};

export const DEPARTURE: ItineraryDay = {
  key: 'departure', title: 'One last good memory', eyebrow: 'Departure day', intro: 'A simple departure that leaves plenty of time for the airport.', tags: ['gardens'],
  visits: [
    { at: 'Morning', title: 'Breakfast, pack and check out', detail: 'Double-check passports, bags and your departure terminal.' },
    { at: 'If time permits', title: 'Jewel Changi Airport Rain Vortex', detail: 'The Rain Vortex is in the public landside area and normally operates 10 AM–10 PM. Visit only if timing works.', place: 'Jewel Changi Airport', official: OFFICIAL.jewel, optional: true },
    { at: 'Before departure', title: 'Flight check-in and security', detail: 'Follow your airline’s specific reporting guidance, leaving time to transfer to the correct terminal.' }
  ], tip: 'Skip Jewel for early flights, tight connections or whenever the schedule feels stressful.'
};
