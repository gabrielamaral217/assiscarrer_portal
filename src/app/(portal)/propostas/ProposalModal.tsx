"use client";

import { useActionState, useEffect } from "react";
import { Modal } from "@/components/Modal";
import { PROPOSAL_STATUS } from "@/lib/constants";
import { saveProposal } from "./actions";
import type { Lead, Proposal } from "@/lib/types/database";

const field =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";
const label = "mb-1 block text-xs font-medium text-[var(--ink-2)]";

type Conteudo = {
  cliente?: string;
  escopo?: string;
  prazo?: string;
  condicoes?: string;
};

export function ProposalModal({
  open,
  proposal,
  leads,
  onClose,
  onSaved,
}: {
  open: boolean;
  proposal: Proposal | null;
  leads: Lead[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [state, action, pending] = useActionState(saveProposal, null);
  const c = (proposal?.conteudo as Conteudo) ?? {};

  useEffect(() => {
    if (state?.ok) onSaved();
  }, [state, onSaved]);

  return (
    <Modal open={open} onClose={onClose} title={proposal ? "Editar proposta" : "Nova proposta"} wide>
      <form action={action} className="space-y-4">
        {proposal && <input type="hidden" name="id" value={proposal.id} />}
        <input type="hidden" name="itens" value="[]" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Título *</label>
            <input name="titulo" required defaultValue={proposal?.titulo ?? ""} className={field} />
          </div>
          <div>
            <label className={label}>Cliente</label>
            <input name="cliente" defaultValue={c.cliente ?? ""} className={field} />
          </div>
          <div>
            <label className={label}>Lead relacionado</label>
            <select name="lead_id" defaultValue={proposal?.lead_id ?? ""} className={field}>
              <option value="">— nenhum —</option>
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Status</label>
            <select name="status" defaultValue={proposal?.status ?? "rascunho"} className={field}>
              {Object.entries(PROPOSAL_STATUS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Valor (R$)</label>
            <input name="valor" inputMode="decimal" defaultValue={proposal?.valor ?? ""} className={field} />
          </div>
          <div>
            <label className={label}>Prazo de execução</label>
            <input name="prazo" placeholder="Ex: 90 dias" defaultValue={c.prazo ?? ""} className={field} />
          </div>
        </div>
        <div>
          <label className={label}>Escopo do projeto</label>
          <textarea name="escopo" rows={4} defaultValue={c.escopo ?? ""} className={field} />
        </div>
        <div>
          <label className={label}>Condições comerciais</label>
          <textarea name="condicoes" rows={2} defaultValue={c.condicoes ?? ""} className={field} />
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
