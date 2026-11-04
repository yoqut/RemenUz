import { HomeView, type Banner } from "./HomeView";
import { PRODUCTS, hasPhoto, specialOffers, toCard, type Product } from "@/lib/products";
import { CATALOG_ROOT, childrenOf, getCategory } from "@/lib/catalog";

// Five offers plus the delivery tile fill two rows of three.
const OFFERS = 5;

/** First priced product with a real photo in a category (or of a brand), for card and tile images. */
const photoOf = (pick: (p: Product) => boolean) => PRODUCTS.find((p) => pick(p) && p.price > 0 && hasPhoto(p))?.imgSmall ?? null;

export default function Home() {
  const offers = specialOffers(OFFERS).map(toCard);

  // Newest priced items with a photo, one per brand+price so the row isn't four near-identical belts.
  const seen = new Set<string>();
  const fresh = PRODUCTS.filter((p) => p.isNew && p.price > 0 && hasPhoto(p))
    .sort((a, b) => b.id - a.id)
    .filter((p) => {
      const k = `${p.brand}|${p.cats[p.cats.length - 1]}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .slice(0, 4)
    .map(toCard);

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

  return <HomeView offers={offers} fresh={fresh} catImgs={catImgs} banners={banners} />;
}
