"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ProductCard } from "./products";

type FavCtx = { items: ProductCard[]; has: (id: number) => boolean; toggle: (p: ProductCard) => void };

const Ctx = createContext<FavCtx>({ items: [], has: () => false, toggle: () => {} });

const KEY = "remen-fav";

/** Favourites ("Избранное"): whole product cards kept in localStorage, so /favorites renders without a lookup. */
export function FavProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ProductCard[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage after mount
      if (Array.isArray(saved)) setItems(saved);
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  const has = (id: number) => items.some((p) => p.id === id);
  const toggle = (p: ProductCard) => setItems((cur) => (cur.some((x) => x.id === p.id) ? cur.filter((x) => x.id !== p.id) : [p, ...cur]));

  return <Ctx.Provider value={{ items, has, toggle }}>{children}</Ctx.Provider>;
}

export const useFav = () => useContext(Ctx);
