import "server-only";

// Fábrica de handlers CRUD para uma coleção do Firestore (projects, experience).
// Reaproveitada pelas API Routes — mesma lógica, só muda o nome da coleção.
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminDb } from "./admin";
import { requireAdmin } from "./auth-guard";

export function createCollectionRoute(collection: string) {
  async function POST(req: Request) {
    const denied = await requireAdmin(req);
    if (denied) return denied;

    const db = getAdminDb();
    if (!db)
      return NextResponse.json({ error: "DB indisponível." }, { status: 503 });

    const { id, data } = await req.json();
    if (!data || typeof data !== "object") {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    let docId = id as string | undefined;
    if (docId) {
      await db.collection(collection).doc(docId).set(data, { merge: false });
    } else {
      const ref = await db.collection(collection).add(data);
      docId = ref.id;
    }

    revalidatePath("/");
    return NextResponse.json({ id: docId });
  }

  async function DELETE(req: Request) {
    const denied = await requireAdmin(req);
    if (denied) return denied;

    const db = getAdminDb();
    if (!db)
      return NextResponse.json({ error: "DB indisponível." }, { status: 503 });

    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id ausente." }, { status: 400 });

    await db.collection(collection).doc(id).delete();
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  }

  return { POST, DELETE };
}
