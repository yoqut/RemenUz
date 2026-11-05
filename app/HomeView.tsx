"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageShell } from "@/components/PageShell";
import { useLang, useT, type Lang } from "@/lib/lang";
import { CATALOG_ROOT, catName, childrenOf, getCategory, type Category } from "@/lib/catalog";
import { ACCENT, L, T, withLogos } from "@/lib/i18n";
import type { ProductCard } from "@/lib/products";
import { Photo } from "@/components/Photo";
import { ProductTile } from "@/components/ProductTile";
import { PromoSlider, type Slide } from "./PromoSlider";

const MONO = "'JetBrains Mono', monospace";
const DISPLAY = "'Oswald', sans-serif";

const section: CSSProperties = { maxWidth: 1320, margin: "0 auto", padding: "0 20px 96px" };
const h2: CSSProperties = { margin: 0, display: "flex", alignItems: "center", gap: 14, fontFamily: DISPLAY, fontSize: 42, fontWeight: 700, lineHeight: 1.1 };
const teaser: CSSProperties = { position: "relative", overflow: "hidden", minHeight: 240, padding: 34, borderRadius: 36, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 22, transition: "transform .2s" };

/** Brand banner carried over from remen.uz: image, filtered catalog link and how many products it leads to. */
export type Banner = { key: "megadyne" | "pix" | "rezina"; img: string; href: string; count: number };

const BANNER_T = {
  ru: {
    megadyne: { title: "Зубчатые ремни MEGADYNE", sub: "MEGASYNC Silver, Gold, Titanium · Италия" },
    pix: { title: "Поликлиновые ремни PIX", sub: "Профили PH · PJ · PK · PL · PM" },
    rezina: { title: "Плоские ремни Belting Rezina", sub: "Плоские приводные ремни под ваш размер" },
    count: (n: number) => (n ? `${n} позиций →` : "Под заказ →"),
    featEyebrow: "HTD · STD · RPP · T · AT · XL · L · H",
    featText: "Гибкий ремень с зубьями на внутренней стороне: они входят в пазы зубчатых шкивов и передают движение без проскальзывания.",
    featBtn: "Подробнее",
    slider: "Акции", prev: "Назад", next: "Вперёд",
    fargo: { eyebrow: "Fargo — в регионы", title: "2 ремня и больше — дешевле", sub: "Доставка Fargo уже в цене: каждый следующий ремень в заказе обходится дешевле." },
  },
  uz: {
    megadyne: { title: "MEGADYNE tishli tasmalari", sub: "MEGASYNC Silver, Gold, Titanium · Italiya" },
    pix: { title: "PIX V-tip chiziqli kamarlari", sub: "Profillar PH · PJ · PK · PL · PM" },
    rezina: { title: "Belting Rezina yassi tasmalari", sub: "Oʻlchamingizga mos yassi uzatma tasmalari" },
    count: (n: number) => (n ? `${n} ta mahsulot →` : "Buyurtma asosida →"),
    featEyebrow: "HTD · STD · RPP · T · AT · XL · L · H",
    featText: "Ichki tomonida tishlari bor egiluvchan tasma: tishlar shkiv ariqchalariga kirib, harakatni sirpanishsiz uzatadi.",
    featBtn: "Batafsil",
    slider: "Aksiyalar", prev: "Oldingi", next: "Keyingi",
    fargo: { eyebrow: "Fargo — viloyatlarga", title: "2 ta va undan koʻp — arzonroq", sub: "Fargo yetkazishi narxga kiritilgan: buyurtmadagi har keyingi tasma arzonroq tushadi." },
  },
};

/** Section heading with the accent bar every home section shares. */
function H2({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <h2 className="h2" style={{ ...h2, ...style }}>
      <span aria-hidden="true" style={{ flex: "none", width: 6, height: "0.9em", borderRadius: 3, background: ACCENT }} />
      {children}
    </h2>
  );
}

/** Line icons for the trust capsules. */
function TrustIcon({ k }: { k: string }) {
  const paths: Record<string, ReactNode> = {
    doc: <><path d="M6 2h9l5 5v15H6z" /><path d="M14 2v6h6M9 13h8M9 17h6" /></>,
    truck: <><path d="M2 6h12v10H2zM14 9h4l4 4v3h-8z" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
    chat: <><path d="M4 5h16v11H9l-5 4z" /><path d="M8 10h8M8 13h5" /></>,
    box: <><path d="M3 7l9-4 9 4v10l-9 4-9-4z" /><path d="M3 7l9 4 9-4M12 11v10" /></>,
  };
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">{paths[k]}</svg>;
}

/** Profile icons for catalog sections that have no products (and so no photo) yet. */
function CatIcon({ id }: { id: number }) {
  const icons: Record<number, ReactNode> = {
    // conveyor belt over two rollers with load on it
    32: <><rect x="4" y="22" width="40" height="10" rx="5" /><circle cx="9" cy="27" r="3" /><circle cx="39" cy="27" r="3" /><rect x="12" y="12" width="9" height="10" rx="1.5" /><rect x="26" y="14" width="8" height="8" rx="1.5" /></>,
    // flat belt wrapped round two pulleys
    37: <><circle cx="12" cy="24" r="8" /><circle cx="37" cy="24" r="5" /><path d="M12 16 L37 19 M12 32 L37 29" /></>,
    // modular plastic belt: hinged links
    34: <><rect x="5" y="14" width="10" height="20" rx="2" /><rect x="19" y="14" width="10" height="20" rx="2" /><rect x="33" y="14" width="10" height="20" rx="2" /><path d="M15 20h4M15 28h4M29 20h4M29 28h4" /></>,
    // roller with a lagging layer
    35: <><rect x="6" y="14" width="36" height="20" rx="10" /><rect x="11" y="18" width="26" height="12" rx="6" /><path d="M2 24h4M42 24h4" /></>,
    // mechanical lacing joining two belt ends
    36: <><path d="M4 16h16v16H4M44 16H28v16h16" /><path d="M20 19h8M20 24h8M20 29h8" /><circle cx="24" cy="19" r="1.5" /><circle cx="24" cy="24" r="1.5" /><circle cx="24" cy="29" r="1.5" /></>,
  };
  return (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
      {icons[id] ?? <><circle cx="14" cy="24" r="9" /><circle cx="36" cy="24" r="6" /><path d="M14 15 L36 18 M14 33 L36 30" /></>}
    </svg>
  );
}

/** Card subtitle: the first few subcategories, or nothing for a leaf section. */
function catNote(c: Category, lang: Lang) {
  // "Тип - PJ" / "Профиль - HTD" → "PJ" / "HTD": the prefix repeats on every item and only adds length.
  return childrenOf(c.id)
    .map((k) => catName(k, lang).replace(/^(Тип|Профиль|Turi|Profil)\s*-\s*/i, ""))
    .join(" · ");
}

const SHELF_T = {
  ru: { promo: "Акции", best: "Хиты продаж", fresh: "Новинки", popular: "Популярное", all: "Все →" },
  uz: { promo: "Aksiyalar", best: "Eng koʻp sotilgan", fresh: "Yangi mahsulotlar", popular: "Ommabop", all: "Hammasi →" },
};

/** Product shelf: heading with a "see all" link, then one row of cards. */
function Shelf({ title, href, all, children }: { title: string; href: string; all: string; children: ReactNode }) {
  return (
    <section className="sec" style={{ ...section, paddingBottom: 64 }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "end", gap: 12, marginBottom: 24 }}>
        <H2>{title}</H2>
        <Link href={href} className="glass-soft" style={{ padding: "10px 18px", borderRadius: 999, fontWeight: 700 }}>{all}</Link>
      </div>
      <div className="shelf-row" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 270px), 1fr))", gap: 18 }}>{children}</div>
    </section>
  );
}

export type Shelves = { promo: ProductCard[]; best: ProductCard[]; fresh: ProductCard[]; popular: ProductCard[] };

export function HomeView({ shelves, catImgs, banners }: { shelves: Shelves; catImgs: Record<number, string>; banners: Banner[] }) {
  const { lang } = useLang();
  const t = useT(T);
  const d = useT(L);
  const bt = BANNER_T[lang] ?? BANNER_T.ru;
  const sh = SHELF_T[lang] ?? SHELF_T.ru;
  const toothed = getCategory(16);
  const markets = withLogos(d.markets);
  const brandBg: Record<Banner["key"], string> = { megadyne: "#1B2340", pix: "#0E5A52", rezina: "#2A2F3A" };
  const slides: Slide[] = [
    { key: "delivery", eyebrow: t.delivery, title: t.delTitle, sub: t.delText, img: "/img/banners/belt-pulley.webp", href: "/info/delivery", bg: ACCENT },
    { key: "fargo", ...bt.fargo, img: "/img/fargo.png", href: "/promo", bg: "#7A2E0E" },
    ...banners.map((b) => ({ key: b.key, eyebrow: bt.count(b.count).replace(" →", ""), title: bt[b.key].title, sub: bt[b.key].sub, img: b.img, href: b.href, bg: brandBg[b.key] })),
    ...(toothed ? [{ key: "toothed", eyebrow: bt.featEyebrow, title: catName(toothed, lang), sub: bt.featText, img: "/img/banners/timing-belts.webp", href: `/catalog/${toothed.slug}`, bg: "#3B1F5E" }] : []),
  ];

  return (
    <PageShell>
      <Header />
      <h1 className="sr-only">{t.h1}</h1>

      <PromoSlider slides={slides} label={bt.slider} cta={bt.featBtn} prev={bt.prev} next={bt.next} />

      {/* Shelves: promo, best sellers, new, popular. Each product appears on one shelf only. */}
      <Shelf title={sh.promo} href="/promo" all={sh.all}>
        {shelves.promo.map((o) => (
          // Hits keep their own "Хит" badge; only the hand-picked offers are labelled as a special price.
          <ProductTile key={o.id} p={o} tag={o.isHit ? undefined : t.special} />
        ))}
          <div className="liquid deliv-tile" style={{ position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 24, padding: 30, borderRadius: 28, backgroundColor: ACCENT, color: "#FFFFFF" }}>
            <span className="drop" aria-hidden="true" style={{ position: "absolute", right: -40, bottom: -40, width: 200, height: 200 }} />
            <span style={{ position: "relative", fontFamily: MONO, fontSize: 13, letterSpacing: 1 }}>{t.delivery}</span>
            <div style={{ position: "relative" }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 36, fontWeight: 700, lineHeight: 1.08 }}>{t.delTitle}</div>
              <p style={{ margin: "12px 0 0", fontSize: 16 }}>{t.delText}</p>
              <p style={{ margin: "8px 0 0", fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ flex: "none", height: 28, padding: "4px 10px", borderRadius: 999, background: "#FFFFFF", display: "flex", alignItems: "center" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/img/fargo.png" alt="Fargo" style={{ height: "100%", display: "block" }} />
                </span>
                {t.delFargo}
              </p>
            </div>
            <Link href="/info/delivery" style={{ position: "relative", alignSelf: "start", height: 50, padding: "0 22px", display: "flex", alignItems: "center", fontWeight: 700, borderRadius: 999, background: "rgba(255,255,255,.22)", border: "1px solid rgba(255,255,255,.45)", color: "#FFFFFF" }}>{t.delBtn}</Link>
          </div>
      </Shelf>

      <Shelf title={sh.best} href="/promo" all={sh.all}>
        {shelves.best.map((p) => <ProductTile key={p.id} p={p} />)}
      </Shelf>

      <Shelf title={sh.fresh} href="/catalog" all={sh.all}>
        {shelves.fresh.map((p) => <ProductTile key={p.id} p={p} />)}
      </Shelf>

      <Shelf title={sh.popular} href="/catalog" all={sh.all}>
        {shelves.popular.map((p) => <ProductTile key={p.id} p={p} />)}
      </Shelf>

      {/* Categories */}
      <section className="sec" style={section}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "end", gap: 12, marginBottom: 28 }}>
          <H2>{t.cat}</H2>
          <Link href="/catalog" className="glass-soft" style={{ padding: "10px 18px", borderRadius: 999, fontWeight: 700 }}>{t.allCat}</Link>
        </div>
        {/* Photo (or profile icon) tile, name and subcategories; the product count sits in the corner. */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 290px), 1fr))", gap: 12 }}>
          {childrenOf(CATALOG_ROOT).map((c) => (
            <Link key={c.id} href={`/catalog/${c.slug}`} className="glass lift" style={{ position: "relative", display: "flex", alignItems: "center", gap: 14, padding: "14px 18px 14px 14px", borderRadius: 24, transition: "transform .2s", minWidth: 0 }}>
              <span aria-hidden="true" style={{ flex: "none", width: 68, height: 68, borderRadius: 18, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: catImgs[c.id] ? "#FFFFFF" : "rgb(var(--ink) / .08)", border: "1px solid rgb(var(--ink) / .12)", color: "var(--promo)" }}>
                {catImgs[c.id] ? (
                  <Photo src={catImgs[c.id]} />
                ) : (
                  <CatIcon id={c.id} />
                )}
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0, paddingRight: 40 }}>
                <span style={{ fontFamily: DISPLAY, fontSize: 17, fontWeight: 600, lineHeight: 1.2 }}>{catName(c, lang)}</span>
                {catNote(c, lang) && <span style={{ fontSize: 13, lineHeight: 1.35, color: "rgb(var(--ink) / .72)" }}>{catNote(c, lang)}</span>}
              </span>
              <span style={{ position: "absolute", top: 10, right: 10, padding: "3px 9px", borderRadius: 999, fontFamily: MONO, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", ...(c.count ? { backgroundColor: ACCENT, color: "#FFFFFF" } : { border: "1px solid rgb(var(--ink) / .25)", color: "rgb(var(--ink) / .7)" }) }}>
                {c.count ? (lang === "uz" ? `${c.count} ta` : `${c.count} шт`) : lang === "uz" ? "buyurtmaga" : "под заказ"}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust capsules: concrete B2B terms, each backed by the delivery / payment pages. */}
      <div className="sec" style={{ maxWidth: 1320, margin: "0 auto", padding: "0 20px 80px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
        {d.trust.map((tr) => (
          <div key={tr.title} className="glass-soft" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px 14px 14px", borderRadius: 24 }}>
            <span style={{ flex: "none", width: 46, height: 46, borderRadius: 14, background: ACCENT, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}><TrustIcon k={tr.icon} /></span>
            <div style={{ lineHeight: 1.3 }}>
              <div style={{ fontWeight: 800 }}>{tr.title}</div>
              <div style={{ fontSize: 13, color: "rgb(var(--ink) / .72)" }}>{tr.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Marketplaces strip: a logo only links once the shop URL is known. */}
      <section className="sec" style={{ maxWidth: 1320, margin: "0 auto", padding: "0 20px 56px" }}>
        <div className="glass" style={{ borderRadius: 34, padding: "22px 26px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "18px 28px" }}>
          <div style={{ flex: "1 1 240px" }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 700 }}>{t.mkShort}</div>
            <div style={{ fontSize: 14, color: "rgb(var(--ink) / .75)" }}>{t.mkShortD}</div>
          </div>
          <div style={{ flex: "999 1 min(100%, 600px)", display: "flex", flexWrap: "wrap", gap: 10 }}>
            {markets.map((m) => {
              const style: CSSProperties = { height: 52, minWidth: 120, padding: "10px 16px", borderRadius: 999, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform .2s" };
              const body = (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.logo} alt="" style={{ maxHeight: "100%", maxWidth: 140, objectFit: "contain", display: "block" }} />
                  {m.logoText && <span style={{ marginLeft: 8, color: "#15171A", fontWeight: 800, fontSize: 13, whiteSpace: "nowrap" }}>{m.logoText}</span>}
                </>
              );
              return m.href && m.href !== "#" ? (
                <a key={m.mark} href={m.href} target="_blank" rel="noopener" aria-label={m.name} className="lift" style={style}>{body}</a>
              ) : (
                <span key={m.mark} role="img" aria-label={m.name} style={style}>{body}</span>
              );
            })}
          </div>
        </div>
      </section>

      {/* Teasers to other pages */}
      <section className="sec" style={{ ...section, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))", gap: 18 }}>
        <Link href="/guide" className="glass lift" style={teaser}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/banners/belt-pulley.webp" alt="" loading="lazy" width={610} height={540} style={{ width: "100%", height: 200, objectFit: "cover", objectPosition: "center 40%", borderRadius: 22, display: "block" }} />
          <span style={{ position: "relative", fontFamily: MONO, fontSize: 12, letterSpacing: 1, color: "rgb(var(--ink) / .72)" }}>{t.teaGuideE}</span>
          <div style={{ position: "relative" }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 32, fontWeight: 700, lineHeight: 1.1 }}>{t.teaGuideT}</div>
            <div style={{ marginTop: 8, color: "rgb(var(--ink) / .78)" }}>{t.teaGuideD}</div>
          </div>
          <span className="liquid" style={{ position: "relative", alignSelf: "start", height: 48, padding: "0 22px", display: "flex", alignItems: "center", borderRadius: 999, backgroundColor: ACCENT, color: "#FFFFFF", fontWeight: 700 }}>{t.teaGuideB} →</span>
        </Link>
        <Link href="/business" className="glass lift" style={teaser}>
          <svg width="140" height="74" viewBox="0 0 120 64" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ position: "absolute", right: 26, top: 26, opacity: 0.55 }}>
            <rect x="4" y="22" width="112" height="20" rx="10" /><circle cx="14" cy="32" r="8" /><circle cx="106" cy="32" r="8" />
            <rect x="30" y="8" width="18" height="14" rx="3" /><rect x="56" y="8" width="18" height="14" rx="3" /><rect x="82" y="8" width="18" height="14" rx="3" />
          </svg>
          <span style={{ position: "relative", fontFamily: MONO, fontSize: 12, letterSpacing: 1, color: "rgb(var(--ink) / .72)" }}>{t.teaBizE}</span>
          <div style={{ position: "relative" }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 32, fontWeight: 700, lineHeight: 1.1 }}>{t.teaBizT}</div>
            <div style={{ marginTop: 8, color: "rgb(var(--ink) / .78)" }}>{t.teaBizD}</div>
          </div>
          <span className="glass-soft" style={{ position: "relative", alignSelf: "start", height: 48, padding: "0 22px", display: "flex", alignItems: "center", borderRadius: 999, fontWeight: 700 }}>{t.teaBizB} →</span>
        </Link>
      </section>

      <Footer />
    </PageShell>
  );
}
