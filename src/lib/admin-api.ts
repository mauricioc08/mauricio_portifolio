"use client";

// Cliente do painel admin. Leituras vêm direto do Firestore (públicas pelas
// Rules); escritas vão pelas API Routes (Admin SDK) com o ID token no header.
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { getFirebaseAuth } from "./firebase/client";
import { getIdToken } from "./firebase/use-auth";
import { byOrder } from "./localized";
import type { Project, Experience, ContentDoc } from "@/types";

function db() {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase não configurado.");
  return getFirestore(auth.app);
}

async function write(
  path: string,
  method: "POST" | "PUT" | "DELETE",
  body?: unknown
) {
  const token = await getIdToken();
  if (!token) throw new Error("Sessão expirada. Faça login novamente.");
  const res = await fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: "" }));
    throw new Error(error || `Erro ${res.status}`);
  }
  return res.json();
}

// ---------- Projetos ----------
export const projectsApi = {
  async list(): Promise<Project[]> {
    const snap = await getDocs(collection(db(), "projects"));
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() }) as Project)
      .sort(byOrder);
  },
  save: (id: string | null, data: Omit<Project, "id">) =>
    write("/api/projects", "POST", { id: id ?? undefined, data }),
  remove: (id: string) =>
    write(`/api/projects?id=${encodeURIComponent(id)}`, "DELETE"),
};

// ---------- Experiência ----------
export const experienceApi = {
  async list(): Promise<Experience[]> {
    const snap = await getDocs(collection(db(), "experience"));
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() }) as Experience)
      .sort(byOrder);
  },
  save: (id: string | null, data: Omit<Experience, "id">) =>
    write("/api/experience", "POST", { id: id ?? undefined, data }),
  remove: (id: string) =>
    write(`/api/experience?id=${encodeURIComponent(id)}`, "DELETE"),
};

// ---------- Textos ----------
export const contentApi = {
  async get(): Promise<ContentDoc> {
    const snap = await getDoc(doc(db(), "content", "site"));
    return snap.exists() ? (snap.data() as ContentDoc) : { pt: {}, en: {} };
  },
  save: (data: ContentDoc) => write("/api/content", "PUT", data),
};
