---
name: gortex-info-infodict
description: "Work in the info · InfoDict area — 4 symbols across 1 files (86% cohesion)"
---

# info · InfoDict

4 symbols | 1 files | 86% cohesion

## When to Use

Use this skill when working on files in:
- `app/info/content.ts`

## Key Files

| File | Symbols |
|------|---------|
| `app/info/content.ts` | InfoDict, InfoCard, InfoPage, Slug |

## How to Explore

```
analyze(operation:"communities", id:"community-4")
explore(operation:"context", task:"understand info · InfoDict", format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
