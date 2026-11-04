"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useState, type ChangeEvent, type CSSProperties } from "react";
import { ACCENT } from "@/lib/i18n";
import { PageShell } from "@/components/PageShell";
import { goodsRu, useCart, type CartItem } from "@/lib/cart";
import { fullImg } from "@/lib/images";

type Dl = "tash" | "fargo" | "pickup";
type Pay = "cash" | "card" | "bank" | "inst";
type Cust = "person" | "company";
type Step = "cart" | "pay" | "invoice" | "done";
type Fm = { name: string; phone: string; inn: string; city: string; addr: string };

const EMPTY_FM: Fm = { name: "", phone: "", inn: "", city: "", addr: "" };

const FREE = 3000000;
const unitOf = (it: CartItem) => (it.perMeter ? "м" : "шт");
const fmt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const MONO = "'JetBrains Mono', monospace";
const UNB = "'Unbounded', sans-serif";

const PAYMENTS: { id: Pay; title: string; sub: string }[] = [
  { id: "cash", title: "Наличными", sub: "При получении или на складе" },
  { id: "card", title: "Картой онлайн", sub: "Банковские карты, онлайн-платёж" },
  { id: "bank", title: "Перечислением", sub: "Счёт для юридических лиц" },
  { id: "inst", title: "Рассрочка", sub: "Условия уточнит менеджер" },
];
const DL_NAMES: Record<Dl, string> = { tash: "Курьер по Ташкенту", fargo: "Fargo — в регионы", pickup: "Самовывоз со склада" };
const CUST_TYPES: { id: Cust; label: string }[] = [
  { id: "person", label: "Физ. лицо" },
  { id: "company", label: "Юр. лицо" },
];

const optStyle = (on: boolean): CSSProperties => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  padding: "14px 16px",
  borderRadius: 22,
  color: "#FFFFFF",
  font: "inherit",
  cursor: "pointer",
  textAlign: "left",
  ...(on
    ? { border: "1px solid rgba(255,255,255,.6)", backgroundColor: "rgba(255,255,255,.2)" }
    : { border: "1px solid rgba(255,255,255,.18)", backgroundColor: "rgba(255,255,255,.05)" }),
});
const optDot = (on: boolean): CSSProperties => ({
  flex: "none",
  width: 16,
  height: 16,
  borderRadius: "50%",
  boxSizing: "border-box",
  ...(on ? { border: "5px solid #FFFFFF", background: ACCENT } : { border: "2px solid rgba(255,255,255,.6)" }),
});
const pill = (on: boolean): CSSProperties => ({
  height: 38,
  padding: "0 16px",
  border: 0,
  borderRadius: 999,
  font: "inherit",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
  ...(on ? { backgroundColor: ACCENT, color: "#FFFFFF" } : { backgroundColor: "transparent", color: "rgba(255,255,255,.8)" }),
});

const badStyle: CSSProperties = { borderColor: "#FF8C6E", boxShadow: "0 0 0 3px rgba(255,140,110,.25)" };
const fieldWrap: CSSProperties = { display: "flex", flexDirection: "column", gap: 6 };
const labelStyle: CSSProperties = { fontSize: 13, fontWeight: 700 };
const errMsg: CSSProperties = { fontSize: 12, color: "#FFB4A0", fontWeight: 600 };
const h2Style: CSSProperties = { margin: 0, fontFamily: UNB, fontSize: 22, fontWeight: 600 };
const sectionStyle: CSSProperties = { borderRadius: 34, padding: 28, display: "flex", flexDirection: "column", gap: 18 };
const row: CSSProperties = { display: "flex", justifyContent: "space-between", gap: 12 };
const optHead: CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, width: "100%" };
const optTitle: CSSProperties = { fontWeight: 800, fontSize: 15 };
const optSub: CSSProperties = { display: "block", fontSize: 13, color: "rgba(255,255,255,.75)", marginTop: 4 };

const blobs: CSSProperties[] = [
  { top: -140, left: -160, width: 640, height: 640, background: ACCENT, opacity: 0.5 },
  { top: 300, right: -180, width: 600, height: 600, background: "#2F6BFF", opacity: 0.42 },
  { top: 1200, left: "30%", width: 560, height: 560, background: "#12B5A6", opacity: 0.28 },
];

const CartIcon = ({ size, stroke, sw }: { size: number; stroke: string; sw: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} aria-hidden="true">
    <path d="M3 4h2l2.4 11h11l2-8H6.2" />
    <circle cx="9" cy="19.5" r="1.5" />
    <circle cx="17" cy="19.5" r="1.5" />
  </svg>
);

export function CartView() {
  const cart = useCart();
  // Once the order is placed the cart is emptied; the pay / invoice / done screens show this snapshot.
  const [order, setOrder] = useState<CartItem[] | null>(null);
  const [dl, setDl] = useState<Dl>("tash");
  const [pay, setPay] = useState<Pay>("cash");
  const [cust, setCust] = useState<Cust>("person");
  const [step, setStep] = useState<Step>("cart");
  const [paid, setPaid] = useState(false);
  const [tried, setTried] = useState(false);
  const [fm, setFm] = useState<Fm>(EMPTY_FM);
  const items = step === "cart" ? cart.items : order ?? [];

  const accent = ACCENT;
  const subtotal = items.reduce((s, x) => s + x.price * x.qty, 0);
  const left = Math.max(0, FREE - subtotal);
  const pct = Math.min(100, Math.round((subtotal / FREE) * 100));
  const tashFree = subtotal >= FREE;
  const deliveryF = dl === "pickup" ? "Бесплатно" : dl === "fargo" ? "По тарифу Fargo: [ТАРИФ]" : tashFree ? "Бесплатно" : "[СТОИМОСТЬ]";
  const cur = PAYMENTS.find((p) => p.id === pay) || PAYMENTS[0];

  const setF = (k: keyof Fm) => (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setFm((f) => ({ ...f, [k]: v }));
  };
  const nameBad = fm.name.trim().length < 2;
  const phoneBad = fm.phone.replace(/\D/g, "").length < 9;
  const showErr = tried;
  const errName = showErr && nameBad;
  const errPhone = showErr && phoneBad;
  const hasErrors = showErr && (nameBad || phoneBad);

  const orderNo = "RM-" + String(100000 + (subtotal % 899999)).slice(0, 6);
  const stepIdx = step === "cart" ? 0 : step === "done" ? 2 : 1;
  const shipStep =
    dl === "pickup"
      ? { title: "Готов к выдаче", sub: "Склад: ул. Чинабад 1, Юнус-Абад" }
      : dl === "fargo"
        ? { title: "Передан в Fargo", sub: "Трек-номер придёт в Telegram / SMS" }
        : { title: "Передан курьеру", sub: "Курьер позвонит перед доставкой" };
  const tlDefs = [
    { title: "Заказ принят", sub: "Номер " + orderNo },
    { title: "Подтверждение менеджером", sub: "Проверим наличие и сроки, свяжемся по телефону" },
    {
      title: pay === "bank" ? "Ожидаем оплату по счёту" : "Сборка на складе",
      sub: pay === "bank" ? "Сборка начнётся после поступления оплаты" : "Комплектуем и упаковываем заказ",
    },
    shipStep,
    { title: dl === "pickup" ? "Получен" : "Доставлен", sub: "" },
  ];
  const timeline = tlDefs.map((x, i, arr) => {
    const state = i === 0 ? "done" : i === 1 ? "now" : "next";
    const dot: CSSProperties = {
      flex: "none",
      width: 18,
      height: 18,
      borderRadius: "50%",
      boxSizing: "border-box",
      ...(state === "done"
        ? { background: "#12B5A6", border: "2px solid #7CF2C9" }
        : state === "now"
          ? { background: accent, border: "3px solid #FFFFFF", boxShadow: "0 0 0 5px rgba(255,255,255,.12)" }
          : { border: "2px solid rgba(255,255,255,.4)" }),
    };
    const line: CSSProperties =
      i === arr.length - 1 ? { display: "none" } : { flex: 1, width: 2, minHeight: 22, background: state === "done" ? "#12B5A6" : "rgba(255,255,255,.2)" };
    const titleStyle: CSSProperties = { fontWeight: 800, fontSize: 15, color: state === "next" ? "rgba(255,255,255,.7)" : "#FFFFFF" };
    return { ...x, dot, line, titleStyle };
  });

  const innOr = fm.inn || "[ИНН]";
  const pageTitle = step === "cart" ? "Корзина" : step === "done" ? "Спасибо за заказ!" : "Оплата";
  const submitLabel = pay === "card" ? "Перейти к оплате" : pay === "bank" ? "Получить счёт" : "Оформить заказ";
  const steps = ["1 · Корзина", "2 · Оплата", "3 · Готово"].map((label, i) => ({
    label,
    cur: i === stepIdx ? ("step" as const) : ("false" as const),
    cls: i === stepIdx ? "liquid" : "",
    style: {
      padding: "8px 16px",
      borderRadius: 999,
      ...(i === stepIdx ? { backgroundColor: "rgba(255,255,255,.2)" } : i < stepIdx ? { color: "#7CF2C9" } : { color: "rgba(255,255,255,.75)" }),
    } as CSSProperties,
  }));

  const submit = () => {
    if (items.length === 0) return;
    if (nameBad || phoneBad) {
      setTried(true);
      return;
    }
    setTried(false);
    setOrder(cart.items);
    cart.clear();
    setStep(pay === "card" ? "pay" : pay === "bank" ? "invoice" : "done");
    setPaid(false);
  };
  const payNow = () => {
    setStep("done");
    setPaid(true);
  };
  const finish = () => setStep("done");
  const backToCart = () => setStep("cart");
  const newOrder = () => {
    setStep("cart");
    setOrder(null);
    setTried(false);
    setPaid(false);
    setFm(EMPTY_FM);
  };

  const payStatus =
    pay === "card" ? (paid ? "Оплачено картой" : "Картой онлайн") : pay === "bank" ? "Счёт выставлен" : pay === "inst" ? "Рассрочка — уточнит менеджер" : "Наличными при получении";
  const doneLead = "Менеджер свяжется с вами по номеру " + (fm.phone || "—") + ", чтобы подтвердить наличие и сроки.";
  const freeText = left > 0 ? "До бесплатной доставки по Ташкенту осталось " + fmt(left) + " сум" : "Бесплатная доставка по Ташкенту — ваша";
  const subtotalF = fmt(subtotal);
  const totalF = fmt(subtotal);
  const count = items.length;
  const isCompany = cust === "company";
  const needAddress = dl !== "pickup";
  const isPickup = dl === "pickup";
  const cityPh = dl === "fargo" ? "Например, Самарканд" : "Ташкент";
  const deliveries: { id: Dl; title: string; sub: string; logo?: string }[] = [
    { id: "tash", title: "Курьер по Ташкенту", sub: tashFree ? "Бесплатно — заказ от 3 000 000 сум" : "Бесплатно от 3 000 000 сум" },
    { id: "fargo", title: "В регионы —", sub: "Курьерская служба по всему Узбекистану", logo: "/img/fargo.png" },
    { id: "pickup", title: "Самовывоз", sub: "Склад на ул. Чинабад 1" },
  ];

  return (
    <PageShell blobs={blobs}>
      {/* Header */}
      <div className="sec" style={{ position: "sticky", top: 0, zIndex: 50, maxWidth: 1320, margin: "0 auto", padding: "12px 20px 0" }}>
        <header className="glass pill-head" style={{ borderRadius: 999, padding: "10px 12px 10px 18px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 18px" }}>
          <Logo height={32} />
          <Link href="/" className="glass-soft" style={{ height: 44, padding: "0 18px", display: "flex", alignItems: "center", gap: 8, fontWeight: 700, borderRadius: 999 }}>
            ← <span className="hide-sm">Продолжить покупки</span><span className="show-sm">Назад</span>
          </Link>
          <span style={{ flex: 1 }} />
          <a href="tel:+998787771188" className="hide-sm" style={{ fontWeight: 700 }}>+998 78 777 11 88</a>
          <span
            aria-label={`Корзина, ${goodsRu(cart.count)}`}
            className="liquid"
            style={{ position: "relative", width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: accent }}
          >
            <CartIcon size={20} stroke="currentColor" sw="1.8" />
            <span style={{ position: "absolute", top: -4, right: -4, minWidth: 20, height: 20, borderRadius: 10, background: "#FFFFFF", color: "#15171A", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {cart.count}
            </span>
          </span>
        </header>
      </div>

      <main className="sec" style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 40px 96px" }}>
        {/* Steps */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "end", gap: 16, marginBottom: 24 }}>
          <div>
            <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: 1, color: "rgba(255,255,255,.72)" }}>ОФОРМЛЕНИЕ ЗАКАЗА</span>
            <h1 className="h1" style={{ margin: "6px 0 0", fontFamily: UNB, fontSize: 44, fontWeight: 700, letterSpacing: -1 }}>{pageTitle}</h1>
          </div>
          <ol aria-label="Шаги" className="glass-soft" style={{ listStyle: "none", margin: 0, padding: 6, display: "flex", gap: 4, borderRadius: 999, fontSize: 14, fontWeight: 700 }}>
            {steps.map((st) => (
              <li key={st.label} aria-current={st.cur} className={st.cls} style={st.style}>{st.label}</li>
            ))}
          </ol>
        </div>

        {step === "cart" && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 28, alignItems: "flex-start" }}>
            {/* LEFT: items + form */}
            <div style={{ flex: "999 1 640px", minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Free delivery progress */}
              <div className="glass-soft" style={{ padding: "18px 22px", borderRadius: 26, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", fontSize: 15 }}>
                  <span style={{ fontWeight: 700 }}>{freeText}</span>
                  <span style={{ fontFamily: MONO, color: "rgba(255,255,255,.75)" }}>порог 3 000 000 сум</span>
                </div>
                <div style={{ height: 12, borderRadius: 999, background: "rgba(0,0,0,.35)", boxShadow: "inset 0 2px 4px rgba(0,0,0,.4)", overflow: "hidden" }}>
                  <div className="liquid" style={{ height: "100%", width: pct + "%", borderRadius: 999, backgroundColor: accent, transition: "width .3s" }} />
                </div>
              </div>

              {/* Items */}
              <section aria-label="Товары в корзине" className="glass" style={{ borderRadius: 34, padding: 10 }}>
                {cart.lastRemoved && (
                  <div role="status" className="glass-soft" style={{ margin: 4, padding: "10px 10px 10px 18px", borderRadius: 22, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <span style={{ minWidth: 0, fontSize: 14 }}>Удалено: <b>{cart.lastRemoved.name}</b></span>
                    <button type="button" onClick={cart.undoRemove} className="liquid" style={{ height: 40, padding: "0 18px", border: 0, borderRadius: 999, backgroundColor: "rgba(255,255,255,.2)", color: "#FFFFFF", font: "inherit", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                      Вернуть
                    </button>
                  </div>
                )}
                {cart.ready && items.length === 0 && (
                  <div style={{ padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
                    <span className="drop" style={{ width: 90, height: 90, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <CartIcon size={40} stroke="#FFFFFF" sw="1.6" />
                    </span>
                    <b style={{ fontSize: 20 }}>Корзина пуста</b>
                    <span style={{ color: "rgba(255,255,255,.75)" }}>Подберите ремень в каталоге или по параметрам.</span>
                    <Link href="/catalog" className="liquid" style={{ height: 50, padding: "0 24px", display: "flex", alignItems: "center", borderRadius: 999, backgroundColor: accent, fontWeight: 700 }}>
                      Перейти в каталог
                    </Link>
                  </div>
                )}
                {items.map((it) => (
                  <div key={it.id} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16, padding: 14, borderRadius: 26, borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                    <div style={{ flex: "none", width: 96, height: 96, borderRadius: 22, overflow: "hidden", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {it.img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={fullImg(it.img) ?? ""} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
                      ) : (
                        <span className="drop" style={{ width: 76, height: 76 }} />
                      )}
                    </div>
                    <div style={{ flex: "1 1 240px", minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                      <span style={{ fontFamily: MONO, fontSize: 12, color: "rgba(255,255,255,.72)", overflowWrap: "anywhere" }}>{[it.brand, it.sku].filter(Boolean).join(" · ")}</span>
                      <Link href={`/product/${it.slug}`} style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.35 }}>{it.name}</Link>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,.72)" }}>
                        <span style={{ fontFamily: MONO }}>{fmt(it.price)}</span> сум / {unitOf(it)} · <span style={{ color: "#7CF2C9" }}>● в наличии</span>
                      </span>
                    </div>
                    <div className="glass-soft" style={{ display: "flex", alignItems: "center", height: 48, borderRadius: 999, padding: "0 4px" }}>
                      <button type="button" className="qbtn" aria-label="Уменьшить количество" disabled={it.qty <= 1} onClick={() => cart.setQty(it.id, it.qty - 1)} style={it.qty <= 1 ? { opacity: 0.35, cursor: "not-allowed" } : undefined}>−</button>
                      <span aria-live="polite" style={{ minWidth: 56, textAlign: "center", fontFamily: MONO, fontSize: 15, fontWeight: 600 }}>{it.qty} {unitOf(it)}</span>
                      <button type="button" className="qbtn" aria-label="Увеличить количество" onClick={() => cart.setQty(it.id, it.qty + 1)}>+</button>
                    </div>
                    <div style={{ minWidth: 150, textAlign: "right", fontFamily: MONO, fontSize: 19, fontWeight: 600 }}>
                      {fmt(it.price * it.qty)} <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,.72)" }}>сум</span>
                    </div>
                    <button
                      type="button"
                      aria-label="Удалить из корзины"
                      onClick={() => cart.remove(it.id)}
                      className="glass-soft"
                      style={{ width: 44, height: 44, borderRadius: "50%", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></svg>
                    </button>
                  </div>
                ))}
              </section>

              {/* Customer */}
              <section className="glass" style={sectionStyle}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <h2 style={h2Style}>Покупатель</h2>
                  <div role="radiogroup" aria-label="Тип покупателя" className="glass-soft" style={{ display: "flex", gap: 2, padding: 4, borderRadius: 999 }}>
                    {CUST_TYPES.map((c) => (
                      <button key={c.id} type="button" role="radio" aria-checked={cust === c.id} onClick={() => setCust(c.id)} className={cust === c.id ? "liquid" : ""} style={pill(cust === c.id)}>
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
                  <div style={fieldWrap}>
                    <label htmlFor="c-name" style={labelStyle}>Имя</label>
                    <input id="c-name" className="field" placeholder="Как к вам обращаться" autoComplete="name" value={fm.name} onChange={setF("name")} aria-invalid={errName} style={{ width: "100%", ...(errName ? badStyle : {}) }} />
                    {errName && <span role="alert" style={errMsg}>Укажите имя</span>}
                  </div>
                  <div style={fieldWrap}>
                    <label htmlFor="c-phone" style={labelStyle}>Телефон</label>
                    <input id="c-phone" className="field" type="tel" placeholder="+998 __ ___ __ __" autoComplete="tel" value={fm.phone} onChange={setF("phone")} aria-invalid={errPhone} style={{ width: "100%", fontFamily: MONO, ...(errPhone ? badStyle : {}) }} />
                    {errPhone && <span role="alert" style={errMsg}>Укажите телефон, минимум 9 цифр</span>}
                  </div>
                  {isCompany && (
                    <>
                      <div style={fieldWrap}>
                        <label htmlFor="c-inn" style={labelStyle}>ИНН</label>
                        <input id="c-inn" className="field" inputMode="numeric" placeholder="9 цифр" value={fm.inn} onChange={setF("inn")} style={{ width: "100%", fontFamily: MONO }} />
                      </div>
                    </>
                  )}
                </div>
              </section>

              {/* Delivery */}
              <section className="glass" style={sectionStyle}>
                <h2 style={h2Style}>Доставка</h2>
                <div role="radiogroup" aria-label="Способ доставки" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
                  {deliveries.map((dv) => {
                    const on = dl === dv.id;
                    return (
                      <button key={dv.id} type="button" role="radio" aria-checked={on} onClick={() => setDl(dv.id)} className={on ? "liquid" : ""} style={optStyle(on)}>
                        <span style={optHead}>
                          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={optTitle}>{dv.title}</span>
                            {dv.logo && (
                              <span style={{ height: 24, padding: "4px 8px", boxSizing: "border-box", borderRadius: 999, background: "#FFFFFF", display: "flex", alignItems: "center" }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={dv.logo} alt="Fargo" style={{ height: "100%", display: "block" }} />
                              </span>
                            )}
                          </span>
                          <span aria-hidden="true" style={optDot(on)} />
                        </span>
                        <span style={optSub}>{dv.sub}</span>
                      </button>
                    );
                  })}
                </div>
                {needAddress && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
                    <div style={fieldWrap}>
                      <label htmlFor="c-city" style={labelStyle}>Город / область</label>
                      <input id="c-city" className="field" placeholder={cityPh} autoComplete="address-level2" value={fm.city} onChange={setF("city")} style={{ width: "100%" }} />
                    </div>
                    <div style={fieldWrap}>
                      <label htmlFor="c-addr" style={labelStyle}>Адрес</label>
                      <input id="c-addr" className="field" placeholder="Улица, дом, предприятие" autoComplete="street-address" value={fm.addr} onChange={setF("addr")} style={{ width: "100%" }} />
                    </div>
                  </div>
                )}
                {isPickup && (
                  <div className="glass-soft" style={{ padding: "14px 18px", borderRadius: 20, fontSize: 14, color: "rgba(255,255,255,.85)" }}>
                    Склад: ул. Чинабад 1, Юнус-Абад, Ташкент. Сообщим, когда заказ будет готов к выдаче.
                  </div>
                )}
                <div style={fieldWrap}>
                  <label htmlFor="c-note" style={labelStyle}>Комментарий к заказу</label>
                  <textarea id="c-note" className="field" placeholder="Например: нужен счёт-фактура, удобное время доставки" style={{ width: "100%" }} />
                </div>
              </section>

              {/* Payment */}
              <section className="glass" style={sectionStyle}>
                <h2 style={h2Style}>Оплата</h2>
                <div role="radiogroup" aria-label="Способ оплаты" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
                  {PAYMENTS.map((pm) => {
                    const on = pay === pm.id;
                    return (
                      <button key={pm.id} type="button" role="radio" aria-checked={on} onClick={() => setPay(pm.id)} className={on ? "liquid" : ""} style={optStyle(on)}>
                        <span style={optHead}>
                          <span style={optTitle}>{pm.title}</span>
                          <span aria-hidden="true" style={optDot(on)} />
                        </span>
                        <span style={optSub}>{pm.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* RIGHT: summary */}
            <aside aria-label="Итог заказа" style={{ flex: "1 1 340px", minWidth: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="glass" style={{ borderRadius: 34, padding: 28, display: "flex", flexDirection: "column", gap: 16 }}>
                <h2 style={h2Style}>Ваш заказ</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 15 }}>
                  <div style={row}><span style={{ color: "rgba(255,255,255,.78)" }}>Товары, {count} поз.</span><span style={{ fontFamily: MONO }}>{subtotalF} сум</span></div>
                  <div style={row}><span style={{ color: "rgba(255,255,255,.78)" }}>Доставка</span><span style={{ fontFamily: MONO, textAlign: "right" }}>{deliveryF}</span></div>
                  <div style={row}><span style={{ color: "rgba(255,255,255,.78)" }}>Оплата</span><span style={{ textAlign: "right" }}>{cur.title}</span></div>
                </div>
                <div style={{ borderTop: "1px dashed rgba(255,255,255,.25)", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                  <span style={{ fontWeight: 800, fontSize: 17 }}>Итого</span>
                  <span style={{ fontFamily: MONO, fontSize: 30, fontWeight: 600, lineHeight: 1 }}>
                    {totalF} <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,.75)" }}>сум</span>
                  </span>
                </div>
                {hasErrors && (
                  <div role="alert" style={{ padding: "10px 14px", borderRadius: 16, background: "rgba(255,90,60,.18)", border: "1px solid rgba(255,140,110,.5)", fontSize: 13, fontWeight: 600 }}>
                    Заполните имя и телефон — без них менеджер не сможет подтвердить заказ.
                  </div>
                )}
                <button type="button" onClick={submit} className="liquid" style={{ height: 58, border: 0, borderRadius: 999, backgroundColor: accent, color: "#FFFFFF", font: "inherit", fontWeight: 800, fontSize: 17, cursor: "pointer" }}>
                  {submitLabel}
                </button>
                <a href="https://t.me/Remenuz_bot" className="glass-soft" style={{ height: 50, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 999, fontWeight: 700 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 4L3 11l6 2 2 6 3-4 5 4z" /></svg>
                  Оформить через Telegram
                </a>
                <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,.65)" }}>
                  Нажимая «Оформить заказ», вы соглашаетесь с <a href="#" style={{ textDecoration: "underline" }}>офертой</a>. Менеджер подтвердит наличие и сроки.
                </p>
              </div>
              <div className="glass-soft" style={{ borderRadius: 26, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10, fontSize: 14, color: "rgba(255,255,255,.85)" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span className="drop" style={{ flex: "none", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 11, fontWeight: 600 }}>24</span>
                  Поддержка 24/7 — Telegram, WhatsApp, телефон
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span className="drop" style={{ flex: "none", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 10, fontWeight: 600 }}>B2B</span>
                  Счёт и договор для юридических лиц
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* STEP 2a: online payment */}
        {step === "pay" && (
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <div className="glass" style={{ borderRadius: 38, padding: 34, display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span className="drop" style={{ width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>
                </span>
                <div>
                  <div style={{ fontFamily: UNB, fontSize: 22, fontWeight: 600 }}>Оплата картой</div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,.75)" }}>Заказ {orderNo} · {totalF} сум</div>
                </div>
              </div>
              <p style={{ margin: 0, color: "rgba(255,255,255,.82)" }}>
                Вы будете перенаправлены на защищённую страницу платёжной системы [ПЛАТЁЖНЫЙ СЕРВИС]. Данные карты вводятся только там — Remen.uz их не видит и не хранит.
              </p>
              <div className="glass-soft" style={{ padding: "16px 18px", borderRadius: 22, display: "flex", flexDirection: "column", gap: 8, fontSize: 15 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "rgba(255,255,255,.75)" }}>Товары</span><span style={{ fontFamily: MONO }}>{subtotalF} сум</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "rgba(255,255,255,.75)" }}>Доставка</span><span style={{ fontFamily: MONO }}>{deliveryF}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed rgba(255,255,255,.25)", paddingTop: 10, fontWeight: 800 }}><span>К оплате</span><span style={{ fontFamily: MONO }}>{totalF} сум</span></div>
              </div>
              <button type="button" onClick={payNow} className="liquid" style={{ height: 58, border: 0, borderRadius: 999, backgroundColor: accent, color: "#FFFFFF", font: "inherit", fontWeight: 800, fontSize: 17, cursor: "pointer" }}>
                Перейти к оплате {totalF} сум
              </button>
              <button type="button" onClick={backToCart} className="glass-soft" style={{ height: 48, borderRadius: 999, color: "#FFFFFF", font: "inherit", fontWeight: 700, cursor: "pointer" }}>
                ← Изменить заказ
              </button>
            </div>
          </div>
        )}

        {/* STEP 2b: invoice for companies */}
        {step === "invoice" && (
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div className="glass" style={{ borderRadius: 38, padding: 34, display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span className="drop" style={{ width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" aria-hidden="true"><path d="M6 2h9l5 5v15H6z" /><path d="M14 2v6h6M9 13h8M9 17h8" /></svg>
                </span>
                <div>
                  <div style={{ fontFamily: UNB, fontSize: 22, fontWeight: 600 }}>Счёт на оплату сформирован</div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,.75)" }}>Заказ {orderNo} · ИНН {innOr}</div>
                </div>
              </div>
              <div className="glass-soft" style={{ padding: "16px 18px", borderRadius: 22, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px 18px", fontSize: 14 }}>
                <span style={{ color: "rgba(255,255,255,.72)" }}>Получатель</span><span>[РЕКВИЗИТЫ REMEN.UZ]</span>
                <span style={{ color: "rgba(255,255,255,.72)" }}>Плательщик</span><span>ИНН {innOr}</span>
                <span style={{ color: "rgba(255,255,255,.72)" }}>Сумма</span><span style={{ fontFamily: MONO, fontWeight: 700 }}>{totalF} сум</span>
                <span style={{ color: "rgba(255,255,255,.72)" }}>Назначение</span><span>Оплата по счёту {orderNo}</span>
              </div>
              <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,.8)" }}>
                Счёт и договор отправим в Telegram или на WhatsApp по номеру {fm.phone}. Заказ уйдёт в сборку после поступления оплаты.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                <a href="#" className="glass" style={{ flex: "1 1 200px", height: 54, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 999, fontWeight: 700 }}>Скачать счёт (PDF)</a>
                <button type="button" onClick={finish} className="liquid" style={{ flex: "1 1 200px", height: 54, border: 0, borderRadius: 999, backgroundColor: accent, color: "#FFFFFF", font: "inherit", fontWeight: 800, cursor: "pointer" }}>
                  Готово
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: order placed */}
        {step === "done" && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 28, alignItems: "flex-start" }}>
            <div className="glass" style={{ flex: "999 1 560px", minWidth: 0, borderRadius: 38, padding: 34, display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 18 }}>
                <span className="drop" style={{ width: 76, height: 76, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(18,181,166,.35)" }}>
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" aria-hidden="true"><path d="M5 12l5 5L20 7" /></svg>
                </span>
                <div style={{ flex: "1 1 260px" }}>
                  <div style={{ fontFamily: UNB, fontSize: 30, fontWeight: 700, lineHeight: 1.15 }}>Заказ {orderNo} принят</div>
                  <div style={{ marginTop: 4, color: "rgba(255,255,255,.8)" }}>{doneLead}</div>
                </div>
              </div>
              <ol aria-label="Статус заказа" style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column" }}>
                {timeline.map((tl) => (
                  <li key={tl.title} style={{ display: "flex", gap: 16 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={tl.dot} />
                      <span style={tl.line} />
                    </div>
                    <div style={{ paddingBottom: 18 }}>
                      <div style={tl.titleStyle}>{tl.title}</div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,.7)" }}>{tl.sub}</div>
                    </div>
                  </li>
                ))}
              </ol>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                <a href="https://t.me/Remenuz_bot" className="liquid" style={{ flex: "1 1 220px", height: 54, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 999, backgroundColor: accent, fontWeight: 800 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 4L3 11l6 2 2 6 3-4 5 4z" /></svg>
                  Отслеживать в Telegram
                </a>
                <Link href="/" className="glass" style={{ flex: "1 1 180px", height: 54, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 999, fontWeight: 700 }}>
                  На главную
                </Link>
                <Link href="/orders" className="glass" style={{ flex: "1 1 180px", height: 54, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 999, fontWeight: 700 }}>
                  Мои заказы
                </Link>
              </div>
            </div>
            <aside aria-label="Детали заказа" className="glass" style={{ flex: "1 1 340px", minWidth: 0, borderRadius: 34, padding: 28, display: "flex", flexDirection: "column", gap: 12, fontSize: 15 }}>
              <h2 style={{ margin: "0 0 4px", fontFamily: UNB, fontSize: 20, fontWeight: 600 }}>Детали</h2>
              <div style={row}><span style={{ color: "rgba(255,255,255,.75)" }}>Номер</span><span style={{ fontFamily: MONO }}>{orderNo}</span></div>
              <div style={row}><span style={{ color: "rgba(255,255,255,.75)" }}>Покупатель</span><span style={{ textAlign: "right" }}>{fm.name}</span></div>
              <div style={row}><span style={{ color: "rgba(255,255,255,.75)" }}>Телефон</span><span style={{ fontFamily: MONO }}>{fm.phone}</span></div>
              <div style={row}><span style={{ color: "rgba(255,255,255,.75)" }}>Доставка</span><span style={{ textAlign: "right" }}>{DL_NAMES[dl]}</span></div>
              <div style={row}><span style={{ color: "rgba(255,255,255,.75)" }}>Оплата</span><span style={{ textAlign: "right" }}>{payStatus}</span></div>
              <div style={{ ...row, borderTop: "1px dashed rgba(255,255,255,.25)", paddingTop: 12, fontWeight: 800 }}><span>Итого</span><span style={{ fontFamily: MONO }}>{totalF} сум</span></div>
              <button type="button" onClick={newOrder} className="glass-soft" style={{ marginTop: 6, height: 46, borderRadius: 999, color: "#FFFFFF", font: "inherit", fontWeight: 700, cursor: "pointer" }}>
                Новый заказ
              </button>
            </aside>
          </div>
        )}
      </main>
    </PageShell>
  );
}
