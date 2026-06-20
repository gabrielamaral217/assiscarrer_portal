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

function getCredentials() {
  const propertyId = process.env.GA4_PROPERTY_ID;
  const saB64 = process.env.GOOGLE_SERVICE_ACCOUNT_B64;
  if (!propertyId || !saB64) return null;
  try {
    const credentials = JSON.parse(Buffer.from(saB64, "base64").toString("utf8"));
    return { propertyId, credentials };
  } catch {
    return null;
  }
}

export async function getGa4Overview(days = 28): Promise<Ga4Overview> {
  const cfg = getCredentials();
  if (!cfg) return { configured: false };

  const { BetaAnalyticsDataClient } = await import("@google-analytics/data");
  const client = new BetaAnalyticsDataClient({ credentials: cfg.credentials });
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
