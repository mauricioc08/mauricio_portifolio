"use client";

import { useI18n } from "@/lib/i18n/context";
import { Eyebrow, Tag } from "@/components/ui/Tag";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { loc } from "@/lib/localized";
import type { Experience as ExperienceItem } from "@/types";

export function Experience({ items }: { items: ExperienceItem[] }) {
  const { t, lang } = useI18n();

  return (
    <section id="experience" className="py-[var(--section-y)]">
      <div className="wrapper">
        <Eyebrow>{t("exp.eyebrow")}</Eyebrow>
        <SectionTitle>{t("exp.title")}</SectionTitle>

        <div className="relative grid gap-5 pl-7 before:absolute before:bottom-1.5 before:left-[5px] before:top-1.5 before:w-0.5 before:bg-[linear-gradient(var(--color-accent),transparent)] before:opacity-50">
          {items.map((x) => (
            <article
              key={x.id}
              className={`glass relative px-6 py-[1.4rem] before:absolute before:left-[-1.75rem] before:top-7 before:h-3 before:w-3 before:rounded-full before:bg-accent before:shadow-[var(--glow)] ${
                x.current
                  ? "before:animate-[pulse-dot_2s_ease-out_infinite] [background:color-mix(in_oklab,var(--color-accent)_6%,var(--color-surface))] [border-color:color-mix(in_oklab,var(--color-accent)_45%,var(--color-border))]"
                  : ""
              }`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="inline-flex flex-wrap items-center gap-2">
                  <span className="font-display text-step-1">
                    {loc(x.role, lang)}
                  </span>
                  <span className="font-medium text-accent">
                    · {loc(x.company, lang)}
                  </span>
                  {x.current && (
                    <span className="accent-grad rounded-full px-2 py-[0.2rem] font-mono text-[0.68rem] uppercase tracking-[0.06em] text-[color:var(--color-on-accent)]">
                      {t("exp.current")}
                    </span>
                  )}
                </div>
                <span className="font-mono text-step--1 text-faint">
                  {loc(x.period, lang)}
                </span>
              </div>

              <p className="mb-[0.9rem] mt-[0.6rem] max-w-[60ch] text-muted">
                {loc(x.description, lang)}
              </p>

              <div className="flex flex-wrap gap-[0.4rem]">
                {x.stack.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
