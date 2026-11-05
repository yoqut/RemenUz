---
name: gortex-lib-6-dirs
description: "Work in the lib +6 dirs area — 46 symbols across 10 files (58% cohesion)"
---

# lib +6 dirs

46 symbols | 10 files | 58% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `app/HomeView.tsx`
- `app/catalog/CatalogView.tsx`
- `app/catalog/page.tsx`
- `app/info/[slug]/page.tsx`
- `app/product/ProductView.tsx`
- `app/product/[slug]/page.tsx`
- `lib/catalog.ts`
- `lib/i18n.ts`
- `lib/images.ts`

## Key Files

| File | Symbols |
|------|---------|
| `` | map, concat |
| `app/HomeView.tsx` | HomeView, t, lang, catNote, ProductImg, ... |
| `app/catalog/CatalogView.tsx` | ct, ProductTile |
| `app/catalog/page.tsx` | CatalogPage |
| `app/info/[slug]/page.tsx` | generateStaticParams |
| `app/product/ProductView.tsx` | ProductView, attrs, addToCart, qty, accent, ... |
| `app/product/[slug]/page.tsx` | generateStaticParams |
| `lib/catalog.ts` | formatPrice, n |
| `lib/i18n.ts` | withLogos, markets |
| `lib/images.ts` | url, fullImg |

## Entry Points

- `app/product/ProductView.tsx::ProductView`
- `app/HomeView.tsx::HomeView`
- `app/catalog/CatalogView.tsx::ProductTile`
- `app/product/ProductView.tsx::stats`
- `app/info/[slug]/page.tsx::generateStaticParams`

## Connected Communities

- **. +4 dirs** (8 cross-edges)
- **business +5 dirs** (4 cross-edges)
- **lib +4 dirs · catCode** (4 cross-edges)
- **guide +2 dirs** (3 cross-edges)
- **. +2 dirs · pickType** (2 cross-edges)
- **. +2 dirs · finderHref** (2 cross-edges)
- **components +3 dirs** (1 cross-edges)
- **components +1 dirs** (1 cross-edges)
- **. +3 dirs** (1 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-7")
explore(operation:"context", task:"understand lib +6 dirs", format:"gcx")
relations(operation:"usages", target:{symbol:"app/product/ProductView.tsx::ProductView"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
