"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useT } from "@/lib/lang";
import { T } from "@/lib/i18n";

const col: CSSProperties = { display: "flex", flexDirection: "column", gap: 8, fontSize: 14 };
const head: CSSProperties = { color: "#FFFFFF", fontWeight: 700, fontSize: 13, letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 4 };
const social: CSSProperties = { padding: "6px 12px", borderRadius: 6, border: "1px solid #2E343D", color: "#E4E7EB", fontSize: 13, fontWeight: 600 };

/** Graphite footer, full width: contacts and socials, then company / buyers / info links. */
export function Footer() {
  const t = useT(T);
  return (
    <footer className="ind-foot" style={{ background: "#15181C", color: "#A9B0BA", fontFamily: "'Inter', system-ui, sans-serif", marginTop: 24 }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "44px 20px 28px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
        <div style={{ ...col, gap: 12 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/logo-full.png" alt="Remen.uz — Driven by precision" style={{ height: 52, width: "auto", alignSelf: "start", display: "block" }} />
          <a href="tel:+998787771188" className="ind-mono" style={{ color: "#FFFFFF", fontWeight: 700, fontSize: 18 }}>+998 78 777 11 88</a>
          <span>{t.addr1}<br />{t.addr2}</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <a href="https://t.me/remen_uz_store" style={social}>Telegram</a>
            <a href="https://wa.me/998935509590" style={social}>WhatsApp</a>
            <a href="https://instagram.com/remen_uz_store" style={social}>Instagram</a>
            <a href="https://fb.com/remen_uz_store" style={social}>Facebook</a>
          </div>
        </div>
        <div style={col}>
          <span style={head}>{t.fCompany}</span>
          <Link href="/info/about" style={{ color: "inherit" }}>{t.fAbout}</Link>
          <Link href="/info/contacts" style={{ color: "inherit" }}>{t.fContacts}</Link>
          <Link href="/info/news" style={{ color: "inherit" }}>{t.fNews}</Link>
          <Link href="/info/brands" style={{ color: "inherit" }}>{t.fBrands}</Link>
          <Link href="/info/offer" style={{ color: "inherit" }}>{t.fOffer}</Link>
        </div>
        <div style={col}>
          <span style={head}>{t.fBuyers}</span>
          <Link href="/info/howto" style={{ color: "inherit" }}>{t.fHow}</Link>
          <Link href="/info/delivery" style={{ color: "inherit" }}>{t.fDel}</Link>
          <Link href="/info/payment" style={{ color: "inherit" }}>{t.fPay}</Link>
          <Link href="/info/returns" style={{ color: "inherit" }}>{t.fRet}</Link>
          <Link href="/info/inst" style={{ color: "inherit" }}>{t.fInst}</Link>
        </div>
        <div style={col}>
          <span style={head}>{t.fInfo}</span>
          <Link href="/business" style={{ color: "inherit" }}>{t.fCorp}</Link>
          <Link href="/business" style={{ color: "inherit" }}>{t.fPart}</Link>
          <Link href="/finder" style={{ color: "inherit" }}>{t.nFind}</Link>
          <Link href="/guide" style={{ color: "inherit" }}>{t.n7}</Link>
        </div>
      </div>
      <div style={{ borderTop: "1px solid #262B33" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "16px 20px 22px", fontSize: 13 }}>{t.copy}</div>
      </div>
    </footer>
  );
}
