// Painel de admin. Fluxo: verifica config → login → CRUD.
import { isFirebaseEnabled } from "./firebase/app.js";
import { ADMIN_UID } from "./firebase/config.js";
import {
  login,
  logout,
  onAuth,
  projectsApi,
  experienceApi,
  contentApi,
  uploadImage,
} from "./firebase/admin-api.js";
import { EDITABLE_KEYS } from "./modules/content.js";
import { strings as baseStrings } from "./data/i18n.js";
import { seedProjects, seedExperience } from "./firebase/seed.js";

const $ = (id) => document.getElementById(id);
const show = (id) => ($(id).hidden = false);
const hide = (id) => ($(id).hidden = true);

// ---------- estados de tela ----------
function screen(name) {
  hide("admin-disabled");
  hide("admin-login");
  hide("admin-app");
  show(name);
}

function toast(msg, isError = false) {
  const t = $("admin-toast");
  t.textContent = msg;
  t.classList.toggle("error", isError);
  t.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => (t.hidden = true), 2600);
}

// ---------- boot ----------
async function boot() {
  if (!isFirebaseEnabled()) {
    screen("admin-disabled");
    return;
  }

  screen("admin-login");
  bindLogin();

  // reage a login/logout
  await onAuth((user) => {
    if (user && user.uid === ADMIN_UID) {
      screen("admin-app");
      initApp();
    } else if (user) {
      // logado mas não é o admin → recusa
      logout();
      loginError("Esta conta não tem permissão de admin.");
      screen("admin-login");
    } else {
      screen("admin-login");
    }
  });
}

// ---------- login ----------
function loginError(msg) {
  const e = $("login-error");
  e.textContent = msg;
  e.hidden = !msg;
}
function bindLogin() {
  $("login-form").addEventListener("submit", async (ev) => {
    ev.preventDefault();
    loginError("");
    $("login-submit").disabled = true;
    try {
      await login($("login-email").value.trim(), $("login-password").value);
      // onAuth cuida da transição
    } catch (err) {
      loginError(mapAuthError(err.code));
    } finally {
      $("login-submit").disabled = false;
    }
  });
}
function mapAuthError(code) {
  const m = {
    "auth/invalid-email": "E-mail inválido.",
    "auth/user-not-found": "Usuário não encontrado.",
    "auth/wrong-password": "Senha incorreta.",
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/too-many-requests": "Muitas tentativas. Tente mais tarde.",
  };
  return m[code] || "Não foi possível entrar. Verifique os dados.";
}

// ---------- app (após login) ----------
let appReady = false;
function initApp() {
  if (appReady) return;
  appReady = true;

  $("logout-btn").addEventListener("click", () => logout());

  // tabs
  document.querySelectorAll(".admin-tab").forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
  });

  // ações
  $("add-project").addEventListener("click", () => openProjectModal());
  $("add-experience").addEventListener("click", () => openExperienceModal());
  $("save-content").addEventListener("click", saveContent);

  // modal close
  $("admin-modal")
    .querySelectorAll("[data-close]")
    .forEach((el) => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  refreshProjects();
  refreshExperience();
  buildContentForm();
}

function switchTab(name) {
  document
    .querySelectorAll(".admin-tab")
    .forEach((t) => t.classList.toggle("active", t.dataset.tab === name));
  document
    .querySelectorAll(".admin-panel")
    .forEach((p) => (p.hidden = p.dataset.panel !== name));
}

// ================= PROJETOS =================
let projectsCache = [];
async function refreshProjects() {
  try {
    projectsCache = await projectsApi.list();
  } catch {
    projectsCache = [];
  }
  const list = $("projects-list");
  list.replaceChildren(
    ...projectsCache.map((p) =>
      itemRow({
        thumb: p.image,
        title: p.title,
        subtitle: (p.stack || []).join(" · "),
        onEdit: () => openProjectModal(p),
        onDelete: () => deleteItem("projeto", () => projectsApi.remove(p.id), refreshProjects),
      })
    )
  );
  if (!projectsCache.length)
    list.append(
      emptyMsg("Nenhum projeto ainda."),
      seedButton("Importar meus projetos atuais", async () => {
        const n = await seedProjects();
        toast(`${n} projetos importados ✓`);
        refreshProjects();
      })
    );
}

function openProjectModal(p = null) {
  openModal(p ? "Editar projeto" : "Novo projeto", [
    field("id-hidden", "hidden", p?.id),
    text("title", "Título", p?.title),
    number("order", "Ordem (menor aparece primeiro)", p?.order ?? projectsCache.length),
    imageField("image", "Imagem", p?.image),
    textarea("desc_pt", "Descrição (PT)", p?.description?.pt),
    textarea("desc_en", "Descrição (EN)", p?.description?.en),
    text("stack", "Stack (separe por vírgula)", (p?.stack || []).join(", ")),
    text("repo", "Link do repositório (opcional)", p?.links?.repo),
    text("live", "Link ao vivo (opcional)", p?.links?.live),
  ], async (data) => {
    const payload = {
      title: data.title,
      order: Number(data.order) || 0,
      image: data.image || "",
      description: { pt: data.desc_pt || "", en: data.desc_en || "" },
      stack: data.stack.split(",").map((s) => s.trim()).filter(Boolean),
      links: {
        ...(data.repo ? { repo: data.repo } : {}),
        ...(data.live ? { live: data.live } : {}),
      },
    };
    await projectsApi.save(data["id-hidden"] || null, payload);
    toast("Projeto salvo ✓");
    closeModal();
    refreshProjects();
  });
}

// ================= EXPERIÊNCIA =================
let expCache = [];
async function refreshExperience() {
  try {
    expCache = await experienceApi.list();
  } catch {
    expCache = [];
  }
  const list = $("experience-list");
  list.replaceChildren(
    ...expCache.map((x) =>
      itemRow({
        title: (typeof x.role === "object" ? x.role.pt : x.role) || "—",
        subtitle:
          (typeof x.company === "object" ? x.company.pt : x.company || "") +
          (x.current ? "  · atual" : ""),
        onEdit: () => openExperienceModal(x),
        onDelete: () =>
          deleteItem("experiência", () => experienceApi.remove(x.id), refreshExperience),
      })
    )
  );
  if (!expCache.length)
    list.append(
      emptyMsg("Nenhuma experiência ainda."),
      seedButton("Importar minha experiência atual", async () => {
        const n = await seedExperience();
        toast(`${n} experiências importadas ✓`);
        refreshExperience();
      })
    );
}

function openExperienceModal(x = null) {
  openModal(x ? "Editar experiência" : "Nova experiência", [
    field("id-hidden", "hidden", x?.id),
    text("role_pt", "Cargo (PT)", loc(x?.role, "pt")),
    text("role_en", "Cargo (EN)", loc(x?.role, "en")),
    text("company", "Empresa", loc(x?.company, "pt")),
    text("period_pt", "Período (PT) — ex: 2025 — Atual", loc(x?.period, "pt")),
    text("period_en", "Período (EN) — ex: 2025 — Present", loc(x?.period, "en")),
    checkbox("current", "É o emprego atual?", x?.current),
    number("order", "Ordem", x?.order ?? expCache.length),
    textarea("desc_pt", "Descrição (PT)", loc(x?.description, "pt")),
    textarea("desc_en", "Descrição (EN)", loc(x?.description, "en")),
    text("stack", "Stack (vírgula)", (x?.stack || []).join(", ")),
  ], async (data) => {
    const payload = {
      role: { pt: data.role_pt, en: data.role_en || data.role_pt },
      company: data.company,
      period: { pt: data.period_pt, en: data.period_en || data.period_pt },
      current: !!data.current,
      order: Number(data.order) || 0,
      description: { pt: data.desc_pt || "", en: data.desc_en || "" },
      stack: data.stack.split(",").map((s) => s.trim()).filter(Boolean),
    };
    await experienceApi.save(data["id-hidden"] || null, payload);
    toast("Experiência salva ✓");
    closeModal();
    refreshExperience();
  });
}

// helper: valor localizado {pt,en} ou string
function loc(v, lang) {
  if (v == null) return "";
  return typeof v === "object" ? v[lang] ?? "" : v;
}

// ================= TEXTOS =================
async function buildContentForm() {
  let current = { pt: {}, en: {} };
  try {
    current = await contentApi.get();
  } catch {}

  const form = $("content-form");
  form.replaceChildren(
    ...EDITABLE_KEYS.map((key) => {
      const group = document.createElement("div");
      group.className = "admin-field-group";
      const h = document.createElement("h4");
      h.textContent = key;
      const cols = document.createElement("div");
      cols.className = "admin-lang-cols";
      const ptVal = current.pt?.[key] ?? baseStrings.pt[key] ?? "";
      const enVal = current.en?.[key] ?? baseStrings.en[key] ?? "";
      cols.append(
        textarea(`pt::${key}`, "PT", ptVal),
        textarea(`en::${key}`, "EN", enVal)
      );
      group.append(h, cols);
      return group;
    })
  );
}

async function saveContent() {
  const data = { pt: {}, en: {} };
  document.querySelectorAll("#content-form textarea").forEach((ta) => {
    const [lang, key] = ta.name.split("::");
    if (ta.value.trim()) data[lang][key] = ta.value;
  });
  try {
    await contentApi.save(data);
    toast("Textos salvos ✓");
  } catch (err) {
    toast("Erro ao salvar textos", true);
  }
}

// ================= MODAL genérico =================
let modalSubmit = null;
function openModal(title, fields, onSubmit) {
  $("modal-title").textContent = title;
  const body = $("modal-body");
  body.replaceChildren(...fields);
  modalSubmit = onSubmit;
  $("admin-modal").hidden = false;

  const formEl = $("modal-form");
  formEl.onsubmit = async (ev) => {
    ev.preventDefault();
    const data = collectForm(body);
    $("modal-save").disabled = true;
    try {
      await modalSubmit(data);
    } catch (err) {
      toast("Erro ao salvar: " + (err.message || err.code || ""), true);
    } finally {
      $("modal-save").disabled = false;
    }
  };
}
function closeModal() {
  $("admin-modal").hidden = true;
  modalSubmit = null;
}
function collectForm(container) {
  const data = {};
  container.querySelectorAll("[name]").forEach((el) => {
    data[el.name] = el.type === "checkbox" ? el.checked : el.value;
  });
  return data;
}

// ================= builders de campo =================
function wrap(labelText, inner) {
  const l = document.createElement("label");
  if (labelText) l.append(document.createTextNode(labelText));
  l.append(inner);
  return l;
}
function field(name, type, value) {
  const i = document.createElement("input");
  i.type = type;
  i.name = name;
  if (value != null) i.value = value;
  return type === "hidden" ? i : wrap(name, i);
}
function text(name, label, value) {
  const i = document.createElement("input");
  i.type = "text";
  i.name = name;
  if (value != null) i.value = value;
  return wrap(label, i);
}
function number(name, label, value) {
  const i = document.createElement("input");
  i.type = "number";
  i.name = name;
  if (value != null) i.value = value;
  return wrap(label, i);
}
function textarea(name, label, value) {
  const t = document.createElement("textarea");
  t.name = name;
  if (value != null) t.value = value;
  return wrap(label, t);
}
function checkbox(name, label, checked) {
  const l = document.createElement("label");
  l.style.flexDirection = "row";
  l.style.alignItems = "center";
  l.style.gap = "0.5rem";
  const i = document.createElement("input");
  i.type = "checkbox";
  i.name = name;
  i.style.width = "auto";
  i.checked = !!checked;
  l.append(i, document.createTextNode(label));
  return l;
}

// campo de imagem com preview + upload
function imageField(name, label, value) {
  const l = document.createElement("label");
  l.append(document.createTextNode(label));

  const row = document.createElement("div");
  row.className = "admin-img-row";

  const preview = document.createElement("img");
  preview.className = "admin-img-preview";
  if (value) preview.src = value;

  const controls = document.createElement("div");
  controls.style.flex = "1";

  // hidden input guarda a URL final (usada no submit)
  const urlInput = document.createElement("input");
  urlInput.type = "hidden";
  urlInput.name = name;
  if (value) urlInput.value = value;

  const file = document.createElement("input");
  file.type = "file";
  file.accept = "image/*";

  const status = document.createElement("p");
  status.className = "admin-upload-status";

  const hint = document.createElement("p");
  hint.className = "admin-hint";
  hint.textContent = "Ou cole uma URL de imagem abaixo.";

  const urlText = document.createElement("input");
  urlText.type = "text";
  urlText.placeholder = "https://...";
  if (value) urlText.value = value;
  urlText.addEventListener("input", () => {
    urlInput.value = urlText.value;
    preview.src = urlText.value;
  });

  file.addEventListener("change", async () => {
    const f = file.files?.[0];
    if (!f) return;
    status.textContent = "Enviando… 0%";
    try {
      const url = await uploadImage(f, (pct) => (status.textContent = `Enviando… ${pct}%`));
      urlInput.value = url;
      urlText.value = url;
      preview.src = url;
      status.textContent = "Imagem enviada ✓";
    } catch (err) {
      status.textContent = "Falha no upload: " + (err.message || "");
    }
  });

  controls.append(file, status, hint, urlText, urlInput);
  row.append(preview, controls);
  l.append(row);
  return l;
}

// ================= util UI =================
function itemRow({ thumb, title, subtitle, onEdit, onDelete }) {
  const row = document.createElement("div");
  row.className = "admin-item";
  if (thumb !== undefined) {
    const img = document.createElement("img");
    img.className = "admin-item-thumb";
    if (thumb) img.src = thumb;
    img.alt = "";
    row.append(img);
  }
  const info = document.createElement("div");
  info.className = "admin-item-info";
  const s = document.createElement("strong");
  s.textContent = title;
  const sub = document.createElement("span");
  sub.textContent = subtitle || "";
  info.append(s, sub);

  const actions = document.createElement("div");
  actions.className = "admin-item-actions";
  const edit = document.createElement("button");
  edit.textContent = "Editar";
  edit.onclick = onEdit;
  const del = document.createElement("button");
  del.textContent = "Excluir";
  del.className = "danger";
  del.onclick = onDelete;
  actions.append(edit, del);

  row.append(info, actions);
  return row;
}
function emptyMsg(text) {
  const p = document.createElement("p");
  p.className = "admin-hint";
  p.textContent = text;
  return p;
}
function seedButton(label, action) {
  const b = document.createElement("button");
  b.className = "btn btn--ghost";
  b.style.justifySelf = "start";
  b.textContent = label;
  b.onclick = async () => {
    b.disabled = true;
    try {
      await action();
    } catch (err) {
      toast("Erro ao importar: " + (err.message || ""), true);
    } finally {
      b.disabled = false;
    }
  };
  return b;
}
async function deleteItem(kind, action, refresh) {
  if (!confirm(`Excluir este(a) ${kind}? Esta ação não pode ser desfeita.`)) return;
  try {
    await action();
    toast(`${kind[0].toUpperCase() + kind.slice(1)} excluído(a) ✓`);
    refresh();
  } catch (err) {
    toast("Erro ao excluir", true);
  }
}

boot();
