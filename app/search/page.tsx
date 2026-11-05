import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchView } from "./SearchView";
import { nearestByLength } from "@/lib/finder";
import { PRODUCTS, toRow, type CatalogRow } from "@/lib/products";
import { matchQuery, parseQuery, productTokens, tokens } from "@/lib/search";

export const metadata: Metadata = { title: "Поиск" };

const LIMIT = 100;
const hay = new Map(PRODUCTS.map((p) => [p.id, productTokens(p)]));

type SP = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/** The query is only known per request, so the results stream in behind a static shell (Cache Components). */
export default function SearchPage({ searchParams }: SP) {
  return (
    <Suspense fallback={<SearchView q="" rows={[]} total={0} near={[]} loading />}>
      <Results searchParams={searchParams} />
    </Suspense>
  );
}

/**
 * Header search results. Codes match however they are typed ("8PJ1244" = "8 PJ 1244"); an exact
 * article match comes first. With no match but a length in the query, the nearest lengths are offered.
 */
async function Results({ searchParams }: SP) {
  const raw = (await searchParams).q;
  const q = (Array.isArray(raw) ? raw[0] : raw ?? "").trim().slice(0, 80);
  const query = parseQuery(q);
  const qt = query.tokens;

  let rows: CatalogRow[] = [];
  let near: CatalogRow[] = [];
  let total = 0;
  if (qt.length) {
    const compact = qt.join("");
    const hits = PRODUCTS.filter((p) => matchQuery(hay.get(p.id) ?? [], query));
    total = hits.length;
    rows = hits
      .sort((a, b) => Number(tokens(b.sku).join("") === compact) - Number(tokens(a.sku).join("") === compact))
      .slice(0, LIMIT)
      .map(toRow);
    const len = Math.max(0, ...qt.map(Number).filter((n) => n >= 50));
    // Nearest lengths among belts that still match the rest of the query ("T5" of "T5 1650").
    const rest = { tokens: qt.filter((x) => x !== String(len)), glued: query.glued.filter((g) => !g.includes(String(len))) };
    if (!rows.length && len) near = nearestByLength(PRODUCTS.filter((p) => !p.perMeter && matchQuery(hay.get(p.id) ?? [], rest)).map(toRow), len, 12);
  }

  return <SearchView q={q} rows={rows} total={total} near={near} />;
}
