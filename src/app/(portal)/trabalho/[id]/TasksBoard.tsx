"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, CalendarClock } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { TASK_PIPELINE, TASK_STATUS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { addTask, moveTask, deleteTask } from "../actions";
import type { Profile, Task } from "@/lib/types/database";

type TaskWithAssignee = Task & { assignee: Profile | null };

export function TasksBoard({
  projectId,
  tasks,
  team,
}: {
  projectId: string;
  tasks: TaskWithAssignee[];
  team: Profile[];
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState(addTask, null);
  const [adding, setAdding] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      setAdding(false);
      router.refresh();
    }
  }, [state, router]);

  const field =
    "rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1.5 text-xs outline-none focus:border-[var(--accent)]";

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--ink)]">Demandas</h2>
        <button
          onClick={() => setAdding((v) => !v)}
          className="inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)]"
        >
          <Plus size={14} /> Nova demanda
        </button>
      </div>

      {adding && (
        <form ref={formRef} action={action} className="card mb-3 flex flex-wrap items-end gap-2 p-3">
          <input type="hidden" name="project_id" value={projectId} />
          <input name="titulo" required placeholder="O que precisa ser feito?" className={`${field} flex-1`} />
          <select name="assignee_id" defaultValue="" className={field}>
            <option value="">Responsável</option>
            {team.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
          <input name="prazo" type="date" className={field} />
          <button
            type="submit"
            disabled={pending}
            className="btn-accent rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-60"
          >
            Adicionar
          </button>
          {state?.error && <span className="w-full text-xs text-[var(--red)]">{state.error}</span>}
        </form>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {TASK_PIPELINE.map((status) => {
          const cfg = TASK_STATUS[status];
          const col = tasks.filter((t) => t.status === status);
          return (
            <div key={status} className="rounded-xl bg-[var(--surface-2)] p-3">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[var(--ink)]">
                <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                {cfg.label}
                <span className="font-normal text-[var(--muted)]">{col.length}</span>
              </div>
              <div className="space-y-2">
                {col.map((t) => (
                  <div key={t.id} className="card group p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-[var(--ink)]">{t.titulo}</p>
                      <form
                        action={async (fd) => {
                          await deleteTask(fd);
                          router.refresh();
                        }}
                      >
                        <input type="hidden" name="id" value={t.id} />
                        <input type="hidden" name="project_id" value={projectId} />
                        <button className="rounded p-0.5 text-[var(--muted)] opacity-0 transition hover:text-[var(--red)] group-hover:opacity-100">
                          <Trash2 size={13} />
                        </button>
                      </form>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {t.assignee && <Avatar nome={t.assignee.nome} url={t.assignee.avatar_url} size={22} />}
                        {t.prazo && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-[var(--ink-2)]">
                            <CalendarClock size={11} /> {formatDate(t.prazo)}
                          </span>
                        )}
                      </div>
                    </div>
                    <form
                      action={async (fd) => {
                        await moveTask(fd);
                        router.refresh();
                      }}
                      className="mt-2"
                    >
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="project_id" value={projectId} />
                      <select
                        name="status"
                        defaultValue={t.status}
                        onChange={(e) => e.currentTarget.form?.requestSubmit()}
                        className="w-full rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1 text-[11px] outline-none"
                      >
                        {TASK_PIPELINE.map((s) => (
                          <option key={s} value={s}>
                            {TASK_STATUS[s].label}
                          </option>
                        ))}
                      </select>
                    </form>
                  </div>
                ))}
                {col.length === 0 && <p className="py-3 text-center text-[11px] text-[var(--muted)]">—</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
