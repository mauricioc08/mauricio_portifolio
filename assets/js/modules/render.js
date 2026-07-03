// Renderiza dados (projetos, timeline, social) no DOM com createElement.
// Texto do usuário nunca vai como HTML cru (textContent), evitando injeção.
// Os dados são injetados via setData() (locais ou vindos do Firestore).
import { projects as localProjects } from "../data/projects.js";
import { experience as localExperience } from "../data/experience.js";
import { icons } from "./icons.js";
import { t, getLang } from "./i18n.js";

// store mutável — começa com os dados locais, atualizado por setData()
let projects = localProjects;
let experience = localExperience;

export function setData(data) {
  if (data?.projects) projects = data.projects;
  if (data?.experience) experience = data.experience;
}

const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};

// resolve campo que pode ser string ou {pt,en}
const loc = (v) => (v && typeof v === "object" ? v[getLang()] ?? v.pt : v);

function iconLink(href, svg, title) {
  const a = el("a");
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener";
  a.title = title;
  a.setAttribute("aria-label", title);
  a.innerHTML = svg; // SVG confiável (constante local)
  return a;
}

function projectCard(p) {
  const card = el("article", "project-card glass reveal");

  const media = el("div", "project-media");
  const img = el("img");
  img.src = p.image;
  img.alt = p.title;
  img.loading = "lazy";
  img.width = 880;
  img.height = 550;
  media.append(img);

  const linksWrap = el("div", "project-links");
  if (p.links?.repo)
    linksWrap.append(iconLink(p.links.repo, icons.github, t("projects.repo")));
  if (p.links?.live)
    linksWrap.append(
      iconLink(p.links.live, icons.external, t("projects.live"))
    );
  if (linksWrap.children.length) media.append(linksWrap);

  const body = el("div", "project-body");
  body.append(el("h3", null, p.title));
  body.append(el("p", null, loc(p.description)));

  const stack = el("div", "project-stack");
  p.stack.forEach((s) => stack.append(el("span", "tag", s)));
  body.append(stack);

  card.append(media, body);
  return card;
}

function soonCard() {
  const card = el("article", "project-card project-card--soon glass reveal");
  const svg = el("div");
  svg.innerHTML = icons.soon;
  card.append(
    svg.firstElementChild,
    el("h3", null, t("projects.soonTitle")),
    el("p", null, t("projects.soonBody"))
  );
  return card;
}

function timelineItem(x) {
  const item = el("article", "tl-item glass reveal");
  if (x.current) item.classList.add("tl-item--current");
  const head = el("div", "tl-head");
  const role = el("span", "tl-role", loc(x.role));
  const company = el("span", "tl-company", " · " + loc(x.company));
  const roleLine = el("div", "tl-role-line");
  roleLine.append(role, company);
  if (x.current) roleLine.append(el("span", "tl-badge", t("exp.current")));
  head.append(roleLine, el("span", "tl-period", loc(x.period)));
  item.append(head, el("p", null, loc(x.description)));

  const stack = el("div", "tl-stack");
  x.stack.forEach((s) => stack.append(el("span", "tag", s)));
  item.append(stack);
  return item;
}

export function renderProjects() {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;
  grid.replaceChildren(...projects.map(projectCard), soonCard());
}

export function renderTimeline() {
  const tl = document.getElementById("timeline");
  if (!tl) return;
  tl.replaceChildren(...experience.map(timelineItem));
}

export function renderSocial() {
  const wrap = document.getElementById("footer-social");
  if (!wrap) return;
  const gh = el("li");
  gh.append(iconLink("https://github.com/mauricioc08", icons.github, "GitHub"));
  gh.querySelector("a").classList.add("icon-btn");
  const li = el("li");
  li.append(
    iconLink(
      "https://www.linkedin.com/in/mauricio-cassiano-4186b0164/",
      icons.linkedin,
      "LinkedIn"
    )
  );
  li.querySelector("a").classList.add("icon-btn");
  wrap.replaceChildren(gh, li);
}

export function renderAll() {
  renderProjects();
  renderTimeline();
  renderSocial();
}
