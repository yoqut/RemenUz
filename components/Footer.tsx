"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useT } from "@/lib/lang";
import { T } from "@/lib/i18n";

const social: CSSProperties = { padding: "6px 12px", borderRadius: 999, fontSize: 13, fontWeight: 600 };

export function Footer() {
  const t = useT(T);
  return (
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 20px 20px" }}>
      <footer className="glass" style={{ borderRadius: 36, fontSize: 15 }}>
        <div style={{ padding: "48px 40px 28px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 36 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo-full.png" alt="Remen.uz — Driven by precision" style={{ height: 62, width: "auto", alignSelf: "start", display: "block" }} />
            <a href="tel:+998787771188" style={{ fontWeight: 700, fontSize: 18 }}>+998 78 777 11 88</a>
            <span style={{ color: "rgb(var(--ink) / .78)" }}>{t.addr1}<br />{t.addr2}</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <a href="https://t.me/remen_uz_store" className="glass-soft" style={social}>Telegram</a>
              <a href="https://wa.me/998935509590" className="glass-soft" style={social}>WhatsApp</a>
              <a href="https://instagram.com/remen_uz_store" className="glass-soft" style={social}>Instagram</a>
              <a href="https://fb.com/remen_uz_store" className="glass-soft" style={social}>Facebook</a>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, color: "rgb(var(--ink) / .78)" }}>
            <span style={{ color: "var(--fg)", fontWeight: 700 }}>{t.fCompany}</span>
            <Link href="/info/about">{t.fAbout}</Link>
            <Link href="/info/contacts">{t.fContacts}</Link>
            <Link href="/info/news">{t.fNews}</Link>
            <Link href="/info/brands">{t.fBrands}</Link>
            <Link href="/info/offer">{t.fOffer}</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ fontWeight: 700 }}>{t.fBuyers}</span>
            <Link href="/info/howto">{t.fHow}</Link>
            <Link href="/info/delivery">{t.fDel}</Link>
            <Link href="/info/payment">{t.fPay}</Link>
            <Link href="/info/returns">{t.fRet}</Link>
            <Link href="/info/inst">{t.fInst}</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ fontWeight: 700 }}>{t.fInfo}</span>
            <Link href="/business">{t.fCorp}</Link>
            <Link href="/business">{t.fPart}</Link>
          </div>
        </div>
        <div style={{ padding: "18px 40px 26px", borderTop: "1px solid rgb(var(--ink) / .14)", fontSize: 13, color: "rgb(var(--ink) / .7)" }}>{t.copy}</div>
      </footer>
    </div>
  );
}
