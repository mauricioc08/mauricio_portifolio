// Migração inicial: envia os dados locais atuais para o Firestore.
// Executado uma única vez pelo admin (botão aparece quando não há dados).
// Requer estar autenticado como admin (as regras barram o resto).
import { projects as localProjects } from "../data/projects.js";
import { experience as localExperience } from "../data/experience.js";
import { projectsApi, experienceApi } from "./admin-api.js";

export async function seedProjects() {
  let n = 0;
  for (let i = 0; i < localProjects.length; i++) {
    const p = localProjects[i];
    await projectsApi.save(p.id, {
      title: p.title,
      order: i,
      image: p.image || "",
      description: p.description,
      stack: p.stack || [],
      links: p.links || {},
    });
    n++;
  }
  return n;
}

export async function seedExperience() {
  let n = 0;
  for (let i = 0; i < localExperience.length; i++) {
    const x = localExperience[i];
    // usa índice como id estável (exp-0, exp-1…)
    await experienceApi.save(`exp-${i}`, {
      role: x.role,
      company: x.company,
      period: x.period,
      current: !!x.current,
      order: i,
      description: x.description,
      stack: x.stack || [],
    });
    n++;
  }
  return n;
}
