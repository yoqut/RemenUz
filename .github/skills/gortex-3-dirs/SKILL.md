---
name: gortex-3-dirs
description: "Work in the . +3 dirs area — 9 symbols across 4 files (67% cohesion)"
---

# . +3 dirs

9 symbols | 4 files | 67% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `app/info/[slug]/page.tsx`
- `app/info/content.ts`
- `lib/products.ts`

## Key Files

| File | Symbols |
|------|---------|
| `` | includes |
| `app/info/[slug]/page.tsx` | slug, InfoPage, generateMetadata, slug |
| `app/info/content.ts` | isSlug, s |
| `lib/products.ts` | catId, productsIn |

## Entry Points

- `app/info/[slug]/page.tsx::InfoPage`
- `app/info/[slug]/page.tsx::generateMetadata`

## Connected Communities

- **. +4 dirs** (1 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-5")
explore(operation:"context", task:"understand . +3 dirs", format:"gcx")
relations(operation:"usages", target:{symbol:"app/info/[slug]/page.tsx::InfoPage"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
