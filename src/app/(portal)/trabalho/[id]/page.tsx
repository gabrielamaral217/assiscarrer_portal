import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FolderOpen, CalendarClock, Trash2 } from "lucide-react";
import { requireProfile, canAccess } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/StatusBadge";
import { Avatar } from "@/components/Avatar";
import { PROJECT_STATUS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { UpdateComposer } from "./UpdateComposer";
import { TasksBoard } from "./TasksBoard";
import { ProjectHeaderActions } from "./ProjectHeaderActions";
import { deleteUpdate } from "../actions";
import type { Profile, Project, ProjectUpdate, Task } from "@/lib/types/database";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const me = await requireProfile();
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*, responsavel:profiles!projects_responsavel_id_fkey(*)")
    .eq("id", id)
    .single();

  if (!project) notFound();
  const p = project as unknown as Project & { responsavel: Profile | null };
  const cfg = PROJECT_STATUS[p.status];

  const [{ data: updates }, { data: tasks }, { data: team }] = await Promise.all([
    supabase
      .from("project_updates")
      .select("*, autor:profiles!project_updates_autor_id_fkey(*)")
      .eq("project_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("tasks")
      .select("*, assignee:profiles!tasks_assignee_id_fkey(*)")
      .eq("project_id", id)
      .order("created_at", { ascending: true }),
    supabase.from("profiles").select("*").eq("ativo", true).order("nome"),
  ]);

  const canManage = canAccess(me.role, "crm");

  return (
    <>
      <div className="border-b border-[var(--border)] bg-[var(--surface)] px-8 py-5">
        <Link
          href="/trabalho"
          className="mb-3 inline-flex items-center gap-1 text-xs text-[var(--muted)] hover:text-[var(--ink)]"
        >
          <ArrowLeft size={14} /> Voltar
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-2xl text-[var(--ink)]">{p.nome}</h1>
              <StatusBadge label={cfg.label} color={cfg.color} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[var(--ink-2)]">
              {p.cliente && <span>{p.cliente}</span>}
              {p.data_entrega && (
                <span className="inline-flex items-center gap-1">
                  <CalendarClock size={14} /> Entrega: {formatDate(p.data_entrega)}
                </span>
              )}
              {p.responsavel && (
                <span className="inline-flex items-center gap-1.5">
                  <Avatar nome={p.responsavel.nome} url={p.responsavel.avatar_url} size={22} />
                  {p.responsavel.nome}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {p.drive_folder_url && (
              <a
                href={p.drive_folder_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)] hover:bg-[var(--surface-2)]"
              >
                <FolderOpen size={15} /> Drive
              </a>
            )}
            {canManage && <ProjectHeaderActions project={p} team={(team as Profile[]) ?? []} />}
          </div>
        </div>
        {p.descricao && <p className="mt-3 max-w-3xl text-sm text-[var(--ink-2)]">{p.descricao}</p>}
      </div>

      <div className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-2">
        {/* Atualizações */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-[var(--ink)]">Atualizações</h2>
          <UpdateComposer projectId={id} />
          <div className="space-y-4">
            {(updates as unknown as (ProjectUpdate & { autor: Profile | null })[] | null)?.map((u) => (
              <div key={u.id} className="card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar nome={u.autor?.nome ?? null} url={u.autor?.avatar_url} size={28} />
                    <div>
                      <p className="text-sm font-medium text-[var(--ink)]">{u.autor?.nome ?? "—"}</p>
                      <p className="text-[11px] text-[var(--muted)]">{formatDate(u.created_at)}</p>
                    </div>
                  </div>
                  <form action={deleteUpdate}>
                    <input type="hidden" name="id" value={u.id} />
                    <input type="hidden" name="project_id" value={id} />
                    <button className="rounded p-1 text-[var(--muted)] hover:text-[var(--red)]">
                      <Trash2 size={14} />
                    </button>
                  </form>
                </div>
                {u.texto && <p className="mt-3 whitespace-pre-wrap text-sm text-[var(--ink-2)]">{u.texto}</p>}
                {u.imagens.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {u.imagens.map((img) => (
                      <a key={img} href={img} target="_blank" rel="noopener noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt="" className="h-24 w-full rounded-lg object-cover" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {(!updates || updates.length === 0) && (
              <p className="py-8 text-center text-sm text-[var(--muted)]">
                Nenhuma atualização ainda.
              </p>
            )}
          </div>
        </section>

        {/* Demandas */}
        <section>
          <TasksBoard
            projectId={id}
            tasks={(tasks as unknown as (Task & { assignee: Profile | null })[]) ?? []}
            team={(team as Profile[]) ?? []}
          />
        </section>
      </div>
    </>
  );
}
