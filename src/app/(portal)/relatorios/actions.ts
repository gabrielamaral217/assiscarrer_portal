"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { getGa4Overview } from "@/lib/integrations/ga4";

export async function generateReport(_prev: unknown, formData: FormData) {
  const me = await requireRole("admin", "marketing");
  const supabase = await createClient();

  const inicio = String(formData.get("periodo_inicio") ?? "");
  const fim = String(formData.get("periodo_fim") ?? "");
  const titulo =
    String(formData.get("titulo") ?? "").trim() || `Relatório de marketing`;
  if (!inicio || !fim) return { error: "Informe o período." };

  // Leads do período
  const { data: leads } = await supabase
    .from("leads")
    .select("status, origem, valor_estimado, created_at")
    .gte("created_at", inicio)
    .lte("created_at", `${fim}T23:59:59`);

  const porStatus: Record<string, number> = {};
  const porOrigem: Record<string, number> = {};
  let pipeline = 0;
  let ganhos = 0;
  let valorGanho = 0;
  for (const l of leads ?? []) {
    porStatus[l.status] = (porStatus[l.status] ?? 0) + 1;
    const o = l.origem ?? "Sem origem";
    porOrigem[o] = (porOrigem[o] ?? 0) + 1;
    if (!["ganho", "perdido"].includes(l.status)) pipeline += l.valor_estimado ?? 0;
    if (l.status === "ganho") {
      ganhos += 1;
      valorGanho += l.valor_estimado ?? 0;
    }
  }

  // GA4 (se configurado)
  let ga4Totais = null;
  try {
    const ga4 = await getGa4Overview(28);
    if (ga4.configured) ga4Totais = ga4.totals;
  } catch {
    /* ignora */
  }

  const dados = {
    totalLeads: leads?.length ?? 0,
    porStatus,
    porOrigem,
    pipeline,
    ganhos,
    valorGanho,
    ga4: ga4Totais,
  };

  const { data, error } = await supabase
    .from("reports")
    .insert({
      titulo,
      tipo: "marketing",
      periodo_inicio: inicio,
      periodo_fim: fim,
      dados,
      created_by: me.id,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  revalidatePath("/relatorios");
  return { ok: true, id: data?.id as string };
}

export async function deleteReport(formData: FormData) {
  await requireRole("admin", "marketing");
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("reports").delete().eq("id", id);
  revalidatePath("/relatorios");
}
