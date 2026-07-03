"use client";

import { useTheme } from "@/lib/theme";
import { useI18n } from "@/lib/i18n/context";
import { MoonIcon, SunIcon } from "./icons";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { t } = useI18n();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      title={t("theme.toggle")}
      aria-label={t("theme.toggle")}
      aria-pressed={isLight}
      className="grid h-10 w-10 place-items-center rounded-[10px] border border-border text-muted transition-colors hover:border-accent hover:text-accent"
    >
      {isLight ? (
        <SunIcon className="h-[18px] w-[18px]" />
      ) : (
        <MoonIcon className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}
