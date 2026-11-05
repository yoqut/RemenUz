// Load marketplace product links (and optional prices) into data/marketplaces.json in bulk.
// Usage: node scripts/import-marketplaces.mjs <links.csv>
//
// The CSV has a header row with the columns market, article, url and optionally price, separated by
// commas or semicolons (Excel's "CSV UTF-8" export works):
//   market;article;url;price
//   uzum;T5-1645-25+NFT A;https://uzum.uz/ru/product/...;
//   ozon;8PJ-1244 Le;https://www.ozon.ru/product/...;210000
// market is one of uzum, ozon, yandex, wb, optom. article is the remen.uz article (SKU) or the product
// slug from its page URL. An empty price keeps the site price + markup. Rows that match no product, or
// match several, are listed and skipped; existing entries are updated, others are kept.
import fs from "node:fs";

const MARKETS = new Set(["uzum", "ozon", "yandex", "wb", "optom"]);
const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/import-marketplaces.mjs <links.csv>");
  process.exit(1);
}

const products = JSON.parse(fs.readFileSync("data/products.json", "utf8"));
const norm = (s) => s.toLowerCase().replace(/[\s\-_+]+/g, "");
const bySku = new Map();
for (const p of products) {
  const k = norm(p.sku || "");
  if (k) bySku.set(k, [...(bySku.get(k) ?? []), p.slug]);
}
const slugs = new Set(products.map((p) => p.slug));

const text = fs.readFileSync(file, "utf8").replace(/^﻿/, "");
const lines = text.split(/\r?\n/).filter((l) => l.trim());
const sep = lines[0].includes(";") ? ";" : ",";
const head = lines[0].split(sep).map((h) => h.trim().toLowerCase());
const col = (name) => head.indexOf(name);
const [iMarket, iArticle, iUrl, iPrice] = [col("market"), col("article"), col("url"), col("price")];
if (iMarket < 0 || iArticle < 0 || iUrl < 0) {
  console.error("The header must have the columns: market, article, url (and optionally price).");
  process.exit(1);
}

const out = JSON.parse(fs.readFileSync("data/marketplaces.json", "utf8"));
let added = 0;
const skipped = [];
for (const [n, line] of lines.slice(1).entries()) {
  const cells = line.split(sep).map((c) => c.trim().replace(/^"|"$/g, ""));
  const market = cells[iMarket]?.toLowerCase();
  const article = cells[iArticle] ?? "";
  const url = cells[iUrl] ?? "";
  const price = iPrice >= 0 ? Number((cells[iPrice] ?? "").replace(/[^\d]/g, "")) : 0;
  const row = `row ${n + 2} (${market} ${article})`;
  if (!MARKETS.has(market)) { skipped.push(`${row}: unknown market`); continue; }
  if (!url.startsWith("https://")) { skipped.push(`${row}: url must start with https://`); continue; }
  const hits = slugs.has(article) ? [article] : bySku.get(norm(article)) ?? [];
  if (hits.length !== 1) { skipped.push(`${row}: ${hits.length ? `${hits.length} products share this article` : "no such product"}`); continue; }
  const entry = (out.products[hits[0]] ??= {});
  entry[market] = price > 0 ? { url, price } : { url };
  added++;
}

fs.writeFileSync("data/marketplaces.json", JSON.stringify(out, null, 2) + "\n");
console.log(`Imported ${added} link(s) into data/marketplaces.json.`);
if (skipped.length) console.log(`Skipped ${skipped.length}:\n  ` + skipped.join("\n  "));
