export const japanAutumnForecastCheckedAt = "2026-10-26";
export const jmcForecastPublishedAt = "2026-10-01";
export const jwaSecondForecastPublishedAt = "2026-10-14";

export const jmcCityForecasts = [
  { city: "Sapporo", redMaple: "Nov 4", yellowGinkgo: "Nov 3" },
  { city: "Aomori", redMaple: "Nov 13", yellowGinkgo: "Nov 5" },
  { city: "Sendai", redMaple: "Nov 24", yellowGinkgo: "Nov 29" },
  { city: "Tokyo", redMaple: "Nov 28", yellowGinkgo: "Nov 26" },
  { city: "Nagano", redMaple: "Nov 21", yellowGinkgo: "Nov 14" },
  { city: "Kanazawa", redMaple: "Nov 30", yellowGinkgo: "Nov 10" },
  { city: "Nagoya", redMaple: "Dec 2", yellowGinkgo: "Nov 17" },
  { city: "Osaka", redMaple: "Dec 4", yellowGinkgo: "Nov 24" },
  { city: "Kyoto", redMaple: "Dec 11", yellowGinkgo: "Nov 27" },
  { city: "Hiroshima", redMaple: "Nov 28", yellowGinkgo: "Nov 21" },
  { city: "Fukuoka", redMaple: "Dec 7", yellowGinkgo: "Nov 28" },
] as const;

export const jwaLocationForecasts = [
  { place: "Kyoto (Arashiyama)", viewingWindowStarts: "Nov 13", forecastPublishedAt: jwaSecondForecastPublishedAt },
] as const;
