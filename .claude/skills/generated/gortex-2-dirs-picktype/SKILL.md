---
name: gortex-2-dirs-picktype
description: "Work in the . +2 dirs · pickType area — 7 symbols across 3 files (43% cohesion)"
---

# . +2 dirs · pickType

7 symbols | 3 files | 43% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `components/BeltFinder.tsx`
- `lib/finder.ts`

## Key Files

| File | Symbols |
|------|---------|
| `` | find |
| `components/BeltFinder.tsx` | pickType, first, k |
| `lib/finder.ts` | type, BeltType, profilesOf |

## Entry Points

- `components/BeltFinder.tsx::pickType`
- `lib/finder.ts::profilesOf`

## Connected Communities

- **lib +4 dirs · catCode** (1 cross-edges)
- **lib +2 dirs** (1 cross-edges)
- **. +4 dirs** (1 cross-edges)
- **lib +6 dirs** (1 cross-edges)
- **guide +2 dirs** (1 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-16")
explore(operation:"context", task:"understand . +2 dirs · pickType", format:"gcx")
relations(operation:"usages", target:{symbol:"components/BeltFinder.tsx::pickType"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
