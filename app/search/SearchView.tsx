"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageShell } from "@/components/PageShell";
import { Crumbs } from "@/components/Crumbs";
import { ProductTable } from "@/components/ProductTable";
import { CATALOG_T } from "@/lib/catalog";
import { T } from "@/lib/i18n";
import { useT } from "@/lib/lang";
import type { CatalogRow } from "@/lib/products";

/** Header search results: a size table, the nearest lengths when nothing matched, or a way to ask. */
export function SearchView({ q, rows, total, near, loading }: { q: string; rows: CatalogRow[]; total: number; near: CatalogRow[]; loading?: boolean }) {
  const t = useT(T);
  const ct = useT(CATALOG_T);
  const len = Math.max(0, ...q.split(/\D+/).map(Number).filter((n) => n >= 50));
  return (
    <PageShell>
      <Header key={q} q={q} />
      <main className="ind-pad" style={{ flex: 1, width: "100%", maxWidth: 1320, margin: "0 auto", padding: "20px 20px 48px", display: "flex", flexDirection: "column", gap: 14 }}>
        <Crumbs items={[{ name: t.home, href: "/" }, { name: ct.searchTitle }]} />
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "4px 14px" }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>{ct.searchTitle}</h1>
          {q && <span style={{ fontSize: 15, color: "var(--muted)" }}>{ct.searchFor(q)} · <span className="ind-mono">{ct.found(total)}</span></span>}
        </div>

        {rows.length > 0 && <ProductTable rows={rows} />}
        {rows.length > 0 && total > rows.length && <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>{ct.shown(rows.length, total)}</p>}

        {loading && <div className="ind-card" aria-busy="true" style={{ height: 240 }} />}
        {!rows.length && !loading && (
          <>
            {near.length > 0 && (
              <>
                <div className="ind-card" style={{ padding: "14px 16px", borderLeft: "4px solid var(--accent)" }}>
                  <b>{ct.noExactAny(len)}</b>
                </div>
                <ProductTable rows={near} />
              </>
            )}
            <div className="ind-card" style={{ padding: 24, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
              <div style={{ maxWidth: 640 }}>
                <p style={{ margin: 0, fontWeight: 600 }}>{q ? ct.searchEmpty : ct.searchHint}</p>
                {q && <p style={{ margin: "6px 0 0", fontSize: 14, color: "var(--muted)" }}>{ct.searchHint}</p>}
              </div>
              <a href="https://t.me/Remenuz_bot" className="ind-btn ind-primary">{t.tgBtn}</a>
            </div>
          </>
        )}
      </main>
      <Footer />
    </PageShell>
  );
}
