import { shopifyGraphql } from "@/lib/shopify/graphql";
import type { ShopifyClient } from "@/lib/shopify/client";

type ShopifyOrderNode = {
  id: string;
  name: string;
  displayFinancialStatus: string;
  displayFulfillmentStatus: string;
};

const FIND_ORDER = `
  query FindOrderByName($query: String!) {
    orders(first: 1, query: $query) {
      nodes {
        id
        name
        displayFinancialStatus
        displayFulfillmentStatus
      }
    }
  }
`;

export async function findOrderByNumber(client: ShopifyClient, orderNumber: string) {
  const cleanNumber = orderNumber.replace(/^#/, "");
  const data = await shopifyGraphql<{ orders: { nodes: ShopifyOrderNode[] } }>(client, FIND_ORDER, {
    query: `name:#${cleanNumber}`
  });

  return data.orders.nodes[0] ?? null;
}

export function nextActionForOrder(order: ShopifyOrderNode | null) {
  if (!order) {
    return { action: "IGNORE" as const, result: "SKIPPED" as const, message: "Order was not found in Shopify" };
  }

  if (["PAID", "PARTIALLY_REFUNDED", "REFUNDED"].includes(order.displayFinancialStatus)) {
    return { action: "SKIP" as const, result: "SKIPPED" as const, message: "Order is already paid" };
  }

  return { action: "MARK_PAID" as const, result: "PENDING" as const, message: "Ready to mark as paid" };
}
