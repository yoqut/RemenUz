// Convert scraped remen.uz data into the catalog data files used by the site.
// Usage: node scripts/build-data.mjs <products.jsonl> <categories.json>
// Writes data/products.json and data/categories.json.
import fs from "node:fs";

const [productsFile, categoriesFile] = process.argv.slice(2);

const cats = JSON.parse(fs.readFileSync(categoriesFile, "utf8"));
const byId = new Map(cats.map((c) => [c.id, c]));

/** Ancestor chain of a category id, root first (excluding the "Каталог"/"Сферы" roots). */
function chain(id) {
  const out = [];
  for (let c = byId.get(id); c && c.parentId !== null; c = byId.get(c.parentId)) out.unshift(c.id);
  return out;
}

const seen = new Set();
const products = [];
for (const line of fs.readFileSync(productsFile, "utf8").split("\n")) {
  if (!line.trim()) continue;
  const p = JSON.parse(line);
  if (seen.has(p.id)) continue;
  seen.add(p.id);
  // Every category the product sits in, plus their ancestors, so a parent category lists it too.
  const catIds = new Set();
  for (const c of p.categories) for (const id of chain(c.id)) catIds.add(id);
  products.push({
    id: p.id,
    slug: `${p.id}-${p.slug}`,
    name: p.name,
    sku: p.sku,
    brand: p.brand,
    price: p.price,
    oldPrice: p.oldPrice > p.price ? p.oldPrice : null,
    inStock: p.inStock > 0,
    isNew: p.isNew,
    isHit: p.isBestseller,
    perMeter: /за метр|цена за м/i.test(p.name),
    img: p.img,
    imgSmall: p.imgSmall,
    cats: [...catIds],
    attrs: p.attributes.filter((a) => a.value).map((a) => [a.name, a.value]),
    body: p.body.replace(/\s+/g, " ").trim(),
  });
}
products.sort((a, b) => a.id - b.id);

// Category tree with product counts; drop empty leaves except roots.
const count = new Map();
for (const p of products) for (const id of p.cats) count.set(id, (count.get(id) || 0) + 1);
const categories = cats
  .map((c) => ({ id: c.id, slug: `${c.id}-${c.slug}`, parentId: c.parentId, order: c.order, name: c.name, nameUz: c.nameUz, count: count.get(c.id) || 0 }))
  .sort((a, b) => a.order - b.order || a.id - b.id);

fs.mkdirSync("data", { recursive: true });
fs.writeFileSync("data/products.json", JSON.stringify(products));
fs.writeFileSync("data/categories.json", JSON.stringify(categories, null, 1));
console.log(`products ${products.length}, categories ${categories.length}, with products ${categories.filter((c) => c.count).length}`);
