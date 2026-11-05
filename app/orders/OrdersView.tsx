"use client";

import Link from "next/link";
import { useState, type CSSProperties, type FormEvent } from "react";
import { useT } from "@/lib/lang";
import { ACCENT } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageShell, type Blob } from "@/components/PageShell";
import { BADGE, O, ORD } from "./content";

const blobs: Blob[] = [
  { top: -160, left: -180, width: 680, height: 680, background: ACCENT, color: "#FFFFFF", opacity: 0.55 },
  { top: 260, right: -200, width: 620, height: 620, background: "#2F6BFF", opacity: 0.5 },
  { top: 1500, left: "30%", width: 560, height: 560, background: "#12B5A6", opacity: 0.32 },
  { top: 2500, left: -160, width: 620, height: 620, background: ACCENT, color: "#FFFFFF", opacity: 0.4 },
  { top: 3300, right: -120, width: 600, height: 600, background: "#6A4CFF", opacity: 0.38 },
];

type Step = "phone" | "code" | "list";
type Filter = "all" | "active" | "done";

const fmt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const mono = "'JetBrains Mono', monospace";
const label: CSSProperties = { fontSize: 13, fontWeight: 700 };
const pillBtn: CSSProperties = { height: 44, padding: "0 18px", display: "flex", alignItems: "center", borderRadius: 999, fontWeight: 700, fontSize: 14 };

export function OrdersView() {
  const o = useT(O);

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [openNo, setOpenNo] = useState("RM-227364");
  const [filter, setFilter] = useState<Filter>("all");

  const isAuth = step !== "list";
  const isCode = step === "code";
  const isList = step === "list";

  const submitAuth = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step === "phone") {
      if (phone.replace(/\D/g, "").length < 9) {
        setErr(o.errPhone);
        return;
      }
      setStep("code");
      setErr("");
      return;
    }
    if (code.length !== 4) {
      setErr(o.errCode);
      return;
    }
    setStep("list");
    setErr("");
  };

  const filters: [Filter, string][] = [
    ["all", o.fAll],
    ["active", o.fActive],
    ["done", o.fDone],
  ];
  const shown = ORD.filter((x) => filter === "all" || (filter === "done" ? x.st === "done" : x.st !== "done"));

  return (
    <PageShell blobs={blobs}>
      <Header />

      {/* My orders */}
      <section className="sec" style={{ maxWidth: 1320, margin: "0 auto", padding: "40px 20px 96px", display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "end", gap: 14 }}>
          <div>
            <span style={{ fontFamily: mono, fontSize: 12, letterSpacing: 1, color: "rgb(var(--ink) / .72)" }}>{o.eyebrow}</span>
            <h1 className="h1" style={{ margin: "6px 0 0", fontFamily: "'Oswald', sans-serif", fontSize: 44, fontWeight: 700, letterSpacing: -1 }}>{o.title}</h1>
          </div>
          {isList && (
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
              <span className="glass-soft" style={{ padding: "8px 14px", borderRadius: 999, fontFamily: mono, fontSize: 14 }}>{phone || "+998 …"}</span>
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setCode("");
                  setPhone("");
                }}
                className="glass-soft"
                style={{ height: 40, padding: "0 16px", borderRadius: 999, color: "var(--fg)", font: "inherit", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
              >
                {o.logoutL}
              </button>
            </div>
          )}
        </div>

        {/* Step: phone / code */}
        {isAuth && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 22, alignItems: "stretch" }}>
            <form onSubmit={submitAuth} className="glass" style={{ flex: "1 1 420px", minWidth: 0, borderRadius: 36, padding: 32, display: "flex", flexDirection: "column", gap: 16 }}>
              <span className="drop" style={{ width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="3" /><path d="M11 18h2" /></svg>
              </span>
              <h2 style={{ margin: 0, fontFamily: "'Oswald', sans-serif", fontSize: 24, fontWeight: 600 }}>{o.authTitle}</h2>
              <p style={{ margin: 0, color: "rgb(var(--ink) / .8)", fontSize: 15 }}>{o.authText}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label htmlFor="o-phone" style={label}>{o.phoneL}</label>
                <input
                  id="o-phone"
                  className="field"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+998 __ ___ __ __"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setErr("");
                  }}
                  disabled={isCode}
                  style={{ fontFamily: mono }}
                />
              </div>
              {isCode && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label htmlFor="o-code" style={label}>{o.codeL}</label>
                  <input
                    id="o-code"
                    className="field"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={4}
                    placeholder="• • • •"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.replace(/\D/g, "").slice(0, 4));
                      setErr("");
                    }}
                    style={{ fontFamily: mono, fontSize: 22, letterSpacing: 10, textAlign: "center" }}
                  />
                  <span style={{ fontSize: 12, color: "rgb(var(--ink) / .65)" }}>{o.codeHint}</span>
                </div>
              )}
              {err && (
                <div role="alert" style={{ padding: "10px 14px", borderRadius: 16, background: "rgba(255,90,60,.18)", border: "1px solid rgba(255,140,110,.5)", fontSize: 13, fontWeight: 600 }}>{err}</div>
              )}
              <button type="submit" className="liquid" style={{ height: 56, border: 0, borderRadius: 999, backgroundColor: ACCENT, color: "#FFFFFF", font: "inherit", fontWeight: 800, fontSize: 16, cursor: "pointer" }}>
                {isCode ? o.loginBtn : o.sendBtn}
              </button>
              {isCode && (
                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setCode("");
                  }}
                  className="glass-soft"
                  style={{ height: 46, borderRadius: 999, color: "var(--fg)", font: "inherit", fontWeight: 700, cursor: "pointer" }}
                >
                  {o.changeL}
                </button>
              )}
            </form>
            <div className="glass-soft" style={{ flex: "1 1 360px", minWidth: 0, borderRadius: 36, padding: 32, display: "flex", flexDirection: "column", gap: 14 }}>
              <h3 style={{ margin: 0, fontFamily: "'Oswald', sans-serif", fontSize: 20, fontWeight: 600 }}>{o.whyTitle}</h3>
              {o.why.map((w) => (
                <div key={w.n} style={{ display: "flex", gap: 14, alignItems: "start" }}>
                  <span className="drop" style={{ flex: "none", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono, fontSize: 12, fontWeight: 600 }}>{w.n}</span>
                  <div style={{ color: "rgb(var(--ink) / .85)", fontSize: 15 }}>{w.t}</div>
                </div>
              ))}
              <a href="https://t.me/Remenuz_bot" style={{ marginTop: "auto", color: "var(--promo)", fontWeight: 700 }}>{o.tgL} →</a>
            </div>
          </div>
        )}

        {/* Step: list */}
        {isList && (
          <>
            <div role="tablist" aria-label={o.filterL} className="glass-soft" style={{ alignSelf: "start", display: "flex", flexWrap: "wrap", gap: 4, padding: 5, borderRadius: 999 }}>
              {filters.map(([id, lbl]) => {
                const on = filter === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setFilter(id)}
                    className={on ? "liquid" : ""}
                    style={{ height: 40, padding: "0 16px", border: 0, borderRadius: 999, font: "inherit", fontSize: 14, fontWeight: 700, cursor: "pointer", color: "#FFFFFF", backgroundColor: on ? ACCENT : "transparent" }}
                  >
                    {lbl}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {shown.map((x) => {
                const open = openNo === x.no;
                const total = x.items.reduce((s, i) => s + i.p, 0);
                const bc = BADGE[x.st];
                return (
                  <div key={x.no} className="glass" style={{ borderRadius: 32, padding: "22px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 20px" }}>
                      <div style={{ flex: "1 1 220px" }}>
                        <div style={{ fontFamily: mono, fontSize: 18, fontWeight: 600 }}>{x.no}</div>
                        <div style={{ fontSize: 13, color: "rgb(var(--ink) / .72)" }}>{x.date} · {x.items.length + " " + o.pos}</div>
                      </div>
                      <span style={{ padding: "6px 14px", borderRadius: 999, fontSize: 13, fontWeight: 800, background: bc[0], border: "1px solid " + bc[1] }}>{o.st[x.st]}</span>
                      <span style={{ minWidth: 140, textAlign: "right", fontFamily: mono, fontSize: 19, fontWeight: 600 }}>
                        {fmt(total)} <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 500, color: "rgb(var(--ink) / .72)" }}>{o.sum}</span>
                      </span>
                      <button type="button" onClick={() => setOpenNo(open ? "" : x.no)} aria-expanded={open} className="glass-soft" style={{ height: 44, padding: "0 18px", borderRadius: 999, color: "var(--fg)", font: "inherit", fontWeight: 700, cursor: "pointer" }}>
                        {open ? o.close : o.open}
                      </button>
                    </div>
                    {/* progress */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 6 }}>
                      {[0, 1, 2, 3, 4].map((i) => (
                        <span key={i} style={{ height: 6, borderRadius: 999, background: i <= x.stage ? (x.st === "done" ? "#12B5A6" : ACCENT) : "rgb(var(--ink) / .15)" }} />
                      ))}
                    </div>
                    {open && (
                      <>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 18, borderTop: "1px solid rgb(var(--ink) / .12)", paddingTop: 16 }}>
                          <div style={{ flex: "999 1 420px", minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                            {x.items.map((it) => (
                              <div key={it.t} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                <span className="drop" style={{ flex: "none", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <svg width="28" height="16" viewBox="0 0 200 110" aria-hidden="true"><rect x="12" y="20" width="176" height="70" rx="35" fill="none" stroke="currentColor" strokeWidth="14" strokeDasharray="6 5" /></svg>
                                </span>
                                <span style={{ flex: 1, minWidth: 0, fontWeight: 600, fontSize: 14 }}>{it.t}</span>
                                <span style={{ fontFamily: mono, fontSize: 14, color: "rgb(var(--ink) / .8)" }}>{it.q}</span>
                                <span style={{ minWidth: 110, textAlign: "right", fontFamily: mono, fontSize: 14 }}>{fmt(it.p) + " " + o.sum}</span>
                              </div>
                            ))}
                          </div>
                          <ol aria-label={o.statusL} style={{ flex: "1 1 300px", listStyle: "none", margin: 0, padding: 0 }}>
                            {o.tl.map((title, i, arr) => {
                              const s = i < x.stage || (x.st === "done" && i === x.stage) ? "done" : i === x.stage ? "now" : "next";
                              const dot: CSSProperties =
                                s === "done"
                                  ? { background: "#12B5A6", border: "2px solid #7CF2C9" }
                                  : s === "now"
                                    ? { background: ACCENT, color: "#FFFFFF", border: "3px solid #FFFFFF" }
                                    : { border: "2px solid rgb(var(--ink) / .4)" };
                              const line: CSSProperties =
                                i === arr.length - 1 ? { display: "none" } : { flex: 1, width: 2, minHeight: 16, background: s === "done" ? "#12B5A6" : "rgb(var(--ink) / .2)" };
                              return (
                                <li key={i} style={{ display: "flex", gap: 12 }}>
                                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <span style={{ flex: "none", width: 14, height: 14, borderRadius: "50%", boxSizing: "border-box", ...dot }} />
                                    <span style={line} />
                                  </div>
                                  <div style={{ paddingBottom: 12 }}>
                                    <div style={{ fontWeight: 700, fontSize: 14, ...(s === "next" ? { color: "rgb(var(--ink) / .65)" } : {}) }}>
                                      {x.st === "invoice" && i === 2 ? o.st.invoice : title}
                                    </div>
                                    <div style={{ fontSize: 12, color: "rgb(var(--ink) / .65)" }}>{i === 0 ? x.date : ""}</div>
                                  </div>
                                </li>
                              );
                            })}
                          </ol>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                          <Link href="/cart" className="liquid" style={{ ...pillBtn, backgroundColor: ACCENT, color: "#FFFFFF" }}>{o.repeatL}</Link>
                          <a href="https://t.me/Remenuz_bot" className="glass-soft" style={pillBtn}>{o.askL}</a>
                          {x.track && (
                            <span className="glass-soft" style={{ height: 44, padding: "0 18px", display: "flex", alignItems: "center", gap: 8, borderRadius: 999, fontSize: 14 }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src="/img/fargo.png" alt="Fargo" style={{ height: 18, background: "#FFFFFF", borderRadius: 999, padding: "3px 6px" }} />
                              <span style={{ fontFamily: mono }}>{x.track}</span>
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
              {shown.length === 0 && (
                <div className="glass-soft" style={{ padding: 24, borderRadius: 26, textAlign: "center", color: "rgb(var(--ink) / .8)" }}>{o.emptyL}</div>
              )}
            </div>
            <p style={{ margin: 0, fontSize: 12, color: "rgb(var(--ink) / .55)" }}>{o.demoNote}</p>
          </>
        )}
      </section>

      <Footer />
    </PageShell>
  );
}
