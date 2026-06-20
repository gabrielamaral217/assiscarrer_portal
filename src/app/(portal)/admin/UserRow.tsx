"use client";

import { useState } from "react";
import { KeyRound, Check, X } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { setRole, setActive, resetPassword } from "./actions";
import type { Profile } from "@/lib/types/database";

export function UserRow({ user, isSelf }: { user: Profile; isSelf: boolean }) {
  const [showPwd, setShowPwd] = useState(false);
  const [pwd, setPwd] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <tr className="border-t border-[var(--border)]">
      <td className="py-3 pl-4">
        <div className="flex items-center gap-3">
          <Avatar nome={user.nome} url={user.avatar_url} size={34} />
          <div>
            <p className="font-medium text-[var(--ink)]">
              {user.nome || "—"}
              {isSelf && (
                <span className="ml-2 text-[11px] text-[var(--muted)]">(você)</span>
              )}
            </p>
            <p className="text-xs text-[var(--muted)]">{user.email}</p>
          </div>
        </div>
      </td>

      <td className="py-3">
        <form action={setRole}>
          <input type="hidden" name="id" value={user.id} />
          <select
            name="role"
            defaultValue={user.role}
            disabled={isSelf}
            onChange={(e) => e.currentTarget.form?.requestSubmit()}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1.5 text-xs outline-none disabled:opacity-50"
          >
            <option value="arquiteta">Arquiteta</option>
            <option value="marketing">Marketing</option>
            <option value="admin">Administrador</option>
          </select>
        </form>
      </td>

      <td className="py-3">
        <form action={setActive}>
          <input type="hidden" name="id" value={user.id} />
          <input type="hidden" name="ativo" value={(!user.ativo).toString()} />
          <button
            type="submit"
            disabled={isSelf}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium disabled:opacity-50 ${
              user.ativo
                ? "bg-[#ebfbee] text-[var(--green)]"
                : "bg-[#fff5f5] text-[var(--red)]"
            }`}
          >
            {user.ativo ? <Check size={12} /> : <X size={12} />}
            {user.ativo ? "Ativo" : "Inativo"}
          </button>
        </form>
      </td>

      <td className="py-3 pr-4 text-right">
        {!showPwd ? (
          <button
            onClick={() => setShowPwd(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--ink-2)] hover:bg-[var(--surface-2)]"
          >
            <KeyRound size={13} /> Redefinir senha
          </button>
        ) : (
          <form
            action={async (fd) => {
              const r = await resetPassword(null, fd);
              setMsg(r?.ok ?? r?.error ?? null);
              if (r?.ok) {
                setPwd("");
                setTimeout(() => {
                  setShowPwd(false);
                  setMsg(null);
                }, 1500);
              }
            }}
            className="flex items-center justify-end gap-2"
          >
            <input type="hidden" name="id" value={user.id} />
            <input
              name="senha"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="Nova senha"
              className="w-32 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5 text-xs outline-none focus:border-[var(--accent)]"
            />
            <button
              type="submit"
              className="btn-accent rounded-lg px-2.5 py-1.5 text-xs font-semibold"
            >
              OK
            </button>
            <button
              type="button"
              onClick={() => {
                setShowPwd(false);
                setMsg(null);
              }}
              className="text-xs text-[var(--muted)]"
            >
              cancelar
            </button>
            {msg && <span className="text-xs text-[var(--green)]">{msg}</span>}
          </form>
        )}
      </td>
    </tr>
  );
}
