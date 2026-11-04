import type { Metadata } from "next";
import { GuideView } from "./GuideView";
import "./page.css";

export const metadata: Metadata = { title: "Как выбрать и измерить ремень" };

export default function GuidePage() {
  return <GuideView />;
}
