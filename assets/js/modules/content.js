// Aplica textos das seções vindos do Firestore (documento content/site) sobre
// as strings i18n. O documento tem o formato:
//   { pt: { "hero.title": "...", "about.body": "..." }, en: { ... } }
// Só as chaves presentes são sobrescritas; o resto continua vindo do i18n local.
import { mergeStrings } from "./i18n.js";

// Chaves de texto que o painel admin pode editar.
export const EDITABLE_KEYS = [
  "hero.eyebrow",
  "hero.title",
  "hero.lead",
  "hero.term.out",
  "about.title",
  "about.body",
  "contact.title",
  "contact.lead",
];

export function applyContent(content) {
  mergeStrings(content);
}
