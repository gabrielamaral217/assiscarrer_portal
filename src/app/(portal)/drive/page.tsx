import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { ConnectCard } from "@/components/ConnectCard";
import { listDriveFiles, type DriveResult } from "@/lib/integrations/drive";
import { formatDate } from "@/lib/utils";
import { FileText, Folder, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DrivePage() {
  await requireProfile();
  const supabase = await createClient();

  let drive: DriveResult = { configured: false };
  let driveError = false;
  try {
    drive = await listDriveFiles();
  } catch {
    driveError = true;
  }

  const { data: projetos } = await supabase
    .from("projects")
    .select("id, nome, drive_folder_url")
    .not("drive_folder_url", "is", null)
    .order("nome");

  return (
    <>
      <PageHeader title="Google Drive" subtitle="Arquivos dos projetos em andamento" />
      <div className="space-y-8 p-8">
        {/* Pastas vinculadas a projetos — funciona sem credenciais */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-[var(--ink)]">
            Pastas dos projetos
          </h2>
          {projetos && projetos.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {projetos.map((p) => (
                <a
                  key={p.id}
                  href={p.drive_folder_url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card flex items-center gap-3 p-4 hover:shadow-md"
                >
                  <Folder size={22} className="text-[var(--accent)]" />
                  <span className="flex-1 truncate text-sm font-medium text-[var(--ink)]">
                    {p.nome}
                  </span>
                  <ExternalLink size={15} className="text-[var(--muted)]" />
                </a>
              ))}
            </div>
          ) : (
            <p className="card p-6 text-center text-sm text-[var(--muted)]">
              Nenhum projeto com pasta do Drive vinculada ainda. Vincule em{" "}
              <Link href="/trabalho" className="text-[var(--accent)] underline">
                Área de trabalho
              </Link>{" "}
              → editar projeto → “Pasta no Google Drive”.
            </p>
          )}
        </section>

        {/* Navegador de arquivos — requer OAuth */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-[var(--ink)]">
            Arquivos recentes
          </h2>
          {drive.configured ? (
            <div className="card divide-y divide-[var(--border)]">
              {drive.files.map((f) => {
                const isFolder = f.mimeType === "application/vnd.google-apps.folder";
                return (
                  <a
                    key={f.id}
                    href={f.webViewLink ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-5 py-3 hover:bg-[var(--surface-2)]"
                  >
                    {isFolder ? (
                      <Folder size={18} className="text-[var(--accent)]" />
                    ) : (
                      <FileText size={18} className="text-[var(--muted)]" />
                    )}
                    <span className="flex-1 truncate text-sm text-[var(--ink)]">{f.name}</span>
                    {f.modifiedTime && (
                      <span className="text-xs text-[var(--muted)]">
                        {formatDate(f.modifiedTime)}
                      </span>
                    )}
                  </a>
                );
              })}
              {drive.files.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-[var(--muted)]">
                  Nenhum arquivo encontrado.
                </p>
              )}
            </div>
          ) : (
            <ConnectCard
              title={driveError ? "Erro ao conectar ao Drive" : "Conecte o Google Drive"}
              description={
                driveError
                  ? "Credenciais encontradas, mas a API retornou erro. Verifique o refresh token e os escopos."
                  : "Navegue pelos arquivos do Drive direto no portal, sem trocar de aba."
              }
              steps={[
                "Crie credenciais OAuth no Google Cloud (mesmo client do Ads serve)",
                "Autorize o escopo drive.readonly e gere um refresh token",
                "Cole em GOOGLE_REFRESH_TOKEN no .env.local",
              ]}
              envVars={["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN"]}
            />
          )}
        </section>
      </div>
    </>
  );
}
