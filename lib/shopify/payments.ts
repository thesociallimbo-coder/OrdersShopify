import { shopifyGraphql } from "@/lib/shopify/graphql";
import type { ShopifyClient } from "@/lib/shopify/client";

const MARK_AS_PAID = `
  mutation MarkOrderAsPaid($input: OrderMarkAsPaidInput!) {
    orderMarkAsPaid(input: $input) {
      order {
        id
        displayFinancialStatus
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function markOrderAsPaid(client: ShopifyClient, orderId: string) {
  const data = await shopifyGraphql<{
    orderMarkAsPaid: {
      order: { id: string; displayFinancialStatus: string } | null;
      userErrors: Array<{ message: string }>;
    };
  }>(client, MARK_AS_PAID, { input: { id: orderId } });

  const error = data.orderMarkAsPaid.userErrors[0];
  if (error) {
    throw new Error(error.message);
  }

  return data.orderMarkAsPaid.order;
}
