"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { useT } from "@/lib/lang";
import { ACCENT, T } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageShell } from "@/components/PageShell";

/** Guide-only copy (keys absent from the shared dictionary). */
const G = {
  ru: {
    tlEyebrow: "ПОДБОР ПО ЧЕРТЕЖУ", tlTitle: "Выберите тип ремня и введите размеры", sheet: "ЛИСТ 02 · ЧЕРТЁЖ",
    lLen: "Длина L, мм", lWidth: "Ширина b, мм", lRibs: "Ручьёв N", lLi: "Длина Li, мм", lSec: "Сечение b, мм", lDia: "Диаметр Ø, мм", lRLen: "Нужная длина L, мм",
    recTitle: "Рекомендуем из каталога", exact: "Точное совпадение", close: "Ближайший размер", noMatch: "Для такого профиля нет позиций в каталоге — пришлите параметры, подберём аналог.",
    toCartL: "В корзину", askBtn: "Уточнить у инженера в Telegram", perM: "сум / м", pcs: "сум", costFor: "за", mShort: "м", teeth: "зубьев",
    nToothed: "Зубчатый ремень", nPoly: "Поликлиновой ремень", nV: "Клиновой ремень", nRound: "Термосвариваемый ремень круглого сечения",
  },
  uz: {
    tlEyebrow: "CHIZMA BOʻYICHA TANLASH", tlTitle: "Tasma turini tanlang va oʻlchamlarni kiriting", sheet: "VARAQ 02 · CHIZMA",
    lLen: "Uzunlik L, mm", lWidth: "Eni b, mm", lRibs: "Ariqchalar N", lLi: "Uzunlik Li, mm", lSec: "Kesim b, mm", lDia: "Diametr Ø, mm", lRLen: "Kerakli uzunlik L, mm",
    recTitle: "Katalogdan tavsiya", exact: "Aniq mos", close: "Eng yaqin oʻlcham", noMatch: "Bu profil uchun katalogda mahsulot yoʻq — parametrlarni yuboring, analogini tanlab beramiz.",
    toCartL: "Savatga", askBtn: "Telegramda muhandisdan aniqlash", perM: "soʻm / m", pcs: "soʻm", costFor: "uchun", mShort: "m", teeth: "tish",
    nToothed: "Tishli tasma", nPoly: "Koʻp ponali tasma", nV: "Ponasimon tasma", nRound: "Termopayvandlanadigan dumaloq kesimli tasma",
  },
};

type Sel = "tooth" | "poly" | "v" | "round";
type Item = { p?: string; L: number; w: number; spec: string; price: number };

const CAT: { tooth: Item[]; poly: Item[]; v: Item[]; round: { w: number; price: number }[] } = {
  tooth: [
    { p: "T5", L: 1645, w: 25, spec: "T5 1645 25 NFT A", price: 3068800 },
    { p: "T5", L: 1645, w: 25, spec: "T5 1645 25 NFT B", price: 2685760 },
    { p: "T5", L: 1645, w: 25, spec: "T5 1645 25 NFT D", price: 2732800 },
    { p: "T5", L: 1645, w: 38, spec: "T5 1645 38 NFT C", price: 3452960 },
    { p: "T5", L: 1750, w: 32, spec: "T5 1750 32 NFT E", price: 2732800 },
    { p: "T5", L: 625, w: 32, spec: "T5 625 32 NFT G", price: 1472800 },
    { p: "T5", L: 800, w: 10, spec: "10 T5 800 MEGADYNE MEGAPOWER2", price: 159040 },
    { p: "T5", L: 410, w: 16, spec: "16 T5 DL (DB) 410 MEGADYNE MEGAPOWER2", price: 282240 },
    { p: "T10", L: 530, w: 10, spec: "10 T10 530 MEGADYNE MEGAPOWER2", price: 198240 },
    { p: "AT5", L: 3215, w: 25, spec: "25 AT5 3215 NOVOBELT PERFORMANCE", price: 900480 },
    { p: "RPP14", L: 1400, w: 85, spec: "1400 SLV14 85.00 MM MEGADYNE MEGASYNC SILVER3", price: 2665600 },
    { p: "RPP14", L: 1610, w: 85, spec: "1610 SLV14 85.00 MM MEGADYNE MEGASYNC SILVER3", price: 3348800 },
  ],
  poly: [
    { L: 533, w: 6, spec: "6 PJ 533 MEGADYNE PV BELT", price: 88480 },
    { L: 1059, w: 8, spec: "8 PJ 1059 MEGADYNE PV BELT", price: 138880 },
    { L: 1244, w: 8, spec: "8 PJ 1244 MEGADYNE PV BELT", price: 216160 },
  ],
  v: [{ L: 875, w: 8, spec: "8 mm 875 Li BANDO", price: 17920 }],
  round: [{ w: 3, price: 17920 }, { w: 4, price: 22400 }, { w: 6, price: 38080 }, { w: 8, price: 57120 }, { w: 10, price: 98560 }],
};

const PITCH: Record<string, number> = { T5: 5, T10: 10, AT5: 5, RPP14: 14 };

const num = (v: string) => {
  const n = parseFloat(String(v).replace(",", "."));
  return isNaN(n) ? 0 : n;
};
const fmtN = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const sgn = (n: number) => (n > 0 ? "+" : n < 0 ? "−" : "±") + fmtN(Math.abs(n));
const badge = (ex: boolean): CSSProperties => ({
  padding: "3px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 800,
  ...(ex
    ? { background: "rgba(18,181,166,.3)", border: "1px solid rgba(124,242,201,.7)", color: "var(--ok-tag)" }
    : { background: "rgb(var(--ink) / .1)", border: "1px solid rgb(var(--ink) / .3)", color: "var(--fg)" }),
});

type Rec = { title: string; priceF: string; unit: string; badge: string; badgeStyle: CSSProperties; delta: string };

const BLOBS: CSSProperties[] = [
  { top: -160, left: -180, width: 680, height: 680, background: ACCENT, color: "#FFFFFF", opacity: 0.55 },
  { top: 260, right: -200, width: 620, height: 620, background: "#2F6BFF", opacity: 0.5 },
  { top: 1500, left: "30%", width: 560, height: 560, background: "#12B5A6", opacity: 0.32 },
  { top: 2500, left: -160, width: 620, height: 620, background: ACCENT, color: "#FFFFFF", opacity: 0.4 },
  { top: 3300, right: -120, width: 600, height: 600, background: "#6A4CFF", opacity: 0.38 },
];

const mono = "'JetBrains Mono', monospace";
const unb = "'Oswald', sans-serif";
const svgMono = "JetBrains Mono, monospace";
const eyebrow: CSSProperties = { fontFamily: mono, fontSize: 12, letterSpacing: 1, color: "rgb(var(--ink) / .72)" };
const fieldWrap: CSSProperties = { display: "flex", flexDirection: "column", gap: 6 };
const fieldLabel: CSSProperties = { fontSize: 13, fontWeight: 700 };
const cardSvgBox: CSSProperties = { borderRadius: 22, background: "rgb(0 0 0 / calc(.28 * var(--well)))", boxShadow: "inset 0 2px 10px rgba(0,0,0,.35)", padding: 14 };
const card: CSSProperties = { borderRadius: 32, padding: 22, display: "flex", flexDirection: "column", gap: 16 };
const cardCode: CSSProperties = { fontFamily: mono, fontSize: 12, color: "rgb(var(--ink) / .72)" };
const cardH3: CSSProperties = { margin: "4px 0 0", fontFamily: unb, fontSize: 19, fontWeight: 600 };
const ol: CSSProperties = { margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8, fontSize: 14, color: "rgb(var(--ink) / .85)" };
const chItem: CSSProperties = { display: "flex", gap: 18, alignItems: "start", padding: 18, borderRadius: 22 };
const chDrop: CSSProperties = { flex: "none", width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono, fontWeight: 600, fontSize: 13 };
const tabBase: CSSProperties = { height: 40, padding: "0 16px", border: 0, borderRadius: 999, font: "inherit", fontSize: 14, fontWeight: 700, cursor: "pointer", color: "var(--fg)" };

export function GuideView() {
  const t = { ...useT(T), ...useT(G) };
  const [sel, setSel] = useState<Sel>("tooth");
  const [prof, setProf] = useState("T5");
  const [vals, setVals] = useState<Record<Sel, [string, string]>>({ tooth: ["1645", "25"], poly: ["1059", "8"], v: ["875", "8"], round: ["2000", "6"] });

  // ---- belt selector ----
  const va = vals[sel];
  const A = num(va[0]);
  const B = num(va[1]);
  const names: Record<Sel, string> = { tooth: t.nToothed, poly: t.nPoly, v: t.nV, round: t.nRound };

  let recs: Rec[];
  if (sel === "round") {
    recs = CAT.round
      .map((x) => ({ x, d: Math.abs(x.w - B) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 2)
      .map(({ x, d }) => {
        const meters = Math.max(0.1, Math.ceil(A / 100) / 10);
        const ex = d === 0;
        return {
          title: names.round + " Ø " + x.w + " " + t.mm,
          priceF: fmtN(x.price * meters),
          unit: t.pcs + " " + t.costFor + " " + String(meters).replace(".", ",") + " " + t.mShort,
          badge: ex ? t.exact : t.close,
          badgeStyle: badge(ex),
          delta: ex ? fmtN(x.price) + " " + t.perM : "ΔØ " + sgn(x.w - B) + " " + t.mm,
        };
      });
  } else {
    let list = CAT[sel];
    if (sel === "tooth") list = list.filter((x) => x.p === prof);
    recs = list
      .map((x) => ({ x, d: (A ? Math.abs(x.L - A) / A : 1) + (B ? Math.abs(x.w - B) / B : 1) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 3)
      .map(({ x }) => {
        const ex = x.L === A && x.w === B;
        const wl = sel === "poly" ? "ΔN " : "Δb ";
        return {
          title: names[sel] + " " + x.spec,
          priceF: fmtN(x.price),
          unit: t.pcs,
          badge: ex ? t.exact : t.close,
          badgeStyle: badge(ex),
          delta: ex ? "" : "ΔL " + sgn(x.L - A) + " · " + wl + sgn(x.w - B),
        };
      });
  }

  const pitch = PITCH[prof] || 5;
  const labels: Record<Sel, [string, string]> = { tooth: [t.lLen, t.lWidth], poly: [t.lLen, t.lRibs], v: [t.lLi, t.lSec], round: [t.lRLen, t.lDia] };
  const tabDefs: [Sel, string][] = [["tooth", t.ty1], ["poly", t.ty2], ["v", t.ty3], ["round", t.ty4]];
  const setVal = (i: 0 | 1) => (v: string) =>
    setVals((prev) => {
      const arr: [string, string] = [prev[sel][0], prev[sel][1]];
      arr[i] = v;
      return { ...prev, [sel]: arr };
    });
  const sheetLabel = t.sheet + " · " + (tabDefs.find((d) => d[0] === sel) ?? ["", ""])[1].toUpperCase();
  const dimA = va[0] || "—";
  const dimB = va[1] || "—";
  const dimP = A && pitch ? "z = " + Math.round(A / pitch) + " " + t.teeth : "";

  return (
    <PageShell blobs={BLOBS}>
      <div className="guide-page">
        <Header />

        {/* Page title */}
        <section className="sec" style={{ maxWidth: 1320, margin: "0 auto", padding: "48px 20px 40px" }}>
          <nav aria-label="Навигация" className="glass-soft" style={{ display: "inline-flex", flexWrap: "wrap", gap: 8, padding: "8px 16px", borderRadius: 999, fontSize: 14, color: "rgb(var(--ink) / .75)", marginBottom: 22 }}>
            <Link href="/" style={{ color: "rgb(var(--ink) / .75)" }}>{t.home}</Link>
            <span>›</span>
            <span style={{ color: "var(--fg)", fontWeight: 600 }}>{t.gTitle}</span>
          </nav>
          <span style={{ ...eyebrow, display: "block" }}>{t.gEyebrow}</span>
          <h1 className="h1" style={{ margin: "8px 0 0", fontFamily: unb, fontWeight: 700, fontSize: 52, lineHeight: 1.08, letterSpacing: -1.5, maxWidth: 900 }}>{t.gTitle}</h1>
          <p style={{ margin: "14px 0 0", fontSize: 19, color: "rgb(var(--ink) / .8)", maxWidth: 680 }}>{t.gLead}</p>
        </section>

        {/* Interactive belt selector by drawing */}
        <section id="selector" className="sec" style={{ maxWidth: 1320, margin: "0 auto", padding: "0 20px 28px" }}>
          <div className="glass g-panel" style={{ borderRadius: 38, padding: 28, display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "end", gap: 14 }}>
              <div>
                <span style={eyebrow}>{t.tlEyebrow}</span>
                <h2 className="h2" style={{ margin: "6px 0 0", fontFamily: unb, fontSize: 30, fontWeight: 600, lineHeight: 1.15 }}>{t.tlTitle}</h2>
              </div>
              <div role="tablist" aria-label={t.fType} className="glass-soft type-tabs" style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: 5, borderRadius: 999 }}>
                {tabDefs.map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={sel === id}
                    onClick={() => setSel(id)}
                    className={sel === id ? "liquid" : ""}
                    style={{ ...tabBase, backgroundColor: sel === id ? ACCENT : "transparent" }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 22, alignItems: "stretch" }}>
              {/* Drawing */}
              <div style={{ flex: "999 1 560px", minWidth: 0, position: "relative", borderRadius: 28, background: "rgb(0 0 0 / calc(.3 * var(--well)))", boxShadow: "inset 0 2px 14px rgba(0,0,0,.45)", padding: "44px 20px 20px" }}>
                <span style={{ position: "absolute", top: 16, left: 20, fontFamily: mono, fontSize: 11, letterSpacing: 1, color: "rgb(var(--ink) / .6)" }}>{sheetLabel}</span>

                {sel === "tooth" && (
                  <svg viewBox="0 0 640 330" width="100%" role="img" aria-label={t.tAria} style={{ display: "block", height: "auto" }}>
                    <g stroke="currentColor" strokeOpacity=".3" strokeWidth="1" strokeDasharray="10 4 2 4" fill="none"><path d="M40 110 H600" /></g>
                    <path d="M160 50 L470 62 A48 48 0 0 1 470 158 L160 170 A60 60 0 0 1 160 50 Z" fill="none" stroke="currentColor" strokeWidth="10" strokeDasharray="5 4" />
                    <g className="spin"><circle cx="160" cy="110" r="50" fill="currentColor" fillOpacity=".06" stroke="currentColor" strokeWidth="2" /><circle cx="160" cy="110" r="9" fill="#0B0E14" stroke="currentColor" strokeWidth="2" /><path d="M160 64 V156 M114 110 H206" stroke="currentColor" strokeOpacity=".35" strokeWidth="2" /></g>
                    <g className="spin"><circle cx="470" cy="110" r="38" fill="currentColor" fillOpacity=".06" stroke="currentColor" strokeWidth="2" /><circle cx="470" cy="110" r="7" fill="#0B0E14" stroke="currentColor" strokeWidth="2" /><path d="M470 76 V144 M436 110 H504" stroke="currentColor" strokeOpacity=".35" strokeWidth="2" /></g>
                    <text x="250" y="36" fontFamily={svgMono} fontSize="14" fill="currentColor">L = {dimA} {t.mm}</text>
                    {/* tooth profile detail */}
                    <g transform="translate(60 210)">
                      <path d="M0 30 H16 L23 58 H43 L50 30 H82 L89 58 H109 L116 30 H148 L155 58 H175 L182 30 H214 L221 58 H241 L248 30 H280 L287 58 H307 L314 30 H340" fill="none" stroke="currentColor" strokeWidth="2" />
                      <path d="M0 16 H340" stroke="currentColor" strokeWidth="2" />
                      <g stroke={ACCENT} strokeWidth="1.5"><path d="M33 80 H99" /><path d="M33 72 V88 M99 72 V88" /></g>
                      <text x="40" y="104" fontFamily={svgMono} fontSize="14" fill="currentColor">p = {pitch} {t.mm} · {dimP}</text>
                    </g>
                    {/* width detail */}
                    <g transform="translate(450 210)">
                      <rect x="0" y="16" width="140" height="42" rx="4" fill="currentColor" fillOpacity=".08" stroke="currentColor" strokeWidth="2" />
                      <g stroke={ACCENT} strokeWidth="1.5"><path d="M0 80 H140" /><path d="M0 72 V88 M140 72 V88" /></g>
                      <text x="20" y="104" fontFamily={svgMono} fontSize="14" fill="currentColor">b = {dimB} {t.mm}</text>
                    </g>
                  </svg>
                )}

                {sel === "poly" && (
                  <svg viewBox="0 0 640 330" width="100%" role="img" aria-label={t.pAria} style={{ display: "block", height: "auto" }}>
                    <path d="M130 70 H510 V110 L494 150 L478 110 L462 150 L446 110 L430 150 L414 110 L398 150 L382 110 L366 150 L350 110 L334 150 L318 110 L302 150 L286 110 L270 150 L254 110 L238 150 L222 110 L206 150 L190 110 L174 150 L158 110 L142 150 L130 110 Z" fill="currentColor" fillOpacity=".08" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    <g stroke={ACCENT} strokeWidth="1.5"><path d="M130 48 H510" /><path d="M130 40 V56 M510 40 V56" /><path d="M142 176 H174" /><path d="M142 168 V184 M174 168 V184" /></g>
                    <text x="236" y="32" fontFamily={svgMono} fontSize="14" fill="currentColor">N = {dimB} · PJ</text>
                    <text x="130" y="206" fontFamily={svgMono} fontSize="14" fill="currentColor">2,34 {t.mm}</text>
                    <path d="M220 250 C 300 222, 420 222, 500 250 C 420 278, 300 278, 220 250 Z" fill="none" stroke="currentColor" strokeWidth="5" />
                    <text x="230" y="312" fontFamily={svgMono} fontSize="14" fill="currentColor">L = {dimA} {t.mm}</text>
                  </svg>
                )}

                {sel === "v" && (
                  <svg viewBox="0 0 640 330" width="100%" role="img" aria-label={t.vAria} style={{ display: "block", height: "auto" }}>
                    <path d="M200 70 H440 L380 190 H260 Z" fill="currentColor" fillOpacity=".08" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    <g stroke={ACCENT} strokeWidth="1.5"><path d="M200 48 H440" /><path d="M200 40 V56 M440 40 V56" /><path d="M470 70 V190" /><path d="M462 70 H478 M462 190 H478" /></g>
                    <text x="270" y="32" fontFamily={svgMono} fontSize="14" fill="currentColor">b = {dimB} {t.mm}</text>
                    <text x="488" y="136" fontFamily={svgMono} fontSize="14" fill="currentColor">h</text>
                    <path d="M200 262 C 280 236, 360 236, 440 262 C 360 288, 280 288, 200 262 Z" fill="none" stroke="currentColor" strokeWidth="5" />
                    <text x="230" y="318" fontFamily={svgMono} fontSize="14" fill="currentColor">Li = {dimA} {t.mm}</text>
                  </svg>
                )}

                {sel === "round" && (
                  <svg viewBox="0 0 640 330" width="100%" role="img" aria-label={t.rAria} style={{ display: "block", height: "auto" }}>
                    <circle cx="170" cy="140" r="70" fill="currentColor" fillOpacity=".08" stroke="currentColor" strokeWidth="2" />
                    <g stroke={ACCENT} strokeWidth="1.5"><path d="M100 140 H240" /><path d="M100 132 V148 M240 132 V148" /></g>
                    <text x="128" y="250" fontFamily={svgMono} fontSize="14" fill="currentColor">Ø = {dimB} {t.mm}</text>
                    <g className="spin"><circle cx="360" cy="140" r="34" fill="none" stroke="currentColor" strokeOpacity=".6" strokeWidth="2" /></g>
                    <g className="spin"><circle cx="540" cy="140" r="24" fill="none" stroke="currentColor" strokeOpacity=".6" strokeWidth="2" /></g>
                    <path d="M360 106 L540 116 A24 24 0 0 1 540 164 L360 174 A34 34 0 0 1 360 106 Z" fill="none" stroke="currentColor" strokeWidth="5" />
                    <text x="380" y="250" fontFamily={svgMono} fontSize="14" fill="currentColor">L = {dimA} {t.mm}</text>
                  </svg>
                )}
              </div>

              {/* Inputs + recommendation */}
              <div style={{ flex: "1 1 340px", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
                  {sel === "tooth" && (
                    <div style={{ ...fieldWrap, gridColumn: "span 2" }}>
                      <label htmlFor="s-prof" style={fieldLabel}>{t.sProf}</label>
                      <select id="s-prof" className="field" value={prof} onChange={(e) => setProf(e.target.value)}>
                        <option value="T5">T5</option>
                        <option value="T10">T10</option>
                        <option value="AT5">AT5</option>
                        <option value="RPP14">RPP14 (SLV14)</option>
                      </select>
                    </div>
                  )}
                  <div style={fieldWrap}>
                    <label htmlFor="s-a" style={fieldLabel}>{labels[sel][0]}</label>
                    <input id="s-a" className="field" inputMode="decimal" value={va[0]} onChange={(e) => setVal(0)(e.target.value)} style={{ fontFamily: mono, minWidth: 0 }} />
                  </div>
                  <div style={fieldWrap}>
                    <label htmlFor="s-b" style={fieldLabel}>{labels[sel][1]}</label>
                    <input id="s-b" className="field" inputMode="decimal" value={va[1]} onChange={(e) => setVal(1)(e.target.value)} style={{ fontFamily: mono, minWidth: 0 }} />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 800 }}>{t.recTitle}</span>
                  {recs.length === 0 && (
                    <div className="glass-soft" style={{ padding: "14px 16px", borderRadius: 20, fontSize: 14, color: "rgb(var(--ink) / .85)" }}>{t.noMatch}</div>
                  )}
                  {recs.map((r, i) => (
                    <div key={i} className="glass-soft" style={{ padding: "14px 16px", borderRadius: 22, display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                        <span style={r.badgeStyle}>{r.badge}</span>
                        <span style={{ fontFamily: mono, fontSize: 12, color: "rgb(var(--ink) / .72)", textAlign: "right" }}>{r.delta}</span>
                      </div>
                      <Link href="/product" style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.35 }}>{r.title}</Link>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                        <span style={{ fontFamily: mono, fontSize: 17, fontWeight: 600 }}>
                          {r.priceF} <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, fontWeight: 500, color: "rgb(var(--ink) / .72)" }}>{r.unit}</span>
                        </span>
                        <Link href="/cart" className="liquid" style={{ height: 40, padding: "0 16px", display: "flex", alignItems: "center", borderRadius: 999, backgroundColor: ACCENT, color: "#FFFFFF", fontSize: 14, fontWeight: 700 }}>{t.toCartL}</Link>
                      </div>
                    </div>
                  ))}
                  <a href="https://t.me/Remenuz_bot" className="glass-soft" style={{ height: 46, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 999, fontWeight: 700, fontSize: 14 }}>{t.askBtn}</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How to measure a belt */}
        <section id="measure" className="sec" style={{ maxWidth: 1320, margin: "0 auto", padding: "56px 20px 96px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "end", gap: 16, marginBottom: 28 }}>
            <div>
              <span style={eyebrow}>{t.mEyebrow}</span>
              <h2 className="h2" style={{ margin: "6px 0 0", fontFamily: unb, fontSize: 38, fontWeight: 600, letterSpacing: -1 }}>{t.mTitle}</h2>
            </div>
            <div className="glass-soft" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 999, fontSize: 14 }}>
              <span style={{ color: "rgb(var(--ink) / .72)" }}>{t.need}</span><b>{t.tool1}</b><span aria-hidden="true">·</span><b>{t.tool2}</b><span aria-hidden="true">·</span><b>{t.tool3}</b>
            </div>
          </div>

          {/* Step 0: marking */}
          <div className="glass" style={{ borderRadius: 32, padding: "24px 28px", marginBottom: 18, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20 }}>
            <span className="drop" style={{ flex: "none", width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono, fontWeight: 600 }}>00</span>
            <div style={{ flex: "1 1 320px", minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{t.m0t}</div>
              <div style={{ color: "rgb(var(--ink) / .78)", fontSize: 15 }}>
                {t.m0a} <span style={{ fontFamily: mono }}>T5 1645 25</span>, <span style={{ fontFamily: mono }}>6 PJ 533</span> {t.m0or} <span style={{ fontFamily: mono }}>875 Li</span>{t.m0b}
              </div>
            </div>
            <div className="glass-soft" style={{ padding: "10px 16px", borderRadius: 16, fontFamily: mono, fontSize: 15, letterSpacing: 1, backgroundColor: "rgb(0 0 0 / calc(.25 * var(--well)))" }}>T5 · 1645 · 25</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 18 }}>
            {/* Toothed */}
            <div className="glass" style={card}>
              <div style={cardSvgBox}>
                <svg viewBox="0 0 260 120" width="100%" role="img" aria-label={t.tAria} style={{ display: "block", height: "auto" }}>
                  <path d="M10 40 H24 L30 64 H46 L52 40 H80 L86 64 H102 L108 40 H136 L142 64 H158 L164 40 H192 L198 64 H214 L220 40 H250" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M10 28 H250" stroke="currentColor" strokeWidth="2" />
                  <g stroke={ACCENT} strokeWidth="1.5"><path d="M38 84 H94" /><path d="M38 76 V92 M94 76 V92" /></g>
                  <text x="44" y="108" fontFamily={svgMono} fontSize="12" fill="currentColor" fillOpacity=".85">{t.tStep}</text>
                  <g stroke={ACCENT} strokeWidth="1.5"><path d="M236 28 V64" /><path d="M230 28 H242 M230 64 H242" /></g>
                  <text x="168" y="108" fontFamily={svgMono} fontSize="12" fill="currentColor" fillOpacity=".85">{t.tTeeth}</text>
                </svg>
              </div>
              <div>
                <span style={cardCode}>T5 · T10 · AT5</span>
                <h3 style={cardH3}>{t.tName}</h3>
              </div>
              <ol style={ol}>
                <li><b>{t.t1b}</b> {t.t1}</li>
                <li><b>{t.t2b}</b> {t.t2}</li>
                <li><b>{t.t3b}</b> {t.t3}</li>
                <li><b>{t.t4b}</b>{t.t4}</li>
              </ol>
            </div>

            {/* Poly-V */}
            <div className="glass" style={card}>
              <div style={cardSvgBox}>
                <svg viewBox="0 0 260 120" width="100%" role="img" aria-label={t.pAria} style={{ display: "block", height: "auto" }}>
                  <path d="M40 30 H220 V46 L208 70 L196 46 L184 70 L172 46 L160 70 L148 46 L136 70 L124 46 L112 70 L100 46 L88 70 L76 46 L64 70 L52 46 L40 70 Z" fill="currentColor" fillOpacity=".08" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <g stroke={ACCENT} strokeWidth="1.5"><path d="M52 84 H76" /><path d="M52 78 V90 M76 78 V90" /></g>
                  <text x="40" y="108" fontFamily={svgMono} fontSize="12" fill="currentColor" fillOpacity=".85">{t.pStepTxt}</text>
                  <text x="166" y="24" fontFamily={svgMono} fontSize="12" fill="currentColor" fillOpacity=".85">{t.pRibs}</text>
                </svg>
              </div>
              <div>
                <span style={cardCode}>PJ</span>
                <h3 style={cardH3}>{t.pName}</h3>
              </div>
              <ol style={ol}>
                <li><b>{t.p1b}</b> {t.p1}</li>
                <li><b>{t.p2b}</b> {t.p2}</li>
                <li><b>{t.p3b}</b> {t.p3}</li>
              </ol>
            </div>

            {/* Classic V */}
            <div className="glass" style={card}>
              <div style={cardSvgBox}>
                <svg viewBox="0 0 260 120" width="100%" role="img" aria-label={t.vAria} style={{ display: "block", height: "auto" }}>
                  <path d="M70 26 H190 L160 86 H100 Z" fill="currentColor" fillOpacity=".08" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <g stroke={ACCENT} strokeWidth="1.5"><path d="M70 14 H190" /><path d="M70 8 V20 M190 8 V20" /><path d="M210 26 V86" /><path d="M204 26 H216 M204 86 H216" /></g>
                  <text x="96" y="108" fontFamily={svgMono} fontSize="12" fill="currentColor" fillOpacity=".85">{t.vWH}</text>
                  <text x="222" y="60" fontFamily={svgMono} fontSize="12" fill="currentColor" fillOpacity=".85">h</text>
                </svg>
              </div>
              <div>
                <span style={cardCode}>{t.vCode}</span>
                <h3 style={cardH3}>{t.vName}</h3>
              </div>
              <ol style={ol}>
                <li><b>{t.v1b}</b> {t.v1}</li>
                <li><b>{t.v2b}</b> {t.v2}</li>
                <li>{t.v3}</li>
              </ol>
            </div>

            {/* Round */}
            <div className="glass" style={card}>
              <div style={cardSvgBox}>
                <svg viewBox="0 0 260 120" width="100%" role="img" aria-label={t.rAria} style={{ display: "block", height: "auto" }}>
                  <circle cx="80" cy="58" r="34" fill="currentColor" fillOpacity=".08" stroke="currentColor" strokeWidth="2" />
                  <g stroke={ACCENT} strokeWidth="1.5"><path d="M46 58 H114" /><path d="M46 52 V64 M114 52 V64" /></g>
                  <text x="62" y="112" fontFamily={svgMono} fontSize="12" fill="currentColor" fillOpacity=".85">{t.rDia}</text>
                  <path d="M140 58 C170 20 210 20 240 58 C210 96 170 96 140 58 Z" fill="none" stroke="currentColor" strokeWidth="6" />
                  <text x="140" y="112" fontFamily={svgMono} fontSize="12" fill="currentColor" fillOpacity=".85">{t.rLen}</text>
                </svg>
              </div>
              <div>
                <span style={cardCode}>Ø 3–10 {t.mm}</span>
                <h3 style={cardH3}>{t.rName}</h3>
              </div>
              <ol style={ol}>
                <li><b>{t.r1b}</b> {t.r1}</li>
                <li><b>{t.r2b}</b> {t.r2}</li>
                <li>{t.r3}</li>
              </ol>
            </div>
          </div>

          {/* Tips + CTA */}
          <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))", gap: 18 }}>
            <div className="glass-soft" style={{ borderRadius: 28, padding: "22px 26px", display: "flex", flexDirection: "column", gap: 10, fontSize: 14, color: "rgb(var(--ink) / .85)" }}>
              <b style={{ fontSize: 16, color: "var(--fg)" }}>{t.tipTitle}</b>
              <span>{t.tip1}</span>
              <span>{t.tip2}</span>
              <span>{t.tip3}</span>
            </div>
            <div className="glass" style={{ borderRadius: 28, padding: "22px 26px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div style={{ flex: "1 1 220px" }}>
                <b style={{ fontSize: 16 }}>{t.cantT}</b>
                <div style={{ fontSize: 14, color: "rgb(var(--ink) / .78)" }}>{t.cantD}</div>
              </div>
              <a href="https://t.me/Remenuz_bot" className="liquid" style={{ height: 50, padding: "0 22px", display: "flex", alignItems: "center", backgroundColor: ACCENT, color: "#FFFFFF", fontWeight: 700, borderRadius: 999 }}>{t.sendPh}</a>
            </div>
          </div>
        </section>

        {/* How to choose */}
        <section className="sec" style={{ maxWidth: 1320, margin: "0 auto", padding: "0 20px 96px" }}>
          <div className="glass g-choose" style={{ borderRadius: 40, padding: 48, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 460px), 1fr))", gap: 48 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <div>
                <span style={eyebrow}>{t.chEyebrow}</span>
                <h2 className="h2" style={{ margin: "10px 0 0", fontFamily: unb, fontSize: 34, fontWeight: 600, lineHeight: 1.15, letterSpacing: -1 }}>{t.chTitle}</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {([["01", t.ch1t, t.ch1d], ["02", t.ch2t, t.ch2d], ["03", t.ch3t, t.ch3d]] as const).map(([n, title, desc]) => (
                  <div key={n} className="glass-soft" style={chItem}>
                    <span className="drop" style={chDrop}>{n}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 17 }}>{title}</div>
                      <div style={{ color: "rgb(var(--ink) / .75)", marginTop: 2, fontSize: 15 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="g-nf" style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "end", gap: 22, minHeight: 380, padding: 36, borderRadius: 30, background: "rgb(0 0 0 / calc(.25 * var(--well)))", boxShadow: "inset 0 2px 14px rgba(0,0,0,.4)", overflow: "hidden" }}>
              <span className="drop" aria-hidden="true" style={{ position: "absolute", top: 28, left: 32, width: 150, height: 150, backgroundColor: "rgba(255,106,43,.22)" }} />
              <span className="drop" aria-hidden="true" style={{ position: "absolute", top: 90, left: 200, width: 70, height: 70, backgroundColor: "rgba(47,107,255,.22)" }} />
              <span className="drop" aria-hidden="true" style={{ position: "absolute", top: 40, right: 40, width: 36, height: 36 }} />
              <div style={{ position: "relative" }}>
                <h3 style={{ margin: 0, fontFamily: unb, fontSize: 26, fontWeight: 600, lineHeight: 1.2 }}>{t.nfTitle}</h3>
                <p style={{ margin: "10px 0 0", color: "rgb(var(--ink) / .8)" }}>{t.nfText}</p>
              </div>
              <div style={{ position: "relative", display: "flex", flexWrap: "wrap", gap: 12 }}>
                <a href="https://t.me/Remenuz_bot" className="liquid" style={{ height: 52, padding: "0 24px", display: "flex", alignItems: "center", backgroundColor: ACCENT, color: "#FFFFFF", fontWeight: 700, borderRadius: 999 }}>{t.tgBtn}</a>
                <a href="https://wa.me/998935509590" className="glass" style={{ height: 52, padding: "0 24px", display: "flex", alignItems: "center", fontWeight: 700, borderRadius: 999 }}>WhatsApp</a>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageShell>
  );
}
