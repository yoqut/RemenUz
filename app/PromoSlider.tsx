"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const MONO = "'JetBrains Mono', monospace";
const DISPLAY = "'Oswald', sans-serif";

/** One promo banner: text on a solid brand colour, the picture on a white panel beside it. */
export type Slide = { key: string; eyebrow: string; title: string; sub: string; img: string; href: string; bg: string };

const arrow = (side: "left" | "right") => ({
  position: "absolute" as const,
  top: "50%",
  [side]: 14,
  transform: "translateY(-50%)",
  width: 44,
  height: 44,
  borderRadius: 999,
  border: "1px solid rgba(21,23,26,.12)",
  background: "rgba(255,255,255,.92)",
  color: "#15171A",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
});

/**
 * Home-page promo carousel. The track is a native scroll-snap row, so phones swipe it;
 * arrows and dots scroll it, and it advances every 6 s unless hovered, focused or reduced motion is on.
 */
export function PromoSlider({ slides, label, cta, prev, next }: { slides: Slide[]; label: string; cta: string; prev: string; next: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [cur, setCur] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = slides.length;

  const go = (k: number) => {
    const el = track.current;
    if (el) el.scrollTo({ left: ((k + n) % n) * el.clientWidth, behavior: "smooth" });
  };

  useEffect(() => {
    if (paused || n < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => go(cur + 1), 6000);
    return () => clearInterval(id);
  });

  const onScroll = () => {
    const el = track.current;
    if (el) setCur(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <section
      className="sec"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      style={{ maxWidth: 1320, margin: "0 auto", padding: "20px 20px 56px" }}
    >
      <div style={{ position: "relative" }}>
        <div ref={track} onScroll={onScroll} className="slider-track" style={{ display: "flex", overflowX: "auto", scrollSnapType: "x mandatory", borderRadius: 32 }}>
          {slides.map((s, k) => (
            <div key={s.key} role="group" aria-roledescription="slide" aria-label={`${k + 1} / ${n}`} className="slide" style={{ flex: "0 0 100%", scrollSnapAlign: "start", display: "grid", gridTemplateColumns: "minmax(0, 1.15fr) minmax(0, 1fr)", alignItems: "center", gap: 32, minHeight: 400, padding: "36px 72px", background: s.bg, color: "#FFFFFF" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "start", gap: 14, minWidth: 0 }}>
                <span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 1, textTransform: "uppercase", opacity: 0.85 }}>{s.eyebrow}</span>
                <span className="slide-title" style={{ fontFamily: DISPLAY, fontSize: 52, fontWeight: 700, lineHeight: 1.04, textTransform: "uppercase" }}>{s.title}</span>
                <span style={{ fontSize: 18, lineHeight: 1.45, opacity: 0.92, maxWidth: 520 }}>{s.sub}</span>
                <Link href={s.href} tabIndex={k === cur ? 0 : -1} style={{ marginTop: 8, height: 50, padding: "0 26px", display: "flex", alignItems: "center", borderRadius: 999, background: "#FFFFFF", color: "#15171A", fontWeight: 800 }}>{cta} →</Link>
              </div>
              <div className="slide-img" style={{ height: 320, borderRadius: 24, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.img} alt="" loading={k === 0 ? "eager" : "lazy"} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />
              </div>
            </div>
          ))}
        </div>
        {n > 1 && (
          <>
            <button type="button" className="hide-sm" aria-label={prev} onClick={() => go(cur - 1)} style={arrow("left")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
            </button>
            <button type="button" className="hide-sm" aria-label={next} onClick={() => go(cur + 1)} style={arrow("right")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
            </button>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, display: "flex", justifyContent: "center", gap: 8 }}>
              {slides.map((s, k) => (
                <button key={s.key} type="button" aria-label={`${k + 1} / ${n}`} aria-current={k === cur} onClick={() => go(k)} style={{ width: k === cur ? 26 : 9, height: 9, padding: 0, border: 0, borderRadius: 999, background: k === cur ? "#FFFFFF" : "rgba(255,255,255,.5)", cursor: "pointer", transition: "width .2s" }} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
