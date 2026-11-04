import type { Metadata } from "next";
import { ProductView } from "./ProductView";
import "./page.css";

export const metadata: Metadata = { title: "Зубчатый ремень T5 1645 25 NFT A" };

export default function ProductPage() {
  return <ProductView />;
}
