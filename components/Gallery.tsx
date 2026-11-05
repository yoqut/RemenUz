"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Photo } from "./Photo";

/** The api.remen.uz "-small" variant of an original, for thumbnails (Photo falls back to the original). */
const small = (url: string) => url.replace(/(\.\w+)$/, "-small$1");

const arrowBtn = (side: "left" | "right"): CSSProperties => ({
  position: "absolute", top: "50%", [side]: 10, transform: "translateY(-50%)", width: 40, height: 40, borderRadius: 8,
  border: "1px solid #E1E4E8", background: "rgba(255,255,255,.95)", color: "#15171A", cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
});
const chevron = (d: string) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d={d} /></svg>
);

/**
 * Product photo gallery: a swipeable main photo (scroll-snap, so phones swipe it), arrows and a counter,
 * a thumbnail strip, and a full-screen viewer on click (Esc closes, ← → page). `overlay` sits on the
 * main photo (the favourites heart).
 */
export function Gallery({ images, alt, overlay, labels }: { images: string[]; alt: string; overlay?: ReactNode; labels: { prev: string; next: string; open: string; close: string } }) {
  const track = useRef<HTMLDivElement>(null);
  const [cur, setCur] = useState(0);
  const [zoom, setZoom] = useState(false);
  const n = images.length;

  const go = (k: number) => {
    const el = track.current;
    const i = (k + n) % n;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
    setCur(i);
  };

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(false);
      else if (e.key === "ArrowRight") setCur((c) => (c + 1) % n);
      else if (e.key === "ArrowLeft") setCur((c) => (c - 1 + n) % n);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [zoom, n]);

  // Keep the main photo on the slide picked in the full-screen viewer.
  useEffect(() => {
    const el = track.current;
    if (el && Math.round(el.scrollLeft / (el.clientWidth || 1)) !== cur) el.scrollTo({ left: cur * el.clientWidth });
  }, [cur]);

  if (!n) {
    return (
      <div className="ind-card" style={{ position: "relative", aspectRatio: "1 / 1", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span className="ind-mono" style={{ fontSize: 28, fontWeight: 700, color: "#9AA3AE" }}>{alt}</span>
        {overlay}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
      <div className="ind-card" style={{ position: "relative", overflow: "hidden", background: "#FFFFFF" }}>
        <div
          ref={track}
          className="slider-track"
          onScroll={(e) => setCur(Math.round(e.currentTarget.scrollLeft / (e.currentTarget.clientWidth || 1)))}
          style={{ display: "flex", overflowX: "auto", scrollSnapType: "x mandatory", aspectRatio: "1 / 1" }}
        >
          {images.map((src, i) => (
            <button key={src} type="button" onClick={() => { setCur(i); setZoom(true); }} aria-label={`${labels.open} ${i + 1}/${n}`} style={{ flex: "0 0 100%", scrollSnapAlign: "start", border: 0, padding: 24, background: "#FFFFFF", cursor: "zoom-in", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={i === 0 ? alt : `${alt} — ${i + 1}`} loading={i === 0 ? "eager" : "lazy"} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />
            </button>
          ))}
        </div>
        {n > 1 && (
          <>
            <button type="button" aria-label={labels.prev} onClick={() => go(cur - 1)} className="hide-sm" style={arrowBtn("left")}>{chevron("M15 5l-7 7 7 7")}</button>
            <button type="button" aria-label={labels.next} onClick={() => go(cur + 1)} className="hide-sm" style={arrowBtn("right")}>{chevron("M9 5l7 7-7 7")}</button>
            <span className="ind-mono" aria-live="polite" style={{ position: "absolute", left: 12, bottom: 12, padding: "2px 8px", borderRadius: 4, background: "rgba(21,23,26,.75)", color: "#FFFFFF", fontSize: 12 }}>{cur + 1} / {n}</span>
          </>
        )}
        {overlay}
      </div>

      {n > 1 && (
        <div className="slider-track" role="tablist" style={{ display: "flex", gap: 8, overflowX: "auto" }}>
          {images.map((src, i) => (
            <button key={src} type="button" role="tab" aria-selected={i === cur} aria-label={`${i + 1}/${n}`} onClick={() => go(i)} style={{ flex: "0 0 68px", height: 68, padding: 4, borderRadius: 8, background: "#FFFFFF", cursor: "pointer", border: i === cur ? "2px solid var(--accent)" : "1px solid var(--line)" }}>
              <Photo src={small(src)} />
            </button>
          ))}
        </div>
      )}

      {zoom && (
        <div role="dialog" aria-modal="true" aria-label={alt} onClick={() => setZoom(false)} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(10,12,16,.92)", display: "flex", alignItems: "center", justifyContent: "center", padding: "56px 16px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[cur]} alt={alt} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", background: "#FFFFFF", borderRadius: 8 }} />
          <button type="button" aria-label={labels.close} autoFocus onClick={() => setZoom(false)} style={{ ...arrowBtn("right"), top: 16, transform: "none" }}>{chevron("M6 6l12 12M18 6L6 18")}</button>
          {n > 1 && (
            <>
              <button type="button" aria-label={labels.prev} onClick={(e) => { e.stopPropagation(); setCur((cur - 1 + n) % n); }} style={arrowBtn("left")}>{chevron("M15 5l-7 7 7 7")}</button>
              <button type="button" aria-label={labels.next} onClick={(e) => { e.stopPropagation(); setCur((cur + 1) % n); }} style={arrowBtn("right")}>{chevron("M9 5l7 7-7 7")}</button>
              <span className="ind-mono" style={{ position: "absolute", bottom: 18, left: "50%", transform: "translateX(-50%)", color: "#FFFFFF", fontSize: 13 }}>{cur + 1} / {n}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
