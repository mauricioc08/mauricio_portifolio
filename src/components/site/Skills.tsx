"use client";

import { useI18n } from "@/lib/i18n/context";
import { Eyebrow, Tag } from "@/components/ui/Tag";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { TranslationKey } from "@/lib/i18n/dictionary";

const GROUPS: { titleKey: TranslationKey; items: string[] }[] = [
  {
    titleKey: "skills.frontend",
    items: ["HTML", "CSS", "SCSS", "Bootstrap", "Tailwind", "ReactJS", "NextJS"],
  },
  {
    titleKey: "skills.backend",
    items: ["Ruby", "Ruby on Rails", "NodeJS", "PHP", "JavaScript"],
  },
  {
    titleKey: "skills.database",
    items: ["MySQL", "MariaDB", "PostgreSQL", "Supabase", "Firebase", "MongoDB"],
  },
  {
    titleKey: "skills.devops",
    items: ["Docker", "AWS", "Cloud / DNS", "Hostinger", "Plesk", "HostGator"],
  },
  {
    titleKey: "skills.practices",
    items: ["Git/GitHub", "Kanban", "Scrum", "Agile"],
  },
];

export function Skills() {
  const { t } = useI18n();

  return (
    <section id="skills" className="py-[var(--section-y)]">
      <div className="wrapper">
        <Eyebrow>{t("skills.eyebrow")}</Eyebrow>
        <SectionTitle>{t("skills.title")}</SectionTitle>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] gap-[1.2rem]">
          {GROUPS.map((g) => (
            <article
              key={g.titleKey}
              className="glass px-6 pb-7 pt-6"
            >
              <h3 className="mb-4 font-display text-step-1 text-accent">
                {t(g.titleKey)}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <li key={s}>
                    <Tag>{s}</Tag>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
