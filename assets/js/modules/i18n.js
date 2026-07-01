// i18n: aplica strings PT/EN via [data-i18n], persiste em localStorage,
// atualiza <html lang> e emite evento "langchange" para re-render de dados.
import { strings } from "../data/i18n.js";

const STORAGE_KEY = "portfolio-lang";
let current = "pt";

export function getLang() {
  return current;
}

export function t(key) {
  return strings[current]?.[key] ?? strings.pt[key] ?? key;
}

function apply() {
  const dict = strings[current];
  document.documentElement.lang = current === "pt" ? "pt-BR" : "en";

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const v = dict[el.dataset.i18n];
    if (v != null) el.textContent = v;
  });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const v = dict[el.dataset.i18nTitle];
    if (v != null) el.title = v;
  });
  document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
    const v = dict[el.dataset.i18nAlt];
    if (v != null) el.alt = v;
  });

  const btn = document.getElementById("lang-toggle");
  if (btn) btn.textContent = current === "pt" ? "PT" : "EN";
}

export function setLang(lang) {
  current = strings[lang] ? lang : "pt";
  try {
    localStorage.setItem(STORAGE_KEY, current);
  } catch {}
  apply();
  document.dispatchEvent(new CustomEvent("langchange", { detail: current }));
}

export function initI18n() {
  let saved;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch {}
  if (!saved) {
    saved = navigator.language?.startsWith("en") ? "en" : "pt";
  }
  current = strings[saved] ? saved : "pt";
  apply();

  document
    .getElementById("lang-toggle")
    ?.addEventListener("click", () => setLang(current === "pt" ? "en" : "pt"));
}
