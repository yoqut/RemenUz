"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type CSSProperties, type FormEvent } from "react";
import { useLang, useT } from "@/lib/lang";
import { T } from "@/lib/i18n";
import { CATALOG_ROOT, CATALOG_T, SPHERES_ROOT, catName, childrenOf, type Category } from "@/lib/catalog";
import { goodsRu, useCart } from "@/lib/cart";
import { useFav } from "@/lib/favorites";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

/** "Тип - PJ" / "Профиль - HTD" → "PJ" / "HTD": the prefix repeats on every item and only adds length. */
const shortName = (c: Category, lang: "ru" | "uz") => catName(c, lang).replace(/^(Тип|Профиль|Turi|Profil)\s*-\s*/i, "");

/** One section of the catalog menu: name and product count, then its subcategories as links. */
function MenuSection({ c, onPick }: { c: Category; onPick: () => void }) {
  const { lang } = useLang();
  const kids = childrenOf(c.id);
  return (
    <div style={{ breakInside: "avoid", padding: "10px 0 14px", borderBottom: "1px solid var(--line)" }}>
      <Link href={`/catalog/${c.slug}`} onClick={onPick} className="ind-link" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, fontWeight: 700, fontSize: 14 }}>
        <span>{catName(c, lang)}</span>
        <span className="ind-mono" style={{ flex: "none", fontSize: 11, fontWeight: 500, color: "var(--muted)" }}>{c.count || (lang === "uz" ? "buyurtmaga" : "под заказ")}</span>
      </Link>
      {kids.length > 0 && (
        <span style={{ display: "flex", flexWrap: "wrap", gap: "2px 12px", marginTop: 6, fontSize: 13 }}>
          {kids.map((k) => (
            <Link key={k.id} href={`/catalog/${k.slug}`} onClick={onPick} className="ind-link" style={{ color: "var(--muted)" }}>{shortName(k, lang)}</Link>
          ))}
        </span>
      )}
    </div>
  );
}

const icon: CSSProperties = { position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, minWidth: 52, fontSize: 11, fontWeight: 600, color: "var(--muted)" };
const badge: CSSProperties = { position: "absolute", top: -6, right: 8, minWidth: 18, height: 18, padding: "0 5px", borderRadius: 9, background: "var(--accent)", color: "#FFFFFF", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" };
const navLink: CSSProperties = { flex: "none", display: "flex", alignItems: "center", height: 44, padding: "0 11px", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" };
const util: CSSProperties = { background: "#15181C", color: "#C9CED6", fontSize: 13 };

/**
 * Site header in the industrial style: a dark utility strip (delivery terms, Telegram, phone, language,
 * theme), the main bar (logo, catalog, size-aware search, favourites / account / cart) and a row of
 * belt-type links. The search goes to /search, which accepts codes typed any way ("8PJ1244").
 */
export function Header({ q = "" }: { q?: string }) {
  const { lang, setLang } = useLang();
  const t = useT(T);
  const ct = useT(CATALOG_T);
  const router = useRouter();
  const { count } = useCart();
  const fav = useFav().items.length;
  const [catOpen, setCatOpen] = useState(false);
  const [query, setQuery] = useState(q);
  const closeCat = () => setCatOpen(false);
  const sections = childrenOf(CATALOG_ROOT);
  const quick = sections.filter((c) => c.count > 0).slice(0, 4);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = query.trim();
    if (v) router.push(`/search?q=${encodeURIComponent(v)}`);
  };

  return (
    <>
      <div className="ind-util" style={util}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 20px", height: 34, display: "flex", alignItems: "center", gap: 18 }}>
          <span className="hide-sm" style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.util}</span>
          <a href="https://t.me/Remenuz_bot" style={{ color: "#FFFFFF", fontWeight: 600 }}>Telegram</a>
          <a href="tel:+998787771188" style={{ color: "#FFFFFF", fontWeight: 700 }} className="ind-mono">+998 78 777 11 88</a>
          <div role="group" aria-label={t.langLabel} style={{ display: "flex", gap: 2, marginLeft: "auto" }}>
            {(["ru", "uz"] as const).map((l) => (
              <button key={l} type="button" onClick={() => setLang(l)} aria-pressed={lang === l} style={{ height: 24, padding: "0 8px", border: 0, borderRadius: 4, background: lang === l ? "var(--accent)" : "transparent", color: "#FFFFFF", font: "inherit", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <ThemeToggle style={{ width: 28, height: 28, padding: 0, border: 0, background: "transparent", color: "#FFFFFF" }} />
        </div>
      </div>

      <div className="ind-sticky" style={{ position: "sticky", top: 0, zIndex: 50, background: "var(--surface)", borderBottom: "1px solid var(--line)", fontFamily: "'Inter', system-ui, sans-serif" }}>
        <header className="ind-main" style={{ maxWidth: 1320, margin: "0 auto", padding: "12px 20px", display: "flex", alignItems: "center", gap: 16 }}>
          <Logo height={30} />
          <button type="button" onClick={() => setCatOpen(!catOpen)} aria-expanded={catOpen} aria-controls="catmenu" className="ind-btn ind-primary hide-sm" style={{ height: 44 }}>
            {catOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
            {t.cat}
          </button>
          <form role="search" onSubmit={submit} className="ind-search" style={{ flex: 1, minWidth: 0, display: "flex" }}>
            <label htmlFor="gq" className="sr">{t.search}</label>
            <input id="gq" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.searchPh2} className="ind-input" style={{ flex: 1, height: 44, borderRadius: "8px 0 0 8px", fontSize: 15 }} />
            <button type="submit" aria-label={t.find} className="ind-btn ind-primary" style={{ height: 44, borderRadius: "0 8px 8px 0", padding: "0 18px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
              <span className="hide-sm">{t.find}</span>
            </button>
          </form>
          <nav aria-label={t.acc} className="ind-icons" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Link href="/favorites" aria-label={fav ? `${t.fav}: ${fav}` : t.fav} className="ind-link hide-sm" style={icon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" style={{ color: "var(--fg)" }}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>
              {t.favL}
              {fav > 0 && <span aria-hidden="true" style={badge}>{fav}</span>}
            </Link>
            <Link href="/orders" aria-label={t.login} className="ind-link" style={icon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" style={{ color: "var(--fg)" }}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
              <span className="hide-sm">{t.accL}</span>
            </Link>
            <Link href="/cart" aria-label={lang === "uz" ? `Savat, ${count} ta mahsulot` : `Корзина, ${goodsRu(count)}`} className="ind-link" style={icon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" style={{ color: "var(--fg)" }}><path d="M3 4h2l2.4 11h11l2-8H6.2" /><circle cx="9" cy="19.5" r="1.5" /><circle cx="17" cy="19.5" r="1.5" /></svg>
              <span className="hide-sm">{t.cartL}</span>
              {count > 0 && <span aria-hidden="true" style={badge}>{count}</span>}
            </Link>
          </nav>
        </header>

        <nav aria-label={t.navLabel} className="ind-nav" style={{ maxWidth: 1320, margin: "0 auto", padding: "0 8px", display: "flex", alignItems: "center", borderTop: "1px solid var(--line)", overflowX: "auto", scrollbarWidth: "none" }}>
          <button type="button" onClick={() => setCatOpen(!catOpen)} aria-expanded={catOpen} aria-controls="catmenu" className="only-sm ind-link" style={{ ...navLink, border: 0, background: "transparent", font: "inherit", fontWeight: 700, color: "var(--accent)", cursor: "pointer" }}>
            ☰ {t.cat}
          </button>
          {quick.map((c) => (
            <Link key={c.id} href={`/catalog/${c.slug}`} className="ind-link" style={navLink}>{catName(c, lang)}</Link>
          ))}
          <span aria-hidden="true" style={{ flex: 1 }} />
          <Link href="/finder" className="ind-link" style={navLink}>{t.nFind}</Link>
          <Link href="/guide" className="ind-link" style={navLink}>{t.n7}</Link>
          <Link href="/business" className="ind-link" style={navLink}>{t.n9}</Link>
          <Link href="/promo" style={{ ...navLink, color: "var(--accent)" }}>{t.n8}</Link>
        </nav>

        {catOpen && (
          <div id="catmenu" style={{ borderTop: "1px solid var(--line)", background: "var(--surface)", boxShadow: "0 16px 32px rgba(15,20,30,.12)", maxHeight: "calc(100vh - 140px)", overflowY: "auto" }}>
            <div style={{ maxWidth: 1320, margin: "0 auto", padding: "8px 20px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, padding: "8px 0" }}>
                <span className="ind-mono" style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "var(--muted)" }}>{ct.sections}</span>
                <Link href="/catalog" onClick={closeCat} className="ind-link" style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>{t.allCat}</Link>
              </div>
              <div style={{ columns: "240px", columnGap: 32 }}>
                {sections.map((c) => <MenuSection key={c.id} c={c} onPick={closeCat} />)}
                <div className="ind-mono" style={{ breakInside: "avoid", padding: "16px 0 0", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "var(--muted)" }}>{ct.spheres}</div>
                {childrenOf(SPHERES_ROOT).map((c) => <MenuSection key={c.id} c={c} onPick={closeCat} />)}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
