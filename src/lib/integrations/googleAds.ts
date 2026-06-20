import "server-only";

export type AdsOverview =
  | { configured: false }
  | {
      configured: true;
      totals: { impressoes: number; cliques: number; custo: number; conversoes: number; ctr: number; cpc: number };
      campanhas: { nome: string; custo: number; cliques: number; conversoes: number }[];
    };

function micros(v: unknown) {
  return Number(v ?? 0) / 1_000_000;
}

export async function getAdsOverview(days = 28): Promise<AdsOverview> {
  const developer_token = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  const client_id = process.env.GOOGLE_CLIENT_ID;
  const client_secret = process.env.GOOGLE_CLIENT_SECRET;
  const refresh_token = process.env.GOOGLE_REFRESH_TOKEN;
  const customer_id = process.env.GOOGLE_ADS_CUSTOMER_ID?.replace(/-/g, "");
  const login_customer_id = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID?.replace(/-/g, "");

  if (!developer_token || !client_id || !client_secret || !refresh_token || !customer_id) {
    return { configured: false };
  }

  const { GoogleAdsApi } = await import("google-ads-api");
  const api = new GoogleAdsApi({ client_id, client_secret, developer_token });
  const customer = api.Customer({
    customer_id,
    login_customer_id,
    refresh_token,
  });

  const rows = await customer.query(`
    SELECT campaign.name, metrics.impressions, metrics.clicks,
           metrics.cost_micros, metrics.conversions
    FROM campaign
    WHERE segments.date DURING LAST_${days >= 30 ? "30" : "14"}_DAYS
    ORDER BY metrics.cost_micros DESC
  `).catch(() => [] as unknown[]);

  let impressoes = 0, cliques = 0, custo = 0, conversoes = 0;
  const campanhas = (rows as Array<{ campaign?: { name?: string }; metrics?: Record<string, unknown> }>).map((r) => {
    const i = Number(r.metrics?.impressions ?? 0);
    const c = Number(r.metrics?.clicks ?? 0);
    const cost = micros(r.metrics?.cost_micros);
    const conv = Number(r.metrics?.conversions ?? 0);
    impressoes += i; cliques += c; custo += cost; conversoes += conv;
    return { nome: r.campaign?.name ?? "—", custo: cost, cliques: c, conversoes: conv };
  });

  return {
    configured: true,
    totals: {
      impressoes, cliques, custo, conversoes,
      ctr: impressoes ? Math.round((cliques / impressoes) * 1000) / 10 : 0,
      cpc: cliques ? Math.round((custo / cliques) * 100) / 100 : 0,
    },
    campanhas: campanhas.slice(0, 8),
  };
}
