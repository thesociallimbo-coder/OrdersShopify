import Link from "next/link";
import { Card } from "@/components/Card";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export default async function DashboardPage() {
  const user = await requireUser();
  const store = user.store;
  const uploads = store
    ? await prisma.upload.findMany({ where: { storeId: store.id }, orderBy: { uploadedAt: "desc" }, take: 5 })
    : [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const ordersProcessedToday = store
    ? await prisma.processedOrder.count({
        where: { upload: { storeId: store.id }, createdAt: { gte: today } }
      })
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Review uploads, Shopify status, and recent reconciliation activity.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="text-sm text-gray-500">Connected Store</div>
          <div className="mt-2 text-lg font-semibold">{store?.encryptedAccessToken ? store.shopDomain : "Not connected"}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Last Upload</div>
          <div className="mt-2 text-lg font-semibold">{uploads[0]?.filename ?? "No uploads"}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Orders Processed Today</div>
          <div className="mt-2 text-lg font-semibold">{ordersProcessedToday}</div>
        </Card>
      </div>
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Recent Uploads</h2>
          <Link className="text-sm font-medium text-accent" href="/upload">Upload PDF</Link>
        </div>
        <div className="divide-y divide-gray-200">
          {uploads.length ? uploads.map((upload) => (
            <Link key={upload.id} href={`/history/${upload.id}`} className="flex items-center justify-between py-3 text-sm">
              <span>{upload.filename}</span>
              <span className="text-gray-500">{upload.status}</span>
            </Link>
          )) : <p className="text-sm text-gray-500">No uploads yet.</p>}
        </div>
      </Card>
    </div>
  );
}
