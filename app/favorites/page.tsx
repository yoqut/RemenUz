"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageShell } from "@/components/PageShell";
import { ProductTile } from "@/components/ProductTile";
import { useFav } from "@/lib/favorites";
import { useT } from "@/lib/lang";
import { ACCENT } from "@/lib/i18n";

const BLOBS: CSSProperties[] = [
  { top: -160, left: -180, width: 680, height: 680, background: ACCENT, opacity: 0.5 },
  { top: 400, right: -200, width: 620, height: 620, background: "#2F6BFF", opacity: 0.4 },
];

const FT = {
  ru: { title: "Избранное", empty: "Здесь пока пусто. Нажмите ♡ на карточке товара, чтобы сохранить его.", cat: "Перейти в каталог" },
  uz: { title: "Sevimlilar", empty: "Hozircha boʻsh. Saqlash uchun mahsulot kartasidagi ♡ ni bosing.", cat: "Katalogga oʻtish" },
};

/** Favourites saved on this device (see lib/favorites). */
export default function FavoritesPage() {
  const { items } = useFav();
  const f = useT(FT);
  return (
    <PageShell blobs={BLOBS}>
      <Header />
      <section className="sec" style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 40px 96px", display: "flex", flexDirection: "column", gap: 24 }}>
        <h1 className="h1" style={{ margin: 0, fontFamily: "'Oswald', sans-serif", fontSize: 56, fontWeight: 700, lineHeight: 1.05 }}>{f.title}</h1>
        {items.length ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 270px), 1fr))", gap: 18 }}>
            {items.map((p) => <ProductTile key={p.id} p={p} />)}
          </div>
        ) : (
          <div className="glass" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, padding: 28, borderRadius: 28 }}>
            <p style={{ margin: 0 }}>{f.empty}</p>
            <Link href="/catalog" className="liquid" style={{ height: 50, padding: "0 22px", display: "flex", alignItems: "center", borderRadius: 999, backgroundColor: ACCENT, color: "#FFFFFF", fontWeight: 700 }}>{f.cat}</Link>
          </div>
        )}
      </section>
      <Footer />
    </PageShell>
  );
}
