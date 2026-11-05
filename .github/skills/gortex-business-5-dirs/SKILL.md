---
name: gortex-business-5-dirs
description: "Work in the business +5 dirs area — 26 symbols across 8 files (57% cohesion)"
---

# business +5 dirs

26 symbols | 8 files | 57% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `app/business/BusinessView.tsx`
- `app/business/page.tsx`
- `app/catalog/CatalogView.tsx`
- `app/info/InfoView.tsx`
- `components/Footer.tsx`
- `components/PageShell.tsx`
- `lib/lang.tsx`

## Key Files

| File | Symbols |
|------|---------|
| `` | info, charAt |
| `app/business/BusinessView.tsx` | BusinessView, t, markets |
| `app/business/page.tsx` | BusinessPage |
| `app/catalog/CatalogView.tsx` | lang, SubCard, ct |
| `app/info/InfoView.tsx` | t, groupTitle, ipl, item, gt, ... |
| `components/Footer.tsx` | Footer, t |
| `components/PageShell.tsx` | PageShell, lang |
| `lib/lang.tsx` | T, useLang, dict, lang, useT |

## Entry Points

- `app/info/InfoView.tsx::InfoView`
- `app/catalog/CatalogView.tsx::SubCard`
- `app/business/BusinessView.tsx::BusinessView`
- `components/PageShell.tsx::PageShell`

## Connected Communities

- **lib +6 dirs** (8 cross-edges)
- **lib +4 dirs · catCode** (2 cross-edges)
- **. +4 dirs** (2 cross-edges)
- **info · item** (1 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-24")
explore(operation:"context", task:"understand business +5 dirs", format:"gcx")
relations(operation:"usages", target:{symbol:"app/info/InfoView.tsx::InfoView"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
