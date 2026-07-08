import "server-only";

// Guarda de autenticação para API Routes de escrita.
// Verifica o ID token (Bearer) com o Admin SDK e confere que o UID é o admin.
// Retorna null se autorizado, ou um NextResponse de erro se não.
import { NextResponse } from "next/server";
import { getAdminAuth, adminEnabled } from "./admin";

const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID ?? "";

export async function requireAdmin(req: Request): Promise<NextResponse | null> {
  if (!adminEnabled) {
    return NextResponse.json(
      { error: "Servidor sem Firebase Admin configurado." },
      { status: 503 }
    );
  }

  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const auth = getAdminAuth();
  if (!auth) {
    return NextResponse.json(
      { error: "Servidor indisponível." },
      { status: 503 }
    );
  }

  try {
    const decoded = await auth.verifyIdToken(token);
    if (decoded.uid !== ADMIN_UID) {
      return NextResponse.json(
        { error: "Sem permissão de admin." },
        { status: 403 }
      );
    }
    return null; // autorizado
  } catch {
    return NextResponse.json(
      { error: "Token inválido ou expirado." },
      { status: 401 }
    );
  }
}
