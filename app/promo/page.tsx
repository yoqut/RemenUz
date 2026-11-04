import type { Metadata } from "next";
import { PromoView } from "./PromoView";
import { specialOffers, toCard } from "@/lib/products";

export const metadata: Metadata = { title: "Акции" };

export default function PromoPage() {
  return <PromoView offers={specialOffers().map(toCard)} />;
}
