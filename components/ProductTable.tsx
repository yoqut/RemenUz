"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import { CATALOG_T, formatPrice } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { useT } from "@/lib/lang";
import type { CatalogRow } from "@/lib/products";
import { Photo } from "./Photo";

type SortKey = "len" | "price" | null;
type SpecCol = { key: "profile" | "len" | "width" | "teeth" | "ribs" | "brand"; label: string };

/** Quantity box and cart button for one row; once the item is in the cart, a link to the cart instead. */
function RowBuy({ r }: { r: CatalogRow }) {
  const ct = useT(CATALOG_T);
  const { add, items } = useCart();
  const [qty, setQty] = useState("1");
  const line = items.find((x) => x.id === r.id);
  if (line) {
    return (
      <Link href="/cart" title={`${ct.inCartShort}: ${line.qty}`} aria-label={`${ct.inCartShort}: ${line.qty}`} className="ind-btn" style={{ height: 36, padding: "0 10px", color: "var(--stock)", borderColor: "var(--stock)", fontSize: 13 }}>
        ✓ {ct.inCartShort}
      </Link>
    );
  }
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <input
        aria-label={`${ct.qty}: ${r.sku}`}
        inputMode="numeric"
        value={qty}
        onChange={(e) => setQty(e.target.value.replace(/\D/g, "").slice(0, 4))}
        onFocus={(e) => e.target.select()}
        className="ind-input ind-mono"
        style={{ width: 52, height: 36, textAlign: "center", padding: "0 4px" }}
      />
      <button
        type="button"
        aria-label={`${ct.toCart}: ${r.sku}`}
        title={ct.toCart}
        onClick={() => add({ id: r.id, slug: r.slug, name: r.name, sku: r.sku, brand: r.brand, price: r.price, perMeter: r.perMeter, img: r.imgSmall }, Number(qty) || 1)}
        className="ind-btn ind-primary"
        style={{ width: 40, height: 36, padding: 0 }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><path d="M3 4h2l2.4 11h11l2-8H6.2" /><circle cx="9" cy="19.5" r="1.5" /><circle cx="17" cy="19.5" r="1.5" /></svg>
      </button>
    </span>
  );
}

const th: CSSProperties = { fontFamily: "inherit", fontSize: 12, fontWeight: 600, lineHeight: 1.25, color: "var(--muted)", textAlign: "left" };

/**
 * Size table (McMaster-style): one row per belt with the sizes buyers compare, the price and an inline
 * quantity + cart button. Spec columns appear only when the rows carry them (no "Profile" column inside
 * a single profile). Length and price headers sort. On phones each row folds into a compact card.
 */
export function ProductTable({ rows, highlight }: { rows: CatalogRow[]; highlight?: number }) {
  const ct = useT(CATALOG_T);
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: null, dir: 1 });

  const cols = useMemo<SpecCol[]>(() => {
    const has = (f: (r: CatalogRow) => unknown) => rows.some((r) => f(r) !== null && f(r) !== undefined && f(r) !== "");
    const out: SpecCol[] = [];
    if (new Set(rows.map((r) => r.profile).filter(Boolean)).size > 1) out.push({ key: "profile", label: ct.colProfile });
    if (has((r) => r.len)) out.push({ key: "len", label: rows.every((r) => r.len === null || r.lenKind === "Lp") ? ct.colLenLp : ct.colLen });
    if (has((r) => r.width)) out.push({ key: "width", label: rows.every((r) => !r.width || r.perMeter) ? ct.colDia : ct.colWidth });
    if (has((r) => r.teeth)) out.push({ key: "teeth", label: ct.colTeeth });
    if (has((r) => r.ribs)) out.push({ key: "ribs", label: ct.colRibs });
    if (has((r) => r.brand)) out.push({ key: "brand", label: ct.colBrand });
    return out;
  }, [rows, ct]);

  const sorted = useMemo(() => {
    if (!sort.key) return rows;
    const k = sort.key;
    // Unknown lengths and "price on request" always sink to the bottom.
    const v = (r: CatalogRow) => (k === "len" ? r.len : r.price || null);
    return [...rows].sort((a, b) => {
      const x = v(a), y = v(b);
      if (x === null) return 1;
      if (y === null) return -1;
      return (x - y) * sort.dir;
    });
  }, [rows, sort]);

  const toggle = (key: SortKey) => setSort((s) => ({ key, dir: s.key === key ? (s.dir === 1 ? -1 : 1) : 1 }));
  const arrow = (key: SortKey) => (sort.key === key ? (sort.dir === 1 ? " ↑" : " ↓") : "");
  // Fixed photo and buy columns, flexible text; below the sum of the minimums the table scrolls sideways
  // instead of clipping the price and buy columns.
  const grid = `48px minmax(170px, 2.4fr) ${cols.map((c) => (c.key === "brand" ? "minmax(84px, .9fr)" : "minmax(52px, .6fr)")).join(" ")} minmax(100px, 1fr) 124px`;
  const minW = 48 + 170 + cols.reduce((s, c) => s + (c.key === "brand" ? 84 : 52), 0) + 100 + 124 + 12 * (cols.length + 3) + 32;

  const cell = (r: CatalogRow, key: SpecCol["key"]) => {
    if (key === "len") return r.len !== null ? String(r.len) : "—";
    if (key === "brand") return r.brand ?? "—";
    return r[key] ?? "—";
  };

  return (
    <div className="ind-card pt" role="table" aria-rowcount={rows.length + 1} style={{ overflowX: "auto", overflowY: "hidden" }}>
      <div className="pt-row pt-head" role="row" style={{ gridTemplateColumns: grid, minWidth: minW, background: "var(--row)" }}>
        <span aria-hidden="true" />
        <span role="columnheader" style={th}>{ct.colItem}</span>
        <span className="pt-specs">
          {cols.map((c) =>
            c.key === "len" ? (
              <button key={c.key} type="button" role="columnheader" aria-sort={sort.key === "len" ? (sort.dir === 1 ? "ascending" : "descending") : "none"} onClick={() => toggle("len")} style={{ ...th, border: 0, background: "transparent", padding: 0, cursor: "pointer" }}>
                {c.label}{arrow("len")}
              </button>
            ) : (
              <span key={c.key} role="columnheader" style={th}>{c.label}</span>
            ),
          )}
        </span>
        <button type="button" role="columnheader" aria-sort={sort.key === "price" ? (sort.dir === 1 ? "ascending" : "descending") : "none"} onClick={() => toggle("price")} style={{ ...th, textAlign: "right", border: 0, background: "transparent", padding: 0, cursor: "pointer" }}>
          {ct.colPrice}{arrow("price")}
        </button>
        <span role="columnheader" className="sr">{ct.colBuy}</span>
      </div>
      {sorted.map((r) => (
        <div key={r.id} role="row" className="pt-row" style={{ gridTemplateColumns: grid, minWidth: minW, background: r.id === highlight ? "color-mix(in srgb, var(--accent) 8%, var(--surface))" : undefined }}>
          <Link href={`/product/${r.slug}`} tabIndex={-1} aria-hidden="true" className="pt-img" style={{ width: 48, height: 48, borderRadius: 6, overflow: "hidden", background: "#FFFFFF", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {r.imgSmall && !r.imgSmall.includes("no-image") ? <Photo src={r.imgSmall} /> : null}
          </Link>
          <span role="cell" className="pt-name" style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
            <Link href={`/product/${r.slug}`} className="ind-link" style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{r.name}</Link>
            {r.sku && <span className="ind-mono" style={{ fontSize: 12, color: "var(--muted)", overflowWrap: "anywhere" }}>{ct.sku}: {r.sku}</span>}
          </span>
          <span className="pt-specs">
            {cols.map((c) => (
              <span key={c.key} role="cell" data-label={c.label} className={c.key === "brand" ? "pt-spec" : "pt-spec ind-mono"} style={{ fontSize: c.key === "brand" ? 13 : 14, fontWeight: c.key === "len" ? 700 : 500 }}>
                {cell(r, c.key)}
              </span>
            ))}
          </span>
          <span role="cell" className="pt-price ind-mono" style={{ textAlign: "right", fontWeight: 700, fontSize: 15, whiteSpace: "nowrap" }}>
            {r.price > 0 ? (
              <>
                {formatPrice(r.price)}
                <span style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500, color: "var(--muted)" }}>{r.perMeter ? ct.perM : ct.sum}</span>
              </>
            ) : (
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "var(--muted)", whiteSpace: "normal" }}>{ct.onRequest}</span>
            )}
          </span>
          <span role="cell" className="pt-buy" style={{ display: "flex", justifyContent: "flex-end" }}>
            <RowBuy r={r} />
          </span>
        </div>
      ))}
    </div>
  );
}
