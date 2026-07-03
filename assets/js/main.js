// Orquestrador. Inicializa tema e idioma, renderiza os dados locais na hora
// (site instantâneo) e, se o Firebase estiver ligado, atualiza quando os dados
// remotos chegam. Re-renderiza ao trocar idioma.
import { initTheme } from "./modules/theme.js";
import { initI18n } from "./modules/i18n.js";
import { initNav } from "./modules/nav.js";
import { initHero } from "./modules/hero.js";
import { initReveal, observeAll } from "./modules/reveal.js";
import { renderAll, setData } from "./modules/render.js";
import { loadContent } from "./firebase/content.js";
import { applyContent } from "./modules/content.js";

function rerender() {
  renderAll();
  observeAll();
}

function boot() {
  initTheme();
  initI18n(); // define idioma antes do render

  // 1) render imediato com dados locais (fallback embutido)
  const local = loadContent((remote) => {
    // 2) quando o Firestore responde, atualiza projetos/timeline/textos
    setData(remote);
    if (remote.content) applyContent(remote.content);
    rerender();
  });
  setData(local);

  renderAll();
  initNav();
  initHero();
  initReveal();

  // troca de idioma → re-render e re-observa novos .reveal
  document.addEventListener("langchange", rerender);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
