"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "ru" | "uz";

type LangCtx = { lang: Lang; setLang: (l: Lang) => void };

const Ctx = createContext<LangCtx>({ lang: "ru", setLang: () => {} });

const KEY = "remen-lang";

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage after mount
      if (saved === "ru" || saved === "uz") setLangState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {}
  };

  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);

/** Pick the dictionary for the current language: `const t = useT(DICT)`. */
export function useT<T>(dict: { ru: T; uz: T }): T {
  const { lang } = useLang();
  return dict[lang] ?? dict.ru;
}
