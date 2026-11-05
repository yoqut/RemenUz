import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductView } from "../ProductView";
import { CATALOG_ROOT, pathOf } from "@/lib/catalog";
import { PRODUCTS, galleryOf, getProduct, productsIn, toRow, type Product } from "@/lib/products";
import { marketOffers } from "@/lib/marketplaces";

type Props = { params: Promise<{ slug: string }> };

// Rows in the "other sizes of this profile" table.
const SIZES = 12;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

/**
 * The product's most specific catalog category (longest path under "Каталог"), used for the breadcrumb
 * and the size table; the industries tree ("Сферы деятельности") only when it has nothing else.
 */
function mainCategory(p: Product) {
  const inCatalog = (path: ReturnType<typeof pathOf>) => Number(path[0]?.parentId === CATALOG_ROOT);
  return p.cats.map(pathOf).sort((a, b) => inCatalog(b) - inCatalog(a) || b.length - a.length)[0] ?? [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  return p ? { title: p.name, description: `${p.name} — купить в Ташкенте. Артикул ${p.sku}${p.brand ? `, ${p.brand}` : ""}.` } : {};
}

export default async function ProductPage({ params }: Props) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const trail = mainCategory(p);
  const leaf = trail[trail.length - 1];
  const self = toRow(p);

  // The same profile's belts nearest in length (this one included), shown shortest first; without a
  // length, the same brand first.
  const rows = leaf ? productsIn(leaf.id).map(toRow) : [self];
  const near = self.len !== null
    ? [...rows].sort((a, b) => Math.abs((a.len ?? Infinity) - self.len!) - Math.abs((b.len ?? Infinity) - self.len!))
    : [...rows].sort((a, b) => Number(b.brand === p.brand) - Number(a.brand === p.brand));
  const sizes = near.slice(0, SIZES).sort((a, b) => (a.len ?? Infinity) - (b.len ?? Infinity));

  return <ProductView p={p} self={self} trail={trail.map((c) => ({ name: c.name.trim(), nameUz: c.nameUz, slug: c.slug }))} sizes={sizes} markets={marketOffers(p.slug, p.name, p.price)} images={galleryOf(p)} />;
}
