import type { Metadata } from "next";
import { CatalogView } from "./CatalogView";
import { PRODUCTS, toRow } from "@/lib/products";

export const metadata: Metadata = { title: "Каталог" };

export default function CatalogPage() {
  return <CatalogView catId={null} products={PRODUCTS.map(toRow)} />;
}
