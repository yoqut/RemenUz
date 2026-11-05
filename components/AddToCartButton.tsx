"use client";

import { useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { ACCENT } from "@/lib/i18n";
import { useCart, type CartProduct } from "@/lib/cart";
import { CATALOG_T } from "@/lib/catalog";
import { useT } from "@/lib/lang";

const MAX = 9999;

/**
 * Round button on product cards. Not in the cart yet: adds `qty` units (default 1).
 * Already in the cart: shows a check and opens the cart.
 */
export function AddToCartButton({ product, label, size = 46, qty = 1 }: { product: CartProduct; label: string; size?: number; qty?: number }) {
  const { add, has } = useCart();
  const ct = useT(CATALOG_T);
  const router = useRouter();
  const [pulse, setPulse] = useState(false);
  const inCart = has(product.id);
  return (
    <button
      type="button"
      aria-label={inCart ? ct.inCart : `${label} (${qty})`}
      title={inCart ? ct.inCart : label}
      onClick={() => {
        if (inCart) return router.push("/cart");
        add(product, qty);
        setPulse(true);
        setTimeout(() => setPulse(false), 450);
      }}
      className="liquid"
      style={{
        flex: "none", width: size, height: size, border: 0, borderRadius: "50%", color: "#FFFFFF", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        backgroundColor: inCart ? "#12A594" : ACCENT,
        transform: pulse ? "scale(1.12)" : "scale(1)", transition: "transform .2s, background-color .2s",
      }}
    >
      {inCart ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
      ) : (
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><path d="M3 4h2l2.4 11h11l2-8H6.2" /><circle cx="9" cy="19.5" r="1.5" /><circle cx="17" cy="19.5" r="1.5" /></svg>
      )}
    </button>
  );
}

const step: CSSProperties = {
  flex: "none", width: 36, height: 36, border: 0, borderRadius: "50%", background: "transparent", color: "var(--fg)",
  font: "inherit", fontSize: 20, lineHeight: 1, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
};

/**
 * Quantity stepper beside the add button. Before adding it picks how many to add; once the item is
 * in the cart it edits the cart line directly. The number can be typed as well as stepped.
 */
export function BuyControls({ product, label }: { product: CartProduct; label: string }) {
  const { items, setQty } = useCart();
  const ct = useT(CATALOG_T);
  const line = items.find((x) => x.id === product.id);
  const [draft, setDraft] = useState(1);
  const [text, setText] = useState<string | null>(null);
  const qty = line ? line.qty : draft;

  const set = (n: number) => {
    const v = Math.min(MAX, Math.max(1, Math.floor(n) || 1));
    if (line) setQty(product.id, v);
    else setDraft(v);
  };

  return (
    <div className="buy" style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
      <div role="group" aria-label={ct.qty} className="glass-soft buy-qty" style={{ flex: 1, minWidth: 0, height: 46, padding: "0 5px", borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button type="button" aria-label={ct.qtyLess} onClick={() => set(qty - 1)} disabled={qty <= 1} style={{ ...step, opacity: qty <= 1 ? 0.35 : 1 }}>−</button>
        <input
          aria-label={ct.qty}
          inputMode="numeric"
          value={text ?? String(qty)}
          onChange={(e) => {
            const d = e.target.value.replace(/\D/g, "").slice(0, 4);
            setText(d);
            if (d) set(Number(d));
          }}
          onBlur={() => setText(null)}
          onFocus={(e) => e.target.select()}
          style={{ width: 0, flex: 1, minWidth: 28, height: 36, border: 0, background: "transparent", color: "var(--fg)", textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700 }}
        />
        <button type="button" aria-label={ct.qtyMore} onClick={() => set(qty + 1)} disabled={qty >= MAX} style={step}>+</button>
      </div>
      <AddToCartButton product={product} label={label} qty={draft} />
    </div>
  );
}
