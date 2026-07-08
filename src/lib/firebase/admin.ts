import "server-only";

// Firebase Admin SDK — SÓ no servidor (API Routes / Server Components).
// Inicializa a partir da service account (JSON) na env privada.
// Nunca importe este arquivo em código client.
import {
  initializeApp,
  getApps,
  getApp,
  cert,
  type App,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

function loadServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) return null;
  try {
    const json = JSON.parse(raw);
    // aceita chave privada com \n escapado (comum em envs de deploy)
    if (json.private_key) {
      json.private_key = json.private_key.replace(/\\n/g, "\n");
    }
    return json;
  } catch {
    console.warn("[firebase-admin] FIREBASE_SERVICE_ACCOUNT_KEY inválida (JSON).");
    return null;
  }
}

let app: App | null = null;

export function getAdminApp(): App | null {
  const sa = loadServiceAccount();
  if (!sa) return null;
  if (getApps().length) return getApp();
  app = initializeApp({
    credential: cert(sa),
    projectId: sa.project_id,
  });
  return app;
}

export const adminEnabled = Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

export function getAdminDb(): Firestore | null {
  const a = getAdminApp();
  return a ? getFirestore(a) : null;
}

export function getAdminAuth(): Auth | null {
  const a = getAdminApp();
  return a ? getAuth(a) : null;
}
