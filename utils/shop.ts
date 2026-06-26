export function normalizeShopDomain(input: string) {
  const raw = input.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  const domain = raw.endsWith(".myshopify.com") ? raw : `${raw}.myshopify.com`;

  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(domain)) {
    throw new Error("Enter a valid Shopify store domain");
  }

  return domain;
}
