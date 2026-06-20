"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileBarChart } from "lucide-react";
import { generateReport } from "./actions";

const field =
  "rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";

export function GenerateForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(generateReport, null);

  useEffect(() => {
    if (state?.ok && state.id) router.push(`/relatorios/${state.id}`);
  }, [state, router]);

  return (
    <form action={action} className="card p-6">
      <div className="mb-4 flex items-center gap-2">
        <FileBarChart size={18} className="text-[var(--accent)]" />
        <h2 className="text-sm font-semibold text-[var(--ink)]">Gerar relatório</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input name="titulo" placeholder="Título (opcional)" className={`${field} lg:col-span-2`} />
        <div>
          <label className="mb-1 block text-[11px] text-[var(--muted)]">De</label>
          <input name="periodo_inicio" type="date" required className={`${field} w-full`} />
        </div>
        <div>
          <label className="mb-1 block text-[11px] text-[var(--muted)]">Até</label>
          <input name="periodo_fim" type="date" required className={`${field} w-full`} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="btn-accent rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          {pending ? "Gerando…" : "Gerar relatório"}
        </button>
        {state?.error && <span className="text-xs text-[var(--red)]">{state.error}</span>}
      </div>
    </form>
  );
}
