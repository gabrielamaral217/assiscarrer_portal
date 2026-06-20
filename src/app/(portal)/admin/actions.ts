"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import type { UserRole } from "@/lib/types/database";

export async function createUser(_prev: unknown, formData: FormData) {
  await requireRole("admin");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const nome = String(formData.get("nome") ?? "").trim();
  const role = String(formData.get("role") ?? "arquiteta") as UserRole;
  const senha = String(formData.get("senha") ?? "");

  if (!email || !nome || senha.length < 6) {
    return { error: "Preencha nome, e-mail e uma senha de ao menos 6 caracteres." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_create_user", {
    p_email: email,
    p_nome: nome,
    p_role: role,
    p_senha: senha,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { ok: `Usuário ${nome} criado.` };
}

export async function setRole(formData: FormData) {
  await requireRole("admin");
  const id = String(formData.get("id"));
  const role = String(formData.get("role")) as UserRole;
  const supabase = await createClient();
  await supabase.from("profiles").update({ role }).eq("id", id);
  revalidatePath("/admin");
}

export async function setActive(formData: FormData) {
  await requireRole("admin");
  const id = String(formData.get("id"));
  const ativo = String(formData.get("ativo")) === "true";
  const supabase = await createClient();
  await supabase.from("profiles").update({ ativo }).eq("id", id);
  revalidatePath("/admin");
}

export async function resetPassword(_prev: unknown, formData: FormData) {
  await requireRole("admin");
  const id = String(formData.get("id"));
  const senha = String(formData.get("senha") ?? "");
  if (senha.length < 6) return { error: "Senha muito curta." };
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_set_password", {
    p_user: id,
    p_senha: senha,
  });
  if (error) return { error: error.message };
  return { ok: "Senha redefinida." };
}

/** Troca de senha do próprio usuário logado (qualquer papel). */
export async function changeOwnPassword(_prev: unknown, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sessão expirada." };
  const senha = String(formData.get("senha") ?? "");
  if (senha.length < 6) return { error: "Senha muito curta (mín. 6)." };
  const { error } = await supabase.auth.updateUser({ password: senha });
  if (error) return { error: error.message };
  return { ok: "Senha alterada com sucesso." };
}
