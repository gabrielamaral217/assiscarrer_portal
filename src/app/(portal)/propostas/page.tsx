import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { ProposalsView } from "./ProposalsView";
import type { Lead, Proposal } from "@/lib/types/database";

export default async function PropostasPage() {
  await requireRole("admin", "marketing");
  const supabase = await createClient();
  const [{ data: proposals }, { data: leads }] = await Promise.all([
    supabase.from("proposals").select("*").order("created_at", { ascending: false }),
    supabase.from("leads").select("*").order("nome"),
  ]);

  return (
    <>
      <PageHeader title="Propostas" subtitle="Propostas comerciais do escritório" />
      <div className="p-8">
        <ProposalsView
          proposals={(proposals as Proposal[]) ?? []}
          leads={(leads as Lead[]) ?? []}
        />
      </div>
    </>
  );
}
