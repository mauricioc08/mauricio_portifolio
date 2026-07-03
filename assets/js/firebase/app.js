// Inicialização do Firebase (SDK modular via CDN ESM).
// Carregado sob demanda — só importa o SDK quando `firebaseEnabled`.
// Retorna { app, auth, db, storage } ou null (quando desativado).
import { firebaseConfig, firebaseEnabled, FIREBASE_SDK_VERSION } from "./config.js";

const V = FIREBASE_SDK_VERSION;
const CDN = (m) => `https://www.gstatic.com/firebasejs/${V}/${m}`;

let _instance;

export function isFirebaseEnabled() {
  return firebaseEnabled;
}

// Singleton: inicializa uma vez e reaproveita.
export async function getFirebase() {
  if (!firebaseEnabled) return null;
  if (_instance) return _instance;

  const [{ initializeApp }, authMod, dbMod] = await Promise.all([
    import(CDN("firebase-app.js")),
    import(CDN("firebase-auth.js")),
    import(CDN("firebase-firestore.js")),
  ]);

  const app = initializeApp(firebaseConfig);
  _instance = {
    app,
    auth: authMod.getAuth(app),
    db: dbMod.getFirestore(app),
    // re-exporta funções usadas pelos módulos (evita reimportar o CDN)
    fns: { ...authMod, ...dbMod },
  };
  return _instance;
}
