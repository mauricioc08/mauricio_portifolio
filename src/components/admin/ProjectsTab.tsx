"use client";

import { projectsApi } from "@/lib/admin-api";
import { projects as seedProjects } from "@/data/projects";
import type { Project } from "@/types";
import { useCrudTab } from "./useCrudTab";
import {
  Field,
  TextInput,
  TextArea,
  ItemRow,
  EmptyState,
  Modal,
  ImageUploadField,
} from "./ui";

const emptyProject = (order: number): Omit<Project, "id"> => ({
  title: "",
  description: { pt: "", en: "" },
  stack: [],
  image: "",
  links: {},
  order,
});

export function ProjectsTab() {
  const { items, draft, setDraft, saving, remove, save, seed } = useCrudTab<Project>({
    api: projectsApi,
    seedData: seedProjects,
    labels: {
      saved: "Projeto salvo ✓",
      deleted: "Projeto excluído ✓",
      confirmDelete: "Excluir este projeto?",
      seeded: (n) => `${n} projetos importados ✓`,
    },
  });

  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="font-display text-step-2">Projetos</h2>
        <button
          onClick={() => setDraft(emptyProject(items.length))}
          className="accent-grad rounded-full px-[1.1rem] py-[0.6rem] font-semibold text-[color:var(--color-on-accent)]"
        >
          + Novo projeto
        </button>
      </div>

      <div className="grid gap-[0.9rem]">
        {items.map((p) => (
          <ItemRow
            key={p.id}
            thumb={p.image}
            title={p.title}
            subtitle={p.stack.join(" · ")}
            onEdit={() => setDraft(p)}
            onDelete={() => remove(p.id)}
          />
        ))}
        {items.length === 0 && (
          <EmptyState
            message="Nenhum projeto ainda."
            actionLabel="Importar meus projetos atuais"
            onAction={seed}
          />
        )}
      </div>

      {draft && (
        <Modal
          title={draft.id ? "Editar projeto" : "Novo projeto"}
          onClose={() => setDraft(null)}
          onSave={save}
          saving={saving}
        >
          <Field label="Título">
            <TextInput
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              required
            />
          </Field>
          <Field label="Ordem (menor aparece primeiro)">
            <TextInput
              type="number"
              value={draft.order ?? 0}
              onChange={(e) =>
                setDraft({ ...draft, order: Number(e.target.value) })
              }
            />
          </Field>
          <ImageUploadField
            value={draft.image}
            onChange={(url) => setDraft({ ...draft, image: url })}
          />
          <Field label="Descrição (PT)">
            <TextArea
              value={draft.description.pt}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  description: { ...draft.description, pt: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Descrição (EN)">
            <TextArea
              value={draft.description.en}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  description: { ...draft.description, en: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Stack (separe por vírgula)">
            <TextInput
              value={draft.stack.join(", ")}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  stack: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
          </Field>
          <Field label="Link do repositório (opcional)">
            <TextInput
              value={draft.links.repo ?? ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  links: { ...draft.links, repo: e.target.value || undefined },
                })
              }
            />
          </Field>
          <Field label="Link ao vivo (opcional)">
            <TextInput
              value={draft.links.live ?? ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  links: { ...draft.links, live: e.target.value || undefined },
                })
              }
            />
          </Field>
        </Modal>
      )}
    </section>
  );
}
