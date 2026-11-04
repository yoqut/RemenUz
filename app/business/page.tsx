import type { Metadata } from "next";
import { BusinessView } from "./BusinessView";

export const metadata: Metadata = { title: "Бизнесу и партнёрам" };

export default function BusinessPage() {
  return <BusinessView />;
}
