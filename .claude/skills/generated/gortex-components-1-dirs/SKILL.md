---
name: gortex-components-1-dirs
description: "Work in the components +1 dirs area — 10 symbols across 2 files (67% cohesion)"
---

# components +1 dirs

10 symbols | 2 files | 67% cohesion

## When to Use

Use this skill when working on files in:
- `components/AddToCartButton.tsx`
- `lib/cart.tsx`

## Key Files

| File | Symbols |
|------|---------|
| `components/AddToCartButton.tsx` | add, has, setPulse, AddToCartButton, inCart, ... |
| `lib/cart.tsx` | id, useCart, c, has |

## Entry Points

- `components/AddToCartButton.tsx::AddToCartButton`

## Connected Communities

- **lib +4 dirs · CartProvider** (1 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-14")
explore(operation:"context", task:"understand components +1 dirs", format:"gcx")
relations(operation:"usages", target:{symbol:"components/AddToCartButton.tsx::AddToCartButton"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
