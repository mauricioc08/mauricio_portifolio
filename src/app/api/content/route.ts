import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/firebase/auth-guard";

// PUT { pt?: {...}, en?: {...} } → salva/mescla os textos editáveis das seções.
export async function PUT(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const db = getAdminDb();
  if (!db)
    return NextResponse.json({ error: "DB indisponível." }, { status: 503 });

  const data = await req.json();
  if (!data || typeof data !== "object") {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  await db.collection("content").doc("site").set(data, { merge: true });
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
