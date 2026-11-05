"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { useT } from "@/lib/lang";
import { ACCENT, T } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageShell } from "@/components/PageShell";
import { BUYERS, COMPANY, IP, type Slug } from "./content";

const navStyle = (on: boolean): CSSProperties => ({
  display: "block",
  padding: "10px 14px",
  borderRadius: 16,
  fontWeight: 700,
  fontSize: 15,
  ...(on ? { backgroundColor: "rgb(var(--ink) / .2)" } : { color: "rgb(var(--ink) / .82)" }),
});

const ctaStyle: CSSProperties = { alignSelf: "start", marginTop: 4, height: 42, padding: "0 18px", display: "flex", alignItems: "center", borderRadius: 999, backgroundColor: "rgb(var(--ink) / .18)", fontSize: 14, fontWeight: 700 };

/** Internal routes go through next/link; "#", tel:, https: stay plain anchors. */
function SmartLink({ href, className, style, children }: { href: string; className?: string; style?: CSSProperties; children: ReactNode }) {
  if (href.startsWith("/")) return <Link href={href} className={className} style={style}>{children}</Link>;
  return <a href={href} className={className} style={style}>{children}</a>;
}

export function InfoView({ slug }: { slug: Slug }) {
  const t = useT(T);
  const ipl = useT(IP);
  const pg = ipl.pages[slug];
  const gt = ipl.groups[pg.g];
  const groupTitle = gt.charAt(0) + gt.slice(1).toLowerCase();

  const item = (id: Slug) => {
    const on = id === slug;
    return (
      <Link key={id} href={`/info/${id}`} aria-current={on ? "page" : "false"} className={on ? "liquid" : ""} style={navStyle(on)}>
        {ipl.pages[id].label}
      </Link>
    );
  };

  const groups: { title: string; items: ReactNode[] }[] = [
    { title: ipl.groups.company, items: COMPANY.map(item) },
    { title: ipl.groups.buyers, items: BUYERS.map(item) },
    {
      title: ipl.groups.info,
      items: ipl.infoLinks.map((l) => (
        <Link key={l.label} href="/business" aria-current="false" style={navStyle(false)}>{l.label}</Link>
      )),
    },
  ];

  return (
    <PageShell>
      <Header />

      {/* Info pages */}
      <section id="top" className="sec" style={{ maxWidth: 1320, margin: "0 auto", padding: "40px 20px 96px", display: "flex", flexWrap: "wrap", gap: 28, alignItems: "flex-start" }}>
        {/* Sidebar */}
        <nav aria-label={ipl.navLabel} className="glass hide-sm" style={{ flex: "1 1 260px", borderRadius: 32, padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
          {groups.map((g) => (
            <div key={g.title} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ padding: "4px 12px", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: 1, color: "rgb(var(--ink) / .6)" }}>{g.title}</span>
              {g.items}
            </div>
          ))}
        </nav>

        {/* Content */}
        <article style={{ flex: "999 1 640px", minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="glass" style={{ borderRadius: 36, padding: 34, display: "flex", flexDirection: "column", gap: 12 }}>
            <nav aria-label="Навигация" style={{ display: "flex", flexWrap: "wrap", gap: 8, fontSize: 14, color: "rgb(var(--ink) / .72)" }}>
              <Link href="/" style={{ color: "rgb(var(--ink) / .72)" }}>{t.home}</Link>
              <span>›</span>
              <span>{groupTitle}</span>
              <span>›</span>
              <span style={{ color: "var(--fg)", fontWeight: 600 }}>{pg.title}</span>
            </nav>
            <h1 className="h1" style={{ margin: "6px 0 0", fontFamily: "'Oswald', sans-serif", fontSize: 44, fontWeight: 700, letterSpacing: -1, lineHeight: 1.1, overflowWrap: "anywhere" }}>{pg.title}</h1>
            <p style={{ margin: 0, fontSize: 18, color: "rgb(var(--ink) / .82)", maxWidth: 760 }}>{pg.lead}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))", gap: 16 }}>
            {pg.cards.map((c, i) => (
              <div key={i} className="glass-soft" style={{ borderRadius: 28, padding: 22, display: "flex", flexDirection: "column", gap: 10 }}>
                <span className="drop" style={{ alignSelf: "start", minWidth: 48, height: 48, padding: "0 10px", boxSizing: "border-box", borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600 }}>{c.n}</span>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 600, lineHeight: 1.25 }}>{c.h}</div>
                <div style={{ fontSize: 15, color: "rgb(var(--ink) / .8)" }}>{c.d}</div>
                {c.href && (
                  <SmartLink href={c.href} className="liquid liq-n" style={ctaStyle}>{c.cta}</SmartLink>
                )}
              </div>
            ))}
          </div>

          {pg.note && (
            <div style={{ borderRadius: 24, padding: "18px 22px", border: "1px dashed rgb(var(--ink) / .35)", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "rgb(var(--ink) / .75)" }}>{pg.note}</div>
          )}

          <div className="glass" style={{ borderRadius: 30, padding: "22px 26px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
            <div>
              <b style={{ fontSize: 16 }}>{ipl.helpT}</b>
              <div style={{ fontSize: 14, color: "rgb(var(--ink) / .78)" }}>{ipl.helpD}</div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <a href="https://t.me/Remenuz_bot" className="liquid" style={{ height: 48, padding: "0 20px", display: "flex", alignItems: "center", borderRadius: 999, backgroundColor: ACCENT, color: "#FFFFFF", fontWeight: 700 }}>Telegram</a>
              <a href="tel:+998787771188" className="glass-soft" style={{ height: 48, padding: "0 20px", display: "flex", alignItems: "center", borderRadius: 999, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>+998 78 777 11 88</a>
            </div>
          </div>
        </article>
      </section>

      <Footer />
    </PageShell>
  );
}
