"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

/** One cart line. Quantity is pieces, or metres for belts sold by the metre. */
export type CartItem = {
  id: number;
  slug: string;
  name: string;
  sku: string;
  brand: string | null;
  price: number;
  perMeter: boolean;
  img: string | null;
  qty: number;
};

export type CartProduct = Omit<CartItem, "qty">;

type CartCtx = {
  items: CartItem[];
  /** Number of cart lines (positions), shown on the cart badges. */
  count: number;
  subtotal: number;
  ready: boolean;
  add: (p: CartProduct, qty?: number) => void;
  setQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
  /** The line removed last, so it can be put back ("Вернуть"). */
  lastRemoved: CartItem | null;
  undoRemove: () => void;
  clear: () => void;
  has: (id: number) => boolean;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "remen-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [lastRemoved, setLastRemoved] = useState<{ item: CartItem; index: number } | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage after mount
      if (Array.isArray(saved)) setItems(saved.filter((x) => x && typeof x.id === "number" && x.qty > 0));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  // Keep tabs in sync: a change in one tab updates the badge and cart in the others.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== KEY) return;
      try {
        setItems(JSON.parse(e.newValue || "[]"));
      } catch {}
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const add = useCallback((p: CartProduct, qty = 1) => {
    const n = Math.max(1, Math.floor(qty));
    setItems((xs) => (xs.some((x) => x.id === p.id) ? xs.map((x) => (x.id === p.id ? { ...x, qty: x.qty + n } : x)) : [...xs, { ...p, qty: n }]));
  }, []);

  const setQty = useCallback((id: number, qty: number) => {
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, qty: Math.max(1, Math.floor(qty)) } : x)));
  }, []);

  const remove = useCallback((id: number) => {
    setItems((xs) => {
      const index = xs.findIndex((x) => x.id === id);
      if (index < 0) return xs;
      setLastRemoved({ item: xs[index], index });
      return xs.filter((x) => x.id !== id);
    });
  }, []);

  const undoRemove = useCallback(() => {
    if (!lastRemoved) return;
    const { item, index } = lastRemoved;
    setItems((xs) => (xs.some((x) => x.id === item.id) ? xs : [...xs.slice(0, index), item, ...xs.slice(index)]));
    setLastRemoved(null);
  }, [lastRemoved]);

  const clear = useCallback(() => {
    setItems([]);
    setLastRemoved(null);
  }, []);

  const value = useMemo<CartCtx>(
    () => ({
      items,
      count: items.length,
      subtotal: items.reduce((s, x) => s + x.price * x.qty, 0),
      ready,
      add,
      setQty,
      remove,
      lastRemoved: lastRemoved?.item ?? null,
      undoRemove,
      clear,
      has: (id) => items.some((x) => x.id === id),
    }),
    [items, ready, add, setQty, remove, lastRemoved, undoRemove, clear],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside <CartProvider>");
  return c;
}

/** "1 товар", "3 товара", "5 товаров". */
export function goodsRu(n: number) {
  const m10 = n % 10, m100 = n % 100;
  const w = m10 === 1 && m100 !== 11 ? "товар" : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? "товара" : "товаров";
  return `${n} ${w}`;
}
