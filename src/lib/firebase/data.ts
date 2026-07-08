import "server-only";

// Leitura de conteúdo no servidor (Server Components). Usa o Admin SDK quando
// disponível; se não houver service account ou der erro, cai no fallback local.
// Assim o site nunca fica vazio e a home é renderizada no servidor (SEO).
import { getAdminDb, adminEnabled } from "./admin";
import { projects as localProjects } from "@/data/projects";
import { experience as localExperience } from "@/data/experience";
import type {
  Project,
  Experience,
  ContentDoc,
  SiteContent,
} from "@/types";

function byOrder<T extends { order?: number }>(a: T, b: T): number {
  return (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER);
}

async function readCollection<T>(name: string): Promise<T[] | null> {
  const db = getAdminDb();
  if (!db) return null;
  const snap = await db.collection(name).get();
  if (snap.empty) return null;
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

export async function getSiteContent(): Promise<SiteContent> {
  const fallback: SiteContent = {
    projects: localProjects,
    experience: localExperience,
    content: null,
  };

  if (!adminEnabled) return fallback;

  try {
    const db = getAdminDb();
    if (!db) return fallback;

    const [projects, experience, contentSnap] = await Promise.all([
      readCollection<Project>("projects"),
      readCollection<Experience>("experience"),
      db.collection("content").doc("site").get(),
    ]);

    const content = contentSnap.exists
      ? (contentSnap.data() as ContentDoc)
      : null;

    return {
      projects: (projects ?? localProjects).slice().sort(byOrder),
      experience: (experience ?? localExperience).slice().sort(byOrder),
      content,
    };
  } catch (err) {
    console.warn(
      "[firebase] leitura falhou, usando fallback local:",
      (err as Error).message
    );
    return fallback;
  }
}
