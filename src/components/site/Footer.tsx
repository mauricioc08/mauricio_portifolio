"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";

const GITHUB = "https://github.com/mauricioc08";
const LINKEDIN = "https://www.linkedin.com/in/mauricio-cassiano-4186b0164/";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="mt-[var(--section-y)] border-t border-border py-12">
      <div className="wrapper flex flex-wrap items-center justify-between gap-6">
        <div>
          <Link href="#hero" className="font-mono text-[1.05rem] font-medium">
            mauricio<b className="text-accent">.dev</b>
          </Link>
          <p className="mt-1 text-[0.9rem] text-faint">
            © 2026 Mauricio Cassiano. {t("footer.rights")}
          </p>
        </div>

        <ul className="flex gap-[0.6rem]">
          <li>
            <a
              href={GITHUB}
              target="_blank"
              rel="noopener"
              title="GitHub"
              aria-label="GitHub"
              className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-surface text-muted transition-[color,border-color,transform] hover:-translate-y-0.5 hover:border-accent hover:text-accent"
            >
              <GithubIcon className="h-5 w-5" />
            </a>
          </li>
          <li>
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noopener"
              title="LinkedIn"
              aria-label="LinkedIn"
              className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-surface text-muted transition-[color,border-color,transform] hover:-translate-y-0.5 hover:border-accent hover:text-accent"
            >
              <LinkedinIcon className="h-5 w-5" />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
