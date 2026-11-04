"use client";

import type { CSSProperties } from "react";
import { useFav } from "@/lib/favorites";
import { useLang } from "@/lib/lang";
import { ACCENT } from "@/lib/i18n";
import type { ProductCard } from "@/lib/products";

/** Heart toggle for a product card; filled accent heart when the product is in favourites.
 *  `offColor` sets the empty-heart colour when the button sits on a white photo instead of glass. */
export function FavButton({ p, style, offColor = "var(--fg)" }: { p: ProductCard; style?: CSSProperties; offColor?: string }) {
  const { has, toggle } = useFav();
  const { lang } = useLang();
  const on = has(p.id);
  const label = on ? (lang === "uz" ? "Sevimlilardan olib tashlash" : "Убрать из избранного") : (lang === "uz" ? "Sevimlilarga" : "В избранное");
  return (
    <button
      type="button"
      onClick={() => toggle(p)}
      aria-pressed={on}
      aria-label={label}
      title={label}
      className="glass-soft"
      style={{ width: 40, height: 40, borderRadius: "50%", color: on ? ACCENT : offColor, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", ...style }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>
    </button>
  );
}
