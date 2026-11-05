"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageShell } from "@/components/PageShell";
import { ProductTable } from "@/components/ProductTable";
import { ProductTile } from "@/components/ProductTile";
import { Crumbs } from "@/components/Crumbs";
import { useLang, useT } from "@/lib/lang";
import { T } from "@/lib/i18n";
import { CATALOG_ROOT, CATALOG_T, SPHERES_ROOT, catCode, catName, childrenOf, getCategory, pathOf, type Category } from "@/lib/catalog";
import type { CatalogRow } from "@/lib/products";
import { isInchBelt, nearestByLength } from "@/lib/finder";
import { matchQuery, parseQuery, productTokens } from "@/lib/search";

const PAGE = 50;
const label: CSSProperties = { fontSize: 12, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: "var(--muted)" };

/** Section / profile tile: short code, name and product count. */
function SubTile({ c }: { c: Category }) {
  const { lang } = useLang();
  const ct = useT(CATALOG_T);
  return (
    <Link href={`/catalog/${c.slug}`} className="ind-card ind-link sub-tile" style={{ display: "flex", flexDirection: "column", gap: 4, padding: "12px 14px", minWidth: 0 }}>
      <span className="ind-mono" style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>{catCode(c)}</span>
      <span style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>{catName(c, lang)}</span>
      <span style={{ fontSize: 12, color: "var(--muted)" }}>{c.count ? ct.goods(c.count) : lang === "uz" ? "buyurtma asosida" : "под заказ"}</span>
    </Link>
  );
}

/**
 * Catalog section: sub-sections as tiles, then the products as a size table with filters on the left
 * (search inside the section, brand, length range, width). The finder links here with ?q=<sizes>,
 * the home banners with ?brand=<name>.
 */
export function CatalogView({ catId, products }: { catId: number | null; products: CatalogRow[] }) {
  const { lang } = useLang();
  const t = useT(T);
  const ct = useT(CATALOG_T);
  const cat = catId !== null ? getCategory(catId) : undefined;
  const subs = cat ? childrenOf(cat.id) : childrenOf(CATALOG_ROOT);

  const [q, setQ] = useState("");
  const [brands, setBrands] = useState<string[]>([]);
  const [lenFrom, setLenFrom] = useState("");
  const [lenTo, setLenTo] = useState("");
  const [width, setWidth] = useState("");
  const [view, setView] = useState<"table" | "cards">("table");
  const [shown, setShown] = useState(PAGE);
  const filterBox = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    // Filters start folded on a phone, where they would push the table a screen down.
    if (filterBox.current && window.matchMedia("(max-width: 640px)").matches) filterBox.current.open = false;
    const params = new URLSearchParams(window.location.search);
    /* eslint-disable react-hooks/set-state-in-effect -- read the URL once after mount */
    if (params.get("q")) setQ(params.get("q")!);
    if (params.get("brand")) setBrands([params.get("brand")!]);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const hay = useMemo(() => new Map(products.map((p) => [p.id, productTokens(p)])), [products]);
  const brandCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of products) if (p.brand) m.set(p.brand, (m.get(p.brand) ?? 0) + 1);
    return [...m].sort((a, b) => b[1] - a[1]);
  }, [products]);
  const widths = useMemo(() => [...new Set(products.map((p) => p.width).filter((w): w is string => !!w))].sort((a, b) => parseFloat(a) - parseFloat(b)), [products]);

  const query = useMemo(() => parseQuery(q), [q]);
  const from = parseFloat(lenFrom) || null;
  const to = parseFloat(lenTo) || null;
  const list = useMemo(
    () =>
      products.filter((p) => {
        if (brands.length && (!p.brand || !brands.includes(p.brand))) return false;
        if (width && p.width !== width) return false;
        if ((from !== null || to !== null) && (p.len === null || (from !== null && p.len < from) || (to !== null && p.len > to))) return false;
        return matchQuery(hay.get(p.id) ?? [], query);
      }),
    [products, brands, width, from, to, query, hay],
  );
  // No exact match for a typed length: offer the belts nearest in length instead of a dead end.
  const qLen = useMemo(() => {
    const nums = query.tokens.map(Number).filter((n) => n >= 50);
    return nums.length ? Math.max(...nums) : null;
  }, [query]);
  const near = useMemo(() => (list.length || qLen === null ? [] : nearestByLength(products.filter((p) => !brands.length || (p.brand && brands.includes(p.brand))), qLen, 12)), [list.length, qLen, products, brands]);

  const filtered = !!(q || brands.length || width || lenFrom || lenTo);
  const resetAll = () => {
    setQ(""); setBrands([]); setWidth(""); setLenFrom(""); setLenTo(""); setShown(PAGE);
  };
  const title = cat ? catName(cat, lang) : ct.catalog;
  const crumbs = [{ name: t.home, href: "/" }, { name: ct.catalog, href: cat ? "/catalog" : undefined }, ...(cat ? pathOf(cat.id).map((c, i, a) => ({ name: catName(c, lang), href: i < a.length - 1 ? `/catalog/${c.slug}` : undefined })) : [])];

  const filters = (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label htmlFor="cq" style={label}>{ct.searchIn}</label>
        <input id="cq" type="search" className="ind-input" placeholder="T5 1645" value={q} onChange={(e) => { setQ(e.target.value); setShown(PAGE); }} />
      </div>
      {products.some((p) => p.len !== null) && (
        <fieldset style={{ margin: 0, padding: 0, border: 0, display: "flex", flexDirection: "column", gap: 6 }}>
          <legend style={{ ...label, padding: 0, marginBottom: 6 }}>{ct.colLen}</legend>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            <input aria-label={`${ct.colLen} ${ct.lenFrom}`} inputMode="numeric" className="ind-input ind-mono" placeholder={ct.lenFrom} value={lenFrom} onChange={(e) => { setLenFrom(e.target.value.replace(/[^\d.]/g, "")); setShown(PAGE); }} />
            <input aria-label={`${ct.colLen} ${ct.lenTo}`} inputMode="numeric" className="ind-input ind-mono" placeholder={ct.lenTo} value={lenTo} onChange={(e) => { setLenTo(e.target.value.replace(/[^\d.]/g, "")); setShown(PAGE); }} />
          </div>
        </fieldset>
      )}
      {widths.length > 1 && widths.length <= 24 && (
        <fieldset style={{ margin: 0, padding: 0, border: 0 }}>
          <legend style={{ ...label, padding: 0, marginBottom: 8 }}>{ct.colWidth}</legend>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {widths.map((w) => (
              <button key={w} type="button" aria-pressed={width === w} onClick={() => { setWidth(width === w ? "" : w); setShown(PAGE); }} className={width === w ? "ind-btn ind-primary ind-mono" : "ind-btn ind-mono"} style={{ height: 32, padding: "0 10px", fontSize: 13 }}>{w}</button>
            ))}
          </div>
        </fieldset>
      )}
      {brandCounts.length > 1 && (
        <fieldset style={{ margin: 0, padding: 0, border: 0, display: "flex", flexDirection: "column", gap: 6 }}>
          <legend style={{ ...label, padding: 0, marginBottom: 6 }}>{ct.brand}</legend>
          {brandCounts.map(([b, n]) => (
            <label key={b} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, cursor: "pointer" }}>
              <input type="checkbox" checked={brands.includes(b)} onChange={() => { setBrands(brands.includes(b) ? brands.filter((x) => x !== b) : [...brands, b]); setShown(PAGE); }} style={{ width: 16, height: 16, accentColor: "var(--accent)" }} />
              <span style={{ flex: 1 }}>{b}</span>
              <span className="ind-mono" style={{ fontSize: 12, color: "var(--muted)" }}>{n}</span>
            </label>
          ))}
        </fieldset>
      )}
      {filtered && <button type="button" onClick={resetAll} className="ind-btn">{ct.reset}</button>}
    </div>
  );

  return (
    <PageShell>
      <Header />
      <main style={{ flex: 1, width: "100%", maxWidth: 1320, margin: "0 auto", padding: "20px 20px 48px" }} className="ind-pad">
        <Crumbs items={crumbs} />
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "4px 14px", margin: "10px 0 18px" }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.2 }}>{title}</h1>
          <span className="ind-mono" style={{ fontSize: 13, color: "var(--muted)" }}>{ct.goods(products.length)}</span>
        </div>

        {subs.length > 0 && (
          <section aria-label={cat ? ct.subcats : ct.sections} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 190px), 1fr))", gap: 8, marginBottom: 24 }}>
            {subs.map((c) => <SubTile key={c.id} c={c} />)}
          </section>
        )}
        {!cat && (
          <section aria-label={ct.spheres} style={{ marginBottom: 28 }}>
            <h2 style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 700 }}>{ct.spheres}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 190px), 1fr))", gap: 8 }}>
              {childrenOf(SPHERES_ROOT).map((c) => <SubTile key={c.id} c={c} />)}
            </div>
          </section>
        )}

        {products.length > 0 && (
          <div className="cat-grid" style={{ display: "grid", gridTemplateColumns: "240px minmax(0, 1fr)", gap: 20, alignItems: "start" }}>
            <aside aria-label={ct.filters}>
              <details ref={filterBox} className="ind-card cat-filters" open style={{ padding: 16, position: "sticky", top: 130 }}>
                <summary style={{ fontWeight: 700, fontSize: 15, cursor: "pointer", marginBottom: 14, listStyle: "none" }}>{ct.filters}</summary>
                {filters}
              </details>
            </aside>

            <section aria-label={ct.products} style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{ct.found(list.length)}</span>
                <div role="group" aria-label={ct.view} style={{ display: "flex" }}>
                  {(["table", "cards"] as const).map((v, i) => (
                    <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)} className={view === v ? "ind-btn ind-primary" : "ind-btn"} style={{ height: 34, borderRadius: i ? "0 8px 8px 0" : "8px 0 0 8px", fontSize: 13 }}>
                      {v === "table" ? ct.viewTable : ct.viewCards}
                    </button>
                  ))}
                </div>
              </div>

              {list.length === 0 ? (
                <>
                  {near.length > 0 && qLen !== null && (
                    <>
                      <div className="ind-card" style={{ padding: "14px 16px", borderLeft: "4px solid var(--accent)" }}>
                        <b>{ct.noExact(qLen)}</b>
                        {near.some((p) => isInchBelt(p.name)) && <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{ct.inchNote}</div>}
                      </div>
                      <ProductTable rows={near} />
                    </>
                  )}
                  {!near.length && (
                    <div className="ind-card" style={{ padding: 24, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
                      <p style={{ margin: 0, maxWidth: 620 }}>{ct.nothing}</p>
                      <a href="https://t.me/Remenuz_bot" className="ind-btn ind-primary">{t.tgBtn}</a>
                    </div>
                  )}
                </>
              ) : view === "table" ? (
                <ProductTable rows={list.slice(0, shown)} />
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 240px), 1fr))", gap: 14 }}>
                  {list.slice(0, shown).map((p) => <ProductTile key={p.id} p={p} showLen />)}
                </div>
              )}

              {list.length > shown && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginTop: 8 }}>
                  <span style={{ fontSize: 13, color: "var(--muted)" }}>{ct.shown(shown, list.length)}</span>
                  <button type="button" onClick={() => setShown(shown + PAGE)} className="ind-btn">{ct.more}</button>
                </div>
              )}
            </section>
          </div>
        )}

        {products.length === 0 && (
          <div className="ind-card" style={{ padding: 24, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
            <p style={{ margin: 0, maxWidth: 620 }}>{ct.empty}</p>
            <a href="https://t.me/Remenuz_bot" className="ind-btn ind-primary">{t.tgBtn}</a>
          </div>
        )}
      </main>
      <Footer />
    </PageShell>
  );
}
