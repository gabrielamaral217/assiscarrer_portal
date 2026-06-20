import "server-only";

export type Ga4Overview =
  | { configured: false }
  | {
      configured: true;
      totals: { usuarios: number; sessoes: number; conversoes: number; engajamento: number };
      serie: { data: string; sessoes: number; usuarios: number }[];
      canais: { canal: string; sessoes: number }[];
      paginas: { pagina: string; views: number }[];
    };

type BetaClientCtor = typeof import("@google-analytics/data").BetaAnalyticsDataClient;

/** Cria o client do GA4 via conta de serviço (B64) OU via OAuth (refresh token). */
async function getClient(): Promise<{
  client: InstanceType<BetaClientCtor>;
  propertyId: string;
} | null> {
  const propertyId = process.env.GA4_PROPERTY_ID;
  if (!propertyId) return null;

  const { BetaAnalyticsDataClient } = await import("@google-analytics/data");

  // Opção 1 — conta de serviço (JSON em base64)
  const saB64 = process.env.GOOGLE_SERVICE_ACCOUNT_B64;
  if (saB64) {
    try {
      const credentials = JSON.parse(Buffer.from(saB64, "base64").toString("utf8"));
      return { client: new BetaAnalyticsDataClient({ credentials }), propertyId };
    } catch {
      return null;
    }
  }

  // Opção 2 — OAuth (mesma credencial usada por Ads e Drive)
  const client_id = process.env.GOOGLE_CLIENT_ID;
  const client_secret = process.env.GOOGLE_CLIENT_SECRET;
  const refresh_token = process.env.GOOGLE_REFRESH_TOKEN;
  if (client_id && client_secret && refresh_token) {
    const { google } = await import("googleapis");
    const oauth2 = new google.auth.OAuth2(client_id, client_secret);
    oauth2.setCredentials({ refresh_token });
    const opts = { authClient: oauth2 } as unknown as ConstructorParameters<BetaClientCtor>[0];
    return { client: new BetaAnalyticsDataClient(opts), propertyId };
  }

  return null;
}

export async function getGa4Overview(days = 28): Promise<Ga4Overview> {
  const cfg = await getClient();
  if (!cfg) return { configured: false };

  const client = cfg.client;
  const property = `properties/${cfg.propertyId}`;
  const dateRanges = [{ startDate: `${days}daysAgo`, endDate: "today" }];

  const [totalsRes, serieRes, canaisRes, paginasRes] = await Promise.all([
    client.runReport({
      property,
      dateRanges,
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "conversions" },
        { name: "engagementRate" },
      ],
    }),
    client.runReport({
      property,
      dateRanges,
      dimensions: [{ name: "date" }],
      metrics: [{ name: "sessions" }, { name: "activeUsers" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
    }),
    client.runReport({
      property,
      dateRanges,
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 6,
    }),
    client.runReport({
      property,
      dateRanges,
      dimensions: [{ name: "pageTitle" }],
      metrics: [{ name: "screenPageViews" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 8,
    }),
  ]);

  const t = totalsRes[0].rows?.[0]?.metricValues ?? [];
  const fmtDate = (d: string) => `${d.slice(6, 8)}/${d.slice(4, 6)}`;

  return {
    configured: true,
    totals: {
      usuarios: Number(t[0]?.value ?? 0),
      sessoes: Number(t[1]?.value ?? 0),
      conversoes: Number(t[2]?.value ?? 0),
      engajamento: Math.round(Number(t[3]?.value ?? 0) * 100),
    },
    serie:
      serieRes[0].rows?.map((r) => ({
        data: fmtDate(r.dimensionValues?.[0]?.value ?? ""),
        sessoes: Number(r.metricValues?.[0]?.value ?? 0),
        usuarios: Number(r.metricValues?.[1]?.value ?? 0),
      })) ?? [],
    canais:
      canaisRes[0].rows?.map((r) => ({
        canal: r.dimensionValues?.[0]?.value ?? "—",
        sessoes: Number(r.metricValues?.[0]?.value ?? 0),
      })) ?? [],
    paginas:
      paginasRes[0].rows?.map((r) => ({
        pagina: r.dimensionValues?.[0]?.value ?? "—",
        views: Number(r.metricValues?.[0]?.value ?? 0),
      })) ?? [],
  };
}
