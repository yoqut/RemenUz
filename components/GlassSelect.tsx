"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

export type GlassOption = { value: string; label: string; hint?: string; muted?: boolean };

/**
 * Dropdown in the Liquid Glass style, replacing the browser's grey native <select> popup.
 * Button + listbox with keyboard support (↑ ↓ Home End Enter Esc, type-ahead by first letter).
 */
export function GlassSelect({ id, value, options, onChange, labelledBy }: {
  id: string;
  value: string;
  options: GlassOption[];
  onChange: (v: string) => void;
  labelledBy: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const listId = useId();
  const current = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  useEffect(() => {
    if (open) list.current?.querySelector<HTMLElement>(`[data-i="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const openAt = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };
  const pick = (i: number) => {
    onChange(options[i].value);
    setOpen(false);
  };

  const onKey = (e: KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) { e.preventDefault(); openAt(); }
      return;
    }
    if (e.key === "Escape") { e.preventDefault(); setOpen(false); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(options.length - 1, a + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === "Home") { e.preventDefault(); setActive(0); }
    else if (e.key === "End") { e.preventDefault(); setActive(options.length - 1); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(active); }
    else if (e.key === "Tab") setOpen(false);
    else if (e.key.length === 1) {
      const i = options.findIndex((o) => o.label.toLowerCase().startsWith(e.key.toLowerCase()));
      if (i >= 0) setActive(i);
    }
  };

  return (
    <div ref={root} style={{ position: "relative", minWidth: 0 }}>
      <button
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${labelledBy} ${id}`}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : openAt())}
        onKeyDown={onKey}
        className="field"
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, textAlign: "left", cursor: "pointer",
          borderColor: open ? "rgb(var(--ink) / .55)" : undefined, boxShadow: open ? "inset 0 2px 6px rgba(0,0,0,.3), 0 0 0 3px rgba(255,255,255,.12)" : undefined,
        }}
      >
        <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{current?.label}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true" style={{ flex: "none", opacity: 0.8, transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <ul
          ref={list}
          id={listId}
          role="listbox"
          aria-labelledby={labelledBy}
          className="select-pop"
          style={{
            position: "absolute", zIndex: 30, top: "calc(100% + 8px)", left: 0, minWidth: "100%", width: "max-content", maxWidth: 280, margin: 0, padding: 6, listStyle: "none",
            maxHeight: 280, overflowY: "auto", borderRadius: 20,
            backdropFilter: "blur(24px) saturate(160%)", WebkitBackdropFilter: "blur(24px) saturate(160%)", border: "1px solid rgb(var(--ink) / .18)",
          }}
        >
          {options.map((o, i) => {
            const selected = o.value === value;
            const hot = i === active;
            return (
              <li
                key={o.value}
                id={`${listId}-${i}`}
                data-i={i}
                role="option"
                aria-selected={selected}
                onPointerEnter={() => setActive(i)}
                onClick={() => pick(i)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, minHeight: 44, padding: "0 12px", borderRadius: 14, cursor: "pointer",
                  background: hot ? "rgb(var(--ink) / .12)" : "transparent",
                  color: o.muted ? "rgb(var(--ink) / .55)" : "var(--fg)", fontWeight: selected ? 700 : 500, fontSize: 15,
                }}
              >
                <span style={{ flex: "none", width: 18, color: "var(--promo)" }} aria-hidden="true">
                  {selected && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                  )}
                </span>
                <span style={{ flex: 1, minWidth: 0, whiteSpace: "nowrap" }}>{o.label}</span>
                {o.hint && <span style={{ flex: "none", marginLeft: 12, whiteSpace: "nowrap", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgb(var(--ink) / .6)" }}>{o.hint}</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
