"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageShell } from "@/components/PageShell";
import { useT } from "@/lib/lang";
import { ACCENT, L, T, withLogos } from "@/lib/i18n";

const MONO = "'JetBrains Mono', monospace";
const DISPLAY = "'Unbounded', sans-serif";

const section: CSSProperties = { maxWidth: 1280, margin: "0 auto", padding: "0 40px 96px" };
const h2: CSSProperties = { margin: 0, fontFamily: DISPLAY, fontSize: 38, fontWeight: 600, letterSpacing: -1 };
const fieldWrap: CSSProperties = { display: "flex", flexDirection: "column", gap: 6 };
const fieldLabel: CSSProperties = { fontSize: 13, fontWeight: 700 };
const filterPill: CSSProperties = { padding: "8px 16px", borderRadius: 999 };
const teaser: CSSProperties = { position: "relative", overflow: "hidden", minHeight: 240, padding: 34, borderRadius: 36, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 22, transition: "transform .2s" };

const BLOBS: CSSProperties[] = [
  { top: -160, left: -180, width: 680, height: 680, background: ACCENT, opacity: 0.55 },
  { top: 260, right: -200, width: 620, height: 620, background: "#2F6BFF", opacity: 0.5 },
  { top: 1500, left: "30%", width: 560, height: 560, background: "#12B5A6", opacity: 0.32 },
  { top: 2500, left: -160, width: 620, height: 620, background: ACCENT, opacity: 0.4 },
  { top: 3300, right: -120, width: 600, height: 600, background: "#6A4CFF", opacity: 0.38 },
];

function Pulley() {
  return (
    <svg viewBox="0 0 84 84" width="84" height="84" aria-hidden="true">
      <g className="spin">
        <circle cx="42" cy="42" r="40" fill="#1A1E27" stroke="rgba(255,255,255,.5)" strokeWidth="2" />
        <path d="M42 6 V78 M6 42 H78 M17 17 L67 67 M67 17 L17 67" stroke="rgba(255,255,255,.25)" strokeWidth="2" />
        <circle cx="42" cy="42" r="9" fill="#0B0E14" stroke="#FFFFFF" strokeWidth="2" />
      </g>
    </svg>
  );
}

function BeltIcon({ width, height }: { width: number; height: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 110" aria-hidden="true">
      <rect x="12" y="20" width="176" height="70" rx="35" fill="none" stroke="#FFFFFF" strokeWidth="10" strokeDasharray="5 4" />
      <circle cx="47" cy="55" r="22" fill="rgba(255,255,255,.25)" />
      <circle cx="153" cy="55" r="22" fill="rgba(255,255,255,.25)" />
    </svg>
  );
}

export function HomeView() {
  const t = useT(T);
  const d = useT(L);
  const ticker = d.ticker.concat(d.ticker);
  const markets = withLogos(d.markets);
  const products = d.products.slice(0, 4);

  return (
    <PageShell blobs={BLOBS}>
      <Header />

      {/* Hero */}
      <section className="sec" style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "80px 40px 56px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 500px), 1fr))", gap: 48, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <span className="glass-soft" style={{ alignSelf: "start", padding: "8px 16px", borderRadius: 999, fontFamily: MONO, fontSize: 12, letterSpacing: 1 }}>{t.eyebrow}</span>
          <h1 className="h1" style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 700, fontSize: 56, lineHeight: 1.06, letterSpacing: -1.5 }}>{t.h1}</h1>
          <p style={{ margin: 0, fontSize: 19, color: "rgba(255,255,255,.8)", maxWidth: 540 }}>{t.lead}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <a href="#" className="liquid" style={{ height: 56, padding: "0 30px", display: "flex", alignItems: "center", backgroundColor: ACCENT, fontWeight: 700, borderRadius: 999 }}>{t.openCat}</a>
            <a href="https://t.me/Remenuz_bot" className="glass" style={{ height: 56, padding: "0 26px", display: "flex", alignItems: "center", gap: 10, fontWeight: 700, borderRadius: 999 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 4L3 11l6 2 2 6 3-4 5 4z" /></svg>
              {t.sendPhoto}
            </a>
          </div>
        </div>

        {/* Glass belt finder */}
        <form id="finder" className="glass" onSubmit={(e) => e.preventDefault()} style={{ position: "relative", borderRadius: 36, padding: 34, display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <h2 style={{ margin: 0, fontFamily: DISPLAY, fontSize: 26, fontWeight: 600 }}>{t.fTitle}</h2>
            <p style={{ margin: "4px 0 0", fontSize: 14, color: "rgba(255,255,255,.72)" }}>{t.fSub}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
            <div style={fieldWrap}>
              <label htmlFor="g-type" style={fieldLabel}>{t.fType}</label>
              <select id="g-type" className="field"><option>{t.ty1}</option><option>{t.ty2}</option><option>{t.ty3}</option><option>{t.ty4}</option></select>
            </div>
            <div style={fieldWrap}>
              <label htmlFor="g-prof" style={fieldLabel}>{t.fProf}</label>
              <select id="g-prof" className="field"><option>T5</option><option>T10</option><option>PJ</option><option>Li</option></select>
            </div>
            <div style={fieldWrap}>
              <label htmlFor="g-len" style={fieldLabel}>{t.fLen}</label>
              <input id="g-len" className="field" inputMode="numeric" placeholder="1645" style={{ fontFamily: MONO, minWidth: 0 }} />
            </div>
            <div style={fieldWrap}>
              <label htmlFor="g-w" style={fieldLabel}>{t.fW}</label>
              <input id="g-w" className="field" inputMode="numeric" placeholder="25" style={{ fontFamily: MONO, minWidth: 0 }} />
            </div>
          </div>
          <button type="submit" className="liquid" style={{ height: 56, border: 0, borderRadius: 999, backgroundColor: ACCENT, color: "#FFFFFF", font: "inherit", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>{t.fBtn}</button>
          <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,.75)" }}>
            {t.fHelp} <a href="https://t.me/Remenuz_bot" style={{ color: "#FFB088", fontWeight: 700 }}>{t.fHelpLink}</a>
          </p>
        </form>
      </section>

      {/* Trust capsules */}
      <div className="sec" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px 80px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
        {d.trust.map((tr) => (
          <div key={tr.title} className="glass-soft" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px 14px 14px", borderRadius: 999 }}>
            <span className="drop" style={{ flex: "none", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 12, fontWeight: 600 }}>{tr.n}</span>
            <div style={{ lineHeight: 1.3 }}>
              <div style={{ fontWeight: 700 }}>{tr.title}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.72)" }}>{tr.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <section className="sec" style={section}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "end", gap: 12, marginBottom: 28 }}>
          <h2 className="h2" style={h2}>{t.cat}</h2>
          <a href="#" className="glass-soft" style={{ padding: "10px 18px", borderRadius: 999, fontWeight: 700 }}>{t.allCat}</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: 18 }}>
          {d.cats.map((c) => (
            <a key={c.code} href="#" className="glass lift" style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 48, minHeight: 200, padding: 26, borderRadius: 30, overflow: "hidden", transition: "transform .2s" }}>
              <span className="drop" aria-hidden="true" style={{ position: "absolute", top: -30, right: -30, width: 130, height: 130 }} />
              <span style={{ position: "relative", fontFamily: MONO, fontSize: 13, color: "rgba(255,255,255,.78)" }}>{c.code}</span>
              <div style={{ position: "relative" }}>
                <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 600, lineHeight: 1.2 }}>{c.name}</div>
                <div style={{ marginTop: 8, fontSize: 14, color: "rgba(255,255,255,.72)" }}>{c.note}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Running conveyor belt */}
      <section aria-label={t.tickerLabel} style={{ position: "relative", margin: "0 0 96px", padding: "0 70px" }}>
        <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 84, height: 84, zIndex: 2 }}><Pulley /></div>
        <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", width: 84, height: 84, zIndex: 2 }}><Pulley /></div>
        <div className="glass" style={{ position: "relative", overflow: "hidden", borderRadius: 0, height: 80, display: "flex", alignItems: "center", backgroundColor: "rgba(10,12,18,.55)" }}>
          <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, top: 0, height: 8, background: "repeating-linear-gradient(90deg, rgba(255,255,255,.45) 0 6px, transparent 6px 14px)" }} />
          <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 8, background: "repeating-linear-gradient(90deg, rgba(255,255,255,.45) 0 6px, transparent 6px 14px)" }} />
          <div className="belt-run">
            {ticker.map((k, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 18, padding: "0 18px", whiteSpace: "nowrap", fontFamily: MONO, fontSize: 15, fontWeight: 600, letterSpacing: 1 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: ACCENT, boxShadow: `0 0 12px ${ACCENT}` }} />
                {k}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Special offers */}
      <section className="sec" style={section}>
        <h2 className="h2" style={{ ...h2, margin: "0 0 28px" }}>{t.offTitle}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: 18 }}>
          {d.offers.map((o) => (
            <Link key={o.title} href="/product" className="glass lift" style={{ display: "flex", flexDirection: "column", gap: 20, padding: 22, borderRadius: 32, transition: "transform .2s" }}>
              <div style={{ height: 200, borderRadius: 24, background: "rgba(0,0,0,.22)", boxShadow: "inset 0 2px 10px rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="drop" style={{ width: 170, height: 170, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BeltIcon width={120} height={66} />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontFamily: MONO, fontSize: 12, color: "rgba(255,255,255,.72)" }}>{o.brand}</span>
                <span style={{ fontWeight: 700, fontSize: 17, lineHeight: 1.35 }}>{o.title}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                <span style={{ fontFamily: MONO, fontSize: 20, fontWeight: 600 }}>{o.price} {t.sum}</span>
                <span className="liquid" style={{ padding: "6px 12px", borderRadius: 999, backgroundColor: ACCENT, fontSize: 13, fontWeight: 700 }}>{t.special}</span>
              </div>
            </Link>
          ))}
          <div className="liquid" style={{ position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 24, padding: 34, borderRadius: 32, backgroundColor: ACCENT }}>
            <span className="drop" aria-hidden="true" style={{ position: "absolute", right: -40, bottom: -40, width: 200, height: 200 }} />
            <span style={{ position: "relative", fontFamily: MONO, fontSize: 13, letterSpacing: 1 }}>{t.delivery}</span>
            <div style={{ position: "relative" }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 34, fontWeight: 700, lineHeight: 1.1 }}>{t.delTitle}</div>
              <p style={{ margin: "12px 0 0", fontSize: 16 }}>{t.delText}</p>
              <p style={{ margin: "8px 0 0", fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ flex: "none", height: 28, padding: "4px 10px", borderRadius: 999, background: "#FFFFFF", display: "flex", alignItems: "center" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/img/fargo.png" alt="Fargo" style={{ height: "100%", display: "block" }} />
                </span>
                {t.delFargo}
              </p>
            </div>
            <Link href="/info/delivery" className="glass" style={{ position: "relative", alignSelf: "start", height: 50, padding: "0 22px", display: "flex", alignItems: "center", fontWeight: 700, borderRadius: 999 }}>{t.delBtn}</Link>
          </div>
        </div>
      </section>

      {/* New products */}
      <section className="sec" style={section}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "end", gap: 14, marginBottom: 28 }}>
          <h2 className="h2" style={h2}>{t.newTitle}</h2>
          <div className="glass-soft" style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: 5, borderRadius: 999, fontSize: 14, fontWeight: 700 }}>
            <a href="#" className="liquid" style={{ ...filterPill, backgroundColor: "rgba(255,255,255,.2)" }}>{t.flAll}</a>
            <a href="#" style={filterPill}>{t.flT5}</a>
            <a href="#" style={filterPill}>{t.flPJ}</a>
            <a href="#" style={filterPill}>{t.flRound}</a>
            <a href="#" style={filterPill}>{t.flClassic}</a>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 270px), 1fr))", gap: 18 }}>
          {products.map((p) => (
            <div key={p.title} className="glass lift" style={{ display: "flex", flexDirection: "column", gap: 14, padding: 16, borderRadius: 28, transition: "transform .2s" }}>
              <div style={{ position: "relative", height: 190, borderRadius: 20, background: "rgba(0,0,0,.22)", boxShadow: "inset 0 2px 10px rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="drop" style={{ width: 150, height: 150, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BeltIcon width={104} height={57} />
                </div>
                <span className="glass-soft" style={{ position: "absolute", top: 10, left: 10, padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>{t.isNew}</span>
                <button type="button" aria-label={t.toFav} className="glass-soft" style={{ position: "absolute", top: 8, right: 8, width: 40, height: 40, borderRadius: "50%", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>
                </button>
              </div>
              <span style={{ fontFamily: MONO, fontSize: 12, color: "rgba(255,255,255,.72)", padding: "0 4px" }}>{p.tag}</span>
              <Link href="/product" style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.4, minHeight: 63, padding: "0 4px" }}>{p.title}</Link>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: "auto", padding: "0 0 0 4px" }}>
                <span style={{ fontFamily: MONO, fontSize: 19, fontWeight: 600 }}>
                  {p.price} <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,.72)" }}>{p.unit}</span>
                </span>
                <button type="button" aria-label={t.toCart} className="liquid" style={{ width: 48, height: 48, border: 0, borderRadius: "50%", backgroundColor: ACCENT, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
          <a href="#" className="glass" style={{ height: 54, padding: "0 34px", display: "flex", alignItems: "center", borderRadius: 999, fontWeight: 700 }}>{t.more}</a>
        </div>
      </section>

      {/* Marketplaces strip */}
      <section className="sec" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px 56px" }}>
        <div className="glass" style={{ borderRadius: 34, padding: "22px 26px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "18px 28px" }}>
          <div style={{ flex: "1 1 240px" }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 20, fontWeight: 600 }}>{t.mkShort}</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,.75)" }}>{t.mkShortD}</div>
          </div>
          <div style={{ flex: "999 1 min(100%, 600px)", display: "flex", flexWrap: "wrap", gap: 10 }}>
            {markets.map((m) => (
              <a key={m.mark} href={m.href} target="_blank" rel="noopener" aria-label={m.name} className="lift" style={{ height: 52, minWidth: 120, padding: "10px 16px", borderRadius: 999, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform .2s" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.logo} alt="" style={{ maxHeight: "100%", maxWidth: 140, objectFit: "contain", display: "block" }} />
                {m.logoText && <span style={{ marginLeft: 8, color: "#15171A", fontWeight: 800, fontSize: 13, whiteSpace: "nowrap" }}>{m.logoText}</span>}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Teasers to other pages */}
      <section className="sec" style={{ ...section, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))", gap: 18 }}>
        <Link href="/guide" className="glass lift" style={teaser}>
          <svg viewBox="0 0 260 70" width="220" aria-hidden="true" style={{ position: "absolute", right: 26, top: 26, opacity: 0.55 }}>
            <path d="M0 22 H14 L20 46 H36 L42 22 H70 L76 46 H92 L98 22 H126 L132 46 H148 L154 22 H182 L188 46 H204 L210 22 H238 L244 46 H260" fill="none" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M0 12 H260" stroke="#FFFFFF" strokeWidth="2" />
            <g stroke={ACCENT} strokeWidth="1.5"><path d="M28 60 H84" /><path d="M28 54 V66 M84 54 V66" /></g>
          </svg>
          <span style={{ position: "relative", fontFamily: MONO, fontSize: 12, letterSpacing: 1, color: "rgba(255,255,255,.72)" }}>{t.teaGuideE}</span>
          <div style={{ position: "relative" }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 28, fontWeight: 600, lineHeight: 1.15 }}>{t.teaGuideT}</div>
            <div style={{ marginTop: 8, color: "rgba(255,255,255,.78)" }}>{t.teaGuideD}</div>
          </div>
          <span className="liquid" style={{ position: "relative", alignSelf: "start", height: 48, padding: "0 22px", display: "flex", alignItems: "center", borderRadius: 999, backgroundColor: ACCENT, fontWeight: 700 }}>{t.teaGuideB} →</span>
        </Link>
        <Link href="/business" className="glass lift" style={teaser}>
          <svg width="140" height="74" viewBox="0 0 120 64" fill="none" stroke="#FFFFFF" strokeWidth="2" aria-hidden="true" style={{ position: "absolute", right: 26, top: 26, opacity: 0.55 }}>
            <rect x="4" y="22" width="112" height="20" rx="10" /><circle cx="14" cy="32" r="8" /><circle cx="106" cy="32" r="8" />
            <rect x="30" y="8" width="18" height="14" rx="3" /><rect x="56" y="8" width="18" height="14" rx="3" /><rect x="82" y="8" width="18" height="14" rx="3" />
          </svg>
          <span style={{ position: "relative", fontFamily: MONO, fontSize: 12, letterSpacing: 1, color: "rgba(255,255,255,.72)" }}>{t.teaBizE}</span>
          <div style={{ position: "relative" }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 28, fontWeight: 600, lineHeight: 1.15 }}>{t.teaBizT}</div>
            <div style={{ marginTop: 8, color: "rgba(255,255,255,.78)" }}>{t.teaBizD}</div>
          </div>
          <span className="glass-soft" style={{ position: "relative", alignSelf: "start", height: 48, padding: "0 22px", display: "flex", alignItems: "center", borderRadius: 999, fontWeight: 700 }}>{t.teaBizB} →</span>
        </Link>
      </section>

      <Footer />
    </PageShell>
  );
}
