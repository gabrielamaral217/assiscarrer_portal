import { requireRole } from "@/lib/auth";
import { PageHeader } from "@/components/PageHeader";
import { MessageCircle, Clock } from "lucide-react";

export default async function WhatsappPage() {
  await requireRole("admin", "marketing");

  return (
    <>
      <PageHeader title="WhatsApp" subtitle="Central de mensagens (em breve)" />
      <div className="p-8">
        <div className="card border-dashed p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#ebfbee]">
            <MessageCircle size={26} className="text-[#25d366]" />
          </div>
          <h2 className="font-serif text-xl text-[var(--ink)]">
            Integração com WhatsApp
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">
            Aqui você verá e responderá as conversas do WhatsApp do escritório sem sair
            do portal, e poderá transformar contatos em leads com um clique.
          </p>

          <div className="mx-auto mt-6 grid max-w-2xl gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-left">
              <h3 className="text-sm font-semibold text-[var(--ink)]">API Oficial (Meta)</h3>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Estável e oficial. Requer conta WhatsApp Business e aprovação da Meta.
                Indicado para volume e longo prazo.
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-left">
              <h3 className="text-sm font-semibold text-[var(--ink)]">Evolution / Z-API</h3>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Conecta lendo o QR do número atual. Rápido de começar, popular no Brasil.
                Risco de bloqueio pela Meta.
              </p>
            </div>
          </div>

          <p className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-bg)] px-3 py-1.5 text-xs font-medium text-[var(--accent)]">
            <Clock size={13} /> Estrutura pronta — ativaremos quando você escolher o provedor
          </p>
        </div>
      </div>
    </>
  );
}
