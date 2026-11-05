---
name: gortex-lib-2-dirs
description: "Work in the lib +2 dirs area — 7 symbols across 4 files (63% cohesion)"
---

# lib +2 dirs

7 symbols | 4 files | 63% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `app/product/[slug]/page.tsx`
- `lib/catalog.ts`
- `lib/products.ts`

## Key Files

| File | Symbols |
|------|---------|
| `` | get |
| `app/product/[slug]/page.tsx` | generateMetadata, p |
| `lib/catalog.ts` | getCategory, id |
| `lib/products.ts` | getProduct, slug |

## Entry Points

- `app/product/[slug]/page.tsx::generateMetadata`

## How to Explore

```
analyze(operation:"communities", id:"community-25")
explore(operation:"context", task:"understand lib +2 dirs", format:"gcx")
relations(operation:"usages", target:{symbol:"app/product/[slug]/page.tsx::generateMetadata"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
