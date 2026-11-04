"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageShell } from "@/components/PageShell";
import { useLang, useT } from "@/lib/lang";
import { ACCENT, T } from "@/lib/i18n";
import {
  CATALOG_ROOT, CATALOG_T, SPHERES_ROOT, catCode, catName, childrenOf, formatPrice, getCategory, pathOf, type Category,
} from "@/lib/catalog";
import type { ProductCard } from "@/lib/products";
import { fullImg } from "@/lib/images";
import { AddToCartButton } from "@/components/AddToCartButton";

const MONO = "'JetBrains Mono', monospace";
const DISPLAY = "'Unbounded', sans-serif";
const PAGE = 24;

const BLOBS: CSSProperties[] = [
  { top: -160, left: -180, width: 680, height: 680, background: ACCENT, opacity: 0.5 },
  { top: 300, right: -200, width: 620, height: 620, background: "#2F6BFF", opacity: 0.45 },
  { top: 1500, left: "30%", width: 560, height: 560, background: "#12B5A6", opacity: 0.3 },
];

type Sort = "default" | "cheap" | "dear" | "name";

function SubCard({ c, small }: { c: Category; small?: boolean }) {
  const { lang } = useLang();
  const ct = useT(CATALOG_T);
  return (
    <Link href={`/catalog/${c.slug}`} className="glass lift" style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: small ? 18 : 40, minHeight: small ? 120 : 170, padding: small ? 20 : 24, borderRadius: 28, overflow: "hidden", transition: "transform .2s" }}>
      <span className="drop" aria-hidden="true" style={{ position: "absolute", top: -30, right: -30, width: small ? 90 : 120, height: small ? 90 : 120 }} />
      <span style={{ position: "relative", fontFamily: MONO, fontSize: 12, color: "rgba(255,255,255,.78)" }}>{catCode(c)}</span>
      <div style={{ position: "relative" }}>
        <div style={{ fontFamily: DISPLAY, fontSize: small ? 17 : 20, fontWeight: 600, lineHeight: 1.2 }}>{catName(c, lang)}</div>
        <div style={{ marginTop: 6, fontSize: 13, color: "rgba(255,255,255,.72)" }}>{ct.goods(c.count)}</div>
      </div>
    </Link>
  );
}

function ProductTile({ p }: { p: ProductCard }) {
  const ct = useT(CATALOG_T);
  return (
    <div className="glass lift" style={{ display: "flex", flexDirection: "column", gap: 12, padding: 14, borderRadius: 28, transition: "transform .2s" }}>
      <Link href={`/product/${p.slug}`} aria-hidden="true" tabIndex={-1} style={{ position: "relative", height: 190, borderRadius: 20, background: "rgba(0,0,0,.22)", boxShadow: "inset 0 2px 10px rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {p.imgSmall ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.imgSmall}
            alt=""
            loading="lazy"
            // Some -small variants are missing on api.remen.uz; fall back to the original once.
            onError={(e) => { const full = fullImg(p.imgSmall); if (full && e.currentTarget.src !== full) e.currentTarget.src = full; }}
            style={{ width: "100%", height: "100%", objectFit: "contain", background: "#FFFFFF", display: "block" }}
          />
        ) : (
          <span className="drop" style={{ width: 120, height: 120 }} />
        )}
        {(p.isNew || p.isHit) && (
          <span className="glass-soft" style={{ position: "absolute", top: 10, left: 10, padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>{p.isHit ? ct.hit : ct.isNew}</span>
        )}
      </Link>
      <span style={{ fontFamily: MONO, fontSize: 12, color: "rgba(255,255,255,.72)", padding: "0 4px", overflowWrap: "anywhere" }}>{[p.brand, p.sku].filter(Boolean).join(" · ")}</span>
      <Link href={`/product/${p.slug}`} style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.4, minHeight: 63, padding: "0 4px" }}>{p.name}</Link>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: "auto", padding: "0 0 0 4px" }}>
        {p.price > 0 ? (
          <span style={{ fontFamily: MONO, fontSize: 18, fontWeight: 600 }}>
            {formatPrice(p.price)} <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,.72)" }}>{p.perMeter ? ct.perM : ct.sum}</span>
          </span>
        ) : (
          <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,.8)" }}>{ct.onRequest}</span>
        )}
        <AddToCartButton label={ct.toCart} product={{ id: p.id, slug: p.slug, name: p.name, sku: p.sku, brand: p.brand, price: p.price, perMeter: p.perMeter, img: p.imgSmall }} />
      </div>
    </div>
  );
}

export function CatalogView({ catId, products }: { catId: number | null; products: ProductCard[] }) {
  const { lang } = useLang();
  const t = useT(T);
  const ct = useT(CATALOG_T);
  const cat = catId !== null ? getCategory(catId) : undefined;
  const trail = cat ? pathOf(cat.id) : [];
  const subs = cat ? childrenOf(cat.id) : childrenOf(CATALOG_ROOT);

  const [q, setQ] = useState("");
  // The belt finder links here with ?q=<sizes>; prefill the search from it.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("q");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read the URL once after mount
    if (fromUrl) setQ(fromUrl);
  }, []);
  const [brand, setBrand] = useState("");
  const [sort, setSort] = useState<Sort>("default");
  const [shown, setShown] = useState(PAGE);

  const brands = useMemo(() => [...new Set(products.map((p) => p.brand).filter((b): b is string => !!b))].sort(), [products]);
  const list = useMemo(() => {
    // Every word must match somewhere in name / SKU / brand, in any order ("1645 25" finds "T5 1645 25 NFT A").
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const out = products.filter((p) => {
      if (brand && p.brand !== brand) return false;
      const hay = `${p.name} ${p.sku} ${p.brand ?? ""}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
    if (sort === "cheap") out.sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
    if (sort === "dear") out.sort((a, b) => b.price - a.price);
    if (sort === "name") out.sort((a, b) => a.name.localeCompare(b.name, "ru"));
    return out;
  }, [products, q, brand, sort]);

  const title = cat ? catName(cat, lang) : ct.catalog;
  const reset = () => setShown(PAGE);

  return (
    <PageShell blobs={BLOBS}>
      <Header />
      <main className="sec" style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 40px 96px" }}>
        <nav aria-label="Навигация" className="glass-soft" style={{ display: "inline-flex", flexWrap: "wrap", gap: 8, padding: "8px 16px", borderRadius: 999, fontSize: 14, color: "rgba(255,255,255,.75)" }}>
          <Link href="/" style={{ color: "rgba(255,255,255,.75)" }}>{t.home}</Link>
          <span aria-hidden="true">›</span>
          {cat ? <Link href="/catalog" style={{ color: "rgba(255,255,255,.75)" }}>{ct.catalog}</Link> : <span aria-current="page" style={{ color: "#FFFFFF", fontWeight: 600 }}>{ct.catalog}</span>}
          {trail.map((c, i) => (
            <span key={c.id} style={{ display: "contents" }}>
              <span aria-hidden="true">›</span>
              {i === trail.length - 1 ? (
                <span aria-current="page" style={{ color: "#FFFFFF", fontWeight: 600 }}>{catName(c, lang)}</span>
              ) : (
                <Link href={`/catalog/${c.slug}`} style={{ color: "rgba(255,255,255,.75)" }}>{catName(c, lang)}</Link>
              )}
            </span>
          ))}
        </nav>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "end", justifyContent: "space-between", gap: 12, margin: "24px 0 28px" }}>
          <h1 className="h1" style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 700, fontSize: 48, lineHeight: 1.08, letterSpacing: -1.2, overflowWrap: "anywhere" }}>{title}</h1>
          <span className="glass-soft" style={{ padding: "8px 16px", borderRadius: 999, fontFamily: MONO, fontSize: 13 }}>{ct.goods(products.length)}</span>
        </div>

        {subs.length > 0 && (
          <section aria-label={cat ? ct.subcats : ct.sections} style={{ marginBottom: 40 }}>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${cat ? 220 : 270}px), 1fr))`, gap: 14 }}>
              {subs.map((c) => (
                <SubCard key={c.id} c={c} small={!!cat} />
              ))}
            </div>
          </section>
        )}

        {!cat && (
          <section aria-label={ct.spheres} style={{ marginBottom: 48 }}>
            <h2 className="h2" style={{ margin: "0 0 18px", fontFamily: DISPLAY, fontSize: 30, fontWeight: 600, letterSpacing: -0.8 }}>{ct.spheres}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 270px), 1fr))", gap: 14 }}>
              {childrenOf(SPHERES_ROOT).map((c) => (
                <SubCard key={c.id} c={c} />
              ))}
            </div>
          </section>
        )}

        <section aria-label={ct.products}>
          <div className="glass" style={{ borderRadius: 28, padding: 12, display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 22 }}>
            <label htmlFor="cq" className="sr">{ct.searchIn}</label>
            <input id="cq" type="search" className="field" placeholder={ct.searchIn} value={q} onChange={(e) => { setQ(e.target.value); reset(); }} style={{ flex: "1 1 260px", minWidth: 0, borderRadius: 999 }} />
            <label htmlFor="cbrand" className="sr">{ct.brand}</label>
            <select id="cbrand" className="field" value={brand} onChange={(e) => { setBrand(e.target.value); reset(); }} style={{ flex: "1 1 180px", minWidth: 0, borderRadius: 999 }}>
              <option value="">{ct.allBrands}</option>
              {brands.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            <label htmlFor="csort" className="sr">{ct.sort}</label>
            <select id="csort" className="field" value={sort} onChange={(e) => { setSort(e.target.value as Sort); reset(); }} style={{ flex: "1 1 180px", minWidth: 0, borderRadius: 999 }}>
              <option value="default">{ct.sortPop}</option>
              <option value="cheap">{ct.sortCheap}</option>
              <option value="dear">{ct.sortDear}</option>
              <option value="name">{ct.sortName}</option>
            </select>
          </div>

          {list.length === 0 ? (
            <div className="glass" style={{ borderRadius: 28, padding: 32, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <p style={{ margin: 0, maxWidth: 640, color: "rgba(255,255,255,.85)" }}>{products.length ? ct.nothing : ct.empty}</p>
              <a href="https://t.me/Remenuz_bot" className="liquid" style={{ height: 50, padding: "0 22px", display: "flex", alignItems: "center", borderRadius: 999, backgroundColor: ACCENT, fontWeight: 700 }}>{t.tgBtn}</a>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))", gap: 16 }}>
                {list.slice(0, shown).map((p) => (
                  <ProductTile key={p.id} p={p} />
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginTop: 28 }}>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,.72)" }}>{ct.shown(Math.min(shown, list.length), list.length)}</span>
                {shown < list.length && (
                  <button type="button" onClick={() => setShown(shown + PAGE)} className="glass" style={{ height: 54, padding: "0 34px", borderRadius: 999, color: "#FFFFFF", font: "inherit", fontWeight: 700, cursor: "pointer" }}>{ct.more}</button>
                )}
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </PageShell>
  );
}
