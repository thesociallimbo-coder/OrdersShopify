import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { encryptSecret } from "@/lib/encryption";
import { exchangeCodeForToken, verifyShopifyCallback } from "@/lib/shopify/oauth";
import { getShopInfo } from "@/lib/shopify/shop";
import { registerWebhooks } from "@/lib/shopify/webhooks";

export async function GET(request: Request) {
  const user = await requireUser();
  const url = new URL(request.url);
  const { shop, code } = await verifyShopifyCallback(url.searchParams);
  const token = await exchangeCodeForToken(shop, code);
  const shopInfo = await getShopInfo({ shop, accessToken: token.access_token });

  const store = await prisma.store.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      shopDomain: shop,
      shopifyShopId: shopInfo.shop.id,
      encryptedAccessToken: encryptSecret(token.access_token),
      installedAt: new Date(),
      lastConnectionCheck: new Date()
    },
    update: {
      shopDomain: shop,
      shopifyShopId: shopInfo.shop.id,
      encryptedAccessToken: encryptSecret(token.access_token),
      installedAt: new Date(),
      disconnectedAt: null,
      lastConnectionCheck: new Date()
    }
  });

  await prisma.auditLog.create({
    data: { userId: user.id, action: "shopify.connected", metadata: { shop } }
  });

  try {
    await registerWebhooks({ shop, accessToken: token.access_token });
  } catch (error) {
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "shopify.webhook_registration_failed",
        metadata: { storeId: store.id, message: error instanceof Error ? error.message : "Unknown error" }
      }
    });
  }

  redirect("/shopify");
}
