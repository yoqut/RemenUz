import { getCategory } from "@/lib/catalog";
import { nearestByLength } from "@/lib/finder";
import { hasPhoto, productsIn, toCard, type Product } from "@/lib/products";

const LIMIT = 8;

/**
 * Live results for the finder page: products of one profile (`cat`) whose name / SKU / brand contain
 * every size word (`q`), priced items with a photo first. When fewer than a row match, similar ones from
 * the same profile fill the rest: nearest by length if one was typed (`len`, mm), otherwise the first ones.
 */
export function GET(request: Request) {
  const sp = new URL(request.url).searchParams;
  const cat = getCategory(Number(sp.get("cat")));
  if (!cat) return Response.json({ exact: [], near: [], total: 0 });

  const all = productsIn(cat.id);
  const words = (sp.get("q") ?? "").toLowerCase().split(/\s+/).filter(Boolean);
  const hay = (p: Product) => `${p.name} ${p.sku} ${p.brand ?? ""}`.toLowerCase();
  const rank = (p: Product) => (p.price > 0 ? 0 : 2) + (hasPhoto(p) ? 0 : 1);
  const exact = all.filter((p) => words.every((w) => hay(p).includes(w))).sort((a, b) => rank(a) - rank(b));

  const len = Number(sp.get("len")) || 0;
  const rest = all.filter((p) => !exact.includes(p)).sort((a, b) => rank(a) - rank(b));
  const room = Math.max(0, LIMIT - exact.length);
  const near = len ? nearestByLength(rest, len, room) : rest.slice(0, room);

  return Response.json({ exact: exact.slice(0, LIMIT).map(toCard), near: near.map(toCard), total: exact.length });
}
