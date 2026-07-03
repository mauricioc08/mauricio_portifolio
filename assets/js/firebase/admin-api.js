// API de admin: autenticação e CRUD no Firestore. Upload de imagem é feito
// pelo Cloudinary (ver cloudinary.js) — o Firebase Storage não é usado.
// As escritas no Firestore são barradas pelas Security Rules a menos que o
// usuário autenticado seja o admin (UID).
import { getFirebase } from "./app.js";
import { uploadToCloudinary } from "./cloudinary.js";

// ---------- AUTH ----------
export async function login(email, password) {
  const fb = await getFirebase();
  const { signInWithEmailAndPassword } = fb.fns;
  const cred = await signInWithEmailAndPassword(fb.auth, email, password);
  return cred.user;
}

export async function logout() {
  const fb = await getFirebase();
  await fb.fns.signOut(fb.auth);
}

export async function onAuth(callback) {
  const fb = await getFirebase();
  return fb.fns.onAuthStateChanged(fb.auth, callback);
}

// ---------- FIRESTORE (genérico) ----------
async function listCol(name) {
  const fb = await getFirebase();
  const { collection, getDocs } = fb.fns;
  const snap = await getDocs(collection(fb.db, name));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (a.order ?? 1e9) - (b.order ?? 1e9));
}

async function saveDoc(name, id, data) {
  const fb = await getFirebase();
  const { doc, setDoc, collection, addDoc } = fb.fns;
  if (id) {
    await setDoc(doc(fb.db, name, id), data, { merge: false });
    return id;
  }
  const ref = await addDoc(collection(fb.db, name), data);
  return ref.id;
}

async function removeDoc(name, id) {
  const fb = await getFirebase();
  const { doc, deleteDoc } = fb.fns;
  await deleteDoc(doc(fb.db, name, id));
}

// ---------- Coleções específicas ----------
export const projectsApi = {
  list: () => listCol("projects"),
  save: (id, data) => saveDoc("projects", id, data),
  remove: (id) => removeDoc("projects", id),
};

export const experienceApi = {
  list: () => listCol("experience"),
  save: (id, data) => saveDoc("experience", id, data),
  remove: (id) => removeDoc("experience", id),
};

// textos das seções: documento único content/site
export const contentApi = {
  async get() {
    const fb = await getFirebase();
    const { doc, getDoc } = fb.fns;
    const snap = await getDoc(doc(fb.db, "content", "site"));
    return snap.exists() ? snap.data() : { pt: {}, en: {} };
  },
  async save(data) {
    const fb = await getFirebase();
    const { doc, setDoc } = fb.fns;
    await setDoc(doc(fb.db, "content", "site"), data, { merge: true });
  },
};

// ---------- UPLOAD (via Cloudinary, não Firebase Storage) ----------
export function uploadImage(file, onProgress) {
  return uploadToCloudinary(file, onProgress);
}
