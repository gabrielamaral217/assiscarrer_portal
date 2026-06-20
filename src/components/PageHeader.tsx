export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] bg-[var(--surface)] px-8 py-5">
      <div>
        <h1 className="font-serif text-2xl text-[var(--ink)]">{title}</h1>
        {subtitle && (
          <p className="mt-0.5 text-sm text-[var(--muted)]">{subtitle}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
