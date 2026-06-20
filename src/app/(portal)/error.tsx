"use client";

import { AlertTriangle } from "lucide-react";

export default function PortalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] p-6">
      <div className="card max-w-md p-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#fff5f5]">
          <AlertTriangle size={22} className="text-[var(--red)]" />
        </div>
        <h1 className="font-serif text-xl text-[var(--ink)]">Algo deu errado</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Não foi possível carregar esta página. Se o portal acabou de ser publicado,
          verifique se as variáveis de ambiente do Supabase estão configuradas na
          hospedagem e refaça o deploy.
        </p>
        <button
          onClick={reset}
          className="btn-accent mt-5 rounded-lg px-4 py-2 text-sm font-semibold"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
