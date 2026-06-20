import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PrintButton } from "@/components/PrintButton";
import { formatBRL, formatDate } from "@/lib/utils";
import type { Proposal } from "@/lib/types/database";

type Conteudo = {
  cliente?: string;
  escopo?: string;
  prazo?: string;
  condicoes?: string;
};

export default async function ProposalDocPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireRole("admin", "marketing");
  const supabase = await createClient();
  const { data } = await supabase.from("proposals").select("*").eq("id", id).single();
  if (!data) notFound();
  const p = data as Proposal;
  const c = (p.conteudo as Conteudo) ?? {};

  return (
    <div className="min-h-full bg-[var(--bg)] py-6">
      <div className="mx-auto mb-4 flex max-w-3xl items-center justify-between px-4 no-print">
        <Link href="/propostas" className="inline-flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--ink)]">
          <ArrowLeft size={15} /> Voltar
        </Link>
        <PrintButton />
      </div>

      <article className="print-doc card mx-auto max-w-3xl bg-white p-12 shadow-sm">
        <header className="mb-10 flex items-start justify-between border-b border-[var(--border)] pb-6">
          <div>
            <h1 className="font-serif text-3xl text-[var(--ink)]">Assis Carrer</h1>
            <p className="mt-1 text-xs tracking-wide text-[var(--muted)]">
              ARQUITETURA · SÃO JOSÉ DOS CAMPOS
            </p>
          </div>
          <div className="text-right text-xs text-[var(--muted)]">
            <p>Proposta comercial</p>
            <p>{formatDate(p.created_at)}</p>
          </div>
        </header>

        <h2 className="font-serif text-2xl text-[var(--ink)]">{p.titulo}</h2>
        {c.cliente && (
          <p className="mt-1 text-sm text-[var(--ink-2)]">
            Preparada para <strong>{c.cliente}</strong>
          </p>
        )}

        {c.escopo && (
          <section className="mt-8">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--accent)]">
              Escopo do projeto
            </h3>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--ink-2)]">
              {c.escopo}
            </p>
          </section>
        )}

        <section className="mt-8 grid grid-cols-2 gap-6">
          <div>
            <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-[var(--accent)]">
              Investimento
            </h3>
            <p className="font-serif text-2xl text-[var(--ink)]">{formatBRL(p.valor)}</p>
          </div>
          {c.prazo && (
            <div>
              <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-[var(--accent)]">
                Prazo
              </h3>
              <p className="text-sm text-[var(--ink-2)]">{c.prazo}</p>
            </div>
          )}
        </section>

        {c.condicoes && (
          <section className="mt-8">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--accent)]">
              Condições comerciais
            </h3>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--ink-2)]">
              {c.condicoes}
            </p>
          </section>
        )}

        <footer className="mt-16 border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--muted)]">
          Assis Carrer Arquitetura · www.assiscarrer-arquitetura.com
        </footer>
      </article>
    </div>
  );
}
