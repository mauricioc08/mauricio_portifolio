"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { ArrowUpIcon } from "@/components/ui/icons";

export function BackToTop() {
  const { t } = useI18n();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="#hero"
      title={t("backToTop")}
      className={`accent-grad fixed bottom-[clamp(1rem,4vw,2rem)] right-[clamp(1rem,4vw,2rem)] z-40 grid h-12 w-12 place-items-center rounded-full text-[color:var(--color-on-accent)] shadow-[var(--glow)] transition-[opacity,transform,visibility] duration-300 ${
        show
          ? "visible translate-y-0 opacity-100"
          : "invisible translate-y-3 opacity-0"
      }`}
    >
      <ArrowUpIcon className="h-5 w-5" />
      <span className="sr-only">{t("backToTop")}</span>
    </a>
  );
}
