import type { Lang, MaybeLocalized } from "@/types";

// Resolve um campo que pode ser string simples ou objeto {pt,en}.
export function loc(value: MaybeLocalized | undefined, lang: Lang): string {
  if (value == null) return "";
  return typeof value === "object" ? (value[lang] ?? value.pt ?? "") : value;
}

// Comparador de ordenação por `order` (itens sem order vão ao fim).
export function byOrder<T extends { order?: number }>(a: T, b: T): number {
  return (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER);
}
