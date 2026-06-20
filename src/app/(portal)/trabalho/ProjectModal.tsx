"use client";

import { useActionState, useEffect, useState } from "react";
import { Modal } from "@/components/Modal";
import { ImageUploader } from "@/components/ImageUploader";
import { PROJECT_STATUS } from "@/lib/constants";
import { saveProject } from "./actions";
import type { Profile, Project } from "@/lib/types/database";

const field =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";
const label = "mb-1 block text-xs font-medium text-[var(--ink-2)]";

export function ProjectModal({
  open,
  project,
  team,
  onClose,
  onSaved,
}: {
  open: boolean;
  project: Project | null;
  team: Profile[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [state, action, pending] = useActionState(saveProject, null);
  const [capa, setCapa] = useState<string[]>([]);

  useEffect(() => {
    setCapa(project?.capa_url ? [project.capa_url] : []);
  }, [project, open]);

  useEffect(() => {
    if (state?.ok) onSaved();
  }, [state, onSaved]);

  return (
    <Modal open={open} onClose={onClose} title={project ? "Editar projeto" : "Novo projeto"} wide>
      <form action={action} className="space-y-4">
        {project && <input type="hidden" name="id" value={project.id} />}
        <input type="hidden" name="capa_url" value={capa[0] ?? ""} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Nome do projeto *</label>
            <input name="nome" required defaultValue={project?.nome ?? ""} className={field} />
          </div>
          <div>
            <label className={label}>Cliente</label>
            <input name="cliente" defaultValue={project?.cliente ?? ""} className={field} />
          </div>
          <div>
            <label className={label}>Status</label>
            <select name="status" defaultValue={project?.status ?? "briefing"} className={field}>
              {Object.entries(PROJECT_STATUS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Responsável</label>
            <select name="responsavel_id" defaultValue={project?.responsavel_id ?? ""} className={field}>
              <option value="">— sem responsável —</option>
              {team.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Data de entrega</label>
            <input
              name="data_entrega"
              type="date"
              defaultValue={project?.data_entrega ?? ""}
              className={field}
            />
          </div>
          <div>
            <label className={label}>Pasta no Google Drive (link)</label>
            <input
              name="drive_folder_url"
              placeholder="https://drive.google.com/…"
              defaultValue={project?.drive_folder_url ?? ""}
              className={field}
            />
          </div>
        </div>

        <div>
          <label className={label}>Descrição</label>
          <textarea name="descricao" rows={2} defaultValue={project?.descricao ?? ""} className={field} />
        </div>

        <div>
          <label className={label}>Capa</label>
          <ImageUploader value={capa} onChange={setCapa} multiple={false} label="Capa" />
        </div>

        {state?.error && <p className="text-xs text-[var(--red)]">{state.error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--ink-2)] hover:bg-[var(--surface-2)]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={pending}
            className="btn-accent rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60"
          >
            {pending ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
