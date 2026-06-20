import { requireRole } from "@/lib/auth";
import { PageHeader } from "@/components/PageHeader";
import { ConnectCard } from "@/components/ConnectCard";
import { SessionsArea, HorizontalBars } from "./Charts";
import { getGa4Overview, type Ga4Overview } from "@/lib/integrations/ga4";
import { getAdsOverview, type AdsOverview } from "@/lib/integrations/googleAds";
import { formatBRL } from "@/lib/utils";
import { Users, MousePointerClick, Target, Activity } from "lucide-react";

export const dynamic = "force-dynamic";

function Kpi({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof Users }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--muted)]">{label}</span>
        <Icon size={17} className="text-[var(--accent)]" />
      </div>
      <p className="mt-2 font-serif text-2xl text-[var(--ink)]">{value}</p>
    </div>
  );
}

export default async function AnalyticsPage() {
  await requireRole("admin", "marketing");

  let ga4: Ga4Overview = { configured: false };
  let ads: AdsOverview = { configured: false };
  let ga4Error = false;
  let adsError = false;
  try {
    ga4 = await getGa4Overview(28);
  } catch {
    ga4Error = true;
  }
  try {
    ads = await getAdsOverview(28);
  } catch {
    adsError = true;
  }

  return (
    <>
      <PageHeader title="Analytics" subtitle="GA4 + Google Ads · últimos 28 dias" />
      <div className="space-y-8 p-8">
        {/* ===== GA4 ===== */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-[var(--ink)]">
            Tráfego do site · Google Analytics
          </h2>
          {ga4.configured ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Kpi label="Usuários" value={ga4.totals.usuarios.toLocaleString("pt-BR")} icon={Users} />
                <Kpi label="Sessões" value={ga4.totals.sessoes.toLocaleString("pt-BR")} icon={Activity} />
                <Kpi label="Conversões" value={ga4.totals.conversoes.toLocaleString("pt-BR")} icon={Target} />
                <Kpi label="Engajamento" value={`${ga4.totals.engajamento}%`} icon={MousePointerClick} />
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="card p-5 lg:col-span-2">
                  <p className="mb-3 text-xs font-medium text-[var(--muted)]">Sessões por dia</p>
                  <SessionsArea data={ga4.serie} />
                </div>
                <div className="card p-5">
                  <p className="mb-3 text-xs font-medium text-[var(--muted)]">Canais</p>
                  <HorizontalBars data={ga4.canais} dataKey="sessoes" nameKey="canal" />
                </div>
              </div>
            </div>
          ) : (
            <ConnectCard
              title={ga4Error ? "Erro ao conectar ao GA4" : "Conecte o Google Analytics"}
              description={
                ga4Error
                  ? "As credenciais foram encontradas mas a API retornou erro. Verifique o ID da propriedade e o acesso da service account."
                  : "Veja métricas de tráfego do site em tempo quase-real, sem abrir o GA."
              }
              steps={[
                "Crie uma service account no Google Cloud e baixe o JSON",
                "Dê acesso de leitura dela na propriedade GA4 (Admin → Acesso)",
                "Converta o JSON p/ base64 e cole em GOOGLE_SERVICE_ACCOUNT_B64",
                "Informe o ID numérico da propriedade em GA4_PROPERTY_ID",
              ]}
              envVars={["GA4_PROPERTY_ID", "GOOGLE_SERVICE_ACCOUNT_B64"]}
            />
          )}
        </section>

        {/* ===== Google Ads ===== */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-[var(--ink)]">
            Campanhas · Google Ads
          </h2>
          {ads.configured ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Kpi label="Investimento" value={formatBRL(ads.totals.custo)} icon={Target} />
                <Kpi label="Cliques" value={ads.totals.cliques.toLocaleString("pt-BR")} icon={MousePointerClick} />
                <Kpi label="CTR" value={`${ads.totals.ctr}%`} icon={Activity} />
                <Kpi label="Conversões" value={ads.totals.conversoes.toLocaleString("pt-BR")} icon={Target} />
              </div>
              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-left text-xs text-[var(--muted)]">
                      <th className="px-5 py-3 font-medium">Campanha</th>
                      <th className="px-5 py-3 text-right font-medium">Investimento</th>
                      <th className="px-5 py-3 text-right font-medium">Cliques</th>
                      <th className="px-5 py-3 text-right font-medium">Conversões</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ads.campanhas.map((c) => (
                      <tr key={c.nome} className="border-b border-[var(--border)] last:border-0">
                        <td className="px-5 py-3 text-[var(--ink)]">{c.nome}</td>
                        <td className="px-5 py-3 text-right">{formatBRL(c.custo)}</td>
                        <td className="px-5 py-3 text-right">{c.cliques}</td>
                        <td className="px-5 py-3 text-right">{c.conversoes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <ConnectCard
              title={adsError ? "Erro ao conectar ao Google Ads" : "Conecte o Google Ads"}
              description={
                adsError
                  ? "Credenciais encontradas, mas a API retornou erro. Verifique developer token, customer ID e refresh token."
                  : "Acompanhe investimento, cliques e conversões das campanhas."
              }
              steps={[
                "Solicite um developer token na sua conta Google Ads (API Center)",
                "Crie credenciais OAuth (client ID/secret) no Google Cloud",
                "Gere um refresh token autorizando o escopo do Google Ads",
                "Informe o customer ID (e o ID da MCC em login_customer_id, se houver)",
              ]}
              envVars={[
                "GOOGLE_ADS_DEVELOPER_TOKEN",
                "GOOGLE_ADS_CUSTOMER_ID",
                "GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET",
                "GOOGLE_REFRESH_TOKEN",
              ]}
            />
          )}
        </section>
      </div>
    </>
  );
}
