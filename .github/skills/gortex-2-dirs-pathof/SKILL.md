---
name: gortex-2-dirs-pathof
description: "Work in the . +2 dirs · pathOf area — 7 symbols across 3 files (71% cohesion)"
---

# . +2 dirs · pathOf

7 symbols | 3 files | 71% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `app/HomeView.tsx`
- `lib/catalog.ts`

## Key Files

| File | Symbols |
|------|---------|
| `` | unshift |
| `app/HomeView.tsx` | c |
| `lib/catalog.ts` | out, pathOf, Category, id, c |

## Connected Communities

- **lib +2 dirs** (1 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-18")
explore(operation:"context", task:"understand . +2 dirs · pathOf", format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
