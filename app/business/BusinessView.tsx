"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useT } from "@/lib/lang";
import { ACCENT, L, T, withLogos } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageShell } from "@/components/PageShell";

const mono: CSSProperties = { fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: 1, color: "rgb(var(--ink) / .72)" };

const industryCard: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  minHeight: 260,
  padding: 30,
  borderRadius: 32,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "transform .2s",
};

const cardTitle: CSSProperties = { fontFamily: "'Oswald', sans-serif", fontSize: 22, fontWeight: 600, lineHeight: 1.2 };
const cardText: CSSProperties = { marginTop: 8, fontSize: 14, color: "rgb(var(--ink) / .75)" };

const brandPill: CSSProperties = {
  height: 92,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 999,
  fontFamily: "'Oswald', sans-serif",
  fontWeight: 600,
  fontSize: 20,
  letterSpacing: 2,
};

const b2bCard: CSSProperties = { padding: 40, borderRadius: 34, display: "flex", flexDirection: "column", gap: 18 };
const b2bH2: CSSProperties = { margin: 0, fontFamily: "'Oswald', sans-serif", fontSize: 30, fontWeight: 600, lineHeight: 1.15 };
const b2bBtn: CSSProperties = { alignSelf: "start", height: 52, padding: "0 24px", display: "flex", alignItems: "center", fontWeight: 700, borderRadius: 999 };

export function BusinessView() {
  const t = useT(T);
  const markets = withLogos(useT(L).markets);

  return (
    <PageShell>
      <Header />

      {/* Page title */}
      <section className="sec" style={{ maxWidth: 1320, margin: "0 auto", padding: "48px 20px 40px" }}>
        <nav aria-label="Навигация" className="glass-soft" style={{ display: "inline-flex", flexWrap: "wrap", gap: 8, padding: "8px 16px", borderRadius: 999, fontSize: 14, color: "rgb(var(--ink) / .75)", marginBottom: 22 }}>
          <Link href="/" style={{ color: "rgb(var(--ink) / .75)" }}>{t.home}</Link>
          <span>›</span>
          <span style={{ color: "var(--fg)", fontWeight: 600 }}>{t.bTitle}</span>
        </nav>
        <span style={{ ...mono, display: "block" }}>{t.bEyebrow}</span>
        <h1 className="h1" style={{ margin: "8px 0 0", fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 52, lineHeight: 1.08, letterSpacing: -1.5, maxWidth: 900 }}>{t.bTitle}</h1>
        <p style={{ margin: "14px 0 0", fontSize: 19, color: "rgb(var(--ink) / .8)", maxWidth: 680 }}>{t.bLead}</p>
      </section>

      {/* Industries */}
      <section className="sec" style={{ maxWidth: 1320, margin: "0 auto", padding: "0 20px 96px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "end", gap: 12, marginBottom: 28 }}>
          <div>
            <span style={mono}>{t.iEyebrow}</span>
            <h2 className="h2" style={{ margin: "6px 0 0", fontFamily: "'Oswald', sans-serif", fontSize: 38, fontWeight: 600, letterSpacing: -1 }}>{t.iTitle}</h2>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: 18 }}>
          <a href="#" className="glass lift" style={industryCard}>
            <svg width="120" height="64" viewBox="0 0 120 64" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="4" y="22" width="112" height="20" rx="10" /><circle cx="14" cy="32" r="8" /><circle cx="106" cy="32" r="8" /><rect x="30" y="8" width="18" height="14" rx="3" /><rect x="56" y="8" width="18" height="14" rx="3" /><rect x="82" y="8" width="18" height="14" rx="3" /><path d="M20 50 V58 M100 50 V58 M14 58 H106" /></svg>
            <div>
              <div style={cardTitle}>{t.i1t}</div>
              <div style={cardText}>{t.i1d}</div>
            </div>
          </a>
          <a href="#" className="glass lift" style={industryCard}>
            <svg width="120" height="64" viewBox="0 0 120 64" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="10" y="6" width="26" height="52" rx="6" /><path d="M10 16 H36 M10 26 H36 M10 36 H36 M10 46 H36" /><path d="M36 20 C60 20 60 44 84 44 H114" /><path d="M36 30 C58 30 62 50 84 50 H114" /><circle cx="98" cy="22" r="14" /><circle cx="98" cy="22" r="4" /></svg>
            <div>
              <div style={cardTitle}>{t.i2t}</div>
              <div style={cardText}>{t.i2d}</div>
            </div>
          </a>
          <a href="https://t.me/Remenuz_bot" className="lift" style={{ ...industryCard, border: "1px dashed rgb(var(--ink) / .4)", background: "rgb(var(--ink) / .03)" }}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="32" cy="32" r="12" /><path d="M32 4 V14 M32 50 V60 M4 32 H14 M50 32 H60 M12 12 L19 19 M45 45 L52 52 M52 12 L45 19 M19 45 L12 52" /></svg>
            <div>
              <div style={cardTitle}>{t.i3t}</div>
              <div style={cardText}>{t.i3d}</div>
            </div>
          </a>
        </div>
      </section>

      {/* Marketplaces */}
      <section className="sec" style={{ maxWidth: 1320, margin: "0 auto", padding: "0 20px 96px" }}>
        <div className="glass" style={{ borderRadius: 40, padding: 40, display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "end", gap: 16 }}>
            <div>
              <span style={mono}>{t.mkEyebrow}</span>
              <h2 className="h2" style={{ margin: "6px 0 0", fontFamily: "'Oswald', sans-serif", fontSize: 34, fontWeight: 600, letterSpacing: -1, lineHeight: 1.15 }}>{t.mkTitle}</h2>
            </div>
            <p style={{ margin: 0, maxWidth: 420, color: "rgb(var(--ink) / .78)" }}>{t.mkText}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
            {markets.map((m) => (
              <a key={m.mark} href={m.href} target="_blank" rel="noopener" className="glass-soft lift" style={{ display: "flex", flexDirection: "column", gap: 22, padding: 22, borderRadius: 30, transition: "transform .2s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  {m.logo ? (
                    <span style={{ height: 60, width: 150, padding: "10px 14px", boxSizing: "border-box", borderRadius: 18, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 1px 0 rgba(255,255,255,.9), 0 10px 24px rgba(0,0,0,.35)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.logo} alt={m.name} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", display: "block" }} />
                      {m.logoText && (
                        <span style={{ marginLeft: 8, color: "#15171A", fontWeight: 800, fontSize: 13, lineHeight: 1.1, whiteSpace: "nowrap" }}>{m.logoText}</span>
                      )}
                    </span>
                  ) : (
                    <span className="drop" style={{ width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Oswald', sans-serif", fontSize: 15, fontWeight: 700 }}>{m.mark}</span>
                  )}
                  <span style={{ fontSize: 20 }} aria-hidden="true">↗</span>
                </div>
                <div>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, fontWeight: 600 }}>{m.name}</div>
                  <div style={{ marginTop: 6, fontSize: 14, color: "rgb(var(--ink) / .75)" }}>{m.note}</div>
                </div>
                <span className="liquid liq-n" style={{ alignSelf: "start", height: 42, padding: "0 18px", display: "flex", alignItems: "center", borderRadius: 999, backgroundColor: "rgb(var(--ink) / .18)", fontSize: 14, fontWeight: 700 }}>{t.mkBtn}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* B2B, brands, news */}
      <section className="sec" style={{ maxWidth: 1320, margin: "0 auto", padding: "0 20px 96px", display: "flex", flexDirection: "column", gap: 40 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: 18 }}>
          <div className="glass" style={b2bCard}>
            <span style={mono}>B2B</span>
            <h2 style={b2bH2}>{t.b2bTitle}</h2>
            <p style={{ margin: 0, color: "rgb(var(--ink) / .8)" }}>{t.b2bText}</p>
            <a href="#" className="liquid" style={{ ...b2bBtn, backgroundColor: ACCENT, color: "#FFFFFF" }}>{t.b2bBtn}</a>
          </div>
          <div className="glass" style={b2bCard}>
            <span style={mono}>{t.partEyebrow}</span>
            <h2 style={b2bH2}>{t.partTitle}</h2>
            <p style={{ margin: 0, color: "rgb(var(--ink) / .8)" }}>{t.partText}</p>
            <a href="#" className="glass-soft" style={b2bBtn}>{t.partBtn}</a>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
          <a href="#" className="glass-soft" style={brandPill}>MEGADYNE</a>
          <a href="#" className="glass-soft" style={brandPill}>BANDO</a>
          <a href="#" className="glass-soft" style={brandPill}>PIX</a>
          <a href="#" className="glass-soft" style={brandPill}>NOVOBELT</a>
        </div>
        <div className="glass" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "26px 32px", borderRadius: 30 }}>
          <div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgb(var(--ink) / .72)" }}>{t.newsEyebrow}</span>
            <div style={{ fontWeight: 700, fontSize: 19, marginTop: 4 }}>{t.newsTitle}</div>
          </div>
          <a href="#" className="glass-soft" style={{ padding: "10px 18px", borderRadius: 999, fontWeight: 700 }}>{t.allNews}</a>
        </div>
      </section>

      <Footer />
    </PageShell>
  );
}
