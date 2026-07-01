// Tema dark/light: aplica data-theme no <html>, persiste, alterna ícones.
const STORAGE_KEY = "portfolio-theme";

function applyIcons(theme) {
  const moon = document.querySelector(".icon-moon");
  const sun = document.querySelector(".icon-sun");
  const btn = document.getElementById("theme-toggle");
  if (moon) moon.hidden = theme === "light";
  if (sun) sun.hidden = theme !== "light";
  if (btn) btn.setAttribute("aria-pressed", String(theme === "light"));

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === "light" ? "#f7f8fb" : "#0a0b0f";
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {}
  applyIcons(theme);
}

export function initTheme() {
  let saved;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch {}
  const prefersLight =
    window.matchMedia?.("(prefers-color-scheme: light)").matches;
  const theme = saved || (prefersLight ? "light" : "dark");
  setTheme(theme);

  document.getElementById("theme-toggle")?.addEventListener("click", () => {
    const next =
      document.documentElement.dataset.theme === "light" ? "dark" : "light";
    setTheme(next);
  });
}
