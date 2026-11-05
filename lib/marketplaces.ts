// Marketplaces that also sell remen.uz products. Each product gets a link to every marketplace: its card
// there when data/marketplaces.json has one, otherwise that marketplace's search for the product's name.
// The price shown is the site price plus that marketplace's markup (MARKUP), unless the JSON gives one.
import data from "@/data/marketplaces.json";

export type MarketId = "uzum" | "ozon" | "yandex" | "wb" | "optom";

export const MARKETS: { id: MarketId; name: string; logo: string; search: string }[] = [
  { id: "uzum", name: "Uzum Market", logo: "/img/uzum.png", search: "https://uzum.uz/ru/search?query=" },
  { id: "ozon", name: "Ozon", logo: "/img/ozon.png", search: "https://www.ozon.ru/search/?text=" },
  { id: "yandex", name: "Yandex Market", logo: "/img/yandex-market.png", search: "https://market.yandex.uz/search?text=" },
  { id: "wb", name: "Wildberries", logo: "/img/wildberries.png", search: "https://www.wildberries.uz/catalog/0/search.aspx?search=" },
  { id: "optom", name: "optom.uz", logo: "/img/optom.png", search: "https://optom.uz/uz/search?q=" },
];

/** Markup over the site price on each marketplace (their commission), as a fraction. */
export const MARKUP: Record<MarketId, number> = { uzum: 0.12, ozon: 0.15, yandex: 0.12, wb: 0.15, optom: 0.08 };

/**
 * One marketplace for one product. `direct`: `url` is the product's own card there; otherwise it is a search.
 * `price` (UZS): the hand-entered one, else the site price plus the markup, rounded up to 1 000; null on request.
 */
export type MarketOffer = { id: MarketId; name: string; logo: string; url: string; direct: boolean; price: number | null };

type Entry = Partial<Record<MarketId, { url?: string; price?: number }>>;
const BY_SLUG = (data as { products: Record<string, Entry> }).products;

/** All five marketplaces for a product, in a fixed order: its own card where known, else a search for `name`. */
export function marketOffers(slug: string, name: string, sitePrice: number): MarketOffer[] {
  const e = BY_SLUG[slug] ?? {};
  return MARKETS.map(({ search, ...m }) => {
    const url = e[m.id]?.url;
    const price = e[m.id]?.price;
    const direct = !!url?.startsWith("https://");
    const marked = sitePrice > 0 ? Math.ceil((sitePrice * (1 + MARKUP[m.id])) / 1000) * 1000 : null;
    return { ...m, url: direct ? url! : search + encodeURIComponent(name.trim()), direct, price: typeof price === "number" && price > 0 ? price : marked };
  });
}
