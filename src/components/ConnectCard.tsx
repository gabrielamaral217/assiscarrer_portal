import { PlugZap } from "lucide-react";

export function ConnectCard({
  title,
  description,
  envVars,
  steps,
}: {
  title: string;
  description: string;
  envVars?: string[];
  steps?: string[];
}) {
  return (
    <div className="card border-dashed p-8 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-bg)]">
        <PlugZap size={22} className="text-[var(--accent)]" />
      </div>
      <h3 className="font-serif text-lg text-[var(--ink)]">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-[var(--muted)]">{description}</p>

      {steps && (
        <ol className="mx-auto mt-4 max-w-md space-y-1.5 text-left text-xs text-[var(--ink-2)]">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-2">
              <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-white">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
      )}

      {envVars && (
        <div className="mx-auto mt-4 max-w-md rounded-lg bg-[var(--surface-2)] p-3 text-left">
          <p className="mb-1 text-[11px] font-medium text-[var(--muted)]">
            Variáveis em <code>.env.local</code>:
          </p>
          <code className="block text-[11px] leading-relaxed text-[var(--ink-2)]">
            {envVars.map((v) => (
              <span key={v} className="block">
                {v}
              </span>
            ))}
          </code>
        </div>
      )}
    </div>
  );
}
