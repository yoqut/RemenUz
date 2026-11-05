"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type CSSProperties } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageShell } from "@/components/PageShell";
import { Crumbs } from "@/components/Crumbs";
import { ProductTable } from "@/components/ProductTable";
import { FavButton } from "@/components/FavButton";
import { Gallery } from "@/components/Gallery";
import { CATALOG_T, formatPrice } from "@/lib/catalog";
import { T } from "@/lib/i18n";
import { useLang, useT } from "@/lib/lang";
import type { CatalogRow, Product } from "@/lib/products";
import type { MarketOffer } from "@/lib/marketplaces";
import { useCart } from "@/lib/cart";

export type Crumb = { name: string; nameUz: string | null; slug: string };

const PT = {
  ru: {
    sku: "Артикул", profile: "Профиль", inStock: "В наличии", hit: "Хит продаж", isNew: "Новинка",
    toCart: "В корзину", oneClick: "Купить в 1 клик", added: (n: number, total: number, u: string) => `Добавлено: ${n} ${u} · в корзине ${total} ${u}`,
    goCart: "Перейти в корзину →", pcs: "шт", m: "м", qty: "Количество", less: "Меньше", more: "Больше",
    delivery: "Доставка", yandex: "Yandex Go — по Ташкенту", yandexSub: "Бесплатно при заказе от 3 000 000 сум",
    fargo: "Fargo — в регионы", fargoSub: "Доставка уже в цене; от 2 шт. — дешевле",
    pickup: "Самовывоз со склада", pickupSub: "Ташкент, Чинабадская 1",
    pay: "Наличные, карта, перечисление на р/с · рассрочка",
    helpT: "Сомневаетесь в размере?", helpS: "Пришлите фото старого ремня в Telegram — проверим совместимость",
    specs: "Характеристики", desc: "Описание", noSpecs: "Характеристики уточняйте у менеджера.",
    noDesc: "Подробности о применении и совместимости уточните у менеджера — подберём ремень под ваше оборудование.",
    ask: "Задать вопрос по товару", sizes: "Другие размеры этого профиля", allIn: "Весь раздел →", markets: "Купить на маркетплейсе", marketsNote: "оплата и доставка — на площадке", buy: "Купить",
    brand: "Бренд",
    gallery: { prev: "Предыдущее фото", next: "Следующее фото", open: "Открыть фото", close: "Закрыть" },
  },
  uz: {
    sku: "Artikul", profile: "Profil", inStock: "Omborda bor", hit: "Xit", isNew: "Yangi",
    toCart: "Savatga", oneClick: "1 klikda xarid", added: (n: number, total: number, u: string) => `Qoʻshildi: ${n} ${u} · savatda ${total} ${u}`,
    goCart: "Savatga oʻtish →", pcs: "dona", m: "m", qty: "Miqdor", less: "Kamaytirish", more: "Koʻpaytirish",
    delivery: "Yetkazib berish", yandex: "Yandex Go — Toshkent boʻylab", yandexSub: "3 000 000 soʻmdan ortiq buyurtmada bepul",
    fargo: "Fargo — viloyatlarga", fargoSub: "Yetkazish narxga kiritilgan; 2 donadan — arzonroq",
    pickup: "Ombordan olib ketish", pickupSub: "Toshkent, Chinobod koʻchasi 1",
    pay: "Naqd, karta, hisob raqamiga oʻtkazma · boʻlib toʻlash",
    helpT: "Oʻlchamga ishonchingiz komilmi?", helpS: "Eski tasma rasmini Telegramga yuboring — mosligini tekshiramiz",
    specs: "Xususiyatlar", desc: "Tavsif", noSpecs: "Xususiyatlarni menejerdan aniqlang.",
    noDesc: "Qoʻllanilishi va mosligi haqida menejerdan soʻrang — uskunangizga mos tasma tanlab beramiz.",
    ask: "Mahsulot boʻyicha savol berish", sizes: "Shu profilning boshqa oʻlchamlari", allIn: "Butun boʻlim →", markets: "Marketpleysda xarid qilish", marketsNote: "toʻlov va yetkazish — maydonchada", buy: "Sotib olish",
    brand: "Brend",
    gallery: { prev: "Oldingi rasm", next: "Keyingi rasm", open: "Rasmni ochish", close: "Yopish" },
  },
};

/** Uzbek names for the attribute labels remen.uz stores in Russian; "(в мм)" becomes a ", mm" unit. */
const ATTR_UZ: Record<string, string> = {
  "Рабочая температура": "Ish harorati", "Профиль ремня": "Tasma profili", "Страна производитель": "Ishlab chiqaruvchi mamlakat",
  "Страна проиводитель": "Ishlab chiqaruvchi mamlakat", "Ширина большого основания": "Katta asos eni", "Высота ремня": "Tasma balandligi",
  "Внутренняя длина, Li": "Ichki uzunlik, Li", "Внешняя длина, La": "Tashqi uzunlik, La", "Расчётная длина, Lp/Ld/Lw": "Hisobiy uzunlik, Lp/Ld/Lw",
  "Длина ремня": "Tasma uzunligi", "Ширина ремня": "Tasma eni", "Количество зубьев": "Tishlar soni", "Шаг ремня": "Tasma qadami",
  "Номер ремня (~ длина в дюймах)": "Tasma raqami (~ dyuymda uzunlik)", "Толщина ремня": "Tasma qalinligi", "Расстояние между рёбер": "Ariqchalar oraligʻi",
  "Количество рёбер": "Ariqchalar soni", "Диаметр ремня": "Tasma diametri", "Материал ремня": "Tasma materiali", "Длина (м)": "Uzunlik (m)",
  "Тип ремня": "Tasma turi", "Основа ремня": "Tasma asosi", "Толщина покрытия": "Qoplama qalinligi",
};
function attrLabel(k: string, uz: boolean) {
  const mm = /\s*\(в мм\)$/.test(k);
  const base = k.replace(/\s*\(в мм\)$/, "");
  return (uz ? (ATTR_UZ[base] ?? base) : base) + (mm ? (uz ? ", mm" : ", мм") : "");
}

/** remen.uz descriptions are simple HTML paragraphs; show them as plain-text paragraphs. */
const ENTITIES: Record<string, string> = { "&nbsp;": " ", "&quot;": '"', "&amp;": "&", "&laquo;": "«", "&raquo;": "»", "&mdash;": "—", "&ndash;": "–" };
const paragraphs = (html: string) =>
  html
    .split(/<\/p>|<br\s*\/?>/i)
    .map((t) => t.replace(/<[^>]+>/g, "").replace(/&\w+;/g, (e) => ENTITIES[e] ?? " ").trim())
    .filter(Boolean);

const h2: CSSProperties = { margin: "0 0 12px", fontSize: 18, fontWeight: 800 };
const stepBtn: CSSProperties = { width: 40, height: 48, border: 0, background: "transparent", color: "var(--fg)", fontSize: 20, cursor: "pointer" };

/**
 * Product page, industrial style: photo | buy box (article, key sizes, price, quantity, delivery terms),
 * then the full spec table and description, then the other lengths of the same profile as a size table
 * with this belt highlighted, so a near size is one click away.
 */
export function ProductView({ p, self, trail, sizes, markets, images }: { p: Product; self: CatalogRow; trail: Crumb[]; sizes: CatalogRow[]; markets: MarketOffer[]; images: string[] }) {
  const { lang } = useLang();
  const uz = lang === "uz";
  const t = useT(PT);
  const g = useT(T);
  const ct = useT(CATALOG_T);
  const router = useRouter();
  const cart = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState<number | null>(null);
  const line = cart.items.find((x) => x.id === p.id);
  const unit = p.perMeter ? t.m : t.pcs;
  const addToCart = () => {
    cart.add({ id: p.id, slug: p.slug, name: p.name, sku: p.sku, brand: p.brand, price: p.price, perMeter: p.perMeter, img: p.imgSmall ?? p.img }, qty);
    setAdded(qty);
    setQty(1);
  };

  const key = [
    self.profile && { k: t.profile, v: self.profile },
    self.len !== null && { k: self.lenKind === "Lp" ? ct.colLenLp : ct.colLen, v: String(self.len) },
    self.width && { k: p.perMeter ? ct.colDia : ct.colWidth, v: self.width },
    self.teeth && { k: ct.colTeeth, v: self.teeth },
    self.ribs && { k: ct.colRibs, v: self.ribs },
  ].filter((x): x is { k: string; v: string } => !!x);
  const specs = [...p.attrs.map(([k, v]) => ({ k: attrLabel(k, uz), v })), ...(p.brand ? [{ k: t.brand, v: p.brand }] : [])];
  const desc = paragraphs(p.body);
  const leaf = trail[trail.length - 1];
  const name = (c: Crumb) => (uz && c.nameUz ? c.nameUz : c.name);
  const crumbs = [{ name: g.home, href: "/" }, { name: ct.catalog, href: "/catalog" }, ...trail.map((c) => ({ name: name(c), href: `/catalog/${c.slug}` })), { name: p.sku || p.name }];

  return (
    <PageShell>
      <Header />
      <main className="ind-pad" style={{ flex: 1, width: "100%", maxWidth: 1320, margin: "0 auto", padding: "20px 20px 48px", display: "flex", flexDirection: "column", gap: 24 }}>
        <Crumbs items={crumbs} />

        <div className="pp-top" style={{ display: "grid", gridTemplateColumns: "minmax(0, 5fr) minmax(0, 7fr)", gridTemplateAreas: '"photo buy" "mk buy"', gridTemplateRows: "auto 1fr", gap: 24, alignItems: "start" }}>
          <div style={{ gridArea: "photo", minWidth: 0 }}>
            <Gallery
              images={images}
              alt={p.sku || p.name}
              labels={t.gallery}
              overlay={<FavButton p={self} offColor="#15171A" style={{ position: "absolute", top: 12, right: 12, background: "#FFFFFF", borderColor: "#E1E4E8" }} />}
            />
          </div>

          <div className="ind-card pp-buy" style={{ gridArea: "buy", position: "sticky", top: 130, padding: 24, display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
                {p.brand && <span className="ind-tag" style={{ background: "var(--row)", border: "1px solid var(--line)" }}>{p.brand}</span>}
                {p.isHit && <span className="ind-tag" style={{ background: "var(--accent)", color: "#FFFFFF" }}>{t.hit}</span>}
                {p.isNew && <span className="ind-tag" style={{ border: "1px solid var(--accent)", color: "var(--accent)" }}>{t.isNew}</span>}
              </div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, lineHeight: 1.25, letterSpacing: -0.3, overflowWrap: "anywhere" }}>{p.name}</h1>
              <span className="ind-mono" style={{ fontSize: 13, color: "var(--muted)", overflowWrap: "anywhere" }}>{t.sku}: <b style={{ color: "var(--fg)" }}>{p.sku}</b></span>
            </div>

            {key.length > 0 && (
              <dl style={{ margin: 0, display: "grid", gridTemplateColumns: `repeat(${Math.min(key.length, 4)}, minmax(0, 1fr))`, border: "1px solid var(--line)", borderRadius: 8, overflow: "hidden" }} className="pp-key">
                {key.slice(0, 4).map((s, i) => (
                  <div key={s.k} style={{ padding: "10px 12px", borderLeft: i ? "1px solid var(--line)" : 0, minWidth: 0 }}>
                    <dt style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)" }}>{s.k}</dt>
                    <dd className="ind-mono" style={{ margin: 0, fontSize: 18, fontWeight: 700, overflowWrap: "anywhere" }}>{s.v}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "6px 14px" }}>
              {p.price > 0 ? (
                <span className="ind-mono" style={{ fontSize: 34, fontWeight: 700, lineHeight: 1 }}>
                  {formatPrice(p.price)} <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 500, color: "var(--muted)" }}>{p.perMeter ? ct.perM : ct.sum}</span>
                </span>
              ) : (
                <span style={{ fontSize: 22, fontWeight: 800 }}>{ct.onRequest}</span>
              )}
              {p.inStock && <span style={{ fontSize: 14, fontWeight: 600, color: "var(--stock)" }}>● {t.inStock}</span>}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <div role="group" aria-label={t.qty} style={{ display: "flex", alignItems: "center", border: "1px solid var(--line)", borderRadius: 8, background: "var(--surface)" }}>
                <button type="button" aria-label={t.less} onClick={() => setQty(Math.max(1, qty - 1))} style={stepBtn}>−</button>
                <input aria-label={t.qty} inputMode="numeric" value={qty} onChange={(e) => setQty(Math.min(9999, Math.max(1, Number(e.target.value.replace(/\D/g, "")) || 1)))} onFocus={(e) => e.target.select()} className="ind-mono" style={{ width: 52, height: 46, border: 0, background: "transparent", color: "var(--fg)", textAlign: "center", fontSize: 16, fontWeight: 700 }} />
                <button type="button" aria-label={t.more} onClick={() => setQty(Math.min(9999, qty + 1))} style={stepBtn}>+</button>
              </div>
              <button type="button" onClick={addToCart} className="ind-btn ind-primary" style={{ flex: "1 1 180px", height: 48, fontSize: 15 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><path d="M3 4h2l2.4 11h11l2-8H6.2" /><circle cx="9" cy="19.5" r="1.5" /><circle cx="17" cy="19.5" r="1.5" /></svg>
                {t.toCart}
              </button>
              <button type="button" onClick={() => { addToCart(); router.push("/cart"); }} className="ind-btn" style={{ flex: "1 1 160px", height: 48, fontSize: 15 }}>{t.oneClick}</button>
            </div>
            {added !== null && (
              <div role="status" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "10px 14px", borderRadius: 8, border: "1px solid var(--stock)", fontSize: 14 }}>
                <span style={{ fontWeight: 600 }}><span style={{ color: "var(--stock)" }}>✓</span> {t.added(added, line?.qty ?? added, unit)}</span>
                <Link href="/cart" className="ind-link" style={{ fontWeight: 700, color: "var(--accent)" }}>{t.goCart}</Link>
              </div>
            )}

            <div style={{ borderTop: "1px solid var(--line)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
              <span style={{ fontWeight: 700 }}>{t.delivery}</span>
              {[
                { k: t.yandex, v: t.yandexSub },
                { k: t.fargo, v: t.fargoSub },
                { k: t.pickup, v: t.pickupSub },
              ].map((d) => (
                <div key={d.k} style={{ display: "grid", gridTemplateColumns: "18px 1fr", gap: 8 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" aria-hidden="true" style={{ marginTop: 2 }}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                  <span><b style={{ fontWeight: 600 }}>{d.k}</b> <span style={{ color: "var(--muted)" }}>— {d.v}</span></span>
                </div>
              ))}
              <span style={{ color: "var(--muted)" }}>{t.pay}</span>
            </div>

            <a href="https://t.me/Remenuz_bot" className="ind-link" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 8, background: "var(--row)", border: "1px solid var(--line)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" aria-hidden="true" style={{ flex: "none" }}><path d="M21 4L3 11l6 2 2 6 3-4 5 4z" /></svg>
              <span style={{ flex: 1, lineHeight: 1.35 }}>
                <b style={{ display: "block", fontSize: 14 }}>{t.helpT}</b>
                <span style={{ fontSize: 13, color: "var(--muted)" }}>{t.helpS}</span>
              </span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
          {/* Buy on a marketplace: links to the product's own card there (data/marketplaces.json); until that is filled in, to a search for it. */}
        <div className="ind-card pp-mk" style={{ gridArea: "mk", padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>{t.markets}</span>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>{t.marketsNote}</span>
            </div>
            {markets.map((m) => (
              <div key={m.id} className="mk-row" style={{ display: "grid", gridTemplateColumns: "96px minmax(0, 1fr) auto auto", alignItems: "center", gap: 12, padding: "8px 10px", borderRadius: 8, border: "1px solid var(--line)" }}>
                <span style={{ height: 34, padding: "6px 10px", borderRadius: 6, background: "#FFFFFF", border: "1px solid #E1E4E8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.logo} alt="" style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", display: "block" }} />
                </span>
                <span className="mk-name" style={{ fontSize: 14, fontWeight: 600, minWidth: 0 }}>{m.name}</span>
                <span className="ind-mono mk-price" style={{ fontSize: 15, fontWeight: 700, textAlign: "right", whiteSpace: "nowrap", color: m.price ? "var(--fg)" : "var(--muted)" }}>
                  {m.price ? <>{formatPrice(m.price)} <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, color: "var(--muted)" }}>{p.perMeter ? ct.perM : ct.sum}</span></> : "—"}
                </span>
                <a href={m.url} target="_blank" rel="noopener noreferrer" aria-label={`${t.buy}: ${m.name}`} className="ind-btn ind-primary mk-btn" style={{ height: 36, padding: "0 12px", fontSize: 13 }}>
                  {t.buy} ↗
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="pp-info" style={{ display: "grid", gridTemplateColumns: "minmax(0, 7fr) minmax(0, 5fr)", gap: 24, alignItems: "start" }}>
          <section className="ind-card" style={{ padding: 20 }}>
            <h2 style={h2}>{t.specs}</h2>
            {specs.length ? (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <tbody>
                  {specs.map((s, i) => (
                    <tr key={s.k + i} style={{ background: i % 2 ? "transparent" : "var(--row)" }}>
                      <th scope="row" style={{ textAlign: "left", fontWeight: 500, color: "var(--muted)", padding: "8px 10px", width: "55%" }}>{s.k}</th>
                      <td className="ind-mono" style={{ padding: "8px 10px", fontWeight: 600, overflowWrap: "anywhere" }}>{s.v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ margin: 0, color: "var(--muted)" }}>{t.noSpecs}</p>
            )}
          </section>
          <section className="ind-card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            <h2 style={{ ...h2, margin: 0 }}>{t.desc}</h2>
            {(desc.length ? desc : [t.noDesc]).map((d, i) => <p key={i} style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--muted)" }}>{d}</p>)}
            <a href="https://t.me/Remenuz_bot" className="ind-btn" style={{ alignSelf: "start", marginTop: 6 }}>{t.ask} →</a>
          </section>
        </div>

        {sizes.length > 1 && (
          <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
              <h2 style={{ ...h2, margin: 0 }}>{t.sizes}{leaf ? ` · ${name(leaf)}` : ""}</h2>
              {leaf && <Link href={`/catalog/${leaf.slug}`} className="ind-link" style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>{t.allIn}</Link>}
            </div>
            <ProductTable rows={sizes} highlight={p.id} />
          </section>
        )}

      </main>
      <Footer />
    </PageShell>
  );
}
