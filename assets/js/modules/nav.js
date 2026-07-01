// Navegação: header sombreado no scroll, menu mobile, scroll-spy da seção
// ativa e botão "voltar ao topo". Reaproveita a lógica do main.js original,
// corrigida e sem dependências externas.
export function initNav() {
  const header = document.getElementById("site-header");
  const menuBtn = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const backToTop = document.getElementById("back-to-top");
  const links = [...document.querySelectorAll(".nav-links a")];
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  // menu mobile
  const closeMenu = () => {
    document.body.classList.remove("menu-open");
    menuBtn?.setAttribute("aria-expanded", "false");
  };
  menuBtn?.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  navLinks?.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // scroll-driven UI
  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle("scrolled", y > 8);
    backToTop?.classList.toggle("show", y > 500);

    const line = y + window.innerHeight / 2;
    let activeId = null;
    for (const sec of sections) {
      if (line >= sec.offsetTop && line < sec.offsetTop + sec.offsetHeight) {
        activeId = sec.id;
        break;
      }
    }
    links.forEach((a) =>
      a.classList.toggle("active", a.getAttribute("href") === `#${activeId}`)
    );
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();
}
