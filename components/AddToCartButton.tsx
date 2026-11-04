"use client";

import { useState } from "react";
import { ACCENT } from "@/lib/i18n";
import { useCart, type CartProduct } from "@/lib/cart";

/** Round "+" button on product cards; adds one unit and shows a check while the item is in the cart. */
export function AddToCartButton({ product, label, size = 46 }: { product: CartProduct; label: string; size?: number }) {
  const { add, has } = useCart();
  const [pulse, setPulse] = useState(false);
  const inCart = has(product.id);
  return (
    <button
      type="button"
      aria-label={inCart ? `${label} (+1)` : label}
      title={inCart ? "В корзине — нажмите, чтобы добавить ещё" : label}
      onClick={() => {
        add(product, 1);
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
      )}
    </button>
  );
}
