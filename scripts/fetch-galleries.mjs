// Pull every product's photo gallery from the remen.uz public API into data/galleries.json.
// Usage: node scripts/fetch-galleries.mjs
// Output: { "<product id>": ["<original image url>", ...] }, the product's main photo first.
// Re-run it after photos are added on remen.uz; products the API doesn't return are left as they were.
import fs from "node:fs";

const API = "https://api.remen.uz/api/v2/products?quantity=100&page=";
const out = fs.existsSync("data/galleries.json") ? JSON.parse(fs.readFileSync("data/galleries.json", "utf8")) : {};
const real = (u) => typeof u === "string" && u.startsWith("https://") && !u.includes("no-image");

let page = 1;
let last = 1;
let seen = 0;
do {
  const res = await fetch(API + page, { headers: { Accept: "application/json", "User-Agent": "remen-uz-site/1.0" } });
  if (!res.ok) throw new Error(`page ${page}: HTTP ${res.status}`);
  const body = await res.json();
  last = body.meta?.last_page ?? page;
  for (const p of body.data ?? []) {
    const urls = [p.img, ...(p.gallery ?? []).map((g) => g?.original)].filter(real);
    const unique = [...new Set(urls)];
    if (unique.length) out[p.id] = unique;
    seen++;
  }
  process.stdout.write(`\rpage ${page}/${last}`);
  page++;
} while (page <= last);

fs.writeFileSync("data/galleries.json", JSON.stringify(out) + "\n");
const counts = Object.values(out).map((g) => g.length);
console.log(`\n${seen} products read; ${counts.length} with photos, ${counts.filter((n) => n > 1).length} with 2+ (max ${Math.max(...counts)}).`);
