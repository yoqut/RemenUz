---
name: gortex-info-item
description: "Work in the info · item area — 5 symbols across 1 files (75% cohesion)"
---

# info · item

5 symbols | 1 files | 75% cohesion

## When to Use

Use this skill when working on files in:
- `app/info/InfoView.tsx`

## Key Files

| File | Symbols |
|------|---------|
| `app/info/InfoView.tsx` | on, id, navStyle, on, item |

## Entry Points

- `app/info/InfoView.tsx::item`

## How to Explore

```
analyze(operation:"communities", id:"community-3")
explore(operation:"context", task:"understand info · item", format:"gcx")
relations(operation:"usages", target:{symbol:"app/info/InfoView.tsx::item"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
