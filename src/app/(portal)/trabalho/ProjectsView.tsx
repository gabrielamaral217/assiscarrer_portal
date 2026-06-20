"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, CalendarClock } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { Avatar } from "@/components/Avatar";
import { PROJECT_STATUS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { ProjectModal } from "./ProjectModal";
import type { Profile, Project } from "@/lib/types/database";

type ProjectWithResp = Project & { responsavel: Profile | null };

export function ProjectsView({
  projects,
  team,
  canManage,
}: {
  projects: ProjectWithResp[];
  team: Profile[];
  canManage: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-[var(--muted)]">
          {projects.length} {projects.length === 1 ? "projeto" : "projetos"}
        </p>
        {canManage && (
          <button
            onClick={() => setOpen(true)}
            className="btn-accent inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold"
          >
            <Plus size={16} /> Novo projeto
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => {
          const cfg = PROJECT_STATUS[p.status];
          return (
            <Link key={p.id} href={`/trabalho/${p.id}`} className="card overflow-hidden transition hover:shadow-md">
              <div className="h-36 bg-[var(--surface-2)]">
                {p.capa_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.capa_url} alt={p.nome} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center font-serif text-3xl text-[var(--border-2)]">
                    {p.nome.charAt(0)}
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="font-medium text-[var(--ink)]">{p.nome}</h3>
                  <StatusBadge label={cfg.label} color={cfg.color} size="sm" />
                </div>
                {p.cliente && <p className="text-xs text-[var(--muted)]">{p.cliente}</p>}
                <div className="mt-3 flex items-center justify-between">
                  {p.data_entrega ? (
                    <span className="inline-flex items-center gap-1 text-xs text-[var(--ink-2)]">
                      <CalendarClock size={13} /> {formatDate(p.data_entrega)}
                    </span>
                  ) : (
                    <span />
                  )}
                  {p.responsavel && (
                    <Avatar nome={p.responsavel.nome} url={p.responsavel.avatar_url} size={26} />
                  )}
                </div>
              </div>
            </Link>
          );
        })}
        {projects.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-[var(--muted)]">
            Nenhum projeto ainda.
          </p>
        )}
      </div>

      <ProjectModal
        open={open}
        project={null}
        team={team}
        onClose={() => setOpen(false)}
        onSaved={() => {
          setOpen(false);
          router.refresh();
        }}
      />
    </>
  );
}
