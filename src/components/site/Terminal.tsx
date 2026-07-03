"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

// Assinatura visual: terminal que digita `whoami` e revela a saída.
// Respeita prefers-reduced-motion (mostra tudo de imediato).
export function Terminal() {
  const { t } = useI18n();
  const cmd = t("hero.term.cmd");
  const out = t("hero.term.out");

  const [typed, setTyped] = useState("");
  const [showOut, setShowOut] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    if (reduced.current) {
      setTyped(cmd);
      setShowOut(true);
      return;
    }

    setTyped("");
    setShowOut(false);
    let i = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const step = () => {
      if (i <= cmd.length) {
        setTyped(cmd.slice(0, i));
        i += 1;
        timers.push(setTimeout(step, 90));
      } else {
        timers.push(setTimeout(() => setShowOut(true), 350));
      }
    };
    step();
    return () => timers.forEach(clearTimeout);
  }, [cmd, out]);

  return (
    <div
      aria-hidden
      className="glass relative overflow-hidden rounded-[var(--radius-lg)] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]"
    >
      {/* barra */}
      <div className="flex items-center gap-2 border-b border-border bg-surface-strong px-4 py-[0.85rem]">
        <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
        <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
        <span className="h-[11px] w-[11px] rounded-full bg-[#28c840]" />
        <span className="ml-auto font-mono text-[0.78rem] text-faint">
          ~/mauricio
        </span>
      </div>

      {/* corpo */}
      <pre className="min-h-[12rem] whitespace-pre-wrap px-[1.35rem] py-6 font-mono text-[clamp(0.85rem,0.6rem+0.6vw,1rem)] leading-[1.9]">
        <span className="text-accent">mauricio@dev:~$</span>{" "}
        <span className="text-text">{typed}</span>
        {!showOut && (
          <span className="inline-block h-[1.1em] w-[0.6ch] translate-y-[0.15em] animate-[blink_1s_steps(2)_infinite] bg-accent align-middle" />
        )}
        {showOut && (
          <>
            {"\n"}
            <span className="text-muted">{out}</span>
          </>
        )}
      </pre>
    </div>
  );
}
