"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageShell } from "@/components/PageShell";
import { BeltFinder, type FinderQuery } from "@/components/BeltFinder";
import { ProductTile } from "@/components/ProductTile";
import { useT } from "@/lib/lang";
import { ACCENT, T } from "@/lib/i18n";
import type { ProductCard } from "@/lib/products";

const DISPLAY = "'Oswald', sans-serif";

const FT = {
  ru: {
    home: "Главная",
    match: "Подходящие ремни",
    profile: "Ремни этого профиля",
    near: "Похожие ремни этого профиля",
    nearLen: "Точного размера нет — ближайшие по длине",
    none: "В этом профиле пока нет товаров — привезём под заказ. Напишите менеджеру.",
    all: (n: number) => `Все ${n} в каталоге →`,
  },
  uz: {
    home: "Bosh sahifa",
    match: "Mos tasmalar",
    profile: "Shu profildagi tasmalar",
    near: "Shu profildagi oʻxshash tasmalar",
    nearLen: "Aniq oʻlcham yoʻq — uzunligi eng yaqinlari",
    none: "Bu profilda hozircha mahsulot yoʻq — buyurtma asosida olib kelamiz. Menejerga yozing.",
    all: (n: number) => `Katalogda hammasi (${n}) →`,
  },
};

type Results = { exact: ProductCard[]; near: ProductCard[]; total: number };

const grid: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 270px), 1fr))", gap: 18 };
const h2: CSSProperties = { margin: 0, display: "flex", alignItems: "center", gap: 12, fontFamily: DISPLAY, fontSize: 28, fontWeight: 700 };

/** "Подбор ремня": the finder form, and under it the products that match it, updated as you type. */
export function FinderView() {
  const t = useT(T);
  const f = useT(FT);
  const [query, setQuery] = useState<FinderQuery | null>(null);
  const [res, setRes] = useState<Results | null>(null);
  const onQuery = useCallback((q: FinderQuery) => setQuery(q), []);

  // Debounced so typing "1645" asks once, not four times; a stale answer never overwrites a newer one.
  useEffect(() => {
    if (!query?.cat) return;
    let live = true;
    const id = setTimeout(() => {
      const sp = new URLSearchParams({ cat: String(query.cat), q: query.q, len: query.len });
      fetch(`/api/finder?${sp}`)
        .then((r) => r.json())
        .then((r: Results) => live && setRes(r))
        .catch(() => {});
    }, 250);
    return () => {
      live = false;
      clearTimeout(id);
    };
  }, [query]);

  const typed = !!query?.q;
  return (
    <PageShell>
      <Header />
      <section className="sec" style={{ maxWidth: 1320, margin: "0 auto", padding: "16px 20px 72px", display: "flex", flexDirection: "column", gap: 16 }}>
        <nav aria-label="Навигация" className="glass-soft" style={{ alignSelf: "start", display: "flex", gap: 8, padding: "6px 14px", borderRadius: 999, fontSize: 13, color: "rgb(var(--ink) / .75)" }}>
          <Link href="/">{f.home}</Link><span aria-hidden="true">›</span><span style={{ color: "var(--fg)", fontWeight: 600 }}>{t.nFind}</span>
        </nav>
        <BeltFinder page onQuery={onQuery} />

        {res && (
          <div aria-live="polite" style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
            {res.exact.length > 0 && (
              <>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "end", gap: 12 }}>
                  <h2 className="h2" style={h2}>
                    <span aria-hidden="true" style={{ flex: "none", width: 6, height: "0.9em", borderRadius: 3, background: ACCENT }} />
                    {typed ? f.match : f.profile} <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, color: "rgb(var(--ink) / .6)" }}>{res.total}</span>
                  </h2>
                  {query && res.total > res.exact.length && (
                    <Link href={query.href} className="glass-soft" style={{ padding: "10px 18px", borderRadius: 999, fontWeight: 700 }}>{f.all(res.total)}</Link>
                  )}
                </div>
                <div style={grid}>{res.exact.map((p) => <ProductTile key={p.id} p={p} showLen />)}</div>
              </>
            )}
            {res.near.length > 0 && (
              <>
                <h2 className="h2" style={{ ...h2, fontSize: 22, marginTop: res.exact.length ? 16 : 0 }}>{query?.len && !res.exact.length ? f.nearLen : f.near}</h2>
                <div style={grid}>{res.near.map((p) => <ProductTile key={p.id} p={p} showLen />)}</div>
              </>
            )}
            {!res.exact.length && !res.near.length && (
              <p className="glass" style={{ margin: 0, padding: 24, borderRadius: 24 }}>{f.none}</p>
            )}
          </div>
        )}
      </section>
      <Footer />
    </PageShell>
  );
}
