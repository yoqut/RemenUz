"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useState, type CSSProperties } from "react";
import { ACCENT } from "@/lib/i18n";
import { formatPrice } from "@/lib/catalog";
import { fullImg } from "@/lib/images";
import type { Product, ProductCard } from "@/lib/products";
import { goodsRu, useCart } from "@/lib/cart";
import { useRouter } from "next/navigation";

type DeliveryId = "yandex" | "fargo";

export type Crumb = { name: string; slug: string };

const markets: { mark: string; name: string; note: string; href: string; logo?: string; logoText?: string }[] = [
  { mark: "U", name: "Uzum Market", note: "Доставка в пункт выдачи Uzum", href: "#", logo: "/img/uzum.png" },
  { mark: "O", name: "Ozon", note: "Доставка в пункт выдачи Ozon", href: "#", logo: "/img/ozon.png" },
  { mark: "ЯМ", name: "Яндекс Маркет", note: "Доставка Яндекс Маркета", href: "#", logo: "/img/yandex-market.png", logoText: "Маркет" },
  { mark: "WB", name: "Wildberries", note: "Доставка в пункт выдачи WB", href: "#", logo: "/img/wildberries.png" },
  { mark: "OP", name: "optom.uz", note: "Оптовые заказы", href: "#", logo: "/img/optom.png" },
];

const deliveries: { id: DeliveryId; title: string; sub: string; logo?: string }[] = [
  { id: "yandex", title: "Yandex Go", sub: "По Ташкенту, бесплатно от 3 000 000 сум" },
  { id: "fargo", title: "Регионы —", sub: "Курьерская доставка по Узбекистану", logo: "/img/fargo.png" },
];

/** Three headline specs for the stat tiles, by preference; "(в мм)" moves into the value. */
const STAT_KEYS = ["Профиль ремня", "Длина ремня (в мм)", "Ширина ремня (в мм)", "Шаг ремня (в мм)", "Диаметр ремня", "Количество ручьев", "Количество зубьев"];
function stats(attrs: [string, string][]) {
  const picked = STAT_KEYS.map((k) => attrs.find(([n]) => n === k)).filter((a): a is [string, string] => !!a);
  for (const a of attrs) if (picked.length < 3 && !picked.includes(a)) picked.push(a);
  return picked.slice(0, 3).map(([k, v]) => {
    const mm = /\(в мм\)/.test(k);
    return { k: k.replace(/\s*\(в мм\)/, "").replace(/ ремня$/, ""), v: mm ? `${v} мм` : v };
  });
}

/** remen.uz descriptions are simple HTML paragraphs; show them as plain-text paragraphs. */
const ENTITIES: Record<string, string> = { "&nbsp;": " ", "&quot;": '"', "&amp;": "&", "&laquo;": "«", "&raquo;": "»", "&mdash;": "—", "&ndash;": "–" };
const paragraphs = (html: string) =>
  html
    .split(/<\/p>|<br\s*\/?>/i)
    .map((t) => t.replace(/<[^>]+>/g, "").replace(/&\w+;/g, (e) => ENTITIES[e] ?? " ").trim())
    .filter(Boolean);

const mono = "'JetBrains Mono', monospace";
const unb = "'Oswald', sans-serif";
const crumb: CSSProperties = { color: "rgb(var(--ink) / .75)" };
const statLabel: CSSProperties = { fontSize: 12, color: "rgb(var(--ink) / .72)" };
const statVal: CSSProperties = { fontFamily: mono, fontSize: 22, fontWeight: 600 };
const qtyBtn: CSSProperties = { width: 48, height: 48, border: 0, borderRadius: "50%", background: "transparent", color: "var(--fg)", fontSize: 22, cursor: "pointer" };

export function ProductView({ p, trail, related, relatedTitle }: { p: Product; trail: Crumb[]; related: ProductCard[]; relatedTitle: string }) {
  const accent = ACCENT;
  const [qty, setQty] = useState(1);
  const [dl, setDl] = useState<DeliveryId>("yandex");
  const [added, setAdded] = useState<number | null>(null);
  const router = useRouter();
  const cart = useCart();
  const inCart = cart.items.find((x) => x.id === p.id);
  const unit = p.perMeter ? "м" : "шт";
  const addToCart = () => {
    cart.add({ id: p.id, slug: p.slug, name: p.name, sku: p.sku, brand: p.brand, price: p.price, perMeter: p.perMeter, img: p.imgSmall ?? p.img }, qty);
    setAdded(qty);
    setQty(1);
  };

  const specs = [...p.attrs.map(([k, v]) => ({ k, v })), ...(p.brand ? [{ k: "Бренд", v: p.brand }] : [])];
  const tiles = stats(p.attrs);
  const desc = paragraphs(p.body);
  const img = fullImg(p.img);

  return (
    <div className="gp" style={{ position: "relative", overflow: "clip", fontFamily: "'Manrope', system-ui, sans-serif", color: "var(--fg)", background: "var(--bg)", fontSize: 16, lineHeight: 1.55, minHeight: "100vh" }}>
      <div className="blob" style={{ top: -120, left: -160, width: 640, height: 640, background: accent, color: "#FFFFFF", opacity: 0.5 }} />
      <div className="blob" style={{ top: 200, right: -180, width: 600, height: 600, background: "#2F6BFF", opacity: 0.45 }} />
      <div className="blob" style={{ top: 1300, left: "35%", width: 560, height: 560, background: "#12B5A6", opacity: 0.3 }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div className="sticky-head" style={{ position: "sticky", top: 0, zIndex: 50, maxWidth: 1320, margin: "0 auto", padding: "12px 20px 0" }}>
          <header className="glass pill-head" style={{ borderRadius: 999, padding: "10px 12px 10px 18px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 18px" }}>
            <Logo height={32} />
            <Link href="/catalog" className="liquid" style={{ height: 44, padding: "0 20px", display: "flex", alignItems: "center", backgroundColor: accent, color: "#FFFFFF", fontWeight: 700, borderRadius: 999 }}>Каталог</Link>
            <form className="glass-soft pill-search" role="search" onSubmit={(e) => e.preventDefault()} style={{ flex: "1 1 320px", display: "flex", alignItems: "center", height: 44, borderRadius: 999, padding: "0 16px" }}>
              <label htmlFor="gpq" className="sr">Поиск</label>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeOpacity=".75" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
              <input id="gpq" type="search" placeholder="Артикул или размер" style={{ flex: 1, minWidth: 0, border: 0, background: "transparent", color: "var(--fg)", padding: "0 12px", font: "inherit", fontSize: 15, outline: "none" }} />
            </form>
            <a href="tel:+998787771188" className="hide-sm" style={{ fontWeight: 700 }}>+998 78 777 11 88</a>
            <Link href="/cart" aria-label={`Корзина, ${goodsRu(cart.count)}`} className="glass-soft" style={{ position: "relative", width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3 4h2l2.4 11h11l2-8H6.2" /><circle cx="9" cy="19.5" r="1.5" /><circle cx="17" cy="19.5" r="1.5" /></svg>
              {cart.count > 0 && (
                <span aria-hidden="true" style={{ position: "absolute", top: -4, right: -4, minWidth: 20, height: 20, padding: "0 5px", borderRadius: 10, background: accent, color: "#FFFFFF", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{cart.count}</span>
              )}
            </Link>
          </header>
        </div>

        <main className="sec" style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 40px 96px" }}>
          <nav aria-label="Навигация" className="glass-soft" style={{ display: "inline-flex", flexWrap: "wrap", gap: 8, padding: "8px 16px", borderRadius: 999, fontSize: 14, color: "rgb(var(--ink) / .75)" }}>
            <Link href="/" style={crumb}>Главная</Link><span aria-hidden="true">›</span>
            <Link href="/catalog" style={crumb}>Каталог</Link><span aria-hidden="true">›</span>
            {trail.map((c) => (
              <span key={c.slug} style={{ display: "contents" }}>
                <Link href={`/catalog/${c.slug}`} style={crumb}>{c.name}</Link><span aria-hidden="true">›</span>
              </span>
            ))}
            <span aria-current="page" style={{ color: "var(--fg)", fontWeight: 600, overflowWrap: "anywhere" }}>{p.sku || p.name}</span>
          </nav>

          <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 520px), 1fr))", gap: 32, alignItems: "start" }}>
            {/* Photo in the glass lens */}
            <div className="glass" style={{ position: "relative", aspectRatio: "1 / 1", borderRadius: 40, padding: 18, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 26, background: "#FFFFFF", display: "block" }} />
              ) : (
                <div className="drop" style={{ width: "74%", aspectRatio: "1" }} />
              )}
            </div>

            {/* Buy panel */}
            <div className="glass gp-panel" style={{ borderRadius: 40, padding: 34, display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, fontSize: 13, fontWeight: 700 }}>
                  {p.isHit && <span className="glass-soft" style={{ padding: "5px 12px", borderRadius: 999 }}>Хит продаж</span>}
                  {p.isNew && <span className="glass-soft" style={{ padding: "5px 12px", borderRadius: 999 }}>Новинка</span>}
                  {p.inStock ? (
                    <span style={{ padding: "5px 12px", borderRadius: 999, background: "rgba(18,181,166,.25)", border: "1px solid rgba(18,181,166,.6)" }}>● В наличии</span>
                  ) : (
                    <span style={{ padding: "5px 12px", borderRadius: 999, background: "rgb(var(--ink) / .08)", border: "1px solid rgb(var(--ink) / .3)" }}>Под заказ</span>
                  )}
                </div>
                <h1 className="gp-h1" style={{ margin: 0, fontFamily: unb, fontSize: 34, fontWeight: 600, lineHeight: 1.15, letterSpacing: -0.5, overflowWrap: "anywhere" }}>{p.name}</h1>
                <span style={{ fontFamily: mono, fontSize: 13, color: "rgb(var(--ink) / .72)", overflowWrap: "anywhere" }}>Артикул: {p.sku}{p.brand ? ` · Бренд: ${p.brand}` : ""}</span>
              </div>

              {tiles.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${tiles.length}, minmax(0, 1fr))`, gap: 10 }}>
                  {tiles.map((s) => (
                    <div key={s.k} className="glass-soft" style={{ padding: "14px 16px", borderRadius: 22, minWidth: 0 }}>
                      <div style={statLabel}>{s.k}</div>
                      <div className="gp-spec" style={{ ...statVal, overflowWrap: "anywhere" }}>{s.v}</div>
                    </div>
                  ))}
                </div>
              )}

              {p.price > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontFamily: mono, fontSize: 42, fontWeight: 600, lineHeight: 1 }}>{formatPrice(p.price)}</span>
                  <span style={{ fontSize: 18, color: "rgb(var(--ink) / .75)" }}>{p.perMeter ? "сум / м" : "сум"}</span>
                  {p.oldPrice && <span style={{ fontFamily: mono, fontSize: 18, color: "rgb(var(--ink) / .55)", textDecoration: "line-through" }}>{formatPrice(p.oldPrice)}</span>}
                </div>
              ) : (
                <div style={{ fontFamily: unb, fontSize: 26, fontWeight: 600 }}>Цена по запросу</div>
              )}

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                <div className="glass-soft" style={{ display: "flex", alignItems: "center", height: 56, borderRadius: 999, padding: "0 4px" }}>
                  <button type="button" aria-label="Меньше" onClick={() => setQty(Math.max(1, qty - 1))} style={qtyBtn}>−</button>
                  <span style={{ minWidth: 34, textAlign: "center", fontFamily: mono, fontSize: 17, fontWeight: 600 }}>{qty}</span>
                  <button type="button" aria-label="Больше" onClick={() => setQty(qty + 1)} style={qtyBtn}>+</button>
                </div>
                <button type="button" onClick={addToCart} className="liquid" style={{ flex: "1 1 200px", height: 56, border: 0, borderRadius: 999, backgroundColor: accent, color: "#FFFFFF", font: "inherit", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>В корзину</button>
                <button type="button" onClick={() => { addToCart(); router.push("/cart"); }} className="glass" style={{ flex: "1 1 170px", height: 56, borderRadius: 999, color: "var(--fg)", font: "inherit", fontWeight: 700, cursor: "pointer" }}>Купить в 1 клик</button>
              </div>
              {added !== null && (
                <div role="status" className="glass-soft" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "12px 12px 12px 18px", borderRadius: 22, border: "1px solid rgba(124,242,201,.5)" }}>
                  <span style={{ fontWeight: 700 }}>
                    <span style={{ color: "var(--ok)" }}>✓</span> Добавлено: {added} {unit} · в корзине {inCart?.qty ?? added} {unit}
                  </span>
                  <Link href="/cart" className="liquid liq-n" style={{ height: 40, padding: "0 18px", display: "flex", alignItems: "center", borderRadius: 999, backgroundColor: "rgb(var(--ink) / .2)", fontSize: 14, fontWeight: 700 }}>Перейти в корзину →</Link>
                </div>
              )}

              {/* Delivery method */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>Способ доставки</span>
                <div role="radiogroup" aria-label="Способ доставки" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: 8 }}>
                  {deliveries.map((d) => {
                    const on = dl === d.id;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => setDl(d.id)}
                        className={on ? "liquid liq-n" : ""}
                        style={{
                          display: "flex", flexDirection: "column", alignItems: "stretch", padding: "12px 16px", borderRadius: 20, color: "var(--fg)", font: "inherit", cursor: "pointer", textAlign: "left",
                          ...(on ? { border: "1px solid rgb(var(--ink) / .6)", backgroundColor: "rgb(var(--ink) / .2)" } : { border: "1px solid rgb(var(--ink) / .18)", backgroundColor: "rgb(var(--ink) / .05)" }),
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, width: "100%" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontWeight: 800, fontSize: 15 }}>{d.title}</span>
                            {d.logo && (
                              <span style={{ height: 24, padding: "4px 8px", boxSizing: "border-box", borderRadius: 999, background: "#FFFFFF", display: "flex", alignItems: "center" }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={d.logo} alt="Fargo" style={{ height: "100%", display: "block" }} />
                              </span>
                            )}
                          </span>
                          <span
                            aria-hidden="true"
                            style={{ flex: "none", width: 16, height: 16, borderRadius: "50%", boxSizing: "border-box", ...(on ? { border: "5px solid #FFFFFF", background: accent, color: "#FFFFFF" } : { border: "2px solid rgb(var(--ink) / .6)" }) }}
                          />
                        </span>
                        <span style={{ display: "block", fontSize: 12, color: "rgb(var(--ink) / .75)", textAlign: "left", marginTop: 2 }}>{d.sub}</span>
                      </button>
                    );
                  })}
                </div>
                {dl === "fargo" && (
                  <div className="glass-soft" style={{ display: "flex", flexDirection: "column", gap: 4, padding: "12px 16px", borderRadius: 18, fontSize: 13, color: "rgb(var(--ink) / .85)" }}>
                    <span>Отправим заказ курьерской службой Fargo в ваш город. Доставка уже включена в цену, от 2 шт. — дешевле.</span>
                    <span>Трек-номер пришлём в Telegram или SMS.</span>
                  </div>
                )}
              </div>

              {/* Buy on marketplaces */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>Купить на маркетплейсе</span>
                  <span style={{ fontSize: 12, color: "rgb(var(--ink) / .7)" }}>цена и доставка — на площадке</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {markets.map((m) => (
                    <a key={m.name} href={m.href} target="_blank" rel="noopener" className="glass-soft gp-market" style={{ display: "flex", alignItems: "center", gap: 14, padding: 10, borderRadius: 999 }}>
                      <span style={{ flex: "none", width: 96, height: 40, padding: "6px 10px", boxSizing: "border-box", borderRadius: 999, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={m.logo} alt="" style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", display: "block" }} />
                        {m.logoText && <span style={{ marginLeft: 6, color: "#15171A", fontWeight: 800, fontSize: 11, lineHeight: 1.05 }}>{m.logoText}</span>}
                      </span>
                      <span style={{ flex: 1, minWidth: 0, lineHeight: 1.25 }}>
                        <span style={{ display: "block", fontWeight: 700 }}>{m.name}</span>
                        <span style={{ display: "block", fontSize: 12, color: "rgb(var(--ink) / .72)" }}>{m.note}</span>
                      </span>
                      <span className="liquid liq-n" style={{ flex: "none", height: 40, padding: "0 16px", display: "flex", alignItems: "center", borderRadius: 999, backgroundColor: "rgb(var(--ink) / .18)", fontSize: 14, fontWeight: 700 }}>Купить ↗</span>
                    </a>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 15, color: "rgb(var(--ink) / .8)" }}>
                <div>Бесплатная доставка при заказе от 3 000 000 сум</div>
                <div>Любая форма оплаты · доступна рассрочка</div>
              </div>

              <a href="https://t.me/Remenuz_bot" className="glass-soft" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px 14px 14px", borderRadius: 999 }}>
                <span className="drop" style={{ flex: "none", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(47,107,255,.35)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M21 4L3 11l6 2 2 6 3-4 5 4z" /></svg>
                </span>
                <span style={{ flex: 1, lineHeight: 1.3 }}>
                  <span style={{ display: "block", fontWeight: 700 }}>Сомневаетесь в размере?</span>
                  <span style={{ display: "block", fontSize: 13, color: "rgb(var(--ink) / .75)" }}>Пришлите фото старого ремня — проверим совместимость</span>
                </span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* Specs + description */}
          <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 520px), 1fr))", gap: 32 }}>
            <div className="glass gp-card" style={{ borderRadius: 36, padding: 32 }}>
              <h2 style={{ margin: "0 0 16px", fontFamily: unb, fontSize: 24, fontWeight: 600 }}>Характеристики</h2>
              {specs.length === 0 && <p style={{ margin: 0, color: "rgb(var(--ink) / .75)" }}>Характеристики уточняйте у менеджера.</p>}
              {specs.map((s) => (
                <div key={s.k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "12px 0", borderBottom: "1px solid rgb(var(--ink) / .12)" }}>
                  <span style={{ color: "rgb(var(--ink) / .75)" }}>{s.k}</span>
                  <span style={{ fontFamily: mono, fontWeight: 500, textAlign: "right", overflowWrap: "anywhere" }}>{s.v}</span>
                </div>
              ))}
            </div>
            <div className="glass gp-card" style={{ borderRadius: 36, padding: 32, display: "flex", flexDirection: "column", gap: 16 }}>
              <h2 style={{ margin: 0, fontFamily: unb, fontSize: 24, fontWeight: 600 }}>Описание</h2>
              {desc.length ? (
                desc.map((t, i) => <p key={i} style={{ margin: 0, color: "rgb(var(--ink) / .8)" }}>{t}</p>)
              ) : (
                <p style={{ margin: 0, color: "rgb(var(--ink) / .8)" }}>Подробности о применении и совместимости уточните у менеджера — подберём ремень под ваше оборудование.</p>
              )}
              <a href="https://t.me/Remenuz_bot" className="glass-soft" style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "14px 20px", borderRadius: 999, fontWeight: 600 }}>
                <span>Задать вопрос по товару</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div style={{ marginTop: 48 }}>
              <h2 className="h2" style={{ margin: "0 0 20px", fontFamily: unb, fontSize: 28, fontWeight: 600 }}>{relatedTitle}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))", gap: 16 }}>
                {related.map((r) => (
                  <Link key={r.id} href={`/product/${r.slug}`} className="glass lift" style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, borderRadius: 28, transition: "transform .2s" }}>
                    <span style={{ flex: "none", width: 64, height: 64, borderRadius: 18, overflow: "hidden", background: "#FFFFFF" }}>
                      {r.imgSmall && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={fullImg(r.imgSmall) ?? ""} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
                      )}
                    </span>
                    <span style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.35 }}>{r.name}</span>
                      <span style={{ fontFamily: mono, fontSize: 16, fontWeight: 600 }}>{r.price > 0 ? `${formatPrice(r.price)} ${r.perMeter ? "сум / м" : "сум"}` : "Цена по запросу"}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
