import crypto from "crypto";
import { getShopifyConfig } from "@/lib/shopify/client";
import { shopifyGraphql } from "@/lib/shopify/graphql";
import type { ShopifyClient } from "@/lib/shopify/client";

const WEBHOOK_SUBSCRIPTION_CREATE = `
  mutation CreateWebhook($topic: WebhookSubscriptionTopic!, $callbackUrl: String!) {
    webhookSubscriptionCreate(topic: $topic, webhookSubscription: {
      uri: $callbackUrl,
      format: JSON
    }) {
      webhookSubscription {
        id
      }
      userErrors {
        message
      }
    }
  }
`;

export async function registerWebhooks(client: ShopifyClient) {
  const { appUrl } = getShopifyConfig();
  const data = await shopifyGraphql<{
    webhookSubscriptionCreate: { userErrors: Array<{ message: string }> };
  }>(client, WEBHOOK_SUBSCRIPTION_CREATE, {
    topic: "APP_UNINSTALLED",
    callbackUrl: `${appUrl}/api/shopify/webhooks`
  });

  const error = data.webhookSubscriptionCreate.userErrors[0];
  if (error) {
    throw new Error(error.message);
  }
}

export function verifyWebhookHmac(rawBody: string, hmac: string | null) {
  if (!hmac) {
    return false;
  }

  const { apiSecret } = getShopifyConfig();
  const digest = crypto.createHmac("sha256", apiSecret).update(rawBody, "utf8").digest("base64");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmac));
}
