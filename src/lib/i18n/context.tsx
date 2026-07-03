"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ContentDoc, Lang } from "@/types";
import { translate, type TranslationKey } from "./dictionary";

const STORAGE_KEY = "portfolio-lang";

type I18nContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  overrides = null,
}: {
  children: React.ReactNode;
  overrides?: ContentDoc | null;
}) {
  const [lang, setLangState] = useState<Lang>("pt");

  // hidrata idioma salvo (ou do navegador) após montar — evita mismatch de SSR
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {}
    const initial: Lang = saved
      ? (saved as Lang)
      : navigator.language?.startsWith("en")
        ? "en"
        : "pt";
    setLangState(initial);
    document.documentElement.lang = initial === "pt" ? "pt-BR" : "en";
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    document.documentElement.lang = l === "pt" ? "pt-BR" : "en";
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  }, []);

  const toggle = useCallback(
    () => setLang(lang === "pt" ? "en" : "pt"),
    [lang, setLang]
  );

  const t = useCallback(
    (key: TranslationKey) => translate(lang, key, overrides),
    [lang, overrides]
  );

  const value = useMemo(
    () => ({ lang, setLang, toggle, t }),
    [lang, setLang, toggle, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n deve ser usado dentro de I18nProvider");
  return ctx;
}
