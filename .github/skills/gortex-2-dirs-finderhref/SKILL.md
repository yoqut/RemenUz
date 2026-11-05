---
name: gortex-2-dirs-finderhref
description: "Work in the . +2 dirs · finderHref area — 9 symbols across 3 files (71% cohesion)"
---

# . +2 dirs · finderHref

9 symbols | 3 files | 71% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `components/BeltFinder.tsx`
- `lib/finder.ts`

## Key Files

| File | Symbols |
|------|---------|
| `` | push |
| `components/BeltFinder.tsx` | submit, e |
| `lib/finder.ts` | finderHref, type, slug, second, words, ... |

## Entry Points

- `components/BeltFinder.tsx::submit`
- `lib/finder.ts::finderHref`

## Connected Communities

- **. +4 dirs** (1 cross-edges)
- **lib +4 dirs · catCode** (1 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-10")
explore(operation:"context", task:"understand . +2 dirs · finderHref", format:"gcx")
relations(operation:"usages", target:{symbol:"components/BeltFinder.tsx::submit"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
