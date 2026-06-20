"use client";

import { useActionState } from "react";
import { UserPlus } from "lucide-react";
import { createUser } from "./actions";

export function CreateUserForm() {
  const [state, action, pending] = useActionState(createUser, null);

  return (
    <form action={action} className="card p-6">
      <div className="mb-4 flex items-center gap-2">
        <UserPlus size={18} className="text-[var(--accent)]" />
        <h2 className="text-sm font-semibold text-[var(--ink)]">
          Adicionar membro da equipe
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input
          name="nome"
          required
          placeholder="Nome"
          className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="E-mail"
          className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        />
        <select
          name="role"
          defaultValue="arquiteta"
          className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        >
          <option value="arquiteta">Arquiteta</option>
          <option value="marketing">Marketing</option>
          <option value="admin">Administrador</option>
        </select>
        <input
          name="senha"
          type="text"
          required
          placeholder="Senha provisória"
          className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="btn-accent rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          {pending ? "Criando…" : "Criar usuário"}
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
