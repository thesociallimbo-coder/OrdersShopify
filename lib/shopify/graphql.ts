import type { ShopifyClient } from "@/lib/shopify/client";

const API_VERSION = "2026-04";

type GraphQLErrorResponse = {
  errors?: Array<{ message: string }>;
  data?: unknown;
};

export async function shopifyGraphql<T>(
  client: ShopifyClient,
  query: string,
  variables?: Record<string, unknown>
) {
  const response = await fetch(`https://${client.shop}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": client.accessToken
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store"
  });

  if (response.status === 401) {
    throw new Error("Shopify token is invalid or expired");
  }

  if (response.status === 429) {
    throw new Error("Shopify rate limit reached. Try again shortly.");
  }

  const json = (await response.json()) as GraphQLErrorResponse & { data?: T };
  if (!response.ok || json.errors?.length) {
    throw new Error(json.errors?.[0]?.message ?? "Shopify API request failed");
  }

  return json.data as T;
}
