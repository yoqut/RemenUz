// Size-aware product search shared by the header search, catalog filter and finder.
// Belt codes are typed every which way: "T5 1645", "t5-1645", "8PJ1244", "SPZ1250", "spz 1250 lp".
// Both the query and the product text are cut into letter runs and number runs, so all of those
// become the same tokens ("8 pj 1244"), and each query token must start some product token.

/** Lower-cased letter and number runs; decimals ("85.00") stay one token. */
export function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/(\p{L})(?=\d)|(\d)(?=\p{L})/gu, "$1$2 ")
    .split(/[^\p{L}\d.]+|(?<!\d)\.|\.(?!\d)/u)
    .filter(Boolean);
}

/** Tokens of what a product can be found by: name, article and brand. */
export const productTokens = (p: { name: string; sku: string; brand: string | null }) => tokens(`${p.name} ${p.sku} ${p.brand ?? ""}`);

/**
 * A parsed query: its tokens, plus the letter/number pairs that were typed glued together ("T5",
 * "8PJ", "SPZ1250"). A glued pair is one code, so it must stay adjacent in the product as well;
 * words typed apart ("MEGADYNE 1400") may match anywhere.
 */
export type Query = { tokens: string[]; glued: [string, string][] };

export function parseQuery(raw: string): Query {
  const glued: [string, string][] = [];
  for (const m of raw.toLowerCase().replace(/ё/g, "е").matchAll(/(?<=\p{L})(?=\d)|(?<=\d)(?=\p{L})/gu)) {
    const i = m.index ?? 0;
    const left = raw.slice(0, i).toLowerCase().match(/(\p{L}+|\d+(?:[.,]\d+)?)$/u)?.[1];
    const right = raw.slice(i).toLowerCase().match(/^(\p{L}+|\d+)/u)?.[1];
    if (left && right) glued.push([left.replace(",", "."), right]);
  }
  return { tokens: tokens(raw), glued };
}

/** True when every query token is the start of some product token (so "164" already finds 1645). */
export function matches(hay: string[], query: string[]): boolean {
  return query.every((q) => hay.some((h) => h.startsWith(q)));
}

/** `matches`, and every glued pair of the query sits side by side in the product ("t" right before "5"). */
export function matchQuery(hay: string[], q: Query): boolean {
  return matches(hay, q.tokens) && q.glued.every(([a, b]) => hay.some((h, j) => h === a && !!hay[j + 1]?.startsWith(b)));
}
