import { NextResponse } from "next/server";
import { z } from "zod";
import { rejectCrossOrigin } from "@/lib/auth/csrf";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { decryptSecret } from "@/lib/encryption";
import { markOrderAsPaid } from "@/lib/shopify/payments";

const schema = z.object({
  processedOrderIds: z.array(z.string()).min(1)
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const csrfError = rejectCrossOrigin(request);
  if (csrfError) return csrfError;

  const user = await requireUser();
  const { id } = await context.params;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Select at least one order" }, { status: 400 });
  }

  const upload = await prisma.upload.findFirst({
    where: { id, store: { userId: user.id } },
    include: { store: true }
  });

  if (!upload?.store.encryptedAccessToken) {
    return NextResponse.json({ error: "Upload or Shopify connection was not found" }, { status: 404 });
  }

  const orders = await prisma.processedOrder.findMany({
    where: {
      id: { in: parsed.data.processedOrderIds },
      uploadId: upload.id,
      action: "MARK_PAID",
      result: "PENDING",
      shopifyOrderId: { not: null }
    }
  });

  const client = {
    shop: upload.store.shopDomain,
    accessToken: decryptSecret(upload.store.encryptedAccessToken)
  };

  for (const order of orders) {
    try {
      await markOrderAsPaid(client, order.shopifyOrderId as string);
      await prisma.processedOrder.update({
        where: { id: order.id },
        data: { result: "SUCCESS", message: "Marked paid in Shopify" }
      });
      await prisma.auditLog.create({
        data: { userId: user.id, action: "shopify.order_marked_paid", metadata: { orderNumber: order.orderNumber } }
      });
    } catch (error) {
      await prisma.processedOrder.update({
        where: { id: order.id },
        data: { result: "FAILED", message: error instanceof Error ? error.message : "Shopify update failed" }
      });
      await prisma.auditLog.create({
        data: { userId: user.id, action: "shopify.order_mark_paid_failed", metadata: { orderNumber: order.orderNumber } }
      });
    }
  }

  const [updated, skipped, failed] = await Promise.all([
    prisma.processedOrder.count({ where: { uploadId: upload.id, result: "SUCCESS" } }),
    prisma.processedOrder.count({ where: { uploadId: upload.id, result: "SKIPPED" } }),
    prisma.processedOrder.count({ where: { uploadId: upload.id, result: "FAILED" } })
  ]);

  await prisma.upload.update({
    where: { id: upload.id },
    data: {
      status: "COMPLETED",
      ordersUpdated: updated,
      ordersSkipped: skipped,
      ordersFailed: failed
    }
  });

  return NextResponse.json({ ok: true });
}
