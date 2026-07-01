// Orquestrador. Inicializa tema e idioma antes de renderizar os dados,
// depois liga navegação, hero e reveals. Re-renderiza ao trocar idioma.
import { initTheme } from "./modules/theme.js";
import { initI18n } from "./modules/i18n.js";
import { initNav } from "./modules/nav.js";
import { initHero } from "./modules/hero.js";
import { initReveal, observeAll } from "./modules/reveal.js";
import { renderAll } from "./modules/render.js";

function boot() {
  initTheme();
  initI18n(); // define idioma antes do render
  renderAll();
  initNav();
  initHero();
  initReveal();

  // dados dependem do idioma → re-render e re-observa novos .reveal
  document.addEventListener("langchange", () => {
    renderAll();
    observeAll();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
