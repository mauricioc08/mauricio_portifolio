"use client";

// Primitivas de UI do admin: input, textarea, item da lista, modal, upload.
import { useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary";

const inputCls =
  "w-full rounded-[10px] border border-border bg-surface-strong px-[0.9rem] py-[0.7rem] text-text focus:border-transparent focus:outline focus:outline-2 focus:outline-accent";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-sm text-muted">
      {label}
      {children}
    </label>
  );
}

export function TextInput(props: React.ComponentProps<"input">) {
  return <input {...props} className={inputCls} />;
}

export function TextArea(props: React.ComponentProps<"textarea">) {
  return (
    <textarea
      {...props}
      className={`${inputCls} min-h-[5rem] resize-y leading-relaxed`}
    />
  );
}

export function ItemRow({
  thumb,
  title,
  subtitle,
  onEdit,
  onDelete,
}: {
  thumb?: string;
  title: string;
  subtitle?: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-4 rounded-[var(--radius)] border border-border bg-surface px-[1.2rem] py-4">
      {thumb !== undefined && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumb || undefined}
          alt=""
          className="h-10 w-16 shrink-0 rounded-md bg-surface-strong object-cover"
        />
      )}
      <div className="min-w-0 flex-1">
        <strong className="block truncate font-display">{title}</strong>
        <span className="text-sm text-muted">{subtitle}</span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:border-border-strong hover:text-text"
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:border-[#ff6b6b] hover:text-[#ff6b6b]"
        >
          Excluir
        </button>
      </div>
    </div>
  );
}

export function EmptyState({
  message,
  actionLabel,
  onAction,
}: {
  message: string;
  actionLabel?: string;
  onAction?: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <div className="grid gap-3">
      <p className="text-sm text-faint">{message}</p>
      {actionLabel && onAction && (
        <button
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            try {
              await onAction();
            } finally {
              setLoading(false);
            }
          }}
          className="justify-self-start rounded-full border border-border-strong bg-surface-strong px-5 py-2 text-sm hover:border-accent hover:text-accent disabled:opacity-60"
        >
          {loading ? "Importando…" : actionLabel}
        </button>
      )}
    </div>
  );
}

export function Modal({
  title,
  onClose,
  onSave,
  saving,
  children,
}: {
  title: string;
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-[var(--gutter)]">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[4px]"
        onClick={onClose}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
        className="glass relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden p-0"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-[1.1rem]">
          <h3 className="font-display text-step-1">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface-strong hover:text-text"
          >
            ✕
          </button>
        </div>
        <div className="grid gap-4 overflow-y-auto p-6">{children}</div>
        <div className="flex justify-end gap-2 border-t border-border px-6 py-[1.1rem]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border-strong bg-surface-strong px-5 py-2 text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="accent-grad rounded-full px-5 py-2 text-sm font-semibold text-[color:var(--color-on-accent)] disabled:opacity-60"
          >
            {saving ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function ImageUploadField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [status, setStatus] = useState("");

  return (
    <Field label="Imagem">
      <div className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={value || undefined}
          alt=""
          className="h-[75px] w-[120px] shrink-0 rounded-md border border-border bg-surface-strong object-cover"
        />
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setStatus("Enviando… 0%");
              try {
                const url = await uploadToCloudinary(f, (pct) =>
                  setStatus(`Enviando… ${pct}%`)
                );
                onChange(url);
                setStatus("Imagem enviada ✓");
              } catch (err) {
                setStatus("Falha: " + (err as Error).message);
              }
            }}
            className="text-sm text-muted"
          />
          {status && <p className="mt-1 text-xs text-muted">{status}</p>}
          <p className="mt-1 text-xs text-faint">Ou cole uma URL de imagem:</p>
          <TextInput
            type="text"
            placeholder="https://…"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
    </Field>
  );
}
