const SANITY_API_VERSION = "2025-02-19";

export function hasSanityConfig(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_DATASET);
}

type SanityQueryResponse<T> = {
  result: T;
};

export async function fetchSanityQuery<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  if (!projectId || !dataset) {
    throw new Error("Missing Sanity configuration.");
  }

  const endpoint = new URL(
    `https://${projectId}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${dataset}`,
  );

  endpoint.searchParams.set("query", query);

  for (const [key, value] of Object.entries(params)) {
    endpoint.searchParams.set(`$${key}`, JSON.stringify(value));
  }

  const response = await fetch(endpoint.toString(), {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Sanity query failed with ${response.status}.`);
  }

  const payload = (await response.json()) as SanityQueryResponse<T>;
  return payload.result;
}
