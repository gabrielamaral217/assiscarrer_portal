"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { ProjectModal } from "../ProjectModal";
import type { Profile, Project } from "@/lib/types/database";

export function ProjectHeaderActions({
  project,
  team,
}: {
  project: Project;
  team: Profile[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)] hover:bg-[var(--surface-2)]"
      >
        <Pencil size={15} /> Editar
      </button>
      <ProjectModal
        open={open}
        project={project}
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
