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
  setOverrides: (o: ContentDoc | null) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readInitialLang(): Lang {
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch {}
  if (saved === "pt" || saved === "en") return saved;
  return navigator.language?.startsWith("en") ? "en" : "pt";
}

export function I18nProvider({
  children,
  overrides: initialOverrides = null,
}: {
  children: React.ReactNode;
  overrides?: ContentDoc | null;
}) {
  const [lang, setLangState] = useState<Lang>("pt");
  const [overrides, setOverrides] = useState<ContentDoc | null>(
    initialOverrides
  );

  // hidrata idioma salvo (localStorage) ou do navegador após montar. Sistema
  // externo (browser API) → não pode ser estado derivado nem inicializador
  // (rodaria no SSR e daria mismatch). Efeito de sincronização legítimo.
  useEffect(() => {
    const initial = readInitialLang();
    document.documentElement.lang = initial === "pt" ? "pt-BR" : "en";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLangState(initial);
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
    () => ({ lang, setLang, toggle, t, setOverrides }),
    [lang, setLang, toggle, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n deve ser usado dentro de I18nProvider");
  return ctx;
}
