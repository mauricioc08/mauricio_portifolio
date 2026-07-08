"use client";

import { useEffect, useState, useCallback } from "react";
import { experienceApi } from "@/lib/admin-api";
import { experience as localExperience } from "@/data/experience";
import type { Experience, MaybeLocalized } from "@/types";
import { useToast } from "./AdminPanel";
import { Field, TextInput, TextArea, ItemRow, EmptyState, Modal } from "./ui";

type Draft = Omit<Experience, "id"> & { id?: string };

const loc = (v: MaybeLocalized | undefined, k: "pt" | "en") =>
  v == null ? "" : typeof v === "object" ? (v[k] ?? "") : v;

const empty = (order: number): Draft => ({
  role: { pt: "", en: "" },
  company: "",
  period: { pt: "", en: "" },
  current: false,
  description: { pt: "", en: "" },
  stack: [],
  order,
});

export function ExperienceTab() {
  const toast = useToast();
  const [items, setItems] = useState<Experience[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setItems(await experienceApi.list());
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const remove = async (id: string) => {
    if (!confirm("Excluir esta experiência?")) return;
    try {
      await experienceApi.remove(id);
      toast("Experiência excluída ✓");
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
      await experienceApi.save(id ?? null, data);
      toast("Experiência salva ✓");
      setDraft(null);
      refresh();
    } catch (e) {
      toast((e as Error).message, true);
    } finally {
      setSaving(false);
    }
  };

  const seed = async () => {
    for (const x of localExperience) {
      const { id, ...data } = x;
      await experienceApi.save(id, data);
    }
    toast(`${localExperience.length} experiências importadas ✓`);
    refresh();
  };

  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="font-display text-step-2">Experiência</h2>
        <button
          onClick={() => setDraft(empty(items.length))}
          className="accent-grad rounded-full px-[1.1rem] py-[0.6rem] font-semibold text-[color:var(--color-on-accent)]"
        >
          + Nova experiência
        </button>
      </div>

      <div className="grid gap-[0.9rem]">
        {items.map((x) => (
          <ItemRow
            key={x.id}
            title={loc(x.role, "pt")}
            subtitle={`${loc(x.company, "pt")}${x.current ? " · atual" : ""}`}
            onEdit={() => setDraft(x)}
            onDelete={() => remove(x.id)}
          />
        ))}
        {items.length === 0 && (
          <EmptyState
            message="Nenhuma experiência ainda."
            actionLabel="Importar minha experiência atual"
            onAction={seed}
          />
        )}
      </div>

      {draft && (
        <Modal
          title={draft.id ? "Editar experiência" : "Nova experiência"}
          onClose={() => setDraft(null)}
          onSave={save}
          saving={saving}
        >
          <Field label="Cargo (PT)">
            <TextInput
              value={draft.role.pt}
              onChange={(e) =>
                setDraft({ ...draft, role: { ...draft.role, pt: e.target.value } })
              }
              required
            />
          </Field>
          <Field label="Cargo (EN)">
            <TextInput
              value={draft.role.en}
              onChange={(e) =>
                setDraft({ ...draft, role: { ...draft.role, en: e.target.value } })
              }
            />
          </Field>
          <Field label="Empresa">
            <TextInput
              value={loc(draft.company, "pt")}
              onChange={(e) => setDraft({ ...draft, company: e.target.value })}
            />
          </Field>
          <Field label="Período PT (ex: 2025 — Atual)">
            <TextInput
              value={draft.period.pt}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  period: { ...draft.period, pt: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Período EN (ex: 2025 — Present)">
            <TextInput
              value={draft.period.en}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  period: { ...draft.period, en: e.target.value },
                })
              }
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={!!draft.current}
              onChange={(e) => setDraft({ ...draft, current: e.target.checked })}
            />
            É o emprego atual?
          </label>
          <Field label="Ordem">
            <TextInput
              type="number"
              value={draft.order ?? 0}
              onChange={(e) =>
                setDraft({ ...draft, order: Number(e.target.value) })
              }
            />
          </Field>
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
          <Field label="Stack (vírgula)">
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
        </Modal>
      )}
    </section>
  );
}
