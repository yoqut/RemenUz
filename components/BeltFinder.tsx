"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import { ACCENT, T } from "@/lib/i18n";
import { useLang, useT } from "@/lib/lang";
import { BELT_TYPES, FINDER, finderHref, finderWords, profilesOf, type BeltType } from "@/lib/finder";
import { GlassSelect } from "./GlassSelect";

const MONO = "'JetBrains Mono', monospace";
const label: CSSProperties = { fontSize: 13, fontWeight: 700 };
const wrap: CSSProperties = { display: "flex", flexDirection: "column", gap: 6, minWidth: 0 };

/** Small line drawings of each belt section, so the type chips read at a glance. */
const ICONS: Record<BeltType, React.ReactNode> = {
  tooth: <path d="M2 9h3v4h3V9h3v4h3V9h3v4h3V9h2M2 15h20" />,
  poly: <path d="M2 8h20M3 8l2 7 2-7 2 7 2-7 2 7 2-7 2 7 2-7 2 7" />,
  v: <path d="M4 7h16l-4 10H8z" />,
  round: <circle cx="12" cy="12" r="6" />,
};

/** What the finder is currently set to: profile category, size search words and the length in mm. */
export type FinderQuery = { cat: number; href: string; q: string; len: string };

/**
 * Belt finder form. `page` is the /finder page itself: an h1 and a compact layout (type chips in one
 * row, fields and button in one row); `onQuery` then receives every change for the live results.
 */
export function BeltFinder({ page, onQuery }: { page?: boolean; onQuery?: (q: FinderQuery) => void }) {
  const Heading = page ? "h1" : "h2";
  const { lang } = useLang();
  const t = useT(T);
  const router = useRouter();
  const [type, setType] = useState<BeltType>("tooth");
  const profiles = profilesOf(type);
  const [prof, setProf] = useState(profiles[0].slug);
  const [len, setLen] = useState("");
  const [second, setSecond] = useState("");
  const def = FINDER[type];
  const ru = lang === "ru";

  const pickType = (k: BeltType) => {
    setType(k);
    const first = profilesOf(k).find((p) => p.count > 0) ?? profilesOf(k)[0];
    setProf(first.slug);
    setLen("");
    setSecond("");
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    router.push(finderHref(prof, len, second, type));
  };
  const digits = (v: string) => v.replace(/[^\d.,]/g, "");
  const catId = profiles.find((p) => p.slug === prof)?.id ?? 0;

  useEffect(() => {
    onQuery?.({ cat: catId, href: finderHref(prof, len, second, type), q: finderWords(len, second, type), len: len.trim() });
  }, [onQuery, catId, prof, len, second, type]);

  const submitBtn = (
    <button type="submit" className="liquid" style={{ height: page ? 50 : 56, width: "100%", border: 0, borderRadius: 999, backgroundColor: ACCENT, color: "#FFFFFF", font: "inherit", fontWeight: 700, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
      {t.fBtn}
    </button>
  );

  return (
    <form id="finder" className="glass" onSubmit={submit} style={{ position: "relative", borderRadius: 36, padding: page ? "clamp(18px, 4vw, 26px)" : "clamp(20px, 5vw, 34px)", display: "flex", flexDirection: "column", gap: page ? 16 : 20, minWidth: 0 }}>
      <div>
        <Heading style={{ margin: 0, fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 600 }}>{t.fTitle}</Heading>
        <p style={{ margin: "4px 0 0", fontSize: 14, color: "rgb(var(--ink) / .72)" }}>{t.fSub}</p>
      </div>

      <fieldset style={{ margin: 0, padding: 0, border: 0, minWidth: 0 }}>
        <legend style={{ ...label, padding: 0, marginBottom: 8 }}>{t.fType}</legend>
        <div role="radiogroup" aria-label={t.fType} className={page ? "type-row" : undefined} style={{ display: "grid", gridTemplateColumns: `repeat(${page ? 4 : 2}, minmax(0, 1fr))`, gap: 8 }}>
          {BELT_TYPES.map((k) => {
            const on = k === type;
            return (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => pickType(k)}
                className={on ? "liquid" : ""}
                style={{
                  display: "flex", alignItems: "center", gap: 8, minHeight: page ? 44 : 50, padding: "0 12px", borderRadius: 16, cursor: "pointer",
                  font: "inherit", fontSize: 14, fontWeight: 700, color: "var(--fg)", textAlign: "left",
                  border: on ? "1px solid rgb(var(--ink) / .55)" : "1px solid rgb(var(--ink) / .16)",
                  backgroundColor: on ? ACCENT : "rgb(0 0 0 / calc(.22 * var(--well)))", transition: "background-color .2s, border-color .2s",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true" style={{ flex: "none", opacity: on ? 1 : 0.75 }}>{ICONS[k]}</svg>
                <span style={{ minWidth: 0 }}>{FINDER[k][lang]}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: 14 }}>
        <div style={wrap}>
          <span id="g-prof-l" style={label}>{t.fProf}</span>
          <GlassSelect
            id="g-prof"
            labelledBy="g-prof-l"
            value={prof}
            onChange={setProf}
            options={profiles.map((p) => ({
              value: p.slug,
              label: p.code,
              hint: p.count ? `${p.count} ${ru ? "шт" : "ta"}` : ru ? "под заказ" : "buyurtmaga",
              muted: !p.count,
            }))}
          />
        </div>
        {def.len && (
          <div style={wrap}>
            <label htmlFor="g-len" style={label}>{def.len[lang]}</label>
            <input id="g-len" className="field" inputMode="numeric" placeholder={def.len.ph} value={len} onChange={(e) => setLen(digits(e.target.value))} style={{ fontFamily: MONO, minWidth: 0, width: "100%" }} />
          </div>
        )}
        {def.second && (
          <div style={wrap}>
            <label htmlFor="g-w" style={label}>{def.second[lang]}</label>
            <input id="g-w" className="field" inputMode="numeric" placeholder={def.second.ph} value={second} onChange={(e) => setSecond(digits(e.target.value))} style={{ fontFamily: MONO, minWidth: 0, width: "100%" }} />
          </div>
        )}
        {page && <div className="finder-btn" style={{ ...wrap, justifyContent: "end" }}>{submitBtn}</div>}
      </div>

      {!page && submitBtn}
      <p style={{ margin: 0, fontSize: 14, color: "rgb(var(--ink) / .75)" }}>
        {t.fHelp} <a href="https://t.me/Remenuz_bot" style={{ color: "var(--promo)", fontWeight: 700 }}>{t.fHelpLink}</a>
      </p>
    </form>
  );
}
