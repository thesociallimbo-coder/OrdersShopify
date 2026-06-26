import type { ShopifyClient } from "@/lib/shopify/client";
import { shopifyGraphql } from "@/lib/shopify/graphql";

const SHOP_INFO = `
  query ShopInfo {
    shop {
      id
      myshopifyDomain
    }
  }
`;

export function getShopInfo(client: ShopifyClient) {
  return shopifyGraphql<{ shop: { id: string; myshopifyDomain: string } }>(client, SHOP_INFO);
}
