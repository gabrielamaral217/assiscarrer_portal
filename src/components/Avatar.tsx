import { initials } from "@/lib/utils";

export function Avatar({
  nome,
  url,
  size = 32,
}: {
  nome: string | null;
  url?: string | null;
  size?: number;
}) {
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={url}
        alt={nome ?? ""}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-[var(--accent-bg)] font-semibold text-[var(--accent)]"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials(nome)}
    </span>
  );
}
