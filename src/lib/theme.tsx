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

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // o data-theme já foi aplicado pelo script inline (sem flash);
  // aqui só sincronizamos o estado React com o DOM.
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const current =
      (document.documentElement.getAttribute("data-theme") as Theme) || "dark";
    setTheme(current);
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
