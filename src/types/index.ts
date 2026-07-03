// Tipos compartilhados entre site público, admin e API Routes.

export type Lang = "pt" | "en";

/** Texto que existe em PT e EN. */
export interface LocalizedText {
  pt: string;
  en: string;
}

/** Campo que pode ser string simples ou localizado. */
export type MaybeLocalized = string | LocalizedText;

export interface ProjectLinks {
  repo?: string;
  live?: string;
}

export interface Project {
  id: string;
  title: string;
  description: LocalizedText;
  stack: string[];
  image: string;
  links: ProjectLinks;
  order?: number;
}

export interface Experience {
  id: string;
  role: LocalizedText;
  company: MaybeLocalized;
  period: LocalizedText;
  current?: boolean;
  description: LocalizedText;
  stack: string[];
  order?: number;
}

/** Documento único de textos editáveis (content/site no Firestore). */
export interface ContentDoc {
  pt?: Record<string, string>;
  en?: Record<string, string>;
}

/** Pacote de dados que o site público consome. */
export interface SiteContent {
  projects: Project[];
  experience: Experience[];
  content: ContentDoc | null;
}
