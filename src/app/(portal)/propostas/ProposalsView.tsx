"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { PROPOSAL_STATUS } from "@/lib/constants";
import { formatBRL, formatDate } from "@/lib/utils";
import { ProposalModal } from "./ProposalModal";
import { deleteProposal } from "./actions";
import type { Lead, Proposal } from "@/lib/types/database";

export function ProposalsView({
  proposals,
  leads,
}: {
  proposals: Proposal[];
  leads: Lead[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Proposal | null>(null);

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-[var(--muted)]">{proposals.length} propostas</p>
        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="btn-accent inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold"
        >
          <Plus size={16} /> Nova proposta
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-xs text-[var(--muted)]">
              <th className="px-5 py-3 font-medium">Proposta</th>
              <th className="px-5 py-3 font-medium">Valor</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Criada</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((p) => (
              <tr key={p.id} className="border-b border-[var(--border)] last:border-0">
                <td className="px-5 py-3 font-medium text-[var(--ink)]">{p.titulo}</td>
                <td className="px-5 py-3">{formatBRL(p.valor)}</td>
                <td className="px-5 py-3">
                  <StatusBadge
                    label={PROPOSAL_STATUS[p.status].label}
                    color={PROPOSAL_STATUS[p.status].color}
                    size="sm"
                  />
                </td>
                <td className="px-5 py-3 text-[var(--muted)]">{formatDate(p.created_at)}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/propostas/${p.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--ink-2)] hover:bg-[var(--surface-2)]"
                    >
                      <FileText size={13} /> Ver / PDF
                    </Link>
                    <button
                      onClick={() => {
                        setEditing(p);
                        setOpen(true);
                      }}
                      className="rounded p-1.5 text-[var(--muted)] hover:bg-[var(--surface-2)]"
                    >
                      <Pencil size={14} />
                    </button>
                    <form
                      action={async (fd) => {
                        if (confirm(`Excluir "${p.titulo}"?`)) {
                          await deleteProposal(fd);
                          router.refresh();
                        }
                      }}
                    >
                      <input type="hidden" name="id" value={p.id} />
                      <button className="rounded p-1.5 text-[var(--muted)] hover:text-[var(--red)]">
                        <Trash2 size={14} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {proposals.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-sm text-[var(--muted)]">
                  Nenhuma proposta ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ProposalModal
        open={open}
        proposal={editing}
        leads={leads}
        onClose={() => setOpen(false)}
        onSaved={() => {
          setOpen(false);
          router.refresh();
        }}
      />
    </>
  );
}
