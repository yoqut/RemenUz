"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageShell } from "@/components/PageShell";
import { ProductTile } from "@/components/ProductTile";
import { useT } from "@/lib/lang";
import { ACCENT, T } from "@/lib/i18n";
import type { ProductCard } from "@/lib/products";

const DISPLAY = "'Oswald', sans-serif";

const BLOBS: CSSProperties[] = [
  { top: -160, left: -180, width: 680, height: 680, background: ACCENT, opacity: 0.5 },
  { top: 400, right: -200, width: 620, height: 620, background: "#6A4CFF", opacity: 0.4 },
];

const PT = {
  ru: { title: "Акции", lead: "Спеццены на ремни и бесплатная доставка крупных заказов. Список обновляется вместе с каталогом.", home: "Главная", offers: "Спеццены и хиты продаж", none: "Сейчас акций нет — загляните позже или спросите менеджера." },
  uz: { title: "Aksiyalar", lead: "Tasmalarga maxsus narxlar va yirik buyurtmalarni bepul yetkazish. Roʻyxat katalog bilan birga yangilanadi.", home: "Bosh sahifa", offers: "Maxsus narxlar va xitlar", none: "Hozircha aksiya yoʻq — keyinroq kiring yoki menejerdan soʻrang." },
};

/** "Акции": the free-delivery offer and every special-price / hit product. */
export function PromoView({ offers }: { offers: ProductCard[] }) {
  const t = useT(T);
  const p = useT(PT);
  return (
    <PageShell blobs={BLOBS}>
      <Header />
      <section className="sec" style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 40px 96px", display: "flex", flexDirection: "column", gap: 28 }}>
        <nav aria-label="Навигация" className="glass-soft" style={{ alignSelf: "start", display: "flex", gap: 8, padding: "8px 16px", borderRadius: 999, fontSize: 14, color: "rgb(var(--ink) / .75)" }}>
          <Link href="/">{p.home}</Link><span aria-hidden="true">›</span><span style={{ color: "var(--fg)", fontWeight: 600 }}>{p.title}</span>
        </nav>
        <div>
          <h1 className="h1" style={{ margin: 0, fontFamily: DISPLAY, fontSize: 60, fontWeight: 700, lineHeight: 1.05 }}>{p.title}</h1>
          <p style={{ margin: "12px 0 0", fontSize: 18, maxWidth: 640, color: "rgb(var(--ink) / .8)" }}>{p.lead}</p>
        </div>

        <div className="liquid" style={{ position: "relative", overflow: "hidden", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20, padding: "28px 32px", borderRadius: 28, backgroundColor: ACCENT, color: "#FFFFFF" }}>
          <span className="drop" aria-hidden="true" style={{ position: "absolute", right: -40, top: -60, width: 200, height: 200 }} />
          <div style={{ position: "relative" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, letterSpacing: 1 }}>{t.delivery}</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 34, fontWeight: 700, lineHeight: 1.1, marginTop: 6 }}>{t.delTitle}</div>
            <p style={{ margin: "8px 0 0", fontSize: 16 }}>{t.delText}</p>
          </div>
          <Link href="/info/delivery" style={{ position: "relative", height: 50, padding: "0 22px", display: "flex", alignItems: "center", fontWeight: 700, borderRadius: 999, background: "rgba(255,255,255,.22)", border: "1px solid rgba(255,255,255,.45)", color: "#FFFFFF" }}>{t.delBtn}</Link>
        </div>

        <h2 className="h2" style={{ margin: "12px 0 0", display: "flex", alignItems: "center", gap: 14, fontFamily: DISPLAY, fontSize: 38, fontWeight: 700 }}>
          <span aria-hidden="true" style={{ flex: "none", width: 6, height: "0.9em", borderRadius: 3, background: ACCENT }} />
          {p.offers}
        </h2>
        {offers.length ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 270px), 1fr))", gap: 18 }}>
            {offers.map((o) => <ProductTile key={o.id} p={o} />)}
          </div>
        ) : (
          <p className="glass" style={{ margin: 0, padding: 28, borderRadius: 28 }}>{p.none}</p>
        )}
      </section>
      <Footer />
    </PageShell>
  );
}
