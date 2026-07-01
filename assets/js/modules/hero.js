// Animação do terminal (assinatura). Digita `whoami` e revela a saída.
// Respeita prefers-reduced-motion e re-renderiza ao trocar de idioma.
import { t } from "./i18n.js";

const reduced = window.matchMedia?.(
  "(prefers-reduced-motion: reduce)"
).matches;

let timers = [];

function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}

function renderStatic(el) {
  el.innerHTML = `<span class="prompt">mauricio@dev:~$</span> <span class="cmd">${t(
    "hero.term.cmd"
  )}</span>\n<span class="out">${t("hero.term.out")}</span>`;
}

function typeAnimation(el) {
  const cmd = t("hero.term.cmd");
  const out = t("hero.term.out");
  el.innerHTML = `<span class="prompt">mauricio@dev:~$</span> <span class="cmd" id="tw-cmd"></span><span class="cursor" id="tw-cursor"></span>`;
  const cmdEl = el.querySelector("#tw-cmd");
  const cursor = el.querySelector("#tw-cursor");

  let i = 0;
  const step = () => {
    if (i <= cmd.length) {
      cmdEl.textContent = cmd.slice(0, i);
      i += 1;
      timers.push(setTimeout(step, 90));
    } else {
      timers.push(
        setTimeout(() => {
          const outEl = document.createElement("span");
          outEl.className = "out";
          outEl.textContent = out;
          cursor.before("\n", outEl);
        }, 350)
      );
    }
  };
  step();
}

export function initHero() {
  const el = document.getElementById("terminal-body");
  if (!el) return;

  const run = () => {
    clearTimers();
    if (reduced) renderStatic(el);
    else typeAnimation(el);
  };

  run();
  document.addEventListener("langchange", run);
}
