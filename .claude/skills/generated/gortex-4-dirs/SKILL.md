---
name: gortex-4-dirs
description: "Work in the . +4 dirs area — 39 symbols across 5 files (60% cohesion)"
---

# . +4 dirs

39 symbols | 5 files | 60% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `app/catalog/CatalogView.tsx`
- `app/page.tsx`
- `components/Header.tsx`
- `lib/catalog.ts`

## Key Files

| File | Symbols |
|------|---------|
| `` | every, add, filter, sort, toLowerCase, ... |
| `app/catalog/CatalogView.tsx` | setSort, reset, trail, cat, reset, ... |
| `app/page.tsx` | fresh, Home, offers, seen |
| `components/Header.tsx` | lang, kids, CatCard |
| `lib/catalog.ts` | catName, childrenOf, c, id, lang |

## Entry Points

- `app/catalog/CatalogView.tsx::CatalogView`
- `app/page.tsx::Home`
- `components/Header.tsx::CatCard`

## Connected Communities

- **lib +6 dirs** (9 cross-edges)
- **lib +4 dirs · catCode** (6 cross-edges)
- **business +5 dirs** (4 cross-edges)
- **lib +2 dirs** (2 cross-edges)
- **. +2 dirs · pathOf** (1 cross-edges)
- **components +1 dirs** (1 cross-edges)
- **. +3 dirs** (1 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-8")
explore(operation:"context", task:"understand . +4 dirs", format:"gcx")
relations(operation:"usages", target:{symbol:"app/catalog/CatalogView.tsx::CatalogView"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
