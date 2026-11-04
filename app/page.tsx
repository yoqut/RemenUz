import { HomeView } from "./HomeView";
import { PRODUCTS, getProduct, toCard, type Product } from "@/lib/products";

// Special offers: the two MEGADYNE SILVER3 belts featured in the design.
const OFFER_SLUGS = ["233-zubcatyi-remen-rpp-silver2-belt-1400-slv14-8500-mm", "235-zubcatyi-remen-rpp-silver2-belt-1610-slv14-8500-mm"];

export default function Home() {
  const offers = OFFER_SLUGS.map(getProduct).filter((p): p is Product => !!p).map(toCard);
  // Newest priced items with a photo, one per brand+price so the row isn't four near-identical belts.
  const seen = new Set<string>();
  const fresh = PRODUCTS.filter((p) => p.isNew && p.price > 0 && p.imgSmall)
    .sort((a, b) => b.id - a.id)
    .filter((p) => {
      const k = `${p.brand}|${p.cats[p.cats.length - 1]}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .slice(0, 4)
    .map(toCard);
  return <HomeView offers={offers} fresh={fresh} />;
}
