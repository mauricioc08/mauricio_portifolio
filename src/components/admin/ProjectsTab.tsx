"use client";

import { useEffect, useState, useCallback } from "react";
import { projectsApi } from "@/lib/admin-api";
import { projects as localProjects } from "@/data/projects";
import type { Project } from "@/types";
import { useToast } from "./AdminPanel";
import {
  Field,
  TextInput,
  TextArea,
  ItemRow,
  EmptyState,
  Modal,
  ImageUploadField,
} from "./ui";

type Draft = Omit<Project, "id"> & { id?: string };

const empty = (order: number): Draft => ({
  title: "",
  description: { pt: "", en: "" },
  stack: [],
  image: "",
  links: {},
  order,
});

export function ProjectsTab() {
  const toast = useToast();
  const [items, setItems] = useState<Project[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setItems(await projectsApi.list());
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const remove = async (id: string) => {
    if (!confirm("Excluir este projeto?")) return;
    try {
      await projectsApi.remove(id);
      toast("Projeto excluído ✓");
      refresh();
    } catch (e) {
      toast((e as Error).message, true);
    }
  };

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const { id, ...data } = draft;
      await projectsApi.save(id ?? null, data);
      toast("Projeto salvo ✓");
      setDraft(null);
      refresh();
    } catch (e) {
      toast((e as Error).message, true);
    } finally {
      setSaving(false);
    }
  };

  const seed = async () => {
    for (const p of localProjects) {
      const { id, ...data } = p;
      await projectsApi.save(id, data);
    }
    toast(`${localProjects.length} projetos importados ✓`);
    refresh();
  };

  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="font-display text-step-2">Projetos</h2>
        <button
          onClick={() => setDraft(empty(items.length))}
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
