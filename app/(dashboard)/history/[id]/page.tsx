import { notFound } from "next/navigation";
import { Card } from "@/components/Card";
import { CommitOrdersForm } from "@/components/CommitOrdersForm";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export default async function UploadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const upload = await prisma.upload.findFirst({
    where: { id, store: { userId: user.id } },
    include: { orders: { orderBy: { createdAt: "asc" } } }
  });

  if (!upload) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{upload.filename}</h1>
        <p className="mt-1 text-sm text-gray-600">Preview and confirm which Shopify orders should be marked paid.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <div className="text-sm text-gray-500">Found</div>
          <div className="mt-2 text-lg font-semibold">{upload.ordersFound}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Updated</div>
          <div className="mt-2 text-lg font-semibold">{upload.ordersUpdated}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Skipped</div>
          <div className="mt-2 text-lg font-semibold">{upload.ordersSkipped}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Failed</div>
          <div className="mt-2 text-lg font-semibold">{upload.ordersFailed}</div>
        </Card>
      </div>
      <Card>
        <CommitOrdersForm
          uploadId={upload.id}
          orders={upload.orders.map((order) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            action: order.action,
            result: order.result,
            shopifyStatus: order.shopifyStatus,
            paymentStatus: order.paymentStatus,
            message: order.message
          }))}
        />
      </Card>
    </div>
  );
}
