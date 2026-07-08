"use client";

import { useState } from "react";
import Link from "next/link";

export function LoginForm({
  error,
  onSubmit,
}: {
  error: string;
  onSubmit: (email: string, password: string) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="grid min-h-screen place-items-center p-[var(--gutter)]">
      <form
        className="glass grid w-full max-w-md gap-4 p-8"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          await onSubmit(email, password);
          setLoading(false);
        }}
      >
        <Link href="/" className="font-mono font-medium">
          mauricio<b className="text-accent">.dev</b>
        </Link>
        <h1 className="font-display text-step-2">Painel de administração</h1>

        <label className="grid gap-1.5 text-sm text-muted">
          E-mail
          <input
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-[10px] border border-border bg-surface-strong px-[0.9rem] py-[0.7rem] text-text focus:border-transparent focus:outline focus:outline-2 focus:outline-accent"
          />
        </label>

        <label className="grid gap-1.5 text-sm text-muted">
          Senha
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-[10px] border border-border bg-surface-strong px-[0.9rem] py-[0.7rem] text-text focus:border-transparent focus:outline focus:outline-2 focus:outline-accent"
          />
        </label>

        {error && <p className="text-sm text-[#ff6b6b]">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="accent-grad rounded-full py-3 font-semibold text-[color:var(--color-on-accent)] disabled:opacity-60"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>

        <Link href="/" className="text-center text-sm text-muted hover:text-accent">
          ← Voltar ao site
        </Link>
      </form>
    </div>
  );
}
