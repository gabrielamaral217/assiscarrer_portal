import { requireProfile, canAccess } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { ProjectsView } from "./ProjectsView";
import type { Profile, Project } from "@/lib/types/database";

export default async function TrabalhoPage() {
  const me = await requireProfile();
  const supabase = await createClient();

  const [{ data: projects }, { data: team }] = await Promise.all([
    supabase
      .from("projects")
      .select("*, responsavel:profiles!projects_responsavel_id_fkey(*)")
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("*").eq("ativo", true).order("nome"),
  ]);

  return (
    <>
      <PageHeader title="Área de trabalho" subtitle="Projetos e demandas da equipe" />
      <div className="p-8">
        <ProjectsView
          projects={(projects as unknown as (Project & { responsavel: Profile | null })[]) ?? []}
          team={(team as Profile[]) ?? []}
          canManage={canAccess(me.role, "crm")}
        />
      </div>
    </>
  );
}
