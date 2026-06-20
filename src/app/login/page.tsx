"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl text-[var(--ink)]">Assis Carrer</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Portal interno · Arquitetura
          </p>
        </div>

        <form
          action={formAction}
          className="card space-y-4 p-7 shadow-sm"
        >
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--ink-2)]">
              E-mail
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
              placeholder="voce@assiscarrer.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--ink-2)]">
              Senha
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <p className="rounded-lg bg-[#fff5f5] px-3 py-2 text-xs text-[var(--red)]">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="btn-accent w-full rounded-lg py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            {pending ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[var(--muted)]">
          Acesso restrito à equipe. Fale com o administrador.
        </p>
      </div>
    </main>
  );
}
