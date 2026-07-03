"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { Eyebrow, Tag } from "@/components/ui/Tag";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GithubIcon, ExternalIcon, DotsIcon } from "@/components/ui/icons";
import type { Project } from "@/types";

function ProjectCard({ project }: { project: Project }) {
  const { t, lang } = useI18n();
  return (
    <article className="glass group flex flex-col overflow-hidden transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.7)]">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-border">
        <Image
          src={project.image}
          alt={project.title}
          width={880}
          height={550}
          className="h-full w-full object-cover object-top transition-[transform,filter] duration-500 [filter:saturate(0.95)] group-hover:scale-105 group-hover:[filter:saturate(1.1)]"
        />
        <div className="absolute bottom-3 right-3 flex translate-y-1.5 gap-2 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
          {project.links.repo && (
            <a
              href={project.links.repo}
              target="_blank"
              rel="noopener"
              title={t("projects.repo")}
              aria-label={t("projects.repo")}
              className="grid h-[2.4rem] w-[2.4rem] place-items-center rounded-[10px] border border-border-strong bg-[color-mix(in_oklab,var(--color-bg)_55%,transparent)] text-text backdrop-blur-[8px] transition-colors hover:bg-accent hover:text-[color:var(--color-on-accent)]"
            >
              <GithubIcon className="h-[18px] w-[18px]" />
            </a>
          )}
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener"
              title={t("projects.live")}
              aria-label={t("projects.live")}
              className="grid h-[2.4rem] w-[2.4rem] place-items-center rounded-[10px] border border-border-strong bg-[color-mix(in_oklab,var(--color-bg)_55%,transparent)] text-text backdrop-blur-[8px] transition-colors hover:bg-accent hover:text-[color:var(--color-on-accent)]"
            >
              <ExternalIcon className="h-[18px] w-[18px]" />
            </a>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-[0.7rem] px-[1.35rem] pb-6 pt-5">
        <h3 className="font-display text-step-1">{project.title}</h3>
        <p className="flex-1 text-[0.95rem] text-muted">
          {project.description[lang] ?? project.description.pt}
        </p>
        <div className="flex flex-wrap gap-[0.4rem]">
          {project.stack.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </div>
      </div>
    </article>
  );
}

function SoonCard() {
  const { t } = useI18n();
  return (
    <article className="glass col-span-full grid min-h-[12rem] max-w-[20rem] place-content-center justify-items-center justify-self-center gap-2 border-dashed px-8 py-10 text-center text-muted">
      <DotsIcon className="mx-auto h-8 w-8 fill-accent" />
      <h3 className="font-display text-text">{t("projects.soonTitle")}</h3>
      <p>{t("projects.soonBody")}</p>
    </article>
  );
}

export function Projects({ items }: { items: Project[] }) {
  const { t } = useI18n();

  return (
    <section id="projects" className="py-[var(--section-y)]">
      <div className="wrapper">
        <Eyebrow>{t("projects.eyebrow")}</Eyebrow>
        <SectionTitle>{t("projects.title")}</SectionTitle>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,20rem),1fr))] gap-[1.4rem]">
          {items.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
          <SoonCard />
        </div>
      </div>
    </section>
  );
}
