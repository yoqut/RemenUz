---
name: gortex-catalog-slug
description: "Work in the catalog/[slug] area — 5 symbols across 1 files (55% cohesion)"
---

# catalog/[slug]

5 symbols | 1 files | 55% cohesion

## When to Use

Use this skill when working on files in:
- `app/catalog/[slug]/page.tsx`

## Key Files

| File | Symbols |
|------|---------|
| `app/catalog/[slug]/page.tsx` | c, id, isListed, CategoryPage, generateStaticParams |

## Entry Points

- `app/catalog/[slug]/page.tsx::generateStaticParams`
- `app/catalog/[slug]/page.tsx::CategoryPage`

## Connected Communities

- **lib +6 dirs** (2 cross-edges)
- **. +4 dirs** (1 cross-edges)
- **catalog/[slug] +1 dirs** (1 cross-edges)
- **. +3 dirs** (1 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-1")
explore(operation:"context", task:"understand catalog/[slug]", format:"gcx")
relations(operation:"usages", target:{symbol:"app/catalog/[slug]/page.tsx::generateStaticParams"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
