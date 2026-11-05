---
name: gortex-lib-4-dirs-cartprovider
description: "Work in the lib +4 dirs · CartProvider area — 49 symbols across 6 files (86% cohesion)"
---

# lib +4 dirs · CartProvider

49 symbols | 6 files | 86% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `app/info/InfoView.tsx`
- `app/layout.tsx`
- `components/GlassSelect.tsx`
- `lib/cart.tsx`
- `lib/lang.tsx`

## Key Files

| File | Symbols |
|------|---------|
| `` | startsWith, removeEventListener, stringify, addEventListener, querySelector, ... |
| `app/info/InfoView.tsx` | SmartLink |
| `app/layout.tsx` | RootLayout |
| `components/GlassSelect.tsx` | i, openAt, GlassSelect, current, openAt, ... |
| `lib/cart.tsx` | setReady, lastRemoved, ready, setItems, clear, ... |
| `lib/lang.tsx` | LangProvider, setLang, lang, setLangState |

## Entry Points

- `lib/cart.tsx::CartProvider`
- `components/GlassSelect.tsx::onKey`
- `components/GlassSelect.tsx::GlassSelect`
- `lib/lang.tsx::LangProvider`
- `lib/cart.tsx::onStorage`

## Connected Communities

- **lib +6 dirs** (3 cross-edges)
- **. +4 dirs** (3 cross-edges)
- **. +3 dirs** (1 cross-edges)
- **lib +4 dirs · catCode** (1 cross-edges)
- **. +2 dirs · pickType** (1 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-12")
explore(operation:"context", task:"understand lib +4 dirs · CartProvider", format:"gcx")
relations(operation:"usages", target:{symbol:"lib/cart.tsx::CartProvider"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
