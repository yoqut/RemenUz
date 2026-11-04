"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { fullImg } from "@/lib/images";

/**
 * Product photo from api.remen.uz. Some -small variants are missing there; swap to the original
 * once. The check also runs on mount, because a 404 that lands before hydration never reaches onError.
 */
export function Photo({ src, style }: { src: string; style?: CSSProperties }) {
  const ref = useRef<HTMLImageElement>(null);
  const retry = () => {
    const img = ref.current;
    const full = fullImg(src);
    if (img && full && img.src !== full) img.src = full;
  };
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) retry();
  });
  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={ref} src={src} alt="" loading="lazy" onError={retry} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", ...style }} />;
}
