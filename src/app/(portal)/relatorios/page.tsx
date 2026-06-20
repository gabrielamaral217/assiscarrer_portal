import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { GenerateForm } from "./GenerateForm";
import { deleteReport } from "./actions";
import { formatDate } from "@/lib/utils";
import { FileText, Trash2 } from "lucide-react";
import type { Report } from "@/lib/types/database";

export default async function RelatoriosPage() {
  await requireRole("admin", "marketing");
  const supabase = await createClient();
  const { data: reports } = await supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <PageHeader title="Relatórios" subtitle="Relatórios de marketing exportáveis" />
      <div className="space-y-6 p-8">
        <GenerateForm />

        <div className="card overflow-hidden">
          <div className="border-b border-[var(--border)] px-6 py-4">
            <h2 className="text-sm font-semibold text-[var(--ink)]">
              Relatórios gerados ({reports?.length ?? 0})
            </h2>
          </div>
          <ul className="divide-y divide-[var(--border)]">
            {(reports as Report[] | null)?.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-4 px-6 py-4">
                <Link href={`/relatorios/${r.id}`} className="flex items-center gap-3 hover:opacity-80">
                  <FileText size={18} className="text-[var(--accent)]" />
                  <div>
                    <p className="font-medium text-[var(--ink)]">{r.titulo}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {formatDate(r.periodo_inicio)} — {formatDate(r.periodo_fim)}
                    </p>
                  </div>
                </Link>
                <form action={deleteReport}>
                  <input type="hidden" name="id" value={r.id} />
                  <button className="rounded p-1.5 text-[var(--muted)] hover:text-[var(--red)]">
                    <Trash2 size={14} />
                  </button>
                </form>
              </li>
            ))}
            {(!reports || reports.length === 0) && (
              <li className="px-6 py-10 text-center text-sm text-[var(--muted)]">
                Nenhum relatório gerado ainda.
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
