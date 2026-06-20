import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canAccess } from "@/lib/constants";
import type { Profile, UserRole } from "@/lib/types/database";

export { canAccess };

/** Usuário + profile atuais. Redireciona p/ login se não autenticado. */
export async function requireProfile(): Promise<Profile> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");
  return profile as Profile;
}

/** Exige que o usuário tenha um dos papéis. Caso contrário, 404/redirect. */
export async function requireRole(...roles: UserRole[]): Promise<Profile> {
  const profile = await requireProfile();
  if (!roles.includes(profile.role)) redirect("/");
  return profile;
}

