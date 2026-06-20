"use client";

import { useActionState } from "react";
import { ShieldCheck } from "lucide-react";
import { changeOwnPassword } from "./actions";

export function ChangeOwnPassword() {
  const [state, action, pending] = useActionState(changeOwnPassword, null);
  return (
    <form action={action} className="card p-6">
      <div className="mb-4 flex items-center gap-2">
        <ShieldCheck size={18} className="text-[var(--accent)]" />
        <h2 className="text-sm font-semibold text-[var(--ink)]">Minha senha</h2>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          name="senha"
          type="password"
          required
          placeholder="Nova senha"
          className="w-56 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--ink)] hover:bg-[var(--surface-2)] disabled:opacity-60"
        >
          {pending ? "Salvando…" : "Alterar senha"}
        </button>
        {state?.error && (
          <span className="text-xs text-[var(--red)]">{state.error}</span>
        )}
        {state?.ok && (
          <span className="text-xs text-[var(--green)]">{state.ok}</span>
        )}
      </div>
    </form>
  );
}
