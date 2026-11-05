"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useCart } from "@/lib/cart";
import { useFav } from "@/lib/favorites";
import { T } from "@/lib/i18n";
import { useT } from "@/lib/lang";

const svg = (d: ReactNode) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);

/**
 * Phone-only bottom tab bar (hidden from 641px up by CSS): home, catalog, belt finder, favourites and
 * cart with their counts. The current section is highlighted.
 */
export function MobileTabBar() {
  const t = useT(T);
  const path = usePathname();
  const { count } = useCart();
  const fav = useFav().items.length;

  const tabs = [
    { href: "/", label: t.tabHome, on: path === "/", icon: svg(<><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></>) },
    { href: "/catalog", label: t.tabCat, on: path.startsWith("/catalog") || path.startsWith("/product") || path.startsWith("/search"), icon: svg(<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>) },
    { href: "/finder", label: t.tabFind, on: path.startsWith("/finder"), icon: svg(<><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4M8 11h6M11 8v6" /></>) },
    { href: "/favorites", label: t.favL, on: path.startsWith("/favorites"), badge: fav, icon: svg(<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />) },
    { href: "/cart", label: t.cartL, on: path.startsWith("/cart"), badge: count, icon: svg(<><path d="M3 4h2l2.4 11h11l2-8H6.2" /><circle cx="9" cy="19.5" r="1.5" /><circle cx="17" cy="19.5" r="1.5" /></>) },
  ];

  return (
    <nav aria-label={t.tabsLabel} className="tabbar">
      {tabs.map((tab) => (
        <Link key={tab.href} href={tab.href} aria-current={tab.on ? "page" : undefined} className={tab.on ? "tab tab-on" : "tab"}>
          <span style={{ position: "relative", display: "flex" }}>
            {tab.icon}
            {!!tab.badge && <span className="tab-badge" aria-label={`${tab.badge}`}>{tab.badge > 99 ? "99+" : tab.badge}</span>}
          </span>
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
