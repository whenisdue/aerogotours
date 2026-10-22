import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { destinations } from "../src/data/destinations.ts";
import { travelUpdates } from "../src/data/travelUpdates.ts";
import { SITE_ORIGIN } from "../src/utils/siteMetadata.ts";

const siteUrl = SITE_ORIGIN;

type SitemapEntry = {
  path: string;
  lastmod?: string;
};

const normalizeLastmod = (value?: string) => {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return value.includes("T") ? parsed.toISOString() : value;
};

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

const entries: SitemapEntry[] = [
  { path: "/" },
  { path: "/trip-planner" },
  { path: "/guides" },
  { path: "/watch" },
  { path: "/guides/singapore/gardens-by-the-bay" },
  { path: "/travel-updates" },
  ...travelUpdates.map((update) => ({
    path: `/travel-updates/${update.slug}`,
    // Publication date is not a content modification date. Only record a sitemap
    // lastmod when an actual revision timestamp exists in the article data.
    lastmod: normalizeLastmod(update.updatedAt),
  })),
  ...destinations.map((destination) => ({ path: `/destinations/${destination.slug}` })),
];

const uniqueEntries = [...new Map(entries
  .filter((entry) => entry.path.startsWith("/") && !entry.path.includes("?") && !entry.path.includes("#"))
  .map((entry) => [entry.path, entry])).values()];
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...uniqueEntries.flatMap((entry) => [
    "  <url>",
    `    <loc>${escapeXml(new URL(entry.path, siteUrl).toString())}</loc>`,
    ...(entry.lastmod ? [`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`] : []),
    "  </url>",
  ]),
  "</urlset>",
  "",
].join("\n");

const distDirectory = resolve(process.cwd(), "dist");
mkdirSync(distDirectory, { recursive: true });
writeFileSync(resolve(distDirectory, "sitemap.xml"), xml, "utf8");
console.log(`Generated ${uniqueEntries.length} sitemap URLs at dist/sitemap.xml`);
