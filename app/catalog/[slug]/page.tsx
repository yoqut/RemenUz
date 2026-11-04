import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogView } from "../CatalogView";
import { CATALOG_ROOT, CATEGORIES, SPHERES_ROOT, getCategoryBySlug } from "@/lib/catalog";
import { productsIn, toCard } from "@/lib/products";

type Props = { params: Promise<{ slug: string }> };

const isListed = (id: number) => id !== CATALOG_ROOT && id !== SPHERES_ROOT;

export function generateStaticParams() {
  return CATEGORIES.filter((c) => isListed(c.id)).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCategoryBySlug((await params).slug);
  return c ? { title: c.name.trim() } : {};
}

export default async function CategoryPage({ params }: Props) {
  const c = getCategoryBySlug((await params).slug);
  if (!c || !isListed(c.id)) notFound();
  return <CatalogView catId={c.id} products={productsIn(c.id).map(toCard)} />;
}
