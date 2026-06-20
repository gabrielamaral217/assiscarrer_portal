"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import type { ProposalStatus } from "@/lib/types/database";

function num(v: FormDataEntryValue | null): number | null {
  const s = String(v ?? "").replace(/[^\d,.-]/g, "").replace(".", "").replace(",", ".");
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

export async function saveProposal(_prev: unknown, formData: FormData) {
  const me = await requireRole("admin", "marketing");
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");

  const itens = JSON.parse(String(formData.get("itens") ?? "[]"));
  const payload = {
    titulo: String(formData.get("titulo") ?? "").trim(),
    lead_id: String(formData.get("lead_id") ?? "") || null,
    valor: num(formData.get("valor")),
    status: String(formData.get("status") ?? "rascunho") as ProposalStatus,
    conteudo: {
      cliente: String(formData.get("cliente") ?? "").trim(),
      escopo: String(formData.get("escopo") ?? "").trim(),
      prazo: String(formData.get("prazo") ?? "").trim(),
      condicoes: String(formData.get("condicoes") ?? "").trim(),
      itens,
    },
  };
  if (!payload.titulo) return { error: "Informe um título." };

  if (id) {
    const { error } = await supabase.from("proposals").update(payload).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from("proposals")
      .insert({ ...payload, created_by: me.id });
    if (error) return { error: error.message };
  }
  revalidatePath("/propostas");
  return { ok: true };
}

export async function deleteProposal(formData: FormData) {
  await requireRole("admin", "marketing");
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("proposals").delete().eq("id", id);
  revalidatePath("/propostas");
}
