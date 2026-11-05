---
name: gortex-guide-2-dirs
description: "Work in the guide +2 dirs area — 39 symbols across 4 files (74% cohesion)"
---

# guide +2 dirs

39 symbols | 4 files | 74% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `app/guide/GuideView.tsx`
- `app/guide/page.tsx`
- `app/orders/OrdersView.tsx`

## Key Files

| File | Symbols |
|------|---------|
| `` | replace |
| `app/guide/GuideView.tsx` | A, n, dimA, vals, sheetLabel, ... |
| `app/guide/page.tsx` | GuidePage |
| `app/orders/OrdersView.tsx` | submitAuth, e |

## Entry Points

- `app/guide/GuideView.tsx::GuideView`
- `app/orders/OrdersView.tsx::submitAuth`

## Connected Communities

- **lib +6 dirs** (5 cross-edges)
- **lib +4 dirs · catCode** (3 cross-edges)
- **. +4 dirs** (3 cross-edges)
- **business +5 dirs** (1 cross-edges)
- **. +2 dirs · pickType** (1 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-2")
explore(operation:"context", task:"understand guide +2 dirs", format:"gcx")
relations(operation:"usages", target:{symbol:"app/guide/GuideView.tsx::GuideView"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
