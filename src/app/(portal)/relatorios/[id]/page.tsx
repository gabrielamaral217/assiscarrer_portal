import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PrintButton } from "@/components/PrintButton";
import { LEAD_STATUS } from "@/lib/constants";
import { formatBRL, formatDate } from "@/lib/utils";
import type { LeadStatus, Report } from "@/lib/types/database";

type Dados = {
  totalLeads: number;
  porStatus: Record<string, number>;
  porOrigem: Record<string, number>;
  pipeline: number;
  ganhos: number;
  valorGanho: number;
  ga4: { usuarios: number; sessoes: number; conversoes: number; engajamento: number } | null;
};

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-[var(--border)] p-4">
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className="mt-1 font-serif text-2xl text-[var(--ink)]">{value}</p>
    </div>
  );
}

export default async function ReportDocPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireRole("admin", "marketing");
  const supabase = await createClient();
  const { data } = await supabase.from("reports").select("*").eq("id", id).single();
  if (!data) notFound();
  const r = data as Report;
  const d = r.dados as Dados;

  return (
    <div className="min-h-full bg-[var(--bg)] py-6">
      <div className="mx-auto mb-4 flex max-w-3xl items-center justify-between px-4 no-print">
        <Link href="/relatorios" className="inline-flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--ink)]">
          <ArrowLeft size={15} /> Voltar
        </Link>
        <PrintButton />
      </div>

      <article className="print-doc card mx-auto max-w-3xl bg-white p-12 shadow-sm">
        <header className="mb-8 flex items-start justify-between border-b border-[var(--border)] pb-6">
          <div>
            <h1 className="font-serif text-2xl text-[var(--ink)]">Assis Carrer</h1>
            <p className="mt-1 text-xs tracking-wide text-[var(--muted)]">RELATÓRIO DE MARKETING</p>
          </div>
          <div className="text-right text-xs text-[var(--muted)]">
            <p>{formatDate(r.periodo_inicio)} — {formatDate(r.periodo_fim)}</p>
          </div>
        </header>

        <h2 className="font-serif text-xl text-[var(--ink)]">{r.titulo}</h2>

        <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat label="Leads no período" value={d.totalLeads} />
          <Stat label="Pipeline aberto" value={formatBRL(d.pipeline)} />
          <Stat label="Negócios ganhos" value={d.ganhos} />
          <Stat label="Valor ganho" value={formatBRL(d.valorGanho)} />
        </section>

        <section className="mt-8">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--accent)]">
            Funil por status
          </h3>
          <div className="space-y-1.5">
            {(Object.keys(LEAD_STATUS) as LeadStatus[]).map((s) => {
              const n = d.porStatus?.[s] ?? 0;
              const pct = d.totalLeads ? Math.round((n / d.totalLeads) * 100) : 0;
              return (
                <div key={s} className="flex items-center gap-3 text-sm">
                  <span className="w-32 text-[var(--ink-2)]">{LEAD_STATUS[s].label}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-[var(--surface-2)]">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: LEAD_STATUS[s].color }} />
                  </div>
                  <span className="w-10 text-right text-[var(--ink-2)]">{n}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-8">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--accent)]">
            Origem dos leads
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(d.porOrigem ?? {}).map(([o, n]) => (
              <span key={o} className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs text-[var(--ink-2)]">
                {o}: <strong>{n}</strong>
              </span>
            ))}
            {Object.keys(d.porOrigem ?? {}).length === 0 && (
              <span className="text-sm text-[var(--muted)]">Sem dados de origem.</span>
            )}
          </div>
        </section>

        {d.ga4 && (
          <section className="mt-8">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--accent)]">
              Tráfego do site (GA4 · últimos 28 dias)
            </h3>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Stat label="Usuários" value={d.ga4.usuarios.toLocaleString("pt-BR")} />
              <Stat label="Sessões" value={d.ga4.sessoes.toLocaleString("pt-BR")} />
              <Stat label="Conversões" value={d.ga4.conversoes.toLocaleString("pt-BR")} />
              <Stat label="Engajamento" value={`${d.ga4.engajamento}%`} />
            </div>
          </section>
        )}

        <footer className="mt-16 border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--muted)]">
          Gerado em {formatDate(r.created_at)} · Assis Carrer Arquitetura
        </footer>
      </article>
    </div>
  );
}
