"use client";

import Link from "next/link";
import { useState, type CSSProperties, type MouseEvent } from "react";
import { useLang, useT } from "@/lib/lang";
import { ACCENT, L, T } from "@/lib/i18n";
import { Logo } from "./Logo";

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
  const { cats } = useT(L);
  const [catOpen, setCatOpen] = useState(false);
  const closeCat = (e: MouseEvent) => {
    e.preventDefault();
    setCatOpen(false);
  };

  return (
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "20px 20px 0" }}>
      <header className="glass" style={{ borderRadius: 28, padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px 20px" }}>
          <Logo />
          <button
            type="button"
            onClick={() => setCatOpen(!catOpen)}
            aria-expanded={catOpen}
            aria-controls="catmenu"
            className="liquid"
            style={{ display: "flex", alignItems: "center", gap: 10, height: 48, padding: "0 22px", border: 0, backgroundColor: ACCENT, color: "#FFFFFF", font: "inherit", fontWeight: 700, borderRadius: 999, cursor: "pointer" }}
          >
            {catOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></svg>
            )}
            {t.cat}
          </button>
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
            <a href="#" aria-label={t.login} className="glass-soft" style={circle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
            </a>
            <div role="group" aria-label={t.langLabel} className="glass-soft" style={{ display: "flex", gap: 2, padding: 4, borderRadius: 999 }}>
              <button type="button" onClick={() => setLang("ru")} aria-pressed={lang === "ru"} className={lang === "ru" ? "liquid" : ""} style={langBtn(lang === "ru")}>RU</button>
              <button type="button" onClick={() => setLang("uz")} aria-pressed={lang === "uz"} className={lang === "uz" ? "liquid" : ""} style={langBtn(lang === "uz")}>UZ</button>
            </div>
          </nav>
        </div>
        <nav aria-label={t.navLabel} style={{ display: "flex", flexWrap: "wrap", gap: 6, fontSize: 14, fontWeight: 600 }}>
          <a href="#" style={{ ...pill, background: "rgba(255,255,255,.14)" }}>{t.n1}</a>
          <a href="#" style={pill}>{t.n2}</a>
          <a href="#" style={pill}>{t.n3}</a>
          <a href="#" style={pill}>{t.n4}</a>
          <a href="#" style={pill}>{t.n5}</a>
          <a href="#" style={pill}>{t.n6}</a>
          <Link href="/guide" style={{ ...pill, border: "1px solid rgba(255,255,255,.3)" }}>{t.n7}</Link>
          <Link href="/business" style={pill}>{t.n9}</Link>
          <a href="#" style={{ ...pill, color: "#FFB088" }}>{t.n8}</a>
        </nav>
        {catOpen && (
          <div id="catmenu" style={{ marginTop: 6, padding: 18, borderRadius: 22, background: "rgba(0,0,0,.28)", boxShadow: "inset 0 2px 12px rgba(0,0,0,.35)", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
            {cats.map((c) => (
              <a key={c.code} href="#" onClick={closeCat} className="glass-soft" style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px 12px 12px", borderRadius: 20 }}>
                <span className="drop" style={{ flex: "none", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, textAlign: "center", lineHeight: 1.1 }}>{c.code}</span>
                <span style={{ lineHeight: 1.3 }}>
                  <span style={{ display: "block", fontWeight: 700 }}>{c.name}</span>
                  <span style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,.72)" }}>{c.note}</span>
                </span>
              </a>
            ))}
            <a href="#" onClick={closeCat} className="liquid" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 72, borderRadius: 20, backgroundColor: ACCENT, fontWeight: 700 }}>{t.allCat}</a>
          </div>
        )}
      </header>
    </div>
  );
}
