---
name: gortex-components
description: "Work in the components area — 20 symbols across 1 files (77% cohesion)"
---

# components

20 symbols | 1 files | 77% cohesion

## When to Use

Use this skill when working on files in:
- `components/BeltFinder.tsx`

## Key Files

| File | Symbols |
|------|---------|
| `components/BeltFinder.tsx` | lang, submit, t, setProf, def, ... |

## Entry Points

- `components/BeltFinder.tsx::BeltFinder`

## Connected Communities

- **business +5 dirs** (2 cross-edges)
- **lib +6 dirs** (2 cross-edges)
- **. +2 dirs · pickType** (2 cross-edges)
- **guide +2 dirs** (1 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-9")
explore(operation:"context", task:"understand components", format:"gcx")
relations(operation:"usages", target:{symbol:"components/BeltFinder.tsx::BeltFinder"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
