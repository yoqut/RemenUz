"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useState, type CSSProperties } from "react";
import { ACCENT } from "@/lib/i18n";

type Variant = "A" | "B" | "C" | "G";
type DeliveryId = "tash" | "fargo";

const prices: Record<Variant, string> = { A: "3 068 800", B: "2 685 760", C: "3 452 960", G: "1 472 800" };
const labels: Record<Variant, string> = { A: "25 мм · A", B: "25 мм · B", C: "38 мм · C", G: "32 мм · G" };
const widths: Record<Variant, string> = { A: "25 мм", B: "25 мм", C: "38 мм", G: "32 мм" };

const markets: { mark: string; name: string; note: string; href: string; logo?: string; logoText?: string }[] = [
  { mark: "U", name: "Uzum Market", note: "Доставка в пункт выдачи Uzum", href: "#", logo: "/img/uzum.png" },
  { mark: "O", name: "Ozon", note: "Доставка в пункт выдачи Ozon", href: "#", logo: "/img/ozon.png" },
  { mark: "ЯМ", name: "Яндекс Маркет", note: "Доставка Яндекс Маркета", href: "#", logo: "/img/yandex-market.png", logoText: "Маркет" },
  { mark: "WB", name: "Wildberries", note: "Доставка в пункт выдачи WB", href: "#", logo: "/img/wildberries.png" },
  { mark: "OP", name: "optom.uz", note: "Оптовые заказы", href: "#", logo: "/img/optom.png" },
];

const deliveries: { id: DeliveryId; title: string; sub: string; logo?: string }[] = [
  { id: "tash", title: "Ташкент — Remen.uz", sub: "Бесплатно от 3 000 000 сум" },
  { id: "fargo", title: "Регионы —", sub: "Курьерская доставка по Узбекистану", logo: "/img/fargo.png" },
];

const related = [
  { title: "Зубчатый ремень тип T5 1645 38 NFT C", price: "3 452 960" },
  { title: "Зубчатый ремень тип T5 1645 25 NFT B", price: "2 685 760" },
  { title: "Зубчатый ремень тип T5 625 32 NFT G", price: "1 472 800" },
  { title: "Зубчатый ремень 10 T5 800 MEGADYNE MEGAPOWER2", price: "159 040" },
];

const mono = "'JetBrains Mono', monospace";
const unb = "'Unbounded', sans-serif";
const crumb: CSSProperties = { color: "rgba(255,255,255,.75)" };
const statLabel: CSSProperties = { fontSize: 12, color: "rgba(255,255,255,.72)" };
const statVal: CSSProperties = { fontFamily: mono, fontSize: 22, fontWeight: 600 };
const qtyBtn: CSSProperties = { width: 48, height: 48, border: 0, borderRadius: "50%", background: "transparent", color: "#FFFFFF", fontSize: 22, cursor: "pointer" };
const thumb: CSSProperties = { aspectRatio: "1", borderRadius: 22 };

export function ProductView() {
  const accent = ACCENT;
  const [sel, setSel] = useState<Variant>("A");
  const [qty, setQty] = useState(1);
  const [dl, setDl] = useState<DeliveryId>("tash");

  const specs = [
    { k: "Тип ремня", v: "Зубчатый" },
    { k: "Профиль", v: "T5" },
    { k: "Шаг зуба", v: "5 мм" },
    { k: "Длина", v: "1645 мм" },
    { k: "Ширина", v: widths[sel] },
    { k: "Исполнение", v: "NFT " + sel },
    { k: "Бренд", v: "[БРЕНД]" },
  ];

  return (
    <div className="gp" style={{ position: "relative", overflow: "clip", fontFamily: "'Manrope', system-ui, sans-serif", color: "#FFFFFF", background: "#0B0E14", fontSize: 16, lineHeight: 1.55, minHeight: "100vh" }}>
      <div className="blob" style={{ top: -120, left: -160, width: 640, height: 640, background: accent, opacity: 0.5 }} />
      <div className="blob" style={{ top: 200, right: -180, width: 600, height: 600, background: "#2F6BFF", opacity: 0.45 }} />
      <div className="blob" style={{ top: 1300, left: "35%", width: 560, height: 560, background: "#12B5A6", opacity: 0.3 }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ position: "sticky", top: 0, zIndex: 50, maxWidth: 1320, margin: "0 auto", padding: "12px 20px 0" }}>
          <header className="glass" style={{ borderRadius: 999, padding: "10px 12px 10px 18px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 18px" }}>
            <Logo height={32} />
            <a href="#" className="liquid" style={{ height: 44, padding: "0 20px", display: "flex", alignItems: "center", backgroundColor: accent, fontWeight: 700, borderRadius: 999 }}>Каталог</a>
            <form className="glass-soft" role="search" onSubmit={(e) => e.preventDefault()} style={{ flex: "1 1 320px", display: "flex", alignItems: "center", height: 44, borderRadius: 999, padding: "0 16px" }}>
              <label htmlFor="gpq" className="sr">Поиск</label>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.75)" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
              <input id="gpq" type="search" placeholder="Артикул или размер" style={{ flex: 1, minWidth: 0, border: 0, background: "transparent", color: "#FFFFFF", padding: "0 12px", font: "inherit", fontSize: 15, outline: "none" }} />
            </form>
            <a href="tel:+998787771188" style={{ fontWeight: 700 }}>+998 78 777 11 88</a>
            <Link href="/cart" aria-label="Корзина" className="glass-soft" style={{ width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3 4h2l2.4 11h11l2-8H6.2" /><circle cx="9" cy="19.5" r="1.5" /><circle cx="17" cy="19.5" r="1.5" /></svg>
            </Link>
          </header>
        </div>

        <main className="sec" style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 40px 96px" }}>
          <nav aria-label="Навигация" className="glass-soft" style={{ display: "inline-flex", flexWrap: "wrap", gap: 8, padding: "8px 16px", borderRadius: 999, fontSize: 14, color: "rgba(255,255,255,.75)" }}>
            <Link href="/" style={crumb}>Главная</Link><span>›</span>
            <a href="#" style={crumb}>Зубчатые ремни</a><span>›</span>
            <a href="#" style={crumb}>Тип T5</a><span>›</span>
            <span style={{ color: "#FFFFFF", fontWeight: 600 }}>T5 1645 25 NFT A</span>
          </nav>

          <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 520px), 1fr))", gap: 32, alignItems: "start" }}>
            {/* Gallery: big glass lens */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="glass" style={{ position: "relative", aspectRatio: "1 / 1", borderRadius: 40, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <div className="drop" style={{ width: "74%", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,.04)" }}>
                  <svg width="66%" viewBox="0 0 400 180" aria-hidden="true"><rect x="16" y="20" width="368" height="140" rx="70" fill="none" stroke="#FFFFFF" strokeWidth="16" strokeDasharray="7 6" /><circle cx="86" cy="90" r="48" fill="rgba(255,255,255,.18)" stroke="#FFFFFF" strokeWidth="2" /><circle cx="86" cy="90" r="7" fill="#FFFFFF" /><circle cx="314" cy="90" r="48" fill="rgba(255,255,255,.18)" stroke="#FFFFFF" strokeWidth="2" /><circle cx="314" cy="90" r="7" fill="#FFFFFF" /></svg>
                </div>
                <span className="drop" aria-hidden="true" style={{ position: "absolute", top: 40, right: 56, width: 40, height: 40 }} />
                <span className="drop" aria-hidden="true" style={{ position: "absolute", bottom: 60, left: 50, width: 22, height: 22 }} />
                <span className="glass-soft" style={{ position: "absolute", bottom: 18, right: 18, padding: "6px 12px", borderRadius: 999, fontFamily: mono, fontSize: 12 }}>[ФОТО ТОВАРА]</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
                <div className="glass" style={{ ...thumb, border: "2px solid rgba(255,255,255,.7)" }} />
                <div className="glass-soft" style={thumb} />
                <div className="glass-soft" style={thumb} />
                <div className="glass-soft" style={thumb} />
              </div>
            </div>

            {/* Buy panel */}
            <div className="glass gp-panel" style={{ borderRadius: 40, padding: 34, display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, fontSize: 13, fontWeight: 700 }}>
                  <span className="glass-soft" style={{ padding: "5px 12px", borderRadius: 999 }}>Новинка</span>
                  <span style={{ padding: "5px 12px", borderRadius: 999, background: "rgba(18,181,166,.25)", border: "1px solid rgba(18,181,166,.6)" }}>● В наличии</span>
                </div>
                <h1 className="gp-h1" style={{ margin: 0, fontFamily: unb, fontSize: 34, fontWeight: 600, lineHeight: 1.15, letterSpacing: -0.5 }}>Зубчатый ремень тип T5 1645 25 NFT A</h1>
                <span style={{ fontFamily: mono, fontSize: 13, color: "rgba(255,255,255,.72)" }}>Артикул: T5-1645-25-NFT-A · Бренд: [БРЕНД]</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
                <div className="glass-soft" style={{ padding: "14px 16px", borderRadius: 22 }}><div style={statLabel}>Профиль</div><div className="gp-spec" style={statVal}>T5</div></div>
                <div className="glass-soft" style={{ padding: "14px 16px", borderRadius: 22 }}><div style={statLabel}>Длина</div><div className="gp-spec" style={statVal}>1645 мм</div></div>
                <div className="glass-soft" style={{ padding: "14px 16px", borderRadius: 22 }}><div style={statLabel}>Ширина</div><div className="gp-spec" style={statVal}>{widths[sel]}</div></div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>Исполнение</span>
                <div className="glass-soft" style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: 5, borderRadius: 26 }}>
                  {(["A", "B", "C"] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setSel(k)}
                      className={k === sel ? "liquid" : ""}
                      style={{ height: 44, padding: "0 16px", border: 0, borderRadius: 999, color: "#FFFFFF", font: "inherit", fontSize: 14, fontWeight: 700, cursor: "pointer", backgroundColor: k === sel ? "rgba(255,255,255,.24)" : "transparent" }}
                    >
                      {labels[k]}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontFamily: mono, fontSize: 42, fontWeight: 600, lineHeight: 1 }}>{prices[sel]}</span>
                <span style={{ fontSize: 18, color: "rgba(255,255,255,.75)" }}>сум</span>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                <div className="glass-soft" style={{ display: "flex", alignItems: "center", height: 56, borderRadius: 999, padding: "0 4px" }}>
                  <button type="button" aria-label="Меньше" onClick={() => setQty(Math.max(1, qty - 1))} style={qtyBtn}>−</button>
                  <span style={{ minWidth: 34, textAlign: "center", fontFamily: mono, fontSize: 17, fontWeight: 600 }}>{qty}</span>
                  <button type="button" aria-label="Больше" onClick={() => setQty(qty + 1)} style={qtyBtn}>+</button>
                </div>
                <Link href="/cart" className="liquid" style={{ flex: "1 1 200px", height: 56, borderRadius: 999, backgroundColor: accent, color: "#FFFFFF", fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>В корзину</Link>
                <button type="button" className="glass" style={{ flex: "1 1 170px", height: 56, borderRadius: 999, color: "#FFFFFF", font: "inherit", fontWeight: 700, cursor: "pointer" }}>Купить в 1 клик</button>
              </div>

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
                        className={on ? "liquid" : ""}
                        style={{
                          display: "flex", flexDirection: "column", alignItems: "stretch", padding: "12px 16px", borderRadius: 20, color: "#FFFFFF", font: "inherit", cursor: "pointer", textAlign: "left",
                          ...(on ? { border: "1px solid rgba(255,255,255,.6)", backgroundColor: "rgba(255,255,255,.2)" } : { border: "1px solid rgba(255,255,255,.18)", backgroundColor: "rgba(255,255,255,.05)" }),
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
                            style={{ flex: "none", width: 16, height: 16, borderRadius: "50%", boxSizing: "border-box", ...(on ? { border: "5px solid #FFFFFF", background: accent } : { border: "2px solid rgba(255,255,255,.6)" }) }}
                          />
                        </span>
                        <span style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,.75)", textAlign: "left", marginTop: 2 }}>{d.sub}</span>
                      </button>
                    );
                  })}
                </div>
                {dl === "fargo" && (
                  <div className="glass-soft" style={{ display: "flex", flexDirection: "column", gap: 4, padding: "12px 16px", borderRadius: 18, fontSize: 13, color: "rgba(255,255,255,.85)" }}>
                    <span>Отправим заказ курьерской службой Fargo в ваш город. Стоимость и срок рассчитываются при оформлении: [ТАРИФ FARGO].</span>
                    <span>Трек-номер пришлём в Telegram или SMS.</span>
                  </div>
                )}
              </div>

              {/* Buy on marketplaces */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>Купить на маркетплейсе</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,.7)" }}>цена и доставка — на площадке</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {markets.map((m) => (
                    <a key={m.name} href={m.href} target="_blank" rel="noopener" className="glass-soft gp-market" style={{ display: "flex", alignItems: "center", gap: 14, padding: 10, borderRadius: 999 }}>
                      {m.logo ? (
                        <span style={{ flex: "none", width: 96, height: 40, padding: "6px 10px", boxSizing: "border-box", borderRadius: 999, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={m.logo} alt="" style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", display: "block" }} />
                          {m.logoText && <span style={{ marginLeft: 6, color: "#15171A", fontWeight: 800, fontSize: 11, lineHeight: 1.05 }}>{m.logoText}</span>}
                        </span>
                      ) : (
                        <span className="drop" style={{ flex: "none", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: unb, fontSize: 12, fontWeight: 700 }}>{m.mark}</span>
                      )}
                      <span style={{ flex: 1, minWidth: 0, lineHeight: 1.25 }}>
                        <span style={{ display: "block", fontWeight: 700 }}>{m.name}</span>
                        <span style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,.72)" }}>{m.note}</span>
                      </span>
                      <span className="gp-market-price" style={{ fontFamily: mono, fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>[ЦЕНА] сум</span>
                      <span className="liquid" style={{ flex: "none", height: 40, padding: "0 16px", display: "flex", alignItems: "center", borderRadius: 999, backgroundColor: "rgba(255,255,255,.18)", fontSize: 14, fontWeight: 700 }}>Купить ↗</span>
                    </a>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 15, color: "rgba(255,255,255,.8)" }}>
                <div>Бесплатная доставка при заказе от 3 000 000 сум</div>
                <div>Любая форма оплаты · доступна рассрочка</div>
              </div>

              <a href="https://t.me/Remenuz_bot" className="glass-soft" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px 14px 14px", borderRadius: 999 }}>
                <span className="drop" style={{ flex: "none", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(47,107,255,.35)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" aria-hidden="true"><path d="M21 4L3 11l6 2 2 6 3-4 5 4z" /></svg>
                </span>
                <span style={{ flex: 1, lineHeight: 1.3 }}>
                  <span style={{ display: "block", fontWeight: 700 }}>Сомневаетесь в размере?</span>
                  <span style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,.75)" }}>Пришлите фото старого ремня — проверим совместимость</span>
                </span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* Specs + description */}
          <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 520px), 1fr))", gap: 32 }}>
            <div className="glass gp-card" style={{ borderRadius: 36, padding: 32 }}>
              <h2 style={{ margin: "0 0 16px", fontFamily: unb, fontSize: 24, fontWeight: 600 }}>Характеристики</h2>
              {specs.map((s) => (
                <div key={s.k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,.12)" }}>
                  <span style={{ color: "rgba(255,255,255,.75)" }}>{s.k}</span>
                  <span style={{ fontFamily: mono, fontWeight: 500, textAlign: "right" }}>{s.v}</span>
                </div>
              ))}
            </div>
            <div className="glass gp-card" style={{ borderRadius: 36, padding: 32, display: "flex", flexDirection: "column", gap: 16 }}>
              <h2 style={{ margin: 0, fontFamily: unb, fontSize: 24, fontWeight: 600 }}>Описание</h2>
              <p style={{ margin: 0, color: "rgba(255,255,255,.8)" }}>[ОПИСАНИЕ ТОВАРА: применение, материал, условия работы]</p>
              <a href="#" className="glass-soft" style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "14px 20px", borderRadius: 999, fontWeight: 600 }}>
                <span>Технический паспорт (PDF)</span>
                <span style={{ fontFamily: mono, fontSize: 13, color: "rgba(255,255,255,.72)" }}>[РАЗМЕР]</span>
              </a>
            </div>
          </div>

          {/* Related */}
          <div style={{ marginTop: 48 }}>
            <h2 className="h2" style={{ margin: "0 0 20px", fontFamily: unb, fontSize: 28, fontWeight: 600 }}>Другие исполнения T5 1645</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))", gap: 16 }}>
              {related.map((r) => (
                <a key={r.title} href="#" className="glass" style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, borderRadius: 28 }}>
                  <span className="drop" style={{ flex: "none", width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="40" height="22" viewBox="0 0 200 110" aria-hidden="true"><rect x="12" y="20" width="176" height="70" rx="35" fill="none" stroke="#FFFFFF" strokeWidth="12" strokeDasharray="6 5" /></svg>
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.35 }}>{r.title}</span>
                    <span style={{ fontFamily: mono, fontSize: 16, fontWeight: 600 }}>{r.price} сум</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
