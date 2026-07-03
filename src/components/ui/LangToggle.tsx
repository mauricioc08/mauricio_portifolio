"use client";

import { useI18n } from "@/lib/i18n/context";

export function LangToggle() {
  const { lang, toggle, t } = useI18n();

  return (
    <button
      type="button"
      onClick={toggle}
      title={t("lang.toggle")}
      aria-label={t("lang.toggle")}
      className="grid h-10 place-items-center rounded-[10px] border border-border px-3 font-mono text-sm text-muted transition-colors hover:border-accent hover:text-accent"
    >
      {lang === "pt" ? "PT" : "EN"}
    </button>
  );
}
