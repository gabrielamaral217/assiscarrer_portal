import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { CreateUserForm } from "./CreateUserForm";
import { ChangeOwnPassword } from "./ChangeOwnPassword";
import { UserRow } from "./UserRow";
import type { Profile } from "@/lib/types/database";

export default async function AdminPage() {
  const me = await requireRole("admin");
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <>
      <PageHeader
        title="Administração"
        subtitle="Usuários, papéis e acessos da equipe"
      />
      <div className="space-y-6 p-8">
        <CreateUserForm />

        <div className="card overflow-hidden">
          <div className="border-b border-[var(--border)] px-6 py-4">
            <h2 className="text-sm font-semibold text-[var(--ink)]">
              Equipe ({users?.length ?? 0})
            </h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-[var(--muted)]">
                <th className="py-2 pl-4 font-medium">Usuário</th>
                <th className="py-2 font-medium">Papel</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {(users as Profile[] | null)?.map((u) => (
                <UserRow key={u.id} user={u} isSelf={u.id === me.id} />
              ))}
            </tbody>
          </table>
        </div>

        <ChangeOwnPassword />
      </div>
    </>
  );
}
