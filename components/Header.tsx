"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { useLang, useT } from "@/lib/lang";
import { ACCENT, T } from "@/lib/i18n";
import { CATALOG_ROOT, CATALOG_T, SPHERES_ROOT, catCode, catName, childrenOf, type Category } from "@/lib/catalog";
import { Logo } from "./Logo";

/** One section of the catalog menu: drop with profile codes, name, and its subcategories. */
function CatCard({ c, onPick }: { c: Category; onPick: () => void }) {
  const { lang } = useLang();
  const kids = childrenOf(c.id);
  return (
    <div className="glass-soft" style={{ display: "flex", flexDirection: "column", gap: 8, padding: "12px 16px 12px 12px", borderRadius: 20 }}>
      <Link href={`/catalog/${c.slug}`} onClick={onPick} style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span className="drop" style={{ flex: "none", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, textAlign: "center", lineHeight: 1.1, padding: 4 }}>{catCode(c)}</span>
        <span style={{ lineHeight: 1.3, fontWeight: 700 }}>{catName(c, lang)}</span>
      </Link>
      {kids.length > 0 && (
        <span style={{ display: "flex", flexWrap: "wrap", gap: "2px 10px", paddingLeft: 62, fontSize: 13 }}>
          {kids.map((k) => (
            <Link key={k.id} href={`/catalog/${k.slug}`} onClick={onPick} style={{ color: "rgba(255,255,255,.72)" }}>{catName(k, lang)}</Link>
          ))}
        </span>
      )}
    </div>
  );
}

const langBtn = (on: boolean): CSSProperties => ({
  height: 38,
  minWidth: 46,
  padding: "0 12px",
  border: 0,
  borderRadius: 999,
  backgroundColor: on ? ACCENT : "transparent",
  color: on ? "#FFFFFF" : "rgba(255,255,255,.8)",
  font: "inherit",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
});

const circle: CSSProperties = {
  width: 46,
  height: 46,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const pill: CSSProperties = { padding: "8px 14px", borderRadius: 999 };

export function Header() {
  const { lang, setLang } = useLang();
  const t = useT(T);
  const ct = useT(CATALOG_T);
  const [catOpen, setCatOpen] = useState(false);
  const closeCat = () => setCatOpen(false);
  const sections = childrenOf(CATALOG_ROOT);
  const spheres = childrenOf(SPHERES_ROOT);

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50, maxWidth: 1320, margin: "0 auto", padding: "12px 20px 0" }}>
      <header className="glass" style={{ borderRadius: 28, padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px 20px" }}>
          <Logo />
          <form className="glass-soft" role="search" onSubmit={(e) => e.preventDefault()} style={{ flex: "1 1 340px", display: "flex", alignItems: "center", height: 48, borderRadius: 999, padding: "0 6px 0 18px" }}>
            <label htmlFor="gq" className="sr">{t.search}</label>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.75)" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
            <input id="gq" type="search" placeholder={t.searchPh} style={{ flex: 1, minWidth: 0, border: 0, background: "transparent", color: "#FFFFFF", padding: "0 12px", font: "inherit", fontSize: 15, outline: "none" }} />
            <button type="submit" className="liquid" style={{ height: 36, padding: "0 16px", border: 0, borderRadius: 999, backgroundColor: "rgba(255,255,255,.18)", color: "#FFFFFF", font: "inherit", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>{t.find}</button>
          </form>
          <a href="tel:+998787771188" style={{ fontWeight: 700, fontSize: 16 }}>+998 78 777 11 88</a>
          <nav aria-label={t.acc} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <a href="#" aria-label={t.fav} className="glass-soft" style={circle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>
            </a>
            <Link href="/cart" aria-label={t.cart} className="glass-soft" style={{ ...circle, position: "relative" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3 4h2l2.4 11h11l2-8H6.2" /><circle cx="9" cy="19.5" r="1.5" /><circle cx="17" cy="19.5" r="1.5" /></svg>
              <span style={{ position: "absolute", top: -2, right: -2, width: 18, height: 18, borderRadius: "50%", background: ACCENT, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>0</span>
            </Link>
            <Link href="/orders" aria-label={t.login} className="glass-soft" style={circle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
            </Link>
            <div role="group" aria-label={t.langLabel} className="glass-soft" style={{ display: "flex", gap: 2, padding: 4, borderRadius: 999 }}>
              <button type="button" onClick={() => setLang("ru")} aria-pressed={lang === "ru"} className={lang === "ru" ? "liquid" : ""} style={langBtn(lang === "ru")}>RU</button>
              <button type="button" onClick={() => setLang("uz")} aria-pressed={lang === "uz"} className={lang === "uz" ? "liquid" : ""} style={langBtn(lang === "uz")}>UZ</button>
            </div>
          </nav>
        </div>
        <nav aria-label={t.navLabel} style={{ display: "flex", flexWrap: "wrap", gap: 6, fontSize: 14, fontWeight: 600, alignItems: "center" }}>
          <button
            type="button"
            onClick={() => setCatOpen(!catOpen)}
            aria-expanded={catOpen}
            aria-controls="catmenu"
            className="liquid"
            style={{ display: "flex", alignItems: "center", gap: 10, height: 40, padding: "0 18px", border: 0, backgroundColor: ACCENT, color: "#FFFFFF", font: "inherit", fontWeight: 700, fontSize: 14, borderRadius: 999, cursor: "pointer" }}
          >
            {catOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></svg>
            )}
            {t.cat}
          </button>
          <Link href="/guide" style={{ ...pill, border: "1px solid rgba(255,255,255,.3)" }}>{t.n7}</Link>
          <Link href="/business" style={pill}>{t.n9}</Link>
          <a href="#" style={{ ...pill, color: "#FFB088" }}>{t.n8}</a>
        </nav>
        {catOpen && (
          <div id="catmenu" style={{ marginTop: 6, padding: 18, borderRadius: 22, background: "rgba(0,0,0,.28)", boxShadow: "inset 0 2px 12px rgba(0,0,0,.35)", display: "flex", flexDirection: "column", gap: 14, maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))", gap: 10 }}>
              {sections.map((c) => (
                <CatCard key={c.id} c={c} onPick={closeCat} />
              ))}
              <Link href="/catalog" onClick={closeCat} className="liquid" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 72, borderRadius: 20, backgroundColor: ACCENT, fontWeight: 700 }}>{t.allCat}</Link>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: 1, color: "rgba(255,255,255,.72)", padding: "0 4px", textTransform: "uppercase" }}>{ct.spheres}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))", gap: 10 }}>
              {spheres.map((c) => (
                <CatCard key={c.id} c={c} onPick={closeCat} />
              ))}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
