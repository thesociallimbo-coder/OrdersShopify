import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyWebhookHmac } from "@/lib/shopify/webhooks";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const isValid = verifyWebhookHmac(rawBody, request.headers.get("x-shopify-hmac-sha256"));
  if (!isValid) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
  }

  const topic = request.headers.get("x-shopify-topic");
  const shop = request.headers.get("x-shopify-shop-domain");

  if (topic === "app/uninstalled" && shop) {
    const store = await prisma.store.update({
      where: { shopDomain: shop },
      data: { encryptedAccessToken: null, disconnectedAt: new Date() }
    }).catch(() => null);

    if (store) {
      await prisma.auditLog.create({
        data: { userId: store.userId, action: "shopify.app_uninstalled", metadata: { shop } }
      });
    }
  }

  return NextResponse.json({ ok: true });
}
