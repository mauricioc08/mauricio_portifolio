// Reveal on scroll via IntersectionObserver (substitui ScrollReveal/CDN).
// Chamado após render para observar elementos criados dinamicamente.
let observer;

export function initReveal() {
  if (!("IntersectionObserver" in window)) {
    document
      .querySelectorAll(".reveal")
      .forEach((n) => n.classList.add("is-visible"));
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
  );

  observeAll();
}

export function observeAll() {
  if (!observer) return;
  document
    .querySelectorAll(".reveal:not(.is-visible)")
    .forEach((n) => observer.observe(n));
}
