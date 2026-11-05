import { HomeView, type Banner, type Shelves } from "./HomeView";
import { PRODUCTS, hasPhoto, specialOffers, toCard, type Product } from "@/lib/products";
import { CATALOG_ROOT, childrenOf, getCategory } from "@/lib/catalog";

// One row of four per shelf; the promo shelf keeps a slot for the delivery tile.
const ROW = 4;

/** First priced product with a real photo in a category (or of a brand), for card and tile images. */
const photoOf = (pick: (p: Product) => boolean) => PRODUCTS.find((p) => pick(p) && p.price > 0 && hasPhoto(p))?.imgSmall ?? null;

export default function Home() {
  // Fill the shelves in order; a product taken by one shelf is skipped by the next.
  const used = new Set<number>();
  const ok = (p: Product) => p.price > 0 && hasPhoto(p) && !used.has(p.id);
  const take = (list: Product[], n: number, key?: (p: Product) => string) => {
    const seen = new Set<string>();
    const out = list.filter((p) => {
      if (!ok(p)) return false;
      if (key) {
        if (seen.has(key(p))) return false;
        seen.add(key(p));
      }
      return true;
    }).slice(0, n);
    // Too few distinct ones: top up with the rest rather than leave the row short.
    if (key && out.length < n) out.push(...list.filter((p) => ok(p) && !out.includes(p)).slice(0, n - out.length));
    out.forEach((p) => used.add(p.id));
    return out;
  };
  const leaf = (p: Product) => p.cats[p.cats.length - 1];

  const promo = take(specialOffers(), ROW - 1);
  const best = take(PRODUCTS.filter((p) => p.isHit), ROW, (p) => `${p.brand}|${leaf(p)}`);
  // Newest first; like the hits, one per brand + section so the row isn't four near-identical belts.
  const fresh = take(PRODUCTS.filter((p) => p.isNew).sort((a, b) => b.id - a.id), ROW, (p) => `${p.brand}|${leaf(p)}`);
  // No sales data yet: "popular" means one item from each of the sections with the widest range.
  const size = new Map<number, number>();
  for (const p of PRODUCTS) size.set(leaf(p), (size.get(leaf(p)) ?? 0) + 1);
  const popular = take([...PRODUCTS].sort((a, b) => (size.get(leaf(b)) ?? 0) - (size.get(leaf(a)) ?? 0)), ROW, (p) => String(leaf(p)));
  const shelves: Shelves = { promo: promo.map(toCard), best: best.map(toCard), fresh: fresh.map(toCard), popular: popular.map(toCard) };

  const catImgs: Record<number, string> = {};
  for (const c of childrenOf(CATALOG_ROOT)) {
    const img = photoOf((p) => p.cats.includes(c.id));
    if (img) catImgs[c.id] = img;
  }

  // Brand banners carried over from remen.uz (the text-free versions); each opens its section filtered by brand.
  const banner = (key: Banner["key"], img: string, catId: number, brand?: string): Banner => {
    const slug = getCategory(catId)?.slug ?? "";
    return {
      key,
      img,
      href: `/catalog/${slug}${brand ? `?brand=${encodeURIComponent(brand)}` : ""}`,
      count: PRODUCTS.filter((p) => p.cats.includes(catId) && (!brand || p.brand === brand)).length,
    };
  };
  const banners = [
    banner("megadyne", "/img/banners/megadyne.png", 16, "MEGADYNE"),
    banner("pix", "/img/banners/pix.png", 30, "PIX"),
    banner("rezina", "/img/banners/belting-rezina.png", 37),
  ];

  return <HomeView shelves={shelves} catImgs={catImgs} banners={banners} />;
}
