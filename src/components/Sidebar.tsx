"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { NAV, ROLE_LABEL, canAccess } from "@/lib/constants";
import { Avatar } from "@/components/Avatar";
import type { Profile } from "@/lib/types/database";

export function Sidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname();
  const items = NAV.filter((i) => canAccess(profile.role, i.module));

  return (
    <aside className="flex w-60 flex-col border-r border-[var(--border)] bg-[var(--surface)]">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="font-serif text-xl text-[var(--ink)]">Assis Carrer</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-[var(--accent-bg)] font-semibold text-[var(--accent)]"
                  : "text-[var(--ink-2)] hover:bg-[var(--surface-2)]"
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.4 : 1.9} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--border)] p-3">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <Avatar nome={profile.nome} url={profile.avatar_url} size={34} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[var(--ink)]">
              {profile.nome || "—"}
            </p>
            <p className="text-[11px] text-[var(--muted)]">
              {ROLE_LABEL[profile.role]}
            </p>
          </div>
        </div>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--ink-2)] hover:bg-[var(--surface-2)]"
          >
            <LogOut size={16} /> Sair
          </button>
        </form>
      </div>
    </aside>
  );
}
