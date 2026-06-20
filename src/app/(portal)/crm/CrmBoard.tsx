"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { LEAD_PIPELINE, LEAD_STATUS } from "@/lib/constants";
import { formatBRL } from "@/lib/utils";
import { LeadModal } from "./LeadModal";
import { moveLead, deleteLead } from "./actions";
import type { Lead } from "@/lib/types/database";

export function CrmBoard({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Lead | null>(null);

  const openNew = () => {
    setEditing(null);
    setOpen(true);
  };
  const openEdit = (l: Lead) => {
    setEditing(l);
    setOpen(true);
  };
  const onSaved = () => {
    setOpen(false);
    router.refresh();
  };

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-[var(--muted)]">
          {leads.length} {leads.length === 1 ? "lead" : "leads"} no total
        </p>
        <button
          onClick={openNew}
          className="btn-accent inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold"
        >
          <Plus size={16} /> Novo lead
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {LEAD_PIPELINE.map((status) => {
          const cfg = LEAD_STATUS[status];
          const col = leads.filter((l) => l.status === status);
          const total = col.reduce((s, l) => s + (l.valor_estimado ?? 0), 0);
          return (
            <div key={status} className="w-72 flex-shrink-0">
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: cfg.color }}
                  />
                  {cfg.label}
                  <span className="text-xs font-normal text-[var(--muted)]">
                    {col.length}
                  </span>
                </span>
              </div>
              {total > 0 && (
                <p className="mb-2 px-1 text-[11px] text-[var(--muted)]">
                  {formatBRL(total)}
                </p>
              )}
              <div className="space-y-2 rounded-xl bg-[var(--surface-2)] p-2">
                {col.map((l) => (
                  <div key={l.id} className="card group p-3">
                    <div className="flex items-start justify-between gap-2">
                      <button
                        onClick={() => openEdit(l)}
                        className="text-left font-medium text-[var(--ink)] hover:text-[var(--accent)]"
                      >
                        {l.nome}
                      </button>
                      <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
                        <button
                          onClick={() => openEdit(l)}
                          className="rounded p-1 text-[var(--muted)] hover:bg-[var(--surface-2)]"
                        >
                          <Pencil size={13} />
                        </button>
                        <form
                          action={async (fd) => {
                            if (confirm(`Excluir o lead "${l.nome}"?`)) {
                              await deleteLead(fd);
                              router.refresh();
                            }
                          }}
                        >
                          <input type="hidden" name="id" value={l.id} />
                          <button
                            type="submit"
                            className="rounded p-1 text-[var(--muted)] hover:bg-[#fff5f5] hover:text-[var(--red)]"
                          >
                            <Trash2 size={13} />
                          </button>
                        </form>
                      </div>
                    </div>

                    {(l.tipo_projeto || l.origem) && (
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        {[l.tipo_projeto, l.origem].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    {l.valor_estimado != null && (
                      <p className="mt-1 text-xs font-medium text-[var(--ink-2)]">
                        {formatBRL(l.valor_estimado)}
                      </p>
                    )}

                    <form
                      action={async (fd) => {
                        await moveLead(fd);
                        router.refresh();
                      }}
                      className="mt-2"
                    >
                      <input type="hidden" name="id" value={l.id} />
                      <select
                        name="status"
                        defaultValue={l.status}
                        onChange={(e) => e.currentTarget.form?.requestSubmit()}
                        className="w-full rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1 text-[11px] outline-none"
                      >
                        {LEAD_PIPELINE.map((s) => (
                          <option key={s} value={s}>
                            Mover p/ {LEAD_STATUS[s].label}
                          </option>
                        ))}
                      </select>
                    </form>
                  </div>
                ))}
                {col.length === 0 && (
                  <p className="px-1 py-4 text-center text-xs text-[var(--muted)]">
                    —
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <LeadModal
        open={open}
        lead={editing}
        onClose={() => setOpen(false)}
        onSaved={onSaved}
      />
    </>
  );
}
