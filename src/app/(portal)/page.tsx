import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { canAccess, LEAD_STATUS, PROJECT_STATUS } from "@/lib/constants";
import { formatBRL, formatDate } from "@/lib/utils";
import { Users2, KanbanSquare, TrendingUp, CalendarClock } from "lucide-react";

export default async function DashboardPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const showCrm = canAccess(profile.role, "crm");

  const [{ count: leadsCount }, { count: projCount }, { data: pipeline }] =
    await Promise.all([
      supabase.from("leads").select("*", { count: "exact", head: true }),
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("leads").select("status, valor_estimado"),
    ]);

  const emAberto =
    pipeline?.filter((l) => !["ganho", "perdido"].includes(l.status)).length ?? 0;
  const valorPipeline =
    pipeline
      ?.filter((l) => !["ganho", "perdido"].includes(l.status))
      .reduce((s, l) => s + (l.valor_estimado ?? 0), 0) ?? 0;

  const { data: proximasEntregas } = await supabase
    .from("projects")
    .select("id, nome, cliente, status, data_entrega")
    .not("data_entrega", "is", null)
    .neq("status", "entregue")
    .order("data_entrega", { ascending: true })
    .limit(5);

  const kpis = [
    { label: "Leads no total", value: leadsCount ?? 0, icon: Users2, show: showCrm },
    { label: "Leads em aberto", value: emAberto, icon: TrendingUp, show: showCrm },
    {
      label: "Pipeline estimado",
      value: formatBRL(valorPipeline),
      icon: TrendingUp,
      show: showCrm,
    },
    {
      label: "Projetos ativos",
      value: projCount ?? 0,
      icon: KanbanSquare,
      show: true,
    },
  ].filter((k) => k.show);

  return (
    <>
      <PageHeader
        title={`Olá, ${profile.nome.split(" ")[0] || "bem-vindo"} 👋`}
        subtitle="Visão geral do escritório"
      />

      <div className="space-y-8 p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="card p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[var(--muted)]">
                    {k.label}
                  </span>
                  <Icon size={18} className="text-[var(--accent)]" />
                </div>
                <p className="mt-3 font-serif text-3xl text-[var(--ink)]">
                  {k.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="card p-6">
          <div className="mb-4 flex items-center gap-2">
            <CalendarClock size={18} className="text-[var(--accent)]" />
            <h2 className="text-sm font-semibold text-[var(--ink)]">
              Próximas entregas
            </h2>
          </div>
          {proximasEntregas && proximasEntregas.length > 0 ? (
            <ul className="divide-y divide-[var(--border)]">
              {proximasEntregas.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/trabalho/${p.id}`}
                    className="flex items-center justify-between gap-4 py-3 hover:opacity-80"
                  >
                    <div>
                      <p className="font-medium text-[var(--ink)]">{p.nome}</p>
                      <p className="text-xs text-[var(--muted)]">{p.cliente}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge
                        label={PROJECT_STATUS[p.status].label}
                        color={PROJECT_STATUS[p.status].color}
                        size="sm"
                      />
                      <span className="text-xs text-[var(--ink-2)]">
                        {formatDate(p.data_entrega)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-[var(--muted)]">
              Nenhuma entrega agendada.
            </p>
          )}
        </div>

        {showCrm && pipeline && (
          <div className="card p-6">
            <h2 className="mb-4 text-sm font-semibold text-[var(--ink)]">
              Funil de leads
            </h2>
            <div className="flex flex-wrap gap-3">
              {Object.entries(LEAD_STATUS).map(([key, cfg]) => {
                const n = pipeline.filter((l) => l.status === key).length;
                return (
                  <div
                    key={key}
                    className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3 text-center"
                    style={{ minWidth: 110 }}
                  >
                    <p
                      className="font-serif text-2xl"
                      style={{ color: cfg.color }}
                    >
                      {n}
                    </p>
                    <p className="mt-1 text-[11px] text-[var(--muted)]">
                      {cfg.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
