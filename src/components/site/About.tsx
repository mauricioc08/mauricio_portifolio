"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { Eyebrow } from "@/components/ui/Tag";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function About() {
  const { t } = useI18n();

  return (
    <section id="about" className="py-[var(--section-y)]">
      <div className="wrapper">
        <div className="grid items-center gap-[clamp(2rem,5vw,4rem)] md:grid-cols-[1fr_0.7fr]">
          <div>
            <Eyebrow>{t("about.eyebrow")}</Eyebrow>
            <SectionTitle>{t("about.title")}</SectionTitle>
            <p className="max-w-[55ch] text-muted">{t("about.body")}</p>
          </div>
          <figure className="relative max-w-[22rem] overflow-hidden rounded-[var(--radius-lg)] border border-border md:max-w-none">
            <Image
              src="/images/me.webp"
              alt={t("about.photoAlt")}
              width={720}
              height={1118}
              className="aspect-[3/4] h-full w-full object-cover [filter:saturate(1.05)]"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
