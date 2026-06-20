"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import type { LeadStatus } from "@/lib/types/database";

function num(v: FormDataEntryValue | null): number | null {
  const s = String(v ?? "").replace(/[^\d,.-]/g, "").replace(".", "").replace(",", ".");
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

export async function saveLead(_prev: unknown, formData: FormData) {
  const me = await requireRole("admin", "marketing");
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");
  const payload = {
    nome: String(formData.get("nome") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim() || null,
    telefone: String(formData.get("telefone") ?? "").trim() || null,
    origem: String(formData.get("origem") ?? "").trim() || null,
    tipo_projeto: String(formData.get("tipo_projeto") ?? "").trim() || null,
    status: String(formData.get("status") ?? "novo") as LeadStatus,
    valor_estimado: num(formData.get("valor_estimado")),
    notas: String(formData.get("notas") ?? "").trim() || null,
  };

  if (!payload.nome) return { error: "Informe o nome do lead." };

  if (id) {
    const { error } = await supabase.from("leads").update(payload).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from("leads")
      .insert({ ...payload, owner_id: me.id });
    if (error) return { error: error.message };
  }
  revalidatePath("/crm");
  return { ok: true };
}

export async function moveLead(formData: FormData) {
  await requireRole("admin", "marketing");
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as LeadStatus;
  const supabase = await createClient();
  await supabase.from("leads").update({ status }).eq("id", id);
  revalidatePath("/crm");
}

export async function deleteLead(formData: FormData) {
  await requireRole("admin", "marketing");
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("leads").delete().eq("id", id);
  revalidatePath("/crm");
}
