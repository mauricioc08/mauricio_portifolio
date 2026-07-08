"use client";

import { useEffect, useState } from "react";
import { contentApi } from "@/lib/admin-api";
import { dictionary, EDITABLE_KEYS } from "@/lib/i18n/dictionary";
import type { ContentDoc } from "@/types";
import { useToast } from "./AdminPanel";
import { TextArea } from "./ui";

export function ContentTab() {
  const toast = useToast();
  const [data, setData] = useState<ContentDoc>({ pt: {}, en: {} });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    contentApi
      .get()
      .then((d) => setData({ pt: d.pt ?? {}, en: d.en ?? {} }))
      .catch(() => {});
  }, []);

  const val = (lang: "pt" | "en", key: string) =>
    data[lang]?.[key] ?? dictionary[lang][key as keyof typeof dictionary.pt] ?? "";

  const setVal = (lang: "pt" | "en", key: string, v: string) =>
    setData((d) => ({ ...d, [lang]: { ...d[lang], [key]: v } }));

  const save = async () => {
    setSaving(true);
    try {
      await contentApi.save(data);
      toast("Textos salvos ✓");
    } catch (e) {
      toast((e as Error).message, true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="font-display text-step-2">Textos das seções</h2>
        <button
          onClick={save}
          disabled={saving}
          className="accent-grad rounded-full px-[1.1rem] py-[0.6rem] font-semibold text-[color:var(--color-on-accent)] disabled:opacity-60"
        >
          {saving ? "Salvando…" : "Salvar textos"}
        </button>
      </div>

      <div className="grid gap-6">
        {EDITABLE_KEYS.map((key) => (
          <div
            key={key}
            className="grid gap-[0.9rem] rounded-[var(--radius)] border border-border bg-surface p-[1.3rem]"
          >
            <h4 className="font-mono text-[0.8rem] uppercase tracking-[0.05em] text-accent">
              {key}
            </h4>
            <div className="grid gap-[0.9rem] sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm text-muted">
                PT
                <TextArea
                  value={val("pt", key)}
                  onChange={(e) => setVal("pt", key, e.target.value)}
                />
              </label>
              <label className="grid gap-1.5 text-sm text-muted">
                EN
                <TextArea
                  value={val("en", key)}
                  onChange={(e) => setVal("en", key, e.target.value)}
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
