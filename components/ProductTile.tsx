"use client";

import Link from "next/link";
import { useT } from "@/lib/lang";
import { ACCENT } from "@/lib/i18n";
import { CATALOG_T, formatPrice } from "@/lib/catalog";
import { isInchBelt, lengthMm } from "@/lib/finder";
import type { ProductCard } from "@/lib/products";
import { BuyControls } from "./AddToCartButton";
import { FavButton } from "./FavButton";
import { Photo } from "./Photo";

const MONO = "'JetBrains Mono', monospace";

const badge = (filled: boolean) => ({
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 0.5,
  textTransform: "uppercase" as const,
  backgroundColor: filled ? ACCENT : "rgba(255,255,255,.92)",
  color: filled ? "#FFFFFF" : ACCENT,
  border: `1px solid ${ACCENT}`,
});

/**
 * Product card used across the shop: photo with Хит / Новинка badges and a favourites heart,
 * the brand as the card header, then name, price and add-to-cart.
 * `tag` replaces the automatic badge (e.g. "Спеццена"); `showLen` adds the belt length in mm.
 */
export function ProductTile({ p, tag, showLen }: { p: ProductCard; tag?: string; showLen?: boolean }) {
  const ct = useT(CATALOG_T);
  const tags = tag ? [{ text: tag, filled: true }] : [p.isHit && { text: ct.hit, filled: true }, p.isNew && { text: ct.isNew, filled: false }].filter((x): x is { text: string; filled: boolean } => !!x);
  return (
    <div className="glass lift" style={{ display: "flex", flexDirection: "column", gap: 10, padding: 14, borderRadius: 28, transition: "transform .2s", minWidth: 0 }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", borderRadius: 20, overflow: "hidden", background: "#FFFFFF" }}>
        <Link href={`/product/${p.slug}`} aria-hidden="true" tabIndex={-1} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
          {p.imgSmall ? (
            <Photo src={p.imgSmall} />
          ) : (
            <span className="drop" style={{ width: 120, height: 120 }} />
          )}
        </Link>
        {tags.length > 0 && (
          <span style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6 }}>
            {tags.map((b) => <span key={b.text} style={badge(b.filled)}>{b.text}</span>)}
          </span>
        )}
        <FavButton p={p} offColor="#15171A" style={{ position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,.92)", borderColor: "rgba(21,23,26,.12)" }} />
      </div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, padding: "2px 4px 0", minWidth: 0 }}>
        <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 600, letterSpacing: 0.6, textTransform: "uppercase", color: "var(--promo)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.brand ?? "Remen.uz"}</span>
        <span style={{ fontFamily: MONO, fontSize: 11, color: "rgb(var(--ink) / .6)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}>{p.sku}</span>
      </div>
      {showLen && <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color: "var(--promo)", padding: "0 4px" }}>{isInchBelt(p.name) ? "≈ " : "L = "}{lengthMm(p.name)} {ct.mm}</span>}
      <Link href={`/product/${p.slug}`} style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.4, minHeight: 63, padding: "0 4px" }}>{p.name}</Link>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: "auto" }}>
        {p.price > 0 ? (
          <span style={{ fontFamily: MONO, fontSize: 18, fontWeight: 600, padding: "0 4px" }}>
            {formatPrice(p.price)} <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 500, color: "rgb(var(--ink) / .72)" }}>{p.perMeter ? ct.perM : ct.sum}</span>
          </span>
        ) : (
          <span style={{ fontSize: 14, fontWeight: 600, color: "rgb(var(--ink) / .8)", padding: "0 4px" }}>{ct.onRequest}</span>
        )}
        <BuyControls label={ct.toCart} product={{ id: p.id, slug: p.slug, name: p.name, sku: p.sku, brand: p.brand, price: p.price, perMeter: p.perMeter, img: p.imgSmall }} />
      </div>
    </div>
  );
}
