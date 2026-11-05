---
name: gortex-lib-4-dirs-catcode
description: "Work in the lib +4 dirs · catCode area — 22 symbols across 6 files (53% cohesion)"
---

# lib +4 dirs · catCode

22 symbols | 6 files | 53% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `app/HomeView.tsx`
- `app/product/ProductView.tsx`
- `app/product/[slug]/page.tsx`
- `lib/catalog.ts`
- `lib/products.ts`

## Key Files

| File | Symbols |
|------|---------|
| `` | trim, toUpperCase, slice, split |
| `app/HomeView.tsx` | p |
| `app/product/ProductView.tsx` | html, paragraphs |
| `app/product/[slug]/page.tsx` | p, related, trail, p, leaf, ... |
| `lib/catalog.ts` | catCode, codes, words, kids, c |
| `lib/products.ts` | Product, toCard, ProductCard |

## Entry Points

- `app/product/[slug]/page.tsx::ProductPage`
- `app/product/ProductView.tsx::paragraphs`
- `lib/catalog.ts::catCode`

## Connected Communities

- **. +4 dirs** (6 cross-edges)
- **lib +6 dirs** (5 cross-edges)
- **guide +2 dirs** (2 cross-edges)
- **. +3 dirs** (1 cross-edges)
- **lib +2 dirs** (1 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-15")
explore(operation:"context", task:"understand lib +4 dirs · catCode", format:"gcx")
relations(operation:"usages", target:{symbol:"app/product/[slug]/page.tsx::ProductPage"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
