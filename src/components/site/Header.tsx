"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LangToggle } from "@/components/ui/LangToggle";
import { MenuIcon } from "@/components/ui/icons";
import type { TranslationKey } from "@/lib/i18n/dictionary";

const NAV: { href: string; key: TranslationKey }[] = [
  { href: "#about", key: "nav.about" },
  { href: "#experience", key: "nav.experience" },
  { href: "#projects", key: "nav.projects" },
  { href: "#skills", key: "nav.skills" },
  { href: "#contact", key: "nav.contact" },
];

export function Header() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const sections = NAV.map((n) =>
      document.querySelector<HTMLElement>(n.href)
    ).filter(Boolean) as HTMLElement[];

    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const line = window.scrollY + window.innerHeight / 2;
      const current = sections.find(
        (s) => line >= s.offsetTop && line < s.offsetTop + s.offsetHeight
      );
      setActiveId(current?.id ?? null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 flex h-[var(--nav-h)] items-center border-b transition-colors ${
        scrolled
          ? "border-border bg-[color-mix(in_oklab,var(--color-bg)_72%,transparent)] backdrop-blur-[14px]"
          : "border-transparent"
      }`}
    >
      <div className="wrapper flex items-center justify-between gap-4">
        <Link href="#hero" className="font-mono text-[1.05rem] font-medium tracking-tight">
          mauricio<b className="text-accent">.dev</b>
        </Link>

        {/* nav desktop */}
        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-[1.6rem] md:flex"
        >
          {NAV.map((item) => {
            const active = activeId === item.href.slice(1);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-[0.95rem] transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-[image:var(--accent-grad)] after:transition-transform ${
                  active
                    ? "text-text after:scale-x-100"
                    : "text-muted hover:text-text"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LangToggle />
          <ThemeToggle />
          <button
            type="button"
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center text-text md:hidden"
          >
            <MenuIcon className="h-[26px] w-[26px]" />
          </button>
        </div>
      </div>

      {/* menu mobile */}
      {menuOpen && (
        <nav
          aria-label="Navegação principal"
          className="absolute inset-x-0 top-[var(--nav-h)] flex flex-col border-b border-border bg-[color-mix(in_oklab,var(--color-bg)_92%,transparent)] px-[var(--gutter)] py-4 backdrop-blur-[16px] md:hidden"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="border-b border-border py-[0.9rem] text-[1.05rem] text-muted"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
