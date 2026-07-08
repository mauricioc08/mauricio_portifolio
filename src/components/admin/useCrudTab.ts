"use client";

import { useCallback, useEffect, useState } from "react";
import { useToast } from "./AdminPanel";

// API mínima que uma coleção CRUD do admin precisa expor.
export interface CrudApi<T extends { id: string }> {
  list: () => Promise<T[]>;
  save: (id: string | null, data: Omit<T, "id">) => Promise<unknown>;
  remove: (id: string) => Promise<unknown>;
}

interface CrudLabels {
  saved: string;
  deleted: string;
  confirmDelete: string;
  seeded: (n: number) => string;
}

// Estado e ações compartilhados por ProjectsTab e ExperienceTab.
// Cada aba só fornece a api, o item vazio, os dados de seed e os rótulos.
export function useCrudTab<T extends { id: string }>(opts: {
  api: CrudApi<T>;
  seedData: T[];
  labels: CrudLabels;
}) {
  const { api, seedData, labels } = opts;
  const toast = useToast();

  const [items, setItems] = useState<T[]>([]);
  const [draft, setDraft] = useState<(Omit<T, "id"> & { id?: string }) | null>(
    null
  );
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setItems(await api.list());
    } catch {
      setItems([]);
    }
  }, [api]);

  // busca inicial ao montar. `refresh` só chama setState após o await (fetch),
  // não de forma síncrona — o lint não distingue, por isso o disable pontual.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  const remove = useCallback(
    async (id: string) => {
      if (!confirm(labels.confirmDelete)) return;
      try {
        await api.remove(id);
        toast(labels.deleted);
        refresh();
      } catch (e) {
        toast((e as Error).message, true);
      }
    },
    [api, labels, refresh, toast]
  );

  const save = useCallback(async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const { id, ...data } = draft;
      await api.save(id ?? null, data as Omit<T, "id">);
      toast(labels.saved);
      setDraft(null);
      refresh();
    } catch (e) {
      toast((e as Error).message, true);
    } finally {
      setSaving(false);
    }
  }, [api, draft, labels, refresh, toast]);

  const seed = useCallback(async () => {
    for (const item of seedData) {
      const { id, ...data } = item;
      await api.save(id, data as Omit<T, "id">);
    }
    toast(labels.seeded(seedData.length));
    refresh();
  }, [api, labels, refresh, seedData, toast]);

  return { items, draft, setDraft, saving, remove, save, seed };
}
