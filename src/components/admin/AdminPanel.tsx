"use client";

import { useState, createContext, useContext, useCallback } from "react";
import Link from "next/link";
import { ProjectsTab } from "./ProjectsTab";
import { ExperienceTab } from "./ExperienceTab";
import { ContentTab } from "./ContentTab";

type Tab = "projects" | "experience" | "content";

// Toast simples compartilhado entre as abas.
type ToastFn = (msg: string, isError?: boolean) => void;
const ToastCtx = createContext<ToastFn>(() => {});
export const useToast = () => useContext(ToastCtx);

export function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("projects");
  const [toast, setToast] = useState<{ msg: string; error: boolean } | null>(
    null
  );

  const showToast = useCallback<ToastFn>((msg, isError = false) => {
    setToast({ msg, error: isError });
    setTimeout(() => setToast(null), 2800);
  }, []);

  const tabs: { key: Tab; label: string }[] = [
    { key: "projects", label: "Projetos" },
    { key: "experience", label: "Experiência" },
    { key: "content", label: "Textos" },
  ];

  return (
    <ToastCtx.Provider value={showToast}>
      <header className="sticky top-0 z-20 flex flex-wrap items-center gap-4 border-b border-border bg-[color-mix(in_oklab,var(--color-bg)_85%,transparent)] px-[clamp(1rem,4vw,2rem)] py-[0.9rem] backdrop-blur-[14px]">
        <Link href="/" className="font-mono font-medium">
          mauricio<b className="text-accent">.dev</b>{" "}
          <span className="ml-1 rounded-md border border-border px-1.5 py-0.5 font-mono text-[0.7rem] text-faint">
            admin
          </span>
        </Link>

        <nav className="mx-auto flex gap-1">
          {tabs.map((tItem) => (
            <button
              key={tItem.key}
              onClick={() => setTab(tItem.key)}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                tab === tItem.key
                  ? "border border-border bg-surface-strong text-text"
                  : "border border-transparent text-muted hover:text-text"
              }`}
            >
              {tItem.label}
            </button>
          ))}
        </nav>

        <div className="flex gap-2">
          <Link
            href="/"
            target="_blank"
            className="rounded-full border border-border-strong bg-surface-strong px-4 py-2 text-sm hover:border-accent hover:text-accent"
          >
            Ver site
          </Link>
          <button
            onClick={onLogout}
            className="rounded-full border border-border-strong bg-surface-strong px-4 py-2 text-sm hover:border-accent hover:text-accent"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-[clamp(1rem,4vw,2rem)] pb-16 pt-8">
        {tab === "projects" && <ProjectsTab />}
        {tab === "experience" && <ExperienceTab />}
        {tab === "content" && <ContentTab />}
      </main>

      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full px-6 py-3 font-semibold shadow-[var(--glow)] ${
            toast.error
              ? "bg-[#ff6b6b] text-white"
              : "accent-grad text-[color:var(--color-on-accent)]"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </ToastCtx.Provider>
  );
}
