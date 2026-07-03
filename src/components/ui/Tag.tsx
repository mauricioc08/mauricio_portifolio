export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="whitespace-nowrap rounded-lg border border-border bg-surface-strong px-[0.6rem] py-[0.28rem] font-mono text-[0.72rem] text-muted">
      {children}
    </span>
  );
}

/** Eyebrow: rótulo mono com traço, usado no topo de cada seção. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-[0.55ch] font-mono text-step--1 lowercase tracking-[0.08em] text-accent before:h-px before:w-[1.6rem] before:bg-current before:opacity-60 before:content-['']">
      {children}
    </p>
  );
}
