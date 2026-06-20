"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile, requireRole } from "@/lib/auth";
import type { ProjectStatus, TaskStatus } from "@/lib/types/database";

export async function saveProject(_prev: unknown, formData: FormData) {
  await requireRole("admin", "marketing");
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const payload = {
    nome: String(formData.get("nome") ?? "").trim(),
    cliente: String(formData.get("cliente") ?? "").trim() || null,
    descricao: String(formData.get("descricao") ?? "").trim() || null,
    status: String(formData.get("status") ?? "briefing") as ProjectStatus,
    responsavel_id: String(formData.get("responsavel_id") ?? "") || null,
    data_entrega: String(formData.get("data_entrega") ?? "") || null,
    drive_folder_url: String(formData.get("drive_folder_url") ?? "").trim() || null,
    capa_url: String(formData.get("capa_url") ?? "").trim() || null,
  };
  if (!payload.nome) return { error: "Informe o nome do projeto." };

  if (id) {
    const { error } = await supabase.from("projects").update(payload).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("projects").insert(payload);
    if (error) return { error: error.message };
  }
  revalidatePath("/trabalho");
  if (id) revalidatePath(`/trabalho/${id}`);
  return { ok: true };
}

export async function deleteProject(formData: FormData) {
  await requireRole("admin", "marketing");
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("projects").delete().eq("id", id);
  revalidatePath("/trabalho");
}

export async function addUpdate(_prev: unknown, formData: FormData) {
  const me = await requireProfile();
  const supabase = await createClient();
  const project_id = String(formData.get("project_id"));
  const texto = String(formData.get("texto") ?? "").trim() || null;
  const imagens = JSON.parse(String(formData.get("imagens") ?? "[]")) as string[];
  if (!texto && imagens.length === 0) return { error: "Escreva algo ou anexe imagens." };

  const { error } = await supabase
    .from("project_updates")
    .insert({ project_id, autor_id: me.id, texto, imagens });
  if (error) return { error: error.message };
  revalidatePath(`/trabalho/${project_id}`);
  return { ok: true };
}

export async function deleteUpdate(formData: FormData) {
  await requireProfile();
  const id = String(formData.get("id"));
  const project_id = String(formData.get("project_id"));
  const supabase = await createClient();
  await supabase.from("project_updates").delete().eq("id", id);
  revalidatePath(`/trabalho/${project_id}`);
}

export async function addTask(_prev: unknown, formData: FormData) {
  await requireProfile();
  const supabase = await createClient();
  const project_id = String(formData.get("project_id"));
  const titulo = String(formData.get("titulo") ?? "").trim();
  const assignee_id = String(formData.get("assignee_id") ?? "") || null;
  const prazo = String(formData.get("prazo") ?? "") || null;
  if (!titulo) return { error: "Informe o título da demanda." };
  const { error } = await supabase
    .from("tasks")
    .insert({ project_id, titulo, assignee_id, prazo });
  if (error) return { error: error.message };
  revalidatePath(`/trabalho/${project_id}`);
  return { ok: true };
}

export async function moveTask(formData: FormData) {
  await requireProfile();
  const id = String(formData.get("id"));
  const project_id = String(formData.get("project_id"));
  const status = String(formData.get("status")) as TaskStatus;
  const supabase = await createClient();
  await supabase.from("tasks").update({ status }).eq("id", id);
  revalidatePath(`/trabalho/${project_id}`);
}

export async function deleteTask(formData: FormData) {
  await requireProfile();
  const id = String(formData.get("id"));
  const project_id = String(formData.get("project_id"));
  const supabase = await createClient();
  await supabase.from("tasks").delete().eq("id", id);
  revalidatePath(`/trabalho/${project_id}`);
}
