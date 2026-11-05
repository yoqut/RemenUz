"use client";

import Link from "next/link";

/** Breadcrumb trail: Home › Catalog › … › current. */
export function Crumbs({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav aria-label="breadcrumb" style={{ display: "flex", flexWrap: "wrap", gap: 6, fontSize: 13, color: "var(--muted)" }}>
      {items.map((it, i) => (
        <span key={i} style={{ display: "contents" }}>
          {i > 0 && <span aria-hidden="true">/</span>}
          {it.href ? <Link href={it.href} className="ind-link" style={{ color: "var(--muted)" }}>{it.name}</Link> : <span aria-current="page" style={{ color: "var(--fg)", fontWeight: 600 }}>{it.name}</span>}
        </span>
      ))}
    </nav>
  );
}
