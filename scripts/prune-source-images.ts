import { readdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const sourceImageDirectory = resolve("public/images/gardens-by-the-bay");
const outputImageDirectory = resolve("dist/images/gardens-by-the-bay");
const originalJpegFiles = readdirSync(sourceImageDirectory).filter((filename) => /^S\d+\.jpeg$/.test(filename));

// Vite copies public files into dist; the page uses optimized variants, so omit the source-only JPEGs.
for (const filename of originalJpegFiles) {
  rmSync(resolve(outputImageDirectory, filename), { force: true });
}

console.log(`Excluded ${originalJpegFiles.length} source JPEGs from dist; originals remain in public.`);
