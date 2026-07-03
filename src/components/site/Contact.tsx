"use client";

import { useI18n } from "@/lib/i18n/context";
import { Eyebrow } from "@/components/ui/Tag";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ButtonLink } from "@/components/ui/Button";
import { MailIcon, PhoneIcon } from "@/components/ui/icons";

const EMAIL = "mauricio.cassianosilva@gmail.com";
const PHONE = "+5511945396825";
const WHATSAPP =
  "https://api.whatsapp.com/send?phone=5511945396825&text=Fala,%20Mauricio!%20Vim%20do%20teu%20portf%C3%B3lio,%20quero%20trabalhar%20contigo!";

export function Contact() {
  const { t } = useI18n();

  return (
    <section id="contact" className="py-[var(--section-y)]">
      <div className="wrapper">
        <div className="grid items-center gap-[clamp(2rem,5vw,3rem)] md:grid-cols-2">
          <div>
            <Eyebrow>{t("contact.eyebrow")}</Eyebrow>
            <SectionTitle>{t("contact.title")}</SectionTitle>
            <p className="mb-8 max-w-[32ch] text-step-1 text-muted">
              {t("contact.lead")}
            </p>

            <ul className="mb-8 grid gap-3">
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  title={t("contact.email")}
                  className="glass flex items-center gap-[0.9rem] px-[1.2rem] py-4 text-text transition-[border-color,transform] hover:translate-x-1 hover:border-accent"
                >
                  <MailIcon className="h-[22px] w-[22px] shrink-0 stroke-accent" />
                  {EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${PHONE}`}
                  title={t("contact.phone")}
                  className="glass flex items-center gap-[0.9rem] px-[1.2rem] py-4 text-text transition-[border-color,transform] hover:translate-x-1 hover:border-accent"
                >
                  <PhoneIcon className="h-[22px] w-[22px] shrink-0 stroke-accent" />
                  +55 11 94539-6825
                </a>
              </li>
            </ul>

            <ButtonLink href={WHATSAPP} target="_blank" rel="noopener" variant="primary">
              {t("contact.whatsapp")}
            </ButtonLink>
          </div>

          {/* arte */}
          <div
            aria-hidden
            className="accent-grad relative grid aspect-square w-full max-w-[20rem] place-items-center justify-self-center overflow-hidden rounded-[var(--radius-lg)] before:font-mono before:text-[clamp(4rem,14vw,9rem)] before:font-medium before:text-[color-mix(in_oklab,var(--color-on-accent)_85%,transparent)] before:[content:'</>'] before:[mix-blend-mode:soft-light] md:max-w-none"
          />
        </div>
      </div>
    </section>
  );
}
