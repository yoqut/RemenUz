import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductView } from "../ProductView";
import { pathOf } from "@/lib/catalog";
import { PRODUCTS, getProduct, productsIn, toCard, type Product } from "@/lib/products";
import "../page.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

/** The product's most specific category (longest path), used for the breadcrumb and related items. */
function mainCategory(p: Product) {
  return p.cats.map(pathOf).sort((a, b) => b.length - a.length)[0] ?? [];
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
  const related = leaf
    ? productsIn(leaf.id)
        .filter((r) => r.id !== p.id)
        .sort((a, b) => Number(b.brand === p.brand) - Number(a.brand === p.brand) || Math.abs(a.price - p.price) - Math.abs(b.price - p.price))
        .slice(0, 4)
        .map(toCard)
    : [];
  return (
    <ProductView
      p={p}
      trail={trail.map((c) => ({ name: c.name.trim(), slug: c.slug }))}
      related={related}
      relatedTitle={leaf ? `Ещё в разделе «${leaf.name.trim()}»` : "Похожие товары"}
    />
  );
}
