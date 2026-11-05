---
name: gortex-components-3-dirs
description: "Work in the components +3 dirs area — 26 symbols across 6 files (69% cohesion)"
---

# components +3 dirs

26 symbols | 6 files | 69% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `app/HomeView.tsx`
- `components/Header.tsx`
- `components/Logo.tsx`
- `lib/cart.tsx`
- `lib/lang.tsx`

## Key Files

| File | Symbols |
|------|---------|
| `` | search |
| `app/HomeView.tsx` | lang |
| `components/Header.tsx` | sections, spheres, setCatOpen, catOpen, langBtn, ... |
| `components/Logo.tsx` | Logo |
| `lib/cart.tsx` | w, goodsRu, m10, m100, n |
| `lib/lang.tsx` | Lang, setLang, LangCtx, l |

## Entry Points

- `components/Header.tsx::Header`

## Connected Communities

- **business +5 dirs** (3 cross-edges)
- **lib +6 dirs** (2 cross-edges)
- **. +4 dirs** (2 cross-edges)
- **components +1 dirs** (1 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-23")
explore(operation:"context", task:"understand components +3 dirs", format:"gcx")
relations(operation:"usages", target:{symbol:"components/Header.tsx::Header"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
