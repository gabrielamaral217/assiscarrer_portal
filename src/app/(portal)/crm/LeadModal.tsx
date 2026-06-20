"use client";

import { useActionState, useEffect } from "react";
import { Modal } from "@/components/Modal";
import { LEAD_PIPELINE, LEAD_STATUS } from "@/lib/constants";
import { saveLead } from "./actions";
import type { Lead } from "@/lib/types/database";

const field =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";
const label = "mb-1 block text-xs font-medium text-[var(--ink-2)]";

export function LeadModal({
  open,
  lead,
  onClose,
  onSaved,
}: {
  open: boolean;
  lead: Lead | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [state, action, pending] = useActionState(saveLead, null);

  useEffect(() => {
    if (state?.ok) onSaved();
  }, [state, onSaved]);

  return (
    <Modal open={open} onClose={onClose} title={lead ? "Editar lead" : "Novo lead"} wide>
      <form action={action} className="space-y-4">
        {lead && <input type="hidden" name="id" value={lead.id} />}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Nome *</label>
            <input name="nome" required defaultValue={lead?.nome ?? ""} className={field} />
          </div>
          <div>
            <label className={label}>Status</label>
            <select name="status" defaultValue={lead?.status ?? "novo"} className={field}>
              {LEAD_PIPELINE.map((s) => (
                <option key={s} value={s}>
                  {LEAD_STATUS[s].label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>E-mail</label>
            <input name="email" type="email" defaultValue={lead?.email ?? ""} className={field} />
          </div>
          <div>
            <label className={label}>Telefone</label>
            <input name="telefone" defaultValue={lead?.telefone ?? ""} className={field} />
          </div>
          <div>
            <label className={label}>Origem</label>
            <input
              name="origem"
              list="origens"
              placeholder="Google Ads, Instagram…"
              defaultValue={lead?.origem ?? ""}
              className={field}
            />
            <datalist id="origens">
              <option value="Google Ads" />
              <option value="Instagram" />
              <option value="Indicação" />
              <option value="Site" />
              <option value="WhatsApp" />
            </datalist>
          </div>
          <div>
            <label className={label}>Tipo de projeto</label>
            <input
              name="tipo_projeto"
              list="tipos"
              placeholder="Residencial, comercial…"
              defaultValue={lead?.tipo_projeto ?? ""}
              className={field}
            />
            <datalist id="tipos">
              <option value="Residencial" />
              <option value="Comercial" />
              <option value="Apartamento" />
              <option value="Reforma" />
            </datalist>
          </div>
          <div>
            <label className={label}>Valor estimado (R$)</label>
            <input
              name="valor_estimado"
              inputMode="decimal"
              defaultValue={lead?.valor_estimado ?? ""}
              className={field}
            />
          </div>
        </div>
        <div>
          <label className={label}>Notas</label>
          <textarea name="notas" rows={3} defaultValue={lead?.notas ?? ""} className={field} />
        </div>

        {state?.error && <p className="text-xs text-[var(--red)]">{state.error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--ink-2)] hover:bg-[var(--surface-2)]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={pending}
            className="btn-accent rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60"
          >
            {pending ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
