import type { Metadata } from "next";
import { OrdersView } from "./OrdersView";

export const metadata: Metadata = { title: "Мои заказы" };

export default function OrdersPage() {
  return <OrdersView />;
}
