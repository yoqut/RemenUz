"use client";

import type { CSSProperties, ReactNode } from "react";
import { useLang } from "@/lib/lang";

export type Blob = CSSProperties; // top/left/right/width/height/background/opacity of one blurred light

/** Dark page ground with blurred colour blobs and the blueprint grid, as in every design artboard. */
export function PageShell({ blobs, children }: { blobs: Blob[]; children: ReactNode }) {
  const { lang } = useLang();
  return (
    <div lang={lang} style={{ position: "relative", overflow: "clip", fontFamily: "'Manrope', system-ui, sans-serif", color: "#FFFFFF", background: "#0B0E14", fontSize: 16, lineHeight: 1.55, minHeight: "100vh" }}>
      {blobs.map((b, i) => (
        <div key={i} className="blob" style={b} />
      ))}
      <div className="bp" aria-hidden="true" />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
