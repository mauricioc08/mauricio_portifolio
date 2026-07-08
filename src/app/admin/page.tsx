"use client";

import { useState } from "react";
import { useAuth } from "@/lib/firebase/use-auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { AdminPanel } from "@/components/admin/AdminPanel";

export default function AdminPage() {
  const auth = useAuth();
  const [loginError, setLoginError] = useState("");

  // Firebase não configurado
  if (auth.ready && !auth.firebaseEnabled) {
    return (
      <div className="grid min-h-screen place-items-center p-[var(--gutter)]">
        <div className="glass max-w-md p-8">
          <h1 className="font-display text-step-2">Admin indisponível</h1>
          <p className="mt-3 text-muted">
            O Firebase não foi configurado. Preencha o{" "}
            <code className="font-mono text-accent">.env.local</code> e recarregue.
          </p>
        </div>
      </div>
    );
  }

  // ainda resolvendo estado de auth
  if (!auth.ready) {
    return (
      <div className="grid min-h-screen place-items-center">
        <p className="font-mono text-muted">carregando…</p>
      </div>
    );
  }

  // logado e admin → painel
  if (auth.user && auth.isAdmin) {
    return <AdminPanel onLogout={auth.logout} />;
  }

  // logado mas não é admin
  if (auth.user && !auth.isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center p-[var(--gutter)]">
        <div className="glass max-w-md p-8 text-center">
          <h1 className="font-display text-step-2">Sem permissão</h1>
          <p className="mt-3 text-muted">
            Esta conta não tem acesso de admin.
          </p>
          <button
            onClick={auth.logout}
            className="mt-4 rounded-full border border-border px-5 py-2 text-muted hover:border-accent hover:text-accent"
          >
            Sair
          </button>
        </div>
      </div>
    );
  }

  // não logado → login
  return (
    <LoginForm
      error={loginError}
      onSubmit={async (email, password) => {
        setLoginError("");
        try {
          await auth.login(email, password);
        } catch (e) {
          setLoginError(mapAuthError((e as { code?: string }).code));
        }
      }}
    />
  );
}

function mapAuthError(code?: string): string {
  const m: Record<string, string> = {
    "auth/invalid-email": "E-mail inválido.",
    "auth/user-not-found": "Usuário não encontrado.",
    "auth/wrong-password": "Senha incorreta.",
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/too-many-requests": "Muitas tentativas. Tente mais tarde.",
  };
  return (code && m[code]) || "Não foi possível entrar.";
}
