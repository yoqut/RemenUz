---
name: gortex-cart-1-dirs
description: "Work in the cart +1 dirs area — 79 symbols across 3 files (87% cohesion)"
---

# cart +1 dirs

79 symbols | 3 files | 87% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `app/cart/CartView.tsx`
- `app/cart/page.tsx`

## Key Files

| File | Symbols |
|------|---------|
| `` | clear |
| `app/cart/CartView.tsx` | doneLead, showErr, isCompany, steps, setOrder, ... |
| `app/cart/page.tsx` | CartPage |

## Entry Points

- `app/cart/CartView.tsx::CartView`
- `app/cart/CartView.tsx::submit`
- `app/cart/CartView.tsx::newOrder`
- `app/cart/CartView.tsx::payNow`
- `app/cart/CartView.tsx::backToCart`

## Connected Communities

- **lib +6 dirs** (9 cross-edges)
- **lib +4 dirs · catCode** (2 cross-edges)
- **guide +2 dirs** (2 cross-edges)
- **. +2 dirs · pickType** (1 cross-edges)
- **. +4 dirs** (1 cross-edges)
- **lib +4 dirs · CartProvider** (1 cross-edges)
- **components +3 dirs** (1 cross-edges)
- **components +1 dirs** (1 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-0")
explore(operation:"context", task:"understand cart +1 dirs", format:"gcx")
relations(operation:"usages", target:{symbol:"app/cart/CartView.tsx::CartView"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
