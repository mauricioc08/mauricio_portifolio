"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "dark" | "light";
const STORAGE_KEY = "portfolio-theme";

type ThemeContextValue = { theme: Theme; toggle: () => void };
const ThemeContext = createContext<ThemeContextValue | null>(null);

function readThemeFromDom(): Theme {
  if (typeof document === "undefined") return "dark";
  return (document.documentElement.getAttribute("data-theme") as Theme) || "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // o data-theme já foi aplicado pelo script inline (sem flash); o estado React
  // é inicializado a partir dele. O efeito abaixo só re-sincroniza se o DOM
  // divergir do estado após a hidratação (não dispara setState em caso normal).
  const [theme, setTheme] = useState<Theme>("dark");

  // Sincroniza o estado React com o `data-theme` que o script inline aplicou
  // antes da hidratação (fonte externa = DOM). É o caso legítimo de "ler sistema
  // externo após montar"; o updater funcional evita render extra se já bater.
  useEffect(() => {
    const domTheme = readThemeFromDom();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme((prev) => (prev === domTheme ? prev : domTheme));
  }, []);

  const apply = useCallback((next: Theme) => {
    document.documentElement.setAttribute("data-theme", next);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", next === "light" ? "#f7f8fb" : "#0a0b0f");
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    setTheme(next);
  }, []);

  const toggle = useCallback(
    () => apply(theme === "light" ? "dark" : "light"),
    [theme, apply]
  );

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme deve ser usado dentro de ThemeProvider");
  return ctx;
}
