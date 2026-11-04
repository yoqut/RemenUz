"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useLang } from "@/lib/lang";

export type Theme = "dark" | "light";

export const THEME_KEY = "remen-theme";

/** Runs in <head> before first paint: the page is served light, and a saved dark choice applies without a flash. */
export const themeInitScript = `try{if(localStorage.getItem("${THEME_KEY}")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`;

/** Sun/moon button that flips <html data-theme> between light (the default) and dark. */
export function ThemeToggle({ style }: { style?: CSSProperties }) {
  const { lang } = useLang();
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read what the head script applied
    if (document.documentElement.dataset.theme === "dark") setTheme("dark");
  }, []);

  const flip = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
  };

  const label = theme === "light"
    ? (lang === "uz" ? "Qorongʻi mavzu" : "Тёмная тема")
    : (lang === "uz" ? "Yorugʻ mavzu" : "Светлая тема");

  return (
    <button type="button" onClick={flip} aria-label={label} title={label} className="glass-soft" style={{ color: "var(--fg)", cursor: "pointer", ...style }}>
      {theme === "light" ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /></svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
      )}
    </button>
  );
}
