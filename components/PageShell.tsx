"use client";

import type { ReactNode } from "react";
import { useLang } from "@/lib/lang";

/** Page ground for every page: the flat grey (dark: graphite) industrial ground, Inter as the body face. */
export function PageShell({ children }: { children: ReactNode }) {
  const { lang } = useLang();
  return (
    <div lang={lang} className="ind" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {children}
    </div>
  );
}
