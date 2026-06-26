import { prisma } from "@/lib/db/prisma";
import { decryptSecret } from "@/lib/encryption";
import { findOrderByNumber, nextActionForOrder } from "@/lib/shopify/orders";

export async function buildUploadPreview(storeId: string, orderNumbers: string[], filename: string) {
  const store = await prisma.store.findUniqueOrThrow({ where: { id: storeId } });
  if (!store.encryptedAccessToken) {
    throw new Error("Connect Shopify before uploading reports");
  }

  const upload = await prisma.upload.create({
    data: {
      storeId,
      filename,
      status: "PROCESSING",
      ordersFound: orderNumbers.length
    }
  });

  const client = {
    shop: store.shopDomain,
    accessToken: decryptSecret(store.encryptedAccessToken)
  };

  for (const orderNumber of orderNumbers) {
    try {
      const shopifyOrder = await findOrderByNumber(client, orderNumber);
      const decision = nextActionForOrder(shopifyOrder);

      await prisma.processedOrder.create({
        data: {
          uploadId: upload.id,
          orderNumber,
          shopifyOrderId: shopifyOrder?.id,
          shopifyStatus: shopifyOrder?.displayFulfillmentStatus,
          paymentStatus: shopifyOrder?.displayFinancialStatus,
          action: decision.action,
          result: decision.result,
          message: decision.message
        }
      });
    } catch (error) {
      await prisma.processedOrder.create({
        data: {
          uploadId: upload.id,
          orderNumber,
          action: "IGNORE",
          result: "FAILED",
          message: error instanceof Error ? error.message : "Failed to search Shopify"
        }
      });
    }
  }

  const [skipped, failed] = await Promise.all([
    prisma.processedOrder.count({ where: { uploadId: upload.id, result: "SKIPPED" } }),
    prisma.processedOrder.count({ where: { uploadId: upload.id, result: "FAILED" } })
  ]);

  await prisma.upload.update({
    where: { id: upload.id },
    data: {
      status: "PREVIEW_READY",
      processedAt: new Date(),
      ordersSkipped: skipped,
      ordersFailed: failed
    }
  });

  return upload.id;
}
