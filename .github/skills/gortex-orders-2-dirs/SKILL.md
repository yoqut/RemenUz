---
name: gortex-orders-2-dirs
description: "Work in the orders +2 dirs area — 26 symbols across 4 files (71% cohesion)"
---

# orders +2 dirs

26 symbols | 4 files | 71% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `app/orders/OrdersView.tsx`
- `app/orders/page.tsx`
- `components/GlassSelect.tsx`

## Key Files

| File | Symbols |
|------|---------|
| `` | contains |
| `app/orders/OrdersView.tsx` | OrdersView, isAuth, err, code, shown, ... |
| `app/orders/page.tsx` | OrdersPage |
| `components/GlassSelect.tsx` | e, close |

## Entry Points

- `app/orders/OrdersView.tsx::OrdersView`
- `components/GlassSelect.tsx::close`

## Connected Communities

- **lib +6 dirs** (6 cross-edges)
- **guide +2 dirs** (2 cross-edges)
- **. +4 dirs** (1 cross-edges)
- **lib +4 dirs · CartProvider** (1 cross-edges)
- **business +5 dirs** (1 cross-edges)
- **lib +4 dirs · catCode** (1 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-11")
explore(operation:"context", task:"understand orders +2 dirs", format:"gcx")
relations(operation:"usages", target:{symbol:"app/orders/OrdersView.tsx::OrdersView"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
