import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { CrmBoard } from "./CrmBoard";
import type { Lead } from "@/lib/types/database";

export default async function CrmPage() {
  await requireRole("admin", "marketing");
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <PageHeader title="CRM / Leads" subtitle="Funil comercial do escritório" />
      <div className="p-8">
        <CrmBoard leads={(leads as Lead[]) ?? []} />
      </div>
    </>
  );
}
