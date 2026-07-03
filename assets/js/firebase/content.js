// Camada de conteúdo do site público.
// Estratégia: retorna IMEDIATAMENTE os dados locais (fallback) para render
// instantâneo e, se o Firebase estiver ligado, busca a versão remota e chama
// onUpdate() quando ela chega. Assim o site nunca fica vazio nem lento.
import { projects as localProjects } from "../data/projects.js";
import { experience as localExperience } from "../data/experience.js";
import { getFirebase, isFirebaseEnabled } from "./app.js";

// Coleções/documentos no Firestore
const COL_PROJECTS = "projects";
const COL_EXPERIENCE = "experience";
const DOC_CONTENT = "content/site"; // textos das seções (opcional)

// Ordena por campo `order` (asc); itens sem order vão ao fim mantendo a ordem.
function byOrder(a, b) {
  const ao = a.order ?? Number.MAX_SAFE_INTEGER;
  const bo = b.order ?? Number.MAX_SAFE_INTEGER;
  return ao - bo;
}

async function fetchCollection(name) {
  const fb = await getFirebase();
  if (!fb) return null;
  const { collection, getDocs } = fb.fns;
  const snap = await getDocs(collection(fb.db, name));
  if (snap.empty) return null;
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort(byOrder);
}

async function fetchContentDoc() {
  const fb = await getFirebase();
  if (!fb) return null;
  const { doc, getDoc } = fb.fns;
  const [col, id] = DOC_CONTENT.split("/");
  const snap = await getDoc(doc(fb.db, col, id));
  return snap.exists() ? snap.data() : null;
}

/**
 * Carrega o conteúdo do site.
 * @param {(data) => void} onUpdate  chamado quando a versão remota chega.
 * @returns {{projects, experience, content}}  os dados LOCAIS (imediatos).
 */
export function loadContent(onUpdate) {
  const local = {
    projects: localProjects,
    experience: localExperience,
    content: null, // textos vêm do i18n local por padrão
  };

  if (isFirebaseEnabled() && typeof onUpdate === "function") {
    (async () => {
      try {
        const [projects, experience, content] = await Promise.all([
          fetchCollection(COL_PROJECTS),
          fetchCollection(COL_EXPERIENCE),
          fetchContentDoc(),
        ]);
        // só dispara update com o que veio; mantém local para o que faltou
        onUpdate({
          projects: projects ?? local.projects,
          experience: experience ?? local.experience,
          content: content ?? local.content,
        });
      } catch (err) {
        // falha de rede/regra → segue com o fallback local, sem quebrar
        console.warn("[firebase] usando dados locais (fallback):", err.message);
      }
    })();
  }

  return local;
}
