"use client";

import { useI18n } from "@/lib/i18n/context";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Tag";
import { Terminal } from "./Terminal";

export function Hero() {
  const { t } = useI18n();

  return (
    <section id="hero" className="pb-[var(--section-y)] pt-[clamp(3rem,8vw,6rem)]">
      <div className="wrapper">
        <div className="grid items-center gap-[clamp(2rem,5vw,4rem)] md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Eyebrow>{t("hero.eyebrow")}</Eyebrow>
            <h1 className="my-5 max-w-[15ch] font-display text-step-4 font-bold tracking-tight">
              {t("hero.title")}
            </h1>
            <p className="mb-8 max-w-[40ch] text-step-1 text-muted">
              {t("hero.lead")}
            </p>
            <div className="flex flex-wrap gap-[0.9rem]">
              <ButtonLink href="#contact" variant="primary">
                {t("hero.cta")}
              </ButtonLink>
              <ButtonLink
                href="/cv/mauricio-cassiano-cv.pdf"
                variant="ghost"
                download
                target="_blank"
              >
                {t("hero.cv")}
              </ButtonLink>
            </div>
          </div>

          <Terminal />
        </div>
      </div>
    </section>
  );
}
