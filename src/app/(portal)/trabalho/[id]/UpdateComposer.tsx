"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { ImageUploader } from "@/components/ImageUploader";
import { addUpdate } from "../actions";

export function UpdateComposer({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(addUpdate, null);
  const [imagens, setImagens] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      setImagens([]);
      formRef.current?.reset();
      router.refresh();
    }
  }, [state, router]);

  return (
    <form ref={formRef} action={action} className="card p-4">
      <input type="hidden" name="project_id" value={projectId} />
      <input type="hidden" name="imagens" value={JSON.stringify(imagens)} />
      <textarea
        name="texto"
        rows={2}
        placeholder="Escreva uma atualização do projeto…"
        className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
      />
      <div className="mt-3">
        <ImageUploader value={imagens} onChange={setImagens} />
      </div>
      <div className="mt-3 flex items-center justify-between">
        {state?.error ? (
          <span className="text-xs text-[var(--red)]">{state.error}</span>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={pending}
          className="btn-accent inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          <Send size={15} /> {pending ? "Publicando…" : "Publicar"}
        </button>
      </div>
    </form>
  );
}
