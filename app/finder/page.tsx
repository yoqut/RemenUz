import type { Metadata } from "next";
import { FinderView } from "./FinderView";

export const metadata: Metadata = { title: "Подбор ремня" };

export default function FinderPage() {
  return <FinderView />;
}
