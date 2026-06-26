export type ShopifyClient = {
  shop: string;
  accessToken: string;
};

export function getShopifyConfig() {
  const apiKey = process.env.SHOPIFY_API_KEY;
  const apiSecret = process.env.SHOPIFY_API_SECRET;
  const appUrl = process.env.APP_URL ?? process.env.NEXTAUTH_URL;
  const scopes =
    process.env.SHOPIFY_SCOPES ?? "read_orders,write_orders,read_marketplace_orders,read_quick_sale";

  if (!apiKey || !apiSecret || !appUrl) {
    throw new Error("Shopify environment variables are not configured");
  }

  return { apiKey, apiSecret, appUrl, scopes };
}
